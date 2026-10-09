export interface VoicePersona {
  id: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon';
  name: string;
  nameAr: string;
  gender: 'female' | 'male';
  tagline: string;
  taglineAr: string;
  bestFor: string;
  bestForAr: string;
  accentNote: string;
  avatarColor: string;
}

export const VOICES: VoicePersona[] = [
  {
    id: 'Kore',
    name: 'Yasmin',
    nameAr: 'ياسمين',
    gender: 'female',
    tagline: 'Warm, clear, and persuasive commercial voice',
    taglineAr: 'صوت دافئ، مقنع، ومريح للأذن',
    bestFor: 'E-commerce, Beauty, Cosmetics, Soft Sell',
    bestForAr: 'المتاجر الإلكترونية، العناية والجمال، الإعلانات الهادئة',
    accentNote: 'Excellent for friendly Darija and clear Arabic',
    avatarColor: 'from-pink-500/20 to-rose-500/20 text-rose-300 border-rose-500/30',
  },
  {
    id: 'Puck',
    name: 'Amine',
    nameAr: 'أمين',
    gender: 'male',
    tagline: 'Energetic, punchy, high-impact youth cadence',
    taglineAr: 'صوت شبابي حماسي سريع وعالي التأثير',
    bestFor: 'TikTok Ads, Viral Drops, Flash Sales, COD Ads',
    bestForAr: 'إعلانات التيك توك والريلز، الدفع عند الاستلام، التخفيضات العاجلة',
    accentNote: 'Perfect for fast-paced Moroccan Darija hype',
    avatarColor: 'from-amber-500/20 to-orange-500/20 text-orange-300 border-orange-500/30',
  },
  {
    id: 'Zephyr',
    name: 'Leila',
    nameAr: 'ليلى',
    gender: 'female',
    tagline: 'Elegant, modern, authoritative corporate presence',
    taglineAr: 'صوت أنيق، واثق، وعصري للمؤسسات والشركات',
    bestFor: 'B2B SaaS, Agency Promos, Tech Explainers',
    bestForAr: 'الشركات التقنية، الخدمات الرقمية، العروض التقديمية',
    accentNote: 'Crisp articulation in both Arabic and Darija',
    avatarColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 'Fenrir',
    name: 'Tariq',
    nameAr: 'طارق',
    gender: 'male',
    tagline: 'Deep, cinematic baritone with powerful gravitas',
    taglineAr: 'صوت عميق وسينمائي فخم يتميز بالهيبة والوقار',
    bestFor: 'Luxury Real Estate, Movie Trailers, Automotive, Storytelling',
    bestForAr: 'العقارات الفاخرة، السيارات، التريلرات السينمائية، السرد القصصي',
    accentNote: 'Commands instant authority and retention',
    avatarColor: 'from-purple-500/20 to-indigo-500/20 text-indigo-300 border-indigo-500/30',
  },
  {
    id: 'Charon',
    name: 'Karim',
    nameAr: 'كريم',
    gender: 'male',
    tagline: 'Trustworthy, friendly, conversational advisor',
    taglineAr: 'صوت موثوق وودود، كصديق يقدم لك نصيحة قيّمة',
    bestFor: 'Product Reviews, Education, Food & Hospitality',
    bestForAr: 'المراجعات، إعلانات المطاعم، الشروحات التعليمية',
    accentNote: 'Natural conversational Darija rhythm',
    avatarColor: 'from-emerald-500/20 to-teal-500/20 text-teal-300 border-teal-500/30',
  },
];

export interface ToneOption {
  id: 'hype' | 'professional' | 'dramatic' | 'emotional' | 'sales_driven';
  label: string;
  labelAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
}

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'sales_driven',
    label: 'Sales-Driven',
    labelAr: 'بيعي وتحفيزي (Sales)',
    icon: '⚡',
    description: 'High conversion urgency, sharp call-to-action, FOMO',
    descriptionAr: 'تركيز على زيادة المبيعات، زر الطلب، وخلق الحافز الفوري',
  },
  {
    id: 'hype',
    label: 'Hype',
    labelAr: 'حماسي ومثير (Hype)',
    icon: '🔥',
    description: 'Energetic, punchy, explosive social media hook',
    descriptionAr: 'طاقة عالية وإيقاع سريع مناسب لتيك توك وإنستغرام',
  },
  {
    id: 'professional',
    label: 'Professional',
    labelAr: 'مهني ورسمي (Corporate)',
    icon: '💼',
    description: 'Crisp, authoritative, executive corporate broadcast',
    descriptionAr: 'نبرة مؤسساتية رصينة وموثوقة تعكس الاحترافية',
  },
  {
    id: 'dramatic',
    label: 'Dramatic',
    labelAr: 'سينمائي ودرامي (Dramatic)',
    icon: '🎬',
    description: 'Deep cinematic tension, resonant pauses, trailer power',
    descriptionAr: 'تشويق وسرد سينمائي مهيب يشد الانتباه حتى النهاية',
  },
  {
    id: 'emotional',
    label: 'Emotional',
    labelAr: 'عاطفي وملهم (Emotional)',
    icon: '❤️',
    description: 'Warm, heartfelt, sincere, empathetic storytelling',
    descriptionAr: 'دفء إنساني يلامس المشاعر ويبني علاقة ثقة قوية',
  },
];
