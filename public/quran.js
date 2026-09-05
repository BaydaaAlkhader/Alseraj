// ==========================================
// 1. المتغيرات العامة
// ==========================================
let currentPage = 1; 
const totalPages = 604;
let allSurahsData = [];
let currentTab = 'surahs';
let selectedAyahData = null; // الآية المحددة حالياً من المصحف
let userFavorites = [];      // قائمة المفضلة المجلوبة من السيرفر
let userReflections = [];    // قائمة التدبرات المجلوبة من السيرفر
let currentShareData = { text: '', surah: '', ayah: '' };
let activePreviewItem = null; // العنصر المعروض حالياً في المعاينة
let audioObj = new Audio();
let currentPlayingSurah = 1;
let currentPlayingAyah = 1;
let isAudioPlaying = false;

const juzStartPages = [
  1,   22,  42,  62,  82,  102, 122, 142, 162, 182,
  202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582
];

const juzNames = [
  "الأول", "الثاني", "الثالث", "الرابع", "الخامس", 
  "السادس", "السابع", "الثامن", "التاسع", "العاشر",
  "الحادي عشر", "الثاني عشر", "الثالث عشر", "الرابع عشر", "الخامس عشر",
  "السادس عشر", "السابع عشر", "الثامن عشر", "التاسع عشر", "العشرون",
  "الحادي والعشرون", "الثاني والعشرون", "الثالث والعشرون", "الرابع والعشرون", "الخامس والعشرون",
  "السادس والعشرون", "السابع والعشرون", "الثامن والعشرون", "التاسع والعشرون", "الثلاثون"
];

// ==========================================
// 2. عند تحميل الصفحة
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('userToken');
  const userName = localStorage.getItem('userName');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  updateUserUI(userName);
  setupLogout();

  // جلب البيانات الأساسية من السيرفر أولاً بالترتيب الصحيح
  await fetchUserFavorites();
  await fetchUserReflections();
  await loadSurahsData();

  // 🌟 الحل الجوهري: جلب آخر قراءة حقيقية لهذا المستخدم من السيرفر بدلاً من ذاكرة المتصفح المختلطة
  await fetchUserLastReadPosition();

  // تحميل الصفحة الصحيحة بناءً على ما عاد من السيرفر (مع تفعيل حفظ الموضع الأصلي)
  await loadPage(currentPage, true); 

  // إعداد عناصر التحكم والتفاعل الباقية
  setupPageNavigation();
  setupSearch();
  setupTabs();
  setupLoadMore();
  setupFavoriteButton(); 
  setupShareButton(); 
  setupTadabburButton(); 
  setupAudioPlayer();
  setupTafseerEvents();
});
// دالة جديدة لجلب الموضع الصحيح من الباك إند ومنع تداخل الحسابات عند تحميل الشاشة
async function fetchUserLastReadPosition() {
  const token = localStorage.getItem('userToken');
  try {
    const response = await fetch('/api/user/last-read', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      // تعيين الصفحة المسترجعة الخاصة بالمستخدم الحالي فقط
      if (data && data.lastReadPage) {
        currentPage = parseInt(data.lastReadPage, 10);
        sessionStorage.setItem('currentSessionPage', currentPage);
      }
    } else {
      console.warn("فشل جلب آخر قراءة من السيرفر، تم اعتماد الصفحة الافتراضية الأولى");
      currentPage = 1;
    }
  } catch (error) {
    console.error('خطأ أثناء جلب موضع القراءة الحقيقي من السيرفر:', error);
    currentPage = 1;
  }
}
// ==========================================
// 3. حفظ موضع القراءة في السيرفر والجلسة
// ==========================================
async function saveLastReadPosition(pageNumber, surahName) {
  sessionStorage.setItem('currentSessionPage', pageNumber);

  const token = localStorage.getItem('userToken');
  try {
    await fetch('/api/user/last-read', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ page: pageNumber, surah: surahName })
    });
  } catch (error) {
    console.error('خطأ في حفظ موضع القراءة في السيرفر:', error);
  }
}

// ==========================================
// 4. جلب وعرض صفحة القراءة
// ==========================================
// تمت إضافة البارامتر updateLastRead حتى لا يتأثر موضع الورد عند معانية الآيات
async function loadPage(pageNumber, updateLastRead = true) {
  const surahTitle = document.getElementById('surahTitle');
  const surahMeta = document.getElementById('surahMeta');
  const quranTextContainer = document.getElementById('quranText');
  const pageIndicator = document.getElementById('pageIndicator');

  if (pageIndicator) pageIndicator.textContent = `${pageNumber} / ${totalPages}`;
  if (quranTextContainer) {
    quranTextContainer.innerHTML = `<p style="text-align:center; color:#888; padding: 20px;">جاري تحميل الصفحة ${pageNumber}...</p>`;
  }

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`);
    const data = await response.json();
    const ayahs = data.data.ayahs;

    if (!ayahs || ayahs.length === 0) return;

    const mainSurah = ayahs[0].surah;
    const surahNameClean = mainSurah.name.replace('سُورَةُ ', '');

    if (surahTitle) surahTitle.textContent = `❖ ${mainSurah.name} ❖`;
    if (surahMeta) surahMeta.textContent = `الصفحة ${pageNumber} من ${totalPages}`;

    // حفظ الموضع فقط إذا كانت القراءة عادية من المصحف وليس انتقال معاينة
    if (updateLastRead) {
      saveLastReadPosition(pageNumber, surahNameClean);
    }

    let htmlContent = '';
    let currentSurahId = null;

    ayahs.forEach(ayah => {
      if (ayah.surah.number !== currentSurahId) {
        currentSurahId = ayah.surah.number;

        if (ayah.numberInSurah === 1 && currentSurahId !== 1) {
          htmlContent += `<h4 class="surah-in-page-title">❖ ${ayah.surah.name} ❖</h4>`;
          if (currentSurahId !== 9) {
            htmlContent += `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>`;
          }
        }
      }

      let text = ayah.text;
      
      if (ayah.numberInSurah === 1 && currentSurahId !== 1 && currentSurahId !== 9) {
        text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
      }

      const isFav = userFavorites.some(
        f => f.surahNumber === ayah.surah.number && f.ayahNumber === ayah.numberInSurah
      );
      const heartIcon = isFav ? `<span style="color:#e74c3c; font-size:0.8rem; margin:0 2px;">❤️</span>` : '';
      
      const isReflect = userReflections.some(
        r => r.surahNumber === ayah.surah.number && r.ayahNumber === ayah.numberInSurah
      );
      const ReflectIcon = isReflect ? `<span style="font-size:0.8rem; margin:0 2px;">📝</span>` : '';

      const isSelected = selectedAyahData && 
        selectedAyahData.surahNumber === ayah.surah.number && 
        selectedAyahData.ayahNumber === ayah.numberInSurah;
      const selectedClass = isSelected ? 'selected-ayah' : '';

      const safeText = text.replace(/"/g, '&quot;');

      htmlContent += `<span class="ayah-span ${selectedClass}" 
                      data-surah-num="${ayah.surah.number}" 
                      data-surah-name="${ayah.surah.name.replace('سُورَةُ ', '')}" 
                      data-ayah-num="${ayah.numberInSurah}" 
                      data-ayah-text="${safeText}" 
                      style="cursor:pointer; padding:2px 4px; border-radius:4px;">
                  ${text} <span class="ayah-num">﴿${ayah.numberInSurah}${heartIcon}${ReflectIcon}﴾</span> 
                </span> `;
    });

    if (quranTextContainer) {
      quranTextContainer.innerHTML = `<p class="quran-text">${htmlContent}</p>`;
      attachAyahClickEvents();
    }

  } catch (error) {
    console.error('خطأ في تحميل الصفحة:', error);
    if (quranTextContainer) {
      quranTextContainer.innerHTML = `<p style="color:red; text-align:center;">تعذر تحميل الصفحة، تحقق من الاتصال بالإنترنت.</p>`;
    }
  }
}

// ==========================================
// 5. تحديد الآية والمفضلة
// ==========================================

async function fetchUserFavorites() {
  const token = localStorage.getItem('userToken');
  try {
    const res = await fetch('/api/favorites', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      userFavorites = await res.json();
      renderFavoriteTabList();
    }
  } catch (err) {
    console.error('خطأ في جلب المفضلة:', err);
  }
}

function attachAyahClickEvents() {
  document.querySelectorAll('.ayah-span').forEach(span => {
    span.addEventListener('click', () => {
      document.querySelectorAll('.ayah-span').forEach(s => s.classList.remove('selected-ayah'));
      span.classList.add('selected-ayah');

      selectedAyahData = {
        surahNumber: parseInt(span.dataset.surahNum, 10),
        surahName: span.dataset.surahName,
        ayahNumber: parseInt(span.dataset.ayahNum, 10),
        ayahText: span.dataset.ayahText,
        pageNumber: currentPage
      };

      updateFavoriteUI();

      const tafseerSection = document.getElementById('tafseerSidebarSection');
      if (tafseerSection && tafseerSection.style.display !== 'none') {
        loadTafseer(selectedAyahData.surahNumber, selectedAyahData.ayahNumber);
      }
    });
  });
}

function updateFavoriteUI() {
  const favBtn = document.getElementById('favToggleBtn');
  const favIcon = document.getElementById('favIcon');
  const favText = document.getElementById('favText');

  if (!favBtn) return;

  if (!selectedAyahData) {
    favIcon.className = 'fa-regular fa-heart';
    favIcon.style.color = 'inherit';
    favText.textContent = 'حدد آية';
    return;
  }

  const isFav = userFavorites.some(
    f => f.surahNumber === selectedAyahData.surahNumber && f.ayahNumber === selectedAyahData.ayahNumber
  );

  if (isFav) {
    favIcon.className = 'fa-solid fa-heart';
    favIcon.style.color = '#e74c3c';
    favText.textContent = 'مفضلة';
  } else {
    favIcon.className = 'fa-regular fa-heart';
    favIcon.style.color = 'inherit';
    favText.textContent = 'تفضيل';
  }
}

function setupFavoriteButton() {
  const favBtn = document.getElementById('favToggleBtn');
  if (!favBtn) return;

  favBtn.addEventListener('click', async () => {
    if (!selectedAyahData) {
      alert('الرجاء النقر على آية من الصفحة أولاً لتفضيلها');
      return;
    }

    const token = localStorage.getItem('userToken');
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(selectedAyahData)
      });

      const data = await res.json();
      if (data.success) {
        userFavorites = data.favorites;
        updateFavoriteUI();
        loadPage(currentPage, false);
        renderFavoriteTabList();
      }
    } catch (err) {
      console.error('خطأ في تعديل المفضلة:', err);
    }
  });
}

function renderFavoriteTabList() {
  if (currentTab !== 'favorites') return;
  
  const surahList = document.getElementById('surahList');
  if (!surahList) return;

  if (!userFavorites || userFavorites.length === 0) {
    surahList.innerHTML = `<li style="padding:15px; text-align:center; color:#888; font-size:0.85rem;">لا توجد آيات مفضلة بعد</li>`;
    return;
  }

  surahList.innerHTML = userFavorites.map((fav, index) => `
    <li class="surah-item fav-item" data-index="${index}">
      <span class="surah-num-badge">❤️</span>
      <div class="surah-info">
        <span class="surah-name">سورة ${fav.surahName} (${fav.ayahNumber})</span>
        <p class="full-verse-text">﴿ ${fav.ayahText || 'معاينة الآية'} ﴾</p>
      </div>
    </li>
  `).join('');

  document.querySelectorAll('.fav-item').forEach(item => {
    item.addEventListener('click', () => {
      const fav = userFavorites[item.dataset.index];
      openPreviewModal({
        text: fav.ayahText,
        surahName: fav.surahName,
        numberInSurah: fav.ayahNumber,
        surahNumber: fav.surahNumber,
        pageNumber: fav.pageNumber,
        type: 'favorite'
      });
    });
  });
}

// ==========================================
// 6. منطق المشاركة
// ==========================================

function setupShareButton() {
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (!selectedAyahData) {
        alert('الرجاء النقر على آية من الصفحة أولاً لمشاركتها');
        return;
      }
      openShareModal(
        selectedAyahData.ayahText,
        selectedAyahData.surahName,
        selectedAyahData.ayahNumber
      );
    });
  }
}

function openShareModal(text, surah, ayah) {
  currentShareData = { text, surah, ayah };
  document.getElementById('shareVerseText').innerText = `﴿ ${text} ﴾`;
  document.getElementById('shareVerseInfo').innerText = `سورة ${surah} - آية ${ayah}`;
  document.getElementById('shareModal').style.display = 'flex';
}

function closeShareModal() {
  document.getElementById('shareModal').style.display = 'none';
}

async function copyVerseText() {
  const formattedText = `﴿ ${currentShareData.text} ﴾\n— سورة ${currentShareData.surah}، الآية ${currentShareData.ayah}\n\nتم المشاركة عبر تطبيق السراج`;
  await navigator.clipboard.writeText(formattedText);
  alert('تم نسخ النص بنجاح!');
}

async function shareNative() {
  const formattedText = `﴿ ${currentShareData.text} ﴾\n— سورة ${currentShareData.surah}، الآية ${currentShareData.ayah}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'مشاركة آية',
        text: formattedText,
      });
    } catch (err) { console.log('تم إلغاء المشاركة'); }
  } else {
    copyVerseText();
  }
}

function generateVerseImage() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 800;
  canvas.height = 800;

  ctx.fillStyle = '#fbf9f1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#c5a059';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  ctx.direction = 'rtl';
  ctx.fillStyle = '#1f2937';
  ctx.font = '30px "Amiri", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fullText = `﴿ ${currentShareData.text} ﴾`;
  const words = fullText.split(' ');
  let line = '';
  const lines = [];
  const maxWidth = 650;

  for (let n = 0; n < words.length; n++) {
    let testLine = line ? line + ' ' + words[n] : words[n];
    let metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n];
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const lineHeight = 55;
  let startY = 400 - ((lines.length - 1) * lineHeight / 2) - 25;

  lines.forEach((l, index) => {
    ctx.fillText(l, canvas.width / 2, startY + (index * lineHeight));
  });

  ctx.fillStyle = '#8b7355';
  ctx.font = 'bold 26px "Amiri", serif';
  const infoY = startY + (lines.length * lineHeight) + 30;
  ctx.fillText(`سورة ${currentShareData.surah} — آية ${currentShareData.ayah}`, canvas.width / 2, infoY);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = '18px sans-serif';
  ctx.fillText('تطبيق السراج', canvas.width / 2, 730);

  const link = document.createElement('a');
  link.download = `آية_${currentShareData.surah}_${currentShareData.ayah}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ==========================================
// 7. منطق تدبري ونوافذ المعاينة والحذف
// ==========================================

async function fetchUserReflections() {
  const token = localStorage.getItem('userToken');
  try {
    const res = await fetch('/api/reflections', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      userReflections = await res.json();
      renderReflectionsTabList();
    }
  } catch (err) {
    console.error('خطأ في جلب التدبرات:', err);
  }
}

function setupTadabburButton() {
  const tadabburBtn = document.getElementById('tadabburBtn');
  if (tadabburBtn) {
    tadabburBtn.addEventListener('click', openReflectionModal);
  }
}

function openReflectionModal() {
  if (!selectedAyahData) {
    alert('الرجاء النقر على آية من الصفحة أولاً لتدبرها');
    return;
  }

  document.getElementById('refVerseText').innerText = `﴿ ${selectedAyahData.ayahText} ﴾`;
  document.getElementById('refVerseInfo').innerText = `سورة ${selectedAyahData.surahName} - آية ${selectedAyahData.ayahNumber}`;

  const existing = userReflections.find(
    r => r.surahNumber === selectedAyahData.surahNumber && r.ayahNumber === selectedAyahData.ayahNumber
  );
  document.getElementById('reflectionInput').value = existing ? existing.note : '';

  document.getElementById('reflectionModal').style.display = 'flex';
}

function closeReflectionModal() {
  document.getElementById('reflectionModal').style.display = 'none';
}

async function saveReflection() {
  const note = document.getElementById('reflectionInput').value.trim();
  if (!note) {
    alert('يرجى كتابة الخاطرة أو التدبر قبل الحفظ.');
    return;
  }

  const token = localStorage.getItem('userToken');
  try {
    const res = await fetch('/api/reflections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...selectedAyahData,
        note: note
      })
    });

    const data = await res.json();
    if (data.success) {
      userReflections = data.reflections;
      closeReflectionModal();
      if (currentTab === 'reflections') renderReflectionsTabList();
    }
  } catch (err) {
    console.error('خطأ في حفظ التدبر:', err);
  }
}

function renderReflectionsTabList() {
  if (currentTab !== 'reflections') return;
  const surahList = document.getElementById('surahList');
  if (!surahList) return;

  if (!userReflections || userReflections.length === 0) {
    surahList.innerHTML = `<li style="padding:15px; text-align:center; color:#888; font-size:0.85rem;">لا توجد تدبرات مسجلة بعد</li>`;
    return;
  }

  surahList.innerHTML = userReflections.map((ref, index) => `
    <li class="surah-item ref-item" data-index="${index}">
      <span class="surah-num-badge">📝</span>
      <div class="surah-info">
        <span class="surah-name">سورة ${ref.surahName} — آية ${ref.ayahNumber}</span>
        <p class="full-verse-text">﴿ ${ref.ayahText || ''} ﴾</p>
        ${ref.note ? `<div class="reflection-note-box"><strong>تأملي:</strong> ${ref.note}</div>` : ''}
      </div>
    </li>
  `).join('');

  document.querySelectorAll('.ref-item').forEach(item => {
    item.addEventListener('click', () => {
      const ref = userReflections[item.dataset.index];
      openPreviewModal({
        text: ref.ayahText,
        surahName: ref.surahName,
        numberInSurah: ref.ayahNumber,
        surahNumber: ref.surahNumber,
        pageNumber: ref.pageNumber,
        note: ref.note,
        type: 'reflection'
      });
    });
  });
}

async function openPreviewModal(ayahData) {
  activePreviewItem = ayahData;
  const modal = document.getElementById('previewModal');
  const title = document.getElementById('previewTitle');
  const verseText = document.getElementById('previewVerseText');
  const verseInfo = document.getElementById('previewVerseInfo');
  const tadabburBox = document.getElementById('previewTadabburBox');
  const tadabburText = document.getElementById('previewTadabburText');
  const btnGoTo = document.getElementById('btnGoToAyah');
  const btnDelete = document.getElementById('btnDeletePreviewItem');

  if (!modal) return;

  verseText.innerText = ayahData.text || 'جاري تحميل النص...';
  verseInfo.innerText = `[سورة ${ayahData.surahName} - آية ${ayahData.numberInSurah || ayahData.ayahNumber}]`;

  if (ayahData.type === 'reflection' || ayahData.note) {
    if (title) title.innerText = "❖ معاينة تدبر ❖";
    if (tadabburText) tadabburText.innerText = ayahData.note || '';
    if (tadabburBox) tadabburBox.style.display = 'block';
    if (btnDelete) btnDelete.innerText = '🗑️ إزالة التدبر';
  } else {
    if (title) title.innerText = "❖ آية في المفضلة ❖";
    if (tadabburBox) tadabburBox.style.display = 'none';
    if (btnDelete) btnDelete.innerText = '🗑️ إزالة من المفضلة';
  }

  let targetPage = ayahData.pageNumber;
  if (!ayahData.text || !targetPage) {
    try {
      const surahNum = ayahData.surahNumber;
      const ayahNum = ayahData.numberInSurah || ayahData.ayahNumber;
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}`);
      const data = await res.json();
      if (data && data.data) {
        verseText.innerText = data.data.text;
        targetPage = data.data.page;
      }
    } catch (e) {
      console.error('خطأ في جلب تفاصيل الآية للمعاينة:', e);
    }
  }

  // الانتقال للآية في المصحف دون تحديث آخر مكان تم الوقوف عنده
  if (btnGoTo) {
    btnGoTo.onclick = () => {
      closePreviewModal();
      if (targetPage) {
        currentPage = targetPage;
        loadPage(currentPage, false); // false = عدم تحديث موضع القراءة الأخير
      }
    };
  }

  // حذف التدبر أو إزالة المفضلة
  if (btnDelete) {
    btnDelete.onclick = async () => {
      await deletePreviewItem(ayahData);
    };
  }

  modal.style.display = 'flex';
}

async function deletePreviewItem(ayahData) {
  const token = localStorage.getItem('userToken');
  const surahNum = ayahData.surahNumber;
  const ayahNum = ayahData.numberInSurah || ayahData.ayahNumber;

  if (ayahData.type === 'reflection' || ayahData.note) {
    try {
      await fetch('/api/reflections', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ surahNumber: surahNum, ayahNumber: ayahNum })
      });
    } catch (e) { console.error('خطأ حذف التدبر:', e); }

    userReflections = userReflections.filter(
      r => !(r.surahNumber === surahNum && r.ayahNumber === ayahNum)
    );
    renderReflectionsTabList();
  } else {
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          surahNumber: surahNum,
          ayahNumber: ayahNum,
          surahName: ayahData.surahName,
          ayahText: ayahData.text
        })
      });
      const data = await res.json();
      if (data.success) userFavorites = data.favorites;
    } catch (e) { console.error('خطأ حذف المفضلة:', e); }

    userFavorites = userFavorites.filter(
      f => !(f.surahNumber === surahNum && f.ayahNumber === ayahNum)
    );
    renderFavoriteTabList();
  }

  closePreviewModal();
  loadPage(currentPage, false);
}

function closePreviewModal() {
  const modal = document.getElementById('previewModal');
  if (modal) modal.style.display = 'none';
}

// ==========================================
// 8. التبويبات والتنقل والبحث
// ==========================================

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const listTitle = document.getElementById('listTitle');
  const surahListSection = document.getElementById('surahListSection');
  const tafseerSidebarSection = document.getElementById('tafseerSidebarSection');
  const sidebarRight = document.getElementById('sidebarRight');

  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabType = tab.dataset.tab;
      if (tabType === 'tafseer' || tab.textContent.includes('تفسير')) {
        currentTab = 'tafseer';
        if (surahListSection) surahListSection.style.display = 'none';
        if (tafseerSidebarSection) tafseerSidebarSection.style.display = 'block';

        if (selectedAyahData) {
          loadTafseer(selectedAyahData.surahNumber, selectedAyahData.ayahNumber);
        } else {
          const firstAyahSpan = document.querySelector('.ayah-span');
          if (firstAyahSpan) {
            const sNum = parseInt(firstAyahSpan.dataset.surahNum, 10);
            const aNum = parseInt(firstAyahSpan.dataset.ayahNum, 10);
            loadTafseer(sNum, aNum);
          }
        }
      } else {
        if (surahListSection) surahListSection.style.display = 'block';
        if (tafseerSidebarSection) tafseerSidebarSection.style.display = 'none';

        if (tabType === 'juzs' || tab.textContent.includes('الأجزاء')) {
          currentTab = 'juzs';
          if (listTitle) listTitle.textContent = 'جميع الأجزاء';
          renderJuzList();
        } else if (tabType === 'favorites' || tab.textContent.includes('المفضلة')) {
          currentTab = 'favorites';
          if (listTitle) listTitle.textContent = 'الآيات المفضلة';
          renderFavoriteTabList();
        } else if (tabType === 'reflections' || tab.textContent.includes('تدبراتي')) {
          currentTab = 'reflections';
          if (listTitle) listTitle.textContent = 'تدبراتي';
          renderReflectionsTabList();
        } else {
          currentTab = 'surahs';
          if (listTitle) listTitle.textContent = 'جميع السور';
          renderSurahList();
        }
      }

      // إصلاح: بدل التمرير التلقائي، على الهاتف تصير القائمة شاشة كاملة منبثقة
      // فوق المصحف (بناءً على ملاحظة المستخدم) — يفتحها الضغط على أي تبويب،
      // ويغلقها زر X أو اختيار عنصر من القائمة (انظر أسفل الدالة)
      if (window.innerWidth <= 900) {
        sidebarRight?.classList.add('mobile-open');
      }
    });
  });

  // زر إغلاق الشاشة الكاملة (X)
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  closeSidebarBtn?.addEventListener('click', () => {
    sidebarRight?.classList.remove('mobile-open');
  });

  // إغلاق تلقائي بمجرد اختيار عنصر من القائمة (سورة/جزء/آية مفضلة/تدبر) —
  // كل القوائم تُعرض بنفس العنصر #surahList، فمستمع واحد يكفي للجميع
  const surahListEl = document.getElementById('surahList');
  surahListEl?.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      sidebarRight?.classList.remove('mobile-open');
    }
  });
}

function setupPageNavigation() {
  const nextPage = document.getElementById('nextPage');
  const prevPage = document.getElementById('prevPage');
  const btnInc = document.getElementById('btnInc');
  const btnDec = document.getElementById('btnDec');

  function nextPageHandler() {
    if (currentPage < totalPages) {
      currentPage++;
      loadPage(currentPage, true);
    }
  }

  function prevPageHandler() {
    if (currentPage > 1) {
      currentPage--;
      loadPage(currentPage, true);
    }
  }

  nextPage?.addEventListener('click', prevPageHandler);
  btnInc?.addEventListener('click', prevPageHandler);
  prevPage?.addEventListener('click', nextPageHandler);
  btnDec?.addEventListener('click', nextPageHandler);
}

async function loadSurahsData() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    allSurahsData = data.data;
    renderSurahList();
  } catch (error) {
    console.error('خطأ في جلب بيانات السور:', error);
  }
}

function renderSurahList() {
  const surahList = document.getElementById('surahList');
  if (!surahList) return;

  surahList.innerHTML = allSurahsData.map(surah => `
    <li class="surah-item" data-id="${surah.number}">
      <span class="surah-num-badge">${surah.number}</span>
      <div class="surah-info">
        <span class="surah-name">${surah.name.replace('سُورَةُ ', '')}</span>
        <span class="surah-meta">${surah.numberOfAyahs} آية</span>
      </div>
    </li>
  `).join('');

  document.querySelectorAll('.surah-item').forEach(item => {
    item.addEventListener('click', async () => {
      document.querySelectorAll('.surah-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const surahId = item.dataset.id;
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`);
        const surahData = await res.json();
        currentPage = surahData.data.ayahs[0].page;
        loadPage(currentPage, true);
      } catch (e) {
        console.error('خطأ عند الانتقال للسورة:', e);
      }
    });
  });
}

function renderJuzList() {
  const surahList = document.getElementById('surahList');
  if (!surahList) return;

  let juzHTML = '';
  for (let i = 0; i < 30; i++) {
    const juzNum = i + 1;
    const startPage = juzStartPages[i];

    juzHTML += `
      <li class="surah-item juz-item" data-page="${startPage}" data-juz="${juzNum}">
        <span class="surah-num-badge">${juzNum}</span>
        <div class="surah-info">
          <span class="surah-name">الجزء ${juzNames[i]}</span>
          <span class="surah-meta">الصفحة ${startPage}</span>
        </div>
      </li>
    `;
  }

  surahList.innerHTML = juzHTML;

  document.querySelectorAll('.juz-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.juz-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const page = parseInt(item.dataset.page, 10);
      currentPage = page;
      loadPage(currentPage, true);
    });
  });
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput?.addEventListener('input', (e) => {
    const filter = e.target.value.trim().toLowerCase();
    const items = document.querySelectorAll('.surah-item');

    items.forEach(item => {
      const name = item.querySelector('.surah-name')?.textContent || '';
      item.style.display = name.toLowerCase().includes(filter) ? 'flex' : 'none';
    });
  });
}

function setupLoadMore() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const surahList = document.getElementById('surahList');

  if (loadMoreBtn && surahList) {
    loadMoreBtn.addEventListener('click', () => {
      surahList.classList.toggle('expanded');
      if (surahList.classList.contains('expanded')) {
        loadMoreBtn.textContent = 'عرض أقل ∧';
      } else {
        loadMoreBtn.textContent = 'عرض المزيد ∨';
        surahList.scrollTop = 0;
      }
    });
  }
}

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

function setupLogout() {
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    sessionStorage.clear();
    window.location.href = 'login.html';
  });
}

// ==========================================
// 9. منطق مشغل الصوت
// ==========================================

function highlightPlayingAyah(surah, ayah) {
  document.querySelectorAll('.ayah-span').forEach(span => {
    const spanSurah = parseInt(span.dataset.surahNum, 10);
    const spanAyah = parseInt(span.dataset.ayahNum, 10);
    if (spanSurah === surah && spanAyah === ayah) {
      span.classList.add('selected-ayah');
    } else {
      span.classList.remove('selected-ayah');
    }
  });
}

function setupAudioPlayer() {
  const listenBtn = document.getElementById('listenBtn');
  const playerContainer = document.getElementById('audioPlayerContainer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const prevAyahBtn = document.getElementById('prevAyahBtn');
  const nextAyahBtn = document.getElementById('nextAyahBtn');
  const closePlayerBtn = document.getElementById('closePlayerBtn');
  const reciterSelect = document.getElementById('reciterSelect');
  const speedSelect = document.getElementById('speedSelect');
  const progressBar = document.getElementById('progressBar');

  listenBtn?.addEventListener('click', () => {
    if (selectedAyahData) {
      currentPlayingSurah = selectedAyahData.surahNumber;
      currentPlayingAyah = selectedAyahData.ayahNumber;
    } else {
      const firstAyahSpan = document.querySelector('.ayah-span');
      if (firstAyahSpan) {
        currentPlayingSurah = parseInt(firstAyahSpan.dataset.surahNum, 10);
        currentPlayingAyah = parseInt(firstAyahSpan.dataset.ayahNum, 10);
      }
    }
    playerContainer.style.display = 'flex';
    playAyah(currentPlayingSurah, currentPlayingAyah);
  });

  playPauseBtn?.addEventListener('click', () => {
    if (isAudioPlaying) {
      audioObj.pause();
      isAudioPlaying = false;
      if (playIcon) playIcon.className = 'fa-solid fa-play';
    } else {
      audioObj.play();
      isAudioPlaying = true;
      if (playIcon) playIcon.className = 'fa-solid fa-pause';
    }
  });

  speedSelect?.addEventListener('change', () => {
    if (audioObj) {
      audioObj.playbackRate = parseFloat(speedSelect.value);
    }
  });

  nextAyahBtn?.addEventListener('click', () => playAyah(currentPlayingSurah, currentPlayingAyah + 1));
  prevAyahBtn?.addEventListener('click', () => {
    if (currentPlayingAyah > 1) playAyah(currentPlayingSurah, currentPlayingAyah - 1);
  });

  reciterSelect?.addEventListener('change', () => playAyah(currentPlayingSurah, currentPlayingAyah));

  closePlayerBtn?.addEventListener('click', () => {
    audioObj.pause();
    isAudioPlaying = false;
    playerContainer.style.display = 'none';
  });

  audioObj.addEventListener('timeupdate', () => {
    if (audioObj.duration) {
      const progress = (audioObj.currentTime / audioObj.duration) * 100;
      progressBar.value = progress;
      document.getElementById('currentTime').textContent = formatTime(audioObj.currentTime);
      document.getElementById('durationTime').textContent = formatTime(audioObj.duration);
    }
  });

  progressBar?.addEventListener('input', () => {
    if (audioObj.duration) {
      audioObj.currentTime = (progressBar.value / 100) * audioObj.duration;
    }
  });

  audioObj.addEventListener('ended', () => {
    playAyah(currentPlayingSurah, currentPlayingAyah + 1);
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

async function playAyah(surah, ayah) {
  const reciter = document.getElementById('reciterSelect').value;
  const speedSelect = document.getElementById('speedSelect');
  const playerTitle = document.getElementById('playerTitle');
  const playIcon = document.getElementById('playIcon');

  try {
    playerTitle.textContent = `جاري التحميل (سورة ${surah} - آية ${ayah})...`;
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${reciter}`);
    const data = await res.json();

    if (data && data.data && data.data.audio) {
      currentPlayingSurah = surah;
      currentPlayingAyah = ayah;

      audioObj.src = data.data.audio;
      
      if (speedSelect) {
        audioObj.playbackRate = parseFloat(speedSelect.value);
      }

      audioObj.play();
      isAudioPlaying = true;

      if (playIcon) playIcon.className = 'fa-solid fa-pause';
      playerTitle.textContent = `سورة ${data.data.surah.name.replace('سُورَةُ ', '')} - الآية ${ayah}`;

      highlightPlayingAyah(surah, ayah);
    }
  } catch (err) {
    console.error('خطأ في تشغيل الصوت:', err);
    playerTitle.textContent = 'تعذر تشغيل الصوت';
  }
}

// ==========================================
// 10. منطق التفسير مع دعم ابن كثير والسعدي
// ==========================================

function setupTafseerEvents() {
  const tafseerBtn = document.getElementById('tafseerBtn');
  const tafseerSidebarSection = document.getElementById('tafseerSidebarSection');
  const surahListSection = document.getElementById('surahListSection');
  const tafseerSelect = document.getElementById('tafseerSelect');

  tafseerBtn?.addEventListener('click', () => {
    if (!selectedAyahData) {
      const firstAyahSpan = document.querySelector('.ayah-span');
      if (firstAyahSpan) {
        selectedAyahData = {
          surahNumber: parseInt(firstAyahSpan.dataset.surahNum, 10),
          surahName: firstAyahSpan.dataset.surahName,
          ayahNumber: parseInt(firstAyahSpan.dataset.ayahNum, 10),
          ayahText: firstAyahSpan.dataset.ayahText,
          pageNumber: currentPage
        };
      }
    }
    
    currentTab = 'tafseer';
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="tafseer"]')?.classList.add('active');

    if (surahListSection) surahListSection.style.display = 'none';
    if (tafseerSidebarSection) tafseerSidebarSection.style.display = 'block';

    if (selectedAyahData) {
      loadTafseer(selectedAyahData.surahNumber, selectedAyahData.ayahNumber);
    }
  });

  tafseerSelect?.addEventListener('change', () => {
    if (selectedAyahData) {
      loadTafseer(selectedAyahData.surahNumber, selectedAyahData.ayahNumber);
    }
  });
}

async function loadTafseer(surahNum, ayahNum) {
  const tafseerText = document.getElementById('tafseerText');
  const tafseerAyahTitle = document.getElementById('tafseerAyahTitle');
  const tafseerSelect = document.getElementById('tafseerSelect');
  
  // المعرف الافتراضي (91 = تفسير السعدي)
  const tafseerId = tafseerSelect ? tafseerSelect.value : '91';

  if (tafseerText) tafseerText.innerHTML = '<p style="text-align:center; color:#888;">جاري تحميل التفسير...</p>';

  try {
    // الاتصال بـ Quran.com API
    const res = await fetch(`https://api.quran.com/api/v4/tafsirs/${tafseerId}/by_ayah/${surahNum}:${ayahNum}`);
    const data = await res.json();

    if (data && data.tafsir && data.tafsir.text) {
      if (tafseerAyahTitle) {
        const surahName = selectedAyahData ? selectedAyahData.surahName : '';
        tafseerAyahTitle.textContent = surahName ? `سورة ${surahName} - آية ${ayahNum}` : `سورة رقم ${surahNum} - آية ${ayahNum}`;
      }
      
      // استخدام innerHTML لعرض النص وتنسيقات HTML المرفقة معه من الـ API
      tafseerText.innerHTML = data.tafsir.text;
    } else {
      if (tafseerText) tafseerText.textContent = 'لا يوجد تفسير متوفر لهذه الآية.';
    }
  } catch (err) {
    console.error('خطأ في جلب التفسير:', err);
    if (tafseerText) tafseerText.textContent = 'تعذر تحميل التفسير، يرجى المحاولة لاحقاً.';
  }
}