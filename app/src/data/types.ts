export type Lang = 'th' | 'en';
export type ToneId = 'yellow' | 'green' | 'orange' | 'blue';

/** A feeling word. `m` meaning, `c` likely cause, `a` 30-second writing prompt, `lv` support level. */
export interface Word {
  w: string;
  m: string;
  c?: string;
  a?: string;
  lv?: number;
  risk?: boolean;
  en?: Partial<Pick<Word, 'w' | 'm' | 'c' | 'a'>>;
}

/** A word as picked: it remembers which tone it came from. */
export interface PickedWord extends Word {
  tone: Tone;
}

export interface Tone {
  id: ToneId;
  label: string;
  eg: string;
  reply: string;
  zone: string;
  solid: string;
  bg: string;
  ink: string;
  line: string;
  img: string;
  en: { label: string; eg: string; reply: string };
  words: Word[];
  more: Word[];
}

export interface Option {
  id: string;
  label: string;
  say: string | null;
  en: { label: string; say?: string };
}

export interface Duration extends Option {
  floor: number;
}
