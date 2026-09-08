import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Badge from '../ui/Badge';
import { theme } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

export default function ParentPortal({ student, visibility }) {
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  if (!student) return null;

  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🇲🇽</Text>
          <Text style={styles.loginTitle}>Portal Padres de Familia</Text>
          <Text style={styles.loginSub}>
            Secundaria Técnica #45 • Consulta en Línea SEP
          </Text>
          <TextInput
            value="tutor.mateo@gmail.com"
            editable={false}
            style={styles.loginInput}
          />
          <TextInput
            value="••••••••••••"
            secureTextEntry
            editable={false}
            style={styles.loginInput}
          />
          <TouchableOpacity
            onPress={() => setIsLoggedIn(true)}
            style={styles.loginBtn}
          >
            <Text style={styles.loginBtnText}>Iniciar Sesión (Padre / Tutor)</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.bgMobile }]} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Welcome Header */}
      <View style={styles.welcomeBanner}>
        <View style={styles.welcomeRow}>
          <Text style={{ fontSize: 36 }}>{student.avatar}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTag}>BIENVENIDO FAMILIA GARCÍA</Text>
            <Text style={styles.bannerTitle}>
              Expediente Escolar: {student.name}
            </Text>
            <Text style={styles.bannerSub}>
              Secundaria Técnica #45 • Ciclo SEP 2026-2027
            </Text>
          </View>
        </View>
        <Badge type="ai" icon="🛡️">Portal Protegido SEP</Badge>
      </View>

      <View style={styles.privacyNoteBox}>
        <Text style={[styles.privacyNoteText, { color: theme.colors.textMuted }]}>
          🔒 <Text style={{ fontWeight: '800', color: theme.colors.textMain }}>Nota de Privacidad:</Text> La información mostrada aquí es seleccionada y aprobada por la Dirección del plantel para el acompañamiento familiar en casa.
        </Text>
      </View>

      {/* Grid of Public Cards */}
      <View style={{ gap: 16 }}>
        {visibility.grades && (
          <View style={[styles.card, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight, borderLeftColor: '#10b981' }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.colors.textMain }]}>📇 Calificaciones y Promedio Oficial SEP</Text>
              <Badge type="success">Promedio: {student.historicalAverages.grade}</Badge>
            </View>
            <Text style={[styles.cardDesc, { color: theme.colors.textMuted }]}>
              Avance del alumno en los 4 Campos Formativos de la Nueva Escuela Mexicana (NEM):
            </Text>
            <View style={styles.gradesGrid}>
              <View style={[styles.gradeItem, { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)' }]}>
                <Text style={[styles.gradeItemLabel, { color: theme.colors.textMuted }]}>Saberes y Pensamiento Científico:</Text>
                <Text style={[styles.gradeItemVal, { color: theme.colors.textMain }]}>8.5</Text>
              </View>
              <View style={[styles.gradeItem, { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)' }]}>
                <Text style={[styles.gradeItemLabel, { color: theme.colors.textMuted }]}>Lenguajes (Español/Inglés):</Text>
                <Text style={[styles.gradeItemVal, { color: theme.colors.textMain }]}>9.0</Text>
              </View>
              <View style={[styles.gradeItem, { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)' }]}>
                <Text style={[styles.gradeItemLabel, { color: theme.colors.textMuted }]}>Ética, Naturaleza y Sociedades:</Text>
                <Text style={[styles.gradeItemVal, { color: theme.colors.textMain }]}>8.8</Text>
              </View>
              <View style={[styles.gradeItem, { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)' }]}>
                <Text style={[styles.gradeItemLabel, { color: theme.colors.textMuted }]}>De lo Humano y lo Comunitario:</Text>
                <Text style={[styles.gradeItemVal, { color: theme.colors.textMain }]}>9.2</Text>
              </View>
            </View>
          </View>
        )}

        {visibility.behavior && (
          <View style={[styles.card, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight, borderLeftColor: '#fbbf24' }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.colors.textMain }]}>🚦 Semáforo de Conducta y Asistencia</Text>
              <Badge type="warning">Asistencia: {student.historicalAverages.attendance}%</Badge>
            </View>
            <Text style={[styles.cardDesc, { color: theme.colors.textMuted }]}>
              El alumno mantiene una conducta constructiva en aula. Se registra puntualidad constante en las sesiones vespertinas.
            </Text>
          </View>
        )}

        {visibility.achievements && (
          <View style={[styles.card, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight, borderLeftColor: '#a78bfa' }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.colors.textMain }]}>🏆 Felicitaciones y Logros Destacados</Text>
              <Badge type="ai">⭐ Destacado del Mes</Badge>
            </View>
            <Text style={[styles.cardDesc, { color: theme.colors.textMuted }]}>
              Felicitación por parte del docente de Matemáticas debido a su participación entusiasta ⚡ en la resolución de problemas en el pizarrón.
            </Text>
          </View>
        )}

        {visibility.socialNotes && (
          <View style={[styles.card, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight, borderLeftColor: '#3b82f6' }]}>
            <Text style={[styles.cardTitle, { color: '#60a5fa', marginBottom: 8 }]}>🏥 Notas de Trabajo Social y Salud</Text>
            <Text style={[styles.cardDesc, { color: theme.colors.textMuted }]}>
              {student.socialNote}
            </Text>
          </View>
        )}

        {visibility.aiAlerts && (
          <View style={[styles.card, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight, borderLeftColor: '#ef4444' }]}>
            <Text style={[styles.cardTitle, { color: '#f87171', marginBottom: 8 }]}>🚨 Alertas Tempranas IA</Text>
            <Text style={[styles.cardDesc, { color: theme.colors.textMuted }]}>
              Análisis automático conductual en seguimiento escolar.
            </Text>
          </View>
        )}

        {!visibility.grades && !visibility.behavior && !visibility.achievements && !visibility.socialNotes && !visibility.aiAlerts && (
          <View style={[styles.emptyCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
            <Text style={[styles.emptyCardTitle, { color: theme.colors.textMuted }]}>🔒 Todas las tarjetas han sido marcadas para uso interno por la Dirección.</Text>
            <Text style={[styles.emptyCardSub, { color: theme.colors.textMuted }]}>Consulte con la oficina del plantel para mayor información.</Text>
          </View>
        )}
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.bgMobile,
  },
  loginCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  loginSub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginInput: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 12,
  },
  loginBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  welcomeBanner: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    borderColor: 'rgba(167, 139, 250, 0.4)',
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerTag: {
    fontSize: 11,
    color: '#c4b5fd',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  bannerSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  privacyNoteBox: {
    marginBottom: 16,
  },
  privacyNoteText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  card: {
    backgroundColor: theme.colors.bgRow,
    borderColor: theme.colors.borderLight,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 14,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    flex: 1,
    marginRight: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  gradesGrid: {
    gap: 8,
    marginTop: 12,
  },
  gradeItem: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradeItemLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  gradeItemVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.bgRow,
    borderRadius: 14,
  },
  emptyCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyCardSub: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
});

