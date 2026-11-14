/* Wellness & Spa · Zimmerseite, Fotos der Zimmerabschnitte (25.10.2026): Wechsler mit Messingknäufen, Umblättern, Bühne für alle Fotos. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function eager(r){$$('img[loading="lazy"]',r).forEach(function(i){i.loading='eager'})}

/* 06 Bis an den Rand: der echte Seitenabstand des Abschnitts */
if(document.body.classList.contains('zb06')){function rand(){var vw=document.documentElement.clientWidth;$$('.zd').forEach(function(z){var zi=z.querySelector('.zd-in'),l=z.getBoundingClientRect().left+zi.offsetLeft;z.style.setProperty('--pl',l+'px');z.style.setProperty('--pr',(vw-l-zi.offsetWidth)+'px')})}rand();addEventListener('load',rand);setTimeout(rand,600);addEventListener('resize',rand)}

/* Wechsler */
$$('.wx').forEach(function(w){var fs=$$('.wx-f',w),n=fs.length,a=0,nr=$('[data-wx-nr]',w),cap=$('[data-wx-cap]',w),caps=JSON.parse(w.dataset.caps||'[]'),blatt=w.classList.contains('wx--blatt');
 if(n<2)return;
 function geh(i){var alt=a;a=(i+n)%n;if(alt===a)return;eager(w);
  if(blatt){fs[alt].classList.add('weg');setTimeout(function(){fs[alt].classList.remove('weg')},860)}
  fs.forEach(function(f,j){f.classList.toggle('an',j===a)});nr.textContent=a+1;cap.textContent=caps[a]||''}
 $$('.wx-k',w).forEach(function(b){b.addEventListener('click',function(){geh(a+ +b.dataset.d)})});
 var x0=null;$('.wx-r',w).addEventListener('pointerdown',function(ev){x0=ev.clientX});
 $('.wx-r',w).addEventListener('pointerup',function(ev){if(x0===null)return;var dx=ev.clientX-x0;x0=null;if(Math.abs(dx)>40)geh(a+(dx<0?1:-1))})});

/* Bühne für alle Fotos */
var lbx=$('.lbx');if(lbx){var r=$('.lbx-r'),nr=$('[data-lbx-nr]'),nn=$('[data-lbx-n]'),cap=$('[data-lbx-cap]'),bilder=[],caps=[],a=0;
 function zeig(i){a=(i+bilder.length)%bilder.length;$$('img',r).forEach(function(im,j){im.classList.toggle('an',j===a)});nr.textContent=a+1;cap.textContent=caps[a]||''}
 function auf(lb){r.innerHTML='';caps=JSON.parse(lb.dataset.caps||'[]');bilder=$$('template.lb-t',lb).map(function(t){var im=t.content.firstElementChild.cloneNode(true);im.removeAttribute('loading');r.appendChild(im);return im});
  nn.textContent=bilder.length;zeig(0);lbx.classList.add('offen');lbx.setAttribute('aria-hidden','false');document.documentElement.classList.add('lbx-still')}
 function zu(){lbx.classList.remove('offen');lbx.setAttribute('aria-hidden','true');document.documentElement.classList.remove('lbx-still')}
 $$('.lb-auf').forEach(function(b){b.addEventListener('click',function(){auf(b.closest('.lb, .lbw'))})});
 $$('.wx-k',lbx).forEach(function(b){b.addEventListener('click',function(){zeig(a+ +b.dataset.d)})});
 $('.lbx-zu').addEventListener('click',zu);$('.lbx-hg').addEventListener('click',zu);
 addEventListener('keydown',function(ev){if(!lbx.classList.contains('offen'))return;if(ev.key==='Escape')zu();if(ev.key==='ArrowRight')zeig(a+1);if(ev.key==='ArrowLeft')zeig(a-1)})}
})();
