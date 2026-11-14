/* «treten Sie ein» · 15 Fassungen (24.10.2026). Auslöser .da, Scroll-Fortschritt --p (0…1) auf [data-s], Index data-an für Sinne und Rundgang,
   Pfeiltasten blättern. Nur transform und opacity werden animiert, Schreiben einmal je Bild über requestAnimationFrame. */
(function () {
  var S = document.querySelector('.e15');
  var nav = document.querySelector('.vnr');
  if (nav) addEventListener('keydown', function (ev) {
    if (ev.target.closest && ev.target.closest('input,textarea')) return;
    var a = ev.key === 'ArrowLeft' ? nav.querySelector('[data-k=vor]') : ev.key === 'ArrowRight' ? nav.querySelector('[data-k=nach]') : null;
    if (a) location.href = a.href;
  });
  if (!S) return;
  var ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ziele = [S].concat([].slice.call(S.querySelectorAll('[data-e]')));
  if (ruhig || !('IntersectionObserver' in window)) ziele.forEach(function (x) { x.classList.add('da'); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('da'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -14% 0px' });
    ziele.forEach(function (x) { io.observe(x); });
  }
  var ps = [].slice.call(S.querySelectorAll('[data-s]'));
  if (!ps.length) return;
  var vh = innerHeight, offen = 0;
  function rechne() {
    offen = 0;
    ps.forEach(function (el) {
      var r = el.getBoundingClientRect(), p;
      if (el.hasAttribute('data-pin')) p = -r.top / Math.max(1, r.height - vh);          // angeheftete Bühne: über die ganze Strecke
      else p = (vh - r.top) / (vh + r.height);                                             // sonst: vom Eintritt unten bis zum Austritt oben
      p = Math.max(0, Math.min(1, p));
      if (ruhig) p = el.hasAttribute('data-pin') ? p : .5;
      if (el._p !== p) { el._p = p; el.style.setProperty('--p', p.toFixed(4)); }
      var n = +el.getAttribute('data-an');
      if (n) {
        var q = el.hasAttribute('data-pin') ? p : Math.max(0, Math.min(.999, (vh * .62 - r.top) / (r.height * .78)));
        var i = String(Math.min(n - 1, Math.floor(q * n)));
        if (el.getAttribute('data-i') !== i) el.setAttribute('data-i', i);
      }
    });
  }
  addEventListener('scroll', function () { if (!offen) offen = requestAnimationFrame(rechne); }, { passive: true });
  addEventListener('resize', function () { vh = innerHeight; rechne(); }, { passive: true });
  rechne();
})();
