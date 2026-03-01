import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ITV_SOURCES, itvKnowledgeBase, quickClassifiers } from '../data/itvKnowledge'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
}

function scoreChunk(question: string, keywords: string[]) {
  const q = question.toLowerCase()
  return keywords.reduce((acc, keyword) => (q.includes(keyword.toLowerCase()) ? acc + 2 : acc), 0)
}

function buildAnswer(question: string) {
  const ranked = itvKnowledgeBase
    .map((chunk) => ({ chunk, score: scoreChunk(question, chunk.hintKeywords) }))
    .sort((a, b) => b.score - a.score)

  const selected = ranked.filter((r) => r.score > 0).slice(0, 3)
  const top = selected.length ? selected : ranked.slice(0, 2)

  const reformSignals = ['escape', 'faro', 'intermitente', 'suspensión', 'freno', 'chasis', 'estructura', 'led']
  const likelyReform = reformSignals.some((token) => question.toLowerCase().includes(token))

  const verdict = likelyReform
    ? 'Con la información aportada, **podría considerarse reforma** y requerir legalización/documentación específica.'
    : 'Con la información aportada, **podría no ser reforma** si el componente es equivalente y homologado para ese vehículo.'

  const evidence = top
    .map((item) => `- **${item.chunk.source} · ${item.chunk.topic}:** ${item.chunk.text}`)
    .join('\n')

  const reminder =
    '⚠️ Respuesta orientativa. Para confirmación definitiva hay que revisar el código concreto del Manual de Reformas y validar en ITV con la documentación del componente.'

  return `${verdict}\n\n**Base normativa consultada:**\n${evidence}\n\n${reminder}`
}

export function ITVChat() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Soy el asistente IA de normativa ITV. Pregúntame, por ejemplo: "¿Cambiar el escape de mi moto se considera reforma?"',
    },
  ])

  const canSend = question.trim().length > 5

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSend) return

    const userMessage = question.trim()
    const answer = buildAnswer(userMessage)

    setMessages((current) => [
      ...current,
      { role: 'user', text: userMessage },
      { role: 'assistant', text: answer },
    ])

    setQuestion('')
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
              Este chat consulta una base normativa estructurada del <strong>Manual de Reformas de Vehículos</strong> y del
              <strong> Procedimiento de Inspección ITV</strong> para darte una orientación inicial.
            </p>
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
