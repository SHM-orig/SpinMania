import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
}

export function WheelSparks({ active, tense }: { active: boolean; tense: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const particles: Particle[] = [];
    const colors = ['#00f5ff', '#ff2bd6', '#ffd60a', '#b14aff', '#ffffff'];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * devicePixelRatio;
      canvas.height = r.height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      if (active) {
        const n = tense ? 7 : 3;
        for (let i = 0; i < n; i += 1) {
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.min(w, h) * 0.42;
          particles.push({
            x: w / 2 + Math.cos(ang) * rad,
            y: h / 2 + Math.sin(ang) * rad,
            vx: Math.cos(ang) * (1.2 + Math.random() * 2.4),
            vy: Math.sin(ang) * (1.2 + Math.random() * 2.4) - 0.4,
            life: 1,
            max: 18 + Math.random() * 16,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: tense ? 2.4 : 1.6,
          });
        }
      }
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.life -= 1 / p.max;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, tense]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
