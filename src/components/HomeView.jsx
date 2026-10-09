import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Cpu, FileText, Github, Mail, Terminal, UserRound } from 'lucide-react';

const destinations = [
  { id: 'about', label: 'About', index: '01', note: 'The person behind the projects', icon: UserRound, color: '#75aef7' },
  { id: 'projects', label: 'Projects', index: '02', note: 'Things built, tested, shipped', icon: BriefcaseBusiness, color: '#c9ed76' },
  { id: 'skills', label: 'Skills', index: '03', note: 'Tools and ideas in my orbit', icon: Cpu, color: '#c18cf0' },
  { id: 'terminal', label: 'Terminal', index: '04', note: 'Explore from the command line', icon: Terminal, color: '#efb36b' },
  { id: 'resume', label: 'Resume', index: '05', note: 'Experience, in one document', icon: FileText, color: '#ff896d' },
  { id: 'contact', label: 'Get in touch', index: '06', note: 'Start a conversation', icon: Mail, color: '#74c7c0' },
];

const pointAt = (radius, angle) => {
  const radians = (angle * Math.PI) / 180;
  return { x: 300 + Math.cos(radians) * radius, y: 300 + Math.sin(radians) * radius };
};

const sectorPath = (index) => {
  const startAngle = -120 + index * 60 + 2.3;
  const endAngle = -120 + (index + 1) * 60 - 2.3;
  const innerStart = pointAt(133, startAngle);
  const outerStart = pointAt(267, startAngle);
  const outerEnd = pointAt(267, endAngle);
  const innerEnd = pointAt(133, endAngle);
  return `M ${innerStart.x} ${innerStart.y} L ${outerStart.x} ${outerStart.y} A 267 267 0 0 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A 133 133 0 0 0 ${innerStart.x} ${innerStart.y} Z`;
};

export default function HomeView({ setActiveTab, onOpenResume }) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const buttonRefs = useRef([]);
  const selected = destinations[selectedIndex];

  const activate = (destination) => {
    if (destination.id === 'resume') onOpenResume();
    else setActiveTab(destination.id);
  };

  const selectSectorAtPointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left - bounds.width / 2;
    const offsetY = event.clientY - bounds.top - bounds.height / 2;
    const radius = Math.hypot(offsetX, offsetY) / Math.min(bounds.width, bounds.height);
    if (radius < 0.18 || radius > 0.48) return;

    const angle = Math.atan2(offsetY, offsetX) * 180 / Math.PI;
    const sectorIndex = ((Math.round((angle + 90) / 60) % destinations.length) + destinations.length) % destinations.length;
    setSelectedIndex(sectorIndex);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const wheelOption = target?.closest('.wheel-option');
      const otherControl = target?.closest('a, button, input, textarea, select, [contenteditable="true"]') && !wheelOption;
      if (otherControl) return;

      if (event.key === 'Enter') {
        event.preventDefault();
        activate(destinations[selectedIndex]);
        return;
      }

      let nextIndex = selectedIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (selectedIndex + 1) % destinations.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (selectedIndex - 1 + destinations.length) % destinations.length;
      else if (/^[1-6]$/.test(event.key)) nextIndex = Number(event.key) - 1;
      else return;

      event.preventDefault();
      setSelectedIndex(nextIndex);
      buttonRefs.current[nextIndex]?.focus({ preventScroll: true });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, setActiveTab, onOpenResume]);

  return (
    <div className="home-view home-wheel-page">
      <header className="home-masthead">
        <a className="home-wordmark" href="#home" onClick={(event) => event.preventDefault()} aria-label="Varun Chauhan home">
          <span className="wordmark-mark">VC</span><span>VARUN CHAUHAN</span>
        </a>
        <span className="home-location"><span className="status-dot" /> MEERUT, INDIA <span className="masthead-divider">/</span> OPEN TO BUILDING</span>
        <a className="masthead-contact cursor-target" href="https://github.com/RydertHuGlIfE" target="_blank" rel="noreferrer">
          GITHUB <Github size={14} /> <ArrowUpRight size={13} />
        </a>
      </header>

      <section className="wheel-intro">
        <p className="hero-kicker"><span>PORTFOLIO / 2026</span><span className="kicker-rule" /></p>
        <h1>Ideas in motion.<br /><span>Software with purpose.</span></h1>
        <p className="wheel-tagline">I'm Varun, a computer science student building across AI, systems, and useful ideas.</p>
      </section>

      <section className="wheel-section" aria-label="Portfolio navigation">
        <div className="wheel-section-label"><span><i /> SELECTED ROUTE</span><span>PORTFOLIO INDEX / 06</span></div>
        <div className="wheel-stage">
          <div className="orbit-wheel" style={{ '--wheel-accent': selected.color }} onPointerMove={selectSectorAtPointer}>
            <svg className="orbit-wheel__art" viewBox="0 0 600 600" role="img" aria-label="Radial menu linking to portfolio sections">
              <circle className="wheel-outline wheel-outline--outer" cx="300" cy="300" r="280" />
              <circle className="wheel-outline wheel-outline--mid" cx="300" cy="300" r="267" />
              <circle className="wheel-outline wheel-outline--hub" cx="300" cy="300" r="133" />
              <circle className="wheel-outline wheel-outline--inner" cx="300" cy="300" r="120" />
              {destinations.map((destination, index) => {
                const angle = -90 + index * 60;
                const start = pointAt(133, -120 + index * 60);
                const end = pointAt(267, -120 + index * 60);
                const isSelected = selectedIndex === index;
                const lift = isSelected ? 12 : 0;
                const radians = (angle * Math.PI) / 180;
                return <g key={destination.id} className={`wheel-sector${isSelected ? ' is-selected' : ''}`} style={{ '--sector-color': destination.color, '--lift-x': `${Math.cos(radians) * lift}px`, '--lift-y': `${Math.sin(radians) * lift}px` }}><path d={sectorPath(index)} /><path className="wheel-sector-tracer" d={sectorPath(index)} pathLength={1000} /><line x1={start.x} y1={start.y} x2={end.x} y2={end.y} /></g>;
              })}
              <g className="wheel-tick-ring">
                {Array.from({ length: 48 }, (_, index) => {
                  const angle = index * 7.5 - 90;
                  const major = index % 4 === 0;
                  const from = pointAt(major ? 273 : 276, angle);
                  const to = pointAt(major ? 280 : 279, angle);
                  return <line key={index} className={`wheel-tick${major ? ' is-major' : ''}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
                })}
              </g>
              <circle className="wheel-center-ring" cx="300" cy="300" r="97" />
              <circle className="wheel-center-dot" cx="300" cy="300" r="3" />
            </svg>

            {destinations.map((destination, index) => {
              const angle = -90 + index * 60;
              const radians = (angle * Math.PI) / 180;
              const x = 50 + Math.cos(radians) * 34.2;
              const y = 50 + Math.sin(radians) * 34.2;
              const lift = selectedIndex === index ? 7 : 0;
              const Icon = destination.icon;
              return (
                <button
                  key={destination.id}
                  ref={(element) => { buttonRefs.current[index] = element; }}
                  type="button"
                  className={`wheel-option cursor-target${selectedIndex === index ? ' is-selected' : ''}`}
                  style={{ left: `${x}%`, top: `${y}%`, '--option-color': destination.color, '--option-delay': `${index * 65}ms`, '--lift-x': `${Math.cos(radians) * lift}px`, '--lift-y': `${Math.sin(radians) * lift}px` }}
                  aria-label={`${destination.index}, ${destination.label}: ${destination.note}`}
                  aria-pressed={selectedIndex === index}
                  aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight 1 2 3 4 5 6 Enter"
                  onMouseEnter={() => setSelectedIndex(index)}
                  onFocus={() => setSelectedIndex(index)}
                  onClick={() => activate(destination)}
                >
                  <span className="wheel-option__icon"><Icon size={19} strokeWidth={1.7} /></span>
                  <span className="wheel-option__name">{destination.label}</span>
                  <span className="wheel-option__index">{destination.index}</span>
                </button>
              );
            })}

            <div className="wheel-hub" aria-live="polite">
              <div className="wheel-hub__content" key={selected.id}>
                <span className="wheel-hub__eyebrow">{selected.index} / 06 <i /></span>
                <span className="wheel-hub__icon" style={{ color: selected.color }}><selected.icon size={25} strokeWidth={1.5} /></span>
                <strong>{selected.label}</strong>
                <span className="wheel-hub__note">{selected.note}</span>
                <button type="button" className="wheel-hub__action cursor-target" onClick={() => activate(selected)} aria-label={`Open ${selected.label}`}>
                  OPEN <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="wheel-controls"><span><kbd>↑</kbd><kbd>↓</kbd> CHANGE SELECTION</span><span><kbd>ENTER</kbd> OPEN DESTINATION</span><span><kbd>1–6</kbd> DIRECT SELECT</span></div>
      </section>

      <footer className="wheel-footer">
        <span><i /> CS @ SRMIST <b>/</b> DEVELOPER INTERN @ HUSTLEGRAD</span>
        <span>BUILD / DEBUG / LEARN</span>
      </footer>
    </div>
  );
}