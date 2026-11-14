/* Wellness & Spa · Zimmerseite, 15 Fassungen «grosses Bild, kleine Bilder, Angaben» (25.10.2026).
   Galerie: kleine Bild antippen, Knäufe, Wischen. Fassungen wechseln mit ← →; man bleibt beim selben Zimmer. */
(function(){
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

/* Galerie */
$$('.zg').forEach(function(g){
 var bs=$$('.zg-b',g),ms=$$('.zg-m',g),nr=g.querySelector('[data-nr]'),a=0,n=bs.length;if(n<2)return;
 function zeig(i){a=(i+n)%n;bs.forEach(function(b,j){b.classList.toggle('an',j===a);if(j===a){var im=b.querySelector('img');if(im)im.loading='eager'}});
  ms.forEach(function(m,j){m.classList.toggle('an',j===a);m.setAttribute('aria-current',j===a?'true':'false')});if(nr)nr.textContent=a+1}
 ms.forEach(function(m){m.addEventListener('click',function(){zeig(+m.dataset.i)})});
 $$('.zg-k',g).forEach(function(k){k.addEventListener('click',function(){zeig(a+ +k.dataset.d)})});
 var gr=g.querySelector('.zg-gross'),x0=null;
 gr.addEventListener('pointerdown',function(ev){if(ev.target.closest('button'))return;x0=ev.clientX});
 gr.addEventListener('pointerup',function(ev){if(x0===null)return;var dx=ev.clientX-x0;x0=null;if(Math.abs(dx)>40)zeig(a+(dx<0?1:-1))});
});


/* 10 Bis an den Rand: das grosse Bild genau bis an den Bildschirmrand */
if(document.body.classList.contains('zgv10')){var rand=function(){var vw=document.documentElement.clientWidth;$$('.zg--rand .zg-gross').forEach(function(g){
 g.style.marginLeft='';g.style.marginRight='';var x=0,e=g;while(e){x+=e.offsetLeft;e=e.offsetParent}var rechts=!g.closest('.zgs--r');
 if(rechts)g.style.marginRight=(-(vw-x-g.offsetWidth))+'px';else g.style.marginLeft=(-x)+'px'})};
 if(innerWidth>900){rand();addEventListener('load',rand);addEventListener('resize',rand)}}

/* Fassungen mit den Pfeiltasten, beim selben Zimmer bleiben */
var L=window.VARIANTEN||[],N=window.VNR||0,O=window.VORD||'';if(!L.length)return;
function stelle(){var mitte=innerHeight/2,best=null;$$('section[id]').forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=mitte&&r.bottom>mitte)best=s});
 return best?{id:best.id,off:scrollY-(best.getBoundingClientRect().top+scrollY)}:{y:scrollY}}
addEventListener('keydown',function(ev){
 if(ev.metaKey||ev.ctrlKey||ev.altKey||ev.shiftKey)return;var t=ev.target;if(t&&(t.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(t.tagName)))return;
 var d=ev.key==='ArrowRight'?1:ev.key==='ArrowLeft'?-1:0;if(!d)return;ev.preventDefault();
 var i=-1;L.forEach(function(x,j){if(x[0]===N)i=j});var z=L[(i+d+L.length)%L.length][0];
 try{sessionStorage.setItem('zgv-stelle',JSON.stringify(stelle()))}catch(e){}
 location.href=O+'/'+String(z).padStart(2,'0')+'.html'});
var st=null;try{st=JSON.parse(sessionStorage.getItem('zgv-stelle')||'null');sessionStorage.removeItem('zgv-stelle')}catch(e){}
if(st){if('scrollRestoration' in history)history.scrollRestoration='manual';
 var hin=function(){var y=st.y;if(st.id){var s=document.getElementById(st.id);if(s)y=s.getBoundingClientRect().top+scrollY+st.off}
  if(y!=null)window.scrollTo({top:y,behavior:'instant'})};
 hin();[80,300,800,1500].forEach(function(ms){setTimeout(hin,ms)})}
})();
