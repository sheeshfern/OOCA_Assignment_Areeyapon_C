// language fit check: every word chip (picked), result heading, note prompt lines, and every Mooca bubble line, in the current language
window.ECHK = async () => {
  const st = Object.assign(document.createElement('style'), {textContent: '*,*::before,*::after{animation:none!important;transition:none!important}'});
  document.head.appendChild(st);
  const wait = () => new Promise(r => setTimeout(r, 60));
  const go2 = async s => { Object.assign(S, {history: ['home'], note: '', noteUp: false, showAll: false}, s); shown = null; render(); await wait(); };
  const over = el => el && el.scrollWidth > el.clientWidth + 1;
  const bad = [];
  const bubble = tag => { const b = app.querySelector('.bubble'); if (!b) return; const cs = getComputedStyle(b); const w = b.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    b.querySelectorAll('h1 .nw, h1, p[data-swap="sub"]').forEach(e => { const ww = e.getBoundingClientRect().width; if (e.matches('.q-wrap h1')) return; if (ww > w + 1) bad.push(`${tag} bubble "${e.textContent}" ${Math.round(ww)}>${Math.round(w)}`); }); };
  let lines = 0, lineWord = '';
  for (const t of TONES) {
    await go2({screen: 'tone', tone: t, picks: []}); bubble('tone ' + t.id);
    for (const x of [...t.words, ...t.more]) {
      const p = {...x, tone: t};
      await go2({screen: 'words', tone: t, picks: x.risk ? [] : [p]}); bubble('words');
      const chip = app.querySelector(`.word[data-w="${CSS.escape(x.w)}"]`);
      if (over(chip)) bad.push(`chip "${chip.textContent}" ${chip.scrollWidth}>${chip.clientWidth}`);
      if (x.risk) continue;
      await go2({screen: 'result', tone: t, picks: [p], ctx: 'work', dur: 'week'});
      const n = app.querySelector('.name'); if (over(n) || n.scrollWidth > n.parentElement.clientWidth + 1) bad.push(`name "${n.textContent}" ${n.scrollWidth}>${n.clientWidth}`);
      if (document.documentElement.scrollWidth > innerWidth) bad.push(`sideways scroll on result "${n.textContent}"`);
      openNote(loc(p).a); await wait();
      const q = document.getElementById('note-q'); const lh = parseFloat(getComputedStyle(q).lineHeight); const ln = Math.round(q.getBoundingClientRect().height / lh);
      if (ln > lines) { lines = ln; lineWord = loc(p).a; }
      if (ln > 3) bad.push(`note prompt ${ln} lines "${loc(p).a}"`);
      clearInterval(noteTimer); noteTimer = null; if (noteDlg.open) noteDlg.close();
    }
  }
  const w = {...TONES[2].words[0], tone: TONES[2]}, g = {...TONES[0].words[0], tone: TONES[0]};
  for (const sub of [null, ...['work', 'unsure']]) { await go2({screen: 'ctx', tone: TONES[2], picks: [w], ctx: sub}); bubble('ctx ' + sub); }
  for (const pick of [w, g]) for (const d of [null, 'today', 'week', 'long', 'unsure']) { await go2({screen: 'dur', tone: pick.tone, picks: [pick], ctx: 'people', dur: d}); bubble(`dur ${pick.lv} ${d}`);
    const h = app.querySelector('.bubble h1'); if (h && h.closest('.q-wrap')) h.querySelectorAll('.nw').forEach(s => { if (s.getBoundingClientRect().right > h.getBoundingClientRect().right + 1) bad.push(`qGood line "${s.textContent}" overflows`); }); }
  await go2({screen: 'tone', tone: null, picks: []}); bubble('tone none');
  await go2({screen: 'words', tone: TONES[0], picks: []}); bubble('words none');
  await go2({screen: 'home', tone: null, picks: []});
  const tp = app.querySelector('.top'); if (tp.scrollWidth > tp.clientWidth + 1) bad.push(`home top bar ${tp.scrollWidth}>${tp.clientWidth}`);
  const sub = app.querySelector('.home .sub'); if (over(sub)) bad.push(`home sub ${sub.scrollWidth}>${sub.clientWidth}`);
  st.remove();
  return {size: `${innerWidth}x${innerHeight}`, lang: S.lang, maxNoteLines: lines, longestPrompt: lineWord, bad};
};
