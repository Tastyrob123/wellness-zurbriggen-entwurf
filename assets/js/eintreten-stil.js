/* «treten Sie ein» im Stil der Seite (26.10.2026): .da beim Ankommen, Zahlen zählen hoch, Reiter, Karussell-Pfeile, --p für die Bühne. */
(function () {
  var nav = document.querySelector('.vnr');
  if (nav) addEventListener('keydown', function (ev) {
    var a = ev.key === 'ArrowLeft' ? nav.querySelector('[data-k=vor]') : ev.key === 'ArrowRight' ? nav.querySelector('[data-k=nach]') : null;
    if (a) location.href = a.href;
  });
  var S = document.querySelector('.m8'); if (!S) return;
  var ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sicht = function (el, an) { var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { an(); io.disconnect(); } }); }, { rootMargin: '0px 0px -14% 0px' }); io.observe(el); };
  [S].concat([].slice.call(S.querySelectorAll('[data-e]'))).forEach(function (x) { sicht(x, function () { x.classList.add('da'); }); });

  /* Zahlen zählen hoch (wie beim Spa) */
  [].forEach.call(S.querySelectorAll('[data-z]'), function (z) {
    var ziel = +z.dataset.z, von = ziel - (ziel > 1000 ? 60 : ziel);
    if (ruhig) return;
    z.textContent = von;
    sicht(z, function () { var t0 = performance.now(); (function lauf(t) { var q = Math.min(1, (t - t0) / 1600), k = 1 - Math.pow(1 - q, 3); z.textContent = Math.round(von + (ziel - von) * k); if (q < 1) requestAnimationFrame(lauf); })(t0); });
  });

  /* Reiter */
  var r = S.querySelector('[data-reiter]');
  if (r) {
    var ks = [].slice.call(r.querySelectorAll('[data-zu]')), bs = [].slice.call(r.querySelectorAll('.m04-b')), strich = r.querySelector('.m-strich'), jetzt = 0;
    var mess = function () { var k = ks[jetzt], u = k.closest('ul').getBoundingClientRect(), b = k.getBoundingClientRect(); strich.style.setProperty('--sw', b.width + 'px'); strich.style.setProperty('--sx', (b.left - u.left) + 'px'); };
    ks.forEach(function (k) { k.addEventListener('click', function () {
      var zu = +k.dataset.zu; if (zu === jetzt) return;
      bs.forEach(function (b, i) { b.classList.toggle('war', i === jetzt); b.classList.toggle('an', i === zu); });
      ks.forEach(function (x) { x.setAttribute('aria-pressed', String(+x.dataset.zu === zu)); });
      jetzt = zu; mess();
    }); });
    addEventListener('resize', mess); setTimeout(mess, 60); if (document.fonts) document.fonts.ready.then(mess);
  }

  /* Karussell: Pfeile blättern eine Karte weiter */
  var band = S.querySelector('[data-karu]');
  if (band) [].forEach.call(S.querySelectorAll('.m-pf'), function (p) {
    p.addEventListener('click', function () { var k = band.querySelector('.m06-k'); band.scrollBy({ left: (+p.dataset.r) * (k.offsetWidth + 14), behavior: ruhig ? 'auto' : 'smooth' }); });
  });

  /* Bühne: --p fürs Zurückziehen des Bildes */
  var ps = [].slice.call(S.querySelectorAll('[data-s]')), vh = innerHeight, offen = 0;
  function rechne() { offen = 0; ps.forEach(function (el) { var b = el.getBoundingClientRect(), p = Math.max(0, Math.min(1, (vh - b.top) / (vh + b.height))); el.style.setProperty('--p', (ruhig ? .5 : p).toFixed(4)); }); }
  if (ps.length) { addEventListener('scroll', function () { if (!offen) offen = requestAnimationFrame(rechne); }, { passive: true }); rechne(); }
})();
