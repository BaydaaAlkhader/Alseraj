const mongoose = require('mongoose');
const { Schema } = mongoose;
const { getTodayStr } = require('../utils/date');

/* ============================================================
   Sub-schemas
   ============================================================ */

// آية محفوظة في المفضلة
const favoriteSchema = new Schema(
  {
    surahNumber: { type: Number, required: true },
    surahName: { type: String, required: true },
    ayahNumber: { type: Number, required: true },
    ayahText: { type: String },
    pageNumber: { type: Number },
  },
  { _id: false }
);

// تدبر آية
const reflectionSchema = new Schema(
  {
    surahNumber: { type: Number, required: true },
    surahName: { type: String, required: true },
    ayahNumber: { type: Number, required: true },
    ayahText: { type: String },
    pageNumber: { type: Number },
    note: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// تقدم المستخدم داخل درس/مسار تعليمي معيّن
const courseProgressSchema = new Schema(
  {
    courseId: { type: String, required: true },
    completedLessons: { type: Number, default: 0 },
    totalLessons: { type: Number },
    lastLesson: { type: String },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// تقدم الأذكار ليوم واحد
const athkarDaySchema = new Schema(
  {
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    morning: {
      done: { type: Boolean, default: false },
      completedCount: { type: Number, default: 0 },
      totalCount: { type: Number, default: 0 },
    },
    evening: {
      done: { type: Boolean, default: false },
      completedCount: { type: Number, default: 0 },
      totalCount: { type: Number, default: 0 },
    },
    // prayers: {
    //   fajr: { type: Boolean, default: false },
    //   dhuhr: { type: Boolean, default: false },
    //   asr: { type: Boolean, default: false },
    //   maghrib: { type: Boolean, default: false },
    //   isha: { type: Boolean, default: false },
    // },
  },
  { _id: false }
);

// سجل تأكيد قراءة سورة الكهف يوم جمعة معيّن
const kahfReadingSchema = new Schema(
  {
    date: { type: String, required: true }, // تاريخ الجمعة 'YYYY-MM-DD'
    readAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// سجل النشاط اليومي — خريطة "أيام الإنجاز"
const dailyActivitySchema = new Schema(
  {
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    quranDone: { type: Boolean, default: false },
    quranPagesRead: { type: Number, default: 0 },
    athkarDone: { type: Boolean, default: false },
    lessonDone: { type: Boolean, default: false },
    kahfDone: { type: Boolean, default: false },
    level: { type: Number, default: 0, min: 0, max: 3 },
  },
  { _id: false }
);

/* ============================================================
   Main User schema
   ============================================================ */

const userSchema = new Schema(
  {
    // ---------- الحساب ----------
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    otpCode: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },

    // ---------- القرآن ----------
    lastReadPage: { type: Number, default: 1 },
    lastReadSurah: { type: String, default: 'الفاتحة' },
    favorites: [favoriteSchema],
    reflections: [reflectionSchema],

    // ---------- الأذكار ----------
    athkarHistory: [athkarDaySchema],
    athkarStreak: { type: Number, default: 0 },

    // ---------- الدروس ----------
    courseProgress: [courseProgressSchema],

    // ---------- سورة الكهف ----------
    kahfReadings: [kahfReadingSchema],

    // ---------- خريطة أيام الإنجاز ----------
    dailyActivity: [dailyActivitySchema],

    // ---------- موقع المستخدم ومواقيت الصلاة ----------
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      timezone: { type: String },
      cachedTimings: {
        date: { type: String },
        fajr: { type: String },
        dhuhr: { type: String },
        asr: { type: String },
        maghrib: { type: String },
        isha: { type: String },
      },
    },
  },
  { timestamps: true }
);

userSchema.index({ 'dailyActivity.date': 1 });

/* ============================================================
   Helper methods
   ============================================================ */

// جلب سجل نشاط اليوم الحالي، أو إنشاؤه إذا مش موجود
// (تستخدم الآن getTodayStr() الموحّدة من utils/date.js بدل نسخة مكررة محلياً،
//  لضمان تطابق منطق تصفير الساعة 6 صباحاً مع بقية أجزاء السيرفر دائماً)
userSchema.methods.getOrCreateTodayActivity = function () {
  const date = getTodayStr();
  let entry = this.dailyActivity.find((d) => d.date === date);
  if (!entry) {
    this.dailyActivity.push({ date });
    entry = this.dailyActivity[this.dailyActivity.length - 1];
  }
  return entry;
};

// إعادة حساب مستوى الإنجاز
userSchema.methods.recalculateActivityLevel = function (date) {
  const entry = this.dailyActivity.find((d) => d.date === date);
  if (!entry) return;
  const doneCount = [
    entry.quranDone,
    entry.athkarDone,
    entry.lessonDone,
    entry.kahfDone,
  ].filter(Boolean).length;
  entry.level = Math.min(doneCount, 3);
};

module.exports = mongoose.model('User', userSchema);