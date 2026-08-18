import fs from 'fs';

const RD_SRC = 'E:/Kur/projelerim/agentTestleri/tvIzle/rd_tr.json';
const TV_SRC = 'E:/Kur/projelerim/agentTestleri/tvIzle/tv_tr.json';
const DATA_TS = './src/data.ts';

const rdRaw = JSON.parse(fs.readFileSync(RD_SRC, 'utf-8'));
const tvRaw = JSON.parse(fs.readFileSync(TV_SRC, 'utf-8'));

// Radio tag -> category mapping
const radioCategory = (tags = []) => {
  const first = (tags[0] || '').toString().toLowerCase();
  if (tags.some(t => /islamic|kuran|kur'an|dini/i.test(t))) return 'Dini & Kültür';
  if (tags.some(t => /news|haber/i.test(t))) return 'Haber';
  if (tags.some(t => /folk|türkü|kurdish/i.test(t))) return 'Türkü';
  if (tags.some(t => /classical|klasik|sanat/i.test(t))) return 'Klasik';
  if (tags.some(t => /arabesk|fantazi/i.test(t))) return 'Arabesk';
  if (tags.some(t => /pop|turkey|turkish/i.test(t))) return 'Türkçe Pop';
  if (tags.some(t => /rock/i.test(t))) return 'Rock';
  if (tags.some(t => /dance|club|edm/i.test(t))) return 'Dans / Club';
  return 'Karma';
};

// Derive a display resolution string from the stream URL when it contains one
// (e.g. "atv_1080p.m3u8" -> "1080p").
const tvResolution = (url = '') => {
  const m = url.match(/(\d{3,4})p/i);
  return m ? `${m[1].toLowerCase()}p` : undefined;
};

const tvChannels = tvRaw
  .filter(c => (c.country ?? 'tr') === 'tr')
  .map(c => ({
    id: c.id,
    name: c.name,
    type: 'tv',
    url: c.url,
    logo: c.logo || '',
    category: c.group || 'Genel',
    country: 'tr',
    resolution: tvResolution(c.url),
  }));

const radioChannels = rdRaw
  .filter(c => (c.country ?? 'tr') === 'tr')
  .map(c => ({
    id: c.id,
    name: c.name,
    type: 'radio',
    url: c.url,
    logo: c.favicon || '',
    category: radioCategory(c.tags),
    country: 'tr',
    bitrate: c.bitrate || undefined,
  }));

// Parse existing data.ts mockChannels and split into Turkey vs non-Turkey
const existingSource = fs.readFileSync(DATA_TS, 'utf-8');
const match = existingSource.match(/export const mockChannels: Channel\[\] = (\[[\s\S]*?\]);/);
if (!match) throw new Error('Could not parse mockChannels array');
const existing = eval(match[1]);

const isTurkeyChannel = (ch) => !ch.id.startsWith('yt-') && (ch.country === undefined || ch.country === 'tr');
const kept = existing.filter(ch => !isTurkeyChannel(ch));

const allChannels = [...kept, ...tvChannels, ...radioChannels];

const fileContent = `import { Channel } from './types';

export const mockChannels: Channel[] = ${JSON.stringify(allChannels, null, 2)};
`;

fs.writeFileSync(DATA_TS, fileContent, 'utf-8');
console.log(`TV (tr): ${tvChannels.length} | Radio (tr): ${radioChannels.length} | Kept international/yt: ${kept.length} | Total: ${allChannels.length}`);
