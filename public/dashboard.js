/* =========================================================
   تهيئة وتشغيل الشاشة الرئيسية بالكامل عند التحميل
   ========================================================= */
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('userToken');
  const userName = localStorage.getItem('userName');

  // إذا لم يجد تذكر تسجيل الدخول، يعود فوراً لصفحة الدخول لمنع الثغرات
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // 1. تحديث اسم وصورة المستخدم في الشريط العلوي ديناميكياً
  updateUserUI(userName);

  // 2. بناء هيكل مربعات التقويم وأيام الأشهر في الواجهة أولاً
  buildCalendar();

  // 3. جلب وتحديث كافة نسب لوحة التحكم (القرآن، الأذكار، الدروس) من السيرفر دفعة واحدة
  await loadHomeDashboardData();

  // 4. التحقق من حالة سورة الكهف (إذا وافق اليوم جمعة) لإطلاق التذكير التفاعلي
  await checkFridayKahfStatus();

  // 5. تلوين مربعات الخريطة بالتدريج اللوني وغرس الشموس السعيدة في التقويم
  await renderActiveHeatmap();

  // 6. تفعيل أزرار التنقل السريع في الصفحة
  setupNavigation();

  // 7. تفعيل وإصلاح حدث زر تسجيل الخروج بشكل آمن ومنع التكرار
  const logoutButton = document.getElementById('logoutBtn');
  if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault(); // منع أي سلوك افتراضي قد يعطل المتصفح
      
      // تنظيف جلسة المستخدم بالكامل لمنع التداخل عند دخول حساب آخر
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
      sessionStorage.clear(); 
      
      // التوجيه لصفحة تسجيل الدخول فوراً
      window.location.href = 'login.html';
    });
  }
});

/* =========================================================
   دوال تحديث واجهة المستخدم والبيانات (UI & Core Logic)
   ========================================================= */

function updateUserUI(name) {
  const nameDisplay = document.getElementById('userNameDisplay');
  const avatarDisplay = document.getElementById('userAvatar');

  if (name && name !== 'null' && name !== 'undefined') {
    if (nameDisplay) nameDisplay.textContent = name;
    if (avatarDisplay) avatarDisplay.textContent = name.trim().charAt(0).toUpperCase();
  } else {
    if (nameDisplay) nameDisplay.textContent = 'مستخدم';
    if (avatarDisplay) avatarDisplay.textContent = 'م';
  }
}

// 1. تحديث لوحة التحكم الرئيسية بالكامل من الباك إند ومنع التضارب المحلي
async function loadHomeDashboardData() {
  const token = localStorage.getItem('userToken');
  if (!token) return;

  try {
    const response = await fetch('/api/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      
      // --- أ. تحديث نسبة القرآن الحقيقية (الصفحة الحالية من 604) ---
      const quranPercent = data.quran?.percent || 0;
      const lastSurah = data.quran?.lastReadSurah || 'الفاتحة';
      const lastPage = data.quran?.lastReadPage || 1;

      const quranPercentText = document.getElementById('quranPercent') || document.querySelector('.stat-card:nth-child(1) h3');
      const quranBar = document.getElementById('quranBar') || document.querySelector('.stat-card:nth-child(1) .progress-fill');
      const quranFooterText = document.getElementById('quranText') || document.querySelector('.stat-card:nth-child(1) .stat-footer');

      if (quranPercentText) quranPercentText.textContent = `${quranPercent}%`;
      if (quranBar) quranBar.style.width = `${quranPercent}%`;
      if (quranFooterText) quranFooterText.textContent = `${lastPage} صفحة مقروءة`;
      
      // تحديث كارت "تابع من حيث توقفت" السفلي الخاص بالمصحف الشريف
      if (document.getElementById('lastSurahName')) document.getElementById('lastSurahName').textContent = `سورة ${lastSurah}`;
      if (document.getElementById('lastPageInfo')) document.getElementById('lastPageInfo').textContent = `الصفحة ${lastPage} من 604`;
      if (document.getElementById('quranReadBar')) document.getElementById('quranReadBar').style.width = `${quranPercent}%`;

      // --- ب. تحديث نسبة الأذكار الحقيقية القادمة من قاعدة البيانات وسد الثغرة المحلية ---
            // --- ب. تحديث نسبة الأذكار الحقيقية القادمة من قاعدة البيانات (تم تحصين القراءة) ---
      // فحص كافة الاحتمالات والمسميات الممررة من السيرفر لضمان الإمساك بالـ 25%
            // --- ب. تم الإصلاح والتحصين النهائي: استقبال نسبة الأذكار المزامنة الحقيقية القادمة من قاعدة البيانات ---
            // --- ب. [تم الإصلاح البرمجي النهائي]: استقبال نسبة الأذكار المزامنة الحقيقية القادمة من قاعدة البيانات ---
      // التأكد من تفكيك النسبة بكافة الاحتمالات والمسميات الممررة من السيرفر لضمان إمساك الـ 25%
      const athkarPercent = (data.athkar && typeof data.athkar.percent !== 'undefined') ? data.athkar.percent : 0;

      // كل عنصر يُستهدف بمعرّفه الصريح مباشرة — بدون سلاسل fallback بتقفز فوق عناصر موجودة فعلاً
      const azkarText = document.getElementById('azkarText');       // الرقم الكبير بأعلى الكرت
      const azkarBar = document.getElementById('azkarBar');
      const azkarPercent = document.getElementById('azkarPercent'); // السطر الصغير أسفل الكرت

      if (azkarText) azkarText.textContent = `${athkarPercent}%`;
      if (azkarBar) azkarBar.style.width = `${athkarPercent}%`;
      if (azkarPercent) azkarPercent.textContent = `${athkarPercent}% إنجاز اليوم`;



      // --- ج. تحديث واجهة نسبة الدروس المنهجية الفعلي وتوجيهها لبطاقتها المخصصة ---
      const lessonsPercent = data.lessons?.percent || 0;
      const totalCompletedLessons = data.lessons?.completedLessonsCount || 0;

      const lessonsText = document.getElementById('lessonsText');       // الرقم الكبير: عدد الدروس
      const lessonsBar = document.getElementById('lessonsBar');
      const lessonsPercentEl = document.getElementById('lessonsPercent'); // السطر الصغير: النسبة

      if (lessonsText) lessonsText.textContent = `${totalCompletedLessons} درس`;
      if (lessonsBar) lessonsBar.style.width = `${lessonsPercent}%`;
      if (lessonsPercentEl) lessonsPercentEl.textContent = `${lessonsPercent}% (${totalCompletedLessons} مكتمل)`;
    }
  } catch (error) {
    console.error('خطأ في جلب بيانات لوحة التحكم الرئيسية:', error);
  }
}

// 2. تفعيل خريطة الإنجاز (Heatmap) برباط الألوان الرباعي وميزة الشمس يوم الجمعة
async function renderActiveHeatmap() {
  const token = localStorage.getItem('userToken');
  if (!token) return;

  const currentYear = new Date().getFullYear();

  try {
    const response = await fetch(`/api/activity/calendar?year=${currentYear}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const serverData = await response.json();
      
      const activityLevels = new Map(serverData.days.map(d => [d.date, d.level]));
      const kahfReadStatus = new Map(serverData.days.map(d => [d.date, d.kahfDone]));

      const monthCards = document.querySelectorAll('.month-card');
      
      monthCards.forEach((monthCard, monthIndex) => {
        const dayCells = monthCard.querySelectorAll('.day-cell:not(.empty)');
        
        dayCells.forEach(cell => {
          const dayNum = parseInt(cell.textContent, 10);
          const fullDateKey = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          
          const isFriday = new Date(currentYear, monthIndex, dayNum).getDay() === 5;
          const isKahfRead = kahfReadStatus.get(fullDateKey) === true;

          // ☀️ إذا كانت جمعة وقرأ سورة الكهف، نعوض الرقم بشمس منيرة ومبهرة للمستخدم
          if (isFriday && isKahfRead) {
            cell.innerHTML = '☀️';
            cell.style.fontSize = '12px';
          }

          // جلب التدريج اللوني المعتمد من قاعدة البيانات (lvl-0, lvl-1, lvl-2, lvl-3)
          const currentLevel = activityLevels.has(fullDateKey) ? activityLevels.get(fullDateKey) : 0;
          
          cell.className = 'day-cell'; 
          cell.classList.add(`lvl-${currentLevel}`); 
        });
      });
    }
  } catch (error) {
    console.error('خطأ في معالجة وتلوين خريطة الإنجاز التفاعلية:', error);
  }
}

// 3. دالة تفاعلية تسأل المستخدم يوم الجمعة عن سورة الكهف وتغرس شمس الإنجاز
async function checkFridayKahfStatus() {
  const token = localStorage.getItem('userToken');
  if (!token) return;

  try {
    const response = await fetch('/api/kahf/status', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.isFriday && !data.alreadyRead) {
        showFridayKahfBanner();
      }
    }
  } catch (error) {
    console.error('خطأ في فحص حالة سورة الكهف:', error);
  }
}

function showFridayKahfBanner() {
  const bannerContainer = document.getElementById('dashTimeBanner'); 
  const bannerText = document.getElementById('dashTimeText');

  if (bannerContainer && bannerText) {
    bannerText.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; flex-wrap:wrap; gap:10px;">
        <span>📖 نُور ما بين الجمعتين! لا تنسَ قراءة سورة الكهف اليوم لتنال الأجر والبركة.</span>
        <button id="btnConfirmKahf" class="btn btn-primary" style="padding:4px 12px; font-size:12px; background-color:var(--accent-gold); border:none; border-radius:6px; color:white; cursor:pointer;">تمت القراءة ✅</button>
      </div>
    `;
    bannerContainer.classList.remove('hidden');

    document.getElementById('btnConfirmKahf')?.addEventListener('click', async () => {
      const token = localStorage.getItem('userToken');
      try {
        const res = await fetch('/api/kahf/confirm', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          alert('بارك الله فيك، وتقبل الله طاعتك! تم إدراج شمس الإنجاز في الخريطة ☀️');
          bannerContainer.classList.add('hidden');
          await loadHomeDashboardData();
          await renderActiveHeatmap();
        }
      } catch (e) {
        console.error('خطأ في تأكيد سورة الكهف:', e);
      }
    });
  }
}

// 4. بناء هيكل المربعات السنوي للتقويم (Heatmap Grid Structure)
function buildCalendar() {
  const container = document.getElementById('monthsContainer');
  if (!container) return;

  container.innerHTML = '';

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const now = new Date();const currentYear = now.getFullYear();
monthNames.forEach((monthName, monthIndex) =>
   {const monthCard = document.createElement('div');monthCard.className = 'month-card';
    const title = document.createElement('h3');
    title.className = 'month-name';
    title.textContent = monthName;
    monthCard.appendChild(title);
        // استبدلي السطر القديم لـ weekdaysRow بهذه الصياغة المتناسقة تماماً مع الـ CSS
    const weekdaysRow = document.createElement('div');
    weekdaysRow.className = 'weekdays-row';
    weekdaysRow.innerHTML = '<span>س</span><span>ح</span><span>ن</span><span>ث</span><span>ر</span><span>خ</span><span>ج</span>';
    monthCard.appendChild(weekdaysRow);
    const daysGrid = document.createElement('div');
    daysGrid.className = 'days-grid';
    const firstDay = new Date(currentYear, monthIndex, 1);
    const dayOfWeek = firstDay.getDay();
    const offset = (dayOfWeek + 1) % 7;
    for (let i = 0; i < offset; i++) {const emptyCell = document.createElement('div');
      emptyCell.className = 'day-cell empty';
      emptyCell.style.visibility = 'hidden';daysGrid.appendChild(emptyCell);
    }const totalDays = new Date(currentYear, monthIndex + 1, 0).getDate();
    for (let day = 1; day <= totalDays; day++) {const dayCell = document.createElement('div');
      dayCell.className = 'day-cell lvl-0';dayCell.textContent = day;if (now.getFullYear() === currentYear &&now.getMonth() === monthIndex &&now.getDate() === day) {dayCell.style.border = '2px solid var(--accent-gold)';}daysGrid.appendChild(dayCell);}monthCard.appendChild(daysGrid);container.appendChild(monthCard);});}function setupNavigation() {const continueBtn = document.getElementById('continueReadingBtn');
      continueBtn?.addEventListener('click', () => {window.location.href = 'quran.html';});}