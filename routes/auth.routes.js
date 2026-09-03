const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user.js");
// const transporter = require("../config/mailer");
// بدلاً من: const transporter = require("../config/mailer");
const { sendEmail } = require("../config/mailer");
const { authLimiter } = require("../middleware/rateLimiter");
const { OTP_EXPIRY_MINUTES } = require("../utils/constants");

// 1. إنشاء حساب جديد
router.post("/register", authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "يرجى تعبئة جميع الحقول" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ error: "صيغة البريد الإلكتروني غير صحيحة" });
    }

    // إصلاح: التحقق من قوة كلمة المرور (لم يكن هناك أي تحقق سابقاً)
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "البريد الإلكتروني مُسجل بالفعل" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otpCode: otp,
      // إصلاح: رمز OTP الآن له صلاحية محدودة بدل أن يبقى صالحاً للأبد
      otpExpires: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      isVerified: false,
    });
    await newUser.save();

    try {
      await sendEmail({
    to: email,
    subject: "رمز تفعيل حسابك في السراج",
    text: `رمز التفعيل الخاص بك هو: ${otp} (صالح لمدة ${OTP_EXPIRY_MINUTES} دقائق)`,
  });
    } catch (mailError) {
      // إصلاح: الحساب أُنشئ فعلاً، لا نخفي على المستخدم فشل إرسال البريد
      console.error("فشل إرسال بريد التفعيل:", mailError);
      return res.status(201).json({
        message:
          "تم إنشاء الحساب لكن تعذر إرسال بريد التفعيل، حاول طلب رمز جديد لاحقاً",
      });
    }

    res
      .status(201)
      .json({ message: "تم إرسال رمز التفعيل إلى بريدك الإلكتروني" });
  } catch (error) {
    console.error("خطأ في التسجيل:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء الحساب" });
  }
});

// 2. تأكيد الرمز OTP
router.post("/verify-otp", authLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userToVerify = await User.findOne({ email });

    if (!userToVerify || userToVerify.otpCode !== otp) {
      return res.status(400).json({ error: "رمز التفعيل غير صحيح" });
    }

    // إصلاح: رفض الرموز منتهية الصلاحية
    if (!userToVerify.otpExpires || userToVerify.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ error: "انتهت صلاحية رمز التفعيل، يرجى طلب رمز جديد" });
    }

    userToVerify.isVerified = true;
    userToVerify.otpCode = undefined;
    userToVerify.otpExpires = undefined;
    await userToVerify.save();

    res.status(200).json({ message: "تم تأكيد الحساب بنجاح!" });
  } catch (error) {
    console.error("خطأ في تأكيد الحساب:", error);
    res.status(500).json({ error: "حدث خطأ أثناء التأكيد" });
  }
});

// 3. مسار تسجيل الدخول
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "يرجى إدخال البريد الإلكتروني وكلمة المرور" });
    }

    const userLogin = await User.findOne({ email });

    // إصلاح: رسالة خطأ موحّدة لعدم وجود الحساب/خطأ كلمة المرور،
    // لمنع مهاجم من معرفة أي إيميلات مسجّلة فعلاً في النظام (user enumeration)
    const invalidCredentialsError = {
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    };

    if (!userLogin) {
      return res.status(400).json(invalidCredentialsError);
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);
    if (!isMatch) {
      return res.status(400).json(invalidCredentialsError);
    }

    // إصلاح حرج: منع تسجيل الدخول قبل تفعيل الحساب عبر OTP
    // (كانت هذه الخطوة موجودة بالتسجيل لكن لا أحد يتحقق منها عند الدخول)
    if (!userLogin.isVerified) {
      return res.status(403).json({
        error: "يرجى تفعيل حسابك عبر رمز OTP المرسل لبريدك أولاً",
      });
    }

    const token = jwt.sign(
      { userId: userLogin._id, email: userLogin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      token: token,
      name: userLogin.name,
      userId: userLogin._id,
    });
  } catch (error) {
    console.error("خطأ في تسجيل الدخول:", error);
    res.status(500).json({ error: "حدث خطأ في السيرفر" });
  }
});

module.exports = router;
