import https from 'https';
import http from 'http';
import fs from 'fs';

const DATA_TS = './src/data.ts';
const dataSrc = fs.readFileSync(DATA_TS, 'utf8');
const match = dataSrc.match(/export const mockChannels: Channel\[\] = (\[[\s\S]*\]);/);
if (!match) throw new Error('Could not parse mockChannels array');
const channels = JSON.parse(match[1]);

function checkStream(url, depth = 0) {
  return new Promise((resolve) => {
    if (depth > 5) return resolve(false);
    try {
      const parsed = new URL(url);
      const mod = parsed.protocol === 'https:' ? https : http;
      const req = mod.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': parsed.origin,
        },
        timeout: 5000,
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = new URL(res.headers.location, parsed.origin).toString();
          res.destroy();
          return checkStream(next, depth + 1).then(resolve);
        }
        const ok = res.statusCode >= 200 && res.statusCode < 400;
        res.destroy();
        resolve(ok);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
    } catch (_) {
      resolve(false);
    }
  });
}

async function main() {
  console.log(`Checking ${channels.length} channels...`);

  const results = await Promise.all(channels.map(async (ch) => {
    // YouTube links are pages (always reachable); skip network test.
    if (ch.url.includes('youtube.com') || ch.url.includes('youtu.be')) {
      return { ch, ok: true };
    }
    const ok = await checkStream(ch.url);
    return { ch, ok };
  }));

  const failed = results.filter(r => !r.ok).map(r => r.ch);
  const working = results.filter(r => r.ok).map(r => r.ch);

  console.log(`Working: ${working.length} | Failed: ${failed.length}`);
  if (failed.length) {
    console.log('REMOVING:');
    failed.forEach(c => console.log(`  [${c.type}] ${c.name} -> ${c.url}`));
  }

  const fileContent = `import { Channel } from './types';

export const mockChannels: Channel[] = ${JSON.stringify(working, null, 2)};
`;

  fs.writeFileSync(DATA_TS, fileContent, 'utf-8');
  console.log(`\nSaved ${working.length} working channels into ${DATA_TS}`);
}

main();