import React, { useEffect, useState } from 'react';

const EMAIL = 'varunchauhan2001dma@gmail.com';
const LINKS = [
  { key: 'mail', n: '01', name: 'Mail', note: 'DIRECT INBOX', href: `mailto:${EMAIL}`, external: false },
  { key: 'github', n: '02', name: 'GitHub', note: 'SOURCE / REPOS', href: 'https://github.com/RydertHuGlIfE', external: true },
  // TODO: put your real LinkedIn URL here
  { key: 'linkedin', n: '03', name: 'LinkedIn', note: 'PROFESSIONAL', href: 'https://www.linkedin.com/in/your-handle', external: true },
];

const C = 300;
const pointAt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r };
};

// 3 sectors x 120deg, first one centered at the top
function sectorPath(i) {
  const s = -150 + i * 120 + 1.5;
  const e = s + 120 - 3;
  const a = pointAt(120, s), b = pointAt(280, s), c = pointAt(280, e), d = pointAt(120, e);
  return `M${a.x} ${a.y}L${b.x} ${b.y}A280 280 0 0 1 ${c.x} ${c.y}L${d.x} ${d.y}A120 120 0 0 0 ${a.x} ${a.y}Z`;
}

const CSS = `
.ct-view{--b:#7fb2ee;--bd:#3f6fa8;min-height:calc(100vh - 130px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:6px 0 24px;color:#e9e8de;font-family:'IBM Plex Mono','JetBrains Mono',monospace;animation:ct-arrive .5s ease both}
.ct-head{text-align:center}
.ct-eyebrow{display:inline-flex;gap:9px;color:#989e91;font-size:9px;letter-spacing:.05em}
.ct-eyebrow span{color:var(--b)}
.ct-head h1{margin:10px 0 0;font:600 clamp(28px,4.4vw,42px)/1.1 'Space Grotesk',sans-serif;color:#f1eee5}
.ct-head h1 span{color:var(--b)}

.ct-wheel{position:relative;width:min(90vw,66vh,600px);aspect-ratio:1}
.ct-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.ct-ring{fill:none;stroke:rgba(223,230,216,.16)}
.ct-ring.outer{stroke:rgba(223,230,216,.3)}
.ct-ring.fine{stroke-dasharray:2 5;stroke:rgba(223,230,216,.2)}
.ct-ring.hubr{stroke:rgba(223,230,216,.34)}
.ct-ring.inner{stroke:rgba(223,230,216,.12)}
.ct-ticks line{stroke:rgba(228,233,221,.26);stroke-width:1}
.ct-ticks line.major{stroke:rgba(228,233,221,.62);stroke-width:1.3}
.ct-ticks{transform-box:fill-box;transform-origin:center;animation:ct-spin 60s linear infinite}

.ct-sec-open{opacity:0;transform:scale(.7);transform-origin:300px 300px;transition:opacity .35s ease var(--d),transform .5s cubic-bezier(.16,.85,.25,1.1) var(--d)}
.ct-wheel.open .ct-sec-open{opacity:1;transform:scale(1)}
.ct-sec{transition:transform .3s cubic-bezier(.2,.85,.25,1),filter .2s}
.ct-sec path.shape{fill:rgba(244,242,230,.028);stroke:rgba(223,230,216,.1);stroke-width:1;transition:fill .18s,stroke .18s}
.ct-sec .runner{fill:none;stroke:var(--b);stroke-width:3;stroke-dasharray:34 966;opacity:0;pointer-events:none}
.ct-sec line{stroke:rgba(223,230,216,.1);stroke-width:1}
.ct-sec.sel{filter:drop-shadow(0 6px 5px rgba(0,0,0,.42))}
.ct-sec.sel path.shape{fill:rgba(127,178,238,.13);stroke:var(--b);stroke-width:1.5}
.ct-sec.sel .runner{opacity:.95;animation:ct-run 2.8s linear infinite;filter:drop-shadow(0 0 5px var(--b))}
.ct-sec.sel line{stroke:rgba(127,178,238,.55)}
@keyframes ct-run{to{stroke-dashoffset:-1000}}
@keyframes ct-spin{to{transform:rotate(360deg)}}

.ct-opt{position:absolute;z-index:2;transform:translate(-50%,-50%) scale(.5);opacity:0;pointer-events:none;display:flex;align-items:center;justify-content:center;gap:14px;min-width:116px;padding:15px 12px;border:1px solid transparent;color:#aeb5a8;text-decoration:none;font-size:clamp(9px,1.5vw,11px);transition:opacity .3s ease var(--d),transform .45s cubic-bezier(.16,.85,.25,1.1) var(--d),border-color .16s,background .16s,color .16s}
.ct-wheel.open .ct-opt{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}
.ct-opt span{color:#6f786d;font-size:.85em}
.ct-opt:hover,.ct-opt:focus-visible,.ct-opt.sel{outline:none;border-color:var(--b);color:var(--b);background:rgba(13,19,26,.9)}
.ct-opt.sel span{color:var(--b)}

.ct-hub{position:absolute;z-index:3;left:50%;top:50%;width:33%;aspect-ratio:1;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border-radius:50%;text-align:center;background:radial-gradient(circle,rgba(20,24,24,.98),rgba(14,17,17,.98) 75%)}
.ct-hub small.t{font-size:clamp(6px,1vw,8px);color:#838b7f;letter-spacing:.08em}
.ct-hub strong{font:500 clamp(15px,3vw,24px) 'Space Grotesk',sans-serif;color:#f2f0e7}
.ct-hub small.n{font-size:clamp(6px,.95vw,8px);color:#a5ab9c;letter-spacing:.05em}
.ct-hub button{margin-top:6px;display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border:1px solid rgba(223,230,216,.28);color:#d8dccf;background:rgba(10,13,13,.6);font:clamp(7px,1.1vw,9px) 'IBM Plex Mono',monospace;letter-spacing:.05em;cursor:pointer;transition:border-color .16s,color .16s,background .16s}
.ct-hub button:hover,.ct-hub button:focus-visible{outline:none;border-color:var(--b);color:var(--b);background:rgba(127,178,238,.1)}
.ct-hub button.primary{border-color:var(--bd);color:var(--b)}

.ct-foot{display:flex;gap:18px;flex-wrap:wrap;justify-content:center;color:#6f786d;font-size:8px;letter-spacing:.05em}
.ct-foot kbd{padding:2px 5px;border:1px solid rgba(241,238,229,.16);color:#b8bdb0;font:inherit}
@keyframes ct-arrive{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.ct-view,.ct-ticks,.ct-sec.sel .runner{animation:none}.ct-sec-open,.ct-opt{transition-duration:.01ms;transition-delay:0s}}
`;

const go = (l) => (l.external ? window.open(l.href, '_blank', 'noreferrer') : (window.location.href = l.href));

export default function ContactView() {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const cur = LINKS[sel];

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof Element && e.target.closest('input, textarea')) return;
      const k = e.key.toLowerCase();
      if (k === 'escape') setOpen(false);
      else if (k === 'c' && !e.ctrlKey && !e.metaKey) setOpen((v) => !v);
      else if (!open) return;
      else if (/^[1-3]$/.test(k)) go(LINKS[Number(k) - 1]);
      else if (k === 'enter') { e.preventDefault(); go(LINKS[sel]); }
      else if (k === 'arrowright' || k === 'arrowdown') setSel((s) => (s + 1) % 3);
      else if (k === 'arrowleft' || k === 'arrowup') setSel((s) => (s + 2) % 3);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, sel]);

  const fromPointer = (e) => {
    if (!open) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2;
    const dy = e.clientY - r.top - r.height / 2;
    const rad = Math.hypot(dx, dy) / Math.min(r.width, r.height);
    if (rad < 0.2 || rad > 0.49) return;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    setSel(((Math.round((ang + 90) / 120) % 3) + 3) % 3);
  };

  const clickSector = (e) => {
    if (!open || e.target.closest('a, button')) return;
    const r = e.currentTarget.getBoundingClientRect();
    const rad = Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2) / Math.min(r.width, r.height);
    if (rad >= 0.2 && rad <= 0.49) go(LINKS[sel]);
  };

  return (
    <section className="ct-view">
      <style>{CSS}</style>

      <header className="ct-head">
        <p className="ct-eyebrow"><span>06</span> DIRECT CHANNEL / OPEN TO BUILDING</p>
        <h1>Let's <span>talk.</span></h1>
      </header>

      <div className={`ct-wheel${open ? ' open' : ''}`} onPointerMove={fromPointer} onClick={clickSector}>
        <svg className="ct-svg" viewBox="0 0 600 600" aria-hidden="true">
          <circle className="ct-ring outer" cx="300" cy="300" r="282" />
          <circle className="ct-ring fine" cx="300" cy="300" r="269" />
          <circle className="ct-ring inner" cx="300" cy="300" r="121" />

          {LINKS.map((l, i) => {
            const a = pointAt(121, -150 + i * 120);
            const b = pointAt(281, -150 + i * 120);
            const mid = ((-90 + i * 120) * Math.PI) / 180;
            const lift = open && sel === i ? 10 : 0;
            return (
              <g key={l.key} className="ct-sec-open" style={{ '--d': `${i * 80}ms` }}>
                <g className={`ct-sec${open && sel === i ? ' sel' : ''}`} style={{ transform: `translate(${Math.cos(mid) * lift}px, ${Math.sin(mid) * lift}px)` }}>
                  <path className="shape" d={sectorPath(i)} />
                  <path className="runner" d={sectorPath(i)} pathLength="1000" />
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                </g>
              </g>
            );
          })}

          <g className="ct-ticks">
            {Array.from({ length: 72 }, (_, i) => {
              const major = i % 6 === 0;
              const f = pointAt(major ? 272 : 276, i * 5 - 90);
              const t = pointAt(major ? 283 : 280, i * 5 - 90);
              return <line key={i} className={major ? 'major' : ''} x1={f.x} y1={f.y} x2={t.x} y2={t.y} />;
            })}
          </g>
          <circle className="ct-ring hubr" cx="300" cy="300" r="103" />
        </svg>

        {LINKS.map((l, i) => {
          const a = ((-90 + i * 120) * Math.PI) / 180;
          return (
            <a
              key={l.key}
              className={`ct-opt cursor-target${open && sel === i ? ' sel' : ''}`}
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noreferrer' : undefined}
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
              style={{ '--d': `${i * 80 + 120}ms`, left: `${50 + Math.cos(a) * 34.5}%`, top: `${50 + Math.sin(a) * 34.5}%` }}
              onPointerEnter={() => setSel(i)}
              onFocus={() => setSel(i)}
            >
              <span>{l.n}</span>{l.name}
            </a>
          );
        })}

        <div className="ct-hub" aria-live="polite">
          {open ? (
            <>
              <small className="t">SELECTED / {cur.n}</small>
              <strong>{cur.name}</strong>
              <small className="n">{cur.note}</small>
              <button type="button" className="cursor-target" onClick={() => go(cur)}>ENTER <b>↗</b></button>
            </>
          ) : (
            <>
              <small className="t">CHANNEL / 03</small>
              <strong>Contact</strong>
              <small className="n">MAIL · GITHUB · LINKEDIN</small>
              <button type="button" className="primary cursor-target" aria-expanded={open} onClick={() => setOpen(true)}>OPEN +</button>
            </>
          )}
        </div>
      </div>

      <div className="ct-foot">
        <span><kbd>C</kbd> TOGGLE</span>
        <span><kbd>←</kbd><kbd>→</kbd> SELECT</span>
        <span><kbd>ENTER</kbd> OPEN</span>
        <span><kbd>1–3</kbd> DIRECT</span>
        <span><kbd>ESC</kbd> CLOSE</span>
      </div>
    </section>
  );
}