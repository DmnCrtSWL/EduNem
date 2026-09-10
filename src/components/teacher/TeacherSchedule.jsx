import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from '../ui/Icon';
import { theme } from '../../theme/tokens';
import { useTheme } from '../../context/ThemeContext';

const WEEK_DAYS = [
  { id: 1, name: 'Lunes', short: 'Lun', dateNum: 26 },
  { id: 2, name: 'Martes', short: 'Mar', dateNum: 27 },
  { id: 3, name: 'Miércoles', short: 'Mié', dateNum: 28 },
  { id: 4, name: 'Jueves', short: 'Jue', dateNum: 29 },
  { id: 5, name: 'Viernes', short: 'Vie', dateNum: 30 }
];

const SCHEDULE_BLOCKS = [
  { id: '3a', day: 1, startH: 7, startM: 0, endH: 8, endM: 40, timeStr: '07:00 - 08:40', title: '3°A - Español III', room: 'Aula 05 - Edificio A', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { id: '2b', day: 1, startH: 8, startM: 40, endH: 10, endM: 20, timeStr: '08:40 - 10:20', title: '2°B - Matemáticas II', room: 'Aula 12 - Edificio B', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { id: '1c', day: 1, startH: 16, startM: 0, endH: 16, endM: 50, timeStr: '16:00 - 16:50', title: '1°C - Formación Cívica', room: 'Aula 18 - Edificio C', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  
  { id: '2b', day: 2, startH: 8, startM: 40, endH: 10, endM: 20, timeStr: '08:40 - 10:20', title: '2°B - Matemáticas II', room: 'Aula 12 - Edificio B', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { id: '3a', day: 2, startH: 10, startM: 50, endH: 12, endM: 30, timeStr: '10:50 - 12:30', title: '3°A - Español III', room: 'Aula 05 - Edificio A', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { id: '1c', day: 2, startH: 16, startM: 0, endH: 16, endM: 50, timeStr: '16:00 - 16:50', title: '1°C - Formación Cívica', room: 'Aula 18 - Edificio C', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  
  { id: '3a', day: 3, startH: 7, startM: 0, endH: 8, endM: 40, timeStr: '07:00 - 08:40', title: '3°A - Español III', room: 'Aula 05 - Edificio A', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { id: '2b', day: 3, startH: 8, startM: 40, endH: 10, endM: 20, timeStr: '08:40 - 10:20', title: '2°B - Matemáticas II', room: 'Aula 12 - Edificio B', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { id: '1c', day: 3, startH: 16, startM: 0, endH: 16, endM: 50, timeStr: '16:00 - 16:50', title: '1°C - Formación Cívica', room: 'Aula 18 - Edificio C', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  
  { id: '2b', day: 4, startH: 8, startM: 40, endH: 10, endM: 20, timeStr: '08:40 - 10:20', title: '2°B - Matemáticas II', room: 'Aula 12 - Edificio B', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { id: '3a', day: 4, startH: 10, startM: 50, endH: 12, endM: 30, timeStr: '10:50 - 12:30', title: '3°A - Español III', room: 'Aula 05 - Edificio A', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { id: '1c', day: 4, startH: 16, startM: 0, endH: 16, endM: 50, timeStr: '16:00 - 16:50', title: '1°C - Formación Cívica', room: 'Aula 18 - Edificio C', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  
  { id: '3a', day: 5, startH: 7, startM: 0, endH: 8, endM: 40, timeStr: '07:00 - 08:40', title: '3°A - Español III', room: 'Aula 05 - Edificio A', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { id: '2b', day: 5, startH: 8, startM: 40, endH: 10, endM: 20, timeStr: '08:40 - 10:20', title: '2°B - Matemáticas II', room: 'Aula 12 - Edificio B', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' }
];

export default function TeacherSchedule({ groups, currentUser, simulatedTime, onSimulateTime, onSelectGroup, onNavigateToList }) {
  const { theme } = useTheme();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pushMinutes, setPushMinutes] = useState('5');
  const [showNotifyConfig, setShowNotifyConfig] = useState(false);
  const [calendarView, setCalendarView] = useState('today');
  const [showDemoTools, setShowDemoTools] = useState(false);

  const activeBlocks = React.useMemo(() => {
    if (!groups || groups.length === 0) return SCHEDULE_BLOCKS;
    const teacherGroups = currentUser && currentUser.name
      ? groups.filter(g => !g.teacherName || g.teacherName === currentUser.name)
      : groups;
    const sourceGroups = teacherGroups.length > 0 ? teacherGroups : groups;

    const blocks = [];
    sourceGroups.forEach(g => {
      if (!g.scheduleRule || !g.scheduleRule.days) return;
      const isMath = g.subject.includes('Matemáticas');
      const isCie = g.subject.includes('Ciencias');
      const isHis = g.subject.includes('Historia');
      const color = isMath ? '#059669' : isCie ? '#0d9488' : isHis ? '#d97706' : '#2563eb';
      const bg = isMath ? '#ecfdf5' : isCie ? '#f0fdfa' : isHis ? '#fffbeb' : '#eff6ff';
      const border = isMath ? '#a7f3d0' : isCie ? '#99f6e4' : isHis ? '#fde68a' : '#bfdbfe';

      g.scheduleRule.days.forEach(day => {
        const sH = String(g.scheduleRule.startHour).padStart(2, '0');
        const sM = String(g.scheduleRule.startMin).padStart(2, '0');
        const eH = String(g.scheduleRule.endHour).padStart(2, '0');
        const eM = String(g.scheduleRule.endMin).padStart(2, '0');
        blocks.push({
          id: g.id,
          day,
          startH: g.scheduleRule.startHour,
          startM: g.scheduleRule.startMin,
          endH: g.scheduleRule.endHour,
          endM: g.scheduleRule.endMin,
          timeStr: `${sH}:${sM} - ${eH}:${eM}`,
          title: g.name,
          room: g.classroom,
          color,
          bg,
          border,
          teacherName: g.teacherName
        });
      });
    });
    return blocks.sort((a, b) => (a.startH * 60 + a.startM) - (b.startH * 60 + b.startM));
  }, [groups, currentUser]);

  const cdmxDate = simulatedTime || new Date();
  const currentDayNum = cdmxDate.getDay();
  const todayDayId = (currentDayNum >= 1 && currentDayNum <= 5) ? currentDayNum : 1;
  const timeString = cdmxDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });

  const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  const dateHeaderStr = `${dayNames[cdmxDate.getDay()]} ${cdmxDate.getDate()} DE ${monthNames[cdmxDate.getMonth()]}`;
  const todayBlocks = activeBlocks.filter(b => b.day === todayDayId);

  const handleSelectBlock = (groupId) => {
    onSelectGroup(groupId);
    onNavigateToList();
  };

  const handleSimulateSlot = (h, m, groupId) => {
    const now = new Date();
    const simDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    if (onSimulateTime) onSimulateTime(simDate, groupId);
  };

  const handleResetLiveClock = () => {
    if (onSimulateTime) onSimulateTime(null, null);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.bgMobile }]}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.title, { color: theme.colors.textMain }]}>Mi Horario Escolar</Text>
          <View style={styles.subRow}>
            <Icon name="map-pin" size={14} color="#dc2626" />
            <Text style={styles.subText}>CDMX en Vivo ({timeString})</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowNotifyConfig(!showNotifyConfig)}
          style={[
            styles.notifyPill,
            {
              backgroundColor: pushEnabled ? (theme.isDark ? '#064e3b' : '#ecfdf5') : theme.colors.bgRow,
              borderColor: pushEnabled ? (theme.isDark ? '#059669' : '#a7f3d0') : theme.colors.borderLight,
              borderWidth: 1.5,
            }
          ]}
        >
          <Icon name="bell" size={14} color={pushEnabled ? (theme.isDark ? '#34d399' : '#059669') : theme.colors.textMuted} />
          <Text style={[styles.notifyPillText, { color: pushEnabled ? (theme.isDark ? '#34d399' : '#059669') : theme.colors.textMuted }]}>
            {pushEnabled ? `Alerta: ${pushMinutes}m` : 'Alertas Off'}
          </Text>
          <Icon name="settings" size={13} color={pushEnabled ? (theme.isDark ? '#34d399' : '#059669') : theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Push Config */}
      {showNotifyConfig && (
        <View style={[styles.notifyConfigBox, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
          <View style={styles.notifyConfigHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.notifyIconBadge, { backgroundColor: theme.colors.bgOk }]}>
                <Icon name="bell" size={14} color={theme.colors.ok} />
              </View>
              <Text style={[styles.notifyConfigTitle, { color: theme.colors.textMain }]}>Notificaciones Push de Clase</Text>
            </View>
            <TouchableOpacity
              onPress={() => setPushEnabled(!pushEnabled)}
              style={[styles.switchTrack, pushEnabled && styles.switchTrackActive]}
            >
              <View style={[styles.switchThumb, pushEnabled && styles.switchThumbActive]} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.notifyConfigDesc, { color: theme.colors.textMuted }]}>
            {pushEnabled
              ? 'Te enviaremos un aviso push al celular antes de iniciar cada clase para recordar aula y grupo.'
              : 'Las alertas automáticas de horario están apagadas.'}
          </Text>

          {pushEnabled && (
            <View style={[styles.leadTimeSection, { borderTopColor: theme.colors.borderLight }]}>
              <Text style={[styles.leadTimeTitle, { color: theme.colors.textMuted }]}>ANTICIPACIÓN DEL AVISO AL CELULAR:</Text>
              <View style={styles.leadTimeRow}>
                {[
                  { label: 'Nunca', value: 'off' },
                  { label: '5 min antes', value: '5' },
                  { label: '9 min antes', value: '9' }
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setPushMinutes(opt.value)}
                    style={[
                      styles.leadTimeBtn,
                      { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight },
                      pushMinutes === opt.value && styles.leadTimeBtnActive
                    ]}
                  >
                    <Text style={[
                      styles.leadTimeBtnText,
                      { color: theme.colors.textMuted },
                      pushMinutes === opt.value && styles.leadTimeBtnTextActive
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* View Selector Tabs */}
      <View style={[styles.tabRow, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
        {[
          { id: 'today', label: 'Hoy', icon: 'calendar' },
          { id: '3days', label: '3 Días', icon: 'columns' },
          { id: 'week', label: 'Semana', icon: 'grid' }
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setCalendarView(tab.id)}
            style={[styles.tabButton, calendarView === tab.id && styles.tabButtonActive]}
          >
            <Icon name={tab.icon} size={14} color={calendarView === tab.id ? '#ffffff' : theme.colors.textMuted} />
            <Text style={[styles.tabButtonText, { color: theme.colors.textMuted }, calendarView === tab.id && styles.tabButtonTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TAB 1: HOY */}
      {calendarView === 'today' && (
        <View style={styles.todayContainer}>
          {/* Date Header & Assigned Count Pill */}
          <View style={[styles.dateHeaderRow, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
            <View style={styles.dateHeaderSub}>
              <Icon name="calendar" size={14} color={theme.colors.primary} />
              <Text style={[styles.dateHeaderText, { color: theme.colors.textMain }]}>{dateHeaderStr}</Text>
            </View>
            <View style={[styles.assignedPill, { backgroundColor: theme.colors.bgPrimary }]}>
              <Text style={[styles.assignedPillText, { color: theme.colors.primary }]}>{todayBlocks.length} {todayBlocks.length === 1 ? 'Clase Asignada' : 'Clases Asignadas'}</Text>
            </View>
          </View>

          {/* Schedule Cards */}
          <View style={styles.blocksList}>
            {todayBlocks.map((block, i) => {
              const darkCardBg = block.id === '2b'
                ? 'rgba(5, 150, 105, 0.16)'
                : block.id === '3a'
                  ? 'rgba(37, 99, 235, 0.16)'
                  : 'rgba(217, 119, 6, 0.16)';
              const darkCardBorder = block.id === '2b'
                ? 'rgba(5, 150, 105, 0.35)'
                : block.id === '3a'
                  ? 'rgba(37, 99, 235, 0.35)'
                  : 'rgba(217, 119, 6, 0.35)';

              const cardBg = theme.isDark ? darkCardBg : block.bg;
              const cardBorder = theme.isDark ? darkCardBorder : block.border;
              const titleColor = theme.isDark ? '#ffffff' : '#0f172a';
              const subTextColor = theme.isDark ? '#94a3b8' : '#64748b';
              return (
                <TouchableOpacity
                  key={`${block.id}-${i}`}
                  onPress={() => handleSelectBlock(block.id)}
                  style={[styles.blockCard, { backgroundColor: cardBg, borderColor: cardBorder, borderLeftColor: block.color }]}
                >
                  <View>
                    <View style={styles.blockTimeRow}>
                      <Icon name="clock" size={11} color={subTextColor} />
                      <Text style={[styles.blockTimeText, { color: subTextColor }]}>{block.timeStr}</Text>
                    </View>
                    <Text style={[styles.blockTitle, { color: titleColor }]}>{block.title}</Text>
                    <View style={styles.blockRoomRow}>
                      <Icon name="map-pin" size={12} color={subTextColor} />
                      <Text style={[styles.blockRoomText, { color: subTextColor }]}>{block.room}</Text>
                    </View>
                  </View>

                  <View style={[styles.takeListBtn, { backgroundColor: block.color }]}>
                    <Text style={styles.takeListBtnText}>Tomar Lista</Text>
                    <Icon name="check" size={14} color="#ffffff" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Current Time Red Line Indicator */}
          <View style={styles.nowIndicatorRow}>
            <View style={styles.nowDot} />
            <View style={styles.nowLine} />
            <Text style={styles.nowText}>AHORA ({timeString})</Text>
          </View>

          {/* Dashed Free Block Container */}
          <View style={[styles.freeBlockCard, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
            <Icon name="coffee" size={16} color={theme.colors.textMuted} />
            <Text style={[styles.freeBlockText, { color: theme.colors.textMuted }]}>
              12:30 - 16:00 hrs • Bloque sin clases frente a grupo{'\n'}
              (Planeación / Libre)
            </Text>
          </View>
        </View>
      )}

      {/* TAB 2: 3 DÍAS */}
      {calendarView === '3days' && (
        <View style={styles.threeDaysContainer}>
          <View style={styles.multiColumnHeaderRow}>
            {WEEK_DAYS.slice(0, 3).map((d) => (
              <View key={d.id} style={[styles.dayHeaderCol, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }, d.id === 2 && styles.dayHeaderColActive]}>
                <Text style={[styles.dayHeaderShort, { color: theme.colors.textMuted }, d.id === 2 && styles.dayHeaderShortActive]}>{d.short.toUpperCase()}</Text>
                <Text style={[styles.dayHeaderNum, { color: theme.colors.textMain }, d.id === 2 && styles.dayHeaderNumActive]}>{d.dateNum}</Text>
              </View>
            ))}
          </View>

          <View style={styles.multiColumnContainer}>
            {[1, 2, 3].map((dayId) => (
              <View key={dayId} style={styles.dayColumn}>
                {activeBlocks.filter(b => b.day === dayId).map((block, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.smallCard, { borderLeftColor: block.color, backgroundColor: theme.isDark ? 'rgba(30, 41, 59, 0.9)' : block.bg, borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : block.border }]}
                    onPress={() => handleSelectBlock(block.id)}
                  >
                    <Text style={[styles.smallCardTime, { color: block.color }]}>{block.timeStr.split(' - ')[0]}</Text>
                    <Text style={[styles.smallCardTitle, { color: theme.colors.textMain }]}>{block.title.split(' - ')[0]}</Text>
                    <Text style={[styles.smallCardRoom, { color: theme.colors.textMuted }]}>{block.room.split(' - ')[0]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* TAB 3: SEMANA (FIT TO SCREEN - NO HORIZONTAL SCROLL) */}
      {calendarView === 'week' && (
        <View style={styles.threeDaysContainer}>
          <View style={styles.multiColumnHeaderRow}>
            {WEEK_DAYS.map((d) => (
              <View key={d.id} style={[styles.dayHeaderCol, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }, d.id === 2 && styles.dayHeaderColActive]}>
                <Text style={[styles.dayHeaderShort, { color: theme.colors.textMuted }, d.id === 2 && styles.dayHeaderShortActive]}>{d.short}</Text>
                <Text style={[styles.dayHeaderNum, { color: theme.colors.textMain }, d.id === 2 && styles.dayHeaderNumActive]}>{d.dateNum}</Text>
              </View>
            ))}
          </View>

          <View style={styles.multiColumnContainer}>
            {WEEK_DAYS.map((d) => (
              <View key={d.id} style={styles.dayColumn}>
                {activeBlocks.filter(b => b.day === d.id).map((block, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.smallCard, { borderLeftColor: block.color, backgroundColor: theme.isDark ? 'rgba(30, 41, 59, 0.9)' : block.bg, borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : block.border, paddingHorizontal: 3, paddingVertical: 6 }]}
                    onPress={() => handleSelectBlock(block.id)}
                  >
                    <Text style={[styles.smallCardTime, { color: block.color, fontSize: 9 }]}>{block.timeStr.split(' - ')[0]}</Text>
                    <Text style={[styles.smallCardTitle, { color: theme.colors.textMain, fontSize: 10 }]} numberOfLines={1}>{block.title.split(' - ')[0]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* DEMO TOOLS SIMULATOR SECTION (AVAILABLE IN ALL VIEWS) */}
      <View style={styles.demoSectionWrapper}>
        <TouchableOpacity
          style={[styles.simulateDemoBtn, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}
          onPress={() => setShowDemoTools(!showDemoTools)}
          activeOpacity={0.8}
        >
          <Icon name="clock" size={14} color={theme.colors.textMuted} />
          <Text style={[styles.simulateDemoBtnText, { color: theme.colors.textMain }]}>
            {showDemoTools ? 'Ocultar Herramientas Demo' : 'Mostrar / Simular Herramientas Demo'}
          </Text>
        </TouchableOpacity>

        {showDemoTools && (
          <View style={[styles.demoSimulatorBox, { backgroundColor: theme.colors.bgRow, borderColor: theme.colors.borderLight }]}>
            <Text style={[styles.demoSimulatorTitle, { color: theme.colors.textMuted }]}>⚡ SIMULADOR PARA DEMOSTRACIÓN:</Text>

            <TouchableOpacity
              style={[styles.demoSimBtn, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight }]}
              onPress={() => handleSimulateSlot(7, 15, '3a')}
              activeOpacity={0.8}
            >
              <Text style={[styles.demoSimBtnText, { color: theme.colors.textMain }]}>Simular Lunes 07:00 AM</Text>
              <Text style={[styles.demoSimBtnTarget, { color: theme.colors.primary }]}>➜ 3°A Español</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoSimBtn, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight }]}
              onPress={() => handleSimulateSlot(9, 0, '2b')}
              activeOpacity={0.8}
            >
              <Text style={[styles.demoSimBtnText, { color: theme.colors.textMain }]}>Simular Lunes 09:00 AM</Text>
              <Text style={[styles.demoSimBtnTarget, { color: theme.colors.ok }]}>➜ 2°B Matemáticas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoSimBtn, { backgroundColor: theme.colors.bgMobile, borderColor: theme.colors.borderLight }]}
              onPress={() => handleSimulateSlot(16, 15, '1c')}
              activeOpacity={0.8}
            >
              <Text style={[styles.demoSimBtnText, { color: theme.colors.textMain }]}>Simular Lunes 04:00 PM</Text>
              <Text style={[styles.demoSimBtnTarget, { color: theme.colors.warn }]}>➜ 1°C Formación</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.liveClockBtn}
              onPress={handleResetLiveClock}
              activeOpacity={0.8}
            >
              <Text style={styles.liveClockBtnText}>🟢 Volver a Reloj Oficial en Vivo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  subText: {
    fontSize: 12,
    color: '#64748b',
  },
  notifyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notifyPillActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  notifyPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  notifyPillTextActive: {
    color: '#059669',
  },
  notifyConfigBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notifyConfigHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notifyIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyConfigTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  notifyConfigDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 12,
  },
  leadTimeSection: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    marginTop: 4,
  },
  leadTimeTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  leadTimeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  leadTimeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadTimeBtnActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  leadTimeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  leadTimeBtnTextActive: {
    color: '#2563eb',
    fontWeight: '800',
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
    padding: 2,
  },
  switchTrackActive: {
    backgroundColor: '#059669',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#2563eb',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  todayContainer: {
    gap: 12,
  },
  dateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 4,
  },
  dateHeaderSub: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  assignedPill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  assignedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  blocksList: {
    gap: 12,
  },
  blockCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderLeftWidth: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  blockTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 4,
  },
  blockRoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  blockRoomText: {
    fontSize: 12,
    color: '#64748b',
  },
  takeListBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  takeListBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  nowIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 6,
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc2626',
  },
  nowLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#dc2626',
  },
  nowText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#dc2626',
    letterSpacing: 0.4,
  },
  freeBlockCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 4,
  },
  freeBlockText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  threeDaysContainer: {
    gap: 12,
  },
  multiColumnHeaderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayHeaderCol: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  dayHeaderColActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  dayHeaderShort: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  dayHeaderShortActive: {
    color: '#2563eb',
  },
  dayHeaderNum: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  dayHeaderNumActive: {
    color: '#2563eb',
  },
  multiColumnContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dayColumn: {
    flex: 1,
    gap: 8,
  },
  smallCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 10,
    padding: 8,
  },
  smallCardTime: {
    fontSize: 10,
    fontWeight: '800',
  },
  smallCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 2,
  },
  smallCardRoom: {
    fontSize: 10,
    color: '#64748b',
  },
  weekScrollView: {
    marginBottom: 8,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  weekHeaderCol: {
    width: 80,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  weekColumnsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  weekDayColumn: {
    width: 80,
    gap: 8,
  },
  monthCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  monthPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  monthPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  monthDaysHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 6,
    marginBottom: 8,
  },
  monthDayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  monthGrid: {
    gap: 8,
  },
  monthWeekRow: {
    flexDirection: 'row',
    gap: 6,
  },
  monthDayCell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthDayCellSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  dayNumBubble: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumBubbleSelected: {
    backgroundColor: '#2563eb',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  monthDayNum: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
  },
  monthDayNumSelected: {
    color: '#ffffff',
  },
  mBarsContainer: {
    width: '100%',
    gap: 2,
  },
  mBar: {
    height: 3,
    borderRadius: 2,
    width: '100%',
  },
  monthFooterTip: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 12,
  },
  demoSectionWrapper: {
    marginTop: 16,
  },
  simulateDemoBtn: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  simulateDemoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  demoSimulatorBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginBottom: 20,
  },
  demoSimulatorTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  demoSimBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demoSimBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  demoSimBtnTarget: {
    fontSize: 13,
    fontWeight: '800',
  },
  liveClockBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  liveClockBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});


