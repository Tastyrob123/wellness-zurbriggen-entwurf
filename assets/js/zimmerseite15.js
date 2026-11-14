/* Wellness & Spa · Zimmerseite, 15 Fassungen (24.10.2026). Je Fassung ein eigener Teil, nur transform/opacity. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var B=document.body.classList,weich=matchMedia('(prefers-reduced-motion: reduce)').matches,fein=matchMedia('(hover:hover)').matches;
function eager(r){$$('img[loading="lazy"]',r).forEach(function(i){i.loading='eager'})}
function chf(n){return 'CHF '+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,"'")+'.–'}

/* 04 Ansichtskarten: am Handy dreht der erste Tipp, der Link steht hinten */
if(B.contains('zs04')){$$('.pk').forEach(function(p){var a=p.querySelector('.zk');
 a.addEventListener('click',function(ev){if(!fein&&!p.classList.contains('dreh')){ev.preventDefault();$$('.pk.dreh').forEach(function(x){x.classList.remove('dreh')});p.classList.add('dreh')}});
 p.querySelector('.pk-h').addEventListener('click',function(ev){if(!ev.target.closest('a'))p.classList.remove('dreh')})})}

/* 05 Aufenthaltsrechner */
if(B.contains('zs05')){var w={n:3,p:2};
 function rech5(){$$('.ar-st').forEach(function(st){var a=st.dataset.a;st.querySelector('[data-wert]').textContent=w[a];
   st.querySelector('[data-wort]').textContent=a==='n'?(w.n===1?'Nacht':'Nächte'):(w.p===1?'Person':'Personen')});
  $$('.zk[data-chf]').forEach(function(k){var b=k.querySelector('.zk-fuss b'),z=+k.dataset.chf*w.n*w.p;
   b.innerHTML='ab '+chf(z)+'<small>'+w.n+' '+(w.n===1?'Nacht':'Nächte')+' · '+w.p+' '+(w.p===1?'Person':'Personen')+'</small>'})}
 $$('.ar-st').forEach(function(st){$$('button',st).forEach(function(b){b.addEventListener('click',function(){var a=st.dataset.a;
  w[a]=Math.min(+st.dataset.max,Math.max(+st.dataset.min,w[a]+ +b.dataset.d));rech5()})})});rech5()}

/* 06 Zwei vergleichen */
if(B.contains('zs06')){var gew=[],p6=$('.vg-p'),sp=$('.vg-spalten'),ti=$('[data-vg-titel]'),Z=window.ZDATEN||{};
 function spalte(k){var d=Z[k];return '<div class="vg-s"><figure><img src="assets/img/'+d.foto+'-m.webp" alt=""></figure><h3>'+d.name+'</h3><dl>'
  +'<div><dt>Fläche</dt><dd>'+d.m2+'</dd></div><div><dt>Für</dt><dd>'+d.fuer+'</dd></div><div><dt>Preis</dt><dd>'+d.preis+' pro Person</dd></div>'
  +'<div><dt>Kurz</dt><dd>'+d.leit+'</dd></div><div><dt>Ausstattung</dt><dd>'+d.aus.join(' · ')+'</dd></div></dl></div>'}
 function zeig6(){$$('.vg-b').forEach(function(b){b.setAttribute('aria-pressed',gew.indexOf(b.dataset.k)>-1?'true':'false')});
  sp.innerHTML=gew.map(spalte).join('');p6.classList.toggle('halb',gew.length===1);p6.classList.toggle('offen',gew.length===2);
  ti.textContent=gew.length===2?'Ihr Vergleich':'Noch ein zweites Zimmer wählen'}
 $$('.vg-b').forEach(function(b){b.addEventListener('click',function(){var k=b.dataset.k,i=gew.indexOf(k);if(i>-1)gew.splice(i,1);else{gew.push(k);if(gew.length>2)gew.shift()}zeig6()})});
 $('.vg-zu').addEventListener('click',function(){gew=[];zeig6()})}

/* 07 Die Zimmerkarte öffnet sich */
if(B.contains('zs07')){var z7=$('.zk7'),inh=$('.zk7-inhalt'),nr=$('[data-zk7-nr]'),ks=$$('.zk').map(function(a){return a.getAttribute('href').slice(1)}),a7=0;
 function fuell(i){a7=(i+ks.length)%ks.length;var k=ks[a7],q=document.getElementById(k),n;
  if(k==='loft'){n=document.createElement('div');n.appendChild($('.zl-mitte',q).cloneNode(true));n.appendChild($('.zl-reihe',q).cloneNode(true));n.className='zk7-loft'}
  else{n=$('.zd-in',q).cloneNode(true)}
  inh.innerHTML='';inh.appendChild(n);eager(inh);nr.textContent=(a7+1)+' von '+ks.length;inh.classList.remove('wechsel');void inh.offsetWidth;inh.classList.add('wechsel');$('.zk7-blatt').scrollTop=0}
 function auf(i){fuell(i);z7.classList.add('offen');z7.setAttribute('aria-hidden','false');document.documentElement.classList.add('zk7-zu-scroll')}
 function zu(){z7.classList.remove('offen');z7.setAttribute('aria-hidden','true');document.documentElement.classList.remove('zk7-zu-scroll')}
 $$('.zk').forEach(function(a,i){a.addEventListener('click',function(ev){ev.preventDefault();auf(i)})});
 $$('.zk7-pf').forEach(function(b){b.addEventListener('click',function(){fuell(a7+ +b.dataset.d)})});
 $('.zk7-zu').addEventListener('click',zu);$('.zk7-hg').addEventListener('click',zu);
 addEventListener('keydown',function(ev){if(!z7.classList.contains('offen'))return;if(ev.key==='Escape')zu();if(ev.key==='ArrowRight')fuell(a7+1);if(ev.key==='ArrowLeft')fuell(a7-1)})}

/* 08 Kartenstapel: die untere Karte tritt zurück, wenn die nächste darüberkommt */
if(B.contains('zs08')&&!weich){var k8=$$('.zd'),l8=false;
 function r8(){l8=false;var vh=innerHeight;k8.forEach(function(k,i){var n=k8[i+1],inn=k.firstElementChild;if(!n){inn.style.transform='';return}
  var p=Math.min(1,Math.max(0,1-(n.getBoundingClientRect().top-vh*.1)/(vh*.8)));inn.style.transform=p>0?'scale('+(1-p*.05).toFixed(4)+')':''})}
 addEventListener('scroll',function(){if(!l8){l8=true;requestAnimationFrame(r8)}},{passive:true});r8()}

/* 09 Bühne und Zimmerliste */
if(B.contains('zs09')){var e9=$$('.bz-e'),f9=$$('.bz-f');eager($('.bz-buehne'));
 var io9=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){var i=+x.target.dataset.i;e9.forEach(function(y){y.classList.toggle('an',+y.dataset.i===i)});f9.forEach(function(y){y.classList.toggle('an',+y.dataset.i===i)})}})},{rootMargin:'-48% 0px -48% 0px'});
 e9.forEach(function(x){io9.observe(x)});e9[0].classList.add('an')}

/* 10 Detail zuerst: vom Ding zurück aufs ganze Zimmer */
if(B.contains('zs10')){var b10=$$('.zd-f1'),l10=false;
 function r10(){l10=false;var vh=innerHeight;b10.forEach(function(b){var r=b.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh-r.top)/(vh*.9)));
  b.firstElementChild.style.setProperty('--z',weich?1:(2.2-1.2*(1-Math.pow(1-p,2))).toFixed(4))})}
 addEventListener('scroll',function(){if(!l10){l10=true;requestAnimationFrame(r10)}},{passive:true});addEventListener('resize',r10);r10()}

/* 13 Zimmerbuch: Reiter, Pfeile, und die Karten oben schlagen die richtige Seite auf */
if(B.contains('zs13')){var d13=$$('.zb-dop'),t13=$$('.zb-reiter'),a13=0;
 function geh(i){a13=(i+d13.length)%d13.length;d13.forEach(function(d,j){d.classList.toggle('an',j===a13)});t13.forEach(function(t,j){t.classList.toggle('an',j===a13)});eager(d13[a13])}
 t13.forEach(function(t,i){t.addEventListener('click',function(){geh(i)})});
 $$('.zb-pf').forEach(function(b){b.addEventListener('click',function(){geh(a13+ +b.dataset.d)})});
 $$('.zk').forEach(function(a){var k=a.getAttribute('href').slice(1),i=d13.findIndex(function(d){return d.id===k});if(i<0)return;
  a.addEventListener('click',function(ev){ev.preventDefault();geh(i);$('.zb').scrollIntoView({behavior:weich?'auto':'smooth'})})})}
})();
