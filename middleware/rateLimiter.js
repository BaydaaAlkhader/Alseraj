const rateLimit = require("express-rate-limit");

// يحد من محاولات تسجيل الدخول/التسجيل/OTP لمنع هجمات القوة الغاشمة (brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 20, // 20 محاولة كحد أقصى لكل IP خلال النافذة الزمنية
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "محاولات كثيرة جداً، يرجى المحاولة لاحقاً" },
});

module.exports = { authLimiter };
