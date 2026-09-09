import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Platform,
  useWindowDimensions,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import Navbar from './components/layout/Navbar';
import ClassSelector from './components/teacher/ClassSelector';
import StudentGrid from './components/teacher/StudentGrid';
import StudentProfileModal from './components/teacher/StudentProfileModal';
import AILessonPlanner from './components/teacher/AILessonPlanner';
import SOSModal from './components/teacher/SOSModal';
import DirectorPrivacyTemplate from './components/director/DirectorPrivacyTemplate';
import SocialWorkIntake from './components/social/SocialWorkIntake';
import ParentPortal from './components/parent/ParentPortal';
import TeacherSchedule from './components/teacher/TeacherSchedule';
import Icon from './components/ui/Icon';
import { detectActiveGroupByTime, mockGroups as initialGroups } from './data/mockGroups';
import { mockAIPlans, defaultMonthlyData } from './data/mockAIPlans';
import { fetchGroups, fetchMonthlyPlans, saveGroups, saveMonthlyPlans } from './lib/db';
import LessonPlanViewer from './components/teacher/LessonPlanViewer';
import PeriodGrading from './components/teacher/PeriodGrading';
import Login from './components/layout/Login';
import { theme } from './theme/tokens';
import { ThemeProvider, useTheme } from './context/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function AppContent() {
  const { theme: activeThemeObj, isDark, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [activeRole, setActiveRole] = useState('teacher'); // teacher, parent, director, social
  const [activeTab, setActiveTabRaw] = useState('pulse'); // pulse, schedule, planeaciones, ai-plan, reports

  const setActiveTab = (tab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTabRaw(tab);
  };

  const handleToggleTheme = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleTheme();
  };
  const [groups, setGroups] = useState(initialGroups);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState(null);

  const { width } = useWindowDimensions();
  const isLargeScreen = Platform.OS === 'web' && width > 500;


  const [selectedGroupId, setSelectedGroupId] = useState(() => {
    const detected = detectActiveGroupByTime(new Date());
    return detected.group.id;
  });

  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);
  const [selectedStudentForSOS, setSelectedStudentForSOS] = useState(null);
  const [studentToConfirmAbsence, setStudentToConfirmAbsence] = useState(null);
  const [sosAction, setSosAction] = useState(null);
  const [, setAiPlans] = useState(mockAIPlans);
  const [monthlyPlans, setMonthlyPlans] = useState(defaultMonthlyData);
  const [parentVisibility, setParentVisibility] = useState({
    grades: true,
    behavior: true,
    achievements: true,
    socialNotes: false,
    aiAlerts: false
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadData() {
      const dbGroups = await fetchGroups();
      const dbPlans = await fetchMonthlyPlans();
      if (dbGroups) setGroups(dbGroups);
      if (dbPlans) setMonthlyPlans(dbPlans);
      setIsDataLoaded(true);
    }
    loadData();
  }, []);

  const [simulatedGroupSession, setSimulatedGroupSession] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSimulateTime = (dateObj, forcedGroupId) => {
    setSimulatedTime(dateObj);
    if (forcedGroupId) {
      setSelectedGroupId(forcedGroupId);
      setSimulatedGroupSession(forcedGroupId);
      showToast(`Reloj CDMX simulado: Auto-seleccionando tu clase asignada (${forcedGroupId.toUpperCase()})`);
    } else {
      setSimulatedGroupSession(null);
      const res = detectActiveGroupByTime(new Date());
      setSelectedGroupId(res.group.id);
      showToast(`🟢 Volviendo a reloj oficial CDMX en tiempo real`);
    }
  };

  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0];
  const activeResult = detectActiveGroupByTime(simulatedTime || new Date());
  const isClassInSession = simulatedGroupSession ? currentGroup.id === simulatedGroupSession : currentGroup.id === activeResult.group.id;

  const handleSimulateClassClock = (groupId) => {
    const targetGroup = groups.find(g => g.id === groupId) || groups[0];
    const rule = targetGroup.scheduleRule;
    const now = new Date();
    const validDay = (rule.days && rule.days.length > 0) ? rule.days[0] : 1;
    const currentDay = now.getDay();
    const dayDiff = validDay - currentDay;
    const simDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayDiff, rule.startHour, rule.startMin + 15, 0);
    handleSimulateTime(simDate, groupId);
  };

  const handleToggleAbsence = (studentId) => {
    setGroups(prev => {
      const next = prev.map(g => {
        return {
          ...g,
          students: g.students.map(s => {
            if (s.id !== studentId) return s;
            const nextAttendance = s.attendance === 'absent' ? 'present' : 'absent';
            return {
              ...s,
              attendance: nextAttendance,
              status: nextAttendance === 'absent' ? 'exception' : 'ok'
            };
          })
        };
      });
      saveGroups(next);
      return next;
    });
    showToast('🚫 Inasistencia registrada en 1 tap');
  };

  const handleUpdateStudent = (studentId, updates) => {
    setGroups(prev => {
      const next = prev.map(g => {
        return {
          ...g,
          students: g.students.map(s => {
            if (s.id !== studentId) return s;
            return { ...s, ...updates };
          })
        };
      });
      saveGroups(next);
      return next;
    });
    showToast('✓ Pulso / Reacción guardada en la lista');
  };

  const handleOpenSOS = (student, action) => {
    setSelectedStudentForSOS(student);
    setSosAction(action);
  };

  const handleConfirmSOS = (student) => {
    handleUpdateStudent(student.id, { sosReported: true });
    setSelectedStudentForSOS(null);
    setSosAction(null);
    showToast(`🚨 Alerta enviada a Prefectura y Dirección por alumno #${student.listNumber}`);
  };

  const handleApprovePlan = (groupId) => {
    setAiPlans(prev => ({
      ...prev,
      [groupId]: { ...prev[groupId], status: 'approved' }
    }));
    showToast('✓ Planeación SEP aprobada y lista en la app');
  };

  const handleUpdateMonthlyPlans = (updater) => {
    setMonthlyPlans(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveMonthlyPlans(next);
      return next;
    });
  };

  const handleToggleVisibility = (cardId) => {
    setParentVisibility(prev => {
      const next = { ...prev, [cardId]: !prev[cardId] };
      showToast(next[cardId] ? `🟢 Tarjeta pública para Padres` : `⚫ Tarjeta oculta para Padres (Uso interno)`);
      return next;
    });
  };

  const handleSaveSocialNote = (studentId, note) => {
    handleUpdateStudent(studentId, { socialNote: note });
    showToast('💾 Expediente 360° guardado');
  };

  const sampleStudentForRoles = currentGroup.students[0];
  const isMobileRole = activeRole === 'teacher' || activeRole === 'parent';

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setIsAuthenticated(true);
    showToast(`¡Bienvenido, ${user.name}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveRole('teacher');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (!isDataLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando datos seguros...</Text>
      </View>
    );
  }

  const mainContent = (
    <View style={[styles.appContainer, { backgroundColor: activeThemeObj.colors.bgApp }]}>
      {/* Toast Notification */}
      {toast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}

      {/* Header Bar */}
      <Navbar
        activeRole={activeRole}
        onRoleChange={(role) => {
          setActiveRole(role);
          showToast(`Vista cambiada: ${role === 'teacher' ? 'App Móvil Docente' : role === 'parent' ? 'App Móvil Padres' : role === 'director' ? 'Web Admin Dirección' : 'Web Admin Trabajo Social'}`);
        }}
        theme={isDark ? 'dark' : 'light'}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Main View Area */}
      {isMobileRole ? (
        <View style={styles.mobileArea}>
          {activeRole === 'teacher' && (
            <View style={styles.screenWrapper}>
              {activeTab === 'pulse' && (
                <StudentGrid
                  groups={groups}
                  selectedGroupId={selectedGroupId}
                  group={currentGroup}
                  isClassInSession={isClassInSession}
                  onSimulateClassTime={() => handleSimulateClassClock(currentGroup.id)}
                  onStudentClick={(s) => setSelectedStudentForProfile(s)}
                  onToggleAbsence={handleToggleAbsence}
                  onRequestToggleAbsence={(s) => setStudentToConfirmAbsence(s)}
                />
              )}

              {activeTab === 'schedule' && (
                <TeacherSchedule
                  groups={groups}
                  simulatedTime={simulatedTime}
                  onSimulateTime={handleSimulateTime}
                  onSelectGroup={(id) => {
                    setSelectedGroupId(id);
                    showToast(`Grupo activado: ${groups.find(g => g.id === id)?.name}`);
                  }}
                  onNavigateToList={() => setActiveTab('pulse')}
                />
              )}

              {activeTab === 'ai-plan' && (
                <AILessonPlanner
                  group={currentGroup}
                  monthlyPlans={monthlyPlans}
                  onUpdateMonthlyPlans={handleUpdateMonthlyPlans}
                  onNavigateToTab={setActiveTab}
                  onApprove={handleApprovePlan}
                />
              )}

              {activeTab === 'planeaciones' && (
                <LessonPlanViewer
                  group={currentGroup}
                  monthlyPlans={monthlyPlans}
                  onUpdateMonthlyPlans={handleUpdateMonthlyPlans}
                  onNavigateToWizard={() => setActiveTab('ai-plan')}
                  onApprove={handleApprovePlan}
                />
              )}

              {activeTab === 'reports' && (
                <PeriodGrading
                  group={currentGroup}
                  onUpdateStudent={handleUpdateStudent}
                  showToast={showToast}
                />
              )}
            </View>
          )}

          {activeRole === 'parent' && (
            <ParentPortal
              student={sampleStudentForRoles}
              visibility={parentVisibility}
            />
          )}

          {/* Bottom Navigation Bar */}
          {activeRole === 'teacher' && (
            <View style={[styles.bottomNav, { backgroundColor: activeThemeObj.colors.bgRow, borderTopColor: activeThemeObj.colors.borderLight }]}>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('pulse')}
              >
                <Icon name="list" size={18} color={activeTab === 'pulse' ? activeThemeObj.colors.primary : activeThemeObj.colors.textMuted} />
                <Text numberOfLines={1} style={[styles.navText, { color: activeTab === 'pulse' ? activeThemeObj.colors.primary : activeThemeObj.colors.textMuted }, activeTab === 'pulse' && styles.navTextActive]}>
                  Lista del Día
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('schedule')}
              >
                <Icon name="clock" size={18} color={activeTab === 'schedule' ? activeThemeObj.colors.primary : activeThemeObj.colors.textMuted} />
                <Text numberOfLines={1} style={[styles.navText, { color: activeTab === 'schedule' ? activeThemeObj.colors.primary : activeThemeObj.colors.textMuted }, activeTab === 'schedule' && styles.navTextActive]}>
                  Mi Horario
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('planeaciones')}
              >
                <Icon name="planeaciones" size={18} color={activeTab === 'planeaciones' ? activeThemeObj.colors.primary : activeThemeObj.colors.textMuted} />
                <Text numberOfLines={1} style={[styles.navText, { color: activeTab === 'planeaciones' ? activeThemeObj.colors.primary : activeThemeObj.colors.textMuted }, activeTab === 'planeaciones' && styles.navTextActive]}>
                  Planeaciones
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('ai-plan')}
              >
                <Icon name="sparkles" size={18} color={activeTab === 'ai-plan' ? activeThemeObj.colors.primary : activeThemeObj.colors.textMuted} />
                <Text numberOfLines={1} style={[styles.navText, { color: activeTab === 'ai-plan' ? activeThemeObj.colors.primary : activeThemeObj.colors.textMuted }, activeTab === 'ai-plan' && styles.navTextActive]}>
                  Plan IA
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => setActiveTab('reports')}
              >
                <Icon name="check" size={18} color={activeTab === 'reports' ? activeThemeObj.colors.primary : activeThemeObj.colors.textMuted} />
                <Text numberOfLines={1} style={[styles.navText, { color: activeTab === 'reports' ? activeThemeObj.colors.primary : activeThemeObj.colors.textMuted }, activeTab === 'reports' && styles.navTextActive]}>
                  Evaluación
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.adminArea}>
          {activeRole === 'director' && (
            <DirectorPrivacyTemplate
              student={sampleStudentForRoles}
              visibility={parentVisibility}
              onToggleVisibility={handleToggleVisibility}
            />
          )}

          {activeRole === 'social' && (
            <SocialWorkIntake
              student={sampleStudentForRoles}
              onSaveNote={handleSaveSocialNote}
            />
          )}
        </View>
      )}

      {/* Student Profile Modal */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          group={currentGroup}
          monthlyPlans={monthlyPlans}
          onClose={() => setSelectedStudentForProfile(null)}
          onUpdateStudent={handleUpdateStudent}
          onTriggerSOS={handleOpenSOS}
        />
      )}

      {/* SOS Alert Modal */}
      {selectedStudentForSOS && sosAction && (
        <SOSModal
          student={selectedStudentForSOS}
          action={sosAction}
          onClose={() => { setSelectedStudentForSOS(null); setSosAction(null); }}
          onConfirm={handleConfirmSOS}
        />
      )}

      {/* Confirmation Modal for Attendance */}
      {studentToConfirmAbsence && (
        <Modal transparent animationType="fade" visible={Boolean(studentToConfirmAbsence)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.confirmBox, { backgroundColor: activeThemeObj.colors.bgMobile, borderColor: activeThemeObj.colors.borderLight, borderWidth: 1 }]}>
              <View style={[
                styles.confirmIconBadge,
                { backgroundColor: studentToConfirmAbsence.attendance === 'absent' ? activeThemeObj.colors.bgOk : activeThemeObj.colors.bgDanger }
              ]}>
                <Icon
                  name={studentToConfirmAbsence.attendance === 'absent' ? 'check' : 'x'}
                  size={24}
                  color={studentToConfirmAbsence.attendance === 'absent' ? activeThemeObj.colors.ok : activeThemeObj.colors.danger}
                />
              </View>

              <Text style={[styles.confirmTitle, { color: activeThemeObj.colors.textMain }]}>¿Estás seguro?</Text>
              
              <Text style={[styles.confirmMessage, { color: activeThemeObj.colors.textMuted }]}>
                {studentToConfirmAbsence.attendance === 'absent'
                  ? `¿Deseas registrar que ${studentToConfirmAbsence.name} sí asistió a clase?`
                  : `¿Deseas marcar falta (inasistencia) a ${studentToConfirmAbsence.name}?`}
              </Text>

              <View style={styles.confirmButtonsRow}>
                <TouchableOpacity
                  onPress={() => setStudentToConfirmAbsence(null)}
                  style={[styles.cancelBtn, { backgroundColor: activeThemeObj.colors.bgRow, borderColor: activeThemeObj.colors.borderLight, borderWidth: 1 }]}
                >
                  <Text style={[styles.cancelBtnText, { color: activeThemeObj.colors.textMain }]}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => {
                    handleToggleAbsence(studentToConfirmAbsence.id);
                    setStudentToConfirmAbsence(null);
                  }}
                  style={[
                    styles.actionBtn,
                    { backgroundColor: studentToConfirmAbsence.attendance === 'absent' ? activeThemeObj.colors.ok : activeThemeObj.colors.danger }
                  ]}
                >
                  <Text style={styles.actionBtnText}>
                    {studentToConfirmAbsence.attendance === 'absent' ? 'Marcar Presente' : 'Marcar Falta'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );

  if (isLargeScreen) {
    return (
      <View style={styles.desktopFrameBackground}>
        <View style={styles.phoneFrame}>
          <View style={styles.notch} />
          {mainContent}
        </View>
      </View>
    );
  }

  return mainContent;
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 9999,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  mobileArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  screenWrapper: {
    flex: 1,
  },
  adminArea: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  bottomNav: {
    height: 56,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  navText: {
    fontSize: 9.5,
    letterSpacing: -0.2,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
  navTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  desktopFrameBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 20,
  },
  phoneFrame: {
    width: 410,
    height: 840,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#1e293b',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  notch: {
    width: 120,
    height: 20,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignSelf: 'center',
    zIndex: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  confirmIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  confirmMessage: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

