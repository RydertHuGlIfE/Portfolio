import React from 'react';
import { 
  Home, 
  User, 
  Briefcase, 
  Cpu, 
  Terminal as TerminalIcon, 
  Mail, 
  FileText, 
  Github, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function SidebarNav({ activeTab, setActiveTab, onOpenResume, isCollapsed, setIsCollapsed }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About & Experience', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <aside 
      className={`mobile-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}
      style={{ width: isCollapsed ? '80px' : '260px' }}
    >
      {/* Top Profile Header */}
      <div>
        <div className="sidebar-profile">
          <div className="sidebar-monogram">VC</div>
          {!isCollapsed && (
            <div>
              <strong>Varun Chauhan</strong>
              <small>SOFTWARE / AI</small>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="sidebar-links" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-link cursor-target${isActive ? ' is-active' : ''}`}
                title={item.label}
              >
                <Icon size={17} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="sidebar-footer">
        {/* Resume Button */}
        <button
          onClick={onOpenResume}
          className="sidebar-action cursor-target"
        >
          <FileText size={16} />
          {!isCollapsed && <span>Resume (PDF)</span>}
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/RydertHuGlIfE"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-github cursor-target"
        >
          <Github size={16} />
          {!isCollapsed && <span>github.com/RydertHuGlIfE</span>}
        </a>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sidebar-collapse cursor-target"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {!isCollapsed && (
          <p className="sidebar-signoff">
            Build • Debug • Automate
          </p>
        )}
      </div>
    </aside>
  );
}
