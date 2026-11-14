/* Wellness & Spa Pirmin Zurbriggen · Startseite «lifestyle»: Zimmer wählen. Ein Name antippen, das Bild tauscht an derselben Stelle (kommt von unten, nichts springt). */
(function () {
  'use strict';
  var g = document.querySelector('.sz-wahl'); if (!g) return;
  var knoepfe = [].slice.call(g.querySelectorAll('[data-zimmer]')), bilder = [].slice.call(g.querySelectorAll('[data-bild]'));
  function zeige(k) {
    knoepfe.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.zimmer === k ? 'true' : 'false'); });
    bilder.forEach(function (b) {
      var an = b.dataset.bild === k;
      if (an) { var im = b.querySelector('img'); if (im && im.dataset.src) { if (im.dataset.srcset) im.srcset = im.dataset.srcset; im.src = im.dataset.src; im.removeAttribute('data-src'); im.removeAttribute('data-srcset'); } }
      b.classList.toggle('an', an);
    });
  }
  knoepfe.forEach(function (b) { b.addEventListener('click', function () { zeige(b.dataset.zimmer); }); b.addEventListener('mouseenter', function () { if (matchMedia('(hover:hover)').matches) zeige(b.dataset.zimmer); }); });
  /* die anderen Bilder früh laden, damit beim Tauschen nichts leer ist */
  var io = new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; io.disconnect(); bilder.forEach(function (b) { var im = b.querySelector('img'); if (im && im.dataset.src) { if (im.dataset.srcset) im.srcset = im.dataset.srcset; im.src = im.dataset.src; im.removeAttribute('data-src'); im.removeAttribute('data-srcset'); } }); }, { rootMargin: '120% 0px' });
  io.observe(g);
})();
