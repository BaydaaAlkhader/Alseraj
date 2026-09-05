const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const authenticateToken = require("../middleware/auth");

// 4. جلب آخر قراءة للمستخدم الحالي فقط
router.get("/user/last-read", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    res.status(200).json({
      lastReadPage: currentUser.lastReadPage || 1,
      lastReadSurah: currentUser.lastReadSurah || "الفاتحة",
    });
  } catch (error) {
    console.error("خطأ في جلب بيانات القراءة:", error);
    res.status(500).json({ error: "حدث خطأ في جلب بيانات القراءة" });
  }
});

// 5. تحديث آخر قراءة للمستخدم الحالي فقط
router.put("/user/last-read", authenticateToken, async (req, res) => {
  try {
    const { page, surah } = req.body;

    if (typeof page !== "number" || page < 1 || !surah) {
      return res
        .status(400)
        .json({ error: "يرجى إرسال رقم صفحة صحيح واسم السورة" });
    }

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    currentUser.lastReadPage = page;
    currentUser.lastReadSurah = surah;

    const todayEntry = currentUser.getOrCreateTodayActivity();
    todayEntry.quranDone = true;
    todayEntry.quranPagesRead = (todayEntry.quranPagesRead || 0) + 1;
    currentUser.recalculateActivityLevel(todayEntry.date);

    await currentUser.save();

    res.status(200).json({ message: "تم تحديث موضع القراءة بنجاح" });
  } catch (error) {
    console.error("خطأ أثناء حفظ موضع القراءة:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حفظ موضع القراءة" });
  }
});

// 6. جلب المفضلة
router.get("/favorites", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }
    res.status(200).json(currentUser.favorites || []);
  } catch (error) {
    console.error("خطأ في جلب المفضلة:", error);
    res.status(500).json({ error: "حدث خطأ في جلب المفضلة" });
  }
});

// 7. إضافة/إزالة من المفضلة (Toggle)
router.post("/favorites/toggle", authenticateToken, async (req, res) => {
  try {
    const { surahNumber, surahName, ayahNumber, ayahText, pageNumber } =
      req.body;

    
    if (
      typeof surahNumber !== "number" ||
      typeof ayahNumber !== "number" ||
      !surahName
    ) {
      return res.status(400).json({ error: "بيانات الآية غير صحيحة" });
    }

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    if (!currentUser.favorites) {
      currentUser.favorites = [];
    }

    const index = currentUser.favorites.findIndex(
      (f) => f.surahNumber === surahNumber && f.ayahNumber === ayahNumber,
    );

    if (index > -1) {
      currentUser.favorites.splice(index, 1);
    } else {
      currentUser.favorites.push({
        surahNumber,
        surahName,
        ayahNumber,
        ayahText,
        pageNumber,
      });
    }

    await currentUser.save();
    res.status(200).json({ success: true, favorites: currentUser.favorites });
  } catch (error) {
    console.error("خطأ في تعديل المفضلة:", error);
    res.status(500).json({ error: "حدث خطأ في تعديل المفضلة" });
  }
});

// التدبرات
router.get("/reflections", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser)
      return res.status(404).json({ error: "المستخدم غير موجود" });
    res.status(200).json(currentUser.reflections || []);
  } catch (error) {
    res.status(500).json({ error: "خطأ في جلب التدبرات" });
  }
});

router.post("/reflections", authenticateToken, async (req, res) => {
  try {
    const { surahNumber, surahName, ayahNumber, ayahText, pageNumber, note } =
      req.body;

    if (
      typeof surahNumber !== "number" ||
      typeof ayahNumber !== "number" ||
      !surahName
    ) {
      return res.status(400).json({ error: "بيانات الآية غير صحيحة" });
    }

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser)
      return res.status(404).json({ error: "المستخدم غير موجود" });
    if (!currentUser.reflections) currentUser.reflections = [];

    const index = currentUser.reflections.findIndex(
      (r) => r.surahNumber === surahNumber && r.ayahNumber === ayahNumber,
    );

    const trimmedNote = (note || "").trim();

    if (index > -1) {
      if (!trimmedNote) {
        currentUser.reflections.splice(index, 1);
      } else {
        currentUser.reflections[index].note = trimmedNote;
        currentUser.reflections[index].updatedAt = new Date();
      }
    } else if (trimmedNote) {
      currentUser.reflections.push({
        surahNumber,
        surahName,
        ayahNumber,
        ayahText,
        pageNumber,
        note: trimmedNote,
      });
    }

    await currentUser.save();
    res
      .status(200)
      .json({ success: true, reflections: currentUser.reflections });
  } catch (error) {
    console.error("خطأ في حفظ التدبر:", error);
    res.status(500).json({ error: "خطأ في حفظ التدبر" });
  }
});

// حذف تدبر محدد
router.delete("/reflections", authenticateToken, async (req, res) => {
  try {
    const { surahNumber, ayahNumber } = req.body;

    if (typeof surahNumber !== "number" || typeof ayahNumber !== "number") {
      return res.status(400).json({ error: "بيانات الآية غير صحيحة" });
    }

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser)
      return res.status(404).json({ error: "المستخدم غير موجود" });
    if (!currentUser.reflections) currentUser.reflections = [];

    currentUser.reflections = currentUser.reflections.filter(
      (r) => !(r.surahNumber === surahNumber && r.ayahNumber === ayahNumber),
    );

    await currentUser.save();
    res
      .status(200)
      .json({ success: true, reflections: currentUser.reflections });
  } catch (error) {
    console.error("خطأ في حذف التدبر:", error);
    res.status(500).json({ error: "خطأ في حذف التدبر" });
  }
});

module.exports = router;