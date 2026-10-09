import React, { useMemo, useState } from 'react';

const GROUPS = [
  { n: '01', title: 'Languages', color: '#c9ed76', items: [['Python', 'Primary', [0, 1, 2, 3, 4, 5]], ['C++', 'Proficient', []], ['HTML', 'Proficient', []]] },
  { n: '02', title: 'Frameworks', color: '#ff896d', items: [['Flask', 'Python / web', [1, 2]], ['FastAPI', 'Python / API', [5]]] },
  { n: '03', title: 'Data', color: '#75aef7', items: [['MongoDB', 'Document store', []], ['SQLite', 'Relational', []]] },
  { n: '04', title: 'Tools', color: '#f2c25b', items: [['Git', 'Version control', [0, 1, 2, 3, 4, 5]], ['GitHub', 'Repository hosting', [0, 1, 2, 3, 4, 5]], ['Linux', 'Development environment', []]] },
  { n: '05', title: 'Foundations', color: '#b79cf5', items: [['Machine learning', 'Models / evaluation', [0, 1, 3]], ['Object-oriented programming', 'Design', []], ['REST APIs', 'Backend', [2, 5]], ['Automation', 'Workflows', [4]], ['Data structures', 'Computer science', []], ['System design', 'Architecture', [2, 5]]] },
];

const PROJECTS = [
  ['Audio Genre Classification', 'TensorFlow · Librosa · CNN'],
  ['CardioFusionX', 'PyTorch · ECG · Flask'],
  ['Kitaab Gyaani', 'React · Flask · Gemini · Socket.IO'],
  ['Minesweeper Playing Agent', 'SFT · GRPO · LoRA'],
  ['J.A.R.V.I.S.', 'Groq · SpeechRecognition · Piper TTS'],
  ['Jam_bo', 'FastAPI · WebSockets · yt-dlp'],
];

// layout
const W = 1000, NODE_H = 40, ROW = 50, TOP = 34;
const ROOT = { x: 82, r: 46 };
const CAT = { x: 236, w: 190, h: 60 };
const SKILL = { x: 574, w: 392, h: NODE_H };

function buildLayout() {
  let row = 0;
  const groups = GROUPS.map((g, gi) => {
    const items = g.items.map(([name, ctx, uses]) => ({ name, ctx, uses, y: TOP + row++ * ROW + NODE_H / 2 }));
    const cy = items.reduce((a, i) => a + i.y, 0) / items.length;
    return { ...g, gi, items, cy };
  });
  const H = TOP * 2 + row * ROW - (ROW - NODE_H);
  return { groups, H, rootY: H / 2 };
}

const curve = (x1, y1, x2, y2) => {
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
};

const CSS = `
.st-wrap{--lime:#c9ed76;--coral:#ff896d;color:#e9e8de;font-family:'IBM Plex Mono','JetBrains Mono',monospace}
.st-panel{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:16px;min-height:78px;padding:14px 18px;border:1px solid rgba(241,238,229,.16);background:rgba(15,19,17,.78);margin-bottom:14px;position:relative}
.st-panel::before{content:'';position:absolute;top:-1px;left:16px;width:46px;height:2px;background:var(--c,#c9ed76);transition:background .2s}
.st-panel-icon{width:38px;height:38px;display:grid;place-items:center;border:1px solid color-mix(in srgb,var(--c,#c9ed76),transparent 40%);color:var(--c,#c9ed76);font:11px 'IBM Plex Mono',monospace}
.st-panel small{display:block;color:#7f877b;font-size:9px;letter-spacing:.04em;margin-bottom:3px}
.st-panel strong{display:block;font:500 17px 'Space Grotesk',sans-serif;color:#f2f0e6}
.st-panel p{margin:3px 0 0;color:#a3aa9d;font-size:10px;line-height:1.5}
.st-panel-count{text-align:right;color:#7f877b;font-size:9px;white-space:nowrap}
.st-panel-count b{display:block;color:var(--c,#c9ed76);font:600 28px 'Space Grotesk',sans-serif;line-height:1}
.st-scroll{overflow-x:auto;border:1px solid rgba(241,238,229,.15);background-color:rgba(18,22,20,.82);background-image:linear-gradient(rgba(226,233,218,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(226,233,218,.022) 1px,transparent 1px);background-size:36px 36px;scrollbar-width:thin}
.st-svg{display:block;width:100%;min-width:760px;height:auto}
.st-link{fill:none;stroke:var(--c);stroke-opacity:.22;stroke-width:1.3;stroke-dasharray:3 6;transition:stroke-opacity .25s,stroke-width .25s}
.st-link.on{stroke-opacity:.95;stroke-width:2;stroke-dasharray:7 7;animation:st-flow .9s linear infinite;filter:drop-shadow(0 0 4px var(--c))}
.st-link.dim{stroke-opacity:.07}
@keyframes st-flow{to{stroke-dashoffset:-28}}
.st-node{cursor:pointer;outline:none;animation:st-in .5s cubic-bezier(.16,.78,.22,1) both;transition:opacity .25s}
.st-node.dim{opacity:.3}
@keyframes st-in{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
.st-box{fill:#141916;stroke:color-mix(in srgb,var(--c),transparent 58%);stroke-width:1;transition:fill .2s,stroke .2s}
.st-node:hover .st-box,.st-node:focus-visible .st-box,.st-node.on .st-box{stroke:var(--c);fill:color-mix(in srgb,var(--c),#141916 88%)}
.st-node.lock .st-box{stroke-width:2}
.st-tick{stroke:var(--c);stroke-width:2;fill:none}
.st-name{fill:#e6e5da;font:500 12px 'IBM Plex Mono',monospace}
.st-ctx{fill:#8a9285;font:9px 'IBM Plex Mono',monospace}
.st-num{fill:var(--c);font:9px 'IBM Plex Mono',monospace}
.st-cat-title{fill:#f2f0e6;font:500 15px 'Space Grotesk',sans-serif}
.st-pip{fill:var(--c)}
.st-root-ring{fill:none;stroke:#c9ed76;stroke-opacity:.5;stroke-dasharray:3 7;transform-box:fill-box;transform-origin:center;animation:st-spin 40s linear infinite}
@keyframes st-spin{to{transform:rotate(360deg)}}
.st-root-core{fill:#1b221c;stroke:#c9ed76;stroke-width:1.5}
.st-root-text{fill:#c9ed76;font:600 16px 'Space Grotesk',sans-serif}
.st-root-sub{fill:#8a9285;font:8px 'IBM Plex Mono',monospace}
.st-col-label{fill:#6c746a;font:8px 'IBM Plex Mono',monospace;letter-spacing:.06em}
.st-proj{margin-top:34px}
.st-proj-head{display:flex;justify-content:space-between;align-items:end;gap:20px;padding-bottom:14px}
.st-proj-head h2{margin:0;font:500 24px 'Space Grotesk',sans-serif;color:#f0eee4}
.st-proj-head span{color:#7f877b;font-size:9px}
.st-proj-row{display:grid;grid-template-columns:36px minmax(0,1fr) minmax(0,1.3fr) 70px;align-items:center;gap:14px;padding:13px 10px;border-top:1px solid rgba(241,238,229,.13);color:#8f968a;transition:background .2s,color .2s,opacity .2s}
.st-proj-row:last-child{border-bottom:1px solid rgba(241,238,229,.13)}
.st-proj-row span{font-size:9px;color:#6f786d}
.st-proj-row strong{font:500 13px 'Space Grotesk',sans-serif;color:#d8d8cd}
.st-proj-row p{margin:0;font-size:10px}
.st-proj-row em{font-style:normal;font-size:8px;text-align:right;color:transparent}
.st-proj-row.faded{opacity:.35}
.st-proj-row.lit{background:color-mix(in srgb,var(--c),transparent 91%);color:#d4d9cb}
.st-proj-row.lit em{color:var(--c)}
.st-hint{margin-top:10px;color:#6f786d;font-size:9px}
@media (max-width:640px){
  .st-panel{grid-template-columns:auto 1fr;}
  .st-panel-count{display:none}
  .st-proj-row{grid-template-columns:28px 1fr;}
  .st-proj-row p,.st-proj-row em{grid-column:2;text-align:left}
}
@media (prefers-reduced-motion:reduce){.st-link.on,.st-root-ring,.st-node{animation:none}}
`;

export default function SkillsInventory() {
  const L = useMemo(buildLayout, []);
  const [hover, setHover] = useState(null);
  const [lock, setLock] = useState(null);
  const cur = hover || lock;

  const curGroup = cur ? (cur.type === 'g' ? cur.gi : cur.gi) : null;
  const curSkill = cur && cur.type === 's' ? cur.name : null;
  const group = curGroup !== null ? L.groups[curGroup] : null;
  const skill = curSkill ? group.items.find((i) => i.name === curSkill) : null;

  const linked = useMemo(() => {
    if (skill) return skill.uses;
    if (group) return [...new Set(group.items.flatMap((i) => i.uses))];
    return null;
  }, [skill, group]);

  const accent = group ? group.color : '#c9ed76';
  const bind = (target) => ({
    tabIndex: 0,
    role: 'button',
    onMouseEnter: () => setHover(target),
    onMouseLeave: () => setHover(null),
    onFocus: () => setHover(target),
    onBlur: () => setHover(null),
    onClick: () => setLock((p) => (p && p.type === target.type && p.gi === target.gi && p.name === target.name ? null : target)),
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } },
  });
  const isLock = (t) => lock && lock.type === t.type && lock.gi === t.gi && lock.name === t.name;

  return (
    <section className="skills-view st-wrap">
      <style>{CSS}</style>

      <header className="section-page-heading skills-heading">
        <div>
          <p className="section-eyebrow"><span>03</span> SKILL TREE / RESUME VERIFIED</p>
          <h1>Tools I <span>use.</span></h1>
          <p>Hover a branch to trace it. Click to lock it.</p>
        </div>
        <span className="skills-count"><strong>16</strong> NODES</span>
      </header>

      <div className="st-panel" style={{ '--c': accent }}>
        <div className="st-panel-icon">{group ? group.n : '00'}</div>
        <div>
          <small>{skill ? `${group.title.toUpperCase()} / SELECTED NODE` : group ? 'BRANCH SELECTED' : 'ROOT / VARUN CHAUHAN'}</small>
          <strong>{skill ? skill.name : group ? group.title : 'Select a node'}</strong>
          <p>
            {skill
              ? `${skill.ctx}. ${skill.uses.length ? `Appears in ${skill.uses.length} listed project stack${skill.uses.length > 1 ? 's' : ''}.` : 'No project stack lists this directly.'}`
              : group
                ? `${group.items.length} nodes in this branch, ${linked.length} linked project${linked.length === 1 ? '' : 's'}.`
                : '5 branches, 16 skills. Linked projects light up below.'}
          </p>
        </div>
        <div className="st-panel-count"><b>{linked ? String(linked.length).padStart(2, '0') : '--'}</b>LINKED PROJECTS</div>
      </div>

      <div className="st-scroll">
        <svg className="st-svg" viewBox={`0 0 ${W} ${L.H}`} role="img" aria-label="Skill tree">
          <text className="st-col-label" x={ROOT.x - 20} y={16}>ROOT</text>
          <text className="st-col-label" x={CAT.x} y={16}>BRANCH</text>
          <text className="st-col-label" x={SKILL.x} y={16}>NODE</text>

          {/* links */}
          {L.groups.map((g) => {
            const gOn = curGroup === g.gi;
            const dimG = curGroup !== null && !gOn;
            return (
              <g key={`l${g.gi}`} style={{ '--c': g.color }}>
                <path className={`st-link ${gOn ? 'on' : ''} ${dimG ? 'dim' : ''}`} d={curve(ROOT.x + ROOT.r, L.rootY, CAT.x, g.cy)} />
                {g.items.map((it) => {
                  const on = gOn && (!curSkill || curSkill === it.name);
                  const dim = curGroup !== null && !on;
                  return <path key={it.name} className={`st-link ${on ? 'on' : ''} ${dim ? 'dim' : ''}`} d={curve(CAT.x + CAT.w, g.cy, SKILL.x, it.y)} />;
                })}
              </g>
            );
          })}

          {/* root */}
          <g>
            <circle className="st-root-ring" cx={ROOT.x} cy={L.rootY} r={ROOT.r + 9} />
            <circle className="st-root-core" cx={ROOT.x} cy={L.rootY} r={ROOT.r} />
            <text className="st-root-text" x={ROOT.x} y={L.rootY + 2} textAnchor="middle">VC</text>
            <text className="st-root-sub" x={ROOT.x} y={L.rootY + 17} textAnchor="middle">CORE</text>
            
          </g>

          {/* categories */}
          {L.groups.map((g) => {
            const t = { type: 'g', gi: g.gi };
            const on = curGroup === g.gi;
            const dim = curGroup !== null && !on;
            return (
              <g key={`c${g.gi}`} className={`cursor-target st-node ${on ? 'on' : ''} ${dim ? 'dim' : ''} ${isLock(t) ? 'lock' : ''}`} style={{ '--c': g.color, animationDelay: `${g.gi * 70}ms` }} {...bind(t)}>
  <rect className="st-box" x={CAT.x} y={g.cy - CAT.h / 2} width={CAT.w} height={CAT.h} />
  <path className="st-tick" d={`M${CAT.x} ${g.cy - CAT.h / 2 + 10} V${g.cy - CAT.h / 2} H${CAT.x + 10}`} />
  <path className="st-tick" d={`M${CAT.x + CAT.w} ${g.cy + CAT.h / 2 - 10} V${g.cy + CAT.h / 2} H${CAT.x + CAT.w - 10}`} />
  <text className="st-num" x={CAT.x + 14} y={g.cy - 6}>{g.n}</text>
  <text className="st-cat-title" x={CAT.x + 14} y={g.cy + 14}>{g.title}</text>
  {g.items.map((_, i) => <rect key={i} className="st-pip" x={CAT.x + CAT.w - 14 - i * 7} y={g.cy - 4} width={4} height={8} opacity={0.85} />)}
</g>
            );
          })}

          {/* skills */}
          {L.groups.map((g) => g.items.map((it, i) => {
            const t = { type: 's', gi: g.gi, name: it.name };
            const on = curGroup === g.gi && (!curSkill || curSkill === it.name);
            const dim = curGroup !== null && !on;
            return (
             <g key={it.name} className={`cursor-target st-node ${on ? 'on' : ''} ${dim ? 'dim' : ''} ${isLock(t) ? 'lock' : ''}`} style={{ '--c': g.color, animationDelay: `${260 + g.gi * 70 + i * 40}ms` }} {...bind(t)}>
  <rect className="st-box" x={SKILL.x} y={it.y - SKILL.h / 2} width={SKILL.w} height={SKILL.h} />
  <path className="st-tick" d={`M${SKILL.x} ${it.y - SKILL.h / 2 + 8} V${it.y - SKILL.h / 2} H${SKILL.x + 8}`} />
  <circle cx={SKILL.x} cy={it.y} r={4} fill={g.color} />
  <text className="st-name" x={SKILL.x + 18} y={it.y + 4}>{it.name}</text>
  <text className="st-ctx" x={SKILL.x + SKILL.w - 14} y={it.y + 3} textAnchor="end">{it.ctx.toUpperCase()}</text>
</g>
            );
          }))}
        </svg>
      </div>
      <p className="st-hint">TAB / ENTER WORKS TOO. LINKS COME FROM THE PROJECT STACKS BELOW.</p>

      <section className="st-proj">
        <header className="st-proj-head">
          <div>
            <p className="section-eyebrow"><span>04</span> PROJECT CONTEXT</p>
            <h2>In use, not just listed.</h2>
          </div>
          <span>REPOSITORY STACKS</span>
        </header>
        <div style={{ '--c': accent }}>
          {PROJECTS.map(([name, stack], i) => {
            const lit = linked && linked.includes(i);
            const faded = linked && !lit;
            return (
              <div key={name} className={`st-proj-row ${lit ? 'lit' : ''} ${faded ? 'faded' : ''}`}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{name}</strong>
                <p>{stack}</p>
                <em>LINKED</em>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}