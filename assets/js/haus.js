/* Wellness & Spa Pirmin Zurbriggen · Bedienung. Nur transform und opacity, nativer Scroll, nichts springt, kein Einblenden aus Unsichtbar.
   Auslöser der Auftritte (.da), Puls einmal (.fertig), Leiste oben, Handy-Menü, Buchungsleiste mit Kalender im Hausstil.
   Die Bausteine der Abschnitte (Wegweiser, Holzscheiben-Wand, Wärmeleiter, Grössenleiter …) stehen je in einem eigenen Block weiter unten. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); }, $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]nomotion/.test(location.search);
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- Überschriften in Zeilen schneiden: je echte Zeile ein Schlitz (.z); vorgeschnittene (.z im HTML) bleiben ---------- */
  function zeilen(el) {
    if (el.dataset.gez || el.querySelector('.z')) return; el.dataset.gez = '1';
    var text = el.textContent, emText = (el.querySelector('em') || {}).textContent || '';
    var worte = text.split(/\s+/).filter(Boolean);
    el.textContent = ''; var probe = document.createElement('span'); el.appendChild(probe);
    var zz = [], akt = [], letzteH = null;
    worte.forEach(function (w) {
      probe.textContent = akt.concat(w).join(' ');
      var h = probe.getBoundingClientRect().height;
      if (letzteH !== null && h > letzteH + 2 && akt.length) { zz.push(akt); akt = [w]; probe.textContent = w; letzteH = probe.getBoundingClientRect().height; }
      else { akt.push(w); letzteH = h; }
    });
    if (akt.length) zz.push(akt);
    el.textContent = '';
    var emWorte = emText ? emText.split(/\s+/) : [];
    zz.forEach(function (z) {
      var inner = z.map(function (w) { return emWorte.indexOf(w) >= 0 && emText ? '<em>' + esc(w) + '</em>' : esc(w); }).join(' ').replace(/<\/em> <em>/g, ' ');
      el.insertAdjacentHTML('beforeend', '<span class="z"><span>' + inner + '</span></span>');
    });
  }
  $$('.d1,.d2,[data-z]').forEach(zeilen);
  var bz, breite = innerWidth; addEventListener('resize', function () { if (innerWidth === breite) return; breite = innerWidth; clearTimeout(bz); bz = setTimeout(function () { $$('.d2[data-gez],[data-z][data-gez]').forEach(function (el) { var em = el.querySelector('em'); var t = el.textContent, e = em ? em.textContent : ''; el.dataset.gez = ''; el.innerHTML = e ? esc(t.slice(0, t.indexOf(e))) + '<em>' + esc(e) + '</em>' + esc(t.slice(t.indexOf(e) + e.length)) : esc(t); zeilen(el); el.classList.add('da'); }); }, 250); }, { passive: true });

  /* ---------- Auslöser: alles mit data-r, Überschriften, Bausteine; .da sobald im Bild, .fertig nach dem Puls ---------- */
  var ziele = $$('[data-r], .d1, .d2, [data-z], [data-baustein], .rahmen.gleit');
  if (ruhig || !('IntersectionObserver' in window)) { ziele.forEach(function (el) { el.classList.add('da', 'fertig'); }); $$('.auf').forEach(function (a) { a.classList.add('da'); }); }
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var el = e.target; el.classList.add('da');
        el.addEventListener('animationend', function (ev) { if (ev.animationName === 'puls') el.classList.add('fertig'); });
        setTimeout(function () { el.classList.add('fertig'); }, 3400);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    ziele.forEach(function (el) { if (el.closest('.auf')) return; io.observe(el); });
    /* Auftakt: sofort nach dem ersten Bild, ohne auf das Scrollen zu warten */
    var auf = $('.auf');
    if (auf) { var los = function () { requestAnimationFrame(function () { auf.classList.add('da'); $$('[data-r], .d1, [data-z]', auf).forEach(function (el) { el.classList.add('da', 'fertig'); }); }); }; var bild = $('.auf__f img', auf); if (bild && !bild.complete) { bild.addEventListener('load', los, { once: true }); setTimeout(los, 900); } else los(); }
  }

  /* ---------- Leiste oben: verschwindet beim Runterscrollen, kommt beim Hochscrollen zurück ---------- */
  var nav = $('.nav'); if (nav) {
    var y0 = scrollY, anker = scrollY, richt = 0, tick = false;
    addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false; var y = scrollY, d = y > y0 ? 1 : -1; if (d !== richt) { richt = d; anker = y; }
        if (y < 140) nav.classList.remove('weg');
        else if (richt > 0 && y - anker > 24) nav.classList.add('weg');
        else if (richt < 0 && anker - y > 24) nav.classList.remove('weg');
        y0 = y;
      });
    }, { passive: true });
    var menue = $('.menue'), burger = $('.burger');
    if (menue && burger) { burger.addEventListener('click', function () { menue.classList.add('offen'); }); $('.menue .zu').addEventListener('click', function () { menue.classList.remove('offen'); }); $$('.menue a').forEach(function (a) { a.addEventListener('click', function () { menue.classList.remove('offen'); }); }); }
  }

  /* ---------- Buchungsleiste: Anreise, Abreise, Gäste mit Kalender im Hausstil, dann in die Buchungsmaske des Hauses (vioma bleibt) ---------- */
  var MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var zwei = function (n) { return (n < 10 ? '0' : '') + n; }, iso = function (d) { return d.getFullYear() + '-' + zwei(d.getMonth() + 1) + '-' + zwei(d.getDate()); };
  var zeig = function (d) { return d.getDate() + '. ' + MON[d.getMonth()].slice(0, 3) + (MON[d.getMonth()].length > 4 ? '.' : '') + ' ' + d.getFullYear(); };
  $$('form.leiste').forEach(function (fo) {
    var heute = new Date(); heute.setHours(0, 0, 0, 0);
    var an = new Date(heute); an.setDate(an.getDate() + 1); var ab = new Date(an); ab.setDate(ab.getDate() + 3); var gaeste = 2, offen = null;
    var bAn = $('[data-an]', fo), bAb = $('[data-ab]', fo), bG = $('[data-g]', fo);
    function male() { bAn.textContent = zeig(an); bAb.textContent = zeig(ab); bG.textContent = gaeste + (gaeste === 1 ? ' Gast' : ' Gäste'); }
    function schliesse() { if (offen) { offen.classList.remove('offen'); offen = null; } }
    function kalender(wahl, start) {
      var monat = new Date(start.getFullYear(), start.getMonth(), 1), k = document.createElement('div'); k.className = 'wahlkarte';
      function bau() {
        var erster = (monat.getDay() + 6) % 7, tage = new Date(monat.getFullYear(), monat.getMonth() + 1, 0).getDate(), h = '<header><button type="button" data-m="-1" aria-label="Monat zurück">‹</button><span>' + MON[monat.getMonth()] + ' ' + monat.getFullYear() + '</span><button type="button" data-m="1" aria-label="Monat vor">›</button></header><div class="wt"><span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span></div><div class="tage">';
        for (var i = 0; i < erster; i++) h += '<span></span>';
        for (var t = 1; t <= tage; t++) { var d = new Date(monat.getFullYear(), monat.getMonth(), t), s = iso(d), min = wahl === 'an' ? heute : new Date(an.getTime() + 864e5), kl = s === iso(wahl === 'an' ? an : ab) ? ' class="gew"' : (d > an && d < ab ? ' class="zw"' : ''); h += '<button type="button" data-t="' + s + '"' + kl + (d < min ? ' disabled' : '') + '>' + t + '</button>'; }
        k.innerHTML = h + '</div>';
      }
      bau();
      k.addEventListener('click', function (e) {
        e.stopPropagation();
        var m = e.target.closest('[data-m]'); if (m) { monat.setMonth(monat.getMonth() + +m.dataset.m); bau(); return; }
        var t = e.target.closest('[data-t]'); if (!t || t.disabled) return;
        var p = t.dataset.t.split('-'), d = new Date(+p[0], p[1] - 1, +p[2]);
        if (wahl === 'an') { an = d; if (ab <= an) { ab = new Date(an); ab.setDate(ab.getDate() + 1); } } else ab = d;
        male(); schliesse();
      });
      return k;
    }
    function zahl() {
      var k = document.createElement('div'); k.className = 'wahlkarte wahlkarte--g';
      function bau() { k.innerHTML = '<div class="gz"><button type="button" data-d="-1" aria-label="Weniger">–</button><span>' + gaeste + (gaeste === 1 ? ' Gast' : ' Gäste') + '</span><button type="button" data-d="1" aria-label="Mehr">+</button></div>'; }
      bau();
      k.addEventListener('click', function (e) { e.stopPropagation(); var b = e.target.closest('[data-d]'); if (!b) return; gaeste = Math.max(1, Math.min(6, gaeste + +b.dataset.d)); bau(); male(); });
      return k;
    }
    [[bAn, 'an'], [bAb, 'ab'], [bG, 'g']].forEach(function (p) {
      p[0].addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation(); var war = offen && offen.parentElement === p[0].parentElement; schliesse(); if (war) return;
        var k = p[1] === 'g' ? zahl() : kalender(p[1], p[1] === 'an' ? an : ab); p[0].parentElement.appendChild(k); requestAnimationFrame(function () { requestAnimationFrame(function () { k.classList.add('offen'); }); }); offen = k;
        k.addEventListener('transitionend', function () { if (!k.classList.contains('offen') && k.parentElement) k.remove(); });
      });
    });
    document.addEventListener('click', function (e) { if (offen && !e.target.closest('.wahlkarte')) schliesse(); });
    fo.addEventListener('submit', function (e) { e.preventDefault(); window.open(fo.getAttribute('action'), '_blank', 'noopener'); });
    male();
  });
})();

/* ---------- Holzscheiben-Wand: Antippen macht einen Kreis gross, die anderen rücken (nur transform), der Name darunter wechselt hart ---------- */
(function () {
  [].forEach.call(document.querySelectorAll('.wand'), function (w) {
    var name = w.parentElement.querySelector('.wand__name span');
    w.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      var li = b.parentElement, war = li.classList.contains('gross');
      [].forEach.call(w.querySelectorAll('.scheibe'), function (s) { s.classList.add('fertig'); s.classList.remove('gross'); s.firstElementChild.setAttribute('aria-pressed', 'false'); });
      if (war) { w.classList.remove('gewaehlt'); return; }
      li.classList.add('gross'); b.setAttribute('aria-pressed', 'true'); w.classList.add('gewaehlt'); if (name) name.textContent = b.dataset.name;
    });
  });
})();

/* ---------- Reiter Sommer/Winter: der Reiter gleitet, das Band wechselt hart (Texte nie überblenden), die Kacheln schweben neu herauf ---------- */
(function () {
  [].forEach.call(document.querySelectorAll('.reiter'), function (r) {
    var sek = r.closest('section');
    r.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-ziel]'); if (!b) return; var w = b.dataset.ziel;
      r.dataset.w = w; [].forEach.call(r.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      [].forEach.call(sek.querySelectorAll('.saa__w'), function (s) {
        var an = s.dataset.w === w; s.hidden = !an; var band = s.querySelector('.band');
        if (an && band) { band.classList.remove('da'); void band.offsetWidth; requestAnimationFrame(function () { band.classList.add('da'); }); }
      });
    });
  });
})();

/* ---------- Kofferanhänger: Reiter Gepäck, Bahn, Auto, Flugzeug wechseln die Seite hart ---------- */
(function () {
  [].forEach.call(document.querySelectorAll('.haenger__reiter'), function (r) {
    var karte = r.closest('.haenger__karte');
    r.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-seite]'); if (!b) return;
      [].forEach.call(r.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      [].forEach.call(karte.querySelectorAll('.haenger__seite'), function (s) { s.hidden = s.dataset.seite !== b.dataset.seite; });
    });
  });
})();

/* ---------- Haus-Finder der Familie: Antworten rasten ein, die erste passende Regel bestimmt das Haus, die Karte schwebt neu herauf ---------- */
(function () {
  [].forEach.call(document.querySelectorAll('[data-finder]'), function (f) {
    var daten = JSON.parse(f.querySelector('script[type="application/json"]').textContent), wahl = {};
    var t = f.querySelector('.treffer'), img = t.querySelector('img'), small = t.querySelector('small'), h3 = t.querySelector('h3'), p = t.querySelector('p'), b = t.querySelector('b'), a = t.querySelector('a.kn');
    function passt(r) { return Object.keys(r.wenn).every(function (k) { return wahl[k] && r.wenn[k].indexOf(wahl[k]) >= 0; }); }
    f.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-wert]'); if (!btn) return; var s = btn.parentElement;
      [].forEach.call(s.children, function (x) { x.setAttribute('aria-pressed', String(x === btn)); }); wahl[s.dataset.frage] = btn.dataset.wert;
      var r = daten.regeln.filter(passt)[0] || daten.regeln[daten.regeln.length - 1], h = daten.haeuser[r.haus];
      if (img.dataset.src) { img.removeAttribute('data-src'); img.removeAttribute('data-srcset'); }
      img.removeAttribute('srcset'); img.src = h.bild; img.alt = h.alt; small.textContent = h.ort + ' · ' + h.gast; h3.textContent = h.name; p.textContent = r.satz; b.textContent = h.ab;
      a.querySelector('span').textContent = h.knopf; a.setAttribute('href', h.link); if (/^http/.test(h.link)) { a.target = '_blank'; a.rel = 'noopener'; } else { a.removeAttribute('target'); }
      t.classList.remove('neu'); void t.offsetWidth; t.classList.add('neu');
    });
  });
})();

/* ---------- Zimmer: Schlüsselbrett wählt die Zimmerkarte (hart), Planken und Zimmer-Finder hängen den Schlüssel bereit ---------- */
(function () {
  var brett = document.querySelector('.brett'); if (!brett) return;
  function waehle(k, scrollen) {
    [].forEach.call(brett.querySelectorAll('.schluessel'), function (s) { s.setAttribute('aria-pressed', String(s.dataset.zimmer === k)); });
    [].forEach.call(document.querySelectorAll('.zk'), function (z) { var an = z.dataset.zimmer === k; z.hidden = !an; if (an) { z.classList.remove('neu'); void z.offsetWidth; z.classList.add('neu'); } });
    if (scrollen) { var ziel = document.getElementById('brett'); if (ziel) scrollTo({ top: ziel.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' }); }
  }
  brett.addEventListener('click', function (ev) { var b = ev.target.closest('.schluessel'); if (b) { brett.classList.remove('da'); waehle(b.dataset.zimmer, false); } });
  [].forEach.call(document.querySelectorAll('.planke[data-zimmer]'), function (a) { a.addEventListener('click', function (ev) { ev.preventDefault(); waehle(a.dataset.zimmer, true); }); });
  var f = document.querySelector('[data-zfinder]'); if (!f) return;
  var Z = JSON.parse(f.dataset.zfinder), wahl = {}, t = f.querySelector('.zf__treffer'), vorschlag = null;
  function regel() {
    var p = wahl.pers, w = wahl.wichtig, k = wahl.kinder;
    if (p === '6') return w === 'wellness' ? 'seniorsuite' : 'familie-45';
    if (p === '4') return k === 'ja' && w !== 'wellness' ? 'familie-45' : (w === 'wellness' ? 'seniorsuite' : 'suite');
    if (w === 'wellness') return 'loft'; if (w === 'balkon') return 'wallis-classic'; if (w === 'ruhe') return 'wallis-modern'; return 'nice-price';
  }
  f.addEventListener('click', function (ev) {
    var z = ev.target.closest('[data-zeigen]'); if (z) { ev.preventDefault(); if (vorschlag) waehle(vorschlag, true); return; }
    var b = ev.target.closest('[data-wert]'); if (!b) return; var s = b.parentElement;
    [].forEach.call(s.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); }); wahl[s.dataset.frage] = b.dataset.wert;
    vorschlag = regel(); var d = Z[vorschlag];
    t.querySelector('b').textContent = d.name; t.querySelector('p').textContent = d.leit + ' · ' + d.mz + ' · ' + d.preis;
    t.classList.remove('neu'); void t.offsetWidth; t.classList.add('neu');
  });
})();

/* ---------- Was in Ihrem Preis steckt: liest Anreise und Abreise aus der Leiste daneben und zählt Abende, Morgen, Sonntage ---------- */
(function () {
  var r = document.querySelector('[data-preisinhalt]'); if (!r) return;
  var P = JSON.parse(r.dataset.preisinhalt), leiste = r.closest('section').querySelector('form.leiste'), MON = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function lies(t) { var m = /(\d+)\.\s*(\S+)\s+(\d{4})/.exec(t || ''); if (!m) return null; var k = m[2].replace('.', '').slice(0, 3), i = -1; MON.forEach(function (x, j) { if (x.replace('.', '').slice(0, 3) === k) i = j; }); return i < 0 ? null : new Date(+m[3], i, +m[1]); }
  function male() {
    var an = lies(leiste.querySelector('[data-an]').textContent), ab = lies(leiste.querySelector('[data-ab]').textContent); if (!an || !ab) return;
    var n = Math.max(1, Math.round((ab - an) / 864e5)), so = 0; for (var d = new Date(an); d < ab; d.setDate(d.getDate() + 1)) if (d.getDay() === 0) so++;
    r.querySelector('[data-tage]').textContent = n + (n === 1 ? ' Nacht' : ' Nächte');
    var h = '<h4>Jeden Tag</h4><ul>' + P.je_nacht.map(function (x, i) { return '<li class="neu" style="--i:' + i + '"><span>' + esc(x[0]) + '</span><b>' + n + ' ' + esc(x[1]) + '</b></li>'; }).join('');
    if (so) h += '<li class="neu" style="--i:3"><span>' + esc(P.sonntag) + '</span><b>' + so + ' ' + (so === 1 ? 'Sonntag' : 'Sonntage') + '</b></li>';
    h += '</ul><h4>Während Ihres Aufenthalts</h4><ul>' + P.immer.map(function (x, i) { return '<li class="neu" style="--i:' + (i + 4) + '"><span>' + esc(x) + '</span><b>inklusive</b></li>'; }).join('') + '</ul>';
    h += '<h4>Inklusive im Sommer, laut Haus</h4><ul>' + P.sommer.map(function (x) { return '<li><span>' + esc(x) + '</span><em>Sommer</em></li>'; }).join('') + '</ul>';
    h += '<h4>Inklusive im Winter, laut Haus</h4><ul>' + P.winter.map(function (x) { return '<li><span>' + esc(x) + '</span><em>Winter</em></li>'; }).join('') + '</ul>';
    r.querySelector('[data-zeilen]').innerHTML = h;
  }
  new MutationObserver(male).observe(leiste, { subtree: true, childList: true, characterData: true }); male();
})();

/* ---------- Die Treppe: jede Stufe tritt beim Scrollen einzeln an ihren Platz (Stufe für Stufe hinunter) ---------- */
(function () {
  var s = document.querySelectorAll('[data-stufe]'); if (!s.length) return;
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { [].forEach.call(s, function (x) { x.classList.add('da'); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('da'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
  [].forEach.call(s, function (x) { io.observe(x); });
})();

/* ---------- Behandlungskarte: Reiter wechseln die Liste hart, Zeilen schweben gestaffelt; Wunschtermin öffnet die Terminkarte ---------- */
(function () {
  var r = document.querySelector('.bk__reiter'); if (r) r.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-liste]'); if (!b) return;
    [].forEach.call(r.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    [].forEach.call(document.querySelectorAll('.bk__liste'), function (l) { var an = l.dataset.liste === b.dataset.liste; l.hidden = !an; if (an) { l.classList.remove('neu'); void l.offsetWidth; l.classList.add('neu'); } });
  });
  var t = document.querySelector('.termin'); if (!t) return;
  var TAG = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var was = '', tag = null, zeit = 'Vormittag', tage = t.querySelector('[data-tage]'), senden = t.querySelector('[data-senden]');
  function link() { var d = tag ? tag.getDate() + '. ' + MON[tag.getMonth()] + ' ' + tag.getFullYear() : ''; senden.href = 'mailto:' + t.dataset.mail + '?subject=' + encodeURIComponent('Wunschtermin Spa: ' + was) + '&body=' + encodeURIComponent('Guten Tag\n\nGerne würde ich folgende Anwendung reservieren:\n' + was + '\nWunschtag: ' + d + ', ' + zeit + '\n\nFreundliche Grüsse\n'); }
  function baue() { var h = '', heute = new Date(); heute.setHours(0, 0, 0, 0); for (var i = 1; i <= 14; i++) { var d = new Date(heute); d.setDate(d.getDate() + i); h += '<button type="button" data-i="' + i + '" aria-pressed="' + (i === 1) + '">' + TAG[d.getDay()] + '<b>' + d.getDate() + '</b></button>'; } tage.innerHTML = h; tag = new Date(heute); tag.setDate(tag.getDate() + 1); }
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-termin]'); if (b) { was = b.dataset.termin; t.querySelector('[data-was]').textContent = was; baue(); link(); t.classList.add('offen'); return; }
    if (ev.target === t || ev.target.closest('.termin__zu')) { t.classList.remove('offen'); return; }
    var d = ev.target.closest('.termin__tage [data-i]'); if (d) { [].forEach.call(tage.children, function (x) { x.setAttribute('aria-pressed', String(x === d)); }); tag = new Date(); tag.setHours(0, 0, 0, 0); tag.setDate(tag.getDate() + +d.dataset.i); link(); return; }
    var z = ev.target.closest('.termin [data-wert]'); if (z) { [].forEach.call(z.parentElement.children, function (x) { x.setAttribute('aria-pressed', String(x === z)); }); zeit = z.dataset.wert; link(); }
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') t.classList.remove('offen'); });
})();

/* ---------- Die Gänge: Wahl je Gang (Kuhle springt), der Teller dreht sich zum Gang, der gerade im Blick ist ---------- */
(function () {
  var tr = document.querySelector('[data-teller]'); if (!tr) return;
  var bilder = tr.querySelectorAll('img'), name = document.querySelector('[data-gangname]'), akt = 0;
  function zeige(i) { if (i === akt) return; akt = i; [].forEach.call(bilder, function (b, j) { b.classList.toggle('an', j === i); }); if (name) name.textContent = (i + 1) + '. Gang'; }
  [].forEach.call(document.querySelectorAll('.gang'), function (g) {
    g.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (!b) return; [].forEach.call(b.parentElement.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); }); zeige(+g.dataset.gang); });
  });
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) zeige(+e.target.dataset.gang); }); }, { rootMargin: '-45% 0px -45% 0px' });
  [].forEach.call(document.querySelectorAll('.gang'), function (g) { io.observe(g); });
})();

/* ---------- Der Sonnenbogen: die Sonne wandert beim Scrollen über den Bogen (nur transform, ein Element in Bewegung) ---------- */
(function () {
  var s = document.querySelector('[data-sonne]'); if (!s) return; var bg = s.parentElement, tick = false;
  function lauf() { tick = false; var r = bg.getBoundingClientRect(), h = innerHeight, p = Math.min(1, Math.max(0, (h - r.top) / (h + r.height * .4))); s.style.setProperty('--w', (-80 + p * 160).toFixed(2) + 'deg'); }
  function r() { var w = bg.clientWidth; s.firstElementChild.style.top = (-(w * .47) - 26) + 'px'; s.style.top = (bg.clientWidth * 500 / 1000) + 'px'; }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(lauf); } }, { passive: true }); addEventListener('resize', function () { r(); lauf(); }); r(); lauf();
})();

/* ---------- Tischkärtchen: stellen sich einmal auf, wenn sie ins Bild kommen ---------- */
(function () {
  var k = document.querySelector('.kaertchen'); if (!k) return;
  if (!('IntersectionObserver' in window)) { k.classList.add('da'); return; }
  var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { k.classList.add('da'); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' }); io.observe(k);
})();

/* ---------- Messlatte und Spielkisten: einmal auslösen, wenn sie ins Bild kommen ---------- */
(function () {
  var el = document.querySelectorAll('.latte, .spielkiste'); if (!el.length) return;
  if (!('IntersectionObserver' in window)) { [].forEach.call(el, function (x) { x.classList.add('da'); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('da'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
  [].forEach.call(el, function (x) { io.observe(x); });
})();

/* ---------- Marchsteine, Höhenprofil, Seilschaft: einmal auslösen; Reiter der Marchsteine wechselt Sommer und Winter ---------- */
(function () {
  var el = document.querySelectorAll('.steine, .profil, .seil'); if (!el.length) return;
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('da'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' }) : null;
  [].forEach.call(el, function (x) { io ? io.observe(x) : x.classList.add('da'); });
  var r = document.querySelector('[data-steine]'); if (!r) return;
  r.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-ziel]'); if (!b) return; r.dataset.w = b.dataset.ziel;
    [].forEach.call(r.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    [].forEach.call(document.querySelectorAll('.steine'), function (s) { var an = s.dataset.w === b.dataset.ziel; s.hidden = !an; if (an) { s.classList.remove('da'); void s.offsetWidth; requestAnimationFrame(function () { s.classList.add('da'); }); } });
  });
})();

/* ---------- Kuverts: Anlass-Reiter filtert hart, Antippen öffnet die Lasche, der Brief steigt heraus; Sprungmarke #a-… öffnet direkt ---------- */
(function () {
  var g = document.querySelector('.kuverts'); if (!g) return;
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { if (es[0].isIntersecting) { g.classList.add('da'); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' }) : null; io ? io.observe(g) : g.classList.add('da');
  g.addEventListener('click', function (ev) {
    var k = ev.target.closest('.kuvert'); if (!k) return;
    if (ev.target.closest('.kuvert__zu')) { k.classList.remove('offen'); return; }
    if (ev.target.closest('.kuvert__knopf')) { [].forEach.call(g.querySelectorAll('.kuvert.offen'), function (x) { x.classList.remove('offen'); }); k.classList.add('offen'); }
  });
  var r = document.querySelector('.anlass-reiter'); if (r) r.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-anlass]'); if (!b) return; [].forEach.call(r.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    var n = 0; [].forEach.call(g.children, function (k) { var an = b.dataset.anlass === 'alle' || k.dataset.anlass === b.dataset.anlass; k.hidden = !an; k.classList.remove('offen'); if (an) k.style.setProperty('--i', n++); });
    g.classList.remove('da'); void g.offsetWidth; g.classList.add('da');
  });
  var h = location.hash && document.querySelector('.kuvert' + location.hash); if (h) setTimeout(function () { h.scrollIntoView({ block: 'center' }); h.classList.add('offen'); }, 600);
})();

/* ---------- Jasstafel und Gutschein: einmal auslösen ---------- */
(function () {
  var el = document.querySelectorAll('.tafel-j, .gutkarte'); if (!el.length) return;
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('da'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' }) : null;
  [].forEach.call(el, function (x) { io ? io.observe(x) : x.classList.add('da'); });
})();

/* ---------- Jahresringe: der Eintrag in der Mitte des Blicks lässt seinen Ring leuchten, die Jahreszahl in der Mitte wechselt hart ---------- */
(function () {
  var s = document.querySelector('.scheibe-q'); if (!s) return; var jahr = s.querySelector('[data-ringjahr]');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { s.classList.add('da'); o.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' }).observe(s);
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; var i = e.target.dataset.ring;
      [].forEach.call(document.querySelectorAll('.chronik li'), function (l) { l.classList.toggle('an', l.dataset.ring === i); });
      [].forEach.call(s.querySelectorAll('.ring'), function (r) { r.classList.toggle('an', r.dataset.ring === i); });
      jahr.textContent = e.target.querySelector('b').textContent.replace(/^.*?(\d{4}(\/\d{2})?)$/, '$1').replace(/^(\d+\.){1,2}(\d{2})$/, '20$2'); }); }, { rootMargin: '-48% 0px -48% 0px' });
    [].forEach.call(document.querySelectorAll('.chronik li'), function (l) { io.observe(l); });
  } else s.classList.add('da');
})();

/* ---------- Film im Bild: läuft erst auf Antippen, mit Ton und Bedienleiste ---------- */
(function () {
  [].forEach.call(document.querySelectorAll('[data-film]'), function (b) {
    b.addEventListener('click', function () { var f = b.parentElement, v = document.createElement('video'); v.src = b.dataset.film; v.controls = true; v.playsInline = true; v.autoplay = true; f.appendChild(v); f.classList.add('spielt'); v.play().catch(function () {}); });
  });
})();

/* ---------- Service-Seiten: Strecke, Packliste, Anzeige einmal auslösen; Uhr dreht zur Zeile im Blick; Sitzordnung; Ansichtskarte dreht sich ---------- */
(function () {
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('da'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' }) : null;
  [].forEach.call(document.querySelectorAll('.strecke, [data-packliste], .anzeige-f'), function (x) { io ? io.observe(x) : x.classList.add('da'); });
  var uhr = document.querySelector('.uhr'); if (uhr) {
    var stelle = function (z) { var p = z.split('.'), h = +p[0] % 12, m = +p[1]; uhr.style.setProperty('--h', (h * 30 + m * .5 + (+p[0] >= 12 ? 360 : 0)) + 'deg'); uhr.style.setProperty('--m', (m * 6 + +p[0] * 360) + 'deg'); };
    stelle('10.00');
    if ('IntersectionObserver' in window) { var u = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; [].forEach.call(document.querySelectorAll('.uhrzeilen li'), function (l) { l.classList.toggle('an', l === e.target); }); stelle(e.target.dataset.zeit); }); }, { rootMargin: '-45% 0px -45% 0px' });
      [].forEach.call(document.querySelectorAll('.uhrzeilen li'), function (l) { u.observe(l); }); }
  }
  var sitz = document.querySelector('[data-sitz]'); if (sitz) {
    var zahl = document.querySelector('[data-sitzzahl]'), mail = document.querySelector('[data-sitzmail]'), st = document.querySelectorAll('.stuhl');
    var male = function () { var n = +sitz.value; zahl.textContent = n; [].forEach.call(st, function (s) { s.classList.toggle('an', +s.dataset.n < n); }); mail.href = mail.href.split('?')[0] + '?subject=' + encodeURIComponent('Seminar für ' + n + ' Personen'); };
    sitz.addEventListener('input', male); male();
  }
  [].forEach.call(document.querySelectorAll('.karte-a'), function (k) { var d = function () { k.classList.toggle('gedreht'); }; k.addEventListener('click', d); k.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); d(); } }); });
})();

/* ---------- Sprungmarken von anderen Seiten: Zimmerkarte, Behandlungsliste oder Winter-Reiter direkt öffnen ---------- */
(function () {
  var h = decodeURIComponent(location.hash.slice(1)); if (!h) return;
  setTimeout(function () {
    var s = document.querySelector('.schluessel[data-zimmer="' + h + '"]'); if (s) { s.click(); var b = document.getElementById('brett'); if (b) scrollTo(0, b.getBoundingClientRect().top + scrollY - 80); return; }
    var l = document.querySelector('.bk__reiter [data-liste="' + h + '"]'); if (l) { l.click(); var k = document.getElementById('karte'); if (k) scrollTo(0, k.getBoundingClientRect().top + scrollY - 80); return; }
    var w = document.getElementById(h); if (w && w.dataset.w === 'winter') { var r = document.querySelector('[data-steine] [data-ziel="winter"]'); if (r) r.click(); }
  }, 300);
})();

/* ---------- Der Faden: jede Naht spannt sich einmal, wenn sie ins Bild kommt; die Wahl eines Abschnitts reist in den nächsten mit ---------- */
(function () {
  var n = document.querySelectorAll('[data-naht]'); if (n.length) {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) [].forEach.call(n, function (x) { x.classList.add('da'); });
    else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('da'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -15% 0px' }); [].forEach.call(n, function (x) { io.observe(x); }); }
  }
  /* gewähltes Zimmer → Rechnung */
  var zw = document.querySelector('[data-zimmerwahl]');
  if (zw) document.addEventListener('click', function () { setTimeout(function () { var k = document.querySelector('.zk:not([hidden]) h3'); if (k) zw.textContent = k.textContent; }, 30); });
  /* gewähltes Menü → «Fünf Gänge» im Sonnenbogen */
  var mw = document.querySelector('[data-menuwahl]');
  if (mw) { var male = function () { var h = document.querySelector('.gang[data-gang="3"] [aria-pressed="true"]'); if (h) mw.textContent = 'Ihr Hauptgang: ' + h.textContent.split(',')[0]; }; document.addEventListener('click', function (ev) { if (ev.target.closest('.gang')) male(); }); male(); }
})();

/* ---------- Vier Häuser: die erste passende Regel lässt ein Haus hervortreten, die anderen treten zurück (nur opacity) ---------- */
(function () {
  var f = document.querySelector('[data-finder2]'); if (!f) return;
  var R = JSON.parse(f.querySelector('script[type="application/json"]').textContent).regeln, wahl = {}, vier = f.querySelector('.vier'), satz = f.querySelector('[data-satz]');
  f.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-wert]'); if (!b) return; var s = b.parentElement;
    [].forEach.call(s.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); }); wahl[s.dataset.frage] = b.dataset.wert;
    var r = R.filter(function (r) { return Object.keys(r.wenn).every(function (k) { return wahl[k] && r.wenn[k].indexOf(wahl[k]) >= 0; }); })[0] || R[R.length - 1];
    vier.classList.add('gewaehlt'); [].forEach.call(vier.children, function (t) { t.classList.toggle('an', t.dataset.haus === r.haus); }); satz.textContent = r.satz;
  });
})();
/* Massband: auslösen, wenn es ins Bild kommt */
(function () { var m = document.querySelector('.mb'); if (!m) return; if (!('IntersectionObserver' in window)) { m.classList.add('da'); return; } var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { m.classList.add('da'); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' }); io.observe(m); })();
