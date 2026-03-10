import React, { useState, useEffect } from 'react';
import { userAPI, logAPI, categoryAPI, tagAPI } from '../utils/api.js';
import { useToast } from '../components/ui/Toast.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { RoleBadge } from '../components/ui/Badge.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Modal from '../components/ui/Modal.jsx';
import Input, { Select } from '../components/ui/Input.jsx';

const TABS = ['Користувачі', 'Категорії', 'Теги', 'Логи'];

export default function AdminPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catModal, setCatModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', description: '', color: '#6366f1', icon: '📋' });
  const [tagForm, setTagForm] = useState({ name: '', color: '#8b5cf6' });

  useEffect(() => {
    setLoading(true);
    Promise.all([userAPI.getAll(), logAPI.getAll(), categoryAPI.getAll(), tagAPI.getAll()])
      .then(([u, l, c, t]) => {
        setUsers(u.data.data); setLogs(l.data.data);
        setCategories(c.data.data); setTags(t.data.data);
      }).finally(() => setLoading(false));
  }, []);

  const updateRole = async (id, role) => {
    try { const r = await userAPI.updateRole(id, role); setUsers(p => p.map(u => u._id === id ? r.data.data : u)); toast('Роль оновлено', 'success'); }
    catch { toast('Помилка', 'error'); }
  };

  const toggleStatus = async (id, isActive) => {
    try { const r = await userAPI.updateStatus(id, !isActive); setUsers(p => p.map(u => u._id === id ? r.data.data : u)); toast('Статус оновлено', 'success'); }
    catch { toast('Помилка', 'error'); }
  };

  const createCat = async (e) => {
    e.preventDefault();
    try { const r = await categoryAPI.create(catForm); setCategories(p => [...p, r.data.data]); setCatModal(false); setCatForm({ name: '', description: '', color: '#6366f1', icon: '📋' }); toast('Категорію створено', 'success'); }
    catch (err) { toast(err.response?.data?.message || 'Помилка', 'error'); }
  };

  const deleteCat = async (id) => {
    try { await categoryAPI.delete(id); setCategories(p => p.filter(c => c._id !== id)); toast('Видалено', 'success'); }
    catch { toast('Помилка', 'error'); }
  };

  const createTag = async (e) => {
    e.preventDefault();
    try { const r = await tagAPI.create(tagForm); setTags(p => [...p, r.data.data]); setTagModal(false); setTagForm({ name: '', color: '#8b5cf6' }); toast('Тег створено', 'success'); }
    catch (err) { toast(err.response?.data?.message || 'Помилка', 'error'); }
  };

  const deleteTag = async (id) => {
    try { await tagAPI.delete(id); setTags(p => p.filter(t => t._id !== id)); toast('Видалено', 'success'); }
    catch { toast('Помилка', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><Spinner size={40} /></div>;

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontFamily: 'var(--font-heading)' }}>Адміністрація</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>Управління системою та користувачами</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg-card)', padding: 4, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: 'fit-content' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 500, transition: 'all var(--transition)',
            background: tab === i ? 'var(--accent)' : 'transparent',
            color: tab === i ? '#fff' : 'var(--text-secondary)'
          }}>{t}</button>
        ))}
      </div>

      {/* Users */}
      {tab === 0 && (
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 16, fontFamily: 'var(--font-heading)' }}>Користувачі ({users.length})</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  {['Ім\'я', 'Email', 'Відділ', 'Роль', 'Статус', 'Останній вхід', 'Дії'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, color: '#fff'
                        }}>{u.name?.[0]?.toUpperCase()}</div>
                        <span style={{ fontWeight: 500, fontSize: 13 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-muted)' }}>{u.department || '—'}</td>
                    <td style={{ padding: '14px 20px' }}><RoleBadge role={u.role} /></td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: u.isActive ? 'var(--success-muted)' : 'var(--danger-muted)', color: u.isActive ? 'var(--success)' : 'var(--danger)' }}>
                        {u.isActive ? 'Активний' : 'Вимкнено'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-muted)' }}>
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('uk-UA') : '—'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <select
                          value={u.role}
                          onChange={e => updateRole(u._id, e.target.value)}
                          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}
                        >
                          <option value="guest">Гість</option>
                          <option value="employee">Співробітник</option>
                          <option value="manager">Менеджер</option>
                          <option value="admin">Адмін</option>
                        </select>
                        <Button variant={u.isActive ? 'danger' : 'success'} size="sm" onClick={() => toggleStatus(u._id, u.isActive)}>
                          {u.isActive ? 'Вимк.' : 'Увімк.'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Categories */}
      {tab === 1 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button onClick={() => setCatModal(true)} icon="➕">Нова категорія</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {categories.map(c => (
              <Card key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: c.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{c.description || '—'}</div>
                </div>
                <button onClick={() => { if (confirm('Видалити?')) deleteCat(c._id); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </Card>
            ))}
          </div>
          <Modal open={catModal} onClose={() => setCatModal(false)} title="Нова категорія">
            <form onSubmit={createCat} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="Назва *" value={catForm.name} onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))} required />
              <Input label="Опис" value={catForm.description} onChange={e => setCatForm(p => ({ ...p, description: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input label="Іконка (emoji)" value={catForm.icon} onChange={e => setCatForm(p => ({ ...p, icon: e.target.value }))} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Колір</label>
                  <input type="color" value={catForm.color} onChange={e => setCatForm(p => ({ ...p, color: e.target.value }))} style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setCatModal(false)} type="button">Скасувати</Button>
                <Button type="submit">Створити</Button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* Tags */}
      {tab === 2 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button onClick={() => setTagModal(true)} icon="➕">Новий тег</Button>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px 6px 10px', borderRadius: 20, background: (t.color || 'var(--accent)') + '20', border: `1px solid ${(t.color || 'var(--accent)')}30` }}>
                <span style={{ fontSize: 13, color: t.color || 'var(--accent)', fontWeight: 500 }}>#{t.name}</span>
                <button onClick={() => { if (confirm('Видалити тег?')) deleteTag(t._id); }} style={{ background: 'none', border: 'none', color: t.color || 'var(--accent)', cursor: 'pointer', fontSize: 14, lineHeight: 1, opacity: 0.6 }}>×</button>
              </div>
            ))}
          </div>
          <Modal open={tagModal} onClose={() => setTagModal(false)} title="Новий тег">
            <form onSubmit={createTag} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="Назва (lowercase)" placeholder="release, urgent, daily..." value={tagForm.name} onChange={e => setTagForm(p => ({ ...p, name: e.target.value.toLowerCase() }))} required />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Колір</label>
                <input type="color" value={tagForm.color} onChange={e => setTagForm(p => ({ ...p, color: e.target.value }))} style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setTagModal(false)} type="button">Скасувати</Button>
                <Button type="submit">Створити</Button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* Logs */}
      {tab === 3 && (
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 16, fontFamily: 'var(--font-heading)' }}>Лог дій ({logs.length})</h2>
          </div>
          <div style={{ maxHeight: 600, overflowY: 'auto' }}>
            {logs.map((l, i) => (
              <div key={l._id} style={{ display: 'flex', gap: 16, padding: '12px 24px', borderTop: i > 0 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff'
                }}>{l.user?.name?.[0]?.toUpperCase() || '?'}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{l.user?.name || 'Система'}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}> · </span>
                  <span style={{ fontSize: 13, color: 'var(--accent)' }}>{l.action}</span>
                  {l.entity && <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>({l.entity})</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(l.createdAt).toLocaleString('uk-UA')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
