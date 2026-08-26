import React from 'react';
import Badge from '../ui/Badge';

export default function DirectorPrivacyTemplate({ student, visibility, onToggleVisibility }) {
  if (!student) return null;

  const cards = [
    { id: 'grades', title: '📇 Tarjeta 1: Promedios y Calificaciones SEP', desc: 'Muestra el promedio oficial por asignatura (Ej: Matemáticas 8.5).', default: true },
    { id: 'behavior', title: '🚦 Tarjeta 2: Semáforo de Conducta y Asistencia (Resumen IA)', desc: 'Porcentaje general de asistencia y sello positivo del mes sin mostrar detalles de faltas menores.', default: true },
    { id: 'achievements', title: '🏆 Tarjeta 3: Logros, Felicitaciones y Destacados', desc: 'Reconocimientos cuando el alumno es marcado con 🎯 o ⚡ consecutivamente.', default: true },
    { id: 'socialNotes', title: '🏥 Tarjeta 4: Notas Confidenciales de Trabajo Social / Salud', desc: 'Adecuaciones socioeconómicas, alergias o situación familiar vulnerable. (Recomendado: APAGADO para padres).', default: false, sensitive: true },
    { id: 'aiAlerts', title: '🚨 Tarjeta 5: Focos Rojos Predictivos de Deserción (IA)', desc: 'Análisis interno de riesgo conductual o bajo rendimiento acumulado. (Recomendado: APAGADO para padres).', default: false, sensitive: true }
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="glass-panel" style={{
        padding: '1.5rem',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(19, 27, 46, 0.9) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem' }}>👑</span>
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#ffffff' }}>
              Dirección y Subdirección: Configuración de Plantilla Pública para Padres
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              Control total del plantel: Enciende o apaga interruptores para decidir qué tarjetas de información verán los padres de familia en su portal web al consultar a <strong>{student.name}</strong>.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {cards.map(card => {
          const isVisible = visibility[card.id];

          return (
            <div
              key={card.id}
              onClick={() => onToggleVisibility(card.id)}
              className="glass-panel touch-target"
              style={{
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                background: isVisible ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: isVisible ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>
                    {card.title}
                  </h4>
                  {card.sensitive && (
                    <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>
                      🔒 Confidencial / Interno
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                  {card.desc}
                </p>
              </div>

              {/* Toggle Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isVisible ? '#34d399' : '#64748b' }}>
                  {isVisible ? '🟢 PÚBLICO (PADRES VEO)' : '⚫ OCULTO (SOLO DOCENTES)'}
                </span>
                <div style={{
                  width: '56px',
                  height: '30px',
                  background: isVisible ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  position: 'relative',
                  transition: 'background 0.3s ease',
                  padding: '3px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    transform: isVisible ? 'translateX(26px)' : 'translateX(0)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
