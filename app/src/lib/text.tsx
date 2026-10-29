import { Fragment } from 'react';
import type { Lang } from '../data/types';

/**
 * Thai sentences: wraps each space-separated phrase in an inline-block so lines break at the spaces,
 * not mid-word (Chrome ignores word-break:keep-all for Thai). Numbers stay with the next word ("2 สัปดาห์").
 */
export function Ph({ text }: { text: string }) {
  const parts = text.replace(/(\d[\d–]*) /g, '$1 ').split(' ');
  return (
    <>
      {parts.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="ph">{w}</span>
        </Fragment>
      ))}
    </>
  );
}

/** The same item in the page's language (Thai is the base text, `en` overrides it). */
export function loc<T extends { en?: object }>(x: T, lang: Lang): T {
  return lang === 'en' && x.en ? { ...x, ...x.en } : x;
}

/**
 * When a card was made, in the page's language: ["พฤหัสบดี 29 ต.ค. 2569", "14:32 น."] / ["Thu, Oct 29, 2026", "2:32 PM"].
 * Thai drops the "วัน…ที่" wrapper around the weekday so the longest day still fits one line at 320px.
 */
export function stampOf(t: number, lang: Lang): [string, string] {
  const d = new Date(t), en = lang === 'en', locale = en ? 'en-US' : 'th-TH';
  const day = en
    ? d.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
        .formatToParts(d)
        .filter(p => p.type !== 'literal')
        .map(p => (p.type === 'weekday' ? p.value.replace(/^วัน/, '') : p.value))
        .join(' ');
  return [day, d.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' }) + (en ? '' : ' น.')];
}
