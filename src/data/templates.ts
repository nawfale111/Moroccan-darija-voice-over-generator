export interface ScriptTemplate {
  id: string;
  title: string;
  titleAr: string;
  category: 'ecommerce' | 'reels' | 'youtube' | 'realestate' | 'saas';
  language: 'moroccan_darija' | 'modern_standard_arabic';
  recommendedVoice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon';
  recommendedTone: 'hype' | 'professional' | 'dramatic' | 'emotional' | 'sales_driven';
  recommendedRate: number;
  script: string;
  description: string;
}

export const MARKETING_TEMPLATES: ScriptTemplate[] = [
  // Moroccan Darija Templates
  {
    id: 'darija-cod-urgency',
    title: 'E-Commerce COD Flash Sale',
    titleAr: 'إعلان تجارة إلكترونية - الدفع عند الاستلام',
    category: 'ecommerce',
    language: 'moroccan_darija',
    recommendedVoice: 'Puck', // Amine
    recommendedTone: 'sales_driven',
    recommendedRate: 1.15,
    description: 'High-converting TikTok/Reels promo with COD and free delivery hook across Morocco.',
    script:
      'واش باقي كتعاني من هاد المشكل كل نهار؟ [وقفة قصيرة] دابا الحل وصل بين يديك! هاد المنتج الأكثر مبيعاً فهاد الشهر جا باش يسهل عليك حياتك. والخبر الزوين؟ التوصيل فابور حتى لباب دارك فجميع مدن المغرب، وما تخلص حتى تقلب سلعتك بعينيك! الكمية قربت تسالي، كليكي دابا على الرابط لتحت وطلب ديالك قبل ما يفوت الفوت!',
  },
  {
    id: 'darija-reels-hype',
    title: 'TikTok Viral Drop Hook',
    titleAr: 'هوك تيك توك حماسي سريع',
    category: 'reels',
    language: 'moroccan_darija',
    recommendedVoice: 'Puck', // Amine
    recommendedTone: 'hype',
    recommendedRate: 1.25,
    description: 'Fast-paced viral product drop hook with maximum energy for short-form ads.',
    script:
      'حبس عندك! [تركيز] ما تزكلوش هاد الفيديو! جربتي شحال من حاجة وما عجباتكش؟ شوف معايا هاد المفاجأة! هاد البرودوي داير ضجة كبيرة فالمغرب دابا، ودايرين عليه تخفيض ديال خمسين فالمية لأول خمسين واحد غادي يطلب. شنو كتسنى؟ دخل دابا قبل ما يسالي الستوك!',
  },
  {
    id: 'darija-beauty-warm',
    title: 'Cosmetics & Skincare Sincere Ad',
    titleAr: 'إعلان مستحضرات التجميل والعناية',
    category: 'ecommerce',
    language: 'moroccan_darija',
    recommendedVoice: 'Kore', // Yasmin
    recommendedTone: 'emotional',
    recommendedRate: 0.95,
    description: 'Soft, trustworthy, and persuasive cosmetic review tone in Darija.',
    script:
      'بشرتك كتستاهل أحسن عناية طبيعية. [وقفة قصيرة] من بعد ما جربت بزاف ديال المنتجات، لقيت هاد السيروم السحري لي رجع لوجهي النضارة والإشراقة من أول أسبوع. طبيعي مية فالمية ومضمون، وما فيه حتى مواد ضارة. كليكي لتحت وشوفي آراء الزبائن لي جربوه!',
  },
  {
    id: 'darija-restaurant-food',
    title: 'Food & Burger Craving Promo',
    titleAr: 'إعلان مطعم وبرغر تشويقي',
    category: 'ecommerce',
    language: 'moroccan_darija',
    recommendedVoice: 'Charon', // Karim
    recommendedTone: 'hype',
    recommendedRate: 1.1,
    description: 'Mouth-watering Darija food delivery and restaurant reel script.',
    script:
      'شهوة فبرغر مقرمش ومعلك بالفرماج كيذوب فالفم؟ [وقفة قصيرة] مطعمنا وجد ليك أقوى عرض فهاد الويكاند! خذ جوج برغرات والثالث فابور مع البطاطا ومشروب بارد. التوصيل سخون وسريع حتى لباب الدار. دخل دابا لكوموندي فدقيقة وتمتع بالمذاق!',
  },
  {
    id: 'darija-agency-b2b',
    title: 'Digital Marketing Agency Offer',
    titleAr: 'عرض وكالة إعلانات وتسويق رقمي',
    category: 'saas',
    language: 'moroccan_darija',
    recommendedVoice: 'Zephyr', // Leila
    recommendedTone: 'professional',
    recommendedRate: 1.05,
    description: 'Professional B2B Darija pitch tailored for business owners and startups in Morocco.',
    script:
      'واش باغي تزيد المبيعات ديال متجرك الإلكتروني وتدوبل الأرباح؟ وكالة ديجيتال بلوس كترافقك من الصفر: حملات إعلانية احترافية، استهداف دقيق، وتصاميم كتجيب نتائج حقيقية. حجز استشارتك المجانية دابا وتواصل مع الخبراء ديالنا!',
  },

  // Modern Standard Arabic Templates
  {
    id: 'arabic-ecommerce-urgency',
    title: 'Premium E-Commerce Flash Sale',
    titleAr: 'إعلان فصحى - تخفيضات كبرى محدودة',
    category: 'ecommerce',
    language: 'modern_standard_arabic',
    recommendedVoice: 'Fenrir', // Tariq
    recommendedTone: 'sales_driven',
    recommendedRate: 1.1,
    description: 'Urgent, high-trust Arabic voiceover for regional e-commerce campaigns.',
    script:
      'فُرْصَتُك الكُبْرَى قَد وَصَلَت! [وقفة قصيرة] لِفَتْرَةٍ مَحْدُودَةٍ جِدّاً، احْصُلْ عَلَى هَذَا المُنْتَجِ الحَصْرِي بِخَصْمٍ يَصِلُ إِلَى خَمْسِينَ بِالمِئَة. جَوْدَةٌ عَالِيَةٌ تَسْتَحِقُّ ثِقَتَكُم، مَعَ شَحْنٍ سَرِيعٍ وَضَمَانٍ شَامِلٍ لِمُدَّةِ عَام. لَا تُفَوِّتِ الفُرْصَة، انْقُرْ عَلَى الرَّابِطِ وَاطْلُبْ الآن قَبْلَ نَفَادِ الكَمِّيَّة!',
  },
  {
    id: 'arabic-luxury-realestate',
    title: 'Luxury Real Estate & Living',
    titleAr: 'إعلان عقاري راقي وسينمائي',
    category: 'realestate',
    language: 'modern_standard_arabic',
    recommendedVoice: 'Fenrir', // Tariq
    recommendedTone: 'dramatic',
    recommendedRate: 0.9,
    description: 'Cinematic, prestigious narrative tone for luxury developments and private residences.',
    script:
      'حَيْثُ تَلْتَقِي الفَخَامَةُ بِالهُدُوء. [وقفة قصيرة] عِشْ تَجْرِبَةَ الحَيَاةِ العَصْرِيَّةِ فِي قَلْبِ المَدِينَة، مَعَ إِطْلَالَةٍ بَانُورَامِيَّةٍ سَاحِرَة، وَتَصَامِيمَ هَنْدَسِيَّةٍ تُحَاكِي أَرْقَى المَعَايِيرِ العَالَمِيَّة. مَشْرُوعُكَ السَّكَنِيُّ المُسْتَقْبَلِي يَنْتَظِرُك. تَوَاصَلْ مَعَنَا اليَوْم لِحَجْزِ جَوْلَتِكَ الخَاصَّة.',
  },
  {
    id: 'arabic-youtube-hook',
    title: 'YouTube Intrigue & Mystery Hook',
    titleAr: 'مقدمة يوتيوب تشويقية وإثارة',
    category: 'youtube',
    language: 'modern_standard_arabic',
    recommendedVoice: 'Zephyr', // Leila
    recommendedTone: 'dramatic',
    recommendedRate: 1.05,
    description: 'High audience retention YouTube intro hook designed to prevent click-aways.',
    script:
      'هَلْ كُنْتَ تَعْلَمُ أَنَّ مَا سَتَرَاهُ فِي هَذَا الفِيدْيُو قَدْ يُغَيِّرُ نَظْرَتَكَ تَمَاماً؟ [وقفة قصيرة] حَقَائِقُ صَادِمَةٌ لَمْ يَتَحَدَّثْ عَنْهَا أَحَدٌ مِنْ قَبْل، وَالدَّلِيلُ أَمَامَكُم بِالتَّفْصِيل. تَابِعُوا الفِيدْيُو حَتَّى النِّهَايَة، وَلَا تَنْسَوا الِاشْتِرَاك فِي القَنَاة لِمَعْرِفَةِ الحَقِيقَةِ الكَامِلَة!',
  },
  {
    id: 'arabic-saas-professional',
    title: 'SaaS Platform Corporate Explainer',
    titleAr: 'إعلان منصة برمجية وحلول سحابية',
    category: 'saas',
    language: 'modern_standard_arabic',
    recommendedVoice: 'Kore', // Yasmin
    recommendedTone: 'professional',
    recommendedRate: 1.05,
    description: 'Polished, authoritative tech company pitch highlighting efficiency and ROI.',
    script:
      'أَدِرْ أَعْمَالَكَ بِذَكَاءٍ وَكَفَاءَةٍ لَا مَثِيلَ لَهَا. مَنَصَّتُنَا السَّحَابِيَّةُ المُتَطَوِّرَة تَمْنَحُكَ تَحَكُّماً كَامِلاً فِي مَبِيعَاتِكَ، فَرِيقِ عَمَلِكَ، وَتَقَارِيرِكَ المَالِيَّةِ بِلَحَظَات. انْضَمَّ إِلَى آلافِ الشَّرِكَاتِ النَّاجِحَة، وَابْدَأْ تَجْرِبَتَكَ المَجَّانِيَّةَ لِمُدَّةِ أَرْبَعَةَ عَشَرَ يَوْماً الآن.',
  },
  {
    id: 'arabic-hype-sports',
    title: 'Fitness & Sports Motivation Hype',
    titleAr: 'إعلان رياضي وحماسي فائق الطاقة',
    category: 'reels',
    language: 'modern_standard_arabic',
    recommendedVoice: 'Puck', // Amine
    recommendedTone: 'hype',
    recommendedRate: 1.25,
    description: 'Explosive workout / supplement hype script for fitness influencers and brands.',
    script:
      'لَا أَعْذَارَ بَعْدَ اليَوْم! [تركيز] القُوَّةُ تَبْدَأُ مِنْ قَرَارِكَ الآن. تَحَدَّ نَفْسَكَ، حَطِّمْ أَرْقَامَكَ القِيَاسِيَّة، وَاحْصُلْ عَلَى الجِسْمِ الَّذِي طَالَمَا حَلِمْتَ بِه. انْضَمَّ إِلَى تَحَدِّي الشَّهْرِ وَابْدَأْ رِحْلَتَكَ نَحْوَ القِمَّةِ مَعَنَا!',
  },
];
