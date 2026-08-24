import { DailyBanner } from '../components/game/DailyBanner';
import { BalanceBar } from '../components/game/BalanceBar';
import { BetPanel } from '../components/game/BetPanel';
import { LuckMeter } from '../components/game/LuckMeter';
import { ResultModal } from '../components/game/ResultModal';
import { SpinButton } from '../components/game/SpinButton';
import { HouseGiftToast } from '../components/layout/HouseGiftToast';
import { FortuneWheel } from '../components/wheel/FortuneWheel';
import { useGame } from '../context/GameContext';

export function GameScreen() {
  const g = useGame();
  const canSpin = !g.spinning && g.state.balance >= g.bet;

  return (
    <div className="relative flex h-full flex-col gap-2 overflow-y-auto no-scrollbar px-4 pt-3 pb-2">
      <BalanceBar
        balance={g.state.balance}
        streak={g.state.stats.currentStreak}
        soundOn={g.state.sound}
        onToggleSound={g.toggleSound}
      />
      <DailyBanner available={g.dailyAvailable} spinning={g.spinning} onClaim={() => g.claimDaily()} />

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <FortuneWheel
          rotation={g.rotation}
          duration={g.spinDuration}
          spinning={g.spinning}
          glowBoost={g.bet >= 250}
          onComplete={g.onSpinComplete}
        />
      </div>

      <LuckMeter bet={g.bet} />
      <BetPanel
        bet={g.bet}
        pick={g.pick}
        balance={g.state.balance}
        disabled={g.spinning}
        onBet={g.setBet}
        onPick={g.setPick}
      />
      <SpinButton disabled={!canSpin} spinning={g.spinning} onClick={() => g.spin()} />

      <ResultModal open={g.showResult} outcome={g.lastOutcome} onClose={g.dismissResult} />
      <HouseGiftToast amount={g.houseGift} onDismiss={g.dismissGift} />
    </div>
  );
}
