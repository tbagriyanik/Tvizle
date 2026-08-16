import https from 'https';
import http from 'http';
import fs from 'fs';

// Let's test different stream endpoints for Turkish radios
const radioCandidates = [
  // TRT Radios (m3u8 format)
  { id: 'radio-trtfm', name: 'TRT FM', category: 'Karma', url: 'https://radio-trtfm.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png' },
  { id: 'radio-trtradyo1', name: 'TRT Radyo 1', category: 'Haber & Kültür', url: 'https://radio-trtradyo1.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/TRT_Radyo_1_logo_2021.svg/512px-TRT_Radyo_1_logo_2021.svg.png' },
  { id: 'radio-trtradyo3', name: 'TRT Radyo 3', category: 'Klasik & Caz', url: 'https://radio-trtradyo3.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/TRT_Radyo_3_logo_2021.svg/512px-TRT_Radyo_3_logo_2021.svg.png' },
  { id: 'radio-trtnagme', name: 'TRT Nağme', category: 'Sanat Müziği', url: 'https://radio-trtnagme.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/TRT_Na%C4%9Fme_logo_2021.svg/512px-TRT_Na%C4%9Fme_logo_2021.svg.png' },
  { id: 'radio-trtturku', name: 'TRT Türkü', category: 'Türkü', url: 'https://radio-trtturku.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/TRT_T%C3%BCrk%C3%BC_logo_2021.svg/512px-TRT_T%C3%BCrk%C3%BC_logo_2021.svg.png' },
  { id: 'radio-trtradyohaber', name: 'TRT Radyo Haber', category: 'Haber', url: 'https://radio-trtradyohaber.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/TRT_Radyo_1_logo_2021.svg/512px-TRT_Radyo_1_logo_2021.svg.png' },
  { id: 'radio-trtkentradyo', name: 'TRT Kent Radyo', category: 'Şehir & Haber', url: 'https://radio-trtkentradyoistanbul.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png' },
  { id: 'radio-trttsr', name: 'TRT TSR Dış Yayınlar', category: 'Kültür & Müzik', url: 'https://radio-tsr.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png' },
  { id: 'radio-trtkurdi', name: 'TRT Radyo Kurdî', category: 'Kültür', url: 'https://radio-trtradyokurdi.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/TRT_Kurd%C3%AE_logo_2021.svg/512px-TRT_Kurd%C3%AE_logo_2021.svg.png' },
  { id: 'radio-trtworldradyo', name: 'TRT World Radio', category: 'Dünya / Haber', url: 'https://radio-trtworld.medya.trt.com.tr/master.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/TRT_World_logo_2021.svg/512px-TRT_World_logo_2021.svg.png' },

  // Power Group
  { id: 'radio-powerturk', name: 'PowerTürk', category: 'Türkçe Pop', url: 'https://listen.powerapp.com.tr/powerturk/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png' },
  { id: 'radio-powerfm', name: 'Power FM', category: 'Yabancı Hit', url: 'https://listen.powerapp.com.tr/powerfm/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-powerlove', name: 'Power Love', category: 'Yabancı Slow', url: 'https://listen.powerapp.com.tr/powerlove/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-powerakustik', name: 'PowerTürk Akustik', category: 'Akustik', url: 'https://listen.powerapp.com.tr/powerturkakustik/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png' },
  { id: 'radio-powerdance', name: 'Power Dance', category: 'Dans / Club', url: 'https://listen.powerapp.com.tr/powerdance/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-powergold', name: 'Power Gold', category: 'Nostalji', url: 'https://listen.powerapp.com.tr/powergold/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-powerdeep', name: 'Power Deep House', category: 'Elektronik', url: 'https://listen.powerapp.com.tr/powerdeep/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-powerrocks', name: 'Power Rocks', category: 'Rock', url: 'https://listen.powerapp.com.tr/powerrocks/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-powertaptaze', name: 'PowerTürk Taptaze', category: 'Türkçe Pop', url: 'https://listen.powerapp.com.tr/powerturktaptaze/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png' },
  { id: 'radio-powerefsane', name: 'PowerTürk Efsane', category: 'Türkçe 90lar', url: 'https://listen.powerapp.com.tr/powerturkefsane/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png' },
  { id: 'radio-powerlounge', name: 'Power Lounge', category: 'Lounge / Chill', url: 'https://listen.powerapp.com.tr/powerlounge/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-powersmooth', name: 'Power Smooth Jazz', category: 'Caz', url: 'https://listen.powerapp.com.tr/powersmoothjazz/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-powerclub', name: 'Power Club', category: 'Club', url: 'https://listen.powerapp.com.tr/powerclub/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-powercover', name: 'Power Cover', category: 'Cover', url: 'https://listen.powerapp.com.tr/powercover/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-powersalsa', name: 'Power Salsa', category: 'Latin / Salsa', url: 'https://listen.powerapp.com.tr/powersalsa/mpeg/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },

  // Fenomen Group
  { id: 'radio-fenomen', name: 'Radyo Fenomen', category: 'Yabancı Hit', url: 'https://listen.radyofenomen.com/fenomen/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
  { id: 'radio-fenomenturk', name: 'Fenomen Türk', category: 'Türkçe Pop', url: 'https://listen.radyofenomen.com/fenomenturk/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
  { id: 'radio-fenomenclub', name: 'Fenomen Club', category: 'Club & Dans', url: 'https://listen.radyofenomen.com/fenomenclub/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
  { id: 'radio-fenomenrap', name: 'Fenomen Rap', category: 'Türkçe Rap & HipHop', url: 'https://listen.radyofenomen.com/fenomenrap/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
  { id: 'radio-fenomenoriental', name: 'Fenomen Oryantal', category: 'Oryantal / Oyun Havası', url: 'https://listen.radyofenomen.com/fenomenoryantal/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
  { id: 'radio-fenomenpop', name: 'Fenomen Pop', category: 'Yabancı Pop', url: 'https://listen.radyofenomen.com/fenomenpop/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },
  { id: 'radio-fenomenakustik', name: 'Fenomen Akustik', category: 'Akustik', url: 'https://listen.radyofenomen.com/fenomenakustik/128/icecast.audio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png' },

  // StreamTheWorld (Karnaval)
  { id: 'radio-joyfm', name: 'Joy FM', category: 'Yabancı Slow', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_FM.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Joy_FM_logo.png/512px-Joy_FM_logo.png' },
  { id: 'radio-joyturk', name: 'JoyTürk', category: 'Türkçe Slow', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_TURK.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png' },
  { id: 'radio-joyturkakustik', name: 'JoyTürk Akustik', category: 'Akustik', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOYTURK_AKUSTIK.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png' },
  { id: 'radio-joyturkrock', name: 'JoyTürk Rock', category: 'Türkçe Rock', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOYTURK_ROCK.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png' },
  { id: 'radio-virgin', name: 'Virgin Radio Türkiye', category: 'Yabancı Hit', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/VIRGIN_RADIO.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Virgin_Radio_logo.svg/512px-Virgin_Radio_logo.svg.png' },
  { id: 'radio-metrofm', name: 'Metro FM', category: 'Yabancı Hit', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/METRO_FM.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Metro_FM_logo.png/512px-Metro_FM_logo.png' },
  { id: 'radio-superfm', name: 'Süper FM', category: 'Türkçe Pop', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/SUPER_FM.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/S%C3%BCper_FM_logo.png/512px-S%C3%BCper_FM_logo.png' },
  { id: 'radio-retroturk', name: 'Retro Türk', category: 'Nostalji', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RETRO_TURK.mp3', logo: 'https://i.imgur.com/8QjZ2rM.png' },
  { id: 'radio-efsaneturk', name: 'Efsane Türk', category: 'Arabesk / Fantezi', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/EFSANE_TURK.mp3', logo: 'https://i.imgur.com/P4wUa0q.png' },
  { id: 'radio-mydonose', name: 'Radyo Mydonose', category: 'Yabancı Hit', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_MYDONOSE.mp3', logo: 'https://i.imgur.com/p0qE2Xv.png' },
  { id: 'radio-zeplin', name: 'Radyo Zeplin', category: 'Rock / Alternatif', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ZEPLIN.mp3', logo: 'https://i.imgur.com/6tv0zxh.png' },
  { id: 'radio-borusan', name: 'Borusan Klasik', category: 'Klasik Müzik', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BORUSAN_KLASIK.mp3', logo: 'https://i.imgur.com/iOCQdyD.png' },
  { id: 'radio-joyjazz', name: 'Joy Jazz', category: 'Caz', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_JAZZ.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Joy_FM_logo.png/512px-Joy_FM_logo.png' },
  { id: 'radio-karnaval90lar', name: 'Karnaval 90lar', category: '90lar Pop', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KARNAVAL90LAR.mp3', logo: 'https://i.imgur.com/8QjZ2rM.png' },
  { id: 'radio-radyotrafik', name: 'Radyo Trafik İstanbul', category: 'Trafik & Haber', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_TRAFIK_AAC.aac', logo: 'https://i.imgur.com/X2k1nQx.png' },

  // CanliRadyoLive & Shoutcast Streams
  { id: 'radio-moralfm', name: 'Moral FM', category: 'Sohbet & Kültür', url: 'https://yayin.canliradyolive.com/8038/stream', logo: 'https://i.imgur.com/wdWR7Qk.png' },
  { id: 'radio-kuponfm', name: 'Kupon FM', category: 'Oyun Havası', url: 'https://yayin.canliradyolive.com/8070/stream', logo: 'https://i.imgur.com/wdWR7Qk.png' },
  { id: 'radio-gozdefm', name: 'Gözde FM', category: 'Türkçe Pop', url: 'https://yayin.canliradyolive.com/8054/stream', logo: 'https://i.imgur.com/P4wUa0q.png' },
  { id: 'radio-damarfm', name: 'Damar FM', category: 'Arabesk / Damar', url: 'https://yayin.canliradyolive.com/8040/stream', logo: 'https://i.imgur.com/8QjZ2rM.png' },
  { id: 'radio-seymen', name: 'Radyo Seymen', category: 'Oyun Havası', url: 'https://yayin.canliradyolive.com/8020/stream', logo: 'https://i.imgur.com/p0qE2Xv.png' },
  { id: 'radio-banko', name: 'Radyo Banko', category: 'Ankara Oyun Havası', url: 'https://yayin.canliradyolive.com/8022/stream', logo: 'https://i.imgur.com/X2k1nQx.png' },
  { id: 'radio-2000', name: 'Radyo 2000', category: 'Arabesk', url: 'https://yayin.canliradyolive.com/8012/stream', logo: 'https://i.imgur.com/V9r1a8k.png' },
  { id: 'radio-akrafm', name: 'AKRA FM', category: 'Sohbet & Kültür', url: 'https://yayin.akradyo.net:8000/stream', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/AKRA_logo.png/512px-AKRA_logo.png' },
  { id: 'radio-alaturka', name: 'Radyo Alaturka', category: 'Sanat Müziği', url: 'https://stream.radyoalaturka.com.tr/stream', logo: 'https://i.imgur.com/iOCQdyD.png' },
  { id: 'radio-gonul', name: 'Radyo Gönül', category: 'Türkçe Nostalji', url: 'https://yayin.gonulfm.com:8000/stream', logo: 'https://i.imgur.com/P4wUa0q.png' },
  { id: 'radio-karadenizfm', name: 'Karadeniz FM', category: 'Karadeniz & Türkü', url: 'https://yayin.karadenizfm.com.tr:8000/stream', logo: 'https://i.imgur.com/lM5R3oZ.png' },
  { id: 'radio-showradyo-shout', name: 'Show Radyo Canlı', category: 'Türkçe Pop', url: 'https://stream.showradyo.com.tr/stream', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Show_Radyo_logo.png/512px-Show_Radyo_logo.png' },
  { id: 'radio-vivaradyo-shout', name: 'Radyo Viva Canlı', category: 'Türkçe Pop', url: 'https://stream.radyoviva.com.tr/stream', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Radyo_Viva_logo.png/512px-Radyo_Viva_logo.png' },

  // Mediatriple & Turkuvaz & International
  { id: 'radio-number1fm', name: 'Number 1 FM', category: 'Yabancı Hit', url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1e2d83768.smil/playlist.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Number1_TV_logo.png/512px-Number1_TV_logo.png' },
  { id: 'radio-number1turk', name: 'Number 1 Türk FM', category: 'Türkçe Pop', url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1f56be91e.smil/playlist.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Number_One_T%C3%BCrk_TV_logo.png/512px-Number_One_T%C3%BCrk_TV_logo.png' },
  { id: 'radio-ahaberradyo', name: 'A Haber Radyo', category: 'Haber', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/A_Haber_logo.svg/512px-A_Haber_logo.svg.png' },
  { id: 'radio-asporradyo', name: 'A Spor Radyo', category: 'Spor', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_Spor_logo.svg/512px-A_Spor_logo.svg.png' },
  { id: 'radio-vavradyo', name: 'Vav Radyo', category: 'Dini & Kültür', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/vavradyo/vavradyo.m3u8', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Vav_TV_logo.png/512px-Vav_TV_logo.png' },
  { id: 'radio-kexp', name: 'KEXP 90.3 Seattle', category: 'Yabancı Alternatif', url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/KEXP_logo.svg/512px-KEXP_logo.svg.png' },
  { id: 'radio-ibiza', name: 'Ibiza Global Radio', category: 'Elektronik & Chill', url: 'https://listenssl.ibizaglobalradio.com:8024/ibizaglobalradio.mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-bbcworld', name: 'BBC World Service', category: 'Dünya / Haber', url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/BBC.svg/512px-BBC.svg.png' },
  { id: 'radio-somafm-groove', name: 'SomaFM Groove Salad', category: 'Ambient / Chillout', url: 'https://ice1.somafm.com/groovesalad-128-mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-somafm-drone', name: 'SomaFM Drone Zone', category: 'Ambient & Space', url: 'https://ice1.somafm.com/dronezone-128-mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-somafm-indie', name: 'SomaFM Indie Pop Rocks', category: 'Indie Pop', url: 'https://ice1.somafm.com/indiepop-128-mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-somafm-secret', name: 'SomaFM Secret Agent', category: 'Spy / Lounge', url: 'https://ice1.somafm.com/secretagent-128-mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-somafm-lush', name: 'SomaFM Lush', category: 'Chillout Pop', url: 'https://ice1.somafm.com/lush-128-mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-somafm-defcon', name: 'SomaFM DEF CON Radio', category: 'Elektronik & Hack', url: 'https://ice1.somafm.com/defcon-128-mp3', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png' },
  { id: 'radio-classicfm', name: 'Classic FM UK', category: 'Klasik Müzik', url: 'https://media-ssl.musicradio.com/ClassicFM', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/TRT_Radyo_3_logo_2021.svg/512px-TRT_Radyo_3_logo_2021.svg.png' },
  { id: 'radio-capitalfm', name: 'Capital FM UK', category: 'Yabancı Hit', url: 'https://media-ssl.musicradio.com/CapitalUK', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Virgin_Radio_logo.svg/512px-Virgin_Radio_logo.svg.png' },
  { id: 'radio-smoothuk', name: 'Smooth Radio UK', category: 'Yabancı Slow & Soul', url: 'https://media-ssl.musicradio.com/SmoothUK', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Joy_FM_logo.png/512px-Joy_FM_logo.png' },
  { id: 'radio-heartuk', name: 'Heart FM UK', category: 'Yabancı Pop', url: 'https://media-ssl.musicradio.com/HeartUK', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/S%C3%BCper_FM_logo.png/512px-S%C3%BCper_FM_logo.png' }
];

function checkUrl(item) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(item.url);
      const mod = parsed.protocol === 'https:' ? https : http;
      const req = mod.get(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        timeout: 4000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          checkUrl({ ...item, url: res.headers.location }).then(resolve);
          res.destroy();
          return;
        }
        const ok = res.statusCode >= 200 && res.statusCode < 400;
        resolve({ ...item, status: res.statusCode, ok });
        res.destroy();
      });
      req.on('error', (e) => resolve({ ...item, status: e.message, ok: false }));
      req.on('timeout', () => { req.destroy(); resolve({ ...item, status: 'TIMEOUT', ok: false }); });
    } catch (e) {
      resolve({ ...item, status: 'ERR', ok: false });
    }
  });
}

async function testAll() {
  console.log(`Checking ${radioCandidates.length} radios...`);
  const tested = await Promise.all(radioCandidates.map(checkUrl));
  const working = tested.filter(r => r.ok);
  console.log(`Working radios: ${working.length} / ${radioCandidates.length}`);
  fs.writeFileSync('./scripts/working_radios_final.json', JSON.stringify(working, null, 2));
}

testAll();
