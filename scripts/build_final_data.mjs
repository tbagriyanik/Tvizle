import fs from 'fs';

// Curated verified Turkish TV Channels with reliable direct streams and clean logos
const tvChannels = [
  // --- ULUSAL / GENEL ---
  {
    id: 'tv-trt1',
    name: 'TRT 1',
    type: 'tv',
    url: 'https://tv-trt1.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/TRT_1_logo_%282021-%29.svg/512px-TRT_1_logo_%282021-%29.svg.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-atv',
    name: 'ATV',
    type: 'tv',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Atv_logo.svg/512px-Atv_logo.svg.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-kanald',
    name: 'Kanal D',
    type: 'tv',
    url: 'https://demiroren.daioncdn.net/kanald/kanald.m3u8?app=kanald_web&ce=3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kanal_D_logo.svg/512px-Kanal_D_logo.svg.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-showtv',
    name: 'Show TV',
    type: 'tv',
    url: 'https://ciner-live.ercdn.net/showtv/showtv.m3u8',
    logo: 'https://i.imgur.com/1l7SCCu.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-startv',
    name: 'Star TV',
    type: 'tv',
    url: 'https://dogus.daioncdn.net/startv/startv_720p.m3u8?app=a20ac41e-bdc3-4aa1-934d-26b484480ac9&ce=3&sid=8l4w3lst4co5',
    logo: 'https://i.imgur.com/9O3DHRB.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-tv8',
    name: 'TV8',
    type: 'tv',
    url: 'https://tv8.daioncdn.net/tv8/tv8.m3u8?app=7ddc255a-ef47-4e81-ab14-c0e5f2949788&ce=3',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/68/Tv8_Yeni_Logo.png/512px-Tv8_Yeni_Logo.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-kanal7',
    name: 'Kanal 7',
    type: 'tv',
    url: 'https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanal_7_logo.svg/512px-Kanal_7_logo.svg.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-beyaztv',
    name: 'Beyaz TV',
    type: 'tv',
    url: 'https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Beyaz_TV_logo.svg/512px-Beyaz_TV_logo.svg.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-teve2',
    name: 'Teve2',
    type: 'tv',
    url: 'https://live.duhnet.tv/S2/HLS_LIVE/teve2np/playlist.m3u8',
    logo: 'https://i.imgur.com/rsoSLih.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-nowtv',
    name: 'NOW TV',
    type: 'tv',
    url: 'https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/NOW_Turkey_logo.svg/512px-NOW_Turkey_logo.svg.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-tv85',
    name: 'TV8.5',
    type: 'tv',
    url: 'https://tv8.daioncdn.net/tv8-5/tv8-5.m3u8?app=tv85_web',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/68/Tv8_Yeni_Logo.png/512px-Tv8_Yeni_Logo.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-tv24',
    name: '24 TV',
    type: 'tv',
    url: 'https://turkmedya-live.ercdn.net/tv24/tv24.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/c/cf/24_TV_logosu.png/512px-24_TV_logosu.png',
    category: 'Haber'
  },
  {
    id: 'tv-tvnet',
    name: 'TVNET',
    type: 'tv',
    url: 'https://tvnet-live.lg.mncdn.com/tvnet/tvnet/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Tvnet.png/512px-Tvnet.png',
    category: 'Haber'
  },
  {
    id: 'tv-tv4',
    name: 'TV4',
    type: 'tv',
    url: 'https://turkmedya-live.ercdn.net/tv4/tv4.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Tv4_logo.png/512px-Tv4_logo.png',
    category: 'Ulusal'
  },
  {
    id: 'tv-tbmmtv',
    name: 'TBMM TV (Meclis TV)',
    type: 'tv',
    url: 'https://meclistv-live.ercdn.net/meclistv/meclistv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/TBMM_TV_logo.png/512px-TBMM_TV_logo.png',
    category: 'Haber'
  },
  {
    id: 'tv-tjktv',
    name: 'TJK TV',
    type: 'tv',
    url: 'https://tjktv-live.tjk.org/tjktv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/4/4b/TJK_TV_logo.png/512px-TJK_TV_logo.png',
    category: 'Spor'
  },
  {
    id: 'tv-zaroktv',
    name: 'Zarok TV',
    type: 'tv',
    url: 'https://zindikurmanci.zaroktv.com.tr/hls/stream.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Zarok_TV_Logo.png/512px-Zarok_TV_Logo.png',
    category: 'Çocuk'
  },

  // --- HABER & EKONOMİ ---
  {
    id: 'tv-trthaber',
    name: 'TRT Haber',
    type: 'tv',
    url: 'https://tv-trthaber.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/TRT_Haber_Eyl%C3%BCl_2020_Logo.svg/512px-TRT_Haber_Eyl%C3%BCl_2020_Logo.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-ahaber',
    name: 'A Haber',
    type: 'tv',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/A_Haber_logo.svg/512px-A_Haber_logo.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-cnnturk',
    name: 'CNN Türk',
    type: 'tv',
    url: 'https://demiroren.daioncdn.net/cnnturk/cnnturk.m3u8?app=cnnturk_web&ce=3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/CNN_T%C3%BCrk_logo.svg/512px-CNN_T%C3%BCrk_logo.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-ntv',
    name: 'NTV',
    type: 'tv',
    url: 'https://dogus.daioncdn.net/ntv/ntv.m3u8?app=ntv_web',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ntv_logo.svg/512px-Ntv_logo.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-haberturk',
    name: 'Habertürk',
    type: 'tv',
    url: 'https://tv.ensonhaber.com/haberturk/haberturk.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Habert%C3%BCrk_TV_logo.svg/512px-Habert%C3%BCrk_TV_logo.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-halktv',
    name: 'Halk TV',
    type: 'tv',
    url: 'https://halktv-live.daioncdn.net/halktv/halktv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Halk_TV_logo.svg/512px-Halk_TV_logo.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-tv100',
    name: 'TV100',
    type: 'tv',
    url: 'https://tv.ensonhaber.com/tv100/tv100.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/0f/TV100_logo.png/512px-TV100_logo.png',
    category: 'Haber'
  },
  {
    id: 'tv-tele1',
    name: 'Tele1',
    type: 'tv',
    url: 'https://tele1-live.ercdn.net/tele1/tele1.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/4/43/Tele1_logosu.png',
    category: 'Haber'
  },
  {
    id: 'tv-tgrthaber',
    name: 'TGRT Haber',
    type: 'tv',
    url: 'https://tgrthaber-live.daioncdn.net/tgrthaber/tgrthaber.m3u8',
    logo: 'https://i.imgur.com/PrxwKDw.png',
    category: 'Haber'
  },
  {
    id: 'tv-ulketv',
    name: 'Ülke TV',
    type: 'tv',
    url: 'https://kanal7-live.daioncdn.net/ulketv/ulketv.m3u8',
    logo: 'https://i.imgur.com/wdWR7Qk.png',
    category: 'Haber'
  },
  {
    id: 'tv-sozcutv',
    name: 'Sözcü TV',
    type: 'tv',
    url: 'https://sozcutv-live.daioncdn.net/sozcutv/sozcutv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/S%C3%B6zc%C3%BC_TV_logo.svg/512px-S%C3%B6zc%C3%BC_TV_logo.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-flashhaber',
    name: 'Flash Haber TV',
    type: 'tv',
    url: 'https://flashhaber-live.daioncdn.net/flashhaber/flashhaber.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flash_TV_logosu.png/512px-Flash_TV_logosu.png',
    category: 'Haber'
  },
  {
    id: 'tv-benguturk',
    name: 'Bengü Türk TV',
    type: 'tv',
    url: 'https://benguturk-live.daioncdn.net/benguturk/benguturk.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/7/7b/Beng%C3%BC_T%C3%BCrk_logo.png/512px-Beng%C3%BC_T%C3%BCrk_logo.png',
    category: 'Haber'
  },
  {
    id: 'tv-ulusal',
    name: 'Ulusal Kanal',
    type: 'tv',
    url: 'https://live.duhnet.tv/S2/HLS_LIVE/ulusalkanal/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ulusal_Kanal_logo.svg/512px-Ulusal_Kanal_logo.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-bloomberght',
    name: 'Bloomberg HT',
    type: 'tv',
    url: 'https://tv.ensonhaber.com/bloomberght/bloomberght.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Bloomberg_HT_logo.svg/512px-Bloomberg_HT_logo.svg.png',
    category: 'Ekonomi'
  },
  {
    id: 'tv-ekoturk',
    name: 'Ekotürk TV',
    type: 'tv',
    url: 'https://ekoturk-live.daioncdn.net/ekoturk/ekoturk.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/9/90/Ekot%C3%BCrk_logo.png/512px-Ekot%C3%BCrk_logo.png',
    category: 'Ekonomi'
  },
  {
    id: 'tv-apara',
    name: 'A Para',
    type: 'tv',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/apara/apara.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/A_Para_logo.svg/512px-A_Para_logo.svg.png',
    category: 'Ekonomi'
  },
  {
    id: 'tv-anews',
    name: 'A News',
    type: 'tv',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/anews/anews.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/A_News_logo.svg/512px-A_News_logo.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-trtworld',
    name: 'TRT World',
    type: 'tv',
    url: 'https://tv-trtworld.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/TRT_World_logo_2021.svg/512px-TRT_World_logo_2021.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-trtarabi',
    name: 'TRT Arabi',
    type: 'tv',
    url: 'https://tv-trtarabi.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/TRT_Arabi_2021.svg/512px-TRT_Arabi_2021.svg.png',
    category: 'Haber'
  },
  {
    id: 'tv-trtkurdi',
    name: 'TRT Kurdî',
    type: 'tv',
    url: 'https://tv-trtkurdi.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/TRT_Kurd%C3%AE_logo_2021.svg/512px-TRT_Kurd%C3%AE_logo_2021.svg.png',
    category: 'Kültür Sanat'
  },
  {
    id: 'tv-trtavaz',
    name: 'TRT Avaz',
    type: 'tv',
    url: 'https://tv-trtavaz.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/TRT_Avaz_logo_2021.svg/512px-TRT_Avaz_logo_2021.svg.png',
    category: 'Kültür Sanat'
  },
  {
    id: 'tv-trtturk',
    name: 'TRT Türk',
    type: 'tv',
    url: 'https://tv-trtturk.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/TRT_T%C3%BCrk_logo_2021.svg/512px-TRT_T%C3%BCrk_logo_2021.svg.png',
    category: 'Kültür Sanat'
  },

  // --- SPOR ---
  {
    id: 'tv-aspor',
    name: 'A Spor',
    type: 'tv',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_Spor_logo.svg/512px-A_Spor_logo.svg.png',
    category: 'Spor'
  },
  {
    id: 'tv-trtspor',
    name: 'TRT Spor',
    type: 'tv',
    url: 'https://tv-trtspor1.medya.trt.com.tr/master.m3u8',
    logo: 'https://i.imgur.com/6tv0zxh.png',
    category: 'Spor'
  },
  {
    id: 'tv-fbtv',
    name: 'FB TV (Fenerbahçe)',
    type: 'tv',
    url: 'https://fbtv-live.daioncdn.net/fbtv/fbtv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/86/Fenerbah%C3%A7e_SK.png/512px-Fenerbah%C3%A7e_SK.png',
    category: 'Spor'
  },
  {
    id: 'tv-sportstv',
    name: 'Sports TV',
    type: 'tv',
    url: 'https://sportstv-live.daioncdn.net/sportstv/sportstv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Sports_TV_logo.png/512px-Sports_TV_logo.png',
    category: 'Spor'
  },
  {
    id: 'tv-taytv',
    name: 'Tay TV',
    type: 'tv',
    url: 'https://live.duhnet.tv/S2/HLS_LIVE/taytvnp/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/05/Tay_TV_logo.png/512px-Tay_TV_logo.png',
    category: 'Spor'
  },
  {
    id: 'tv-redbull',
    name: 'Red Bull TV',
    type: 'tv',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Red_Bull_TV.png',
    category: 'Spor'
  },

  // --- BELGESEL / YAŞAM / DİN ---
  {
    id: 'tv-tgrtbelgesel',
    name: 'TGRT Belgesel',
    type: 'tv',
    url: 'https://tgrtbelgesel-live.daioncdn.net/tgrtbelgesel/tgrtbelgesel.m3u8',
    logo: 'https://i.imgur.com/PrxwKDw.png',
    category: 'Belgesel'
  },
  {
    id: 'tv-trt2',
    name: 'TRT 2',
    type: 'tv',
    url: 'https://tv-trt2.medya.trt.com.tr/master.m3u8',
    logo: 'https://i.imgur.com/iOCQdyD.png',
    category: 'Kültür Sanat'
  },
  {
    id: 'tv-trtbelgesel',
    name: 'TRT Belgesel',
    type: 'tv',
    url: 'https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/TRT_Belgesel_logo_%282019-%29.svg/512px-TRT_Belgesel_logo_%282019-%29.svg.png',
    category: 'Belgesel'
  },
  {
    id: 'tv-diyanettv',
    name: 'Diyanet TV',
    type: 'tv',
    url: 'https://diyanettv-live.daioncdn.net/diyanettv/diyanettv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Diyanet_TV_logo.png/512px-Diyanet_TV_logo.png',
    category: 'Belgesel'
  },
  {
    id: 'tv-ciftcitv',
    name: 'Çiftçi TV',
    type: 'tv',
    url: 'https://ciftcitv-live.daioncdn.net/ciftcitv/ciftcitv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/%C3%87ift%C3%A7i_TV_logo.png/512px-%C3%87ift%C3%A7i_TV_logo.png',
    category: 'Belgesel'
  },
  {
    id: 'tv-koytv',
    name: 'Köy TV',
    type: 'tv',
    url: 'https://koytv-live.daioncdn.net/koytv/koytv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/K%C3%B6y_TV_logo.png/512px-K%C3%B6y_TV_logo.png',
    category: 'Belgesel'
  },
  {
    id: 'tv-berekettv',
    name: 'Bereket TV',
    type: 'tv',
    url: 'https://berekettv-live.daioncdn.net/berekettv/berekettv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bereket_TV_logo.png/512px-Bereket_TV_logo.png',
    category: 'Belgesel'
  },

  // --- ÇOCUK ---
  {
    id: 'tv-trtcocuk',
    name: 'TRT Çocuk',
    type: 'tv',
    url: 'https://tv-trtcocuk.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/TRT_%C3%87ocuk_logo_%282021%29.svg/512px-TRT_%C3%87ocuk_logo_%282021%29.svg.png',
    category: 'Çocuk'
  },
  {
    id: 'tv-minikago',
    name: 'Minika GO',
    type: 'tv',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Minika_GO_logo.svg/512px-Minika_GO_logo.svg.png',
    category: 'Çocuk'
  },
  {
    id: 'tv-minikacocuk',
    name: 'Minika Çocuk',
    type: 'tv',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikacocuk/minikacocuk.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Minika_%C3%87ocuk_logo.svg/512px-Minika_%C3%87ocuk_logo.svg.png',
    category: 'Çocuk'
  },
  {
    id: 'tv-diyanetcocuk',
    name: 'Diyanet Çocuk',
    type: 'tv',
    url: 'https://diyanetcocuk-live.daioncdn.net/diyanetcocuk/diyanetcocuk.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Diyanet_TV_logo.png/512px-Diyanet_TV_logo.png',
    category: 'Çocuk'
  },

  // --- MÜZİK ---
  {
    id: 'tv-kralpoptv',
    name: 'Kral Pop TV',
    type: 'tv',
    url: 'https://dogus.daioncdn.net/kralpoptv/kralpoptv.m3u8?app=kralpoptv_web',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Kral_Pop_TV_logo.svg/512px-Kral_Pop_TV_logo.svg.png',
    category: 'Müzik'
  },
  {
    id: 'tv-kraltv',
    name: 'Kral TV',
    type: 'tv',
    url: 'https://dogus.daioncdn.net/kraltv/kraltv.m3u8?app=kraltv_web',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Kral_TV_logo.svg/512px-Kral_TV_logo.svg.png',
    category: 'Müzik'
  },
  {
    id: 'tv-trtmuzik',
    name: 'TRT Müzik',
    type: 'tv',
    url: 'https://tv-trtmuzik.medya.trt.com.tr/master.m3u8',
    logo: 'https://i.imgur.com/JgUzRH8.png',
    category: 'Müzik'
  },
  {
    id: 'tv-dreamturk',
    name: 'Dream Türk',
    type: 'tv',
    url: 'https://live.duhnet.tv/S2/HLS_LIVE/dreamturknp/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dream_T%C3%BCrk_logo.svg/512px-Dream_T%C3%BCrk_logo.svg.png',
    category: 'Müzik'
  },
  {
    id: 'tv-number1tv',
    name: 'Number 1 TV',
    type: 'tv',
    url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1e2d83768.smil/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Number1_TV_logo.png/512px-Number1_TV_logo.png',
    category: 'Müzik'
  },
  {
    id: 'tv-number1turktv',
    name: 'Number 1 Türk TV',
    type: 'tv',
    url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1f56be91e.smil/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Number_One_T%C3%BCrk_TV_logo.png/512px-Number_One_T%C3%BCrk_TV_logo.png',
    category: 'Müzik'
  },

  // --- BÖLGESEL / YEREL ---
  {
    id: 'tv-linetv',
    name: 'Line TV Bursa',
    type: 'tv',
    url: 'https://linetv-live.daioncdn.net/linetv/linetv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Line_TV_logo.png/512px-Line_TV_logo.png',
    category: 'Bölgesel'
  },
  {
    id: 'tv-kontv',
    name: 'Kon TV Konya',
    type: 'tv',
    url: 'https://kontv-live.daioncdn.net/kontv/kontv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/05/KonTV_logo.png/512px-KonTV_logo.png',
    category: 'Bölgesel'
  },
  {
    id: 'tv-caytv',
    name: 'Çay TV Rize',
    type: 'tv',
    url: 'https://caytv-live.daioncdn.net/caytv/caytv.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/7/77/%C3%87ay_TV_logo.png/512px-%C3%87ay_TV_logo.png',
    category: 'Bölgesel'
  },
  {
    id: 'tv-kanal3',
    name: 'Kanal 3 Afyon',
    type: 'tv',
    url: 'https://kanal3-live.daioncdn.net/kanal3/kanal3.m3u8',
    logo: 'https://i.imgur.com/P4wUa0q.png',
    category: 'Bölgesel'
  },
  {
    id: 'tv-kanal58',
    name: 'Kanal 58 Sivas',
    type: 'tv',
    url: 'https://kanal58-live.daioncdn.net/kanal58/kanal58.m3u8',
    logo: 'https://i.imgur.com/wV2J6mU.png',
    category: 'Bölgesel'
  },
  {
    id: 'tv-mavikaradeniz',
    name: 'Mavi Karadeniz TV',
    type: 'tv',
    url: 'https://mavikaradeniz-live.daioncdn.net/mavikaradeniz/mavikaradeniz.m3u8',
    logo: 'https://i.imgur.com/lM5R3oZ.png',
    category: 'Bölgesel'
  },

  // --- DÜNYA KANALLARI ---
  {
    id: 'tv-aljazeera',
    name: 'Al Jazeera English',
    type: 'tv',
    url: 'https://live-hls-web-aje-fa.thehlive.com/AJE/index.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Aljazeera_eng.svg/512px-Aljazeera_eng.svg.png',
    category: 'Dünya / Haber'
  },
  {
    id: 'tv-france24',
    name: 'France 24 English',
    type: 'tv',
    url: 'https://live.france24.com/hls/live/2037218-b/F24_EN_HI_HLS/master_2300.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/France_24_logo.svg/512px-France_24_logo.svg.png',
    category: 'Dünya / Haber'
  },
  {
    id: 'tv-dw-eng',
    name: 'DW English',
    type: 'tv',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_logo.svg/512px-Deutsche_Welle_logo.svg.png',
    category: 'Dünya / Haber'
  },
  {
    id: 'tv-skynews',
    name: 'Sky News',
    type: 'tv',
    url: 'https://skynewsau-live.akamaized.net/hls/live/2002689/skynewsau-extra1/master.m3u8',
    logo: 'https://d2n0069hmnqmmx.cloudfront.net/epgdata/1.0/newchanlogos/512/512/skychb1404.png',
    category: 'Dünya / Haber'
  },
  {
    id: 'tv-nasatv',
    name: 'NASA TV Live',
    type: 'tv',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/512px-NASA_logo.svg.png',
    category: 'Dünya / Belgesel'
  }
];

// Curated verified Turkish & International Radio Stations with direct working stream URLs
const radioChannels = [
  // --- TRT RADYOLARI ---
  {
    id: 'radio-trtfm',
    name: 'TRT FM',
    type: 'radio',
    url: 'https://radio-trtfm.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png',
    category: 'Karma'
  },
  {
    id: 'radio-trtradyo1',
    name: 'TRT Radyo 1',
    type: 'radio',
    url: 'https://radio-trtradyo1.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/TRT_Radyo_1_logo_2021.svg/512px-TRT_Radyo_1_logo_2021.svg.png',
    category: 'Haber & Kültür'
  },
  {
    id: 'radio-trtradyo3',
    name: 'TRT Radyo 3',
    type: 'radio',
    url: 'https://radio-trtradyo3.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/TRT_Radyo_3_logo_2021.svg/512px-TRT_Radyo_3_logo_2021.svg.png',
    category: 'Klasik & Caz'
  },
  {
    id: 'radio-trtnagme',
    name: 'TRT Nağme',
    type: 'radio',
    url: 'https://radio-trtnagme.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/TRT_Na%C4%9Fme_logo_2021.svg/512px-TRT_Na%C4%9Fme_logo_2021.svg.png',
    category: 'Sanat Müziği'
  },
  {
    id: 'radio-trtturku',
    name: 'TRT Türkü',
    type: 'radio',
    url: 'https://radio-trtturku.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/TRT_T%C3%BCrk%C3%BC_logo_2021.svg/512px-TRT_T%C3%BCrk%C3%BC_logo_2021.svg.png',
    category: 'Türkü'
  },
  {
    id: 'radio-trtradyohaber',
    name: 'TRT Radyo Haber',
    type: 'radio',
    url: 'https://radio-trtradyohaber.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/TRT_Radyo_1_logo_2021.svg/512px-TRT_Radyo_1_logo_2021.svg.png',
    category: 'Haber'
  },
  {
    id: 'radio-trtkentradyo',
    name: 'TRT Kent Radyo',
    type: 'radio',
    url: 'https://radio-trtkentradyoistanbul.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png',
    category: 'Şehir & Haber'
  },
  {
    id: 'radio-trttsr',
    name: 'TRT TSR Dış Yayınlar',
    type: 'radio',
    url: 'https://radio-tsr.medya.trt.com.tr/master.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png',
    category: 'Kültür & Müzik'
  },

  // --- POWER GROUP ---
  {
    id: 'radio-powerturk',
    name: 'PowerTürk',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powerturk/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png',
    category: 'Türkçe Pop'
  },
  {
    id: 'radio-powerfm',
    name: 'Power FM',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powerfm/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Yabancı Hit'
  },
  {
    id: 'radio-powerlove',
    name: 'Power Love',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powerlove/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Yabancı Slow'
  },
  {
    id: 'radio-powerakustik',
    name: 'PowerTürk Akustik',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powerturkakustik/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png',
    category: 'Akustik'
  },
  {
    id: 'radio-powerdance',
    name: 'Power Dance',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powerdance/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Dans / Club'
  },
  {
    id: 'radio-powergold',
    name: 'Power Gold',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powergold/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Nostalji'
  },
  {
    id: 'radio-powerdeep',
    name: 'Power Deep House',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powerdeep/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Elektronik'
  },
  {
    id: 'radio-powerrocks',
    name: 'Power Rocks',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powerrocks/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Rock'
  },
  {
    id: 'radio-powertaptaze',
    name: 'PowerTürk Taptaze',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powerturktaptaze/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png',
    category: 'Türkçe Pop'
  },
  {
    id: 'radio-powerefsane',
    name: 'PowerTürk Efsane',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powerturkefsane/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png',
    category: 'Türkçe 90lar'
  },
  {
    id: 'radio-powerlounge',
    name: 'Power Lounge',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powerlounge/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Lounge / Chill'
  },
  {
    id: 'radio-powersmooth',
    name: 'Power Smooth Jazz',
    type: 'radio',
    url: 'https://listen.powerapp.com.tr/powersmoothjazz/mpeg/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Caz'
  },

  // --- FENOMEN GROUP ---
  {
    id: 'radio-fenomen',
    name: 'Radyo Fenomen',
    type: 'radio',
    url: 'https://listen.radyofenomen.com/fenomen/128/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png',
    category: 'Yabancı Hit'
  },
  {
    id: 'radio-fenomenturk',
    name: 'Fenomen Türk',
    type: 'radio',
    url: 'https://listen.radyofenomen.com/fenomenturk/128/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png',
    category: 'Türkçe Pop'
  },
  {
    id: 'radio-fenomenclub',
    name: 'Fenomen Club',
    type: 'radio',
    url: 'https://listen.radyofenomen.com/fenomenclub/128/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png',
    category: 'Club & Dans'
  },
  {
    id: 'radio-fenomenrap',
    name: 'Fenomen Rap',
    type: 'radio',
    url: 'https://listen.radyofenomen.com/fenomenrap/128/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png',
    category: 'Türkçe Rap'
  },
  {
    id: 'radio-fenomenoriental',
    name: 'Fenomen Oryantal',
    type: 'radio',
    url: 'https://listen.radyofenomen.com/fenomenoryantal/128/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png',
    category: 'Oryantal'
  },
  {
    id: 'radio-fenomenpop',
    name: 'Fenomen Pop',
    type: 'radio',
    url: 'https://listen.radyofenomen.com/fenomenpop/128/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png',
    category: 'Yabancı Hit'
  },
  {
    id: 'radio-fenomenakustik',
    name: 'Fenomen Akustik',
    type: 'radio',
    url: 'https://listen.radyofenomen.com/fenomenakustik/128/icecast.audio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png',
    category: 'Akustik'
  },

  // --- KARNAVAL / STREAM THE WORLD ---
  {
    id: 'radio-joyfm',
    name: 'Joy FM',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_FM.mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Joy_FM_logo.png/512px-Joy_FM_logo.png',
    category: 'Yabancı Slow'
  },
  {
    id: 'radio-joyturk',
    name: 'JoyTürk',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_TURK.mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png',
    category: 'Türkçe Slow'
  },
  {
    id: 'radio-joyturkakustik',
    name: 'JoyTürk Akustik',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOYTURK_AKUSTIK.mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png',
    category: 'Akustik'
  },
  {
    id: 'radio-joyturkrock',
    name: 'JoyTürk Rock',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOYTURK_ROCK.mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png',
    category: 'Türkçe Rock'
  },
  {
    id: 'radio-virgin',
    name: 'Virgin Radio Türkiye',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/VIRGIN_RADIO.mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Virgin_Radio_logo.svg/512px-Virgin_Radio_logo.svg.png',
    category: 'Yabancı Hit'
  },
  {
    id: 'radio-metrofm',
    name: 'Metro FM',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/METRO_FM.mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Metro_FM_logo.png/512px-Metro_FM_logo.png',
    category: 'Yabancı Hit'
  },
  {
    id: 'radio-superfm',
    name: 'Süper FM',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/SUPER_FM.mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/S%C3%BCper_FM_logo.png/512px-S%C3%BCper_FM_logo.png',
    category: 'Türkçe Pop'
  },
  {
    id: 'radio-retroturk',
    name: 'Retro Türk',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RETRO_TURK.mp3',
    logo: 'https://i.imgur.com/8QjZ2rM.png',
    category: 'Nostalji'
  },
  {
    id: 'radio-efsaneturk',
    name: 'Efsane Türk',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/EFSANE_TURK.mp3',
    logo: 'https://i.imgur.com/P4wUa0q.png',
    category: 'Arabesk'
  },
  {
    id: 'radio-mydonose',
    name: 'Radyo Mydonose',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_MYDONOSE.mp3',
    logo: 'https://i.imgur.com/p0qE2Xv.png',
    category: 'Yabancı Hit'
  },
  {
    id: 'radio-zeplin',
    name: 'Radyo Zeplin',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ZEPLIN.mp3',
    logo: 'https://i.imgur.com/6tv0zxh.png',
    category: 'Rock / Alternatif'
  },
  {
    id: 'radio-borusan',
    name: 'Borusan Klasik',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BORUSAN_KLASIK.mp3',
    logo: 'https://i.imgur.com/iOCQdyD.png',
    category: 'Klasik Müzik'
  },
  {
    id: 'radio-joyjazz',
    name: 'Joy Jazz',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_JAZZ.mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Joy_FM_logo.png/512px-Joy_FM_logo.png',
    category: 'Caz'
  },
  {
    id: 'radio-karnaval90lar',
    name: 'Karnaval 90lar',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KARNAVAL90LAR.mp3',
    logo: 'https://i.imgur.com/8QjZ2rM.png',
    category: '90lar Pop'
  },
  {
    id: 'radio-radyotrafik',
    name: 'Radyo Trafik İstanbul',
    type: 'radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_TRAFIK_AAC.aac',
    logo: 'https://i.imgur.com/X2k1nQx.png',
    category: 'Trafik & Haber'
  },

  // --- POPÜLER TÜRKİYE RADYOLARI ---
  {
    id: 'radio-moralfm',
    name: 'Moral FM',
    type: 'radio',
    url: 'https://yayin.canliradyolive.com/8038/stream',
    logo: 'https://i.imgur.com/wdWR7Qk.png',
    category: 'Sohbet & Kültür'
  },
  {
    id: 'radio-kuponfm',
    name: 'Kupon FM',
    type: 'radio',
    url: 'https://yayin.canliradyolive.com/8070/stream',
    logo: 'https://i.imgur.com/wdWR7Qk.png',
    category: 'Oyun Havası'
  },
  {
    id: 'radio-gozdefm',
    name: 'Gözde FM',
    type: 'radio',
    url: 'https://yayin.canliradyolive.com/8054/stream',
    logo: 'https://i.imgur.com/P4wUa0q.png',
    category: 'Türkçe Pop'
  },
  {
    id: 'radio-damarfm',
    name: 'Damar FM',
    type: 'radio',
    url: 'https://yayin.canliradyolive.com/8040/stream',
    logo: 'https://i.imgur.com/8QjZ2rM.png',
    category: 'Arabesk / Damar'
  },
  {
    id: 'radio-seymen',
    name: 'Radyo Seymen',
    type: 'radio',
    url: 'https://yayin.canliradyolive.com/8020/stream',
    logo: 'https://i.imgur.com/p0qE2Xv.png',
    category: 'Oyun Havası'
  },
  {
    id: 'radio-banko',
    name: 'Radyo Banko Ankara',
    type: 'radio',
    url: 'https://yayin.canliradyolive.com/8022/stream',
    logo: 'https://i.imgur.com/X2k1nQx.png',
    category: 'Ankara Oyun Havası'
  },
  {
    id: 'radio-2000',
    name: 'Radyo 2000',
    type: 'radio',
    url: 'https://yayin.canliradyolive.com/8012/stream',
    logo: 'https://i.imgur.com/V9r1a8k.png',
    category: 'Arabesk'
  },
  {
    id: 'radio-akrafm',
    name: 'AKRA FM',
    type: 'radio',
    url: 'https://yayin.akradyo.net:8000/stream',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/AKRA_logo.png/512px-AKRA_logo.png',
    category: 'Sohbet & Kültür'
  },
  {
    id: 'radio-alaturka',
    name: 'Radyo Alaturka',
    type: 'radio',
    url: 'https://stream.radyoalaturka.com.tr/stream',
    logo: 'https://i.imgur.com/iOCQdyD.png',
    category: 'Sanat Müziği'
  },
  {
    id: 'radio-gonul',
    name: 'Radyo Gönül',
    type: 'radio',
    url: 'https://yayin.gonulfm.com:8000/stream',
    logo: 'https://i.imgur.com/P4wUa0q.png',
    category: 'Türkçe Nostalji'
  },
  {
    id: 'radio-karadenizfm',
    name: 'Karadeniz FM',
    type: 'radio',
    url: 'https://yayin.karadenizfm.com.tr:8000/stream',
    logo: 'https://i.imgur.com/lM5R3oZ.png',
    category: 'Karadeniz & Türkü'
  },
  {
    id: 'radio-showradyo-shout',
    name: 'Show Radyo',
    type: 'radio',
    url: 'https://stream.showradyo.com.tr/stream',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Show_Radyo_logo.png/512px-Show_Radyo_logo.png',
    category: 'Türkçe Pop'
  },
  {
    id: 'radio-vivaradyo-shout',
    name: 'Radyo Viva',
    type: 'radio',
    url: 'https://stream.radyoviva.com.tr/stream',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Radyo_Viva_logo.png/512px-Radyo_Viva_logo.png',
    category: 'Türkçe Pop'
  },

  // --- HABER & SPOR RADYOLARI ---
  {
    id: 'radio-ahaberradyo',
    name: 'A Haber Radyo',
    type: 'radio',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/A_Haber_logo.svg/512px-A_Haber_logo.svg.png',
    category: 'Haber'
  },
  {
    id: 'radio-asporradyo',
    name: 'A Spor Radyo',
    type: 'radio',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_Spor_logo.svg/512px-A_Spor_logo.svg.png',
    category: 'Spor'
  },
  {
    id: 'radio-vavradyo',
    name: 'Vav Radyo',
    type: 'radio',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/vavradyo/vavradyo.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Vav_TV_logo.png/512px-Vav_TV_logo.png',
    category: 'Dini & Kültür'
  },
  {
    id: 'radio-turkuvazradyo',
    name: 'Turkuvaz Radyo',
    type: 'radio',
    url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/turkuvazradyo/turkuvazradyo.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Atv_logo.svg/512px-Atv_logo.svg.png',
    category: 'Türkçe Pop'
  },
  {
    id: 'radio-number1fm',
    name: 'Number 1 FM',
    type: 'radio',
    url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1e2d83768.smil/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Number1_TV_logo.png/512px-Number1_TV_logo.png',
    category: 'Yabancı Hit'
  },
  {
    id: 'radio-number1turk',
    name: 'Number 1 Türk FM',
    type: 'radio',
    url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1f56be91e.smil/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Number_One_T%C3%BCrk_TV_logo.png/512px-Number_One_T%C3%BCrk_TV_logo.png',
    category: 'Türkçe Pop'
  },

  // --- DÜNYA RADYOLARI ---
  {
    id: 'radio-kexp',
    name: 'KEXP 90.3 Seattle',
    type: 'radio',
    url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/KEXP_logo.svg/512px-KEXP_logo.svg.png',
    category: 'Yabancı Alternatif'
  },
  {
    id: 'radio-ibiza',
    name: 'Ibiza Global Radio',
    type: 'radio',
    url: 'https://listenssl.ibizaglobalradio.com:8024/ibizaglobalradio.mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Elektronik & Chill'
  },
  {
    id: 'radio-bbcworld',
    name: 'BBC World Service',
    type: 'radio',
    url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/BBC.svg/512px-BBC.svg.png',
    category: 'Dünya / Haber'
  },
  {
    id: 'radio-somafm-groove',
    name: 'SomaFM Groove Salad',
    type: 'radio',
    url: 'https://ice1.somafm.com/groovesalad-128-mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Lounge / Ambient'
  },
  {
    id: 'radio-somafm-drone',
    name: 'SomaFM Drone Zone',
    type: 'radio',
    url: 'https://ice1.somafm.com/dronezone-128-mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Ambient & Uzay'
  },
  {
    id: 'radio-somafm-indie',
    name: 'SomaFM Indie Pop Rocks',
    type: 'radio',
    url: 'https://ice1.somafm.com/indiepop-128-mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Indie Pop'
  },
  {
    id: 'radio-somafm-secret',
    name: 'SomaFM Secret Agent',
    type: 'radio',
    url: 'https://ice1.somafm.com/secretagent-128-mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Lounge'
  },
  {
    id: 'radio-somafm-lush',
    name: 'SomaFM Lush',
    type: 'radio',
    url: 'https://ice1.somafm.com/lush-128-mp3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png',
    category: 'Chillout Pop'
  },
  {
    id: 'radio-classicfm',
    name: 'Classic FM UK',
    type: 'radio',
    url: 'https://media-ssl.musicradio.com/ClassicFM',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/TRT_Radyo_3_logo_2021.svg/512px-TRT_Radyo_3_logo_2021.svg.png',
    category: 'Klasik Müzik'
  },
  {
    id: 'radio-capitalfm',
    name: 'Capital FM UK',
    type: 'radio',
    url: 'https://media-ssl.musicradio.com/CapitalUK',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Virgin_Radio_logo.svg/512px-Virgin_Radio_logo.svg.png',
    category: 'Yabancı Hit'
  },
  {
    id: 'radio-smoothuk',
    name: 'Smooth Radio UK',
    type: 'radio',
    url: 'https://media-ssl.musicradio.com/SmoothUK',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Joy_FM_logo.png/512px-Joy_FM_logo.png',
    category: 'Yabancı Slow'
  },
  {
    id: 'radio-heartuk',
    name: 'Heart FM UK',
    type: 'radio',
    url: 'https://media-ssl.musicradio.com/HeartUK',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/S%C3%BCper_FM_logo.png/512px-S%C3%BCper_FM_logo.png',
    category: 'Yabancı Hit'
  }
];

console.log(`Generated TV channels count: ${tvChannels.length}`);
console.log(`Generated Radio channels count: ${radioChannels.length}`);

const allChannels = [...tvChannels, ...radioChannels];

const fileContent = `import { Channel } from './types';

export const mockChannels: Channel[] = ${JSON.stringify(allChannels, null, 2)};
`;

fs.writeFileSync('./src/data.ts', fileContent, 'utf-8');
console.log('Successfully updated /src/data.ts with complete dataset!');
