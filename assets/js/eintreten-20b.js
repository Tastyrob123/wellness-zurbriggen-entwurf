/* «treten Sie ein» · fünfte Runde (26.10.2026): --p auf [data-s], .da auf [data-e] und Abschnitt, Kacheln neigen [data-neigen],
   Fenster wechseln [data-wechsel], Pfeiltasten blättern. Nur transform und opacity, Schreiben über requestAnimationFrame. */
(function () {
  var nav = document.querySelector('.vnr');
  if (nav) addEventListener('keydown', function (ev) {
    var a = ev.key === 'ArrowLeft' ? nav.querySelector('[data-k=vor]') : ev.key === 'ArrowRight' ? nav.querySelector('[data-k=nach]') : null;
    if (a) location.href = a.href;
  });
  var S = document.querySelector('.k20'); if (!S) return;
  var ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches, maus = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var sicht = function (el, an, aus) { new IntersectionObserver(function (es) { es.forEach(function (x) { x.isIntersecting ? an() : aus(); }); }, { rootMargin: '0px 0px -14% 0px' }).observe(el); };
  [S].concat([].slice.call(S.querySelectorAll('[data-e]'))).forEach(function (x) { sicht(x, function () { x.classList.add('da'); }, function () {}); });

  var ps = [].slice.call(S.querySelectorAll('[data-s]')), vh = innerHeight, offen = 0;
  function rechne() {
    offen = 0;
    ps.forEach(function (el) {
      var r = el.getBoundingClientRect(), p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      if (ruhig) p = .5;
      if (Math.abs(p - (el._p == null ? -1 : el._p)) > .0004) { el._p = p; el.style.setProperty('--p', p.toFixed(4)); }
    });
  }
  if (ps.length) { addEventListener('scroll', function () { if (!offen) offen = requestAnimationFrame(rechne); }, { passive: true }); addEventListener('resize', function () { vh = innerHeight; rechne(); }, { passive: true }); rechne(); }

  var ng = S.querySelector('[data-neigen]');
  if (ng && maus && !ruhig) [].forEach.call(ng.querySelectorAll('.k-neig'), function (k) {
    var f = 0, x = 0, y = 0;
    function setz() { f = 0; k.style.transform = 'perspective(1100px) rotateX(' + (-y * 6).toFixed(2) + 'deg) rotateY(' + (x * 7).toFixed(2) + 'deg)'; }
    k.addEventListener('pointermove', function (ev) { var r = k.getBoundingClientRect(); x = (ev.clientX - r.left) / r.width - .5; y = (ev.clientY - r.top) / r.height - .5; if (!f) f = requestAnimationFrame(setz); });
    k.addEventListener('pointerleave', function () { x = 0; y = 0; if (!f) f = requestAnimationFrame(setz); });
  });

  var we = S.querySelector('[data-wechsel]');
  if (we && !ruhig) {
    var fe = [].slice.call(we.querySelectorAll('.k-wechsel')), z = 0, iv = null;
    var schritt = function () {
      var f = fe[z % fe.length], b = f.querySelector('.k-wband'), i = (+f.dataset.i || 0) + 1;
      b.style.transition = ''; b.style.transform = 'translateY(' + (-i * 25) + '%)'; f.dataset.i = i;
      if (i === 3) setTimeout(function () { b.style.transition = 'none'; b.style.transform = 'translateY(0)'; f.dataset.i = 0; }, 1050);
      z++;
    };
    sicht(we, function () { if (!iv) iv = setInterval(schritt, 1700); }, function () { clearInterval(iv); iv = null; });
  }
})();
