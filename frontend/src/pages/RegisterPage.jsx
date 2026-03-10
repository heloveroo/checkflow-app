import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка реєстрації');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 20, position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: -200, right: -200,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{ width: '100%', maxWidth: 440, animation: 'fadeUp 0.5s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
          }}>☑</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 20 }}>CheckFlow</div>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 32
        }}>
          <h1 style={{ fontSize: 24, marginBottom: 8, fontFamily: 'var(--font-heading)' }}>Реєстрація</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 28 }}>Створіть акаунт для роботи з системою</p>

          {error && (
            <div style={{
              background: 'var(--danger-muted)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, padding: '12px 16px', color: 'var(--danger)', fontSize: 13, marginBottom: 20
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Повне ім'я" placeholder="Іван Петренко" value={form.name} onChange={update('name')} icon="👤" required />
            <Input label="Email" type="email" placeholder="ivan@company.com" value={form.email} onChange={update('email')} icon="✉" required />
            <Input label="Пароль" type="password" placeholder="Мін. 6 символів" value={form.password} onChange={update('password')} icon="🔒" required minLength={6} />
            <Input label="Відділ (необов'язково)" placeholder="IT, HR, Marketing..." value={form.department} onChange={update('department')} icon="🏢" />
            <Button type="submit" loading={loading} size="lg" style={{ width: '100%', marginTop: 8 }}>
              Зареєструватись
            </Button>
          </form>
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            Вже є акаунт?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Увійти</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
