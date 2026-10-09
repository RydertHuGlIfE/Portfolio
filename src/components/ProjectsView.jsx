import React, { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    number: '01',
    title: 'Audio Genre Classification',
    year: '2026',
    description: 'Classifies FMA Small audio into eight genres from log-mel spectrogram segments.',
    outcome: 'The repository reports 63.83% accuracy across a 2,397-track evaluation sample.',
    tags: ['Python', 'TensorFlow', 'Librosa', 'CNN'],
    github: 'https://github.com/RydertHuGlIfE/Audio-Genre-Classification',
    preview: 'spectrum',
  },
  {
    number: '02',
    title: 'CardioFusionX',
    year: '2026',
    description: 'A research workspace for multi-label classification of 12-lead ECG signals.',
    outcome: 'Includes a waveform review demo, model/threshold validation, and JSON/CSV result export.',
    tags: ['Python', 'PyTorch', 'Flask', 'ResNet-SE'],
    github: 'https://github.com/RydertHuGlIfE/CardioFusionX',
    notice: 'Experimental research software, not a medical diagnostic device.',
  },
  {
    number: '03',
    title: 'Kitaab Gyaani',
    year: '2026',
    description: 'A collaborative study environment for asking questions about PDFs and working through course material.',
    outcome: 'Combines PDF chat, summaries, quizzes, mind maps, and shared study rooms.',
    tags: ['React', 'Flask', 'Gemini', 'Socket.IO'],
    github: 'https://github.com/RydertHuGlIfE/KitaabGyaani',
  
  },
  {
    number: '04',
    title: 'Minesweeper Playing Agent',
    year: '2026',
    description: 'A language-model agent trained to choose structured reveal and flag moves in Minesweeper.',
    outcome: 'The training pipeline generates expert game traces, then applies SFT and GRPO experiments.',
    tags: ['Python', 'SFT', 'GRPO', 'LoRA'],
    github: 'https://github.com/RydertHuGlIfE/IITD_Feb26_RL_MINESWEEPER',
    preview: 'minesweeper',
  },
  {
    number: '05',
    title: 'J.A.R.V.I.S.',
    year: '2026',
    description: 'A voice-driven desktop assistant with a custom HUD and language-model-backed tools.',
    outcome: 'Connects speech recognition, Groq models, Piper speech, and desktop actions in one workflow.',
    tags: ['Python', 'Groq', 'Piper TTS', 'Linux'],
    github: 'https://github.com/RydertHuGlIfE/J.A.R.V.I.S',
   
  },
  {
    number: '06',
    title: 'Jam_bo',
    year: '2026',
    description: 'A shared listening room that keeps playback position and track queues in sync.',
    outcome: 'WebSocket room state and heartbeat pulses synchronize concurrent listeners.',
    tags: ['React', 'FastAPI', 'WebSockets', 'yt-dlp'],
    github: 'https://github.com/RydertHuGlIfE/Jam_bo',
  },
];

export default function ProjectsView() {
  const [expandedProject, setExpandedProject] = useState('01');

  return (
    <section className="projects-page">
      <header className="section-page-heading projects-heading">
        <div>
          <p className="section-eyebrow"><span>02</span> WORK INDEX / UPDATED 2026</p>
          <h1>Things I <span>built.</span></h1>
          <p>Open an entry for the outcome and repository. Stack is listed inline.</p>
        </div>
        <a className="section-header-link" href="https://github.com/RydertHuGlIfE?tab=repositories" target="_blank" rel="noreferrer"><Github size={16} /> ALL REPOSITORIES <ExternalLink size={13} /></a>
      </header>

      <div className="projects-ledger">
        <div className="project-column-head"><span>PREVIEW</span><span>NO.</span><span>PROJECT / PROBLEM</span><span>YEAR</span><span>STACK</span></div>
        {projects.map((project) => {
          const isExpanded = expandedProject === project.number;
          return <article className={`project-entry${isExpanded ? ' is-expanded' : ''}`} key={project.number}>
            <div className={`project-preview${project.preview ? ` project-preview--${project.preview}` : ''}`}>
              {project.image ? <img src={project.image} alt={project.imageAlt} loading="lazy" /> : project.preview === 'minesweeper' ? <div className="minesweeper-preview" aria-label="Minesweeper agent board preview">{['1','2','1','','1','*','','','1','1','','1','','2','2','1','', '1','0','1','1','*','1','', '1','1','1','0','1','1','1',''].map((cell, cellIndex) => <span className={cell === '*' ? 'is-mine' : cell ? 'is-open' : ''} key={cellIndex}>{cell}</span>)}</div> : <div className="spectrum-preview" aria-label="Log mel spectrogram preview">{Array.from({ length: 96 }, (_, bar) => <i key={bar} style={{ '--bar': `${18 + ((bar * 31 + bar * bar * 7) % 77)}%` }} />)}</div>}
              <span className="preview-caption">{project.preview === 'spectrum' ? '128 MEL / AUDIO' : project.preview === 'minesweeper' ? 'BOARD / AGENT' : 'REPOSITORY IMAGE'}</span>
            </div>
            <span className="project-number">{project.number}</span>
            <div className="project-content">
              <button className="project-toggle" type="button" aria-expanded={isExpanded} onClick={() => setExpandedProject(isExpanded ? '' : project.number)}><span>{project.title}</span><span>{isExpanded ? '−' : '+'}</span></button>
              <p className="project-description">{project.description}</p>
              {isExpanded && <div className="project-expanded"><p>{project.outcome}</p>{project.notice && <p className="project-notice">{project.notice}</p>}<a href={project.github} target="_blank" rel="noreferrer">OPEN REPOSITORY <ExternalLink size={13} /></a></div>}
            </div>
            <span className="project-year">{project.year}</span>
            <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </article>;
        })}
      </div>
      <footer className="projects-footnote"><span>06 ENTRIES</span><span>OPEN SOURCE / GITHUB</span></footer>
    </section>
  );
}