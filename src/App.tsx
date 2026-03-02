import { ITVChat } from './components/ITVChat'
const WHATSAPP_URL =
  'https://wa.me/34600000000?text=Hola%20Roda%20Racing%2C%20quiero%20informaci%C3%B3n%20sobre%20una%20preparaci%C3%B3n%20de%20moto.'
const CONTACT_EMAIL = 'hola@rodaracing.com'
const LOGO_PATH = '/roda-logo.svg'

const navItems = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Trail/Touring', href: '#segmento-trail' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Chat ITV IA', href: '#chat-itv' },
  { label: 'Contacto', href: '#contacto' },
]

const services = [
  {
    title: 'Preparación Integral Street/Track',
    description:
      'Planificamos la evolución completa de tu moto en fases: estética, ergonomía, dinámica y fiabilidad para un resultado coherente, no una suma de piezas sin criterio.',
    bullets: [
      'Definición de objetivo (calle, rutas, tandas o mixto)',
      'Selección de componentes por rendimiento real',
      'Roadmap técnico por etapas para no malgastar presupuesto',
    ],
  },
  {
    title: 'Montaje Premium de Componentes',
    description:
      'Instalamos accesorios y mejoras con metodología limpia, ajuste preciso y acabados de nivel taller boutique: menos improvisación, más detalle.',
    bullets: [
      'Aero, protecciones, iluminación y detalles racing',
      'Ajustes finos de mandos y postura del piloto',
      'Control visual y funcional antes de entrega',
    ],
  },
  {
    title: 'Asesoría Técnica de Compra',
    description:
      'Si ya tienes ideas o un carrito lleno, lo revisamos contigo para evitar incompatibilidades, piezas redundantes y decisiones impulsivas.',
    bullets: [
      'Verificación de referencias y compatibilidad',
      'Alternativas por rango de presupuesto',
      'Priorización de mejoras con mayor impacto',
    ],
  },
  {
    title: 'Optimización Final y Entrega',
    description:
      'Cerramos cada proyecto con checklist, revisión de fijaciones, validación general y recomendaciones para mantener el resultado a largo plazo.',
    bullets: [
      'Checklist técnico de cierre',
      'Revisión de tolerancias y ajustes críticos',
      'Guía de mantenimiento post-montaje',
    ],
  },
]

const processSteps = [
  {
    title: '1. Brief',
    description:
      'Entrevista rápida para entender moto, estilo de conducción, prioridades estéticas y rango de inversión. Aquí se define el enfoque del proyecto.',
  },
  {
    title: '2. Propuesta',
    description:
      'Te entregamos propuesta estructurada con componentes recomendados, justificación técnica, estimación de tiempos y plan por fases.',
  },
  {
    title: '3. Montaje',
    description:
      'Ejecutamos instalación y ajustes con seguimiento. Cada bloque se valida para asegurar coherencia visual y funcionamiento real.',
  },
  {
    title: '4. Entrega',
    description:
      'Presentación final de la moto con checklist de intervención, recomendaciones de uso y próximos pasos si quieres continuar evolucionando.',
  },
]

const projects = [
  {
    title: 'Naked Urban Blackline',
    desc: 'Proyecto para uso diario premium con estética oscura, postura refinada y acentos técnicos sin excesos.',
    tags: ['Naked', 'Street', 'OEM+'],
  },
  {
    title: 'Supersport Trackday Setup',
    desc: 'Configuración orientada a tandas: piezas clave, control de sensaciones y presencia agresiva en paddock.',
    tags: ['Sport', 'Trackday', 'Performance'],
  },
  {
    title: 'Adventure Precision Cockpit',
    desc: 'Mejoras en mando, ergonomía y equipamiento para rutas largas con look robusto y acabado premium.',
    tags: ['Adventure', 'Touring', 'Ergonomía'],
  },
  {
    title: 'Streetfighter Red Carbon',
    desc: 'Estética racing con detalles en carbono y ajustes visuales para una identidad muy marcada.',
    tags: ['Streetfighter', 'Carbon', 'Custom'],
  },
  {
    title: 'Neo-Retro Performance Build',
    desc: 'Equilibrio entre lenguaje clásico y mejoras actuales para mantener esencia con comportamiento moderno.',
    tags: ['Neo-retro', 'Detailing', 'Setup'],
  },
  {
    title: 'Touring Long Route Pack',
    desc: 'Configuración pensada para kilómetros: confort funcional, orden visual y robustez de uso real.',
    tags: ['Touring', 'Comfort', 'Reliability'],
  },
]



const trailBrands = [
  {
    name: 'Wunderlich-style approach',
    focus: 'Catálogo por modelo, ergonomía y confort para gran turismo premium.',
  },
  {
    name: 'SW-MOTECH-style approach',
    focus: 'Sistema modular: protección, equipaje y navegación con lógica adventure.',
  },
  {
    name: 'Isotta-style approach',
    focus: 'Cúpulas y protección aerodinámica con fuerte enfoque en touring y acabados.',
  },
]

const trailRecommendations = [
  {
    pack: 'Pack Protection PRO',
    desc: 'Recomendado para uso mixto asfalto/pista en trail media-alta cilindrada.',
    items: ['Defensas motor + cárter', 'Protección radiador/faro', 'Handguards reforzados'],
  },
  {
    pack: 'Pack Touring Premium',
    desc: 'Pensado para viajes largos priorizando confort, capacidad y fatiga reducida.',
    items: ['Pantalla/cúpula optimizada', 'Sistema maletas + soportes', 'Asiento y postura de larga distancia'],
  },
  {
    pack: 'Pack Navigation & Utility',
    desc: 'Para usuarios que buscan control de ruta y funcionalidad diaria avanzada.',
    items: ['Soporte GPS/roadbook antivibración', 'Tomas USB y gestión eléctrica', 'Iluminación auxiliar homologable'],
  },
]

const faqs = [
  {
    question: '¿Qué plazo tiene una preparación completa?',
    answer:
      'Depende del alcance y disponibilidad de componentes. Un proyecto corto puede resolverse en pocos días; uno integral se organiza por fases para asegurar calidad.',
  },
  {
    question: '¿Podéis montar piezas que ya tengo compradas?',
    answer:
      'Sí. Antes de montar revisamos estado, marca, referencia y compatibilidad con tu moto para evitar problemas en funcionamiento y acabado.',
  },
  {
    question: '¿Hay garantía del trabajo?',
    answer:
      'Sí. Incluimos garantía sobre mano de obra y respetamos condiciones de garantía de cada fabricante para los componentes instalados.',
  },
  {
    question: 'No tengo presupuesto grande, ¿tiene sentido empezar?',
    answer:
      'Sí. Precisamente trabajamos con planificación por etapas para que inviertas de forma inteligente, priorizando mejoras con mayor impacto real.',
  },
  {
    question: '¿Solo hacéis estética o también parte técnica?',
    answer:
      'Nuestro enfoque es mixto: estética premium + criterio técnico. El objetivo es que la moto se vea mejor y también se sienta mejor.',
  },
]

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/90 backdrop-blur-lg">
        <nav className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <a href="#top" className="group flex items-center gap-3">
              <img src={LOGO_PATH} alt="Logo Roda Racing" className="h-11 w-auto max-w-[180px] object-contain sm:h-12" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">Roda Racing</p>
                <p className="text-xs text-zinc-500">Motorcycle Performance Atelier</p>
              </div>
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 md:inline-flex"
            >
              WhatsApp
            </a>
          </div>

          <ul className="mt-3 flex gap-3 overflow-x-auto pb-1 text-sm text-zinc-300 md:mt-2 md:justify-end">
            {navItems.map((item) => (
              <li key={item.label} className="shrink-0">
                <a href={item.href} className="rounded-md px-2.5 py-1.5 transition hover:bg-white/5 hover:text-red-400">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pt-20">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
              Preparación premium de motos
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Diseñamos motos con estética racing, lógica técnica y acabado de alto nivel.
            </h1>
            <p className="mt-5 max-w-xl text-zinc-300">
              Roda Racing combina visión estética y criterio técnico para transformar tu moto de forma coherente: mejor presencia,
              mejor sensación y una ejecución cuidada de principio a fin.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-500"
              >
                Solicitar evaluación por WhatsApp
              </a>
              <a
                href="#proyectos"
                className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-red-500/50 hover:text-red-300"
              >
                Ver proyectos
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs text-zinc-300">
              {['Montaje fino', 'Estética agresiva', 'Enfoque técnico'].map((badge) => (
                <span key={badge} className="rounded-full border border-white/15 px-3 py-1.5">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3].map((item) => (
              <article
                key={item}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 shadow-xl shadow-black/25 ${
                  item === 3 ? 'h-40 sm:col-span-2' : 'h-56'
                } ${item === 2 ? 'sm:mt-10' : ''}`}
              >
                <div className="flex h-full items-end rounded-xl border border-dashed border-red-400/30 bg-zinc-950/40 p-4 text-xs text-zinc-500">
                  Placeholder moto proyecto {item}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="servicios" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold">Servicios</h2>
          <p className="mt-3 max-w-3xl text-zinc-300">
            Trabajamos con un método claro para clientes que quieren una preparación seria, con decisiones justificadas y una estética
            de nivel premium.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.title} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg shadow-black/20">
                <h3 className="text-xl font-medium text-zinc-100">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{service.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                  {service.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="proceso" className="border-y border-white/10 bg-zinc-900/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold">Proceso</h2>
            <p className="mt-3 max-w-3xl text-zinc-300">
              Cuatro pasos para que tengas visibilidad del proyecto de inicio a fin, sin sorpresas y con tiempos realistas.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <article key={step.title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
                  <h3 className="font-medium text-red-300">{step.title}</h3>
                  <p className="mt-3 text-sm text-zinc-300">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="proyectos" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold">Proyectos</h2>
          <p className="mt-3 text-zinc-300">Estructura lista para sustituir placeholders por fotos reales de tus preparaciones.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <article key={project.title} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
                <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 p-4">
                  <div className="flex h-full items-end rounded-lg border border-dashed border-red-400/30 bg-zinc-950/40 p-3 text-xs text-zinc-500">
                    Foto moto proyecto {index + 1}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{project.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>


        <section id="segmento-trail" className="border-y border-white/10 bg-zinc-900/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold">Recomendaciones Trail & Touring Premium</h2>
            <p className="mt-3 max-w-3xl text-zinc-300">
              Propuesta inspirada en patrones de marcas top del segmento adventure/touring: catálogo por modelo,
              modularidad por packs y foco en protección + confort + navegación.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {trailBrands.map((brand) => (
                <article key={brand.name} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
                  <h3 className="font-medium text-red-300">{brand.name}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{brand.focus}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {trailRecommendations.map((rec) => (
                <article key={rec.pack} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
                  <h3 className="text-lg font-medium">{rec.pack}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{rec.desc}</p>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                    {rec.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-y border-white/10 bg-zinc-900/40">
          <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold">FAQ</h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq) => (
                <article key={faq.question} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
                  <h3 className="font-medium text-zinc-100">{faq.question}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ITVChat />

        <section id="contacto" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-black/30">
            <h2 className="text-3xl font-semibold">Contacto</h2>
            <p className="mt-3 max-w-2xl text-zinc-300">
              Si buscas un preparador de motos con visión completa y acabado premium, cuéntanos tu idea y te proponemos la mejor
              estrategia para llevarla a realidad.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Contactar por WhatsApp
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-red-500/50"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ['Zona', 'Atención con cita previa en área metropolitana.'],
                ['Horario', 'Lunes a viernes · 9:00 a 19:00'],
                ['Enfoque', 'Proyectos de moto para clientes que priorizan detalle y calidad.'],
              ].map(([title, text]) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                  <h3 className="font-medium text-red-300">{title}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-zinc-950/90">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 text-sm text-zinc-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <img src={LOGO_PATH} alt="Logo Roda Racing" className="h-8 w-auto max-w-[140px] object-contain opacity-90" />
            <span>Roda Racing</span>
          </div>

          <ul className="flex flex-wrap gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="hover:text-red-300">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p>© {new Date().getFullYear()} Roda Racing. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
