import React from 'react';

export default function ContactView() {
  return (
    <section className="contact-page">
      <header className="section-page-heading contact-heading">
        <div>
          <p className="section-eyebrow"><span>06</span> CONTACT / DIRECT CHANNEL</p>
          <h1>Write me <span>a line.</span></h1>
          <p>For a project, a question, or a useful introduction.</p>
        </div>
        <span className="contact-status">MEERUT, IN / UTC +05:30</span>
      </header>

      <div className="contact-direct">
        <span className="contact-overline">PRIMARY CHANNEL</span>
        <a className="contact-email-link" href="mailto:varunchauhan2001dma@gmail.com">varunchauhan2001dma@gmail.com <span aria-hidden="true">↗</span></a>
        <div className="contact-secondary">
          <a href="tel:+919412510997"><span>PHONE</span>+91 94125 10997</a>
          <a href="https://github.com/RydertHuGlIfE" target="_blank" rel="noreferrer"><span>GITHUB</span>RydertHuGlIfE ↗</a>
          <a href="https://www.linkedin.com/in/varun-chauhan-174107288/" target="_blank" rel="noreferrer"><span>LINKEDIN</span>Varun Chauhan ↗</a>
        </div>
      </div>
      <footer className="contact-footer-line"><span>VARUN CHAUHAN</span><span>SOFTWARE / AI / SYSTEMS</span></footer>
    </section>
  );
}