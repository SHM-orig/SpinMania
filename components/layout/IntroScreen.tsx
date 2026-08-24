import { motion } from 'framer-motion';

export function IntroScreen({ onDone }: { onDone: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onDone}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center app-bg px-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.55 }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 12 }}
        className="mb-6 grid h-28 w-28 place-items-center rounded-full"
        style={{
          background: 'conic-gradient(from 90deg, #00f5ff, #b14aff, #ff2bd6, #ffd60a, #00f5ff)',
          boxShadow: '0 0 50px rgba(177,74,255,0.55)',
        }}
      >
        <div className="grid h-[6.3rem] w-[6.3rem] place-items-center rounded-full bg-[#070018] font-display text-3xl text-neon-gold">
          ✦
        </div>
      </motion.div>
      <motion.h1
        className="font-display text-4xl font-black tracking-[0.18em] text-white"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ textShadow: '0 0 24px #b14aff' }}
      >
        SPINMANIA
      </motion.h1>
      <motion.p
        className="mt-3 max-w-xs text-center text-sm text-white/55"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        Virtual Stars. No cash. No mercy. The wheel wants another round.
      </motion.p>
      <motion.p
        className="mt-10 font-display text-xs tracking-[0.28em] text-neon-cyan"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      >
        TAP TO ENTER
      </motion.p>
    </motion.button>
  );
}
