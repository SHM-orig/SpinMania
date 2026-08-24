export type ScreenId = 'game' | 'profile' | 'board' | 'settings';

export type Multiplier = 2 | 5 | 10 | 25;

export type SectorKind = 'lose' | Multiplier;

export interface Sector {
  index: number;
  kind: SectorKind;
  label: string;
  color: string;
  glow: string;
}

export interface SpinHistoryItem {
  id: string;
  at: number;
  bet: number;
  pick: Multiplier;
  landed: SectorKind;
  payout: number;
  nearMiss: boolean;
  daily: boolean;
}

export interface Stats {
  totalSpins: number;
  wins: number;
  losses: number;
  totalWagered: number;
  totalPayout: number;
  biggestWin: number;
  currentStreak: number;
  bestStreak: number;
}

export interface PersistedState {
  balance: number;
  displayName: string;
  sound: boolean;
  haptics: boolean;
  stats: Stats;
  history: SpinHistoryItem[];
  lastDailyAt: string | null;
}

export interface SpinOutcome {
  sector: Sector;
  won: boolean;
  payout: number;
  nearMiss: boolean;
  extraTurns: number;
  targetRotation: number;
}

export interface LeaderEntry {
  rank: number;
  name: string;
  stars: number;
  streak: number;
  you?: boolean;
}
