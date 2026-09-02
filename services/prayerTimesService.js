async function fetchPrayerTimesFromAPI(latitude, longitude) {
  const timestamp = Math.floor(Date.now() / 1000);
  const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=3`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("فشل الاتصال بخدمة مواقيت الصلاة");
  }

  const data = await response.json();
  const timings = data.data.timings;
  const timezone = data.data.meta.timezone;

  // دالة لتنظيف النص واستخراج الوقت HH:MM فقط دون أي زيادات نصية
  const cleanTime = (t) => (t ? t.split(" ")[0] : "");

  return {
    fajr: cleanTime(timings.Fajr),
    dhuhr: cleanTime(timings.Dhuhr),
    asr: cleanTime(timings.Asr),
    maghrib: cleanTime(timings.Maghrib),
    isha: cleanTime(timings.Isha),
    timezone,
  };
}

module.exports = { fetchPrayerTimesFromAPI };
