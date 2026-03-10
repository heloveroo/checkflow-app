import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fill = (email, password) => setForm({ email, password });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка входу');
    } finally { setLoading(false); }
  };

  const demos = [
    { label: 'Адмін', email: 'admin@company.com', password: 'Admin123!', color: 'var(--danger)' },
    { label: 'Менеджер', email: 'manager@company.com', password: 'Manager123!', color: '#8b5cf6' },
    { label: 'Співробітник', email: 'ivan@company.com', password: 'Employee123!', color: 'var(--accent)'},
    { label: 'Співробітник', email: 'olena@company.com', password: 'Employee123!', color: 'var(--accent)' },
    { label: 'Гість', email: 'guest@company.com', password: 'Guest123!', color: 'var(--text-muted)' }
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg-primary)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -200, left: -200,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: -100, right: -100,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 40
      }}>
        <div style={{ width: '100%', maxWidth: 400, animation: 'fadeUp 0.5s ease' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, boxShadow: '0 0 30px var(--accent-muted)'
            }}>☑</div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 20 }}>CheckFlow</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '1px' }}>АВТОМАТИЗАЦІЯ ПРОЦЕСІВ</div>
            </div>
          </div>

          <h1 style={{ fontSize: 28, marginBottom: 8, fontFamily: 'var(--font-heading)' }}>Вхід до системи</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
            Введіть облікові дані для доступу
          </p>

          {error && (
            <div style={{
              background: 'var(--danger-muted)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius-sm)', padding: '12px 16px',
              color: 'var(--danger)', fontSize: 13, marginBottom: 20
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              icon="✉"
              required
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              icon="🔒"
              required
            />
            <Button type="submit" loading={loading} size="lg" style={{ width: '100%', marginTop: 8 }}>
              Увійти
            </Button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            Немає акаунту?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Зареєструватись</Link>
          </div>

          {/* Demo accounts */}
          <div style={{
            marginTop: 32, padding: 20, background: 'var(--bg-card)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '1px', fontWeight: 600, marginBottom: 12 }}>
              ДЕМО АКАУНТИ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {demos.map(d => (
                <button
                  key={d.email}
                  onClick={() => fill(d.email, d.password)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', fontSize: 13, textAlign: 'left',
                    transition: 'all var(--transition)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = d.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: d.color + '20', color: d.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700
                  }}>{d.label[0]}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{d.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.email}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>→ заповнити</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - decorative */}
      <div style={{
        flex: 1, background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 60
      }}>
        <div style={{ maxWidth: 360, textAlign: 'center', animation: 'fadeUp 0.6s 0.1s ease both' }}>
          <div style={{ fontSize: 64, marginBottom: 32, animation: 'float 4s ease-in-out infinite' }}>☑</div>
          <h2 style={{ fontSize: 28, fontFamily: 'var(--font-heading)', marginBottom: 16 }}>
            Автоматизуйте ваші процеси
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 40 }}>
            CheckFlow допомагає командам створювати, призначати та відстежувати виконання чеклістів для будь-яких бізнес-процесів
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
            {[
              { icon: '👥', text: 'Ролі: гість, співробітник, менеджер, адмін' },
              { icon: '📋', text: 'Шаблони для типових процесів компанії' },
              { icon: '📊', text: 'Аналітика та відстеження прогресу' },
              { icon: '🔒', text: 'Безпечна авторизація з JWT' }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: 16, background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
