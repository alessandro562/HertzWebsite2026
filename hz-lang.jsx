/* ============================================
   Hertz — bilingual layer (IT / EN)
   Standalone: loaded by every page (homepage + sub-pages) so it never
   clashes with the duplicated design-system files. Exposes:
     window.useLang()  -> [lang, setLang]
     window.useT()     -> (en, it) => string for the current language
     window.LangToggle -> the EN / IT switch (used in the nav)
   Philosophy: titles stay English; Italian carries the small texts,
   events/booking, bios, merch, manifesto and the media articles.
   ============================================ */

function hzDefaultLang() {
  try {
    var saved = localStorage.getItem('hz-lang');
    if (saved === 'it' || saved === 'en') return saved;
    return (navigator.language || 'en').toLowerCase().indexOf('it') === 0 ? 'it' : 'en';
  } catch (e) { return 'en'; }
}

function useLang() {
  var init = React.useState(hzDefaultLang);
  var lang = init[0], setLangState = init[1];
  React.useEffect(function () {
    var h = function (e) { setLangState(e.detail); };
    window.addEventListener('hz-langchange', h);
    try { document.documentElement.lang = lang; } catch (e) {}
    return function () { window.removeEventListener('hz-langchange', h); };
  }, []);
  var setLang = function (l) {
    try { localStorage.setItem('hz-lang', l); } catch (e) {}
    try { document.documentElement.lang = l; } catch (e) {}
    window.dispatchEvent(new CustomEvent('hz-langchange', { detail: l }));
  };
  return [lang, setLang];
}
window.useLang = useLang;

function useT() {
  var l = useLang()[0];
  return function (en, it) { return (l === 'it' && it != null) ? it : en; };
}
window.useT = useT;

function LangToggle(props) {
  var pair = useLang();
  var lang = pair[0], setLang = pair[1];
  var light = (props && props.light) ? '#08080d' : '#f5f5f3';
  var mono = { fontFamily: "'JetBrains Mono', monospace" };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {['en', 'it'].map(function (l, i) {
        return (
          <React.Fragment key={l}>
            {i > 0 && <span aria-hidden="true" style={{ color: light, opacity: 0.28, fontSize: 11, ...mono }}>/</span>}
            <button
              onClick={function () { setLang(l); }}
              aria-label={l === 'it' ? 'Passa all’italiano' : 'Switch to English'}
              aria-pressed={lang === l}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                ...mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase', transition: 'color 0.2s', outline: 'none',
                color: light, opacity: lang === l ? 1 : 0.45,
              }}
            >{l}</button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
window.LangToggle = LangToggle;
