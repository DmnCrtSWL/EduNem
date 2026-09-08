import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from '../ui/Icon';
import { theme } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

export default function LessonPlanViewer({ group, monthlyPlans, onUpdateMonthlyPlans, onNavigateToWizard, onApprove }) {
  const { theme } = useTheme();
  const [selectedWeekId, setSelectedWeekId] = useState(1);
  const [isSimplifyingDay, setIsSimplifyingDay] = useState(null);
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(null);
  const [editingField, setEditingField] = useState(null);

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
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.bgMobile }]}>
        <View style={styles.emptyIconCircle}>
          <Icon name="sparkles" size={40} color="#ffffff" />
        </View>
        
        <View style={[styles.emptyCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Icon name="folder" size={14} color={theme.colors.primary} />
            <Text style={styles.emptyHeaderTag}>REPOSITORIO DE PLANEACIONES • {group.name}</Text>
          </View>
          
          <Text style={[styles.emptyTitle, { color: theme.colors.textMain }]}>
            Aún no tienes una planeación creada para {currentMonthData.subject}
          </Text>

          <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
            Para consultar el calendario escolar por semanas y las actividades diarias estructuradas para un aula sin internet, primero debemos armar tu planeación pedagógica con la IA.
          </Text>

          <View style={[styles.statusBox, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight }]}>
            <Icon name="map-pin" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.statusText, { color: theme.colors.textMain }]}>
              <Text style={{ fontWeight: '800' }}>Estado del ciclo: </Text>
              {currentStage === 'step1_lema' ? 'Paso 1 de 3 (Definiendo Lema Docente)' : currentStage === 'step2_objetivo' ? 'Paso 2 de 3 (Definiendo Objetivo del Mes)' : 'Paso 3 de 3 (Elegir Enfoque Didáctico)'}.
            </Text>
          </View>

          <TouchableOpacity onPress={onNavigateToWizard} style={[styles.createBtnPrimary, { backgroundColor: theme.colors.primary }]}>
            <Icon name="sparkles" size={18} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.createBtnPrimaryText}>
              Ir a "Planeación Inteligente" y{'\n'}Crear Plan ➔
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSimplifyDayActivity = (dayIndex) => {
    setIsSimplifyingDay(dayIndex);
    setTimeout(() => {
      onUpdateMonthlyPlans(prev => {
        const groupData = prev[group.id] || prev['3a'];
        const updatedWeeks = groupData.weeks.map(w => {
          if (w.id !== selectedWeekId) return w;
          const updatedDays = [...w.days];
          const targetDay = updatedDays[dayIndex];
          updatedDays[dayIndex] = {
            ...targetDay,
            main: `(Versión Simplificada 1-tap): ${targetDay.main}`
          };
          return { ...w, days: updatedDays };
        });
        return { ...prev, [group.id]: { ...groupData, weeks: updatedWeeks } };
      });
      setIsSimplifyingDay(null);
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
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bgMobile }]} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* Top Header & Status */}
      <View style={styles.headerBlock}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.subjectTitle, { color: theme.colors.textMain }]}>{currentMonthData.subject}</Text>
            <Text style={[styles.subjectSub, { color: theme.colors.textMuted }]}>{group.name} • {currentMonthData.monthName}</Text>
          </View>

          <TouchableOpacity onPress={onNavigateToWizard} style={[styles.settingsCircle, { backgroundColor: theme.colors.bgPrimary }]}>
            <Icon name="settings" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Status Badge */}
        <View style={[
          styles.statusBadge,
          currentStage === 'approved' ? { backgroundColor: theme.colors.bgOk } :
          currentStage === 'submitted' ? { backgroundColor: theme.colors.bgWarn } : { backgroundColor: theme.colors.bgInfo }
        ]}>
          <Icon 
            name={currentStage === 'approved' ? 'check-circle' : currentStage === 'submitted' ? 'clock' : 'eye'} 
            size={14} 
            color={currentStage === 'approved' ? theme.colors.ok : currentStage === 'submitted' ? theme.colors.warn : theme.colors.info} 
            style={{ marginRight: 6 }}
          />
          <Text style={[
            styles.statusBadgeText,
            currentStage === 'approved' ? { color: theme.colors.ok } :
            currentStage === 'submitted' ? { color: theme.colors.warn } : { color: theme.colors.info }
          ]}>
            {currentStage === 'approved' ? 'Plan Aprobado Oficialmente' : currentStage === 'submitted' ? 'En Revisión (Dirección)' : 'Borrador sin enviar'}
          </Text>
        </View>

        {/* 1-Tap Action Buttons */}
        {(currentStage === 'preview' || currentStage === 'step1_lema' || currentStage === 'step2_objetivo' || currentStage === 'step3_enfoque') && (
          <TouchableOpacity onPress={handleSubmitToDirector} style={[styles.actionBtn, { backgroundColor: theme.colors.info }]}>
            <Icon name="send" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnText}>Enviar a Dirección</Text>
          </TouchableOpacity>
        )}

        {currentStage === 'submitted' && (
          <TouchableOpacity onPress={handleSimulateDirectorApproval} style={[styles.actionBtn, { backgroundColor: theme.colors.ok }]}>
            <Icon name="check" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnText}>Simular Aprobación</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Week Selector Grid */}
      <View style={{ marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 12 }}>
          {currentMonthData.weeks.map((w, i) => {
            const isSelected = selectedWeekId === w.id;
            return (
              <TouchableOpacity
                key={w.id}
                onPress={() => setSelectedWeekId(w.id)}
                style={[
                  styles.weekPill,
                  isSelected
                    ? styles.weekPillActive
                    : [styles.weekPillInactive, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]
                ]}
              >
                <Text style={[styles.weekPillText, { color: isSelected ? '#ffffff' : theme.colors.textMuted }, isSelected && { fontWeight: '800' }]}>
                  Sem {i + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Week Card */}
        <View style={[styles.weekCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <Icon name="target" size={14} color={theme.colors.primary} />
              <Text style={[styles.weekDateText, { color: theme.colors.primary }]}>{currentWeek.dateRange}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 4, flex: 1, justifyContent: 'flex-end' }}>
              <Icon name="pin" size={14} color={theme.colors.textMuted} style={{ marginTop: 1 }} />
              <Text style={[styles.weekThemeText, { color: theme.colors.textMuted, flexShrink: 1, textAlign: 'right' }]}>{currentWeek.theme}</Text>
            </View>
          </View>
          <Text style={[styles.weekObjectiveText, { color: theme.colors.textMain }]}>
            {currentWeek.objective}
          </Text>
        </View>

        {/* Daily Activities Grid */}
        <View style={{ gap: 14 }}>
          {currentWeek.days.map((dayItem, dIdx) => (
            <View key={dIdx} style={[styles.dayCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
              <View style={styles.dayCardHeader}>
                <Text style={[styles.dayBadgeText, { backgroundColor: theme.colors.bgPrimary, color: theme.colors.primary }]}>{dayItem.day}</Text>

                {currentStage === 'approved' && (
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      onPress={() => handleSimplifyDayActivity(dIdx)}
                      disabled={isSimplifyingDay === dIdx}
                      style={[styles.adaptBtn, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight }]}
                    >
                      <Icon name="sparkles" size={12} color={theme.colors.warn} style={{ marginRight: 4 }} />
                      <Text style={[styles.adaptBtnText, { color: theme.colors.textMain }]}>{isSimplifyingDay === dIdx ? 'Ajustando...' : 'Adaptar'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRegenerateDayActivity(dIdx)}
                      disabled={isRegeneratingDay === dIdx}
                      style={[styles.adaptBtn, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight }]}
                    >
                      <Icon name="refresh" size={12} color={theme.colors.info} style={{ marginRight: 4 }} />
                      <Text style={[styles.adaptBtnText, { color: theme.colors.textMain }]}>{isRegeneratingDay === dIdx ? 'Generando...' : 'Regenerar'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <Text style={[styles.dayTitle, { color: theme.colors.textMain }]}>{dayItem.title}</Text>

              <View style={{ gap: 12 }}>
                {/* INICIO */}
                <View style={styles.stepRow}>
                  <View style={[styles.stepNumCircle, { backgroundColor: theme.colors.bgPrimary }]}>
                    <Text style={[styles.stepNumText, { color: theme.colors.primary }]}>1</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.rowBetween}>
                      <Text style={[styles.stepLabel, { color: theme.colors.textMain }]}>
                        Inicio <Text style={[styles.stepWeight, { color: theme.colors.textMuted }]}>{getWeight(1)}</Text>
                      </Text>
                      {currentStage === 'preview' && (
                        <TouchableOpacity onPress={() => setEditingField({ dayIdx: dIdx, field: 'start', value: dayItem.start })}>
                          <Icon name="edit-2" size={12} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                    {editingField && editingField.dayIdx === dIdx && editingField.field === 'start' ? (
                      <View style={{ gap: 8, marginTop: 4 }}>
                        <TextInput multiline value={editingField.value} onChangeText={(val) => setEditingField({ ...editingField, value: val })} style={[styles.editInput, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight, color: theme.colors.textMain }]} />
                        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
                          <TouchableOpacity onPress={() => setEditingField(null)} style={styles.cancelEditBtn}>
                            <Text style={[styles.cancelEditText, { color: theme.colors.textMuted }]}>Cancelar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleSaveEdit} style={[styles.saveEditBtn, { backgroundColor: theme.colors.primary }]}>
                            <Text style={styles.saveEditText}>Guardar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <Text style={[styles.stepDesc, { color: theme.colors.textMuted }]}>{dayItem.start}</Text>
                    )}
                  </View>
                </View>
                
                {/* DESARROLLO */}
                <View style={styles.stepRow}>
                  <View style={[styles.stepNumCircle, { backgroundColor: theme.colors.bgPrimary }]}>
                    <Text style={[styles.stepNumText, { color: theme.colors.primary }]}>2</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.rowBetween}>
                      <Text style={[styles.stepLabel, { color: theme.colors.primary }]}>
                        Desarrollo <Text style={[styles.stepWeight, { color: theme.colors.textMuted }]}>{getWeight(2)}</Text>
                      </Text>
                      {currentStage === 'preview' && (
                        <TouchableOpacity onPress={() => setEditingField({ dayIdx: dIdx, field: 'main', value: dayItem.main })}>
                          <Icon name="edit-2" size={12} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                    {editingField && editingField.dayIdx === dIdx && editingField.field === 'main' ? (
                      <View style={{ gap: 8, marginTop: 4 }}>
                        <TextInput multiline value={editingField.value} onChangeText={(val) => setEditingField({ ...editingField, value: val })} style={[styles.editInput, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight, color: theme.colors.textMain }]} />
                        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
                          <TouchableOpacity onPress={() => setEditingField(null)} style={styles.cancelEditBtn}>
                            <Text style={[styles.cancelEditText, { color: theme.colors.textMuted }]}>Cancelar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleSaveEdit} style={[styles.saveEditBtn, { backgroundColor: theme.colors.primary }]}>
                            <Text style={styles.saveEditText}>Guardar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <Text style={[styles.stepDesc, { color: theme.colors.textMain, fontWeight: '600' }]}>{dayItem.main}</Text>
                    )}
                  </View>
                </View>
                
                {/* CIERRE */}
                <View style={styles.stepRow}>
                  <View style={[styles.stepNumCircle, { backgroundColor: theme.colors.bgPrimary }]}>
                    <Text style={[styles.stepNumText, { color: theme.colors.primary }]}>3</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.rowBetween}>
                      <Text style={[styles.stepLabel, { color: theme.colors.textMain }]}>
                        Cierre <Text style={[styles.stepWeight, { color: theme.colors.textMuted }]}>{getWeight(3)}</Text>
                      </Text>
                      {currentStage === 'preview' && (
                        <TouchableOpacity onPress={() => setEditingField({ dayIdx: dIdx, field: 'end', value: dayItem.end })}>
                          <Icon name="edit-2" size={12} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                    {editingField && editingField.dayIdx === dIdx && editingField.field === 'end' ? (
                      <View style={{ gap: 8, marginTop: 4 }}>
                        <TextInput multiline value={editingField.value} onChangeText={(val) => setEditingField({ ...editingField, value: val })} style={[styles.editInput, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight, color: theme.colors.textMain }]} />
                        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
                          <TouchableOpacity onPress={() => setEditingField(null)} style={styles.cancelEditBtn}>
                            <Text style={[styles.cancelEditText, { color: theme.colors.textMuted }]}>Cancelar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleSaveEdit} style={[styles.saveEditBtn, { backgroundColor: theme.colors.primary }]}>
                            <Text style={styles.saveEditText}>Guardar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <Text style={[styles.stepDesc, { color: theme.colors.textMuted }]}>{dayItem.end}</Text>
                    )}
                  </View>
                </View>

              </View>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgMobile,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  emptyHeaderTag: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.textMain,
    lineHeight: 24,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  statusBox: {
    backgroundColor: theme.colors.bgMobile,
    borderColor: theme.colors.borderInfo,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.textMain,
    flex: 1,
  },
  createPlanBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  createPlanBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  createBtnPrimary: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  createBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 18,
  },
  headerBlock: {
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.textMain,
  },
  subjectSub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  settingsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtn: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  weekPill: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  weekPillActive: {
    backgroundColor: theme.colors.primary,
  },
  weekPillInactive: {
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
  },
  weekPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  weekCard: {
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  weekDateText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  weekThemeText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  weekObjectiveText: {
    fontSize: 13.5,
    color: theme.colors.textMain,
    marginTop: 6,
    lineHeight: 18,
  },
  dayCard: {
    backgroundColor: theme.colors.bgRow,
    borderRadius: 16,
    padding: 16,
  },
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.primary,
    backgroundColor: theme.colors.bgPrimary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  adaptBtn: {
    backgroundColor: theme.colors.bgMobile,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adaptBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMain,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textMain,
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  stepNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: theme.colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMain,
  },
  stepWeight: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  stepDesc: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
    marginTop: 2,
  },
  editInput: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.bgMobile,
    fontSize: 12,
    color: theme.colors.textMain,
    minHeight: 50,
  },
  cancelEditBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelEditText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  saveEditBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
  },
  saveEditText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
});

