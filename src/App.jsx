import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import TargetCursor from './components/TargetCursor';
import HomeView from './components/HomeInstrument';
import AboutView from './components/AboutView';
import ProjectsView from './components/ProjectsView';
import SkillsView from './components/SkillsInventory';
import TerminalView from './components/TerminalView';
import ContactView from './components/ContactView';
import ResumeModal from './components/ResumeModal';

// ── Blue ambient orbs — portaled to body to bypass .app-shell stacking context ──
function BlueHaze() {
  const orb1 = useRef(null);
  const orb2 = useRef(null);
  const orb3 = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Orb 1 — top-left, large slow drift
    gsap.to(orb1.current, {
      x: 60, y: -40, scale: 1.12,
      duration: 18, ease: 'sine.inOut',
      yoyo: true, repeat: -1,
    });

    // Orb 2 — bottom-right, cyan, counter drift
    gsap.to(orb2.current, {
      x: -50, y: 50, scale: 1.08,
      duration: 22, ease: 'sine.inOut',
      yoyo: true, repeat: -1,
    });

    // Orb 3 — centre, slow breathing pulse
    gsap.to(orb3.current, {
      scale: 1.35, opacity: 0.55,
      duration: 12, ease: 'sine.inOut',
      yoyo: true, repeat: -1,
    });
  }, []);

  return createPortal(
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* Top-left orb */}
      <div ref={orb1} style={{
        position: 'absolute', width: '800px', height: '700px',
        top: '-200px', left: '-160px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(96,165,250,0.35) 0%, transparent 65%)',
        filter: 'blur(60px)', willChange: 'transform',
      }} />
      {/* Bottom-right orb */}
      <div ref={orb2} style={{
        position: 'absolute', width: '700px', height: '650px',
        bottom: '-160px', right: '-130px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.28) 0%, transparent 65%)',
        filter: 'blur(60px)', willChange: 'transform',
      }} />
      {/* Centre breathing orb */}
      <div ref={orb3} style={{
        position: 'absolute', width: '520px', height: '420px',
        top: '28%', left: '38%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 68%)',
        filter: 'blur(80px)', willChange: 'transform, opacity', opacity: 0.6,
      }} />
    </div>,
    document.body
  );
}


// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const pageRef = useRef(null);

  // Cursor-stuck fix: dispatch a synthetic mouseleave so TargetCursor can
  // cleanly release whatever target it was tracking before the page unmounts.
  const handleTabChange = (tab) => {
    window.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    setActiveTab(tab);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== 'Escape' || isResumeOpen) return;
      if (activeTab !== 'home') handleTabChange('home');
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeTab, isResumeOpen]);

  useLayoutEffect(() => {
    if (!pageRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(pageRef.current,
      { clipPath: 'inset(8% 12% 8% 12% round 10px)', opacity: 0.72 },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', opacity: 1, duration: 0.52, ease: 'power3.out', clearProps: 'clipPath' }
    );
  }, [activeTab]);

  return (
    <div className={`app-shell min-h-screen flex relative overflow-x-hidden${activeTab === 'terminal' ? ' app-shell--terminal' : ''}`}>
      <BlueHaze />

      {/* key=activeTab forces full remount on navigation → clears stuck cursor state */}
      {activeTab !== 'terminal' && (
        <TargetCursor
          key={activeTab}
          targetSelector=".cursor-target"
          spinDuration={3.5}
          hideDefaultCursor
        />
      )}

      <main className={`portfolio-main flex-1${activeTab === 'terminal' ? ' portfolio-main--terminal' : ''}`}>
        <div className="w-full max-w-7xl mx-auto">
          <div ref={pageRef} key={activeTab} className={`route-transition route-transition--${activeTab}`}>
          {activeTab !== 'home' && activeTab !== 'terminal' && (
            <div className="route-wheel-bar">
              <button type="button" className="route-wheel-back cursor-target" onClick={() => handleTabChange('home')}>
                <span className="route-wheel-mark">VC</span>
                <span><strong>BACK TO NAV</strong><small>RETURN TO THE WHEEL</small></span>
              </button>
              <button type="button" className="route-resume-link cursor-target" onClick={() => setIsResumeOpen(true)}>RESUME PDF</button>
            </div>
          )}
          {activeTab === 'home'     && <HomeView setActiveTab={handleTabChange} onOpenResume={() => setIsResumeOpen(true)} />}
          {activeTab === 'about'    && <AboutView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'skills'   && <SkillsView />}
          {activeTab === 'terminal' && (
            <TerminalView
              setActiveTab={handleTabChange}
              onOpenResume={() => setIsResumeOpen(true)}
            />
          )}
          {activeTab === 'contact'  && <ContactView />}
          </div>
        </div>

        {/* Global Footer */}
        <footer className={`portfolio-footer${activeTab === 'terminal' ? ' portfolio-footer--hidden' : ''}`}>
          Designed &amp; built by Varun Chauhan · React / Linux · 2026
        </footer>
      </main>

      {/* Resume PDF View Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
