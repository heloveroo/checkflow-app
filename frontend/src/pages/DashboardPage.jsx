import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { checklistAPI } from '../utils/api.js';
import Card from '../components/ui/Card.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge.jsx';
import Spinner from '../components/ui/Spinner.jsx';

function StatCard({ icon, label, value, color, sub }) {
  return (
    <Card style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: color + '10'
      }} />
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-heading)', color }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}

export default function DashboardPage() {
  const { user, isManager } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      checklistAPI.getStats(),
      checklistAPI.getAll({ limit: 5, mine: true })
    ]).then(([s, r]) => {
      setStats(s.data.data);
      setRecent(r.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Spinner size={40} />
    </div>
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Добрий ранок' : hour < 17 ? 'Добрий день' : 'Добрий вечір';

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
          {new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <h1 style={{ fontSize: 28, fontFamily: 'var(--font-heading)' }}>
          {greeting}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
          Ось огляд вашої активності
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon="📋" label="Всього чеклістів" value={stats?.total || 0} color="var(--accent)" />
        <StatCard icon="▶" label="В роботі" value={stats?.inProgress || 0} color="var(--warning)" />
        <StatCard icon="✓" label="Завершено" value={stats?.completed || 0} color="var(--success)" />
        <StatCard icon="⏰" label="Прострочено" value={stats?.overdue || 0} color="var(--danger)" />
        {isManager() && <StatCard icon="⏳" label="Очікують" value={stats?.pending || 0} color="var(--purple)" />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        {/* Recent checklists */}
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <h2 style={{ fontSize: 16, fontFamily: 'var(--font-heading)' }}>Останні чеклісти</h2>
            <Link to="/checklists" style={{ fontSize: 12, color: 'var(--accent)' }}>Всі →</Link>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div>Немає чеклістів</div>
            </div>
          ) : (
            recent.map((c, i) => (
              <Link key={c._id} to={`/checklists/${c._id}`} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 24px', textDecoration: 'none',
                borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background var(--transition)'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: (c.category?.color || 'var(--accent)') + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>{c.category?.icon || '📋'}</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                </div>
                <div style={{ minWidth: 100 }}>
                  <ProgressBar value={c.progress} height={4} showLabel />
                </div>
              </Link>
            ))
          )}
        </Card>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>ШВИДКІ ДІЇ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '➕', label: 'Новий чекліст', to: '/checklists', color: 'var(--accent)' },
                { icon: '📂', label: 'Всі шаблони', to: '/templates', color: 'var(--purple)' },
                { icon: '📊', label: 'Мої чеклісти', to: '/checklists?mine=true', color: 'var(--success)' }
              ].map(a => (
                <Link key={a.to} to={a.to} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none', transition: 'all var(--transition)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = a.color + '15'; e.currentTarget.style.color = a.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'inherit'; }}
                >
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>ТИПИ ЧЕКЛІСТІВ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '👥', label: 'Онбординг', color: '#8b5cf6' },
                { icon: '🚀', label: 'Підготовка релізу', color: '#3b82f6' },
                { icon: '✅', label: 'Перевірка якості', color: '#10b981' },
                { icon: '🔒', label: 'Аудит безпеки', color: '#ef4444' },
                { icon: '🔄', label: 'Щоденні рутини', color: '#f59e0b' }
              ].map(t => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: t.color + '20', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 14
                  }}>{t.icon}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
