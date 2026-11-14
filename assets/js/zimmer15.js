/* Wellness & Spa · «schlafen Sie sich aus», 15 Fassungen (24.10.2026). Je Fassung ein Wechsel oder ein Moment, nur transform/opacity/clip. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
if(location.hash==='#zimmer'){addEventListener('load',function(){setTimeout(function(){var z=document.getElementById('zimmer');if(z)scrollTo(0,z.getBoundingClientRect().top+scrollY)},250)})}
var sek=$('.zv');if(!sek)return;
var weich=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function zeige(liste,i){liste.forEach(function(x){x.classList.toggle('an',+x.dataset.i===i)})}
function warm(r){$$('img[loading="lazy"]',r).forEach(function(i){i.loading='eager'})}
new IntersectionObserver(function(es,o){if(es[0].isIntersecting){warm(sek);o.disconnect()}},{rootMargin:'100% 0px'}).observe(sek);

/* 01 Bühne mit Namensliste: das Zimmer in der Bildschirmmitte steht auf der Bühne */
if(sek.classList.contains('zv01')){var e1=$$('.b1-e'),f1=$$('.b1-f');warm($('.b1-buehne'));
 var io1=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){var i=+x.target.dataset.i;zeige(e1,i);zeige(f1,i)}})},{rootMargin:'-48% 0px -48% 0px'});
 e1.forEach(function(x){io1.observe(x)});zeige(e1,0)}

/* 02 Zimmerbuch: Reiter und Pfeile blättern */
if(sek.classList.contains('zv02')){var d2=$$('.b2-dop'),t2=$$('.b2-reiter'),a2=0;
 function geh2(i){a2=(i+d2.length)%d2.length;zeige(d2,a2);zeige(t2,a2);warm(d2[a2])}
 t2.forEach(function(t){t.addEventListener('click',function(){geh2(+t.dataset.i)})});
 $$('.b2-pf').forEach(function(b){b.addEventListener('click',function(){geh2(a2+ +b.dataset.d)})})}

/* 03 Kartenstapel: die untere Karte tritt leicht zurück, wenn die nächste darüberkommt */
if(sek.classList.contains('zv03')&&!weich){var k3=$$('.k3-karte'),lauf=false;
 function rech3(){lauf=false;var vh=innerHeight;k3.forEach(function(k,i){var n=k3[i+1],inn=k.firstElementChild;if(!n){inn.style.transform='';return}
  var p=Math.min(1,Math.max(0,1-(n.getBoundingClientRect().top-vh*.12)/(vh*.8)));inn.style.transform='scale('+(1-p*.05).toFixed(4)+')'})}
 addEventListener('scroll',function(){if(!lauf){lauf=true;requestAnimationFrame(rech3)}},{passive:true});rech3()}

/* 05 Streifen: ein Streifen öffnet sich, die anderen bleiben schmal; nur clip-path und transform */
if(sek.classList.contains('zv05')){var s5=$$('.s5-s'),t5=$$('.s5-t'),b5=$('.s5-buehne'),a5=0,n5=s5.length;warm(b5);
 function lege5(){var W=b5.clientWidth,gap=10,eng=Math.max(54,W*.065),weit=W-(n5-1)*(eng+gap),x=0;
  s5.forEach(function(s,i){var w=i===a5?weit:eng,l=x,r=W-x-w;s.style.setProperty('--l',(l/W*100).toFixed(3)+'%');s.style.setProperty('--r',(r/W*100).toFixed(3)+'%');
   s.querySelector('.s5-bild').style.setProperty('--x',((l+w/2)-W/2).toFixed(1)+'px');s.classList.toggle('an',i===a5);x+=w+gap});zeige(t5,a5)}
 var z5;s5.forEach(function(s,i){s.addEventListener('click',function(){if(a5===i){location.href=$('.s5-t.an .rk').href}else{a5=i;lege5()}});
  s.addEventListener('mouseenter',function(){clearTimeout(z5);z5=setTimeout(function(){a5=i;lege5()},140)});s.addEventListener('mouseleave',function(){clearTimeout(z5)})});
 addEventListener('resize',lege5);lege5()}

/* 06 Im Rampenlicht: Mitte gross, Nachbarn kleiner am Rand; Pfeil, Name, Ziehen */
if(sek.classList.contains('zv06')){var k6=$$('.r6-k'),t6=$$('.r6-t'),p6=$$('.r6-p'),a6=0,n6=k6.length;
 function lege6(){k6.forEach(function(k,i){var d=i-a6;if(d>n6/2)d-=n6;if(d<-n6/2)d+=n6;var ad=Math.abs(d);
  k.style.setProperty('--d',d);k.style.setProperty('--s',ad===0?1:.74);k.style.setProperty('--o',ad>1?0:1);k.style.setProperty('--z',10-ad);k.tabIndex=ad===0?0:-1});zeige(t6,a6);zeige(p6,a6)}
 function geh6(i){a6=(i+n6)%n6;lege6()}
 $$('.r6-pf').forEach(function(b){b.addEventListener('click',function(){geh6(a6+ +b.dataset.d)})});
 p6.forEach(function(p){p.addEventListener('click',function(){geh6(+p.dataset.i)})});
 k6.forEach(function(k,i){k.addEventListener('click',function(ev){if(i!==a6||zog){ev.preventDefault();if(!zog)geh6(i)}})});
 var x0=null,zog=false,bu=$('.r6-buehne');
 bu.addEventListener('pointerdown',function(ev){x0=ev.clientX;zog=false});
 bu.addEventListener('pointermove',function(ev){if(x0!==null&&Math.abs(ev.clientX-x0)>12)zog=true});
 bu.addEventListener('pointerup',function(ev){if(x0===null)return;var dx=ev.clientX-x0;x0=null;if(Math.abs(dx)>50){geh6(a6+(dx<0?1:-1))}setTimeout(function(){zog=false},0)});
 bu.addEventListener('dragstart',function(ev){ev.preventDefault()});
 lege6()}

/* 07 Ansichtskarten: wenden, nächste Karte unter den Stapel legen */
if(sek.classList.contains('zv07')){var k7=$$('.p7-k'),n7=$$('.p7-n'),ord=k7.map(function(_,i){return i}),busy=false;
 function lege7(){ord.forEach(function(ki,p){k7[ki].style.setProperty('--p',p);k7[ki].dataset.p=p});zeige(n7,ord[0])}
 function weiter7(){if(busy)return;busy=true;var vorn=k7[ord[0]];vorn.classList.remove('gewendet');vorn.classList.add('weg');
  setTimeout(function(){ord.push(ord.shift());vorn.classList.remove('weg');lege7();busy=false},520)}
 function zu7(i){if(ord[0]===i)return;k7[ord[0]].classList.remove('gewendet');while(ord[0]!==i)ord.push(ord.shift());lege7()}
 $$('.p7-b').forEach(function(b){b.addEventListener('click',function(){if(b.dataset.a==='wenden')k7[ord[0]].classList.toggle('gewendet');else weiter7()})});
 k7.forEach(function(k){k.addEventListener('click',function(ev){if(ev.target.closest('a'))return;if(+k.dataset.p===0)k.classList.toggle('gewendet')})});
 n7.forEach(function(n){n.addEventListener('click',function(){zu7(+n.dataset.i)})});lege7()}

/* 08 Grosse Namen: Zeigen öffnet das Foto in der Zeile; am Handy steht das Foto immer da */
if(sek.classList.contains('zv08')){var z8=$$('.n8');var fein=window.matchMedia('(hover:hover)').matches;
 if(fein){z8.forEach(function(z){z.addEventListener('mouseenter',function(){z8.forEach(function(x){x.classList.toggle('an',x===z)})})});
  $('.n8-liste').addEventListener('mouseleave',function(){z8.forEach(function(x){x.classList.remove('an')})})}}

/* 09 Preisliste: die Zeile holt ihr Zimmer auf die Bühne */
if(sek.classList.contains('zv09')){var z9=$$('.t9-z'),f9=$$('.t9-f');warm($('.t9-buehne'));
 z9.forEach(function(z){['mouseenter','focus'].forEach(function(t){z.addEventListener(t,function(){var i=+z.dataset.i;zeige(z9,i);zeige(f9,i)})})})}

/* 10 Detail zuerst: beim Scrollen fährt die Kamera vom Ding zum ganzen Zimmer zurück */
if(sek.classList.contains('zv10')){var b10=$$('.d10-bild'),lauf10=false;
 function rech10(){lauf10=false;var vh=innerHeight;b10.forEach(function(b){var r=b.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh-r.top)/(vh*.85)));
  b.firstElementChild.style.setProperty('--z',weich?1:(2.1-1.1*(1-Math.pow(1-p,2))).toFixed(4))})}
 addEventListener('scroll',function(){if(!lauf10){lauf10=true;requestAnimationFrame(rech10)}},{passive:true});addEventListener('resize',rech10);rech10()}

/* 12 Hauptrolle und Besetzung */
if(sek.classList.contains('zv12')){var r12=$$('.h12-rolle'),b12=$$('.h12-b');
 b12.forEach(function(b){b.addEventListener('click',function(){var i=+b.dataset.i;warm(r12[i]);zeige(r12,i);zeige(b12,i)});b.addEventListener('mouseenter',function(){warm(r12[+b.dataset.i])})})}
})();
