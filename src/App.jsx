import React, { useState, useEffect } from 'react';
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
import { fetchGroups, fetchMonthlyPlans, saveGroups, saveMonthlyPlans, seedDatabase } from './lib/db';
import LessonPlanViewer from './components/teacher/LessonPlanViewer';
import PeriodGrading from './components/teacher/PeriodGrading';
import Login from './components/layout/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [theme, setTheme] = useState('light');
  const [activeRole, setActiveRole] = useState('teacher'); // teacher, parent, director, social
  const [activeTab, setActiveTab] = useState('pulse'); // pulse, ai-plan, reports
  const [groups, setGroups] = useState(initialGroups);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState(null);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };
  const [selectedGroupId, setSelectedGroupId] = useState(() => {
    const detected = detectActiveGroupByTime(new Date());
    return detected.group.id;
  });
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);
  const [selectedStudentForSOS, setSelectedStudentForSOS] = useState(null);
  const [studentToConfirmAbsence, setStudentToConfirmAbsence] = useState(null);
  const [sosAction, setSosAction] = useState(null);
  const [aiPlans, setAiPlans] = useState(mockAIPlans);
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

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSimulateTime = (dateObj, forcedGroupId) => {
    setSimulatedTime(dateObj);
    if (forcedGroupId) {
      setSelectedGroupId(forcedGroupId);
      showToast(`Reloj CDMX simulado: Auto-seleccionando tu clase asignada (${forcedGroupId.toUpperCase()})`);
    } else {
      const res = detectActiveGroupByTime(new Date());
      setSelectedGroupId(res.group.id);
      showToast(`🟢 Volviendo a reloj oficial CDMX en tiempo real`);
    }
  };

  const currentGroup = groups.find(g => g.id === selectedGroupId) || groups[0];
  const activeResult = detectActiveGroupByTime(simulatedTime || new Date());
  const isClassInSession = currentGroup.id === activeResult.group.id;

  const handleSimulateClassClock = (groupId) => {
    const targetGroup = groups.find(g => g.id === groupId) || groups[0];
    const rule = targetGroup.scheduleRule;
    const now = new Date();
    const simDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), rule.startHour, rule.startMin + 15, 0);
    handleSimulateTime(simDate, groupId);
  };

  // Master OK button
  const handleMarkAllOk = (groupId) => {
    setGroups(prev => {
      const next = prev.map(g => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          students: g.students.map(s => {
            if (s.status !== 'pending') return s;
            return { ...s, status: 'ok', mood: 'normal', performance: 'normal' };
          })
        };
      });
      saveGroups(next);
      return next;
    });
    showToast(`✓ ¡Listo! Asistencia y aprovechamiento normal marcado para los 42 alumnos.`);
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

  const handleConfirmSOS = (student, action, comment) => {
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

  const handleSimplifyPlan = (groupId) => {
    setAiPlans(prev => {
      const p = prev[groupId];
      return {
        ...prev,
        [groupId]: {
          ...p,
          status: 'simplified',
          proposedPlan: {
            ...p.proposedPlan,
            duration: '40 min (Versión Sencilla)',
            activities: p.proposedPlan.activities.map((a, i) => i === 1 ? { ...a, desc: 'Resolver en parejas 2 ejercicios del pizarrón usando hojas recicladas sin necesidad de internet en aula.' } : a)
          }
        }
      };
    });
    showToast('✨ Actividad simplificada exitosamente');
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
    setActiveRole('teacher'); // default reset
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (!isDataLoaded) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>Cargando datos seguros...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 9999,
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          fontWeight: '700',
          fontSize: '0.9rem',
          border: '1px solid #334155',
          animation: 'fadeIn 0.2s ease'
        }}>
          {toast.message}
        </div>
      )}

      {/* Desktop Simulator Header */}
      <Navbar
        activeRole={activeRole}
        onRoleChange={(role) => {
          setActiveRole(role);
          showToast(`Vista cambiada: ${role === 'teacher' ? 'App Móvil Docente' : role === 'parent' ? 'App Móvil Padres' : role === 'director' ? 'Web Admin Dirección' : 'Web Admin Trabajo Social'}`);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* MOBILE APP SIMULATION FRAME (Teacher & Parent) */}
      {isMobileRole && (
        <div className="mobile-simulator-wrapper">
          <div className="mobile-phone-frame">
            <div className="phone-notch"></div>

            <div className="mobile-content-scroll">
              {activeRole === 'teacher' && (
                <>
                  {activeTab === 'pulse' && (
                    <>
                      <ClassSelector
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                        simulatedTime={simulatedTime}
                      />
                      <StudentGrid
                        group={currentGroup}
                        isClassInSession={isClassInSession}
                        onSimulateClassTime={() => handleSimulateClassClock(currentGroup.id)}
                        onStudentClick={(s) => setSelectedStudentForProfile(s)}
                        onToggleAbsence={handleToggleAbsence}
                        onRequestToggleAbsence={(s) => setStudentToConfirmAbsence(s)}
                      />
                    </>
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
                </>
              )}

              {activeRole === 'parent' && (
                <ParentPortal
                  student={sampleStudentForRoles}
                  visibility={parentVisibility}
                />
              )}
            </div>

            {activeRole === 'teacher' && (
              <nav className="mobile-bottom-nav">
                <button
                  className={`nav-item ${activeTab === 'pulse' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pulse')}
                >
                  <span className="nav-item-icon"><Icon name="list" size={18} /></span>
                  <span>Lista del Día</span>
                </button>

                <button
                  className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
                  onClick={() => setActiveTab('schedule')}
                >
                  <span className="nav-item-icon"><Icon name="clock" size={18} /></span>
                  <span>Mi Horario</span>
                </button>

                <button
                  className={`nav-item ${activeTab === 'planeaciones' ? 'active' : ''}`}
                  onClick={() => setActiveTab('planeaciones')}
                >
                  <span className="nav-item-icon"><Icon name="book-open" size={18} /></span>
                  <span>Planeaciones</span>
                </button>

                <button
                  className={`nav-item ${activeTab === 'ai-plan' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ai-plan')}
                >
                  <span className="nav-item-icon"><Icon name="sparkles" size={18} /></span>
                  <span>Plan IA</span>
                </button>

                <button
                  className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reports')}
                >
                  <span className="nav-item-icon"><Icon name="award" size={18} /></span>
                  <span>Evaluación</span>
                </button>
              </nav>
            )}

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

            {selectedStudentForSOS && sosAction && (
              <SOSModal
                student={selectedStudentForSOS}
                action={sosAction}
                onClose={() => { setSelectedStudentForSOS(null); setSosAction(null); }}
                onConfirm={handleConfirmSOS}
              />
            )}

            {/* Confirmation Modal for Attendance Toggle (Hijo directo del frame móvil, absolutamente inmune al scroll de la lista) */}
            {studentToConfirmAbsence && (
              <div className="bottom-sheet-overlay" style={{ alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 999 }} onClick={() => setStudentToConfirmAbsence(null)}>
                <div style={{
                  background: 'var(--bg-mobile)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  width: '100%',
                  maxWidth: '300px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  textAlign: 'center'
                }} onClick={(e) => e.stopPropagation()}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: studentToConfirmAbsence.attendance === 'absent' ? 'var(--bg-ok)' : 'var(--bg-danger)',
                    color: studentToConfirmAbsence.attendance === 'absent' ? 'var(--color-ok)' : 'var(--color-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto'
                  }}>
                    <Icon name={studentToConfirmAbsence.attendance === 'absent' ? 'check' : 'x'} size={24} />
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.4rem 0' }}>
                    ¿Estás seguro?
                  </h3>
                  
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
                    {studentToConfirmAbsence.attendance === 'absent'
                      ? `¿Deseas registrar que ${studentToConfirmAbsence.name} sí asistió a clase?`
                      : `¿Deseas marcar falta (inasistencia) a ${studentToConfirmAbsence.name}?`}
                  </p>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button
                      onClick={() => setStudentToConfirmAbsence(null)}
                      style={{
                        flex: 1,
                        padding: '0.6rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-row)',
                        color: 'var(--text-main)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        handleToggleAbsence(studentToConfirmAbsence.id);
                        setStudentToConfirmAbsence(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '0.6rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: studentToConfirmAbsence.attendance === 'absent' ? 'var(--color-ok)' : 'var(--color-danger)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {studentToConfirmAbsence.attendance === 'absent' ? 'Marcar Presente' : 'Marcar Falta'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DESKTOP WEB ADMIN DASHBOARD VIEW (Director & Social Work) */}
      {!isMobileRole && (
        <main style={{ flex: 1, background: '#0f172a', color: '#f8fafc', padding: '2rem' }}>
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
        </main>
      )}
    </div>
  );
}
