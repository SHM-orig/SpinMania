import { NEAR_MISS_CHANCE, SECTORS, SLICE, WIN_CHANCE } from '../data/constants';
import type { Multiplier, Sector, SpinOutcome } from '../types/game';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sectorsOf(kind: Sector['kind']) {
  return SECTORS.filter((s) => s.kind === kind);
}

function adjacentTo(index: number): Sector[] {
  const n = SECTORS.length;
  return [SECTORS[(index - 1 + n) % n], SECTORS[(index + 1) % n]];
}

export function decideOutcome(
  pickMult: Multiplier,
  currentRotation: number,
  opts?: { daily?: boolean; boosted?: boolean },
): SpinOutcome {
  const chance = WIN_CHANCE[pickMult] * (opts?.daily ? 1.35 : 1) * (opts?.boosted ? 1.12 : 1);
  const won = Math.random() < Math.min(0.55, chance);

  let sector: Sector;
  let nearMiss = false;

  if (won) {
    sector = pick(sectorsOf(pickMult));
  } else {
    const targets = sectorsOf(pickMult);
    const target = pick(targets);
    const neighbors = adjacentTo(target.index).filter((s) => s.kind !== pickMult);
    if (neighbors.length && Math.random() < NEAR_MISS_CHANCE) {
      sector = pick(neighbors);
      nearMiss = pickMult >= 10 || Math.random() < 0.55;
    } else {
      const losers = SECTORS.filter((s) => s.kind !== pickMult);
      sector = pick(losers);
      nearMiss = false;
    }
  }

  const extraTurns = 6 + Math.floor(Math.random() * 3);
  const jitter = (Math.random() - 0.5) * SLICE * (nearMiss ? 0.18 : 0.42);
  const sectorCenter = sector.index * SLICE + SLICE / 2 + jitter;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const targetMod = (360 - sectorCenter + 360) % 360;
  let delta = targetMod - currentMod;
  if (delta < 0) delta += 360;
  const targetRotation = currentRotation + extraTurns * 360 + delta;

  return { sector, won, payout: 0, nearMiss, extraTurns, targetRotation };
}

export function durationForSpin(extraTurns: number) {
  return 4.6 + extraTurns * 0.22 + Math.random() * 0.45;
}
