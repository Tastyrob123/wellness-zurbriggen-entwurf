/* Wellness & Spa Pirmin Zurbriggen · Startseite: die leise Antwort auf die Maus. Zimmerkacheln neigen sich langsam ein wenig zum Zeiger (höchstens 4°), nur transform. */
(function () {
  'use strict';
  if (!matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches) return;
  [].forEach.call(document.querySelectorAll('.ws-zk'), function (k) {
    var r = 0, x = 0, y = 0;
    function male() { r = 0; k.style.rotate = ''; k.style.transform = k.classList.contains('da') ? 'perspective(1200px) rotateX(' + (-y * 4).toFixed(2) + 'deg) rotateY(' + (x * 4).toFixed(2) + 'deg) translateY(-4px)' : ''; }
    k.addEventListener('pointermove', function (ev) { var b = k.getBoundingClientRect(); x = (ev.clientX - b.left) / b.width - .5; y = (ev.clientY - b.top) / b.height - .5; if (!r) r = requestAnimationFrame(male); });
    k.addEventListener('pointerleave', function () { x = y = 0; k.style.transform = ''; });
    k.addEventListener('pointerenter', function () { if (k.classList.contains('da')) k.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1)'; });
  });
})();
