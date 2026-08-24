import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import { BottomNav } from './components/layout/BottomNav';
import { IntroScreen } from './components/layout/IntroScreen';
import { GameScreen } from './screens/GameScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import type { ScreenId } from './types/game';
import { sound } from './audio/engine';

function Shell() {
  const [intro, setIntro] = useState(true);
  const [screen, setScreen] = useState<ScreenId>('game');

  return (
    <div className="app-bg mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden">
      <AnimatePresence>{intro && <IntroScreen onDone={() => { void sound.resume(); setIntro(false); }} />}</AnimatePresence>
      <main className="min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            className="h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {screen === 'game' && <GameScreen />}
            {screen === 'profile' && <ProfileScreen />}
            {screen === 'board' && <LeaderboardScreen />}
            {screen === 'settings' && <SettingsScreen />}
          </motion.div>
        </AnimatePresence>
      </main>
      {!intro && <BottomNav screen={screen} onChange={setScreen} />}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Shell />
    </GameProvider>
  );
}
