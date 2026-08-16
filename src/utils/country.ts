import { Channel, Country } from '../types';

export function filterChannelsByCountry(channels: Channel[], country: Country): Channel[] {
  if (country === 'all') return channels;
  return channels.filter(c => (c.country ?? 'tr') === country);
}