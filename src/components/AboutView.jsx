import React from 'react';

const experience = [
  { period: 'JAN 2026 — PRESENT', role: 'Software Developer Intern', organization: 'HustleGrad', location: 'Meerut', detail: 'Backend features, debugging, and workflow automation on a product team.' },
  { period: 'JAN 2026 — PRESENT', role: 'Technical Member', organization: 'Geekroom', location: 'Modinagar', detail: 'Technical workshops, hackathons, and community development projects.' },
  { period: 'NOV 2025 — PRESENT', role: 'Technical Member', organization: 'Computer Society of India', location: 'Modinagar', detail: 'Peer learning, technical initiatives, and coding events.' },
];

export default function AboutView() {
  return (
    <section className="about-page">
      <header className="section-page-heading about-heading">
        <div>
          <p className="section-eyebrow"><span>01</span> PROFILE / 2026</p>
          <h1>Varun Chauhan<span>.</span></h1>
        </div>
        <span className="about-location">MEERUT, INDIA / IST</span>
      </header>

      <div className="about-intro">
        <div className="about-monogram" aria-hidden="true"><span>VC</span><i>CS / SRMIST</i></div>
        <div className="about-intro-copy">
          <p className="about-lede">I build things that helps,<br />then make them blazing.</p>
          <p>I'm a computer science student at SRMIST and a Software Developer Intern at HustleGrad. I spend most of my time in Python, AI, and systems work.</p>
          <p>Recent work includes a voice-driven desktop assistant, a Minesweeper-playing language model, and software for shared, real-time media.</p>
          <a className="about-github-link" href="https://github.com/RydertHuGlIfE" target="_blank" rel="noreferrer">GITHUB / RYDERTHUGLIFE <span>↗</span></a>
        </div>
      </div>

      <div className="about-details-grid">
        <section className="about-timeline-section">
          <header className="about-section-title"><span>EXPERIENCE / COMMUNITY</span><span>03 ENTRIES</span></header>
          <div className="about-timeline">
            {experience.map((item, index) => (
              <article className="about-timeline-entry" key={item.organization}>
                <span className="timeline-index">0{index + 1}</span>
                <div className="timeline-content"><span className="timeline-period">{item.period}</span><h2>{item.role}</h2><div className="timeline-org">{item.organization}<span>/</span>{item.location}</div><p>{item.detail}</p></div>
              </article>
            ))}
          </div>
        </section>

        <aside className="about-side-column">
          <section className="about-education">
            <header className="about-section-title"><span>EDUCATION</span><span>01 ENTRY</span></header>
            <div className="education-entry"><span>2024 — PRESENT</span><h2>B.Tech / Computer Science</h2><p>SRM Institute of Science and Technology</p><small>Modinagar, India</small></div>
          </section>
          <section className="about-interests">
            <header className="about-section-title"><span>AREAS OF WORK</span></header>
            <ul><li><span>01</span>AI agents and machine learning</li><li><span>02</span>Backend and real-time systems</li><li><span>03</span>Linux tools and automation</li><li><span>04</span>Accessible learning software</li></ul>
          </section>
        </aside>
      </div>

      <footer className="about-footer-line"><span>“Ship code. Break things. Learn faster.”</span><a href="mailto:varunchauhan2001dma@gmail.com">CONTACT <span>↗</span></a></footer>
    </section>
  );
}