/* ════════════════════════════════════════════════════════════
   HERTZ — Iconic system · shared behaviour
   Waveforms · barcodes · scroll reveals · countdown · nav ·
   the Accent→--a2 bridge · split-flap board builder.
   Pure vanilla, no deps. Safe to drop into any page.
   ════════════════════════════════════════════════════════════ */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── seamless oscilloscope waveform ── */
  function wavePath(W,H,comps){
    var n=Math.max(40,Math.round(W/5)),p=[];
    for(var i=0;i<=n;i++){
      var x=i/n*W,y=H/2,env=.5+.5*Math.abs(Math.sin(Math.PI*2*x/W));
      for(var c=0;c<comps.length;c++){ y+=comps[c].a*env*Math.sin(2*Math.PI*comps[c].k*x/W+comps[c].p); }
      p.push((i?'L':'M')+x.toFixed(1)+','+y.toFixed(1));
    }
    return p.join(' ');
  }
  document.querySelectorAll('[data-wave]').forEach(function(t){
    var W=1440,H=44,
      d1=wavePath(W,H,[{a:H*.26,k:3,p:0},{a:H*.12,k:7,p:1.1},{a:H*.06,k:13,p:.4}]),
      d2=wavePath(W,H,[{a:H*.16,k:2,p:2},{a:H*.08,k:9,p:.2}]),
      svg='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" fill="none">'
        +'<path d="'+d2+'" stroke="rgba(20,72,137,.4)" stroke-width="1"/>'
        +'<path d="'+d1+'" stroke="rgba(28,92,173,.7)" stroke-width="1.6"/></svg>';
    t.innerHTML=svg+svg;
    if(reduce) t.style.animation='none';
  });

  /* ── barcodes ── */
  document.querySelectorAll('[data-bars]').forEach(function(b){
    var n=+b.dataset.bars||22,h='';
    for(var i=0;i<n;i++){ var w=1+Math.round(Math.random()*3), ht=(58+Math.random()*42).toFixed(0);
      h+='<i style="width:'+w+'px;height:'+ht+'%"></i>'; }
    b.innerHTML=h;
  });

  /* ── scroll reveal (robust, viewport-rect based) ── */
  var rises=[].slice.call(document.querySelectorAll('.rise'));
  if(reduce){ rises.forEach(function(r){ r.classList.add('in'); }); rises.length=0; }
  else {
    var revealCheck=function(){
      var h=window.innerHeight||document.documentElement.clientHeight;
      for(var i=rises.length-1;i>=0;i--){
        var r=rises[i].getBoundingClientRect();
        if(r.top < h*0.92 && r.bottom > 0){ rises[i].classList.add('in'); rises.splice(i,1); }
      }
    };
    revealCheck();
    window.addEventListener('scroll', revealCheck, {passive:true});
    window.addEventListener('resize', revealCheck, {passive:true});
    window.addEventListener('load', revealCheck);
    setTimeout(revealCheck, 300);
  }

  /* ── countdown ── */
  var cd=document.querySelector('[data-countdown]');
  if(cd){
    var iso=cd.getAttribute('data-countdown');
    var slots=cd.querySelectorAll('[data-u]');
    function tick(){
      var diff=new Date(iso)-new Date(); if(diff<0) diff=0;
      var d=Math.floor(diff/864e5),h=Math.floor(diff%864e5/36e5),m=Math.floor(diff%36e5/6e4),s=Math.floor(diff%6e4/1e3),map={d:d,h:h,m:m,s:s};
      slots.forEach(function(el){ var u=el.getAttribute('data-u'); el.firstChild.nodeValue=String(map[u]||0).padStart(2,'0'); });
    }
    tick(); setInterval(tick,1000);
  }

  /* ── 128 BPM badge beat ── (CSS handles the dot; nothing needed) */

  /* ── nav: scrolled border + mobile menu ── */
  var nav=document.querySelector('.hz-nav');
  if(nav){ var onScroll=function(){ nav.classList.toggle('scrolled', (window.scrollY||0)>60); }; window.addEventListener('scroll',onScroll,{passive:true}); onScroll(); }
  var burger=document.querySelector('.hz-burger'), menu=document.querySelector('.hz-mobilemenu');
  if(burger&&menu){
    burger.addEventListener('click',function(){ var open=menu.classList.toggle('open'); burger.textContent=open?'✕':'☰'; burger.setAttribute('aria-expanded',String(open)); });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ menu.classList.remove('open'); burger.textContent='☰'; }); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ menu.classList.remove('open'); burger.textContent='☰'; } });
  }

  /* ── merch waitlist (optimistic) ── */
  var form=document.querySelector('[data-waitlist]');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var email=form.querySelector('input').value;
      if(!email||email.indexOf('@')<0) return;
      try{ fetch('/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email})}); }catch(_){}
      var done=document.createElement('div'); done.className='hz-joined'; done.textContent='● ON THE LIST, see you on the dancefloor.';
      form.replaceWith(done);
    });
  }

  /* ── per-event registration (the Hertz list) ──
     Any element with [data-register] opens a modal bound to that specific
     event and posts the signup to /api/register, where each event keeps its
     own list (saved on Vercel). Delegated, so it also works on the React home. */
  (function(){
    var modal, fEl, doneEl, current=null;
    function build(){
      if(modal) return;
      modal=document.createElement('div');
      modal.className='hz-reg'; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-label','Join the Hertz list');
      modal.innerHTML=''
        +'<div class="hz-reg-back" data-reg-close></div>'
        +'<div class="hz-reg-card" role="document">'
        +  '<button class="hz-reg-x" data-reg-close aria-label="Close">\u2715</button>'
        +  '<div class="hz-reg-stub"><span>HERTZ LIST</span></div>'
        +  '<div class="hz-reg-body">'
        +    '<div class="hz-reg-kick"><span class="ln"></span>// GUEST LIST</div>'
        +    '<div class="hz-reg-ev" data-reg-title>The event</div>'
        +    '<div class="hz-reg-meta" data-reg-meta></div>'
        +    '<form class="hz-reg-form" novalidate>'
        +      '<label><span>Full name</span><input name="name" type="text" autocomplete="name" required placeholder="Name + surname"></label>'
        +      '<label><span>Email</span><input name="email" type="email" autocomplete="email" required placeholder="your@email.cc"></label>'
        +      '<label><span>Phone <i>optional</i></span><input name="phone" type="tel" autocomplete="tel" placeholder="+39 \u2026"></label>'
        +      '<button class="hz-reg-submit" type="submit">Join the list \u2192</button>'
        +      '<p class="hz-reg-fine">One name per person \u00b7 you\u2019ll get a confirmation by email.</p>'
        +    '</form>'
        +    '<div class="hz-reg-done" hidden><span class="dot"></span><b>You\u2019re on the list.</b><span class="ev" data-reg-doneev></span><p>See you on the dancefloor. Bring ID.</p><button class="hz-reg-submit ghost" data-reg-close type="button">Done</button></div>'
        +  '</div>'
        +'</div>';
      document.body.appendChild(modal);
      fEl=modal.querySelector('.hz-reg-form'); doneEl=modal.querySelector('.hz-reg-done');
      modal.addEventListener('click',function(e){ if(e.target.closest('[data-reg-close]')) close(); });
      fEl.addEventListener('submit',submit);
    }
    function open(d){
      build(); current=d||{};
      modal.querySelector('[data-reg-title]').textContent=current.title||'The event';
      modal.querySelector('[data-reg-meta]').textContent=[current.date,current.venue,current.city].filter(Boolean).join(' \u00b7 ');
      fEl.hidden=false; doneEl.hidden=true; fEl.reset();
      modal.classList.add('open'); document.documentElement.style.overflow='hidden';
      setTimeout(function(){ var n=fEl.elements['name']; if(n) n.focus(); },70);
    }
    function close(){ if(!modal) return; modal.classList.remove('open'); document.documentElement.style.overflow=''; }
    function submit(e){
      e.preventDefault();
      var els=fEl.elements, name=els['name'].value.trim(), email=els['email'].value.trim(), phone=els['phone'].value.trim();
      if(name.length<2||email.indexOf('@')<1){ if(name.length<2) els['name'].focus(); else els['email'].focus(); return; }
      var btn=fEl.querySelector('.hz-reg-submit'); btn.disabled=true; btn.textContent='\u2026';
      var payload={ eventId:current.id||'general', eventTitle:current.title||'', date:current.date||'', venue:current.venue||'', city:current.city||'', name:name, email:email, phone:phone };
      try{ fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); }catch(_){}
      modal.querySelector('[data-reg-doneev]').textContent=current.title?(current.title+(current.date?(' \u00b7 '+current.date):'')):'';
      fEl.hidden=true; doneEl.hidden=false; btn.disabled=false; btn.textContent='Join the list \u2192';
    }
    document.addEventListener('click',function(e){
      var t=e.target.closest('[data-register]'); if(!t) return;
      e.preventDefault();
      open({ id:t.getAttribute('data-event-id'), title:t.getAttribute('data-event-title'), date:t.getAttribute('data-event-date'), venue:t.getAttribute('data-event-venue'), city:t.getAttribute('data-event-city') });
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
  })();

  /* ── split-flap departure board (events page) ──
     Words are grouped so a single word never breaks across lines —
     only whole words wrap. No abbreviations. ── */
  function flaps(str,cls,opt){
    opt=opt||{};
    str=String(str==null?'':str);
    var h='<div class="hz-bcell '+(cls||'')+(opt.right?' right':'')+'">';
    if(opt.caret) h+='<span class="hz-caret">▸</span>';
    var words=str.split(' ');
    for(var w=0;w<words.length;w++){
      var word=words[w]; if(word==='') continue;
      h+='<span class="hz-word">';
      for(var i=0;i<word.length;i++){ var ch=word[i];
        h+='<span class="hz-flap'+(opt.y?' y':'')+(opt.live?' live':'')+'">'+ch.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>';
      }
      h+='</span>';
    }
    return h+'</div>';
  }
  var board=document.querySelector('[data-board]');
  if(board){
    var data=[]; try{ data=JSON.parse(document.getElementById(board.getAttribute('data-board')).textContent); }catch(_){}
    data.forEach(function(e){
      var alert=(e.s==='SOLD OUT'||e.s==='SOON');
      var row=document.createElement('div'); row.className='hz-brow';
      row.innerHTML = flaps(e.d,'date') + flaps(e.t,'event') + flaps(e.v,'venue') + flaps(e.c,'city') + flaps(e.s,'status',{right:true,y:alert,live:e.next,caret:e.next});
      board.appendChild(row);
    });
    var rows=[].slice.call(board.querySelectorAll('.hz-brow'));
    rows.forEach(function(r){ r.querySelectorAll('.hz-flap').forEach(function(f,i){ f.style.animationDelay=(i*0.022).toFixed(3)+'s'; }); });
    if(reduce){ rows.forEach(function(r){ r.classList.add('in'); r.querySelectorAll('.hz-flap').forEach(function(f){ f.style.animation='none'; }); }); }
    else if('IntersectionObserver' in window){
      var bio=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); bio.unobserve(en.target); } }); },{threshold:.25});
      rows.forEach(function(r){ bio.observe(r); });
    } else { rows.forEach(function(r){ r.classList.add('in'); }); }
  }

  /* ── Accent locked to yellow (single official signal) ── */
  document.documentElement.setAttribute('data-accent','yellow');
  try{ localStorage.setItem('hz-accent','yellow'); }catch(_){}
})();
