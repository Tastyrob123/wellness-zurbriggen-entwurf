/* Wellness & Spa · Behandlungskarte als 3D-Booklet (26.10.2026). Blätter drehen um den Rücken, nur transform/opacity. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var sek=$('.bk'),ziel=location.hash.slice(1);
if(ziel){addEventListener('load',function(){setTimeout(function(){var z=document.getElementById('karte');if(z)scrollTo(0,z.getBoundingClientRect().top+scrollY)},250)})}
if(!sek)return;
var bl=$$('.bk-blatt',sek),N=bl.length,START=JSON.parse(sek.dataset.start),tisch=$('.bk-tisch',sek),buch=$('.bk-buch',sek);
var handy=function(){return innerWidth<=900},weich=matchMedia('(prefers-reduced-motion: reduce)').matches;
var s=0,laeuft=null;   /* s = Zahl der umgeschlagenen Blätter (0 = zu, N = Rückseite) */
var NAMEN={};$$('.bk-worte button',sek).forEach(function(b){NAMEN[b.dataset.geh]=b.textContent});

/* Stapelfolge auch ohne 3D (Safari ohne Beschleunigung): das fliegende Blatt liegt oben, danach links aufsteigend, rechts absteigend */
function lage(b,j){b.style.zIndex=j<s?j+1:N-j+1}
function zeichne(){
 bl.forEach(function(b,j){var um=j<s,war=b.classList.contains('um');
  if(um!==war){b.style.zIndex=400+j;clearTimeout(b._t);b._t=setTimeout(function(){b._t=null;lage(b,j)},1080)}else if(!b._t)lage(b,j);
  b.classList.toggle('um',um);
  b.style.setProperty('--z',(um?(s-1-j):-(j-s))*0.6+'px');
  b.classList.toggle('oben',j===s);b.classList.toggle('oben-l',j===s-1)});
 sek.classList.toggle('auf',s>0);sek.classList.toggle('ende',s===N);
 /* Stand und Wort */
 var t='Umschlag',k=s>0&&s<N?'inhalt':'';
 if(s===N)t='Rückseite';else if(s>0){var l=2*s-1,r=2*s;t='Seite '+l+' – '+r;
  Object.keys(START).forEach(function(kk){if(s>=START[kk])k=kk})}
 if(s>0&&s<N){var nm=k==='inhalt'?'Inhalt':NAMEN[k];t+=' · '+nm}
 $('.bk-stand',sek).textContent=t;
 $$('.bk-worte button',sek).forEach(function(b){b.classList.toggle('an',b.dataset.geh===k)});
}
function geh(n,schnell){n=Math.max(0,Math.min(N,n));if(laeuft){clearInterval(laeuft);laeuft=null}zettelZu();
 if(handy()){var p=$('.bk-s[data-p="'+Math.max(0,2*n-1)+'"]',sek);if(p)buch.scrollTo({left:p.offsetLeft-buch.offsetLeft-(buch.clientWidth-p.offsetWidth)/2,behavior:'smooth'});return}
 if(schnell||Math.abs(n-s)<=1||weich){s=n;zeichne();return}
 var r=n>s?1:-1;laeuft=setInterval(function(){s+=r;zeichne();if(s===n){clearInterval(laeuft);laeuft=null}},110)}
zeichne();

/* Beim Ankommen schlägt die Mappe auf (sichtbar ist sie von Anfang an) */
var io=new IntersectionObserver(function(es,o){if(es[0].isIntersecting){o.disconnect();setTimeout(function(){if(s===0)geh(1)},450)}},{threshold:.45});
io.observe($('.bk-buehne',sek));

/* Blättern: rechte Seite vor, linke Seite zurück; Pfeile, Tasten, Wörter, Inhalt */
bl.forEach(function(b,j){b.addEventListener('click',function(ev){if(handy())return;if(ev.target.closest('li[data-n],a,button'))return;
 if(j===s)geh(s+1);else if(j===s-1)geh(s-1)})});
$$('.bk-pfeil',sek).forEach(function(p){p.addEventListener('click',function(){geh(s+(+p.dataset.dir))})});
buch.addEventListener('keydown',function(ev){if(ev.key==='ArrowRight'){ev.preventDefault();geh(s+1)}if(ev.key==='ArrowLeft'){ev.preventDefault();geh(s-1)}});
$$('[data-geh]',sek).forEach(function(b){b.addEventListener('click',function(ev){ev.stopPropagation();var k=b.dataset.geh;geh(k==='inhalt'?1:START[k])})});

/* Zettel: der ganze Text einer Anwendung */
var zt=$('.bk-zettel',sek);
function zettel(li){$('[data-zk]',zt).textContent=li.dataset.kat;$('[data-zn]',zt).textContent=li.dataset.n;$('[data-zz]',zt).textContent=li.dataset.z;
 $('[data-zt]',zt).textContent=li.dataset.t||'Dauer und Ablauf nach Absprache.';zt.classList.add('an');zt.setAttribute('aria-hidden','false')}
function zettelZu(){zt.classList.remove('an');zt.setAttribute('aria-hidden','true')}
$$('.bk-l-liste li',sek).forEach(function(li){li.addEventListener('click',function(ev){ev.stopPropagation();zettel(li)});li.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();zettel(li)}})});
$('.bk-zu',zt).addEventListener('click',zettelZu);
document.addEventListener('click',function(ev){if(zt.classList.contains('an')&&!ev.target.closest('.bk-zettel,.bk-l-liste li'))zettelZu()});
addEventListener('keydown',function(ev){if(ev.key==='Escape')zettelZu()});

/* Die Mappe folgt der Hand ein wenig */
var mx=0,my=0,w=false,b=$('.bk-buehne',sek);
if(!weich)b.addEventListener('mousemove',function(ev){if(handy())return;var r=b.getBoundingClientRect();mx=((ev.clientX-r.left)/r.width-.5);my=((ev.clientY-r.top)/r.height-.5);
 if(!w){w=true;requestAnimationFrame(function(){w=false;tisch.style.setProperty('--mx',(mx*5).toFixed(2)+'deg');tisch.style.setProperty('--my',(-my*4).toFixed(2)+'deg')})}});
b.addEventListener('mouseleave',function(){tisch.style.setProperty('--mx','0deg');tisch.style.setProperty('--my','0deg')});

/* Anker: #massagen … öffnet die Karte dort */
if(ziel&&START[ziel])addEventListener('load',function(){setTimeout(function(){geh(START[ziel])},900)});
})();
