const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

app.set("trust proxy", 1);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Alseraj.html"));
});

app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/quran.routes"));
app.use("/api", require("./routes/user.routes"));
app.use("/api", require("./routes/athkar.routes"));
app.use("/api", require("./routes/dashboard.routes"));
app.use("/api", require("./routes/kahf.routes"));
app.use("/api", require("./routes/prayer.routes"));

// إصلاح: معالج موحّد لأي مسار API غير موجود (لم يكن هناك أي 404 handler سابقاً)
app.use("/api", (req, res) => {
  res.status(404).json({ error: "المسار المطلوب غير موجود" });
});

// إصلاح: معالج أخطاء مركزي بدل الاعتماد فقط على try/catch متكرر بكل route
app.use((err, req, res, next) => {
  console.error("خطأ غير متوقع في السيرفر:", err);
  res.status(500).json({ error: "حدث خطأ غير متوقع في السيرفر" });
});

// إصلاح: استخدام process.env.PORT مع fallback بدل تثبيت المنفذ 3000 دائماً —
// منصات الاستضافة مثل Render/Heroku تحدد المنفذ عبر متغير بيئة PORT،
// وتثبيته يمنع السيرفر من العمل على تلك المنصات
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
