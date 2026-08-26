import React from 'react';

export default function Badge({
  children,
  type = 'normal', // normal, success, warning, danger, info, ai
  icon = null,
  size = 'md',
  className = '',
  style = {}
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontWeight: '600',
    fontFamily: 'var(--font-body)',
    borderRadius: 'var(--radius-full)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    ...style
  };

  const sizes = {
    sm: { padding: '0.25rem 0.6rem', fontSize: '0.75rem' },
    md: { padding: '0.35rem 0.8rem', fontSize: '0.85rem' },
    lg: { padding: '0.45rem 1rem', fontSize: '0.95rem' }
  };

  const types = {
    normal: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: 'var(--text-secondary)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    success: {
      background: 'var(--color-success-bg)',
      color: '#34d399',
      border: '1px solid rgba(16, 185, 129, 0.3)'
    },
    warning: {
      background: 'var(--color-warning-bg)',
      color: '#fbbf24',
      border: '1px solid rgba(245, 158, 11, 0.3)'
    },
    danger: {
      background: 'var(--color-danger-bg)',
      color: '#f87171',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    info: {
      background: 'var(--color-info-bg)',
      color: '#60a5fa',
      border: '1px solid rgba(59, 130, 246, 0.3)'
    },
    ai: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
      color: '#a78bfa',
      border: '1px solid rgba(139, 92, 246, 0.4)',
      boxShadow: '0 0 10px rgba(139, 92, 246, 0.15)'
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizes[size],
    ...types[type]
  };

  return (
    <span style={combinedStyles} className={className}>
      {icon && <span style={{ fontSize: '1.1em' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
