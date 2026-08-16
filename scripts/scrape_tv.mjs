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
          // Redirect
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

function parseM3U(content) {
  const lines = content.split('\n');
  const items = [];
  let current = null;
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.*)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      current = {
        name: nameMatch ? nameMatch[1].trim() : 'Kanal',
        logo: logoMatch ? logoMatch[1] : '',
        category: groupMatch ? groupMatch[1] : 'Genel'
      };
    } else if (line.startsWith('http') && current) {
      items.push({ ...current, url: line });
      current = null;
    }
  }
  return items;
}

async function run() {
  console.log('Fetching playlists...');
  const [p1, p2] = await Promise.all([
    fetchPlaylist('https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_turkey.m3u8'),
    fetchPlaylist('https://iptv-org.github.io/iptv/countries/tr.m3u')
  ]);

  const allChannels = [...parseM3U(p1), ...parseM3U(p2)];
  console.log(`Parsed total ${allChannels.length} candidates.`);

  // Deduplicate by name/url
  const uniqueMap = new Map();
  for (const c of allChannels) {
    if (!uniqueMap.has(c.url)) {
      uniqueMap.set(c.url, c);
    }
  }
  const uniqueChannels = Array.from(uniqueMap.values());
  console.log(`Unique channels to test: ${uniqueChannels.length}`);

  // Test in chunks
  const working = [];
  const chunkSize = 20;
  for (let i = 0; i < uniqueChannels.length; i += chunkSize) {
    const chunk = uniqueChannels.slice(i, i + chunkSize);
    const results = await Promise.all(chunk.map(async (ch) => {
      const res = await checkStream(ch.url);
      return { ...ch, ...res };
    }));
    for (const r of results) {
      if (r.ok) {
        working.push(r);
      }
    }
    console.log(`Processed ${Math.min(i + chunkSize, uniqueChannels.length)}/${uniqueChannels.length} - Working: ${working.length}`);
  }

  console.log(`\nTOTAL WORKING TV CHANNELS: ${working.length}`);
  fs.writeFileSync('./scripts/all_working_tv.json', JSON.stringify(working, null, 2));
}

run();
