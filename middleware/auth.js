const jwt = require("jsonwebtoken");


if (!process.env.JWT_SECRET) {
  throw new Error(
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
