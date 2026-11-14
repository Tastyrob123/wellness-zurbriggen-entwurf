/* Wellness & Spa · Zimmerseite «Der Wunschzettel» (24.10.2026): Wünsche antippen, Karten antworten; Zimmerleiste mit wanderndem Messingstrich. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var ZAHL=['Kein','Ein','Zwei','Drei','Vier','Fünf','Sechs','Sieben','Acht'];

/* 1 · Wunschzettel */
var ws=$$('.zw-w'),karten=$$('.zk[data-w]'),stand=$('[data-stand]'),leer=$('.zw-leer');
karten.forEach(function(k){var f=k.querySelector('figure');if(f)f.insertAdjacentHTML('beforeend','<span class="zk-passt"><img src="assets/zeichen/stern-messing.svg" alt="">Passt</span>')});
function rech(){
 var an=ws.filter(function(w){return w.getAttribute('aria-pressed')==='true'}).map(function(w){return w.dataset.k});
 var voll=0,best=0,punkte=karten.map(function(k){var hat=k.dataset.w.split(' ');return an.filter(function(x){return hat.indexOf(x)>-1}).length});
 punkte.forEach(function(n){if(n>best)best=n;if(an.length&&n===an.length)voll++});
 karten.forEach(function(k,i){var n=punkte[i],ganz=an.length>0&&n===an.length,nah=!ganz&&voll===0&&n===best&&n>0;
  k.classList.toggle('zw-passt',ganz);k.classList.toggle('zw-teil',an.length>0&&!ganz&&!nah&&n>0);k.classList.toggle('zw-aus',an.length>0&&n===0)});
 stand.textContent=!an.length?'Tippen Sie an, was Ihnen wichtig ist.':voll===1?'Ein Zimmer erfüllt alle Wünsche.':voll>1?ZAHL[voll]+' Zimmer erfüllen alle Wünsche.':'Kein Zimmer erfüllt alles. Hell bleibt, was am meisten davon hat.';
 leer.hidden=!an.length}
ws.forEach(function(w){w.addEventListener('click',function(){w.setAttribute('aria-pressed',w.getAttribute('aria-pressed')==='true'?'false':'true');rech()})});
leer.addEventListener('click',function(){ws.forEach(function(w){w.setAttribute('aria-pressed','false')});rech()});

/* 2 · Zimmerleiste */
var leiste=$('.zw-leiste'),inn=$('.zw-leiste-in'),strich=$('.zw-strich'),links=$$('.zw-leiste a'),erstes=$('.zd'),loft=$('#loft'),nav=$('.unav .nav')||$('.nav'),lauf=false,akt=null;
var secs=links.map(function(a){return document.getElementById(a.dataset.k)});
function setze(a){if(a===akt)return;akt=a;links.forEach(function(x){x.classList.toggle('an',x===a)});
 if(a){strich.style.setProperty('--sx',a.offsetLeft+12+'px');strich.style.setProperty('--sw',a.offsetWidth-24);
  var l=a.offsetLeft-inn.clientWidth/2+a.offsetWidth/2;if(inn.scrollWidth>inn.clientWidth)inn.scrollTo({left:l,behavior:'smooth'})}}
function rech2(){lauf=false;var vh=innerHeight,nb=nav?Math.max(0,nav.getBoundingClientRect().bottom):0,y=nb>0?nb+10:16;
 var sicht=erstes.getBoundingClientRect().top<vh*.55&&loft.getBoundingClientRect().bottom>vh*.35;
 leiste.style.setProperty('--y',(sicht?y:-120)+'px');
 var mitte=vh*.45,a=null;secs.forEach(function(s,i){var r=s.getBoundingClientRect();if(r.top<=mitte&&r.bottom>mitte)a=links[i]});if(a||!sicht)setze(a)}
addEventListener('scroll',function(){if(!lauf){lauf=true;requestAnimationFrame(rech2)}},{passive:true});addEventListener('resize',function(){akt=null;rech2()});rech2();
})();
