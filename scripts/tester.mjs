import https from 'https';
import http from 'http';

async function fetchText(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }, (res) => {
      let data = '';
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve);
      }
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': parsed.origin,
          'Origin': parsed.origin
        },
        timeout: 4000
      }, (res) => {
        const isOk = res.statusCode >= 200 && res.statusCode < 400;
        resolve({ url, status: res.statusCode, ok: isOk, contentType: res.headers['content-type'] });
        res.resume();
      });
      req.on('error', (e) => resolve({ url, status: e.message, ok: false }));
      req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT', ok: false }); });
    } catch(err) {
      resolve({ url, status: 'INVALID_URL', ok: false });
    }
  });
}

async function main() {
  console.log('Fetching IPTV-org Turkish playlist...');
  const iptv = await fetchText('https://iptv-org.github.io/iptv/countries/tr.m3u');
  console.log('IPTV data length:', iptv.length);

  const lines = iptv.split('\n');
  const extracted = [];
  let currentInfo = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.*)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      currentInfo = {
        name: nameMatch ? nameMatch[1].trim() : 'Unknown',
        logo: logoMatch ? logoMatch[1] : '',
        category: groupMatch ? groupMatch[1] : 'Genel'
      };
    } else if (line.startsWith('http') && currentInfo) {
      extracted.push({ ...currentInfo, url: line });
      currentInfo = null;
    }
  }

  console.log(`Found ${extracted.length} Turkish channels in IPTV-org.`);

  // Test streams in batches of 15
  const tested = [];
  for (let i = 0; i < extracted.length; i += 15) {
    const batch = extracted.slice(i, i + 15);
    const results = await Promise.all(batch.map(async (item) => {
      const res = await checkStream(item.url);
      return { ...item, ...res };
    }));
    tested.push(...results);
  }

  const working = tested.filter(t => t.ok);
  console.log(`\n--- WORKING CHANNELS (${working.length}) ---`);
  working.forEach(w => {
    console.log(`[${w.status}] ${w.name} (${w.category}) -> ${w.url}`);
  });
}

main();
