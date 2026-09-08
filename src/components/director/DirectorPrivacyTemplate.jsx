import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Badge from '../ui/Badge';
import { theme } from '../../theme/tokens';

export default function DirectorPrivacyTemplate({ student, visibility, onToggleVisibility }) {
  if (!student) return null;

  const cards = [
    { id: 'grades', title: '📇 Tarjeta 1: Promedios y Calificaciones SEP', desc: 'Muestra el promedio oficial por asignatura (Ej: Matemáticas 8.5).', default: true },
    { id: 'behavior', title: '🚦 Tarjeta 2: Semáforo de Conducta y Asistencia (Resumen IA)', desc: 'Porcentaje general de asistencia y sello positivo del mes sin mostrar detalles de faltas menores.', default: true },
    { id: 'achievements', title: '🏆 Tarjeta 3: Logros, Felicitaciones y Destacados', desc: 'Reconocimientos cuando el alumno es marcado con 🎯 o ⚡ consecutivamente.', default: true },
    { id: 'socialNotes', title: '🏥 Tarjeta 4: Notas Confidenciales de Trabajo Social / Salud', desc: 'Adecuaciones socioeconómicas, alergias o situación familiar vulnerable. (Recomendado: APAGADO para padres).', default: false, sensitive: true },
    { id: 'aiAlerts', title: '🚨 Tarjeta 5: Focos Rojos Predictivos de Deserción (IA)', desc: 'Análisis interno de riesgo conductual o bajo rendimiento acumulado. (Recomendado: APAGADO para padres).', default: false, sensitive: true }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBanner}>
        <View style={styles.headerRow}>
          <Text style={{ fontSize: 32 }}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>
              Dirección y Subdirección: Configuración de Plantilla Pública para Padres
            </Text>
            <Text style={styles.headerDesc}>
              Control total del plantel: Enciende o apaga interruptores para decidir qué tarjetas de información verán los padres de familia en su portal web al consultar a <Text style={{ fontWeight: '800', color: '#ffffff' }}>{student.name}</Text>.
            </Text>
          </View>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        {cards.map(card => {
          const isVisible = visibility[card.id];

          return (
            <TouchableOpacity
              key={card.id}
              onPress={() => onToggleVisibility(card.id)}
              activeOpacity={0.8}
              style={[
                styles.toggleCard,
                isVisible ? styles.cardVisible : styles.cardHidden
              ]}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitleText}>
                    {card.title}
                  </Text>
                  {card.sensitive && (
                    <View style={styles.sensitiveTag}>
                      <Text style={styles.sensitiveTagText}>🔒 Confidencial</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardDescText}>
                  {card.desc}
                </Text>
              </View>

              {/* Toggle Switch */}
              <View style={styles.switchCol}>
                <Text style={[styles.statusText, isVisible ? { color: '#34d399' } : { color: '#64748b' }]}>
                  {isVisible ? '🟢 PÚBLICO' : '⚫ OCULTO'}
                </Text>
                <View style={[styles.switchTrack, isVisible ? { backgroundColor: '#10b981' } : { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                  <View style={[styles.switchThumb, isVisible && { transform: [{ translateX: 24 }] }]} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
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
  toggleCard: {
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardVisible: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 1,
  },
  cardHidden: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  cardTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  sensitiveTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  sensitiveTagText: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '700',
  },
  cardDescText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  switchCol: {
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  switchTrack: {
    width: 52,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
});

