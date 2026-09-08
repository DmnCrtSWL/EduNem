import React, { useState, useRef, useEffect } from 'react';
import Icon from '../ui/Icon';

const classFocusOptions = [
  { icon: 'message-square', text: 'Debate oral en equipos, mesas redondas y argumentación' },
  { icon: 'file-text', text: 'Análisis de prensa impresa y redacción individual a mano' },
  { icon: 'target', text: 'Aprendizaje basado en proyectos y material reciclado escolar' },
  { icon: 'user-check', text: 'Tutoría entre pares, estudio cooperativo y mediación pacífica' }
];

export default function AILessonPlanner({ group, monthlyPlans, onUpdateMonthlyPlans, onNavigateToTab, onApprove }) {
  const [lemaInput, setLemaInput] = useState('');
  const [objetivoInput, setObjetivoInput] = useState('');
  const [enfoqueInput, setEnfoqueInput] = useState('');
  
  const [hasExam, setHasExam] = useState(false);
  const [evalCriteria, setEvalCriteria] = useState([
    { id: 1, name: 'Participación', weight: 10 },
    { id: 2, name: 'Conducta', weight: 30 },
    { id: 3, name: 'Tareas / Libreta', weight: 10 }
  ]);
  const [activityWeights, setActivityWeights] = useState([
    { id: 1, name: 'Actividades de Inicio', weight: 10 },
    { id: 2, name: 'Proyectos de Desarrollo', weight: 30 },
    { id: 3, name: 'Reflexión de Cierre', weight: 10 }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const currentMonthData = (group && monthlyPlans) ? (monthlyPlans[group.id] || monthlyPlans['3a']) : null;
  const currentStage = currentMonthData ? (currentMonthData.stage || 'step1_lema') : 'step1_lema';

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStage, isTyping]);

  if (!group || !monthlyPlans) return null;

  // Step 1: Send Teacher Motto (Lema / Filosofía) -> Go to Step 2
  const handleSendLema = () => {
    const text = lemaInput.trim() || currentMonthData.teacherMotto || 'Formar ciudadanos críticos con amor a su comunidad';
    setIsTyping(true);
    setLemaInput('');

    setTimeout(() => {
      onUpdateMonthlyPlans(prev => ({
        ...prev,
        [group.id]: {
          ...prev[group.id],
          stage: 'step2_objetivo',
          teacherMotto: text
        }
      }));
      setIsTyping(false);
    }, 600);
  };

  // Step 2: Send Month Objective -> Go to Step 3
  const handleSendObjetivo = () => {
    const text = objetivoInput.trim() || currentMonthData.monthObjective || 'Dominar los aprendizajes del programa mediante proyectos comunitarios aplicados.';
    setIsTyping(true);
    setObjetivoInput('');

    setTimeout(() => {
      onUpdateMonthlyPlans(prev => ({
        ...prev,
        [group.id]: {
          ...prev[group.id],
          stage: 'step3_enfoque',
          monthObjective: text
        }
      }));
      setIsTyping(false);
    }, 600);
  };

  // Step 3: Send Class Focus (Enfoque de Clase) -> Go to Step 4 (Criterios)
  const handleSendEnfoque = (selectedPreset) => {
    const text = selectedPreset || enfoqueInput.trim() || currentMonthData.classFocus || 'Debates orales y trabajo colaborativo sin internet';
    setIsTyping(true);
    setEnfoqueInput('');

    setTimeout(() => {
      onUpdateMonthlyPlans(prev => ({
        ...prev,
        [group.id]: {
          ...prev[group.id],
          stage: 'step4_criterios',
          classFocus: text
        }
      }));
      setIsTyping(false);
    }, 1000);
  };

  // Step 4: Send Criterios -> Go to Step 5 (Actividades)
  const handleSendCriterios = () => {
    setIsTyping(true);
    setTimeout(() => {
      onUpdateMonthlyPlans(prev => ({
        ...prev,
        [group.id]: {
          ...prev[group.id],
          stage: 'step5_actividades',
          evalCriteria
        }
      }));
      setIsTyping(false);
    }, 800);
  };

  // Step 5: Send Activity Weights -> Generate Preview!
  const handleSendPesosActividades = () => {
    setIsTyping(true);
    setTimeout(() => {
      onUpdateMonthlyPlans(prev => ({
        ...prev,
        [group.id]: {
          ...prev[group.id],
          stage: 'preview',
          activityWeights
        }
      }));
      setIsTyping(false);
    }, 1500);
  };

  // Approve Preview & Submit to Director
  const handleSubmitToDirector = () => {
    setIsTyping(true);
    setTimeout(() => {
      onUpdateMonthlyPlans(prev => ({
        ...prev,
        [group.id]: {
          ...prev[group.id],
          stage: 'submitted'
        }
      }));
      setIsTyping(false);
    }, 800);
  };

  // Simulate Director Approval (1-Tap)
  const handleSimulateDirectorApproval = () => {
    setIsTyping(true);
    setTimeout(() => {
      onUpdateMonthlyPlans(prev => ({
        ...prev,
        [group.id]: {
          ...prev[group.id],
          stage: 'approved',
          directorFeedback: `👑 Aprobado por Dirección #45: Plan validado con el lema «${currentMonthData.teacherMotto}». Excelente articulación de clases sin internet.`
        }
      }));
      setIsTyping(false);
      if (onApprove) onApprove(group.id);
    }, 1000);
  };

  const handleRestartChat = () => {
    onUpdateMonthlyPlans(prev => ({
      ...prev,
      [group.id]: {
        ...prev[group.id],
        stage: 'step1_lema'
      }
    }));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 130px)', position: 'relative' }}>
      
      {/* =========================================================================================
          1. SCROLLABLE TOP CHAT AREA (Messages, Tip Banner)
         ========================================================================================= */}
      <div style={{ padding: '0.65rem 0.65rem 1.25rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
        
        {/* Top Assistant Header */}
        <div style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)' }}>
                <Icon name="rocket" size={24} color="#ffffff" />
              </div>
              <span style={{ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', border: '2px solid var(--bg-row)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.15rem 0' }}>
                Planeación Inteligente
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {group.name} • {currentMonthData.subject}
              </span>
            </div>
          </div>
          <button
            onClick={handleRestartChat}
            title="Nuevo Plan"
            style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', padding: '0.4rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', transition: 'opacity 0.2s' }}
          >
            Nuevo Plan
          </button>
        </div>

        {/* BUBBLE 1: AI GREETING (< 5 LINES) & ASKING FOR TEACHER MOTTO (LEMA) */}
        <div className="animate-fade-in" style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start', maxWidth: '93%' }}>
          <div style={{ minWidth: '34px', minHeight: '34px', width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, border: '1.5px solid var(--border-primary)' }}>
            <Icon name="rocket" size={20} color="var(--color-primary)" />
          </div>
          <div style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', padding: '0.85rem 1rem', borderRadius: '4px 16px 16px 16px', flex: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}><Icon name="rocket" size={20} /></span>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                Buscando enfoques curriculares IA...
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.45 }}>
              ¡Hola Profe! Para tu planeación de <strong>{currentMonthData.subject}</strong>, ya vinculé tu escuela (Plantel #45, sin internet), tus 42 alumnos y el programa NEM. Como primer paso, <strong>escribe abajo tu Lema o Filosofía Docente</strong> (algo concreto que te defina en el aula):
            </p>
          </div>
        </div>

        {/* BUBBLE 2: TEACHER'S MOTTO REPLIED (IF BEYOND STEP 1) */}
        {currentStage !== 'step1_lema' && (
          <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <div style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '0.7rem 0.95rem', borderRadius: '16px 16px 4px 16px', maxWidth: '85%', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.15rem', textTransform: 'uppercase' }}>
                <Icon name="user" size={12} /> MI LEMA O FILOSOFÍA DOCENTE:
              </span>
              <p style={{ fontSize: '0.82rem', margin: 0, fontWeight: '700', lineHeight: 1.35 }}>
                «{currentMonthData.teacherMotto}»
              </p>
            </div>
          </div>
        )}

        {/* BUBBLE 3: AI ASKING FOR MONTH OBJECTIVE (STEP 2) */}
        {(currentStage === 'step2_objetivo' || currentStage === 'step3_enfoque' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && (
          <div className="animate-fade-in" style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start', maxWidth: '93%' }}>
            <div style={{ minWidth: '34px', minHeight: '34px', width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, border: '1.5px solid var(--border-primary)' }}>
              <Icon name="rocket" size={20} color="var(--color-primary)" />
            </div>
            <div style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', padding: '0.85rem 1rem', borderRadius: '4px 16px 16px 16px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                PASO 2 DE 3 • OBJETIVO DEL MES
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.45 }}>
                ¡Hermoso lema! <Icon name="sparkles" size={12} style={{ display: 'inline', margin: '0 0.15rem' }} /> Ahora, como segundo paso, <strong>escribe abajo cuál es tu objetivo principal o meta de aprendizaje</strong> para el mes de Agosto en {currentMonthData.subject}:
              </p>
            </div>
          </div>
        )}

        {/* BUBBLE 4: TEACHER'S OBJECTIVE REPLIED (IF BEYOND STEP 2) */}
        {(currentStage === 'step3_enfoque' || currentStage === 'step4_criterios' || currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && (
          <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <div style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '0.7rem 0.95rem', borderRadius: '16px 16px 4px 16px', maxWidth: '85%', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.15rem', textTransform: 'uppercase' }}>
                <Icon name="user" size={12} /> MI OBJETIVO DEL MES:
              </span>
              <p style={{ fontSize: '0.82rem', margin: 0, fontWeight: '700', lineHeight: 1.35 }}>
                «{currentMonthData.monthObjective}»
              </p>
            </div>
          </div>
        )}

        {/* BUBBLE 5: AI ASKING FOR CLASS PEDAGOGICAL FOCUS (STEP 3) */}
        {(currentStage === 'step3_enfoque' || currentStage === 'step4_criterios' || currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && (
          <div className="animate-fade-in" style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start', maxWidth: '93%' }}>
            <div style={{ minWidth: '34px', minHeight: '34px', width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, border: '1.5px solid var(--border-primary)' }}>
              <Icon name="rocket" size={20} color="var(--color-primary)" />
            </div>
            <div style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', padding: '0.85rem 1rem', borderRadius: '4px 16px 16px 16px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                PASO 3 DE 3 • ENFOQUE DIDÁCTICO DE LA CLASE
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.45 }}>
                ¡Excelente objetivo! <Icon name="target" size={12} style={{ display: 'inline', margin: '0 0.15rem', verticalAlign: 'text-bottom' }} /> Por último, <strong>selecciona una opción rápida en la barra de abajo o escribe tu propio Enfoque Didáctico</strong> para dinamizar las sesiones sin usar internet en el salón:
              </p>
            </div>
          </div>
        )}

        {/* TYPING INDICATOR */}
        {isTyping && (
          <div className="animate-fade-in" style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', paddingLeft: '0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem', fontStyle: 'italic' }}>
            <Icon name="rocket" size={16} />
            <span>Armonizando tu Lema, Objetivo y Enfoque en la planeación de Agosto 2026...</span>
          </div>
        )}

        {/* BUBBLE 6: TEACHER'S CLASS FOCUS REPLIED */}
        {(currentStage === 'step4_criterios' || currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <div style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '0.7rem 0.95rem', borderRadius: '16px 16px 4px 16px', maxWidth: '85%', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.15rem', textTransform: 'uppercase' }}>
                <Icon name="user" size={12} /> ENFOQUE DIDÁCTICO ELEGIDO:
              </span>
              <p style={{ fontSize: '0.82rem', margin: 0, fontWeight: '700', lineHeight: 1.35 }}>
                «{currentMonthData.classFocus}»
              </p>
            </div>
          </div>
        )}

        {/* BUBBLE 7: AI ASKING FOR EVALUATION CRITERIA (STEP 4) */}
        {(currentStage === 'step4_criterios' || currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <div className="animate-fade-in" style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start', maxWidth: '93%' }}>
            <div style={{ minWidth: '34px', minHeight: '34px', width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, border: '1.5px solid var(--border-primary)' }}>
              <Icon name="rocket" size={20} color="var(--color-primary)" />
            </div>
            <div style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', padding: '0.85rem 1rem', borderRadius: '4px 16px 16px 16px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                PASO 4 DE 5 • CRITERIOS DE EVALUACIÓN
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.45 }}>
                ¡Perfecto! Ya tengo la estructura metodológica. Ahora definamos los <strong>Criterios de Evaluación Continua</strong>. He propuesto estos porcentajes iniciales, ajústalos como prefieras (¡debes dejar margen para las actividades!):
              </p>
            </div>
          </div>
        )}

        {/* BUBBLE 8: TEACHER'S CRITERIA REPLIED */}
        {(currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <div style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '0.7rem 0.95rem', borderRadius: '16px 16px 4px 16px', maxWidth: '85%', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.15rem', textTransform: 'uppercase' }}>
                <Icon name="user" size={12} /> CRITERIOS CONTINUOS DEFINIDOS:
              </span>
              <ul style={{ fontSize: '0.82rem', margin: 0, fontWeight: '700', lineHeight: 1.35, paddingLeft: '1rem' }}>
                {currentMonthData.evalCriteria?.map(c => (
                  <li key={c.id}>{c.name}: {c.weight}%</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* BUBBLE 9: AI ASKING FOR ACTIVITY WEIGHTS (STEP 5) */}
        {(currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <div className="animate-fade-in" style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start', maxWidth: '93%' }}>
            <div style={{ minWidth: '34px', minHeight: '34px', width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, border: '1.5px solid var(--border-primary)' }}>
              <Icon name="rocket" size={20} color="var(--color-primary)" />
            </div>
            <div style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', padding: '0.85rem 1rem', borderRadius: '4px 16px 16px 16px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                PASO 5 DE 5 • PONDERACIÓN DE ACTIVIDADES
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.45 }}>
                ¡Casi listo! Para llegar al 100% del periodo, ¿qué peso tendrá cada etapa de las clases planeadas? He propuesto esta distribución con el porcentaje restante. Ajústala a tu gusto:
              </p>
            </div>
          </div>
        )}

        {/* BUBBLE 10: TEACHER'S ACTIVITY WEIGHTS REPLIED */}
        {(currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <div style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '0.7rem 0.95rem', borderRadius: '16px 16px 4px 16px', maxWidth: '85%', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.15rem', textTransform: 'uppercase' }}>
                <Icon name="user" size={12} /> PESOS DE ACTIVIDADES:
              </span>
              <ul style={{ fontSize: '0.82rem', margin: 0, fontWeight: '700', lineHeight: 1.35, paddingLeft: '1rem' }}>
                {currentMonthData.activityWeights?.map(c => (
                  <li key={c.id}>{c.name}: {c.weight}%</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* BUBBLE 11: FINAL AI CONFIRMATION AND LINK TO PLANEACIONES SECTION */}
        {(currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <div className="animate-fade-in" style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start', width: '100%' }}>
            <div style={{ minWidth: '34px', minHeight: '34px', width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, border: '1.5px solid var(--border-primary)' }}>
              <Icon name="rocket" size={20} color="var(--color-primary)" />
            </div>
            <div style={{ background: 'var(--bg-row)', border: '1px solid var(--border-light)', padding: '0.9rem 1rem', borderRadius: '4px 16px 16px 16px', flex: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: currentStage === 'approved' ? 'var(--color-ok)' : currentStage === 'submitted' ? 'var(--color-warn)' : 'var(--color-info)', display: 'block', marginBottom: '0.35rem' }}>
                {currentStage === 'approved' && '👑 PLAN OFICIAL APROBADO POR DIRECCIÓN'}
                {currentStage === 'submitted' && '⏳ PLAN EN REVISIÓN POR DIRECCIÓN'}
                {currentStage === 'preview' && '✨ PLANEACIÓN ARMADA • LISTA EN REPOSITORIO'}
              </span>
              
              <p style={{ fontSize: '0.83rem', color: 'var(--text-main)', margin: '0 0 0.85rem 0', lineHeight: 1.45 }}>
                {currentStage === 'approved' && `¡Felicidades Profe! El Director aprobó el plan de Agosto con tu lema «${currentMonthData.teacherMotto}». Puedes ver el desglose por día en la pestaña Planeaciones:`}
                {currentStage === 'submitted' && `Tu planeación está en manos de Dirección. Puedes revisar los detalles de cada sesión o simular la aprobación en la sección Planeaciones:`}
                {currentStage === 'preview' && `¡Listo Profe! He estructurado las semanas de Agosto 2026 armonizando tu lema, objetivo y enfoque. Puedes consultar el detalle día por día en la nueva pestaña Planeaciones:`}
              </p>

              {/* Action button to switch directly to the Planeaciones tab! */}
              <button
                onClick={() => {
                  if (onNavigateToTab) onNavigateToTab('planeaciones');
                }}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                <Icon name="book-open" size={16} color="#ffffff" />
                <span>📂 Ir a Pestaña "Planeaciones" (Ver Detalle por Día) ➔</span>
              </button>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* =========================================================================================
          2. WHATSAPP-STYLE STICKY BOTTOM COMPOSER BAR (PEGADO ABAJO COVERS CONVERSATION FOOTER)
         ========================================================================================= */}
      <div
        className="whatsapp-sticky-composer animate-fade-in"
        style={{
          position: 'sticky',
          bottom: '-6px', // Pegado directamente sobre la barra de navegación móvil
          zIndex: 40,
          background: 'var(--bg-mobile)',
          borderTop: '1.5px solid var(--border-light)',
          padding: '0.65rem 0.75rem',
          margin: '0 -0.65rem -3.5rem -0.65rem',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* COMPOSER STEP 1: TEACHER MOTTO TEXTAREA */}
        {currentStage === 'step1_lema' && !isTyping && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              <Icon name="edit-3" size={12} /> Paso 1 de 3 • Escribe tu lema docente para iniciar:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <textarea
                rows={2}
                placeholder="Ej: Formar ciudadanos críticos y solidarios con amor a su comunidad..."
                value={lemaInput}
                onChange={(e) => setLemaInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.9rem',
                  borderRadius: '20px',
                  border: '1.5px solid var(--border-info)',
                  background: 'var(--bg-row)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              />
              <button
                onClick={handleSendLema}
                title="Enviar Lema y continuar"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <Icon name="send" size={18} color="#ffffff" />
              </button>
            </div>
          </div>
        )}

        {/* COMPOSER STEP 2: MONTH OBJECTIVE TEXTAREA */}
        {currentStage === 'step2_objetivo' && !isTyping && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              <Icon name="target" size={12} /> Paso 2 de 3 • Escribe tu objetivo principal del mes:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <textarea
                rows={2}
                placeholder="Ej: Dominar la comprensión de textos informativos y redactar ensayos argumentativos..."
                value={objetivoInput}
                onChange={(e) => setObjetivoInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.9rem',
                  borderRadius: '20px',
                  border: '1.5px solid var(--border-info)',
                  background: 'var(--bg-row)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              />
              <button
                onClick={handleSendObjetivo}
                title="Enviar Objetivo y continuar"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <Icon name="send" size={18} color="#ffffff" />
              </button>
            </div>
          </div>
        )}

        {/* COMPOSER STEP 3: QUICK REPLY PILLS + TEXT COMPOSER */}
        {currentStage === 'step3_enfoque' && !isTyping && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              <Icon name="zap" size={12} /> Paso 3 de 3 • Elige opción rápida o escribe enfoque:
            </span>
            
            {/* Horizontal scrollable quick-reply pills like WhatsApp Business */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {classFocusOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendEnfoque(opt.text)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border-info)',
                    background: 'var(--bg-info)',
                    color: 'var(--color-info)',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Icon name={opt.icon} size={14} />
                  <span>{opt.text.split(',')[0]}</span>
                  <span style={{ fontWeight: '900' }}>➔</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="O escribe tu propio enfoque didáctico..."
                value={enfoqueInput}
                onChange={(e) => setEnfoqueInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendEnfoque()}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.9rem',
                  borderRadius: '20px',
                  border: '1.5px solid var(--border-light)',
                  background: 'var(--bg-row)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => handleSendEnfoque()}
                disabled={!enfoqueInput.trim() && !currentMonthData.classFocus}
                title="Generar Planeación IA"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  background: (!enfoqueInput.trim() && !currentMonthData.classFocus) ? 'var(--bg-mobile)' : 'var(--color-primary)',
                  color: (!enfoqueInput.trim() && !currentMonthData.classFocus) ? 'var(--text-light)' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: (!enfoqueInput.trim() && !currentMonthData.classFocus) ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                  boxShadow: (!enfoqueInput.trim() && !currentMonthData.classFocus) ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.35)'
                }}
              >
                <Icon name="sparkles" size={18} />
              </button>
            </div>
          </div>
        )}

        {/* COMPOSER STEP 4: EDIT CRITERIA */}
        {currentStage === 'step4_criterios' && !isTyping && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              <Icon name="edit-3" size={12} /> Paso 4 • Asigna los porcentajes:
            </span>
            <div style={{ background: 'var(--bg-row)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-info)' }}>
              {evalCriteria.map((c, idx) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{c.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <input 
                      type="number" 
                      value={c.weight} 
                      onChange={(e) => {
                        const newCrit = [...evalCriteria];
                        newCrit[idx].weight = Number(e.target.value);
                        setEvalCriteria(newCrit);
                      }}
                      style={{ width: '50px', padding: '0.3rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-mobile)', color: 'var(--text-main)', fontSize: '0.8rem', textAlign: 'center' }} 
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>%</span>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.8rem 0', padding: '0.8rem 0', borderTop: '1px dashed var(--border-light)', borderBottom: '1px dashed var(--border-light)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Icon name="file-text" size={14} color="var(--color-info)" /> ¿Aplicar Examen Final?
                </span>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={hasExam} 
                    onChange={() => {
                      if (hasExam) {
                        setEvalCriteria(evalCriteria.filter(c => c.id !== 'exam'));
                        setHasExam(false);
                      } else {
                        setEvalCriteria([...evalCriteria, { id: 'exam', name: 'Examen Final', weight: 20 }]);
                        setHasExam(true);
                      }
                    }} 
                    style={{ accentColor: 'var(--color-primary)', transform: 'scale(1.2)' }} 
                  />
                </label>
              </div>

              <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-main)' }}>Total Criterios:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '900', color: evalCriteria.reduce((acc, curr) => acc + curr.weight, 0) > 100 ? 'var(--color-warn)' : 'var(--color-ok)' }}>
                  {evalCriteria.reduce((acc, curr) => acc + curr.weight, 0)}%
                </span>
              </div>
            </div>
            <button
              onClick={handleSendCriterios}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'var(--color-primary)', color: '#ffffff', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
            >
              Confirmar Criterios ➔
            </button>
          </div>
        )}

        {/* COMPOSER STEP 5: EDIT ACTIVITY WEIGHTS */}
        {currentStage === 'step5_actividades' && !isTyping && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              <Icon name="zap" size={12} /> Paso 5 • Asigna peso a actividades:
            </span>
            <div style={{ background: 'var(--bg-row)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-info)' }}>
              {activityWeights.map((c, idx) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{c.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <input 
                      type="number" 
                      value={c.weight} 
                      onChange={(e) => {
                        const newWeights = [...activityWeights];
                        newWeights[idx].weight = Number(e.target.value);
                        setActivityWeights(newWeights);
                      }}
                      style={{ width: '50px', padding: '0.3rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-mobile)', color: 'var(--text-main)', fontSize: '0.8rem', textAlign: 'center' }} 
                    />
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>%</span>
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-main)' }}>Suma Total (Criterios + Actividades):</span>
                {(() => {
                   const total = evalCriteria.reduce((acc, curr) => acc + curr.weight, 0) + activityWeights.reduce((acc, curr) => acc + curr.weight, 0);
                   return (
                     <span style={{ fontSize: '0.85rem', fontWeight: '900', color: total === 100 ? 'var(--color-ok)' : 'var(--color-warn)' }}>
                       {total}%
                     </span>
                   )
                })()}
              </div>
            </div>
            <button
              onClick={handleSendPesosActividades}
              disabled={evalCriteria.reduce((acc, curr) => acc + curr.weight, 0) + activityWeights.reduce((acc, curr) => acc + curr.weight, 0) !== 100}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: 'none', background: (evalCriteria.reduce((acc, curr) => acc + curr.weight, 0) + activityWeights.reduce((acc, curr) => acc + curr.weight, 0) !== 100) ? 'var(--bg-mobile)' : 'var(--color-primary)', color: (evalCriteria.reduce((acc, curr) => acc + curr.weight, 0) + activityWeights.reduce((acc, curr) => acc + curr.weight, 0) !== 100) ? 'var(--text-light)' : '#ffffff', fontSize: '0.8rem', fontWeight: '800', cursor: (evalCriteria.reduce((acc, curr) => acc + curr.weight, 0) + activityWeights.reduce((acc, curr) => acc + curr.weight, 0) !== 100) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: (evalCriteria.reduce((acc, curr) => acc + curr.weight, 0) + activityWeights.reduce((acc, curr) => acc + curr.weight, 0) !== 100) ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)' }}
            >
              <Icon name="sparkles" size={16} /> Generar Planeación IA
            </button>
          </div>
        )}

        {/* COMPOSER STEP FINAL: ACTION FOOTER BAR ONCE PREVIEW GENERATED */}
        {currentStage === 'preview' && !isTyping && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                if (onNavigateToTab) onNavigateToTab('planeaciones');
              }}
              style={{ flex: 1, padding: '0.8rem', borderRadius: '14px', border: '1px solid var(--border-info)', background: 'var(--bg-row)', color: 'var(--color-info)', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
            >
              <Icon name="book-open" size={16} />
              <span>Planeación</span>
            </button>

            <button
              onClick={handleSubmitToDirector}
              style={{ flex: 1, padding: '0.8rem', borderRadius: '14px', border: 'none', background: 'var(--color-info)', color: '#fff', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}
            >
              <Icon name="check" size={16} color="#fff" />
              <span>Enviar</span>
            </button>
          </div>
        )}

        {currentStage === 'submitted' && !isTyping && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--color-warn)', textAlign: 'center' }}>
              ⏳ Plan en revisión por Dirección. Herramienta de demostración:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  if (onNavigateToTab) onNavigateToTab('planeaciones');
                }}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--bg-row)', color: 'var(--text-main)', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
              >
                <Icon name="book-open" size={16} />
                <span>Ver Planeaciones</span>
              </button>
              <button
                onClick={handleSimulateDirectorApproval}
                style={{ flex: 1.2, padding: '0.75rem', borderRadius: '14px', border: 'none', background: 'var(--color-ok)', color: '#fff', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
              >
                <Icon name="check" size={16} color="#fff" />
                <span>👑 Simular Aprobación</span>
              </button>
            </div>
          </div>
        )}

        {currentStage === 'approved' && !isTyping && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-ok)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              👑 Plan Aprobado • Activo en Aula
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  if (onNavigateToTab) onNavigateToTab('planeaciones');
                }}
                style={{ background: 'var(--color-primary)', border: 'none', color: '#fff', padding: '0.35rem 0.7rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }}
              >
                <Icon name="book-open" size={13} color="#fff" />
                <span>Ver Planeaciones</span>
              </button>
              <button
                onClick={handleRestartChat}
                style={{ background: 'none', border: '1px solid var(--border-light)', color: 'var(--text-muted)', padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Nueva Versión ➔
              </button>
            </div>
          </div>
        )}

        {isTyping && (
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.3rem 0' }}>
            <Icon name="rocket" size={20} color="var(--color-primary)" /> Asistente escribiendo...
          </div>
        )}
      </div>

    </div>
  );
}
