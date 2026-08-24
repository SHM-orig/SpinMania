import { AnimatePresence, motion } from 'framer-motion';
import { formatStars } from '../../utils/format';

export function HouseGiftToast({ amount, onDismiss }: { amount: number | null; onDismiss: () => void }) {
  return (
    <AnimatePresence>
      {amount != null && (
        <motion.button
          type="button"
          onClick={onDismiss}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-24 left-4 right-4 z-30 glass rounded-2xl px-4 py-3 text-left"
        >
          <p className="font-display text-sm font-bold text-neon-gold">House gift</p>
          <p className="text-xs text-white/60">
            You went dry. The pit boss slid you +{formatStars(amount)} Stars. Try not to blink.
          </p>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
