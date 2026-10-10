import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const FONT = "'Chakra Petch', 'Space Grotesk', sans-serif";
const ACCENT = [0.56, 0.71, 0.91]; // #8fb4e8

const destinations = [
  { id: 'about', name: 'About', number: '01', note: 'PROFILE / EXPERIENCE' },
  { id: 'projects', name: 'Projects', number: '02', note: 'SELECTED BUILDS' },
  { id: 'skills', name: 'Skills', number: '03', note: 'TOOLS / INVENTORY' },
  { id: 'terminal', name: 'Terminal', number: '04', note: 'COMMAND INTERFACE' },
  { id: 'resume', name: 'Resume', number: '05', note: 'PDF / EXPERIENCE' },
  { id: 'contact', name: 'Contact', number: '06', note: 'DIRECT CHANNEL' },
];

const center = 300;
const pointAt = (radius, angle) => {
  const radians = angle * Math.PI / 180;
  return { x: center + Math.cos(radians) * radius, y: center + Math.sin(radians) * radius };
};

function sectorPath(index) {
  const startAngle = -120 + index * 60 + 1.5;
  const endAngle = -120 + (index + 1) * 60 - 1.5;
  const a = pointAt(120, startAngle);
  const b = pointAt(280, startAngle);
  const c = pointAt(280, endAngle);
  const d = pointAt(120, endAngle);
  return `M${a.x} ${a.y}L${b.x} ${b.y}A280 280 0 0 1 ${c.x} ${c.y}L${d.x} ${d.y}A120 120 0 0 0 ${a.x} ${a.y}Z`;
}

/* decode text in place without replacing the DOM node React owns */
const GLYPHS = '!<>-_\\/[]{}=+*^?#01';
function scrambleText(el, text, duration = 0.45) {
  const node = el?.firstChild;
  if (!node) return;
  if (el.__tw) el.__tw.kill();
  const o = { p: 0 };
  el.__tw = gsap.to(o, {
    p: 1, duration, ease: 'none',
    onUpdate() {
      const n = Math.floor(o.p * text.length);
      node.nodeValue = text.slice(0, n) + Array.from(text.slice(n), (c) => (c === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
    },
    onComplete() { node.nodeValue = text; },
  });
}

/* ------------------------------ shader overlay ------------------------------ */
const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform vec2 uCenter;
uniform float uPulse; uniform float uSpeed; uniform vec3 uHi;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a*noise(p); p = p*2.03 + vec2(1.7, 9.2); a *= .5; } return v; }

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - .5*uRes) / uRes.y;
  vec2 m  = (uMouse  * uRes - .5*uRes) / uRes.y;
  vec2 c  = (uCenter * uRes - .5*uRes) / uRes.y;
  float t = uTime;

  // cursor bends the field
  vec2 dm = uv - m; float dl = length(dm);
  uv += dm / (dl + .08) * exp(-dl*dl*9.) * (.01 + uSpeed*.05);

  // flowing contour lines, strongest around the wheel
  float n = fbm(uv * 1.6 + vec2(t*.03, -t*.02) + fbm(uv*2. + t*.04) * 1.5);
  float line = smoothstep(.465, .5, abs(fract(n * 9.) - .5));
  float near = smoothstep(1.4, .15, length(uv - c));
  vec3 col = uHi * line * (.05 + near * .22);

  // soft aurora behind everything
  col += uHi * n * n * near * .06;

  // radar sweep around the wheel
  vec2 rc = uv - c;
  float ang = atan(rc.y, rc.x) / 6.28318;
  float sweep = pow(fract(ang + t * .08), 16.);
  col += uHi * sweep * smoothstep(1.3, .2, length(rc)) * .16;

  // cursor glow
  col += uHi * exp(-dl*dl*22.) * .10;

  // shockwave when the selection changes
  float rr = abs(length(rc) - uPulse * 1.4);
  col += uHi * exp(-rr*rr*480.) * (1. - uPulse) * .45;

  // dust
  float s = hash(floor(uv * 90.));
  col += uHi * step(.9965, s) * (.3 + .7 * sin(t*2. + s*60.)) * .35;

  // vignette
  col *= 1. - smoothstep(.55, 1.3, length((frag/uRes - .5) * vec2(1.25, 1.)));
  gl_FragColor = vec4(max(col, 0.), 1.);
}`;

function useTelemetry() {
  const [clock, setClock] = useState('--:--:--');
  const [scroll, setScroll] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateClock = () => setClock(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()));
    const updateScroll = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(range > 0 ? Math.round(window.scrollY / range * 100) : 0);
    };
    const updatePointer = (event) => setPointer({ x: Math.round(event.clientX), y: Math.round(event.clientY) });
    updateClock();
    updateScroll();
    const interval = window.setInterval(updateClock, 1000);
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      window.removeEventListener('pointermove', updatePointer);
    };
  }, []);

  return { clock, scroll, pointer };
}

export default function HomeInstrument({ setActiveTab, onOpenResume }) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const segmentsRef = useRef([]);
  const buttonsRef = useRef([]);
  const mainRef = useRef(null);
  const canvasRef = useRef(null);
  const wheelRef = useRef(null);
  const pulseRef = useRef(null);
  const hubNameRef = useRef(null);
  const hubNoteRef = useRef(null);
  const fx = useRef({ pulse: 1, tx: 0.7, ty: 0.5 });
  const { clock, scroll, pointer } = useTelemetry();
  const selected = destinations[selectedIndex];

  const activate = (destination) => destination.id === 'resume' ? onOpenResume() : setActiveTab(destination.id);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    segmentsRef.current.forEach((segment, index) => {
      if (!segment) return;
      const angle = (-90 + index * 60) * Math.PI / 180;
      const offset = index === selectedIndex ? 10 : 0;
      gsap.to(segment, {
        x: Math.cos(angle) * offset,
        y: Math.sin(angle) * offset,
        duration: reduceMotion ? 0 : 0.62,
        ease: 'elastic.out(1, 0.72)',
        overwrite: true,
      });
    });

    if (reduceMotion) return;
    // shockwave in the shader + a ring that expands inside the wheel svg
    const s = fx.current;
    s.pulse = 0;
    gsap.to(s, { pulse: 1, duration: 1.8, ease: 'power2.out', overwrite: 'auto' });
    gsap.fromTo(pulseRef.current, { attr: { r: 125 }, opacity: 0.7 }, { attr: { r: 312 }, opacity: 0, duration: 0.95, ease: 'power2.out' });
    // hub text decodes
    scrambleText(hubNameRef.current, selected.name, 0.4);
    scrambleText(hubNoteRef.current, selected.note, 0.55);
  }, [selectedIndex]);

  /* intro: one orchestrated moment */
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.instrument-header', { opacity: 0, y: -12, duration: 0.8, ease: 'power2.out' });
      gsap.from('.instrument-copy > *', { opacity: 0, y: 22, duration: 0.9, stagger: 0.09, ease: 'power3.out', delay: 0.15 });
      gsap.from('.instrument-copy h1', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.out', delay: 0.2 });
      gsap.from('.instrument-wheel-svg', { opacity: 0, scale: 0.86, rotation: -28, duration: 1.5, ease: 'expo.out', delay: 0.1 });
      gsap.from('.instrument-option, .instrument-hub', { opacity: 0, duration: 0.8, stagger: 0.07, delay: 0.7, ease: 'power1.out' });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  /* shader overlay loop + wheel tilt */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wheel = wheelRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = fx.current;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) { canvas.style.display = 'none'; return undefined; }

    const compile = (type, src) => { const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh); return sh; };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {};
    ['uRes', 'uTime', 'uMouse', 'uCenter', 'uPulse', 'uSpeed', 'uHi'].forEach((n) => { U[n] = gl.getUniformLocation(program, n); });

    const resize = () => {
      const k = Math.min(window.devicePixelRatio || 1, 1.5) * 0.65;
      canvas.width = Math.max(2, Math.floor(window.innerWidth * k));
      canvas.height = Math.max(2, Math.floor(window.innerHeight * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    gsap.set(wheel, { transformPerspective: 1300 });
    const rotY = gsap.quickTo(wheel, 'rotationY', { duration: 0.9, ease: 'power3' });
    const rotX = gsap.quickTo(wheel, 'rotationX', { duration: 0.9, ease: 'power3' });
    const onMove = (e) => {
      s.tx = e.clientX / window.innerWidth;
      s.ty = 1 - e.clientY / window.innerHeight;
      if (!reduce) { rotY((s.tx - 0.5) * 10); rotX((s.ty - 0.5) * 8); }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let mx = s.tx; let my = s.ty; let speed = 0; let raf = 0;
    const t0 = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const px = mx; const py = my;
      mx += (s.tx - mx) * 0.07; my += (s.ty - my) * 0.07;
      speed += (Math.hypot(mx - px, my - py) * 12 - speed) * 0.1;
      const r = wheel.getBoundingClientRect();
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uTime, reduce ? 0 : (now - t0) / 1000);
      gl.uniform2f(U.uMouse, mx, my);
      gl.uniform2f(U.uCenter, (r.left + r.width / 2) / window.innerWidth, 1 - (r.top + r.height / 2) / window.innerHeight);
      gl.uniform1f(U.uPulse, s.pulse);
      gl.uniform1f(U.uSpeed, Math.min(speed, 1));
      gl.uniform3f(U.uHi, ACCENT[0], ACCENT[1], ACCENT[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const focusedWheelButton = target?.closest('.instrument-option');
      if (target?.closest('a, button') && !focusedWheelButton) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        buttonsRef.current[selectedIndex]?.focus({ preventScroll: true });
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        activate(destinations[selectedIndex]);
        return;
      }
      let next = selectedIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (selectedIndex + 1) % destinations.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (selectedIndex + destinations.length - 1) % destinations.length;
      else if (/^[1-6]$/.test(event.key)) next = Number(event.key) - 1;
      else return;
      event.preventDefault();
      setSelectedIndex(next);
      buttonsRef.current[next]?.focus({ preventScroll: true });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, setActiveTab, onOpenResume]);

  const selectFromPointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - bounds.left - bounds.width / 2;
    const dy = event.clientY - bounds.top - bounds.height / 2;
    const radius = Math.hypot(dx, dy) / Math.min(bounds.width, bounds.height);
    if (radius < 0.2 || radius > 0.49) return;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    setSelectedIndex(((Math.round((angle + 90) / 60) % 6) + 6) % 6);
  };

  return (
    <main className="instrument-home" ref={mainRef}>
      <style>{fxCss}</style>
      <canvas ref={canvasRef} className="fx-bg" aria-hidden="true" />

      <header className="instrument-header">
        <a href="#home" className="instrument-signature" onClick={(event) => event.preventDefault()}><span>VC</span> VARUN CHAUHAN</a>
        <div className="instrument-header-context">CS / SRMIST <span>·</span> MEERUT, IN</div>
        <div className="instrument-telemetry" aria-label="Live local telemetry"><span>LOCAL {clock}</span><span>SCROLL {String(scroll).padStart(2, '0')}%</span><span>XY {String(pointer.x).padStart(4, '0')}:{String(pointer.y).padStart(4, '0')}</span></div>
      </header>

      <section className="instrument-hero">
        <div className="instrument-copy">
          <p className="instrument-kicker"><span>PORTFOLIO / 2026</span><i /></p>
          <h1>I build stuff<br />that barely works, then<br /><em>overcomplicate it.</em></h1>
          <p className="instrument-summary">I'm Varun Chauhan. Computer science student, developer intern, and persistent builder of AI tools and systems.</p>
          <div className="instrument-current"><span>01 / CURRENT POSITION</span><strong>DEVELOPER INTERN <i>@</i> HUSTLEGRAD</strong><small>JAN 2026 — PRESENT</small></div>
          <div className="instrument-direction"><span>SELECT A DESTINATION</span><span>01—06 <i>·</i> CALIBRATED INPUT</span></div>
        </div>

        <div className="instrument-wheel-column">
          <div className="instrument-wheel-meta"><span>RADIAL SELECTOR <b>R-06</b></span><span>DETENT {selected.number}</span></div>
          <div className="instrument-wheel" ref={wheelRef} onPointerMove={selectFromPointer}>
            <svg className="instrument-wheel-svg" viewBox="0 0 600 600" aria-hidden="true">
              <defs>
                <linearGradient id="fxSweepGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#8fb4e8" stopOpacity="0" />
                  <stop offset="1" stopColor="#8fb4e8" stopOpacity="0.28" />
                </linearGradient>
              </defs>
              <circle className="instrument-ring instrument-ring--outer" cx="300" cy="300" r="282" />
              <circle className="instrument-ring instrument-ring--fine" cx="300" cy="300" r="269" />
              <circle className="instrument-ring instrument-ring--inner" cx="300" cy="300" r="121" />
              <g className="fx-sweep">
                <path d="M300 300L300 22A278 278 0 0 1 380 36Z" fill="url(#fxSweepGrad)" />
                <line x1="300" y1="300" x2="300" y2="22" />
              </g>
              {destinations.map((destination, index) => (
                <g key={destination.id} ref={(element) => { segmentsRef.current[index] = element; }} className={`instrument-sector${selectedIndex === index ? ' is-selected' : ''}`}>
                  <path className="instrument-sector-shape" d={sectorPath(index)} />
                  <path className="instrument-sector-runner" d={sectorPath(index)} pathLength="1000" />
                  <line x1={pointAt(121, -120 + index * 60).x} y1={pointAt(121, -120 + index * 60).y} x2={pointAt(281, -120 + index * 60).x} y2={pointAt(281, -120 + index * 60).y} />
                </g>
              ))}
              <g className="instrument-scale">
                {Array.from({ length: 72 }, (_, index) => {
                  const angle = index * 5 - 90;
                  const major = index % 6 === 0;
                  const from = pointAt(major ? 272 : 276, angle);
                  const to = pointAt(major ? 283 : 280, angle);
                  return <line key={index} className={major ? 'is-major' : ''} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
                })}
              </g>
              <circle className="instrument-hub-outline" cx="300" cy="300" r="103" />
              <circle ref={pulseRef} className="fx-pulse" cx="300" cy="300" r="125" opacity="0" />
            </svg>
            {destinations.map((destination, index) => {
              const angle = (-90 + index * 60) * Math.PI / 180;
              const left = 50 + Math.cos(angle) * 34.5;
              const top = 50 + Math.sin(angle) * 34.5;
              return <button key={destination.id} ref={(element) => { buttonsRef.current[index] = element; }} type="button" className={`instrument-option cursor-target${selectedIndex === index ? ' is-selected' : ''}`} style={{ left: `${left}%`, top: `${top}%` }} aria-pressed={selectedIndex === index} aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Enter Escape 1 2 3 4 5 6" onFocus={() => setSelectedIndex(index)} onPointerEnter={() => setSelectedIndex(index)} onClick={() => activate(destination)}><span>{destination.number}</span><strong>{destination.name}</strong></button>;
            })}
            <div className="instrument-hub" aria-live="polite"><span>SELECTED / {selected.number}</span><strong ref={hubNameRef}>{selected.name}</strong><small ref={hubNoteRef}>{selected.note}</small><button className="cursor-target" type="button" onClick={() => activate(selected)}>ENTER <b>↗</b></button></div>
          </div>
          <div className="instrument-key-guide"><span><kbd>↑</kbd><kbd>↓</kbd> SELECT</span><span><kbd>ENTER</kbd> OPEN</span><span><kbd>1–6</kbd> DIRECT</span><span><kbd>ESC</kbd> FOCUS</span></div>
        </div>
      </section>

      <nav className="instrument-mobile-index" aria-label="Portfolio sections">
        {destinations.map((destination, index) => <button type="button" key={destination.id} className={selectedIndex === index ? 'is-selected' : ''} onFocus={() => setSelectedIndex(index)} onClick={() => activate(destination)}><span>{destination.number}</span><strong>{destination.name}</strong><small>{destination.note}</small></button>)}
      </nav>

      <footer className="instrument-footer"><span>VARUN CHAUHAN <i>/</i> SOFTWARE · AI · SYSTEMS</span><span>LOCAL {clock} <i>/</i> {scroll}% PAGE</span><span>REV 2026.10 <i>·</i> BUILDING</span></footer>
    </main>
  );
}

/* paint-only additions: nothing here touches size, spacing or position in flow */
const fxCss = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600&display=swap');

.fx-bg { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; mix-blend-mode: screen; z-index: 1; }

.instrument-copy h1,
.instrument-hub strong { font-family: ${FONT}; }

.instrument-copy h1 em {
  background: linear-gradient(100deg, #8fb4e8 20%, #e3efff 45%, #8fb4e8 70%);
  background-size: 220% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fx-shimmer 5s linear infinite;
}
@keyframes fx-shimmer { from { background-position: 120% 0; } to { background-position: -100% 0; } }

.instrument-wheel-svg { animation: fx-breathe 4.5s ease-in-out infinite; }
@keyframes fx-breathe {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(143,180,232,.10)); }
  50% { filter: drop-shadow(0 0 22px rgba(143,180,232,.30)); }
}

.instrument-scale { transform-origin: 300px 300px; transform-box: view-box; animation: fx-spin 140s linear infinite; }
.fx-sweep { transform-origin: 300px 300px; transform-box: view-box; animation: fx-spin 7s linear infinite; pointer-events: none; }
.fx-sweep line { stroke: #8fb4e8; stroke-width: 1; opacity: .55; }
@keyframes fx-spin { to { transform: rotate(360deg); } }

.fx-pulse { fill: none; stroke: #8fb4e8; stroke-width: 1.5; pointer-events: none; }

.instrument-sector.is-selected { filter: drop-shadow(0 0 10px rgba(143,180,232,.45)); }

@media (prefers-reduced-motion: reduce) {
  .instrument-copy h1 em, .instrument-wheel-svg, .instrument-scale, .fx-sweep { animation: none; }
}
`;