import { START_BALANCE } from '../data/constants';
import type { PersistedState, Stats } from '../types/game';

const KEY = 'spinmania-v1';

export const emptyStats = (): Stats => ({
  totalSpins: 0,
  wins: 0,
  losses: 0,
  totalWagered: 0,
  totalPayout: 0,
  biggestWin: 0,
  currentStreak: 0,
  bestStreak: 0,
});

export const defaultState = (): PersistedState => ({
  balance: START_BALANCE,
  displayName: 'You',
  sound: true,
  haptics: true,
  stats: emptyStats(),
  history: [],
  lastDailyAt: null,
});

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...defaultState(),
      ...parsed,
      stats: { ...emptyStats(), ...parsed.stats },
      history: parsed.history ?? [],
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: PersistedState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
