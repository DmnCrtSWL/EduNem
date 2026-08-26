import React from 'react';
import Icon from '../ui/Icon';

export default function Navbar({ activeRole, onRoleChange, theme, onToggleTheme, onLogout, currentUser }) {
  return (
    <header className="desktop-top-bar" style={{ borderBottom: '1px solid #334155', background: '#0f172a' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>
          SEP
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '800', letterSpacing: '-0.02em', color: '#f8fafc' }}>
            EduNEM Pro • Ecosistema Digital
          </h1>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>
            Secundaria Técnica #45 Vicente Guerrero • Michoacán
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* User Info & Logout */}
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
                <Icon name="user" size={16} color="#ffffff" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#f8fafc', lineHeight: 1.2 }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  {currentUser.role === 'teacher' ? 'Docente' : currentUser.role === 'director' ? 'Director' : currentUser.role === 'parent' ? 'Padre de Familia' : 'Trabajo Social'}
                </span>
              </div>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: '#334155' }}></div>
            
            <button
              onClick={onLogout}
              style={{
                background: 'transparent',
                color: '#ef4444',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0'
              }}
            >
              <span>Salir</span>
            </button>
          </div>
        )}

        {/* Minimalist Theme Switcher */}
        <button
          onClick={onToggleTheme}
          title="Alternar entre Modo Claro y Modo Oscuro"
          style={{
            background: theme === 'dark' ? '#334155' : '#e2e8f0',
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            border: 'none',
            padding: '0.5rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={15} color={theme === 'dark' ? '#60a5fa' : '#d97706'} />
          <span>{theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
        </button>
      </div>
    </header>
  );
}
