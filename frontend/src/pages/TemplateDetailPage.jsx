import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { templateAPI } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PriorityBadge } from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Button from '../components/ui/Button.jsx';

export default function TemplateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isManager } = useAuth();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    templateAPI.getOne(id)
      .then(r => setTemplate(r.data.data))
      .catch(() => navigate('/templates'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><Spinner size={40} /></div>;
  if (!template) return null;

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24, fontSize: 13, color: 'var(--text-muted)' }}>
        <Link to="/templates" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Шаблони</Link>
        <span>›</span><span>{template.title}</span>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, flexShrink: 0,
          background: (template.category?.color || 'var(--accent)') + '25',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30
        }}>{template.category?.icon || '📋'}</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 26, fontFamily: 'var(--font-heading)', marginBottom: 8 }}>{template.title}</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
            <PriorityBadge priority={template.priority} />
            {template.category && (
              <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: (template.category.color || '#6366f1') + '20', color: template.category.color || '#6366f1' }}>
                {template.category.name}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--text-muted)' }}>
            <span>📝 {template.items?.length} пунктів</span>
            {template.estimatedDuration > 0 && <span>⏱ ~{Math.round(template.estimatedDuration / 60)} год</span>}
            <span>📊 {template.usageCount} використань</span>
          </div>
        </div>
        <Link to="/checklists">
          <Button>Використати шаблон</Button>
        </Link>
      </div>

      {template.description && (
        <Card style={{ marginBottom: 20 }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{template.description}</p>
        </Card>
      )}

      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 16, fontFamily: 'var(--font-heading)' }}>Пункти шаблону</h2>
        </div>
        <div style={{ padding: '8px 16px' }}>
          {template.items?.sort((a, b) => a.order - b.order).map((item, i) => (
            <div key={item._id || i} style={{
              display: 'flex', gap: 14, padding: '14px 16px',
              borderBottom: i < template.items.length - 1 ? '1px solid var(--border)' : 'none',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 2,
                border: '2px solid var(--border)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600
              }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: item.description ? 4 : 0 }}>
                  {item.title}
                  {item.isRequired && <span style={{ color: 'var(--danger)', marginLeft: 4, fontSize: 11 }}>*</span>}
                </div>
                {item.description && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.description}</div>}
              </div>
              {item.estimatedTime > 0 && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>⏱ {item.estimatedTime}хв</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {template.tags?.length > 0 && (
        <div style={{ marginTop: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {template.tags.map(t => (
            <span key={t._id} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: (t.color || 'var(--accent)') + '20', color: t.color || 'var(--accent)' }}>#{t.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}
