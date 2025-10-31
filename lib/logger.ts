// lib/logger.ts
import fs from "fs"
import path from "path"

const LOG_DIR = path.resolve(process.cwd(), "logs")
const LOG_FILE = path.join(LOG_DIR, "dev-server.log")

function ensureLogDir() {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
  } catch {}
}

function safeStringify(v: any) {
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}

export function logServer(event: string, meta?: Record<string, any>) {
  const entry = {
    ts: new Date().toISOString(),
    event,
    ...meta,
  }
  const line = safeStringify(entry)

  // Always to console (Next shows these in terminal)
  // eslint-disable-next-line no-console
  console.log("[server]", line)

  // Also append to logs/dev-server.log (best-effort)
  try {
    ensureLogDir()
    fs.appendFileSync(LOG_FILE, line + "\n")
  } catch {}
}

export function getRecentLogEvents(limit = 500): Array<Record<string, any>> {
  try {
    ensureLogDir()
    const text = fs.readFileSync(LOG_FILE, "utf8")
    const lines = text.trim().split(/\n+/).slice(-limit)
    const events: any[] = []
    for (const line of lines) {
      try { events.push(JSON.parse(line)) } catch {}
    }
    return events
  } catch {
    return []
  }
}
