import React from 'react';

export default function ProgressBar({ value = 0, height = 6, showLabel = false, color, style }) {
  const getColor = () => {
    if (color) return color;
    if (value === 100) return 'var(--success)';
    if (value >= 60) return 'var(--accent)';
    if (value >= 30) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      <div style={{
        flex: 1, height, background: 'var(--bg-elevated)',
        borderRadius: height / 2, overflow: 'hidden'
      }}>
        <div style={{
          height: '100%', width: `${value}%`,
          background: getColor(),
          borderRadius: height / 2,
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 8px ${getColor()}50`
        }} />
      </div>
      {showLabel && (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 32, textAlign: 'right' }}>
          {value}%
        </span>
      )}
    </div>
  );
}
