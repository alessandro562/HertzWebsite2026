/* ════════════════════════════════════════════════════════════
   HERTZ — events auto-sort (static events page)
   Runs BEFORE chrome.js / hertz-system.js. From today's date it:
     • moves finished events out of UPCOMING into THE ARCHIVE,
     • rewrites the live departure board (drops past rows, marks
       the soonest upcoming one as ▸ NEXT).
   So the page stays correct over time with zero manual edits.
   Coming-soon / TBA cards (no concrete date) are always kept upcoming.
   ════════════════════════════════════════════════════════════ */
(function () {
  var n = new Date();
  var TODAY = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();

  // "dd.mm.yy" / "dd.mm.yyyy" / "dd.mm" → end-of-day ms (so an event stays
  // upcoming through its own day). Year-less dates roll to the next future year.
  function parse(str) {
    if (!str) return null;
    var m = str.match(/(\d{1,2})\.(\d{1,2})(?:\.(\d{2,4}))?/);
    if (!m) return null;
    var d = +m[1], mo = +m[2] - 1, y;
    if (m[3] != null) { y = +m[3]; if (y < 100) y += 2000; }
    else {
      y = n.getFullYear();
      if (new Date(y, mo, d, 23, 59, 59, 999).getTime() < TODAY) y += 1;
    }
    return new Date(y, mo, d, 23, 59, 59, 999).getTime();
  }
  function isPast(ms) { return ms != null && ms < TODAY; }
  function cleanDate(str) { var m = str && str.match(/\d{1,2}\.\d{1,2}(?:\.\d{2,4})?/); return m ? m[0] : (str || ''); }
  // "YYYY-MM-DD" → end-of-day ms (unambiguous; preferred when present).
  function isoEnd(iso) {
    var p = iso && iso.split('-');
    return p && p.length >= 3 ? new Date(+p[0], +p[1] - 1, +p[2], 23, 59, 59, 999).getTime() : null;
  }

  /* ── 1 · poster grids: demote finished UPCOMING cards into THE ARCHIVE ── */
  var grids = document.querySelectorAll('.hz-postergrid');
  var upGrid = grids[0], archive = grids[1];
  if (upGrid && archive) {
    Array.prototype.slice.call(upGrid.querySelectorAll('.hz-poster')).forEach(function (card) {
      if (card.classList.contains('coming')) return;            // TBA — keep upcoming
      var btn = card.querySelector('[data-event-date]');
      var dEl = card.querySelector('.foot .d');
      var dateStr = (btn && btn.getAttribute('data-event-date')) || (dEl ? dEl.textContent : '');
      if (!isPast(parse(dateStr))) return;
      // → archive look: gray "// past · date", no lineup, no register button
      card.classList.add('past');
      var cta = card.querySelector('.reg-cta'); if (cta) cta.remove();
      var lu = card.querySelector('.lineup'); if (lu) lu.remove();
      if (dEl) { dEl.style.color = 'var(--gray)'; dEl.textContent = '// past · ' + cleanDate(dateStr); }
      archive.insertBefore(card, archive.firstChild);           // most-recent past first
    });
  }

  /* ── 2 · live board JSON: drop past rows, re-mark the soonest as NEXT ── */
  var node = document.getElementById('board-data');
  if (node) {
    try {
      var rows = JSON.parse(node.textContent);
      rows = rows
        .map(function (r) { r._ms = r.iso ? isoEnd(r.iso) : parse(r.d); delete r.next; return r; })
        .filter(function (r) { return !isPast(r._ms); })
        .sort(function (a, b) { return (a._ms == null ? Infinity : a._ms) - (b._ms == null ? Infinity : b._ms); });
      if (rows[0]) rows[0].next = true;
      rows.forEach(function (r) { delete r._ms; });
      node.textContent = JSON.stringify(rows);
    } catch (e) { /* leave board as authored on parse failure */ }
  }
})();
