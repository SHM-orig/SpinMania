import { motion } from 'framer-motion';
import type { ScreenId } from '../../types/game';

const TABS: { id: ScreenId; label: string; icon: string }[] = [
  { id: 'game', label: 'Wheel', icon: '🎡' },
  { id: 'profile', label: 'Stats', icon: '👤' },
  { id: 'board', label: 'Board', icon: '🏆' },
  { id: 'settings', label: 'More', icon: '⚙️' },
];

export function BottomNav({ screen, onChange }: { screen: ScreenId; onChange: (s: ScreenId) => void }) {
  return (
    <nav className="glass mx-3 mb-[max(10px,env(safe-area-inset-bottom))] grid grid-cols-4 rounded-3xl p-1">
      {TABS.map((t) => {
        const active = screen === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="relative rounded-2xl py-2 text-center"
          >
            {active && (
              <motion.span
                layoutId="tab"
                className="absolute inset-0 rounded-2xl bg-white/10"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 block text-base leading-none">{t.icon}</span>
            <span className={`relative z-10 mt-1 block text-[10px] font-semibold ${active ? 'text-white' : 'text-white/45'}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
