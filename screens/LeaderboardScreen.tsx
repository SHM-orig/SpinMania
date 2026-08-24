import { motion } from 'framer-motion';
import { MOCK_LEADERS } from '../data/leaderboard';
import { useGame } from '../context/GameContext';
import { formatStars } from '../utils/format';

export function LeaderboardScreen() {
  const { state } = useGame();
  const you = { name: state.displayName, stars: state.balance, streak: state.stats.currentStreak };
  const merged = [...MOCK_LEADERS, you]
    .sort((a, b) => b.stars - a.stars)
    .map((row, i) => ({
      ...row,
      rank: i + 1,
      you: row.name === you.name && row.stars === you.stars,
    }));

  return (
    <div className="h-full overflow-y-auto no-scrollbar px-4 pt-4">
      <h2 className="mb-1 font-display text-2xl font-black">NIGHT BOARD</h2>
      <p className="mb-4 text-sm text-white/45">Mock legends. Your Stars are real to this device only.</p>
      <div className="space-y-2">
        {merged.map((row, i) => (
          <motion.div
            key={`${row.name}-${row.rank}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass flex items-center gap-3 rounded-2xl px-3 py-3"
            style={row.you ? { boxShadow: '0 0 18px rgba(255,214,10,0.25)' } : undefined}
          >
            <span className="w-8 font-display text-lg font-black text-neon-gold">#{row.rank}</span>
            <div className="flex-1">
              <p className="font-semibold">
                {row.name} {row.you ? <span className="text-neon-cyan">(you)</span> : null}
              </p>
              <p className="text-[11px] text-white/40">streak {row.streak}</p>
            </div>
            <p className="font-display text-sm font-bold text-white">✦ {formatStars(row.stars)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
