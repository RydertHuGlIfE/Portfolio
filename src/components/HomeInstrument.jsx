import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

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
  }, [selectedIndex]);

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
    <main className="instrument-home">
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
          <div className="instrument-wheel" onPointerMove={selectFromPointer}>
            <svg className="instrument-wheel-svg" viewBox="0 0 600 600" aria-hidden="true">
              <circle className="instrument-ring instrument-ring--outer" cx="300" cy="300" r="282" />
              <circle className="instrument-ring instrument-ring--fine" cx="300" cy="300" r="269" />
              <circle className="instrument-ring instrument-ring--inner" cx="300" cy="300" r="121" />
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
            </svg>
            {destinations.map((destination, index) => {
              const angle = (-90 + index * 60) * Math.PI / 180;
              const left = 50 + Math.cos(angle) * 34.5;
              const top = 50 + Math.sin(angle) * 34.5;
              return <button key={destination.id} ref={(element) => { buttonsRef.current[index] = element; }} type="button" className={`instrument-option cursor-target${selectedIndex === index ? ' is-selected' : ''}`} style={{ left: `${left}%`, top: `${top}%` }} aria-pressed={selectedIndex === index} aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Enter Escape 1 2 3 4 5 6" onFocus={() => setSelectedIndex(index)} onPointerEnter={() => setSelectedIndex(index)} onClick={() => activate(destination)}><span>{destination.number}</span><strong>{destination.name}</strong></button>;
            })}
            <div className="instrument-hub" aria-live="polite"><span>SELECTED / {selected.number}</span><strong>{selected.name}</strong><small>{selected.note}</small><button className="cursor-target" type="button" onClick={() => activate(selected)}>ENTER <b>↗</b></button></div>
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