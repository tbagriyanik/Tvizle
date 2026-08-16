import https from 'https';
import http from 'http';
import fs from 'fs';

async function fetchPlaylist(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPlaylist(res.headers.location).then(resolve);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function checkStream(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const mod = parsed.protocol === 'https:' ? https : http;
      const req = mod.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': parsed.origin
        },
        timeout: 3500
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.destroy();
          checkStream(res.headers.location).then(resolve);
          return;
        }
        const isOk = res.statusCode >= 200 && res.statusCode < 400;
        resolve({ status: res.statusCode, ok: isOk, finalUrl: url });
        res.destroy();
      });
      req.on('error', (e) => resolve({ status: e.message, ok: false }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 'TIMEOUT', ok: false }); });
    } catch(err) {
      resolve({ status: 'ERR', ok: false });
    }
  });
}

async function run() {
  console.log('Fetching Turkish radio streams from radio-browser / curated list...');
  // Radio Browser API for Turkey
  const apiRes = await fetchPlaylist('https://de1.api.radio-browser.info/json/stations/bycountry/turkey');
  let radioList = [];
  try {
    radioList = JSON.parse(apiRes);
  } catch (e) {
    console.log('Failed to parse radio-browser json:', e.message);
  }

  console.log(`Fetched ${radioList.length} radios from radio browser API.`);

  // Curated popular radio list with exact streams
  const curated = [
    { name: 'TRT FM', category: 'Karma', url: 'https://radio-trtfm.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png' },
    { name: 'TRT Radyo 1', category: 'Haber & Kültür', url: 'https://radio-trtradyo1.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/TRT_Radyo_1_logo_2021.svg/512px-TRT_Radyo_1_logo_2021.svg.png' },
    { name: 'TRT Radyo 3', category: 'Klasik & Caz', url: 'https://radio-trtradyo3.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/TRT_Radyo_3_logo_2021.svg/512px-TRT_Radyo_3_logo_2021.svg.png' },
    { name: 'TRT Nağme', category: 'Sanat Müziği', url: 'https://radio-trtnagme.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/TRT_Na%C4%9Fme_logo_2021.svg/512px-TRT_Na%C4%9Fme_logo_2021.svg.png' },
    { name: 'TRT Türkü', category: 'Türkü', url: 'https://radio-trtturku.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/TRT_T%C3%BCrk%C3%BC_logo_2021.svg/512px-TRT_T%C3%BCrk%C3%BC_logo_2021.svg.png' },
    { name: 'TRT Kent Radyo', category: 'Şehir & Haber', url: 'https://radio-trtkentradyoistanbul.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png' },
    { name: 'TRT TSR Dış Yayınlar', category: 'Kültür & Müzik', url: 'https://radio-tsr.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png' },
    { name: 'TRT Radyo Haber', category: 'Haber', url: 'https://radio-trtradyohaber.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/TRT_Radyo_1_logo_2021.svg/512px-TRT_Radyo_1_logo_2021.svg.png' },

    // Power Group
    { name: 'PowerTürk', category: 'Türkçe Pop', url: 'https://listen.powerapp.com.tr/powerturk/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png' },
    { name: 'Power FM', category: 'Yabancı Hit', url: 'https://listen.powerapp.com.tr/powerfm/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
    { name: 'Power Love', category: 'Yabancı Slow', url: 'https://listen.powerapp.com.tr/powerlove/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
    { name: 'PowerTürk Akustik', category: 'Akustik', url: 'https://listen.powerapp.com.tr/powerturkakustik/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png' },
    { name: 'Power Dance', category: 'Dans / Club', url: 'https://listen.powerapp.com.tr/powerdance/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
    { name: 'Power Gold', category: 'Nostalji', url: 'https://listen.powerapp.com.tr/powergold/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
    { name: 'Power Deep House', category: 'Elektronik', url: 'https://listen.powerapp.com.tr/powerdeep/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
    { name: 'Power Rocks', category: 'Rock', url: 'https://listen.powerapp.com.tr/powerrocks/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
    { name: 'PowerTürk Taptaze', category: 'Türkçe Pop', url: 'https://listen.powerapp.com.tr/powerturktaptaze/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png' },
    { name: 'PowerTürk Efsane', category: 'Türkçe 90lar', url: 'https://listen.powerapp.com.tr/powerturkefsane/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png' },
    { name: 'Power Tap', category: 'Türkçe Pop', url: 'https://listen.powerapp.com.tr/powerturktap/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png' },
    { name: 'Power Smooth Jazz', category: 'Caz', url: 'https://listen.powerapp.com.tr/powersmoothjazz/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
    { name: 'Power Lounge', category: 'Lounge / Chill', url: 'https://listen.powerapp.com.tr/powerlounge/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },

    // Karnaval
    { name: 'Joy FM', category: 'Yabancı Slow', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_FM.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Joy_FM_logo.png/512px-Joy_FM_logo.png' },
    { name: 'JoyTürk', category: 'Türkçe Slow', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_TURK.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png' },
    { name: 'JoyTürk Akustik', category: 'Akustik', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOYTURK_AKUSTIK.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png' },
    { name: 'JoyTürk Rock', category: 'Türkçe Rock', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOYTURK_ROCK.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png' },
    { name: 'Virgin Radio Türkiye', category: 'Yabancı Hit', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/VIRGIN_RADIO.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Virgin_Radio_logo.svg/512px-Virgin_Radio_logo.svg.png' },
    { name: 'Metro FM', category: 'Yabancı Hit', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/METRO_FM.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Metro_FM_logo.png/512px-Metro_FM_logo.png' },
    { name: 'Süper FM', category: 'Türkçe Pop', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/SUPER_FM.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/S%C3%BCper_FM_logo.png/512px-S%C3%BCper_FM_logo.png' },
    { name: 'Retro Türk', category: 'Nostalji', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RETRO_TURK.mp3', logo: 'https://i.imgur.com/8QjZ2rM.png' },
    { name: 'Efsane Türk', category: 'Arabesk / Fantezi', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/EFSANE_TURK.mp3', logo: 'https://i.imgur.com/P4wUa0q.png' },
    { name: 'Radyo Mydonose', category: 'Yabancı Hit', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_MYDONOSE.mp3', logo: 'https://i.imgur.com/p0qE2Xv.png' },
    { name: 'Radyo Zeplin', category: 'Rock / Alternatif', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ZEPLIN.mp3', logo: 'https://i.imgur.com/6tv0zxh.png' },
    { name: 'Borusan Klasik', category: 'Klasik Müzik', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BORUSAN_KLASIK.mp3', logo: 'https://i.imgur.com/iOCQdyD.png' },
    { name: 'Joy Jazz', category: 'Caz', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_JAZZ.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Joy_FM_logo.png/512px-Joy_FM_logo.png' },
    { name: 'Karnaval 90lar', category: '90lar Pop', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KARNAVAL90LAR.mp3', logo: 'https://i.imgur.com/8QjZ2rM.png' },
    { name: 'Radyo Trafik İstanbul', category: 'Trafik & Haber', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_TRAFIK_AAC.aac', logo: 'https://i.imgur.com/X2k1nQx.png' },

    // Doğuş Radyo
    { name: 'Kral FM', category: 'Arabesk / Fantezi', url: 'https://dogus.daioncdn.net/kralfm/kralfm.m3u8?app=kralfm_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Kral_TV_logo.svg/512px-Kral_TV_logo.svg.png' },
    { name: 'Kral Pop Radyo', category: 'Türkçe Pop', url: 'https://dogus.daioncdn.net/kralpoptv/kralpoptv.m3u8?app=kralpop_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Kral_Pop_TV_logo.svg/512px-Kral_Pop_TV_logo.svg.png' },
    { name: 'NTV Radyo', category: 'Haber', url: 'https://dogus.daioncdn.net/ntvradyo/ntvradyo.m3u8?app=ntvradyo_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ntv_logo.svg/512px-Ntv_logo.svg.png' },
    { name: 'Radyo Eksen', category: 'Rock / Indie', url: 'https://dogus.daioncdn.net/radyoeksen/radyoeksen.m3u8?app=radyoeksen_web', logo: 'https://i.imgur.com/6tv0zxh.png' },
    { name: 'Radyo Voyage', category: 'Ambient / New Age', url: 'https://dogus.daioncdn.net/voyage/voyage.m3u8?app=voyage_web', logo: 'https://i.imgur.com/iOCQdyD.png' },

    // Demirören & Türkmedya
    { name: 'Slow Türk', category: 'Türkçe Slow', url: 'https://demiroren.daioncdn.net/slowturk/slowturk.m3u8?app=slowturk_web', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/7/77/Slow_T%C3%BCrk_logo.png/512px-Slow_T%C3%BCrk_logo.png' },
    { name: 'Radyo D', category: 'Türkçe Pop', url: 'https://demiroren.daioncdn.net/radyod/radyod.m3u8?app=radyod_web', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/52/Radyo_D_logo.png/512px-Radyo_D_logo.png' },
    { name: 'CNN Türk Radyo', category: 'Haber', url: 'https://demiroren.daioncdn.net/cnnturkradyo/cnnturkradyo.m3u8?app=cnnturk_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/CNN_T%C3%BCrk_logo.svg/512px-CNN_T%C3%BCrk_logo.svg.png' },
    { name: 'Alem FM', category: 'Türkçe Pop', url: 'https://turkmedya.daioncdn.net/alemfm/alemfm.m3u8?app=alemfm_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Alem_FM_logo.png/512px-Alem_FM_logo.png' },
    { name: 'Lig Radyo', category: 'Spor & Haber', url: 'https://turkmedya.daioncdn.net/ligradyo/ligradyo.m3u8?app=ligradyo_web', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/5e/Lig_Radyo_logo.png/512px-Lig_Radyo_logo.png' },

    // Fenomen Grubu
    { name: 'Radyo Fenomen', category: 'Yabancı Hit', url: 'https://listen.radyofenomen.com/fenomen/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
    { name: 'Fenomen Türk', category: 'Türkçe Pop', url: 'https://listen.radyofenomen.com/fenomenturk/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
    { name: 'Fenomen Club', category: 'Club & Dans', url: 'https://listen.radyofenomen.com/fenomenclub/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
    { name: 'Fenomen Rap', category: 'Türkçe Rap', url: 'https://listen.radyofenomen.com/fenomenrap/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
    { name: 'Fenomen Oryantal', category: 'Oryantal', url: 'https://listen.radyofenomen.com/fenomenoryantal/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
    { name: 'Fenomen Pop', category: 'Yabancı Pop', url: 'https://listen.radyofenomen.com/fenomenpop/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
    { name: 'Fenomen Akustik', category: 'Akustik', url: 'https://listen.radyofenomen.com/fenomenakustik/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },

    // Pal & Best & Show & Viva & Baba & Number1
    { name: 'Best FM', category: 'Türkçe Pop & Sohbet', url: 'https://bestfm.daioncdn.net/bestfm/bestfm.m3u8?app=bestfm_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Best_FM_logo.png/512px-Best_FM_logo.png' },
    { name: 'Baba Radyo', category: 'Arabesk / Fantezi', url: 'https://babaradyo.daioncdn.net/babaradyo/babaradyo.m3u8?app=babaradyo_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Baba_Radyo_logo.png/512px-Baba_Radyo_logo.png' },
    { name: 'Show Radyo', category: 'Türkçe Pop', url: 'https://showradyo.daioncdn.net/showradyo/showradyo.m3u8?app=showradyo_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Show_Radyo_logo.png/512px-Show_Radyo_logo.png' },
    { name: 'Radyo Viva', category: 'Türkçe Pop', url: 'https://radyoviva.daioncdn.net/radyoviva/radyoviva.m3u8?app=radyoviva_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Radyo_Viva_logo.png/512px-Radyo_Viva_logo.png' },
    { name: 'Pal FM', category: 'Türkçe Pop', url: 'https://palfm.daioncdn.net/palfm/palfm.m3u8?app=palfm_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pal_FM_logo.png/512px-Pal_FM_logo.png' },
    { name: 'Pal Nostalji', category: 'Türkçe Nostalji', url: 'https://palnostalji.daioncdn.net/palnostalji/palnostalji.m3u8?app=palnostalji_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pal_Nostalji_logo.png/512px-Pal_Nostalji_logo.png' },
    { name: 'Pal Doğa', category: 'Türkü & Özgün', url: 'https://paldoga.daioncdn.net/paldoga/paldoga.m3u8?app=paldoga_web', logo: 'https://i.imgur.com/wdWR7Qk.png' },
    { name: 'Pal Station', category: 'Yabancı Hit', url: 'https://palstation.daioncdn.net/palstation/palstation.m3u8?app=palstation_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pal_FM_logo.png/512px-Pal_FM_logo.png' },
    { name: 'Pal Akustik', category: 'Akustik', url: 'https://palakustik.daioncdn.net/palakustik/palakustik.m3u8?app=palakustik_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pal_FM_logo.png/512px-Pal_FM_logo.png' },
    { name: 'Number 1 FM', category: 'Yabancı Hit', url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1e2d83768.smil/playlist.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Number1_TV_logo.png/512px-Number1_TV_logo.png' },
    { name: 'Number 1 Türk FM', category: 'Türkçe Pop', url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1f56be91e.smil/playlist.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Number_One_T%C3%BCrk_TV_logo.png/512px-Number_One_T%C3%BCrk_TV_logo.png' },

    // Kanal 7 & Diyanet Radyoları & Ekstra
    { name: 'Radyo 7', category: 'Karma', url: 'https://kanal7-live.daioncdn.net/radyo7/radyo7.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanal_7_logo.svg/512px-Kanal_7_logo.svg.png' },
    { name: 'Radyo 7 Türkü', category: 'Türkü', url: 'https://kanal7-live.daioncdn.net/radyo7turku/radyo7turku.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanal_7_logo.svg/512px-Kanal_7_logo.svg.png' },
    { name: 'Radyo 7 Sanat', category: 'Sanat Müziği', url: 'https://kanal7-live.daioncdn.net/radyo7tsm/radyo7tsm.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanal_7_logo.svg/512px-Kanal_7_logo.svg.png' },
    { name: 'Radyo 7 Tasavvuf', category: 'Tasavvuf / İlahi', url: 'https://kanal7-live.daioncdn.net/radyo7tasavvuf/radyo7tasavvuf.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanal_7_logo.svg/512px-Kanal_7_logo.svg.png' },
    { name: 'Diyanet Radyo', category: 'Dini & Kültür', url: 'https://diyanetradyo-live.daioncdn.net/diyanetradyo/diyanetradyo.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Diyanet_TV_logo.png/512px-Diyanet_TV_logo.png' },
    { name: 'Diyanet Kur\'an Radyo', category: 'Kur\'an-ı Kerim', url: 'https://diyanetkuran-live.daioncdn.net/diyanetkuran/diyanetkuran.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Diyanet_TV_logo.png/512px-Diyanet_TV_logo.png' },
    { name: 'Diyanet Risalet Radyo', category: 'Dini & Kültür', url: 'https://diyanetrisalet-live.daioncdn.net/diyanetrisalet/diyanetrisalet.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Diyanet_TV_logo.png/512px-Diyanet_TV_logo.png' },
    { name: 'Moral FM', category: 'Sohbet & Kültür', url: 'https://yayin.canliradyolive.com/8038/stream', logo: 'https://i.imgur.com/wdWR7Qk.png' },
    { name: 'AKRA FM', category: 'Sohbet & Kültür', url: 'https://yayin.akradyo.net:8000/stream', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/AKRA_logo.png/512px-AKRA_logo.png' },
    { name: 'A Haber Radyo', category: 'Haber', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/A_Haber_logo.svg/512px-A_Haber_logo.svg.png' },
    { name: 'A Spor Radyo', category: 'Spor', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_Spor_logo.svg/512px-A_Spor_logo.svg.png' },
    { name: 'Vav Radyo', category: 'Dini & Kültür', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/vavradyo/vavradyo.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Vav_TV_logo.png/512px-Vav_TV_logo.png' },
    { name: 'Turkuvaz Radyo', category: 'Türkçe Pop', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/turkuvazradyo/turkuvazradyo.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Atv_logo.svg/512px-Atv_logo.svg.png' },
    { name: 'Turkuvaz Romantik', category: 'Türkçe Slow', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/turkuvazromantik/turkuvazromantik.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Atv_logo.svg/512px-Atv_logo.svg.png' },
    { name: 'Turkuvaz Efsane', category: 'Nostalji', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/turkuvazefsane/turkuvazefsane.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Atv_logo.svg/512px-Atv_logo.svg.png' },

    // Additional popular radios from turkey
    { name: 'Kral World Radio', category: 'Yabancı Hit', url: 'https://dogus.daioncdn.net/kralworld/kralworld.m3u8?app=kralworld_web', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Kral_TV_logo.svg/512px-Kral_TV_logo.svg.png' },
    { name: 'Kafa Radyo', category: 'Sohbet & Müzik', url: 'https://kafaradyo.daioncdn.net/kafaradyo/kafaradyo.m3u8?app=kafaradyo_web', logo: 'https://i.imgur.com/6tv0zxh.png' },
    { name: 'Kupon FM', category: 'Oyun Havası', url: 'https://yayin.canliradyolive.com/8070/stream', logo: 'https://i.imgur.com/wdWR7Qk.png' },
    { name: 'Gözde FM', category: 'Türkçe Pop', url: 'https://yayin.canliradyolive.com/8054/stream', logo: 'https://i.imgur.com/P4wUa0q.png' },
    { name: 'Damar FM', category: 'Arabesk / Damar', url: 'https://yayin.canliradyolive.com/8040/stream', logo: 'https://i.imgur.com/8QjZ2rM.png' },
    { name: 'Radyo Seymen', category: 'Oyun Havası', url: 'https://yayin.canliradyolive.com/8020/stream', logo: 'https://i.imgur.com/p0qE2Xv.png' },
    { name: 'Radyo Banko', category: 'Ankara Oyun Havası', url: 'https://yayin.canliradyolive.com/8022/stream', logo: 'https://i.imgur.com/X2k1nQx.png' },
    { name: 'Radyo 2000', category: 'Arabesk', url: 'https://yayin.canliradyolive.com/8012/stream', logo: 'https://i.imgur.com/V9r1a8k.png' },
    { name: 'Radyo Alaturka', category: 'Türk Sanat Müziği', url: 'https://stream.radyoalaturka.com.tr/stream', logo: 'https://i.imgur.com/iOCQdyD.png' },
    { name: 'KEXP 90.3 Seattle', category: 'Yabancı Alternatif', url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/KEXP_logo.svg/512px-KEXP_logo.svg.png' },
    { name: 'Ibiza Global Radio', category: 'Elektronik / Deep', url: 'https://listenssl.ibizaglobalradio.com:8024/ibizaglobalradio.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' }
  ];

  // Also include top radios from radio-browser
  for (const r of radioList.slice(0, 80)) {
    if (r.url_resolved && (r.url_resolved.startsWith('http://') || r.url_resolved.startsWith('https://'))) {
      curated.push({
        name: r.name ? r.name.trim() : 'Radyo',
        category: r.tags ? r.tags.split(',')[0] || 'Genel' : 'Genel',
        url: r.url_resolved,
        logo: r.favicon || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png'
      });
    }
  }

  // Deduplicate
  const uniqueMap = new Map();
  for (const r of curated) {
    if (!uniqueMap.has(r.url)) {
      uniqueMap.set(r.url, r);
    }
  }
  const uniqueRadios = Array.from(uniqueMap.values());
  console.log(`Testing ${uniqueRadios.length} candidate radios...`);

  const working = [];
  const chunkSize = 20;
  for (let i = 0; i < uniqueRadios.length; i += chunkSize) {
    const chunk = uniqueRadios.slice(i, i + chunkSize);
    const results = await Promise.all(chunk.map(async (r) => {
      const res = await checkStream(r.url);
      return { ...r, ...res };
    }));
    for (const res of results) {
      if (res.ok) {
        working.push(res);
      }
    }
    console.log(`Processed ${Math.min(i + chunkSize, uniqueRadios.length)}/${uniqueRadios.length} - Working radios: ${working.length}`);
  }

  console.log(`\nTOTAL WORKING RADIOS: ${working.length}`);
  fs.writeFileSync('./scripts/all_working_radios.json', JSON.stringify(working, null, 2));
}

run();
