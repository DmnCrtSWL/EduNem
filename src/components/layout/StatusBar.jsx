import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Badge from '../ui/Badge';
import { theme } from '../../theme/tokens';

export default function StatusBar({ currentGroup, totalStudents, checkedCount }) {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <Badge type="success" icon="🟢">
          Conectado: Prefectura en Tiempo Real
        </Badge>
        <Text style={styles.infoText}>
          🏫 <Text style={{ fontWeight: '800', color: '#ffffff' }}>Plan SEP (NEM):</Text> Ciclo Escolar 2026-2027 • Fase 6
        </Text>
      </View>

      {currentGroup && (
        <View style={styles.rightRow}>
          <Text style={styles.infoText}>
            📊 Progreso del Grupo: <Text style={{ color: '#ffffff', fontWeight: '800' }}>{checkedCount} / {totalStudents}</Text> registrados
          </Text>
          <View style={styles.progressTrack}>
            <View style={[
              styles.progressFill,
              { width: `${totalStudents > 0 ? (checkedCount / totalStudents) * 100 : 0}%` }
            ]} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(19, 27, 46, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  progressTrack: {
    width: 100,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
});

