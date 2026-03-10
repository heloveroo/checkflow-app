import React from 'react';

export default function Input({ label, error, icon, style, containerStyle, ...props }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', fontSize: 16, pointerEvents: 'none'
          }}>{icon}</span>
        )}
        <input
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', height: 40,
            background: 'var(--bg-card)',
            border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            padding: icon ? '0 12px 0 36px' : '0 12px',
            fontSize: 14, outline: 'none',
            transition: 'border-color var(--transition)',
            ...style
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: 11, color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, style, containerStyle, ...props }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <textarea
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', minHeight: 80,
          background: 'var(--bg-card)',
          border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          padding: '10px 12px', fontSize: 14, outline: 'none',
          resize: 'vertical',
          transition: 'border-color var(--transition)',
          ...style
        }}
        {...props}
      />
      {error && <span style={{ fontSize: 11, color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}

export function Select({ label, error, children, style, containerStyle, ...props }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <select
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 40,
          background: 'var(--bg-card)',
          border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          padding: '0 12px', fontSize: 14, outline: 'none',
          cursor: 'pointer',
          transition: 'border-color var(--transition)',
          ...style
        }}
        {...props}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: 11, color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}
