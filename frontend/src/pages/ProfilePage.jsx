import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { userAPI } from '../utils/api.js';
import { useToast } from '../components/ui/Toast.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { RoleBadge } from '../components/ui/Badge.jsx';

const rolePerms = {
  guest: ['Перегляд публічних шаблонів'],
  employee: ['Виконання чеклістів', 'Перегляд шаблонів', 'Перегляд своїх чеклістів', 'Додавання коментарів'],
  manager: ['Всі права Співробітника', 'Створення шаблонів', 'Призначення чеклістів', 'Управління командою'],
  admin: ['Повний доступ до системи', 'Управління користувачами', 'Логи та аналітика', 'Налаштування категорій і тегів']
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', department: user?.department || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(form);
      setUser(res.data.data);
      setEditing(false);
      toast('Профіль оновлено', 'success');
    } catch { toast('Помилка збереження', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontFamily: 'var(--font-heading)', marginBottom: 32 }}>Мій профіль</h1>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 700, color: '#fff',
            boxShadow: '0 0 30px var(--accent-muted)'
          }}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h2 style={{ fontSize: 20, fontFamily: 'var(--font-heading)', marginBottom: 6 }}>{user?.name}</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <RoleBadge role={user?.role} />
              {user?.department && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>· {user.department}</span>}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setEditing(!editing)} style={{ marginLeft: 'auto' }}>
            {editing ? 'Скасувати' : '✏ Редагувати'}
          </Button>
        </div>

        {editing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Повне ім'я" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            <Input label="Відділ" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
            <Button type="submit" loading={saving} style={{ alignSelf: 'flex-start' }}>Зберегти</Button>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Email', value: user?.email },
              { label: 'Відділ', value: user?.department || '—' },
              { label: 'Роль', value: <RoleBadge role={user?.role} /> },
              { label: 'В системі з', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uk-UA') : '—' },
              { label: 'Статус', value: user?.isActive ? '✅ Активний' : '❌ Вимкнено' },
              { label: 'Останній вхід', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString('uk-UA') : '—' }
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h3 style={{ fontSize: 14, fontFamily: 'var(--font-heading)', marginBottom: 16 }}>Ваші права доступу</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(rolePerms[user?.role] || []).map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
              <span style={{ color: 'var(--success)', fontSize: 14 }}>✓</span>
              <span style={{ fontSize: 13 }}>{p}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
