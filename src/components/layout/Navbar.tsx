import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Flame } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, profile } = useApp();
  const location = useLocation();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'Home Workspace';
      case '/dashboard': return 'Dashboard Command Center';
      case '/study': return 'StudyBuddy Workspace';
      case '/code': return 'CodeExplain IDE Workspace';
      case '/planner': return 'Campus Planner';
      case '/profile': return 'Developer Profile';
      case '/settings': return 'System Settings';
      default: return 'CampusCopilot';
    }
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-sidebar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>workspace /</span>
        <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {getPageTitle(location.pathname)}
        </h2>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Streak Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--accent-orange-bg)',
            color: 'var(--accent-orange)',
            border: '1px solid var(--accent-orange-border)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
          }}
        >
          <Flame size={14} fill="currentColor" />
          <span>{profile.streakDays}d Streak</span>
        </div>

        {/* Weekly Accuracy Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--accent-green-bg)',
            color: 'var(--accent-green)',
            border: '1px solid var(--accent-green-border)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
          }}
        >
          <span>{profile.quizAccuracyPercentage}% Acc</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark/light theme"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-card-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Student Avatar */}
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src={profile.avatar}
            alt={profile.name}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1.5px solid var(--accent-green)',
              objectFit: 'cover',
            }}
          />
        </Link>
      </div>
    </header>
  );
};
