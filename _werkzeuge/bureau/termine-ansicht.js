/* termine-ansicht.js · Website bearbeiten (Wellness & Spa Pirmin Zurbriggen, 08.11.2026; Vorlage: die Ansicht «Termine» des Culinarium, 28.10.2026,
   und «DJ-Abende» von Wild Side, 31.10.2026): Ansicht «Jasswochen» im Schreibtisch des Stamms (window.WS_EIGEN, website.js). Die Jasswochen mit dem
   Hotel Monte-Moro sind auf der Website Daten (website/inhalt/daten.py › JASS › wochen), kein Text: der Server liest sie (termine.py), hier werden sie
   gepflegt. Aus ihnen entstehen auf der Seite «Angebote» die Liste der Wochen und der Titel «Jasswochen 2026/2027». Eingaben warten gelb und zählen in
   der Leiste mit; «Speichern» der Leiste legt sie in den Entwurf, «Veröffentlichen» bringt sie (mit den Änderungen an Texten und Fotos) auf die Website
   (Probe-Kopie). Frühere Fassungen und der ursprüngliche Stand lassen sich zurückholen. Vor website.js laden. Kein fester Farbwert: alles aus dem Kleid (--wo-*). */
(function () {
  'use strict';
  var API = '/_werkzeuge/bureau/api/termine';
  var SEITE = '/_werkzeuge/bureau/vorschau/angebote.html', ANKER = 'jass';
  var TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  var MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var L = null, liste = [], H = null, vorschauBreite = 'rechner';

  function kopie(x) { return JSON.parse(JSON.stringify(x)); }
  function basis() { return L ? (L.entwurf || L.stand) : []; }
  function gleich(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function nach(id, l) { return (l || []).find(function (t) { return t.id === id; }); }
  function datum(d) { var p = d.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function gibt(d) { return !!d && !isNaN(datum(d).getTime()) && datum(d).getMonth() + 1 === +d.split('-')[1]; }
  /* So steht die Woche auf der Seite «Angebote»: «10–15. Januar 2027» */
  function wann(t) {
    if (!gibt(t.von) || !gibt(t.bis)) return 'Datum fehlt';
    var a = datum(t.von), b = datum(t.bis);
    if (a.getMonth() !== b.getMonth() || a.getFullYear() !== b.getFullYear()) return a.getDate() + '. ' + MONATE[a.getMonth()] + ' bis ' + b.getDate() + '. ' + MONATE[b.getMonth()] + ' ' + b.getFullYear();
    return a.getDate() + '–' + b.getDate() + '. ' + MONATE[a.getMonth()] + ' ' + a.getFullYear();
  }
  function tage(t) { if (!gibt(t.von) || !gibt(t.bis)) return ''; var a = datum(t.von), b = datum(t.bis); return TAGE[a.getDay()] + ' bis ' + TAGE[b.getDay()]; }
  function vorbei(t) { return L && L.heute && gibt(t.bis) && t.bis < L.heute; }

  async function ruf(methode, weg_, daten) {
    var r;
    try {
      var vorab = methode === 'GET' && !daten && !weg_ && window.__vorab && window.__vorab[API]; if (vorab) delete window.__vorab[API];   // beim Laden der Seite schon geholt (index.html)
      r = await (vorab || fetch(API + (weg_ ? '/' + weg_ : ''), { method: methode, headers: daten ? { 'Content-Type': 'application/json' } : {}, body: daten ? JSON.stringify(daten) : undefined, cache: 'no-store' }));
    } catch (e) { throw { fehler: 'NETZ · Der Server des Werkzeugs antwortet nicht. Ihre Eingaben bleiben stehen.', stichwort: 'netz' }; }
    var j = {}; try { j = await r.json(); } catch (e) { /* leer */ }
    if (!r.ok) { j.status = r.status; throw j; }
    return j;
  }
  function uebernehmen(neu, eingabenBehalten) {
    if (!neu || !Array.isArray(neu.stand)) return;   /* eine Antwort ohne Stand (z. B. ein Prüfprogramm, das jede Anfrage mit {ok:true} beantwortet) ändert nichts */
    L = neu;
    if (!eingabenBehalten) liste = kopie(basis());
  }
  /* Was geändert ist: zwischen zwei Listen, je Woche */
  function unterschiede(alt, neu) {
    var aus = [];
    neu.forEach(function (t) {
      var a = nach(t.id, alt);
      if (!a) aus.push({ art: 'neu', t: t });
      else if (!gleich(a, t)) aus.push({ art: 'geaendert', t: t, a: a });
    });
    alt.forEach(function (a) { if (!nach(a.id, neu)) aus.push({ art: 'weg', t: a }); });
    return aus;
  }
  function zeile(u) {
    if (u.art === 'neu') return 'neue Jasswoche ' + wann(u.t);
    if (u.art === 'weg') return 'von der Seite genommen: ' + wann(u.t);
    return '«' + wann(u.a) + '» wird «' + wann(u.t) + '»';
  }
  function offen() { return L ? unterschiede(basis(), sortiert(liste)).length : 0; }
  function sortiert(l) { return l.slice().sort(function (a, b) { return (a.von || '').localeCompare(b.von || ''); }); }   // früheste Woche zuerst, wie auf der Website
  function istHier() { return H && H.ansicht() === 'e:termine' && document.querySelector('#ws-mitte[data-ws-ansicht="e:termine"]'); }

  async function speichern() {
    try {
      var a = await ruf('POST', 'speichern', { termine: sortiert(liste), erwartet: L.kennung });
      uebernehmen(a, false);
      if (a.nichts) { H && H.melde(a.meldung); } else {
        var n = unterschiede(a.vorher, basis()), k = H.quit('Gespeichert', 'Jasswochen · ' + zeile(n[0] || { art: 'neu', t: basis()[0] || {} }) + (n.length > 1 ? ' und ' + H.mz(n.length - 1, 'weitere Änderung', 'weitere Änderungen') : ''), [
          H.taste('Vorher/nachher ansehen', function () { k.remove(); H.geh('e:termine').then(function () { var v = document.getElementById('cu-tv'); if (v) v.scrollIntoView({ block: 'start' }); }); }),
          H.taste('Rückgängig', function () { k.remove(); rueckgaengig(a.vorher); })], { 'data-ws-quittung': n.length, 'data-cu-termine': 'gespeichert' });
        setTimeout(function () { if (k.isConnected) k.remove(); }, 9000);
      }
      if (istHier()) zeichne(document.getElementById('ws-mitte'), H);
      return true;
    } catch (e) {
      if (e.status === 409) { return konflikt(); }
      H.fehler(e);
      return false;
    }
  }
  async function rueckgaengig(vorher) {
    try { uebernehmen(await ruf('POST', 'speichern', { termine: vorher, erwartet: L.kennung }), false); H.melde('Rückgängig gemacht', { mehr: 'Die Jasswochen sind wie vor diesem Speichern.' }); }
    catch (e) { if (e.status === 409) { await neuLaden(true); H.melde('Inzwischen hat jemand anderes gespeichert.', { stichwort: 'konflikt' }); } else H.fehler(e); }
    H.neu(); if (istHier()) zeichne(document.getElementById('ws-mitte'), H);
  }
  async function neuLaden(behalten) { uebernehmen(await ruf('GET', ''), behalten); }
  function konflikt() {
    return neuLaden(true).then(function () {
      return new Promise(function (fertig) {
        H.fenster('Zwei haben', 'gleichzeitig geändert.', H.el('div', { class: 'ws-form' },
          H.el('p', {}, 'In einem anderen Fenster wurden die Jasswochen inzwischen gespeichert. Ihre Eingaben sind nicht verloren und nichts wurde überschrieben.'),
          H.el('p', {}, 'Speichern Sie, gilt Ihre Liste, so wie sie hier steht.')), [
          { text: 'Meine Eingaben verwerfen', tun: function (zu) { zu(); liste = kopie(basis()); H.neu(); if (istHier()) zeichne(document.getElementById('ws-mitte'), H); fertig(false); } },
          { text: 'Meine Eingaben speichern', haupt: true, tun: function (zu) { zu(); speichern().then(fertig); } }], { name: 'konflikt' });
      });
    });
  }

  /* ---------- Zeichnen */
  function blatt(t) {   // das Bild einer Woche: so wie die Liste auf der Seite «Angebote» sie zeigt (grosse Tage in Messing, darunter Monat und Jahr), auf Schokolade
    var ok = gibt(t.von) && gibt(t.bis), a = ok ? datum(t.von) : null, b = ok ? datum(t.bis) : null;
    return '<figure class="cu-pl cu-jw" aria-hidden="true"><span class="cu-jw__ro">Jasswoche</span>' +
      '<b class="cu-jw__tage">' + (ok ? a.getDate() + '<i>–' + b.getDate() + '.</i>' : '–') + '</b>' +
      '<span class="cu-jw__monat">' + (ok ? MONATE[a.getMonth()] + ' ' + a.getFullYear() : '') + '</span>' +
      '<span class="cu-jw__mit">mit dem Hotel Monte-Moro</span></figure>';
  }
  function feld(label, inhalt, art) { return H.el('label', { class: 'cu-f' + (art ? ' cu-f--' + art : '') }, H.el('span', { class: 'cu-f__l' }, label), inhalt); }
  function auswahlDatum(wert, beiWahl, wer) {   // Datum im Stil des Hauses (R21): Tag, Monat, Jahr als Auswahl, nie die des Betriebssystems
    var p = (wert || '').split('-'), j0 = new Date().getFullYear(), tg = [], mon = [], jahre = [];
    for (var i = 1; i <= 31; i++) tg.push({ wert: ('0' + i).slice(-2), text: i + '.' });
    MONATE.forEach(function (n, i) { mon.push({ wert: ('0' + (i + 1)).slice(-2), text: n }); });
    for (var j = j0 - 1; j <= j0 + 2; j++) jahre.push({ wert: String(j), text: String(j) });
    if (p[0] && !jahre.some(function (x) { return x.wert === p[0]; })) jahre.unshift({ wert: p[0], text: p[0] });
    var setze = function (k, w) { p[k] = w; beiWahl(p.join('-')); };
    return H.el('span', { class: 'cu-datum' }, H.auswahl(tg, p[2], function (w) { setze(2, w); }, wer + ': Tag'), H.auswahl(mon, p[1], function (w) { setze(1, w); }, wer + ': Monat'), H.auswahl(jahre, p[0], function (w) { setze(0, w); }, wer + ': Jahr'));
  }
  function pruefeEingabe(t) {
    if (!gibt(t.von)) return 'Den ersten Tag gibt es nicht.';
    if (!gibt(t.bis)) return 'Den letzten Tag gibt es nicht.';
    if (t.bis <= t.von) return 'Der letzte Tag liegt nach dem ersten.';
    if (t.von.slice(0, 7) !== t.bis.slice(0, 7)) return 'Erster und letzter Tag liegen im selben Monat, so steht die Woche auf der Seite «Angebote».';
    if ((datum(t.bis) - datum(t.von)) / 864e5 >= 14) return 'Eine Jasswoche dauert höchstens 14 Tage.';
    if (liste.some(function (x) { return x !== t && gibt(x.von) && gibt(x.bis) && x.von <= t.bis && t.von <= x.bis; })) return 'Diese Woche überschneidet sich mit einer anderen Jasswoche.';
    return '';
  }
  function karte(t) {
    var b = nach(t.id, basis()), neu = !b, geaendert = b && !gleich(b, t);
    var fehler = pruefeEingabe(t);
    var meld = H.el('p', { class: 'cu-t__fehler', role: 'alert', hidden: !fehler }, fehler);
    var kopfZeile = H.el('p', { class: 'cu-t__wann' }, wann(t));
    var tagZeile = H.el('p', { class: 'cu-t__frei' }, tage(t));
    var bild = H.el('div', { class: 'cu-t__bild', html: blatt(t) });
    function neuZeichnen() {
      var f = pruefeEingabe(t); meld.textContent = f; meld.hidden = !f;
      kopfZeile.textContent = wann(t); tagZeile.textContent = tage(t); bild.innerHTML = blatt(t);
      var bb = nach(t.id, basis());
      k.classList.toggle('cu-t--offen', !bb || !gleich(bb, t));
      H.leiste();
    }
    var k = H.el('article', { class: 'cu-t' + (neu || geaendert ? ' cu-t--offen' : ''), 'data-cu-termin': t.id },
      bild,
      H.el('div', { class: 'cu-t__felder' },
        H.el('div', { class: 'cu-t__kopf' }, kopfZeile, neu ? H.el('span', { class: 'cu-t__marke' }, 'Neu') : vorbei(t) ? H.el('span', { class: 'cu-t__marke cu-t__marke--leise' }, 'Vorbei') : null),
        tagZeile,
        H.el('div', { class: 'cu-t__reihe' },
          feld('Erster Tag', auswahlDatum(t.von, function (w) { t.von = w; neuZeichnen(); }, 'Erster Tag'), 'datum'),
          feld('Letzter Tag', auswahlDatum(t.bis, function (w) { t.bis = w; neuZeichnen(); }, 'Letzter Tag'), 'datum')),
        vorbei(t) && !neu ? H.el('p', { class: 'cu-t__frei' }, 'Diese Woche ist vorbei und steht noch auf der Seite. Mit «Von der Seite nehmen» verschwindet sie beim nächsten Veröffentlichen.') : null,
        meld,
        H.el('div', { class: 'cu-t__kn' },
          b && geaendert ? H.link('Wie gespeichert', function () { liste[liste.indexOf(t)] = kopie(b); zeichne(document.getElementById('ws-mitte'), H); H.leiste(); }) : null,
          H.link(neu ? 'Wieder entfernen' : 'Von der Seite nehmen', function () {
            var nr = liste.indexOf(t); liste.splice(nr, 1); zeichne(document.getElementById('ws-mitte'), H); H.leiste(); H.neu();
            if (!neu) H.melde('Von der Seite genommen', { mehr: wann(t) + '. Erst mit «Speichern» im Entwurf; jeder veröffentlichte Stand lässt sich zurückholen.' });
          }, { 'data-cu-weg': t.id }))));
    return k;
  }
  function neueWoche() {   // Vorschlag aus den Wochen, die schon stehen: gleicher Wochentag und gleiche Länge, vier Wochen nach der letzten, ganz in einem Monat
    var l = sortiert(liste.length ? liste : basis().length ? basis() : (L ? L.ursprung : [])), letzte = l[l.length - 1];
    var a = letzte ? datum(letzte.von) : new Date(), n = letzte ? Math.round((datum(letzte.bis) - datum(letzte.von)) / 864e5) : 5;
    a.setDate(a.getDate() + 28);
    for (var i = 0; i < 60; i++) {
      var e = new Date(a); e.setDate(e.getDate() + n);
      var frei = !liste.some(function (x) { return x.von <= iso(e) && iso(a) <= x.bis; });
      if (e.getMonth() === a.getMonth() && frei) break;
      a.setDate(a.getDate() + 7);
    }
    var b = new Date(a); b.setDate(b.getDate() + n);
    var t = { id: 'n' + Date.now().toString(36).slice(-8), von: iso(a), bis: iso(b) };
    liste.push(t);
    zeichne(document.getElementById('ws-mitte'), H); H.neu();
    var k = document.querySelector('[data-cu-termin="' + t.id + '"]'); if (k) { k.scrollIntoView({ block: 'center' }); k.classList.add('cu-t--leuchtet'); }
  }

  function vergleich() {   // «Vorher, nachher»: veröffentlicht (durchgestrichen) gegen Entwurf (markiert)
    var u = L.wartet ? unterschiede(L.stand, L.entwurf) : [];
    var box = H.el('section', { class: 'cu-v', id: 'cu-tv' }, H.el('h2', { class: 'wo-zw' }, 'Vorher, ', H.el('em', {}, 'nachher')));
    if (!u.length) {
      var b0 = basis()[0] || (L.ursprung || [])[0], b1 = b0 ? { von: b0.von, bis: iso(new Date(datum(b0.bis).getTime() - 864e5)) } : null;
      box.append(H.el('p', { class: 'cu-leise' }, 'Im Entwurf wartet nichts. Was Sie speichern, steht hier: oben, was jetzt auf der Website steht, darunter, was nach dem Veröffentlichen gilt.'),
        b0 ? H.el('div', { class: 'cu-v__z cu-v__z--beispiel' }, H.el('span', { class: 'cu-v__mk' }, 'Beispiel'), H.el('s', {}, 'Jasswoche ' + wann(b0)), H.el('mark', {}, 'Jasswoche ' + wann(b1))) : null);
      return box;
    }
    u.forEach(function (x) {
      box.append(H.el('div', { class: 'cu-v__z', 'data-cu-v': x.art },
        H.el('span', { class: 'cu-v__mk' }, x.art === 'neu' ? 'Neu' : x.art === 'weg' ? 'Entfällt' : 'Geändert'),
        x.art !== 'neu' ? H.el('s', {}, 'Jasswoche ' + wann(x.a || x.t)) : null,
        x.art !== 'weg' ? H.el('mark', {}, 'Jasswoche ' + wann(x.t)) : null));
    });
    box.append(H.el('div', { class: 'ws-reihe' }, H.link('Entwurf der Jasswochen verwerfen', function () {
      H.fenster('Entwurf der Jasswochen', 'verwerfen?', H.el('p', {}, H.mz(u.length, 'Änderung geht', 'Änderungen gehen') + ' verloren. Die Website bleibt, wie sie ist.'), [
        { text: 'Abbrechen' },
        { text: 'Ja, verwerfen', haupt: true, tun: async function (zu) {
          zu();
          try { var a = await ruf('POST', 'verwerfen', { erwartet: L.kennung }); var vorher = a.vorher; uebernehmen(a, false); H.neu(); zeichne(document.getElementById('ws-mitte'), H);
            var k = H.quit('Entwurf verworfen', 'Die Jasswochen stehen, wie sie veröffentlicht sind.', [H.taste('Rückgängig', function () { k.remove(); rueckgaengig(vorher); })]);
          } catch (e) { if (e.status === 409) { await neuLaden(true); H.melde('Inzwischen hat jemand anderes gespeichert.', { stichwort: 'konflikt' }); } else H.fehler(e); }
        } }], { name: 'verwerfen' });
    }, { 'data-cu-verwerfen': '1' })));
    return box;
  }
  function verlauf() {   // Frühere Fassungen (R14): Datum, Zahl, Notiz, «In den Entwurf holen», unten immer der ursprüngliche Stand
    var box = H.el('section', { class: 'cu-vl' }, H.el('h2', { class: 'wo-zw' }, 'Frühere ', H.el('em', {}, 'Fassungen')));
    var holen = function (nr, was) {
      return H.taste('In den Entwurf holen', async function () {
        try { uebernehmen(await ruf('POST', 'zurueckholen', { nr: nr, erwartet: L.kennung }), false); H.neu(); zeichne(document.getElementById('ws-mitte'), H);
          H.melde('In den Entwurf geholt', { mehr: was + '. Auf der Website erscheint es erst, wenn Sie veröffentlichen.' });
        } catch (e) { if (e.status === 409) { await neuLaden(true); H.melde('Inzwischen hat jemand anderes gespeichert.', { stichwort: 'konflikt' }); } else H.fehler(e); }
      }, { 'data-cu-holen': String(nr) });
    };
    if (!L.verlauf.length) box.append(H.el('div', { class: 'cu-vl__z cu-vl__z--beispiel' }, H.el('span', { class: 'cu-v__mk' }, 'Beispiel'),
      H.el('b', {}, '8.11.2026, 18:30 Uhr'), H.el('span', {}, 'Veröffentlicht · ' + H.mz(L.ursprung.length, 'Jasswoche', 'Jasswochen') + ' · Notiz «Saison 2026/2027»')));
    L.verlauf.forEach(function (v) {
      box.append(H.el('div', { class: 'cu-vl__z' }, H.el('b', {}, H.zeit(v.zeit)), H.el('span', {}, 'Veröffentlicht · ' + H.mz(v.zahl, 'Jasswoche', 'Jasswochen') + (v.notiz ? ' · Notiz «' + v.notiz + '»' : '')), holen(v.nr, 'Die Fassung vom ' + H.zeit(v.zeit))));
    });
    box.append(H.el('div', { class: 'cu-vl__z cu-vl__z--ur' }, H.el('b', {}, 'Ursprünglicher Stand'), H.el('span', {}, 'Wie die Website gebaut ist · ' + H.mz(L.ursprung.length, 'Jasswoche', 'Jasswochen')), holen('ursprung', 'Der ursprüngliche Stand')));
    return box;
  }
  function vorschau() {
    /* ohne Anker laden: ein Anker im Rahmen rollt auch die Seite des Werkzeugs dorthin (Fund 28.10.2026); gerollt wird nur innen */
    var rahmen = H.el('iframe', { class: 'cu-vs__rahmen', src: SEITE, title: 'Vorschau der Seite «Angebote» mit den Jasswochen des Entwurfs', loading: 'lazy' });
    rahmen.addEventListener('load', function () {
      try { var z = rahmen.contentDocument.getElementById(ANKER); if (z) rahmen.contentWindow.scrollTo(0, z.getBoundingClientRect().top + rahmen.contentWindow.scrollY); } catch (e) { /* ohne Rollen */ }
    });
    var huelle = H.el('div', { class: 'cu-vs__huelle', 'data-breite': vorschauBreite }, rahmen);
    var wahl = H.wahl2([{ wert: 'rechner', text: 'Rechner' }, { wert: 'handy', text: 'Handy' }], vorschauBreite, function (w) { vorschauBreite = w; huelle.setAttribute('data-breite', w); }, 'Breite der Vorschau', true);
    return H.el('section', { class: 'cu-vs' }, H.el('h2', { class: 'wo-zw' }, 'So sieht es ', H.el('em', {}, 'auf der Seite aus')),
      H.el('div', { class: 'cu-vs__kopf' }, H.el('p', { class: 'cu-leise' }, L.wartet ? 'Mit den Jasswochen des Entwurfs. Noch nicht gespeicherte Eingaben erscheinen nach «Speichern».' : 'Die Seite «Angebote», wie sie gerade auf der Website steht.'), wahl,
        H.el('a', { class: 'ws-taste', href: SEITE + '#' + ANKER, target: '_blank', rel: 'noopener' }, 'Gross öffnen')), huelle);
  }

  var vsKennung = '';
  function zeichne(ort, h) {
    H = h;
    var m = ort || document.getElementById('ws-mitte');
    var y = window.scrollY;
    /* Neu zeichnen nach einer Eingabe (Neue Jasswoche, Entfernen): nur Liste, Vergleich und Verlauf; die eingebettete Vorschau bleibt stehen, solange
       der Entwurf derselbe ist (ein iframe lädt bei jedem Einsetzen neu, Messung 28.10.2026) */
    if (m.querySelector(':scope > .cu-vs') && m.querySelector(':scope > .cu-liste') && vsKennung === L.kennung) {
      m.querySelector(':scope > .cu-liste').replaceWith(listeBox(h));
      m.querySelector(':scope > .cu-v').replaceWith(vergleich());
      m.querySelector(':scope > .cu-vl').replaceWith(verlauf());
      m.setAttribute('data-cu-termine', String(liste.length));
      return;
    }
    vsKennung = L.kennung;
    m.textContent = '';
    m.append(h.titel('Mit dem Hotel Monte-Moro', 'Jasswochen', 'pflegen.', 'Jede Woche, in der an vier Abenden «Schieber» gespielt wird: erster und letzter Tag. Auf der Seite «Angebote» stehen die Wochen als Liste unter «Jasswochen», Leistungen und Preise daneben pflegen Sie wie jeden Text der Seite.',
      [h.el('button', { class: 'wo-kn wo-kn--gold', type: 'button', 'data-cu-neu': '1', html: '<span>Neue Jasswoche</span><i>' + (window.WO ? WO.ic('plus') : '') + '</i>', onclick: neueWoche }),
       h.el('a', { class: 'wo-kn', href: SEITE + '#' + ANKER, target: '_blank', rel: 'noopener', html: '<span>Auf der Seite ansehen</span><i>' + (window.WO ? WO.ic('auge') : '') + '</i>' })]));
    var s = sortiert(liste);
    m.append(listeBox(h), vergleich(), vorschau(), verlauf(),
      h.el('p', { class: 'cu-quelle' }, 'Ursprung der Jasswochen: ' + L.quelle + '. Die Website wird hier nie verändert; veröffentlicht wird in die Probe-Kopie.'));
    if (h.opt && h.opt.halten) window.scrollTo(0, y);
    m.setAttribute('data-cu-termine', String(s.length));
  }
  function listeBox(h) {
    var s = sortiert(liste);
    var box = h.el('section', { class: 'cu-liste', 'aria-label': 'Jasswochen' });
    if (!s.length) {
      var b0 = (L && L.ursprung && L.ursprung[0]) || { von: '', bis: '' };
      box.append(h.el('div', { class: 'cu-leer' }, h.el('p', {}, 'Gerade steht keine Jasswoche in der Liste. Mindestens eine bleibt auf der Seite «Angebote». «Wie gespeichert» oder «Neue Jasswoche» füllt die Liste wieder.'),
        h.el('div', { class: 'cu-t cu-t--beispiel' }, h.el('div', { class: 'cu-t__bild', html: blatt(b0) }),
          h.el('div', { class: 'cu-t__felder' }, h.el('p', { class: 'cu-t__wann' }, 'Beispiel: ' + wann(b0)), h.el('p', { class: 'cu-t__frei' }, tage(b0) + '. Mit «Neue Jasswoche» legen Sie eine an.')))));
    }
    s.forEach(function (t) { box.append(karte(t)); });
    return box;
  }

  window.WS_EIGEN = window.WS_EIGEN || {};
  window.WS_EIGEN.termine = {
    name: 'Jasswochen', gruppe: 'Das Haus', aufgabe: ['Neue Jasswoche', 'Die Wochen mit dem Hotel Monte-Moro: Tage eintragen, verschieben oder von der Seite nehmen.'],
    bereit: function () { return ruf('GET', '').then(function (a) { uebernehmen(a, false); }); },
    zeichne: async function (ort, h) { H = h; if (h.opt && h.opt.neuLaden) await neuLaden(true); zeichne(ort, h); },
    offen: offen,
    wartet: function () { return L && L.wartet ? unterschiede(L.stand, L.entwurf).length : 0; },
    speichern: function () { if (!H) return Promise.resolve(false); return speichern(); },
    zeilen: function () { return L && L.wartet ? unterschiede(L.stand, L.entwurf).map(zeile) : []; },
    veroeffentlichen: async function (notiz) {
      var n = this.wartet();
      uebernehmen(await ruf('POST', 'veroeffentlichen', { erwartet: L.kennung, notiz: notiz }), true);
      if (istHier()) zeichne(document.getElementById('ws-mitte'), H);
      return n;
    }
  };
})();

/* Abnahme-Tor 2, 30.10.2026 (S2, K7): Kacheltitel und -unterschriften der Übersicht («Einen Text ändern», «Preis oder Öffnungszeit») ohne einzelnes Wort in der
   letzten Zeile: die letzten zwei Wörter bleiben zusammen (Safari kennt den Umbruch «pretty» noch nicht) */
(function () {
  function fest() {
    document.querySelectorAll(':is(.wo-ag__t, .wo-bk__t) > :is(b, span):not([data-fest]):not(:has(*)), .ws-eintrag__t > b:not([data-fest])').forEach(function (b) {
      b.setAttribute('data-fest', '');
      var t = b.textContent.trim().replace(/\u00a0/g, ' '), i = t.lastIndexOf(' ')   /* schon geklebte Leerzeichen zählen wieder als Leerzeichen: sonst klebt jeder neue Durchgang ein Wort mehr, bis der Titel nicht mehr bricht (Mac-Prüfung 09.11.2026, «Tagen, Stammgäste und Stellen» abgeschnitten) */, j = i > 0 ? t.lastIndexOf(' ', i - 1) : -1;
      if (j < 0) { if (i > 0 && b.parentNode.classList.contains('ws-eintrag__t')) b.textContent = t.replace(' ', '\u00a0'); return; }   /* Namen aus zwei Wörtern bleiben ganz */
      b.textContent = t.slice(0, j + 1) + t.slice(j + 1).replace(' ', '\u00a0');
    });
  }
  /* Einträge eines Bereichs (Zimmer, Angebote): «Ändern» unter dem Namen als Zeichen der Kachel (CSS ::after), damit die letzte Textzeile der Name bleibt */
  function aendernZeichen() {
    document.querySelectorAll('.ws-eintrag__auf:not([data-text])').forEach(function (e) { var t = e.textContent.trim(); if (!t) return; e.setAttribute('data-text', t); e.textContent = ''; });
  }
  /* Fenster «Foto tauschen»: der Bildtitel steht ganz (das gemeinsame Werkzeug kürzt ihn auf 48 Zeichen mit «…»; der volle steht im title) */
  function ganz() {
    document.querySelectorAll('.ws-fwahl:not([data-ganz])').forEach(function (k) {
      k.setAttribute('data-ganz', '');
      var t = k.querySelector('.ws-fwahl__t'), voll = k.getAttribute('title');
      if (!t) return;
      var text = (voll && /…$/.test(t.textContent)) ? (/^Eigenes Foto · /.test(t.textContent) ? 'Eigenes Foto · ' : '') + voll : t.textContent;
      var i = text.lastIndexOf(' ');   /* die letzten zwei Wörter bleiben zusammen: nie ein Wort allein in der letzten Zeile (Kriterium 7) */
      t.textContent = '';   /* die letzten zwei Wörter in einer Zeile, die nicht bricht (auch nicht am Bindestrich) */
      if (i > 0) { var j = text.lastIndexOf(' ', i - 1), ende = document.createElement('span'); ende.style.whiteSpace = 'nowrap'; ende.textContent = text.slice(j + 1); t.append(text.slice(0, j + 1), ende); }
      else t.textContent = text;
    });
  }
  /* Kein «×» als Zählzeichen (K24, Tor 2, 30.10.2026): «Link · 4× auf der Seite» heisst «Link · an 4 Stellen der Seite», «Steht 9× …» heisst «Steht an 9 Stellen …» */
  function ohneX() {
    document.querySelectorAll('.ws-st small, .ws-ang__lage, .ws-hoch, .ws-hoch *').forEach(function (e) {
      if (e.children.length) return;
      var t = e.textContent; if (t.indexOf('×') < 0) return;
      e.textContent = t.replace(/(\d+)× auf der Seite/g, '$1-mal auf der Seite').replace(/Steht (\d+)×/g, 'Steht an $1 Stellen').replace(/(\d+)\s*×\s*(\d+)/g, '$1 auf $2').replace(/(\d+)×/g, '$1-mal');   /* Masse wie in der Werkstatt: «1600 auf 1067» */
    });
  }
  /* Knopf «Website ansehen» im Kopf: zwischen 901 und 1240 px nur der runde Knauf (bureau.css); sein Name bleibt für Vorlesegeräte als aria-label */
  function knaufName() {
    document.querySelectorAll('#ws-kopf a.wo-kn--gold:not([aria-label])').forEach(function (a) { var t = a.textContent.trim(); if (t) a.setAttribute('aria-label', t); });
  }
  var plan = 0;
  /* Lange Werte in Feldern des Stamms (Bildbeschreibung, Google-Titel, Links der Angaben): ein einzeiliges Feld versteckt den Anfang (Kriterium 2). Daneben
     steht ein Textfeld, das umbricht; das Feld des Stamms bleibt (verborgen) die Quelle: Eingaben gehen als «input» an es, Werte, die der Stamm setzt
     («Wie ursprünglich»), erscheinen im Textfeld. Zeilenumbrüche werden zu Leerzeichen, Enter fügt keinen ein. */
  var WERT = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  function langfeld() {
    document.querySelectorAll('input#ws-alt:not([data-lang]), input[id^="ws-gt-t-"]:not([data-lang]), input[id^="ws-ang-"][type="url"]:not([data-lang]), input[id^="ws-ang-"][type="text"]:not([data-lang])').forEach(function (f) {
      f.setAttribute('data-lang', '');
      var t = document.createElement('textarea');
      t.className = 'ws-langfeld'; t.rows = 1; t.spellcheck = false; t.setAttribute('autocomplete', 'off');
      var lb = f.id && document.querySelector('label[for="' + CSS.escape(f.id) + '"]');
      if (lb) { if (!lb.id) lb.id = 'lb-' + f.id; t.setAttribute('aria-labelledby', lb.id); }
      t.value = f.value;
      var hoch = function () { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; };
      var spiegel = function () { t.disabled = f.disabled; t.setAttribute('aria-invalid', f.getAttribute('aria-invalid') || 'false'); };
      Object.defineProperty(f, 'value', { configurable: true, get: function () { return WERT.get.call(this); }, set: function (v) { WERT.set.call(this, v); if (t.value !== String(v)) { t.value = v; hoch(); } } });
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
      t.addEventListener('input', function () { var v = t.value.replace(/\s*\n\s*/g, ' '); if (v !== t.value) t.value = v; WERT.set.call(f, v); f.dispatchEvent(new Event('input', { bubbles: true })); hoch(); });
      if (window.MutationObserver) new MutationObserver(spiegel).observe(f, { attributes: true, attributeFilter: ['disabled', 'aria-invalid'] });
      spiegel();
      f.style.display = 'none';
      f.after(t);
      requestAnimationFrame(hoch);
      if (document.activeElement === f) t.focus();
    });
  }
  /* Breite Kacheln unter «Häufig gebraucht»: das Foto in der nächsten Stufe der Website (-m, 900 px, statt -s, 480 px), sonst stand es unscharf vergrössert; fehlt die Stufe, bleibt das kleine */
  function scharf() {
    document.querySelectorAll('.ws-aufgaben > .wo-ag .wo-ag__b img:not([data-scharf])').forEach(function (i) {
      i.setAttribute('data-scharf', '');
      var alt = i.getAttribute('src') || '';
      if (!/-s\.webp/.test(alt)) return;
      i.addEventListener('error', function () { if (i.getAttribute('src') !== alt) i.setAttribute('src', alt); }, { once: true });
      i.setAttribute('src', alt.replace(/-s\.webp/, '-m.webp'));
    });
  }
  /* Angaben des Hauses: der Satz des Stamms nennt Adresse und Öffnungstage; das Haus führt hier Telefon, E-Mail und Ort (die Strasse veröffentlicht die Website nicht) */
  function angabenSatz() {
    var m = document.querySelector('#ws-mitte[data-ws-ansicht="angaben"]'); if (!m) return;
    m.querySelectorAll('p, span').forEach(function (e) { if (!e.children.length && /^Telefon, E-Mail, Adresse, Öffnungstage und die wichtigsten Links\./.test(e.textContent)) e.textContent = e.textContent.replace(/^Telefon, E-Mail, Adresse, Öffnungstage und die wichtigsten Links\./, 'Telefon, E-Mail und Ort des Hauses.'); });
  }
  /* Fotos der Foto-Gruppen eines Bereichs sofort laden und malen (WebKit malte spät geladene Bilder unter einem offenen Fenster nicht; Lösung wie in Anfragen & Chat) */
  function sofort() {
    document.querySelectorAll('.ws-fotos .ws-foto img:not([data-sofort]), .cu-t__bild img:not([data-sofort])').forEach(function (i) {
      i.setAttribute('data-sofort', ''); i.loading = 'eager'; i.decoding = 'sync';
    });
  }
  /* Häufig gebraucht: der Stamm nimmt für die Aufgaben die Fotos der Bereiche, jedes Foto stand so zweimal in der Übersicht (Auftrag: jedes Foto nur
     einmal je Ansicht). Hier je Aufgabe ein eigenes, passendes Foto der Website (website/inhalt/bilder.py), keins der Bereichskacheln. Zwei Namen des Stamms
     nach dem Haus: es veröffentlicht keine Strasse (Telefon oder E-Mail) und hat keine Öffnungszeiten, sondern Zeiten am Empfang und Preise. */
  var AUFG_FOTO = { 'Neue Jasswoche': 'w-fondue', 'Einen Text ändern': 'j-lounge', 'Preis oder Öffnungszeit': 'b-terrasse', 'Preis oder Zeiten': 'b-terrasse',
    'Telefon oder Adresse': 'h-vorne', 'Telefon oder E-Mail': 'h-vorne', 'Angebot ausblenden': 'sekt', 'Pauschale ausblenden': 'sekt', 'Foto tauschen': 'sp-gruen', 'Hinweis für Gäste': 'sp-garten',
    'Google-Texte': 'h-ausblick', 'Zimmer nachführen': 'z-modern' };
  var AUFG_NAME = { 'Preis oder Öffnungszeit': 'Preis oder Zeiten', 'Telefon oder Adresse': 'Telefon oder E-Mail', 'Angebot ausblenden': 'Pauschale ausblenden' };
  var AUFG_SATZ = { 'Pauschale ausblenden': 'Abgelaufenes nicht mehr zeigen.' };   /* der Bereich heisst hier «Pauschalen» */
  function aufgaben() {
    document.querySelectorAll('.ws-aufgaben > .wo-ag:not([data-haus-foto])').forEach(function (k) {
      var b = k.querySelector('.wo-ag__t > b'); if (!b) return;
      k.setAttribute('data-haus-foto', '');
      var t = b.textContent.replace(/\u00a0/g, ' ').trim();
      if (AUFG_NAME[t]) { t = AUFG_NAME[t]; b.textContent = t; }
      if (t === 'Telefon oder E-Mail') { b.textContent = 'Telefon '; var n = document.createElement('span'); n.style.whiteSpace = 'nowrap'; n.textContent = 'oder E-Mail'; b.append(n); }   /* nie «E-» und «Mail» getrennt */
      var sz = k.querySelector('.wo-ag__t > span'); if (AUFG_SATZ[t] && sz) sz.textContent = AUFG_SATZ[t];
      var f = AUFG_FOTO[t], i = k.querySelector('.wo-ag__b img');
      if (f && i) { i.setAttribute('data-scharf', ''); i.setAttribute('src', i.getAttribute('src').replace(/[^/]+-[sm]\.webp$/, f + '-m.webp')); }
    });
  }
  function nameZuerst() {
    document.querySelectorAll('.ws-eintrag__t:not([data-name-zuerst])').forEach(function (t) {
      var b = t.querySelector(':scope > b'); if (!b) return;
      t.setAttribute('data-name-zuerst', ''); t.insertBefore(b, t.firstChild);
      var m = t.querySelector(':scope > :not(b)');
      if (m && !m.children.length) {   /* der Punkt bleibt am Wort davor («3 Nächte ·» / «Halbpension»), die letzten zwei Wörter bleiben zusammen */
        var x = m.textContent.replace(/ · /g, '\u00a0· ');
        if (!/· \S+$/.test(x)) x = x.replace(/ (\S+)$/, '\u00a0$1');
        m.textContent = x;
      }
    });
  }
  function alles() { plan = 0; aufgaben(); nameZuerst(); sofort(); angabenSatz(); fest(); aendernZeichen(); ganz(); ohneX(); knaufName(); langfeld(); scharf(); }
  if (window.MutationObserver) new MutationObserver(function () { if (!plan) plan = requestAnimationFrame(alles); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
