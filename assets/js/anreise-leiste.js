// 8 · Schluss «Leiste zum Aufklappen»: ein Feld antippen zeigt seine Tafel und tauscht das Bild an Ort (nur opacity), Pfeiltasten wechseln
(function(){
var s=document.querySelector('.al');if(!s)return;
var f=[].slice.call(s.querySelectorAll('.al-f')),t=s.querySelectorAll('.al-t'),b=s.querySelectorAll('.al-b');
function wahl(i,fokus){f.forEach(function(x,j){x.setAttribute('aria-selected',j===i?'true':'false');x.tabIndex=j===i?0:-1});
 t.forEach(function(x,j){x.classList.toggle('an',j===i)});b.forEach(function(x,j){x.classList.toggle('an',j===i)});if(fokus)f[i].focus()}
f.forEach(function(x,i){x.addEventListener('click',function(){wahl(i)});
 x.addEventListener('keydown',function(ev){var n=ev.key==='ArrowRight'?1:ev.key==='ArrowLeft'?-1:0;if(n){ev.preventDefault();wahl((i+n+f.length)%f.length,true)}})});
wahl(0);
})();
