// entspannen Sie sich · «Meridian»: die Linie füllt sich mit dem Scrollen, jede Station setzt sich, sobald sie ins Bild kommt (nur transform)
(function(){
var s=document.querySelector('.md');if(!s)return;
var w=s.querySelector('.md-weg'),l=s.querySelector('.md-linie'),st=[].slice.call(s.querySelectorAll('.md-st')),r=0;
function t(){r=0;var h=innerHeight,b=w.getBoundingClientRect();
 if(b.top>h||b.bottom<0){if(b.bottom<0)l.style.setProperty('--p',1);return}
 l.style.setProperty('--p',Math.min(1,Math.max(0,(h*.62-b.top)/b.height)).toFixed(4));
 st.forEach(function(x){if(!x.classList.contains('da')&&x.getBoundingClientRect().top<h*.86)x.classList.add('da')})}
addEventListener('scroll',function(){if(!r)r=requestAnimationFrame(t)},{passive:true});
addEventListener('resize',t);t();
})();
