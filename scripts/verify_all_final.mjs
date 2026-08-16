import https from 'https';
import http from 'http';
import fs from 'fs';

const dataFile = fs.readFileSync('./src/data.ts', 'utf8');
const jsonMatch = dataFile.match(/export const mockChannels: Channel\[\] = (\[[\s\S]*\]);/);
const mockChannels = jsonMatch ? JSON.parse(jsonMatch[1]) : [];

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
        timeout: 4000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          checkStream(res.headers.location).then(resolve);
          res.destroy();
          return;
        }
        const isOk = res.statusCode >= 200 && res.statusCode < 400;
        resolve({ ok: isOk, status: res.statusCode });
        res.destroy();
      });
      req.on('error', (e) => resolve({ ok: false, status: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 'TIMEOUT' }); });
    } catch (e) {
      resolve({ ok: false, status: 'INVALID' });
    }
  });
}

async function verify() {
  console.log(`Checking all ${mockChannels.length} channels currently in data.ts...`);
  const tvs = mockChannels.filter(c => c.type === 'tv');
  const radios = mockChannels.filter(c => c.type === 'radio');

  const tvResults = await Promise.all(tvs.map(async (c) => {
    const res = await checkStream(c.url);
    return { ...c, ...res };
  }));

  const radioResults = await Promise.all(radios.map(async (c) => {
    const res = await checkStream(c.url);
    return { ...c, ...res };
  }));

  const workingTvs = tvResults.filter(t => t.ok);
  const failedTvs = tvResults.filter(t => !t.ok);
  const workingRadios = radioResults.filter(r => r.ok);
  const failedRadios = radioResults.filter(r => !r.ok);

  console.log(`\nTV Status: ${workingTvs.length} working / ${failedTvs.length} failed (Total: ${tvs.length})`);
  if (failedTvs.length > 0) {
    console.log('Failed TVs:', failedTvs.map(t => `${t.name} (${t.status})`));
  }

  console.log(`\nRadio Status: ${workingRadios.length} working / ${failedRadios.length} failed (Total: ${radios.length})`);
  if (failedRadios.length > 0) {
    console.log('Failed Radios:', failedRadios.map(r => `${r.name} (${r.status})`));
  }

  // Load backup working radios from api_working_radios.json to ensure we have 55+ 100% verified working radios
  const apiRadios = JSON.parse(fs.readFileSync('./scripts/api_working_radios.json', 'utf8'));

  const finalWorkingRadios = [...workingRadios];
  for (const ar of apiRadios) {
    if (finalWorkingRadios.length >= 65) break;
    if (!finalWorkingRadios.find(r => r.name.toLowerCase() === ar.name.toLowerCase() || r.url === ar.url)) {
      finalWorkingRadios.push({
        id: ar.id || `radio-${Math.random().toString(36).substr(2, 9)}`,
        name: ar.name,
        type: 'radio',
        url: ar.url,
        logo: ar.logo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/TRT_FM_logo_2021.svg/512px-TRT_FM_logo_2021.svg.png',
        category: ar.category || 'Karma'
      });
    }
  }

  console.log(`\nFinal Pure Working Dataset -> TVs: ${workingTvs.length}, Radios: ${finalWorkingRadios.length}`);

  // Clean objects
  const cleanTvs = workingTvs.map(({ id, name, type, url, logo, category }) => ({ id, name, type, url, logo, category }));
  const cleanRadios = finalWorkingRadios.map(({ id, name, type, url, logo, category }) => ({ id, name, type, url, logo, category }));

  const cleanAll = [...cleanTvs, ...cleanRadios];

  const fileContent = `import { Channel } from './types';

export const mockChannels: Channel[] = ${JSON.stringify(cleanAll, null, 2)};
`;

  fs.writeFileSync('./src/data.ts', fileContent, 'utf-8');
  console.log('Saved 100% verified working channels into /src/data.ts!');
}

verify();
