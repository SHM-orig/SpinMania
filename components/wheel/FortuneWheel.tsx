import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../../audio/engine';
import { SLICE } from '../../data/constants';
import { WheelDisc } from './WheelDisc';
import { WheelSparks } from './WheelSparks';

interface Props {
  rotation: number;
  duration: number;
  spinning: boolean;
  glowBoost?: boolean;
  onComplete: () => void;
}

export function FortuneWheel({ rotation, duration, spinning, glowBoost, onComplete }: Props) {
  const [tense, setTense] = useState(false);
  const lastSlice = useRef(-1);
  const completedFor = useRef<number | null>(null);

  useEffect(() => {
    if (!spinning) {
      setTense(false);
      return;
    }
    completedFor.current = null;
    const id = window.setTimeout(() => setTense(true), duration * 1000 * 0.76);
    return () => window.clearTimeout(id);
  }, [spinning, duration, rotation]);

  return (
    <motion.div
      className="relative mx-auto aspect-square w-[min(78vw,340px)] max-h-[42dvh]"
      animate={tense ? { x: [0, -3, 3, -2, 2, 0], y: [0, 2, -1, 2, 0] } : { x: 0, y: 0 }}
      transition={tense ? { repeat: Infinity, duration: 0.16 } : { duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-[-12%] rounded-full"
        animate={{
          opacity: spinning ? [0.4, 0.85, 1] : glowBoost ? 0.7 : 0.45,
          scale: spinning ? [1, 1.04, 1.07] : 1,
        }}
        transition={{ duration: spinning ? duration : 0.6, ease: 'linear' }}
        style={{
          background: `radial-gradient(circle, ${
            glowBoost ? 'rgba(255,214,10,0.28)' : 'rgba(0,245,255,0.16)'
          } 0%, transparent 68%)`,
          filter: 'blur(8px)',
        }}
      />

      <div className="absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
        <div
          className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[22px] border-l-transparent border-r-transparent border-t-neon-gold"
          style={{ filter: 'drop-shadow(0 0 10px #ffd60a)' }}
        />
      </div>

      <motion.div
        className="absolute inset-0 will-change-transform"
        animate={{ rotate: rotation }}
        transition={
          spinning
            ? {
                duration,
                ease: [0.18, 0.72, 0.04, 1],
              }
            : { duration: 0 }
        }
        onUpdate={(latest) => {
          if (!spinning) return;
          const r = Number(latest.rotate) || 0;
          const slice = Math.floor((((r % 360) + 360) % 360) / SLICE);
          if (slice !== lastSlice.current) {
            lastSlice.current = slice;
            sound.tick(tense ? 0.95 : 0.45);
          }
        }}
        onAnimationComplete={() => {
          if (!spinning) return;
          if (completedFor.current === rotation) return;
          completedFor.current = rotation;
          onComplete();
        }}
      >
        {spinning && (
          <div
            className="pointer-events-none absolute inset-0 rounded-full opacity-40"
            style={{
              filter: 'blur(6px)',
              transform: 'scale(1.02)',
            }}
          >
            <WheelDisc />
          </div>
        )}
        <div
          className="relative h-full w-full"
          style={{
            filter: spinning
              ? `drop-shadow(0 0 ${tense ? 28 : 16}px rgba(0,245,255,0.55)) drop-shadow(0 0 18px rgba(255,43,214,0.35))`
              : 'drop-shadow(0 12px 28px rgba(0,0,0,0.55))',
          }}
        >
          <WheelDisc />
        </div>
      </motion.div>

      <WheelSparks active={spinning} tense={tense} />

      <div className="pointer-events-none absolute inset-[18%] rounded-full bg-gradient-to-br from-white/10 to-transparent" />
    </motion.div>
  );
}
