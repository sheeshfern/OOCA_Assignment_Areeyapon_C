// clipping / overlap / overflow audit for the ooca app; run in the page, returns findings per state
window.AUD = () => {
  const st = document.getElementById('aud-style') || Object.assign(document.createElement('style'), {id:'aud-style'});
  st.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
  document.head.appendChild(st);
  const c = s => { const e = document.querySelector(s); if (!e) throw new Error('missing ' + s); e.click(); };
  const W = () => [...document.querySelectorAll('[data-act=word]')];
  const name = e => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '') + (e.dataset.id ? `[${e.dataset.id}]` : '');
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0; };
  const findings = new Set();
  const check = (state) => {
    const root = document.getElementById('app');
    const all = [...root.querySelectorAll('*')].filter(e => !e.closest('svg') || e.tagName === 'svg').filter(vis);
    for (const e of all) {
      const cs = getComputedStyle(e);
      // 1. a box that hides part of its own content
      const clips = /hidden|clip|auto|scroll/.test(cs.overflowX + cs.overflowY);
      if (clips && e !== root) {
        // a box may never cut its content vertically; the tag row fades out sideways on purpose
        if (e.scrollHeight > e.clientHeight + 1) findings.add(`${state} | clipped-v ${name(e)} ${e.scrollHeight}>${e.clientHeight}`);
        if (e.scrollWidth > e.clientWidth + 1 && !e.classList.contains('tags')) findings.add(`${state} | clipped-h ${name(e)} ${e.scrollWidth}>${e.clientWidth}`);
        // children that stick out of a clipping box vertically (scrollHeight misses shrunk flex items)
        for (const k of e.children) { const a = e.getBoundingClientRect(), r = k.getBoundingClientRect(); if (r.height && (r.bottom > a.bottom + 1 || r.top < a.top - 1) && !/absolute|fixed|sticky/.test(getComputedStyle(k).position)) findings.add(`${state} | child-cut-v ${name(k)} in ${name(e)}`); }
      }
      // a flex item squeezed shorter than its own content
      if (e.parentElement && /flex|grid/.test(getComputedStyle(e.parentElement).display) && e !== root && e.tagName !== 'svg' && e.tagName !== 'IMG') {
        const box = e.getBoundingClientRect(); let bottom = -1e9, top = 1e9;
        for (const k of e.children) { if (/absolute|fixed|sticky/.test(getComputedStyle(k).position) || k.classList.contains('dots')) continue; const r = k.getBoundingClientRect(); if (r.height) { bottom = Math.max(bottom, r.bottom); top = Math.min(top, r.top); } }
        for (const n of e.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { const rg = document.createRange(); rg.selectNodeContents(n); for (const r of rg.getClientRects()) { bottom = Math.max(bottom, r.bottom); top = Math.min(top, r.top); } }
        if ((bottom > box.bottom + 4 || top < box.top - 4) && !e.matches('.fine,.mooca')) findings.add(`${state} | squeezed ${name(e)} content ${Math.round(top)}–${Math.round(bottom)} box ${Math.round(box.top)}–${Math.round(box.bottom)}`);
      }
      // 2. one-line text that does not fit its box
      if (cs.whiteSpace === 'nowrap' && e.scrollWidth > e.clientWidth + 1 && !e.closest('.tags')) findings.add(`${state} | nowrap-overflow ${name(e)} "${e.textContent.trim().slice(0,30)}"`);
      // 3. content sticking out past a clipping ancestor
      const anc = e.parentElement && e.parentElement.closest('.bubble,.tone,.opt,.word,.card,.meaning,.primary,.soft-btn,.timer,.say,.tag');
      if (anc && anc !== e) {
        const a = anc.getBoundingClientRect(), r = e.getBoundingClientRect();
        const ac = getComputedStyle(anc);
        if (/hidden|clip/.test(ac.overflowX + ac.overflowY) && (r.right > a.right + 1 || r.left < a.left - 1 || r.bottom > a.bottom + 1 || r.top < a.top - 1) && !e.closest('.tags'))
          findings.add(`${state} | cut-by-parent ${name(e)} in ${name(anc)}`);
      }
    }
    // 4. siblings in normal flow overlapping each other
    for (const p of all) {
      if (p.tagName === 'svg') continue;
      const kids = [...p.children].filter(k => vis(k) && !/absolute|fixed/.test(getComputedStyle(k).position) && !k.classList.contains('dots') && getComputedStyle(k).position !== 'sticky');
      for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
        const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect();
        const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (getComputedStyle(kids[i]).display === 'inline' && getComputedStyle(kids[j]).display === 'inline' && oy <= 6) continue; // wrapped lines of text: tall Thai glyphs share a few px of line box
        if (ox > 2 && oy > 2) findings.add(`${state} | overlap ${name(kids[i])} x ${name(kids[j])} (${Math.round(ox)}x${Math.round(oy)})`);
      }
    }
    // 4b. tap targets that overlap each other (a tap could hit the wrong one)
    const taps = all.filter(e => /^(A|BUTTON)$/.test(e.tagName));
    for (let i = 0; i < taps.length; i++) for (let j = i + 1; j < taps.length; j++) {
      if (taps[i].contains(taps[j]) || taps[j].contains(taps[i])) continue;
      if (taps[i].closest('.actions') !== taps[j].closest('.actions')) continue; // content scrolling under the sticky bar is checked at full scroll below
      const a = taps[i].getBoundingClientRect(), b = taps[j].getBoundingClientRect();
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 1 && oy > 1) findings.add(`${state} | tap-overlap ${name(taps[i])} x ${name(taps[j])} (${Math.round(ox)}x${Math.round(oy)})`);
    }
    // 4c. Mooca drawing over the speech bubble
    const gi = root.querySelector('.guide img'), gb = root.querySelector('.guide .bubble');
    if (gi && gb) { const a = gi.getBoundingClientRect(), b = gb.getBoundingClientRect(); const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 6 && oy > 6) findings.add(`${state} | mooca-over-bubble ${Math.round(ox)}x${Math.round(oy)}`); }
    // 4d. scrolled all the way down, nothing may stay hidden under the sticky action bar
    const act = root.querySelector('.screen .actions');
    if (act) {
      const sc = root.scrollHeight > root.clientHeight + 1 ? root : document.scrollingElement;
      const keep = sc.scrollTop; sc.scrollTop = 1e6;
      const barTop = act.getBoundingClientRect().top + 20; // the bar's first 20px are a fade
      for (const e of all) { if (e.closest('.actions') || !/^(A|BUTTON|P|H1|DIV)$/.test(e.tagName) || e.children.length > 3) continue; const r = e.getBoundingClientRect(); if (r.bottom > barTop + 1 && r.top < barTop && (e.tagName === 'BUTTON' || e.tagName === 'A')) findings.add(`${state} | hidden-under-bar-at-full-scroll ${name(e)}`); }
      sc.scrollTop = keep;
    }
    // 5. sideways page scroll
    if (document.documentElement.scrollWidth > innerWidth + 1) findings.add(`${state} | page-wider-than-screen ${document.documentElement.scrollWidth}>${innerWidth}`);
    // 6. text clipped by the visible frame horizontally
    const fr = root.getBoundingClientRect();
    for (const e of all) { if (e.closest('.tags') || e.closest('svg')) continue; const r = e.getBoundingClientRect(); if (e.children.length === 0 && e.textContent.trim() && (r.right > fr.right + 1 || r.left < fr.left - 1)) findings.add(`${state} | outside-frame ${name(e)} "${e.textContent.trim().slice(0,20)}"`); }
  };
  const flows = [];
  check('home');
  for (const tone of ['yellow','green','orange','blue']) {
    go('tone'); check('tone-0'); c(`[data-id=${tone}]`); check('tone-' + tone);
    c('[data-act=toWords]'); check(`words-${tone}-0`);
    // risk words are matched by their Thai key (data-w), so this works in either language
    const safe = W().filter(b => !/สิ้นหวัง|ไม่อยากไปต่อ/.test(b.dataset.w));
    const longest = [...safe].sort((a, b) => b.textContent.length - a.textContent.length);
    longest[0].click(); check(`words-${tone}-1`); longest[1].click(); check(`words-${tone}-2`);
    c('[data-act=toCtx]'); check(`ctx-${tone}-0`);
    for (const id of ['work','money','unsure']) { c(`[data-id=${id}]`); check(`ctx-${tone}-${id}`); }
    c('[data-id=work]'); c('[data-act=toDur]'); check(`dur-${tone}-0`);
    for (const id of ['today','long','unsure']) { c(`[data-id=${id}]`); check(`dur-${tone}-${id}`); }
    c('[data-act=toResult]'); check(`result-${tone}-long`);
    const t = document.querySelector('[data-act=timer]'); if (t) { t.click(); check(`result-${tone}-timer`); }
  }
  go('tone'); c('[data-act=all]'); check('words-all'); W()[0].click(); W()[W().length - 1].click(); check('words-all-2');
  go('tone'); c('[data-id=blue]'); c('[data-act=toWords]'); c('[data-act=neutral]'); check('result-neutral');
  go('tone'); c('[data-id=blue]'); c('[data-act=toWords]'); W().find(b => /สิ้นหวัง/.test(b.dataset.w)).click(); check('safety');
  go('tone'); c('[data-id=yellow]'); c('[data-act=toWords]'); W()[0].click(); c('[data-act=toCtx]'); c('[data-act=skipCtx]'); c('[data-act=skipDur]'); check('result-good');
  restart(); st.remove();
  return `${innerWidth}x${innerHeight}: ${findings.size ? '\n' + [...findings].join('\n') : 'clean'}`;
};
