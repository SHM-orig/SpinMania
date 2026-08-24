import { motion } from 'framer-motion';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import { formatStars } from '../../utils/format';

export function BalanceBar({
  balance,
  streak,
  soundOn,
  onToggleSound,
}: {
  balance: number;
  streak: number;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  const shown = useAnimatedNumber(balance, 640);
  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <div className="glass flex items-center gap-2 rounded-2xl px-3 py-2">
        <span className="text-lg leading-none" style={{ filter: 'drop-shadow(0 0 8px #ffd60a)' }}>
          ✦
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Stars</p>
          <p className="font-display text-lg font-extrabold text-neon-gold leading-none">
            {formatStars(shown)}
          </p>
        </div>
      </div>
      <div className="glass flex items-center gap-2 rounded-2xl px-3 py-2">
        <span className="text-base">🔥</span>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Streak</p>
          <p className="font-display text-lg font-extrabold text-neon-magenta leading-none">{streak}</p>
        </div>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onToggleSound}
        className="glass grid h-12 w-12 place-items-center rounded-2xl text-lg"
        aria-label="Toggle sound"
      >
        {soundOn ? '🔊' : '🔇'}
      </motion.button>
    </div>
  );
}
