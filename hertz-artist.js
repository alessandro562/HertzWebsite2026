/* ════════════════════════════════════════════════════════════
   HERTZ — Artist detail renderer (data-driven, iconic reskin)
   Each artist-<slug>.html sets <body data-artist="slug">; this
   builds the reskinned page into #artist-root. Real bios/data.
   ════════════════════════════════════════════════════════════ */
(function(){
  // Appearances are derived from the shared single source (events-data.js):
  // each resident's dates come from HZEvents.forResident(slug), so adding a new
  // event/poster there updates every artist's calendar automatically.

  var ARTISTS = {
    'federico-apadula': {
      name:'Federico Apadula', role:'Founder · Art Director · DJ &amp; Producer', n:'01', freq:'120 Hz',
      origin:'Emilia-Romagna, IT', since:'2023', sets:'Deep · Minimal · Atmospheric', img:'assets/dj-apadula.jpg',
      gallery:['assets/federico-apadula-live-1.jpg','assets/federico-apadula-live-2.jpg','assets/federico-apadula-live-3.jpg','assets/federico-apadula-live-4.jpg'],
      bio:["Founder and Art Director of the Hertz collective, Federico Apadula has shaped the project's sonic identity for years, pursuing a precise artistic vision built on the centrality of musical selection.",
        "A Bologna-based DJ and producer born in 1995, he began playing in clubs at the age of 14, developing a deep understanding of dancefloor dynamics from the very start. Over the years he has performed at key venues across his home city and on national and international stages, including Amnesia Milano, Tantra Ibiza and City Hall Barcelona. He has also built an ongoing collaboration with Buongiorno Classic, where he performs regularly.",
        "His sound is rooted in minimal tech with strong deep and house influences, incisive grooves, refined progressions and vibrant atmospheres woven into harmonic sets defined by a constant interplay of tension, release and dynamics.",
        "His productions have been released on labels such as NoExcuse and Under No Illusion, cementing a solid and recognisable artistic identity across both the booth and the studio."],
      mixes:[{t:'Tomi & Kesh × Federico Apadula', tag:'Featured', url:'https://soundcloud.com/tomi-and-kesh/tomi-kesh-federico-apadula'},
        {t:'Live @ Sonder — City Hall, Barcelona', url:'https://soundcloud.com/hertzclubbingcollective/federico-apadula-sonder-city-hall-barcelona-16-03-24-opening-chicks-luv-us'},
        {t:'MMM077 — Special Guest Mix', url:'https://soundcloud.com/lambertogabrieli/mmm077-federico-apadula-special-guest-mix-jun-2021'}],
      social:{ soundcloud:'https://soundcloud.com/federico-apadula', spotify:'https://open.spotify.com/artist/0hS1cnWGJvml5gSHRKHtGi', booking:'booking@hertz.cc' },
    },
    'tommaso-manco': {
      name:'Tommaso Mancò', role:'DJ', n:'02', freq:'128 Hz',
      origin:'Abruzzo, IT', since:'2023', sets:'Tech House · Minimal Deep Tech', img:'assets/dj-manco.jpg',
      gallery:['assets/tommaso-manco-live-1.jpg','assets/tommaso-manco-live-2.jpg','assets/tommaso-manco-live-3.jpg','assets/tommaso-manco-live-4.jpg'],
      bio:["Born in 2001, Tommaso Mancò is a DJ from Abruzzo who discovered his passion for electronic music among the iconic parties of the Romagna riviera. It was there that he started building his musical culture and shaping his artistic identity.",
        "He later moved to Bologna, where he joined the Hertz collective and still plays as a resident DJ today. His sound lives in tech house and minimal deep tech — the register that defines his style. In recent years he has performed at some of the area's most important stages and clubs, including Cima Festival, Kindergarten and Numa Club, as well as Buongiorno Classic — a place he has always called home, and one that, over the years, gave him the inspiration to develop and define his musical identity."],
      mixes:[],
      social:{ booking:'booking@hertz.cc' },
    },
    'alberto-b': {
      name:'Alberto B', role:'DJ · Producer', n:'03', freq:'125 Hz',
      origin:'Emilia-Romagna, IT', since:'2024', sets:'Deep Tech · Groove', img:'assets/dj-alberto.jpg',
      gallery:['assets/alberto-b-live-1.jpg','assets/alberto-b-live-2.jpg','assets/alberto-b-live-3.jpg','assets/alberto-b-live-4.jpg'],
      bio:["Producer and DJ based in Bologna, Alberto B brings a producer's ear to every set: textured, layered, always searching. His sound moves through deep tech and groove with a level of detail that rewards close listening.",
        "Active with Hertz since 2024, he has played across the collective's residencies and collaborations, from the Kindergarten nights to the Buongiorno Classic dates. Alongside his DJ sets he produces his own material, with tracks like 'Hot Girl', 'In My Zone' and 'You Should B Dancing' already out on SoundCloud."],
      mixes:[{t:'Hot Girl', url:'https://soundcloud.com/alberto-baccianti/alberto-b-hot-girl'},
        {t:'In My Zone', url:'https://soundcloud.com/alberto-baccianti/in-my-zone'},
        {t:'You Should B Dancing', url:'https://soundcloud.com/alberto-baccianti/alberto-b-you-should-b-dancing'}],
      social:{ soundcloud:'https://soundcloud.com/alberto-baccianti', spotify:'https://open.spotify.com/artist/7kHLiQODROJuJtGEgAYd8d', booking:'booking@hertz.cc' },
    },
    'leonardo-giusti': {
      name:'Leonardo Giusti', role:'DJ · Resident', n:'04', freq:'126 Hz',
      origin:'Emilia-Romagna, IT', since:'2025', sets:'Tech House · Minimal Deep Tech', img:'assets/dj-giusti.jpg',
      gallery:['assets/leonardo-giusti-live-1.jpg','assets/leonardo-giusti-live-2.jpg','assets/leonardo-giusti-live-3.jpg','assets/leonardo-giusti-live-4.jpg'],
      bio:["Born in Bologna in 2004, Leonardo Giusti was drawn to electronic music from a very young age, gradually shaping a sonic identity rooted in the more groove-driven shades of Tech House and Minimal Deep Tech.",
        "Despite his youth, he has already built experience across events and clubs on the Bologna scene, performing in venues such as Kindergarten and taking part in several Hertz nights. Since late 2025 he has been a Hertz resident DJ, a home in which he is consolidating his artistic path and refining an increasingly recognisable musical direction.",
        "Ambitious, driven and constantly evolving, Leonardo is one of the emerging names of Bologna's new electronic scene: a young DJ with a clear vision, a strong desire to grow, and the goal of turning every set into a genuine experience for the floor."],
      mixes:[{t:'Live @ Hertz / Kindergarten — 26.12.2025', tag:'Featured', url:'https://soundcloud.com/leonardo-giusti-286676267/leonardo-giusti-live-hertz-kindergarten-italy-26122025'},
        {t:'Live @ Zanzibar', url:'https://soundcloud.com/leonardo-giusti-286676267/leonardo-giusti-live-zanzibar'},
        {t:'REC013', url:'https://soundcloud.com/leonardo-giusti-286676267/rec013'}],
      social:{ soundcloud:'https://soundcloud.com/leonardo-giusti-286676267', booking:'booking@hertz.cc' },
    },
  };

  var slug = document.body.getAttribute('data-artist');
  var A = ARTISTS[slug];
  var root = document.getElementById('artist-root');
  if(!A || !root){ return; }
  document.title = A.name + ' — Hertz Clubbing Collective';

  function esc(s){ return String(s).replace(/&(?!amp;|#)/g,'&amp;').replace(/</g,'&lt;'); }
  var prev = Object.keys(ARTISTS), idx = prev.indexOf(slug);
  var next = ARTISTS[prev[(idx+1)%prev.length]];

  var html = '';

  /* 1 · INTRO + portrait (room / CRT) */
  html += '<section class="hz-sec hz-room crt flick hz-pageintro" style="padding-bottom:clamp(40px,6vh,72px)">'
    + '<div class="hz-scanband"></div><span class="reg"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b></span>'
    + '<div class="hz-wrap hz-wide">'
    + '<a href="artists.html" class="mono" style="display:inline-flex;gap:8px;font-size:10px;color:var(--gray);text-decoration:none;margin-bottom:clamp(24px,4vw,40px)">← ALL RESIDENTS</a>'
    + '<div class="hz-artisthero">'
    + '<div class="ph"><span class="tag">RESIDENT FILE · N°0'+esc(A.n.replace(/^0/,''))+'</span><img src="'+A.img+'" alt="'+esc(A.name)+'"></div>'
    + '<div class="meta">'
    + '<div class="role">// '+A.role+'</div>'
    + '<h1>'+esc(A.name)+'<span class="blue">.</span></h1>'
    + '<div class="hz-statline">'
    + '<div><div class="k">// origin</div><div class="v">'+esc(A.origin)+'</div></div>'
    + '<div><div class="k">// resident since</div><div class="v">'+esc(A.since)+'</div></div>'
    + '<div><div class="k">// signature</div><div class="v">'+A.sets+'</div></div>'
    + '</div></div></div></div></section>';

  /* 2 · BIO (page / riso) */
  html += '<section class="hz-sec hz-page riso"><span class="reg"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b></span>'
    + '<div class="hz-wrap">'
    + '<div class="hz-ix"><h2 class="hz-num">+</h2><div><div class="hz-kick"><span class="ln"></span>// BIOGRAPHY</div>'
    + '<h3 class="hz-h2"><span class="w2">In the</span> <span class="w9 it">booth</span><span class="blue">.</span></h3></div>'
    + '<div class="hz-meta">PROFILE<br>HERTZ.CC<br>N°0'+esc(A.n.replace(/^0/,''))+'</div></div>'
    + '<div class="hz-bio">'+A.bio.map(function(p){return '<p>'+esc(p)+'</p>';}).join('')+'</div>'
    + '</div></section>';

  /* 3 · GALLERY (room / CRT) */
  if(A.gallery && A.gallery.length){
    html += '<section class="hz-sec hz-room crt flick"><div class="hz-scanband"></div><span class="reg"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b></span>'
      + '<div class="hz-wrap hz-wide">'
      + '<div class="hz-kick" style="margin-bottom:clamp(22px,3vw,36px)"><span class="ln"></span>// THE MOVEMENT · GALLERY</div>'
      + '<div class="hz-galleryrail">'+A.gallery.map(function(g,i){return '<div class="g"><img src="'+g+'" alt="'+esc(A.name)+' live '+(i+1)+'" loading="lazy"></div>';}).join('')+'</div>'
      + '<div class="hz-railhint"><span>←</span><span>SWIPE</span><span>→</span></div>'
      + '</div></section>';
  }

  /* 4 · LISTEN — SoundCloud / Spotify (page / riso) */
  if((A.mixes && A.mixes.length) || A.social.soundcloud || A.social.spotify){
    var scTracks = (A.mixes||[]).map(function(m,i){
      var num = (i+1<10?'0':'')+(i+1);
      return '<li><a href="'+m.url+'" target="_blank" rel="noopener noreferrer">'
        + '<span class="i">'+num+'</span>'
        + '<span class="t">'+esc(m.t)+(m.tag?' <em>'+esc(m.tag)+'</em>':'')+'</span>'
        + '<span class="go">Listen</span></a></li>';
    }).join('');
    html += '<section class="hz-sec hz-page riso"><span class="reg"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b></span>'
      + '<div class="hz-wrap">'
      + '<div class="hz-ix"><h2 class="hz-num">+</h2><div><div class="hz-kick"><span class="ln"></span>// LISTEN</div>'
      + '<h3 class="hz-h2"><span class="w2">On</span> <span class="w9 it">record</span><span class="blue">.</span></h3></div>'
      + '<div class="hz-meta">SOUNDCLOUD<br>SPOTIFY</div></div>'
      + '<div class="hz-listen">'
      + '<div class="hz-listcol">'
      + '<div class="hz-listhead"><img class="lg" src="assets/logo-soundcloud-dark.png" alt="SoundCloud"><span class="sub">Mixes, sets &amp; resident tracks</span></div>'
      + (scTracks ? '<ol class="hz-trk">'+scTracks+'</ol>' : '<p class="hz-listempty">Selected mixes coming soon<span class="blue">.</span></p>')
      + (A.social.soundcloud ? '<a class="hz-listmore" href="'+A.social.soundcloud+'" target="_blank" rel="noopener noreferrer">Open profile →</a>' : '')
      + '</div>'
      + '<div class="hz-listcol">'
      + '<div class="hz-listhead"><img class="lg" src="assets/logo-spotify-dark.png" alt="Spotify"><span class="sub">Tracks released on labels</span></div>'
      + (A.social.spotify ? '<p class="hz-listempty">Original productions, out on label<span class="blue">.</span></p><a class="hz-listmore" href="'+A.social.spotify+'" target="_blank" rel="noopener noreferrer">Open profile →</a>' : '<p class="hz-listempty">Label releases coming soon<span class="blue">.</span></p>')
      + '</div>'
      + '</div>'
      + '</div></section>';
  }

  /* 5 · APPEARANCES (room / CRT) — auto-derived from events-data.js */
  var HZ = window.HZEvents;
  var appearances = HZ ? HZ.forResident(slug) : [];
  if(appearances.length){
    var upcoming = appearances.filter(function(e){ return !HZ.isPast(e); })
                              .sort(function(a,b){ return (HZ.ms(a)||0)-(HZ.ms(b)||0); }); // soonest first
    var past = appearances.filter(function(e){ return HZ.isPast(e); });                    // newest first
    function poster(e){
      return e.poster
        ? '<span class="pf"><img src="'+e.poster+'" alt="'+esc(e.title)+' poster" loading="lazy"></span>'
        : '<span class="pf none"></span>';
    }
    function row(e){
      var p = HZ.isPast(e);
      return '<a class="hz-approw'+(p?' past':' next')+'" href="events.html">'
        + poster(e)
        + '<span class="dt">'+esc(HZ.dowDate(e))+'</span>'
        + '<span class="ti">'+esc(e.title)+'</span>'
        + '<span class="vn">'+esc(e.venue)+' · '+esc(e.city)+'</span>'
        + '<span class="st">'+(p?'PAST':'UPCOMING')+'</span></a>';
    }
    var listHtml = '';
    if(upcoming.length){ listHtml += '<div class="hz-applabel">// Upcoming</div><div class="hz-applist">'+upcoming.map(row).join('')+'</div>'; }
    if(past.length){ listHtml += '<div class="hz-applabel past">// Past</div><div class="hz-applist">'+past.map(row).join('')+'</div>'; }
    html += '<section class="hz-sec hz-room crt flick"><div class="hz-scanband"></div><span class="reg"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b></span>'
      + '<div class="hz-wrap">'
      + '<div class="hz-ix"><h2 class="hz-num">+</h2><div><div class="hz-kick"><span class="ln"></span>// APPEARANCES</div>'
      + '<h3 class="hz-h2"><span class="w2">On the</span> <span class="w9 it">calendar</span><span class="blue">.</span></h3></div>'
      + '</div>'
      + listHtml
      + '</div></section>';
  }

  /* 6 · BOOKINGS (page / riso) */
  var links = [];
  if(A.social.soundcloud) links.push('<a class="hz-bookbtn" href="'+A.social.soundcloud+'" target="_blank" rel="noopener noreferrer">SoundCloud ↗</a>');
  if(A.social.spotify) links.push('<a class="hz-bookbtn" href="'+A.social.spotify+'" target="_blank" rel="noopener noreferrer">Spotify ↗</a>');
  html += '<section class="hz-sec hz-page riso"><span class="reg"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b></span>'
    + '<div class="hz-wrap">'
    + '<div class="hz-ix"><h2 class="hz-num">+</h2><div><div class="hz-kick"><span class="ln"></span>// BOOKINGS</div>'
    + '<h3 class="hz-h2"><span class="w2">Book</span> <span class="w9 it">'+esc(A.name.split(' ')[0])+'</span><span class="blue">.</span></h3></div>'
    + '<div class="hz-meta">BOLOGNA · IT<br>WORLDWIDE</div></div>'
    + '<div class="hz-bookbar">'
    + '<a class="hz-bookbtn primary" href="bookings.html?resident='+slug+'#book">Request a booking →</a>'
    + links.join('')
    + '</div></div></section>';

  /* 7 · NEXT RESIDENT (room) */
  html += '<section class="hz-sec hz-room" style="padding-top:clamp(40px,6vh,72px);padding-bottom:clamp(40px,6vh,72px)"><span class="reg"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b></span>'
    + '<div class="hz-wrap"><a href="artist-'+prev[(idx+1)%prev.length]+'.html" style="display:flex;justify-content:space-between;align-items:center;gap:20px;text-decoration:none;color:inherit;flex-wrap:wrap">'
    + '<div><div class="mono" style="font-size:10px;color:var(--gray);margin-bottom:12px">// NEXT RESIDENT</div>'
    + '<div style="font-family:var(--disp);font-weight:900;font-size:clamp(1.8rem,4vw,3rem);letter-spacing:-.04em">'+esc(next.name)+'<span class="blue">.</span></div></div>'
    + '<div class="blue" style="font-family:var(--mono);font-size:13px;letter-spacing:.1em">VIEW PROFILE →</div></a></div></section>';

  root.innerHTML = html;

  /* build any waveform/bars that snuck in (none here) + re-run reveal handled by hertz-system.js */
})();
