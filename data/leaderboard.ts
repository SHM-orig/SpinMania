import type { LeaderEntry } from '../types/game';

export const MOCK_LEADERS: Omit<LeaderEntry, 'rank' | 'you'>[] = [
  { name: 'NeonAce', stars: 128400, streak: 11 },
  { name: 'GoldPulse', stars: 97650, streak: 7 },
  { name: 'VioletRush', stars: 81220, streak: 9 },
  { name: 'CyanPhantom', stars: 64010, streak: 4 },
  { name: 'MagmaSpin', stars: 50180, streak: 6 },
  { name: 'LuckyVolt', stars: 38740, streak: 3 },
  { name: 'NightJack', stars: 27490, streak: 5 },
  { name: 'SparkQueen', stars: 19880, streak: 2 },
];
