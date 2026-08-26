export const mockCurriculum = {
  schoolContext: {
    name: 'Secundaria Técnica #45 "Vicente Guerrero"',
    state: 'Michoacán',
    modality: 'Técnica - Turno Vespertino',
    socioeconomicProfile: 'Semi-urbano con zona agrícola / comercial cercana. Vulnerabilidad económica media.',
    technologicalResources: {
      classrooms: 'Pizarrón blanco clásico y proyector en 40% de las aulas. Sin conexión Wi-Fi para alumnos.',
      computerLab: 'Laboratorio de informática con 20 equipos de cómputo básicos (sin acceso a internet de alta velocidad).',
      studentDevices: 'Aproximadamente 65% de los alumnos cuentan con teléfono celular, pero sin paquete de datos en horario escolar.'
    },
    educationalPriorities: [
      'Reforzamiento del pensamiento lógico-matemático (Rezago post-pandemia detectado en 1° y 2°).',
      'Fomento de la lectura resolutiva y comprensión de textos en todas las asignaturas.',
      'Prevención de deserción escolar en el turno vespertino y seguimiento conductual con Trabajo Social.'
    ]
  },
  camposFormativos: [
    {
      id: 'saberes',
      name: 'Saberes y Pensamiento Científico',
      subjects: ['Matemáticas I, II, III', 'Biología', 'Física', 'Química'],
      currentEje: 'Pensamiento Crítico y Vida Saludable'
    },
    {
      id: 'lenguajes',
      name: 'Lenguajes',
      subjects: ['Español I, II, III', 'Inglés I, II, III', 'Artes'],
      currentEje: 'Apropiación de las culturas a través de la lectura y la escritura'
    },
    {
      id: 'etica',
      name: 'Ética, Naturaleza y Sociedades',
      subjects: ['Formación Cívica y Ética', 'Historia', 'Geografía'],
      currentEje: 'Inclusión e Interculturalidad crítica'
    },
    {
      id: 'humano',
      name: 'De lo Humano y lo Comunitario',
      subjects: ['Educación Física', 'Tecnología', 'Tutoría y Educación Socioemocional'],
      currentEje: 'Igualdad de género y Vida Saludable'
    }
  ],
  autonomiaCurricular: [
    { id: 'taller-agri', name: 'Taller de Agropecuaria y Huertos Escolares', grade: 'Todos' },
    { id: 'taller-robo', name: 'Introducción a la Robótica con Material Reciclado', grade: '2° y 3°' },
    { id: 'club-lectura', name: 'Club de Lectura y Creación Literaria', grade: 'Todos' },
    { id: 'regu-mates', name: 'Taller de Regularización Lógico-Matemática', grade: '1° y 2°' }
  ]
};
