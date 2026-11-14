/* Tagesspa, 15 Fassungen (26.10.2026): Pfeiltasten blättern; Fassung 13 tauscht das Foto an derselben Stelle. */
(function(){
var nav=document.querySelector('.vnr');if(nav){var a=nav.querySelectorAll('a');addEventListener('keydown',function(e){if(e.key==='ArrowLeft')location.href=a[0].href;if(e.key==='ArrowRight')location.href=a[1].href})}
var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
var w=document.querySelector('.dx13');if(!w)return;
var g=w.querySelector('.dx13-bild img'),bs=w.querySelectorAll('.dx13-wahl button');
function setze(b){if(b.classList.contains('an'))return;bs.forEach(function(x){x.classList.toggle('an',x===b)});
 var n=new Image();n.src='assets/img/'+b.dataset.b+'-l.webp';n.decode().then(function(){g.removeAttribute('srcset');g.src=n.src;g.style.objectPosition=b.dataset.p||'';
  if(!still)g.animate([{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:1100,easing:'cubic-bezier(.2,.7,.2,1)'})})}
bs.forEach(function(b){b.addEventListener('click',function(){setze(b)});b.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover)').matches)setze(b)})});
})();
