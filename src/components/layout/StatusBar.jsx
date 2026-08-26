import React from 'react';
import Badge from '../ui/Badge';

export default function StatusBar({ currentGroup, totalStudents, checkedCount }) {
  return (
    <div style={{
      background: 'rgba(19, 27, 46, 0.6)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '0.5rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      fontSize: '0.85rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Badge type="success" icon="🟢">
          Conectado: Prefectura en Tiempo Real
        </Badge>
        <span style={{ color: 'var(--text-secondary)' }}>
          🏫 <strong>Plan SEP (NEM):</strong> Ciclo Escolar 2026-2027 • Fase 6
        </span>
      </div>

      {currentGroup && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            📊 Progreso del Grupo: <strong style={{ color: '#ffffff' }}>{checkedCount} / {totalStudents}</strong> registrados
          </span>
          <div style={{
            width: '100px',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${totalStudents > 0 ? (checkedCount / totalStudents) * 100 : 0}%`,
              height: '100%',
              background: 'var(--grad-primary)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
