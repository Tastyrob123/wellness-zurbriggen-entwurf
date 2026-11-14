/* Wellness & Spa · Behandlungskarte, 15 Alternativen (26.10.2026). Je Fassung ein Moment, nur transform/opacity. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var sek=$('.kv'),ziel=location.hash.slice(1);
if(ziel){addEventListener('load',function(){setTimeout(function(){var z=document.getElementById('karte');if(z)scrollTo(0,z.getBoundingClientRect().top+scrollY)},250)})}
if(!sek)return;
function ist(n){return sek.classList.contains('kvv'+n)}
var handy=function(){return innerWidth<=900};
var reiter=$$('.sk-reiter',sek),felder=$$('.kv-feld',sek),fertig=[];

/* ---------- Karten mit einer gewählten (01 Fächer, 02 Deck, 03 Galerie, 04 Staffel, 12 Karteikasten) ---------- */
var LAGE={
 '01':function(ks,a){ks.forEach(function(k,i){var d=Math.max(-4,Math.min(4,i-a));k.style.setProperty('--d',d);k.style.setProperty('--ad',Math.abs(d));k.classList.toggle('an',i===a)})},
 '02':function(ks,a,alt){var n=ks.length;ks.forEach(function(k,i){var p=(i-a+n)%n;k.style.setProperty('--p',p);k.style.setProperty('--q',Math.min(p,3))});
  if(alt!=null&&alt!==a&&(a===(alt+1)%n)){var w=ks[alt];w.classList.add('weg');setTimeout(function(){w.classList.remove('weg')},430)}},
 '03':function(ks,a){ks.forEach(function(k,i){var d=i-a,ad=Math.abs(d),s=d<0?-1:1;
  k.style.transform=d===0?'translateZ(40px)':'translateX('+(s*(82+(Math.min(ad,5)-1)*30))+'%) translateZ('+(-(150+Math.min(ad,5)*90))+'px) rotateY('+(-s*44)+'deg)';
  k.style.opacity=ad>4?0:1;k.style.zIndex=100-ad;k.classList.toggle('an',d===0)})},
 '04':function(ks,a){ks.forEach(function(k,i){var p=i-a;
  if(p<0){k.style.transform='translate3d(-125%,0,80px) rotateY(14deg)';k.style.opacity=0}
  else{var q=Math.min(p,6);k.style.transform='translate3d('+(q*42)+'%,'+(-q*9)+'%,'+(-q*170)+'px)';k.style.opacity=p>5?0:1}
  k.style.zIndex=100-Math.abs(p);k.classList.toggle('an',p===0)})},
 '12':function(ks,a){ks.forEach(function(k,i){k.classList.toggle('an',i===a);k.classList.toggle('vorbei',i<a);k.style.setProperty('--q',Math.min(Math.max(i-a,0),8))})}
};
function waehler(feld,n){
 var box=$('[data-dreh]',feld);if(!box)return;var ks=n==='12'?$$('.kv12-karte',box):$$('.sk-k',box),a=0,pf=$$('.kv-pfeile button',feld),nr=$('[data-nr]',feld),namen=$$('[data-geh]',feld);
 function set(x){var alt=a;a=Math.max(0,Math.min(ks.length-1,x));LAGE[n](ks,a,alt);if(nr)nr.textContent=a+1;
  if(pf.length){pf[0].disabled=a===0&&n!=='02';pf[1].disabled=a===ks.length-1&&n!=='02'}
  namen.forEach(function(b,i){b.classList.toggle('an',i===a)})}
 pf.forEach(function(b){b.addEventListener('click',function(){var r=+b.dataset.dir;if(n==='02'){set((a+r+ks.length)%ks.length)}else set(a+r)})});
 ks.forEach(function(k,i){k.addEventListener('click',function(){if(i!==a)set(i);else if(n!=='12')k.classList.toggle('auf')})});
 namen.forEach(function(b,i){b.addEventListener('click',function(){set(i)})});
 box.addEventListener('keydown',function(ev){if(ev.key==='ArrowRight')set(a+1);if(ev.key==='ArrowLeft')set(a-1)});
 set(n==='01'||n==='03'?Math.min(2,ks.length-1):0)}

/* ---------- Bänder (05, 08, 13, 15): Ziehen und Pfeile ---------- */
function band(feld){
 var b=$('.kv-band',feld);if(!b)return;var pf=$$('.kv-pfeile button',feld),w=false;
 function stand(){w=false;var m=b.scrollWidth-b.clientWidth;if(pf.length){pf[0].disabled=b.scrollLeft<4;pf[1].disabled=b.scrollLeft>m-4}}
 b.addEventListener('scroll',function(){if(!w){w=true;requestAnimationFrame(stand)}},{passive:true});
 pf.forEach(function(k){k.addEventListener('click',function(){var c=b.firstElementChild;b.scrollBy({left:(+k.dataset.dir)*(c.offsetWidth+20)*2,behavior:'smooth'})})});
 var x0=0,s0=0,zieht=false,unten=false;
 b.addEventListener('pointerdown',function(ev){if(ev.pointerType!=='mouse')return;unten=true;zieht=false;x0=ev.clientX;s0=b.scrollLeft});
 addEventListener('pointermove',function(ev){if(!unten)return;var d=ev.clientX-x0;if(!zieht&&Math.abs(d)>6){zieht=true;b.classList.add('zieht')}if(zieht)b.scrollLeft=s0-d});
 addEventListener('pointerup',function(){if(!unten)return;unten=false;if(zieht)setTimeout(function(){b.classList.remove('zieht')},0)});
 stand()}

/* ---------- je Fassung ---------- */
function vitrine(feld){var sp=$('[data-seiten]',feld),ks=$$('.kv7-fach',sp),pf=$$('.kv-pfeile button',feld),s=0;
 function seiten(){return Math.ceil(ks.length/(handy()?2:6))}
 function set(x){s=Math.max(0,Math.min(seiten()-1,x));sp.style.transform='translateX(calc('+(-s)+' * (100% + var(--gap))))';pf[0].disabled=s===0;pf[1].disabled=s>=seiten()-1}
 pf.forEach(function(b){b.addEventListener('click',function(){set(s+(+b.dataset.dir))})});set(0);
 $$('.sk-k',sp).forEach(function(k){k.addEventListener('click',function(){k.classList.toggle('auf')})})}
function buehne(feld){var g=$('.kv10-gross',feld),img=$('.sk-f img',g),ks=$$('.kv10-k',feld);
 ks.forEach(function(k){k.addEventListener('click',function(){ks.forEach(function(x){x.classList.toggle('an',x===k)});
  img.removeAttribute('srcset');img.src='assets/img/'+k.dataset.f+'-m.webp';img.style.objectPosition='';
  $('[data-n]',g).textContent=k.dataset.n;$('[data-t]',g).textContent=k.dataset.t||'Ablauf nach Absprache.';$('[data-z]',g).textContent=k.dataset.z;
  g.classList.remove('neu');void g.offsetWidth;g.classList.add('neu');if(handy())g.scrollIntoView({behavior:'smooth',block:'start'})})})}
function ebenen(){var sp=[],w=false;
 function lauf(){w=false;if(handy())return;felder.forEach(function(f){if(f.hidden)return;var r=f.getBoundingClientRect();if(r.bottom<-200||r.top>innerHeight+200)return;
  var c=r.top+r.height/2-innerHeight/2;$$('.kv14-s',f).forEach(function(s){s.style.transform='translate3d(0,'+Math.max(-120,Math.min(120,c*(+s.dataset.tempo))).toFixed(1)+'px,0)'})})}
 addEventListener('scroll',function(){if(!w){w=true;requestAnimationFrame(lauf)}},{passive:true});return lauf}
var ebLauf=ist('14')?ebenen():null;

function bereit(feld){if(fertig.indexOf(feld)>=0)return;fertig.push(feld);
 ['01','02','03','04','12'].forEach(function(n){if(ist(n))waehler(feld,n)});
 if(ist('05')||ist('08')||ist('13')||ist('15'))band(feld);
 if(ist('05'))$$('.kv5-dreh',feld).forEach(function(b){b.addEventListener('click',function(){b.parentNode.classList.toggle('um')})});
 if(ist('06'))$$('.kv6-dreh',feld).forEach(function(b){b.addEventListener('click',function(){b.parentNode.classList.toggle('um')})});
 if(ist('07'))vitrine(feld);
 if(ist('08')){var ks8=$$('.sk-k',feld);ks8.forEach(function(k){k.addEventListener('click',function(){ks8.forEach(function(x){x.classList.toggle('an',x===k)})})})}
 if(ist('09')){var ks9=$$('.sk-k',feld);ks9.forEach(function(k){k.addEventListener('click',function(){var r=!k.classList.contains('raus');ks9.forEach(function(x){x.classList.remove('raus')});k.classList.toggle('raus',r)})})}
 if(ist('10'))buehne(feld);
 if(ist('11')||ist('13')||ist('14'))$$('.sk-k',feld).forEach(function(k){k.addEventListener('click',function(){k.classList.toggle('auf')})});
 if(ist('15'))$$('.kv15-g',feld).forEach(function(k){k.addEventListener('click',function(){k.classList.toggle('auf')})});
}

/* ---------- Reiter ---------- */
function zeig(k){var f=felder.filter(function(x){return x.dataset.feld===k})[0];if(!f)return;
 reiter.forEach(function(r){r.setAttribute('aria-pressed',String(r.dataset.k===k))});felder.forEach(function(x){x.hidden=x!==f});
 bereit(f);if(ist('11')){f.classList.remove('neu');void f.offsetWidth;f.classList.add('neu')}if(ebLauf)ebLauf()}
reiter.forEach(function(r){r.addEventListener('click',function(){zeig(r.dataset.k)})});
felder.filter(function(f){return !f.hidden}).forEach(bereit);
if(ist('11')){var io=new IntersectionObserver(function(es,o){if(es[0].isIntersecting){var f=felder.filter(function(x){return !x.hidden})[0];f.classList.add('neu');o.disconnect()}},{rootMargin:'0px 0px -15% 0px'});io.observe($('.kv-feld:not([hidden])',sek))}
if(ebLauf)ebLauf();
if(ziel&&felder.some(function(f){return f.dataset.feld===ziel}))zeig(ziel);
})();
