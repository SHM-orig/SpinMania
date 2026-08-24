import { useState } from 'react';
import { useGame } from '../context/GameContext';

export function SettingsScreen() {
  const g = useGame();
  const [name, setName] = useState(g.state.displayName);

  return (
    <div className="h-full overflow-y-auto no-scrollbar px-4 pt-4">
      <h2 className="mb-4 font-display text-2xl font-black">SETTINGS</h2>
      <label className="mb-4 block">
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">Display name</span>
        <input
          value={name}
          maxLength={16}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => g.setName(name)}
          className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 outline-none focus:border-neon-cyan"
        />
      </label>
      <button
        type="button"
        onClick={g.toggleSound}
        className="glass mb-2 flex w-full items-center justify-between rounded-2xl px-4 py-4"
      >
        <span>Sound</span>
        <span className="font-display text-neon-cyan">{g.state.sound ? 'ON' : 'OFF'}</span>
      </button>
      <button
        type="button"
        onClick={g.toggleHaptics}
        className="glass mb-2 flex w-full items-center justify-between rounded-2xl px-4 py-4"
      >
        <span>Haptics</span>
        <span className="font-display text-neon-magenta">{g.state.haptics ? 'ON' : 'OFF'}</span>
      </button>
      <p className="mt-6 text-xs leading-relaxed text-white/40">
        SpinMania is a toy. Stars are fake. There are no deposits, withdrawals, crypto, or prizes. If the
        wheel feels addictive, that is the point of the animation — take a breath anyway.
      </p>
      <button
        type="button"
        onClick={g.resetProgress}
        className="mt-4 w-full rounded-2xl border border-neon-red/40 py-3 text-sm text-neon-red"
      >
        Reset Stars & stats
      </button>
    </div>
  );
}
