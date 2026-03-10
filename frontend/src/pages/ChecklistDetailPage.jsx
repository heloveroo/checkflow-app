import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { checklistAPI } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { Textarea } from '../components/ui/Input.jsx';

function CheckItem({ item, onToggle, loading }) {
  const [hover, setHover] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState(item.comment || '');

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '14px 16px',
        borderRadius: 'var(--radius-sm)',
        background: hover ? 'var(--bg-secondary)' : 'transparent',
        transition: 'all var(--transition)',
        border: '1px solid transparent',
        borderColor: hover ? 'var(--border)' : 'transparent'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button
          onClick={() => onToggle(item._id, comment)}
          disabled={loading}
          style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 2,
            border: `2px solid ${item.isCompleted ? 'var(--success)' : 'var(--border-hover)'}`,
            background: item.isCompleted ? 'var(--success)' : 'transparent',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all var(--transition)', color: '#fff', fontSize: 12
          }}
        >
          {loading ? <Spinner size={12} color="#fff" /> : item.isCompleted ? '✓' : ''}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 14, fontWeight: 500,
            color: item.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: item.isCompleted ? 'line-through' : 'none',
            transition: 'all var(--transition)'
          }}>
            {item.title}
            {item.isRequired && <span style={{ color: 'var(--danger)', marginLeft: 4, fontSize: 12 }}>*</span>}
          </div>
          {item.description && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{item.description}</div>
          )}
          {item.isCompleted && item.completedBy && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              ✓ {item.completedBy.name} · {new Date(item.completedAt).toLocaleDateString('uk-UA')}
            </div>
          )}
          {item.comment && (
            <div style={{
              fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, fontStyle: 'italic',
              padding: '6px 10px', background: 'var(--bg-elevated)', borderRadius: 6,
              borderLeft: '2px solid var(--accent)'
            }}>💬 {item.comment}</div>
          )}
        </div>
        {item.estimatedTime > 0 && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>⏱ {item.estimatedTime}хв</span>
        )}
      </div>
    </div>
  );
}

export default function ChecklistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isManager } = useAuth();
  const { toast } = useToast();
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await checklistAPI.getOne(id);
      setChecklist(res.data.data);
    } catch { navigate('/checklists'); }
    finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (itemId) => {
    setTogglingId(itemId);
    try {
      const res = await checklistAPI.toggleItem(id, itemId, {});
      setChecklist(res.data.data);
      toast('Статус оновлено', 'success');
    } catch { toast('Помилка', 'error'); }
    finally { setTogglingId(null); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await checklistAPI.addComment(id, { text: comment });
      setChecklist(res.data.data);
      setComment('');
      toast('Коментар додано', 'success');
    } catch { toast('Помилка', 'error'); }
    finally { setSubmittingComment(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Spinner size={40} />
    </div>
  );
  if (!checklist) return null;

  const completedCount = checklist.items.filter(i => i.isCompleted).length;

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', maxWidth: 900, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: 'var(--text-muted)' }}>
        <Link to="/checklists" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Чеклісти</Link>
        <span>›</span>
        <span>{checklist.title}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, flexShrink: 0,
            background: (checklist.category?.color || 'var(--accent)') + '20',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26
          }}>{checklist.category?.icon || '📋'}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontFamily: 'var(--font-heading)', marginBottom: 10 }}>{checklist.title}</h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <StatusBadge status={checklist.status} />
              <PriorityBadge priority={checklist.priority} />
              {checklist.category && (
                <span style={{
                  fontSize: 11, padding: '3px 8px', borderRadius: 6,
                  background: (checklist.category.color || 'var(--accent)') + '20',
                  color: checklist.category.color || 'var(--accent)', fontWeight: 500
                }}>{checklist.category.name}</span>
              )}
            </div>
          </div>
        </div>

        {checklist.description && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            {checklist.description}
          </p>
        )}

        {/* Meta info */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' }}>
          {checklist.assignedTo && <span>👤 {checklist.assignedTo.name}</span>}
          {checklist.createdBy && <span>✏ {checklist.createdBy.name}</span>}
          {checklist.dueDate && (
            <span style={{ color: new Date(checklist.dueDate) < new Date() && checklist.status !== 'completed' ? 'var(--danger)' : 'inherit' }}>
              📅 {new Date(checklist.dueDate).toLocaleDateString('uk-UA')}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* Items */}
        <div>
          <Card padding={0} style={{ overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 16, fontFamily: 'var(--font-heading)' }}>
                  Пункти чеклісту
                </h2>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {completedCount} / {checklist.items.length}
                </span>
              </div>
              <ProgressBar value={checklist.progress} height={8} showLabel />
            </div>
            <div style={{ padding: '8px 16px' }}>
              {checklist.items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  Немає пунктів у цьому чеклісті
                </div>
              ) : (
                checklist.items
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <CheckItem
                      key={item._id}
                      item={item}
                      onToggle={handleToggle}
                      loading={togglingId === item._id}
                    />
                  ))
              )}
            </div>
          </Card>

          {/* Comments */}
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 16, fontFamily: 'var(--font-heading)' }}>
                Коментарі ({checklist.comments?.length || 0})
              </h2>
            </div>
            <div style={{ padding: 20 }}>
              {checklist.comments?.map((c, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, marginBottom: 16,
                  paddingBottom: 16, borderBottom: i < checklist.comments.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 13, fontWeight: 700
                  }}>{c.author?.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{c.author?.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{c.text}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {new Date(c.createdAt).toLocaleString('uk-UA')}
                    </div>
                  </div>
                </div>
              ))}
              <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                <Textarea
                  placeholder="Залишити коментар..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  style={{ minHeight: 60 }}
                />
                <Button type="submit" loading={submittingComment} size="sm" style={{ alignSelf: 'flex-end' }}>
                  Додати коментар
                </Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 600, letterSpacing: '0.5px' }}>
              ПРОГРЕС
            </h3>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', margin: '0 auto 16px',
              background: `conic-gradient(var(--success) ${checklist.progress * 3.6}deg, var(--bg-elevated) 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
            }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%',
                background: 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-heading)',
                color: checklist.progress === 100 ? 'var(--success)' : 'var(--text-primary)'
              }}>{checklist.progress}%</div>
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
              {completedCount} з {checklist.items.length} виконано
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 600, letterSpacing: '0.5px' }}>
              ДЕТАЛІ
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Статус', value: <StatusBadge status={checklist.status} /> },
                { label: 'Пріоритет', value: <PriorityBadge priority={checklist.priority} /> },
                { label: 'Призначено', value: checklist.assignedTo?.name || '—' },
                { label: 'Автор', value: checklist.createdBy?.name || '—' },
                { label: 'Дедлайн', value: checklist.dueDate ? new Date(checklist.dueDate).toLocaleDateString('uk-UA') : '—' },
                { label: 'Категорія', value: checklist.category?.name || '—' }
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: 13 }}>{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {checklist.tags?.length > 0 && (
            <Card>
              <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, letterSpacing: '0.5px' }}>ТЕГИ</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {checklist.tags.map(t => (
                  <span key={t._id} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 20,
                    background: (t.color || 'var(--accent)') + '20',
                    color: t.color || 'var(--accent)', fontWeight: 500
                  }}>#{t.name}</span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
