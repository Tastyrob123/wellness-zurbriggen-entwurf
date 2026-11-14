/* Wellness & Spa · Behandlungskarte wie die Speisekarte im Grand Beau-Rivage (26.10.2026): Reiter, Bänder zum Ziehen, Pfeile, Laufbalken. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var sek=$('.sk'),ziel=location.hash.slice(1);
if(ziel){addEventListener('load',function(){setTimeout(function(){var z=document.getElementById('karte');if(z)scrollTo(0,z.getBoundingClientRect().top+scrollY)},250)})}
if(!sek)return;
var reiter=$$('.sk-reiter',sek),felder=$$('.sk-feld',sek);

/* Band: Pfeile, Laufbalken, Ziehen mit der Maus */
function band(g){
 var b=$('.sk-band',g),pz=$('[data-dir="-1"]',g),pw=$('[data-dir="1"]',g),lauf=$('.sk-lauf',g),li=$('.sk-lauf i',g),w=false;
 function stand(){w=false;var m=b.scrollWidth-b.clientWidth,p=m>0?b.scrollLeft/m:0;
  pz.disabled=b.scrollLeft<4;pw.disabled=b.scrollLeft>m-4;
  var lb=lauf.clientWidth,iw=Math.max(.12,Math.min(1,b.clientWidth/b.scrollWidth))*lb;li.style.width=iw+'px';li.style.transform='translateX('+((lb-iw)*p).toFixed(1)+'px)';
  lauf.style.visibility=m>4?'visible':'hidden'}
 b.addEventListener('scroll',function(){if(!w){w=true;requestAnimationFrame(stand)}},{passive:true});addEventListener('resize',stand);
 [pz,pw].forEach(function(k){k.addEventListener('click',function(){var c=$('.sk-k',b);b.scrollBy({left:(+k.dataset.dir)*(c.offsetWidth+parseFloat(getComputedStyle(b).columnGap||24))*2,behavior:'smooth'})})});
 var x0=0,s0=0,zieht=false,unten=false;
 b.addEventListener('pointerdown',function(ev){if(ev.pointerType!=='mouse')return;unten=true;zieht=false;x0=ev.clientX;s0=b.scrollLeft});
 addEventListener('pointermove',function(ev){if(!unten)return;var d=ev.clientX-x0;if(!zieht&&Math.abs(d)>6){zieht=true;b.classList.add('zieht')}if(zieht)b.scrollLeft=s0-d});
 addEventListener('pointerup',function(){if(!unten)return;unten=false;if(zieht)setTimeout(function(){b.classList.remove('zieht')},0)});
 g._stand=stand;stand();
}
$$('.sk-gang',sek).forEach(band);

/* Karten rücken beim Ankommen gestaffelt nach (sichtbar sind sie von Anfang an) */
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('da');io.unobserve(x.target)}})},{rootMargin:'0px 0px -10% 0px'});
$$('.sk-band',sek).forEach(function(b){io.observe(b)});

/* Reiter wählen die Rubrik */
function zeig(k){var f=felder.filter(function(x){return x.dataset.feld===k})[0];if(!f)return;
 reiter.forEach(function(r){r.setAttribute('aria-pressed',String(r.dataset.k===k))});
 felder.forEach(function(x){x.hidden=x!==f});
 var b=$('.sk-band',f);b.scrollLeft=0;b.classList.remove('da');void b.offsetWidth;b.classList.add('da');io.unobserve(b);
 $('.sk-gang',f)._stand()}
reiter.forEach(function(r){r.addEventListener('click',function(){zeig(r.dataset.k)})});

/* Eine Karte zeigt auf Klick den ganzen Text */
$$('.sk-k',sek).forEach(function(k){if(!$('.sk-t',k))return;var t=function(){k.classList.toggle('auf')};k.addEventListener('click',t);k.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();t()}})});

if(ziel&&felder.some(function(f){return f.dataset.feld===ziel}))zeig(ziel);
})();
