import React, { useState } from 'react';
import Button from '../ui/Button';

export default function SOSModal({ student, action, onClose, onConfirm }) {
  const [comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!student || !action) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onConfirm(student, action, comment);
    }, 800);
  };

  const isDiscipline = action.id === 'discipline';

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        background: '#131b2e',
        border: isDiscipline ? '2px solid #ef4444' : '2px solid #3b82f6',
        width: '100%',
        maxWidth: '350px',
        padding: '1.5rem',
        boxShadow: isDiscipline ? '0 0 40px rgba(239, 68, 68, 0.4)' : '0 0 40px rgba(59, 130, 246, 0.4)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
          {action.icon}
        </div>

        <h3 style={{ fontSize: '1.5rem', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          {action.label}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          ¿Estás seguro de enviar esta notificación en tiempo real para el alumno <strong>{student.name}</strong> (#{student.listNumber})?
        </p>

        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '600' }}>
            💬 Nota rápida opcional para {isDiscipline ? 'Prefectura' : 'Orientación'} (Máx 2 líneas):
          </label>
          <input
            type="text"
            placeholder={isDiscipline ? 'Ej: Salió del aula sin autorización / Falta de respeto...' : 'Ej: Dolor de cabeza severo / Solicita ver a su tutor...'}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--bg-glass-border)',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant={isDiscipline ? 'sos' : 'ai'}
            size="md"
            fullWidth
            onClick={handleSend}
            disabled={isSending}
            icon="🚨"
          >
            {isSending ? 'Notificando...' : 'Confirmar Alerta (1-Tap)'}
          </Button>
        </div>
      </div>
    </div>
  );
}
