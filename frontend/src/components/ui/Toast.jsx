import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  const colors = {
    success: 'var(--success)', error: 'var(--danger)',
    warning: 'var(--warning)', info: 'var(--accent)'
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9000,
        display: 'flex', flexDirection: 'column', gap: 10
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--bg-elevated)',
            border: `1px solid ${colors[t.type]}40`,
            borderLeft: `3px solid ${colors[t.type]}`,
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            color: 'var(--text-primary)',
            fontSize: 13, fontWeight: 500,
            boxShadow: 'var(--shadow-lg)',
            minWidth: 240, maxWidth: 360,
            animation: 'slideIn 0.3s ease'
          }}>
            <span style={{ color: colors[t.type], fontSize: 16 }}>{icons[t.type]}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
