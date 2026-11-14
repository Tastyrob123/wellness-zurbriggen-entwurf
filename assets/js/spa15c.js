/* Wellness & Spa · «entspannen Sie sich», dritte Runde (25.10.2026). Je Fassung ein eigener Moment, nur transform/opacity. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
if(location.hash==='#spa'){addEventListener('load',function(){setTimeout(function(){var z=document.getElementById('spa');if(z)scrollTo(0,z.getBoundingClientRect().top+scrollY)},250)})}
var sek=$('.sq');if(!sek)return;
var weich=matchMedia('(prefers-reduced-motion: reduce)').matches,handy=function(){return innerWidth<=900};
function warm(r){$$('img[loading="lazy"]',r).forEach(function(i){i.loading='eager'})}
new IntersectionObserver(function(es,o){if(es[0].isIntersecting){warm(sek);o.disconnect()}},{rootMargin:'120% 0px'}).observe(sek);
function ist(n){return sek.classList.contains('cs'+n)}

/* Teile tiefer im Abschnitt: kommen dran, sobald ihre Oberkante den unteren Rand erreicht (sichtbar sind sie schon vorher) */
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('da');io.unobserve(x.target)}})},{rootMargin:'0px 0px -4% 0px'});
$$('[data-da]',sek).forEach(function(x){io.observe(x)});

/* 03 Die Räume in grosser Schrift: Zeigen (Handy: Antippen) hebt das Foto in den Rahmen */
if(ist('03')){var z3=$$('.sq3-z'),f3=$$('.sq3-f'),a3=0;
 function geh3(i){if(i===a3)return;f3.forEach(function(x,j){x.classList.toggle('an',j<=i)});z3.forEach(function(x,j){x.classList.toggle('an',j===i)});a3=i}
 z3.forEach(function(x,i){x.addEventListener('mouseenter',function(){if(!handy())geh3(i)});x.addEventListener('focus',function(){geh3(i)});x.addEventListener('click',function(){geh3(i)})})}

/* 06 Einmal durch das Spa: der Raum in der Mitte steigt rechts herauf */
if(ist('06')){var g=$$('.sq6-g'),f=$$('.sq6-f'),c6=$('[data-c6]'),N=['Ruhe','Wärme','Wasser','Anwendungen'];
 function geh(i){f.forEach(function(x,j){x.classList.toggle('an',j<=i)});g.forEach(function(x,j){x.classList.toggle('an',j===i)});if(c6)c6.textContent=N[i]}
 var io6=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting)geh(+x.target.dataset.i)})},{rootMargin:'-46% 0px -46% 0px'});
 g.forEach(function(x){io6.observe(x)})}

/* 08 Zwischen Wasser und Wärme: die zwei Bilder laufen leicht gegeneinander */
if(ist('08')&&!weich){var w=$$('[data-c8]'),lauf=false;
 function rech(){lauf=false;if(handy()){w.forEach(function(x){x.style.transform=''});return}
  var r=sek.getBoundingClientRect(),vh=innerHeight;if(r.bottom<-200||r.top>vh+200)return;
  var p=(r.top+r.height/2-vh/2)/vh;w.forEach(function(x){x.style.transform='translate3d(0,'+(+x.dataset.c8*p*-70).toFixed(1)+'px,0)'})}
 addEventListener('scroll',function(){if(!lauf){lauf=true;requestAnimationFrame(rech)}},{passive:true});addEventListener('resize',rech);rech()}

/* 11 Der Blick hinaus: das hohe Bild gleitet in seinem Rahmen */
if(ist('11')&&!weich){var gl=$('.sq11-gleit'),hf=$('.sq11-hoch'),l11=false;
 function r11(){l11=false;if(handy()){gl.style.removeProperty('--g');return}
  var r=hf.getBoundingClientRect(),vh=innerHeight;if(r.bottom<-100||r.top>vh+100)return;
  var p=Math.max(-1,Math.min(1,(r.top+r.height/2-vh/2)/vh));gl.style.setProperty('--g',(p*r.height*.07).toFixed(1)+'px')}
 addEventListener('scroll',function(){if(!l11){l11=true;requestAnimationFrame(r11)}},{passive:true});addEventListener('resize',r11);r11()}
})();
