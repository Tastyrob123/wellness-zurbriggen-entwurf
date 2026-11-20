/* L’Imprimerie · Newsletter-Baukasten, Oberfläche. Vorlagen (Inhalte aus katalog.js NEWSLETTER, nur Belegtes, Unbelegtes in [Klammern]),
   Bausteine anklicken und rechts bearbeiten, Reihenfolge ändern, Fotos des Hauses wählen, Prüfung, Export als .html und «HTML kopieren».
   Gespeichert wird im Browser (localStorage «ds-zurbriggen-mails»), erst sobald etwas geändert wird. Satz der Mail: mail-satz.js. */
(function () {
  try { sessionStorage.setItem('ds-zurbriggen-in-werkstatt', '1'); } catch (e) {}   // wer hier war, ist schon in der Werkstatt: die Übersicht zeigt keine Begrüssung (1.11.)
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const PFEIL = '<svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
  const WEB = 'https://www.wellnesshotel-zurbriggen.ch/', TEL = 'tel:+41279572301', MAIL = 'mailto:info@wellnesshotel-zurbriggen.ch', IG = 'https://www.instagram.com/hotelpirminzurbriggen/';
  const LOKAL = location.origin + location.pathname.replace(/[^/]*$/, '');
  let M = null;

  /* ---------- Vorlagen: Fakten aus katalog.js (NEWSLETTER), dort gepflegt ---------- */
  const NL = n => ((window.DSKATALOG && DSKATALOG.NEWSLETTER || []).find(x => x.n === n) || {}).inhalt || {};
  const VORLAGEN = [
    { key: "abend", n: "Jasswochen", wo: "an alle Gäste", foto: "j-stube", bau() {
      return { betreff: "Jasswochen 2026/2027 im Pirmin", vorschau: "Fünf Wochen mit dem Hotel Monte-Moro: 4 Jassabende, Hüttengaudi mit Fabian und Dorfrundgang.", versand: "mailchimp",
        kopf: { foto: "j-stube", alt: "Eine Stube mit Holztischen und Leuchten unter der Holzdecke" }, fuss: { abmelden: true },
        bloecke: [
          {"typ": "titel", "ueber": "Mit dem Hotel Monte-Moro", "titel": "Jasswochen 2026/2027.", "unter": ""},
          {"typ": "text", "text": "Guten Tag,\n\n4 Jassabende (wir spielen an vier Abenden «Schieber» D und F), Hüttengaudi mit Fabian und Dorfrundgang. Tolle Preise zu gewinnen.", "ausr": "links"},
          {"typ": "termine", "titel": "Die Wochen", "eintraege": [{"wann": "13.–18. Dezember 2026", "was": "Jasswoche", "wo": ""}, {"wann": "10.–15. Januar 2027", "was": "Jasswoche", "wo": ""}, {"wann": "24.–29. Januar 2027", "was": "Jasswoche", "wo": ""}, {"wann": "21.–26. März 2027", "was": "Jasswoche", "wo": ""}, {"wann": "4.–9. April 2027", "was": "Jasswoche", "wo": ""}]},
          {"typ": "liste", "titel": "Pro Person", "eintraege": [{"name": "Doppelzimmer Standard im Hotel Pirmin", "detail": "Aufpreis LoftSuite Fr. 150.- pauschal pro Person", "preis": "Fr. 750.-"}, {"name": "Doppelzimmer im Jasshotel Monte-Moro", "detail": "Essen und Spa im Pirmin inklusive", "preis": "Fr. 650.-"}]},
          {"typ": "text", "text": "Mahlzeiten Tagesprogramm exklusive. Kurtaxen exklusive.", "ausr": "mitte"},
          {"typ": "knopf", "text": "Anrufen: +41 27 957 23 01", "link": TEL},
        ] };
    } },
    { key: "warteliste", n: "Wohlfühltage", wo: "an Anfragen", foto: "a-zweit", bau() {
      return { betreff: "Zauberhafte Wohlfühltage zu zweit", vorschau: "2 Nächte mit Halbpension, 1 Flasche Sekt, Sense Liegen, Solebad und Schokofango für zwei.", versand: "anderes",
        kopf: { foto: "a-zweit", alt: "Der Speisesaal am Abend mit Kerzen und Kristallleuchtern" }, fuss: { abmelden: false },
        bloecke: [
          {"typ": "titel", "ueber": "2 Nächte · Halbpension", "titel": "Zauberhafte Wohlfühltage zu zweit.", "unter": ""},
          {"typ": "text", "text": "Guten Tag,\n\nvielen Dank für Ihre Anfrage. Das gehört zu den Wohlfühltagen zu zweit:", "ausr": "links"},
          {"typ": "liste", "titel": "", "eintraege": [{"name": "2 Übernachtungen mit Halbpension", "detail": "", "preis": ""}, {"name": "1 Flasche Sekt", "detail": "", "preis": ""}, {"name": "Sense Liegen für zwei", "detail": "", "preis": ""}, {"name": "Solebad für zwei", "detail": "", "preis": ""}, {"name": "Schokofango für zwei", "detail": "", "preis": ""}]},
          {"typ": "text", "text": "ab CHF 415,-- pro Person", "ausr": "mitte"},
          {"typ": "knopf", "text": "Anrufen: +41 27 957 23 01", "link": TEL},
        ] };
    } },
    { key: "rueckblick", n: "Winter", wo: "an alle Gäste", foto: "winternacht", bau() {
      return { betreff: "folgen Sie uns … in den Winter", vorschau: "145 km präparierte Pisten, die Saastal-Loipe, die Natureisbahn direkt neben dem Hotel.", versand: "mailchimp",
        kopf: { foto: "winternacht", alt: "Das Haus in einer Winternacht, alle Fenster erleuchtet" }, fuss: { abmelden: true },
        bloecke: [
          {"typ": "titel", "ueber": "folgen Sie uns …", "titel": "Ein glitzerndes Märchen vom Winter.", "unter": ""},
          {"typ": "text", "text": "Das Winterschneesportgebiet im Saastal bietet mit seinen gut 145 km präparierten Pisten für alle etwas Besonderes. Unser Hotel liegt direkt neben der Bergbahn.", "ausr": "mitte"},
          {"typ": "trenner"},
          {"typ": "foto", "foto": "w-schneeschuh", "alt": "Mit Schneeschuhen im Tiefschnee", "unterschrift": "Jeden Mittwoch Schneeschuhwanderung mit eidg. dipl. Schneesportlehrer.", "voll": false},
          {"typ": "foto", "foto": "w-langlauf", "alt": "Zwei Langläufer in der Loipe", "unterschrift": "Die 26 km lange Saastal-Loipe", "voll": false},
          {"typ": "knopf", "text": "Zimmer anfragen", "link": WEB},
        ] };
    } },
    { key: "einladung", n: "Gourmet-Abend", wo: "an alle Gäste", foto: "tisch-z", bau() {
      return { betreff: "setzen Sie sich …", vorschau: "Täglich exzellentes 5-gängiges Abendessen mit Wahlmöglichkeiten, jeden Sonntag Fondue.", versand: "mailchimp",
        kopf: { foto: "tisch-z", alt: "Die Menümappe mit dem geprägten Z auf dem gedeckten Tisch, Kerzenlicht" }, fuss: { abmelden: true },
        bloecke: [
          {"typ": "titel", "ueber": "Gourmet-Halbpension", "titel": "Ein Abend aus der Küche.", "unter": ""},
          {"typ": "text", "text": "Guten Tag,\n\nsetzen Sie sich … und geniessen Sie eine wahre Gourmetküche, die zum Schlemmen verführt. Ein Beispiel eines Menüs:", "ausr": "links"},
          {"typ": "termine", "titel": "", "eintraege": [{"wann": "Erster Gang", "was": "Trio von der Tomate", "wo": ""}, {"wann": "Zweiter Gang", "was": "Grüne Currysuppe mit Crevettenwürfel", "wo": ""}, {"wann": "Dritter Gang", "was": "Hausgemachte Frischkäseravioli auf Frühlingszwiebeln", "wo": ""}, {"wann": "Vierter Gang", "was": "Saftige Perlhuhnbrust an Estragonschaum mit Kefenstreifen und Risotto", "wo": ""}, {"wann": "Fünfter Gang", "was": "Himbeersorbet", "wo": ""}]},
          {"typ": "foto", "foto": "t-7", "alt": "Ein Hauptgang mit Risotto und Gemüse", "unterschrift": "", "voll": false},
          {"typ": "text", "text": "Jeden Sonntag Gemüse, Fleisch und Fischfondue mit 12 verschiedenen Saucen.", "ausr": "mitte"},
          {"typ": "knopf", "text": "Mit Halbpension buchen", "link": WEB},
        ] };
    } },
    { key: "ticket", n: "Reservierung", wo: "Bestätigungsmail", foto: "raum-hell", bau() {
      return { betreff: "Ihr Zimmer ist reserviert", vorschau: "Am Anreisetag sind die Zimmer ab 14.00 Uhr beziehbar. Am Anreisetag ist Ihr Gepäck im Zimmer.", versand: "anderes",
        kopf: { foto: "raum-hell", alt: "Ein helles Zimmer mit Doppelbett, Sofa und Kristallleuchter" }, fuss: { abmelden: false },
        bloecke: [
          {"typ": "titel", "ueber": "Wellness & Spa Pirmin Zurbriggen", "titel": "Ihr Zimmer ist reserviert.", "unter": ""},
          {"typ": "text", "text": "Guten Tag,\n\nwir freuen uns auf Ihren Besuch in Saas-Almagell. Für Ihre Anreise:"},
          {"typ": "termine", "titel": "", "eintraege": [{"wann": "14.00", "was": "Am Anreisetag sind die Zimmer ab 14.00 Uhr beziehbar.", "wo": ""}, {"wann": "19.00", "was": "Falls Sie nach 19.00 Uhr anreisen, bitten wir Sie, uns dies kurz davor zu melden.", "wo": ""}, {"wann": "10.00", "was": "Check out 10.00 Uhr", "wo": ""}]},
          {"typ": "text", "text": "Geben Sie Ihr Gepäck 2 Tage vor Abreise zu Hause am Bahnschalter auf und wir holen es gerne am Postschalter in Saas-Almagell für Sie ab. Am Anreisetag ist Ihr Gepäck im Zimmer."},
          {"typ": "knopf", "text": "Anrufen: +41 27 957 23 01", "link": TEL},
        ] };
    } },
    { key: "danke", n: "Dankeschön", wo: "Dankesmail", foto: "sp-flieder", bau() {
      return { betreff: "Danke für Ihren Besuch", vorschau: "Wohnen im Wellnesshotel Pirmin Zurbriggen – und sich wohlfühlen wie zu Hause.", versand: "anderes",
        kopf: { foto: "sp-flieder", alt: "Ein Gast riecht im Garten am blühenden Flieder, dahinter die Berge" }, fuss: { abmelden: false },
        bloecke: [
          {"typ": "titel", "ueber": "Wellness & Spa Pirmin Zurbriggen", "titel": "Danke für Ihren Besuch.", "unter": ""},
          {"typ": "text", "text": "Wohnen im Wellnesshotel Pirmin Zurbriggen – und sich wohlfühlen wie zu Hause. Harmonisch, familiär, mit dem Gefühl von Ferien!", "ausr": "mitte"},
          {"typ": "trenner"},
          {"typ": "text", "text": "Sie haben uns weiterempfohlen? Bitte teilen Sie uns mit, welche Gäste Sie uns vermittelt haben. Als Vermittler erhalten Sie zum Dank bei einer Buchung von 7 Übernachtungen CHF 50 pro Person.", "ausr": "mitte"},
          {"typ": "knopf", "text": "Zu Instagram", "link": IG},
        ] };
    } },
    { key: 'leer', n: 'Leere E-Mail', wo: 'selbst aufbauen', foto: '', bau() {
      return { betreff: '', vorschau: '', versand: 'mailchimp', kopf: { foto: '' }, fuss: { abmelden: true },
        bloecke: [{ typ: 'titel', ueber: 'Wellness & Spa Pirmin Zurbriggen', titel: 'Titel', unter: '' }, { typ: 'text', text: 'Ihr Text.' }] };
    } },
  ];

  const ARTEN = {
    titel: { n: 'Titel', ic: '<path d="M5 6h14M12 6v13"/>', neu: () => ({ typ: 'titel', ueber: 'Wellness & Spa Pirmin Zurbriggen', titel: 'Titel', unter: '' }) },
    text: { n: 'Text', ic: '<path d="M4 6h16M4 10h16M4 14h16M4 18h10"/>', neu: () => ({ typ: 'text', text: 'Ihr Text.' }) },
    foto: { n: 'Foto', ic: '<path d="M4 5h16v14H4zM4 16l5-5 4 4 2.5-2.5L20 17"/>', neu: () => ({ typ: 'foto', foto: 'haus-weit', alt: 'Das Wellness & Spa Pirmin Zurbriggen im Lärchenwald von Saas-Almagell, Sommer', unterschrift: '', voll: false }) },
    knopf: { n: 'Knopf', ic: '<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M14 12h3m-1.5-1.5L17 12l-1.5 1.5"/>', neu: () => ({ typ: 'knopf', text: 'Mehr erfahren', link: WEB }) },
    termine: { n: 'Termine', ic: '<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>', neu: () => ({ typ: 'termine', titel: '', eintraege: [{ wann: '[Datum · Zeit]', was: '[Anlass]', wo: '[Ort]' }] }) },
    liste: { n: 'Preisliste', ic: '<path d="M4 7h11M4 12h11M4 17h11M18 7h2M18 12h2M18 17h2"/>', neu: () => ({ typ: 'liste', titel: '', eintraege: [{ name: '[Name]', detail: '[Beschreibung]', preis: '[Preis]' }] }) },
    trenner: { n: 'Zierlinie', ic: '<path d="M3 12h6M15 12h6M12 9l3 3-3 3-3-3z"/>', neu: () => ({ typ: 'trenner' }) },
  };

  /* ---------- Ablage im Browser ---------- */
  const lies = () => { try { return JSON.parse(localStorage.getItem('ds-zurbriggen-mails') || '[]'); } catch (e) { return []; } };
  const schreib = l => { try { localStorage.setItem('ds-zurbriggen-mails', JSON.stringify(l)); } catch (e) {} };
  let doc = null, id = null, wahl = null, geraet = 600, speicherT = 0;
  function neu(v) { doc = Object.assign({ name: v.n }, v.bau()); doc.vorlage = v.key; id = null; wahl = null; zeichne(); zeigeWahl(); markiere(); }
  function oeffne(e) { doc = JSON.parse(JSON.stringify(e.doc)); id = e.id; wahl = null; zeichne(); zeigeWahl(); markiere(); }
  let zeichneT = 0;
  function geaendert() {
    clearTimeout(zeichneT); zeichneT = setTimeout(() => zeichne(true), 140);
    clearTimeout(speicherT); speicherT = setTimeout(() => {
      const l = lies(); if (!id) id = 'm' + Date.now().toString(36);
      const e = { id, name: doc.name, vorlage: doc.vorlage, geaendert: Date.now(), doc };
      const i = l.findIndex(x => x.id === id); if (i >= 0) l[i] = e; else l.unshift(e);
      schreib(l); zeichneMeine(); markiere(); $('#mlGespeichert').classList.add('an'); setTimeout(() => $('#mlGespeichert').classList.remove('an'), 1400);
    }, 400);
  }

  /* ---------- Vorschau ---------- */
  let ifrScroll = 0;
  function zeichne(behalte) {
    const f = $('#mlRahmen'); if (behalte && f.contentWindow) ifrScroll = f.contentWindow.scrollY || 0;
    f.srcdoc = DSMAIL.html(doc, { basis: LOKAL, editor: true, M });
    $('#mlBetreff').textContent = doc.betreff || 'Kein Betreff';
    $('#mlVorschau').textContent = doc.vorschau || '';
    $('#mlName').value = doc.name || '';
    pruefung();
  }
  function rahmenGeladen() {
    const f = $('#mlRahmen'), d = f.contentDocument; if (!d || !d.body) return;
    const hoehe = () => { const t = d.body && d.body.querySelector('table'); f.style.height = Math.max(600, Math.ceil(t ? t.getBoundingClientRect().height : d.documentElement.scrollHeight)) + 'px'; };   /* Höhe der E-Mail selbst: sonst blieb unter dem Fuss ein leerer Streifen (Robert 10.11.2026, Vorlage Monte-Moro) */
    hoehe(); d.querySelectorAll('img').forEach(i => i.complete || i.addEventListener('load', hoehe));
    if (d.fonts) d.fonts.ready.then(hoehe);
    if (wahl != null) { const el = d.querySelector(`[data-b="${wahl}"]`); if (el) el.classList.add('an'); }
    d.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = f.getBoundingClientRect(), k = r.width / f.offsetWidth; kippe(r.left + e.clientX * k, r.top + e.clientY * k); });
    d.addEventListener('click', e => { e.preventDefault(); const t = e.target.closest('[data-b]'); if (!t) return; const b = t.dataset.b; waehle(/^\d+$/.test(b) ? +b : b); });
  }
  /* 3D wie die Kacheln der Startseite: das Blatt neigt sich zur Maus, Licht wandert mit; gedreht wird um die Mitte des sichtbaren Ausschnitts */
  let kippRaf = 0, kippXY = null;
  function kippe(cx, cy) {
    kippXY = [cx, cy]; if (kippRaf) return;
    kippRaf = requestAnimationFrame(() => {
      kippRaf = 0; const b = $('#mlBlatt'), m = $('.ml-mitte'); if (!b || !kippXY) return;
      const r = b.getBoundingClientRect(), mr = m.getBoundingClientRect(), [x0, y0] = kippXY;
      const x = Math.max(-.5, Math.min(.5, (x0 - r.left) / r.width - .5)), y = Math.max(-.5, Math.min(.5, (y0 - mr.top) / mr.height - .5));
      b.style.transformOrigin = `50% ${Math.round(mr.top + mr.height / 2 - r.top)}px`;
      b.classList.add('kipp');
      b.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg'); b.style.setProperty('--rx', (-y * 3.5).toFixed(2) + 'deg');
      b.style.setProperty('--gx', Math.round(x0 - r.left) + 'px'); b.style.setProperty('--gy', Math.round(y0 - r.top) + 'px');
    });
  }
  function loeseKipp() { kippXY = null; const b = $('#mlBlatt'); if (!b) return; b.classList.remove('kipp'); ['--rx', '--ry'].forEach(v => b.style.removeProperty(v)); }
  function markiereRahmen() { const d = $('#mlRahmen').contentDocument; if (!d) return; d.querySelectorAll('[data-b]').forEach(el => el.classList.toggle('an', String(wahl) === el.dataset.b)); }

  /* ---------- Rechte Platte: Baustein bearbeiten ---------- */
  const feld = (k, n, val, art = 'input', extra = '') => art === 'textarea'
    ? `<label class="ml-f"><span>${n}</span><textarea data-k="${k}" rows="${extra || 5}">${esc(val)}</textarea></label>`
    : `<label class="ml-f"><span>${n}</span><textarea class="ml-zeile" rows="1" data-k="${k}" spellcheck="${/link|url/.test(k) ? 'false' : 'true'}"${extra}>${esc(val)}</textarea></label>`;   // eine Zeile, die mitwächst statt den Text abzuschneiden (Messlauf 29.10.)
  /* Felder wachsen mit ihrem Text (Messlauf 29.10.2026: Vorschauzeile und Betreff ragten aus dem Kasten) */
  const wachse = box => (box || document).querySelectorAll('#mlFelder textarea').forEach(t => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px'; });
  const ausr = (b, std) => `<label class="ml-f"><span>Ausrichtung</span><select data-k="ausr"><option value="mitte"${(b.ausr || std) === 'mitte' ? ' selected' : ''}>Mittig</option><option value="links"${(b.ausr || std) === 'links' ? ' selected' : ''}>Linksbündig</option></select></label>`;
  function fotoFeld(b, kopf) {
    const src = b.url ? b.url : (b.foto ? DSMAIL.bildUrl(b.foto, LOKAL) : '');
    return `<div class="ml-f"><span>Foto</span><button class="ml-foto" data-akt="foto">${src ? `<img src="${esc(src)}" alt="">` : '<i>Kein Foto</i>'}<b>Foto wählen</b></button>
      ${kopf && (b.foto || b.url) ? '<button class="ml-mini" data-akt="ohnefoto">Ohne Kopfbild</button>' : ''}</div>
      ${feld('alt', 'Bildbeschreibung (für Mailprogramme ohne Bilder)', b.alt || '')}
      <details class="ml-mehr"${b.url ? ' open' : ''}><summary>Eigenes Foto über eine Adresse</summary>${feld('url', 'Bildadresse (https://…, zum Beispiel aus Mailchimp)', b.url || '')}</details>`;
  }
  function eintraege(b) {
    const sp = b.typ === 'termine' ? [['wann', 'Wann'], ['was', 'Was'], ['wo', 'Wo / Zusatz']] : [['name', 'Name'], ['detail', 'Beschreibung'], ['preis', 'Preis']];
    return `<div class="ml-eintraege">${(b.eintraege || []).map((e, j) => `<div class="ml-eintrag" data-j="${j}"><div class="ml-eintrag__kopf"><em>${j + 1}</em>
      <button class="rund rund--klein" data-akt="ehoch" title="Nach oben" ${j ? '' : 'disabled'}><svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg></button>
      <button class="rund rund--klein" data-akt="eweg" title="Entfernen" aria-label="Entfernen"><svg viewBox="0 0 24 24"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/></svg></button></div>
      ${sp.map(([k, n]) => `<label class="ml-f ml-f--klein"><span>${n}</span><input type="text" data-e="${k}" value="${esc(e[k] || '')}"></label>`).join('')}</div>`).join('')}
      <button class="kn kn--klein kn--ohne ml-dazu" data-akt="edazu"><span>Eintrag hinzufügen</span></button></div>`;
  }
  function zeigeWahl() {
    const box = $('#mlFelder'), n = (doc.bloecke || []).length;
    if (wahl == null || wahl === 'mail') {
      box.innerHTML = `<div class="ml-kopfzeile"><h2><small>Einstellungen</small>Die E-Mail</h2></div>
        ${feld('name', 'Name in Ihrer Ablage', doc.name || '')}
        ${feld('betreff', 'Betreff', doc.betreff || '')}
        ${feld('vorschau', 'Vorschauzeile (erscheint im Posteingang nach dem Betreff)', doc.vorschau || '', 'textarea', 2)}
        <label class="ml-f"><span>Verschickt mit</span><select data-k="versand">${Object.entries(DSMAIL.VERSAND).map(([k, v]) => `<option value="${k}"${doc.versand === k ? ' selected' : ''}>${v.name}</option>`).join('')}</select></label>
        <p class="ml-leise ml-versand">Die Werkstatt verschickt selbst nichts. Wählen Sie hier das Programm, mit dem Sie Ihren Newsletter schon verschicken: Die Werkstatt setzt den Abmeldelink so, wie dieses Programm ihn braucht, und gibt Ihnen die fertige Mail zum Einfügen dort. Haben Sie kein solches Programm, wählen Sie «Anderes Programm»: Dann steht im Fuss [Abmeldelink], den ersetzen Sie vor dem Versand durch Ihren eigenen Link.</p>
        <p class="ml-leise ml-tipp">Tipp: Tippen Sie in der Vorschau einen Teil der E-Mail an, öffnet er sich hier zum Bearbeiten.</p>`;   // Versand und Bearbeiten getrennt erklärt (Robert 29.10.2026)
    } else if (wahl === 'kopf') {
      box.innerHTML = `<div class="ml-kopfzeile"><h2><small>Teil der E-Mail</small>Kopf</h2></div><p class="ml-leise">Oben stehen Zeichen und Name des Hauses, darunter das Kopfbild.</p>${fotoFeld(doc.kopf || {}, true)}`;
    } else if (wahl === 'fuss') {
      const f = doc.fuss || {};
      box.innerHTML = `<div class="ml-kopfzeile"><h2><small>Teil der E-Mail</small>Fuss</h2></div><p class="ml-leise">Adresse, Telefon, E-Mail und Website des Hauses stehen fest im Fuss.</p>
        <label class="haken"><input type="checkbox" data-k="abmelden"${f.abmelden !== false ? ' checked' : ''}> Abmeldelink zeigen (Pflicht bei Newslettern)</label>
        ${feld('text', 'Zusatz im Fuss (freiwillig)', f.text || '', 'textarea', 2)}`;
    } else {
      const b = doc.bloecke[wahl]; if (!b) { wahl = null; return zeigeWahl(); }
      let f = '';
      if (b.typ === 'titel') f = feld('ueber', 'Kleine Zeile darüber', b.ueber || '') + feld('titel', 'Titel', b.titel || '') + feld('unter', 'Unterzeile kursiv', b.unter || '') + ausr(b, 'mitte');
      if (b.typ === 'text') f = feld('text', 'Text (Leerzeile = neuer Absatz)', b.text || '', 'textarea', 8) + ausr(b, 'links');
      if (b.typ === 'foto') f = fotoFeld(b) + `<label class="haken"><input type="checkbox" data-k="voll"${b.voll ? ' checked' : ''}> Über die ganze Breite</label>` + feld('unterschrift', 'Bildunterschrift (freiwillig)', b.unterschrift || '') + feld('link', 'Link beim Antippen (freiwillig)', b.link || '');
      if (b.typ === 'knopf') f = feld('text', 'Beschriftung', b.text || '') + feld('link', 'Adresse (https://… oder tel:)', b.link || '')
        + `<div class="ml-chips"><button data-akt="lnk" data-l="${WEB}">Website</button><button data-akt="lnk" data-l="${TEL}">Telefon</button></div>`;
      if (b.typ === 'termine' || b.typ === 'liste') f = feld('titel', 'Überschrift (freiwillig)', b.titel || '') + eintraege(b);
      if (b.typ === 'trenner') f = '<p class="ml-leise">Eine feine Linie mit dem Zeichen des Hauses.</p>';
      box.innerHTML = `<div class="ml-kopfzeile"><h2><small>Baustein</small>${String(ARTEN[b.typ].n).replace(/ (\S+)$/, '\u00a0$1')}</h2><span class="ml-werk">
        <button class="rund rund--klein" data-akt="hoch" title="Nach oben" ${wahl ? '' : 'disabled'}><svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg></button>
        <button class="rund rund--klein" data-akt="runter" title="Nach unten" ${wahl < n - 1 ? '' : 'disabled'}><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>
        <button class="rund rund--klein" data-akt="doppeln" title="Doppeln"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg></button>
        <button class="rund rund--klein" data-akt="weg" title="Entfernen"><svg viewBox="0 0 24 24"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/></svg></button></span></div>${f}`;
    }
    $$('.ml-nav [data-teil]').forEach(x => x.classList.toggle('an', String(wahl ?? 'mail') === x.dataset.teil));
  }
  function waehle(w) { wahl = w; zeigeWahl(); markiereRahmen(); }
  function ziel() { if (wahl === 'kopf') return doc.kopf = doc.kopf || {}; if (wahl === 'fuss') return doc.fuss = doc.fuss || {}; if (wahl == null || wahl === 'mail') return doc; return doc.bloecke[wahl]; }

  function eingabe(e) {
    const t = e.target, z = ziel(); if (!z) return;
    if (t.dataset.k) { const k = t.dataset.k; z[k] = t.type === 'checkbox' ? t.checked : t.value; if (k === 'url' && t.value.trim()) z.foto = z.foto; }
    else if (t.dataset.e) { const j = +t.closest('[data-j]').dataset.j; z.eintraege[j][t.dataset.e] = t.value; }
    else return;
    geaendert();
  }
  function aktion(a, el) {
    const bl = doc.bloecke, z = ziel();
    if (a === 'hoch' || a === 'runter') { const j = wahl + (a === 'hoch' ? -1 : 1); [bl[wahl], bl[j]] = [bl[j], bl[wahl]]; wahl = j; }
    else if (a === 'doppeln') { bl.splice(wahl + 1, 0, JSON.parse(JSON.stringify(bl[wahl]))); wahl++; }
    else if (a === 'weg') { bl.splice(wahl, 1); wahl = bl.length ? Math.min(wahl, bl.length - 1) : null; }
    else if (a === 'edazu') { z.eintraege.push(z.typ === 'termine' ? { wann: '', was: '', wo: '' } : { name: '', detail: '', preis: '' }); }
    else if (a === 'eweg') { z.eintraege.splice(+el.closest('[data-j]').dataset.j, 1); }
    else if (a === 'ehoch') { const j = +el.closest('[data-j]').dataset.j; [z.eintraege[j - 1], z.eintraege[j]] = [z.eintraege[j], z.eintraege[j - 1]]; }
    else if (a === 'lnk') { z.link = el.dataset.l; }
    else if (a === 'ohnefoto') { z.foto = ''; z.url = ''; }
    else if (a === 'foto') return fotoWahl();
    else return;
    zeigeWahl(); geaendert();
  }
  function einfuegen(typ) {
    const b = ARTEN[typ].neu(), pos = typeof wahl === 'number' ? wahl + 1 : (wahl === 'kopf' ? 0 : doc.bloecke.length);
    doc.bloecke.splice(pos, 0, b); wahl = pos; zeigeWahl(); geaendert();
    setTimeout(() => { const d = $('#mlRahmen').contentDocument, el = d && d.querySelector(`[data-b="${pos}"]`); if (el) el.scrollIntoView({ block: 'center' }); }, 250);
  }

  /* ---------- Fotos des Hauses ---------- */
  let fGruppe = 'Alle';
  function fotoWahl() {
    const dlg = $('#mlFotos'), gruppen = ['Alle', ...new Set(M.bilder.map(b => b.gruppe))];
    $('#mlFotoGruppen').innerHTML = gruppen.map(g => `<button data-g="${esc(g)}" class="${g === fGruppe ? 'an' : ''}">${esc(g)}</button>`).join('');
    fotoRaster(); dlg.showModal(); $('#mlFotoSuche').focus();
  }
  function fotoRaster() {
    const q = $('#mlFotoSuche').value.trim().toLowerCase(), z = ziel() || {};
    const l = M.bilder.filter(b => (fGruppe === 'Alle' || b.gruppe === fGruppe) && (!q || (b.alt + ' ' + b.key + ' ' + b.gruppe).toLowerCase().includes(q)));
    $('#mlFotoRaster').innerHTML = l.map(b => `<button data-foto="${b.key}" class="${z.foto === b.key && !z.url ? 'an' : ''}" title="${esc(b.alt)}"><img loading="lazy" src="haeuser/zurbriggen/mini/${b.key}.webp" alt=""><span>${esc(b.alt)}</span></button>`).join('') || '<p class="ml-leise">Nichts gefunden.</p>';
  }

  /* ---------- Prüfung, Ausgabe ---------- */
  function pruefung() {
    const p = DSMAIL.pruefe(doc), z = $('#mlPruefZahl');
    z.textContent = p.length; z.parentElement.classList.toggle('gut', !p.length);
    $('#mlPruefListe').innerHTML = p.length ? p.map(x => `<button data-zu="${x.b}"><i></i><span>${esc(x.t)}</span></button>`).join('') : '<p class="ml-gut">Alles bereit zum Versand.</p>';
  }
  const dateiname = () => (doc.name || 'E-Mail').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.html';
  const fertig = () => DSMAIL.html(doc, { M });
  function hinweis(t) { const h = $('#mlHinweis'); h.innerHTML = t; h.hidden = false; h.classList.remove('an'); void h.offsetWidth; h.classList.add('an'); clearTimeout(h._t); h._t = setTimeout(() => { h.hidden = true; }, 5200); }
  async function kopiere() {
    const h = fertig();
    try { await navigator.clipboard.writeText(h); }
    catch (e) { const t = document.createElement('textarea'); t.value = h; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    const p = DSMAIL.pruefe(doc).length;
    hinweis(`<b>HTML kopiert.</b> Im Versandprogramm die Gestaltung mit eigenem Code wählen und einfügen.${p ? ` Vorher noch ${p} ${p === 1 ? 'Punkt' : 'Punkte'} der Prüfung erledigen.` : ''}`);
  }
  function speichere() {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([fertig()], { type: 'text/html;charset=utf-8' })); a.download = dateiname();
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
    hinweis(`<b>${esc(dateiname())}</b> gespeichert. Die Datei lässt sich im Browser öffnen oder im Versandprogramm hochladen.`);
  }

  /* ---------- Linke Platte: Vorlagen, Meine E-Mails, Teile ---------- */
  function zeichneVorlagen() {
    $('#mlVorlagen').innerHTML = VORLAGEN.map(v => `<button data-vorlage="${v.key}"><span class="ml-vb"${v.foto ? ` style="background-image:url('haeuser/zurbriggen/mini/${v.foto}.webp')"` : ''}></span><span><b>${esc(v.n).replace(/ (\S+)$/, '\u00a0$1')}</b><small>${esc(v.wo)}</small></span></button>`).join('');
  }
  function zeichneMeine() {
    const l = lies(); $('#mlMeineZahl').textContent = l.length; $('#mlMeineBox').hidden = !l.length;
    $('#mlMeine').innerHTML = l.map(e => `<div class="ml-meine__e" data-id="${e.id}"><button data-mail="${e.id}"><b>${esc(e.name || 'E-Mail')}</b><small>${new Date(e.geaendert).toLocaleString('de-CH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></button><button class="ml-x" data-loesch="${e.id}" title="Löschen" aria-label="Löschen"><svg viewBox="0 0 24 24"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/></svg></button></div>`).join('');
  }
  function markiere() {
    $$('#mlVorlagen [data-vorlage]').forEach(b => b.classList.toggle('an', !id && doc.vorlage === b.dataset.vorlage));
    $$('#mlMeine [data-mail]').forEach(b => b.classList.toggle('an', id === b.dataset.mail));
  }

  async function los() {
    M = await (await fetch('haeuser/zurbriggen/marke.json')).json();
    const z = M.zeichen, svg = `<svg viewBox="${z.vb.join(' ')}">${z.pfade.map(d => `<path d="${d}"/>`).join('')}</svg>`;
    $('#mlZeichen').innerHTML = svg; $('#mlKapitelZeichen').innerHTML = svg;
    zeichneVorlagen(); zeichneMeine();
    $('#mlEinfuegen').innerHTML = Object.entries(ARTEN).map(([k, a]) => `<button data-neu="${k}"><svg viewBox="0 0 24 24">${a.ic}</svg><span>${String(a.n).replace(/ (\S+)$/, '\u00a0$1')}</span></button>`).join('');
    const q = new URLSearchParams(location.search), v = VORLAGEN.find(x => x.key === q.get('vorlage')), l = lies();
    const gesp = l.find(x => x.id === q.get('mail'));
    if (gesp) oeffne(gesp); else if (v) neu(v); else if (l.length) oeffne(l[0]); else neu(VORLAGEN[0]);

    $('#mlRahmen').addEventListener('load', () => { rahmenGeladen(); const w = $('#mlRahmen').contentWindow; if (ifrScroll) { w.scrollTo(0, ifrScroll); } });
    $('#mlFelder').addEventListener('input', eingabe); $('#mlFelder').addEventListener('change', eingabe);
    $('#mlFelder').addEventListener('input', e => { if (e.target.tagName === 'TEXTAREA') wachse(); });
    $('#mlFelder').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList.contains('ml-zeile')) { e.preventDefault(); e.target.blur(); } });
    new MutationObserver(() => requestAnimationFrame(() => wachse())).observe($('#mlFelder'), { childList: true }); addEventListener('resize', () => wachse()); wachse(); document.fonts.ready.then(() => wachse());
    document.addEventListener('click', e => {
      const t = e.target;
      const ak = t.closest('[data-akt]'); if (ak && !ak.disabled) return aktion(ak.dataset.akt, ak);
      const vo = t.closest('[data-vorlage]'); if (vo) return neu(VORLAGEN.find(x => x.key === vo.dataset.vorlage));
      const me = t.closest('[data-mail]'); if (me) return oeffne(lies().find(x => x.id === me.dataset.mail));
      const lo = t.closest('[data-loesch]'); if (lo) { if (!confirm('Diese E-Mail aus der Ablage löschen?')) return; schreib(lies().filter(x => x.id !== lo.dataset.loesch)); if (id === lo.dataset.loesch) id = null; zeichneMeine(); markiere(); return; }
      const nb = t.closest('[data-neu]'); if (nb) return einfuegen(nb.dataset.neu);
      const te = t.closest('[data-teil]'); if (te) return waehle(te.dataset.teil);
      const zu = t.closest('[data-zu]'); if (zu) { $('#mlPruefen').open = false; const b = zu.dataset.zu; waehle(/^\d+$/.test(b) ? +b : b); return; }
      const ge = t.closest('[data-geraet]'); if (ge) { geraet = +ge.dataset.geraet; $$('[data-geraet]').forEach(x => x.classList.toggle('an', x === ge)); $('#mlBuehne').style.setProperty('--w', geraet + 'px'); $('#mlBuehne').classList.toggle('ml-handy', geraet < 600); setTimeout(rahmenGeladen, 80); return; }
      const fo = t.closest('[data-foto]'); if (fo) { const z = ziel(), b = M.bilder.find(x => x.key === fo.dataset.foto); z.foto = b.key; z.url = ''; z.alt = b.alt; $('#mlFotos').close(); zeigeWahl(); geaendert(); return; }
      const g = t.closest('#mlFotoGruppen [data-g]'); if (g) { fGruppe = g.dataset.g; $$('#mlFotoGruppen button').forEach(x => x.classList.toggle('an', x === g)); fotoRaster(); return; }
    });
    $('.ml-mitte').addEventListener('pointermove', e => { if (e.pointerType === 'mouse') kippe(e.clientX, e.clientY); });
    $('.ml-mitte').addEventListener('pointerleave', loeseKipp);
    $('#mlRahmen').addEventListener('pointerleave', e => { const m = $('.ml-mitte').getBoundingClientRect(); if (e.clientX < m.left || e.clientX > m.right) loeseKipp(); });
    $('#mlFotoSuche').addEventListener('input', fotoRaster);
    $('#mlFotoZu').addEventListener('click', () => $('#mlFotos').close());
    $('#mlFotos').addEventListener('click', e => { if (e.target === $('#mlFotos')) $('#mlFotos').close(); });
    $('#mlName').addEventListener('input', e => { doc.name = e.target.value; geaendert(); });
    $('#mlKopieren').addEventListener('click', kopiere);
    $('#mlDatei').addEventListener('click', speichere);
    $('#mlFenster').addEventListener('click', () => { const w = window.open('', '_blank'); if (w) { w.document.open(); w.document.write(DSMAIL.html(doc, { basis: LOKAL, M })); w.document.close(); } });
    document.addEventListener('click', e => { const p = $('#mlPruefen'); if (p.open && !e.target.closest('#mlPruefen')) p.open = false; });
    document.body.classList.add('an');
    /* K5 (Tor 2, 30.10.2026): reicht die mittlere Spalte nicht (z. B. 1000 px), wird die Vorschau als Ganzes kleiner, nie angeschnitten und nie seitlich scrollend */
    let passt = false;
    const passe = () => { if (passt) return; const m = $('.ml-mitte'), b = $('#mlBuehne'); if (!m || !b) return; passt = true;
      Object.assign(b.style, { scale: '', transformOrigin: '', marginLeft: '', marginRight: '', marginBottom: '' });   // zoom schneidet in Safari das iframe ab, darum scale mit ausgeglichenen Rändern
      if (innerWidth > 980) { const g = getComputedStyle(m), frei = m.clientWidth - parseFloat(g.paddingLeft) - parseFloat(g.paddingRight), W = b.offsetWidth, H = b.offsetHeight, z = Math.min(1, frei / W);
        if (z < 1) Object.assign(b.style, { scale: z.toFixed(3), transformOrigin: '50% 0', marginLeft: `${-(W - z * W) / 2}px`, marginRight: `${-(W - z * W) / 2}px`, marginBottom: `${-(H - z * H)}px` }); }
      requestAnimationFrame(() => { passt = false; }); };
    addEventListener('resize', passe); new MutationObserver(passe).observe($('#mlBuehne'), { attributes: true, attributeFilter: ['style', 'class'] }); passe();
  }
  window.__ML = { get doc() { return doc; }, VORLAGEN, neu: k => neu(VORLAGEN.find(x => x.key === k)), html: o => DSMAIL.html(doc, o || { M }) };
  los();
})();
