import React from 'react';

export default function Card({ children, style, onClick, hoverable, padding = 20 }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered && hoverable ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        padding,
        transition: 'all var(--transition)',
        cursor: onClick ? 'pointer' : 'default',
        transform: hovered && hoverable ? 'translateY(-2px)' : 'none',
        boxShadow: hovered && hoverable ? 'var(--shadow-md)' : 'none',
        ...style
      }}
    >
      {children}
    </div>
  );
}
