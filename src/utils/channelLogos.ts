import React from 'react';

export interface ChannelBrandInfo {
  bgColor: string;
  gradient: string;
  accentColor: string;
  badgeColor?: string;
  textLogo: string;
  subtitle: string;
  frequency?: string;
  genreBadge?: string;
  pattern?: 'vinyl' | 'waves' | 'cassette' | 'neon' | 'vintage' | 'acoustic';
  customSvgLogo?: string;
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

  // RADIOS - Bespoke Brand Catalog
  'radio-trtfm': {
    bgColor: '#450a0a',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #7f1d1d 55%, #dc2626 125%)',
    accentColor: '#ef4444',
    textLogo: 'TRT FM',
    subtitle: "TÜRKİYE'NİN RADYOSU",
    frequency: '91.4 FM',
    genreBadge: 'Ulusal Müzik',
    pattern: 'vinyl'
  },
  'radio-trtturku': {
    bgColor: '#1c1917',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #78350f 60%, #b45309 130%)',
    accentColor: '#f59e0b',
    textLogo: 'TRT TÜRKÜ',
    subtitle: 'TÜRK HALK MÜZİĞİ',
    frequency: '98.8 FM',
    genreBadge: 'Türkü & Folk',
    pattern: 'vintage'
  },
  'radio-trtmuzik': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #042f2e 0%, #115e59 60%, #14b8a6 130%)',
    accentColor: '#14b8a6',
    textLogo: 'TRT MÜZİK',
    subtitle: 'MÜZİK ZİYAFETİ',
    frequency: 'WEB HD',
    genreBadge: 'Karma Müzik',
    pattern: 'waves'
  },
  'radio-powerturk': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #18181b 0%, #991b1b 55%, #ef4444 130%)',
    accentColor: '#ef4444',
    textLogo: 'PowerTürk',
    subtitle: 'ÖNCE MÜZİK',
    frequency: '99.8 FM',
    genreBadge: 'Türkçe Pop',
    pattern: 'neon'
  },
  'radio-powerfm': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #9a3412 55%, #f97316 130%)',
    accentColor: '#f97316',
    textLogo: 'Power FM',
    subtitle: 'THE POWER OF MUSIC',
    frequency: '100.0 FM',
    genreBadge: 'Hit Music',
    pattern: 'waves'
  },
  'radio-powerlove': {
    bgColor: '#3b0764',
    gradient: 'linear-gradient(135deg, #18181b 0%, #701a75 55%, #ec4899 130%)',
    accentColor: '#ec4899',
    textLogo: 'Power Love',
    subtitle: 'LOVE SONGS',
    frequency: '100.2 FM',
    genreBadge: 'Slow & Love',
    pattern: 'acoustic'
  },
  'radio-powerakustik': {
    bgColor: '#1c1917',
    gradient: 'linear-gradient(135deg, #0c0a09 0%, #451a03 60%, #d97706 130%)',
    accentColor: '#f59e0b',
    textLogo: 'PowerTürk Akustik',
    subtitle: 'EN İYİ AKUSTİK',
    frequency: 'WEB HD',
    genreBadge: 'Akustik',
    pattern: 'acoustic'
  },
  'radio-powerdance': {
    bgColor: '#09090b',
    gradient: 'linear-gradient(135deg, #030712 0%, #3b0764 55%, #06b6d4 130%)',
    accentColor: '#06b6d4',
    textLogo: 'Power Dance',
    subtitle: 'CLUB & BEATS',
    frequency: 'WEB HD',
    genreBadge: 'Club Dance',
    pattern: 'neon'
  },
  'radio-powergold': {
    bgColor: '#422006',
    gradient: 'linear-gradient(135deg, #18181b 0%, #713f12 60%, #eab308 135%)',
    accentColor: '#eab308',
    textLogo: 'Power Gold',
    subtitle: 'EFSANE ŞARKILAR',
    frequency: 'WEB HD',
    genreBadge: 'Retro Gold',
    pattern: 'vinyl'
  },
  'radio-powerdeep': {
    bgColor: '#030712',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e1b4b 60%, #38bdf8 135%)',
    accentColor: '#38bdf8',
    textLogo: 'Power Deep House',
    subtitle: 'ATMOSPHERIC BEATS',
    frequency: 'WEB HD',
    genreBadge: 'Deep House',
    pattern: 'waves'
  },
  'radio-powertaptaze': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #18181b 0%, #831843 60%, #fb7185 130%)',
    accentColor: '#fb7185',
    textLogo: 'PowerTürk Taptaze',
    subtitle: 'YEPYENİ ŞARKILAR',
    frequency: 'WEB HD',
    genreBadge: 'Yeni Çıkanlar',
    pattern: 'neon'
  },
  'radio-powersmooth': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #fbbf24 135%)',
    accentColor: '#fbbf24',
    textLogo: 'Power Smooth Jazz',
    subtitle: 'SMOOTH & RELAX',
    frequency: 'WEB HD',
    genreBadge: 'Smooth Jazz',
    pattern: 'vinyl'
  },
  'radio-joyfm': {
    bgColor: '#3b0764',
    gradient: 'linear-gradient(135deg, #18181b 0%, #4c0519 55%, #f43f5e 130%)',
    accentColor: '#f43f5e',
    textLogo: 'Joy FM',
    subtitle: 'EASY LISTENING',
    frequency: '100.6 FM',
    genreBadge: 'Yabancı Slow',
    pattern: 'waves'
  },
  'radio-joyturk': {
    bgColor: '#3b0764',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #831843 55%, #ec4899 130%)',
    accentColor: '#ec4899',
    textLogo: 'JoyTürk',
    subtitle: 'TÜRKÇE SLOW',
    frequency: '89.0 FM',
    genreBadge: 'Türkçe Slow',
    pattern: 'acoustic'
  },
  'radio-joyturkakustik': {
    bgColor: '#1c1917',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #3b0764 60%, #f43f5e 130%)',
    accentColor: '#f43f5e',
    textLogo: 'JoyTürk Akustik',
    subtitle: 'AŞK VE AKUSTİK',
    frequency: 'WEB HD',
    genreBadge: 'Akustik',
    pattern: 'acoustic'
  },
  'radio-joyturkrock': {
    bgColor: '#09090b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #374151 60%, #ef4444 130%)',
    accentColor: '#ef4444',
    textLogo: 'JoyTürk Rock',
    subtitle: 'TÜRKÇE ROCK',
    frequency: 'WEB HD',
    genreBadge: 'Türkçe Rock',
    pattern: 'neon'
  },
  'radio-joyjazz': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #312e81 60%, #eab308 135%)',
    accentColor: '#eab308',
    textLogo: 'Joy Jazz',
    subtitle: 'ALL THAT JAZZ',
    frequency: 'WEB HD',
    genreBadge: 'Caz & Blues',
    pattern: 'vinyl'
  },
  'radio-virgin': {
    bgColor: '#450a0a',
    gradient: 'linear-gradient(135deg, #09090b 0%, #881337 55%, #e11d48 130%)',
    accentColor: '#e11d48',
    textLogo: 'Virgin Radio',
    subtitle: "TÜRKİYE'NİN HİT MÜZİĞİ",
    frequency: '106.2 FM',
    genreBadge: 'Global Hit',
    pattern: 'neon'
  },
  'radio-metrofm': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e3a8a 55%, #06b6d4 130%)',
    accentColor: '#06b6d4',
    textLogo: 'Metro FM',
    subtitle: 'EN İYİ YABANCI MÜZİK',
    frequency: '97.2 FM',
    genreBadge: 'Yabancı Hit',
    pattern: 'waves'
  },
  'radio-superfm': {
    bgColor: '#422006',
    gradient: 'linear-gradient(135deg, #18181b 0%, #854d0e 55%, #eab308 130%)',
    accentColor: '#eab308',
    textLogo: 'Süper FM',
    subtitle: 'EN İYİ TÜRKÇE POP',
    frequency: '90.8 FM',
    genreBadge: 'Türkçe Pop',
    pattern: 'neon'
  },
  'radio-slowturk': {
    bgColor: '#1e1b4b',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #4c0519 55%, #e11d48 130%)',
    accentColor: '#e11d48',
    textLogo: 'SlowTürk',
    subtitle: 'AŞKIN FREKANSI',
    frequency: '95.3 FM',
    genreBadge: 'Türkçe Slow',
    pattern: 'acoustic'
  },
  'radio-kralfm': {
    bgColor: '#064e3b',
    gradient: 'linear-gradient(135deg, #022c22 0%, #065f46 55%, #eab308 135%)',
    accentColor: '#eab308',
    textLogo: 'KRAL FM',
    subtitle: 'İLAÇ GİBİ RADYO',
    frequency: '92.0 FM',
    genreBadge: 'Arabesk & Damar',
    pattern: 'vinyl'
  },
  'radio-kralpoptv': {
    bgColor: '#3b0764',
    gradient: 'linear-gradient(135deg, #09090b 0%, #581c87 55%, #d946ef 135%)',
    accentColor: '#d946ef',
    textLogo: 'Kral Pop',
    subtitle: 'POPUN KRALI',
    frequency: '94.7 FM',
    genreBadge: 'Türkçe Pop',
    pattern: 'neon'
  },
  'radio-fenomen': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #1e293b 55%, #a3e635 130%)',
    accentColor: '#a3e635',
    textLogo: 'Radyo Fenomen',
    subtitle: 'MAXIMUM HIT MUSIC',
    frequency: '100.4 FM',
    genreBadge: 'Trend Hits',
    pattern: 'neon'
  },
  'radio-alemfm': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #090d16 0%, #1e3a8a 55%, #f59e0b 135%)',
    accentColor: '#f59e0b',
    textLogo: 'Alem FM',
    subtitle: "TÜRKİYE'NİN ALEMİ",
    frequency: '89.2 FM',
    genreBadge: 'Pop & Eğlence',
    pattern: 'waves'
  },
  'radio-radyo7': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e3a8a 55%, #38bdf8 135%)',
    accentColor: '#38bdf8',
    textLogo: 'Radyo 7',
    subtitle: 'HAYATA MÜZİK KATIN',
    frequency: '104.6 FM',
    genreBadge: 'Karma Pop',
    pattern: 'waves'
  },
  'radio-voyage': {
    bgColor: '#042f2e',
    gradient: 'linear-gradient(135deg, #022c22 0%, #115e59 55%, #06b6d4 135%)',
    accentColor: '#06b6d4',
    textLogo: 'Radyo Voyage',
    subtitle: "DÜNYANIN MÜZİĞİNE YOLCULUK",
    frequency: '107.4 FM',
    genreBadge: 'World & Ambient',
    pattern: 'waves'
  },
  'radio-45lik': {
    bgColor: '#451a03',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #78350f 55%, #f59e0b 135%)',
    accentColor: '#f59e0b',
    textLogo: 'Radyo 45lik',
    subtitle: 'NOSTALJİ VE PLAKLAR',
    frequency: 'WEB HD',
    genreBadge: '70ler & 80ler',
    pattern: 'vinyl'
  },
  'radio-babaradyo': {
    bgColor: '#3f1111',
    gradient: 'linear-gradient(135deg, #18181b 0%, #7f1d1d 55%, #fbbf24 135%)',
    accentColor: '#fbbf24',
    textLogo: 'Baba Radyo',
    subtitle: 'BABA ŞARKILAR',
    frequency: '105.6 FM',
    genreBadge: 'Arabesk & Damar',
    pattern: 'vinyl'
  },
  'radio-damarturk': {
    bgColor: '#450a0a',
    gradient: 'linear-gradient(135deg, #09090b 0%, #881337 55%, #fb7185 130%)',
    accentColor: '#fb7185',
    textLogo: 'DamarTürk FM',
    subtitle: 'DAMARIN TEK ADRESİ',
    frequency: 'WEB HD',
    genreBadge: 'Damar Müzik',
    pattern: 'vinyl'
  },
  'radio-seymen': {
    bgColor: '#1e293b',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #065f46 55%, #22c55e 135%)',
    accentColor: '#22c55e',
    textLogo: 'Radyo Seymen',
    subtitle: 'OYUN HAVALARI & TÜRKÜ',
    frequency: '107.0 FM',
    genreBadge: 'Ankara & Oyun',
    pattern: 'vintage'
  },
  'radio-borusan': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e1b4b 60%, #eab308 135%)',
    accentColor: '#eab308',
    textLogo: 'Borusan Klasik',
    subtitle: 'SENFONİ VE KLASİK',
    frequency: 'WEB HD',
    genreBadge: 'Klasik Müzik',
    pattern: 'vinyl'
  },
  'radio-dinamo-deep': {
    bgColor: '#09090b',
    gradient: 'linear-gradient(135deg, #000000 0%, #1e293b 60%, #06b6d4 130%)',
    accentColor: '#06b6d4',
    textLogo: 'dinamo.fm deep',
    subtitle: 'ELECTRONIC & DEEP',
    frequency: 'WEB HD',
    genreBadge: 'Deep House',
    pattern: 'waves'
  },
  'radio-dinamo-caffe': {
    bgColor: '#1c1917',
    gradient: 'linear-gradient(135deg, #0c0a09 0%, #44403c 60%, #d97706 130%)',
    accentColor: '#d97706',
    textLogo: 'dinamo.fm caffe',
    subtitle: 'LOUNGE & CHILLOUT',
    frequency: 'WEB HD',
    genreBadge: 'Chillout',
    pattern: 'waves'
  },
  'radio-dinamo-sleep': {
    bgColor: '#030712',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e1b4b 60%, #818cf8 135%)',
    accentColor: '#818cf8',
    textLogo: 'dinamo.fm sleep',
    subtitle: 'AMBIENT & SLEEP',
    frequency: 'WEB HD',
    genreBadge: 'Ambient',
    pattern: 'waves'
  },
  'radio-kexp': {
    bgColor: '#1c1917',
    gradient: 'linear-gradient(135deg, #0c0a09 0%, #292524 60%, #d97706 130%)',
    accentColor: '#d97706',
    textLogo: 'KEXP 90.3',
    subtitle: 'WHERE MUSIC MATTERS',
    frequency: '90.3 FM',
    genreBadge: 'Alternative',
    pattern: 'waves'
  },
  'radio-classicfm': {
    bgColor: '#0f172a',
    gradient: 'linear-gradient(135deg, #020617 0%, #172554 60%, #ca8a04 135%)',
    accentColor: '#eab308',
    textLogo: 'Classic FM UK',
    subtitle: 'WORLD OF CLASSICS',
    frequency: '100.0 FM',
    genreBadge: 'Classical',
    pattern: 'vinyl'
  },
  'radio-capitalfm': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #1e3a8a 60%, #ef4444 135%)',
    accentColor: '#ef4444',
    textLogo: 'Capital FM UK',
    subtitle: 'THE UK\'S NO.1 HIT MUSIC',
    frequency: '95.8 FM',
    genreBadge: 'Top 40 Hits',
    pattern: 'neon'
  },
  'radio-smoothuk': {
    bgColor: '#3b0764',
    gradient: 'linear-gradient(135deg, #18181b 0%, #4a044e 60%, #c084fc 135%)',
    accentColor: '#c084fc',
    textLogo: 'Smooth Radio UK',
    subtitle: 'YOUR RELAXING MUSIC MIX',
    frequency: '102.2 FM',
    genreBadge: 'Smooth & Relax',
    pattern: 'waves'
  },
  'radio-heartuk': {
    bgColor: '#450a0a',
    gradient: 'linear-gradient(135deg, #09090b 0%, #881337 60%, #fb7185 130%)',
    accentColor: '#fb7185',
    textLogo: 'Heart FM UK',
    subtitle: 'TURN UP THE FEEL GOOD',
    frequency: '106.2 FM',
    genreBadge: 'Feel Good',
    pattern: 'neon'
  },
  'radio-ibiza': {
    bgColor: '#030712',
    gradient: 'linear-gradient(135deg, #020617 0%, #1e1b4b 60%, #06b6d4 135%)',
    accentColor: '#06b6d4',
    textLogo: 'Ibiza Global Radio',
    subtitle: 'SOUND OF IBIZA',
    frequency: '100.8 FM',
    genreBadge: 'Electronic',
    pattern: 'neon'
  },
  'radio-bbcworld': {
    bgColor: '#18181b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #7f1d1d 60%, #ef4444 130%)',
    accentColor: '#ef4444',
    textLogo: 'BBC World Service',
    subtitle: 'INTERNATIONAL NEWS',
    frequency: 'GLOBAL',
    genreBadge: 'Global News',
    pattern: 'waves'
  }
};

export function getChannelBrand(id: string, name: string, type: 'tv' | 'radio'): ChannelBrandInfo {
  // Direct ID check
  if (CHANNEL_BRANDS[id]) {
    return CHANNEL_BRANDS[id];
  }

  const nameLower = name.toLowerCase();

  // Intelligent Radio Name Matching
  if (type === 'radio') {
    if (nameLower.includes('powertürk') || nameLower.includes('power türk')) {
      if (nameLower.includes('akustik')) return CHANNEL_BRANDS['radio-powerakustik'];
      if (nameLower.includes('taptaze')) return CHANNEL_BRANDS['radio-powertaptaze'];
      return CHANNEL_BRANDS['radio-powerturk'];
    }
    if (nameLower.includes('power fm') || (nameLower.includes('power') && !nameLower.includes('türk'))) {
      if (nameLower.includes('love')) return CHANNEL_BRANDS['radio-powerlove'];
      if (nameLower.includes('dance')) return CHANNEL_BRANDS['radio-powerdance'];
      if (nameLower.includes('gold')) return CHANNEL_BRANDS['radio-powergold'];
      if (nameLower.includes('deep')) return CHANNEL_BRANDS['radio-powerdeep'];
      if (nameLower.includes('smooth') || nameLower.includes('jazz')) return CHANNEL_BRANDS['radio-powersmooth'];
      if (nameLower.includes('pop')) {
        return {
          bgColor: '#09090b',
          gradient: 'linear-gradient(135deg, #09090b 0%, #4c0519 55%, #06b6d4 135%)',
          accentColor: '#06b6d4',
          textLogo: 'Power POP',
          subtitle: '2000\'LER HİTLERİ',
          frequency: 'WEB HD',
          genreBadge: '2000s Pop',
          pattern: 'neon'
        };
      }
      return CHANNEL_BRANDS['radio-powerfm'];
    }
    if (nameLower.includes('joy')) {
      if (nameLower.includes('türk') || nameLower.includes('turk')) {
        if (nameLower.includes('akustik')) return CHANNEL_BRANDS['radio-joyturkakustik'];
        if (nameLower.includes('rock')) return CHANNEL_BRANDS['radio-joyturkrock'];
        return CHANNEL_BRANDS['radio-joyturk'];
      }
      if (nameLower.includes('jazz')) return CHANNEL_BRANDS['radio-joyjazz'];
      return CHANNEL_BRANDS['radio-joyfm'];
    }
    if (nameLower.includes('virgin')) return CHANNEL_BRANDS['radio-virgin'];
    if (nameLower.includes('metro')) return CHANNEL_BRANDS['radio-metrofm'];
    if (nameLower.includes('süper') || nameLower.includes('super')) return CHANNEL_BRANDS['radio-superfm'];
    if (nameLower.includes('kral')) {
      if (nameLower.includes('pop')) return CHANNEL_BRANDS['radio-kralpoptv'];
      if (nameLower.includes('türk') || nameLower.includes('turk')) {
        return {
          bgColor: '#064e3b',
          gradient: 'linear-gradient(135deg, #022c22 0%, #065f46 55%, #10b981 135%)',
          accentColor: '#10b981',
          textLogo: 'KRAL TÜRK FM',
          subtitle: 'TÜRKÇE MÜZİĞİN KRALI',
          frequency: '92.2 FM',
          genreBadge: 'Türkçe Müzik',
          pattern: 'vinyl'
        };
      }
      return CHANNEL_BRANDS['radio-kralfm'];
    }
    if (nameLower.includes('slow') || nameLower.includes('slowtürk') || nameLower.includes('slow turk')) {
      return CHANNEL_BRANDS['radio-slowturk'];
    }
    if (nameLower.includes('fenomen')) return CHANNEL_BRANDS['radio-fenomen'];
    if (nameLower.includes('alem')) return CHANNEL_BRANDS['radio-alemfm'];
    if (nameLower.includes('radyo 7') || nameLower.includes('radyo7')) return CHANNEL_BRANDS['radio-radyo7'];
    if (nameLower.includes('voyage')) return CHANNEL_BRANDS['radio-voyage'];
    if (nameLower.includes('45lik') || nameLower.includes('90lar') || nameLower.includes('nostalji') || nameLower.includes('altın')) {
      return {
        ...CHANNEL_BRANDS['radio-45lik'],
        textLogo: name,
        subtitle: 'NOSTALJİ VE PLAKLAR',
        genreBadge: 'Nostalji & Retro'
      };
    }
    if (nameLower.includes('baba')) return CHANNEL_BRANDS['radio-babaradyo'];
    if (nameLower.includes('damar')) return CHANNEL_BRANDS['radio-damarturk'];
    if (nameLower.includes('seymen') || nameLower.includes('ankara') || nameLower.includes('türkü') || nameLower.includes('turku') || nameLower.includes('şiran')) {
      return {
        ...CHANNEL_BRANDS['radio-seymen'],
        textLogo: name,
        subtitle: 'HALK MÜZİĞİ VE TÜRKÜLER',
        genreBadge: 'Türkü & Folk'
      };
    }
    if (nameLower.includes('dinamo')) {
      if (nameLower.includes('deep')) return CHANNEL_BRANDS['radio-dinamo-deep'];
      if (nameLower.includes('caffe')) return CHANNEL_BRANDS['radio-dinamo-caffe'];
      if (nameLower.includes('sleep')) return CHANNEL_BRANDS['radio-dinamo-sleep'];
    }
    if (nameLower.includes('trt fm') || (nameLower.includes('trt') && nameLower.includes('fm'))) return CHANNEL_BRANDS['radio-trtfm'];
    if (nameLower.includes('trt türkü') || nameLower.includes('trt turku')) return CHANNEL_BRANDS['radio-trtturku'];
    if (nameLower.includes('borusan') || nameLower.includes('klasik') || nameLower.includes('classic')) return CHANNEL_BRANDS['radio-borusan'];
    if (nameLower.includes('soma')) {
      return {
        bgColor: '#09090b',
        gradient: 'linear-gradient(135deg, #09090b 0%, #312e81 60%, #06b6d4 135%)',
        accentColor: '#06b6d4',
        textLogo: name,
        subtitle: 'UNDERGROUND RADIO',
        frequency: 'WEB HQ',
        genreBadge: 'Lounge / Ambient',
        pattern: 'waves'
      };
    }
    if (nameLower.includes('haber') || nameLower.includes('news') || nameLower.includes('ntv') || nameLower.includes('diyanet') || nameLower.includes('rs fm')) {
      return {
        bgColor: '#18181b',
        gradient: 'linear-gradient(135deg, #09090b 0%, #1e293b 60%, #ef4444 135%)',
        accentColor: '#ef4444',
        textLogo: name,
        subtitle: 'HABER VE GÜNDEM',
        frequency: 'CANLI HABER',
        genreBadge: 'Haber & Yayın',
        pattern: 'waves'
      };
    }
  }

  // Deterministic colorful gradient for other TV/Radio channels
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 45) % 360;

  return {
    bgColor: `hsl(${hue1}, 40%, 15%)`,
    gradient: `linear-gradient(135deg, hsl(${hue1}, 55%, 10%) 0%, hsl(${hue1}, 65%, 22%) 55%, hsl(${hue2}, 75%, 40%) 130%)`,
    accentColor: `hsl(${hue1}, 85%, 60%)`,
    textLogo: name,
    subtitle: type === 'tv' ? 'CANLI YAYIN' : 'RADYO YAYINI',
    frequency: type === 'radio' ? 'CANLI RADYO' : undefined,
    genreBadge: type === 'radio' ? 'Radyo İstasyonu' : undefined,
    pattern: type === 'radio' ? 'vinyl' : undefined
  };
}
