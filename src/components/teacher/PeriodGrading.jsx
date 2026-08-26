import React, { useState } from 'react';
import Icon from '../ui/Icon';

export default function PeriodGrading({ group, onUpdateStudent, showToast }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize editable grades state from students data
  // Using historicalAverages.grade as base, modified by recent daily grade if present
  const [finalGrades, setFinalGrades] = useState(() => {
    const grades = {};
    group.students.forEach(s => {
      let calcGrade = parseFloat(s.historicalAverages.grade);
      if (s.gradeNumber) {
        // Average historical with recent daily grade for demonstration
        calcGrade = (calcGrade + parseFloat(s.gradeNumber)) / 2;
      }
      grades[s.id] = calcGrade.toFixed(1);
    });
    return grades;
  });

  const [comments, setComments] = useState({});

  if (!group) return null;

  const handleGradeChange = (studentId, val) => {
    setFinalGrades(prev => ({ ...prev, [studentId]: val }));
  };

  const handleCommentChange = (studentId, val) => {
    setComments(prev => ({ ...prev, [studentId]: val }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Save grades to student data
      group.students.forEach(s => {
        onUpdateStudent(s.id, {
          finalPeriodGrade: finalGrades[s.id],
          finalPeriodComment: comments[s.id] || ''
        });
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (showToast) showToast('✅ Calificaciones del periodo enviadas al sistema exitosamente.');
    }, 1500);
  };

  // Group Stats
  const avgGrade = (Object.values(finalGrades).reduce((acc, val) => acc + parseFloat(val || 0), 0) / group.students.length).toFixed(1);
  const avgAttendance = Math.floor(group.students.reduce((acc, s) => acc + s.historicalAverages.attendance, 0) / group.students.length);

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem 6rem 1rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '0 0 0.25rem 0', fontWeight: '800' }}>
          Cierre de Periodo
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          Revisa y envía las calificaciones finales del {group.grade}{group.group} para consulta de tutores.
        </p>
      </div>

      {/* Group Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Icon name="award" size={24} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
          <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-primary)', lineHeight: 1 }}>{avgGrade}</span>
          <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.3rem', letterSpacing: '0.05em' }}>Promedio Final</span>
        </div>
        <div style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Icon name="users" size={24} color="var(--color-ok)" style={{ marginBottom: '0.5rem' }} />
          <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-ok)', lineHeight: 1 }}>{avgAttendance}%</span>
          <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.3rem', letterSpacing: '0.05em' }}>Asistencia Global</span>
        </div>
      </div>

      {isSubmitted ? (
        <div style={{ background: 'var(--bg-ok)', border: '1px solid var(--color-ok)', borderRadius: '16px', padding: '2rem 1.5rem', textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ffffff', color: 'var(--color-ok)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)' }}>
            <Icon name="check" size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-ok)', margin: '0 0 0.5rem 0' }}>¡Enviado Oficialmente!</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, opacity: 0.9 }}>
            Las calificaciones y comentarios del periodo han sido bloqueados y publicados en el Portal de Padres.
          </p>
        </div>
      ) : (
        <>
          {/* Student List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Lista de Alumnos ({group.students.length})
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Calif. Final
              </span>
            </div>

            {group.students.map(student => (
              <div key={student.id} style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-mobile)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                      {student.avatar}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>
                        {student.name.split(',')[0]}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {student.name.split(',')[1]}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)' }}>Asistencia</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-ok)' }}>{student.historicalAverages.attendance}%</span>
                    </div>
                    <input 
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={finalGrades[student.id] || ''}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      style={{ width: '60px', padding: '0.5rem', borderRadius: '8px', border: '2px solid var(--border-primary)', background: 'var(--bg-mobile)', fontSize: '1rem', fontWeight: '800', color: 'var(--color-primary)', textAlign: 'center', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Optional Comment Input */}
                <input 
                  type="text"
                  placeholder="Agregar comentario para el boletín del tutor (Opcional)..."
                  value={comments[student.id] || ''}
                  onChange={(e) => handleCommentChange(student.id, e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'transparent', fontSize: '0.75rem', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>
            ))}
          </div>

          {/* Fixed Submit Button */}
          <div style={{ position: 'fixed', bottom: '70px', left: 0, right: 0, padding: '1rem', background: 'var(--bg-mobile)', borderTop: '1px solid var(--border-light)', zIndex: 10 }}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: 'none', background: 'var(--color-primary)', color: '#ffffff', fontSize: '0.9rem', fontWeight: '800', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? (
                <>
                  <Icon name="loader" size={20} className="spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Icon name="send" size={20} />
                  <span>Aprobar y Enviar</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
