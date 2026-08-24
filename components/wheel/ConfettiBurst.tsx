import { useMemo } from 'react';
import { motion } from 'framer-motion';

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function ConfettiBurst({ play }: { play: boolean }) {
  const bits = useMemo(() => {
    if (!play) return [];
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: rand(-40, 40),
      delay: rand(0, 0.18),
      dur: rand(0.9, 1.5),
      rot: rand(-220, 220),
      color: ['#00f5ff', '#ff2bd6', '#ffd60a', '#b14aff', '#fff'][i % 5],
      w: rand(5, 10),
      h: rand(8, 16),
    }));
  }, [play]);

  if (!play) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute left-1/2 top-[38%] rounded-[2px]"
          style={{ width: b.w, height: b.h, background: b.color, boxShadow: `0 0 10px ${b.color}` }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: b.x * 4.2,
            y: [0, -80 - Math.abs(b.x), 220],
            opacity: [1, 1, 0],
            rotate: b.rot,
            scale: [1, 1.1, 0.7],
          }}
          transition={{ duration: b.dur, delay: b.delay, ease: [0.15, 0.7, 0.2, 1] }}
        />
      ))}
    </div>
  );
}
