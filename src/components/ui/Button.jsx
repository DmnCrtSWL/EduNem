import React from 'react';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon = null,
  disabled = false,
  className = '',
  title = '',
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)',
    position: 'relative',
    overflow: 'hidden',
    ...props.style,
  };

  const sizes = {
    sm: { padding: '0.4rem 0.8rem', fontSize: '0.85rem', minHeight: '36px' },
    md: { padding: '0.65rem 1.25rem', fontSize: '0.95rem', minHeight: '44px' },
    lg: { padding: '0.85rem 1.75rem', fontSize: '1.1rem', minHeight: '52px' },
    xl: { padding: '1.1rem 2.2rem', fontSize: '1.25rem', minHeight: '62px' },
  };

  const variants = {
    primary: {
      background: 'var(--grad-primary)',
      color: '#ffffff',
      boxShadow: 'var(--glow-success)',
    },
    ai: {
      background: 'var(--grad-ai)',
      color: '#ffffff',
      boxShadow: 'var(--glow-ai)',
    },
    sos: {
      background: 'var(--grad-sos)',
      color: '#ffffff',
      boxShadow: 'var(--glow-sos)',
    },
    warning: {
      background: 'var(--grad-warning)',
      color: '#ffffff',
    },
    secondary: {
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      border: '1px solid var(--bg-glass-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      boxShadow: 'none',
    },
    success: {
      background: '#10b981',
      color: '#ffffff',
      boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizes[size],
    ...variants[variant],
  };

  return (
    <button
      style={combinedStyles}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`touch-target ${className}`}
      title={title}
      {...props}
    >
      {icon && <span style={{ fontSize: '1.2em', display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
