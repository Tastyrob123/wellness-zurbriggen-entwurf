/* Wellness & Spa · Zimmerseite, Hero-Fassungen (26.10.2026): 02 Fotos wechseln ruhig durch die Zimmer, 14 Namen holen ihr Foto. Nur Deckkraft. */
(function(){
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
/* 03: Foto genau bis an den rechten Bildschirmrand (am Layout gemessen, nicht an der Bewegung) */
var rd=document.querySelector('.hv-rand');if(rd){var rand=function(){rd.style.marginRight='';if(innerWidth<=900)return;var x=0,e=rd;while(e){x+=e.offsetLeft;e=e.offsetParent}
 rd.style.marginRight=(-(document.documentElement.clientWidth-x-rd.offsetWidth))+'px'};rand();addEventListener('load',rand);addEventListener('resize',rand)}
var w=document.querySelector('.hv-wechsel');if(!w)return;
var fs=$$('.hv-w',w),a=0,weich=matchMedia('(prefers-reduced-motion: reduce)').matches;
function eager(){$$('img[loading="lazy"]',w).forEach(function(i){i.loading='eager'})}
setTimeout(eager,1200);
function zeig(i){a=(i+fs.length)%fs.length;fs.forEach(function(f,j){f.classList.toggle('an',j===a)})}
/* 02: alle 4,5 Sekunden das nächste Zimmer, Name, Fläche und Preis dazu */
var zeile=document.querySelector('[data-zeile]');
if(w.dataset.zimmer&&zeile&&!weich){var Z=JSON.parse(w.dataset.zimmer);
 setInterval(function(){zeile.classList.add('weg');setTimeout(function(){zeig(a+1);var z=Z[a];zeile.innerHTML='<b>'+z[0]+'</b><span>'+z[1]+'</span><span>'+z[2]+'</span>';zeile.classList.remove('weg')},400)},4500)}
/* 14: zeigen oder antippen holt das Foto */
var ns=$$('.hv-name');ns.forEach(function(n){n.addEventListener('mouseenter',function(){zeig(+n.dataset.i);ns.forEach(function(x){x.classList.toggle('an',x===n)})})});
})();
