import React from 'react';
import Spinner from './Spinner.jsx';

const variants = {
  primary: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    hover: 'var(--accent-hover)'
  },
  secondary: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    hover: 'var(--bg-card)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
    hover: 'var(--bg-elevated)'
  },
  danger: {
    background: 'var(--danger-muted)',
    color: 'var(--danger)',
    border: '1px solid transparent',
    hover: 'rgba(239,68,68,0.2)'
  },
  success: {
    background: 'var(--success-muted)',
    color: 'var(--success)',
    border: '1px solid transparent',
    hover: 'rgba(16,185,129,0.2)'
  }
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: 12, height: 30 },
  md: { padding: '8px 16px', fontSize: 13, height: 36 },
  lg: { padding: '10px 20px', fontSize: 14, height: 42 }
};

export default function Button({
  children, variant = 'primary', size = 'md',
  loading, disabled, onClick, style, type = 'button', icon
}) {
  const v = variants[variant];
  const s = sizes[size];
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, ...s,
        background: hovered && !disabled ? v.hover : v.background,
        color: v.color, border: v.border,
        borderRadius: 'var(--radius-sm)',
        fontWeight: 500, cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all var(--transition)',
        whiteSpace: 'nowrap', flexShrink: 0,
        ...style
      }}
    >
      {loading ? <Spinner size={14} color={v.color} /> : icon}
      {children}
    </button>
  );
}
