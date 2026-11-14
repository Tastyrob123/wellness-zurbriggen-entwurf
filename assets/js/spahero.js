/* Wellness & Spa · Spa-Seite, 15 Heros (26.10.2026): 03 Hälften gegenläufig, 08 Räume tauschen, 09 Satz wird hell, 15 grosses Bild wechselt. Nur transform/opacity. */
(function(){
var $=function(s){return document.querySelector(s)},$$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
var weich=matchMedia('(prefers-reduced-motion: reduce)').matches;
function jeFrame(f){var l=false;addEventListener('scroll',function(){if(!l){l=true;requestAnimationFrame(function(){l=false;f()})}},{passive:true});addEventListener('resize',f);f()}
var k=$('.sh');if(k)requestAnimationFrame(function(){requestAnimationFrame(function(){k.classList.add('da')})});
var ts=$$('.sh [data-t]');if(ts.length&&!weich)jeFrame(function(){var y=scrollY;ts.forEach(function(t){t.style.transform='translate3d(0,'+(y*(+t.dataset.t)).toFixed(1)+'px,0)'})});
// 08 Räume
var rs=$$('.sh-raum'),ws=$$('.sh-w');if(rs.length){var i=0,uhr=null,maus=false;
 function zeig(j){i=j;rs.forEach(function(r,x){r.classList.toggle('an',x===j)});ws.forEach(function(w,x){w.classList.toggle('an',x===j)})}
 rs.forEach(function(r,x){r.addEventListener('mouseenter',function(){maus=true;zeig(x)});r.addEventListener('focus',function(){zeig(x)});r.addEventListener('click',function(){zeig(x)})});
 var feld=$('.sh-raeume');feld.addEventListener('mouseleave',function(){maus=false});
 if(!weich)uhr=setInterval(function(){if(!maus)zeig((i+1)%rs.length)},3600)}
// 09 Satz
var sz=$('[data-woerter]');if(sz){var wo=$$('[data-woerter] span');jeFrame(function(){var p=weich?1:Math.min(1,Math.max(0,scrollY/(innerHeight*.55)));
 var n=Math.round(p*wo.length);wo.forEach(function(w,x){w.classList.toggle('hell',x<Math.max(n,2))})})}
// 07 Tageszeit: bis 17 Uhr Tag, danach Abend; das Bild der Stunde blendet über das andere
var tz=$$('.sh-tz');if(tz.length){var h=new Date().getHours(),abend=h>=17||h<7,zeit=abend?'abend':'tag';
 $('[data-tz]').textContent=abend?'Am Abend im Spa · die Holzsauna':h<12?'Am Morgen im Spa · das Schwimmbad':'Am Nachmittag im Spa · das Schwimmbad';
 tz.forEach(function(f){if(f.dataset.zeit!==zeit)f.classList.add('vorher')});
 requestAnimationFrame(function(){requestAnimationFrame(function(){tz.forEach(function(f){if(f.dataset.zeit===zeit)f.classList.add('jetzt')})})})}
})();
