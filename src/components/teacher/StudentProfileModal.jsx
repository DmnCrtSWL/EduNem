import React, { useState } from 'react';
import Icon from '../ui/Icon';

export default function StudentProfileModal({ student, group, monthlyPlans, onClose, onUpdateStudent, onTriggerSOS }) {
  const [activeTab, setActiveTab] = useState('registro'); // 'registro', 'expediente', 'evaluacion'
  
  // Tab 1: Registro (EmojiPicker logic)
  const [note, setNote] = useState(student ? student.teacherNote || '' : '');
  const [attendance, setAttendance] = useState(student ? student.attendance || 'present' : 'present');
  const [mood, setMood] = useState(student ? student.mood || 'normal' : 'normal');
  const [performance, setPerformance] = useState(student ? student.performance || 'normal' : 'normal');
  const [confirmSOS, setConfirmSOS] = useState(null);

  // Tab 3: Evaluación (Grading logic)
  const [gradeRubric, setGradeRubric] = useState(student ? student.gradeRubric || '' : ''); // 'logrado', 'proceso', 'apoyo'
  const [gradeNumber, setGradeNumber] = useState(student ? student.gradeNumber || '' : '');

  if (!student) return null;

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > 150;

  const handleSaveRegistro = () => {
    if (isOverLimit) return;
    const isException = attendance === 'absent' || mood !== 'normal' || performance !== 'normal';
    onUpdateStudent(student.id, {
      attendance: attendance,
      mood: mood,
      performance: performance,
      teacherNote: note.trim(),
      status: isException ? 'exception' : 'ok'
    });
    onClose();
  };

  const handleSaveEvaluacion = () => {
    onUpdateStudent(student.id, {
      gradeRubric,
      gradeNumber
    });
    onClose();
  };

  const handleSelectQuickPreset = (presetMood, presetPerf) => {
    setMood(presetMood);
    setPerformance(presetPerf);
    setAttendance('present');
    onUpdateStudent(student.id, {
      attendance: 'present',
      mood: presetMood,
      performance: presetPerf,
      teacherNote: note.trim(),
      status: 'exception'
    });
    onClose();
  };

  const handleConfirmSOSAction = () => {
    if (confirmSOS) {
      onTriggerSOS(student, confirmSOS);
      setConfirmSOS(null);
      onClose();
    }
  };

  // Get active lesson plan details for grading
  const groupPlan = monthlyPlans && group ? monthlyPlans[group.id] : null;
  const activePlan = groupPlan && groupPlan.status === 'approved' ? groupPlan.proposedPlan : null;
  let activeActivity = null;
  if (activePlan && activePlan.activities && activePlan.activities.length > 1) {
    activeActivity = activePlan.activities[1]; // Usually "Desarrollo" is the main activity to grade
  }

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet-content" style={{ position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
        {/* Drag Handle */}
        <div style={{ width: '40px', height: '4px', background: 'var(--border-light)', borderRadius: '10px', margin: '0 auto 1rem auto', flexShrink: 0 }} />

        {/* Student Info Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '0', flexShrink: 0 }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Alumno #{student.listNumber}
            </span>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '0.15rem 0 0 0', fontWeight: '800' }}>
              {student.name}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0 0.25rem' }}>
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '1.25rem', flexShrink: 0 }}>
          <button 
            onClick={() => setActiveTab('registro')}
            style={{ flex: 1, padding: '0.6rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'registro' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'registro' ? 'var(--color-primary)' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Registro
          </button>
          <button 
            onClick={() => setActiveTab('expediente')}
            style={{ flex: 1, padding: '0.6rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'expediente' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'expediente' ? 'var(--color-primary)' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Expediente 360°
          </button>
          <button 
            onClick={() => setActiveTab('evaluacion')}
            style={{ flex: 1, padding: '0.6rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'evaluacion' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'evaluacion' ? 'var(--color-primary)' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Evaluación
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.2rem' }} className="animate-fade-in">

          {/* TAB 1: REGISTRO DIARIO */}
          {activeTab === 'registro' && (
            <div>
              {/* 1. Attendance Toggle */}
              <div style={{ marginBottom: '1.15rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                  1. Asistencia del día:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setAttendance('present')}
                    style={{
                      flex: 1, padding: '0.65rem', borderRadius: '10px',
                      border: attendance === 'present' ? '2px solid var(--color-ok)' : '1px solid var(--border-light)',
                      background: attendance === 'present' ? 'var(--bg-ok)' : 'var(--bg-row)',
                      color: attendance === 'present' ? 'var(--color-ok)' : 'var(--text-muted)',
                      fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                    }}
                  >
                    <Icon name="check" size={16} />
                    <span>Presente (Default)</span>
                  </button>
                  <button
                    onClick={() => setAttendance('absent')}
                    style={{
                      flex: 1, padding: '0.65rem', borderRadius: '10px',
                      border: attendance === 'absent' ? '2px solid var(--color-danger)' : '1px solid var(--border-light)',
                      background: attendance === 'absent' ? 'var(--bg-danger)' : 'var(--bg-row)',
                      color: attendance === 'absent' ? 'var(--color-danger)' : 'var(--text-muted)',
                      fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                    }}
                  >
                    <Icon name="user-x" size={16} />
                    <span>Falta / Inasistencia</span>
                  </button>
                </div>
              </div>

              {/* 2. Short Teacher Note */}
              <div style={{ marginBottom: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Icon name="file-text" size={14} />
                    <span>2. Nota Corta del Docente (Opcional):</span>
                  </label>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: isOverLimit ? 'var(--color-danger)' : wordCount > 120 ? 'var(--color-warn)' : 'var(--text-muted)' }}>
                    {wordCount} / 150 palabras
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Ej: No entregó tarea / Excelente participación / Comentó indisposición médica leve..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: isOverLimit ? '2px solid var(--color-danger)' : '1px solid var(--border-light)', background: 'var(--bg-row)', fontSize: '0.85rem', color: 'var(--text-main)', fontFamily: 'inherit', outline: 'none', resize: 'none', transition: 'border-color 0.15s ease' }}
                />
                {isOverLimit && (
                  <span style={{ display: 'block', color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.2rem', fontWeight: '600' }}>
                    ⚠️ Has superado el límite de 150 palabras para mantener la agilidad del registro.
                  </span>
                )}
              </div>

              {/* 3. Quick Utility Presets */}
              <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                3. Reacción y Comportamiento Humano (1-Tap):
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button
                  onClick={() => handleSelectQuickPreset('energetic', 'excellent')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--bg-row)', border: '1px solid var(--border-light)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease' }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
                    <Icon name="star" size={20} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: '700' }}>Destacado / Participación Activa</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Dominó el tema en clase o apoyó a sus compañeros</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectQuickPreset('sad', 'doubts')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--bg-warn)', border: '1px solid var(--border-warn)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--color-warn)', fontWeight: '600', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease' }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ca8a04', flexShrink: 0 }}>
                    <Icon name="help-circle" size={20} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: '700' }}>Distraído / Bajo Ánimo / Dudas</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Requiere reforzamiento pedagógico o apoyo emocional</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectQuickPreset('normal', 'difficulty')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--bg-danger)', border: '1px solid var(--border-danger)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--color-danger)', fontWeight: '600', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s ease' }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', flexShrink: 0 }}>
                    <Icon name="alert-triangle" size={20} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontWeight: '700' }}>Dificultad Mayor / No Entregó</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>No realizó la actividad asignada en el aula</span>
                  </div>
                </button>
              </div>

              {/* SOS Direct Action */}
              <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-danger)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                4. Alerta Inmediata a Prefectura / Dirección:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button
                  onClick={() => setConfirmSOS({ id: 'discipline', label: 'Indisciplina / Salió sin permiso', icon: 'shield-alert', color: 'var(--color-danger)', bg: 'var(--bg-danger)' })}
                  style={{ flex: 1, padding: '0.7rem', background: 'var(--bg-danger)', border: '1px solid var(--border-danger)', borderRadius: '10px', color: 'var(--color-danger)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Icon name="shield-alert" size={16} />
                  <span>Aviso Indisciplina</span>
                </button>

                <button
                  onClick={() => setConfirmSOS({ id: 'health', label: 'Enfermería / Salud', icon: 'heart-pulse', color: 'var(--color-info)', bg: 'var(--bg-info)' })}
                  style={{ flex: 1, padding: '0.7rem', background: 'var(--bg-info)', border: '1px solid var(--border-info)', borderRadius: '10px', color: 'var(--color-info)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Icon name="heart-pulse" size={16} />
                  <span>Aviso Enfermería</span>
                </button>
              </div>

              {/* Save button */}
              <button onClick={handleSaveRegistro} disabled={isOverLimit} className="btn-mobile btn-mobile-primary" style={{ opacity: isOverLimit ? 0.5 : 1, cursor: isOverLimit ? 'not-allowed' : 'pointer' }}>
                <Icon name="check" size={18} />
                <span>Guardar Asistencia y Nota del Docente</span>
              </button>
            </div>
          )}

          {/* TAB 2: EXPEDIENTE 360 */}
          {activeTab === 'expediente' && (
            <div style={{ paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, background: 'var(--bg-row)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Promedio SEP</span>
                  <span style={{ display: 'block', fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-primary)' }}>{student.historicalAverages.grade}</span>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-row)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Asistencia</span>
                  <span style={{ display: 'block', fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-ok)' }}>{student.historicalAverages.attendance}%</span>
                </div>
              </div>

              {student.socialNote && !student.socialNote.includes('Ninguna') && (
                <div style={{ background: 'var(--bg-info)', border: '1px solid var(--border-info)', padding: '0.85rem 1rem', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--color-info)', marginBottom: '1rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <Icon name="users" size={18} color="var(--color-info)" style={{ marginTop: '0.1rem' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nota de Trabajo Social:</strong>
                    {student.socialNote}
                  </div>
                </div>
              )}

              <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comentarios de otros docentes</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {student.comments && student.comments.length > 0 ? (
                  student.comments.map((comment, i) => (
                    <div key={i} style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{comment.author}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{comment.date}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.4 }}>"{comment.text}"</p>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-light)', fontSize: '0.85rem', fontStyle: 'italic', border: '1px dashed var(--border-light)', borderRadius: '10px' }}>
                    No hay comentarios recientes de otros docentes.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EVALUACIÓN */}
          {activeTab === 'evaluacion' && (
            <div>
              {activePlan ? (
                <>
                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Icon name="calendar" size={16} color="var(--color-primary)" />
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Planeación Activa
                      </span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>
                      {activeActivity ? activeActivity.desc : 'Actividad General de la Clase'}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Evalúa el desempeño de {student.name.split(' ')[0]} en esta actividad específica.
                    </span>
                  </div>

                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    Rúbrica Formativa:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <button
                      onClick={() => setGradeRubric('logrado')}
                      style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: gradeRubric === 'logrado' ? 'var(--bg-ok)' : 'var(--bg-row)', border: gradeRubric === 'logrado' ? '2px solid var(--color-ok)' : '1px solid var(--border-light)', color: gradeRubric === 'logrado' ? 'var(--color-ok)' : 'var(--text-main)', fontSize: '0.85rem', fontWeight: '700', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.15s ease' }}
                    >
                      <Icon name="check-circle" size={18} />
                      Logro Esperado (Completó la actividad)
                    </button>
                    <button
                      onClick={() => setGradeRubric('proceso')}
                      style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: gradeRubric === 'proceso' ? 'var(--bg-warn)' : 'var(--bg-row)', border: gradeRubric === 'proceso' ? '2px solid var(--color-warn)' : '1px solid var(--border-light)', color: gradeRubric === 'proceso' ? 'var(--color-warn)' : 'var(--text-main)', fontSize: '0.85rem', fontWeight: '700', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.15s ease' }}
                    >
                      <Icon name="clock" size={18} />
                      En Proceso (Incompleto o con dudas)
                    </button>
                    <button
                      onClick={() => setGradeRubric('apoyo')}
                      style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: gradeRubric === 'apoyo' ? 'var(--bg-danger)' : 'var(--bg-row)', border: gradeRubric === 'apoyo' ? '2px solid var(--color-danger)' : '1px solid var(--border-light)', color: gradeRubric === 'apoyo' ? 'var(--color-danger)' : 'var(--text-main)', fontSize: '0.85rem', fontWeight: '700', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.15s ease' }}
                    >
                      <Icon name="alert-circle" size={18} />
                      Requiere Apoyo (No logró el objetivo)
                    </button>
                  </div>

                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    Calificación Numérica (0-10):
                  </label>
                  <input 
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={gradeNumber}
                    onChange={(e) => setGradeNumber(e.target.value)}
                    placeholder="Ej: 8.5"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-row)', fontSize: '1rem', color: 'var(--text-main)', fontWeight: '700', outline: 'none', marginBottom: '1.25rem' }}
                  />

                  <button onClick={handleSaveEvaluacion} className="btn-mobile btn-mobile-primary">
                    <Icon name="save" size={18} />
                    <span>Guardar Evaluación</span>
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                  <Icon name="calendar" size={32} style={{ opacity: 0.5, margin: '0 auto 1rem auto' }} />
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                    No hay una planeación activa o aprobada para el grupo de hoy. Genera y aprueba tu planeación en la pestaña "Planeación Inteligente" para poder evaluar esta actividad.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Confirmation Modal for SOS Alerts (Sin recortar por contenedor) */}
      {confirmSOS && (
        <div className="bottom-sheet-overlay" style={{
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)'
        }} onClick={() => setConfirmSOS(null)}>
          <div style={{ background: 'var(--bg-mobile)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '1.25rem', width: '100%', maxWidth: '290px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: confirmSOS.bg, color: confirmSOS.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
              <Icon name={confirmSOS.icon} size={24} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.4rem 0' }}>¿Estás seguro?</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
              ¿Deseas enviar un <strong>{confirmSOS.label}</strong> inmediato para <strong style={{ color: 'var(--text-main)' }}>{student.name}</strong>? Se notificará al instante a Prefectura / Dirección.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => setConfirmSOS(null)} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-row)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleConfirmSOSAction} style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none', background: confirmSOS.color, color: '#ffffff', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                Enviar Alerta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
