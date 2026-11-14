/* «treten Sie ein» · dritte Runde (25.10.2026): je Fassung ein eigener Effekt. Gemeinsam nur die Mechanik:
   --p (0…1) auf [data-pin] (angeheftete Bühne) und [data-s] (Durchlauf), Pfeiltasten blättern. Nur transform und opacity. */
import { initHoverReveal } from './hover-reveal.js';

const nav = document.querySelector('.vnr');
if (nav) addEventListener('keydown', (ev) => {
  const a = ev.key === 'ArrowLeft' ? nav.querySelector('[data-k=vor]') : ev.key === 'ArrowRight' ? nav.querySelector('[data-k=nach]') : null;
  if (a) location.href = a.href;
});
const S = document.querySelector('.g15');
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const maus = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = S) => r && r.querySelector(s);
const $$ = (s, r = S) => r ? [...r.querySelectorAll(s)] : [];
const sichtbar = (el, an, aus) => new IntersectionObserver((es) => es.forEach((x) => (x.isIntersecting ? an : aus)())).observe(el);

if (S) {
  /* ---------- Fortschritt ---------- */
  const ps = $$('[data-pin],[data-s]');
  const hooks = [];
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
  const mess = [];

  /* ---------- 1 · Vom Wort zum Raum: Bild wächst aus dem Platz in der Zeile ---------- */
  const platz = $('.g01-platz'), raum = $('.g01-raum');
  if (platz && raum) {
    const pin = raum.closest('[data-pin]');
    let g = null;
    const m = () => {
      platz.style.height = (platz.offsetWidth * raum.offsetHeight / raum.offsetWidth) + 'px';
      const pr = platz.getBoundingClientRect(), rr = raum.getBoundingClientRect(), t = raum.style.transform;
      raum.style.transform = 'none'; const r0 = raum.getBoundingClientRect(); raum.style.transform = t;
      g = { s: pr.width / r0.width, dx: (pr.left + pr.width / 2) - (r0.left + r0.width / 2), dy: (pr.top + pr.height / 2) - (r0.top + r0.height / 2) };
    };
    mess.push(m); m();
    hooks.push(() => {
      if (!g) return;
      const q = Math.max(0, Math.min(1, ((pin._p || 0) - .04) / .7)), k = 1 - Math.pow(1 - q, 2.2);
      raum.style.transform = `translate(${(g.dx * (1 - k)).toFixed(1)}px,${(g.dy * (1 - k)).toFixed(1)}px) scale(${(g.s + (1 - g.s) * k).toFixed(4)})`;
    });
  }

  /* ---------- 2 · Drehbühne: Kreis dreht mit, vorn hell, hinten zurück ---------- */
  const ring = $('.g02-ring');
  if (ring) {
    const pin = ring.closest('[data-pin]'), tafeln = $$('.g02-p', ring);
    hooks.push(() => {
      const a = -(pin._p || 0) * 315;
      ring.style.transform = `translateZ(calc(var(--r) * -1)) rotateY(${a.toFixed(2)}deg)`;
      tafeln.forEach((t, i) => { const c = Math.cos((a + i * 45) * Math.PI / 180); t.style.opacity = (.18 + .82 * Math.max(0, c)).toFixed(3); });
    });
  }

  /* ---------- 14 · Würfel: nur die Seiten zeigen, die nach vorn schauen (Safari hält backface nicht zuverlässig) ---------- */
  const wf = $('.g14-w');
  if (wf) {
    const pin = wf.closest('[data-pin]'), seiten = $$('.g14-f', wf);
    hooks.push(() => {
      const a = (pin._p || 0) * 270;
      seiten.forEach((f, i) => { const c = Math.cos((a - i * 90) * Math.PI / 180); f.style.opacity = c > .02 ? '1' : '0'; });
    });
  }

  /* ---------- 5 · Bildspur ---------- */
  const spur = $('.g05-buehne');
  if (spur) {
    const quellen = spur.dataset.spur.split(' ');
    const pool = quellen.map((q) => { const i = new Image(); i.src = q; i.alt = ''; i.className = 'g05-b'; i.decoding = 'async'; spur.appendChild(i); return i; });
    let n = 0, lx = -999, ly = -999;
    const setz = (x, y) => {
      const b = pool[n++ % pool.length];
      b.style.transition = 'none'; b.style.opacity = '1';
      b.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(.86) rotate(${(Math.random() * 8 - 4).toFixed(1)}deg)`;
      b.style.zIndex = String(n);
      void b.offsetWidth;
      b.style.transition = 'transform .9s cubic-bezier(.22,1,.36,1), opacity .7s ease .55s';
      b.style.transform = b.style.transform.replace('scale(.86)', 'scale(1)');
      b.style.opacity = '0';
    };
    spur.addEventListener('pointermove', (ev) => {
      const r = spur.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
      if (Math.hypot(x - lx, y - ly) > 90) { lx = x; ly = y; setz(x, y); }
    });
    if (!maus && !ruhig) {             // Handy: die Spur läuft von selbst durch die Bühne
      let t = 0, iv = null;
      sichtbar(spur, () => { if (!iv) iv = setInterval(() => { const r = spur.getBoundingClientRect(); t += .55; setz(r.width * (.5 + .38 * Math.sin(t)), r.height * (.5 + .3 * Math.sin(t * 1.7))); }, 420); },
        () => { clearInterval(iv); iv = null; });
    } else {                           // Startbild, damit die Bühne nicht leer ist
      sichtbar(spur, () => { if (spur._los) return; spur._los = 1; const r = spur.getBoundingClientRect(); [[.62, .3], [.74, .58], [.86, .36]].forEach(([a, b], i) => setTimeout(() => setz(r.width * a, r.height * b), i * 260)); }, () => {});
    }
  }

  /* ---------- 6 · Laterne ---------- */
  const lat = $('[data-laterne]');
  if (lat) {
    const nacht = $('.g06-nacht', lat);
    let x = .5, y = .5, zx = .5, zy = .5, lauf = null, selbst = !maus;
    const zeichne = () => {
      x += (zx - x) * .14; y += (zy - y) * .14;
      nacht.style.transform = `translate(${(x * lat.offsetWidth).toFixed(1)}px,${(y * lat.offsetHeight).toFixed(1)}px) translate(-50%,-50%)`;
      if (selbst) { const t = performance.now() / 2600; zx = .5 + .34 * Math.sin(t); zy = .5 + .26 * Math.sin(t * 1.6); }
      lauf = requestAnimationFrame(zeichne);
    };
    lat.addEventListener('pointermove', (ev) => { const r = lat.getBoundingClientRect(); selbst = false; zx = (ev.clientX - r.left) / r.width; zy = (ev.clientY - r.top) / r.height; });
    sichtbar(lat, () => { if (!lauf && !ruhig) lauf = requestAnimationFrame(zeichne); }, () => { cancelAnimationFrame(lauf); lauf = null; });
  }

  /* ---------- 8 · Lamellen ---------- */
  const lam = $('[data-lamellen]');
  if (lam) {
    lam.style.setProperty('--a', 1);
    $$('.g08-l', lam).forEach((l) => {
      const an = () => lam.style.setProperty('--a', l.style.getPropertyValue('--i'));
      l.addEventListener('pointerenter', an); l.addEventListener('focus', an); l.addEventListener('click', an);
    });
  }

  /* ---------- 10 · Namen zeigen Bilder (eigener Code aus web-komponenten) ---------- */
  const liste = $('[data-hover-reveal]');
  if (liste && maus) initHoverReveal(liste, { width: 340, ratio: 1.2, tilt: 8 });

  /* ---------- 12 · Lupe ---------- */
  const lb = $('[data-lupe]');
  if (lb) {
    const lupe = $('.g12-lupe', lb), bild = $('.g12-lupe img', lb), Z = 1.9;
    const setz = (x, y) => {
      const W = lb.offsetWidth, H = lb.offsetHeight, L = lupe.offsetWidth;
      bild.style.width = (W * Z) + 'px'; bild.style.height = (H * Z) + 'px';
      lupe.style.transform = `translate(${x - L / 2}px,${y - L / 2}px)`;
      bild.style.transform = `translate(${(-x * Z + L / 2).toFixed(1)}px,${(-y * Z + L / 2).toFixed(1)}px)`;
    };
    lb.addEventListener('pointermove', (ev) => { const r = lb.getBoundingClientRect(); lb.classList.add('an'); setz(ev.clientX - r.left, ev.clientY - r.top); });
    lb.addEventListener('pointerleave', () => { if (maus) lb.classList.remove('an'); });
    if (!maus) { lb.classList.add('an'); sichtbar(lb, () => setz(lb.offsetWidth * .5, lb.offsetHeight * .32), () => {}); }
  }

  rechne();
}
