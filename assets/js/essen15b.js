/* Wellness & Spa · «setzen Sie sich», 15 Fassungen, zweite Runde (24.10.2026). Je Fassung ein eigener Moment, nur transform/opacity. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
if(location.hash==='#gourmet'){addEventListener('load',function(){setTimeout(function(){var z=document.getElementById('gourmet');if(z)scrollTo(0,z.getBoundingClientRect().top+scrollY)},250)})}
var sek=$('.ev');if(!sek)return;
var weich=matchMedia('(prefers-reduced-motion: reduce)').matches,handy=function(){return innerWidth<=900};
function warm(r){$$('img[loading="lazy"]',r).forEach(function(i){i.loading='eager'})}
new IntersectionObserver(function(es,o){if(es[0].isIntersecting){warm(sek);o.disconnect()}},{rootMargin:'120% 0px'}).observe(sek);
function ist(n){return sek.classList.contains('ev'+n)}
function kurz(s){[' (',','].forEach(function(z){if(s.indexOf(z)>0)s=s.split(z)[0]});return s}

/* 01 Gang für Gang: der Gang in der Bildschirmmitte wird im Rahmen aufgetragen */
if(ist('01')){var g1=$$('.g1-g'),f1=$$('.g1-f'),z1=$('[data-g1]'),N=['Erster Gang','Zweiter Gang','Dritter Gang','Vierter Gang','Fünfter Gang'];
 function geh1(i){f1.forEach(function(f,j){f.classList.toggle('an',j<=i)});g1.forEach(function(g,j){g.classList.toggle('an',j===i)});if(z1)z1.textContent=N[i]}
 var io1=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting)geh1(+x.target.dataset.i)})},{rootMargin:'-46% 0px -46% 0px'});
 g1.forEach(function(g){io1.observe(g)});geh1(0)}

/* 05 Zwischen zwei Wänden: die Wände laufen gegeneinander, die Karte bleibt */
if(ist('05')&&!weich){var w5=$$('[data-w5]'),lauf5=false;
 function rech5(){lauf5=false;if(handy()){w5.forEach(function(w){w.style.transform=''});return}
  var r=sek.getBoundingClientRect(),vh=innerHeight;if(r.bottom<-200||r.top>vh+200)return;
  var p=(r.top+r.height/2-vh/2)/vh;w5.forEach(function(w){w.style.transform='translate3d(0,'+(+w.dataset.w5*p*-110).toFixed(1)+'px,0)'})}
 addEventListener('scroll',function(){if(!lauf5){lauf5=true;requestAnimationFrame(rech5)}},{passive:true});addEventListener('resize',rech5);rech5()}

/* 06 Die Karte in grosser Schrift: Zeigen (Handy: Mitte) hebt den Teller in die Zeile */
if(ist('06')){var z6=$$('.z6-z');
 function geh6(i){z6.forEach(function(z,j){z.classList.toggle('an',j===i)})}
 z6.forEach(function(z,i){z.addEventListener('mouseenter',function(){if(!handy())geh6(i)});z.addEventListener('focus',function(){geh6(i)})});
 var io6=new IntersectionObserver(function(es){if(!handy())return;es.forEach(function(x){if(x.isIntersecting)geh6(+x.target.dataset.i)})},{rootMargin:'-45% 0px -45% 0px'});
 z6.forEach(function(z){io6.observe(z)})}

/* 11 Ihr Wahlmenü: Wahl antippen, die Karte schreibt mit, der Teller des Gangs wird aufgetragen */
if(ist('11')){var f11=$$('.m11-f'),k11=$$('.m11-blatt li'),akt=0;
 function bild(i){if(i===akt)return;f11.forEach(function(f,j){f.classList.remove('war');if(j===akt)f.classList.add('war');f.classList.toggle('an',j===i)});akt=i}
 $$('.m11-g').forEach(function(g){var i=+g.dataset.g,os=$$('.m11-o',g);
  os.forEach(function(o){o.addEventListener('click',function(){os.forEach(function(x){x.classList.toggle('an',x===o);x.setAttribute('aria-pressed',x===o)});
   var p=k11[i].querySelector('p:last-child');p.textContent=kurz(o.textContent);p.classList.remove('neu');void p.offsetWidth;p.classList.add('neu');bild(i)})})})}
})();
