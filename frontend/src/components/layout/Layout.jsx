import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ToastProvider } from '../ui/Toast.jsx';

const navItems = [
  { to: '/', icon: '◈', label: 'Дашборд', exact: true },
  { to: '/checklists', icon: '☑', label: 'Чеклісти' },
  { to: '/templates', icon: '⊡', label: 'Шаблони' },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <ToastProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, display: 'none' }}
          />
        )}

        {/* Sidebar */}
        <aside style={{
          width: collapsed ? 68 : 240,
          minWidth: collapsed ? 68 : 240,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden', zIndex: 50
        }}>
          {/* Logo */}
          <div style={{
            padding: '20px 16px', display: 'flex', alignItems: 'center',
            gap: 12, borderBottom: '1px solid var(--border)',
            height: 64, flexShrink: 0
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0, boxShadow: '0 0 20px var(--accent-muted)'
            }}>☑</div>
            {!collapsed && (
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px' }}>CheckFlow</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>АВТОМАТИЗАЦІЯ</div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                marginLeft: 'auto', background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16,
                padding: 4, borderRadius: 6, flexShrink: 0,
                transition: 'color var(--transition)'
              }}
            >{collapsed ? '»' : '«'}</button>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
            {!collapsed && (
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1px', padding: '4px 8px 8px', fontWeight: 600 }}>
                НАВІГАЦІЯ
              </div>
            )}
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: collapsed ? '10px 14px' : '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-muted)' : 'transparent',
                  marginBottom: 2, fontWeight: 500, fontSize: 14,
                  transition: 'all var(--transition)',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  textDecoration: 'none', position: 'relative'
                })}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div style={{
                        position: 'absolute', left: 0, top: 8, bottom: 8,
                        width: 3, background: 'var(--accent)',
                        borderRadius: '0 3px 3px 0'
                      }} />
                    )}
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}

            {isAdmin() && (
              <>
                {!collapsed && (
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1px', padding: '12px 8px 8px', fontWeight: 600 }}>
                    АДМІНІСТРУВАННЯ
                  </div>
                )}
                <NavLink
                  to="/admin"
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: collapsed ? '10px 14px' : '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--danger)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--danger-muted)' : 'transparent',
                    marginBottom: 2, fontWeight: 500, fontSize: 14,
                    transition: 'all var(--transition)',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    textDecoration: 'none'
                  })}
                >
                  <span style={{ fontSize: 18 }}>⚙</span>
                  {!collapsed && <span>Адміністрація</span>}
                </NavLink>
              </>
            )}
          </nav>

          {/* User */}
          <div style={{ padding: 8, borderTop: '1px solid var(--border)' }}>
            <NavLink
              to="/profile"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                textDecoration: 'none', transition: 'background var(--transition)',
                justifyContent: collapsed ? 'center' : 'flex-start'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0
              }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              {!collapsed && (
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.role}</div>
                </div>
              )}
            </NavLink>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '8px 14px' : '8px 12px',
                borderRadius: 'var(--radius-sm)', width: '100%',
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                transition: 'all var(--transition)',
                justifyContent: collapsed ? 'center' : 'flex-start'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-muted)'; e.currentTarget.style.color = 'var(--danger)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <span style={{ fontSize: 16 }}>⇥</span>
              {!collapsed && 'Вийти'}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: '32px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
