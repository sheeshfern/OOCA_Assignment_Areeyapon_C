// Save the result card as an image. The card is drawn onto a canvas (not a DOM screenshot),
// so the keepsake looks the same on every device and color-mix() etc. don't get in the way.
import { NEUTRAL } from '../data/content';
import { IMG } from '../data/images';
import type { Copy } from '../data/ui';
import { moocaFor, resultData, type State } from '../state';
import { loc, stampOf } from './text';

const CARD_FONT = '"Gotham Rounded Latin", Prompt, sans-serif';
const cardFont = (weight: number, size: number) => `${weight} ${size}px ${CARD_FONT}`;

type Ctx = CanvasRenderingContext2D;
interface Run { t: string; f: string; c: string }
interface Line { runs: (Run & { w: number })[]; w: number }

const loadImg = (src: string) => new Promise<HTMLImageElement>((ok, no) => {
  const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src;
});
const mixHex = (a: string, b: string, p: number) => {
  const h = (s: string) => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const x = h(a), y = h(b);
  return `rgb(${x.map((v, i) => Math.round(v * p + y[i] * (1 - p))).join(',')})`;
};
function roundRect(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath(); c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

// styled runs → lines no wider than w. Like <Ph> on screen, lines break at the spaces between
// Thai phrases; only a phrase wider than the whole line is split, and then between words (Intl.Segmenter)
function wrapRuns(m: Ctx, runs: Run[], w: number, lang: string): Line[] {
  const seg = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(lang, { granularity: 'word' }) : null;
  const lines: (Run & { w: number })[][] = [[]];
  let x = 0;
  const add = (t: string, r: Run) => {
    m.font = r.f; const tw = m.measureText(t).width;
    const cur = () => lines[lines.length - 1];
    if (!t.trim()) { if (cur().length) { cur().push({ ...r, t, w: tw }); x += tw; } return; }
    if (x + tw > w && x > 0) { lines.push([]); x = 0; }
    if (tw > w && seg && t.length > 1) { [...seg.segment(t)].forEach(p => add(p.segment, r)); return; }
    cur().push({ ...r, t, w: tw }); x += tw;
  };
  for (const r of runs) r.t.split(/( +)/).filter(Boolean).forEach(t => add(t, r));
  return lines
    .map(l => { while (l.length && !l[l.length - 1].t.trim()) l.pop(); return { runs: l, w: l.reduce((a, r) => a + r.w, 0) }; })
    .filter(l => l.runs.length);
}

// lays the card out once (measuring), returning its size and a draw(ctx) that paints it at 1x units
async function buildCardImage(s: State, L: Copy, withImages: boolean) {
  const r = resultData(s), neutral = r.main === NEUTRAL, good = r.lv === 0;
  const Z = (s.picks.length && (s.picks[0].tone || s.tone)) || { zone: '#1F77DF', ink: '#0A47CA', bg: '#E4EFFB' };
  const TEXT = '#355956', TEXT2 = '#3F6866';
  await Promise.all([400, 500, 600].map(w => document.fonts.load(cardFont(w, 20), 'กขA1')));
  const [mooca, logo] = withImages
    ? await Promise.all([moocaFor(s, good ? IMG.happy : IMG.thanks), IMG.logo].map(src => loadImg(src).catch(() => null)))
    : [null, null];
  const m = document.createElement('canvas').getContext('2d')!;
  const W = 540, P = 28, IP = 30, X = P + IP, IW = W - 2 * (P + IP);
  // header row (brand left, app name right) sits above the card
  const headY = P, cardTop = P + 24 + 18;
  const ops: ((c: Ctx) => void)[] = [];
  let y = cardTop + IP;
  const lines = (runs: Run[], w = IW) => wrapRuns(m, runs, w, s.lang);
  // queue lines of text at the current y, centred or left, then move y past them
  const put = (ls: Line[], x: number, lh: number, align: 'left' | 'center' = 'left', w = IW) => {
    ls.forEach((l, i) => {
      let xx = align === 'center' ? x + (w - l.w) / 2 : x;
      const yy = y + lh / 2 + i * lh;
      l.runs.forEach(rn => { const at = xx; ops.push(c => { c.font = rn.f; c.fillStyle = rn.c; c.fillText(rn.t, at, yy); }); xx += rn.w; });
    });
    y += ls.length * lh;
  };

  // date chip
  const [day, time] = stampOf(s.at ?? Date.now(), s.lang), when = `${day} · ${time}`;
  m.font = cardFont(500, 15);
  const chipW = m.measureText(when).width + 50, chipX = (W - chipW) / 2, chipY = y;
  ops.push(c => {
    c.fillStyle = '#DBF0EE'; roundRect(c, chipX, chipY, chipW, 34, 17); c.fill();
    c.strokeStyle = '#009688'; c.lineWidth = 1.6; roundRect(c, chipX + 15, chipY + 10, 15, 15, 3); c.stroke();
    c.beginPath(); c.moveTo(chipX + 15, chipY + 15.5); c.lineTo(chipX + 30, chipY + 15.5);
    c.moveTo(chipX + 19, chipY + 8); c.lineTo(chipX + 19, chipY + 12); c.moveTo(chipX + 26, chipY + 8); c.lineTo(chipX + 26, chipY + 12); c.stroke();
    c.font = cardFont(500, 15); c.fillStyle = TEXT; c.fillText(when, chipX + 38, chipY + 18);
  });
  y += 34 + 20;

  // the feeling, highlighted like on screen
  put(lines([{ t: neutral ? L.nowLb : L.feelLb, f: cardFont(600, 15), c: Z.ink }]), X, 22, 'center');
  y += 2;
  const big = r.picks.length > 1 || neutral ? 36 : 46, nlh = Math.round(big * 1.3);
  const nls = lines([{ t: r.picks.map(p => loc(p, s.lang).w).join(L.and), f: cardFont(600, big), c: Z.ink }]);
  nls.forEach((l, i) => {
    const hx = X + (IW - l.w) / 2 - 6, hy = y + i * nlh + nlh * 0.56;
    ops.push(c => { c.fillStyle = Z.bg; roundRect(c, hx, hy, l.w + 12, big * 0.42, 4); c.fill(); });
  });
  put(nls, X, nlh, 'center');

  // Mooca in the middle
  y += 10;
  if (mooca) {
    const bw = 180, bh = 140, sc = Math.min(bw / mooca.naturalWidth, bh / mooca.naturalHeight);
    const dw = mooca.naturalWidth * sc, dh = mooca.naturalHeight * sc, mx = (W - dw) / 2, my = y + bh - dh;
    ops.push(c => c.drawImage(mooca, mx, my, dw, dh));
    if (good) ([[-102, 18, 20], [96, 34, 15], [-84, 116, 13]] as const).forEach(([dx, dy, sz]) => {
      const sy = y + dy;
      ops.push(c => { c.font = `${sz}px sans-serif`; c.fillStyle = Z.zone; c.fillText('✦', W / 2 + dx, sy); });
    });
    y += bh;
  }

  // what Mooca says, in a bubble pointing up at it
  y += 16;
  const bubTop = y, bp = 20, bubFill = mixHex(Z.bg, '#FFFFFF', 0.7), bubAt = ops.length;
  y += bp;
  put(lines([{ t: neutral ? L.okLb : L.causeLb, f: cardFont(600, 14), c: Z.ink }], IW - 2 * bp), X + bp, 22, 'left', IW - 2 * bp);
  y += 2;
  const main = loc(r.main, s.lang);
  const body: Run[] = neutral
    ? [{ t: loc(NEUTRAL, s.lang).m, f: cardFont(400, 18), c: TEXT }]
    : [...(r.ctx ? [{ t: `${r.ctx} `, f: cardFont(600, 18), c: TEXT }] : []), { t: r.cause || main.m, f: cardFont(400, 18), c: TEXT }];
  put(lines(body, IW - 2 * bp), X + bp, 30, 'left', IW - 2 * bp);
  if (!neutral && r.since) { y += 2; put(lines([{ t: r.since, f: cardFont(400, 16), c: TEXT2 }], IW - 2 * bp), X + bp, 26, 'left', IW - 2 * bp); }
  y += bp;
  const bubH = y - bubTop;
  ops.splice(bubAt, 0, c => {
    c.fillStyle = bubFill;
    c.save(); c.translate(W / 2, bubTop); c.rotate(Math.PI / 4); roundRect(c, -10, -10, 20, 20, 3); c.fill(); c.restore();
    roundRect(c, X, bubTop, IW, bubH, 22); c.fill();
  });

  // the 30-second writing prompt, and the note if one was written
  y += 26;
  const divY = y;
  ops.push(c => { c.fillStyle = '#E6EEF0'; c.fillRect(X, divY, IW, 1); });
  y += 22;
  put(lines([{ t: L.writeLb, f: cardFont(600, 14), c: Z.ink }]), X, 22);
  y += 2;
  put(lines([{ t: main.a ?? '', f: cardFont(400, 18), c: TEXT }]), X, 30);
  const note = s.note.trim();
  if (note) {
    y += 12;
    const nTop = y, np = 16, noteAt = ops.length;
    y += np;
    const nls2 = note.split('\n')
      .flatMap(p => (p.trim() ? lines([{ t: p, f: cardFont(400, 17), c: TEXT }], IW - 2 * np) : [{ runs: [], w: 0 }]))
      .slice(0, 10);
    put(nls2, X + np, 28, 'left', IW - 2 * np);
    y += np;
    const nH = y - nTop;
    ops.splice(noteAt, 0, c => { c.fillStyle = '#DBF0EE'; roundRect(c, X, nTop, IW, nH, 14); c.fill(); });
  }
  y += IP;
  const cardH = y - cardTop;
  y += P;
  const H = Math.ceil(y);

  return {
    W, H,
    draw(c: Ctx) {
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, Z.bg); g.addColorStop(1, mixHex(Z.bg, '#FFFFFF', 0.35));
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.textBaseline = 'middle';
      if (logo) c.drawImage(logo, P + 4, headY, (24 * logo.naturalWidth) / logo.naturalHeight, 24);
      c.font = cardFont(500, 13); c.fillStyle = TEXT2; c.textAlign = 'right'; c.fillText(L.title, W - P - 4, headY + 12); c.textAlign = 'left';
      c.save(); c.shadowColor = 'rgba(31,119,223,.12)'; c.shadowBlur = 28; c.shadowOffsetY = 8; c.fillStyle = '#FFFFFF';
      roundRect(c, P, cardTop, W - 2 * P, cardH, 28); c.fill(); c.restore();
      ops.forEach(op => op(c));
    },
  };
}

export async function cardCanvas(s: State, L: Copy): Promise<HTMLCanvasElement> {
  for (const withImages of [true, false]) {
    const card = await buildCardImage(s, L, withImages), cv = document.createElement('canvas'), c = cv.getContext('2d')!;
    cv.width = card.W * 2; cv.height = card.H * 2; c.scale(2, 2); card.draw(c);
    // images opened straight from disk (file://) taint the canvas; then the card is redrawn without them
    try { cv.toDataURL('image/png', 0); return cv; } catch (e) { if (!withImages) throw e; }
  }
  throw new Error('no card image');
}

export interface CardImage {
  /** data: URL for the preview (press-and-hold "Save image" works with data: in every phone browser) */
  url: string;
  file: File;
}

/** The card as a PNG file, made before the save sheet opens so the share call can run straight from a tap (iOS needs that). */
export async function makeCardImage(s: State, L: Copy): Promise<CardImage> {
  const cv = await cardCanvas(s, L);
  const blob = await new Promise<Blob>((ok, no) => cv.toBlob(b => (b ? ok(b) : no(new Error('no image'))), 'image/png'));
  const d = new Date(s.at ?? Date.now()), two = (n: number) => String(n).padStart(2, '0');
  const name = `mooca-card-${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}-${two(d.getHours())}${two(d.getMinutes())}.png`;
  return { url: cv.toDataURL('image/png'), file: new File([blob], name, { type: 'image/png' }) };
}

export const touchDevice = () => matchMedia('(pointer:coarse)').matches;
export const canShareFile = (f: File) => touchDevice() && !!navigator.canShare?.({ files: [f] });

/** Phones get the share sheet (it has "Save Image"); everything else downloads the PNG. */
export async function saveCardFile(f: File): Promise<'shared' | 'downloaded' | 'cancelled'> {
  if (canShareFile(f)) {
    try { await navigator.share({ files: [f] }); return 'shared'; }
    catch (e) { if ((e as Error).name === 'AbortError') return 'cancelled'; } // a refused share falls through to a plain download
  }
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(f), download: f.name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'downloaded';
}
