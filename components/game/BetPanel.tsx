import { motion } from 'framer-motion';
import { BET_PRESETS, MAX_BET, MIN_BET } from '../../data/constants';
import type { Multiplier } from '../../types/game';
import { clamp } from '../../utils/format';

const ZONES: { m: Multiplier; label: string; color: string }[] = [
  { m: 2, label: '×2', color: '#00f5ff' },
  { m: 5, label: '×5', color: '#ff2bd6' },
  { m: 10, label: '×10', color: '#b14aff' },
  { m: 25, label: '×25', color: '#ffd60a' },
];

export function BetPanel({
  bet,
  pick,
  balance,
  disabled,
  onBet,
  onPick,
}: {
  bet: number;
  pick: Multiplier;
  balance: number;
  disabled: boolean;
  onBet: (n: number) => void;
  onPick: (m: Multiplier) => void;
}) {
  const max = Math.min(MAX_BET, Math.max(MIN_BET, Math.floor(balance / 10) * 10));
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {ZONES.map((z) => {
          const active = pick === z.m;
          return (
            <motion.button
              key={z.m}
              type="button"
              disabled={disabled}
              whileTap={{ scale: 0.94 }}
              onClick={() => onPick(z.m)}
              className="relative flex-1 rounded-2xl py-2.5 font-display text-sm font-extrabold"
              style={{
                color: active ? '#030014' : z.color,
                background: active ? z.color : 'rgba(255,255,255,0.04)',
                boxShadow: active ? `0 0 22px ${z.color}` : 'none',
                border: `1px solid ${z.color}66`,
              }}
            >
              {z.label}
            </motion.button>
          );
        })}
      </div>

      <div className="glass rounded-2xl px-3 py-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Bet</p>
          <p className="font-display text-base font-bold text-white">✦ {bet}</p>
        </div>
        <input
          type="range"
          min={MIN_BET}
          max={max}
          step={10}
          disabled={disabled}
          value={clamp(bet, MIN_BET, max)}
          onChange={(e) => onBet(Number(e.target.value))}
          className="w-full accent-neon-magenta"
        />
        <div className="mt-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          {BET_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              disabled={disabled || p > balance}
              onClick={() => onBet(p)}
              className={`rounded-xl px-2.5 py-1 text-xs font-semibold ${
                bet === p ? 'bg-white text-black' : 'bg-white/10 text-white/80'
              } disabled:opacity-30`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={disabled}
            onClick={() => onBet(max)}
            className="rounded-xl bg-neon-gold/20 px-2.5 py-1 text-xs font-bold text-neon-gold"
          >
            MAX
          </button>
        </div>
      </div>
    </div>
  );
}
