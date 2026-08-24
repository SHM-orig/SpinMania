import { motion } from 'framer-motion';

export function SpinButton({
  onClick,
  disabled,
  spinning,
  daily,
}: {
  onClick: () => void;
  disabled: boolean;
  spinning?: boolean;
  daily?: boolean;
}) {
  return (
    <motion.button
      type="button"
      disabled={disabled || spinning}
      whileHover={disabled || spinning ? undefined : { scale: 1.04 }}
      whileTap={disabled || spinning ? undefined : { scale: 0.94 }}
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-3xl py-4 font-display text-2xl font-black tracking-[0.2em] disabled:opacity-50"
      style={{
        color: '#140800',
        background: daily
          ? 'linear-gradient(90deg, #00f5ff, #b14aff, #ffd60a)'
          : 'linear-gradient(90deg, #ffd60a, #ff8a00, #ff2bd6)',
        boxShadow: daily
          ? '0 0 34px rgba(0,245,255,0.45), 0 10px 24px rgba(0,0,0,0.35)'
          : '0 0 34px rgba(255,214,10,0.5), 0 10px 24px rgba(0,0,0,0.35)',
      }}
    >
      <motion.span
        className="pointer-events-none absolute inset-0 shine"
        animate={{ backgroundPosition: ['0% 0%', '180% 0%'] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
      />
      {spinning ? 'SPINNING' : daily ? 'FREE SPIN' : 'SPIN'}
    </motion.button>
  );
}
