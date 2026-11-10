import { useEffect, useRef } from 'react';
/** BINAFSI atmospheric field: original artwork, bounded draw cost, reduced-motion aware. */
export default function LivingAtmosphere({ mode = 'landing' }: { mode?: 'landing' | 'access' | 'workspace' }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const ctx = element.getContext('2d', { alpha: false });
    if (!ctx) return;
    const parent = element.parentElement;
    if (!parent) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, raf = 0, active = true, last = 0, frame = 0;
    let targetX = 0, targetY = 0, xShift = 0, yShift = 0;
    const points = Array.from({ length: mode === 'workspace' ? 28 : 50 }, (_, i) => ({
      u: (i * 0.61803398875) % 1,
      v: (i * 0.38196601125 + i * .033) % 1,
      phase: i * 2.399,
      size: .5 + (i % 8) / 9,
    }));
    const updateSize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width); height = Math.max(1, rect.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * ratio); element.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(updateSize);
    observer.observe(parent); updateSize();
    const move = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / Math.max(rect.width, 1) - .5) * 26;
      targetY = ((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 16;
    };
    const reset = () => { targetX = 0; targetY = 0; };
    parent.addEventListener('pointermove', move, { passive: true });
    parent.addEventListener('pointerleave', reset);
    const draw = (now: number) => {
      if (!active) return;
      if (document.hidden) { raf = requestAnimationFrame(draw); return; }
      if (last && now - last < 30 && !media.matches) { raf = requestAnimationFrame(draw); return; }
      last = now;
      const t = media.matches ? 1.1 : frame * .012;
      if (!media.matches) frame++;
      xShift += (targetX - xShift) * .04;
      yShift += (targetY - yShift) * .04;
      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, '#0a101e'); base.addColorStop(.55, '#292137'); base.addColorStop(1, '#101825');
      ctx.fillStyle = base; ctx.fillRect(0, 0, width, height);
      const cx = width * (mode === 'workspace' ? .65 : .79) + xShift;
      const cy = height * .46 + yShift;
      const r = Math.min(width * .45, height * .65);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.9);
      glow.addColorStop(0, 'rgba(213,134,167,.33)');
      glow.addColorStop(.43, 'rgba(133,105,176,.16)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
      ctx.save();ctx.translate(cx, cy);ctx.rotate(-.27 + Math.sin(t * .4) * .04);
      for (let k = 0; k < (mode === 'workspace' ? 28 : 54); k++) {
        const a = k / (mode === 'workspace' ? 28 : 54);
        ctx.beginPath();
        for (let j = 0; j <= 100; j++) {
          const q = j / 100 * Math.PI * 2;
          const ripple = Math.sin(q * 3 + t + a * 4) * .12 + Math.cos(q * 7 - t * .6 + a * 6) * .032;
          const rr = r * (.52 + a * .55 + ripple);
          const px = Math.cos(q + t * .08 + a * .27) * rr;
          const py = Math.sin(q - t * .09) * rr * (.68 + a * .07) + Math.sin(q * 4 + t + a * 12) * r * .035;
          if (!j) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = k % 2 ? `rgba(219,162,190,${.045 + a * .1})` : `rgba(152,186,222,${.04 + a * .08})`;
        ctx.lineWidth = k % 7 === 0 ? 1.2 : .7;
        ctx.stroke();
      }
      ctx.restore();
      const coords = points.map(p => ({
        x: width * (.38 + p.u * .6) + Math.sin(t * .7 + p.phase) * 6,
        y: height * (.04 + p.v * .90) + Math.cos(t * .65 + p.phase) * 5,
        size: p.size,
      }));
      for (let i = 0; i < coords.length; i++) {
        const p = coords[i]!;
        ctx.beginPath();ctx.arc(p.x, p.y, .5 + p.size, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 ? 'rgba(197,185,223,.35)' : 'rgba(245,184,203,.6)';ctx.fill();
      }
      if (!media.matches) raf = requestAnimationFrame(draw);
    };
    const change = () => { cancelAnimationFrame(raf); frame = 0; raf = requestAnimationFrame(draw); };
    media.addEventListener('change', change);
    raf = requestAnimationFrame(draw);
    return () => { active = false; cancelAnimationFrame(raf); observer.disconnect(); media.removeEventListener('change', change); parent.removeEventListener('pointermove', move);parent.removeEventListener('pointerleave', reset); };
  }, [mode]);
  return <canvas ref={canvas} className={`binafsi-atmosphere binafsi-atmosphere--${mode}`} aria-hidden="true" />;
}
