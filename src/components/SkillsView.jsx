import React, { useState } from 'react';
import { Bot, Brain, Braces, Code2, Cpu, Database, GitBranch, Globe2, Layers3, Network, Server, Terminal, Workflow, Wrench } from 'lucide-react';

const skillNodes = [
  { id: 'python', label: 'Python', category: 'languages', x: 500, y: 186, icon: Terminal, note: 'Primary language used across AI, backend, and automation projects.' },
  { id: 'cpp', label: 'C++', category: 'languages', x: 350, y: 286, icon: Cpu, note: 'Proficient programming language listed on the resume.' },
  { id: 'html', label: 'HTML', category: 'languages', x: 650, y: 286, icon: Code2, note: 'Proficient markup language listed on the resume.' },
  { id: 'flask', label: 'Flask', category: 'frameworks', x: 350, y: 452, icon: Server, note: 'Python web framework.' },
  { id: 'fastapi', label: 'FastAPI', category: 'frameworks', x: 650, y: 452, icon: Workflow, note: 'Python API framework.' },
  { id: 'mongodb', label: 'MongoDB', category: 'data', x: 235, y: 490, icon: Database, note: 'Document database.' },
  { id: 'sqlite', label: 'SQLite', category: 'data', x: 765, y: 490, icon: Database, note: 'Lightweight relational database.' },
  { id: 'git', label: 'Git', category: 'tools', x: 250, y: 260, icon: GitBranch, note: 'Version control.' },
  { id: 'github', label: 'GitHub', category: 'tools', x: 750, y: 260, icon: Globe2, note: 'Code hosting and collaboration.' },
  { id: 'linux', label: 'Linux', category: 'tools', x: 500, y: 560, icon: Terminal, note: 'Development and automation environment.' },
  { id: 'ml', label: 'Machine Learning', category: 'ai', x: 500, y: 92, icon: Brain, note: 'Machine learning and reinforcement learning project work.' },
  { id: 'oop', label: 'OOP', category: 'fundamentals', x: 155, y: 370, icon: Braces, note: 'Object-oriented programming.' },
  { id: 'rest', label: 'REST APIs', category: 'backend', x: 845, y: 370, icon: Network, note: 'API design and backend integration.' },
  { id: 'automation', label: 'Automation', category: 'fundamentals', x: 265, y: 612, icon: Wrench, note: 'Workflow and desktop automation.' },
  { id: 'structures', label: 'Data Structures', category: 'fundamentals', x: 735, y: 612, icon: Layers3, note: 'Core computer science fundamentals.' },
  { id: 'systems', label: 'System Design', category: 'fundamentals', x: 500, y: 690, icon: Network, note: 'Designing backend and real-time systems.' },
];

const links = [
  ['python', 'ml'], ['python', 'cpp'], ['python', 'html'], ['python', 'flask'], ['python', 'fastapi'],
  ['python', 'linux'], ['cpp', 'oop'], ['cpp', 'structures'], ['html', 'rest'], ['flask', 'mongodb'],
  ['fastapi', 'sqlite'], ['fastapi', 'rest'], ['git', 'linux'], ['github', 'git'], ['linux', 'automation'],
  ['automation', 'systems'], ['structures', 'systems'], ['rest', 'systems'], ['flask', 'systems'],
];

const categories = [
  { id: 'all', label: 'All skills', color: '#e8e3d8' },
  { id: 'languages', label: 'Languages', color: '#efb36b' },
  { id: 'ai', label: 'AI / ML', color: '#c18cf0' },
  { id: 'backend', label: 'Backend', color: '#74c7c0' },
  { id: 'frameworks', label: 'Frameworks', color: '#e58e79' },
  { id: 'data', label: 'Databases', color: '#b4c97b' },
  { id: 'tools', label: 'Tools', color: '#69a9e8' },
  { id: 'fundamentals', label: 'Fundamentals', color: '#92bf91' },
];

const projectToolchains = [
  { title: 'J.A.R.V.I.S.', type: 'AI DESKTOP ASSISTANT', color: '#e58e79', tools: ['Groq Cloud API', 'LLaMA 3.3-70b', 'Piper TTS', 'SpeechRecognition', 'Tkinter', 'PyAutoGUI', 'BeautifulSoup', 'Threading'] },
  { title: 'RL Minesweeper', type: 'REINFORCEMENT LEARNING', color: '#c18cf0', tools: ['SFT', 'GRPO', 'scikit-learn', 'NumPy'] },
  { title: 'Jam_bo + Kitaab Gyaani', type: 'BACKEND & AUTOMATION', color: '#74c7c0', tools: ['Real-time data handling', 'REST APIs', 'Python automation', 'Accessible UX'] },
];

const skillById = Object.fromEntries(skillNodes.map((skill) => [skill.id, skill]));

export default function SkillsView() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('python');
  const selected = skillById[selectedSkill];
  const related = new Set(links.flatMap(([from, to]) => from === selectedSkill ? [to] : to === selectedSkill ? [from] : []));
  const filteredSkills = skillNodes.filter((skill) => activeCategory === 'all' || skill.category === activeCategory);
  const visibleSkills = new Set(filteredSkills.map((skill) => skill.id));

  return (
    <div className="skills-view">
      <header className="skills-heading">
        <div>
          <p className="skills-eyebrow"><span>03</span> CAPABILITY MAP / RESUME VERIFIED</p>
          <h1>My <span>skill tree</span><b>.</b></h1>
          <p className="skills-subtitle">The tools, ideas, and foundations behind the things I build.</p>
        </div>
        <div className="skills-count"><strong>16</strong><span>CORE SKILLS<br />MAPPED</span></div>
      </header>

      <div className="skill-filters" role="group" aria-label="Filter skills by category">
        {categories.map((category) => (
          <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)} aria-pressed={activeCategory === category.id} className={`skill-filter${activeCategory === category.id ? ' is-active' : ''}`}>
            <i style={{ '--filter-color': category.color }} />{category.label}
          </button>
        ))}
      </div>

      <section className="skill-map" aria-label="Interactive map of resume skills">
        <div className="skill-map__meta"><span><span className="map-live-dot" /> SYSTEMS / CONNECTED</span><span>SELECT A NODE TO INSPECT</span></div>
        <svg className="skill-map__svg" viewBox="0 0 1000 760" role="group" aria-label="Connected skill nodes">
          <circle className="map-orbit map-orbit--outer" cx="500" cy="386" r="326" />
          <circle className="map-orbit map-orbit--inner" cx="500" cy="386" r="213" />
          {links.map(([from, to]) => {
            const start = skillById[from];
            const end = skillById[to];
            const isRelated = from === selectedSkill || to === selectedSkill || related.has(from) && related.has(to);
            return <line key={`${from}-${to}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} className={`skill-link${isRelated ? ' is-related' : ''}`} style={{ opacity: visibleSkills.has(from) && visibleSkills.has(to) ? (isRelated ? 0.9 : activeCategory === 'all' ? 0.24 : 0.12) : 0.04 }} />;
          })}
          <g className="skill-center">
            <circle cx="500" cy="386" r="67" />
            <text x="500" y="381" textAnchor="middle">VARUN'S</text>
            <text x="500" y="402" textAnchor="middle">STACK</text>
            <circle className="skill-center__orbit" cx="500" cy="386" r="81" />
          </g>
          {skillNodes.map((skill) => {
            const Icon = skill.icon;
            const category = categories.find((item) => item.id === skill.category);
            const isDimmed = activeCategory !== 'all' && skill.category !== activeCategory;
            const isSelected = skill.id === selectedSkill;
            return (
              <g key={skill.id} role="button" tabIndex="0" aria-label={`${skill.label}: ${skill.note}`} aria-pressed={isSelected} onClick={() => setSelectedSkill(skill.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedSkill(skill.id); } }} className={`skill-node${isDimmed ? ' is-dimmed' : ''}${isSelected ? ' is-selected' : ''}`} style={{ '--node-color': category.color }}>
                <circle className="skill-node__halo" cx={skill.x} cy={skill.y} r="31" />
                <circle className="skill-node__ring" cx={skill.x} cy={skill.y} r="24" />
                <Icon x={skill.x - 9} y={skill.y - 9} size={18} strokeWidth={1.8} />
                <text x={skill.x} y={skill.y + 43} textAnchor="middle">{skill.label}</text>
              </g>
            );
          })}
        </svg>
        <div className="skill-mobile-list">
          {categories.filter((category) => category.id !== 'all').map((category) => {
            const members = skillNodes.filter((skill) => skill.category === category.id);
            if (!members.length) return null;
            return <section className="mobile-skill-group" key={category.id}><h3><i style={{ '--filter-color': category.color }} />{category.label}</h3><div>{members.map((skill) => { const Icon = skill.icon; return <button key={skill.id} type="button" aria-pressed={selectedSkill === skill.id} onClick={() => setSelectedSkill(skill.id)}><Icon size={15} />{skill.label}</button>; })}</div></section>;
          })}
        </div>
        <div className="skill-inspector"><span className="inspector-icon" style={{ '--node-color': categories.find((item) => item.id === selected.category).color }}><selected.icon size={17} /></span><div><span className="inspector-label">SELECTED NODE / {selected.category.toUpperCase()}</span><strong>{selected.label}</strong><p>{selected.note}</p></div><span className="inspector-coordinate">{String(selected.x).padStart(3, '0')} : {String(selected.y).padStart(3, '0')}</span></div>
      </section>

      <section className="toolchains">
        <div className="toolchains-heading"><div><p className="skills-eyebrow"><span>04</span> FROM THE PROJECTS</p><h2>Tools in the wild<span>.</span></h2></div><p>Specific technologies applied across the projects on my resume.</p></div>
        <div className="toolchain-list">{projectToolchains.map((group) => <article className="toolchain-row" key={group.title} style={{ '--tool-color': group.color }}><div className="toolchain-name"><span>{group.type}</span><h3>{group.title}</h3></div><div className="toolchain-tags">{group.tools.map((tool) => <span key={tool}>{tool}</span>)}</div><Bot className="toolchain-icon" size={18} /></article>)}</div>
      </section>
    </div>
  );
}