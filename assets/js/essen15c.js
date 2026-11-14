/* Wellness & Spa · «setzen Sie sich», dritte Runde (25.10.2026). Je Fassung ein eigener Moment, nur transform/opacity. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
if(location.hash==='#gourmet'){addEventListener('load',function(){setTimeout(function(){var z=document.getElementById('gourmet');if(z)scrollTo(0,z.getBoundingClientRect().top+scrollY)},250)})}
var sek=$('.ec');if(!sek)return;
var weich=matchMedia('(prefers-reduced-motion: reduce)').matches,handy=function(){return innerWidth<=900};
function warm(r){$$('img[loading="lazy"]',r).forEach(function(i){i.loading='eager'})}
new IntersectionObserver(function(es,o){if(es[0].isIntersecting){warm(sek);o.disconnect()}},{rootMargin:'120% 0px'}).observe(sek);
function ist(n){return sek.classList.contains('cs'+n)}

/* 02 Gang für Gang: der Gang in der Mitte wird rechts aufgetragen */
if(ist('02')){var g=$$('.sx2-g'),f=$$('.sx2-f'),z=$('[data-c2]'),N=['Erster Gang','Zweiter Gang','Dritter Gang','Vierter Gang','Fünfter Gang'];
 function geh(i){f.forEach(function(x,j){x.classList.toggle('an',j<=i)});g.forEach(function(x,j){x.classList.toggle('an',j===i)});if(z)z.textContent=N[i]}
 var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting)geh(+x.target.dataset.i)})},{rootMargin:'-46% 0px -46% 0px'});
 g.forEach(function(x){io.observe(x)})}

/* 04 Zwischen zwei Wänden: Säulen im Gegenlauf */
if(ist('04')&&!weich){var w=$$('[data-c4]'),lauf=false;
 function rech(){lauf=false;if(handy()){w.forEach(function(x){x.style.transform=''});return}
  var r=sek.getBoundingClientRect(),vh=innerHeight;if(r.bottom<-200||r.top>vh+200)return;
  var p=(r.top+r.height/2-vh/2)/vh;w.forEach(function(x){x.style.transform='translate3d(0,'+(+x.dataset.c4*p*-110).toFixed(1)+'px,0)'})}
 addEventListener('scroll',function(){if(!lauf){lauf=true;requestAnimationFrame(rech)}},{passive:true});addEventListener('resize',rech);rech()}

/* 06 Der Tag am Tisch: Zeit antippen, Messingmarke gleitet, Bild steigt herauf */
if(ist('06')){var p6=$$('.sx6-p'),f6=$$('.sx6-f'),s6=$$('.sx6-s'),m6=$('.sx6-marke'),a6=0;
 function geh6(i){if(i===a6)return;f6.forEach(function(x,j){x.classList.remove('war');if(j===a6)x.classList.add('war');x.classList.toggle('an',j===i)});
  p6.forEach(function(x,j){x.classList.toggle('an',j===i)});s6.forEach(function(x,j){x.classList.toggle('an',j===i)});m6.style.transform='translateX('+(i*100)+'%)';a6=i}
 p6.forEach(function(x,i){x.addEventListener('click',function(){geh6(i)});x.addEventListener('mouseenter',function(){if(!handy())geh6(i)})})}

/* 15 Die Karte in grosser Schrift: Zeigen (Handy: Mitte) hebt den Teller in die Zeile */
if(ist('15')){var z15=$$('.sx15-z');
 function geh15(i){z15.forEach(function(x,j){x.classList.toggle('an',j===i)})}
 z15.forEach(function(x,i){x.addEventListener('mouseenter',function(){if(!handy())geh15(i)});x.addEventListener('focus',function(){geh15(i)})});
 var io15=new IntersectionObserver(function(es){if(!handy())return;es.forEach(function(x){if(x.isIntersecting)geh15(+x.target.dataset.i)})},{rootMargin:'-45% 0px -45% 0px'});
 z15.forEach(function(x){io15.observe(x)})}
})();
