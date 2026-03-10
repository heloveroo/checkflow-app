import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { checklistAPI, templateAPI, userAPI } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Modal from '../components/ui/Modal.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Input, { Select } from '../components/ui/Input.jsx';

function ChecklistCard({ checklist, onDelete }) {
  const { isManager } = useAuth();
  const [hover, setHover] = useState(false);
  const dueDate = checklist.dueDate ? new Date(checklist.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && checklist.status !== 'completed';

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
        boxShadow: hover ? 'var(--shadow-md)' : 'none'
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: 3, background: checklist.status === 'completed' ? 'var(--success)'
          : checklist.status === 'in_progress' ? 'var(--accent)'
          : isOverdue ? 'var(--danger)' : 'var(--bg-elevated)'
      }} />

      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, overflow: 'hidden' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: (checklist.category?.color || 'var(--accent)') + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
            }}>{checklist.category?.icon || '📋'}</div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <Link to={`/checklists/${checklist._id}`} style={{
                fontWeight: 600, fontSize: 15, color: 'var(--text-primary)',
                textDecoration: 'none', display: 'block',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                marginBottom: 4
              }}>
                {checklist.title}
              </Link>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <StatusBadge status={checklist.status} />
                <PriorityBadge priority={checklist.priority} />
              </div>
            </div>
          </div>
          {isManager() && (
            <button
              onClick={(e) => { e.stopPropagation(); if (confirm('Видалити?')) onDelete(checklist._id); }}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', fontSize: 16, opacity: hover ? 1 : 0,
                transition: 'opacity var(--transition)', padding: '2px 6px',
                borderRadius: 4
              }}
            >✕</button>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {checklist.items?.filter(i => i.isCompleted).length || 0} / {checklist.items?.length || 0} пунктів
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: checklist.progress === 100 ? 'var(--success)' : 'var(--text-secondary)' }}>
              {checklist.progress}%
            </span>
          </div>
          <ProgressBar value={checklist.progress} height={6} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {checklist.assignedTo ? (
              <span>👤 {checklist.assignedTo.name}</span>
            ) : (
              <span>Не призначено</span>
            )}
          </div>
          {dueDate && (
            <span style={{ fontSize: 11, color: isOverdue ? 'var(--danger)' : 'var(--text-muted)' }}>
              {isOverdue ? '⚠ ' : '📅 '}{dueDate.toLocaleDateString('uk-UA')}
            </span>
          )}
        </div>

        {checklist.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 4, marginTop: 12, flexWrap: 'wrap' }}>
            {checklist.tags.map(t => (
              <span key={t._id} style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 20,
                background: (t.color || 'var(--accent)') + '20',
                color: t.color || 'var(--accent)', fontWeight: 500
              }}>#{t.name}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChecklistsPage() {
  const { isManager } = useAuth();
  const { toast } = useToast();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ status: '', mine: '' });
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', templateId: '', assignedTo: '', dueDate: '', priority: 'medium', description: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await checklistAPI.getAll({ status: filter.status, mine: filter.mine });
      setChecklists(res.data.data);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (modalOpen) {
      templateAPI.getAll({ limit: 100 }).then(r => setTemplates(r.data.data));
      if (isManager()) userAPI.getAll().then(r => setUsers(r.data.data));
    }
  }, [modalOpen, isManager]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await checklistAPI.create(form);
      toast('Чекліст створено!', 'success');
      setModalOpen(false);
      setForm({ title: '', templateId: '', assignedTo: '', dueDate: '', priority: 'medium', description: '' });
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Помилка', 'error');
    } finally { setCreating(false); }
  };

  const handleDelete = async (id) => {
    try {
      await checklistAPI.delete(id);
      toast('Видалено', 'success');
      load();
    } catch { toast('Помилка видалення', 'error'); }
  };

  const onTemplateSelect = (e) => {
    const tpl = templates.find(t => t._id === e.target.value);
    setForm(p => ({ ...p, templateId: e.target.value, title: tpl ? tpl.title : p.title }));
  };

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontFamily: 'var(--font-heading)' }}>Чеклісти</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>Управління та виконання чеклістів</p>
        </div>
        <Button onClick={() => setModalOpen(true)} icon="➕">Новий чекліст</Button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Всі', value: '' },
          { label: 'Очікують', value: 'pending' },
          { label: 'В роботі', value: 'in_progress' },
          { label: 'Завершені', value: 'completed' },
          { label: 'Прострочені', value: 'overdue' }
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(p => ({ ...p, status: f.value }))}
            style={{
              padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
              fontSize: 13, fontWeight: 500, transition: 'all var(--transition)',
              background: filter.status === f.value ? 'var(--accent)' : 'var(--bg-card)',
              color: filter.status === f.value ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${filter.status === f.value ? 'var(--accent)' : 'var(--border)'}`
            }}
          >{f.label}</button>
        ))}
        <button
          onClick={() => setFilter(p => ({ ...p, mine: p.mine === 'true' ? '' : 'true' }))}
          style={{
            padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            fontSize: 13, fontWeight: 500, transition: 'all var(--transition)',
            background: filter.mine === 'true' ? 'var(--accent-muted)' : 'var(--bg-card)',
            color: filter.mine === 'true' ? 'var(--accent)' : 'var(--text-secondary)',
            border: `1px solid ${filter.mine === 'true' ? 'var(--accent)' : 'var(--border)'}`
          }}
        >👤 Мої</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
          <Spinner size={36} />
        </div>
      ) : checklists.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>☑</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Немає чеклістів</div>
          <div style={{ fontSize: 14, marginBottom: 24 }}>Створіть перший або змініть фільтр</div>
          <Button onClick={() => setModalOpen(true)}>Створити чекліст</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {checklists.map(c => <ChecklistCard key={c._id} checklist={c} onDelete={handleDelete} />)}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Новий чекліст" width={540}>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select label="Шаблон (необов'язково)" value={form.templateId} onChange={onTemplateSelect}>
            <option value="">— Без шаблону —</option>
            {templates.map(t => <option key={t._id} value={t._id}>{t.category?.icon} {t.title}</option>)}
          </Select>
          <Input label="Назва чеклісту *" placeholder="Введіть назву..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <Input label="Опис" placeholder="Опис (необов'язково)" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Select label="Пріоритет" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
              <option value="critical">Критичний</option>
            </Select>
            <Input label="Дедлайн" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          </div>
          {isManager() && users.length > 0 && (
            <Select label="Призначити" value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}>
              <option value="">— Не призначено —</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.department || u.role})</option>)}
            </Select>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setModalOpen(false)} type="button">Скасувати</Button>
            <Button type="submit" loading={creating}>Створити</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
