import type { Sector } from '../types/game';

export const MIN_BET = 10;
export const MAX_BET = 500;
export const START_BALANCE = 1000;
export const BROKE_GIFT = 150;
export const DAILY_BONUS = 75;

export const BET_PRESETS = [10, 25, 50, 100, 250, 500] as const;

export const SECTORS: Sector[] = [
  { index: 0, kind: 'lose', label: '×0', color: '#2a0d18', glow: '#ff3b6b' },
  { index: 1, kind: 2, label: '×2', color: '#063a44', glow: '#00f5ff' },
  { index: 2, kind: 'lose', label: '×0', color: '#1a0810', glow: '#ff3b6b' },
  { index: 3, kind: 5, label: '×5', color: '#3a0a32', glow: '#ff2bd6' },
  { index: 4, kind: 2, label: '×2', color: '#0a3d48', glow: '#00f5ff' },
  { index: 5, kind: 'lose', label: '×0', color: '#240a12', glow: '#ff3b6b' },
  { index: 6, kind: 10, label: '×10', color: '#2a1050', glow: '#b14aff' },
  { index: 7, kind: 2, label: '×2', color: '#08343d', glow: '#00f5ff' },
  { index: 8, kind: 'lose', label: '×0', color: '#1c0a14', glow: '#ff3b6b' },
  { index: 9, kind: 5, label: '×5', color: '#420c38', glow: '#ff2bd6' },
  { index: 10, kind: 2, label: '×2', color: '#0b3f4a', glow: '#00f5ff' },
  { index: 11, kind: 'lose', label: '×0', color: '#2c0c16', glow: '#ff3b6b' },
  { index: 12, kind: 25, label: '×25', color: '#3d2e00', glow: '#ffd60a' },
  { index: 13, kind: 2, label: '×2', color: '#073840', glow: '#00f5ff' },
  { index: 14, kind: 'lose', label: '×0', color: '#18080e', glow: '#ff3b6b' },
  { index: 15, kind: 10, label: '×10', color: '#26104a', glow: '#b14aff' },
];

export const SLICE = 360 / SECTORS.length;

export const WIN_CHANCE: Record<2 | 5 | 10 | 25, number> = {
  2: 0.42,
  5: 0.18,
  10: 0.09,
  25: 0.035,
};

export const NEAR_MISS_CHANCE = 0.46;
