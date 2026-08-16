import React from 'react';

export interface ChannelBrandInfo {
  bgColor: string;
  gradient: string;
  accentColor: string;
  badgeColor?: string;
  textLogo: string;
  subtitle: string;
  customSvgLogo?: string; // Optional raw SVG string or indicator
}

export const CHANNEL_BRANDS: Record<string, ChannelBrandInfo> = {
  'tv-trt1': {
    bgColor: '#111827',
    gradient: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #b91c1c 140%)',
    accentColor: '#ef4444',
    textLogo: 'TRT 1',
    subtitle: 'TÜRKİYE'
  },
  'tv-atv': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #27272a 50%, #c2410c 140%)',
    accentColor: '#f97316',
    textLogo: 'atv',
    subtitle: 'DİZİ & HABER'
  },
  'tv-kanald': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e3a8a 60%, #3b82f6 140%)',
    accentColor: '#3b82f6',
    textLogo: 'KANAL D',
    subtitle: 'TÜRKİYE\'NİN KANALI'
  },
  'tv-showtv': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #581c87 50%, #db2777 130%)',
    accentColor: '#ec4899',
    textLogo: 'SHOW',
    subtitle: 'SHOW TV'
  },
  'tv-startv': {
    bgColor: '#09090b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #ca8a04 140%)',
    accentColor: '#eab308',
    textLogo: '★ STAR',
    subtitle: 'STAR TV'
  },
  'tv-tv8': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #18181b 0%, #450a0a 60%, #dc2626 140%)',
    accentColor: '#ef4444',
    textLogo: 'tv8',
    subtitle: 'EĞLENCE KANALI'
  },
  'tv-kanal7': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #030712 0%, #0369a1 60%, #06b6d4 140%)',
    accentColor: '#06b6d4',
    textLogo: 'KANAL 7',
    subtitle: 'HAYATIN TÜM RENKLERİ'
  },
  'tv-teve2': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #6b21a8 70%, #c084fc 140%)',
    accentColor: '#a855f7',
    textLogo: 'teve2',
    subtitle: 'EĞLENCE & SİNEMA'
  },
  'tv-beyaztv': {
    bgColor: '#111827',
    gradient: 'linear-gradient(135deg, #030712 0%, #1f2937 70%, #991b1b 140%)',
    accentColor: '#ef4444',
    textLogo: 'BEYAZ TV',
    subtitle: 'BEYAZ TV'
  },
  'tv-trthaber': {
    bgColor: '#450a0a',
    gradient: 'linear-gradient(135deg, #18181b 0%, #7f1d1d 60%, #dc2626 130%)',
    accentColor: '#dc2626',
    textLogo: 'TRT HABER',
    subtitle: 'DOĞRU HABER'
  },
  'tv-ahaber': {
    bgColor: '#450a0a',
    gradient: 'linear-gradient(135deg, #09090b 0%, #881337 60%, #e11d48 130%)',
    accentColor: '#e11d48',
    textLogo: 'a HABER',
    subtitle: 'TÜRKİYE\'NİN HABERİ'
  },
  'tv-haberturk': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #991b1b 60%, #ef4444 140%)',
    accentColor: '#ef4444',
    textLogo: 'HABERTÜRK',
    subtitle: 'DOĞRU & HIZLI'
  },
  'tv-cnnturk': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #000000 0%, #450a0a 60%, #cc0000 140%)',
    accentColor: '#cc0000',
    textLogo: 'CNN TÜRK',
    subtitle: 'İLK BİLEN SİZ OLUN'
  },
  'tv-ntv': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e3a8a 60%, #0284c7 140%)',
    accentColor: '#0284c7',
    textLogo: 'NTV',
    subtitle: 'HABER MERKEZİ'
  },
  'tv-halktv': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #7f1d1d 60%, #dc2626 130%)',
    accentColor: '#dc2626',
    textLogo: 'HALK TV',
    subtitle: 'HALKIN HABERİ'
  },
  'tv-tv100': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 60%, #3b82f6 130%)',
    accentColor: '#3b82f6',
    textLogo: 'tv100',
    subtitle: 'HABER & GÜNDEM'
  },
  'tv-tele1': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #030712 0%, #581c87 60%, #e11d48 130%)',
    accentColor: '#e11d48',
    textLogo: 'TELE1',
    subtitle: 'GERÇEKLERİN EKRANI'
  },
  'tv-tgrthaber': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e3a8a 60%, #dc2626 140%)',
    accentColor: '#dc2626',
    textLogo: 'TGRT HABER',
    subtitle: 'HABERİN ÖNCÜSÜ'
  },
  'tv-ulketv': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e40af 70%, #60a5fa 140%)',
    accentColor: '#3b82f6',
    textLogo: 'ÜLKE TV',
    subtitle: 'ÜLKE TV'
  },
  'tv-bloomberght': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #431407 60%, #ea580c 130%)',
    accentColor: '#ea580c',
    textLogo: 'Bloomberg HT',
    subtitle: 'PİYASALAR & EKONOMİ'
  },
  'tv-apara': {
    bgColor: '#064e3b',
    gradient: 'linear-gradient(135deg, #022c22 0%, #065f46 60%, #10b981 130%)',
    accentColor: '#10b981',
    textLogo: 'a PARA',
    subtitle: 'EKONOMİ KANALI'
  },
  'tv-trtspor': {
    bgColor: '#064e3b',
    gradient: 'linear-gradient(135deg, #022c22 0%, #14532d 60%, #22c55e 140%)',
    accentColor: '#22c55e',
    textLogo: 'TRT SPOR',
    subtitle: 'CANLI SPOR'
  },
  'tv-aspor': {
    bgColor: '#064e3b',
    gradient: 'linear-gradient(135deg, #022c22 0%, #047857 60%, #10b981 140%)',
    accentColor: '#10b981',
    textLogo: 'a SPOR',
    subtitle: 'SPORUN ADRESİ'
  },
  'tv-trtbelgesel': {
    bgColor: '#1c1917',
    gradient: 'linear-gradient(135deg, #0c0a09 0%, #44403c 60%, #ca8a04 140%)',
    accentColor: '#eab308',
    textLogo: 'TRT BELGESEL',
    subtitle: 'DÜNYAYI KEŞFET'
  },
  'tv-trt2': {
    bgColor: '#1e1b4b',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #312e81 60%, #818cf8 140%)',
    accentColor: '#818cf8',
    textLogo: 'TRT 2',
    subtitle: 'KÜLTÜR & SANAT'
  },
  'tv-trtcocuk': {
    bgColor: '#713f12',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 50%, #f59e0b 120%)',
    accentColor: '#f59e0b',
    textLogo: 'TRT ÇOCUK',
    subtitle: 'EĞLENCELİ ÇOCUK DÜNYASI'
  },
  'tv-minikacocuk': {
    bgColor: '#831843',
    gradient: 'linear-gradient(135deg, #4a044e 0%, #be185d 60%, #fb7185 130%)',
    accentColor: '#f43f5e',
    textLogo: 'minika ÇOCUK',
    subtitle: 'MİNİKLERİN DÜNYASI'
  },
  'tv-minikago': {
    bgColor: '#7c2d12',
    gradient: 'linear-gradient(135deg, #431407 0%, #c2410c 60%, #f97316 130%)',
    accentColor: '#f97316',
    textLogo: 'minika GO',
    subtitle: 'MACERA VE EĞLENCE'
  },
  'tv-kralpoptv': {
    bgColor: '#3b0764',
    gradient: 'linear-gradient(135deg, #09090b 0%, #581c87 60%, #d946ef 140%)',
    accentColor: '#d946ef',
    textLogo: 'KRAL POP',
    subtitle: 'POP MÜZİĞİN KRALI'
  },
  'tv-dreamturk': {
    bgColor: '#4c0519',
    gradient: 'linear-gradient(135deg, #18181b 0%, #831843 60%, #ec4899 140%)',
    accentColor: '#ec4899',
    textLogo: 'DREAM TÜRK',
    subtitle: 'TÜRKÇE MÜZİK'
  },
  'tv-trtmuzik': {
    bgColor: '#134e4a',
    gradient: 'linear-gradient(135deg, #042f2e 0%, #115e59 60%, #14b8a6 140%)',
    accentColor: '#14b8a6',
    textLogo: 'TRT MÜZİK',
    subtitle: 'MÜZİK ZİYAFETİ'
  },
  'tv-redbull': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e1b4b 60%, #e11d48 130%)',
    accentColor: '#e11d48',
    textLogo: 'Red Bull TV',
    subtitle: 'ACTION & SPORTS'
  },
  'tv-aljazeera': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #422006 60%, #d97706 130%)',
    accentColor: '#f59e0b',
    textLogo: 'AL JAZEERA',
    subtitle: 'GLOBAL NEWS'
  },
  'tv-france24': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e3a8a 60%, #38bdf8 130%)',
    accentColor: '#0ea5e9',
    textLogo: 'FRANCE 24',
    subtitle: 'INTERNATIONAL NEWS'
  },
  'tv-dw-eng': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #0369a1 60%, #38bdf8 140%)',
    accentColor: '#0284c7',
    textLogo: 'DW',
    subtitle: 'MADE FOR MINDS'
  },
  'tv-skynews-uk': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #7f1d1d 60%, #ef4444 140%)',
    accentColor: '#ef4444',
    textLogo: 'sky news',
    subtitle: 'BREAKING NEWS'
  },
  'tv-nasatv': {
    bgColor: '#030712',
    gradient: 'linear-gradient(135deg, #020617 0%, #172554 60%, #3b82f6 140%)',
    accentColor: '#3b82f6',
    textLogo: 'NASA TV',
    subtitle: 'SPACE & SCIENCE'
  },

  // RADIOS
  'radio-trtfm': {
    bgColor: '#450a0a',
    gradient: 'linear-gradient(135deg, #18181b 0%, #7f1d1d 60%, #dc2626 130%)',
    accentColor: '#ef4444',
    textLogo: 'TRT FM',
    subtitle: 'TÜRKİYE\'NİN RADYOSU'
  },
  'radio-powerturk': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #450a0a 60%, #ef4444 130%)',
    accentColor: '#ef4444',
    textLogo: 'PowerTürk',
    subtitle: 'ÖNCE MÜZİK'
  },
  'radio-joyfm': {
    bgColor: '#3b0764',
    gradient: 'linear-gradient(135deg, #18181b 0%, #4c0519 60%, #f43f5e 130%)',
    accentColor: '#f43f5e',
    textLogo: 'Joy FM',
    subtitle: 'EASY LISTENING & SLOW'
  },
  'radio-virgin': {
    bgColor: '#450a0a',
    gradient: 'linear-gradient(135deg, #09090b 0%, #881337 60%, #e11d48 130%)',
    accentColor: '#e11d48',
    textLogo: 'Virgin Radio',
    subtitle: 'TÜRKİYE HİT MÜZİK'
  },
  'radio-metrofm': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e3a8a 60%, #06b6d4 130%)',
    accentColor: '#06b6d4',
    textLogo: 'Metro FM',
    subtitle: 'EN İYİ YABANCI MÜZİK'
  },
  'radio-powerfm': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #431407 60%, #f97316 130%)',
    accentColor: '#f97316',
    textLogo: 'Power FM',
    subtitle: 'THE POWER OF MUSIC'
  },
  'radio-superfm': {
    bgColor: '#422006',
    gradient: 'linear-gradient(135deg, #18181b 0%, #713f12 60%, #eab308 130%)',
    accentColor: '#eab308',
    textLogo: 'Süper FM',
    subtitle: 'EN İYİ TÜRKÇE POP'
  },
  'radio-kexp': {
    bgColor: '#1c1917',
    gradient: 'linear-gradient(135deg, #0c0a09 0%, #292524 60%, #d97706 130%)',
    accentColor: '#d97706',
    textLogo: 'KEXP 90.3',
    subtitle: 'WHERE MUSIC MATTERS'
  }
};

export function getChannelBrand(id: string, name: string, type: 'tv' | 'radio'): ChannelBrandInfo {
  if (CHANNEL_BRANDS[id]) {
    return CHANNEL_BRANDS[id];
  }

  // Generate deterministic gradient for custom channels
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 40) % 360;

  return {
    bgColor: `hsl(${hue1}, 40%, 15%)`,
    gradient: `linear-gradient(135deg, hsl(${hue1}, 50%, 10%) 0%, hsl(${hue1}, 60%, 20%) 60%, hsl(${hue2}, 70%, 35%) 130%)`,
    accentColor: `hsl(${hue1}, 80%, 55%)`,
    textLogo: name,
    subtitle: type === 'tv' ? 'CANLI YAYIN' : 'RADYO YAYINI'
  };
}
