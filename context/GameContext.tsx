import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { sound } from '../audio/engine';
import { BROKE_GIFT, DAILY_BONUS, MAX_BET, MIN_BET } from '../data/constants';
import { haptic, hapticPattern } from '../hooks/useHaptic';
import type { Multiplier, PersistedState, SpinHistoryItem, SpinOutcome } from '../types/game';
import { uid } from '../utils/format';
import { resolveSpin } from '../utils/spin';
import { defaultState, loadState, saveState, todayKey } from '../utils/storage';

type Pending = SpinOutcome & { bet: number; daily: boolean; pick: Multiplier };

interface GameContextValue {
  state: PersistedState;
  bet: number;
  pick: Multiplier;
  spinning: boolean;
  rotation: number;
  spinDuration: number;
  lastOutcome: (SpinOutcome & { bet: number; pick: Multiplier }) | null;
  showResult: boolean;
  houseGift: number | null;
  setBet: (n: number) => void;
  setPick: (m: Multiplier) => void;
  setName: (n: string) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  spin: (opts?: { daily?: boolean }) => boolean;
  onSpinComplete: () => void;
  dismissResult: () => void;
  claimDaily: () => boolean;
  dailyAvailable: boolean;
  resetProgress: () => void;
  dismissGift: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => {
    const s = loadState();
    sound.setMuted(!s.sound);
    return s;
  });
  const [bet, setBetState] = useState(50);
  const [pick, setPick] = useState<Multiplier>(2);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinDuration, setSpinDuration] = useState(5.4);
  const [lastOutcome, setLastOutcome] = useState<(SpinOutcome & { bet: number; pick: Multiplier }) | null>(
    null,
  );
  const [showResult, setShowResult] = useState(false);
  const [houseGift, setHouseGift] = useState<number | null>(null);

  const stateRef = useRef(state);
  stateRef.current = state;
  const spinningRef = useRef(false);
  const pendingRef = useRef<Pending | null>(null);
  const rotationRef = useRef(0);
  const startedAtRef = useRef(0);
  const durationRef = useRef(5.4);
  const pickRef = useRef(pick);
  pickRef.current = pick;
  const betRef = useRef(bet);
  betRef.current = bet;

  const persistPatch = useCallback((fn: (prev: PersistedState) => PersistedState) => {
    setState((prev) => {
      const next = fn(prev);
      stateRef.current = next;
      saveState(next);
      return next;
    });
  }, []);

  const dailyAvailable = state.lastDailyAt !== todayKey();

  const setBet = useCallback((n: number) => {
    const bal = stateRef.current.balance;
    const capped = Math.min(MAX_BET, Math.max(MIN_BET, Math.round(n / 10) * 10));
    setBetState(Math.min(capped, Math.max(MIN_BET, bal)));
    sound.click();
    if (stateRef.current.haptics) haptic(8);
  }, []);

  const toggleSound = useCallback(() => {
    persistPatch((s) => {
      sound.setMuted(s.sound);
      return { ...s, sound: !s.sound };
    });
  }, [persistPatch]);

  const toggleHaptics = useCallback(() => {
    persistPatch((s) => ({ ...s, haptics: !s.haptics }));
  }, [persistPatch]);

  const setName = useCallback(
    (displayName: string) =>
      persistPatch((s) => ({ ...s, displayName: displayName.slice(0, 16) || 'You' })),
    [persistPatch],
  );

  const spin = useCallback(
    (opts?: { daily?: boolean }) => {
      if (spinningRef.current) return false;
      const daily = Boolean(opts?.daily);
      const current = stateRef.current;
      const wager = daily ? 0 : betRef.current;
      if (!daily && current.balance < wager) return false;

      void sound.resume();
      const chosen = pickRef.current;
      const outcome = resolveSpin(chosen, rotationRef.current, daily ? 50 : wager, {
        daily,
        boosted: wager >= 250,
      });

      spinningRef.current = true;
      pendingRef.current = { ...outcome, bet: daily ? 50 : wager, daily, pick: chosen };
      startedAtRef.current = performance.now();
      durationRef.current = outcome.duration;

      if (!daily) {
        persistPatch((s) => ({ ...s, balance: s.balance - wager }));
      }

      setSpinDuration(outcome.duration);
      rotationRef.current = outcome.targetRotation;
      setRotation(outcome.targetRotation);
      setSpinning(true);
      sound.startTension();
      if (current.haptics) hapticPattern([8, 30, 8]);
      return true;
    },
    [persistPatch],
  );

  const onSpinComplete = useCallback(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    const elapsed = performance.now() - startedAtRef.current;
    if (elapsed < durationRef.current * 1000 * 0.72) return;
    pendingRef.current = null;
    spinningRef.current = false;
    sound.stopTension();
    setSpinning(false);

    const { won, payout, nearMiss, sector, daily, bet: wager, pick: chosen } = pending;
    if (won) sound.win();
    else sound.lose();
    if (stateRef.current.haptics) hapticPattern(won ? [20, 40, 35, 40, 60] : [12]);

    const projected = stateRef.current.balance + payout + (daily ? DAILY_BONUS : 0);
    const gift = projected < MIN_BET ? BROKE_GIFT : null;
    setHouseGift(gift);

    persistPatch((s) => {
      const stats = { ...s.stats };
      stats.totalSpins += 1;
      stats.totalWagered += daily ? 0 : wager;
      stats.totalPayout += payout;
      if (won) {
        stats.wins += 1;
        stats.currentStreak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
        stats.biggestWin = Math.max(stats.biggestWin, payout);
      } else {
        stats.losses += 1;
        stats.currentStreak = 0;
      }

      const item: SpinHistoryItem = {
        id: uid(),
        at: Date.now(),
        bet: wager,
        pick: chosen,
        landed: sector.kind,
        payout,
        nearMiss,
        daily,
      };

      return {
        ...s,
        balance: s.balance + payout + (daily ? DAILY_BONUS : 0) + (gift ?? 0),
        stats,
        history: [item, ...s.history].slice(0, 40),
        lastDailyAt: daily ? todayKey() : s.lastDailyAt,
      };
    });

    setLastOutcome({ ...pending, payout, pick: chosen });
    setShowResult(true);
  }, [persistPatch]);

  const dismissResult = useCallback(() => setShowResult(false), []);
  const dismissGift = useCallback(() => setHouseGift(null), []);

  const claimDaily = useCallback(() => {
    if (!dailyAvailable || spinningRef.current) return false;
    return spin({ daily: true });
  }, [dailyAvailable, spin]);

  const resetProgress = useCallback(() => {
    persistPatch((s) => ({
      ...defaultState(),
      displayName: s.displayName,
      sound: s.sound,
      haptics: s.haptics,
    }));
    setLastOutcome(null);
    setShowResult(false);
    rotationRef.current = 0;
    setRotation(0);
  }, [persistPatch]);

  const value = useMemo(
    () => ({
      state,
      bet: Math.min(bet, Math.max(MIN_BET, state.balance)),
      pick,
      spinning,
      rotation,
      spinDuration,
      lastOutcome,
      showResult,
      houseGift,
      setBet,
      setPick: (m: Multiplier) => {
        setPick(m);
        sound.click();
        if (state.haptics) haptic(10);
      },
      setName,
      toggleSound,
      toggleHaptics,
      spin,
      onSpinComplete,
      dismissResult,
      claimDaily,
      dailyAvailable,
      resetProgress,
      dismissGift,
    }),
    [
      bet,
      claimDaily,
      dailyAvailable,
      dismissGift,
      dismissResult,
      houseGift,
      lastOutcome,
      onSpinComplete,
      pick,
      resetProgress,
      rotation,
      setBet,
      setName,
      showResult,
      spin,
      spinDuration,
      spinning,
      state,
      toggleHaptics,
      toggleSound,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
