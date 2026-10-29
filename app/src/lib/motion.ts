// Small DOM motion helpers. They only add classes React doesn't own, so re-renders leave them alone.

export const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Restart a one-shot CSS animation class on an element (works even if it already has it). */
export function replay(el: Element | null | undefined, cls: string) {
  if (!el) return;
  el.classList.remove(cls);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(cls);
}

// idle loops follow the clock, so an image that appears mid-way doesn't jump back to frame 0
export function syncFloat(root: ParentNode) {
  const t = performance.now();
  root.querySelectorAll<HTMLElement>('.float').forEach(el => {
    const d = parseFloat(getComputedStyle(el).animationDuration) * 1000 || 4000;
    el.style.animationDelay = `-${Math.round(t % d)}ms`;
  });
}

// choices rise in one after another once Mooca has spoken
export function stagger(screen: HTMLElement) {
  const els = [
    ...screen.querySelectorAll<HTMLElement>(':scope > :not(.top,.guide,.hero,.grow,.tones,.words,.opts,.card.main), .tone, .word, .opt'),
  ];
  els.forEach((el, i) => { el.classList.add('rise'); el.style.setProperty('--i', String(Math.min(i, 12))); });
}

// the start button grows into a circle that fills the app frame (not the whole page), then the next screen shows through
export function burst(btn: HTMLElement, e: { clientX: number; clientY: number }, app: HTMLElement, next: () => void) {
  if (calm()) return next();
  if (btn.dataset.busy) return;
  btn.dataset.busy = '1';
  const a = app.getBoundingClientRect(), r = btn.getBoundingClientRect();
  const left = Math.max(a.left, 0), top = Math.max(a.top, 0);
  const w = Math.min(a.right, innerWidth) - left, h = Math.min(a.bottom, innerHeight) - top;
  const x = (e.clientX || r.left + r.width / 2) - left, y = (e.clientY || r.top + r.height / 2) - top;
  const R = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
  const clip = document.createElement('div');
  clip.className = 'burst-clip';
  clip.style.cssText = `left:${left}px;top:${top}px;width:${w}px;height:${h}px;border-radius:${getComputedStyle(app).borderRadius}`;
  const c = document.createElement('div');
  c.className = 'burst';
  c.style.cssText = `left:${x - R}px;top:${y - R}px;width:${2 * R}px;height:${2 * R}px`;
  clip.appendChild(c);
  document.body.appendChild(clip);
  c.addEventListener('animationend', () => { next(); clip.classList.add('out'); setTimeout(() => clip.remove(), 400); }, { once: true });
}

// a single soft "ding": one bell strike that fades out, never a repeating alarm
export function chime() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new AC(), t = ac.currentTime;
    ([[1318.5, 0.07], [2637, 0.018]] as const).forEach(([f, v]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.95);
    });
    setTimeout(() => ac.close(), 1300);
  } catch { /* no audio, the clock still shakes */ }
  if (navigator.vibrate) navigator.vibrate(60);
}
