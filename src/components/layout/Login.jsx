import React, { useState } from 'react';
import { authenticate } from '../../data/mockAuth';
import Icon from '../ui/Icon';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Por favor ingresa tu usuario y contraseña.');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const user = authenticate(username, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Credenciales incorrectas. Intenta de nuevo.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--bg-main) 0%, var(--bg-row) 100%)',
      padding: '1.5rem'
    }}>
      <div className="animate-fade-in" style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-primary)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
        border: '1px solid var(--border-light)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
        }}>
          <Icon name="graduation-cap" size={32} color="#ffffff" />
        </div>
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
          Plataforma Educativa
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 2rem 0', fontWeight: '500' }}>
          Inicia sesión para continuar
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ej. docente"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '1.5px solid var(--border-light)',
                background: 'var(--bg-row)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontWeight: '600',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '1.5px solid var(--border-light)',
                background: 'var(--bg-row)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontWeight: '600',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
            />
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--color-warn)', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              <Icon name="alert-triangle" size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--color-primary)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: '800',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              opacity: isLoading ? 0.8 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
          Cuentas demo:<br/>
          docente / 123 | director / 123
        </div>
      </div>
    </div>
  );
}
