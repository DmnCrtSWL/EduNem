/**
 * Contextos de la Nueva Escuela Mexicana (NEM) y Diagnóstico Escolar Institucional
 * Integra el documento oficial de la SEP ("La NEM y su impacto en la sociedad")
 * y el contexto hyper-robusto de la escuela (Contexto 2).
 */

export const NEM_OFFICIAL_PILARS = {
  documentTitle: 'La Nueva Escuela Mexicana y su impacto en la sociedad',
  author: 'Dra. Martha Velda Hernández Moreno (Secretaría de Educación Pública)',
  approach: 'Proyecto educativo con enfoque crítico, humanista y comunitario para formar estudiantes con una visión integral, equidad y excelencia.',
  articuladores: [
    { id: 'inclusion', name: 'Inclusión', desc: 'Garantizar el acceso universal y la atención a la diversidad.' },
    { id: 'pensamiento_critico', name: 'Pensamiento Crítico', desc: 'Desarrollar la capacidad de razonar, cuestionar y proponer soluciones.' },
    { id: 'interculturalidad', name: 'Interculturalidad Crítica', desc: 'Valorar la diversidad étnica, cultural y social.' },
    { id: 'igualdad_genero', name: 'Igualdad de Género', desc: 'Fomentar la equidad sustantiva y el respeto mutuo.' },
    { id: 'vida_saludable', name: 'Vida Saludable', desc: 'Promover hábitos alimentarios sanos, actividad física y salud emocional.' },
    { id: 'lectura_escritura', name: 'Apropiación de las Culturas a través de la Lectura y Escritura', desc: 'Fortalecer la comprensión lectora y expresión escrita.' },
    { id: 'artes_estetica', name: 'Artes y Experiencias Estéticas', desc: 'Estimular la creatividad y apreciación artística.' }
  ],
  camposFormativos: [
    { id: 'lenguajes', name: 'I. Lenguajes' },
    { id: 'saberes_pensamiento', name: 'II. Saberes y Pensamiento Científico' },
    { id: 'etica_naturaleza', name: 'III. Ética, Naturaleza y Sociedades' },
    { id: 'humano_comunitario', name: 'IV. De lo Humano y lo Comunitario' }
  ],
  metodologias: [
    { id: 'abpc', name: 'Aprendizaje Basado en Proyectos Comunitarios (ABPC)' },
    { id: 'steam', name: 'Aprendizaje Basado en Indagación (STEAM)' },
    { id: 'abp', name: 'Aprendizaje Basado en Problemas (ABP)' },
    { id: 'as', name: 'Aprendizaje Servicio (AS)' }
  ],
  evaluacionFormativa: 'Evaluación autorregulada y continua, centrada en el proceso de aprendizaje sin enfoque punitivo.'
};

export const SCHOOL_CONTEXT_ROBUST = {
  institution: {
    name: 'Escuela Secundaria Técnica #45 "Vicente Guerrero"',
    cct: '14DST0045Z',
    zone: 'Zona Escolar 04 - Sector 02',
    shift: 'Matutino (07:00 - 13:40 hrs)',
    address: 'Av. Constitución s/n esq. Tabachines, Col. Santa Margarita, Zapopan, Jalisco, C.P. 45140',
    enrollmentTotal: 580,
    averageClassSize: 40
  },
  communityProfile: {
    socioeconomicLevel: 'Urbano marginal / Medio-bajo',
    familyStructure: '40% de familias monoparentales o a cargo de abuelos. Tutoría promedio con secundaria incompleta.',
    mainActivities: 'Comercio informal, servicios locales y empleo técnico en la ZMG (Zona Metropolitana de Guadalajara).',
    communityRiskFactors: [
      'Presencia de pandillerismo focalizado e inseguridad en inmediaciones del plantel al horario de salida (13:40 hrs)',
      'Interrupciones frecuentes en el suministro de agua potable municipal durante temporada de sequía',
      'Desplazamiento prolongado de alumnos mediante transporte público con retardos a primera hora'
    ]
  },
  infrastructureAndResources: {
    connectivity: 'Red WiFi institucional de 15 Mbps de uso exclusivo para Dirección y Trabajo Social. CERO internet para alumnos en aula.',
    mobilePolicy: 'Prohibición estricta de teléfonos celulares y dispositivos inteligentes para alumnos durante el horario de clase (Acuerdo CTE #04/2024).',
    availableEquipment: '1 proyector Epson portátil en Dirección Escolar (requiere reserva presencial en bitácora con 48 hrs de anticipación).',
    primarySupports: 'Libreta de apuntes/trabajo de 100 hojas a mano, Libros de Texto Gratuitos (CONALITEG - Fase 6), papel bond, cartulinas recicladas y periódico impreso local.'
  },
  pemcPriorities: {
    priority1_literacy: 'Comprensión Lectora: 48% del alumnado en diagnóstico inicial se ubica en nivel "Requiere Apoyo" en lectura inferencial y análisis crítico.',
    priority2_coexistence: 'Cultura de Paz y Convivencia: Aplicación obligatoria de dinámicas de mediación pacífica de conflictos y cero tolerancia al acoso escolar (bullying).',
    priority3_attendance: 'Puntualidad y Asistencia: Índice de retardo inicial a las 07:00 AM del 12% y ausentismo acumulado del 8.5% en días viernes.',
    priority4_communityProjects: 'Vinculación Comunitaria: Desarrollo de proyectos de impacto directo en la colonia (huerto escolar de bajo consumo hídrico, reciclaje y brigadas de limpieza).'
  }
};

/**
 * Función Ensambladora del Motor de Planeaciones (4 Contextos)
 */
export function build4ContextNEMPrompt(group, currentMonthData) {
  const attendanceRate = group && group.students && group.students.length > 0
    ? Math.round((group.students.filter(s => s.attendance === 'present').length / group.students.length) * 100)
    : 95;

  const exceptionCount = group && group.students
    ? group.students.filter(s => s.status === 'exception' || s.sosReported).length
    : 0;

  return {
    context1_nem: {
      title: 'Contexto 1: La Nueva Escuela Mexicana (SEP)',
      ejes: NEM_OFFICIAL_PILARS.articuladores.map(a => a.name).join(', '),
      metodologia: 'Aprendizaje Basado en Proyectos Comunitarios (ABPC) y Evaluación Formativa'
    },
    context2_escuela: {
      title: 'Contexto 2: Diagnóstico de la Sec. Técnica #45 (Zapopan)',
      cct: SCHOOL_CONTEXT_ROBUST.institution.cct,
      restriccion: SCHOOL_CONTEXT_ROBUST.infrastructureAndResources.connectivity,
      soportePrimario: SCHOOL_CONTEXT_ROBUST.infrastructureAndResources.primarySupports,
      prioridadPEMC: SCHOOL_CONTEXT_ROBUST.pemcPriorities.priority1_literacy
    },
    context3_grupo: {
      title: `Contexto 3: Perfil 360° del Grupo ${group ? group.name : '3°A'}`,
      totalAlumnos: group ? group.students.length : 40,
      asistenciaReal: `${attendanceRate}% presente hoy`,
      alumnosConAtencion: `${exceptionCount} alumno(s) con aviso o seguimiento socioemocional/asistencia`
    },
    context4_docente: {
      title: 'Contexto 4: Enfoque y Autonomía del Docente',
      lema: currentMonthData?.teacherMotto || 'Formar ciudadanos críticos con amor a su comunidad',
      objetivo: currentMonthData?.monthObjective || 'Dominar aprendizajes del programa mediante proyectos comunitarios aplicados.',
      enfoque: currentMonthData?.classFocus || 'Debate oral en equipos, trabajo en libreta física sin internet'
    }
  };
}
