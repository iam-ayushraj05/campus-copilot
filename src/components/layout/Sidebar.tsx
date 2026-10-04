import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Code2, Calendar, UserCheck, Settings, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  onOpenBuildPlan?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenBuildPlan }) => {
  const { profile } = useApp();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'StudyBuddy', icon: BookOpen, path: '/study' },
    { label: 'CodeExplain', icon: Code2, path: '/code' },
    { label: 'Campus Planner', icon: Calendar, path: '/planner' },
    { label: 'Learning Profile', icon: UserCheck, path: '/profile' },
  ];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px',
        zIndex: 50,
      }}
    >
      <div>
        {/* Brand Header: Code Bracket 'C' Logo linking directly to Home (/) */}
        <Link
          to="/"
          title="Return to Home Page"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 8px 16px',
            borderBottom: '1px solid var(--border-color)',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'var(--accent-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            C/&gt;
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              CampusCopilot
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Your developer campus</div>
          </div>
        </Link>

        {/* Compact Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '14px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-green-bg)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-green)' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} color={isActive ? 'var(--accent-green)' : 'currentColor'} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Build Plan Button */}
        <div style={{ marginTop: '16px', padding: '0 4px' }}>
          <button
            onClick={onOpenBuildPlan}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              fontSize: '0.8rem',
              padding: '7px 10px',
            }}
          >
            <Sparkles size={14} />
            Build Study Plan
          </button>
        </div>
      </div>

      {/* Bottom Profile & Settings Footer */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-card-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={profile.avatar}
              alt={profile.name}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {profile.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                CSE • 3rd Year
              </div>
            </div>
          </div>

          <NavLink
            to="/settings"
            title="Settings"
            style={({ isActive }) => ({
              color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
            })}
          >
            <Settings size={16} />
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
