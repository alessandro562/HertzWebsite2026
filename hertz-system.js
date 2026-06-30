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

  /* ── split-flap departure board (events page) ── */
  function flaps(str,cls,opt){
    opt=opt||{};
    var h='<div class="hz-bcell '+(cls||'')+(opt.right?' right':'')+'">';
    if(opt.caret) h+='<span class="hz-caret">▸</span>';
    for(var i=0;i<str.length;i++){ var ch=str[i];
      if(ch===' ') h+='<span class="hz-flap sp"> </span>';
      else h+='<span class="hz-flap'+(opt.y?' y':'')+(opt.live?' live':'')+'">'+ch.replace('<','&lt;').replace('&','&amp;')+'</span>';
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

  /* ── Accent → --a2 bridge (mirrors the site's Accent tweak) ── */
  var KEY='hz-accent', btns=[].slice.call(document.querySelectorAll('.hz-acc button'));
  function setAcc(a){
    document.documentElement.setAttribute('data-accent',a);
    btns.forEach(function(b){ b.setAttribute('aria-selected',String(b.dataset.a===a)); });
    try{ localStorage.setItem(KEY,a); }catch(_){}
  }
  btns.forEach(function(b){ b.addEventListener('click',function(){ setAcc(b.dataset.a); }); });
  var sa; try{ sa=localStorage.getItem(KEY); }catch(_){}
  setAcc(sa||'yellow');
})();
