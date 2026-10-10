import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

import HomeView from './components/HomeInstrument';
import AboutView from './components/AboutView';
import ProjectsView from './components/ProjectsView';
import SkillsView from './components/SkillsInventory';
import TerminalView from './components/TerminalView';
import ContactView from './components/ContactView';
import ResumeModal from './components/ResumeModal';

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const pageRef = useRef(null);

  const handleTabChange = (tab) => {
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
