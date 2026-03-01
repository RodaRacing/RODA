import fs from 'node:fs'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), 'server', 'data', 'itv-db.json')

const emptyDb = {
  documents: [],
  chunks: [],
  updatedAt: null,
}

export function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(emptyDb, null, 2))
  }
}

export function readDb() {
  ensureDb()
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
}

export function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

export function getDbPath() {
  return DB_PATH
}
