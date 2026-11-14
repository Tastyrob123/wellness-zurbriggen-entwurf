/* Wellness & Spa · Zimmerseite, Heros dritte Runde (26.10.2026): 13 Fenster wächst beim Scrollen, 14 Schrift und Bild gegeneinander. Nur transform. */
(function(){
var $=function(s){return document.querySelector(s)},$$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
var weich=matchMedia('(prefers-reduced-motion: reduce)').matches;
function jeFrame(f){var l=false;addEventListener('scroll',function(){if(!l){l=true;requestAnimationFrame(function(){l=false;f()})}},{passive:true});addEventListener('resize',f);f()}
var w=$('.hx-wachs');if(w){var b=$('.hx-wbild');jeFrame(function(){var r=w.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(w.offsetHeight-innerHeight)));
 var q=weich?1:1-Math.pow(1-p,2);b.style.setProperty('--w',(.55+.45*q).toFixed(4));b.style.setProperty('--d',(.15+.4*q).toFixed(3));b.style.borderRadius=((1-q)*22)+'px'})}
var ts=$$('.hx [data-t]');if(ts.length&&!weich)jeFrame(function(){var y=scrollY;ts.forEach(function(t){t.style.transform='translate3d(0,'+(-y*(+t.dataset.t)).toFixed(1)+'px,0)'})});
})();
