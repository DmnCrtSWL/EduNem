const firstNamesM = ['Mateo', 'Santiago', 'Sebastián', 'Leonardo', 'Matías', 'Emiliano', 'Diego', 'Daniel', 'Miguel', 'Alexander', 'Gael', 'David', 'Fernando', 'Carlos', 'Eduardo', 'Ricardo', 'Javier', 'Hugo', 'Rodrigo', 'Andrés'];
const firstNamesF = ['Sofía', 'Valentina', 'Regina', 'Maria José', 'Ximena', 'Camila', 'Valeria', 'Luciana', 'Victoria', 'Renata', 'Natalia', 'Isabella', 'Daniela', 'Fernanda', 'Andrea', 'Alejandra', 'Mariana', 'Gabriela', 'Paulina', 'Jimena'];
const lastNames = ['García', 'Martínez', 'López', 'González', 'Pérez', 'Rodriguez', 'Sánchez', 'Ramirez', 'Cruz', 'Flores', 'Gómez', 'Morales', 'Vázquez', 'Reyes', 'Jiménez', 'Torres', 'Diaz', 'Gutiérrez', 'Mendoza', 'Ruiz', 'Aguilar', 'Ortiz', 'Chávez', 'Romero', 'Herrera'];

const socialNotes = [
  'Ninguna observación particular. Estructura familiar estable.',
  '⚠️ Sin acceso a internet ni computadora en casa. Entregar tareas impresas o en pizarrón.',
  '🏥 Alergia severa al polvo y polen. Mantener ventilación.',
  '💬 Tutor responsable: Abuela materna (Sra. Carmen). Jornada laboral de padres extendida.',
  '⭐ Alumno sobresaliente en matemáticas. Canalizar a olimpiada escolar.',
  '⚠️ Dificultad visual leve. Ubicar en las primeras 2 filas del aula.',
  '🤝 Requiere apoyo en comprensión lectora. Trabajo social en seguimiento semanal.',
  '⚠️ Situación económica vulnerable. Exento de cuotas para materiales pedagógicos por Dirección.',
  '🏥 Astigmatismo. Usa lentes graduados en clase.'
];

function generateStudents(count, groupId, startId = 1) {
  const rawStudents = [];
  for (let i = 0; i < count; i++) {
    const isMale = i % 2 === 0;
    const firstName = isMale ? firstNamesM[i % firstNamesM.length] : firstNamesF[i % firstNamesF.length];
    const lastName1 = lastNames[(i * 3) % lastNames.length];
    const lastName2 = lastNames[(i * 7 + 1) % lastNames.length];
    const fullName = `${lastName1} ${lastName2}, ${firstName}`;
    
    const hasNote = i % 3 === 0 || i === 2 || i === 7;
    const note = hasNote ? socialNotes[i % socialNotes.length] : socialNotes[0];

    rawStudents.push({
      name: fullName,
      gender: isMale ? 'M' : 'F',
      avatar: isMale ? '👨‍🎓' : '👩‍🎓',
      socialNote: note,
      attendance: 'present',
      mood: 'normal', 
      performance: 'normal', 
      teacherNote: '',
      sosReported: false,
      status: 'ok',
      parentVisibility: {
        grades: true,
        behavior: true,
        achievements: true,
        socialNotes: false,
        aiAlerts: false
      },
      historicalAverages: {
        attendance: Math.floor(88 + (i % 12)),
        grade: (7.2 + (i % 28) * 0.1).toFixed(1)
      },
      comments: (i % 2 === 0) ? [
        { author: 'Prof. Ruiz (Matemáticas)', date: 'Hace 2 días', text: 'Excelente participación en la resolución de ecuaciones cuadráticas. Muestra mucho interés.' },
        { author: 'Profa. Elena (Historia)', date: 'La semana pasada', text: 'Le cuesta concentrarse al final de la clase, pero siempre cumple con sus tareas.' }
      ] : (i % 3 === 0) ? [
        { author: 'Prof. Gómez (Física)', date: 'Ayer', text: 'Llegó sin material para la práctica de laboratorio por segunda vez consecutiva.' }
      ] : []
    });
  }

  // Ordenar estrictamente por orden alfabético A-Z según Apellido Paterno
  rawStudents.sort((a, b) => a.name.localeCompare(b.name, 'es'));

  // Asignar número de lista oficial (1, 2, 3...) tras el ordenamiento alfabético
  return rawStudents.map((s, idx) => {
    let initialMood = s.mood;
    let initialPerformance = s.performance;
    let initialStatus = s.status;
    let initialAttendance = s.attendance;
    let initialTeacherNote = s.teacherNote;

    // Asignar excepciones de demostración en alumnos clave del grupo 2B
    if (groupId === '2b' && idx === 3) { // 4to alumno en lista alfabética
      initialMood = 'sad';
      initialPerformance = 'doubts';
      initialStatus = 'exception';
      initialTeacherNote = 'Se nota distraído hoy. Comentó que no pudo dormir bien por un asunto familiar.';
    } else if (groupId === '2b' && idx === 5) { // 6to alumno en lista alfabética
      initialMood = 'energetic';
      initialPerformance = 'excellent';
      initialStatus = 'ok';
      initialTeacherNote = 'Excelente resolución del problema de fracciones en el pizarrón. Ayudó a sus compañeros de banca.';
    } else if (groupId === '2b' && idx === 8) { // 9no alumno en lista alfabética
      initialAttendance = 'absent';
      initialStatus = 'exception';
    }

    return {
      ...s,
      id: `${groupId}-s-${startId + idx}`,
      listNumber: idx + 1,
      attendance: initialAttendance,
      mood: initialMood,
      performance: initialPerformance,
      teacherNote: initialTeacherNote,
      status: initialStatus
    };
  });
}

// Generación de alumnos compartidos por salón físico (30 por salón)
const students1A = generateStudents(30, '1a', 101);
const students1B = generateStudents(30, '1b', 201);
const students2A = generateStudents(30, '2a', 301);
const students2B = generateStudents(30, '2b', 401);
const students3A = generateStudents(30, '3a', 501);
const students3B = generateStudents(30, '3b', 601);

// Official school schedules in CDMX time (America/Mexico_City)
export const mockGroups = [
  // --- FRANCISCO MP: LENGUAJES (ESPAÑOL) ---
  {
    id: '1a-esp',
    grade: '1°',
    group: 'A',
    name: '1°A - Español I',
    subject: 'Español I',
    campoFormativo: 'Lenguajes',
    classroom: 'Aula 01 - Edificio A',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '07:00 - 08:40 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 7, startMin: 0, endHour: 8, endMin: 40 },
    totalStudents: 30,
    students: students1A
  },
  {
    id: '1b-esp',
    grade: '1°',
    group: 'B',
    name: '1°B - Español I',
    subject: 'Español I',
    campoFormativo: 'Lenguajes',
    classroom: 'Aula 02 - Edificio A',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '08:40 - 10:20 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 8, startMin: 40, endHour: 10, endMin: 20 },
    totalStudents: 30,
    students: students1B
  },
  {
    id: '2a-esp',
    grade: '2°',
    group: 'A',
    name: '2°A - Español II',
    subject: 'Español II',
    campoFormativo: 'Lenguajes',
    classroom: 'Aula 03 - Edificio A',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '10:40 - 12:10 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 10, startMin: 40, endHour: 12, endMin: 10 },
    totalStudents: 30,
    students: students2A
  },
  {
    id: '2b-esp',
    grade: '2°',
    group: 'B',
    name: '2°B - Español II',
    subject: 'Español II',
    campoFormativo: 'Lenguajes',
    classroom: 'Aula 04 - Edificio A',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '12:10 - 13:40 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 12, startMin: 10, endHour: 13, endMin: 40 },
    totalStudents: 30,
    students: students2B
  },
  {
    id: '3a-esp',
    grade: '3°',
    group: 'A',
    name: '3°A - Español III',
    subject: 'Español III',
    campoFormativo: 'Lenguajes',
    classroom: 'Aula 05 - Edificio B',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '07:00 - 08:40 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 7, startMin: 0, endHour: 8, endMin: 40 },
    totalStudents: 30,
    students: students3A
  },
  {
    id: '3b-esp',
    grade: '3°',
    group: 'B',
    name: '3°B - Español III',
    subject: 'Español III',
    campoFormativo: 'Lenguajes',
    classroom: 'Aula 06 - Edificio B',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '08:40 - 10:20 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 8, startMin: 40, endHour: 10, endMin: 20 },
    totalStudents: 30,
    students: students3B
  },

  // --- FRANCISCO MP: ÉTICA, NATURALEZA Y SOCIEDADES (HISTORIA) ---
  {
    id: '1a-his',
    grade: '1°',
    group: 'A',
    name: '1°A - Historia I',
    subject: 'Historia I',
    campoFormativo: 'Ética, Naturaleza y Sociedades',
    classroom: 'Aula 01 - Edificio A',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '07:00 - 08:40 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 7, startMin: 0, endHour: 8, endMin: 40 },
    totalStudents: 30,
    students: students1A
  },
  {
    id: '1b-his',
    grade: '1°',
    group: 'B',
    name: '1°B - Historia I',
    subject: 'Historia I',
    campoFormativo: 'Ética, Naturaleza y Sociedades',
    classroom: 'Aula 02 - Edificio A',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '08:40 - 10:20 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 8, startMin: 40, endHour: 10, endMin: 20 },
    totalStudents: 30,
    students: students1B
  },
  {
    id: '2a-his',
    grade: '2°',
    group: 'A',
    name: '2°A - Historia II',
    subject: 'Historia II',
    campoFormativo: 'Ética, Naturaleza y Sociedades',
    classroom: 'Aula 03 - Edificio A',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '10:40 - 12:10 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 10, startMin: 40, endHour: 12, endMin: 10 },
    totalStudents: 30,
    students: students2A
  },
  {
    id: '2b-his',
    grade: '2°',
    group: 'B',
    name: '2°B - Historia II',
    subject: 'Historia II',
    campoFormativo: 'Ética, Naturaleza y Sociedades',
    classroom: 'Aula 04 - Edificio A',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '12:10 - 13:40 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 12, startMin: 10, endHour: 13, endMin: 40 },
    totalStudents: 30,
    students: students2B
  },
  {
    id: '3a-his',
    grade: '3°',
    group: 'A',
    name: '3°A - Historia III',
    subject: 'Historia III',
    campoFormativo: 'Ética, Naturaleza y Sociedades',
    classroom: 'Aula 05 - Edificio B',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '07:00 - 08:40 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 7, startMin: 0, endHour: 8, endMin: 40 },
    totalStudents: 30,
    students: students3A
  },
  {
    id: '3b-his',
    grade: '3°',
    group: 'B',
    name: '3°B - Historia III',
    subject: 'Historia III',
    campoFormativo: 'Ética, Naturaleza y Sociedades',
    classroom: 'Aula 06 - Edificio B',
    teacherId: 'usr_5',
    teacherName: 'Francisco MP',
    schedule: '08:40 - 10:20 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 8, startMin: 40, endHour: 10, endMin: 20 },
    totalStudents: 30,
    students: students3B
  },

  // --- PROFE RICARDO: SABERES Y PENSAMIENTO CIENTÍFICO (MATEMÁTICAS) ---
  {
    id: '1a-mat',
    grade: '1°',
    group: 'A',
    name: '1°A - Matemáticas I',
    subject: 'Matemáticas I',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 01 - Edificio A',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '08:40 - 10:20 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 8, startMin: 40, endHour: 10, endMin: 20 },
    totalStudents: 30,
    students: students1A
  },
  {
    id: '1b-mat',
    grade: '1°',
    group: 'B',
    name: '1°B - Matemáticas I',
    subject: 'Matemáticas I',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 02 - Edificio A',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '07:00 - 08:40 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 7, startMin: 0, endHour: 8, endMin: 40 },
    totalStudents: 30,
    students: students1B
  },
  {
    id: '2a-mat',
    grade: '2°',
    group: 'A',
    name: '2°A - Matemáticas II',
    subject: 'Matemáticas II',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 03 - Edificio A',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '12:10 - 13:40 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 12, startMin: 10, endHour: 13, endMin: 40 },
    totalStudents: 30,
    students: students2A
  },
  {
    id: '2b-mat',
    grade: '2°',
    group: 'B',
    name: '2°B - Matemáticas II',
    subject: 'Matemáticas II',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 04 - Edificio A',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '10:40 - 12:10 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 10, startMin: 40, endHour: 12, endMin: 10 },
    totalStudents: 30,
    students: students2B
  },
  {
    id: '3a-mat',
    grade: '3°',
    group: 'A',
    name: '3°A - Matemáticas III',
    subject: 'Matemáticas III',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 05 - Edificio B',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '08:40 - 10:20 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 8, startMin: 40, endHour: 10, endMin: 20 },
    totalStudents: 30,
    students: students3A
  },
  {
    id: '3b-mat',
    grade: '3°',
    group: 'B',
    name: '3°B - Matemáticas III',
    subject: 'Matemáticas III',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 06 - Edificio B',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '07:00 - 08:40 hrs (Lun/Mié/Vie)',
    scheduleRule: { days: [1, 3, 5], startHour: 7, startMin: 0, endHour: 8, endMin: 40 },
    totalStudents: 30,
    students: students3B
  },

  // --- PROFE RICARDO: SABERES Y PENSAMIENTO CIENTÍFICO (CIENCIAS) ---
  {
    id: '1a-cie',
    grade: '1°',
    group: 'A',
    name: '1°A - Ciencias I (Biología)',
    subject: 'Ciencias I (Biología)',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 01 - Edificio A',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '08:40 - 10:20 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 8, startMin: 40, endHour: 10, endMin: 20 },
    totalStudents: 30,
    students: students1A
  },
  {
    id: '1b-cie',
    grade: '1°',
    group: 'B',
    name: '1°B - Ciencias I (Biología)',
    subject: 'Ciencias I (Biología)',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 02 - Edificio A',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '07:00 - 08:40 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 7, startMin: 0, endHour: 8, endMin: 40 },
    totalStudents: 30,
    students: students1B
  },
  {
    id: '2a-cie',
    grade: '2°',
    group: 'A',
    name: '2°A - Ciencias II (Física)',
    subject: 'Ciencias II (Física)',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 03 - Edificio A',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '12:10 - 13:40 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 12, startMin: 10, endHour: 13, endMin: 40 },
    totalStudents: 30,
    students: students2A
  },
  {
    id: '2b-cie',
    grade: '2°',
    group: 'B',
    name: '2°B - Ciencias II (Física)',
    subject: 'Ciencias II (Física)',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 04 - Edificio A',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '10:40 - 12:10 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 10, startMin: 40, endHour: 12, endMin: 10 },
    totalStudents: 30,
    students: students2B
  },
  {
    id: '3a-cie',
    grade: '3°',
    group: 'A',
    name: '3°A - Ciencias III (Química)',
    subject: 'Ciencias III (Química)',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 05 - Edificio B',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '08:40 - 10:20 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 8, startMin: 40, endHour: 10, endMin: 20 },
    totalStudents: 30,
    students: students3A
  },
  {
    id: '3b-cie',
    grade: '3°',
    group: 'B',
    name: '3°B - Ciencias III (Química)',
    subject: 'Ciencias III (Química)',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 06 - Edificio B',
    teacherId: 'usr_1',
    teacherName: 'Profe Ricardo',
    schedule: '07:00 - 08:40 hrs (Mar/Jue)',
    scheduleRule: { days: [2, 4], startHour: 7, startMin: 0, endHour: 8, endMin: 40 },
    totalStudents: 30,
    students: students3B
  }
];

/**
 * Smart CDMX Time Matching Algorithm
 * Given a Date object (or simulated time), determines which group is currently in session or upcoming.
 */
export function detectActiveGroupByTime(dateObj = new Date()) {
  // Convert current time to Mexico City (CDMX) time components
  const cdmxString = dateObj.toLocaleString('en-US', { timeZone: 'America/Mexico_City' });
  const cdmxDate = new Date(cdmxString);
  
  const day = cdmxDate.getDay(); // 0 (Sun) to 6 (Sat)
  const hour = cdmxDate.getHours();
  const min = cdmxDate.getMinutes();
  const currentMinutes = hour * 60 + min;

  // 1. Check if any group is strictly in session right now
  for (const g of mockGroups) {
    if (g.scheduleRule.days.includes(day)) {
      const startMin = g.scheduleRule.startHour * 60 + g.scheduleRule.startMin;
      const endMin = g.scheduleRule.endHour * 60 + g.scheduleRule.endMin;
      if (currentMinutes >= startMin && currentMinutes <= endMin) {
        return { group: g, matchType: 'exact', cdmxTime: cdmxDate };
      }
    }
  }

  // 2. Default to first group for testing
  return { group: mockGroups[0], matchType: 'nearby', cdmxTime: cdmxDate };
}
