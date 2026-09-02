const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGO_URL) {
    throw new Error(
      "متغير البيئة MONGO_URL غير معرف. أضفه في ملف .env قبل تشغيل السيرفر (راجع .env.example).",
    );
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // فشل الاتصال بقاعدة البيانات عطل حرج — لا فائدة من تشغيل سيرفر بلا قاعدة بيانات
    process.exit(1);
  }
}

module.exports = connectDB;
