import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

export default function StudentCard({ student, onClick, isSelected }) {
  const { theme } = useTheme();
  const moodEmojis = {
    energetic: { icon: '⚡', label: 'Energético', color: '#fbbf24' },
    normal: { icon: '😊', label: 'Normal', color: '#34d399' },
    sad: { icon: '😔', label: 'Distraído / Triste', color: '#60a5fa' },
    tired: { icon: '😴', label: 'Cansado / Apatía', color: '#94a3b8' }
  };

  const perfEmojis = {
    excellent: { icon: '🎯', label: 'Domina el tema', color: '#a78bfa' },
    normal: { icon: '🟢', label: 'Cumplió normal', color: '#34d399' },
    doubts: { icon: '🟡', label: 'Dudas en clase', color: '#fbbf24' },
    difficulty: { icon: '🔴', label: 'Dificultad / No entregó', color: '#f87171' }
  };

  const currentMood = moodEmojis[student.mood] || moodEmojis.normal;
  const currentPerf = perfEmojis[student.performance] || perfEmojis.normal;

  const isException = student.status === 'exception' || student.performance === 'difficulty' || student.performance === 'doubts' || student.mood === 'sad';
  const isOk = student.status === 'ok';

  return (
    <TouchableOpacity
      onPress={() => onClick(student)}
      style={[
        styles.card,
        {
          backgroundColor: isException ? theme.colors.bgWarn : isOk ? theme.colors.bgOk : theme.colors.bgRow,
          borderColor: isException ? theme.colors.borderWarn : isOk ? theme.colors.borderOk : theme.colors.borderLight
        },
        isSelected && styles.cardSelected
      ]}
      activeOpacity={0.8}
    >
      {/* Header: List Number and Badges */}
      <View style={styles.headerRow}>
        <View style={[styles.numberBadge, { backgroundColor: theme.colors.bgMobile }]}>
          <Text style={[styles.numberText, { color: theme.colors.textMuted }]}>#{student.listNumber}</Text>
        </View>

        <View style={styles.badgesRow}>
          {student.socialNote && !student.socialNote.includes('Ninguna') && (
            <View style={styles.socialBadge}>
              <Text style={styles.socialBadgeText}>🤝 Info</Text>
            </View>
          )}
          {student.sosReported && (
            <View style={styles.sosBadge}>
              <Text style={styles.sosBadgeText}>🚨 SOS</Text>
            </View>
          )}
        </View>
      </View>

      {/* Student Name */}
      <View style={styles.nameWrapper}>
        <Text style={[styles.studentName, { color: theme.colors.textMain }]} numberOfLines={1}>
          {student.name}
        </Text>
      </View>

      {/* Footer Status */}
      <View style={[styles.footerRow, { borderTopColor: theme.colors.borderLight }]}>
        <Text style={styles.emojiText}>{currentMood.icon}</Text>
        <View style={styles.perfRow}>
          <Text style={styles.emojiText}>{currentPerf.icon}</Text>
          {student.status === 'ok' && <Text style={styles.okText}>OK</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 115,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardNormal: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  cardOk: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  cardException: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  cardSelected: {
    borderColor: '#2563eb',
    borderWidth: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  numberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 4,
  },
  socialBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  socialBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
  sosBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  sosBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dc2626',
  },
  nameWrapper: {
    marginVertical: 6,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 6,
  },
  perfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emojiText: {
    fontSize: 16,
  },
  okText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
});
