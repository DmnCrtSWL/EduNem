import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, LayoutAnimation } from 'react-native';
import Icon from '../ui/Icon';
import { theme } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';
import { build4ContextNEMPrompt, SCHOOL_CONTEXT_ROBUST, NEM_OFFICIAL_PILARS } from '../../data/schoolContext';

const classFocusOptions = [
  { icon: 'message-square', text: 'Debate oral en equipos, mesas redondas y argumentación' },
  { icon: 'file-text', text: 'Análisis de prensa impresa y redacción individual a mano' },
  { icon: 'target', text: 'Aprendizaje basado en proyectos y material reciclado escolar' },
  { icon: 'user-check', text: 'Tutoría entre pares, estudio cooperativo y mediación pacífica' }
];

export default function AILessonPlanner({ group, monthlyPlans, onUpdateMonthlyPlans, onNavigateToTab, onApprove }) {
  const { theme } = useTheme();
  const [lemaInput, setLemaInput] = useState('');
  const [objetivoInput, setObjetivoInput] = useState('');
  const [enfoqueInput, setEnfoqueInput] = useState('');
  const [showContextCard, setShowContextCard] = useState(false);
  
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
  const scrollViewRef = useRef(null);

  const currentMonthData = (group && monthlyPlans) ? (monthlyPlans[group.id] || monthlyPlans['3a']) : null;
  const currentStage = currentMonthData ? (currentMonthData.stage || 'step1_lema') : 'step1_lema';

  if (!group || !monthlyPlans) return null;

  const handleSendLema = () => {
    const text = lemaInput.trim() || currentMonthData.teacherMotto || 'Formar ciudadanos críticos con amor a su comunidad';
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsTyping(true);
    setLemaInput('');

    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  const handleSendObjetivo = () => {
    const text = objetivoInput.trim() || currentMonthData.monthObjective || 'Dominar los aprendizajes del programa mediante proyectos comunitarios aplicados.';
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsTyping(true);
    setObjetivoInput('');

    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  const handleSendEnfoque = (selectedPreset) => {
    const text = selectedPreset || enfoqueInput.trim() || currentMonthData.classFocus || 'Debates orales y trabajo colaborativo sin internet';
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsTyping(true);
    setEnfoqueInput('');

    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  const handleSendCriterios = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsTyping(true);
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  const handleSendPesosActividades = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsTyping(true);
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  const handleSubmitToDirector = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  const totalCriteria = evalCriteria.reduce((acc, curr) => acc + curr.weight, 0);
  const totalActivities = activityWeights.reduce((acc, curr) => acc + curr.weight, 0);
  const totalSum = totalCriteria + totalActivities;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgMobile }]}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Assistant Header */}
        <View style={[styles.topHeaderCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
          <View style={[styles.topHeaderLeft, { flex: 1, marginRight: 8 }]}>
            <View style={{ position: 'relative' }}>
              <View style={[styles.rocketCircle, { backgroundColor: theme.colors.primary }]}>
                <Icon name="rocket" size={22} color="#ffffff" />
              </View>
              <View style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#10b981', borderWidth: 1.5, borderColor: theme.colors.bgRow }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitleText, { color: theme.colors.textMain }]} numberOfLines={1}>Planeación Inteligente</Text>
              <Text style={[styles.headerSubText, { color: theme.colors.textMuted }]} numberOfLines={1}>{group.name} • {currentMonthData.subject}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleRestartChat} style={styles.newPlanBtn}>
            <Text style={[styles.newPlanBtnText, { color: theme.colors.primary }]}>Nuevo Plan</Text>
          </TouchableOpacity>
        </View>



        {/* BUBBLE 1: AI GREETING */}
        <View style={styles.aiBubbleRow}>
          <View style={[styles.aiAvatarCircle, { backgroundColor: theme.isDark ? '#1e3a8a33' : theme.colors.bgPrimary, borderColor: theme.isDark ? '#1e40af' : theme.colors.borderPrimary }]}>
            <Icon name="rocket" size={20} color={theme.colors.primary} />
          </View>
          <View style={[styles.aiBubbleCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Icon name="rocket" size={16} color={theme.colors.primary} />
              <Text style={[styles.aiTagText, { color: theme.colors.primary }]}>Buscando enfoques curriculares IA...</Text>
            </View>
            <Text style={[styles.bubbleMessageText, { color: theme.colors.textMain }]}>
              ¡Hola Profe! Para tu planeación de <Text style={{ fontWeight: '800' }}>{currentMonthData.subject}</Text>, ya vinculé tu escuela (Plantel #45, sin internet), tus 42 alumnos y el programa NEM. Como primer paso, <Text style={{ fontWeight: '800' }}>escribe abajo tu Lema o Filosofía Docente</Text> (algo concreto que te defina en el aula):
            </Text>
          </View>
        </View>

        {/* BUBBLE 2: TEACHER'S MOTTO REPLIED */}
        {currentStage !== 'step1_lema' && (
          <View style={styles.userBubbleRow}>
            <View style={[styles.userBubbleCard, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.userBubbleLabel}>MI LEMA O FILOSOFÍA DOCENTE:</Text>
              <Text style={styles.userBubbleText}>«{currentMonthData.teacherMotto}»</Text>
            </View>
          </View>
        )}

        {/* BUBBLE 3: AI ASKING FOR MONTH OBJECTIVE (STEP 2) */}
        {(currentStage === 'step2_objetivo' || currentStage === 'step3_enfoque' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && (
          <View style={styles.aiBubbleRow}>
            <View style={[styles.aiAvatarCircle, { backgroundColor: theme.isDark ? '#1e3a8a33' : theme.colors.bgPrimary, borderColor: theme.isDark ? '#1e40af' : theme.colors.borderPrimary }]}>
              <Icon name="rocket" size={20} color={theme.colors.primary} />
            </View>
            <View style={[styles.aiBubbleCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
              <Text style={[styles.stepTagText, { color: theme.colors.primary }]}>PASO 2 DE 3 • OBJETIVO DEL MES</Text>
              <Text style={[styles.bubbleMessageText, { color: theme.colors.textMain }]}>
                ¡Hermoso lema! ✨ Ahora, como segundo paso, <Text style={{ fontWeight: '800' }}>escribe abajo cuál es tu objetivo principal o meta de aprendizaje</Text> para el mes de Agosto en {currentMonthData.subject}:
              </Text>
            </View>
          </View>
        )}

        {/* BUBBLE 4: TEACHER'S OBJECTIVE REPLIED */}
        {(currentStage === 'step3_enfoque' || currentStage === 'step4_criterios' || currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && (
          <View style={styles.userBubbleRow}>
            <View style={[styles.userBubbleCard, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.userBubbleLabel}>MI OBJETIVO DEL MES:</Text>
              <Text style={styles.userBubbleText}>«{currentMonthData.monthObjective}»</Text>
            </View>
          </View>
        )}

        {/* BUBBLE 5: AI ASKING FOR CLASS PEDAGOGICAL FOCUS (STEP 3) */}
        {(currentStage === 'step3_enfoque' || currentStage === 'step4_criterios' || currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && (
          <View style={styles.aiBubbleRow}>
            <View style={[styles.aiAvatarCircle, { backgroundColor: theme.isDark ? '#1e3a8a33' : theme.colors.bgPrimary, borderColor: theme.isDark ? '#1e40af' : theme.colors.borderPrimary }]}>
              <Icon name="rocket" size={20} color={theme.colors.primary} />
            </View>
            <View style={[styles.aiBubbleCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
              <Text style={[styles.stepTagText, { color: theme.colors.primary }]}>PASO 3 DE 3 • ENFOQUE DIDÁCTICO DE LA CLASE</Text>
              <Text style={[styles.bubbleMessageText, { color: theme.colors.textMain }]}>
                ¡Excelente objetivo! 🎯 Por último, <Text style={{ fontWeight: '800' }}>selecciona una opción rápida en la barra de abajo o escribe tu propio Enfoque Didáctico</Text> para dinamizar las sesiones sin usar internet en el salón:
              </Text>
            </View>
          </View>
        )}

        {/* TYPING INDICATOR */}
        {isTyping && (
          <View style={styles.typingRow}>
            <Icon name="rocket" size={16} color={theme.colors.textMuted} />
            <Text style={[styles.typingText, { color: theme.colors.textMuted }]}>Armonizando tu Lema, Objetivo y Enfoque en la planeación de Agosto 2026...</Text>
          </View>
        )}

        {/* BUBBLE 6: TEACHER'S CLASS FOCUS REPLIED */}
        {(currentStage === 'step4_criterios' || currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <View style={styles.userBubbleRow}>
            <View style={[styles.userBubbleCard, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.userBubbleLabel}>ENFOQUE DIDÁCTICO ELEGIDO:</Text>
              <Text style={styles.userBubbleText}>«{currentMonthData.classFocus}»</Text>
            </View>
          </View>
        )}

        {/* BUBBLE 7: AI ASKING FOR EVALUATION CRITERIA (STEP 4) */}
        {(currentStage === 'step4_criterios' || currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <View style={styles.aiBubbleRow}>
            <View style={[styles.aiAvatarCircle, { backgroundColor: theme.isDark ? '#1e3a8a33' : theme.colors.bgPrimary, borderColor: theme.isDark ? '#1e40af' : theme.colors.borderPrimary }]}>
              <Icon name="rocket" size={20} color={theme.colors.primary} />
            </View>
            <View style={[styles.aiBubbleCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
              <Text style={[styles.stepTagText, { color: theme.colors.primary }]}>PASO 4 DE 5 • CRITERIOS DE EVALUACIÓN</Text>
              <Text style={[styles.bubbleMessageText, { color: theme.colors.textMain }]}>
                ¡Perfecto! Ya tengo la estructura metodológica. Ahora definamos los <Text style={{ fontWeight: '800' }}>Criterios de Evaluación Continua</Text>. He propuesto estos porcentajes iniciales, ajústalos como prefieras:
              </Text>
            </View>
          </View>
        )}

        {/* BUBBLE 8: TEACHER'S CRITERIA REPLIED */}
        {(currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <View style={styles.userBubbleRow}>
            <View style={[styles.userBubbleCard, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.userBubbleLabel}>CRITERIOS CONTINUOS DEFINIDOS:</Text>
              {currentMonthData.evalCriteria?.map(c => (
                <Text key={c.id} style={styles.userBubbleText}>• {c.name}: {c.weight}%</Text>
              ))}
            </View>
          </View>
        )}

        {/* BUBBLE 9: AI ASKING FOR ACTIVITY WEIGHTS (STEP 5) */}
        {(currentStage === 'step5_actividades' || currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <View style={styles.aiBubbleRow}>
            <View style={[styles.aiAvatarCircle, { backgroundColor: theme.isDark ? '#1e3a8a33' : theme.colors.bgPrimary, borderColor: theme.isDark ? '#1e40af' : theme.colors.borderPrimary }]}>
              <Icon name="rocket" size={20} color={theme.colors.primary} />
            </View>
            <View style={[styles.aiBubbleCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
              <Text style={[styles.stepTagText, { color: theme.colors.primary }]}>PASO 5 DE 5 • PONDERACIÓN DE ACTIVIDADES</Text>
              <Text style={[styles.bubbleMessageText, { color: theme.colors.textMain }]}>
                ¡Casi listo! Para llegar al 100% del periodo, ¿qué peso tendrá cada etapa de las clases planeadas? He propuesto esta distribución:
              </Text>
            </View>
          </View>
        )}

        {/* BUBBLE 10: TEACHER'S ACTIVITY WEIGHTS REPLIED */}
        {(currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <View style={styles.userBubbleRow}>
            <View style={[styles.userBubbleCard, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.userBubbleLabel}>PESOS DE ACTIVIDADES:</Text>
              {currentMonthData.activityWeights?.map(c => (
                <Text key={c.id} style={styles.userBubbleText}>• {c.name}: {c.weight}%</Text>
              ))}
            </View>
          </View>
        )}

        {/* BUBBLE 11: FINAL AI CONFIRMATION AND LINK TO PLANEACIONES */}
        {(currentStage === 'preview' || currentStage === 'submitted' || currentStage === 'approved') && !isTyping && (
          <View style={styles.aiBubbleRow}>
            <View style={[styles.aiAvatarCircle, { backgroundColor: theme.isDark ? '#1e3a8a33' : theme.colors.bgPrimary, borderColor: theme.isDark ? '#1e40af' : theme.colors.borderPrimary }]}>
              <Icon name="rocket" size={20} color={theme.colors.primary} />
            </View>
            <View style={[styles.aiBubbleCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
              <Text style={[
                styles.stepTagText,
                { color: theme.colors.primary },
                currentStage === 'approved' && { color: theme.colors.ok },
                currentStage === 'submitted' && { color: theme.colors.warn },
              ]}>
                {currentStage === 'approved' && '👑 PLAN OFICIAL APROBADO POR DIRECCIÓN'}
                {currentStage === 'submitted' && '⏳ PLAN EN REVISIÓN POR DIRECCIÓN'}
                {currentStage === 'preview' && '✨ PLANEACIÓN ARMADA • LISTA EN REPOSITORIO'}
              </Text>
              
              <Text style={[styles.bubbleMessageText, { color: theme.colors.textMain, marginBottom: 12 }]}>
                {currentStage === 'approved' && `¡Felicidades Profe! El Director aprobó el plan de Agosto con tu lema «${currentMonthData.teacherMotto}». Puedes ver el desglose por día en la pestaña Planeaciones:`}
                {currentStage === 'submitted' && `Tu planeación está en manos de Dirección. Puedes revisar los detalles de cada sesión o simular la aprobación en la sección Planeaciones:`}
                {currentStage === 'preview' && `¡Listo Profe! He estructurado las semanas de Agosto 2026 armonizando tu lema, objetivo y enfoque. Puedes consultar el detalle día por día en la nueva pestaña Planeaciones:`}
              </Text>

              <TouchableOpacity
                onPress={() => onNavigateToTab && onNavigateToTab('planeaciones')}
                style={[styles.goToPlaneacionesBtn, { backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 10, height: 'auto', minHeight: 44 }]}
              >
                <Icon name="planeaciones" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={[styles.goToPlaneacionesBtnText, { flexShrink: 1 }]}>📂 Ir a Pestaña "Planeaciones" ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* STICKY BOTTOM COMPOSER BAR */}
      <View style={[styles.stickyComposerBar, { backgroundColor: theme.colors.bgRow, borderTopColor: theme.colors.borderLight }]}>

        {/* STEP 1: LEMA INPUT */}
        {currentStage === 'step1_lema' && !isTyping && (
          <View style={{ gap: 6 }}>
            <Text style={[styles.composerHeaderLabel, { color: theme.colors.primary }]}>Paso 1 de 3 • Escribe tu lema docente para iniciar:</Text>
            <View style={styles.composerRow}>
              <TextInput
                multiline
                numberOfLines={2}
                placeholder="Ej: Formar ciudadanos críticos y solidarios con amor a su comunidad..."
                placeholderTextColor={theme.colors.textMuted}
                value={lemaInput}
                onChangeText={setLemaInput}
                style={[styles.composerTextInput, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight, color: theme.colors.textMain }]}
              />
              <TouchableOpacity onPress={handleSendLema} style={styles.sendCircleBtn}>
                <Icon name="send" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 2: OBJECTIVE INPUT */}
        {currentStage === 'step2_objetivo' && !isTyping && (
          <View style={{ gap: 6 }}>
            <Text style={styles.composerHeaderLabel}>Paso 2 de 3 • Escribe tu objetivo principal del mes:</Text>
            <View style={styles.composerRow}>
              <TextInput
                multiline
                numberOfLines={2}
                placeholder="Ej: Dominar la comprensión de textos informativos y redactar ensayos..."
                placeholderTextColor={theme.colors.textMuted}
                value={objetivoInput}
                onChangeText={setObjetivoInput}
                style={styles.composerTextInput}
              />
              <TouchableOpacity onPress={handleSendObjetivo} style={styles.sendCircleBtn}>
                <Icon name="send" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: ENFOQUE QUICK REPLIES + INPUT */}
        {currentStage === 'step3_enfoque' && !isTyping && (
          <View style={{ gap: 8 }}>
            <Text style={styles.composerHeaderLabel}>Paso 3 de 3 • Elige opción rápida o escribe enfoque:</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {classFocusOptions.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSendEnfoque(opt.text)}
                  style={styles.quickPill}
                >
                  <Icon name={opt.icon} size={14} color={theme.colors.info} style={{ marginRight: 4 }} />
                  <Text style={styles.quickPillText}>{opt.text.split(',')[0]} ➔</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.composerRow}>
              <TextInput
                placeholder="O escribe tu propio enfoque didáctico..."
                placeholderTextColor={theme.colors.textMuted}
                value={enfoqueInput}
                onChangeText={setEnfoqueInput}
                style={[styles.composerTextInput, { borderRadius: 20 }]}
              />
              <TouchableOpacity
                onPress={() => handleSendEnfoque()}
                disabled={!enfoqueInput.trim() && !currentMonthData.classFocus}
                style={[styles.sendCircleBtn, (!enfoqueInput.trim() && !currentMonthData.classFocus) && { backgroundColor: theme.colors.bgMobile }]}
              >
                <Icon name="sparkles" size={18} color={(!enfoqueInput.trim() && !currentMonthData.classFocus) ? theme.colors.textLight : '#ffffff'} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 4: EDIT CRITERIA */}
        {currentStage === 'step4_criterios' && !isTyping && (
          <View style={{ gap: 8 }}>
            <Text style={[styles.composerHeaderLabel, { color: theme.colors.primary }]}>Paso 4 • Asigna los porcentajes:</Text>
            <View style={[styles.criteriaCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
              {evalCriteria.map((c, idx) => (
                <View key={c.id} style={styles.criteriaRow}>
                  <Text style={[styles.criteriaName, { color: theme.colors.textMain }]}>{c.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <TextInput 
                      keyboardType="number-pad"
                      value={String(c.weight)} 
                      onChangeText={(val) => {
                        const newCrit = [...evalCriteria];
                        newCrit[idx].weight = Number(val || 0);
                        setEvalCriteria(newCrit);
                      }}
                      style={[styles.weightInput, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight, color: theme.colors.textMain }]} 
                    />
                    <Text style={[styles.weightPercent, { color: theme.colors.textMuted }]}>%</Text>
                  </View>
                </View>
              ))}

              <View style={[styles.criteriaDividerRow, { borderColor: theme.colors.borderLight }]}>
                <Text style={[styles.criteriaName, { color: theme.colors.textMain }]}>¿Aplicar Examen Final?</Text>
                <TouchableOpacity 
                  onPress={() => {
                    if (hasExam) {
                      setEvalCriteria(evalCriteria.filter(c => c.id !== 'exam'));
                      setHasExam(false);
                    } else {
                      setEvalCriteria([...evalCriteria, { id: 'exam', name: 'Examen Final', weight: 20 }]);
                      setHasExam(true);
                    }
                  }} 
                  style={[styles.checkboxBox, { borderColor: theme.colors.borderLight }, hasExam && styles.checkboxActive]}
                >
                  {hasExam && <Icon name="check" size={14} color="#ffffff" />}
                </TouchableOpacity>
              </View>

              <View style={styles.criteriaTotalRow}>
                <Text style={[styles.criteriaTotalLabel, { color: theme.colors.textMain }]}>Total Criterios:</Text>
                <Text style={[styles.criteriaTotalVal, totalCriteria > 100 ? { color: theme.colors.warn } : { color: theme.colors.ok }]}>
                  {totalCriteria}%
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleSendCriterios} style={[styles.confirmBtnFull, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.confirmBtnFullText}>Confirmar Criterios ➔</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 5: EDIT ACTIVITY WEIGHTS */}
        {currentStage === 'step5_actividades' && !isTyping && (
          <View style={{ gap: 8 }}>
            <Text style={[styles.composerHeaderLabel, { color: theme.colors.primary }]}>Paso 5 • Asigna peso a actividades:</Text>
            <View style={[styles.criteriaCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
              {activityWeights.map((c, idx) => (
                <View key={c.id} style={styles.criteriaRow}>
                  <Text style={[styles.criteriaName, { color: theme.colors.textMain }]}>{c.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <TextInput 
                      keyboardType="number-pad"
                      value={String(c.weight)} 
                      onChangeText={(val) => {
                        const newWeights = [...activityWeights];
                        newWeights[idx].weight = Number(val || 0);
                        setActivityWeights(newWeights);
                      }}
                      style={[styles.weightInput, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight, color: theme.colors.textMain }]} 
                    />
                    <Text style={[styles.weightPercent, { color: theme.colors.textMuted }]}>%</Text>
                  </View>
                </View>
              ))}
              
              <View style={styles.criteriaTotalRow}>
                <Text style={[styles.criteriaTotalLabel, { color: theme.colors.textMain }]}>Suma Total (Criterios + Actividades):</Text>
                <Text style={[styles.criteriaTotalVal, totalSum === 100 ? { color: theme.colors.ok } : { color: theme.colors.warn }]}>
                  {totalSum}%
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleSendPesosActividades}
              disabled={totalSum !== 100}
              style={[styles.confirmBtnFull, { backgroundColor: theme.colors.primary }, totalSum !== 100 && { backgroundColor: theme.colors.bgMobile }]}
            >
              <Icon name="sparkles" size={16} color={totalSum === 100 ? '#ffffff' : theme.colors.textLight} style={{ marginRight: 6 }} />
              <Text style={[styles.confirmBtnFullText, totalSum !== 100 && { color: theme.colors.textLight }]}>Generar Planeación IA</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* COMPOSER STEP FINAL: ACTION FOOTER BAR ONCE PREVIEW GENERATED */}
        {currentStage === 'preview' && !isTyping && (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => onNavigateToTab && onNavigateToTab('planeaciones')}
              style={styles.footerBtnSecondary}
            >
              <Icon name="planeaciones" size={16} color={theme.colors.info} style={{ marginRight: 6 }} />
              <Text style={styles.footerBtnSecondaryText}>Planeación</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmitToDirector}
              style={styles.footerBtnPrimary}
            >
              <Icon name="check" size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.footerBtnPrimaryText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStage === 'submitted' && !isTyping && (
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: theme.colors.warn, textAlign: 'center' }}>
              ⏳ Plan en revisión por Dirección. Herramienta de demostración:
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => onNavigateToTab && onNavigateToTab('planeaciones')}
                style={[styles.footerBtnSecondary, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}
              >
                <Icon name="planeaciones" size={16} color={theme.colors.textMain} style={{ marginRight: 4 }} />
                <Text style={{ color: theme.colors.textMain, fontWeight: '800', fontSize: 12 }}>Ver Planeaciones</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSimulateDirectorApproval}
                style={[styles.footerBtnPrimary, { backgroundColor: theme.colors.ok }]}
              >
                <Icon name="check" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                <Text style={styles.footerBtnPrimaryText}>👑 Simular Aprobación</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentStage === 'approved' && !isTyping && (
          <View style={{ gap: 8, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: theme.colors.ok }}>
              👑 Plan Aprobado • Activo en Aula
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => onNavigateToTab && onNavigateToTab('planeaciones')}
                style={[styles.footerBtnPrimary, { flex: 1, backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }]}
              >
                <Icon name="planeaciones" size={14} color="#ffffff" style={{ marginRight: 4 }} />
                <Text style={{ color: '#ffffff', fontSize: 11.5, fontWeight: '800' }} numberOfLines={1}>Ver Planeaciones</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRestartChat}
                style={[styles.footerBtnSecondary, { flex: 1, backgroundColor: theme.colors.bgRow, borderWidth: 1, borderColor: theme.colors.borderLight, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }]}
              >
                <Text style={{ color: theme.colors.textMain, fontSize: 11.5, fontWeight: '700' }} numberOfLines={1}>Nueva Versión ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgMobile,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 24,
  },
  topHeaderCard: {
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rocketCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textMain,
  },
  headerSubText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  newPlanBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  newPlanBtnText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  aiBubbleRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    maxWidth: '93%',
    marginBottom: 12,
  },
  aiAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBubbleCard: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
  },
  aiTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  stepTagText: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  bubbleMessageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userBubbleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  userBubbleCard: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 14,
    maxWidth: '85%',
  },
  userBubbleLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  userBubbleText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
    marginBottom: 12,
  },
  typingText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  goToPlaneacionesBtn: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goToPlaneacionesBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  stickyComposerBar: {
    backgroundColor: theme.colors.bgMobile,
    borderTopWidth: 1.5,
    borderTopColor: theme.colors.borderLight,
    padding: 12,
  },
  composerHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  composerRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  composerTextInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.borderInfo,
    backgroundColor: theme.colors.bgRow,
    color: theme.colors.textMain,
    fontSize: 13,
  },
  sendCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderInfo,
    backgroundColor: theme.colors.bgInfo,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickPillText: {
    color: theme.colors.info,
    fontSize: 11,
    fontWeight: '700',
  },
  criteriaCard: {
    backgroundColor: theme.colors.bgRow,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderInfo,
  },
  criteriaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  criteriaName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMain,
  },
  weightInput: {
    width: 50,
    padding: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.bgMobile,
    color: theme.colors.textMain,
    fontSize: 13,
    textAlign: 'center',
  },
  weightPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textMuted,
  },
  criteriaDividerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.borderLight,
    marginVertical: 8,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  criteriaTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  criteriaTotalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textMain,
  },
  criteriaTotalVal: {
    fontSize: 14,
    fontWeight: '900',
  },
  confirmBtnFull: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  confirmBtnFullText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  footerBtnSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.borderInfo,
    backgroundColor: theme.colors.bgRow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnSecondaryText: {
    color: theme.colors.info,
    fontSize: 13,
    fontWeight: '800',
  },
  footerBtnPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: theme.colors.info,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});

