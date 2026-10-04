import React from 'react';
import { Loader2 } from 'lucide-react';

interface SkeletonLoaderProps {
  label?: string;
  lines?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  label = 'Thinking...',
  lines = 3,
}) => {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
        <Loader2 className="spin" size={16} />
        <span>{label}</span>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: i === 0 ? '20px' : '14px',
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
};
