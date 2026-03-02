export type KnowledgeChunk = {
  id: string
  source: 'Manual de Reformas de Vehículos' | 'Procedimiento de Inspección ITV'
  topic: string
  text: string
  hintKeywords: string[]
}

export type DocumentChunk = {
  id: string
  source: string
  topic: string
  text: string
  hintKeywords: string[]
  page?: number
}

export const ITV_SOURCES = {
  manualReformasLabel: 'Manual de Reformas de Vehículos (MinCOTUR)',
  manualReformasUrl:
    'https://industria.gob.es/Calidad-Industrial/vehiculos/Pages/Manual-de-reformas-de-vehiculos.aspx',
  procedimientoItvLabel: 'Procedimiento de Inspección de Estaciones ITV (MINCOTUR)',
  procedimientoItvUrl:
    'https://industria.gob.es/Calidad-Industrial/vehiculos/Pages/itv-procedimiento-inspeccion-estaciones-itv.aspx',
}

export const itvKnowledgeBase: KnowledgeChunk[] = [
  {
    id: 'mrv-def-reforma',
    source: 'Manual de Reformas de Vehículos',
    topic: 'Definición general de reforma',
    text: 'Se considera reforma una modificación, sustitución, actuación, incorporación o supresión efectuada después de la matriculación que cambie características del vehículo o su definición reglamentaria.',
    hintKeywords: ['reforma', 'definición', 'matriculación', 'cambio', 'características'],
  },
  {
    id: 'mrv-familias',
    source: 'Manual de Reformas de Vehículos',
    topic: 'Codificación por familias',
    text: 'Las actuaciones se clasifican por códigos/familias de reforma (unidad motriz, ejes, frenos, carrocería, alumbrado, etc.) y cada caso exige documentación concreta.',
    hintKeywords: ['código', 'familia', 'frenos', 'alumbrado', 'escape', 'carrocería', 'documentación'],
  },
  {
    id: 'mrv-documentacion',
    source: 'Manual de Reformas de Vehículos',
    topic: 'Documentación habitual',
    text: 'Cuando una actuación está tipificada como reforma, normalmente se exige combinación de: proyecto técnico/ certificado final de obra (según el código), informe de conformidad y certificado de taller.',
    hintKeywords: ['proyecto', 'informe de conformidad', 'certificado de taller', 'documentación', 'homologación'],
  },
  {
    id: 'pitv-inspeccion',
    source: 'Procedimiento de Inspección ITV',
    topic: 'Inspección y defectos',
    text: 'La ITV verifica estado y conformidad de elementos reglamentarios. Si detecta modificaciones no legalizadas susceptibles de reforma, puede anotar defectos y requerir regularización.',
    hintKeywords: ['defecto', 'inspección', 'regularización', 'itv desfavorable', 'conformidad'],
  },
  {
    id: 'pitv-alumbrado',
    source: 'Procedimiento de Inspección ITV',
    topic: 'Alumbrado y señalización',
    text: 'En alumbrado y señalización se revisa instalación, funcionamiento, color, orientación y homologación de dispositivos. Cambios no conformes pueden ser causa de rechazo en inspección.',
    hintKeywords: ['faro', 'led', 'intermitente', 'piloto', 'luz', 'alumbrado'],
  },
  {
    id: 'pitv-neumaticos',
    source: 'Procedimiento de Inspección ITV',
    topic: 'Ruedas y neumáticos',
    text: 'Se comprueba equivalencia de neumáticos, índices y estado. Medidas no equivalentes o incompatibles pueden generar defecto y requerir legalización según corresponda.',
    hintKeywords: ['neumático', 'llanta', 'medida', 'equivalencia', 'rueda'],
  },
]

export const quickClassifiers = [
  {
    title: 'Frecuentemente NO reforma (si mantiene homologación equivalente)',
    examples: ['Neumático equivalente al de ficha', 'Sustitución de retrovisor por recambio equivalente homologado'],
  },
  {
    title: 'Frecuentemente SÍ reforma o requiere revisión documental',
    examples: [
      'Cambio sustancial en escape/silenciador sin homologación específica',
      'Modificación de sistema de alumbrado fuera de especificación',
      'Alteraciones de estructura, frenos o suspensión no equivalentes',
    ],
  },
]
