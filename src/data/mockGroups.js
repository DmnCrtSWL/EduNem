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

// Official school schedules in CDMX time (America/Mexico_City)
export const mockGroups = [
  {
    id: '3a',
    grade: '3°',
    group: 'A',
    name: '3°A - Español III',
    subject: 'Español III',
    campoFormativo: 'Lenguajes',
    classroom: 'Aula 05 - Edificio A',
    schedule: '07:00 - 08:40 hrs (Lun/Mié/Vie)',
    scheduleRule: {
      days: [1, 3, 5], // Mon, Wed, Fri
      startHour: 7,
      startMin: 0,
      endHour: 8,
      endMin: 40
    },
    totalStudents: 45,
    students: generateStudents(45, '3a', 201)
  },
  {
    id: '2b',
    grade: '2°',
    group: 'B',
    name: '2°B - Matemáticas II',
    subject: 'Matemáticas II',
    campoFormativo: 'Saberes y Pensamiento Científico',
    classroom: 'Aula 12 - Edificio B',
    schedule: '08:40 - 10:20 hrs (Lun a Vie)',
    scheduleRule: {
      days: [1, 2, 3, 4, 5], // Mon-Fri
      startHour: 8,
      startMin: 40,
      endHour: 10,
      endMin: 20
    },
    totalStudents: 42,
    students: generateStudents(42, '2b', 101)
  },
  {
    id: '1c',
    grade: '1°',
    group: 'C',
    name: '1°C - Formación Cívica',
    subject: 'Formación Cívica y Ética',
    campoFormativo: 'Ética, Naturaleza y Sociedades',
    classroom: 'Aula 18 - Edificio C',
    schedule: '16:00 - 16:50 hrs (Lun a Jue)',
    scheduleRule: {
      days: [1, 2, 3, 4], // Mon-Thu
      startHour: 16,
      startMin: 0,
      endHour: 16,
      endMin: 50
    },
    totalStudents: 40,
    students: generateStudents(40, '1c', 301)
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

  // 2. If not strictly in session (e.g. testing in evening or weekend), find upcoming or default
  // For demo fluidity, if before 8:40 AM, default to 3°A (7:00 AM). If between 8:40 AM and 2:00 PM, default to 2°B. Otherwise 1°C.
  if (hour < 8 || (hour === 8 && min < 40)) {
    return { group: mockGroups[0], matchType: 'nearby', cdmxTime: cdmxDate }; // 3A Español
  } else if (hour < 14) {
    return { group: mockGroups[1], matchType: 'nearby', cdmxTime: cdmxDate }; // 2B Matemáticas
  } else {
    return { group: mockGroups[2], matchType: 'nearby', cdmxTime: cdmxDate }; // 1C Formación
  }
}
