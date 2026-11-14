// Auftakt-Proben: startet den Auftritt, sobald die Bilder der Bühne entschlüsselt sind (nichts lädt sichtbar nach)
(function(){
  var b=document.body, imgs=[].slice.call(document.querySelectorAll('.buehne img'));
  var f=function(d){return d.toLocaleDateString('de-CH',{day:'numeric',month:'short',year:'numeric'})};
  var h=new Date(); h.setDate(h.getDate()+1); var a=new Date(h); a.setDate(a.getDate()+3);
  var an=document.querySelector('[data-an]'), ab=document.querySelector('[data-ab]'), g=document.querySelector('[data-g]');
  if(an)an.textContent=f(h); if(ab)ab.textContent=f(a); if(g)g.textContent='2 Erwachsene';
  var los=function(){requestAnimationFrame(function(){requestAnimationFrame(function(){b.classList.add('los')})})};
  Promise.all(imgs.map(function(i){return i.decode?i.decode().catch(function(){}):Promise.resolve()})).then(los);
  setTimeout(function(){if(!b.classList.contains('los'))los()},2500);
  var nav=document.querySelector('.nav'), y=0;
  addEventListener('scroll',function(){var n=scrollY; if(nav)nav.classList.toggle('weg',n>y&&n>120); y=n},{passive:true});
})();
