const https = require('https');
const http = require('http');

const candidateTV = [
  // TRT Channels
  { id: 'tv-trt1', name: 'TRT 1', url: 'https://tv-trt1.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trthaber', name: 'TRT Haber', url: 'https://tv-trthaber.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trtspor', name: 'TRT Spor', url: 'https://tv-trtspor1.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trtspor2', name: 'TRT Spor Yıldız', url: 'https://tv-trtspor2.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trtbelgesel', name: 'TRT Belgesel', url: 'https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trtmuzik', name: 'TRT Müzik', url: 'https://tv-trtmuzik.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trtcocuk', name: 'TRT Çocuk', url: 'https://tv-trtcocuk.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trt2', name: 'TRT 2', url: 'https://tv-trt2.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trtturk', name: 'TRT Türk', url: 'https://tv-trtturk.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trtkurdi', name: 'TRT Kurdî', url: 'https://tv-trtkurdi.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trtavaz', name: 'TRT Avaz', url: 'https://tv-trtavaz.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trtworld', name: 'TRT World', url: 'https://tv-trtworld.medya.trt.com.tr/master.m3u8' },
  { id: 'tv-trtarabi', name: 'TRT Arabi', url: 'https://tv-trtarabi.medya.trt.com.tr/master.m3u8' },

  // Turkuvaz Group
  { id: 'tv-atv', name: 'ATV', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8' },
  { id: 'tv-a2', name: 'A2 TV', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2/a2.m3u8' },
  { id: 'tv-ahaber', name: 'A Haber', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8' },
  { id: 'tv-aspor', name: 'A Spor', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8' },
  { id: 'tv-apara', name: 'A Para', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/apara/apara.m3u8' },
  { id: 'tv-anews', name: 'A News', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/anews/anews.m3u8' },
  { id: 'tv-minikacocuk', name: 'Minika Çocuk', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikacocuk/minikacocuk.m3u8' },
  { id: 'tv-minikago', name: 'Minika GO', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8' },
  { id: 'tv-vavtv', name: 'Vav TV', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/vavtv/vavtv.m3u8' },

  // Doğuş Group
  { id: 'tv-startv', name: 'Star TV', url: 'https://dogus.daioncdn.net/startv/startv_720p.m3u8?app=a20ac41e-bdc3-4aa1-934d-26b484480ac9&ce=3&sid=8l4w3lst4co5' },
  { id: 'tv-ntv', name: 'NTV', url: 'https://dogus.daioncdn.net/ntv/ntv.m3u8?app=ntv_web' },
  { id: 'tv-kralpoptv', name: 'Kral Pop TV', url: 'https://dogus.daioncdn.net/kralpoptv/kralpoptv.m3u8?app=kralpoptv_web' },
  { id: 'tv-kraltv', name: 'Kral TV', url: 'https://dogus.daioncdn.net/kraltv/kraltv.m3u8?app=kraltv_web' },
  { id: 'tv-eurostar', name: 'Euro Star', url: 'https://dogus.daioncdn.net/eurostar/eurostar.m3u8?app=eurostar_web' },

  // Demirören & Ciner & Acun & Kanal 7
  { id: 'tv-kanald', name: 'Kanal D', url: 'https://demiroren.daioncdn.net/kanald/kanald.m3u8?app=kanald_web&ce=3' },
  { id: 'tv-cnnturk', name: 'CNN Türk', url: 'https://demiroren.daioncdn.net/cnnturk/cnnturk.m3u8?app=cnnturk_web&ce=3' },
  { id: 'tv-teve2', name: 'Teve2', url: 'https://live.duhnet.tv/S2/HLS_LIVE/teve2np/playlist.m3u8' },
  { id: 'tv-dreamturk', name: 'Dream Türk', url: 'https://live.duhnet.tv/S2/HLS_LIVE/dreamturknp/playlist.m3u8' },
  { id: 'tv-showtv', name: 'Show TV', url: 'https://ciner-live.ercdn.net/showtv/showtv.m3u8' },
  { id: 'tv-haberturk', name: 'Habertürk', url: 'https://tv.ensonhaber.com/haberturk/haberturk.m3u8' },
  { id: 'tv-bloomberght', name: 'Bloomberg HT', url: 'https://tv.ensonhaber.com/bloomberght/bloomberght.m3u8' },
  { id: 'tv-tv8', name: 'TV8', url: 'https://tv8.daioncdn.net/tv8/tv8.m3u8?app=7ddc255a-ef47-4e81-ab14-c0e5f2949788&ce=3' },
  { id: 'tv-tv85', name: 'TV8.5', url: 'https://tv8.daioncdn.net/tv8-5/tv8-5.m3u8?app=tv85_web' },
  { id: 'tv-kanal7', name: 'Kanal 7', url: 'https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8' },
  { id: 'tv-ulketv', name: 'Ülke TV', url: 'https://kanal7-live.daioncdn.net/ulketv/ulketv.m3u8' },
  { id: 'tv-beyaztv', name: 'Beyaz TV', url: 'https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8' },
  { id: 'tv-tgrthaber', name: 'TGRT Haber', url: 'https://tgrthaber-live.daioncdn.net/tgrthaber/tgrthaber.m3u8' },
  { id: 'tv-tgrtbelgesel', name: 'TGRT Belgesel', url: 'https://tgrtbelgesel-live.daioncdn.net/tgrtbelgesel/tgrtbelgesel.m3u8' },
  { id: 'tv-tgrteu', name: 'TGRT EU', url: 'https://tgrteu-live.daioncdn.net/tgrteu/tgrteu.m3u8' },
  { id: 'tv-halktv', name: 'Halk TV', url: 'https://halktv-live.daioncdn.net/halktv/halktv.m3u8' },
  { id: 'tv-tele1', name: 'Tele1', url: 'https://tele1-live.ercdn.net/tele1/tele1.m3u8' },
  { id: 'tv-tv100', name: 'TV100', url: 'https://tv.ensonhaber.com/tv100/tv100.m3u8' },
  { id: 'tv-sozcutv', name: 'Sözcü TV', url: 'https://sozcutv-live.daioncdn.net/sozcutv/sozcutv.m3u8' },
  { id: 'tv-ekoturk', name: 'Ekotürk TV', url: 'https://ekoturk-live.daioncdn.net/ekoturk/ekoturk.m3u8' },
  { id: 'tv-benguturk', name: 'Bengü Türk TV', url: 'https://benguturk-live.daioncdn.net/benguturk/benguturk.m3u8' },
  { id: 'tv-ulusal', name: 'Ulusal Kanal', url: 'https://live.duhnet.tv/S2/HLS_LIVE/ulusalkanal/playlist.m3u8' },
  { id: 'tv-flashhaber', name: 'Flash Haber', url: 'https://flashhaber-live.daioncdn.net/flashhaber/flashhaber.m3u8' },
  { id: 'tv-diyanettv', name: 'Diyanet TV', url: 'https://diyanettv-live.daioncdn.net/diyanettv/diyanettv.m3u8' },
  { id: 'tv-diyanetcocuk', name: 'Diyanet Çocuk', url: 'https://diyanetcocuk-live.daioncdn.net/diyanetcocuk/diyanetcocuk.m3u8' },
  { id: 'tv-akittv', name: 'Akit TV', url: 'https://akittv-live.daioncdn.net/akittv/akittv.m3u8' },
  { id: 'tv-kordon', name: 'Kordon TV', url: 'https://live.artidijitalmedya.com/artidijital_kordontv/kordontv/playlist.m3u8' },
  { id: 'tv-bursaolay', name: 'Olay Türk TV', url: 'https://live.artidijitalmedya.com/artidijital_olayturktv/olayturktv/playlist.m3u8' },
  { id: 'tv-linebursa', name: 'Line TV', url: 'https://linetv-live.daioncdn.net/linetv/linetv.m3u8' },
  { id: 'tv-konya', name: 'Kon TV', url: 'https://kontv-live.daioncdn.net/kontv/kontv.m3u8' },
  { id: 'tv-kadirtv', name: 'Kadırga TV', url: 'https://live.artidijitalmedya.com/artidijital_kadirgatv/kadirgatv/playlist.m3u8' },
  { id: 'tv-caytv', name: 'Çay TV', url: 'https://caytv-live.daioncdn.net/caytv/caytv.m3u8' },
  { id: 'tv-kanal3', name: 'Kanal 3', url: 'https://kanal3-live.daioncdn.net/kanal3/kanal3.m3u8' },
  { id: 'tv-kanal58', name: 'Kanal 58', url: 'https://kanal58-live.daioncdn.net/kanal58/kanal58.m3u8' },
  { id: 'tv-turkmeneli', name: 'Türkmeneli TV', url: 'https://live.artidijitalmedya.com/artidijital_turkmenelitv/turkmenelitv/playlist.m3u8' },
  { id: 'tv-ciftci', name: 'Çiftçi TV', url: 'https://ciftcitv-live.daioncdn.net/ciftcitv/ciftcitv.m3u8' },
  { id: 'tv-koytv', name: 'Köy TV', url: 'https://koytv-live.daioncdn.net/koytv/koytv.m3u8' },
  { id: 'tv-bereket', name: 'Bereket TV', url: 'https://berekettv-live.daioncdn.net/berekettv/berekettv.m3u8' },
  { id: 'tv-tempo', name: 'Tempo TV', url: 'https://tempotv-live.daioncdn.net/tempotv/tempotv.m3u8' },
  { id: 'tv-mavidurak', name: 'Mavi Karadeniz TV', url: 'https://mavikaradeniz-live.daioncdn.net/mavikaradeniz/mavikaradeniz.m3u8' },
  { id: 'tv-sports', name: 'Sports TV', url: 'https://sportstv-live.daioncdn.net/sportstv/sportstv.m3u8' },
  { id: 'tv-fbtv', name: 'FB TV', url: 'https://fbtv-live.daioncdn.net/fbtv/fbtv.m3u8' },
  { id: 'tv-bjk', name: 'BJK TV', url: 'https://live.artidijitalmedya.com/artidijital_bjktv/bjktv/playlist.m3u8' },
  { id: 'tv-redbull', name: 'Red Bull TV', url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8' },
  { id: 'tv-aljazeera', name: 'Al Jazeera Eng', url: 'https://live-hls-web-aje-fa.thehlive.com/AJE/index.m3u8' },
  { id: 'tv-france24', name: 'France 24 Eng', url: 'https://live.france24.com/hls/live/2037218-b/F24_EN_HI_HLS/master_2300.m3u8' },
  { id: 'tv-dw-eng', name: 'DW English', url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/master.m3u8' },
  { id: 'tv-euronews-tr', name: 'Euronews Türkçe', url: 'https://euronews-euronews-turkish-1-tr.samsung.wurl.tv/playlist.m3u8' },
  { id: 'tv-skynews', name: 'Sky News', url: 'https://skynewsau-live.akamaized.net/hls/live/2002689/skynewsau-extra1/master.m3u8' },
  { id: 'tv-nasatv', name: 'NASA TV', url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8' }
];

function checkUrl(item) {
  return new Promise((resolve) => {
    const parsed = new URL(item.url);
    const mod = parsed.protocol === 'https:' ? https : http;
    const req = mod.get(item.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 3500
    }, (res) => {
      resolve({ ...item, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
      res.resume();
    });
    req.on('error', (e) => resolve({ ...item, status: e.message, ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ ...item, status: 'TIMEOUT', ok: false }); });
  });
}

async function run() {
  console.log('Testing TV channels...');
  const results = await Promise.all(candidateTV.map(checkUrl));
  const working = results.filter(r => r.ok);
  console.log(`Working TV channels: ${working.length} / ${candidateTV.length}`);
  results.forEach(r => console.log(`${r.ok ? '✓' : '✗'} [${r.status}] ${r.name} -> ${r.url}`));
}

run();
