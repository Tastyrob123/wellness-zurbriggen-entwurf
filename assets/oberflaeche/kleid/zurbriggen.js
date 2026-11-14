/* kleid/zurbriggen.js · Hauswerte für oberflaeche.js (Wellness & Spa Pirmin Zurbriggen mit dem Loft-Suite Hotel, Saas-Almagell; Oberchef 08.11.2026).
   Im <head> VOR allen Stilen laden (ohne defer). Rahmen «Die Bühne»: Kopf Nachtblau wie der Winterabend (#0A1129), Raum hell wie Papier (#F6F1EA).
   Liegt unter _werkzeuge/oberflaeche/ und wird von den Werkzeug-Servern unter /assets/oberflaeche/ ausgeliefert (einziger Schreiber: Kontrollpanel, zurbriggen-maison).
   Fotos und Schriften kommen aus der Website (/assets/img/<schlüssel>-<s|m|l|x>.webp, /assets/fonts/), Zeichen aus /assets/oberflaeche/kleid/zurbriggen-marke.svg#wm. */
window.WO_HAUS = { kurz: 'zurbriggen', name: 'Pirmin Zurbriggen', voll: 'Wellness & Spa Pirmin Zurbriggen', ort: 'Saas-Almagell', loft: 'Loft-Suite Hotel', welt: 'hotel', rahmen: 'buehne', anrede: 'Sie',   /* Sie-Ansprache (CLAUDE.md, Website) */
  /* Aussenfoto des Startbilds: das Haus in der Winternacht, der Pavillon und alle Etagen erleuchtet (website/inhalt/bilder.py › winternacht; CHARAKTER.md 2 und 5).
     Stufen der Website heissen -s/-m/-l/-x (website/bilder.py › GROESSEN: 480/900/1440/2200 px); oberflaeche.js baut daraus srcset, nie eine Stufe über der genannten. */
  foto: '/assets/img/winternacht-l.webp', fotoKlein: '/assets/img/winternacht-m.webp', fotoFarbe: '#0A1129',
  fotoStufen: { s: 480, m: 900, l: 1440, x: 2200 }, fotoAlt: 'Das Haus in einer Winternacht, alle Fenster erleuchtet',
  /* Je Werkzeug ein eigenes Foto im Startbild (Tresen 08.11.2026: sonst stünde in jedem Werkzeug und in jedem Bildschirm Kontrollpanel dasselbe Haus).
     Nur aus dem Register der Website (inhalt/bilder.py), Motiv mittig, damit es neben dem Text steht; ohne Eintrag gilt foto. Ein eigenes foto des Werkzeugs geht vor. */
  fotoJe: { website: ['winternacht', 'Das Haus in einer Winternacht, alle Fenster erleuchtet'], karten: ['t-1', 'Ein Teller aus der Küche des Hauses, angerichtet auf Schwarz'],
    gaeste: ['g-wein', 'Wein wird am Tisch eingeschenkt'], marke: ['pool', 'Das Schwimmbad unter dem Glasdach, das Z an der Wand'],
    besuche: ['haus-nacht', 'Das Haus in einer Winternacht, alle Etagen erleuchtet'], druck: ['kamin', 'Der offene Kamin vor der Wand aus Holzscheiben'] },
  /* Zeichen: das gepinselte Z des Prospekts «lifestyle» mit vier Sternen und Krone (website/assets/zeichen/z, stern, krone; unverändert zusammengesetzt) */
  zeichen: '/assets/oberflaeche/kleid/zurbriggen-zeichen.svg', zeichenMass: 0.89, wortmarke: '/assets/oberflaeche/kleid/zurbriggen-marke.svg#wm', wortmarkeMass: 0.89,
  /* Namen der sieben Werkzeuge: die EINE Stelle (gleicher Satz wie in den anderen Häusern desselben Stamms, CLAUDE.md «Reihenfolge»); Dateien, Schlüssel und Adressen bleiben. */
  namen: { zentrale: 'Kontrollpanel', website: 'Website bearbeiten', karten: 'Karten & Preislisten', gaeste: 'Anfragen & Chat', marke: 'Das Markenbuch', besuche: 'Besucher', druck: 'Drucksachen & Feed' },
  saetze: { zentrale: 'Hier beginnt alles: ein Blick auf alle Werkzeuge und ihren Stand.',
    website: 'Die Website selbst pflegen: Texte, Fotos, Zimmer, Preise, Angebote.',
    karten: 'Gourmet-Menü und Wein je Abend schreiben, daraus entstehen Karte und PDF.',
    gaeste: 'Anfragen der Gäste zu Zimmern, Loft-Suite, Spa und Anreise, mit Antwortentwurf.',
    marke: 'Zeichen, Fotos, Farben und Schriften des Hauses an einem Ort.',
    besuche: 'Wer die Website besucht: woher, wann, welche Zimmer, wer buchen geht.',
    druck: 'Aushänge, Karten und Beiträge in der Sprache des Hauses entwerfen.' },
  wege: { zentrale: '/_werkzeuge/maison/', website: '/_werkzeuge/bureau/', karten: '/_werkzeuge/carte/', gaeste: '/_werkzeuge/reception/', marke: '/_werkzeuge/livre/', besuche: '/_werkzeuge/registre/', druck: '/_werkzeuge/imprimerie/' },
  /* Prüfserver je Werkzeug (cloud/haus.json, Ports 9401–9408); Wege zwischen Werkzeugen immer 127.0.0.1, nie localhost (Fehlerbuch 10a) */
  ports: { zentrale: 9401, website: 9402, karten: 9403, gaeste: 9404, marke: 9405, besuche: 9406, druck: 9407, werkbank: 9408, website_lokal: 9409 } };
/* Lokal (Prüfserver je Werkzeug) zeigen die Wege zu den ANDEREN Werkzeugen auf deren eigenen Server unter 127.0.0.1, nie auf den eigenen Port
   (Fund im Stamm 28.10.2026: der Knopf zur Zentrale öffnete /_werkzeuge/maison/ auf dem eigenen Port ohne Stand-Wege; Fehlerbuch 10a). Online bleiben sie relativ.
   Wer selbst schon absolute Wege setzt: nur Wege umschreiben, die noch mit «/» beginnen (WO_HAUS.wegeLokal = true zeigt, dass es hier geschah). */
(function () {
  if (!/^(127\.0\.0\.1|localhost)$/.test(location.hostname)) return;
  Object.keys(WO_HAUS.wege).forEach(function (k) {
    var p = WO_HAUS.ports[k], w = WO_HAUS.wege[k];
    if (p && String(p) !== location.port && w.charAt(0) === '/') WO_HAUS.wege[k] = 'http://127.0.0.1:' + p + w;
  });
  WO_HAUS.wegeLokal = true;
})();
document.documentElement.setAttribute('data-wo-haus', WO_HAUS.kurz);
document.documentElement.setAttribute('data-wo-rahmen', WO_HAUS.rahmen);
try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
/* Bewegung der Werkzeuge (29.10.2026): bewegung.js neben oberflaeche.js, async und mit wenig Vorrang nachgeladen, damit es nie vor dem ersten Knopf steht */
(function () {
  var me = document.currentScript, s = document.createElement('script');
  s.src = (me && me.src ? new URL('../bewegung.js', me.src).href : '/assets/oberflaeche/bewegung.js') + '?v=3';   /* Fassung hochzählen, wenn bewegung.js sich ändert */
  s.async = true; s.setAttribute('fetchpriority', 'low'); document.head.appendChild(s);
})();
/* Titel fliegen zeilenweise hoch (Kriterium 37, 30.10.2026). WO_ZEILEN(el) setzt jedes Wort eines Titels in <span class="wo-w"> und schreibt die Zeile als --z daran;
   die Wörter einer Zeile steigen zusammen, Zeile für Zeile gestaffelt. Ändert sich dabei der Umbruch (Silbentrennung, sehr lange Wörter), bleibt der Titel unberührt.
   Hier im Kleid (ohne defer), damit der Titel des Startbilds schon vor dem ersten Bild geteilt ist; bewegung.js nutzt dieselbe Funktion für die Zwischentitel. */
window.WO_ZEILEN = function (el) {
  if (!el || el.hasAttribute('data-wo-zl')) return !!(el && el.classList.contains('wo-zl'));
  var h0 = el.offsetHeight; if (!h0) return false;   /* verborgen: später, wenn er zu sehen ist */
  el.setAttribute('data-wo-zl', '');
  var w0 = Math.max(el.scrollWidth, el.clientWidth), roh = el.innerHTML, tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), t, ts = [];
  while ((t = tw.nextNode())) if (/\S/.test(t.data) && !t.parentNode.closest('svg')) ts.push(t);
  if (!ts.length) return false;
  ts.forEach(function (t) {
    var f = document.createDocumentFragment();
    t.data.split(/(\s+)/).forEach(function (s) {
      if (!s) return;
      if (/^\s+$/.test(s)) { f.appendChild(document.createTextNode(s)); return; }
      var w = document.createElement('span'); w.className = 'wo-w'; w.textContent = s; f.appendChild(w);
    });
    t.parentNode.replaceChild(f, t);
  });
  if (el.offsetHeight !== h0 || el.scrollWidth > w0 + 1) { el.innerHTML = roh; return false; }
  var z = -1, oben = -1e9, halb = parseFloat(getComputedStyle(el).fontSize) * 0.5;
  el.querySelectorAll('.wo-w').forEach(function (w) { var y = w.getBoundingClientRect().top; if (y > oben + halb) { z++; oben = y; } if (z) w.style.setProperty('--z', z); });
  el.classList.add('wo-zl');
  return true;
};
/* Der Titel des Startbilds: geteilt, sobald er im Dokument steht (vor dem ersten Bild, der Auftritt beginnt erst nach 0,18 s) */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('MutationObserver' in window)) return;
  var plan = 0;
  function teile() {
    plan = 0;
    document.querySelectorAll('.wo-sb__h:not([data-wo-zl])').forEach(function (h) {
      if (document.documentElement.classList.contains('still')) return;
      var a = h.getAnimations ? h.getAnimations() : [];
      if (a.some(function (x) { return (x.currentTime || 0) > 120; })) { h.setAttribute('data-wo-zl', ''); return; }   /* läuft schon: bleibt ein Block, nie zurückspringen */
      WO_ZEILEN(h);
    });
  }
  new MutationObserver(function () { if (!plan && document.querySelector('.wo-sb__h:not([data-wo-zl])')) { plan = 1; Promise.resolve().then(teile); } })
    .observe(document.documentElement, { childList: true, subtree: true });
})();
