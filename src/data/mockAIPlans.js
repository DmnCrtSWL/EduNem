export const mockAIPlans = {
 '2b': {
 id: 'plan-2b-sem3',
 groupId: '2b',
 subject: 'Matemáticas II',
 campoFormativo: 'Saberes y Pensamiento Científico',
 week: 'Semana 3 - Bloque 2',
 topicSEP: 'Resolución de problemas con fracciones y decimales en contextos cotidianos de la comunidad',
 status: 'pending',
 aiContextAnalysis: {
 groupDiagnostic: 'En el pulso de la semana pasada, el 35% del grupo mostró dudas 🟡 en operaciones abstractas.',
 socioeconomicAdaptation: 'Adecuado a entorno semi-urbano/agrícola en Michoacán. Sin uso de internet ni computadoras en el aula.',
 socialWorkIntegration: '3 alumnos (inc. Mateo García) tienen notas sobre falta de recursos para imprimir. Se diseñó con material reciclado.'
 },
 proposedPlan: {
 objective: 'Lograr que los alumnos calculen porcentajes, descuentos y divisiones fraccionarias utilizando ejemplos reales del comercio local.',
 duration: '50 minutos (1 sesión didáctica)',
 materials: [
 'Pizarrón blanco y plumones de colores',
 'Fichas de cartulina o hojas recicladas traídas de casa',
 'Lista de precios simulada del tianguis o mercado de la comunidad'
 ],
 activities: [
 { time: '10 min', title: ' Rompehielos Activo: El Tianguis del Pueblo', desc: 'Preguntar al grupo cuánto cuesta un kilo de limón o aguacate en su colonia.' },
 { time: '25 min', title: ' Trabajo en Equipos de 4', desc: 'Repartir tarjetas con problemas de comercio agrícola local. Apoyo mutuo sin depender de internet.' },
 { time: '15 min', title: ' Cierre y Evaluación por Pulso', desc: 'Cada equipo pasa a resolver una fracción en el pizarrón. Registro en 2-3 taps.' }
 ],
 evaluationMethod: 'Evaluación formativa participativa + Registro por Emojis en la App del Docente.'
 }
 }
};

// Mock rich monthly data divided by weeks and days, showcasing different stages of the approval lifecycle
export const defaultMonthlyData = {
 '3a': {
 subject: 'Español III',
 campoFormativo: 'Lenguajes',
 monthName: 'Agosto / Septiembre 2026',
 stage: 'step1_lema', // 'step1_lema' | 'step2_objetivo' | 'step3_enfoque' | 'preview' | 'submitted' | 'approved'
 teacherMotto: 'Formar ciudadanos críticos con amor a su comunidad y pensamiento propio',
 monthObjective: 'Dominar la comprensión de textos informativos y la redacción de ensayos argumentativos sobre problemas locales del municipio.',
 classFocus: 'Debate oral en equipos, mesas redondas y análisis de prensa impresa sin internet',
 directorFeedback: 'Plan validado y aprobado. Excelente vinculación con el periódico mural y sin depender de internet en el aula.',
 weeks: [
 {
 id: 1,
 dateRange: 'Del 03 al 07 de Agosto 2026',
 theme: 'Diagnóstico y Comprensión Lectora',
 objective: 'Evaluar la comprensión de textos informativos a través de la lectura guiada de noticias impresas locales, identificando ideas principales y postura del autor sin internet.',
 days: [
 {
 day: 'Lunes 03 de Agosto 2026 (Sesión 1 - 50 min)',
 title: ' Análisis de Titulares y Noticias Locales',
 start: 'Lluvia de ideas en pizarrón: ¿Qué hace confiable a una noticia de nuestra colonia? (10 min)',
 main: 'Lectura en parejas de recortes de periódico llevados por el docente. Subrayar 3 hechos y 2 opiniones con plumón (30 min)',
 end: 'Reflexión en plenaria sobre el impacto de la desinformación y registro formativo en app (10 min)'
 },
 {
 day: 'Miércoles 05 de Agosto 2026 (Sesión 2 - 50 min)',
 title: '️ Redacción de Párrafo de Opinión',
 start: 'Repaso oral kinestésico lanzando pelota de esponja en el aula (10 min)',
 main: 'Redacción individual en cuaderno de un párrafo argumentativo sobre un problema ambiental del municipio (30 min)',
 end: 'Intercambio de cuadernos entre compañeros para co-evaluación guiada por rúbrica en pizarrón (10 min)'
 },
 {
 day: 'Viernes 07 de Agosto 2026 (Sesión 3 - 50 min)',
 title: '️ Mini-Debate en Equipos de 4',
 start: 'Organización de bancas en semicírculo y explicación de reglas de debate respetuoso (10 min)',
 main: 'Debate oral argumentando a favor o en contra del reciclaje obligatorio en el plantel #45 (30 min)',
 end: 'Votación comunitaria de conclusiones y firma del diario docente (10 min)'
 }
 ]
 },
 {
 id: 2,
 dateRange: 'Del 10 al 14 de Agosto 2026',
 theme: 'Estructura del Ensayo Argumentativo',
 objective: 'Construir el esquema básico de un ensayo argumentativo (introducción, tesis, argumentos y conclusión) utilizando problemas comunitarios reales.',
 days: [
 {
 day: 'Lunes 10 de Agosto 2026 (Sesión 4 - 50 min)',
 title: ' La Tesis: Cómo defender una idea',
 start: 'Análisis en pizarrón de dos tesis opuestas sobre el uso del agua (10 min)',
 main: 'Trabajo colaborativo: redactar en cartulina la tesis del equipo y 2 argumentos lógicos (30 min)',
 end: 'Pegar cartulinas en pared del aula y paseo de galería rápido (10 min)'
 },
 {
 day: 'Miércoles 12 de Agosto 2026 (Sesión 5 - 50 min)',
 title: ' Conectores Lógicos en la Redacción',
 start: 'Juego de completar oraciones en el pizarrón usando "sin embargo", "por lo tanto", "en consecuencia" (10 min)',
 main: 'Desarrollo del cuerpo del ensayo en cuaderno, vinculando evidencias locales con la tesis (30 min)',
 end: 'Revisión rápida por parte del docente a los 4 casos en seguimiento de Trabajo Social (10 min)'
 },
 {
 day: 'Viernes 14 de Agosto 2026 (Sesión 6 - 50 min)',
 title: ' El Cierre y Llamado a la Acción',
 start: 'Lectura en voz alta de ejemplos de conclusiones impactantes (10 min)',
 main: 'Redacción del párrafo de conclusión y propuesta de mejora para el plantel #45 (30 min)',
 end: 'Entrega del primer borrador en cuaderno para evaluación formativa (10 min)'
 }
 ]
 },
 {
 id: 3,
 dateRange: 'Del 17 al 21 de Agosto 2026',
 theme: 'Proyecto Comunitario y Oratoria',
 objective: 'Presentar oralmente las propuestas del ensayo frente al grupo, aplicando técnicas de expresión corporal y escucha empática.',
 days: [
 {
 day: 'Lunes 17 de Agosto 2026 (Sesión 7 - 50 min)',
 title: ' Taller de Expresión Oral y Voz',
 start: 'Ejercicios de respiración, volumen y dicción en el aula (10 min)',
 main: 'Práctica por parejas: exponer la tesis del ensayo en 2 minutos cronometrados sin leer (30 min)',
 end: 'Retroalimentación de pares sobre postura y seguridad (10 min)'
 },
 {
 day: 'Miércoles 19 de Agosto 2026 (Sesión 8 - 50 min)',
 title: '️ Plenaria de Presentaciones (Bloque 1)',
 start: 'Sorteo dinámico de turnos de exposición (5 min)',
 main: 'Presentación de los primeros 6 equipos frente al grupo con sesión de preguntas orales (35 min)',
 end: 'Registro del pulso participativo con emojis en app del docente (10 min)'
 },
 {
 day: 'Viernes 21 de Agosto 2026 (Sesión 9 - 50 min)',
 title: '️ Plenaria de Presentaciones (Bloque 2)',
 start: 'Recordatorio de normas de escucha activa (5 min)',
 main: 'Presentación de los 6 equipos restantes con debate de conclusiones comunitarias (35 min)',
 end: 'Cierre del proyecto y autoevaluación en cuaderno (10 min)'
 }
 ]
 },
 {
 id: 4,
 dateRange: 'Del 24 al 28 de Agosto 2026',
 theme: 'Periódico Mural y Evaluación NEM',
 objective: 'Consolidar los aprendizajes del mes mediante la publicación del periódico mural escolar en el Edificio A y la evaluación formativa 360°.',
 days: [
 {
 day: 'Lunes 24 de Agosto 2026 (Sesión 10 - 50 min)',
 title: ' Selección y Edición para Periódico Mural',
 start: 'Elección democrática de los 5 mejores ensayos del grupo (10 min)',
 main: 'Transcripción en hojas de color y diseño de ilustraciones a mano para el periódico mural (30 min)',
 end: 'Montaje preliminar en el pizarrón (10 min)'
 },
 {
 day: 'Miércoles 26 de Agosto 2026 (Sesión 11 - 50 min)',
 title: ' Montaje Oficial en Edificio A',
 start: 'Traslado organizado del grupo al pasillo del Edificio A (10 min)',
 main: 'Instalación colaborativa del mural y explicación a estudiantes de otros grados (30 min)',
 end: 'Regreso al aula y felicitación grupal (10 min)'
 },
 {
 day: 'Viernes 28 de Agosto 2026 (Sesión 12 - 50 min)',
 title: ' Evaluación Formativa del Mes y Cierre',
 start: 'Reflexión individual en cuaderno: ¿Qué aprendí sobre mi comunidad? (15 min)',
 main: 'Diálogo individual breve con casos de rezago mientras el grupo resuelve sopa de letras didáctica (25 min)',
 end: 'Cierre del mes en la app y envío de reporte de logros (10 min)'
 }
 ]
 }
 ]
 },
 '2b': {
 subject: 'Matemáticas II',
 campoFormativo: 'Saberes y Pensamiento Científico',
 monthName: 'Agosto / Septiembre 2026',
 stage: 'approved',
 teacherMotto: 'Conectar las matemáticas con la vida cotidiana y la economía de la comunidad',
 monthObjective: 'Dominar operaciones con fracciones, porcentajes y geometría utilizando precios y medidas reales de la agricultura local.',
 classFocus: 'Simuladores prácticos de comercio, tianguis escolar y retos colaborativos en el pizarrón',
 directorFeedback: ' Aprobado por Dirección #45: Excelente aplicación práctica con precios del mercado local. Las matemáticas financieras en casa fortalecen la comunidad.',
 weeks: [
 {
 id: 1,
 dateRange: 'Del 03 al 07 de Agosto 2026',
 theme: 'Nivelación Operativa con Fracciones',
 objective: 'Dominar la suma, resta y multiplicación de fracciones utilizando listas de precios reales del tianguis o mercado de la comunidad.',
 days: [
 {
 day: 'Lunes 03 de Agosto 2026 (Sesión 1 - 50 min)',
 title: ' El Tianguis del Pueblo (Fracciones Reales)',
 start: 'Escribir precios de kilo de aguacate y limón en pizarrón. Reto: ¿Cuánto cuesta 3/4 de kilo? (10 min)',
 main: 'Resolución en equipos de 4 con billetes y monedas simulados en cartulina (30 min)',
 end: 'Revisión en pizarrón y registro en app del docente (10 min)'
 },
 {
 day: 'Martes 04 de Agosto 2026 (Sesión 2 - 50 min)',
 title: '️ Medidas Agrícolas y Conversiones',
 start: 'Lluvia de ideas: ¿Qué compramos por cuarto, medio o tres cuartos en la tienda? (10 min)',
 main: 'Ejercicios prácticos en cuaderno convirtiendo gramos a fracciones de kilo (30 min)',
 end: 'Co-evaluación en parejas intercambiando resultados (10 min)'
 },
 {
 day: 'Jueves 06 de Agosto 2026 (Sesión 3 - 50 min)',
 title: ' Reto Colaborativo en Pizarrón',
 start: 'Olimpiada relámpago: 3 voluntarios al pizarrón (10 min)',
 main: 'Resolución guiada de problemas de cosecha en equipos heterogéneos (30 min)',
 end: 'Firma de tareas y pase de lista rápido con 1 tap (10 min)'
 }
 ]
 },
 {
 id: 2,
 dateRange: 'Del 10 al 14 de Agosto 2026',
 theme: 'Porcentajes y Descuentos en el Comercio',
 objective: 'Calcular porcentajes y descuentos aplicados al comercio local para desarrollar pensamiento matemático y educación financiera en el hogar.',
 days: [
 {
 day: 'Lunes 10 de Agosto 2026 (Sesión 4 - 50 min)',
 title: '️ ¿Cómo funciona una rebaja del 20%?',
 start: 'Explicación visual con pastel de círculos en pizarrón (10 min)',
 main: 'Cálculo de descuentos en lista de útiles escolares y ropa de invierno (30 min)',
 end: 'Pregunta de reflexión: ¿Cómo ayuda esto en la economía familiar? (10 min)'
 },
 {
 day: 'Martes 11 de Agosto 2026 (Sesión 5 - 50 min)',
 title: ' Simulador de Ventas en el Aula',
 start: 'Organización de "tiendas" por equipos de 4 alumnos (10 min)',
 main: 'Juego de roles: compradores y vendedores calculando cambio con descuento del 15% (30 min)',
 end: 'Conteo de ganancias en el cuaderno (10 min)'
 },
 {
 day: 'Jueves 13 de Agosto 2026 (Sesión 6 - 50 min)',
 title: ' Gráficas de Porcentaje a Mano',
 start: 'Repaso de transportador y regla en el escritorio (10 min)',
 main: 'Dibujo en cuaderno de gráficas circulares sobre cultivos principales del municipio (30 min)',
 end: 'Exhibición de gráficas en el escritorio del docente (10 min)'
 }
 ]
 },
 {
 id: 3,
 dateRange: 'Del 17 al 21 de Agosto 2026',
 theme: 'Geometría Práctica en el Patio',
 objective: 'Medir perímetros y áreas en el patio escolar utilizando herramientas manuales.',
 days: [
 {
 day: 'Lunes 17 de Agosto 2026 (Sesión 7 - 50 min)',
 title: ' Medición del Patio Escolar',
 start: 'Explicación de fórmulas de perímetro y área (10 min)',
 main: 'Medición física de la cancha con cinta métrica y pasos por equipos (30 min)',
 end: 'Registro de datos y cálculo de área en cuaderno (10 min)'
 }
 ]
 },
 {
 id: 4,
 dateRange: 'Del 24 al 28 de Agosto 2026',
 theme: 'Evaluación y Olimpiada Escolar',
 objective: 'Consolidar el pensamiento lógico-matemático del mes mediante un concurso colaborativo.',
 days: [
 {
 day: 'Lunes 24 de Agosto 2026 (Sesión 10 - 50 min)',
 title: ' Olimpiada Matemática del Mes',
 start: 'Organización de equipos y explicación de reglas (10 min)',
 main: 'Resolución de 5 retos matemáticos en pizarrón por relevos (30 min)',
 end: 'Premiación simbólica y cierre de mes (10 min)'
 }
 ]
 }
 ]
 },
 '1c': {
 subject: 'Formación Cívica y Ética',
 campoFormativo: 'Ética, Naturaleza y Sociedades',
 monthName: 'Agosto / Septiembre 2026',
 stage: 'submitted',
 teacherMotto: 'La paz se construye día a día en la escuela con respeto y empatía',
 monthObjective: 'Establecer normas democráticas de convivencia y resolución de conflictos dentro del grupo 1°C.',
 classFocus: 'Mediación de conflictos, debates éticos y círculos de diálogo comunitarios',
 directorFeedback: 'Pendiente de revisión por Dirección del Plantel #45.',
 weeks: [
 {
 id: 1,
 dateRange: 'Del 03 al 07 de Agosto 2026',
 theme: 'Identidad y Convivencia en la Secundaria',
 objective: 'Reconocer la diversidad de identidades en el grupo 1°C, estableciendo normas de empatía y respeto mutuo sin discriminación.',
 days: [
 {
 day: 'Lunes 03 de Agosto 2026 (Sesión 1 - 50 min)',
 title: ' El Árbol de la Identidad del Grupo',
 start: 'Dinámica: Dibujar en una hoja una raíz que represente su familia y origen (10 min)',
 main: 'Compartir en equipos de 4 las cualidades que aportan al grupo 1°C y pegar en mural del aula (30 min)',
 end: 'Compromiso de respeto oral en plenaria (10 min)'
 },
 {
 day: 'Miércoles 05 de Agosto 2026 (Sesión 2 - 50 min)',
 title: '️ Derechos y Responsabilidades Escolares',
 start: 'Lectura comentada de 2 artículos del reglamento escolar (10 min)',
 main: 'Análisis en parejas: ¿Por qué las normas protegen nuestra libertad en el recreo? (30 min)',
 end: 'Redacción de una norma positiva para el salón (10 min)'
 }
 ]
 },
 {
 id: 2,
 dateRange: 'Del 10 al 14 de Agosto 2026',
 theme: 'Mediación y Cultura de Paz',
 objective: 'Aplicar técnicas de diálogo pacífico para resolver desacuerdos cotidianos en la escuela.',
 days: [
 {
 day: 'Lunes 10 de Agosto 2026 (Sesión 3 - 50 min)',
 title: '️ Diálogo y Empatía ante Desacuerdos',
 start: 'Presentación de un caso simulado de conflicto en el recreo (10 min)',
 main: 'Juego de roles en parejas aplicando pasos de mediación pacífica (30 min)',
 end: 'Reflexión grupal sobre el valor del diálogo (10 min)'
 }
 ]
 },
 {
 id: 3,
 dateRange: 'Del 17 al 21 de Agosto 2026',
 theme: 'Inclusión y Respeto a la Diversidad',
 objective: 'Valorar la inclusión de personas con discapacidad o vulnerabilidad en la comunidad escolar.',
 days: [
 {
 day: 'Lunes 17 de Agosto 2026 (Sesión 5 - 50 min)',
 title: ' Inclusión en las Actividades Escolares',
 start: 'Lluvia de ideas: ¿Qué significa ser empático y solidario? (10 min)',
 main: 'Diseñar en equipos un cartel en papel kraft sobre la inclusión escolar (30 min)',
 end: 'Exhibición de carteles en el salón (10 min)'
 }
 ]
 },
 {
 id: 4,
 dateRange: 'Del 24 al 28 de Agosto 2026',
 theme: 'El Código de Ética de 1°C',
 objective: 'Elaborar y firmar el manifiesto grupal de convivencia pacífica del mes.',
 days: [
 {
 day: 'Lunes 24 de Agosto 2026 (Sesión 7 - 50 min)',
 title: ' Firma del Código Cívico del Grupo',
 start: 'Lectura de los compromisos cívicos redactados en el mes (10 min)',
 main: 'Redacción del cartel oficial de convivencia de 1°C en cartulina (30 min)',
 end: 'Firma comunitaria de todos los alumnos en el cartel (10 min)'
 }
 ]
 }
 ]
 }
};
