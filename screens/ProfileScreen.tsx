import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { formatStars } from '../utils/format';

export function ProfileScreen() {
  const { state } = useGame();
  const { stats, history, displayName, balance } = state;
  const wr = stats.totalSpins ? Math.round((stats.wins / stats.totalSpins) * 100) : 0;

  const cards = [
    { l: 'Balance', v: formatStars(balance) },
    { l: 'Spins', v: String(stats.totalSpins) },
    { l: 'Win rate', v: `${wr}%` },
    { l: 'Best streak', v: String(stats.bestStreak) },
    { l: 'Biggest hit', v: formatStars(stats.biggestWin) },
    { l: 'Wagered', v: formatStars(stats.totalWagered) },
  ];

  return (
    <div className="h-full overflow-y-auto no-scrollbar px-4 pt-4 pb-4">
      <div className="glass mb-4 rounded-3xl p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-white/40">Player</p>
        <h2 className="font-display text-2xl font-black text-white">{displayName}</h2>
        <p className="mt-1 text-sm text-white/50">Virtual high-roller. Stars only. Ego unlimited.</p>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {cards.map((c, i) => (
          <motion.div
            key={c.l}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-2xl px-3 py-3"
          >
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/40">{c.l}</p>
            <p className="font-display text-lg font-bold text-neon-cyan">{c.v}</p>
          </motion.div>
        ))}
      </div>
      <h3 className="mb-2 font-display text-sm tracking-[0.16em] text-white/70">RECENT SPINS</h3>
      <div className="space-y-2">
        {history.length === 0 && <p className="text-sm text-white/40">No scars yet. Spin.</p>}
        {history.map((h) => (
          <div key={h.id} className="glass flex items-center justify-between rounded-2xl px-3 py-2">
            <div>
              <p className="text-sm font-semibold">
                Bet ×{h.pick} · landed {h.landed === 'lose' ? '×0' : `×${h.landed}`}
              </p>
              <p className="text-[11px] text-white/40">
                {new Date(h.at).toLocaleTimeString()} {h.nearMiss ? '· almost' : ''} {h.daily ? '· daily' : ''}
              </p>
            </div>
            <p className={`font-display font-bold ${h.payout > 0 ? 'text-neon-gold' : 'text-neon-red'}`}>
              {h.payout > 0 ? `+${formatStars(h.payout)}` : `−${formatStars(h.bet)}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
