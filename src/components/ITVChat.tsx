import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { ITV_SOURCES, quickClassifiers } from '../data/itvKnowledge'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
}

type DocsInfo = {
  documents: Array<{ id: string; fileName: string; uploadedAt: string; chunks: number }>
  chunks: number
  updatedAt: string | null
}

type AskResponse = {
  verdict: string
  officialEvidence: string[]
  pdfEvidence: string[]
  docsLoaded: number
  updatedAt: string | null
  disclaimer: string
}

function formatAnswer(response: AskResponse) {
  return `${response.verdict}

Base oficial resumida:
${response.officialEvidence.map((x) => `- ${x}`).join('\n')}

Coincidencias en base documental compartida:
${response.pdfEvidence.map((x) => `- ${x}`).join('\n')}

Documentos cargados en la base: ${response.docsLoaded}
Última actualización: ${response.updatedAt ?? 'N/D'}

⚠️ ${response.disclaimer}`
}

export function ITVChat() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Asistente ITV listo. Esta versión consulta una base documental compartida (persistida en servidor).',
    },
  ])
  const [docsInfo, setDocsInfo] = useState<DocsInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)

  const canSend = question.trim().length > 5

  const refreshDocsInfo = async () => {
    const response = await fetch('/api/itv/docs')
    if (!response.ok) return
    const data: DocsInfo = await response.json()
    setDocsInfo(data)
  }

  useEffect(() => {
    refreshDocsInfo().catch(() => undefined)

    const byQuery = new URLSearchParams(window.location.search).get('admin') === '1'
    const byStorage = window.localStorage.getItem('itvAdminMode') === '1'
    setIsAdminMode(byQuery || byStorage)
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSend || loading) return

    const userMessage = question.trim()
    setMessages((current) => [...current, { role: 'user', text: userMessage }])
    setQuestion('')
    setLoading(true)

    try {
      const response = await fetch('/api/itv/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      })

      if (!response.ok) throw new Error('No se pudo consultar la base ITV.')
      const data: AskResponse = await response.json()

      setMessages((current) => [...current, { role: 'assistant', text: formatAnswer(data) }])
      refreshDocsInfo().catch(() => undefined)
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'No he podido consultar la base documental en servidor. Verifica que la API esté levantada.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handlePdfUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    setUploading(true)

    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('pdfs', file))

      const response = await fetch('/api/itv/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Error subiendo PDFs')
      const data = await response.json()

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: `Base documental actualizada: +${data.addedDocs} documento(s). Total: ${data.totalDocs} documentos y ${data.totalChunks} fragmentos.`,
        },
      ])

      refreshDocsInfo().catch(() => undefined)
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'No se pudieron subir/procesar los PDFs en el servidor.',
        },
      ])
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const examples = useMemo(
    () => [
      '¿Cambiar intermitentes LED en mi moto es reforma?',
      '¿Un escape aftermarket sin homologación pasa ITV?',
      '¿Un neumático equivalente requiere reforma?',
    ],
    [],
  )

  return (
    <section id="chat-itv" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8">
        <p className="inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
          Asistente IA Normativa ITV · Base compartida
        </p>
        <h2 className="mt-4 text-3xl font-semibold">Consulta reforma ITV sin re-subir PDFs cada vez</h2>

        <p className="mt-3 max-w-3xl text-zinc-300">
          Esta versión usa una base documental persistida en servidor. Una vez subidos los PDFs, cualquier usuario puede consultar.
        </p>

        {isAdminMode ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
            <p className="text-sm text-zinc-300">Panel admin · carga/actualiza PDFs en la base compartida:</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-lg border border-white/20 px-4 py-2 text-sm text-zinc-200 transition hover:border-red-500/50">
                {uploading ? 'Subiendo...' : 'Subir PDFs a la base'}
                <input type="file" multiple accept=".pdf,application/pdf" className="hidden" onChange={handlePdfUpload} />
              </label>
              <span className="text-xs text-zinc-400">
                {docsInfo
                  ? `${docsInfo.documents.length} doc(s), ${docsInfo.chunks} fragmentos · Última actualización: ${docsInfo.updatedAt ?? 'N/D'}`
                  : 'Sin información de base documental'}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
            <p className="text-sm text-zinc-300">
              Base documental compartida cargada por el equipo técnico. Este panel de subida está oculto para usuarios.
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              {docsInfo
                ? `${docsInfo.documents.length} doc(s), ${docsInfo.chunks} fragmentos disponibles · Actualización: ${docsInfo.updatedAt ?? 'N/D'}`
                : 'Sin información de base documental'}
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 sm:p-5">
            <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
              {messages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className={`rounded-xl border p-3 text-sm leading-relaxed ${
                    message.role === 'assistant'
                      ? 'border-white/10 bg-zinc-900 text-zinc-200'
                      : 'border-red-500/30 bg-red-500/10 text-red-100'
                  }`}
                >
                  <p className="mb-1 text-xs uppercase tracking-wide opacity-70">
                    {message.role === 'assistant' ? 'Asistente IA' : 'Tu consulta'}
                  </p>
                  <p className="whitespace-pre-line">{message.text}</p>
                </article>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <label htmlFor="itv-question" className="text-sm text-zinc-300">
                Escribe tu consulta
              </label>
              <textarea
                id="itv-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ejemplo: He cambiado el silencioso de mi moto por uno aftermarket, ¿es reforma?"
                className="min-h-[110px] rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-red-400"
              />
              <div className="flex flex-wrap gap-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setQuestion(example)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 transition hover:border-red-400/60 hover:text-red-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={!canSend || loading}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Consultando...' : 'Consultar IA'}
              </button>
            </form>
          </div>

          <aside className="space-y-4">
            <article className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
              <h3 className="font-medium text-red-300">Fuentes normativas</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li>
                  <a className="underline decoration-red-500/50 underline-offset-4" href={ITV_SOURCES.manualReformasUrl} target="_blank" rel="noreferrer">
                    {ITV_SOURCES.manualReformasLabel}
                  </a>
                </li>
                <li>
                  <a className="underline decoration-red-500/50 underline-offset-4" href={ITV_SOURCES.procedimientoItvUrl} target="_blank" rel="noreferrer">
                    {ITV_SOURCES.procedimientoItvLabel}
                  </a>
                </li>
              </ul>
            </article>

            <article className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
              <h3 className="font-medium text-red-300">Guía rápida orientativa</h3>
              <div className="mt-3 space-y-3 text-sm text-zinc-300">
                {quickClassifiers.map((item) => (
                  <div key={item.title}>
                    <p className="font-medium text-zinc-200">{item.title}</p>
                    <ul className="mt-1 list-inside list-disc space-y-1 text-zinc-400">
                      {item.examples.map((example) => (
                        <li key={example}>{example}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </div>
    </section>
  )
}
