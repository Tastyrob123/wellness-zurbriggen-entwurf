/* pruefung-haus.js · Prüfseite im Rahmen des Wellness & Spa Pirmin Zurbriggen (08.11.2026; Vorlage Wild Side und Culinarium, aus dem Vorbild Schäfli): Name des Werkzeugs aus der einen Stelle, «Zum Werkzeug» führt in dieses Werkzeug, nicht in den Stamm. */
(function () {
  var z = document.getElementById('wsp-zurueck'); if (z) z.href = '/_werkzeuge/bureau/';
  var n = window.WO_HAUS && WO_HAUS.namen && WO_HAUS.namen.website;
  /* welt.js des Stamms füllt [data-werkzeug] erst nach dem Laden mit seinem Weltnamen («Le Bureau»): der Name des Hauses wird danach noch einmal gesetzt */
  function setze() { if (n) { document.querySelectorAll('[data-werkzeug]').forEach(function (e) { if (e.textContent !== n) e.textContent = n; }); document.title = 'Prüfung · ' + n + ' · ' + WO_HAUS.name; } }
  setze(); document.addEventListener('DOMContentLoaded', setze); window.addEventListener('load', function () { setze(); setTimeout(setze, 200); });
})();
/* Jasswochen (08.11.2026, Vorlage: Termine des Culinarium, DJ-Abende von Wild Side): eigener Teil der Prüfung (Quelle website/inhalt/daten.py › JASS, Stelle der Seite, Speicher,
   Sicherung) und die Lexikon-Einträge der Stichworte aus termine.py und termine-ansicht.js. Das Lexikon des Stamms bleibt unverändert; diese Einträge
   stehen darunter mit eigener Kennung lex-<stichwort> und öffnen sich, wenn «Was tun?» dorthin führt. */
(function () {
  var LEX = [
    { id: 'termine-quelle', titel: 'Die Jasswochen der Website sind nicht lesbar', sehen: 'Die Ansicht «Jasswochen» startet nicht, oder hier steht «Jasswochen der Website» rot.',
      grund: 'Die Jasswochen stehen auf der Website als Liste «JASS › wochen» in website/inhalt/daten.py. Die Website wurde umgebaut und die Liste fehlt oder hat eine neue Form.',
      tun: 'Nichts ist verloren: Entwurf und veröffentlichte Jasswochen liegen im Speicher des Werkzeugs. Die Liste in website/inhalt/daten.py wieder so bauen lassen (Wortlaut wie «10-15. Januar 2027» und erster Tag), dann diese Seite neu laden.' },
    { id: 'termine-stelle', titel: 'Die Seite «Angebote» hat keinen Platz mehr für die Jasswochen', sehen: 'Hier steht «Stelle auf der Seite Angebote» rot, oder die Seite zeigt nach dem Veröffentlichen die alten Wochen.',
      grund: 'Die Seite «Angebote» wurde umgebaut; der Abschnitt «Jasswochen» mit der Liste der Wochen sieht anders aus.', tun: 'Die Website zeigt weiter ihre gebauten Wochen. Die Seite neu bauen lassen, dann diese Seite neu laden.' },
    { id: 'termine-speicher', titel: 'Der Speicher der Jasswochen ist beschädigt', sehen: 'Meldung «SPEICHER · Die Datei der Jasswochen und ihre Sicherung sind beide unlesbar».',
      grund: 'Die Datei _werkzeuge/bureau/_daten/termine.json und ihre Sicherung termine.json.gut sind beide kaputt (zum Beispiel von Hand geändert).',
      tun: 'Die Website zeigt weiter die Jasswochen, wie sie gebaut ist. Die Datei aus einer Sicherung des Rechners zurückholen oder beide Dateien entfernen: dann gilt wieder der ursprüngliche Stand.' },
    { id: 'termin-datum', titel: 'Diesen Tag gibt es nicht', sehen: 'Meldung «DATUM · Der erste (letzte) Tag fehlt oder diesen Tag gibt es nicht», die Karte zeigt «Den ersten Tag gibt es nicht».',
      grund: 'Tag und Monat passen nicht zusammen, zum Beispiel der 31. November.', tun: 'Tag, Monat und Jahr neu wählen, dann speichern.' },
    { id: 'termin-folge', titel: 'Der letzte Tag liegt vor dem ersten', sehen: 'Meldung «FOLGE · Der letzte Tag liegt nach dem ersten».',
      grund: 'Beim Verschieben wurde nur der erste Tag geändert, der letzte steht noch davor.', tun: 'Den letzten Tag nach dem ersten wählen, dann speichern.' },
    { id: 'termin-monat', titel: 'Die Woche reicht in den nächsten Monat', sehen: 'Meldung «MONAT · Erster und letzter Tag liegen im selben Monat».',
      grund: 'Auf der Seite «Angebote» steht jede Woche als «10–15. Januar 2027», mit einem Monat.', tun: 'Die Woche so legen, dass sie in einem Monat beginnt und endet, dann speichern.' },
    { id: 'termin-lang', titel: 'Die Woche ist zu lang', sehen: 'Meldung «LÄNGE · Eine Jasswoche dauert höchstens 14 Tage».',
      grund: 'Zwischen erstem und letztem Tag liegen mehr als zwei Wochen; vermutlich ist ein Monat oder ein Tag verwählt.', tun: 'Den letzten Tag prüfen, dann speichern.' },
    { id: 'termin-doppelt', titel: 'Zwei Jasswochen überschneiden sich', sehen: 'Meldung «DOPPELT · Zwei Jasswochen überschneiden sich».',
      grund: 'Eine Woche wurde zweimal angelegt oder in die Tage einer anderen verschoben.', tun: 'Bei einer der beiden die Tage ändern, oder sie mit «Wieder entfernen» herausnehmen.' },
    { id: 'termin-leer', titel: 'Keine Jasswoche mehr in der Liste', sehen: 'Meldung «LEER · Mindestens eine Jasswoche bleibt auf der Seite «Angebote»».',
      grund: 'Ohne Woche stünde der Abschnitt «Jasswochen» ohne Daten auf der Seite.', tun: '«Wie gespeichert» oder «Neue Jasswoche» füllt die Liste wieder, dann speichern.' },
    { id: 'termin-viele', titel: 'Zu viele Jasswochen', sehen: 'Meldung «JASSWOCHEN · Höchstens 12 Jasswochen stehen gleichzeitig auf der Website».',
      grund: 'Die Liste neben dem Bild bleibt so lesbar.', tun: 'Vergangene Wochen «Von der Seite nehmen», dann speichern.' },
    { id: 'termin-falsch', titel: 'Eine Jasswoche ist unvollständig', sehen: 'Meldung «JASSWOCHE · …» mit Kennung oder Liste.',
      grund: 'Die Anfrage kam nicht aus dem Werkzeug oder wurde unterwegs verändert.', tun: 'Die Seite neu laden und die Eingabe wiederholen. Bleibt es, den Wortlaut der Meldung Ihrem Ansprechpartner schicken.' },
    { id: 'fassung-unbekannt', titel: 'Diese frühere Fassung gibt es nicht mehr', sehen: 'Meldung «FASSUNG · Diese frühere Fassung gibt es nicht».',
      grund: 'Die Liste der früheren Fassungen hält die letzten 60; ältere fallen heraus.', tun: 'Die Seite neu laden und eine Fassung aus der Liste wählen, oder den ursprünglichen Stand.' },
    { id: 'netz', titel: 'Der Server antwortet nicht', sehen: 'Meldung «NETZ · Der Server des Werkzeugs antwortet nicht».',
      grund: 'Die Verbindung ist weg oder der Server des Werkzeugs läuft nicht.', tun: 'Ihre Eingaben bleiben stehen. Verbindung prüfen, dann noch einmal «Speichern». Läuft der Server nicht: python3 _werkzeuge/bureau/serve.py 9402 im Hausordner.' }
  ];
  function el(tag, attrs, kinder) { var e = document.createElement(tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); (kinder || []).forEach(function (k) { e.append(k); }); return e; }
  var lex = document.querySelector('[aria-labelledby="wsp-t4"]');
  if (!lex) return;
  var teil = el('section', { class: 'wsp-teil', 'aria-labelledby': 'wsp-t-termine', 'data-cu-pruefung': 'termine' }, [
    el('div', {}, [el('p', { class: 'kap' }, [el('span', {}, ['Viertens'])]), el('h2', { class: 't-zwischen', id: 'wsp-t-termine' }, ['Jasswochen'])]),
    el('div', { class: 'platte wsp-punkte', id: 'cu-termine-punkte' }, [el('p', { class: 'wsp-wartet' }, ['Wird geprüft …'])])]);
  lex.parentNode.insertBefore(teil, lex);
  var ort = el('div', { class: 'wsp-lexikon', id: 'cu-lexikon' });
  lex.append(el('p', { class: 'kap', style: 'margin-top:28px' }, [el('span', {}, ['Jasswochen'])]), ort);
  LEX.forEach(function (l) {
    ort.append(el('details', { class: 'platte wsp-lex', id: 'lex-' + l.id }, [el('summary', {}, [l.titel]),
      el('dl', {}, [el('dt', { class: 'angabe' }, ['Sehen']), el('dd', {}, [l.sehen]), el('dt', { class: 'angabe' }, ['Grund']), el('dd', {}, [l.grund]), el('dt', { class: 'angabe' }, ['Tun']), el('dd', {}, [l.tun])])]));
  });
  function oeffne() {
    var e = location.hash.indexOf('#lex-') === 0 && document.getElementById(location.hash.slice(1));
    if (e && ort.contains(e)) { e.open = true; setTimeout(function () { e.scrollIntoView({ block: 'start' }); }, 0); }
  }
  window.addEventListener('hashchange', oeffne); oeffne();
  ['/_werkzeuge/bureau/api/termine/pruefung'].forEach(function (adr, nr) { fetch(adr, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) {
    var p = document.getElementById('cu-termine-punkte'), w = p.querySelector('.wsp-wartet'); if (w) w.remove();
    (d.punkte || []).forEach(function (x) {
      p.append(el('div', { class: 'wsp-punkt', 'data-gut': x.gut ? 'ja' : 'nein', 'data-punkt': nr ? 'gaeste' : 'termine', style: 'order:' + nr }, [
        el('span', { class: 'wsp-punkt__z' }, [x.gut ? '✓' : '–']), el('span', { class: 'wsp-punkt__t' }, [x.titel]),
        el('span', { class: 'wsp-punkt__x' }, [x.text + ' ', !x.gut && x.stichwort ? el('a', { href: '#lex-' + x.stichwort }, ['Was tun?']) : ''])]));
    });
  }).catch(function () { var p = document.getElementById('cu-termine-punkte'); p.textContent = 'Der Server des Werkzeugs antwortet nicht (Stichwort netz).'; }); });
})();
