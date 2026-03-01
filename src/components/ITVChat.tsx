import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  ITV_SOURCES,
  itvKnowledgeBase,
  quickClassifiers,
  type DocumentChunk
} from '../data/itvKnowledge'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
}

type ParsedDoc = {
  fileName: string
  chunks: DocumentChunk[]
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function scoreChunk(question: string, chunkText: string, keywords: string[]) {
  const q = normalize(question)
  const text = normalize(chunkText)
  let score = 0

  for (const keyword of keywords) {
    const key = normalize(keyword)
    if (q.includes(key)) score += 2
    if (text.includes(key)) score += 1
  }

  const tokens = q.split(/\W+/).filter((t) => t.length > 3)
  for (const token of tokens) {
    if (text.includes(token)) score += 0.4
  }

  return score
}

async function parsePdfFile(file: File) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

  const raw = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: raw }).promise

  const chunks: DocumentChunk[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!pageText) continue

    const split = pageText.match(/.{1,1200}(\s|$)/g) ?? [pageText]
    split.forEach((part, index) => {
      const clean = part.trim()
      if (!clean) return
      chunks.push({
        id: `${file.name}-p${pageNumber}-${index + 1}`,
        source: file.name,
        topic: `Página ${pageNumber}`,
        text: clean,
        hintKeywords: [],
        page: pageNumber,
      })
    })
  }

  return chunks
}

function buildAnswer(question: string, parsedDocs: ParsedDoc[]) {
  const pdfChunks = parsedDocs.flatMap((doc) => doc.chunks)

  const rankedOfficial = itvKnowledgeBase
    .map((chunk) => ({ chunk, score: scoreChunk(question, chunk.text, chunk.hintKeywords) }))
    .sort((a, b) => b.score - a.score)

  const rankedPdf = pdfChunks
    .map((chunk) => ({ chunk, score: scoreChunk(question, chunk.text, []) }))
    .sort((a, b) => b.score - a.score)

  const officialHits = rankedOfficial.filter((r) => r.score > 0).slice(0, 2)
  const pdfHits = rankedPdf.filter((r) => r.score > 0.5).slice(0, 3)

  const reformSignals = ['escape', 'faro', 'intermitente', 'suspension', 'freno', 'chasis', 'estructura', 'led']
  const likelyReform = reformSignals.some((token) => normalize(question).includes(token))

  const verdict = likelyReform
    ? 'Con la información aportada, **podría considerarse reforma** y requerir legalización/documentación específica.'
    : 'Con la información aportada, **podría no ser reforma** si el componente es equivalente y homologado para ese vehículo.'

  const officialEvidence = officialHits.length
    ? officialHits
        .map((item) => `- **${item.chunk.source} · ${item.chunk.topic}:** ${item.chunk.text}`)
        .join('\n')
    : '- No encontré coincidencias claras en la base resumida oficial.'

  const pdfEvidence = pdfHits.length
    ? pdfHits
        .map((item) => `- **${item.chunk.source} (pág. ${item.chunk.page ?? '?'})**: ${item.chunk.text.slice(0, 260)}...`)
        .join('\n')
    : '- Sin coincidencias en los PDFs cargados. Sube el Manual de Reformas y el Procedimiento ITV para mejorar precisión.'

  const reminder =
    '⚠️ Respuesta orientativa. Para confirmación definitiva hay que validar el código de reforma aplicable y la documentación exacta en ITV.'

  return `${verdict}\n\n**Base normativa oficial resumida:**\n${officialEvidence}\n\n**Coincidencias en tus PDFs:**\n${pdfEvidence}\n\n${reminder}`
}

export function ITVChat() {
  const [question, setQuestion] = useState('')
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [parsedDocs, setParsedDocs] = useState<ParsedDoc[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Soy el asistente IA de normativa ITV. Sube tus PDFs (Manual de Reformas y Procedimiento ITV) y pregúntame: “¿cambiar el escape de mi moto es reforma?”.',
    },
  ])

  const canSend = question.trim().length > 5

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSend) return

    const userMessage = question.trim()
    const answer = buildAnswer(userMessage, parsedDocs)

    setMessages((current) => [
      ...current,
      { role: 'user', text: userMessage },
      { role: 'assistant', text: answer },
    ])

    setQuestion('')
  }

  const handlePdfUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    setLoadingPdf(true)

    try {
      const parsed = await Promise.all(
        files
          .filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
          .map(async (file) => ({ fileName: file.name, chunks: await parsePdfFile(file) })),
      )

      setParsedDocs((current) => {
        const noDup = current.filter((doc) => !parsed.some((incoming) => incoming.fileName === doc.fileName))
        return [...noDup, ...parsed]
      })

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: `PDFs cargados correctamente: ${parsed.map((d) => `${d.fileName} (${d.chunks.length} fragmentos)`).join(', ')}.`,
        },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'No pude procesar alguno de los PDFs. Revisa que estén bien descargados y vuelve a intentarlo.',
        },
      ])
    } finally {
      setLoadingPdf(false)
      event.target.value = ''
    }
  }

  const examples = useMemo(
    () => [
      '¿Si cambio intermitentes LED en mi moto es reforma?',
      '¿Poner un escape aftermarket requiere homologación?',
      '¿Cambiar medida de neumáticos pasa ITV sin reforma?',
    ],
    [],
  )

  return (
    <section id="chat-itv" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
              Nuevo · Asistente IA Normativa ITV
            </p>
            <h2 className="mt-4 text-3xl font-semibold">¿Es reforma o no? Consulta normativa al instante</h2>
            <p className="mt-3 max-w-3xl text-zinc-300">
              Sube los PDFs oficiales y el chat buscará coincidencias directas en el contenido además de la base resumida del
              <strong> Manual de Reformas de Vehículos</strong> y el <strong>Procedimiento de Inspección ITV</strong>.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
          <p className="text-sm text-zinc-300">Carga los PDFs que quieres consultar (se procesan localmente en tu navegador):</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-lg border border-white/20 px-4 py-2 text-sm text-zinc-200 transition hover:border-red-500/50">
              Subir PDFs
              <input type="file" multiple accept=".pdf,application/pdf" className="hidden" onChange={handlePdfUpload} />
            </label>
            <span className="text-xs text-zinc-400">
              {loadingPdf
                ? 'Procesando PDFs...'
                : parsedDocs.length
                  ? `${parsedDocs.length} documento(s) cargado(s)`
                  : 'Aún no has cargado documentos'}
            </span>
          </div>
        </div>

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
                disabled={!canSend}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Consultar IA
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
