/**
 * notify-playwright.js
 * Corre Playwright, convierte los resultados al formato estandar
 * y los envia al webhook de n8n WF-1.7 para disparar el email.
 *
 * Uso:
 *   node notify-playwright.js                                          # todos los specs
 *   node notify-playwright.js playwright/e2e/REQ-001-carga-portal.spec.ts
 *   node notify-playwright.js mobile/e2e/REQ-001-carga-portal.mobile.spec.ts
 */

require('dotenv').config()
const { execSync } = require('child_process')
const fs   = require('fs')
const http = require('http')

const N8N_WEBHOOK = process.env.PW_WEBHOOK_URL || 'http://localhost:5678/webhook/playwright-results'
const TEMP_FILE   = 'pw-results-temp.json'
const spec        = process.argv[2] || ''

// --- 1. Correr Playwright con JSON reporter ---
const cmd = spec
  ? `npx playwright test ${spec} --reporter=json`
  : `npx playwright test --reporter=json`

console.log(`[PW] Corriendo: ${cmd}`)

let rawOutput = ''
try {
  rawOutput = execSync(cmd, { encoding: 'utf8', stdio: ['inherit', 'pipe', 'inherit'] })
} catch (e) {
  // Playwright retorna exit code 1 cuando hay fallos — el JSON igual sale en stdout
  if (e.stdout) {
    rawOutput = e.stdout
  } else {
    console.error('[ERROR] No se pudo ejecutar Playwright:', e.message)
    process.exit(1)
  }
}

// Extraer solo el JSON (Playwright puede imprimir texto antes del JSON)
const jsonStart = rawOutput.indexOf('{')
if (jsonStart === -1) {
  console.error('[ERROR] No se encontro JSON en el output de Playwright')
  process.exit(1)
}
const jsonStr = rawOutput.substring(jsonStart)
fs.writeFileSync(TEMP_FILE, jsonStr)

// --- 2. Parsear resultados ---
let pw
try {
  pw = JSON.parse(jsonStr)
} catch (e) {
  console.error('[ERROR] JSON invalido:', e.message)
  process.exit(1)
}

const pwStats = pw.stats || {}

// Convertir al formato estandar (igual que Cypress) para que n8n lo procese igual
const payload = {
  suite: spec
    ? spec.split('/').pop().replace('.spec.ts', '').replace('.spec.js', '')
    : 'Playwright Suite',
  stats: {
    passes:   pwStats.expected   || 0,
    failures: pwStats.unexpected || 0,
    pending:  pwStats.skipped    || 0,
    tests:    (pwStats.expected || 0) + (pwStats.unexpected || 0) + (pwStats.skipped || 0),
    duration: pwStats.duration   || 0,
  },
  results: (pw.suites || []).map(suite => ({
    file:  suite.file || suite.title || 'spec',
    stats: {},
    tests: (suite.specs || []).map(sp => {
      const firstResult = sp.tests?.[0]?.results?.[0] || {}
      const isPassed    = sp.ok === true || firstResult.status === 'passed'
      return {
        title:    sp.title || '',
        state:    isPassed ? 'passed' : 'failed',
        duration: firstResult.duration || 0,
        err:      firstResult.error?.message
          ? String(firstResult.error.message).substring(0, 150)
          : null,
      }
    }),
  })),
}

console.log(`[PW] Resultados: ${payload.stats.passes}✅ ${payload.stats.failures}❌ ${payload.stats.pending}⏳`)

// --- 3. Enviar al webhook n8n WF-1.7 ---
const postData = JSON.stringify(payload)
const url      = new URL(N8N_WEBHOOK)
const options  = {
  hostname: url.hostname,
  port:     url.port || 80,
  path:     url.pathname,
  method:   'POST',
  headers: {
    'Content-Type':   'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
}

const req = http.request(options, res => {
  let body = ''
  res.on('data', chunk => body += chunk)
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('[OK] Notificacion enviada a WF-1.7 → email en camino')
    } else {
      console.warn(`[WARN] Webhook respondio ${res.statusCode}: ${body}`)
    }
  })
})

req.on('error', err => {
  console.error('[ERROR] No se pudo conectar al webhook n8n:', err.message)
  console.error('        Asegurese de que n8n esta corriendo y WF-1.7 esta publicado')
})

req.write(postData)
req.end()

// --- 4. Limpiar archivo temporal ---
try { fs.unlinkSync(TEMP_FILE) } catch (_) {}
