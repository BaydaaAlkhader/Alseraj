const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const authenticateToken = require("../middleware/auth");
const { getTodayStr } = require("../utils/date");

router.get("/kahf/status", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    const now = new Date();
    const todayStr = getTodayStr();
    const isFriday = now.getDay() === 5;

    const alreadyRead = currentUser.kahfReadings.some(
      (k) => k.date === todayStr,
    );

    res
      .status(200)
      .json({ success: true, isFriday, date: todayStr, alreadyRead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ في التحقق من حالة سورة الكهف" });
  }
});

router.post("/kahf/confirm", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    const now = new Date();
    const todayStr = getTodayStr();

    if (now.getDay() !== 5) {
      return res
        .status(400)
        .json({ error: "تذكير سورة الكهف متاح فقط يوم الجمعة" });
    }

    const alreadyRead = currentUser.kahfReadings.some(
      (k) => k.date === todayStr,
    );
    if (alreadyRead) {
      return res
        .status(200)
        .json({ success: true, message: "تم تسجيل قراءتك مسبقًا لهذا اليوم" });
    }

    currentUser.kahfReadings.push({ date: todayStr });

    const activityEntry = currentUser.getOrCreateTodayActivity();
    activityEntry.kahfDone = true;
    currentUser.recalculateActivityLevel(todayStr);

    await currentUser.save();

    res.status(200).json({
      success: true,
      message: "بارك الله فيك، تم تسجيل قراءة سورة الكهف لهذا اليوم",
      level: activityEntry.level,
    });
  } catch (error) {
    console.error("خطأ في تأكيد قراءة سورة الكهف:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تسجيل قراءة سورة الكهف" });
  }
});

module.exports = router;
