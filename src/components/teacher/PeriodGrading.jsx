import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from '../ui/Icon';
import { theme } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

export default function PeriodGrading({ group, onUpdateStudent, showToast }) {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize editable grades state from students data
  const [finalGrades, setFinalGrades] = useState(() => {
    const grades = {};
    if (group && group.students) {
      group.students.forEach(s => {
        let calcGrade = parseFloat(s.historicalAverages.grade);
        if (s.gradeNumber) {
          calcGrade = (calcGrade + parseFloat(s.gradeNumber)) / 2;
        }
        grades[s.id] = calcGrade.toFixed(1);
      });
    }
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

  const avgGrade = (Object.values(finalGrades).reduce((acc, val) => acc + parseFloat(val || 0), 0) / (group.students.length || 1)).toFixed(1);
  const avgAttendance = Math.floor(group.students.reduce((acc, s) => acc + s.historicalAverages.attendance, 0) / (group.students.length || 1));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgMobile }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.textMain }]}>Cierre de Periodo</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textMuted }]}>
            Revisa y envía las calificaciones finales del {group.grade}{group.group} para consulta de tutores.
          </Text>
        </View>

        {/* Group Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
            <Icon name="award" size={24} color={theme.colors.primary} style={{ marginBottom: 8 }} />
            <Text style={styles.summaryValPrimary}>{avgGrade}</Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>Promedio Final</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
            <Icon name="users" size={24} color={theme.colors.ok} style={{ marginBottom: 8 }} />
            <Text style={styles.summaryValOk}>{avgAttendance}%</Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>Asistencia Global</Text>
          </View>
        </View>

        {isSubmitted ? (
          <View style={[styles.submittedBox, { backgroundColor: theme.colors.bgOk || 'rgba(16, 185, 129, 0.1)', borderColor: theme.colors.ok }]}>
            <View style={[styles.submittedIconCircle, { backgroundColor: theme.colors.bgRow }]}>
              <Icon name="check" size={32} color={theme.colors.ok} />
            </View>
            <Text style={styles.submittedTitle}>¡Enviado Oficialmente!</Text>
            <Text style={[styles.submittedSub, { color: theme.colors.textMain }]}>
              Las calificaciones y comentarios del periodo han sido bloqueados y publicados en el Portal de Padres.
            </Text>
          </View>
        ) : (
          <>
            {/* Student List */}
            <View style={styles.listSection}>
              <View style={styles.listHeaderRow}>
                <Text style={[styles.listHeaderText, { color: theme.colors.textMuted }]}>
                  Lista de Alumnos ({group.students.length})
                </Text>
                <Text style={[styles.listHeaderText, { color: theme.colors.textMuted }]}>
                  Calif. Final
                </Text>
              </View>

              {group.students.map(student => (
                <View key={student.id} style={[styles.studentCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
                  <View style={styles.studentRow}>
                    <View style={styles.studentInfoLeft}>
                      <View style={[styles.avatarCircle, { backgroundColor: theme.colors.bgMobile }]}>
                        <Text style={styles.avatarText}>{student.avatar}</Text>
                      </View>
                      <View>
                        <Text style={[styles.studentNamePrimary, { color: theme.colors.textMain }]}>
                          {student.name.split(',')[0]}
                        </Text>
                        <Text style={[styles.studentNameSecondary, { color: theme.colors.textMuted }]}>
                          {student.name.split(',')[1]}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.gradeInputRight}>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.attendanceLabel, { color: theme.colors.textMuted }]}>Asistencia</Text>
                        <Text style={styles.attendanceVal}>{student.historicalAverages.attendance}%</Text>
                      </View>
                      <TextInput 
                        keyboardType="decimal-pad"
                        value={String(finalGrades[student.id] || '')}
                        onChangeText={(val) => handleGradeChange(student.id, val)}
                        style={[styles.gradeInput, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderPrimary, color: theme.colors.primary }]}
                      />
                    </View>
                  </View>

                  {/* Optional Comment Input */}
                  <TextInput 
                    placeholder="Agregar comentario para el boletín del tutor (Opcional)..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={comments[student.id] || ''}
                    onChangeText={(val) => handleCommentChange(student.id, val)}
                    style={[styles.commentInput, { borderColor: theme.colors.borderLight, color: theme.colors.textMain }]}
                  />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {!isSubmitted && (
        <View style={[styles.fixedFooter, { backgroundColor: theme.colors.bgMobile, borderTopColor: theme.colors.borderLight }]}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
            style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator color="#ffffff" size="small" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>Procesando...</Text>
              </>
            ) : (
              <>
                <Icon name="send" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>Aprobar y Enviar</Text>
              </>
            ) }
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgMobile,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  summaryValPrimary: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.primary,
    lineHeight: 30,
  },
  summaryValOk: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.ok,
    lineHeight: 30,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  submittedBox: {
    backgroundColor: theme.colors.bgOk,
    borderColor: theme.colors.ok,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  submittedIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.ok,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submittedTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.colors.ok,
    marginBottom: 8,
  },
  submittedSub: {
    fontSize: 13.5,
    color: theme.colors.textMain,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 18,
  },
  listSection: {
    marginBottom: 24,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  listHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  studentCard: {
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.bgMobile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  studentNamePrimary: {
    fontSize: 14.5,
    fontWeight: '800',
    color: theme.colors.textMain,
  },
  studentNameSecondary: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  gradeInputRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  attendanceLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  attendanceVal: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.ok,
  },
  gradeInput: {
    width: 60,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.borderPrimary,
    backgroundColor: theme.colors.bgMobile,
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  commentInput: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: 'transparent',
    fontSize: 12,
    color: theme.colors.textMain,
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: theme.colors.bgMobile,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  submitButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});

