/* ════════════════════════════════════════════════════════════
   HERTZ — events page renderer (reads events-data.js)
   Builds the live departure board + the UPCOMING and ARCHIVE poster
   grids from the single source (window.HZEvents). Past/upcoming is
   derived from today, so the page sorts itself with zero manual edits.
   Must run AFTER events-data.js and BEFORE hertz-system.js (which
   turns #board-data into split-flaps).
   ════════════════════════════════════════════════════════════ */
(function () {
  var HZ = window.HZEvents; if (!HZ) return;
  var up = function (s) { return String(s == null ? '' : s).toUpperCase(); };
  var ddmm = function (e) { var p = e.iso.split('-'); return p[2] + '.' + p[1]; };
  function esc(s) { return String(s == null ? '' : s).replace(/&(?!amp;|#)/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  var upcoming = HZ.all.filter(function (e) { return !HZ.isPast(e); })
                       .sort(function (a, b) { return (HZ.ms(a) || 0) - (HZ.ms(b) || 0); });        // soonest first
  var past = HZ.all.filter(function (e) { return HZ.isPast(e); })
                   .sort(function (a, b) { return (HZ.ms(b) || 0) - (HZ.ms(a) || 0); });            // most recent first

  /* ── 1 · departure board JSON (upcoming only) ── */
  var boardNode = document.getElementById('board-data');
  if (boardNode) {
    var rows = upcoming.map(function (e) {
      return { d: ddmm(e), iso: e.iso, t: up(e.title), v: up(e.venue), c: up(e.city), s: (!e.comingSoon && e.onSale) ? 'ON SALE' : 'SOON' };
    });
    if (rows[0]) rows[0].next = true;
    boardNode.textContent = JSON.stringify(rows);
  }

  /* ── 2 · poster grids ── */
  var REG = '<span class="reg" style="color:#fff"><b class="a"></b><b class="d"></b></span>';
  function badge(e) { return e.badge ? '<div class="badge">' + esc(e.badge) + '</div>' : ''; }
  function num(e) { return '<div class="n">N°' + esc(e.n) + '</div>'; }
  function img(e) { return e.poster ? '<img src="' + esc(e.poster) + '" alt="' + esc(e.title) + '" loading="lazy">' : ''; }

  function upcomingCard(e) {
    if (e.comingSoon) {
      return '<a class="hz-poster coming" href="#"><div class="img">' + REG
        + '<div class="soon"><b>COMING</b><strong>SOON<span class="blue">.</span></strong></div>'
        + badge(e) + num(e) + '</div>'
        + '<div class="foot"><div class="d">// ' + ddmm(e) + ' · TBA</div>'
        + '<div class="ti">' + esc(e.title) + '</div>'
        + '<div class="v">' + esc(e.city) + '</div></div></a>';
    }
    var reg = e.regId
      ? '<button class="reg-cta" data-register data-event-id="' + esc(e.regId) + '" data-event-title="' + esc(e.title)
        + '" data-event-date="' + HZ.shortDate(e) + '" data-event-venue="' + esc(e.venue) + '" data-event-city="' + esc(e.city)
        + '">Join the Hertz list <span class="ar">→</span></button>'
      : '';
    return '<div class="hz-poster"><div class="img">' + REG + img(e) + badge(e) + num(e) + '</div>'
      + '<div class="foot"><div class="d">// ' + HZ.shortDate(e) + (e.time ? ' · ' + esc(e.time) : '') + '</div>'
      + '<div class="ti">' + esc(e.title) + '</div>'
      + '<div class="v">' + esc(e.venue) + ' · ' + esc(e.city) + '</div>'
      + (e.bill ? '<div class="lineup">' + esc(e.bill) + '</div>' : '')
      + reg + '</div></div>';
  }
  function archiveCard(e) {
    return '<a class="hz-poster past" href="#"><div class="img">' + REG + img(e) + badge(e) + num(e) + '</div>'
      + '<div class="foot"><div class="d" style="color:var(--gray)">// past · ' + HZ.shortDate(e) + '</div>'
      + '<div class="ti">' + esc(e.title) + '</div>'
      + '<div class="v">' + esc(e.venue) + ' · ' + esc(e.city) + '</div></div></a>';
  }

  var grids = document.querySelectorAll('.hz-postergrid');
  if (grids[0]) {
    grids[0].innerHTML = upcoming.map(upcomingCard).join('');
    var m0 = grids[0].closest('.hz-sec') && grids[0].closest('.hz-sec').querySelector('.hz-meta');
    if (m0 && upcoming[0]) m0.innerHTML = upcoming.length + ' DATES<br>SUMMER 2026<br>NEXT N°' + esc(upcoming[0].n);
  }
  if (grids[1]) {
    grids[1].innerHTML = past.map(archiveCard).join('');
    var m1 = grids[1].closest('.hz-sec') && grids[1].closest('.hz-sec').querySelector('.hz-meta');
    if (m1) m1.innerHTML = 'PAST TRANSMISSIONS<br>2025 — 2026<br>' + past.length + ' NIGHTS';
  }
})();
