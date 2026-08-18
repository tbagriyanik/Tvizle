import fs from 'fs';

const RD_SRC = 'E:/Kur/projelerim/agentTestleri/tvIzle/rd_tr.json';
const TV_SRC = 'E:/Kur/projelerim/agentTestleri/tvIzle/tv_tr.json';
const DATA_TS = './src/data.ts';

const rdRaw = JSON.parse(fs.readFileSync(RD_SRC, 'utf-8'));
const tvRaw = JSON.parse(fs.readFileSync(TV_SRC, 'utf-8'));

// Radio tag + name -> category mapping. Names are used because many stations
// have no descriptive tags, but their names clearly indicate the genre.
const radioCategory = (name = '', tags = []) => {
  const tag = (tags || []).map(t => t.toString().toLowerCase()).join(' ');
  const nm = (name || '').toLowerCase();
  const has = (re) => re.test(tag) || re.test(nm);

  if (has(/islamic|kuran|kur'an|dini|ilahi/)) return 'Dini & Kültür';
  if (has(/spor|sport|futbol|\bgol\b|lig radyo|futbolcu/)) return 'Spor';
  if (has(/haber|news|trafik|gazete|radyo gol/)) return 'Haber';
  if (has(/slow|romant|love|sevgili|45lik|nostalji|sarkilar|ballad|radyo 45/)) return 'Slow';
  if (has(/folk|türkü|kurdish|türk halk/)) return 'Türkü';
  if (has(/classical|klasik|sanat|klasik/)) return 'Klasik';
  if (has(/arabesk|fantazi/)) return 'Arabesk';
  if (has(/pop|top ?40|hit|turkey|turkish pop/)) return 'Türkçe Pop';
  if (has(/rock/)) return 'Rock';
  if (has(/dance|club|clubbin|edm|chill/)) return 'Dans / Club';
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
    category: radioCategory(c.name, c.tags),
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
