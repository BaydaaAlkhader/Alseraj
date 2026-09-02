const jwt = require("jsonwebtoken");

// إصلاح أمني حرج: لا نسمح إطلاقاً بمفتاح احتياطي مكتوب في الكود المصدري.
// لو JWT_SECRET غير معرف، نوقف تشغيل السيرفر فوراً بدل استخدام مفتاح ثابت
// معروف علناً لأي شخص يقرأ الكود على GitHub (كان "SecretKey123").
if (!process.env.JWT_SECRET) {
  throw new Error(
    "متغير البيئة JWT_SECRET غير معرف. عرّفه في ملف .env قبل تشغيل السيرفر (راجع .env.example). " +
      "لا يجوز تشغيل السيرفر بدونه لأسباب أمنية.",
  );
}

// Middleware للتحقق من التوكن
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "غير مصرح، يرجى تسجيل الدخول" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: "التوكن غير صالح أو منتهي الصلاحية" });
    }
    req.user = decodedUser;
    next();
  });
};

module.exports = authenticateToken;
