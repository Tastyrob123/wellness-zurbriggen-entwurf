/* treten Sie ein · Den Gang hinein: Scroll-Fortschritt --p (0…1) für den Zoom des Eingangsfotos, einmal je Bild über requestAnimationFrame. */
(function () {
  var el = document.querySelector('.eg-gr[data-s]');
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var vh = innerHeight, offen = 0, alt = -1;
  function rechne() {
    offen = 0;
    var r = el.getBoundingClientRect();
    var p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
    if (Math.abs(p - alt) > .0005) { alt = p; el.style.setProperty('--p', p.toFixed(4)); }
  }
  addEventListener('scroll', function () { if (!offen) offen = requestAnimationFrame(rechne); }, { passive: true });
  addEventListener('resize', function () { vh = innerHeight; rechne(); }, { passive: true });
  rechne();
})();
