import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { readDb, writeDb } from './itvDb.js'

const require = createRequire(import.meta.url)
const pdf = require('pdf-parse')

const app = express()
const port = Number(process.env.PORT || 8787)

const uploadsDir = path.join(process.cwd(), 'server', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const upload = multer({ dest: uploadsDir })

const officialKnowledge = [
  {
    source: 'Manual de Reformas de Vehículos',
    topic: 'Definición general de reforma',
    text: 'Se considera reforma una modificación, sustitución o supresión posterior a matriculación que cambie características o definición reglamentaria.',
    hintKeywords: ['reforma', 'matriculación', 'características'],
  },
  {
    source: 'Manual de Reformas de Vehículos',
    topic: 'Documentación',
    text: 'Según código de reforma, puede requerirse proyecto, informe de conformidad y certificado de taller.',
    hintKeywords: ['proyecto', 'informe de conformidad', 'certificado de taller', 'documentación'],
  },
  {
    source: 'Procedimiento de Inspección ITV',
    topic: 'Inspección',
    text: 'La ITV puede anotar defectos por modificaciones no legalizadas y exigir regularización.',
    hintKeywords: ['defecto', 'itv', 'regularización', 'legalizada'],
  },
]

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function score(question, target, keywords = []) {
  const q = normalize(question)
  const t = normalize(target)
  let total = 0

  for (const keyword of keywords) {
    const key = normalize(keyword)
    if (q.includes(key)) total += 2
    if (t.includes(key)) total += 1
  }

  for (const token of q.split(/\W+/).filter((x) => x.length > 3)) {
    if (t.includes(token)) total += 0.4
  }

  return total
}

function splitTextIntoChunks(text, size = 1300) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return []
  const matches = clean.match(new RegExp(`.{1,${size}}(\\s|$)`, 'g')) || [clean]
  return matches.map((m) => m.trim()).filter(Boolean)
}

async function parsePdf(filepath) {
  const dataBuffer = fs.readFileSync(filepath)
  const parsed = await pdf(dataBuffer)
  const chunks = splitTextIntoChunks(parsed.text)
  return chunks
}

app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/itv/docs', (_req, res) => {
  const db = readDb()
  res.json({ documents: db.documents, chunks: db.chunks.length, updatedAt: db.updatedAt })
})

app.post('/api/itv/upload', upload.array('pdfs', 10), async (req, res) => {
  try {
    const files = req.files || []
    if (!files.length) {
      return res.status(400).json({ error: 'No se recibieron PDFs.' })
    }

    const db = readDb()
    let addedDocs = 0

    for (const file of files) {
      if (!file.originalname.toLowerCase().endsWith('.pdf')) continue

      const chunksText = await parsePdf(file.path)
      const docId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      db.documents.push({
        id: docId,
        fileName: file.originalname,
        uploadedAt: new Date().toISOString(),
        chunks: chunksText.length,
      })

      chunksText.forEach((text, index) => {
        db.chunks.push({
          id: `${docId}-${index + 1}`,
          source: file.originalname,
          topic: `Fragmento ${index + 1}`,
          text,
          page: null,
        })
      })

      addedDocs += 1
      fs.unlinkSync(file.path)
    }

    db.updatedAt = new Date().toISOString()
    writeDb(db)

    return res.json({ ok: true, addedDocs, totalDocs: db.documents.length, totalChunks: db.chunks.length })
  } catch (error) {
    return res.status(500).json({ error: 'Error procesando PDFs', detail: String(error) })
  }
})

app.post('/api/itv/ask', (req, res) => {
  const question = String(req.body?.question || '').trim()
  if (question.length < 5) {
    return res.status(400).json({ error: 'Consulta demasiado corta.' })
  }

  const db = readDb()

  const rankedOfficial = officialKnowledge
    .map((chunk) => ({ chunk, score: score(question, chunk.text, chunk.hintKeywords) }))
    .sort((a, b) => b.score - a.score)
    .filter((x) => x.score > 0)
    .slice(0, 2)

  const rankedDb = db.chunks
    .map((chunk) => ({ chunk, score: score(question, chunk.text, []) }))
    .sort((a, b) => b.score - a.score)
    .filter((x) => x.score > 0.5)
    .slice(0, 4)

  const reformSignals = ['escape', 'faro', 'intermitente', 'suspension', 'freno', 'chasis', 'estructura', 'led']
  const likelyReform = reformSignals.some((token) => normalize(question).includes(token))

  const verdict = likelyReform
    ? 'Con la información aportada, podría considerarse reforma y requerir legalización/documentación específica.'
    : 'Con la información aportada, podría no ser reforma si el componente es equivalente y homologado para ese vehículo.'

  const officialEvidence = rankedOfficial.length
    ? rankedOfficial.map((item) => `${item.chunk.source} · ${item.chunk.topic}: ${item.chunk.text}`)
    : ['Sin coincidencias claras en base oficial resumida.']

  const pdfEvidence = rankedDb.length
    ? rankedDb.map((item) => `${item.chunk.source}: ${item.chunk.text.slice(0, 260)}...`)
    : ['No hay coincidencias en la base documental cargada.']

  return res.json({
    verdict,
    officialEvidence,
    pdfEvidence,
    docsLoaded: db.documents.length,
    updatedAt: db.updatedAt,
    disclaimer:
      'Respuesta orientativa. Para conclusión definitiva hay que validar código de reforma y documentación exacta en ITV.',
  })
})

app.listen(port, () => {
  console.log(`ITV API running on http://localhost:${port}`)
})
