import React from 'react';

const variants = {
  default: { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)' },
  accent: { bg: 'var(--accent-muted)', color: 'var(--accent)' },
  success: { bg: 'var(--success-muted)', color: 'var(--success)' },
  warning: { bg: 'var(--warning-muted)', color: 'var(--warning)' },
  danger: { bg: 'var(--danger-muted)', color: 'var(--danger)' },
  purple: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  cyan: { bg: 'rgba(6,182,212,0.12)', color: '#06b6d4' }
};

const statusMap = {
  pending: 'default',
  in_progress: 'accent',
  completed: 'success',
  overdue: 'danger',
  cancelled: 'default'
};

const priorityMap = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
  critical: 'danger'
};

const statusLabel = { pending: 'Очікує', in_progress: 'В роботі', completed: 'Завершено', overdue: 'Прострочено', cancelled: 'Скасовано' };
const priorityLabel = { low: 'Низький', medium: 'Середній', high: 'Високий', critical: 'Критичний' };
const roleLabel = { guest: 'Гість', employee: 'Співробітник', manager: 'Менеджер', admin: 'Адмін' };
const roleVariant = { guest: 'default', employee: 'accent', manager: 'purple', admin: 'danger' };

export default function Badge({ variant = 'default', children, style }) {
  const v = variants[variant] || variants.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 6,
      fontSize: 11, fontWeight: 500, letterSpacing: '0.3px',
      background: v.bg, color: v.color,
      whiteSpace: 'nowrap',
      ...style
    }}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  return <Badge variant={statusMap[status] || 'default'}>{statusLabel[status] || status}</Badge>;
}

export function PriorityBadge({ priority }) {
  return <Badge variant={priorityMap[priority] || 'default'}>{priorityLabel[priority] || priority}</Badge>;
}

export function RoleBadge({ role }) {
  return <Badge variant={roleVariant[role] || 'default'}>{roleLabel[role] || role}</Badge>;
}
