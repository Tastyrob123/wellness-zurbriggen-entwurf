// entspannen Sie sich · «Nah dran»: jedes Foto schwebt herauf, sobald seine Oberkante den unteren Rand erreicht, und treibt danach in eigener Tiefe (--k). Nur transform.
// Die Fotos eines Raums werden schon anderthalb Bildschirme vorher geladen, damit nichts leer heraufschwebt und dann aufploppt.
(function(){
var s=document.querySelector('.sn');if(!s)return;
var R=[].slice.call(s.querySelectorAll('.sn-raum')).map(function(r){var e=[].slice.call(r.querySelectorAll('.sn-eb'));e.forEach(function(x,i){x.style.setProperty('--n',i)});
 return {r:r,t:r.querySelector('.sn-t'),g:false,e:e.map(function(x){return [x,parseFloat(x.style.getPropertyValue('--k'))||0]})}}),w=0;
var mm=matchMedia('(min-width:901px) and (prefers-reduced-motion:no-preference)');
function t(){w=0;var h=innerHeight;
 R.forEach(function(o){var b=o.r.getBoundingClientRect();
  if(!o.g&&b.top<h*2.5){o.g=true;o.r.querySelectorAll('img').forEach(function(i){i.loading='eager'})}
  if(b.top>h*1.05||b.bottom<0)return;
  o.e.forEach(function(p){var x=p[0];if(!x.classList.contains('da')&&x.getBoundingClientRect().top<h*1.02)x.classList.add('da')});
  if(!o.r.classList.contains('da')&&o.t.getBoundingClientRect().top<h*1.02)o.r.classList.add('da');
  if(!mm.matches)return;var q=b.top+b.height/2-h/2;
  o.e.forEach(function(p){p[0].style.setProperty('--y',(-q*p[1]).toFixed(1)+'px')})})}
addEventListener('scroll',function(){if(!w)w=requestAnimationFrame(t)},{passive:true});
addEventListener('resize',t);t();
})();
