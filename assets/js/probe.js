/* Wellness & Spa Pirmin Zurbriggen · Bewegung der PROBE 19.10.2026 (Kapitel 1 bis 4). Läuft nach haus.js.
   Nichts hängt an der Scrollposition oder am Scroll-Tempo (Tasty-Sprache Stufe 2 Punkt 3, Werdegang 11 und 17):
   - Auftritt: jedes Foto (.pf) kommt, sobald es den Rand berührt und geladen ist, deckend von unten an seinen Platz, das Foto zoomt im Rahmen.
   - Gruppen ([data-gruppe], die Wand in Kapitel 3) kommen in einem Zug, alle Fotos darin zugleich.
   - Zahlen ([data-zahl]) zählen in unter einer Sekunde hoch, ab 70 % (Noten ab 90 %), damit nie eine falsche Note dasteht.
   - Die Jahreszahl der Familie rollt wie ein Zählwerk zur Station, die gerade in der Mitte steht.
   Nur transform, translate, scale und opacity (Regel 55). */
(function () {
  'use strict';
  var D = document, W = window, $ = function (s, c) { return (c || D).querySelector(s); }, $$ = function (s, c) { return [].slice.call((c || D).querySelectorAll(s)); };
  var ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]nomotion/.test(location.search);
  var io = 'IntersectionObserver' in W;

  /* ---------- Auftakt: sobald das erste Bild da ist ---------- */
  var ak = $('.ak');
  if (ak) {
    var aim = $('.ak__bild img', ak), akLos = function () { requestAnimationFrame(function () { ak.classList.add('da'); }); };
    if (ruhig || !aim || aim.complete) akLos(); else { aim.addEventListener('load', akLos, { once: true }); setTimeout(akLos, 900); }
  }

  /* ---------- Auftritt der Fotos, nie ein leerer Rahmen in Bewegung ---------- */
  function geladen(im) { return !im.hasAttribute('data-src') && im.complete && im.naturalWidth > 1; }
  function bereit(ims, f) {
    var offen = ims.filter(function (im) { return !geladen(im); }).length, fertig = false, los = function () { if (fertig) return; fertig = true; f(); };
    if (!offen) { los(); return; }
    ims.forEach(function (im) { if (geladen(im)) return; im.addEventListener('load', function () { if (im.naturalWidth > 1 && --offen <= 0) los(); }); im.addEventListener('error', function () { if (--offen <= 0) los(); }, { once: true }); });
    setTimeout(los, 1200);
  }
  var gruppen = $$('[data-gruppe]'), einzeln = $$('.pf').filter(function (f) { return !f.closest('[data-gruppe]'); });
  function zeige(el) {
    var figs = el.classList.contains('pf') ? [el] : $$('.pf', el);
    bereit(figs.map(function (f) { return $('img', f); }).filter(Boolean), function () {
      el.classList.add('da'); figs.forEach(function (f) { f.classList.add('da'); });
      var s = el.closest('.nah__s'); if (s) s.classList.add('da');
    });
  }
  if (ruhig || !io) { gruppen.concat(einzeln).forEach(function (el) { el.classList.add('da'); $$('.pf', el).forEach(function (f) { f.classList.add('da'); }); }); $$('.nah__s').forEach(function (s) { s.classList.add('da'); }); }
  else {
    var fio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; fio.unobserve(e.target); zeige(e.target); }); }, { rootMargin: '0px 0px 4% 0px' });
    gruppen.concat(einzeln).forEach(function (el) { fio.observe(el); });
  }

  /* ---------- Zahlen zählen ---------- */
  function form(v, dez) { return dez ? v.toFixed(dez).replace('.', ',') : String(Math.round(v)); }
  var zahlen = $$('[data-zahl]');
  zahlen.forEach(function (el) {
    var z = el.dataset.zahl; el.__dez = (z.split(',')[1] || '').length; el.__n = parseFloat(z.replace(',', '.'));
    if (isNaN(el.__n)) return;
    el.style.display = 'inline-block'; el.style.textAlign = 'right'; el.style.minWidth = el.getBoundingClientRect().width + 'px';
    el.__von = el.__n * (el.__dez ? .9 : .7); if (!ruhig && io) el.textContent = form(el.__von, el.__dez);
  });
  function zaehle(el) {
    if (isNaN(el.__n)) return;
    var t0 = 0, dauer = el.__dez ? 520 : 720, von = el.__von;
    (function schritt(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dauer); el.textContent = form(von + (el.__n - von) * (1 - Math.pow(1 - k, 3)), el.__dez); if (k < 1) requestAnimationFrame(schritt); })(performance.now());
  }
  if (!ruhig && io) {
    var zio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { zio.unobserve(e.target); zaehle(e.target); } }); }, { rootMargin: '0px 0px -4% 0px' });
    zahlen.forEach(function (el) { zio.observe(el); });
  }

  /* ---------- Familie: das Zählwerk der Jahre ---------- */
  var fam = $('.fam'), jahr = fam && $('.fam__jahr', fam), saetze = fam ? $$('.fam__satz', fam) : [], stationen = fam ? $$('.fam__st', fam) : [], akt = -1;
  function stelle(i) {
    if (!jahr || i === akt) return; akt = i;
    var j = stationen[i].dataset.jahr;
    $$('.zw', jahr).forEach(function (z, p) { z.style.setProperty('--p', p); z.firstChild.style.setProperty('--d', j.charAt(p)); });
    jahr.dataset.akt = i; jahr.setAttribute('aria-label', i === 2 ? '2024/25' : j);
    saetze.forEach(function (s, k) { s.classList.toggle('an', k === i); });
  }
  if (jahr) {
    if (ruhig || !io) stelle(0);
    else {
      var jio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) stelle(stationen.indexOf(e.target)); }); }, { rootMargin: '-46% 0px -46% 0px' });
      stationen.forEach(function (s) { jio.observe(s); });
      var gio = new IntersectionObserver(function (es) { if (es[0].isIntersecting && akt < 0) { stelle(0); gio.disconnect(); } }, { rootMargin: '0px 0px -20% 0px' });
      gio.observe(jahr);
    }
  }
})();
