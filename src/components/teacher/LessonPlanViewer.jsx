import React, { useState } from 'react';
import Icon from '../ui/Icon';

export default function LessonPlanViewer({ group, monthlyPlans, onUpdateMonthlyPlans, onNavigateToWizard, onApprove }) {
  const [selectedWeekId, setSelectedWeekId] = useState(1);
  const [isSimplifyingDay, setIsSimplifyingDay] = useState(null);
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(null);
  const [editingField, setEditingField] = useState(null); // { dayIdx, field, value }

  if (!group || !monthlyPlans) return null;

  const currentMonthData = monthlyPlans[group.id] || monthlyPlans['3a'];
  const currentStage = currentMonthData.stage || 'step1_lema';

  const getWeight = (id) => {
    const w = currentMonthData.activityWeights?.find(aw => aw.id === id);
    return w ? `(${w.weight}%)` : '';
  };
  const currentWeek = currentMonthData.weeks.find(w => w.id === selectedWeekId) || currentMonthData.weeks[0];

  const isPlanNotGenerated = currentStage === 'step1_lema' || currentStage === 'step2_objetivo' || currentStage === 'step3_enfoque';

  if (isPlanNotGenerated) {
    return (
      <div className="animate-fade-in" style={{ padding: '1.5rem 1rem', paddingBottom: '3.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', justifyContent: 'center', minHeight: '65vh', textAlign: 'center' }}>
        <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)', marginBottom: '0.2rem' }}>
          <Icon name="sparkles" size={40} color="#ffffff" />
        </div>
        
        <div style={{ maxWidth: '420px', width: '100%', background: 'var(--bg-row)', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '1.75rem 1.35rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.72rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Icon name="folder" size={14} style={{ marginRight: '0.35rem' }} /> REPOSITORIO DE PLANEACIONES • {group.name}
          </span>
          
          <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, lineHeight: 1.3 }}>
            Aún no tienes una planeación creada para {currentMonthData.subject}
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            Para consultar el calendario escolar por semanas y las actividades diarias estructuradas para un aula sin internet, primero debemos armar tu planeación pedagógica con la IA.
          </p>

          <div style={{ background: 'var(--bg-mobile)', border: '1px dashed var(--border-info)', padding: '0.75rem 0.85rem', borderRadius: '12px', fontSize: '0.78rem', color: 'var(--text-main)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Icon name="map-pin" size={18} color="var(--color-primary)" />
            <div>
              <strong>Estado del ciclo:</strong> {currentStage === 'step1_lema' ? 'Paso 1 de 3 (Definiendo Lema Docente)' : currentStage === 'step2_objetivo' ? 'Paso 2 de 3 (Definiendo Objetivo del Mes)' : 'Paso 3 de 3 (Elegir Enfoque Didáctico)'}.
            </div>
          </div>

          <button
            onClick={onNavigateToWizard}
            style={{
              width: '100%',
              padding: '0.95rem 1.2rem',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 6px 18px rgba(59, 130, 246, 0.35)',
              transition: 'transform 0.15s ease',
              marginTop: '0.4rem'
            }}
          >
            <Icon name="sparkles" size={18} color="#ffffff" />
            <span>Ir a "Planeación Inteligente" y Crear Plan ➔</span>
          </button>
        </div>
      </div>
    );
  }

  // Actions
  const handleSimplifyDayActivity = (dayIdx) => {
    setIsSimplifyingDay(dayIdx);
    setTimeout(() => {
      onUpdateMonthlyPlans(prev => {
        const p = prev[group.id];
        const nextWeeks = p.weeks.map(w => {
          if (w.id !== selectedWeekId) return w;
          return {
            ...w,
            days: w.days.map((d, idx) => {
              if (idx !== dayIdx) return d;
              return {
                ...d,
                title: `${d.title} (Simplificado 1-Tap)`,
                main: 'Versión ágil: Resolver en parejas 2 ejercicios en pizarrón con hojas recicladas. Cero materiales externos ni internet.'
              };
            })
          };
        });
        return { ...prev, [group.id]: { ...p, weeks: nextWeeks } };
      });
      setIsSimplifyingDay(null);
    }, 700);
  };

  const handleRegenerateDayActivity = (dayIdx) => {
    setIsRegeneratingDay(dayIdx);
    setTimeout(() => {
      onUpdateMonthlyPlans(prev => {
        const p = prev[group.id];
        const nextWeeks = p.weeks.map(w => {
          if (w.id !== selectedWeekId) return w;
          return {
            ...w,
            days: w.days.map((d, idx) => {
              if (idx !== dayIdx) return d;
              return {
                ...d,
                title: `${d.title} (Regenerado con IA)`,
                start: 'Dinámica kinestésica renovada con tarjetas en el pizarrón (10 min)',
                main: 'Proyecto práctico en sub-equipos aplicando casos reales de la colonia y debate guiado (30 min)',
                end: 'Autoevaluación expresiva con iconos y firma comunitaria (10 min)'
              };
            })
          };
        });
        return { ...prev, [group.id]: { ...p, weeks: nextWeeks } };
      });
      setIsRegeneratingDay(null);
    }, 800);
  };

  const handleSaveEdit = () => {
    if (!editingField) return;
    onUpdateMonthlyPlans(prev => {
      const p = prev[group.id];
      const nextWeeks = p.weeks.map(w => {
        if (w.id !== selectedWeekId) return w;
        return {
          ...w,
          days: w.days.map((d, idx) => {
            if (idx !== editingField.dayIdx) return d;
            return {
              ...d,
              [editingField.field]: editingField.value
            };
          })
        };
      });
      return { ...prev, [group.id]: { ...p, weeks: nextWeeks } };
    });
    setEditingField(null);
  };

  const handleSubmitToDirector = () => {
    onUpdateMonthlyPlans(prev => ({
      ...prev,
      [group.id]: {
        ...prev[group.id],
        stage: 'submitted'
      }
    }));
  };

  const handleSimulateDirectorApproval = () => {
    onUpdateMonthlyPlans(prev => ({
      ...prev,
      [group.id]: {
        ...prev[group.id],
        stage: 'approved',
        directorFeedback: `Aprobado por Dirección #45: Plan validado con el lema «${currentMonthData.teacherMotto}». Excelente articulación de clases sin internet.`
      }
    }));
    if (onApprove) onApprove(group.id);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0.65rem', paddingBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Top Header & Status */}
      <div style={{ padding: '0.2rem 0', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', margin: '0' }}>
              {currentMonthData.subject}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {group.name} • {currentMonthData.monthName}
            </span>
          </div>

          <button
            onClick={onNavigateToWizard}
            title="Ajustes de IA"
            style={{
              background: 'var(--bg-primary)',
              border: 'none',
              color: 'var(--color-primary)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)'
            }}
          >
            <Icon name="settings" size={18} />
          </button>
        </div>

        {/* Minimalist Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: currentStage === 'approved' ? 'var(--bg-ok)' : currentStage === 'submitted' ? 'var(--bg-warn)' : 'var(--bg-info)', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: currentStage === 'approved' ? 'var(--color-ok)' : currentStage === 'submitted' ? 'var(--color-warn)' : 'var(--color-info)' }}>
          <Icon name={currentStage === 'approved' ? 'check-circle' : currentStage === 'submitted' ? 'clock' : 'eye'} size={14} />
          <span>
            {currentStage === 'approved' ? 'Plan Aprobado Oficialmente' : currentStage === 'submitted' ? 'En Revisión (Dirección)' : 'Borrador sin enviar'}
          </span>
        </div>

        {/* 1-Tap Action Button for Preview or Submitted */}
        {(currentStage === 'preview' || currentStage === 'step1_lema' || currentStage === 'step2_objetivo' || currentStage === 'step3_enfoque') && (
          <button
            onClick={handleSubmitToDirector}
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'var(--color-info)', color: '#fff', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.25)' }}
          >
            <Icon name="send" size={16} color="#fff" />
            <span>Enviar a Dirección</span>
          </button>
        )}

        {currentStage === 'submitted' && (
          <button
            onClick={handleSimulateDirectorApproval}
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'var(--color-ok)', color: '#fff', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
          >
            <Icon name="check" size={16} color="#fff" />
            <span>Simular Aprobación</span>
          </button>
        )}
      </div>

      {/* Week Selector Grid (Horizontal Scroll) */}
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', margin: '0 -0.65rem 0.5rem -0.65rem', padding: '0 0.65rem 0.5rem 0.65rem', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {currentMonthData.weeks.map((w, i) => {
            const isSelected = selectedWeekId === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setSelectedWeekId(w.id)}
                style={{
                  flexShrink: 0,
                  borderRadius: '20px',
                  border: isSelected ? 'none' : '1px solid var(--border-light)',
                  background: isSelected ? 'var(--color-primary)' : 'var(--bg-row)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? '800' : '600',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 10px rgba(59,130,246,0.35)' : 'none',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
              >
                Sem {i + 1}
              </button>
            );
          })}
        </div>

        {/* Selected Week Box */}
        <div style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              <Icon name="target" size={14} /> {currentWeek.dateRange}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>
              <Icon name="pin" size={14} /> {currentWeek.theme}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, fontWeight: '500', lineHeight: 1.45 }}>
            {currentWeek.objective}
          </p>
        </div>

        {/* Daily Activities Grid */}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {currentWeek.days.map((dayItem, dIdx) => (
            <div
              key={dIdx}
              style={{
                background: 'var(--bg-row)',
                border: 'none',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-primary)', background: 'var(--bg-primary)', padding: '0.35rem 0.75rem', borderRadius: '12px', border: 'none' }}>
                  {dayItem.day}
                </span>

                {currentStage === 'approved' && (
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleSimplifyDayActivity(dIdx)}
                      disabled={isSimplifyingDay === dIdx}
                      style={{
                        background: 'var(--bg-mobile)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-main)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Icon name="sparkles" size={12} color="var(--color-warn)" />
                      <span>{isSimplifyingDay === dIdx ? 'Ajustando...' : 'Adaptar / Simplificar'}</span>
                    </button>
                    <button
                      onClick={() => handleRegenerateDayActivity(dIdx)}
                      disabled={isRegeneratingDay === dIdx}
                      style={{
                        background: 'var(--bg-mobile)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-main)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Icon name="refresh" size={12} color="var(--color-info)" />
                      <span>{isRegeneratingDay === dIdx ? 'Generando...' : 'Regenerar Día'}</span>
                    </button>
                  </div>
                )}
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 1rem 0', lineHeight: 1.3 }}>
                {dayItem.title}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {/* INICIO */}
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '900', flexShrink: 0, marginTop: '3px' }}>
                    1
                  </div>
                  <div style={{ paddingTop: '0.25rem', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>
                        Inicio <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '600', marginLeft: '0.2rem' }}>{getWeight(1)}</span>
                      </strong>
                      {currentStage === 'preview' && (
                        <button onClick={() => setEditingField({ dayIdx: dIdx, field: 'start', value: dayItem.start })} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0 0.2rem' }}>
                          <Icon name="edit-2" size={12} />
                        </button>
                      )}
                    </div>
                    {editingField && editingField.dayIdx === dIdx && editingField.field === 'start' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <textarea value={editingField.value} onChange={(e) => setEditingField({ ...editingField, value: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-mobile)', fontSize: '0.8rem', color: 'var(--text-main)', outline: 'none', resize: 'vertical', minHeight: '60px' }} />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => setEditingField(null)} style={{ padding: '0.3rem 0.6rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                          <button onClick={handleSaveEdit} style={{ padding: '0.3rem 0.6rem', background: 'var(--color-primary)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Guardar</button>
                        </div>
                      </div>
                    ) : (
                      <span>{dayItem.start}</span>
                    )}
                  </div>
                </div>
                
                {/* DESARROLLO */}
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '900', flexShrink: 0, marginTop: '3px' }}>
                    2
                  </div>
                  <div style={{ paddingTop: '0.25rem', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <strong style={{ color: 'var(--color-primary)', display: 'block' }}>
                        Desarrollo <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '600', marginLeft: '0.2rem' }}>{getWeight(2)}</span>
                      </strong>
                      {currentStage === 'preview' && (
                        <button onClick={() => setEditingField({ dayIdx: dIdx, field: 'main', value: dayItem.main })} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0 0.2rem' }}>
                          <Icon name="edit-2" size={12} />
                        </button>
                      )}
                    </div>
                    {editingField && editingField.dayIdx === dIdx && editingField.field === 'main' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <textarea value={editingField.value} onChange={(e) => setEditingField({ ...editingField, value: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-mobile)', fontSize: '0.8rem', color: 'var(--text-main)', outline: 'none', resize: 'vertical', minHeight: '60px' }} />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => setEditingField(null)} style={{ padding: '0.3rem 0.6rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                          <button onClick={handleSaveEdit} style={{ padding: '0.3rem 0.6rem', background: 'var(--color-primary)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Guardar</button>
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{dayItem.main}</span>
                    )}
                  </div>
                </div>
                
                {/* CIERRE */}
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '900', flexShrink: 0, marginTop: '3px' }}>
                    3
                  </div>
                  <div style={{ paddingTop: '0.25rem', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>
                        Cierre <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '600', marginLeft: '0.2rem' }}>{getWeight(3)}</span>
                      </strong>
                      {currentStage === 'preview' && (
                        <button onClick={() => setEditingField({ dayIdx: dIdx, field: 'end', value: dayItem.end })} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '0 0.2rem' }}>
                          <Icon name="edit-2" size={12} />
                        </button>
                      )}
                    </div>
                    {editingField && editingField.dayIdx === dIdx && editingField.field === 'end' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <textarea value={editingField.value} onChange={(e) => setEditingField({ ...editingField, value: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-mobile)', fontSize: '0.8rem', color: 'var(--text-main)', outline: 'none', resize: 'vertical', minHeight: '60px' }} />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => setEditingField(null)} style={{ padding: '0.3rem 0.6rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                          <button onClick={handleSaveEdit} style={{ padding: '0.3rem 0.6rem', background: 'var(--color-primary)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Guardar</button>
                        </div>
                      </div>
                    ) : (
                      <span>{dayItem.end}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
