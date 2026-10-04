import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Code2, Calendar, UserCheck } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { label: 'Dash', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Study', icon: BookOpen, path: '/study' },
    { label: 'Code', icon: Code2, path: '/code' },
    { label: 'Plan', icon: Calendar, path: '/planner' },
    { label: 'Profile', icon: UserCheck, path: '/profile' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--bg-sidebar)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
      }}
      className="mobile-nav-bar"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              fontSize: '0.7rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
              textDecoration: 'none',
            })}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
