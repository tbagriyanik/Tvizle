import http from 'http';
import https from 'https';
import fs from 'fs';

async function fetchJSON(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

function checkStream(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const mod = parsed.protocol === 'https:' ? https : http;
      const req = mod.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        timeout: 3000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          checkStream(res.headers.location).then(resolve);
          res.destroy();
          return;
        }
        const isOk = res.statusCode >= 200 && res.statusCode < 400;
        resolve({ ok: isOk, status: res.statusCode, finalUrl: url });
        res.destroy();
      });
      req.on('error', (e) => resolve({ ok: false, status: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 'TIMEOUT' }); });
    } catch (e) {
      resolve({ ok: false, status: 'INVALID_URL' });
    }
  });
}

async function run() {
  console.log('Fetching stations from multiple mirrors...');
  const mirrors = [
    'http://at1.api.radio-browser.info/json/stations/search?countrycode=TR&limit=200&order=votes&reverse=true',
    'http://de1.api.radio-browser.info/json/stations/search?countrycode=TR&limit=200&order=votes&reverse=true',
    'http://nl1.api.radio-browser.info/json/stations/search?countrycode=TR&limit=200&order=votes&reverse=true'
  ];

  let list = [];
  for (const m of mirrors) {
    const res = await fetchJSON(m);
    if (res && res.length > 0) {
      console.log(`Fetched ${res.length} from ${m}`);
      list = res;
      break;
    }
  }

  console.log(`Found ${list.length} radio entries from API.`);

  // Test in parallel chunks of 25
  const workingRadios = [];
  const chunkSize = 25;
  for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize);
    const checked = await Promise.all(chunk.map(async (st) => {
      const urlToTest = st.url_resolved || st.url;
      if (!urlToTest) return null;
      const res = await checkStream(urlToTest);
      if (res.ok) {
        return {
          id: 'radio-' + (st.stationuuid || Math.random().toString(36).substr(2, 9)),
          name: st.name.trim(),
          category: st.tags ? st.tags.split(',')[0] : 'Karma',
          logo: st.favicon || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png',
          url: res.finalUrl || urlToTest,
          votes: st.votes || 0
        };
      }
      return null;
    }));

    const valid = checked.filter(Boolean);
    workingRadios.push(...valid);
    console.log(`Tested ${Math.min(i + chunkSize, list.length)}/${list.length} -> Working: ${workingRadios.length}`);
  }

  console.log(`\nTOTAL WORKING VERIFIED RADIOS: ${workingRadios.length}`);
  fs.writeFileSync('./scripts/api_working_radios.json', JSON.stringify(workingRadios, null, 2));
}

run();
