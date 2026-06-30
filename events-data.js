/* ════════════════════════════════════════════════════════════
   HERTZ — single source of truth for EVENTS
   Add a new date / poster here ONCE and it updates everywhere:
   the Events page (departure board + poster grids) AND every
   resident's "On the calendar" appearances — automatically.

   Each event:
     n        catalogue number (string)
     title    display title
     venue, city
     iso      'YYYY-MM-DD' (past/upcoming is derived from today)
     time     optional display time, e.g. 'SUN · 17:00 → 00:00'
     badge    poster badge label
     poster   poster image path ('' if none yet → coming soon)
     bill     full line-up shown on the poster card (display string)
     lineup   resident SLUGS playing — drives each artist's page
     comingSoon  true for TBA dates (kept upcoming, no register)
     onSale   true → board shows ON SALE, else SOON

   RULE: at Buongiorno Classic, Federico, Tommaso and Alberto always
   play, so they're included in every Buongiorno Classic line-up.
   ════════════════════════════════════════════════════════════ */
(function () {
  var RESIDENTS = {
    'federico-apadula': 'Federico Apadula',
    'tommaso-manco': 'Tommaso Mancò',
    'alberto-b': 'Alberto B',
    'leonardo-giusti': 'Leonardo Giusti',
  };

  var EVENTS = [
    { n:'026', title:'Hertz at Atrium', venue:"Noah's Dream", city:'Ortona', iso:'2026-06-28',
      time:'SUN · H18 → LATE', badge:'Guest', poster:'assets/poster-v3-28giu-atrium.jpg',
      bill:"Danilo D'Arrezzo · Federico Apadula · Adime", lineup:['federico-apadula'], onSale:true,
      regId:'hertz-x-atrium-280626' },
    { n:'027', title:'Hertz at Buongiorno Classic', venue:'Buongiorno Classic', city:'Rimini', iso:'2026-06-28',
      time:'SUN · 17:00 → 00:00', badge:'Collaboration', poster:'assets/poster-v3-28giu-buongiorno.jpg',
      bill:'Tommaso Mancò · Alberto B', lineup:['federico-apadula','tommaso-manco','alberto-b'], onSale:true,
      regId:'hertz-x-buongiorno-classic-280626' },
    { n:'028', title:'Hertz Downtown', venue:'Il Pallone', city:'Bologna', iso:'2026-07-04',
      time:'SAT · 19:30 → 23:30', badge:'Downtown Gig', poster:'assets/poster-v3-04lug-pallone.jpg',
      bill:'Federico Apadula · Leonardo Giusti · SeaRock', lineup:['federico-apadula','leonardo-giusti'], onSale:true,
      regId:'hertz-downtown-il-pallone-040726' },
    { n:'029', title:'Hertz at Barracuda Club', venue:'Barracuda', city:'Ferrara', iso:'2026-07-25',
      badge:'Collaboration', poster:'', bill:'', lineup:[], comingSoon:true },
    { n:'030', title:'Hertz at Buongiorno Classic', venue:'Buongiorno Classic', city:'Rimini', iso:'2026-07-26',
      time:'SUN · 05:00 → 00:00', badge:'Collaboration', poster:'assets/poster-v3-26lug-buongiorno.jpg',
      bill:'Antonio Pica · Da Vid · Jay De Lys · Joey Daniel · Hertz',
      lineup:['federico-apadula','tommaso-manco','alberto-b'], onSale:true,
      regId:'hertz-x-buongiorno-classic-260726' },
    { n:'031', title:'Hertz at Buongiorno Classic', venue:'Buongiorno Classic', city:'Rimini', iso:'2026-08-14',
      badge:'Collaboration', poster:'', bill:'', lineup:['federico-apadula','tommaso-manco','alberto-b'], comingSoon:true },
    { n:'032', title:'Hertz at Barracuda Club', venue:'Barracuda', city:'Ferrara', iso:'2026-08-15',
      badge:'Collaboration', poster:'', bill:'', lineup:[], comingSoon:true },

    /* ── archive ── */
    { n:'025', title:'Take Notes × Buongiorno Classic', venue:'Buongiorno Classic', city:'Rimini', iso:'2026-05-31',
      badge:'Guest / Showcase', poster:'assets/poster-v3-31mag-takenotes.jpg', bill:'', lineup:[] },
    { n:'024', title:'Hertz at Undersound', venue:'Cassero', city:'Bologna', iso:'2026-05-29',
      badge:'Collab', poster:'assets/poster-v3-29mag-cassero.jpg', bill:'',
      lineup:['federico-apadula','tommaso-manco','alberto-b'] },
    { n:'023', title:'Hertz at Kindergarten', venue:'Kindergarten', city:'Bologna', iso:'2026-04-24',
      badge:'Hertz Event', poster:'assets/poster-v3-24apr-kindergarten.jpg', bill:'',
      lineup:['federico-apadula','tommaso-manco','alberto-b','leonardo-giusti'] },
    { n:'022', title:'Hertz at Kindergarten', venue:'Kindergarten', city:'Bologna', iso:'2026-02-27',
      badge:'Hertz Event', poster:'assets/poster-v3-27feb-kindergarten.jpg', bill:'',
      lineup:['federico-apadula','tommaso-manco','alberto-b'] },
    { n:'021', title:'Hertz at Kindergarten', venue:'Kindergarten', city:'Bologna', iso:'2025-12-26',
      badge:'Hertz Event', poster:'assets/poster-v3-26dic-kindergarten.jpg', bill:'',
      lineup:['federico-apadula','tommaso-manco','alberto-b','leonardo-giusti'] },
    { n:'020', title:'Buongiorno Classic Goes To Hertz', venue:'Numa Club', city:'Bologna', iso:'2025-11-22',
      badge:'Collab', poster:'assets/poster-v3-22nov-numa.jpg', bill:'',
      lineup:['federico-apadula','tommaso-manco','alberto-b'] },
    { n:'019', title:'Hertz at Kindergarten', venue:'Kindergarten', city:'Bologna', iso:'2025-10-24',
      badge:'Hertz Event', poster:'assets/poster-v3-24ott-kindergarten.jpg', bill:'',
      lineup:['federico-apadula','alberto-b'] },
    { n:'018', title:'Classic Airlines / Boarding Pass', venue:'Classic Airlines', city:'Rimini', iso:'2025-09-21',
      badge:'Collab', poster:'assets/poster-v3-21set-classicairlines.jpg', bill:'',
      lineup:['federico-apadula'] },
  ];

  var now = new Date();
  var TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  function endOfDay(iso) {
    var p = iso && iso.split('-');
    return p && p.length >= 3 ? new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59, 999).getTime() : null;
  }
  var MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var DOW = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  window.HZEvents = {
    all: EVENTS,
    residentName: function (slug) { return RESIDENTS[slug] || slug; },
    isPast: function (e) { var ms = endOfDay(e.iso); return ms != null && ms < TODAY; },
    ms: function (e) { return endOfDay(e.iso); },
    // dd.mm.yy
    shortDate: function (e) {
      var p = e.iso.split('-'); return p[2] + '.' + p[1] + '.' + p[0].slice(2);
    },
    // FRI 24.04
    dowDate: function (e) {
      var p = e.iso.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2]);
      return DOW[d.getDay()] + ' ' + p[2] + '.' + p[1];
    },
    // events a resident plays, newest first
    forResident: function (slug) {
      return EVENTS.filter(function (e) { return (e.lineup || []).indexOf(slug) !== -1; })
        .sort(function (a, b) { return (endOfDay(b.iso) || 0) - (endOfDay(a.iso) || 0); });
    },
  };
})();
