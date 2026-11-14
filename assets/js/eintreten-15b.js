/* «treten Sie ein» · zweite Runde (25.10.2026). Auslöser .da, Scroll-Fortschritt --p auf [data-s], Tippen tauscht [data-tausch],
   Kacheln neigen sich [data-neigen], Pfeiltasten blättern. Nur transform und opacity, Schreiben über requestAnimationFrame. */
(function () {
  var nav = document.querySelector('.vnr');
  if (nav) addEventListener('keydown', function (ev) {
    var a = ev.key === 'ArrowLeft' ? nav.querySelector('[data-k=vor]') : ev.key === 'ArrowRight' ? nav.querySelector('[data-k=nach]') : null;
    if (a) location.href = a.href;
  });
  var S = document.querySelector('.f15');
  if (!S) return;
  var ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ziele = [S].concat([].slice.call(S.querySelectorAll('[data-e]')));
  if (ruhig || !('IntersectionObserver' in window)) ziele.forEach(function (x) { x.classList.add('da'); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('da'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -14% 0px' });
    ziele.forEach(function (x) { io.observe(x); });
  }

  /* Tippen tauscht: der gewählte Raum schiebt sich über den bisherigen herauf */
  var t = S.querySelector('[data-tausch]');
  if (t) {
    var bs = [].slice.call(t.querySelectorAll('.f06-b')), ks = [].slice.call(t.querySelectorAll('[data-zu]')), jetzt = 0;
    ks.forEach(function (k) {
      k.addEventListener('click', function () {
        var zu = +k.dataset.zu; if (zu === jetzt) return;
        bs.forEach(function (b, i) { b.classList.toggle('war', i === jetzt); b.classList.toggle('an-da', i === zu); });
        ks.forEach(function (x) { x.setAttribute('aria-pressed', String(+x.dataset.zu === zu)); });
        jetzt = zu;
      });
    });
  }

  /* Kacheln neigen sich zur Maus (nur mit Maus) */
  var ng = S.querySelector('[data-neigen]');
  if (ng && !ruhig && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    [].forEach.call(ng.querySelectorAll('.f14-k'), function (k) {
      var f = 0, x = 0, y = 0;
      function setz() { f = 0; k.style.transform = 'perspective(1200px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg)'; }
      k.addEventListener('pointermove', function (ev) { var r = k.getBoundingClientRect(); x = (ev.clientX - r.left) / r.width - .5; y = (ev.clientY - r.top) / r.height - .5; if (!f) f = requestAnimationFrame(setz); });
      k.addEventListener('pointerleave', function () { x = 0; y = 0; if (!f) f = requestAnimationFrame(setz); });
    });
  }

  /* Scroll-Fortschritt */
  var ps = [].slice.call(S.querySelectorAll('[data-s]'));
  if (!ps.length || ruhig) return;
  var vh = innerHeight, offen = 0;
  function rechne() {
    offen = 0;
    ps.forEach(function (el) {
      var r = el.getBoundingClientRect(), p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      if (Math.abs(p - (el._p || -1)) > .0005) { el._p = p; el.style.setProperty('--p', p.toFixed(4)); }
    });
  }
  addEventListener('scroll', function () { if (!offen) offen = requestAnimationFrame(rechne); }, { passive: true });
  addEventListener('resize', function () { vh = innerHeight; rechne(); }, { passive: true });
  rechne();
})();
