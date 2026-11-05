// word clouds: one drawn cloud behind each word, and the word's visible length (Thai vowel and tone marks take no width) so long words shrink to fit
export const Cloud = () => (
  <svg className="cl" viewBox="8 8 106 80" preserveAspectRatio="none" aria-hidden="true">
    <path d="M28 84A16 16 0 0 1 14 60A18 18 0 0 1 32 36A22 22 0 0 1 64 22A20 20 0 0 1 98 36A16 16 0 0 1 108 66A16 16 0 0 1 94 84Z" />
  </svg>
);

export const visLen = (w: string) => w.replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, '').length;

export const fitN = (w: string) => {
  const n = visLen(w);
  return n > 12 ? Math.ceil(n / 1.8) : Math.max(n, 4);
};
