/* Wellness & Spa · Behandlungskarte «Die Anwendungen», 15 Fassungen (26.10.2026). Je Fassung ein eigener Moment, nur transform/opacity. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var sek=$('.aw');
var ziel=location.hash.slice(1);
if(ziel){addEventListener('load',function(){setTimeout(function(){var z=document.getElementById(ziel==='karte'?'karte':ziel)||document.getElementById('karte');if(z){var s=sek||z;scrollTo(0,s.getBoundingClientRect().top+scrollY)}},250)})}
if(!sek){/* heutiger Stand */return}
function ist(n){return sek.classList.contains('awv'+n)}
var handy=function(){return innerWidth<=900};
new IntersectionObserver(function(es,o){if(es[0].isIntersecting){$$('img[loading="lazy"]',sek).forEach(function(i){i.loading='eager'});o.disconnect()}},{rootMargin:'120% 0px'}).observe(sek);

/* Teile, die ankommen: sichtbar von Anfang an, ihr Moment beginnt, sobald sie den unteren Rand erreichen */
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('da');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px'});
$$('[data-da]',sek).forEach(function(x){io.observe(x)});
if(ist('01')){var fr=$('.aw1-front');io.observe(fr)}

/* Wörter wählen Blätter (data-w → data-b). Die Blätter liegen übereinander im selben Feld: die Höhe bleibt, nichts springt. */
function waehle(k){
 $$('[data-w]',sek).forEach(function(w){var an=w.dataset.w===k;w.classList.toggle('an',an);if(w.tagName==='BUTTON')w.setAttribute('aria-pressed',String(an))});
 $$('[data-b]',sek).forEach(function(b){var an=b.dataset.b===k;if(an&&!b.classList.contains('an')){b.classList.remove('neu');void b.offsetWidth;b.classList.add('neu')}b.classList.toggle('an',an)});
 if(ist('07'))stapel();
}
if(!ist('10')&&!ist('07'))$$('[data-w]',sek).forEach(function(w){w.addEventListener('click',function(){waehle(w.dataset.w)})});
if(ziel&&$('[data-b="'+ziel+'"]',sek))waehle(ziel);

/* Zeilen der Karte: ein Klick zeigt den ganzen Text */
$$('.aw-l li',sek).forEach(function(li){if(!li.querySelector('p'))return;var t=function(){li.classList.toggle('auf')};li.addEventListener('click',function(ev){if(ist('07')&&!li.closest('.aw7-s.an'))return;ev.stopPropagation();t()});li.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();t()}})});

/* 02 Einmal durch die Karte: die Kategorie in der Mitte wechselt das Foto im Rahmen */
if(ist('02')){var c2=$('[data-c2]'),c2n=$('[data-c2n]');
 var o2=new IntersectionObserver(function(es){es.forEach(function(x){if(!x.isIntersecting)return;var k=x.target.dataset.g;
  $$('.aw2-f').forEach(function(f){f.classList.toggle('an',f.dataset.f===k)});
  c2.textContent=$('.aw-h',x.target).textContent;c2n.textContent=$$('li',x.target).length})},{rootMargin:'-45% 0px -50% 0px'});
 $$('.aw2-g').forEach(function(g){o2.observe(g)})}

/* 04 Wie viel Zeit haben Sie? Regler: was passt, bleibt hell */
if(ist('04')){var r4=$('.aw4 input'),G=[15,30,60,80,999],T=['Eine Viertelstunde','Eine halbe Stunde','Eine Stunde','Gut eine Stunde','Ein Nachmittag'],M=['bis 15 Min.','bis 30 Min.','bis 60 Min.','bis 80 Min.','auch länger'];
 function zeit(){var i=+r4.value;$('[data-c4]').textContent=T[i];$('[data-c4m]').textContent=M[i];r4.style.setProperty('--p',(i/4*100)+'%');
  $$('.aw4-f').forEach(function(f){f.classList.toggle('an',+f.dataset.s===i)});
  $$('.aw4-liste li').forEach(function(li){li.classList.toggle('aus',+li.dataset.m>G[i])})}
 r4.addEventListener('input',zeit);zeit()}

/* 05 Von Kopf bis Fuss: die Messinglinie zieht sich mit dem Scrollen */
if(ist('05')){var l5=$('.aw5-linie i'),b5=$('.aw5'),w5=false;
 function linie(){w5=false;var r=b5.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height));l5.style.transform='scaleY('+p.toFixed(4)+')'}
 addEventListener('scroll',function(){if(!w5){w5=true;requestAnimationFrame(linie)}},{passive:true});linie()}

/* 06 Die Hausmassage vorn: jede Kategorie öffnet ihr Blatt über der Seite */
if(ist('06')){$$('[data-dlg]').forEach(function(b){b.addEventListener('click',function(){var d=$('[data-dlg-b="'+b.dataset.dlg+'"]');d.showModal();d.scrollTop=0})});
 $$('.aw6-dlg').forEach(function(d){$('.aw6-zu',d).addEventListener('click',function(){d.close()});d.addEventListener('click',function(ev){if(ev.target===d)d.close()})});
 if(ziel){var d6=$('[data-dlg-b="'+ziel+'"]');if(d6)addEventListener('load',function(){setTimeout(function(){d6.showModal()},600)})}}

/* 07 Der Stapel: das gewählte Blatt kommt nach vorn, die anderen rücken in ihrer Reihenfolge nach hinten */
function stapel(){var s=$$('.aw7-s'),a=s.filter(function(x){return x.classList.contains('an')})[0],h=s.filter(function(x){return x!==a}).reverse();
 a.style.setProperty('--pos',0);h.forEach(function(x,i){x.style.setProperty('--pos',i+1)})}
if(ist('07')){$$('.aw7-s').forEach(function(s){var geh=function(){if(!s.classList.contains('an'))waehle(s.dataset.w)};s.addEventListener('click',geh);s.addEventListener('keydown',function(ev){if((ev.key==='Enter'||ev.key===' ')&&ev.target===s){ev.preventDefault();geh()}})});stapel()}

/* 08 Die Bahn: Pfeile blättern, die Messinglinie zeigt den Weg */
if(ist('08')){var b8=$('.aw8-bahn'),s8=$('.aw8-spur i'),w8=false;
 function spur(){w8=false;var m=b8.scrollWidth-b8.clientWidth;s8.style.transform='scaleX('+(m>0?(.12+.88*b8.scrollLeft/m):1).toFixed(4)+')'}
 b8.addEventListener('scroll',function(){if(!w8){w8=true;requestAnimationFrame(spur)}},{passive:true});spur();
 $$('.aw8-pfeile button').forEach(function(b){b.addEventListener('click',function(){var p=$('.aw8-p');b8.scrollBy({left:(+b.dataset.r)*(p.offsetWidth+parseFloat(getComputedStyle(b8).columnGap||0)),behavior:'smooth'})})})}

/* 09 Aus dem Saastal: ein Anker öffnet sein Band */
if(ist('09')&&ziel){var d9=document.getElementById(ziel);if(d9&&d9.tagName==='DETAILS')d9.open=true}

/* Lesefeld (10, 13): ein Name zeigt seinen Text */
function lies(li,pre,box){['k','n','z','t'].forEach(function(f){var el=$('[data-'+pre+f+']');if(!el)return;var v=f==='k'?li.dataset.kat:li.dataset[f];if(f==='n'){el.firstChild.nodeValue=v}else el.textContent=v||(f==='t'?'Text nach Absprache.':'')});
 if(box){box.classList.remove('neu');void box.offsetWidth;box.classList.add('neu')}}

/* 10 Das Register: ein Foto hebt seine Anwendungen hervor */
if(ist('10')){var f10=$$('.aw10-f'),l10=$$('.aw10-reg li');
 f10.forEach(function(f){f.addEventListener('click',function(){var k=f.classList.contains('an')&&f.dataset.w!=='*'?'*':f.dataset.w;
  f10.forEach(function(x){var an=x.dataset.w===k;x.classList.toggle('an',an);x.setAttribute('aria-pressed',String(an))});
  l10.forEach(function(li){li.classList.toggle('aus',k!=='*'&&li.dataset.k!==k)})})});
 var n10=$('[data-c10n]');n10.firstChild.nodeValue=n10.firstChild.nodeValue;
 l10.forEach(function(li){var g=function(){l10.forEach(function(x){x.classList.toggle('an',x===li)});var z=$('[data-c10z]');lies(li,'c10');z.textContent=li.dataset.z;$('.aw10-lese').classList.remove('neu');void sek.offsetWidth;$('.aw10-lese').classList.add('neu')};
  li.addEventListener('click',g);li.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();g()}})});
 if(ziel){var f=$('.aw10-f[data-w="'+ziel+'"]');if(f)f.click()}}

/* 13 Das Lesepult */
if(ist('13')){var pi=$('.aw13-pi');
 $$('.aw13-l li').forEach(function(li){var g=function(){$$('.aw13-l li').forEach(function(x){x.classList.toggle('an',x===li)});var n=$('[data-c13n]');n.textContent=li.dataset.n;$('[data-c13k]').textContent=li.dataset.kat;$('[data-c13z]').textContent=li.dataset.z;$('[data-c13t]').textContent=li.dataset.t||'Text nach Absprache.';pi.classList.remove('neu');void pi.offsetWidth;pi.classList.add('neu')};
  li.addEventListener('click',g);li.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();g()}})});
 $$('.aw13-w').forEach(function(w){w.addEventListener('click',function(){var li=$('.aw13-b[data-b="'+w.dataset.w+'"] li');if(li)li.click()})})}

/* 14 Die grossen Namen: das Foto folgt der Hand, ein Klick zieht die Lade herein */
if(ist('14')){var hv=$('.aw14-hover'),hb=$$('.aw14-hb'),sch=$('.aw14-schleier'),offen=null,x14=0,y14=0,w14=false;
 $$('.aw14-z button').forEach(function(b){
  b.addEventListener('mouseenter',function(){if(handy())return;hb.forEach(function(f){f.classList.toggle('an',f.dataset.hb===b.dataset.lade)});hv.classList.add('an')});
  b.addEventListener('click',function(){lade(b.dataset.lade)})});
 $('.aw14').addEventListener('mouseleave',function(){hv.classList.remove('an')});
 $('.aw14').addEventListener('mousemove',function(ev){x14=ev.clientX;y14=ev.clientY;if(!w14){w14=true;requestAnimationFrame(function(){w14=false;hv.style.transform='translate3d('+(x14+28)+'px,'+(y14-150)+'px,0)'})}});
 function lade(k){offen=$('[data-lade-b="'+k+'"]');offen.classList.add('offen');offen.setAttribute('aria-hidden','false');sch.classList.add('an');document.documentElement.style.overflow='hidden';hv.classList.remove('an');offen.scrollTop=0}
 function zu(){if(!offen)return;offen.classList.remove('offen');offen.setAttribute('aria-hidden','true');sch.classList.remove('an');document.documentElement.style.overflow='';offen=null}
 $$('.aw14-zu').forEach(function(b){b.addEventListener('click',zu)});sch.addEventListener('click',zu);addEventListener('keydown',function(ev){if(ev.key==='Escape')zu()});
 if(ziel&&$('[data-lade-b="'+ziel+'"]'))addEventListener('load',function(){setTimeout(function(){lade(ziel)},600)})}

/* 15 Der Weg zum Termin: drei Blicke gleiten seitwärts */
if(ist('15')){var sp=$('.aw15-spur'),wg=$$('.aw15-weg button'),weit=0,jetzt=0;
 function geh(i){if(i>weit)return;jetzt=i;sp.style.transform='translate3d('+(-100*i)+'%,0,0)';wg.forEach(function(b,j){b.classList.toggle('an',j===i);b.disabled=j>weit});
  $$('.aw15-blick').forEach(function(b,j){b.inert=j!==i});if(handy())scrollTo({top:sek.getBoundingClientRect().top+scrollY+($('.aw15-kopf').offsetHeight*.6),behavior:'smooth'})}
 $$('[data-geh]',sek).forEach(function(b){b.addEventListener('click',function(){geh(+b.dataset.geh)})});
 function kat(k){$$('.aw15-liste').forEach(function(l){l.classList.toggle('an',l.dataset.l15===k)});weit=Math.max(weit,1);if(weit>1)weit=1;geh(1)}
 $$('[data-k15]').forEach(function(b){b.addEventListener('click',function(){kat(b.dataset.k15)})});
 $$('.aw15-l button').forEach(function(b){b.addEventListener('click',function(){var d=b.dataset;$('[data-c15k]').textContent=d.kat;$('[data-c15n]').textContent=d.n;$('[data-c15z]').textContent=d.z;$('[data-c15t]').textContent=d.t||'Text nach Absprache.';
  $('.aw15-wf').innerHTML='<img src="assets/img/'+d.f+'-l.webp" alt="">';weit=2;geh(2)})});
 geh(0);if(ziel&&$('[data-k15="'+ziel+'"]'))kat(ziel)}
})();
