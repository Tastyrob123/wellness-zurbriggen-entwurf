/* «treten Sie ein» · vierte Runde (25.10.2026): 20 Fassungen, je ein eigener Effekt. Gemeinsam nur die Mechanik:
   --p (0…1) auf [data-pin] (angeheftete Bühne) und [data-s] (Durchlauf), .da beim Ankommen, Pfeiltasten blättern. Nur transform und opacity. */
const nav = document.querySelector('.vnr');
if (nav) addEventListener('keydown', (ev) => {
  if (ev.target.closest && ev.target.closest('[role=slider]')) return;
  const a = ev.key === 'ArrowLeft' ? nav.querySelector('[data-k=vor]') : ev.key === 'ArrowRight' ? nav.querySelector('[data-k=nach]') : null;
  if (a) location.href = a.href;
});
const S = document.querySelector('.h20');
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const maus = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = S) => r && r.querySelector(s);
const $$ = (s, r = S) => (r ? [...r.querySelectorAll(s)] : []);
const sichtbar = (el, an, aus) => new IntersectionObserver((es) => es.forEach((x) => (x.isIntersecting ? an() : aus()))).observe(el);

if (S) {
  [S, ...$$('[data-e]')].forEach((x) => sichtbar(x, () => x.classList.add('da'), () => {}));
  const ps = $$('[data-pin],[data-s]'), hooks = [], mess = [];
  let vh = innerHeight, offen = 0;
  const rechne = () => {
    offen = 0;
    ps.forEach((el) => {
      const r = el.getBoundingClientRect();
      let p = el.hasAttribute('data-pin') ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
      p = Math.max(0, Math.min(1, p));
      if (Math.abs(p - (el._p ?? -1)) > .0004) { el._p = p; el.style.setProperty('--p', p.toFixed(4)); }
    });
    hooks.forEach((h) => h());
  };
  addEventListener('scroll', () => { if (!offen) offen = requestAnimationFrame(rechne); }, { passive: true });
  addEventListener('resize', () => { vh = innerHeight; mess.forEach((m) => m()); rechne(); }, { passive: true });
  const pinP = (el) => (el.closest('[data-pin]') || {})._p || 0;

  /* 3 · Seitwärts durchs Haus */
  const spur = $('[data-spur]');
  if (spur) { let w = 0; const m = () => { w = spur.scrollWidth - spur.parentElement.offsetWidth; }; mess.push(m); m();
    hooks.push(() => { spur.style.transform = `translateX(${(-pinP(spur) * w).toFixed(1)}px)`; }); }

  /* 4 · Galerie mit Messingwisch */
  const gal = $('[data-galerie]');
  if (gal) {
    const bs = $$('.h04-b', gal), ks = $$('[data-zu]', gal), wisch = $('.h04-wisch', gal); let jetzt = 0, laeuft = false;
    const zu = (n) => {
      if (n === jetzt || laeuft) return; laeuft = true;
      ks.forEach((k) => k.setAttribute('aria-pressed', String(+k.dataset.zu === n)));
      wisch.className = 'h04-wisch rein';
      setTimeout(() => { bs[jetzt].classList.remove('an'); bs[n].classList.add('an'); jetzt = n; wisch.className = 'h04-wisch raus'; }, ruhig ? 0 : 420);
      setTimeout(() => { wisch.className = 'h04-wisch'; laeuft = false; }, ruhig ? 0 : 900);
    };
    ks.forEach((k) => k.addEventListener('click', () => zu(+k.dataset.zu)));
  }

  /* 5 · Der Satz zeigt */
  const worte = $('[data-worte]');
  if (worte) {
    worte.dataset.an = '0';
    $$('[data-w]', worte).forEach((b) => { const an = () => { worte.dataset.an = b.dataset.w; }; b.addEventListener('pointerenter', an); b.addEventListener('focus', an); b.addEventListener('click', an); });
  }

  /* 8 · Wärme oder Licht: Schieber */
  const sch = $('[data-schieber]');
  if (sch) {
    const griff = $('.h08-griff', sch); let zieht = false;
    const setz = (x) => { x = Math.max(.04, Math.min(.96, x)); sch.style.setProperty('--x', x.toFixed(4)); griff.setAttribute('aria-valuenow', Math.round(x * 100)); };
    const m = () => sch.style.setProperty('--w', sch.offsetWidth + 'px'); mess.push(m); m();
    const von = (ev) => { const r = sch.getBoundingClientRect(); setz((ev.clientX - r.left) / r.width); };
    sch.addEventListener('pointerdown', (ev) => { zieht = true; sch.setPointerCapture(ev.pointerId); von(ev); });
    sch.addEventListener('pointermove', (ev) => { if (zieht || maus) von(ev); });
    sch.addEventListener('pointerup', () => { zieht = false; });
    griff.addEventListener('keydown', (ev) => { const x = parseFloat(sch.style.getPropertyValue('--x')) || .5; if (ev.key === 'ArrowLeft') { setz(x - .05); ev.preventDefault(); } if (ev.key === 'ArrowRight') { setz(x + .05); ev.preventDefault(); } });
  }

  /* 11 · Hängende Rahmen: Schwung aus der Scroll-Geschwindigkeit, Feder pendelt aus */
  const pend = $('[data-pendel]');
  if (pend && !ruhig) {
    const hs = $$('.h11-h', pend).map((el, i) => ({ el, a: 0, v: 0, k: .045 + i * .006 }));
    let yv = scrollY, lauf = null, ruheZeit = 0;
    const schritt = () => {
      const dy = scrollY - yv; yv = scrollY; let bewegt = Math.abs(dy) > .5;
      hs.forEach((h) => { h.v += (-h.a * h.k) - h.v * .06 + dy * .012; h.a += h.v; h.a = Math.max(-9, Math.min(9, h.a)); h.el.style.transform = `rotate(${h.a.toFixed(2)}deg)`; if (Math.abs(h.a) > .05 || Math.abs(h.v) > .02) bewegt = true; });
      ruheZeit = bewegt ? 0 : ruheZeit + 1;
      lauf = ruheZeit > 30 ? null : requestAnimationFrame(schritt);
    };
    addEventListener('scroll', () => { if (!lauf) { ruheZeit = 0; lauf = requestAnimationFrame(schritt); } }, { passive: true });
  }

  /* 12 · Der Blick wandert: Sucher fährt die Stellen an, hält, fährt weiter */
  const su = $('[data-sucher]');
  if (su) {
    const pts = su.dataset.sucher.split(';').map((s) => s.split(',').map(Number)), box = $('.h12-sucher', su), zs = $$('.h12-zeile span', su);
    const glatt = (t) => t * t * (3 - 2 * t);
    hooks.push(() => {
      const seg = pinP(su) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(seg)), f = glatt(Math.max(0, Math.min(1, (seg - i - .3) / .4)));
      const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
      box.style.transform = `translate(${(x / 100 * su.offsetWidth).toFixed(1)}px,${(y / 100 * su.offsetHeight).toFixed(1)}px) translate(-50%,-50%)`;
      const an = Math.round(seg); zs.forEach((z, k) => z.classList.toggle('an', k === an));
    });
  }

  /* 14 · Der Satz schreibt sich */
  const tinte = $('[data-tinte]');
  if (tinte) {
    const ws = $$('span', tinte); let alt = -1;
    hooks.push(() => {
      const r = tinte.getBoundingClientRect(), q = Math.max(0, Math.min(1, (vh * .85 - r.top) / (vh * .55)));
      const k = ruhig ? ws.length : Math.round(q * ws.length);
      if (k !== alt) { alt = k; ws.forEach((w, i) => w.classList.toggle('an', i < k)); }
    });
  }

  /* 15 · Kacheln auf dem Boden: Tippen hebt eine Kachel */
  $$('.h15-k').forEach((k) => k.addEventListener('click', () => { $$('.h15-k').forEach((x) => x !== k && x.classList.remove('hoch')); k.classList.toggle('hoch'); }));

  /* 16 · Die Collage folgt der Maus */
  const tm = $('[data-tiefe-maus]');
  if (tm && !ruhig) {
    let zx = 0, zy = 0, x = 0, y = 0, lauf = null;
    const schritt = () => { x += (zx - x) * .08; y += (zy - y) * .08; tm.style.setProperty('--mx', x.toFixed(4)); tm.style.setProperty('--my', y.toFixed(4)); lauf = Math.abs(zx - x) + Math.abs(zy - y) > .002 ? requestAnimationFrame(schritt) : null; };
    const ziel = (a, b) => { zx = a; zy = b; if (!lauf) lauf = requestAnimationFrame(schritt); };
    S.addEventListener('pointermove', (ev) => { const r = tm.getBoundingClientRect(); ziel((ev.clientX - r.left) / r.width * 2 - 1, (ev.clientY - r.top) / r.height * 2 - 1); });
    if (!maus) hooks.push(() => { const r = tm.getBoundingClientRect(); ziel(0, Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)))); });
  }

  /* 19 · Der Bogen */
  const bog = $('[data-bogen]');
  if (bog) {
    const bs = $$('.h19-b', bog), n = bs.length;
    hooks.push(() => {
      const R = Math.max(900, bog.offsetWidth * .95), step = 13, off = (pinP(bog) - .5) * step * (n - 1);
      bs.forEach((b, i) => { const t = ((i - (n - 1) / 2) * step - off) * Math.PI / 180; b.style.transform = `translate(${(R * Math.sin(t)).toFixed(1)}px,${(R * (1 - Math.cos(t))).toFixed(1)}px) translate(-50%,0) rotate(${(t * 180 / Math.PI).toFixed(2)}deg)`; });
    });
  }

  /* 20 · Treten Sie ein in …: Fallblatt-Wort und Bild im selben Takt */
  const slot = $('[data-slot]');
  if (slot) {
    const wb = $('.h20-band', slot), bb = $('.h20-bband', slot), n = $$('.h20-band span', slot).length - 1; let i = 0, iv = null;
    const zeig = (sofort) => { [wb, bb].forEach((b) => { b.style.transition = sofort ? 'none' : ''; }); wb.style.transform = `translateY(${-i * 1.1}em)`; bb.style.transform = `translateY(${-i * 100 / (n + 1)}%)`; };
    const weiter = () => { i++; zeig(false); if (i === n) setTimeout(() => { i = 0; zeig(true); }, 950); };
    slot.addEventListener('click', (ev) => { if (!ev.target.closest('a')) weiter(); });
    if (!ruhig) sichtbar(slot, () => { if (!iv) iv = setInterval(weiter, 2600); }, () => { clearInterval(iv); iv = null; });
  }

  rechne();
}
