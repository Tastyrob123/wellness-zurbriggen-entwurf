/* Wellness & Spa Pirmin Zurbriggen · Der Anflug aus dem Film des Hauses als Kamerafahrt beim Scrollen (Bauart Tasty Studios 3D-Scroll).
   Die Bühne steht (sticky), der Fortschritt durch die Strecke wählt das Bild (110 Bilder, 10 je Sekunde); die Sätze wechseln synchron.
   Ein Takt (rAF), gezeichnet wird nur, wenn sich das Bild ändert; nativer Scroll. Ohne Bewegung (reduce) steht das erste Bild mit allen Sätzen. */
(function () {
  'use strict';
  var W = window, sec = document.querySelector('.jt-film'); if (!sec) return;
  var c = sec.querySelector('.jt-film__c'), ctx = c.getContext('2d'), erst = sec.querySelector('.jt-film__erst');
  var N = +sec.dataset.n || 110, klein = innerWidth < 800, pfad = 'assets/film/anflug/' + (klein ? 's' : 'l') + '/';
  var v = (erst.getAttribute('src').split('?v=')[1] || '1');
  var bilder = new Array(N), geladen = new Array(N), akt = -1, tick = false;
  var schritte = [].slice.call(sec.querySelectorAll('.fl-st')), lauf = sec.querySelector('.jt-film__lauf i');
  var GRENZEN = [0, .14, .38, .64, .92];   // ab welchem Anteil der Strecke welcher Satz steht
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { schritte.forEach(function (s) { s.classList.add('an'); }); sec.classList.add('ruhig'); return; }
  function lade(i) { if (bilder[i]) return; var im = new Image(); im.decoding = 'async'; im.onload = function () { var fertig = function (bm) { if (bm) bilder[i] = bm; geladen[i] = true; if (i === ziel()) male(true); }; if (W.createImageBitmap) createImageBitmap(im).then(fertig, function () { fertig(null); }); else fertig(null); }; im.src = pfad + String(i + 1).padStart(3, '0') + '.webp?v=' + v; bilder[i] = im; }
  /* zuerst jedes achte Bild (grobe Fahrt sofort möglich), dann die Lücken */
  lade(0); for (var g = 8; g >= 1; g = g >> 1) for (var i = 0; i < N; i += g) lade(i);
  function anteil() { var r = sec.getBoundingClientRect(), weg = sec.offsetHeight - innerHeight; return Math.min(1, Math.max(0, -r.top / (weg || 1))); }
  function ziel() { return Math.min(N - 1, Math.round(anteil() * (N - 1))); }
  function naechstes(i) { for (var d = 0; d < N; d++) { if (geladen[i - d]) return i - d; if (geladen[i + d]) return i + d; } return -1; }
  function male(zwingen) {
    tick = false; var p = anteil(), i = naechstes(ziel());
    if (i >= 0 && (i !== akt || zwingen)) { akt = i; ctx.drawImage(bilder[i], 0, 0, c.width, c.height); if (!sec.classList.contains('laeuft')) sec.classList.add('laeuft'); }
    var k = 0; for (var s = 0; s < GRENZEN.length; s++) if (p >= GRENZEN[s]) k = s;
    schritte.forEach(function (el, n) { el.classList.toggle('an', n === k); });
    if (lauf) lauf.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(function () { male(false); }); } }, { passive: true });
  addEventListener('resize', function () { male(true); });
  if (erst.complete) { ctx.drawImage(erst, 0, 0, c.width, c.height); } else erst.addEventListener('load', function () { ctx.drawImage(erst, 0, 0, c.width, c.height); });
  geladen[0] = false; male(true);
})();
