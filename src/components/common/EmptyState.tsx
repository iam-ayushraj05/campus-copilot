import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        padding: '40px 24px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.01)',
        border: '1px border-dashed var(--border-color)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.12)',
          color: '#818CF8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <Icon size={26} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '380px', marginBottom: actionText ? '20px' : '0' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};
