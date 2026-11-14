/* Wellness & Spa · Zimmerseite, Heros vierte Runde (26.10.2026): 02 Bildwechsel, 03 Namen wählen, 06 Bild gleitet im Band, 14 Schlüsselbrett. Nur transform und opacity. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var weich=matchMedia('(prefers-reduced-motion: reduce)').matches;
function wahl(liste,i){liste.forEach(function(l){l.forEach(function(x){x.classList.toggle('an',+x.dataset.i===i)})})}

// 02 Acht Zimmer im Wechsel
var d=$('.zq-02');if(d){var fs=$$('.zq-dia',d),is=$$('.zq-di',d),lauf=$('.zq-dlauf',d),z=$('.zq-dz b',d),i=0,n=fs.length;
 function los(){var alt=lauf.firstChild,neu=document.createElement('i');lauf.replaceChild(neu,alt);if(!weich)requestAnimationFrame(function(){neu.className='los'})}
 function weiter(){i=(i+1)%n;wahl([fs,is],i);z.textContent=('0'+(i+1)).slice(-2);los()}
 los();if(!weich)setInterval(function(){if(!document.hidden)weiter()},6000)}

// 03 Namen wählen, 14 Schlüsselbrett: Überfahren oder Fokus zeigt das Zimmer
[['.zq-03','.zq-namen a','.zq-wb'],['.zq-14','.zq-key','.zq-sb']].forEach(function(t){var h=$(t[0]);if(!h)return;var ns=$$(t[1],h),bs=$$(t[2],h);
 ns.forEach(function(a){function an(){wahl([ns,bs],+a.dataset.i)}a.addEventListener('mouseenter',an);a.addEventListener('focus',an)})});

// 06 Zwischen den Zeilen: das Bild gleitet im Band
var ts=$$('.zq [data-t]');if(ts.length&&!weich){var l=false;function f(){var y=scrollY;ts.forEach(function(t){t.style.transform='translate3d(0,'+(y*(+t.dataset.t)).toFixed(1)+'px,0)'})}
 addEventListener('scroll',function(){if(!l){l=true;requestAnimationFrame(function(){l=false;f()})}},{passive:true});f()}
})();
