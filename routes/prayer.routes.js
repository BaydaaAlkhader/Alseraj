const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const authenticateToken = require("../middleware/auth");
const { getTodayStr } = require("../utils/date");
const { fetchPrayerTimesFromAPI } = require("../services/prayerTimesService");

router.get("/prayer-times", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    if (
      !currentUser.location ||
      !currentUser.location.latitude ||
      !currentUser.location.longitude
    ) {
      return res.status(400).json({
        error: "لم يتم تحديد موقعك بعد، يرجى السماح بالوصول للموقع أولاً",
      });
    }

    const todayStr = getTodayStr();
    const cached = currentUser.location.cachedTimings;

    if (cached && cached.date === todayStr) {
      return res.status(200).json({
        success: true,
        timezone: currentUser.location.timezone,
        timings: {
          fajr: cached.fajr,
          dhuhr: cached.dhuhr,
          asr: cached.asr,
          maghrib: cached.maghrib,
          isha: cached.isha,
        },
        cached: true,
      });
    }

    const timings = await fetchPrayerTimesFromAPI(
      currentUser.location.latitude,
      currentUser.location.longitude,
    );

    currentUser.location.timezone = timings.timezone;
    currentUser.location.cachedTimings = {
      date: todayStr,
      fajr: timings.fajr,
      dhuhr: timings.dhuhr,
      asr: timings.asr,
      maghrib: timings.maghrib,
      isha: timings.isha,
    };
    await currentUser.save();

    res.status(200).json({
      success: true,
      timezone: timings.timezone,
      timings: {
        fajr: timings.fajr,
        dhuhr: timings.dhuhr,
        asr: timings.asr,
        maghrib: timings.maghrib,
        isha: timings.isha,
      },
      cached: false,
    });
  } catch (error) {
    console.error("خطأ في جلب مواقيت الصلاة:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب مواقيت الصلاة" });
  }
});

module.exports = router;
