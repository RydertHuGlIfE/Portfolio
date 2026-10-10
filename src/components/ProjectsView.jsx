import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Github, ExternalLink, Zap, HeartPulse, BookOpen, Gamepad2, Mic, Music } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────── */
/* DATA                                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */
const projects = [
  {
    number: '01',
    title: 'Audio Genre Classification',
    year: '2026',
    description: 'Classifies FMA Small audio into eight genres from log-mel spectrogram segments.',
    outcome: 'Reports 63.83% accuracy across a 2,397-track evaluation sample using a CNN trained on 128-bin mel spectrograms.',
    notice: null,
    tags: ['Python', 'TensorFlow', 'Librosa', 'CNN'],
    github: 'https://github.com/RydertHuGlIfE/Audio-Genre-Classification',
    repo: 'Audio-Genre-Classification',
    colorRaw: '#c9ed76',
    Icon: Music,
    preview: 'spectrum',
  },
  {
    number: '02',
    title: 'CardioFusionX',
    year: '2026',
    description: 'A research workspace for multi-label classification of 12-lead ECG signals.',
    outcome: 'Includes a waveform review demo, model/threshold validation, and JSON/CSV result export.',
    notice: 'Experimental research software — not a medical diagnostic device.',
    tags: ['Python', 'PyTorch', 'Flask', 'ResNet-SE'],
    github: 'https://github.com/RydertHuGlIfE/CardioFusionX',
    repo: 'CardioFusionX',
    colorRaw: '#ff8c6b',
    Icon: HeartPulse,
    preview: 'ecg',
  },
  {
    number: '03',
    title: 'Kitaab Gyaani',
    year: '2026',
    description: 'A collaborative study environment for asking questions about PDFs and working through course material.',
    outcome: 'Combines PDF chat, summaries, quizzes, mind maps, and shared study rooms with real-time sync.',
    notice: null,
    tags: ['React', 'Flask', 'Gemini', 'Socket.IO'],
    github: 'https://github.com/RydertHuGlIfE/KitaabGyaani',
    repo: 'KitaabGyaani',
    colorRaw: '#7eb2ee',
    Icon: BookOpen,
    preview: 'neural',
  },
  {
    number: '04',
    title: 'Minesweeper Playing Agent',
    year: '2026',
    description: 'A language-model agent trained to choose structured reveal and flag moves in Minesweeper.',
    outcome: 'Generates expert game traces, then applies SFT and GRPO LoRA fine-tuning on top of a base LLM.',
    notice: null,
    tags: ['Python', 'SFT', 'GRPO', 'LoRA'],
    github: 'https://github.com/RydertHuGlIfE/IITD_Feb26_RL_MINESWEEPER',
    repo: 'IITD_Feb26_RL_MINESWEEPER',
    colorRaw: '#a78bfa',
    Icon: Gamepad2,
    preview: 'minesweeper',
  },
  {
    number: '05',
    title: 'J.A.R.V.I.S.',
    year: '2026',
    description: 'A voice-driven desktop assistant with a custom HUD and language-model-backed tools.',
    outcome: 'Connects speech recognition, Groq models, Piper TTS, and desktop actions in one seamless workflow.',
    notice: null,
    tags: ['Python', 'Groq', 'Piper TTS', 'Linux'],
    github: 'https://github.com/RydertHuGlIfE/J.A.R.V.I.S',
    repo: 'J.A.R.V.I.S',
    colorRaw: '#fbbf24',
    Icon: Mic,
    preview: 'hud',
  },
  {
    number: '06',
    title: 'Jam_bo',
    year: '2026',
    description: 'A shared listening room that keeps playback position and track queues in sync.',
    outcome: 'WebSocket room state and heartbeat pulses synchronize concurrent listeners with sub-100ms latency.',
    notice: null,
    tags: ['React', 'FastAPI', 'WebSockets', 'yt-dlp'],
    github: 'https://github.com/RydertHuGlIfE/Jam_bo',
    repo: 'Jam_bo',
    colorRaw: '#34d399',
    Icon: Zap,
    preview: 'wave',
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/* WEAPON WHEEL                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
const C = 300;
const pointAt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r };
};

function wheelSectorPath(i) {
  const slice = 60;
  const s = -90 + i * slice - slice / 2 + 1.5;
  const e = s + slice - 3;
  const a = pointAt(115, s), b = pointAt(272, s), c = pointAt(272, e), d = pointAt(115, e);
  return `M${a.x} ${a.y}L${b.x} ${b.y}A272 272 0 0 1 ${c.x} ${c.y}L${d.x} ${d.y}A115 115 0 0 0 ${a.x} ${a.y}Z`;
}

function ProjectWheel({ selected, onSelect, onActivate }) {
  const fromPointer = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2;
    const dy = e.clientY - r.top - r.height / 2;
    const rad = Math.hypot(dx, dy) / Math.min(r.width, r.height);
    if (rad < 0.2 || rad > 0.49) return;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    onSelect(((Math.round((ang + 90) / 60) % 6) + 6) % 6);
  };

  return (
    <div className="pw-wheel" onPointerMove={fromPointer}>
      <svg className="pw-svg" viewBox="0 0 600 600" aria-hidden="true">
        <circle className="pw-ring pw-ring--outer" cx="300" cy="300" r="280" />
        <circle className="pw-ring pw-ring--fine"  cx="300" cy="300" r="268" />
        <circle className="pw-ring pw-ring--inner" cx="300" cy="300" r="116" />

        {projects.map((p, i) => {
          const midDeg = -90 + i * 60;
          const mid = (midDeg * Math.PI) / 180;
          const lift = selected === i ? 10 : 0;
          return (
            <g
              key={p.number}
              className={`pw-sec${selected === i ? ' pw-sec--sel' : ''}`}
              style={{ '--pc': p.colorRaw, transform: `translate(${Math.cos(mid)*lift}px,${Math.sin(mid)*lift}px)` }}
              onClick={() => onActivate(i)}
            >
              <path className="pw-shape" d={wheelSectorPath(i)} />
              <line
                x1={pointAt(116, -90 + i * 60).x} y1={pointAt(116, -90 + i * 60).y}
                x2={pointAt(273, -90 + i * 60).x} y2={pointAt(273, -90 + i * 60).y}
                className="pw-divider"
              />
            </g>
          );
        })}

        <g className="pw-ticks">
          {Array.from({ length: 72 }, (_, i) => {
            const major = i % 6 === 0;
            const f = pointAt(major ? 269 : 273, i * 5 - 90);
            const t = pointAt(major ? 280 : 277, i * 5 - 90);
            return <line key={i} className={major ? 'pw-tick-major' : 'pw-tick-minor'} x1={f.x} y1={f.y} x2={t.x} y2={t.y} />;
          })}
        </g>
        <circle className="pw-ring pw-ring--hub" cx="300" cy="300" r="99" />
      </svg>

      {projects.map((p, i) => {
        const a = ((-90 + i * 60) * Math.PI) / 180;
        const Icon = p.Icon;
        return (
          <button
            key={p.number}
            className={`pw-opt cursor-target${selected === i ? ' pw-opt--sel' : ''}`}
            style={{
              '--pc': p.colorRaw,
              left: `${50 + Math.cos(a) * 33.5}%`,
              top: `${50 + Math.sin(a) * 33.5}%`,
            }}
            onPointerEnter={() => onSelect(i)}
            onClick={() => onActivate(i)}
            aria-pressed={selected === i}
          >
            <Icon size={11} />
            <span className="pw-opt-num">{p.number}</span>
          </button>
        );
      })}

      <div className="pw-hub" style={{ '--pc': projects[selected].colorRaw }}>
        <small className="pw-hub-t">PROJECT / {projects[selected].number}</small>
        <strong className="pw-hub-name">{projects[selected].number}</strong>
        <small className="pw-hub-n">{projects[selected].tags[0]}</small>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* MINI PREVIEW VISUALS                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */
function SpectrumPreview({ colorRaw }) {
  return (
    <div className="pv-spectrum">
      {Array.from({ length: 32 }, (_, i) => {
        const h = 18 + ((i * 31 + i * i * 7) % 77);
        return <i key={i} style={{ '--bar': `${h}%`, '--c': colorRaw }} />;
      })}
    </div>
  );
}

function EcgPreview({ colorRaw }) {
  return (
    <svg className="pv-ecg" viewBox="0 0 80 40" preserveAspectRatio="none">
      <polyline
        points="0,20 8,20 12,5 16,35 20,20 28,20 32,12 36,28 40,20 48,20 52,8 56,32 60,20 80,20"
        fill="none" stroke={colorRaw} strokeWidth="1.5"
      />
    </svg>
  );
}

function MinesweeperPreview() {
  const cells = ['1','2','1','','1','*','','','1','1','','1','','2','2','1','','1','0','1','1','*','1','','1','1','1','0','1','1','1',''];
  return (
    <div className="pv-mines">
      {cells.map((cell, i) => (
        <span key={i} className={cell === '*' ? 'pv-mine' : cell ? 'pv-open' : ''}>{cell}</span>
      ))}
    </div>
  );
}

function NeuralPreview({ colorRaw }) {
  const layers = [[10,[10,20,30]], [40,[5,15,25,35]], [70,[10,20,30]]];
  return (
    <svg className="pv-neural" viewBox="0 0 80 40">
      {layers.slice(0,-1).map(([x,ys],li) =>
        ys.flatMap((y,ni) =>
          layers[li+1][1].map((y2,ni2) => (
            <line key={`${li}-${ni}-${ni2}`} x1={x} y1={y} x2={layers[li+1][0]} y2={y2}
                  stroke={colorRaw} strokeWidth="0.5" opacity="0.4"/>
          ))
        )
      )}
      {layers.flatMap(([x,ys]) =>
        ys.map((y,i) => <circle key={`${x}-${i}`} cx={x} cy={y} r="2.5" fill={colorRaw} opacity="0.85"/>)
      )}
    </svg>
  );
}

function HudPreview({ colorRaw }) {
  return (
    <svg className="pv-hud" viewBox="0 0 80 40">
      <circle cx="40" cy="20" r="16" fill="none" stroke={colorRaw} strokeWidth="1" opacity="0.5"/>
      <circle cx="40" cy="20" r="10" fill="none" stroke={colorRaw} strokeWidth="0.7" opacity="0.7"/>
      <line x1="24" y1="20" x2="56" y2="20" stroke={colorRaw} strokeWidth="0.7" opacity="0.5"/>
      <line x1="40" y1="4" x2="40" y2="36" stroke={colorRaw} strokeWidth="0.7" opacity="0.5"/>
      <circle cx="40" cy="20" r="2" fill={colorRaw}/>
      <text x="55" y="10" fill={colorRaw} fontSize="4" opacity="0.8">SYS</text>
      <text x="55" y="16" fill={colorRaw} fontSize="4" opacity="0.6">ONLINE</text>
    </svg>
  );
}

function WavePreview({ colorRaw }) {
  return (
    <svg className="pv-wave" viewBox="0 0 80 40" preserveAspectRatio="none">
      {[0,1,2].map(j => (
        <polyline key={j}
          points={Array.from({length:20}, (_,i)=>`${i*4},${20+Math.sin((i+j*2.5)*0.8)*((3-j)*5)}`).join(' ')}
          fill="none" stroke={colorRaw} strokeWidth={1.2-j*0.3} opacity={1-j*0.3}
        />
      ))}
    </svg>
  );
}

function ProjectVisual({ p }) {
  return (
    <div className="project-visual" style={{ '--project-color': p.colorRaw }}>
      <span>{p.number}</span>
      {p.preview === 'spectrum'    && <SpectrumPreview    colorRaw={p.colorRaw} />}
      {p.preview === 'ecg'         && <EcgPreview         colorRaw={p.colorRaw} />}
      {p.preview === 'minesweeper' && <MinesweeperPreview />}
      {p.preview === 'neural'      && <NeuralPreview      colorRaw={p.colorRaw} />}
      {p.preview === 'hud'         && <HudPreview         colorRaw={p.colorRaw} />}
      {p.preview === 'wave'        && <WavePreview        colorRaw={p.colorRaw} />}
      <i />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* MAIN VIEW                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function ProjectsView() {
  const [activeProject, setActiveProject] = useState(0);
  const [hoveredProject, setHoveredProject] = useState(null);
  const entriesRef = useRef([]);
  const wheelColRef = useRef(null);
  const headerRef = useRef(null);

  /* Entrance animation */
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
    );
    tl.fromTo(wheelColRef.current,
      { x: 60, opacity: 0, scale: 0.88 },
      { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'elastic.out(1,0.75)' },
      '-=0.2'
    );
    tl.fromTo(entriesRef.current.filter(Boolean),
      { x: -48, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.09 },
      '-=0.45'
    );
  }, []);

  /* Active project highlight */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const el = entriesRef.current[activeProject];
    if (!el) return;
    const color = projects[activeProject].colorRaw;
    gsap.fromTo(el,
      { backgroundColor: `rgba(255,255,255,0)` },
      {
        backgroundColor: `rgba(255,255,255,0.03)`,
        duration: 0.55, ease: 'power2.out'
      }
    );
  }, [activeProject]);

  const handleWheelActivate = (i) => {
    setActiveProject(i);
    const el = entriesRef.current[i];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <section className="projects-page">
      <style>{EXTRA_CSS}</style>

      <header ref={headerRef} className="section-page-heading projects-heading">
        <div>
          <p className="section-eyebrow"><span>02</span> WORK INDEX / UPDATED 2026</p>
          <h1>Things I <span>built.</span></h1>
          <p>Select a project on the wheel or click an entry. Stack listed inline.</p>
        </div>
        <a className="section-header-link cursor-target"
           href="https://github.com/RydertHuGlIfE?tab=repositories"
           target="_blank" rel="noreferrer">
          <Github size={16} /> ALL REPOSITORIES <ExternalLink size={13} />
        </a>
      </header>

      <div className="projects-body">
        {/* Project ledger */}
        <div className="projects-ledger">
          {projects.map((p, i) => {
            const isActive = activeProject === i;
            return (
              <article
                key={p.number}
                ref={el => { entriesRef.current[i] = el; }}
                className={`project-entry${isActive ? ' project-entry--active' : ''}`}
                style={{ '--project-color': p.colorRaw }}
                onPointerEnter={() => setHoveredProject(i)}
                onPointerLeave={() => setHoveredProject(null)}
                onClick={() => setActiveProject(i)}
              >
                <ProjectVisual p={p} />

                <div className="project-content">
                  <p className="project-kicker">
                    <span>{p.number} / {p.year}</span>
                    <span>{p.tags.join(' · ')}</span>
                  </p>
                  <h2>{p.title}</h2>
                  <p className="project-description">{p.description}</p>

                  {isActive && (
                    <div className="project-outcome">
                      <p>{p.outcome}</p>
                      {p.notice && <p className="project-notice"><i />{p.notice}</p>}
                    </div>
                  )}

                  <div className="project-tags">
                    {p.tags.map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                </div>

                <a
                  className="project-repo-link cursor-target"
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  <Github size={13} />
                  <span>{p.repo}</span>
                  <ExternalLink size={11} />
                </a>
              </article>
            );
          })}
        </div>

        {/* Weapon Wheel column */}
        <div ref={wheelColRef} className="projects-wheel-col">
          <div className="pw-label">RADIAL SELECTOR · R-06</div>
          <ProjectWheel
            selected={activeProject}
            onSelect={setActiveProject}
            onActivate={handleWheelActivate}
          />
          <div className="pw-legend">
            {projects.map((p, i) => (
              <button
                key={p.number}
                className={`pw-legend-item cursor-target${activeProject === i ? ' pw-legend-item--sel' : ''}`}
                style={{ '--pc': p.colorRaw }}
                onClick={() => handleWheelActivate(i)}
              >
                <span className="pw-legend-dot" />
                <span>{p.number}</span>
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <footer className="projects-footnote">
        <span>06 ENTRIES</span>
        <span>OPEN SOURCE / GITHUB</span>
        <a href="https://github.com/RydertHuGlIfE/Portfolio" target="_blank" rel="noreferrer" className="cursor-target">
          <Github size={12} /> RydertHuGlIfE/Portfolio <ExternalLink size={11} />
        </a>
      </footer>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* EXTRA SCOPED CSS                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
const EXTRA_CSS = `
.projects-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: clamp(20px, 4vw, 48px);
  margin-top: 12px;
  align-items: start;
}

.projects-ledger {
  display: flex;
  flex-direction: column;
}

/* Entry layout: 3-column (Visual / Info / Repo link) */
.project-entry {
  display: grid !important;
  grid-template-columns: 72px minmax(0, 1fr) auto !important;
  align-items: start !important;
  gap: 18px !important;
  padding: 18px 12px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  cursor: pointer;
  transition: background 160ms ease, border-color 200ms ease;
  position: relative;
}

.project-entry:hover {
  background: rgba(255, 255, 255, 0.02) !important;
}

.project-entry--active {
  background: rgba(255, 255, 255, 0.035) !important;
  border-bottom-color: rgba(255, 255, 255, 0.14) !important;
}

/* Visual Badge */
.project-visual {
  position: relative;
  display: grid;
  place-items: center;
  width: 72px !important;
  height: 72px !important;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 200ms ease, background 200ms ease;
}

.project-visual > span {
  position: absolute;
  top: 4px;
  left: 6px;
  font: 8px 'IBM Plex Mono', monospace;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
  z-index: 2;
}

.project-visual > svg {
  display: block !important;
}

.project-entry:hover .project-visual,
.project-entry--active .project-visual {
  border-color: color-mix(in srgb, var(--project-color) 45%, rgba(255, 255, 255, 0.15)) !important;
  background: rgba(255, 255, 255, 0.04) !important;
}

/* Content column */
.project-content {
  display: flex !important;
  flex-direction: column !important;
  gap: 5px !important;
  min-width: 0 !important;
}

.project-kicker {
  display: flex !important;
  align-items: center;
  gap: 8px;
  font: 9px 'IBM Plex Mono', monospace;
  color: #6b7280;
  letter-spacing: 0.05em;
  margin: 0 !important;
}

.project-kicker span:first-child {
  color: var(--project-color, #c9ed76);
  font-weight: 500;
}

.project-content h2 {
  margin: 0 !important;
  color: var(--paper, #f3f4f6);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.project-description {
  max-width: 650px;
  margin: 2px 0 0 !important;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.6;
}

/* Outcome reveal */
.project-outcome {
  animation: pv-reveal .3s cubic-bezier(.16, .85, .25, 1.1) both;
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 2px solid var(--project-color, #c9ed76);
  border-radius: 0 4px 4px 0;
}
@keyframes pv-reveal { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
.project-outcome > p {
  max-width: 650px;
  margin: 0;
  color: #cbd5e1;
  font-size: 11px;
  line-height: 1.65;
}

.project-notice {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0 0;
  color: #fca5a5;
  font: 9px 'IBM Plex Mono', monospace;
}
.project-notice i {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #f87171;
}

/* Tags */
.project-tags {
  display: flex !important;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px !important;
}

.project-tags span {
  padding: 2px 7px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.02);
  color: #8b9285;
  font: 9px 'IBM Plex Mono', monospace;
  letter-spacing: 0.02em;
}

/* Repo Link Button */
.project-repo-link {
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  color: #cbd5e1;
  font: 10px 'IBM Plex Mono', monospace;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;
  align-self: start;
  margin-top: 2px;
}

.project-repo-link svg {
  display: inline-block !important;
  flex-shrink: 0;
}

.project-repo-link svg:first-child {
  color: #94a3b8;
  transition: color 0.2s ease;
}

.project-repo-link svg:last-child {
  color: #64748b;
  transition: color 0.2s ease, transform 0.2s ease;
}

.project-repo-link:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.24);
  color: #ffffff;
}

.project-repo-link:hover svg:first-child {
  color: #ffffff;
}

.project-repo-link:hover svg:last-child {
  color: #ffffff;
  transform: translate(1px, -1px);
}

/* Spectrum */
.pv-spectrum { display:flex; align-items:flex-end; gap:1px; width:56px; height:36px; }
.pv-spectrum i { flex:1; height:var(--bar); background:var(--c); opacity:.85;
  animation: pv-bar 1.8s ease-in-out infinite alternate;
  animation-delay: calc(var(--bar) * 10ms); }
@keyframes pv-bar { from { opacity:.5; transform:scaleY(.82); } to { opacity:1; transform:scaleY(1); } }

/* ECG */
.pv-ecg { width:60px; height:30px; }
.pv-ecg polyline { stroke-dasharray:200; animation: pv-ecg 2.4s linear infinite; }
@keyframes pv-ecg { from { stroke-dashoffset:200; } to { stroke-dashoffset:-200; } }

/* Minesweeper */
.pv-mines { display:grid; grid-template-columns:repeat(7,1fr); gap:1px; width:58px; }
.pv-mines span { display:grid; place-items:center; height:8px; font:5px monospace; color:#ced5c8; background:rgba(255,255,255,.05); }
.pv-mines .pv-mine { background:rgba(255,80,80,.25); color:#ff7070; animation: pv-blink 2s ease-in-out infinite; }
.pv-mines .pv-open { background:rgba(167,139,250,.18); }
@keyframes pv-blink { 0%,100%{opacity:.6;} 50%{opacity:1;} }

/* Neural */
.pv-neural { width:60px; height:36px; }
.pv-neural circle { animation: pv-node 2s ease-in-out infinite alternate; }
.pv-neural circle:nth-child(even) { animation-delay:.4s; }
@keyframes pv-node { from{r:2.5;opacity:.7;} to{r:3.2;opacity:1;} }

/* HUD */
.pv-hud { width:60px; height:36px; }

/* Wave */
.pv-wave { width:60px; height:36px; }
.pv-wave polyline { animation: pv-wave 2s ease-in-out infinite alternate; }
.pv-wave polyline:nth-child(2) { animation-delay:.3s; }
.pv-wave polyline:nth-child(3) { animation-delay:.6s; }
@keyframes pv-wave { from{transform:translateX(0);} to{transform:translateX(-6px);} }

/* ── Weapon Wheel ── */
.projects-wheel-col {
  display:flex; flex-direction:column; gap:10px;
  position:sticky; top:20px; align-self:start;
  max-height:calc(100vh - 160px); overflow-y:auto;
}
.pw-label { color:#7a8074; font:8px 'IBM Plex Mono',monospace; letter-spacing:.06em; text-align:center; }
.pw-wheel { position:relative; width:100%; aspect-ratio:1; max-width:290px; margin:0 auto; }
.pw-svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
.pw-ring { fill:none; }
.pw-ring--outer { stroke:rgba(223,230,216,.28); }
.pw-ring--fine  { stroke:rgba(223,230,216,.12); stroke-dasharray:2 5; }
.pw-ring--inner { stroke:rgba(223,230,216,.1); }
.pw-ring--hub   { stroke:rgba(223,230,216,.32); }
.pw-ticks { animation:pw-spin 40s linear infinite; transform-origin:300px 300px; }
.pw-tick-major { stroke:rgba(228,233,221,.55); stroke-width:1.3; }
.pw-tick-minor { stroke:rgba(228,233,221,.2); stroke-width:1; }
@keyframes pw-spin { to { transform:rotate(360deg); } }
.pw-divider { stroke:rgba(223,230,216,.1); stroke-width:1; }
.pw-sec { cursor:pointer; transition:transform .3s cubic-bezier(.2,.85,.25,1),filter .2s; }
.pw-shape { fill:rgba(244,242,230,.022); stroke:rgba(223,230,216,.1); stroke-width:1; transition:fill .18s,stroke .18s; }
.pw-sec--sel { filter:drop-shadow(0 2px 4px rgba(0,0,0,.2)); }
.pw-sec--sel .pw-shape { fill:rgba(255,255,255,0.05); stroke:rgba(255,255,255,0.3); stroke-width:1.5; }
@keyframes pw-run { to { stroke-dashoffset:-1000; } }
.pw-opt {
  position:absolute; z-index:2; transform:translate(-50%,-50%);
  display:flex; align-items:center; gap:4px; padding:6px 8px;
  border:1px solid rgba(223,230,216,.14); color:#8b9285;
  font:8px 'IBM Plex Mono',monospace; background:rgba(8,10,9,.6);
  cursor:pointer; transition:border-color .16s,color .16s,background .16s;
}
.pw-opt svg { opacity:.7; }
.pw-opt-num { color:#606860; font-size:.82em; }
.pw-opt--sel { border-color:var(--pc) !important; color:var(--pc) !important; background:rgba(8,10,9,.9) !important; }
.pw-opt--sel svg { opacity:1; }
.pw-opt--sel .pw-opt-num { color:var(--pc); }
.pw-opt:hover { border-color:color-mix(in srgb,var(--pc) 80%,transparent); color:var(--pc); }
.pw-hub {
  position:absolute; z-index:3; left:50%; top:50%;
  width:30%; aspect-ratio:1; transform:translate(-50%,-50%);
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px;
  border-radius:50%; text-align:center;
  background:radial-gradient(circle,rgba(14,18,17,.98),rgba(9,11,10,.98) 75%);
  pointer-events:none;
}

.pw-hub-t  { font:6px 'IBM Plex Mono',monospace; color:#7a8076; letter-spacing:.06em; }
.pw-hub-name { font:500 clamp(10px,1.8vw,14px) 'Space Grotesk',sans-serif; color:var(--pc); }
.pw-hub-n  { font:6px 'IBM Plex Mono',monospace; color:#a4ab9c; letter-spacing:.04em; }

/* Legend */
.pw-legend { display:flex; flex-direction:column; gap:1px; }
.pw-legend-item {
  display:grid; grid-template-columns:8px 22px 1fr;
  align-items:center; gap:7px; padding:6px 9px;
  border:1px solid transparent; color:#848d80;
  font:8px 'IBM Plex Mono',monospace; text-align:left;
  cursor:pointer; transition:border-color .14s,color .14s,background .14s;
}
.pw-legend-item:hover,
.pw-legend-item--sel { border-color:rgba(255,255,255,0.1); color:#fff; background:rgba(255,255,255,0.03); }
.pw-legend-dot { width:5px; height:5px; border-radius:50%; background:var(--pc); }
.pw-legend-item span:nth-child(2) { color:rgba(255,255,255,0.5); }
.pw-legend-item span:last-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* footnote link */
.projects-footnote a { display:inline-flex; align-items:center; gap:5px; color:var(--signal-lime); text-decoration:none; font:8px var(--signal-mono,monospace); }
.projects-footnote a:hover { color:#d6f68f; }

@media (max-width: 900px) {
  .projects-body { grid-template-columns: 1fr; }
  .projects-wheel-col { position: static; max-height: none; }
  .pw-wheel { max-width: 260px; }
}

@media (max-width: 680px) {
  .project-entry {
    grid-template-columns: 52px minmax(0, 1fr) !important;
    gap: 12px !important;
    padding: 14px 4px !important;
  }
  .project-visual {
    width: 52px !important;
    height: 52px !important;
  }
  .project-repo-link {
    grid-column: 2;
    margin-top: 6px;
    align-self: start;
  }
}
`;
