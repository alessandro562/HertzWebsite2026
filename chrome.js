/* ════════════════════════════════════════════════════════════
   HERTZ — shared chrome injector for standalone pages
   Injects the accent toggle, nav (+ mobile menu) and footer so
   every page stays DRY. Load BEFORE hertz-system.js (which wires
   the scrolled/burger/accent behaviour onto the injected nodes).
   ════════════════════════════════════════════════════════════ */
(function(){
  var NAV = [['Events','events.html'],['Manifesto','manifesto.html'],['Artists','artists.html'],['Music','music.html'],['Merch','merch.html'],['Media','media.html'],['Archive','archive.html']];
  var here = (location.pathname.split('/').pop()||'index.html');
  function active(h){ return h===here || (h==='artists.html' && here.indexOf('artist-')===0); }

  /* nav */
  var nav=document.createElement('nav'); nav.className='hz-nav';
  var links=NAV.map(function(x){ return '<a href="'+x[1]+'"'+(active(x[1])?' class="active"':'')+'>'+x[0]+'</a>'; }).join('');
  nav.innerHTML='<a href="index.html" class="logo"><img src="assets/hertz-logo-header.png" alt="Hertz"></a>'
    +'<div class="hz-navlinks">'+links+'<a href="bookings.html"'+(here==='bookings.html'?' class="hz-tickets active"':' class="hz-tickets"')+'>Bookings ↗</a></div>'
    +'<button class="hz-burger" aria-label="Open menu" aria-expanded="false">☰</button>';
  var menu=document.createElement('div'); menu.className='hz-mobilemenu';
  menu.innerHTML=NAV.map(function(x){ return '<a href="'+x[1]+'">'+x[0]+'</a>'; }).join('');

  /* footer */
  var foot=document.createElement('div');
  var FREQ=[['Instagram','https://instagram.com/hertz.cc'],['Spotify','#'],['SoundCloud','#'],['Mixcloud','#']];
  foot.innerHTML=
    '<section class="hz-coda"><div style="max-width:1320px;margin:0 auto">'
    +'<div class="k">FROM CLUBBERS FOR CLUBBERS</div>'
    +'<h2><span class="w2">Keep the</span><br><span class="w9 it">groove</span><span class="blue">.</span></h2>'
    +'</div></section>'
    +'<footer class="hz-foot"><div class="cols">'
    +'<div><img src="assets/hertz-logo-header.png" alt="Hertz"><p class="blurb">hertz.cc<br>hertzbologna@gmail.com<br>Bologna · IT</p></div>'
    +'<div><h4>// NAVIGATE</h4>'+NAV.map(function(x){return '<a class="fl" href="'+x[1]+'">'+x[0]+' →</a>';}).join('')+'</div>'
    +'<div><h4>// FREQUENCIES</h4>'+FREQ.map(function(x){return '<a class="fl" href="'+x[1]+'"'+(x[1].indexOf('http')===0?' target="_blank" rel="noopener noreferrer"':'')+'>'+x[0]+' →</a>';}).join('')+'</div>'
    +'<div><h4>// SAFE SPACE</h4><p class="safe">No harassment, no hate, no discrimination. Respect boundaries, yours and others\'. The dancefloor is for everyone.</p></div>'
    +'</div><div class="legal"><span>© 2026 Hertz, from clubbers to clubbers</span><span>HZ.CC / V8 · WE LIVE IN FREQUENCY</span></div></footer>';

  document.body.insertBefore(menu, document.body.firstChild);
  document.body.insertBefore(nav, document.body.firstChild);
  var mount = document.getElementById('site-footer');
  if(mount) mount.appendChild(foot); else document.body.appendChild(foot);
})();
