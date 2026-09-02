const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const authenticateToken = require("../middleware/auth");
const { getTodayStr, getCurrentTimeInTimezone } = require("../utils/date");

// تقدم أذكار اليوم
router.get("/athkar/today", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    const todayStr = getTodayStr();
    const todayAthkar = currentUser.athkarHistory.find(
      (a) => a.date === todayStr,
    ) || {
      date: todayStr,
      morning: { done: false, completedCount: 0, totalCount: 0 },
      evening: { done: false, completedCount: 0, totalCount: 0 },
    };

    res.status(200).json({
      success: true,
      athkar: todayAthkar,
      streak: currentUser.athkarStreak,
    });
  } catch (error) {
    console.error("خطأ في جلب بيانات الأذكار:", error);
    res.status(500).json({ error: "حدث خطأ في جلب بيانات الأذكار" });
  }
});

// تحديث وحفظ تقدم الأذكار
router.post(
  "/update-adhkar-progress",
  authenticateToken,
  async (req, res) => {
    try {
      const { percent, completedCount, totalCount } = req.body;

      const finalPercent =
        typeof percent === "number"
          ? percent
          : typeof completedCount === "number"
            ? completedCount
            : 0;

      if (finalPercent < 0 || finalPercent > 100) {
        return res
          .status(400)
          .json({ error: "يرجى إرسال نسبة مئوية صحيحة بين 0 و100" });
      }

      const currentUser = await User.findById(req.user.userId);
      if (!currentUser) {
        return res.status(404).json({ error: "المستخدم غير موجود" });
      }

      const todayStr = getTodayStr();
      let todayEntry = currentUser.athkarHistory.find(
        (a) => a.date === todayStr,
      );

      if (!todayEntry) {
        currentUser.athkarHistory.push({ date: todayStr });
        todayEntry =
          currentUser.athkarHistory[currentUser.athkarHistory.length - 1];
      }

      todayEntry.percent = finalPercent;
      todayEntry.completedCount =
        typeof completedCount === "number" ? completedCount : finalPercent;
      todayEntry.totalCount = totalCount || 100;
      todayEntry.morning.completedCount = finalPercent;
      todayEntry.morning.totalCount = 100;
      todayEntry.morning.done = finalPercent >= 100;

      const activityEntry = currentUser.getOrCreateTodayActivity();
      activityEntry.athkarDone = finalPercent > 0;
      currentUser.recalculateActivityLevel(todayStr);

      await currentUser.save();
      res.status(200).json({
        success: true,
        message: "تمت مزامنة وحفظ تقدم الأذكار في قاعدة البيانات بنجاح",
      });
    } catch (error) {
      console.error("خطأ في تحديث الأذكار بالسيرفر:", error);
      res
        .status(500)
        .json({ error: "حدث خطأ داخل خادم السيرفر أثناء تحديث تقدم الأذكار" });
    }
  },
);

router.get("/athkar/prayers/status", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    if (!currentUser.location || !currentUser.location.cachedTimings) {
      return res
        .status(400)
        .json({ error: "يرجى جلب مواقيت الصلاة أولاً عبر /api/prayer-times" });
    }

    const todayStr = getTodayStr();
    const timings = currentUser.location.cachedTimings;
    const timezone = currentUser.location.timezone || "UTC";

    if (timings.date !== todayStr) {
      return res.status(400).json({
        error:
          "مواقيت الصلاة المخزّنة قديمة، يرجى إعادة جلبها عبر /api/prayer-times",
      });
    }

    const currentTime = getCurrentTimeInTimezone(timezone);
    const todayAthkar = currentUser.athkarHistory.find(
      (a) => a.date === todayStr,
    );
    const doneMap = todayAthkar ? todayAthkar.prayers : {};

    const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"].map(
      (name) => ({
        name,
        time: timings[name],
        unlocked: currentTime >= timings[name],
        done: !!(doneMap && doneMap[name]),
      }),
    );

    res.status(200).json({ success: true, currentTime, prayers });
  } catch (error) {
    console.error("خطأ في جلب حالة أذكار الصلوات:", error);
    res.status(500).json({ error: "حدث خطأ في جلب حالة أذكار الصلوات" });
  }
});

router.post("/athkar/prayers/update", authenticateToken, async (req, res) => {
  try {
    const { prayer } = req.body;
    const validPrayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

    if (!validPrayers.includes(prayer)) {
      return res.status(400).json({ error: "اسم الصلاة غير صحيح" });
    }

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    if (!currentUser.location || !currentUser.location.cachedTimings) {
      return res
        .status(400)
        .json({ error: "يرجى جلب مواقيت الصلاة أولاً عبر /api/prayer-times" });
    }

    const todayStr = getTodayStr();
    const timings = currentUser.location.cachedTimings;
    const timezone = currentUser.location.timezone || "UTC";

    if (timings.date !== todayStr) {
      return res.status(400).json({
        error:
          "مواقيت الصلاة المخزّنة قديمة، يرجى إعادة جلبها عبر /api/prayer-times",
      });
    }

    const currentTime = getCurrentTimeInTimezone(timezone);
    if (currentTime < timings[prayer]) {
      return res.status(400).json({ error: "لم يدخل وقت هذه الصلاة بعد" });
    }

    let todayEntry = currentUser.athkarHistory.find(
      (a) => a.date === todayStr,
    );
    if (!todayEntry) {
      currentUser.athkarHistory.push({ date: todayStr });
      todayEntry =
        currentUser.athkarHistory[currentUser.athkarHistory.length - 1];
    }

    if (!todayEntry.prayers) {
      todayEntry.prayers = {
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
      };
    }
    todayEntry.prayers[prayer] = true;

    await currentUser.save();
    res
      .status(200)
      .json({ success: true, prayer, message: "تم تسجيل أذكار الصلاة بنجاح" });
  } catch (error) {
    console.error("خطأ في تسجيل أذكار الصلاة:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تسجيل أذكار الصلاة" });
  }
});

module.exports = router;
