import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Badge from '../ui/Badge';
import Icon from '../ui/Icon';
import { theme } from '../../theme/tokens';

export default function SocialWorkIntake({ student, onSaveNote }) {
  const [note, setNote] = useState(student ? student.socialNote : '');
  const [isSaved, setIsSaved] = useState(false);

  if (!student) return null;

  const handleSave = () => {
    onSaveNote(student.id, note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBanner}>
        <View style={styles.headerRow}>
          <Text style={{ fontSize: 32 }}>🤝</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>
              Trabajo Social: Expediente 360° Socio-Familiar
            </Text>
            <Text style={styles.headerDesc}>
              Captura el contexto económico, familiar y de salud del alumno <Text style={{ fontWeight: '800', color: '#ffffff' }}>{student.name}</Text>. Esta información ayuda a la IA a sugerir planeaciones con empatía y sin pedir internet o materiales costosos.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.formCard}>
        <View style={styles.studentInfoRow}>
          <Text style={{ fontSize: 36 }}>{student.avatar}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentSub}>
              Lista #{student.listNumber} • Promedio SEP: {student.historicalAverages.grade}
            </Text>
          </View>
          <Badge type="info">Entrevista en Curso</Badge>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            📝 Nota Confidencial para Docentes (Contexto en Aula):
          </Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
            placeholder="Ej: Sin internet en casa, cuidado por abuelos, alergia severa al polvo..."
            placeholderTextColor={theme.colors.textMuted}
            style={styles.textArea}
          />
        </View>

        <View style={styles.gridRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>🌐 Conectividad en Hogar:</Text>
            <Text style={styles.infoBoxVal}>Sin internet fijo (Solo datos prepago limitados)</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>🏥 Alergias / Salud:</Text>
            <Text style={styles.infoBoxVal}>Reporte médico al día en enfermería</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          {isSaved && <Badge type="success" icon="✓">¡Expediente Actualizado!</Badge>}
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Icon name="save" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.saveBtnText}>Guardar Expediente 360°</Text>
          </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 40,
  },
  headerBanner: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    borderWidth: 1,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  formCard: {
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  studentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    paddingBottom: 12,
    marginBottom: 16,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  studentSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f0f4ff',
    marginBottom: 8,
  },
  textArea: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: 12,
    padding: 12,
    color: '#ffffff',
    fontSize: 13,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  gridRow: {
    gap: 10,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoBoxLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 4,
  },
  infoBoxVal: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});

