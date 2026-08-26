import React from 'react';
import Badge from '../ui/Badge';

export default function StudentCard({ student, onClick, isSelected }) {
  const moodEmojis = {
    energetic: { icon: '⚡', label: 'Energético', color: '#fbbf24' },
    normal: { icon: '😊', label: 'Normal', color: '#34d399' },
    sad: { icon: '😔', label: 'Distraído / Triste', color: '#60a5fa' },
    tired: { icon: '😴', label: 'Cansado / Apatía', color: '#94a3b8' }
  };

  const perfEmojis = {
    excellent: { icon: '🎯', label: 'Domina el tema', color: '#a78bfa' },
    normal: { icon: '🟢', label: 'Cumplió normal', color: '#34d399' },
    doubts: { icon: '🟡', label: 'Dudas en clase', color: '#fbbf24' },
    difficulty: { icon: '🔴', label: 'Dificultad / No entregó', color: '#f87171' }
  };

  const currentMood = moodEmojis[student.mood] || moodEmojis.normal;
  const currentPerf = perfEmojis[student.performance] || perfEmojis.normal;

  const isException = student.status === 'exception' || student.performance === 'difficulty' || student.performance === 'doubts' || student.mood === 'sad';
  const isOk = student.status === 'ok';

  let borderColor = '1px solid rgba(255, 255, 255, 0.08)';
  let bgColor = 'var(--bg-card)';
  let boxShadow = 'var(--shadow-sm)';

  if (isException) {
    borderColor = '1px solid rgba(239, 68, 68, 0.5)';
    bgColor = 'rgba(239, 68, 68, 0.08)';
    boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)';
  } else if (isOk) {
    borderColor = '1px solid rgba(16, 185, 129, 0.3)';
    bgColor = 'rgba(16, 185, 129, 0.06)';
  }

  if (isSelected) {
    borderColor = '2px solid #3b82f6';
    boxShadow = '0 0 20px rgba(59, 130, 246, 0.4)';
  }

  return (
    <div
      onClick={() => onClick(student)}
      className="glass-panel touch-target animate-fade-in"
      style={{
        padding: '0.85rem',
        cursor: 'pointer',
        border: borderColor,
        background: bgColor,
        boxShadow: boxShadow,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '115px',
        position: 'relative'
      }}
    >
      {/* Header: List Number, Avatar, and Social Work Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
            #{student.listNumber}
          </span>
          <span style={{ fontSize: '1.4rem' }}>{student.avatar}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {student.socialNote && !student.socialNote.includes('Ninguna') && (
            <span
              title={`Nota de Trabajo Social: ${student.socialNote}`}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                fontSize: '0.75rem',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                fontWeight: '600'
              }}
            >
              🤝 Info
            </span>
          )}
          {student.sosReported && (
            <span style={{
              background: 'rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.75rem',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              border: '1px solid #ef4444',
              fontWeight: '700',
              animation: 'pulseGlow 1.5s infinite'
            }}>
              🚨 SOS
            </span>
          )}
        </div>
      </div>

      {/* Student Name */}
      <div style={{ margin: '0.4rem 0' }}>
        <h4 style={{
          fontSize: '0.9rem',
          margin: 0,
          color: '#ffffff',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {student.name}
        </h4>
      </div>

      {/* Footer: Emoji Status Bar (2-3 Taps Feedback) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.5rem', marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: '0.35rem' }} title={`Ánimo: ${currentMood.label}`}>
          <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
            {currentMood.icon}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }} title={`Aprovechamiento: ${currentPerf.label}`}>
          <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
            {currentPerf.icon}
          </span>
          {student.status === 'ok' && <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700' }}>OK</span>}
        </div>
      </div>
    </div>
  );
}
