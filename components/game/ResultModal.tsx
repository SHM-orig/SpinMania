import { motion, AnimatePresence } from 'framer-motion';
import { ConfettiBurst } from '../wheel/ConfettiBurst';
import { formatStars } from '../../utils/format';
import type { Multiplier, SpinOutcome } from '../../types/game';

export function ResultModal({
  open,
  outcome,
  onClose,
}: {
  open: boolean;
  outcome: (SpinOutcome & { bet: number; pick: Multiplier }) | null;
  onClose: () => void;
}) {
  const won = Boolean(outcome?.won);
  const near = Boolean(outcome?.nearMiss);
  return (
    <AnimatePresence>
      {open && outcome && (
        <motion.button
          type="button"
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ConfettiBurst play={won} />
          <motion.div
            initial={{ scale: 0.7, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="glass relative w-full max-w-sm rounded-[28px] px-6 py-8 text-center"
            style={{
              boxShadow: won
                ? '0 0 60px rgba(255,214,10,0.35)'
                : near
                  ? '0 0 40px rgba(255,43,214,0.25)'
                  : '0 0 40px rgba(255,59,107,0.18)',
            }}
          >
            {won ? (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-neon-gold">You hit</p>
                <motion.p
                  className="font-display text-7xl font-black text-neon-gold"
                  initial={{ scale: 0.4, filter: 'blur(8px)' }}
                  animate={{ scale: [0.4, 1.12, 1], filter: 'blur(0px)' }}
                  transition={{ duration: 0.55 }}
                  style={{ textShadow: '0 0 28px #ffd60a' }}
                >
                  {outcome.sector.label}
                </motion.p>
                <p className="mt-2 text-lg font-semibold text-white">+{formatStars(outcome.payout)} Stars</p>
                <p className="mt-1 text-sm text-white/50">Tap to spin again. You know you want to.</p>
              </>
            ) : near ? (
              <>
                <motion.p
                  className="font-display text-4xl font-black text-neon-magenta"
                  animate={{ x: [0, -6, 6, -3, 0] }}
                  style={{ textShadow: '0 0 20px #ff2bd6' }}
                >
                  SO CLOSE
                </motion.p>
                <p className="mt-3 text-white/70">
                  Landed on {outcome.sector.label}. A breath away from ×{outcome.pick}.
                </p>
                <p className="mt-2 font-display text-xl text-neon-red">−{formatStars(outcome.bet)}</p>
              </>
            ) : (
              <motion.div
                animate={{ boxShadow: ['0 0 0px #ff3b6b', '0 0 40px #ff3b6b', '0 0 0px #ff3b6b'] }}
                transition={{ duration: 0.9 }}
                className="rounded-[24px] py-2"
              >
                <p className="text-5xl">😵‍💫</p>
                <p className="mt-2 font-display text-3xl font-black text-neon-red">MISS</p>
                <p className="mt-2 text-white/60">The wheel blinked. Your Stars did a tiny scream.</p>
                <p className="mt-2 font-display text-xl text-white/80">−{formatStars(outcome.bet)}</p>
              </motion.div>
            )}
            <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-white/35">Tap anywhere</p>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
