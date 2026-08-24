import { durationForSpin, decideOutcome } from './rng';
import type { Multiplier, SpinOutcome } from '../types/game';

export function resolveSpin(
  pickMult: Multiplier,
  currentRotation: number,
  bet: number,
  opts?: { daily?: boolean; boosted?: boolean },
): SpinOutcome & { duration: number } {
  const outcome = decideOutcome(pickMult, currentRotation, opts);
  return {
    ...outcome,
    payout: outcome.won ? bet * pickMult : 0,
    duration: durationForSpin(outcome.extraTurns),
  };
}
