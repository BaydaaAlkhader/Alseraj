const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const authenticateToken = require("../middleware/auth");

// بيانات المستخدم
router.get("/user/me", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId).select(
      "name email",
    );
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }
    res.status(200).json({
      success: true,
      name: currentUser.name,
      email: currentUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ في جلب بيانات المستخدم" });
  }
});

// جلب تقدم الدروس للمستخدم الحالي فقط
router.get("/user/progress", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser)
      return res.status(404).json({ error: "المستخدم غير موجود" });

    res.json({ success: true, progress: currentUser.courseProgress || [] });
  } catch (err) {
    console.error("خطأ جلب التقدم:", err);
    res
      .status(500)
      .json({ success: false, message: "حدث خطأ في جلب البيانات" });
  }
});

// تحديث وزيادة تقدم الدروس للمستخدم الحالي فقط
router.post(
  "/user/progress/increment",
  authenticateToken,
  async (req, res) => {
    const { courseId, lessonTitle, totalLessons } = req.body;

    if (!courseId || !totalLessons) {
      return res.status(400).json({ error: "بيانات الدرس غير مكتملة" });
    }

    try {
      const currentUser = await User.findById(req.user.userId);
      if (!currentUser)
        return res.status(404).json({ error: "المستخدم غير موجود" });

      if (!currentUser.courseProgress) {
        currentUser.courseProgress = [];
      }

      let course = currentUser.courseProgress.find(
        (c) => c.courseId === courseId,
      );

      if (!course) {
        currentUser.courseProgress.push({
          courseId,
          completedLessons: 1,
          totalLessons,
          lastLesson: lessonTitle,
        });
      } else if (course.completedLessons < totalLessons) {
        course.completedLessons += 1;
        course.totalLessons = totalLessons;
        course.lastLesson = lessonTitle;
        course.updatedAt = Date.now();
      }

      const activityEntry = currentUser.getOrCreateTodayActivity();
      activityEntry.lessonDone = true;
      currentUser.recalculateActivityLevel(activityEntry.date);

      await currentUser.save();
      res.json({ success: true, progress: currentUser.courseProgress });
    } catch (err) {
      console.error("خطأ حفظ التقدم:", err);
      res
        .status(500)
        .json({ success: false, message: "حدث خطأ أثناء حفظ التقدم" });
    }
  },
);

// حفظ الموقع
router.post("/user/location", authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res
        .status(400)
        .json({ error: "يرجى إرسال إحداثيات صحيحة (latitude, longitude)" });
    }

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    currentUser.location = currentUser.location || {};
    currentUser.location.latitude = latitude;
    currentUser.location.longitude = longitude;
    currentUser.location.cachedTimings = undefined;

    await currentUser.save();
    res.status(200).json({ success: true, message: "تم حفظ موقعك بنجاح" });
  } catch (error) {
    console.error("خطأ في حفظ الموقع:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حفظ الموقع" });
  }
});

module.exports = router;
