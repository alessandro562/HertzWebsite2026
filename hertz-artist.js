/* ════════════════════════════════════════════════════════════
   HERTZ — Artist detail renderer (data-driven, iconic reskin)
   Each artist-<slug>.html sets <body data-artist="slug">; this
   builds the reskinned page into #artist-root. Real bios/data.
   ════════════════════════════════════════════════════════════ */
(function(){
  var EVENTS_ALL = [
    { title:'Hertz × Undersound', type:'Collab', dt:'FRI 29.05', venue:'Cassero', city:'Bologna', n:'024', status:'upcoming' },
    { title:'Hertz / Kindergarten', type:'Hertz Event', dt:'FRI 24.04', venue:'Kindergarten', city:'Bologna', n:'023', status:'past' },
    { title:'Hertz / Kindergarten', type:'Hertz Event', dt:'FRI 27.02', venue:'Kindergarten', city:'Bologna', n:'022', status:'past' },
    { title:'Hertz / Kindergarten', type:'Hertz Event', dt:'FRI 26.12', venue:'Kindergarten', city:'Bologna', n:'021', status:'past' },
    { title:'Buongiorno Classic Goes To Hertz', type:'Collab', dt:'SAT 22.11', venue:'Numa Club', city:'Bologna', n:'020', status:'past' },
    { title:'Hertz / Kindergarten', type:'Hertz Event', dt:'FRI 24.10', venue:'Kindergarten', city:'Bologna', n:'019', status:'past' },
    { title:'Classic Airlines / Boarding Pass', type:'Collab', dt:'SUN 21.09', venue:'Classic Airlines', city:'Rimini', n:'018', status:'past' },
  ];
  function evs(ns){ return ns.map(function(n){ return EVENTS_ALL.filter(function(e){return e.n===n;})[0]; }).filter(Boolean); }

  var ARTISTS = {
    'federico-apadula': {
      name:'Federico Apadula', role:'Founder · Art Director · DJ &amp; Producer', n:'01', freq:'120 Hz',
      origin:'Bologna, IT', since:'2023', sets:'Deep · Minimal · Atmospheric', img:'assets/dj-apadula.jpg',
      gallery:['assets/federico-apadula-live-1.jpg','assets/federico-apadula-live-2.jpg','assets/federico-apadula-live-3.jpg','assets/federico-apadula-live-4.jpg'],
      bio:["Founder and Art Director of the Hertz collective, Federico Apadula has shaped the project's sonic identity for years, pursuing a precise artistic vision built on the centrality of musical selection.",
        "A Bologna-based DJ and producer born in 1995, he began playing in clubs at the age of 14, developing a deep understanding of dancefloor dynamics from the very start. Over the years he has performed at key venues across his home city and on national and international stages, including Amnesia Milano, Tantra Ibiza and City Hall Barcelona. He has also built an ongoing collaboration with Buongiorno Classic, where he performs regularly.",
        "His sound is rooted in minimal tech with strong deep and house influences, incisive grooves, refined progressions and vibrant atmospheres woven into harmonic sets defined by a constant interplay of tension, release and dynamics.",
        "His productions have been released on labels such as NoExcuse and Under No Illusion, cementing a solid and recognisable artistic identity across both the booth and the studio."],
      mixes:[{t:'Tomi & Kesh × Federico Apadula', tag:'Featured', url:'https://soundcloud.com/tomi-and-kesh/tomi-kesh-federico-apadula'},
        {t:'Live @ Sonder — City Hall, Barcelona', url:'https://soundcloud.com/hertzclubbingcollective/federico-apadula-sonder-city-hall-barcelona-16-03-24-opening-chicks-luv-us'},
        {t:'MMM077 — Special Guest Mix', url:'https://soundcloud.com/lambertogabrieli/mmm077-federico-apadula-special-guest-mix-jun-2021'}],
      social:{ soundcloud:'https://soundcloud.com/hertzclubbingcollective', spotify:'https://open.spotify.com/artist/0hS1cnWGJvml5gSHRKHtGi', booking:'booking@hertz.cc' },
      events: evs(['024','023','022','021','020','019','018']),
    },
    'tommaso-manco': {
      name:'Tommaso Mancò', role:'DJ', n:'02', freq:'128 Hz',
      origin:'Bologna, IT', since:'2023', sets:'Tech · Driving · Raw', img:'assets/dj-manco.jpg',
      gallery:['assets/tommaso-manco-live-1.jpg','assets/tommaso-manco-live-2.jpg','assets/tommaso-manco-live-3.jpg','assets/tommaso-manco-live-4.jpg'],
      bio:["Tommaso Mancò approaches the booth the way a craftsman approaches a workbench: methodical, committed, no shortcuts. His sets are driving and technical, built on a raw reading of minimal that keeps the floor in constant forward motion.",
        "Part of Hertz since the project's early days in 2023, he has become one of the most recognisable hands behind the collective's Bologna nights, a regular face at Kindergarten and across the events that built the Hertz sound. His direction is straightforward and uncompromising: records picked for the groove, sequenced to build pressure and never let it drop."],
      mixes:[],
      social:{ booking:'booking@hertz.cc' },
      events: evs(['024','023','022','021','020']),
    },
    'alberto-b': {
      name:'Alberto B', role:'DJ · Producer', n:'03', freq:'125 Hz',
      origin:'Bologna, IT', since:'2024', sets:'Deep Tech · Groove', img:'assets/dj-alberto.jpg',
      gallery:['assets/alberto-b-live-1.jpg','assets/alberto-b-live-2.jpg','assets/alberto-b-live-3.jpg','assets/alberto-b-live-4.jpg'],
      bio:["Producer and DJ based in Bologna, Alberto B brings a producer's ear to every set: textured, layered, always searching. His sound moves through deep tech and groove with a level of detail that rewards close listening.",
        "Active with Hertz since 2024, he has played across the collective's residencies and collaborations, from the Kindergarten nights to the Buongiorno Classic dates. Alongside his DJ sets he produces his own material, with tracks like 'Hot Girl', 'In My Zone' and 'You Should B Dancing' already out on SoundCloud."],
      mixes:[{t:'Hot Girl', url:'https://soundcloud.com/alberto-baccianti/alberto-b-hot-girl'},
        {t:'In My Zone', url:'https://soundcloud.com/alberto-baccianti/in-my-zone'},
        {t:'You Should B Dancing', url:'https://soundcloud.com/alberto-baccianti/alberto-b-you-should-b-dancing'}],
      social:{ soundcloud:'https://soundcloud.com/alberto-baccianti', spotify:'https://open.spotify.com/artist/7kHLiQODROJuJtGEgAYd8d', booking:'booking@hertz.cc' },
      events: evs(['024','023','022','021','020','019']),
    },
    'leonardo-giusti': {
      name:'Leonardo Giusti', role:'DJ · Resident', n:'04', freq:'126 Hz',
      origin:'Bologna, IT', since:'2025', sets:'Tech House · Minimal Deep Tech', img:'assets/dj-giusti.jpg',
      gallery:['assets/leonardo-giusti-live-1.jpg','assets/leonardo-giusti-live-2.jpg','assets/leonardo-giusti-live-3.jpg','assets/leonardo-giusti-live-4.jpg'],
      bio:["Born in Bologna in 2004, Leonardo Giusti was drawn to electronic music from a very young age, gradually shaping a sonic identity rooted in the more groove-driven shades of Tech House and Minimal Deep Tech.",
        "Despite his youth, he has already built experience across events and clubs on the Bologna scene, performing in venues such as Kindergarten and taking part in several Hertz nights. Since late 2025 he has been a Hertz resident DJ, a home in which he is consolidating his artistic path and refining an increasingly recognisable musical direction.",
        "Ambitious, driven and constantly evolving, Leonardo is one of the emerging names of Bologna's new electronic scene: a young DJ with a clear vision, a strong desire to grow, and the goal of turning every set into a genuine experience for the floor."],
      mixes:[{t:'Live @ Hertz / Kindergarten — 26.12.2025', tag:'Featured', url:'https://soundcloud.com/leonardo-giusti-286676267/leonardo-giusti-live-hertz-kindergarten-italy-26122025'},
        {t:'Live @ Zanzibar', url:'https://soundcloud.com/leonardo-giusti-286676267/leonardo-giusti-live-zanzibar'},
        {t:'REC013', url:'https://soundcloud.com/leonardo-giusti-286676267/rec013'}],
      social:{ soundcloud:'https://soundcloud.com/leonardo-giusti-286676267', booking:'booking@hertz.cc' },
      events: evs(['023','021']),
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
    + '<div><div class="k">// frequency</div><div class="v blue">'+esc(A.freq)+'</div></div>'
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

  /* 4 · MIXES (page / riso) */
  if(A.mixes && A.mixes.length){
    html += '<section class="hz-sec hz-page riso"><span class="reg"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b></span>'
      + '<div class="hz-wrap">'
      + '<div class="hz-ix"><h2 class="hz-num">+</h2><div><div class="hz-kick"><span class="ln"></span>// SELECTED MIXES</div>'
      + '<h3 class="hz-h2"><span class="w2">On</span> <span class="w9 it">record</span><span class="blue">.</span></h3></div>'
      + '<div class="hz-meta">SOUNDCLOUD<br>'+A.mixes.length+' SELECTED</div></div>'
      + '<div class="hz-mixlist">'+A.mixes.map(function(m){
          return '<a class="hz-mixrow" href="'+m.url+'" target="_blank" rel="noopener noreferrer">'
            + '<span class="ico">▶</span><span class="t">'+esc(m.t)+'</span>'
            + (m.tag?'<span class="tag">'+esc(m.tag)+'</span>':'')+'<span class="ar">↗</span></a>';
        }).join('')+'</div>'
      + '</div></section>';
  }

  /* 5 · APPEARANCES (room / CRT) */
  if(A.events && A.events.length){
    html += '<section class="hz-sec hz-room crt flick"><div class="hz-scanband"></div><span class="reg"><b class="a"></b><b class="b2"></b><b class="c"></b><b class="d"></b></span>'
      + '<div class="hz-wrap">'
      + '<div class="hz-ix"><h2 class="hz-num">+</h2><div><div class="hz-kick"><span class="ln"></span>// APPEARANCES</div>'
      + '<h3 class="hz-h2"><span class="w2">On the</span> <span class="w9 it">calendar</span><span class="blue">.</span></h3></div>'
      + '<div class="hz-meta">'+A.events.length+' DATES<br>HERTZ NIGHTS</div></div>'
      + '<div class="hz-applist">'+A.events.map(function(e){
          return '<div class="hz-approw'+(e.status==='past'?' past':'')+'">'
            + '<span class="dt">'+esc(e.dt)+'</span><span class="ti">'+esc(e.title)+'</span>'
            + '<span class="vn">'+esc(e.venue)+' · '+esc(e.city)+'</span>'
            + '<span class="st">'+(e.status==='past'?'PAST':'UPCOMING')+'</span></div>';
        }).join('')+'</div>'
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
