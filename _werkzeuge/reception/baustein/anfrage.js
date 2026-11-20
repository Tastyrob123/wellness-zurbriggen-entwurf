/* Anschluss der Anfragen der Website an Anfragen & Chat · Wellness & Spa Pirmin Zurbriggen, Saas-Almagell (08.11.2026, Master Werkzeug-Bau E12/E24/E33,
   Muster: Baustein des Culinarium Hannover). Auf der Website führen alle Anfrage-Knöpfe («Anfragen» bei jedem Zimmer, «Suite anfragen», «Wunschtermin anfragen»
   und «Eintritt anfragen» im Spa, «Familie anfragen», «Anfrage senden» auf Kontakt) zur Hotelanfrage des Hauses (…/wohnen-buchen/hotelanfrage/).
   Mit diesem Baustein öffnet ein solcher Knopf stattdessen ein ruhiges Anfrage-Blatt auf der Seite (Anreise, Abreise, Gäste, Zimmer, Name, E-Mail oder Telefon,
   Nachricht); die Anfrage geht in den Eingang Anfragen & Chat, mit Art (Zimmer, Loft-Suite, Spa-Termin) und der Seite, von der sie kam.
   Geht etwas schief, bleibt alles Eingegebene stehen, und das Blatt nennt Telefon und E-Mail des Hauses. Ohne den Baustein bleibt die Website, wie sie ist.
   Einbinden (Website-Chat über unterseiten_neu.py, nicht von Hand): <script src="assets/js/anfrage.js?v={V}" defer></script> am Ende jeder Seite.
   Ziel: /_werkzeuge/reception/api/formular (anders mit <script … data-api="http://127.0.0.1:9404/_werkzeuge/reception/api/formular"> oder window.WS_ANFRAGE_API). */
(function () {
  'use strict';
  var D = document, skript = D.currentScript;
  var API = window.WS_ANFRAGE_API || (skript && skript.getAttribute('data-api')) || '/_werkzeuge/reception/api/formular';
  var WEGE = 'Telefon +41 27 957 23 01 oder info@wellnesshotel-zurbriggen.ch';
  var LINK = /\/wohnen-buchen\/hotelanfrage\//;
  var seiteName = function () { var t = (D.title || '').split(/ · | \| | — /)[0].trim(); return /^Wellness & Spa/.test(t) ? 'Startseite' : t; };
  /* Art der Anfrage aus Seite und Knopf: Spa-Termin im Spa, Loft-Suite auf ihrer Seite oder beim Knopf «Suite anfragen» der Loft, sonst Zimmer */
  function art(a) {
    var p = location.pathname, t = (a.textContent || '').trim();
    if (/spa\.html/.test(p)) return { art: 'spa', formular: 'spa' };
    if (/loft-suite\.html/.test(p) || /Suite anfragen/.test(t)) return { art: 'loft', formular: 'zimmer' };
    if (/familie\.html/.test(p)) return { art: 'zimmer', formular: 'familie' };
    if (/kontakt\.html|angebote\.html/.test(p)) return { art: /angebote/.test(p) ? 'angebot' : 'nachricht', formular: 'allgemein' };
    return { art: 'zimmer', formular: 'zimmer' };
  }
  var STIL = '.za-h{position:fixed;inset:0;z-index:90;display:flex;justify-content:flex-end;background:rgba(6,11,28,.38)}' +
    '.za-b{width:min(440px,100%);height:100%;overflow:auto;padding:34px 30px 40px;background:#F6F1EA;color:#0A1129;font:15px/1.55 "Instrument Sans",system-ui,sans-serif;box-shadow:inset 1px 0 0 rgba(217,183,88,.6),-30px 0 60px -30px rgba(6,11,28,.6)}' +
    '.za-b h2{font:300 30px/1.1 Montserrat,system-ui,sans-serif;margin:8px 0 18px}.za-b small{font:11px "DM Mono",monospace;letter-spacing:.16em;text-transform:uppercase;color:#8A6C22}' +
    '.za-b label{display:block;margin:0 0 12px}.za-b label span{display:block;font:10.5px "DM Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#4E5568;margin-bottom:4px}' +
    '.za-b input,.za-b textarea{width:100%;box-sizing:border-box;padding:11px 14px;border:0;border-radius:12px;background:#FBF8F3;box-shadow:inset 0 0 0 1px rgba(10,17,41,.16);font:inherit;color:inherit}' +
    '.za-z{display:grid;grid-template-columns:1fr 1fr;gap:12px}.za-k{display:flex;gap:12px;align-items:center;margin-top:18px}' +
    '.za-k button{border:0;border-radius:999px;padding:13px 22px;font:11px "DM Mono",monospace;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}' +
    '.za-los{background:linear-gradient(180deg,#E9D49A,#D9B758);color:#0A1129}.za-zu{background:none;color:#4E5568;box-shadow:inset 0 0 0 1px rgba(10,17,41,.2)}' +
    '.za-m{margin-top:16px;padding:12px 14px;border-radius:12px;background:#EEE8DE}.za-f{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}';
  function feld(n, t, typ, mehr) { return '<label><span>' + t + '</span>' + (typ === 'lang' ? '<textarea name="' + n + '" rows="4"' + (mehr || '') + '></textarea>' : '<input name="' + n + '" type="' + typ + '"' + (mehr || '') + '>') + '</label>'; }
  function blatt(a) {
    var x = art(a), zimmer = (a.closest('[id]') || {}).id || '';
    var h = D.createElement('div'); h.className = 'za-h';
    h.innerHTML = '<style>' + STIL + '</style><form class="za-b" novalidate><small>Anfrage</small><h2>' + (x.art === 'spa' ? 'Ihr Wunschtermin im Spa.' : x.art === 'loft' ? 'Ihre Tage in der Loft-Suite.' : 'Ihre Anfrage an das Haus.') + '</h2>' +
      '<div class="za-z">' + feld('an', x.art === 'spa' ? 'Wunschtag' : 'Anreise', 'date') + feld('ab', x.art === 'spa' ? 'Uhrzeit' : 'Abreise', x.art === 'spa' ? 'time' : 'date') + '</div>' +
      feld('personen', 'Gäste', 'number', ' min="1" max="12" value="2"') + feld('name', 'Name', 'text', ' autocomplete="name" required') +
      feld('kontakt', 'E-Mail oder Telefon', 'text', ' autocomplete="email" required') + feld('nachricht', 'Ihre Nachricht', 'lang') +
      '<input class="za-f" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div class="za-k"><button class="za-los" type="submit">Anfrage senden</button><button class="za-zu" type="button">Schliessen</button></div><p class="za-m" hidden></p></form>';
    var f = h.querySelector('form'), m = h.querySelector('.za-m'), w = function (n) { var e = f.querySelector('[name="' + n + '"]'); return e ? String(e.value || '').trim() : ''; };
    var zu = function () { h.remove(); };
    h.querySelector('.za-zu').onclick = zu; h.onclick = function (e) { if (e.target === h) zu(); };
    f.onsubmit = function (e) {
      e.preventDefault();
      if (!w('name') || !w('kontakt')) { m.hidden = false; m.textContent = 'Bitte Name und E-Mail oder Telefon angeben, damit das Haus antworten kann.'; return; }
      var tage = w('an') + (w('ab') && x.art !== 'spa' ? ' bis ' + w('ab') : ''), zeilen = [];
      if (zimmer) zeilen.push('Zimmer: ' + zimmer);
      zeilen.push((x.art === 'spa' ? 'Wunschtag: ' : 'Anreise: ') + (w('an') || '-'));
      zeilen.push((x.art === 'spa' ? 'Uhrzeit: ' : 'Abreise: ') + (w('ab') || '-'));
      zeilen.push('Gäste: ' + (w('personen') || '-'));
      if (w('nachricht')) zeilen.push('Ihre Nachricht: ' + w('nachricht'));
      var k = f.querySelector('.za-los'); k.disabled = true;
      fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ art: x.art, formular: x.formular, name: w('name'), kontakt: w('kontakt'),
        datum: tage, uhrzeit: x.art === 'spa' ? w('ab') : '', personen: w('personen'), allergene: [], anliegen: w('nachricht').slice(0, 300), nachricht: zeilen.join('\n'),
        seite: location.pathname + location.hash, seite_name: seiteName(), sprache: (D.documentElement.lang || 'de').slice(0, 2), website: w('website') }) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (r) {
          if (!r.ok) throw new Error(String((r.j && r.j.fehler) || '').replace(/^[A-ZÄÖÜ-]+ · /, '') || 'Ihre Anfrage kam nicht an.');
          f.innerHTML = '<small>Anfrage</small><h2>Herzlichen Dank.</h2><p>Ihre Anfrage liegt bei Esther und Fabian Zurbriggen. Sie melden sich persönlich bei Ihnen.</p><div class="za-k"><button class="za-zu" type="button">Schliessen</button></div>';
          f.querySelector('.za-zu').onclick = zu;
        })
        .catch(function (err) { m.hidden = false; m.textContent = (err && err.message && !/fetch|network|load/i.test(err.message) ? err.message : 'Ihre Anfrage kam nicht an.') + ' Bitte gleich noch einmal versuchen, oder direkt: ' + WEGE + '.'; k.disabled = false; });
    };
    D.body.appendChild(h); f.querySelector('input').focus();
  }
  D.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !LINK.test(a.getAttribute('href') || '')) return;
    e.preventDefault(); e.stopImmediatePropagation(); blatt(a);
  }, true);
})();
