import { SECTORS, SLICE } from '../../data/constants';
import type { Sector } from '../../types/game';

const CX = 200;
const CY = 200;
const R_OUT = 176;
const R_IN = 52;

function polar(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function slicePath(start: number, end: number) {
  const a = polar(CX, CY, R_OUT, start);
  const b = polar(CX, CY, R_OUT, end);
  const c = polar(CX, CY, R_IN, end);
  const d = polar(CX, CY, R_IN, start);
  return `M ${a.x} ${a.y} A ${R_OUT} ${R_OUT} 0 0 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${R_IN} ${R_IN} 0 0 0 ${d.x} ${d.y} Z`;
}

function SectorLabel({ sector }: { sector: Sector }) {
  const mid = sector.index * SLICE + SLICE / 2;
  const p = polar(CX, CY, 118, mid);
  const isGold = sector.kind === 25;
  return (
    <g transform={`translate(${p.x}, ${p.y}) rotate(${mid})`}>
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isGold ? '#ffe680' : sector.kind === 'lose' ? '#ff8aa8' : '#ffffff'}
        fontFamily="Orbitron, sans-serif"
        fontSize={isGold ? 16 : 13}
        fontWeight={800}
        style={{
          filter: `drop-shadow(0 0 6px ${sector.glow})`,
          letterSpacing: '0.04em',
        }}
      >
        {sector.label}
      </text>
    </g>
  );
}

export function WheelDisc() {
  const leds = Array.from({ length: 32 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full">
      <defs>
        <radialGradient id="hub" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#3b2066" />
          <stop offset="100%" stopColor="#12081f" />
        </radialGradient>
        <radialGradient id="rim" cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor="#1a0a2e" />
          <stop offset="92%" stopColor="#ffd60a" />
          <stop offset="100%" stopColor="#7a4b00" />
        </radialGradient>
      </defs>
      <circle cx={CX} cy={CY} r={192} fill="url(#rim)" />
      {SECTORS.map((s) => {
        const start = s.index * SLICE;
        const end = start + SLICE;
        return (
          <path
            key={s.index}
            d={slicePath(start, end)}
            fill={s.color}
            stroke={s.glow}
            strokeOpacity={0.55}
            strokeWidth={1.4}
          />
        );
      })}
      {SECTORS.map((s) => (
        <SectorLabel key={`l-${s.index}`} sector={s} />
      ))}
      {leds.map((i) => {
        const a = (i / leds.length) * 360;
        const p = polar(CX, CY, 186, a);
        return (
          <circle key={i} cx={p.x} cy={p.y} r={3.1} fill={i % 2 ? '#00f5ff' : '#ffd60a'} opacity={0.9} />
        );
      })}
      <circle cx={CX} cy={CY} r={50} fill="url(#hub)" stroke="#ffd60a" strokeWidth={3} />
      <circle cx={CX} cy={CY} r={38} fill="none" stroke="rgba(0,245,255,0.5)" strokeWidth={2} />
      <text
        x={CX}
        y={CY - 4}
        textAnchor="middle"
        fill="#ffd60a"
        fontFamily="Orbitron, sans-serif"
        fontSize="13"
        fontWeight={800}
      >
        SPIN
      </text>
      <text
        x={CX}
        y={CY + 14}
        textAnchor="middle"
        fill="#00f5ff"
        fontFamily="Orbitron, sans-serif"
        fontSize="8"
        letterSpacing="0.28em"
      >
        MANIA
      </text>
    </svg>
  );
}
