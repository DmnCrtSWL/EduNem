import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet, LayoutAnimation } from 'react-native';
import Icon from '../ui/Icon';
import { theme } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

export default function StudentProfileModal({ student, group, monthlyPlans, onClose, onUpdateStudent, onTriggerSOS }) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('registro'); // 'registro', 'expediente', 'evaluacion'

  const handleTabChange = (newTab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(newTab);
  };
  
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
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={[styles.bottomSheet, { backgroundColor: theme.colors.bgMobile }]} onPress={() => {}}>
          {/* Drag Handle */}
          <View style={[styles.dragHandle, { backgroundColor: theme.colors.borderLight }]} />

          {/* Student Info Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={[styles.listNumText, { color: theme.colors.textMuted }]}>Alumno #{student.listNumber}</Text>
              <Text style={[styles.studentTitle, { color: theme.colors.textMain }]}>{student.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="x" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Tabs Navigation */}
          <View style={styles.tabsNav}>
            <TouchableOpacity 
              onPress={() => handleTabChange('registro')}
              style={[styles.tabItem, activeTab === 'registro' && styles.tabItemActive]}
            >
              <Text style={[styles.tabText, activeTab === 'registro' && styles.tabTextActive]}>Registro</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleTabChange('expediente')}
              style={[styles.tabItem, activeTab === 'expediente' && styles.tabItemActive]}
            >
              <Text style={[styles.tabText, activeTab === 'expediente' && styles.tabTextActive]}>Expediente 360°</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleTabChange('evaluacion')}
              style={[styles.tabItem, activeTab === 'evaluacion' && styles.tabItemActive]}
            >
              <Text style={[styles.tabText, activeTab === 'evaluacion' && styles.tabTextActive]}>Evaluación</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content Area */}
          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>

            {/* TAB 1: REGISTRO DIARIO */}
            {activeTab === 'registro' && (
              <View>
                {/* 1. Attendance Toggle */}
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionLabel}>1. Asistencia del día:</Text>
                  <View style={styles.rowGap}>
                    <TouchableOpacity
                      onPress={() => setAttendance('present')}
                      style={[
                        styles.toggleBtn,
                        { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight },
                        attendance === 'present' && {
                          borderWidth: 2,
                          borderColor: theme.colors.ok,
                          backgroundColor: theme.isDark ? 'rgba(5, 150, 105, 0.25)' : theme.colors.bgOk
                        }
                      ]}
                    >
                      <Icon name="check" size={16} color={attendance === 'present' ? theme.colors.ok : theme.colors.textMuted} />
                      <Text style={[styles.toggleBtnText, { color: attendance === 'present' ? theme.colors.ok : theme.colors.textMuted }]}>Presente (Default)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setAttendance('absent')}
                      style={[
                        styles.toggleBtn,
                        { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight },
                        attendance === 'absent' && {
                          borderWidth: 2,
                          borderColor: theme.colors.danger,
                          backgroundColor: theme.isDark ? 'rgba(220, 38, 38, 0.25)' : theme.colors.bgDanger
                        }
                      ]}
                    >
                      <Icon name="user-x" size={16} color={attendance === 'absent' ? theme.colors.danger : theme.colors.textMuted} />
                      <Text style={[styles.toggleBtnText, { color: attendance === 'absent' ? theme.colors.danger : theme.colors.textMuted }]}>Falta / Inasistencia</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 2. Short Teacher Note */}
                <View style={styles.sectionBlock}>
                  <View style={styles.rowBetween}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="file-text" size={14} color={theme.colors.textMuted} />
                      <Text style={styles.sectionLabel}>2. Nota Corta del Docente (Opcional):</Text>
                    </View>
                    <Text style={[styles.wordCountText, isOverLimit && { color: theme.colors.danger }]}>
                      {wordCount} / 150 palabras
                    </Text>
                  </View>
                  <TextInput
                    multiline
                    numberOfLines={3}
                    placeholder="Ej: No entregó tarea / Excelente participación / Comentó indisposición médica leve..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={note}
                    onChangeText={setNote}
                    style={[
                      styles.textArea,
                      { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight, color: theme.colors.textMain },
                      isOverLimit && { borderColor: theme.colors.danger, borderWidth: 2 }
                    ]}
                  />
                  {isOverLimit && (
                    <Text style={styles.limitWarnText}>
                      ⚠️ Has superado el límite de 150 palabras para mantener la agilidad del registro.
                    </Text>
                  )}
                </View>

                {/* 3. Quick Utility Presets */}
                <Text style={styles.sectionLabel}>
                  3. Reacción y Comportamiento Humano (1-Tap):
                </Text>
                <View style={{ gap: 8, marginBottom: 20 }}>
                  <TouchableOpacity
                    onPress={() => handleSelectQuickPreset('energetic', 'excellent')}
                    style={[styles.presetCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}
                  >
                    <View style={[styles.presetIconBox, { backgroundColor: theme.isDark ? '#451a03' : '#fef3c7' }]}>
                      <Icon name="star" size={20} color="#d97706" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.presetTitle, { color: theme.colors.textMain }]}>Destacado / Participación Activa</Text>
                      <Text style={[styles.presetSub, { color: theme.colors.textMuted }]}>Dominó el tema en clase o apoyó a sus compañeros</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSelectQuickPreset('sad', 'doubts')}
                    style={[styles.presetCard, { backgroundColor: theme.colors.bgWarn, borderColor: theme.colors.borderWarn }]}
                  >
                    <View style={[styles.presetIconBox, { backgroundColor: theme.isDark ? '#422006' : '#fef9c3' }]}>
                      <Icon name="help-circle" size={20} color="#ca8a04" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.presetTitle, { color: theme.colors.warn }]}>Distraído / Bajo Ánimo / Dudas</Text>
                      <Text style={[styles.presetSub, { color: theme.colors.textMuted }]}>Requiere reforzamiento pedagógico o apoyo emocional</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSelectQuickPreset('normal', 'difficulty')}
                    style={[styles.presetCard, { backgroundColor: theme.colors.bgDanger, borderColor: theme.colors.borderDanger }]}
                  >
                    <View style={[styles.presetIconBox, { backgroundColor: theme.isDark ? '#450a0a' : '#fee2e2' }]}>
                      <Icon name="alert-triangle" size={20} color="#dc2626" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.presetTitle, { color: theme.colors.danger }]}>Dificultad Mayor / No Entregó</Text>
                      <Text style={[styles.presetSub, { color: theme.colors.textMuted }]}>No realizó la actividad asignada en el aula</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* SOS Direct Action */}
                <Text style={[styles.sectionLabel, { color: theme.colors.danger }]}>
                  4. Alerta Inmediata a Prefectura / Dirección:
                </Text>
                <View style={styles.rowGap}>
                  <TouchableOpacity
                    onPress={() => setConfirmSOS({ id: 'discipline', label: 'Indisciplina / Salió sin permiso', icon: 'shield-alert', color: theme.colors.danger, bg: theme.colors.bgDanger })}
                    style={[styles.sosBtn, { backgroundColor: theme.colors.bgDanger, borderColor: theme.colors.borderDanger }]}
                  >
                    <Icon name="shield-alert" size={16} color={theme.colors.danger} />
                    <Text style={[styles.sosBtnText, { color: theme.colors.danger }]}>Aviso Indisciplina</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setConfirmSOS({ id: 'health', label: 'Enfermería / Salud', icon: 'heart-pulse', color: theme.colors.info, bg: theme.colors.bgInfo })}
                    style={[styles.sosBtn, { backgroundColor: theme.colors.bgInfo, borderColor: theme.colors.borderInfo }]}
                  >
                    <Icon name="heart-pulse" size={16} color={theme.colors.info} />
                    <Text style={[styles.sosBtnText, { color: theme.colors.info }]}>Aviso Enfermería</Text>
                  </TouchableOpacity>
                </View>

                {/* Save button */}
                <TouchableOpacity 
                  onPress={handleSaveRegistro} 
                  disabled={isOverLimit} 
                  style={[styles.saveBtnPrimary, isOverLimit && { opacity: 0.5 }]}
                >
                  <Icon name="check" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.saveBtnText}>Guardar Asistencia y Nota del Docente</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* TAB 2: EXPEDIENTE 360 */}
            {activeTab === 'expediente' && (
              <View style={{ paddingBottom: 16 }}>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                  <View style={[styles.statCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
                    <Text style={styles.statLabel}>Promedio SEP</Text>
                    <Text style={[styles.statVal, { color: theme.colors.primary }]}>{student.historicalAverages.grade}</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
                    <Text style={styles.statLabel}>Asistencia</Text>
                    <Text style={[styles.statVal, { color: theme.colors.ok }]}>{student.historicalAverages.attendance}%</Text>
                  </View>
                </View>

                {student.socialNote && !student.socialNote.includes('Ninguna') && (
                  <View style={[
                    styles.socialNoteBox,
                    {
                      backgroundColor: theme.isDark ? '#1e3a8a33' : theme.colors.bgInfo,
                      borderColor: theme.isDark ? '#1e40af' : theme.colors.borderInfo
                    }
                  ]}>
                    <Icon name="users" size={18} color={theme.isDark ? '#60a5fa' : theme.colors.info} style={{ marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.socialNoteTitle, { color: theme.isDark ? '#60a5fa' : theme.colors.info }]}>Nota de Trabajo Social:</Text>
                      <Text style={[styles.socialNoteText, { color: theme.isDark ? '#93c5fd' : theme.colors.info }]}>{student.socialNote}</Text>
                    </View>
                  </View>
                )}

                <Text style={styles.commentsHeading}>Comentarios de otros docentes</Text>
                <View style={{ gap: 10 }}>
                  {student.comments && student.comments.length > 0 ? (
                    student.comments.map((comment, i) => (
                      <View key={i} style={[styles.commentBox, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
                        <View style={styles.rowBetween}>
                          <Text style={{ fontWeight: '700', color: theme.colors.textMain }}>{comment.author}</Text>
                          <Text style={{ color: theme.colors.textMuted, fontSize: 11 }}>{comment.date}</Text>
                        </View>
                        <Text style={{ color: theme.colors.textMuted, fontSize: 13, marginTop: 4, lineHeight: 18 }}>"{comment.text}"</Text>
                      </View>
                    ))
                  ) : (
                    <View style={[styles.emptyCommentsBox, { borderColor: theme.colors.borderLight }]}>
                      <Text style={styles.emptyCommentsText}>
                        No hay comentarios recientes de otros docentes.
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* TAB 3: EVALUACIÓN */}
            {activeTab === 'evaluacion' && (
              <View>
                {activePlan ? (
                  <>
                    <View style={styles.activePlanBox}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Icon name="calendar" size={16} color={theme.colors.primary} />
                        <Text style={styles.activePlanTitle}>
                          Planeación Activa
                        </Text>
                      </View>
                      <Text style={styles.activePlanDesc}>
                        {activeActivity ? activeActivity.desc : 'Actividad General de la Clase'}
                      </Text>
                      <Text style={styles.activePlanSub}>
                        Evalúa el desempeño de {student.name.split(' ')[0]} en esta actividad específica.
                      </Text>
                    </View>

                    <Text style={styles.sectionLabel}>
                      Rúbrica Formativa:
                    </Text>
                    <View style={{ gap: 8, marginBottom: 20 }}>
                      <TouchableOpacity
                        onPress={() => setGradeRubric('logrado')}
                        style={[
                          styles.rubricBtn,
                          { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight },
                          gradeRubric === 'logrado' && { backgroundColor: theme.colors.bgOk, borderColor: theme.colors.ok, borderWidth: 2 }
                        ]}
                      >
                        <Icon name="check-circle" size={18} color={gradeRubric === 'logrado' ? theme.colors.ok : theme.colors.textMain} />
                        <Text style={[styles.rubricText, gradeRubric === 'logrado' && { color: theme.colors.ok }]}>Logro Esperado (Completó la actividad)</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setGradeRubric('proceso')}
                        style={[
                          styles.rubricBtn,
                          { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight },
                          gradeRubric === 'proceso' && { backgroundColor: theme.colors.bgWarn, borderColor: theme.colors.warn, borderWidth: 2 }
                        ]}
                      >
                        <Icon name="clock" size={18} color={gradeRubric === 'proceso' ? theme.colors.warn : theme.colors.textMain} />
                        <Text style={[styles.rubricText, gradeRubric === 'proceso' && { color: theme.colors.warn }]}>En Proceso (Incompleto o con dudas)</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setGradeRubric('apoyo')}
                        style={[
                          styles.rubricBtn,
                          { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight },
                          gradeRubric === 'apoyo' && { backgroundColor: theme.colors.bgDanger, borderColor: theme.colors.danger, borderWidth: 2 }
                        ]}
                      >
                        <Icon name="alert-circle" size={18} color={gradeRubric === 'apoyo' ? theme.colors.danger : theme.colors.textMain} />
                        <Text style={[styles.rubricText, gradeRubric === 'apoyo' && { color: theme.colors.danger }]}>Requiere Apoyo (No logró el objetivo)</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionLabel}>
                      Calificación Numérica (0-10):
                    </Text>
                    <TextInput 
                      keyboardType="decimal-pad"
                      value={String(gradeNumber)}
                      onChangeText={setGradeNumber}
                      placeholder="Ej: 8.5"
                      placeholderTextColor={theme.colors.textMuted}
                      style={[styles.numericInput, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight, color: theme.colors.textMain }]}
                    />

                    <TouchableOpacity onPress={handleSaveEvaluacion} style={styles.saveBtnPrimary}>
                      <Icon name="save" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                      <Text style={styles.saveBtnText}>Guardar Evaluación</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={{ alignItems: 'center', paddingVertical: 32, paddingHorizontal: 16 }}>
                    <Icon name="calendar" size={32} color={theme.colors.textMuted} style={{ marginBottom: 16 }} />
                    <Text style={{ color: theme.colors.textMuted, textAlign: 'center', fontSize: 14, lineHeight: 20 }}>
                      No hay una planeación activa o aprobada para el grupo de hoy. Genera y aprueba tu planeación en la pestaña "Planeación Inteligente" para poder evaluar esta actividad.
                    </Text>
                  </View>
                )}
              </View>
            )}

          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Confirmation Modal for SOS Alerts */}
      {confirmSOS && (
        <Modal visible transparent animationType="fade">
          <View style={styles.confirmSosOverlay}>
            <View style={[styles.confirmSosCard, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight }]}>
              <View style={[styles.confirmIconCircle, { backgroundColor: confirmSOS.bg }]}>
                <Icon name={confirmSOS.icon} size={24} color={confirmSOS.color} />
              </View>
              <Text style={[styles.confirmTitle, { color: theme.colors.textMain }]}>¿Estás seguro?</Text>
              <Text style={[styles.confirmText, { color: theme.colors.textMuted }]}>
                ¿Deseas enviar un <Text style={{ fontWeight: '800', color: confirmSOS.color }}>{confirmSOS.label}</Text> inmediato para <Text style={{ color: theme.colors.textMain, fontWeight: '800' }}>{student.name}</Text>? Se notificará al instante a Prefectura / Dirección.
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => setConfirmSOS(null)} style={[styles.cancelSosBtn, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
                  <Text style={{ color: theme.colors.textMain, fontWeight: '700', fontSize: 13 }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirmSOSAction} style={[styles.confirmSosBtn, { backgroundColor: confirmSOS.color }]}>
                  <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 13 }}>Enviar Alerta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  bottomSheet: {
    backgroundColor: theme.colors.bgMobile,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    maxHeight: '92%',
    padding: 16,
    paddingBottom: 24,
    margin: 0,
    alignSelf: 'stretch',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listNumText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  studentTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.colors.textMain,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  tabsNav: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  contentScroll: {
    maxHeight: 640,
  },
  sectionBlock: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  rowGap: {
    flexDirection: 'row',
    gap: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.bgRow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  toggleBtnInactive: {},
  presentActive: {
    borderWidth: 2,
    borderColor: theme.colors.ok,
    backgroundColor: theme.colors.bgOk,
  },
  absentActive: {
    borderWidth: 2,
    borderColor: theme.colors.danger,
    backgroundColor: theme.colors.bgDanger,
  },
  toggleBtnText: {
    fontWeight: '700',
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  wordCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  textArea: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.bgRow,
    fontSize: 13,
    color: theme.colors.textMain,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  limitWarnText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderRadius: 12,
  },
  presetIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetTitle: {
    fontWeight: '700',
    fontSize: 13,
    color: theme.colors.textMain,
  },
  presetSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  sosBtn: {
    flex: 1,
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sosBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  saveBtnPrimary: {
    backgroundColor: theme.colors.ok,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statVal: {
    fontSize: 24,
    fontWeight: '800',
  },
  socialNoteBox: {
    backgroundColor: theme.colors.bgInfo,
    borderColor: theme.colors.borderInfo,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 10,
  },
  socialNoteTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.info,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  socialNoteText: {
    fontSize: 13,
    color: theme.colors.info,
  },
  commentsHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textMain,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  commentBox: {
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  emptyCommentsBox: {
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.borderLight,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyCommentsText: {
    color: theme.colors.textLight,
    fontSize: 13,
    fontStyle: 'italic',
  },
  activePlanBox: {
    backgroundColor: theme.colors.bgPrimary,
    borderColor: theme.colors.borderPrimary,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  activePlanTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  activePlanDesc: {
    fontSize: 13.5,
    color: theme.colors.textMain,
    fontWeight: '600',
    marginBottom: 4,
  },
  activePlanSub: {
    fontSize: 11.5,
    color: theme.colors.textMuted,
  },
  rubricBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rubricText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMain,
  },
  numericInput: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.bgRow,
    fontSize: 16,
    color: theme.colors.textMain,
    fontWeight: '700',
    marginBottom: 16,
  },
  confirmSosOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmSosCard: {
    backgroundColor: theme.colors.bgMobile,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  confirmIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.textMain,
    marginBottom: 6,
  },
  confirmText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  cancelSosBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.bgRow,
    alignItems: 'center',
  },
  confirmSosBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});
