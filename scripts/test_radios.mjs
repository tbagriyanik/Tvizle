import https from 'https';
import http from 'http';

const candidateRadios = [
  // TRT Radyoları
  { id: 'radio-trtfm', name: 'TRT FM', category: 'Karma', url: 'https://radio-trtfm.medya.trt.com.tr/master.m3u8' },
  { id: 'radio-trtradyo1', name: 'TRT Radyo 1', category: 'Haber & Kültür', url: 'https://radio-trtradyo1.medya.trt.com.tr/master.m3u8' },
  { id: 'radio-trtradyo3', name: 'TRT Radyo 3', category: 'Klasik & Caz', url: 'https://radio-trtradyo3.medya.trt.com.tr/master.m3u8' },
  { id: 'radio-trtnağme', name: 'TRT Nağme', category: 'TSM / Sanat Müziği', url: 'https://radio-trtnagme.medya.trt.com.tr/master.m3u8' },
  { id: 'radio-trtturku', name: 'TRT Türkü', category: 'THM / Türkü', url: 'https://radio-trtturku.medya.trt.com.tr/master.m3u8' },
  { id: 'radio-trtkentist', name: 'TRT Kent Radyo İstanbul', category: 'Şehir & Haber', url: 'https://radio-trtkentradyoistanbul.medya.trt.com.tr/master.m3u8' },
  { id: 'radio-trthaber', name: 'TRT Radyo Haber', category: 'Haber', url: 'https://radio-trtradyohaber.medya.trt.com.tr/master.m3u8' },
  { id: 'radio-trtvotwest', name: 'TRT TSR', category: 'Kültür & Müzik', url: 'https://radio-tsr.medya.trt.com.tr/master.m3u8' },

  // PowerApp Group
  { id: 'radio-powerturk', name: 'PowerTürk', category: 'Türkçe Pop', url: 'https://listen.powerapp.com.tr/powerturk/mpeg/icecast.audio' },
  { id: 'radio-powerfm', name: 'Power FM', category: 'Yabancı Hit', url: 'https://listen.powerapp.com.tr/powerfm/mpeg/icecast.audio' },
  { id: 'radio-powerlove', name: 'Power Love', category: 'Yabancı Slow', url: 'https://listen.powerapp.com.tr/powerlove/mpeg/icecast.audio' },
  { id: 'radio-powerakustik', name: 'PowerTürk Akustik', category: 'Akustik', url: 'https://listen.powerapp.com.tr/powerturkakustik/mpeg/icecast.audio' },
  { id: 'radio-powerdance', name: 'Power Dance', category: 'Dans / Elektronik', url: 'https://listen.powerapp.com.tr/powerdance/mpeg/icecast.audio' },
  { id: 'radio-powergold', name: 'Power Gold', category: 'Nostalji Hit', url: 'https://listen.powerapp.com.tr/powergold/mpeg/icecast.audio' },
  { id: 'radio-powerdeep', name: 'Power Deep', category: 'Deep House', url: 'https://listen.powerapp.com.tr/powerdeep/mpeg/icecast.audio' },
  { id: 'radio-powerrock', name: 'Power Rocks', category: 'Rock', url: 'https://listen.powerapp.com.tr/powerrocks/mpeg/icecast.audio' },
  { id: 'radio-powertap', name: 'Power Türk Taptaze', category: 'Türkçe Pop', url: 'https://listen.powerapp.com.tr/powerturktaptaze/mpeg/icecast.audio' },
  { id: 'radio-powerklasik', name: 'Power Türk Efsane', category: 'Türkçe 90lar', url: 'https://listen.powerapp.com.tr/powerturkefsane/mpeg/icecast.audio' },

  // Karnaval Group (StreamTheWorld)
  { id: 'radio-joyfm', name: 'Joy FM', category: 'Yabancı Slow', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_FM.mp3' },
  { id: 'radio-joyturk', name: 'JoyTürk', category: 'Türkçe Slow', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_TURK.mp3' },
  { id: 'radio-joyturkakustik', name: 'JoyTürk Akustik', category: 'Akustik', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOYTURK_AKUSTIK.mp3' },
  { id: 'radio-joyturkrock', name: 'JoyTürk Rock', category: 'Türkçe Rock', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOYTURK_ROCK.mp3' },
  { id: 'radio-virgin', name: 'Virgin Radio Türkiye', category: 'Yabancı Hit', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/VIRGIN_RADIO.mp3' },
  { id: 'radio-metrofm', name: 'Metro FM', category: 'Yabancı Hit', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/METRO_FM.mp3' },
  { id: 'radio-superfm', name: 'Süper FM', category: 'Türkçe Pop', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/SUPER_FM.mp3' },
  { id: 'radio-retrofm', name: 'Retro Türk', category: 'Türkçe Nostalji', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RETRO_TURK.mp3' },
  { id: 'radio-efsaneturk', name: 'Efsane Türk', category: 'Arabesk / Fantezi', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/EFSANE_TURK.mp3' },
  { id: 'radio-radyomydonose', name: 'Radyo Mydonose', category: 'Yabancı Hit', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_MYDONOSE.mp3' },
  { id: 'radio-zeplin', name: 'Radyo Zeplin', category: 'Rock / Alternatif', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ZEPLIN.mp3' },
  { id: 'radio-borusan', name: 'Borusan Klasik', category: 'Klasik Müzik', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BORUSAN_KLASIK.mp3' },
  { id: 'radio-kentyasam', name: 'Joy Jazz', category: 'Caz', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_JAZZ.mp3' },
  { id: 'radio-karnaval90lar', name: 'Karnaval 90lar', category: '90lar Pop', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KARNAVAL90LAR.mp3' },

  // Doğuş Group (Kral FM, Kral Pop, NTV Radyo)
  { id: 'radio-kralfm', name: 'Kral FM', category: 'Arabesk / Fantezi', url: 'https://dogus.daioncdn.net/kralfm/kralfm.m3u8?app=kralfm_web' },
  { id: 'radio-kralpop', name: 'Kral Pop Radyo', category: 'Türkçe Pop', url: 'https://dogus.daioncdn.net/kralpoptv/kralpoptv.m3u8?app=kralpop_web' },
  { id: 'radio-ntvradyo', name: 'NTV Radyo', category: 'Haber', url: 'https://dogus.daioncdn.net/ntvradyo/ntvradyo.m3u8?app=ntvradyo_web' },
  { id: 'radio-eksen', name: 'Radyo Eksen', category: 'Rock / Indie', url: 'https://dogus.daioncdn.net/radyoeksen/radyoeksen.m3u8?app=radyoeksen_web' },
  { id: 'radio-voyage', name: 'Radyo Voyage', category: 'Ambient / New Age', url: 'https://dogus.daioncdn.net/voyage/voyage.m3u8?app=voyage_web' },

  // Türkmedya (Alem FM, Lig Radyo)
  { id: 'radio-alemfm', name: 'Alem FM', category: 'Türkçe Pop', url: 'https://turkmedya.daioncdn.net/alemfm/alemfm.m3u8?app=alemfm_web' },
  { id: 'radio-ligradyo', name: 'Lig Radyo', category: 'Spor & Haber', url: 'https://turkmedya.daioncdn.net/ligradyo/ligradyo.m3u8?app=ligradyo_web' },

  // Demirören (Radyo D, CNN Türk Radyo, Slow Türk)
  { id: 'radio-radyod', name: 'Radyo D', category: 'Türkçe Pop', url: 'https://demiroren.daioncdn.net/radyod/radyod.m3u8?app=radyod_web' },
  { id: 'radio-slowturk', name: 'Slow Türk', category: 'Türkçe Slow', url: 'https://demiroren.daioncdn.net/slowturk/slowturk.m3u8?app=slowturk_web' },
  { id: 'radio-cnnturkradyo', name: 'CNN Türk Radyo', category: 'Haber', url: 'https://demiroren.daioncdn.net/cnnturkradyo/cnnturkradyo.m3u8?app=cnnturk_web' },

  // Ciner / Turkuvaz (A Haber Radyo, A Spor Radyo, Vav Radyo, Turkuvaz Radyo, Romantik Türk)
  { id: 'radio-ahaberradyo', name: 'A Haber Radyo', category: 'Haber', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8' },
  { id: 'radio-asporradyo', name: 'A Spor Radyo', category: 'Spor', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8' },
  { id: 'radio-vavradyo', name: 'Vav Radyo', category: 'Dini / Kültür', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/vavradyo/vavradyo.m3u8' },
  { id: 'radio-turkuvazradyo', name: 'Turkuvaz Radyo', category: 'Türkçe Pop', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/turkuvazradyo/turkuvazradyo.m3u8' },
  { id: 'radio-haberturkradyo', name: 'Habertürk Radyo', category: 'Haber', url: 'https://ciner-live.ercdn.net/haberturkradyo/haberturkradyo.m3u8' },
  { id: 'radio-bloomberghtradyo', name: 'Bloomberg HT Radyo', category: 'Ekonomi / Haber', url: 'https://ciner-live.ercdn.net/bloomberghtradyo/bloomberghtradyo.m3u8' },

  // Fenomen Grubu
  { id: 'radio-fenomen', name: 'Radyo Fenomen', category: 'Yabancı Hit', url: 'https://listen.radyofenomen.com/fenomen/128/icecast.audio' },
  { id: 'radio-fenomenturk', name: 'Fenomen Türk', category: 'Türkçe Pop', url: 'https://listen.radyofenomen.com/fenomenturk/128/icecast.audio' },
  { id: 'radio-fenomenclub', name: 'Fenomen Club', category: 'Club / Dans', url: 'https://listen.radyofenomen.com/fenomenclub/128/icecast.audio' },
  { id: 'radio-fenomenrap', name: 'Fenomen Rap', category: 'Rap / Hip-Hop', url: 'https://listen.radyofenomen.com/fenomenrap/128/icecast.audio' },
  { id: 'radio-fenomenoriental', name: 'Fenomen Oryantal', category: 'Oryantal', url: 'https://listen.radyofenomen.com/fenomenoryantal/128/icecast.audio' },

  // Pal Grubu & Best FM & Baba Radyo & Show Radyo & Number1
  { id: 'radio-bestfm', name: 'Best FM', category: 'Türkçe Pop & Konuşma', url: 'https://bestfm.daioncdn.net/bestfm/bestfm.m3u8?app=bestfm_web' },
  { id: 'radio-babaradyo', name: 'Baba Radyo', category: 'Arabesk / Fantezi', url: 'https://babaradyo.daioncdn.net/babaradyo/babaradyo.m3u8?app=babaradyo_web' },
  { id: 'radio-showradyo', name: 'Show Radyo', category: 'Türkçe Pop', url: 'https://showradyo.daioncdn.net/showradyo/showradyo.m3u8?app=showradyo_web' },
  { id: 'radio-vivaradyo', name: 'Radyo Viva', category: 'Türkçe Pop', url: 'https://radyoviva.daioncdn.net/radyoviva/radyoviva.m3u8?app=radyoviva_web' },
  { id: 'radio-palfm', name: 'Pal FM', category: 'Türkçe Pop', url: 'https://palfm.daioncdn.net/palfm/palfm.m3u8?app=palfm_web' },
  { id: 'radio-palnostalji', name: 'Pal Nostalji', category: 'Nostalji', url: 'https://palnostalji.daioncdn.net/palnostalji/palnostalji.m3u8?app=palnostalji_web' },
  { id: 'radio-paloriental', name: 'Pal Doğa', category: 'Türkü', url: 'https://paldoga.daioncdn.net/paldoga/paldoga.m3u8?app=paldoga_web' },
  { id: 'radio-numberone', name: 'Number 1 FM', category: 'Yabancı Hit', url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1e2d83768.smil/playlist.m3u8' },
  { id: 'radio-number1turk', name: 'Number 1 Türk', category: 'Türkçe Pop', url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1f56be91e.smil/playlist.m3u8' },

  // Diyanet & Kültür Radyoları
  { id: 'radio-diyanetradyo', name: 'Diyanet Radyo', category: 'Dini & Kültür', url: 'https://diyanetradyo-live.daioncdn.net/diyanetradyo/diyanetradyo.m3u8' },
  { id: 'radio-diyanetkuran', name: 'Diyanet Kur\'an Radyo', category: 'Kur\'an-ı Kerim', url: 'https://diyanetkuran-live.daioncdn.net/diyanetkuran/diyanetkuran.m3u8' },
  { id: 'radio-diyanetrisalet', name: 'Diyanet Risalet Radyo', category: 'Dini & Kültür', url: 'https://diyanetrisalet-live.daioncdn.net/diyanetrisalet/diyanetrisalet.m3u8' },
  { id: 'radio-moral', name: 'Moral FM', category: 'Kültür & Sohbet', url: 'https://yayin.canliradyolive.com/8038/stream' },
  { id: 'radio-akradyo', name: 'AKRA FM', category: 'Kültür & Sohbet', url: 'https://yayin.akradyo.net:8000/stream' },
  { id: 'radio-radyotrafik', name: 'Radyo Trafik İstanbul', category: 'Trafik & Haber', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_TRAFIK_AAC.aac' },
  { id: 'radio-radyo7', name: 'Radyo 7', category: 'Karma / Türkçe', url: 'https://kanal7-live.daioncdn.net/radyo7/radyo7.m3u8' },
  { id: 'radio-radyo7turku', name: 'Radyo 7 Türkü', category: 'THM / Türkü', url: 'https://kanal7-live.daioncdn.net/radyo7turku/radyo7turku.m3u8' },
  { id: 'radio-radyo7tst', name: 'Radyo 7 Sanat', category: 'TSM / Sanat Müziği', url: 'https://kanal7-live.daioncdn.net/radyo7tsm/radyo7tsm.m3u8' },
  { id: 'radio-radyo7tasavvuf', name: 'Radyo 7 Tasavvuf', category: 'Tasavvuf', url: 'https://kanal7-live.daioncdn.net/radyo7tasavvuf/radyo7tasavvuf.m3u8' },
  { id: 'radio-kexp', name: 'KEXP 90.3 FM', category: 'Yabancı Alternatif', url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3' }
];

function checkRadio(item) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(item.url);
      const mod = parsed.protocol === 'https:' ? https : http;
      const req = mod.get(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': parsed.origin
        },
        timeout: 4000
      }, (res) => {
        const ok = res.statusCode >= 200 && res.statusCode < 400;
        resolve({ ...item, status: res.statusCode, ok });
        res.resume();
      });
      req.on('error', (e) => resolve({ ...item, status: e.message, ok: false }));
      req.on('timeout', () => { req.destroy(); resolve({ ...item, status: 'TIMEOUT', ok: false }); });
    } catch(err) {
      resolve({ ...item, status: 'ERR', ok: false });
    }
  });
}

async function run() {
  console.log(`Checking ${candidateRadios.length} radios...`);
  const results = await Promise.all(candidateRadios.map(checkRadio));
  const working = results.filter(r => r.ok);
  console.log(`\nWorking radios: ${working.length} / ${candidateRadios.length}`);
  results.forEach(r => console.log(`${r.ok ? '✓' : '✗'} [${r.status}] ${r.name} -> ${r.url}`));
}

run();
