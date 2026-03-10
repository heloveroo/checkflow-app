import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templateAPI, categoryAPI } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Modal from '../components/ui/Modal.jsx';
import { PriorityBadge } from '../components/ui/Badge.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Input, { Textarea, Select } from '../components/ui/Input.jsx';

function TemplateCard({ tpl, onUse, canManage, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hover ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)', overflow: 'hidden',
        transition: 'all var(--transition)',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? 'var(--shadow-md)' : 'none',
        display: 'flex', flexDirection: 'column'
      }}
    >
      {/* Color header */}
      <div style={{
        padding: '20px 20px 16px',
        background: `linear-gradient(135deg, ${tpl.category?.color || 'var(--accent)'}15, transparent)`
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, marginBottom: 14,
            background: (tpl.category?.color || 'var(--accent)') + '25',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
          }}>{tpl.category?.icon || '📋'}</div>
          <div style={{ display: 'flex', gap: 6, opacity: hover ? 1 : 0, transition: 'opacity var(--transition)' }}>
            <Link to={`/templates/${tpl._id}`} style={{
              fontSize: 11, padding: '4px 10px', borderRadius: 6,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', textDecoration: 'none'
            }}>Деталі</Link>
            {canManage && (
              <button onClick={() => { if (confirm('Видалити?')) onDelete(tpl._id); }} style={{
                fontSize: 11, padding: '4px 8px', borderRadius: 6,
                background: 'var(--danger-muted)', border: 'none',
                color: 'var(--danger)', cursor: 'pointer'
              }}>✕</button>
            )}
          </div>
        </div>
        <h3 style={{ fontSize: 16, fontFamily: 'var(--font-heading)', marginBottom: 6 }}>{tpl.title}</h3>
        {tpl.description && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {tpl.description}
          </p>
        )}
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', flex: 1 }}>
        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, flexWrap: 'wrap' }}>
          <span>📝 {tpl.items?.length || 0} пунктів</span>
          {tpl.estimatedDuration > 0 && <span>⏱ ~{Math.round(tpl.estimatedDuration / 60)}год</span>}
          <span>📊 {tpl.usageCount} використань</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'space-between' }}>
          <PriorityBadge priority={tpl.priority} />
          <Button size="sm" onClick={() => onUse(tpl)} variant="secondary">
            Використати →
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const { isManager } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', category: '', priority: 'medium',
    items: [{ title: '', description: '', order: 0, estimatedTime: 0, isRequired: true }]
  });

  const load = async () => {
    setLoading(true);
    try {
      const [t, c] = await Promise.all([templateAPI.getAll({ search, category: catFilter }), categoryAPI.getAll()]);
      setTemplates(t.data.data);
      setCategories(c.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, catFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await templateAPI.create(form);
      toast('Шаблон створено!', 'success');
      setCreateOpen(false);
      setForm({ title: '', description: '', category: '', priority: 'medium', items: [{ title: '', description: '', order: 0, estimatedTime: 0, isRequired: true }] });
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Помилка', 'error');
    } finally { setCreating(false); }
  };

  const addItem = () => setForm(p => ({ ...p, items: [...p.items, { title: '', description: '', order: p.items.length, estimatedTime: 0, isRequired: true }] }));
  const removeItem = (i) => setForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i, field, val) => setForm(p => ({ ...p, items: p.items.map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));

  const handleDelete = async (id) => {
    try { await templateAPI.delete(id); toast('Видалено', 'success'); load(); }
    catch { toast('Помилка', 'error'); }
  };

  const handleUse = (tpl) => {
    window.location.href = `/checklists`;
  };

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontFamily: 'var(--font-heading)' }}>Шаблони</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>Готові шаблони для типових процесів</p>
        </div>
        {isManager() && <Button onClick={() => setCreateOpen(true)} icon="➕">Новий шаблон</Button>}
      </div>

      {/* Search & filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <Input
          placeholder="🔍 Пошук шаблонів..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setCatFilter('')}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
              background: !catFilter ? 'var(--accent)' : 'var(--bg-card)',
              color: !catFilter ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${!catFilter ? 'var(--accent)' : 'var(--border)'}`,
              transition: 'all var(--transition)'
            }}
          >Всі</button>
          {categories.map(c => (
            <button
              key={c._id}
              onClick={() => setCatFilter(catFilter === c._id ? '' : c._id)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                background: catFilter === c._id ? c.color + '20' : 'var(--bg-card)',
                color: catFilter === c._id ? c.color : 'var(--text-secondary)',
                border: `1px solid ${catFilter === c._id ? c.color + '50' : 'var(--border)'}`,
                transition: 'all var(--transition)'
              }}
            >{c.icon} {c.name}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
          <Spinner size={36} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {templates.map(t => (
            <TemplateCard key={t._id} tpl={t} onUse={handleUse} canManage={isManager()} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Новий шаблон" width={660}>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Назва шаблону *" placeholder="Назва..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <Textarea label="Опис" placeholder="Опис шаблону..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Select label="Категорія" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              <option value="">— Без категорії —</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
            </Select>
            <Select label="Пріоритет" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
              <option value="critical">Критичний</option>
            </Select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>ПУНКТИ ЧЕКЛІСТУ</label>
              <Button type="button" onClick={addItem} size="sm" variant="ghost" icon="➕">Додати</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {form.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: 12, background: 'var(--bg-secondary)', borderRadius: 8 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8, minWidth: 20 }}>{i + 1}.</span>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <input
                      placeholder="Назва пункту *"
                      value={item.title}
                      onChange={e => updateItem(i, 'title', e.target.value)}
                      required
                      style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 6, color: 'var(--text-primary)', padding: '6px 10px', fontSize: 13, outline: 'none'
                      }}
                    />
                    <input
                      placeholder="Опис (необов'язково)"
                      value={item.description}
                      onChange={e => updateItem(i, 'description', e.target.value)}
                      style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 6, color: 'var(--text-primary)', padding: '6px 10px', fontSize: 12, outline: 'none'
                      }}
                    />
                  </div>
                  <input
                    type="number" placeholder="хв" min="0" value={item.estimatedTime}
                    onChange={e => updateItem(i, 'estimatedTime', Number(e.target.value))}
                    style={{
                      width: 54, background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: 6, color: 'var(--text-primary)', padding: '6px 8px', fontSize: 12,
                      outline: 'none', textAlign: 'center'
                    }}
                  />
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} style={{
                      background: 'none', border: 'none', color: 'var(--text-muted)',
                      cursor: 'pointer', fontSize: 16, marginTop: 4
                    }}>✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setCreateOpen(false)} type="button">Скасувати</Button>
            <Button type="submit" loading={creating}>Зберегти шаблон</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
