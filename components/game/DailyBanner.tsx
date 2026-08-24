import { AnimatePresence, motion } from 'framer-motion';
import { DAILY_BONUS } from '../../data/constants';

export function DailyBanner({
  available,
  spinning,
  onClaim,
}: {
  available: boolean;
  spinning: boolean;
  onClaim: () => void;
}) {
  return (
    <AnimatePresence>
      {available && !spinning && (
        <motion.button
          type="button"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClaim}
          className="glass w-full rounded-2xl px-3 py-2 text-left"
          style={{ boxShadow: '0 0 20px rgba(0,245,255,0.2)' }}
        >
          <p className="font-display text-xs font-bold tracking-[0.18em] text-neon-cyan">DAILY FREE SPIN</p>
          <p className="text-[11px] text-white/55">
            Claim +{DAILY_BONUS} Stars and a charged spin. Do not leave it unspun.
          </p>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
