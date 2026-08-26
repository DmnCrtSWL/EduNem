import React, { useState } from 'react';
import Badge from '../ui/Badge';

export default function ParentPortal({ student, visibility }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  if (!student) return null;

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '3rem 1.5rem', maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🇲🇽</div>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>Portal Padres de Familia</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Secundaria Técnica #45 • Consulta en Línea SEP
          </p>
          <input
            type="email"
            defaultValue="tutor.mateo@gmail.com"
            disabled
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--bg-glass-border)', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem', fontSize: '0.9rem' }}
          />
          <input
            type="password"
            defaultValue="••••••••••••"
            disabled
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--bg-glass-border)', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1.5rem', fontSize: '0.9rem' }}
          />
          <button
            onClick={() => setIsLoggedIn(true)}
            style={{ width: '100%', padding: '0.85rem', background: 'var(--grad-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
          >
            Iniciar Sesión (Padre / Tutor)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '950px', margin: '0 auto' }}>
      {/* Welcome Header */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(19, 27, 46, 0.9) 100%)',
        border: '1px solid rgba(167, 139, 250, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>{student.avatar}</span>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#c4b5fd', fontWeight: '700' }}>BIENVENIDO FAMILIA GARCÍA</span>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#ffffff' }}>
              Expediente Escolar: {student.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              Secundaria Técnica #45 • Ciclo SEP 2026-2027
            </p>
          </div>
        </div>
        <Badge type="ai" icon="🛡️">Portal Protegido SEP</Badge>
      </div>

      <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>🔒 <strong>Nota de Privacidad:</strong> La información mostrada aquí es seleccionada y aprobada por la Dirección del plantel para el acompañamiento familiar en casa.</span>
      </div>

      {/* Grid of Public Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {visibility.grades && (
          <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', background: 'var(--bg-card)', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>📇 Calificaciones y Promedio Oficial SEP</h3>
              <Badge type="success">Promedio: {student.historicalAverages.grade}</Badge>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
              Avance del alumno en los 4 Campos Formativos de la Nueva Escuela Mexicana (NEM):
            </p>
            <div className="grid-cols-2">
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Saberes y Pensamiento Científico:</span> <strong style={{ color: '#fff', float: 'right' }}>8.5</strong>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Lenguajes (Español/Inglés):</span> <strong style={{ color: '#fff', float: 'right' }}>9.0</strong>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Ética, Naturaleza y Sociedades:</span> <strong style={{ color: '#fff', float: 'right' }}>8.8</strong>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>De lo Humano y lo Comunitario:</span> <strong style={{ color: '#fff', float: 'right' }}>9.2</strong>
              </div>
            </div>
          </div>
        )}

        {visibility.behavior && (
          <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', background: 'var(--bg-card)', borderLeft: '4px solid #fbbf24' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>🚦 Semáforo de Conducta y Asistencia</h3>
              <Badge type="warning">Asistencia: {student.historicalAverages.attendance}%</Badge>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              El alumno mantiene una conducta constructiva en aula. Se registra puntualidad constante en las sesiones vespertinas.
            </p>
          </div>
        )}

        {visibility.achievements && (
          <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', background: 'var(--bg-card)', borderLeft: '4px solid #a78bfa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>🏆 Felicitaciones y Logros Destacados</h3>
              <Badge type="ai">⭐ Destacado del Mes</Badge>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Felicitación por parte del docente de Matemáticas debido a su participación entusiasta ⚡ en la resolución de problemas en el pizarrón.
            </p>
          </div>
        )}

        {visibility.socialNotes && (
          <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', background: 'var(--bg-card)', borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#60a5fa', margin: '0 0 0.5rem 0' }}>🏥 Notas de Trabajo Social y Salud</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              {student.socialNote}
            </p>
          </div>
        )}

        {visibility.aiAlerts && (
          <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', background: 'var(--bg-card)', borderLeft: '4px solid #ef4444' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#f87171', margin: '0 0 0.5rem 0' }}>🚨 Alertas Tempranas IA</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Análisis automático conductual en seguimiento escolar.
            </p>
          </div>
        )}

        {!visibility.grades && !visibility.behavior && !visibility.achievements && !visibility.socialNotes && !visibility.aiAlerts && (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '14px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🔒 Todas las tarjetas han sido marcadas para uso interno por la Dirección.</p>
            <span>Consulte con la oficina del plantel para mayor información.</span>
          </div>
        )}
      </div>
    </div>
  );
}
