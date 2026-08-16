import { Channel } from '../types';

export const parseM3U = (content: string): Channel[] => {
  const lines = content.split('\n').map(l => l.trim());
  const channels: Channel[] = [];
  let currentInfo: Partial<Channel> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      const nameSplit = line.split(',');
      const name = nameSplit.length > 1 ? nameSplit[1].trim() : 'Bilinmeyen Kanal';

      currentInfo = {
        name,
        logo: logoMatch ? logoMatch[1] : '',
        category: groupMatch ? groupMatch[1] : 'Diğer',
      };
    } else if (line && !line.startsWith('#')) {
      // It's a URL
      if (currentInfo) {
        channels.push({
          id: 'm3u-' + Math.random().toString(36).substr(2, 9) + '-' + i,
          name: currentInfo.name || 'Bilinmeyen Kanal',
          url: line,
          logo: currentInfo.logo || '',
          category: currentInfo.category || 'Diğer',
          type: 'tv', // Default to TV for M3U playlists
        });
        currentInfo = null;
      } else {
         channels.push({
          id: 'm3u-' + Math.random().toString(36).substr(2, 9) + '-' + i,
          name: 'Kanal ' + channels.length,
          url: line,
          logo: '',
          category: 'Diğer',
          type: 'tv',
        });
      }
    }
  }
  
  return channels;
};
