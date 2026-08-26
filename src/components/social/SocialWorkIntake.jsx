import React, { useState } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function SocialWorkIntake({ student, onSaveNote }) {
  const [note, setNote] = useState(student ? student.socialNote : '');
  const [hasInternet, setHasInternet] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!student) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveNote(student.id, note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-panel" style={{
        padding: '1.5rem',
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(19, 27, 46, 0.9) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem' }}>🤝</span>
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#ffffff' }}>
              Trabajo Social: Expediente 360° Socio-Familiar
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
              Captura el contexto económico, familiar y de salud del alumno <strong>{student.name}</strong>. Esta información ayuda a la IA a sugerir planeaciones con empatía y sin pedir internet o materiales costosos.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>{student.avatar}</span>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>{student.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Lista #{student.listNumber} • Promedio SEP: {student.historicalAverages.grade}
            </p>
          </div>
          <Badge type="info" style={{ marginLeft: 'auto' }}>Entrevista en Curso</Badge>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#f0f4ff', fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            📝 Nota Confidencial para Docentes (Contexto en Aula):
          </label>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ej: Sin internet en casa, cuidado por abuelos, alergia severa al polvo..."
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--bg-glass-border)',
              borderRadius: '12px',
              padding: '1rem',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-body)',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        <div className="grid-cols-2" style={{ marginBottom: '1.75rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>🌐 Conectividad en Hogar:</span>
            <span style={{ color: '#ffffff', fontWeight: '600' }}>Sin internet fijo (Solo datos prepago limitados)</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>🏥 Alergias / Salud:</span>
            <span style={{ color: '#ffffff', fontWeight: '600' }}>Reporte médico al día en enfermería</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          {isSaved && <Badge type="success" icon="✓">¡Expediente Actualizado!</Badge>}
          <Button type="submit" variant="primary" size="md" icon="💾">
            Guardar Expediente 360°
          </Button>
        </div>
      </form>
    </div>
  );
}
