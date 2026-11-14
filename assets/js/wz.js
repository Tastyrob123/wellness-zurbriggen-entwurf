/* Wellness & Spa Pirmin Zurbriggen · Startseite (20.10.2026): Auftakt öffnet sich nach dem ersten Bild; die grosse Zahl zählt ab 80 % hoch. */
(function () {
  'use strict';
  var ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var auf = document.querySelector('.wz-auf');
  if (auf) { var im = auf.querySelector('img'), los = function () { requestAnimationFrame(function () { auf.classList.add('da'); }); };
    if (ruhig || !im || im.complete) los(); else { im.addEventListener('load', los, { once: true }); setTimeout(los, 900); } }
  [].forEach.call(document.querySelectorAll('[data-wz-zahl]'), function (el) {
    var n = +el.dataset.wzZahl, von = n > 100 ? Math.round(n * .992) : Math.round(n * .7); if (ruhig) return; el.textContent = von;
    var io = new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; io.disconnect(); var t0 = 0;
      (function s(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 900); el.textContent = Math.round(von + (n - von) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(s); })(performance.now()); }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
  });
})();
