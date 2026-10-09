import React, { useEffect } from 'react';

export default function ResumeModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resumeUrl = '/resume.pdf';
  const filename = 'varun_chauhan_resume.pdf';

  return (
    <div className="resume-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="resume-modal" role="dialog" aria-modal="true" aria-labelledby="resume-title">
        <header className="resume-modal-header">
          <div><p className="section-eyebrow">DOCUMENT / PDF</p><h2 className="resume-modal-title" id="resume-title">Varun Chauhan / Resume</h2></div>
          <div className="resume-modal-actions"><a href={resumeUrl} target="_blank" rel="noreferrer">OPEN PDF ↗</a><a href={resumeUrl} download={filename}>DOWNLOAD ↓</a><button type="button" onClick={onClose} aria-label="Close resume">CLOSE / ESC</button></div>
        </header>
        <object data={resumeUrl} type="application/pdf" aria-label="Varun Chauhan resume PDF">
          <div className="resume-fallback"><p>PDF preview is unavailable in this browser.</p><a href={resumeUrl} download={filename}>DOWNLOAD RESUME</a></div>
        </object>
      </section>
    </div>
  );
}