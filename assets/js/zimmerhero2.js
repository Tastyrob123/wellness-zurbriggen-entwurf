/* Wellness & Spa · Zimmerseite, Heros zweite Runde (26.10.2026). Nur transform/opacity (13: clip-path). */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var weich=matchMedia('(prefers-reduced-motion: reduce)').matches,vh=function(){return innerHeight};
function jeFrame(f){var l=false;function r(){l=false;f()}addEventListener('scroll',function(){if(!l){l=true;requestAnimationFrame(r)}},{passive:true});addEventListener('resize',f);f()}
var hz=$('.hz');if(!hz)return;

/* 02 Tiefe: Scroll und Maus bewegen die Ebenen verschieden schnell */
if(hz.classList.contains('hz02')&&!weich){var ts=$$('[data-t]',hz),mx=0,my=0;
 function setz(){var y=scrollY;ts.forEach(function(t){var f=+t.dataset.t;t.style.transform='translate3d('+(mx*f*40).toFixed(1)+'px,'+(-y*f+my*f*40).toFixed(1)+'px,0)'})}
 hz.addEventListener('mousemove',function(ev){mx=ev.clientX/innerWidth-.5;my=ev.clientY/innerHeight-.5;requestAnimationFrame(setz)});jeFrame(setz)}

/* 05 Zwei Hälften: versetzt im Takt */
if(hz.classList.contains('hz05')&&!weich){var hs=$$('.hz-haelfte',hz).map(function(h){return {fs:$$('.hz-hf',h),a:0}}),z=0;
 setInterval(function(){var h=hs[z%2];z++;h.a=(h.a+1)%h.fs.length;h.fs.forEach(function(f,j){f.classList.toggle('an',j===h.a)})},2600)}

/* 06 Scroll-Film: vom Kissen zurück aufs Zimmer */
if(hz.classList.contains('hz06')){var fl=$('.hz-film'),im=$('.hz-film-b img'),hin=$('.hz-film-hin');
 jeFrame(function(){var r=fl.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(fl.offsetHeight-vh())));im.style.setProperty('--z',weich?1:(2.4-1.4*(1-Math.pow(1-p,2))).toFixed(4));hin.style.setProperty('--h',(1-p*3).toFixed(2))})}

/* 07 Mosaik: alle paar Sekunden tauscht ein Feld sein Foto */
if(hz.classList.contains('hz07')&&!weich){var mo=$('.hz-mosaik'),pool=JSON.parse(mo.dataset.fotos),zs=$$('.hz-mz',mo),nx=zs.length;
 setInterval(function(){var c=zs[Math.floor(Math.random()*zs.length)],img=c.querySelector('img'),k=pool[nx++%pool.length];img.classList.add('weg');
  setTimeout(function(){var n=new Image();n.src='assets/img/'+k+'-m.webp';n.onload=function(){img.src=n.src;img.style.objectPosition='';img.classList.remove('weg')}},900)},2200)}

/* 11 Bildspur: hinter der Maus fliegen die Zimmer auf; ohne Maus zieht die Spur von selbst */
if(hz.classList.contains('hz11')){var sp=$('.hz-spur'),pool2=JSON.parse(sp.dataset.fotos),q=0,lx=-999,ly=-999,maus=0;
 function wirf(x,y){var im=document.createElement('img');im.src=pool2[q++%pool2.length];im.alt='';im.style.left=x+'px';im.style.top=y+'px';im.style.setProperty('--r',(Math.random()*10-5).toFixed(1)+'deg');sp.appendChild(im);
  requestAnimationFrame(function(){requestAnimationFrame(function(){im.classList.add('da')})});setTimeout(function(){im.classList.add('weg')},2000);setTimeout(function(){im.remove()},2600)}
 hz.addEventListener('mousemove',function(ev){var r=sp.getBoundingClientRect(),x=ev.clientX-r.left,y=ev.clientY-r.top;maus=Date.now();if(Math.hypot(x-lx,y-ly)>90){lx=x;ly=y;wirf(x,y)}});
 if(!weich){var t0=0;setInterval(function(){if(Date.now()-maus<2500)return;t0+=.42;var r=sp.getBoundingClientRect();wirf(r.width*(.5+.42*Math.cos(t0)),r.height*(.55+.32*Math.sin(t0*1.3)))},320)}}

/* 12 Stapel fächert auf */
if(hz.classList.contains('hz12')){var sw=$('.hz-stapelw'),ks=$$('.hz-sk');
 jeFrame(function(){var r=sw.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(sw.offsetHeight-vh())*1.4));ks.forEach(function(k){k.style.setProperty('--p',(1-Math.pow(1-p,3)).toFixed(4))})})}

/* 13 Blende: das nächste Zimmer schiebt sich schräg darüber */
if(hz.classList.contains('hz13')&&!weich){var ds=$$('.hz-db'),a=0;
 setInterval(function(){var alt=ds[a];a=(a+1)%ds.length;var neu=ds[a];ds.forEach(function(d){if(d!==alt)d.classList.remove('unter')});
  alt.classList.remove('an');alt.classList.add('unter');neu.classList.remove('unter');void neu.offsetWidth;neu.classList.add('an')},4600)}
})();
