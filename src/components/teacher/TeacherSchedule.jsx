import React, { useState } from 'react';
import Icon from '../ui/Icon';

const WEEK_DAYS = [
  { id: 1, name: 'Lunes', short: 'Lun', dateNum: 26 },
  { id: 2, name: 'Martes', short: 'Mar', dateNum: 27 },
  { id: 3, name: 'Miércoles', short: 'Mié', dateNum: 28 },
  { id: 4, name: 'Jueves', short: 'Jue', dateNum: 29 },
  { id: 5, name: 'Viernes', short: 'Vie', dateNum: 30 }
];

const SCHEDULE_BLOCKS = [
  // Lunes
  { id: '3a', day: 1, startH: 7, startM: 0, endH: 8, endM: 40, timeStr: '07:00 - 08:40', title: '3°A - Español III', room: 'Aula 05 - Edificio A', color: 'var(--color-info)', bg: 'var(--bg-info)', border: 'var(--border-info)' },
  { id: '2b', day: 1, startH: 8, startM: 40, endH: 10, endM: 20, timeStr: '08:40 - 10:20', title: '2°B - Matemáticas II', room: 'Aula 12 - Edificio B', color: 'var(--color-ok)', bg: 'var(--bg-ok)', border: 'var(--border-ok)' },
  { id: '1c', day: 1, startH: 16, startM: 0, endH: 16, endM: 50, timeStr: '16:00 - 16:50', title: '1°C - Formación Cívica', room: 'Aula 18 - Edificio C', color: 'var(--color-warn)', bg: 'var(--bg-warn)', border: 'var(--border-warn)' },
  
  // Martes
  { id: '2b', day: 2, startH: 8, startM: 40, endH: 10, endM: 20, timeStr: '08:40 - 10:20', title: '2°B - Matemáticas II', room: 'Aula 12 - Edificio B', color: 'var(--color-ok)', bg: 'var(--bg-ok)', border: 'var(--border-ok)' },
  { id: '3a', day: 2, startH: 10, startM: 50, endH: 12, endM: 30, timeStr: '10:50 - 12:30', title: '3°A - Español III', room: 'Aula 05 - Edificio A', color: 'var(--color-info)', bg: 'var(--bg-info)', border: 'var(--border-info)' },
  { id: '1c', day: 2, startH: 16, startM: 0, endH: 16, endM: 50, timeStr: '16:00 - 16:50', title: '1°C - Formación Cívica', room: 'Aula 18 - Edificio C', color: 'var(--color-warn)', bg: 'var(--bg-warn)', border: 'var(--border-warn)' },
  
  // Miércoles
  { id: '3a', day: 3, startH: 7, startM: 0, endH: 8, endM: 40, timeStr: '07:00 - 08:40', title: '3°A - Español III', room: 'Aula 05 - Edificio A', color: 'var(--color-info)', bg: 'var(--bg-info)', border: 'var(--border-info)' },
  { id: '2b', day: 3, startH: 8, startM: 40, endH: 10, endM: 20, timeStr: '08:40 - 10:20', title: '2°B - Matemáticas II', room: 'Aula 12 - Edificio B', color: 'var(--color-ok)', bg: 'var(--bg-ok)', border: 'var(--border-ok)' },
  { id: '1c', day: 3, startH: 16, startM: 0, endH: 16, endM: 50, timeStr: '16:00 - 16:50', title: '1°C - Formación Cívica', room: 'Aula 18 - Edificio C', color: 'var(--color-warn)', bg: 'var(--bg-warn)', border: 'var(--border-warn)' },
  
  // Jueves
  { id: '2b', day: 4, startH: 8, startM: 40, endH: 10, endM: 20, timeStr: '08:40 - 10:20', title: '2°B - Matemáticas II', room: 'Aula 12 - Edificio B', color: 'var(--color-ok)', bg: 'var(--bg-ok)', border: 'var(--border-ok)' },
  { id: '3a', day: 4, startH: 10, startM: 50, endH: 12, endM: 30, timeStr: '10:50 - 12:30', title: '3°A - Español III', room: 'Aula 05 - Edificio A', color: 'var(--color-info)', bg: 'var(--bg-info)', border: 'var(--border-info)' },
  { id: '1c', day: 4, startH: 16, startM: 0, endH: 16, endM: 50, timeStr: '16:00 - 16:50', title: '1°C - Formación Cívica', room: 'Aula 18 - Edificio C', color: 'var(--color-warn)', bg: 'var(--bg-warn)', border: 'var(--border-warn)' },
  
  // Viernes
  { id: '3a', day: 5, startH: 7, startM: 0, endH: 8, endM: 40, timeStr: '07:00 - 08:40', title: '3°A - Español III', room: 'Aula 05 - Edificio A', color: 'var(--color-info)', bg: 'var(--bg-info)', border: 'var(--border-info)' },
  { id: '2b', day: 5, startH: 8, startM: 40, endH: 10, endM: 20, timeStr: '08:40 - 10:20', title: '2°B - Matemáticas II', room: 'Aula 12 - Edificio B', color: 'var(--color-ok)', bg: 'var(--bg-ok)', border: 'var(--border-ok)' }
];

export default function TeacherSchedule({ groups, simulatedTime, onSimulateTime, onSelectGroup, onNavigateToList }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pushMinutes, setPushMinutes] = useState('5'); // '3' | '5' | '10'
  const [showNotifyConfig, setShowNotifyConfig] = useState(false);
  const [calendarView, setCalendarView] = useState('today'); // 'today' | '3days' | 'week' | 'month'
  const [showDemoTools, setShowDemoTools] = useState(false);
  const [activeDayId, setActiveDayId] = useState(1); // Default Monday (or today)

  // Determine current CDMX day for "Hoy"
  const cdmxDate = simulatedTime || new Date();
  const currentDayNum = cdmxDate.getDay();
  const todayDayId = (currentDayNum >= 1 && currentDayNum <= 5) ? currentDayNum : 1; // Default to Mon if weekend

  // Format displayed time
  const timeString = cdmxDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleSelectBlock = (groupId) => {
    onSelectGroup(groupId);
    onNavigateToList();
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0.85rem' }}>
      {/* Top Header & Minimalist Alert Toggle (Rediseñado para eliminar amontonamiento visual) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            Mi Horario Escolar
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
            <Icon name="map-pin" size={14} color="var(--color-danger)" />
            <span>CDMX en Vivo ({timeString})</span>
          </span>
        </div>

        {/* Clean Notification Settings Pill Button */}
        <button
          onClick={() => setShowNotifyConfig(!showNotifyConfig)}
          style={{
            background: pushEnabled ? 'var(--bg-ok)' : 'var(--bg-row)',
            border: `1px solid ${pushEnabled ? 'var(--border-ok)' : 'var(--border-light)'}`,
            padding: '0.4rem 0.7rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: pushEnabled ? 'var(--color-ok)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            transition: 'all 0.15s ease'
          }}
        >
          <Icon name="bell" size={14} />
          <span>{pushEnabled ? `Alerta: ${pushMinutes}m` : 'Alertas Off'}</span>
          <Icon name="settings" size={12} />
        </button>
      </div>

      {/* Collapsible Push Notification Configuration Panel (Spacious & Clean, no text wrapping) */}
      {showNotifyConfig && (
        <div className="animate-fade-in" style={{
          background: 'var(--bg-row)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '1rem',
          marginBottom: '1rem',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: pushEnabled ? 'var(--color-ok)' : 'var(--border-light)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="bell" size={16} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>Notificaciones Push de Clase</span>
            </div>
            
            {/* Clean Switch */}
            <button
              onClick={() => setPushEnabled(!pushEnabled)}
              style={{
                width: '46px',
                height: '24px',
                borderRadius: '12px',
                background: pushEnabled ? 'var(--color-ok)' : 'var(--border-light)',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#ffffff',
                position: 'absolute',
                top: '3px',
                left: pushEnabled ? '25px' : '3px',
                transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.8rem 0', lineHeight: 1.4 }}>
            {pushEnabled
              ? 'Te enviaremos un aviso push al celular antes de iniciar cada clase para recordar aula y grupo.'
              : 'Las alertas automáticas de horario están apagadas en este dispositivo.'}
          </p>

          {pushEnabled && (
            <div>
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                Anticipación del aviso al celular:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Nunca', '5 min antes', '9 min antes'].map(option => (
                  <button
                    key={option}
                    onClick={() => setPushMinutes(option)}
                    style={{
                      flex: 1,
                      padding: '0.4rem 0.2rem',
                      borderRadius: '8px',
                      border: pushMinutes === option ? '2px solid var(--color-ok)' : '1px solid var(--border-light)',
                      background: pushMinutes === option ? 'var(--bg-ok)' : 'var(--bg-mobile)',
                      color: pushMinutes === option ? 'var(--color-ok)' : 'var(--text-main)',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Google Calendar View Mode Selector Tabs (Homologado a estética de cuadrícula limpia) */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-row)',
        padding: '0.25rem',
        borderRadius: '14px',
        border: '1px solid var(--border-light)',
        marginBottom: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        {[
          { id: 'today', label: 'Hoy', icon: 'calendar' },
          { id: '3days', label: '3 Días', icon: 'columns' },
          { id: 'week', label: 'Semana', icon: 'grid' },
          { id: 'month', label: 'Mes', icon: 'layout' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCalendarView(tab.id)}
            style={{
              flex: 1,
              padding: '0.55rem 0.2rem',
              borderRadius: '11px',
              border: 'none',
              background: calendarView === tab.id ? 'var(--color-primary)' : 'transparent',
              color: calendarView === tab.id ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon name={tab.icon} size={14} color={calendarView === tab.id ? '#ffffff' : 'var(--text-muted)'} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. VISTA: HOY (Timeline Vertical estilo Google Calendar Day View) */}
      {calendarView === 'today' && (
        <div className="animate-fade-in">
          {/* Day header sub-selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', background: 'var(--bg-row)', padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Icon name="calendar" size={14} />
              <span>{WEEK_DAYS.find(d => d.id === todayDayId)?.name} 26 de Julio</span>
            </h2>
            <span style={{ fontSize: '0.7rem', background: 'var(--bg-info)', color: 'var(--color-info)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '700' }}>
              3 Clases Asignadas
            </span>
          </div>

          {/* Timeline Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', position: 'relative' }}>
            {SCHEDULE_BLOCKS.filter(b => b.day === todayDayId).map((block, i) => (
              <div
                key={`${block.id}-${i}`}
                onClick={() => handleSelectBlock(block.id)}
                style={{
                  background: block.bg,
                  border: `1px solid ${block.border}`,
                  borderLeft: `5px solid ${block.color}`,
                  borderRadius: '14px',
                  padding: '0.9rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                      <Icon name="clock" size={11} /> {block.timeStr}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.3rem 0 0.15rem 0' }}>
                    {block.title}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Icon name="map-pin" size={12} /> {block.room}
                  </span>
                </div>

                <button style={{
                  background: block.color,
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  flexShrink: 0
                }}>
                  <span>Tomar Lista</span>
                  <Icon name="check" size={14} color="#ffffff" />
                </button>
              </div>
            ))}

            {/* Google Calendar Red Time Line Indicator (Hora actual simulada o real) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.4rem 0' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-danger)' }} />
              <div style={{ flex: 1, height: '2px', background: 'var(--color-danger)', opacity: 0.8 }} />
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--color-danger)', background: 'var(--bg-danger)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                AHORA ({timeString})
              </span>
            </div>

            {/* Free/Open Time block example */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem 1rem', background: 'transparent', border: '1px dashed var(--border-light)', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <Icon name="coffee" size={14} />
              <span>12:30 - 16:00 hrs • Bloque sin clases frente a grupo (Planeación / Libre)</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. VISTA: 3 DÍAS (Google Calendar 3-Day Columns Grid) */}
      {calendarView === '3days' && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {WEEK_DAYS.slice(0, 3).map(day => (
              <div key={day.id} style={{ background: day.id === todayDayId ? 'var(--bg-primary)' : 'var(--bg-row)', padding: '0.5rem', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: day.id === todayDayId ? 'var(--color-primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {day.short}
                </span>
                <strong style={{ fontSize: '1.05rem', color: day.id === todayDayId ? 'var(--color-primary)' : 'var(--text-main)' }}>
                  {day.dateNum}
                </strong>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', minHeight: '320px', alignItems: 'start' }}>
            {WEEK_DAYS.slice(0, 3).map(day => (
              <div key={day.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-mobile)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border-light)', minHeight: '100%' }}>
                {SCHEDULE_BLOCKS.filter(b => b.day === day.id).map((block, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectBlock(block.id)}
                    style={{
                      background: block.bg,
                      borderLeft: `4px solid ${block.color}`,
                      borderRight: '1px solid var(--border-light)',
                      borderTop: '1px solid var(--border-light)',
                      borderBottom: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.4rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: block.color }}>
                      {block.timeStr.split(' ')[0]}
                    </span>
                    <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.2, margin: '0.15rem 0' }}>
                      {block.title.split(' - ')[0]}
                    </strong>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {block.room.split(' - ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VISTA: SEMANA (Google Calendar Full Week 5-Day Columns Grid) */}
      {calendarView === 'week' && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem', marginBottom: '0.5rem' }}>
            {WEEK_DAYS.map(day => (
              <div key={day.id} style={{ background: day.id === todayDayId ? 'var(--bg-primary)' : 'var(--bg-row)', padding: '0.4rem 0.2rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: day.id === todayDayId ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                  {day.short}
                </span>
                <strong style={{ fontSize: '0.9rem', color: day.id === todayDayId ? 'var(--color-primary)' : 'var(--text-main)' }}>
                  {day.dateNum}
                </strong>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem', minHeight: '340px', alignItems: 'start' }}>
            {WEEK_DAYS.map(day => (
              <div key={day.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'var(--bg-mobile)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--border-light)', minHeight: '100%' }}>
                {SCHEDULE_BLOCKS.filter(b => b.day === day.id).map((block, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectBlock(block.id)}
                    style={{
                      background: block.bg,
                      borderLeft: `3px solid ${block.color}`,
                      borderRadius: '6px',
                      padding: '0.4rem 0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: '800', color: block.color }}>
                      {block.timeStr.split(' ')[0]}
                    </span>
                    <strong style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-main)', lineHeight: 1.1 }}>
                      {block.title.split(' - ')[0]}
                    </strong>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VISTA: MES (Google Calendar Monthly Matrix Grid) */}
      {calendarView === 'month' && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', padding: '0 0.2rem' }}>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Julio / Agosto 2026</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>4 Semanas Hábiles</span>
          </div>

          {/* Month Weekday Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.3rem', marginBottom: '0.3rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span>
          </div>

          {/* Month Days Matrix (20 days, Mon-Fri) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem' }}>
            {Array.from({ length: 20 }, (_, i) => {
              const dayNum = 7 + i; // Start around 7th of month
              const dayOfWeek = (i % 5) + 1;
              const isToday = dayNum === 26;
              const classesForDay = SCHEDULE_BLOCKS.filter(b => b.day === dayOfWeek);

              return (
                <div
                  key={i}
                  onClick={() => {
                    setActiveDayId(dayOfWeek);
                    setCalendarView('today');
                  }}
                  style={{
                    background: isToday ? 'var(--bg-primary)' : 'var(--bg-row)',
                    border: isToday ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
                    borderRadius: '10px',
                    padding: '0.4rem 0.25rem',
                    minHeight: '62px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: isToday ? '800' : '600', color: isToday ? 'var(--color-primary)' : 'var(--text-main)', textAlign: 'right', display: 'block' }}>
                    {dayNum}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    {classesForDay.map((c, cIdx) => (
                      <div key={cIdx} style={{ height: '5px', borderRadius: '3px', background: c.color }} title={c.title} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.6rem' }}>
            💡 Toca cualquier día en el calendario para ver su horario detallado.
          </span>
        </div>
      )}

      {/* Demo Time Simulation Panel (Colapsable al fondo para mantener agilidad limpia) */}
      <div style={{ borderTop: '1px dashed var(--border-light)', marginTop: '1.25rem', paddingTop: '0.85rem' }}>
        <button
          onClick={() => setShowDemoTools(!showDemoTools)}
          style={{
            width: '100%',
            padding: '0.6rem',
            background: showDemoTools ? 'var(--bg-row-hover)' : 'transparent',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <Icon name="clock" size={14} />
          <span>{showDemoTools ? 'Ocultar Herramientas Demo' : 'Simular Horas Demo (Probar Auto-selección)'}</span>
        </button>
        
        {showDemoTools && (
          <div className="animate-fade-in" style={{ marginTop: '0.75rem', background: 'var(--bg-info)', border: '1px solid var(--border-info)', padding: '0.85rem', borderRadius: '12px' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-info)', marginBottom: '0.6rem' }}>
              ⚡ SIMULADOR PARA DEMOSTRACIÓN:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                onClick={() => {
                  const d = new Date();
                  d.setHours(7, 0, 0);
                  onSimulateTime(d, '3a');
                }}
                style={{ padding: '0.55rem', background: 'var(--bg-row)', border: '1px solid var(--border-info)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>Simular Lunes 07:00 AM</span>
                <strong style={{ color: 'var(--color-info)' }}>➔ 3°A Español</strong>
              </button>
              <button
                onClick={() => {
                  const d = new Date();
                  d.setHours(9, 0, 0);
                  onSimulateTime(d, '2b');
                }}
                style={{ padding: '0.55rem', background: 'var(--bg-row)', border: '1px solid var(--border-info)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>Simular Lunes 09:00 AM</span>
                <strong style={{ color: 'var(--color-ok)' }}>➔ 2°B Matemáticas</strong>
              </button>
              <button
                onClick={() => {
                  const d = new Date();
                  d.setHours(16, 0, 0);
                  onSimulateTime(d, '1c');
                }}
                style={{ padding: '0.55rem', background: 'var(--bg-row)', border: '1px solid var(--border-info)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>Simular Lunes 04:00 PM</span>
                <strong style={{ color: 'var(--color-warn)' }}>➔ 1°C Formación</strong>
              </button>
              <button
                onClick={() => onSimulateTime(null, null)}
                style={{ padding: '0.55rem', background: 'var(--color-ok)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', textAlign: 'center', marginTop: '0.3rem' }}
              >
                🟢 Volver a Reloj Oficial en Vivo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
