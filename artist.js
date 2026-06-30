/* ════════════════════════════════════════════════════════════
   HERTZ — Artist page builder (vanilla)
   Reads window.ARTIST + window.EVENTS and renders the reskinned
   profile into #artist. Load after chrome.js, before hertz-system.js.
   ════════════════════════════════════════════════════════════ */
(function(){
  var A = window.ARTIST, EV = window.EVENTS || [];
  var mount = document.getElementById('artist');
  if (!A || !mount) return;
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function reg(){ return '<span class="reg"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b></span>'; }
  function nameMarkup(name){
    var w = name.split(' ');
    if (w.length === 1) return '<span class="w9 it blue">'+esc(name)+'</span>';
    var last = w.pop();
    return '<span class="w2">'+esc(w.join(' '))+'</span> <span class="w9 it">'+esc(last)+'</span>';
  }
  var html = '';

  /* HERO (room / CRT) */
  var specs = [['Sound', A.sets], ['Origin', A.origin], ['Since', A.since], ['Frequency', A.freq]]
    .filter(function(s){ return s[1]; })
    .map(function(s){ return '<div><div class="k">'+esc(s[0])+'</div><div class="v">'+esc(s[1])+'</div></div>'; }).join('');
  html += '<section class="hz-sec hz-room crt flick hz-pageintro" style="padding-bottom:clamp(40px,6vh,80px)">'
    + '<div class="hz-scanband"></div>' + reg()
    + '<div class="hz-wrap hz-wide"><div class="hz-artist-hero">'
    + '<div class="hz-aid">'
    + '<div class="hz-kick"><span class="ln"></span>// RESIDENT N°0'+esc(A.n)+' · '+esc(A.freq)+'</div>'
    + '<h1 class="nm">'+nameMarkup(A.name)+'<span class="blue">.</span></h1>'
    + '<div class="role">'+esc(A.role)+'</div>'
    + '<div class="hz-aspecs">'+specs+'</div>'
    + '</div>'
    + '<div class="hz-aportrait">'+reg()+'<img src="'+esc(A.img)+'" alt="'+esc(A.name)+'"><span class="tag">'+esc(A.name.toUpperCase())+' · RESIDENT</span></div>'
    + '</div></div></section>';

  /* BIO (page / riso) */
  var paras = String(A.bio||'').split('\n\n').map(function(p){ return '<p>'+esc(p)+'</p>'; }).join('');
  html += '<section class="hz-sec hz-page riso">' + reg()
    + '<div class="hz-wrap"><div class="hz-ix rise"><h2 class="hz-num">+</h2>'
    + '<div><div class="hz-kick"><span class="ln"></span>// BIOGRAPHY</div>'
    + '<h3 class="hz-h2"><span class="w2">In the</span> <span class="w9 it">booth</span><span class="blue">.</span></h3></div>'
    + '<div class="hz-meta">'+esc(A.role.toUpperCase())+'<br>'+esc((A.origin||'').toUpperCase())+'</div></div>'
    + '<div class="hz-bio rise">'+paras+'</div></div></section>';

  /* LIVE gallery (room / CRT) */
  if (A.gallery && A.gallery.length){
    var shots = A.gallery.map(function(src){ return '<div class="sh"><img src="'+esc(src)+'" alt="'+esc(A.name)+' live" loading="lazy"></div>'; }).join('');
    html += '<section class="hz-sec hz-room crt flick"><div class="hz-scanband"></div>' + reg()
      + '<div class="hz-wrap hz-wide"><div class="hz-kick rise" style="margin-bottom:clamp(24px,4vw,40px)"><span class="ln"></span>// ON THE FLOOR</div>'
      + '<div class="hz-livegrid rise">'+shots+'</div></div></section>';
  }

  /* MIXES (page / riso) */
  if (A.mixes && A.mixes.length){
    var rows = A.mixes.map(function(m, i){
      var tag = m.tag ? '<span class="up">'+esc(m.tag)+' · </span>' : '';
      return '<a href="'+esc(m.url||'#')+'" target="_blank" rel="noopener noreferrer">'
        + '<span class="l"><span class="idx">'+String(i+1).padStart(2,'0')+'</span><span class="ti">'+esc(m.title)+'</span></span>'
        + '<span class="meta">'+tag+'SoundCloud ↗</span></a>';
    }).join('');
    html += '<section class="hz-sec hz-page riso">' + reg()
      + '<div class="hz-wrap"><div class="hz-ix rise"><h2 class="hz-num">+</h2>'
      + '<div><div class="hz-kick"><span class="ln"></span>// SELECTED</div>'
      + '<h3 class="hz-h2"><span class="w2">On</span> <span class="w9 it">record</span><span class="blue">.</span></h3></div>'
      + '<div class="hz-meta">MIXES · TRACKS<br>SOUNDCLOUD</div></div>'
      + '<div class="hz-list rise">'+rows+'</div></div></section>';
  }

  /* EVENTS (room / CRT) */
  if (EV.length){
    var ev = EV.map(function(e){
      var up = e.status === 'upcoming';
      return '<div class="row"><span class="l"><span class="idx">N°'+esc(e.n)+'</span><span class="ti">'+esc(e.title)+'</span></span>'
        + '<span class="meta"><span class="'+(up?'up':'')+'">'+(up?'// UPCOMING':'// PAST')+'</span> · '+esc(e.date)+' · '+esc(e.venue)+'</span></div>';
    }).join('');
    html += '<section class="hz-sec hz-room crt flick"><div class="hz-scanband"></div>' + reg()
      + '<div class="hz-wrap"><div class="hz-ix rise"><h2 class="hz-num">+</h2>'
      + '<div><div class="hz-kick"><span class="ln"></span>// APPEARANCES</div>'
      + '<h3 class="hz-h2"><span class="w2">On the</span> <span class="w9 it">bill</span><span class="blue">.</span></h3></div>'
      + '<div class="hz-meta">'+EV.length+' DATES<br>HERTZ.CC</div></div>'
      + '<div class="hz-list rise">'+ev+'</div></div></section>';
  }

  /* SOCIAL (page / riso) */
  var S = A.social || {}, sl = [];
  if (S.instagram) sl.push('<a href="'+esc(S.instagram)+'"'+(S.instagram.indexOf('http')===0?' target="_blank" rel="noopener noreferrer"':'')+'>Instagram ↗</a>');
  if (S.soundcloud && S.soundcloud !== '#') sl.push('<a href="'+esc(S.soundcloud)+'" target="_blank" rel="noopener noreferrer">SoundCloud ↗</a>');
  if (S.spotify) sl.push('<a href="'+esc(S.spotify)+'" target="_blank" rel="noopener noreferrer">Spotify ↗</a>');
  if (S.booking) sl.push('<a href="mailto:'+esc(S.booking)+'">Booking · '+esc(S.booking)+'</a>');
  html += '<section class="hz-sec hz-page riso" style="padding-top:clamp(40px,6vh,70px)">' + reg()
    + '<div class="hz-wrap"><div class="hz-kick rise" style="margin-bottom:22px"><span class="ln"></span>// CONNECT</div>'
    + '<div class="hz-social rise">'+sl.join('')+'</div>'
    + '<div style="margin-top:clamp(28px,4vw,44px)"><a href="artists.html" class="mono" style="font-size:11px;letter-spacing:.16em;color:var(--blue2);text-decoration:none">← ALL RESIDENTS</a></div>'
    + '</div></section>';

  mount.innerHTML = html;
})();
