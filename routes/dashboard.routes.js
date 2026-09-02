const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const authenticateToken = require("../middleware/auth");
const { getTodayStr } = require("../utils/date");
const { TOTAL_QURAN_PAGES, TOTAL_APP_LESSONS } = require("../utils/constants");

router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    const todayStr = getTodayStr();

    // نسبة القرآن التراكمية المستمرة
    const savedPage = currentUser.lastReadPage || 1;
    const savedSurah = currentUser.lastReadSurah || "الفاتحة";
    const quranPercent = Math.min(
      100,
      Math.round((savedPage / TOTAL_QURAN_PAGES) * 100),
    );

    // نسبة الأذكار اليومية
    const todayAthkar = currentUser.athkarHistory.find(
      (a) => a.date === todayStr,
    );
    const athkarPercent = todayAthkar
      ? todayAthkar.morning.completedCount || 0
      : 0;

    // نسبة الدروس التراكمية
    let completedLessonsCount = 0;
    if (currentUser.courseProgress && currentUser.courseProgress.length > 0) {
      currentUser.courseProgress.forEach((c) => {
        completedLessonsCount += c.completedLessons || 0;
      });
    }
    const lessonsPercent =
      TOTAL_APP_LESSONS > 0
        ? Math.round((completedLessonsCount / TOTAL_APP_LESSONS) * 100)
        : 0;

    const lessonsCourses = currentUser.courseProgress.map((c) => ({
      courseId: c.courseId,
      completedLessons: c.completedLessons,
      totalLessons: c.totalLessons || null,
      percent: c.totalLessons
        ? Math.round((c.completedLessons / c.totalLessons) * 100)
        : null,
      lastLesson: c.lastLesson,
      updatedAt: c.updatedAt,
    }));

    const lastActiveCourse =
      [...currentUser.courseProgress].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      )[0] || null;

    const todayActivity = currentUser.dailyActivity.find(
      (d) => d.date === todayStr,
    ) || {
      date: todayStr,
      quranDone: false,
      athkarDone: false,
      lessonDone: false,
      kahfDone: false,
      level: 0,
    };

    res.status(200).json({
      success: true,
      name: currentUser.name,
      quran: {
        percent: quranPercent,
        lastReadPage: savedPage,
        lastReadSurah: savedSurah,
      },
      athkar: {
        percent: athkarPercent,
      },
      lessons: {
        percent: lessonsPercent,
        completedLessonsCount: completedLessonsCount,
        courses: lessonsCourses,
        continueLesson: lastActiveCourse
          ? {
              courseId: lastActiveCourse.courseId,
              lastLesson: lastActiveCourse.lastLesson,
            }
          : null,
      },
      todayActivity,
    });
  } catch (error) {
    console.error("خطأ في جلب بيانات الـ Dashboard:", error);
    res.status(500).json({ error: "حدث خطأ في جلب بيانات لوحة التحكم" });
  }
});

// خريطة أيام الإنجاز
router.get("/activity/calendar", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    const yearPrefix = String(year);

    const days = currentUser.dailyActivity
      .filter((d) => d.date.startsWith(yearPrefix))
      .map((d) => ({
        date: d.date,
        level: d.level,
        quranDone: d.quranDone,
        athkarDone: d.athkarDone,
        lessonDone: d.lessonDone,
        kahfDone: d.kahfDone,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const activityByDate = new Map(
      currentUser.dailyActivity.map((d) => [d.date, d.level]),
    );
    let currentStreak = 0;
    const cursor = new Date();

    const todayStr = getTodayStr();
    if (!(activityByDate.get(todayStr) > 0)) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (true) {
      const cYear = cursor.getFullYear();
      const cMonth = String(cursor.getMonth() + 1).padStart(2, "0");
      const cDay = String(cursor.getDate()).padStart(2, "0");
      const dateStr = `${cYear}-${cMonth}-${cDay}`;

      const level = activityByDate.get(dateStr);
      if (level && level > 0) {
        currentStreak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    res.status(200).json({
      success: true,
      year,
      days,
      totalActiveDays: days.filter((d) => d.level > 0).length,
      currentStreak,
    });
  } catch (error) {
    console.error("خطأ في جلب خريطة الإنجاز:", error);
    res.status(500).json({ error: "حدث خطأ في جلب خريطة أيام الإنجاز" });
  }
});

module.exports = router;
