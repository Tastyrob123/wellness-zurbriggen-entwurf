/* Wellness & Spa · Zimmerseite, 15 Darstellungen der Zimmerabschnitte (25.10.2026). Nur transform/opacity. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var B=document.body.classList,weich=matchMedia('(prefers-reduced-motion: reduce)').matches;
function eager(r){$$('img[loading="lazy"]',r).forEach(function(i){i.loading='eager'})}

/* Rahmen: Knäufe, Wischen, Reiter; Sonderformen Album (za-blatt) und Stapel (za-stapel) */
$$('.za-wx').forEach(function(w){var fs=$$(':scope > .za-r > .za-f',w),n=fs.length,a=0,nr=$('[data-nr]',w),cap=$('[data-cap]',w),caps=JSON.parse(w.dataset.caps||'[]'),
 blatt=w.classList.contains('za-blatt'),stapel=w.classList.contains('za-stapel'),ord=fs.map(function(_,i){return i}),busy=false;
 var reiter=w.parentElement?$$('.za-reiter button',w.parentElement):[];
 function lege(){ord.forEach(function(fi,p){fs[fi].style.setProperty('--p',p);fs[fi].dataset.p=p})}
 if(stapel)lege();
 function zeig(){if(nr)nr.textContent=a+1;if(cap)cap.textContent=caps[a]||'';
  if(reiter.length){var k=fs[a].dataset.kat;reiter.forEach(function(r){r.classList.toggle('an',r.dataset.kat===k)})}}
 function geh(i){var alt=a;a=(i+n)%n;if(alt===a||busy)return;eager(w);
  if(stapel){busy=true;var vorn=fs[ord[0]];if((i-alt+n)%n===1){vorn.classList.add('weg');setTimeout(function(){ord.push(ord.shift());vorn.classList.remove('weg');lege();busy=false},480)}
   else{while(ord[0]!==a)ord.unshift(ord.pop());lege();busy=false}}
  else{if(blatt){fs[alt].classList.add('weg');setTimeout(function(){fs[alt].classList.remove('weg')},860)}
   fs.forEach(function(f,j){f.classList.toggle('an',j===a)})}
  zeig()}
 if(n<2)return;
 $$(':scope > .za-st .za-k',w).forEach(function(b){b.addEventListener('click',function(){geh(a+ +b.dataset.d)})});
 reiter.forEach(function(r){r.addEventListener('click',function(){geh(+r.dataset.i)})});
 var x0=null,rr=$('.za-r',w);rr.addEventListener('pointerdown',function(ev){x0=ev.clientX});
 rr.addEventListener('pointerup',function(ev){if(x0===null)return;var dx=ev.clientX-x0;x0=null;if(Math.abs(dx)>40)geh(a+(dx<0?1:-1))})});

/* 02 Band: Knäufe schieben um ein Bild */
$$('.za-bandw').forEach(function(w){var b=$('.za-band',w);$$('.za-k',w).forEach(function(k){k.addEventListener('click',function(){var f=$('.za-bf',b);
 b.scrollBy({left:(+k.dataset.d)*(f?f.offsetWidth+20:400),behavior:weich?'auto':'smooth'})})})});

/* 13 Detail zuerst */
if(B.contains('zav13')){var zs=$$('.za-zoom'),l=false;
 function r(){l=false;var vh=innerHeight;zs.forEach(function(z){var q=z.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh-q.top)/(vh*.9)));
  z.firstElementChild.style.setProperty('--z',weich?1:(2.2-1.2*(1-Math.pow(1-p,2))).toFixed(4))})}
 addEventListener('scroll',function(){if(!l){l=true;requestAnimationFrame(r)}},{passive:true});addEventListener('resize',r);r()}

/* 15 Bühne und Liste */
if(B.contains('zav15')){var es=$$('.za-be'),bs=$$('.za-bz');eager($('.za-buehne'));
 var io=new IntersectionObserver(function(x){x.forEach(function(y){if(y.isIntersecting){var i=+y.target.dataset.i;es.forEach(function(q){q.classList.toggle('an',+q.dataset.i===i)});bs.forEach(function(q){q.classList.toggle('an',+q.dataset.i===i)})}})},{rootMargin:'-48% 0px -48% 0px'});
 es.forEach(function(q){io.observe(q)});es[0].classList.add('an')}

/* Alle Fotos: dunkle Bühne */
var lb=$('.za-lb');if(lb){var r=$('.za-lbr'),nr=$('[data-lbnr]'),nn=$('[data-lbn]'),cap=$('[data-lbcap]'),bil=[],caps=[],a=0;
 function zeig(i){a=(i+bil.length)%bil.length;bil.forEach(function(im,j){im.classList.toggle('an',j===a)});nr.textContent=a+1;cap.textContent=caps[a]||''}
 function auf(w){r.innerHTML='';caps=JSON.parse(w.dataset.caps||'[]');bil=$$('template.za-tpl',w).map(function(t){var im=t.content.firstElementChild.cloneNode(true);im.removeAttribute('loading');r.appendChild(im);return im});
  nn.textContent=bil.length;zeig(0);lb.classList.add('offen');lb.setAttribute('aria-hidden','false');document.documentElement.classList.add('za-still')}
 function zu(){lb.classList.remove('offen');lb.setAttribute('aria-hidden','true');document.documentElement.classList.remove('za-still')}
 $$('.za-alle').forEach(function(b){b.addEventListener('click',function(){auf(b.closest('.za-lbw'))})});
 $$('.za-k',lb).forEach(function(b){b.addEventListener('click',function(){zeig(a+ +b.dataset.d)})});
 $('.za-lbzu').addEventListener('click',zu);$('.za-lbhg').addEventListener('click',zu);
 addEventListener('keydown',function(ev){if(!lb.classList.contains('offen'))return;if(ev.key==='Escape')zu();if(ev.key==='ArrowRight')zeig(a+1);if(ev.key==='ArrowLeft')zeig(a-1)})}
})();
