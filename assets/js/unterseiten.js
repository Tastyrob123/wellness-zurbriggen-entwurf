
/* Unterseiten und Startseite (23.10.2026): Menü am Handy, Leiste auf den Unterseiten, Behandlungskarte im Spa. */
(function(){
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
/* Menü: öffnet über «Menü», schliesst über «Schliessen» oder einen Link */
var m=$('.menue'),bu=$('.burger');
if(m&&bu){bu.addEventListener('click',function(){m.classList.add('offen')});var zu=$('.menue .zu');if(zu)zu.addEventListener('click',function(){m.classList.remove('offen')});
 $$('.menue a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('offen')})})}
/* Leiste der Unterseiten: oben sichtbar, beim Hinunterscrollen weg, beim Hinaufscrollen wieder da */
if(document.body.classList.contains('useite')){var n=$('.nav'),yv=scrollY;
 addEventListener('scroll',function(){var y=scrollY;if(n)n.classList.toggle('weg',y>yv&&y>240);yv=y},{passive:true})}
/* Behandlungskarte: ein Wort wählt das Blatt; ein Anker (#massagen …) öffnet sein Blatt */
var k=$('.ukarte');if(k){var ws=$$('.kt-w',k),bl=$$('.kb-l',k);
 function zeig(id){ws.forEach(function(w){w.classList.toggle('an',w.dataset.k===id)});bl.forEach(function(b){var an=b.dataset.k===id;b.classList.toggle('an',an);if(an){b.classList.remove('neu');void b.offsetWidth;b.classList.add('neu')}})}
 ws.forEach(function(w){w.addEventListener('click',function(){zeig(w.dataset.k)})});
 $$('.kb-l li',k).forEach(function(li){var t=function(){li.classList.toggle('auf')};li.addEventListener('click',t);li.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();t()}})});
 var h=location.hash.slice(1);if(h&&bl.some(function(b){return b.dataset.k===h})){zeig(h);requestAnimationFrame(function(){k.scrollIntoView()})}
 addEventListener('hashchange',function(){var h=location.hash.slice(1);if(bl.some(function(b){return b.dataset.k===h})){zeig(h);k.scrollIntoView()}})}
})();

/* Fenster (26.10.2026): der Satz rollt herein, sobald der Ausschnitt ihn etwa zu einem Drittel freigibt. Einmal, nie rückwärts. */
(function(){
var fs=document.querySelectorAll('.ufe');if(!fs.length)return;
if(!('IntersectionObserver' in window)){fs.forEach(function(f){f.classList.add('da')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('da');io.unobserve(x.target)}})},{threshold:.33});
fs.forEach(function(f){io.observe(f)});
})();
