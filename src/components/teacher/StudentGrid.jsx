import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from '../ui/Icon';
import ClassSelector from './ClassSelector';
import { theme } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

export default function StudentGrid({ groups, selectedGroupId, group, isClassInSession = true, onSimulateClassTime, onStudentClick, onToggleAbsence, onRequestToggleAbsence }) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  const filteredStudents = useMemo(() => {
    if (!group || !group.students) return [];
    const filtered = group.students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.listNumber.toString().includes(searchTerm)
    );
    
    return filtered.sort((a, b) => {
      const aIsAbsent = a.attendance === 'absent' ? 1 : 0;
      const bIsAbsent = b.attendance === 'absent' ? 1 : 0;
      if (aIsAbsent !== bIsAbsent) return aIsAbsent - bIsAbsent;
      return a.listNumber - b.listNumber;
    });
  }, [group, searchTerm]);

  if (!group) return null;

  const presentCount = group.students.filter(s => s.attendance === 'present').length;

  const getInitials = (name) => {
    const clean = name.replace(',', '');
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 3) return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
    return parts[0][0] || 'U';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgMobile }]}>
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={true}>
        {/* Class Header Title & Schedule */}
        {groups && selectedGroupId && (
          <ClassSelector groups={groups} selectedGroupId={selectedGroupId} />
        )}

        {/* Attendance Summary Bar */}
        <View style={styles.summaryBar}>
          <Text style={[styles.summaryText, { color: theme.colors.textMuted }]}>
            Total lista: <Text style={[styles.boldText, { color: theme.colors.textMain }]}>{group.totalStudents} alumnos</Text>
          </Text>
          <Text style={[styles.presentText, { color: theme.colors.ok }]}>✓ {presentCount} presentes</Text>
        </View>

        {/* Warning Banner When Class is Not In Session */}
        {!isClassInSession && (
          <View style={[styles.readOnlyBanner, { backgroundColor: theme.colors.bgWarn, borderColor: theme.colors.borderWarn }]}>
            <View style={styles.bannerHeader}>
              <Icon name="lock" size={16} color={theme.colors.warn} />
              <Text style={[styles.bannerTitle, { color: theme.colors.warn }]}>Modo Lectura: Clase no en curso</Text>
            </View>
            <Text style={[styles.bannerDescription, { color: theme.colors.textMain }]}>
              Estás consultando la lista de <Text style={styles.boldText}>{group.name}</Text> (Horario: {group.schedule}).
            </Text>
            {onSimulateClassTime && (
              <TouchableOpacity style={[styles.demoButton, { backgroundColor: theme.colors.warn }]} onPress={onSimulateClassTime} activeOpacity={0.8}>
                <Icon name="clock" size={14} color="#ffffff" />
                <Text style={styles.demoButtonText}>⚡ Demo: Situar reloj en hora de esta clase</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Zero Friction Notification Banner */}
        {showBanner && isClassInSession && (
          <View style={[styles.infoBanner, { backgroundColor: theme.colors.bgOk, borderColor: theme.colors.borderOk }]}>
            <View style={styles.infoBannerContent}>
              <Icon name="check" size={16} color={theme.colors.ok} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoTitle, { color: theme.colors.ok }]}>Asistencia 100% por defecto</Text>
                <Text style={[styles.infoSubtitle, { color: theme.colors.textMain }]}>Todo el grupo está presente. Toca el check solo en quien falte.</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowBanner(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.closeBannerText, { color: theme.colors.ok }]}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search Input */}
        <View style={styles.searchWrapper}>
          <View style={[styles.searchInputContainer, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
            <Icon name="search" size={16} color={theme.colors.textMuted} />
            <TextInput
              placeholder="Buscar por apellido, nombre o #..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={[styles.searchInput, { color: theme.colors.textMain }]}
            />
          </View>
        </View>

        {filteredStudents.map((s) => {
          const isAbsent = s.attendance === 'absent';
          const hasTeacherNote = Boolean(s.teacherNote && s.teacherNote.trim() !== '');
          const hasSocialNote = Boolean(s.socialNote && !s.socialNote.includes('Ninguna'));
          const isException = s.status === 'exception' && !isAbsent;

          return (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.rosterRow,
                {
                  backgroundColor: isAbsent ? theme.colors.bgDanger : isException ? theme.colors.bgWarn : theme.colors.bgRow,
                  borderBottomColor: theme.colors.borderLight
                },
                !isClassInSession && styles.rowDisabled
              ]}
              onPress={() => {
                if (!isClassInSession) return;
                onStudentClick(s);
              }}
              activeOpacity={isClassInSession ? 0.7 : 1}
              disabled={!isClassInSession}
            >
              {/* Student Info */}
              <View style={styles.studentInfoRow}>
                <Text style={[styles.listNumber, { color: isAbsent ? theme.colors.danger : theme.colors.textMuted }]}>
                  {s.listNumber}.
                </Text>

                {/* Avatar Initials */}
                <View style={[
                  styles.avatar,
                  {
                    backgroundColor: theme.isDark ? '#1e293b' : '#f8fafc',
                    borderColor: theme.isDark ? 'transparent' : '#e2e8f0'
                  }
                ]}>
                  <Text style={[
                    styles.avatarText,
                    { color: isAbsent ? theme.colors.danger : isException ? theme.colors.warn : theme.isDark ? '#94a3b8' : theme.colors.textMuted }
                  ]}>
                    {getInitials(s.name)}
                  </Text>
                </View>

                <View style={styles.nameContainer}>
                  <Text
                    style={[
                      styles.studentName,
                      { color: isAbsent ? theme.colors.danger : theme.colors.textMain }
                    ]}
                    numberOfLines={1}
                  >
                    {s.name}
                  </Text>

                  {/* Note Badges */}
                  <View style={styles.badgesRow}>
                    {hasTeacherNote && (
                      <View style={[
                        styles.badgeTeacher,
                        theme.isDark && { backgroundColor: '#1e3a8a33', borderColor: '#1e40af' }
                      ]}>
                        <Icon name="file-text" size={11} color={theme.isDark ? '#60a5fa' : '#2563eb'} />
                        <Text style={[styles.badgeTeacherText, theme.isDark && { color: '#60a5fa' }]} numberOfLines={1}>
                          Nota: {s.teacherNote}
                        </Text>
                      </View>
                    )}

                    {hasSocialNote && !hasTeacherNote && (
                      <View style={[
                        styles.badgeSocial,
                        theme.isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }
                      ]}>
                        <Icon name="heart-pulse" size={11} color={theme.isDark ? '#94a3b8' : '#64748b'} />
                        <Text style={[styles.badgeSocialText, theme.isDark && { color: '#94a3b8' }]}>TS</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Check / Absent Action Button */}
              <TouchableOpacity
                disabled={!isClassInSession}
                onPress={() => {
                  if (!isClassInSession) return;
                  onRequestToggleAbsence ? onRequestToggleAbsence(s) : onToggleAbsence(s.id);
                }}
                style={[
                  styles.actionButton,
                  !isClassInSession
                    ? { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight, borderWidth: 1, opacity: 0.5 }
                    : isAbsent
                      ? styles.btnAbsent
                      : { backgroundColor: theme.colors.bgOk, borderColor: theme.colors.ok, borderWidth: 1.5 }
                ]}
                activeOpacity={0.7}
              >
                <Icon
                  name={!isClassInSession ? 'lock' : isAbsent ? 'x' : 'check'}
                  size={!isClassInSession ? 15 : 18}
                  color={!isClassInSession ? theme.colors.textMuted : isAbsent ? '#ffffff' : theme.colors.ok}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  summaryBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    color: '#64748b',
  },
  boldText: {
    fontWeight: '700',
  },
  presentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  readOnlyBanner: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#fffbeb',
    borderWidth: 1.5,
    borderColor: '#fde68a',
    borderRadius: 12,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#d97706',
  },
  bannerDescription: {
    fontSize: 12,
    color: '#0f172a',
    marginTop: 4,
    lineHeight: 16,
  },
  demoButton: {
    marginTop: 8,
    backgroundColor: '#d97706',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  demoButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  infoBanner: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  infoSubtitle: {
    fontSize: 11,
    color: '#0f172a',
  },
  closeBannerText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
    paddingHorizontal: 6,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  listContent: {
    paddingBottom: 24,
  },
  rosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  rowAbsent: {
    backgroundColor: '#fef2f2',
  },
  rowException: {
    backgroundColor: '#fffbeb',
  },
  rowOk: {
    backgroundColor: '#ffffff',
  },
  rowDisabled: {
    opacity: 0.65,
  },
  studentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  listNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    width: 22,
    textAlign: 'right',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  avatarOk: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  avatarAbsent: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  avatarException: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
  },
  nameContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  studentNameAbsent: {
    color: '#dc2626',
    textDecorationLine: 'line-through',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  badgeTeacher: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    maxWidth: 180,
  },
  badgeTeacherText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563eb',
  },
  badgeSocial: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgeSocialText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPresent: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#059669',
  },
  btnAbsent: {
    backgroundColor: '#dc2626',
    borderWidth: 1.5,
    borderColor: '#dc2626',
  },
  btnLocked: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    opacity: 0.5,
  },
  textAbsent: {
    color: '#dc2626',
  },
  textWarn: {
    color: '#d97706',
  },
  textMuted: {
    color: '#64748b',
  },
});
