const nodemailer = require("nodemailer");
const dns = require("dns");

// إجبار استخدام IPv4 لمنع مشاكل الشبكة على Render
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // استخدام منفذ 587 بدلاً من 465
  secure: false, // يجب أن تكون false لـ STARTTLS عند استخدام المنفذ 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // يمنع حظر الاتصال في بيئة البرودكشن
  },
  connectionTimeout: 20000, // زيادة المهلة لـ 20 ثانية
  greetingTimeout: 20000,
});

module.exports = transporter;