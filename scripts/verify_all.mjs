import https from 'https';
import http from 'http';
import fs from 'fs';

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const mod = parsed.protocol === 'https:' ? https : http;
      const req = mod.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': parsed.origin
        },
        timeout: 3000
      }, (res) => {
        const ok = res.statusCode >= 200 && res.statusCode < 400;
        resolve({ status: res.statusCode, ok });
        res.destroy();
      });
      req.on('error', (e) => resolve({ status: e.message, ok: false }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 'TIMEOUT', ok: false }); });
    } catch (e) {
      resolve({ status: 'ERR', ok: false });
    }
  });
}

async function verifyAll() {
  const candidateTV = [
    // Ulusal
    { id: 'tv-trt1', name: 'TRT 1', category: 'Ulusal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/TRT_1_logo_%282021-%29.svg/512px-TRT_1_logo_%282021-%29.svg.png', url: 'https://tv-trt1.medya.trt.com.tr/master.m3u8' },
    { id: 'tv-atv', name: 'ATV', category: 'Ulusal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Atv_logo.svg/512px-Atv_logo.svg.png', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8' },
    { id: 'tv-atv-alt', name: 'ATV Canlı', category: 'Ulusal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Atv_logo.svg/512px-Atv_logo.svg.png', url: 'https://live.artidijitalmedya.com/artidijital_atv/atv/playlist.m3u8' },
    { id: 'tv-kanald', name: 'Kanal D', category: 'Ulusal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Kanal_D_logo.svg/512px-Kanal_D_logo.svg.png', url: 'https://demiroren.daioncdn.net/kanald/kanald.m3u8?app=kanald_web&ce=3' },
    { id: 'tv-showtv', name: 'Show TV', category: 'Ulusal', logo: 'https://i.imgur.com/1l7SCCu.png', url: 'https://ciner-live.ercdn.net/showtv/showtv.m3u8' },
    { id: 'tv-startv', name: 'Star TV', category: 'Ulusal', logo: 'https://i.imgur.com/9O3DHRB.png', url: 'https://dogus.daioncdn.net/startv/startv_720p.m3u8?app=a20ac41e-bdc3-4aa1-934d-26b484480ac9&ce=3&sid=8l4w3lst4co5' },
    { id: 'tv-tv8', name: 'TV8', category: 'Ulusal', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/68/Tv8_Yeni_Logo.png/512px-Tv8_Yeni_Logo.png', url: 'https://tv8.daioncdn.net/tv8/tv8.m3u8?app=7ddc255a-ef47-4e81-ab14-c0e5f2949788&ce=3' },
    { id: 'tv-tv85', name: 'TV8.5', category: 'Spor / Eğlence', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/68/Tv8_Yeni_Logo.png/512px-Tv8_Yeni_Logo.png', url: 'https://tv8.daioncdn.net/tv8-5/tv8-5.m3u8?app=tv85_web' },
    { id: 'tv-kanal7', name: 'Kanal 7', category: 'Ulusal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanal_7_logo.svg/512px-Kanal_7_logo.svg.png', url: 'https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8' },
    { id: 'tv-beyaztv', name: 'Beyaz TV', category: 'Ulusal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Beyaz_TV_logo.svg/512px-Beyaz_TV_logo.svg.png', url: 'https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8' },
    { id: 'tv-teve2', name: 'Teve2', category: 'Dizi / Eğlence', logo: 'https://i.imgur.com/rsoSLih.png', url: 'https://live.duhnet.tv/S2/HLS_LIVE/teve2np/playlist.m3u8' },
    { id: 'tv-a2', name: 'A2 TV', category: 'Dizi / Eğlence', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Atv_logo.svg/512px-Atv_logo.svg.png', url: 'https://live.artidijitalmedya.com/artidijital_a2/a2/playlist.m3u8' },
    { id: 'tv-tlctv', name: 'TLC Türkiye', category: 'Yaşam & Eğlence', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/TLC_Logo_2020.svg/512px-TLC_Logo_2020.svg.png', url: 'https://live.artidijitalmedya.com/artidijital_tlc/tlc/playlist.m3u8' },
    { id: 'tv-dmaxtv', name: 'DMAX Türkiye', category: 'Belgesel / Yaşam', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/DMAX_logo_2019.svg/512px-DMAX_logo_2019.svg.png', url: 'https://live.artidijitalmedya.com/artidijital_dmax/dmax/playlist.m3u8' },

    // Haber & Ekonomi
    { id: 'tv-trthaber', name: 'TRT Haber', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/TRT_Haber_Eyl%C3%BCl_2020_Logo.svg/512px-TRT_Haber_Eyl%C3%BCl_2020_Logo.svg.png', url: 'https://tv-trthaber.medya.trt.com.tr/master.m3u8' },
    { id: 'tv-ahaber', name: 'A Haber', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/A_Haber_logo.svg/512px-A_Haber_logo.svg.png', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8' },
    { id: 'tv-cnnturk', name: 'CNN Türk', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/CNN_T%C3%BCrk_logo.svg/512px-CNN_T%C3%BCrk_logo.svg.png', url: 'https://demiroren.daioncdn.net/cnnturk/cnnturk.m3u8?app=cnnturk_web&ce=3' },
    { id: 'tv-ntv', name: 'NTV', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ntv_logo.svg/512px-Ntv_logo.svg.png', url: 'https://dogus.daioncdn.net/ntv/ntv.m3u8?app=ntv_web' },
    { id: 'tv-haberturk', name: 'Habertürk', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Habert%C3%BCrk_TV_logo.svg/512px-Habert%C3%BCrk_TV_logo.svg.png', url: 'https://tv.ensonhaber.com/haberturk/haberturk.m3u8' },
    { id: 'tv-halktv', name: 'Halk TV', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Halk_TV_logo.svg/512px-Halk_TV_logo.svg.png', url: 'https://halktv-live.daioncdn.net/halktv/halktv.m3u8' },
    { id: 'tv-sozcutv', name: 'Sözcü TV', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/S%C3%B6zc%C3%BC_TV_logo.svg/512px-S%C3%B6zc%C3%BC_TV_logo.svg.png', url: 'https://sozcutv-live.daioncdn.net/sozcutv/sozcutv.m3u8' },
    { id: 'tv-tv100', name: 'TV100', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/0f/TV100_logo.png/512px-TV100_logo.png', url: 'https://tv.ensonhaber.com/tv100/tv100.m3u8' },
    { id: 'tv-tele1', name: 'Tele1', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/tr/4/43/Tele1_logosu.png', url: 'https://tele1-live.ercdn.net/tele1/tele1.m3u8' },
    { id: 'tv-tgrthaber', name: 'TGRT Haber', category: 'Haber', logo: 'https://i.imgur.com/PrxwKDw.png', url: 'https://tgrthaber-live.daioncdn.net/tgrthaber/tgrthaber.m3u8' },
    { id: 'tv-ulketv', name: 'Ülke TV', category: 'Haber', logo: 'https://i.imgur.com/wdWR7Qk.png', url: 'https://kanal7-live.daioncdn.net/ulketv/ulketv.m3u8' },
    { id: 'tv-bloomberght', name: 'Bloomberg HT', category: 'Ekonomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Bloomberg_HT_logo.svg/512px-Bloomberg_HT_logo.svg.png', url: 'https://tv.ensonhaber.com/bloomberght/bloomberght.m3u8' },
    { id: 'tv-ekoturk', name: 'Ekotürk TV', category: 'Ekonomi', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/9/90/Ekot%C3%BCrk_logo.png/512px-Ekot%C3%BCrk_logo.png', url: 'https://ekoturk-live.daioncdn.net/ekoturk/ekoturk.m3u8' },
    { id: 'tv-apara', name: 'A Para', category: 'Ekonomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/A_Para_logo.svg/512px-A_Para_logo.svg.png', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/apara/apara.m3u8' },
    { id: 'tv-flashhaber', name: 'Flash Haber TV', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flash_TV_logosu.png/512px-Flash_TV_logosu.png', url: 'https://flashhaber-live.daioncdn.net/flashhaber/flashhaber.m3u8' },
    { id: 'tv-benguturk', name: 'Bengü Türk', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/7/7b/Beng%C3%BC_T%C3%BCrk_logo.png/512px-Beng%C3%BC_T%C3%BCrk_logo.png', url: 'https://benguturk-live.daioncdn.net/benguturk/benguturk.m3u8' },
    { id: 'tv-ulusal', name: 'Ulusal Kanal', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ulusal_Kanal_logo.svg/512px-Ulusal_Kanal_logo.svg.png', url: 'https://live.duhnet.tv/S2/HLS_LIVE/ulusalkanal/playlist.m3u8' },
    { id: 'tv-akittv', name: 'Akit TV', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Akit_TV_logo.png/512px-Akit_TV_logo.png', url: 'https://akittv-live.daioncdn.net/akittv/akittv.m3u8' },
    { id: 'tv-anews', name: 'A News', category: 'Haber / İngilizce', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/A_News_logo.svg/512px-A_News_logo.svg.png', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/anews/anews.m3u8' },
    { id: 'tv-trtworld', name: 'TRT World', category: 'Dünya / Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/TRT_World_logo_2021.svg/512px-TRT_World_logo_2021.svg.png', url: 'https://tv-trtworld.medya.trt.com.tr/master.m3u8' },
    { id: 'tv-trtarabi', name: 'TRT Arabi', category: 'Dünya / Arapça', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/TRT_Arabi_2021.svg/512px-TRT_Arabi_2021.svg.png', url: 'https://tv-trtarabi.medya.trt.com.tr/master.m3u8' },
    { id: 'tv-trtkurdi', name: 'TRT Kurdî', category: 'Kültür / Kürtçe', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/TRT_Kurd%C3%AE_logo_2021.svg/512px-TRT_Kurd%C3%AE_logo_2021.svg.png', url: 'https://tv-trtkurdi.medya.trt.com.tr/master.m3u8' },
    { id: 'tv-trtavaz', name: 'TRT Avaz', category: 'Kültür & Avrasya', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/TRT_Avaz_logo_2021.svg/512px-TRT_Avaz_logo_2021.svg.png', url: 'https://tv-trtavaz.medya.trt.com.tr/master.m3u8' },
    { id: 'tv-trtturk', name: 'TRT Türk', category: 'Kültür & Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/TRT_T%C3%BCrk_logo_2021.svg/512px-TRT_T%C3%BCrk_logo_2021.svg.png', url: 'https://tv-trtturk.medya.trt.com.tr/master.m3u8' },

    // Spor
    { id: 'tv-aspor', name: 'A Spor', category: 'Spor', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_Spor_logo.svg/512px-A_Spor_logo.svg.png', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8' },
    { id: 'tv-trtspor', name: 'TRT Spor', category: 'Spor', logo: 'https://i.imgur.com/6tv0zxh.png', url: 'https://tv-trtspor1.medya.trt.com.tr/master.m3u8' },
    { id: 'tv-trtspor-alt', name: 'TRT Spor Canlı', category: 'Spor', logo: 'https://i.imgur.com/6tv0zxh.png', url: 'https://live.artidijitalmedya.com/artidijital_trtspor/trtspor/playlist.m3u8' },
    { id: 'tv-trtspor2', name: 'TRT Spor Yıldız', category: 'Spor', logo: 'https://i.imgur.com/6tv0zxh.png', url: 'https://live.artidijitalmedya.com/artidijital_trtspor2/trtspor2/playlist.m3u8' },
    { id: 'tv-fbtv', name: 'Fenerbahçe TV', category: 'Spor', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/86/Fenerbah%C3%A7e_SK.png/512px-Fenerbah%C3%A7e_SK.png', url: 'https://fbtv-live.daioncdn.net/fbtv/fbtv.m3u8' },
    { id: 'tv-sportstv', name: 'Sports TV', category: 'Spor', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Sports_TV_logo.png/512px-Sports_TV_logo.png', url: 'https://sportstv-live.daioncdn.net/sportstv/sportstv.m3u8' },
    { id: 'tv-tjk', name: 'TJK TV (At Yarışı)', category: 'Spor', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/TJK_TV_logo.png/512px-TJK_TV_logo.png', url: 'https://live.artidijitalmedya.com/artidijital_tjktv/tjktv/playlist.m3u8' },
    { id: 'tv-taytv', name: 'Tay TV', category: 'Spor', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/05/Tay_TV_logo.png/512px-Tay_TV_logo.png', url: 'https://live.duhnet.tv/S2/HLS_LIVE/taytvnp/playlist.m3u8' },
    { id: 'tv-redbull', name: 'Red Bull TV', category: 'Yabancı Spor', logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/Red_Bull_TV.png', url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8' },

    // Belgesel & Kültür & Yaşam
    { id: 'tv-trtbelgesel', name: 'TRT Belgesel', category: 'Belgesel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/TRT_Belgesel_logo_%282019-%29.svg/512px-TRT_Belgesel_logo_%282019-%29.svg.png', url: 'https://live.artidijitalmedya.com/artidijital_trtbelgesel/trtbelgesel/playlist.m3u8' },
    { id: 'tv-trt2', name: 'TRT 2 Kültür Sanat', category: 'Kültür Sanat', logo: 'https://i.imgur.com/iOCQdyD.png', url: 'https://live.artidijitalmedya.com/artidijital_trt2/trt2/playlist.m3u8' },
    { id: 'tv-tgrtbelgesel', name: 'TGRT Belgesel', category: 'Belgesel', logo: 'https://i.imgur.com/PrxwKDw.png', url: 'https://tgrtbelgesel-live.daioncdn.net/tgrtbelgesel/tgrtbelgesel.m3u8' },
    { id: 'tv-vavtv', name: 'Vav TV', category: 'Dini & Kültür', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Vav_TV_logo.png/512px-Vav_TV_logo.png', url: 'https://live.artidijitalmedya.com/artidijital_vavtv/vavtv/playlist.m3u8' },
    { id: 'tv-diyanettv', name: 'Diyanet TV', category: 'Dini & Kültür', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Diyanet_TV_logo.png/512px-Diyanet_TV_logo.png', url: 'https://diyanettv-live.daioncdn.net/diyanettv/diyanettv.m3u8' },
    { id: 'tv-ciftcitv', name: 'Çiftçi TV', category: 'Tarım & Doğa', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/%C3%87ift%C3%A7i_TV_logo.png/512px-%C3%87ift%C3%A7i_TV_logo.png', url: 'https://ciftcitv-live.daioncdn.net/ciftcitv/ciftcitv.m3u8' },
    { id: 'tv-koytv', name: 'Köy TV', category: 'Tarım & Doğa', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/K%C3%B6y_TV_logo.png/512px-K%C3%B6y_TV_logo.png', url: 'https://koytv-live.daioncdn.net/koytv/koytv.m3u8' },
    { id: 'tv-berekettv', name: 'Bereket TV', category: 'Tarım & Hayvancılık', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Bereket_TV_logo.png/512px-Bereket_TV_logo.png', url: 'https://berekettv-live.daioncdn.net/berekettv/berekettv.m3u8' },
    { id: 'tv-yabantv', name: 'Yaban TV (Doğa & Av)', category: 'Doğa & Avcılık', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/7/7b/Yaban_TV_logo.png/512px-Yaban_TV_logo.png', url: 'https://live.artidijitalmedya.com/artidijital_yabantv/yabantv/playlist.m3u8' },

    // Çocuk
    { id: 'tv-trtcocuk', name: 'TRT Çocuk', category: 'Çocuk', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/TRT_%C3%87ocuk_logo_%282021%29.svg/512px-TRT_%C3%87ocuk_logo_%282021%29.svg.png', url: 'https://tv-trtcocuk.medya.trt.com.tr/master.m3u8' },
    { id: 'tv-minikago', name: 'Minika GO', category: 'Çocuk', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Minika_GO_logo.svg/512px-Minika_GO_logo.svg.png', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8' },
    { id: 'tv-minikacocuk', name: 'Minika Çocuk', category: 'Çocuk', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Minika_%C3%87ocuk_logo.svg/512px-Minika_%C3%87ocuk_logo.svg.png', url: 'https://live.artidijitalmedya.com/artidijital_minikacocuk/minikacocuk/playlist.m3u8' },
    { id: 'tv-diyanetcocuk', name: 'Diyanet Çocuk TV', category: 'Çocuk', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Diyanet_TV_logo.png/512px-Diyanet_TV_logo.png', url: 'https://diyanetcocuk-live.daioncdn.net/diyanetcocuk/diyanetcocuk.m3u8' },
    { id: 'tv-zaroktv', name: 'Zarok TV', category: 'Çocuk', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Zarok_TV_logo.png/512px-Zarok_TV_logo.png', url: 'https://live.artidijitalmedya.com/artidijital_zaroktv/zaroktv/playlist.m3u8' },

    // Müzik
    { id: 'tv-kralpoptv', name: 'Kral Pop TV', category: 'Müzik', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Kral_Pop_TV_logo.svg/512px-Kral_Pop_TV_logo.svg.png', url: 'https://dogus.daioncdn.net/kralpoptv/kralpoptv.m3u8?app=kralpoptv_web' },
    { id: 'tv-kraltv', name: 'Kral TV', category: 'Müzik', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Kral_TV_logo.svg/512px-Kral_TV_logo.svg.png', url: 'https://dogus.daioncdn.net/kraltv/kraltv.m3u8?app=kraltv_web' },
    { id: 'tv-trtmuzik', name: 'TRT Müzik', category: 'Müzik', logo: 'https://i.imgur.com/JgUzRH8.png', url: 'https://tv-trtmuzik.medya.trt.com.tr/master.m3u8' },
    { id: 'tv-dreamturk', name: 'Dream Türk', category: 'Müzik', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dream_T%C3%BCrk_logo.svg/512px-Dream_T%C3%BCrk_logo.svg.png', url: 'https://live.duhnet.tv/S2/HLS_LIVE/dreamturknp/playlist.m3u8' },
    { id: 'tv-number1tv', name: 'Number 1 TV', category: 'Müzik', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Number1_TV_logo.png/512px-Number1_TV_logo.png', url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1e2d83768.smil/playlist.m3u8' },
    { id: 'tv-number1turktv', name: 'Number 1 Türk TV', category: 'Müzik', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Number_One_T%C3%BCrk_TV_logo.png/512px-Number_One_T%C3%BCrk_TV_logo.png', url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1f56be91e.smil/playlist.m3u8' },
    { id: 'tv-powerturktv', name: 'PowerTürk TV', category: 'Müzik', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png', url: 'https://live.powerapp.com.tr/powerturktv/powerturktv.smil/playlist.m3u8' },

    // Bölgesel / Yerel Kanallar
    { id: 'tv-linetv', name: 'Line TV Bursa', category: 'Bölgesel', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Line_TV_logo.png/512px-Line_TV_logo.png', url: 'https://linetv-live.daioncdn.net/linetv/linetv.m3u8' },
    { id: 'tv-kontv', name: 'Kon TV Konya', category: 'Bölgesel', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/05/KonTV_logo.png/512px-KonTV_logo.png', url: 'https://kontv-live.daioncdn.net/kontv/kontv.m3u8' },
    { id: 'tv-kordontv', name: 'Kordon TV İzmir', category: 'Bölgesel', logo: 'https://i.imgur.com/k6l9h5z.png', url: 'https://live.artidijitalmedya.com/artidijital_kordontv/kordontv/playlist.m3u8' },
    { id: 'tv-olayturktv', name: 'Olay Türk TV Kayseri', category: 'Bölgesel', logo: 'https://i.imgur.com/X2k1nQx.png', url: 'https://live.artidijitalmedya.com/artidijital_olayturktv/olayturktv/playlist.m3u8' },
    { id: 'tv-kadirgatv', name: 'Kadırga TV Trabzon', category: 'Bölgesel', logo: 'https://i.imgur.com/V9r1a8k.png', url: 'https://live.artidijitalmedya.com/artidijital_kadirgatv/kadirgatv/playlist.m3u8' },
    { id: 'tv-caytv', name: 'Çay TV Rize', category: 'Bölgesel', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/7/77/%C3%87ay_TV_logo.png/512px-%C3%87ay_TV_logo.png', url: 'https://caytv-live.daioncdn.net/caytv/caytv.m3u8' },
    { id: 'tv-mavikaradeniz', name: 'Mavi Karadeniz TV', category: 'Bölgesel', logo: 'https://i.imgur.com/lM5R3oZ.png', url: 'https://mavikaradeniz-live.daioncdn.net/mavikaradeniz/mavikaradeniz.m3u8' },
    { id: 'tv-kanal3', name: 'Kanal 3 Afyon', category: 'Bölgesel', logo: 'https://i.imgur.com/P4wUa0q.png', url: 'https://kanal3-live.daioncdn.net/kanal3/kanal3.m3u8' },
    { id: 'tv-kanal58', name: 'Kanal 58 Sivas', category: 'Bölgesel', logo: 'https://i.imgur.com/wV2J6mU.png', url: 'https://kanal58-live.daioncdn.net/kanal58/kanal58.m3u8' },
    { id: 'tv-kanal16', name: 'Kanal 16 İnegöl', category: 'Bölgesel', logo: 'https://i.imgur.com/2XyC6k8.png', url: 'https://live.artidijitalmedya.com/artidijital_kanal16/kanal16/playlist.m3u8' },
    { id: 'tv-altastv', name: 'Altaş TV Ordu', category: 'Bölgesel', logo: 'https://i.imgur.com/0i9g9iT.png', url: 'https://live.artidijitalmedya.com/artidijital_altastv/altastv/playlist.m3u8' },
    { id: 'tv-bursaolay', name: 'Bursa TV', category: 'Bölgesel', logo: 'https://i.imgur.com/z4bY4k1.png', url: 'https://live.artidijitalmedya.com/artidijital_bursatv/bursatv/playlist.m3u8' },
    { id: 'tv-turkmeneli', name: 'Türkmeneli TV', category: 'Bölgesel / Kültür', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/8c/T%C3%BCrkmeneli_TV_logo.png/512px-T%C3%BCrkmeneli_TV_logo.png', url: 'https://live.artidijitalmedya.com/artidijital_turkmenelitv/turkmenelitv/playlist.m3u8' },

    // Dünya Kanalları
    { id: 'tv-aljazeera', name: 'Al Jazeera English', category: 'Dünya / Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Aljazeera_eng.svg/512px-Aljazeera_eng.svg.png', url: 'https://live-hls-web-aje-fa.thehlive.com/AJE/index.m3u8' },
    { id: 'tv-france24', name: 'France 24 English', category: 'Dünya / Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/France_24_logo.svg/512px-France_24_logo.svg.png', url: 'https://live.france24.com/hls/live/2037218-b/F24_EN_HI_HLS/master_2300.m3u8' },
    { id: 'tv-dw-eng', name: 'DW English', category: 'Dünya / Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_logo.svg/512px-Deutsche_Welle_logo.svg.png', url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/master.m3u8' },
    { id: 'tv-skynews', name: 'Sky News International', category: 'Dünya / Haber', logo: 'https://d2n0069hmnqmmx.cloudfront.net/epgdata/1.0/newchanlogos/512/512/skychb1404.png', url: 'https://skynewsau-live.akamaized.net/hls/live/2002689/skynewsau-extra1/master.m3u8' },
    { id: 'tv-nasatv', name: 'NASA TV Live', category: 'Dünya / Bilim', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/512px-NASA_logo.svg.png', url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8' }
  ];

  console.log('Testing TV channels in parallel...');
  const testedTV = await Promise.all(candidateTV.map(async (c) => {
    const res = await checkUrl(c.url);
    return { ...c, ...res, type: 'tv' };
  }));

  const workingTV = testedTV.filter(t => t.ok);
  console.log(`TV Done: ${workingTV.length} / ${candidateTV.length} are working.`);
  fs.writeFileSync('./scripts/working_tv.json', JSON.stringify(workingTV, null, 2));

  // Run Radios
  const candidateRadios = [
    // TRT Radyoları
    { id: 'radio-trtfm', name: 'TRT FM', category: 'Karma', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png', url: 'https://radio-trtfm.medya.trt.com.tr/master.m3u8' },
    { id: 'radio-trtradyo1', name: 'TRT Radyo 1', category: 'Haber & Kültür', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/TRT_Radyo_1_logo_2021.svg/512px-TRT_Radyo_1_logo_2021.svg.png', url: 'https://radio-trtradyo1.medya.trt.com.tr/master.m3u8' },
    { id: 'radio-trtradyo3', name: 'TRT Radyo 3', category: 'Klasik & Caz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/TRT_Radyo_3_logo_2021.svg/512px-TRT_Radyo_3_logo_2021.svg.png', url: 'https://radio-trtradyo3.medya.trt.com.tr/master.m3u8' },
    { id: 'radio-trtnagme', name: 'TRT Nağme', category: 'Sanat Müziği', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/TRT_Na%C4%9Fme_logo_2021.svg/512px-TRT_Na%C4%9Fme_logo_2021.svg.png', url: 'https://radio-trtnagme.medya.trt.com.tr/master.m3u8' },
    { id: 'radio-trtturku', name: 'TRT Türkü', category: 'Türkü', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/TRT_T%C3%BCrk%C3%BC_logo_2021.svg/512px-TRT_T%C3%BCrk%C3%BC_logo_2021.svg.png', url: 'https://radio-trtturku.medya.trt.com.tr/master.m3u8' },
    { id: 'radio-trtkentradyo', name: 'TRT Kent Radyo', category: 'Şehir & Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png', url: 'https://radio-trtkentradyoistanbul.medya.trt.com.tr/master.m3u8' },
    { id: 'radio-trtradyohaber', name: 'TRT Radyo Haber', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/TRT_Radyo_1_logo_2021.svg/512px-TRT_Radyo_1_logo_2021.svg.png', url: 'https://radio-trtradyohaber.medya.trt.com.tr/master.m3u8' },
    { id: 'radio-trttsr', name: 'TRT TSR Dış Yayınlar', category: 'Kültür & Müzik', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png', url: 'https://radio-tsr.medya.trt.com.tr/master.m3u8' },

    // PowerApp
    { id: 'radio-powerturk', name: 'PowerTürk', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png', url: 'https://listen.powerapp.com.tr/powerturk/mpeg/icecast.audio' },
    { id: 'radio-powerfm', name: 'Power FM', category: 'Yabancı Hit', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png', url: 'https://listen.powerapp.com.tr/powerfm/mpeg/icecast.audio' },
    { id: 'radio-powerlove', name: 'Power Love', category: 'Yabancı Slow', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png', url: 'https://listen.powerapp.com.tr/powerlove/mpeg/icecast.audio' },
    { id: 'radio-powerakustik', name: 'PowerTürk Akustik', category: 'Akustik', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png', url: 'https://listen.powerapp.com.tr/powerturkakustik/mpeg/icecast.audio' },
    { id: 'radio-powerdance', name: 'Power Dance', category: 'Dans / Club', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png', url: 'https://listen.powerapp.com.tr/powerdance/mpeg/icecast.audio' },
    { id: 'radio-powergold', name: 'Power Gold', category: 'Nostalji Hit', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png', url: 'https://listen.powerapp.com.tr/powergold/mpeg/icecast.audio' },
    { id: 'radio-powerdeep', name: 'Power Deep House', category: 'Elektronik', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png', url: 'https://listen.powerapp.com.tr/powerdeep/mpeg/icecast.audio' },
    { id: 'radio-powerrocks', name: 'Power Rocks', category: 'Rock', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Power_FM_logo.svg/512px-Power_FM_logo.svg.png', url: 'https://listen.powerapp.com.tr/powerrocks/mpeg/icecast.audio' },
    { id: 'radio-powertaptaze', name: 'PowerTürk Taptaze', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png', url: 'https://listen.powerapp.com.tr/powerturktaptaze/mpeg/icecast.audio' },
    { id: 'radio-powerefsane', name: 'PowerTürk Efsane', category: 'Türkçe 90lar', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Power_T%C3%BCrk_logo.svg/512px-Power_T%C3%BCrk_logo.svg.png', url: 'https://listen.powerapp.com.tr/powerturkefsane/mpeg/icecast.audio' },

    // Karnaval
    { id: 'radio-joyfm', name: 'Joy FM', category: 'Yabancı Slow', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Joy_FM_logo.png/512px-Joy_FM_logo.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_FM.mp3' },
    { id: 'radio-joyturk', name: 'JoyTürk', category: 'Türkçe Slow', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_TURK.mp3' },
    { id: 'radio-joyturkakustik', name: 'JoyTürk Akustik', category: 'Akustik', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOYTURK_AKUSTIK.mp3' },
    { id: 'radio-joyturkrock', name: 'JoyTürk Rock', category: 'Türkçe Rock', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JoyT%C3%BCrk_logo.png/512px-JoyT%C3%BCrk_logo.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOYTURK_ROCK.mp3' },
    { id: 'radio-virgin', name: 'Virgin Radio Türkiye', category: 'Yabancı Hit', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Virgin_Radio_logo.svg/512px-Virgin_Radio_logo.svg.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/VIRGIN_RADIO.mp3' },
    { id: 'radio-metrofm', name: 'Metro FM', category: 'Yabancı Hit', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Metro_FM_logo.png/512px-Metro_FM_logo.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/METRO_FM.mp3' },
    { id: 'radio-superfm', name: 'Süper FM', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/S%C3%BCper_FM_logo.png/512px-S%C3%BCper_FM_logo.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/SUPER_FM.mp3' },
    { id: 'radio-retroturk', name: 'Retro Türk', category: 'Nostalji', logo: 'https://i.imgur.com/8QjZ2rM.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RETRO_TURK.mp3' },
    { id: 'radio-efsaneturk', name: 'Efsane Türk', category: 'Arabesk / Fantezi', logo: 'https://i.imgur.com/P4wUa0q.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/EFSANE_TURK.mp3' },
    { id: 'radio-mydonose', name: 'Radyo Mydonose', category: 'Yabancı Hit', logo: 'https://i.imgur.com/p0qE2Xv.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_MYDONOSE.mp3' },
    { id: 'radio-zeplin', name: 'Radyo Zeplin', category: 'Rock / Alternatif', logo: 'https://i.imgur.com/6tv0zxh.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ZEPLIN.mp3' },
    { id: 'radio-borusan', name: 'Borusan Klasik', category: 'Klasik Müzik', logo: 'https://i.imgur.com/iOCQdyD.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BORUSAN_KLASIK.mp3' },
    { id: 'radio-joyjazz', name: 'Joy Jazz', category: 'Caz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Joy_FM_logo.png/512px-Joy_FM_logo.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_JAZZ.mp3' },
    { id: 'radio-karnaval90lar', name: 'Karnaval 90lar', category: '90lar Pop', logo: 'https://i.imgur.com/8QjZ2rM.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KARNAVAL90LAR.mp3' },
    { id: 'radio-radyotrafik', name: 'Radyo Trafik İstanbul', category: 'Trafik & Haber', logo: 'https://i.imgur.com/X2k1nQx.png', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_TRAFIK_AAC.aac' },

    // Doğuş Radyo
    { id: 'radio-kralfm', name: 'Kral FM', category: 'Arabesk / Fantezi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Kral_TV_logo.svg/512px-Kral_TV_logo.svg.png', url: 'https://dogus.daioncdn.net/kralfm/kralfm.m3u8?app=kralfm_web' },
    { id: 'radio-kralpop', name: 'Kral Pop Radyo', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Kral_Pop_TV_logo.svg/512px-Kral_Pop_TV_logo.svg.png', url: 'https://dogus.daioncdn.net/kralpoptv/kralpoptv.m3u8?app=kralpop_web' },
    { id: 'radio-ntvradyo', name: 'NTV Radyo', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ntv_logo.svg/512px-Ntv_logo.svg.png', url: 'https://dogus.daioncdn.net/ntvradyo/ntvradyo.m3u8?app=ntvradyo_web' },
    { id: 'radio-eksen', name: 'Radyo Eksen', category: 'Rock / Indie', logo: 'https://i.imgur.com/6tv0zxh.png', url: 'https://dogus.daioncdn.net/radyoeksen/radyoeksen.m3u8?app=radyoeksen_web' },
    { id: 'radio-voyage', name: 'Radyo Voyage', category: 'Ambient / New Age', logo: 'https://i.imgur.com/iOCQdyD.png', url: 'https://dogus.daioncdn.net/voyage/voyage.m3u8?app=voyage_web' },

    // Demirören & Türkmedya
    { id: 'radio-slowturk', name: 'Slow Türk', category: 'Türkçe Slow', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/7/77/Slow_T%C3%BCrk_logo.png/512px-Slow_T%C3%BCrk_logo.png', url: 'https://demiroren.daioncdn.net/slowturk/slowturk.m3u8?app=slowturk_web' },
    { id: 'radio-radyod', name: 'Radyo D', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/52/Radyo_D_logo.png/512px-Radyo_D_logo.png', url: 'https://demiroren.daioncdn.net/radyod/radyod.m3u8?app=radyod_web' },
    { id: 'radio-cnnturkradyo', name: 'CNN Türk Radyo', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/CNN_T%C3%BCrk_logo.svg/512px-CNN_T%C3%BCrk_logo.svg.png', url: 'https://demiroren.daioncdn.net/cnnturkradyo/cnnturkradyo.m3u8?app=cnnturk_web' },
    { id: 'radio-alemfm', name: 'Alem FM', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Alem_FM_logo.png/512px-Alem_FM_logo.png', url: 'https://turkmedya.daioncdn.net/alemfm/alemfm.m3u8?app=alemfm_web' },
    { id: 'radio-ligradyo', name: 'Lig Radyo', category: 'Spor & Haber', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/5e/Lig_Radyo_logo.png/512px-Lig_Radyo_logo.png', url: 'https://turkmedya.daioncdn.net/ligradyo/ligradyo.m3u8?app=ligradyo_web' },

    // Fenomen Grubu
    { id: 'radio-fenomen', name: 'Radyo Fenomen', category: 'Yabancı Hit', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png', url: 'https://listen.radyofenomen.com/fenomen/128/icecast.audio' },
    { id: 'radio-fenomenturk', name: 'Fenomen Türk', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png', url: 'https://listen.radyofenomen.com/fenomenturk/128/icecast.audio' },
    { id: 'radio-fenomenclub', name: 'Fenomen Club', category: 'Club & Dans', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png', url: 'https://listen.radyofenomen.com/fenomenclub/128/icecast.audio' },
    { id: 'radio-fenomenrap', name: 'Fenomen Rap', category: 'Türkçe Rap & HipHop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png', url: 'https://listen.radyofenomen.com/fenomenrap/128/icecast.audio' },
    { id: 'radio-fenomenoriental', name: 'Fenomen Oryantal', category: 'Oryantal / Oyun Havası', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Radyo_Fenomen_logo.png/512px-Radyo_Fenomen_logo.png', url: 'https://listen.radyofenomen.com/fenomenoryantal/128/icecast.audio' },

    // Pal & Best & Show & Viva & Baba & Number1
    { id: 'radio-bestfm', name: 'Best FM', category: 'Türkçe Pop & Sohbet', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Best_FM_logo.png/512px-Best_FM_logo.png', url: 'https://bestfm.daioncdn.net/bestfm/bestfm.m3u8?app=bestfm_web' },
    { id: 'radio-babaradyo', name: 'Baba Radyo', category: 'Arabesk / Fantezi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Baba_Radyo_logo.png/512px-Baba_Radyo_logo.png', url: 'https://babaradyo.daioncdn.net/babaradyo/babaradyo.m3u8?app=babaradyo_web' },
    { id: 'radio-showradyo', name: 'Show Radyo', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Show_Radyo_logo.png/512px-Show_Radyo_logo.png', url: 'https://showradyo.daioncdn.net/showradyo/showradyo.m3u8?app=showradyo_web' },
    { id: 'radio-radyoviva', name: 'Radyo Viva', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Radyo_Viva_logo.png/512px-Radyo_Viva_logo.png', url: 'https://radyoviva.daioncdn.net/radyoviva/radyoviva.m3u8?app=radyoviva_web' },
    { id: 'radio-palfm', name: 'Pal FM', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pal_FM_logo.png/512px-Pal_FM_logo.png', url: 'https://palfm.daioncdn.net/palfm/palfm.m3u8?app=palfm_web' },
    { id: 'radio-palnostalji', name: 'Pal Nostalji', category: 'Türkçe Nostalji', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pal_Nostalji_logo.png/512px-Pal_Nostalji_logo.png', url: 'https://palnostalji.daioncdn.net/palnostalji/palnostalji.m3u8?app=palnostalji_web' },
    { id: 'radio-paldoga', name: 'Pal Doğa', category: 'Türkü & Özgün', logo: 'https://i.imgur.com/wdWR7Qk.png', url: 'https://paldoga.daioncdn.net/paldoga/paldoga.m3u8?app=paldoga_web' },
    { id: 'radio-number1fm', name: 'Number 1 FM', category: 'Yabancı Hit', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Number1_TV_logo.png/512px-Number1_TV_logo.png', url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1e2d83768.smil/playlist.m3u8' },
    { id: 'radio-number1turkfm', name: 'Number 1 Türk FM', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Number_One_T%C3%BCrk_TV_logo.png/512px-Number_One_T%C3%BCrk_TV_logo.png', url: 'https://n10101m.mediatriple.net/videoonlylive/mtkgeuihrlfwlive/broadcast_5c9e1f56be91e.smil/playlist.m3u8' },

    // Kanal 7 & Diyanet Radyoları
    { id: 'radio-radyo7', name: 'Radyo 7', category: 'Karma', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanal_7_logo.svg/512px-Kanal_7_logo.svg.png', url: 'https://kanal7-live.daioncdn.net/radyo7/radyo7.m3u8' },
    { id: 'radio-radyo7turku', name: 'Radyo 7 Türkü', category: 'Türkü', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanal_7_logo.svg/512px-Kanal_7_logo.svg.png', url: 'https://kanal7-live.daioncdn.net/radyo7turku/radyo7turku.m3u8' },
    { id: 'radio-radyo7tsm', name: 'Radyo 7 Sanat', category: 'Sanat Müziği', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanal_7_logo.svg/512px-Kanal_7_logo.svg.png', url: 'https://kanal7-live.daioncdn.net/radyo7tsm/radyo7tsm.m3u8' },
    { id: 'radio-radyo7tasavvuf', name: 'Radyo 7 Tasavvuf', category: 'Tasavvuf / İlahi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanal_7_logo.svg/512px-Kanal_7_logo.svg.png', url: 'https://kanal7-live.daioncdn.net/radyo7tasavvuf/radyo7tasavvuf.m3u8' },
    { id: 'radio-diyanetradyo', name: 'Diyanet Radyo', category: 'Dini & Kültür', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Diyanet_TV_logo.png/512px-Diyanet_TV_logo.png', url: 'https://diyanetradyo-live.daioncdn.net/diyanetradyo/diyanetradyo.m3u8' },
    { id: 'radio-diyanetkuran', name: 'Diyanet Kur\'an Radyo', category: 'Kur\'an-ı Kerim', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Diyanet_TV_logo.png/512px-Diyanet_TV_logo.png', url: 'https://diyanetkuran-live.daioncdn.net/diyanetkuran/diyanetkuran.m3u8' },
    { id: 'radio-diyanetrisalet', name: 'Diyanet Risalet Radyo', category: 'Dini & Kültür', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/f/f6/Diyanet_TV_logo.png/512px-Diyanet_TV_logo.png', url: 'https://diyanetrisalet-live.daioncdn.net/diyanetrisalet/diyanetrisalet.m3u8' },
    { id: 'radio-moralfm', name: 'Moral FM', category: 'Sohbet & Kültür', logo: 'https://i.imgur.com/wdWR7Qk.png', url: 'https://yayin.canliradyolive.com/8038/stream' },
    { id: 'radio-akrafm', name: 'AKRA FM', category: 'Sohbet & Kültür', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/AKRA_logo.png/512px-AKRA_logo.png', url: 'https://yayin.akradyo.net:8000/stream' },
    { id: 'radio-ahaberradyo', name: 'A Haber Radyo', category: 'Haber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/A_Haber_logo.svg/512px-A_Haber_logo.svg.png', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8' },
    { id: 'radio-asporradyo', name: 'A Spor Radyo', category: 'Spor', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_Spor_logo.svg/512px-A_Spor_logo.svg.png', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8' },
    { id: 'radio-vavradyo', name: 'Vav Radyo', category: 'Dini & Kültür', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Vav_TV_logo.png/512px-Vav_TV_logo.png', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/vavradyo/vavradyo.m3u8' },
    { id: 'radio-turkuvazradyo', name: 'Turkuvaz Radyo', category: 'Türkçe Pop', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Atv_logo.svg/512px-Atv_logo.svg.png', url: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/turkuvazradyo/turkuvazradyo.m3u8' },
    { id: 'radio-kexp', name: 'KEXP 90.3 Seattle', category: 'Yabancı Alternatif', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/KEXP_logo.svg/512px-KEXP_logo.svg.png', url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3' }
  ];

  console.log('Testing Radios in parallel...');
  const testedRadios = await Promise.all(candidateRadios.map(async (r) => {
    const res = await checkUrl(r.url);
    return { ...r, ...res, type: 'radio' };
  }));

  const workingRadios = testedRadios.filter(t => t.ok);
  console.log(`Radios Done: ${workingRadios.length} / ${candidateRadios.length} are working.`);
  fs.writeFileSync('./scripts/working_radios.json', JSON.stringify(workingRadios, null, 2));
}

verifyAll();
