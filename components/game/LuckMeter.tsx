import { motion } from 'framer-motion';
import { MAX_BET } from '../../data/constants';

export function LuckMeter({ bet }: { bet: number }) {
  const fill = Math.min(0.92, 0.18 + (bet / MAX_BET) * 0.74);
  return (
    <div className="glass rounded-2xl px-3 py-2">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Luck meter</p>
        <p className="font-display text-[10px] text-neon-cyan">{Math.round(fill * 100)}%</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${fill * 100}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
          style={{
            background: 'linear-gradient(90deg, #00f5ff, #b14aff, #ff2bd6, #ffd60a)',
            boxShadow: '0 0 12px rgba(0,245,255,0.6)',
          }}
        />
      </div>
    </div>
  );
}
