

// حساب تاريخ اليوم بصيغة YYYY-MM-DD مع تصفير الأذكار الساعة 6 صباحاً
function getTodayStr() {
  const now = new Date();
  const currentHour = now.getHours();

  // إذا كانت الساعة أقل من 6 صباحاً، نعتبر المستخدم تابعاً لليوم السابق
  if (currentHour < 6) {
    now.setDate(now.getDate() - 1);
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentTimeInTimezone(timezone) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

module.exports = { getTodayStr, getCurrentTimeInTimezone };
