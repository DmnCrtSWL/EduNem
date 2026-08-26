import React, { useState, useMemo } from 'react';
import Icon from '../ui/Icon';

export default function StudentGrid({ group, isClassInSession = true, onSimulateClassTime, onStudentClick, onToggleAbsence, onRequestToggleAbsence }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  const filteredStudents = useMemo(() => {
    if (!group || !group.students) return [];
    const filtered = group.students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.listNumber.toString().includes(searchTerm)
    );
    
    // Push absent students to the bottom, keep listNumber order otherwise
    return filtered.sort((a, b) => {
      const aIsAbsent = a.attendance === 'absent' ? 1 : 0;
      const bIsAbsent = b.attendance === 'absent' ? 1 : 0;
      if (aIsAbsent !== bIsAbsent) return aIsAbsent - bIsAbsent;
      return a.listNumber - b.listNumber;
    });
  }, [group, searchTerm]);

  if (!group) return null;

  const presentCount = group.students.filter(s => s.attendance === 'present').length;

  // Helper to get initials (e.g. "García Martínez, Mateo" -> "GM")
  const getInitials = (name) => {
    const clean = name.replace(',', '');
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 3) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
    return parts[0][0] || 'U';
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0.75rem 0', position: 'relative' }}>
      {/* Attendance Summary Bar (Sin label de faltas) */}
      <div style={{ padding: '0 0.85rem 0.5rem 0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>Total lista: <strong>{group.totalStudents} alumnos</strong></span>
        <div>
          <strong style={{ color: 'var(--color-ok)' }}>✓ {presentCount} presentes</strong>
        </div>
      </div>

      {/* Read-Only Warning Banner When Class is Not In Session */}
      {!isClassInSession && (
        <div className="animate-fade-in" style={{ margin: '0 0.85rem 0.75rem 0.85rem', padding: '0.75rem 0.85rem', background: 'var(--bg-warn)', border: '1.5px solid var(--border-warn)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warn)' }}>
            <Icon name="lock" size={16} />
            <strong style={{ fontSize: '0.82rem' }}>Modo Lectura: Clase no en curso</strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
            Estás consultando la lista de <strong>{group.name}</strong> (Horario: {group.schedule}). Al no estar ocurriendo en este momento, <strong>los botones de asistencia y el menú del alumno están desactivados</strong>.
          </p>
          {onSimulateClassTime && (
            <button
              onClick={onSimulateClassTime}
              style={{
                marginTop: '0.25rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--color-warn)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)'
              }}
            >
              <Icon name="clock" size={14} color="#fff" />
              <span>⚡ Demo: Situar reloj en hora de esta clase para activar</span>
            </button>
          )}
        </div>
      )}

      {/* Zero Friction Notification (Cerrable) - Solo en clase activa */}
      {showBanner && isClassInSession && (
        <div style={{ margin: '0 0.85rem 0.65rem 0.85rem', padding: '0.6rem 0.75rem', background: 'var(--bg-ok)', border: '1px solid var(--border-ok)', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="check" size={16} color="var(--color-ok)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
              <strong style={{ display: 'block', color: 'var(--color-ok)' }}>Asistencia 100% por defecto</strong>
              Todo el grupo está presente. Toca el check solo en quien falte.
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            style={{ background: 'none', border: 'none', color: 'var(--color-ok)', cursor: 'pointer', padding: '0 0.2rem', fontWeight: 'bold', fontSize: '0.9rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Search filter */}
      <div style={{ padding: '0 0.85rem 0.65rem 0.85rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center' }}>
            <Icon name="search" size={15} />
          </span>
          <input
            type="text"
            placeholder="Buscar por apellido, nombre o #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.75rem 0.65rem 2.2rem',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-row)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Minimalist Vertical Student List */}
      <div className="student-list-container">
        {filteredStudents.map((s) => {
          const isAbsent = s.attendance === 'absent';
          const hasTeacherNote = s.teacherNote && s.teacherNote.trim() !== '';
          const hasSocialNote = s.socialNote && !s.socialNote.includes('Ninguna');
          const isException = s.status === 'exception' && !isAbsent;

          return (
            <div
              key={s.id}
              className={`roster-row ${isAbsent ? 'is-absent' : isException ? 'is-exception' : 'is-ok'}`}
              onClick={() => {
                if (!isClassInSession) return;
                onStudentClick(s);
              }}
              title={!isClassInSession ? "Menú del alumno desactivado (Clase no en curso)" : "Ver menú y expediente del alumno"}
              style={{
                cursor: isClassInSession ? 'pointer' : 'not-allowed',
                opacity: isClassInSession ? 1 : 0.65,
                transition: 'all 0.15s ease'
              }}
            >
              {/* Left: Number, Avatar Initials, Name & Notes */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isAbsent ? 'var(--color-danger)' : 'var(--text-muted)', width: '22px', textAlign: 'right', flexShrink: 0 }}>
                  {s.listNumber}.
                </span>

                {/* Minimalist Avatar Initials */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isAbsent ? 'var(--bg-danger)' : isException ? 'var(--bg-warn)' : 'var(--bg-row-hover)',
                  color: isAbsent ? 'var(--color-danger)' : isException ? 'var(--color-warn)' : 'var(--text-muted)',
                  border: `1px solid ${isAbsent ? 'var(--border-danger)' : isException ? 'var(--border-warn)' : 'var(--border-light)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  {getInitials(s.name)}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <span style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: isAbsent ? '500' : '600',
                    color: isAbsent ? 'var(--color-danger)' : 'var(--text-main)',
                    textDecoration: isAbsent ? 'line-through' : 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {s.name}
                  </span>

                  {/* Clean Note Badges */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                    {hasTeacherNote && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem', background: 'var(--bg-info)', color: 'var(--color-info)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-info)', fontWeight: '600', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Icon name="file-text" size={11} />
                        Nota: {s.teacherNote}
                      </span>
                    )}

                    {hasSocialNote && !hasTeacherNote && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem', background: 'var(--bg-row-hover)', color: 'var(--text-muted)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                        <Icon name="heart-pulse" size={11} />
                        TS
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Only the single check/cross button (Locked & disabled if class not in session) */}
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                <button
                  disabled={!isClassInSession}
                  onClick={() => {
                    if (!isClassInSession) return;
                    onRequestToggleAbsence ? onRequestToggleAbsence(s) : onToggleAbsence(s.id);
                  }}
                  title={!isClassInSession ? "Desactivado (Esta clase no transcurre en este momento)" : isAbsent ? "Marcar asistencia" : "Marcar falta / inasistencia"}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: !isClassInSession ? '1px solid var(--border-light)' : isAbsent ? '1.5px solid var(--color-danger)' : '1.5px solid var(--color-ok)',
                    background: !isClassInSession ? 'var(--bg-mobile)' : isAbsent ? 'var(--color-danger)' : 'var(--bg-ok)',
                    color: !isClassInSession ? 'var(--text-light)' : isAbsent ? '#ffffff' : 'var(--color-ok)',
                    opacity: !isClassInSession ? 0.45 : 1,
                    cursor: !isClassInSession ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: !isClassInSession ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <Icon name={!isClassInSession ? 'lock' : isAbsent ? 'x' : 'check'} size={!isClassInSession ? 15 : 18} color={!isClassInSession ? 'var(--text-light)' : isAbsent ? '#ffffff' : 'var(--color-ok)'} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
