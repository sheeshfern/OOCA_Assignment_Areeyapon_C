import { calm } from './motion';

// Mooca's eyes follow a finger or the mouse, and glance about on their own when nobody is pointing
export function startEyes() {
  let at = 0;
  const mo = () => document.querySelector<HTMLElement>('.hero .mo');
  const look = (x: number, y: number) => {
    const el = mo(); if (!el) return;
    const r = el.getBoundingClientRect();
    let dx = (x - (r.left + r.width * 0.55)) / 220, dy = (y - (r.top + r.height * 0.34)) / 220;
    const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; }
    el.style.setProperty('--ex', dx.toFixed(2)); el.style.setProperty('--ey', dy.toFixed(2));
  };
  const on = (e: PointerEvent) => { at = performance.now(); look(e.clientX, e.clientY); };
  addEventListener('pointermove', on, { passive: true });
  addEventListener('pointerdown', on, { passive: true });
  const t = window.setInterval(() => {
    if (calm() || performance.now() - at < 3200) return;
    const el = mo(); if (!el) return;
    const c = Math.random() < 0.35, a = Math.random() * 6.28;
    el.style.setProperty('--ex', c ? '0' : Math.cos(a).toFixed(2)); el.style.setProperty('--ey', c ? '0' : (Math.sin(a) * 0.7).toFixed(2));
  }, 2600);
  return () => { removeEventListener('pointermove', on); removeEventListener('pointerdown', on); clearInterval(t); };
}
