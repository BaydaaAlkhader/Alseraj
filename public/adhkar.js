const defaultDhikrLibrary = {
  morning: [
    { id: 101, text: "﴿ اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ ﴾", source: "سورة البقرة - الآية 255", virtue: "✨ حرز وحفظ من الشياطين والجن حتى تمسي", target: 1, current: 0, completed: false, isFav: false },
    { id: 102, text: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (مع المعوذتين)", source: "الإخلاص والفلق والناس (3 مرات)", virtue: "🛡️ تكفيك من كل شيء في يومك", target: 3, current: 0, completed: false, isFav: false },
    { id: 103, text: "أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", source: "صحيح مسلم", virtue: "🌿 تجديد العبودية والتوكل في الصباح", target: 1, current: 0, completed: false, isFav: false },
    { id: 104, text: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ", source: "سيد الاستغفار - رواه البخاري", virtue: "👑 من قالها موقناً بها ومات دخل الجنة", target: 1, current: 0, completed: false, isFav: false },
    { id: 105, text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", source: "سنن أبي داود (3 مرات)", virtue: "🌸 كان حقاً على الله أن يرضيه يوم القيامة", target: 3, current: 0, completed: false, isFav: false },
    { id: 106, text: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ", source: "سنن أبي داود والترمذي (3 مرات)", virtue: "🛡️ لم يضره شيء في ذلك اليوم", target: 3, current: 0, completed: false, isFav: false },
    { id: 107, text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", source: "صحيح الترغيب والترهيب", virtue: "💡 صلاح الشأن والحفظ في الصباح", target: 1, current: 0, completed: false, isFav: false },
    { id: 108, text: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ العَرْشِ العَظِيمِ", source: "سنن أبي داود (7 مرات)", virtue: "☀️ كفاه الله ما أهمه من أمر الدنيا والآخرة", target: 7, current: 0, completed: false, isFav: false },
    { id: 109, text: "اللَّهُمَّ عَاَفِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ", source: "سنن أبي داود (3 مرات)", virtue: "💪 السؤال عن العافية والسلامة في الجسد", target: 3, current: 0, completed: false, isFav: false },
    { id: 110, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي .", source: "سنن ابن ماجه", virtue: "🤲 دُعَاء العافية الشامل للدين والدنيا والأهل والمال", target: 1, current: 0, completed: false, isFav: false },
    { id: 111, text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.", source: "مسند أحمد", virtue: "🌱 الثبات على دين الإسلام والتوحيد", target: 1, current: 0, completed: false, isFav: false },
    { id: 112, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ", source: "صحيح مسلم (3 مرات)", virtue: "⚖️ تفوق أوزاناً عظيمة من الذكر والمضاعفة", target: 3, current: 0, completed: false, isFav: false }
  ],
  evening: [
    { id: 201, text: "﴿ اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ ﴾", source: "سورة البقرة - الآية 255", virtue: "🌙 حفظ وحماية من كل سوء حتى تصبح", target: 1, current: 0, completed: false, isFav: false },
    { id: 202, text: "قُلْ هُوَ اللَّهُ أَحَدٌ، قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، قُلْ أَعُوذُ بِرَبِّ النَّاسِ", source: "الإخلاص والمعوذتين (3 مرات)", virtue: "🛡️ تكفيك من كل شيء في ليلتك", target: 3, current: 0, completed: false, isFav: false },
    { id: 203, text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ: فَتْحَهَا وَنَصْرَهَا وَنُورَهَا وَبَرَكَتَهَا وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَ.", source: "صحيح مسلم", virtue: "🌟 الثناء على الله في إقبال الليل", target: 1, current: 0, completed: false, isFav: false },
    { id: 204, text: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ.", source: "سيد الاستغفار - رواه البخاري", virtue: "👑 من قالها موقناً بها ومات في ليلته دخل الجنة", target: 1, current: 0, completed: false, isFav: false },
    { id: 205, text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", source: "صحيح مسلم (3 مرات)", virtue: "🐍 لم تضره حمة ولا دابة ولا شر في ليلته", target: 3, current: 0, completed: false, isFav: false },
    { id: 206, text: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ", source: "سنن الترمذي (3 مرات)", virtue: "🛡️ لم تصبه فجأة بلاء حتى يصبح", target: 3, current: 0, completed: false, isFav: false },
    { id: 207, text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ المَصِيرُ", source: "سنن الترمذي", virtue: "🌌 تسليم الأمر لله في الصباح والمساء", target: 1, current: 0, completed: false, isFav: false },
    { id: 208, text: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ .", source: "مسند أحمد", virtue: "🕊️ الثبات على الملة والطاعة", target: 1, current: 0, completed: false, isFav: false },
    { id: 209, text: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الحَمْدُ وَلَكَ الشُّكْرُ", source: "سنن أبي داود", virtue: "🙌 أدّى شُكر ليلته", target: 1, current: 0, completed: false, isFav: false },
    { id: 210, text: "يا حيّ يا قَيُّومُ برحمتك أستغيثُ، أصلحْ لي شأني كلَّه، وَلَا تَكِلْنِي إِلَى نفسي طَرْفَةَ عين", source: "صحيح الترغيب", virtue: "✨ تفويض الأمر لله واستجلاب الرحمة", target: 1, current: 0, completed: false, isFav: false }
  ],
  sleep: [
    { id: 401, text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِاسْمِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ", source: "متفق عليه", virtue: "😴 حفظ الروح وحمايتها أثناء النوم", target: 1, current: 0, completed: false, isFav: false },
    { id: 402, text: " ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍۢ مِّن رُّسُلِهِۦ ۚ وَقَالُوا۟ سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ٱلْمَصِيرُ ﴿285﴾ لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًۭا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَٰفِرِينَ ﴿286﴾", source: "سورة البقرة (الآيتان 285-286)", virtue: "📖 من قرأهما في ليلة كفتاه", target: 1, current: 0, completed: false, isFav: false },
    { id: 403, text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", source: "زاد المعاد (3 مرات)", virtue: "🔥 الوقاية والأمان من عذاب النار", target: 3, current: 0, completed: false, isFav: false },
    { id: 404, text: "سُبْحَانَ اللَّهِ (33)، الحَمْدُ لِلَّهِ (33)، اللَّهُ أَكْبَرُ (34)", source: "متفق عليه", virtue: "💪 خيرٌ لك من خادم، وتعطي قوة وجلداً", target: 100, current: 0, completed: false, isFav: false },
    { id: 405, text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", source: "صحيح البخاري", virtue: "🛌 الاستسلام لله عند النوم", target: 1, current: 0, completed: false, isFav: false },
    { id: 406, text: "اللَّهُمَّ  أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَى مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ.", source: "متفق عليه", virtue: "✨ إن متّ في ليلتك متّ على الفطرة", target: 1, current: 0, completed: false, isFav: false },
    { id: 407, text: "قُلْ يَٰٓأَيُّهَا ٱلْكَٰفِرُونَ ﴿1﴾ لَآ أَعْبُدُ مَا تَعْبُدُونَ ﴿2﴾ وَلَآ أَنتُمْ عَٰبِدُونَ مَآ أَعْبُدُ ﴿3﴾ وَلَآ أَنَا۠ عَابِدٌۭ مَّا عَبَدتُّمْ ﴿4﴾ وَلَآ أَنتُمْ عَٰبِدُونَ مَآ أَعْبُدُ ﴿5﴾ لَكُمْ دِينُكُمْ وَلِىَ دِينِ ﴿6﴾", source: "سورة الكافرون", virtue: "🛡️ براءة من الشرك", target: 1, current: 0, completed: false, isFav: false }
  ],
  prayer: [
    { id: 301, text: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ... اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الجَلاَلِ وَالإِكْرَامِ", source: "صحيح مسلم", virtue: "🕊️ جبر التقصير في الصلاة ومسح الزلل", target: 1, current: 0, completed: false, isFav: false },
    { id: 302, text: "لا إلهَ إلَّا اللهُ وحده لا شريكَ له له الملكُ وله الحمدُ وهو على كلِّ شيءٍ قديرٌ اللَّهمَّ لا مانعَ لما أعطيتَ ولا مُعطيَ لما منعتَ ولا ينفعُ ذا الجَدِّ منك الجَدُّ", source: "متفق عليه", virtue: "🔑 التوحيد والثناء بعد كل صلاة مكتوبة", target: 1, current: 0, completed: false, isFav: false },
    { id: 303, text: "سُبْحَانَ اللَّهِ (33)، الحَمْدُ لِلَّهِ (33)، اللَّهُ أَكْبَرُ (33) + لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ...", source: "صحيح مسلم", virtue: "🌊 غُفرت خطاياه وإن كانت مثل زبد البحر", target: 99, current: 0, completed: false, isFav: false },
    { id: 304, text: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ", source: "سنن أبي داود", virtue: "💎 توصية النبي لأصحابه بدبرها في كل صلاة", target: 1, current: 0, completed: false, isFav: false },
    { id: 305, text: "آية الكرسي (اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ...)", source: "سنن النسائي الكبرى", virtue: "🚪 لم يمنعه من دخول الجنة إلا أن يموت", target: 1, current: 0, completed: false, isFav: false },
    { id: 306, text: "قراءة سورة الإخلاص والمعوذتين دبر كل صلاة (وتكرر 3 مرات بعد الفجر والمغرب)", source: "سنن أبي داود", virtue: "🛡️ الحفظ والحرز الشامل عقب الصلوات", target: 1, current: 0, completed: false, isFav: false }
  ],
  daily: [
    { id: 501, text: "لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ", source: "متفق عليه", virtue: "🏰 كنز من كنوز الجنة وتيسير الصعاب وتفريج الهموم", target: 100, current: 0, completed: false, isFav: false },
    { id: 502, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ العَظِيمِ", source: "صحيح البخاري", virtue: "⚖️ خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن", target: 100, current: 0, completed: false, isFav: false },
    { id: 503, text: "أَسْتَغْفِرُ اللَّهَ العَظِيمَ الَّذِي لاَ إِلَهَ إِلاَّ هُوَ الحَيَّ القَيُّومَ وَأَتُوبُ إِلَيْهِ", source: "سنن الترمذي", virtue: "🌧️ غُفرت ذنوبه وإن كان فر من الزحف، واستجلاب للرزق", target: 100, current: 0, completed: false, isFav: false },
    { id: 504, text: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ", source: "صحيح الترغيب", virtue: "🌺 كفاية الهموم وغفران الذنوب ونيل الشفاعة يوم القيامة", target: 100, current: 0, completed: false, isFav: false },
    { id: 505, text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", source: "متفق عليه", virtue: "👑 كانت له عدل عشر رقاب، وكُتبت له مائة حسنة ومُحيت عنه مائة سيئة", target: 100, current: 0, completed: false, isFav: false },
    { id: 506, text: "سُبْحَانَ اللَّهِ، وَالحَمْدُ لِلَّهِ، وَلاَ إِلَهَ إِلاَّ اللَّهُ، وَاللَّهُ أَكْبَرُ", source: "صحيح مسلم", virtue: "✨ أحب الكلام إلى الله وغرسٌ للجنة", target: 100, current: 0, completed: false, isFav: false },
    { id: 507, text: "حَسْبُنَا اللَّهُ وَنِعْمَ الوَكِيلُ", source: "صحيح البخاري", virtue: "🛡️ الأمان ونصرة المظلوم والكفاية عند الخوف والشدة", target: 100, current: 0, completed: false, isFav: false },
    { id: 508, text: "لاَ إِلَهَ إِلاَّ أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", source: "سنن الترمذي (دعوة ذي النون)", virtue: "💡 لم يدعُ بها رجل مسلم في شيء قط إلا استجاب الله له", target: 100, current: 0, completed: false, isFav: false },
    { id: 509, text: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ العَفْوَ فَاعْفُ عَنِّي", source: "سنن الترمذي", virtue: "🌿 أعظم دعاء لطلب العفو والمغفرة والسلامة", target: 50, current: 0, completed: false, isFav: false },
    { id: 510, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الهُدَى وَالتُّقَى وَالعَفَافَ وَالغِنَى", source: "صحيح مسلم", virtue: "💎 من أجمع الدعوات للخير والصلاح والغنى عن الناس", target: 33, current: 0, completed: false, isFav: false },
    { id: 511, text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", source: "متفق عليه", virtue: "🌟 أكَثَرُ دُعَاءِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", target: 33, current: 0, completed: false, isFav: false },
    { id: 512, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", source: "صحيح مسلم", virtue: "🌊 حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ (100 مرة)", target: 100, current: 0, completed: false, isFav: false },
    { id: 513, text: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", source: "سنن أبي داود", virtue: "🤲 الطلب والعون من الله للثبات على الطاعة", target: 33, current: 0, completed: false, isFav: false },
    { id: 514, text: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ", source: "سنن أبي داود", virtue: "🌧️ كان يُعد للرسول في المجلس الواحد مائة مرة", target: 100, current: 0, completed: false, isFav: false },
    { id: 515, text: "اللَّهُمَّ يَا مُقَلِّبَ القُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ", source: "سنن الترمذي", virtue: "❤️ تثبيت القلب على الإيمان والتسامي عن الفتن", target: 33, current: 0, completed: false, isFav: false },
    { id: 516, text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", source: "سورة طه - الآيتان 25-26", virtue: "🕊️ انشراح الصدر وتيسير الأمور والمهام الصعبة", target: 33, current: 0, completed: false, isFav: false },
    { id: 517, text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الهَمِّ وَالحَزَنِ، وَالعَجْزِ وَالكَسَلِ، وَالبُخْلِ وَالجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", source: "صحيح البخاري", virtue: "🛡️ تفريج الهموم والوقاية من الدين والكسل", target: 10, current: 0, completed: false, isFav: false },
    { id: 518, text: "سُبْحَانَ المَلِكِ القُدُّوسِ", source: "سنن النسائي", virtue: "✨ تنزيه الله العظيم وتقديسه", target: 33, current: 0, completed: false, isFav: false },
    { id: 519, text: "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ", source: "صحيح البخاري", virtue: "👼 ابتدرها بضعة وثلاثون ملكاً أيهم يكتبها أول", target: 10, current: 0, completed: false, isFav: false },
    { id: 520, text: "اللَّهُمَّ اكْفِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ", source: "سنن الترمذي", virtue: "💰 قضاء الديون واستجابة الرزق الحلال", target: 33, current: 0, completed: false, isFav: false }
  ]
};

const CATEGORY_NAMES = {
  morning: 'أذكار الصباح',
  evening: 'أذكار المساء',
  prayer: 'أذكار بعد الصلاة',
  sleep: 'أذكار النوم',
  daily: 'الأذكار اليومية العامة',
  favorites: 'الأذكار المفضلة'
};

let dhikrLibrary = {};
let currentCategory = 'morning';
let activeDhikrIndex = 0;
let totalTodayPresses = 0;

function getUserStorageKey(suffix) {
  const userName = localStorage.getItem('userName') || 'guest';
  return `alsiraj_adhkar_${userName}_${suffix}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('userToken');
  const userName = localStorage.getItem('userName');
  const nameDisplay = document.getElementById('userNameDisplay');
  const avatarDisplay = document.getElementById('userAvatar');

  if (userName && userName !== 'null' && userName !== 'undefined') {
    if (nameDisplay) nameDisplay.textContent = userName;
    // أخذ الحرف الأول، إزالة المسافات، وتحويله لحرف كبير
    if (avatarDisplay) avatarDisplay.textContent = userName.trim().charAt(0).toUpperCase();
  } else {
    // قيم افتراضية في حال عدم تسجيل الدخول
    if (nameDisplay) nameDisplay.textContent = 'مستخدم';
    if (avatarDisplay) avatarDisplay.textContent = 'م';
  }

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const userEl = document.querySelector('.user-name') || document.getElementById('userNameDisplay');
 
  if (userEl && userName) userEl.textContent = userName;

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
    
  });

  const targetDisplay = document.getElementById('targetCountDisplay');
  if (targetDisplay) {
    targetDisplay.style.cursor = 'pointer';
    targetDisplay.title = 'اضغط لتعديل الهدف (التارجت)';
    targetDisplay.addEventListener('click', changeActiveDhikrTarget);
  }

  loadStateFromLocalStorage();
  checkDailyReset();
  initSmartTimeNotice();
  renderCurrentState();
});

// تحديث دالة التصفير اليومي لتتوافق مع معيار الـ 6 صباحاً الخاص بالسيرفر
function checkDailyReset() {
  const now = new Date();
  const currentHour = now.getHours();
  
  // إذا كانت الساعة أقل من 6 صباحاً، نعتبر أننا في اليوم السابق
  if (currentHour < 6) {
    now.setDate(now.getDate() - 1);
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`; // صيغة YYYY-MM-DD المطابقة للسيرفر

  const lastResetKey = getUserStorageKey('last_reset');
  const lastReset = localStorage.getItem(lastResetKey);

  if (lastReset !== todayStr) {
    Object.keys(dhikrLibrary).forEach(cat => {
      dhikrLibrary[cat].forEach(d => {
        d.current = 0;
        d.completed = false;
      });
    });
    totalTodayPresses = 0;
    localStorage.setItem(lastResetKey, todayStr);
    saveStateToLocalStorage();
    
    // إرسال التصفير الجديد للسيرفر فوراً لإعادة الداشبورد إلى 0%
    syncAdhkarWithServer(0, 100); 
  }
}

// دالة جديدة لإرسال إجمالي تقدم أذكار اليوم الحالي إلى قاعدة البيانات بأمان
async function syncAdhkarWithServer() {
  const token = localStorage.getItem('userToken');
  if (!token) return;

  // حساب النسبة المئوية لإنجاز اليوم بالمعادلة الرباعية الصحيحة المعتمدة لديكِ
  const currentOverallPercentage = calculateOverallAdhkarProgress();

  try {
    // الاتصال بالـ API الذي قمنا بتأمينه وتجهيزه في ملف السيرفر app.js
    const response = await fetch('/api/update-adhkar-progress', {
      method: 'POST',
       // حدّثي كود الـ body داخل دالة syncAdhkarWithServer بملف adhkar.js ليرسل القيم متكاملة
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // إضافة التوكن للتحقق من هوية المستخدم
      },
        // حدّثي سطر الـ body فقط داخل دالة syncAdhkarWithServer بملف adhkar.js
    body: JSON.stringify({
    percent: currentOverallPercentage,       // إرسال النسبة الصافية صراحة (مثلاً: 25)
    completedCount: currentOverallPercentage,
    totalCount: 100
   })


    });

    if (response.ok) {
      console.log(`تمت مزامنة تقدم الأذكار (${currentOverallPercentage}%) مع السيرفر و MongoDB بنجاح ✅`);
    } else {
      console.error("فشل السيرفر في استقبال وتثبيت تحديث الأذكار");
    }
  } catch (error) {
    console.error("خطأ شبكة أثناء مزامنة الأذكار مع قاعدة البيانات:", error);
  }
}

function saveStateToLocalStorage() {
  localStorage.setItem(getUserStorageKey('data'), JSON.stringify(dhikrLibrary));
  localStorage.setItem(getUserStorageKey('meta'), JSON.stringify({
    category: currentCategory,
    index: activeDhikrIndex,
    totalPresses: totalTodayPresses
  }));
}

function loadStateFromLocalStorage() {
  const savedData = localStorage.getItem(getUserStorageKey('data'));
  const savedMeta = localStorage.getItem(getUserStorageKey('meta'));

  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      
      Object.keys(defaultDhikrLibrary).forEach(cat => {
        if (!parsedData[cat]) {
          parsedData[cat] = [...defaultDhikrLibrary[cat]];
        } else {
          // تحديث النص والمصدر والفضل للأذكار الحالية من الكود مباشرة
          parsedData[cat].forEach(item => {
            const defaultItem = defaultDhikrLibrary[cat]?.find(d => d.id === item.id);
            if (defaultItem) {
              item.text = defaultItem.text;
              item.source = defaultItem.source;
              item.virtue = defaultItem.virtue;
            }
          });

          // دمج الأذكار الجديدة التي لم تكن موجودة سابقاً
          const existingIds = new Set(parsedData[cat].map(d => d.id));
          defaultDhikrLibrary[cat].forEach(defaultDhikr => {
            if (!existingIds.has(defaultDhikr.id)) {
              parsedData[cat].push({ ...defaultDhikr });
            }
          });
        }
      });
      dhikrLibrary = parsedData;
    } catch (e) {
      dhikrLibrary = JSON.parse(JSON.stringify(defaultDhikrLibrary));
    }
  } else {
    dhikrLibrary = JSON.parse(JSON.stringify(defaultDhikrLibrary));
  }

  if (savedMeta) {
    const meta = JSON.parse(savedMeta);
    currentCategory = meta.category || 'morning';
    activeDhikrIndex = meta.index || 0;
    totalTodayPresses = meta.totalPresses || 0;
  }
}

function initSmartTimeNotice() {
  const hour = new Date().getHours();
  const banner = document.getElementById('timeNoticeBanner');
  const text = document.getElementById('timeNoticeText');
  const btn = document.getElementById('timeNoticeBtn');

  if (!banner) return;

  let timeCat = '';
  let msg = '';

  if (hour >= 5 && hour < 12) {
    timeCat = 'morning';
    msg = "☀️ حان وقت أذكار الصباح لتستفتح يومك بالبركة والحفظ.";
  } else if (hour >= 16 && hour < 21) {
    timeCat = 'evening';
    msg = "🌙 حان وقت أذكار المساء لتنال السكينة والطمأنينة.";
  } else if (hour >= 21 || hour < 4) {
    timeCat = 'sleep';
    msg = "🪔 وقت النوم! لا تنسَ أذكار النوم لتنام في حفظ الله.";
  }

  if (timeCat) {
    const catList = dhikrLibrary[timeCat] || [];
    const isCatDone = catList.length > 0 && catList.every(d => d.completed);

    if (!isCatDone) {
      text.textContent = msg;
      btn.setAttribute('onclick', `switchCategory('${timeCat}', document.querySelector('.cat-link[onclick*=\\'${timeCat}\\']'))`);
      banner.classList.remove('hidden');
      return;
    }
  }

  banner.classList.add('hidden');
}

function switchCategory(catKey, element) {
  currentCategory = catKey;
  activeDhikrIndex = 0;

  saveStateToLocalStorage();
  renderCurrentState();
}

function renderCurrentState() {
  const catTitle = document.getElementById('categoryTitle');
  if (catTitle) {
    catTitle.textContent = CATEGORY_NAMES[currentCategory] || 'الأذكار';
  }

  document.querySelectorAll('.cat-link').forEach(link => {
    const isCurrent = link.getAttribute('onclick')?.includes(`'${currentCategory}'`);
    if (isCurrent) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  let list = getActiveList();
  const checklistContainer = document.getElementById('checklistContainer');
  checklistContainer.innerHTML = '';

  if (list.length === 0) {
    checklistContainer.innerHTML = '<p style="font-size:13px; color:#777; padding:12px; text-align:center;">لا توجد أذكار في هذه القائمة.</p>';
    loadDhikrToFocus(null);
    updateDynamicStats();
    return;
  }

  if (activeDhikrIndex >= list.length) activeDhikrIndex = 0;

  list.forEach((item, idx) => {
    const isSelected = idx === activeDhikrIndex;
    const itemEl = document.createElement('div');
    itemEl.className = `check-item ${isSelected ? 'active' : ''} ${item.completed ? 'completed' : ''}`;
    itemEl.onclick = () => selectDhikr(idx);

    const iconClass = item.completed ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
    const tagText = item.completed ? '✓ مكتمل' : `${item.target} / ${item.current}`;

    itemEl.innerHTML = `
      <div class="check-left">
        <i class="${iconClass} check-box-icon"></i>
        <span class="check-text">${item.text}</span>
      </div>
      <span class="check-count-tag" onclick="event.stopPropagation(); changeTargetById(${item.id})" title="اضغط لتعديل الهدف">
        ${tagText} <i class="fa-solid fa-pen" style="font-size: 9px; margin-right: 3px; opacity: 0.7;"></i>
      </span>
    `;
    checklistContainer.appendChild(itemEl);
  });

  loadDhikrToFocus(list[activeDhikrIndex]);
  updateDynamicStats();
  checkCategoryCompletion();
}

function getActiveList() {
  if (currentCategory === 'favorites') {
    return Object.values(dhikrLibrary).flat().filter(d => d.isFav);
  }
  return dhikrLibrary[currentCategory] || [];
}

function selectDhikr(index) {
  activeDhikrIndex = index;
  saveStateToLocalStorage();
  renderCurrentState();
}

function loadDhikrToFocus(item) {
  if (!item) {
    document.getElementById('dhikrVirtue').textContent = "";
    document.getElementById('dhikrMainText').textContent = "لا يوجد ذكر يعرض حالياً";
    document.getElementById('dhikrSource').textContent = "";
    document.getElementById('currentCountDisplay').textContent = 0;
    document.getElementById('targetCountDisplay').textContent = 0;
    return;
  }

  document.getElementById('dhikrVirtue').textContent = item.virtue || "";
  document.getElementById('dhikrMainText').textContent = `"${item.text}"`;
  document.getElementById('dhikrSource').textContent = item.source || "";
  document.getElementById('currentCountDisplay').textContent = item.current;
  document.getElementById('targetCountDisplay').textContent = item.target;

  const favIcon = document.getElementById('favIcon');
  const favText = document.getElementById('favText');
  if (item.isFav) {
    favIcon.className = 'fa-solid fa-star icon-gold';
    favText.textContent = 'في المفضلة';
  } else {
    favIcon.className = 'fa-regular fa-star';
    favText.textContent = 'حفظ في المفضلة';
  }
}

function changeActiveDhikrTarget() {
  let list = getActiveList();
  let item = list[activeDhikrIndex];
  if (!item) return;

  const newTargetPrompt = prompt("أدخل الهدف الجديد للذكر (العدد المطلوب):", item.target);
  if (newTargetPrompt !== null && !isNaN(newTargetPrompt) && Number(newTargetPrompt) > 0) {
    item.target = parseInt(newTargetPrompt, 10);
    if (item.current >= item.target) {
      item.current = item.target;
      item.completed = true;
    } else {
      item.completed = false;
    }
    saveStateToLocalStorage();
    renderCurrentState();
  }
}

function changeTargetById(id) {
  const allDhikrs = Object.values(dhikrLibrary).flat();
  const item = allDhikrs.find(d => d.id === id);
  if (!item) return;

  const newTargetPrompt = prompt(`أدخل الهدف الجديد لهذا الذكر:`, item.target);
  if (newTargetPrompt !== null && !isNaN(newTargetPrompt) && Number(newTargetPrompt) > 0) {
    item.target = parseInt(newTargetPrompt, 10);
    if (item.current >= item.target) {
      item.current = item.target;
      item.completed = true;
    } else {
      item.completed = false;
    }
    saveStateToLocalStorage();
    renderCurrentState();
  }
}

// أ. دالة الزيادة
function incrementCounter() {
  let list = getActiveList();
  let item = list[activeDhikrIndex];
  if (!item || item.completed) return;

  item.current++;
  totalTodayPresses++;
  if (item.current >= item.target) {
    item.current = item.target;
    item.completed = true;
  }

  saveStateToLocalStorage();
  renderCurrentState();
  
  // 🌟 الربط الفوري: إرسال النسبة المحدثة للسيرفر مع كل ضغطة ذكر
  syncAdhkarWithServer(); 
}

// ب. دالة النقصان
function decrementCounter() {
  let list = getActiveList();
  let item = list[activeDhikrIndex];
  if (!item || item.current <= 0) return;

  item.current--;
  item.completed = false;

  saveStateToLocalStorage();
  renderCurrentState();
  
  // 🌟 الربط الفوري عند التراجع
  syncAdhkarWithServer(); 
}

// ج. دالة تصفير العداد للذكر الحالي
function resetCounter() {
  let list = getActiveList();
  let item = list[activeDhikrIndex];
  if (!item) return;
  
  item.current = 0;
  item.completed = false;

  saveStateToLocalStorage();
  renderCurrentState();
  
  // 🌟 الربط الفوري عند إعادة التصفير
  syncAdhkarWithServer(); 
}


function goToNextDhikr() {
  let list = getActiveList();
  if (activeDhikrIndex < list.length - 1) {
    activeDhikrIndex++;
  } else {
    activeDhikrIndex = 0;
  }
  saveStateToLocalStorage();
  renderCurrentState();
}

function checkCategoryCompletion() {
  const list = getActiveList();
  const banner = document.getElementById('completionBanner');
  const msg = document.getElementById('completionMsg');

  if (list.length > 0 && list.every(d => d.completed)) {
    const catName = CATEGORY_NAMES[currentCategory] || 'الأذكار';
    msg.textContent = `بارك الله فيك وتقبل الله طاعتك! أتممت كافة ${catName} بنجاح ✨`;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

function toggleFavorite() {
  let list = getActiveList();
  let item = list[activeDhikrIndex];

  if (item) {
    item.isFav = !item.isFav;
    saveStateToLocalStorage();
    renderCurrentState();
  }
}

function calculateOverallAdhkarProgress() {
  const getCatRatio = (keys) => {
    let total = 0, completed = 0;
    keys.forEach(k => {
      const arr = dhikrLibrary[k] || [];
      total += arr.length;
      completed += arr.filter(d => d.completed).length;
    });
    return total > 0 ? (completed / total) : 0;
  };

  const morningPart = getCatRatio(['morning']) * 25;
  const eveningPart = getCatRatio(['evening']) * 25;
  const sleepPart = getCatRatio(['sleep']) * 25;
  const otherPart = getCatRatio(['prayer', 'daily']) * 25;

  return Math.round(morningPart + eveningPart + sleepPart + otherPart);
}

function updateDynamicStats() {
  const allDhikrs = Object.values(dhikrLibrary).flat();
  document.getElementById('totalCountToday').textContent = totalTodayPresses;

  const completedToday = allDhikrs.filter(d => d.completed).length;
  document.getElementById('completedDhikrCount').textContent = completedToday;

  const totalFavs = allDhikrs.filter(d => d.isFav).length;
  document.getElementById('favCount').textContent = totalFavs;

  const percentage = calculateOverallAdhkarProgress();
  document.getElementById('progressPercent').textContent = `${percentage}%`;

  const progressCircle = document.getElementById('radialProgress');
  if (progressCircle) {
    const degrees = (percentage / 100) * 360;
    progressCircle.style.background = `conic-gradient(var(--primary-green) ${degrees}deg, var(--border-color) ${degrees}deg)`;
  }
}

function handleSearch(query) {
  if (!query.trim()) {
    renderCurrentState();
    return;
  }

  const container = document.getElementById('checklistContainer');
  const allDhikrs = Object.values(dhikrLibrary).flat();
  const results = allDhikrs.filter(d => d.text.includes(query.trim()));

  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = '<p style="font-size:12px; color:#888; padding:10px;">لا توجد نتائج.</p>';
    return;
  }

  results.forEach((item) => {
    const itemEl = document.createElement('div');
    itemEl.className = `check-item ${item.completed ? 'completed' : ''}`;
    itemEl.onclick = () => loadDhikrToFocus(item);

    itemEl.innerHTML = `
      <div class="check-left">
        <i class="fa-solid fa-magnifying-glass check-box-icon"></i>
        <span class="check-text">${item.text}</span>
      </div>
      <span class="check-count-tag" onclick="event.stopPropagation(); changeTargetById(${item.id})" title="اضغط لتعديل الهدف">
        ${item.completed ? '✓ مكتمل' : `${item.target} / ${item.current}`} <i class="fa-solid fa-pen" style="font-size: 9px; margin-right: 3px; opacity: 0.7;"></i>
      </span>
    `;
    container.appendChild(itemEl);
  });
}

function toggleShareMenu() {
  document.getElementById('shareMenu').classList.toggle('hidden');
}

function copyDhikrText() {
  const text = document.getElementById('dhikrMainText').textContent;
  navigator.clipboard.writeText(text);
  alert('تم نسخ الذكر بنجاح');
  toggleShareMenu();
}

function shareDhikr() {
  const text = document.getElementById('dhikrMainText').textContent;
  if (navigator.share) {
    navigator.share({ title: 'ذكر من تطبيق السراج', text: text });
  } else {
    copyDhikrText();
  }
}