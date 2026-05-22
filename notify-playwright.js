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
const project = process.argv[3] || 'chromium'

// Playwright escribe el JSON directamente al archivo — evita mezcla con otros logs
const cmd = spec
  ? `npx playwright test ${spec} --project=${project} --reporter=json`
  : `npx playwright test --project=${project} --reporter=json`

console.log(`[PW] Corriendo: ${cmd}`)

try {
  execSync(cmd, {
    encoding: 'utf8',
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: TEMP_FILE },
  })
} catch (e) {
  // Playwright retorna exit code 1 cuando hay fallos — el archivo JSON igual se genera
}

if (!fs.existsSync(TEMP_FILE)) {
  console.error('[ERROR] No se genero el archivo de resultados. Verifique que Playwright corrio correctamente.')
  process.exit(1)
}

// --- 2. Parsear resultados ---
let pw
try {
  pw = JSON.parse(fs.readFileSync(TEMP_FILE, 'utf8'))
} catch (e) {
  console.error('[ERROR] JSON invalido:', e.message)
  process.exit(1)
}

const pwStats = pw.stats || {}

// Convertir al formato estandar (igual que Cypress) para que n8n lo procese igual
// Playwright anida suites (archivo > describe > specs)
// Se pasa el titulo del describe padre para armar el titulo completo
// Formato final: "REQ-BUPA-001 | titulo describe > TC-001-AUTO | titulo test"
// Esto permite que email-server.js extraiga el REQ correctamente
function extraerTests(suites, tituloParent) {
  const tests = []
  for (const suite of (suites || [])) {
    const tituloSuite = tituloParent || suite.title || ''
    for (const sp of (suite.specs || [])) {
      const firstResult = sp.tests?.[0]?.results?.[0] || {}
      const isPassed    = sp.ok === true || firstResult.status === 'passed'
      tests.push({
        title:    tituloSuite ? `${tituloSuite} > ${sp.title}` : sp.title,
        state:    isPassed ? 'passed' : 'failed',
        duration: firstResult.duration || 0,
        err:      firstResult.error?.message
          ? String(firstResult.error.message).substring(0, 150)
          : null,
      })
    }
    // Recursivo — entrar en suites anidadas (describe blocks)
    if (suite.suites && suite.suites.length > 0) {
      tests.push(...extraerTests(suite.suites, tituloSuite))
    }
  }
  return tests
}

const specName = spec
  ? spec.split('/').pop().replace('.spec.ts', '').replace('.spec.js', '')
  : 'Playwright Suite'

// Agrupar todos los tests bajo un solo resultado con el nombre del spec
const todosLosTests = extraerTests(pw.suites || [])

const payload = {
  suite: specName,
  stats: {
    passes:   pwStats.expected   || 0,
    failures: pwStats.unexpected || 0,
    pending:  pwStats.skipped    || 0,
    tests:    (pwStats.expected || 0) + (pwStats.unexpected || 0) + (pwStats.skipped || 0),
    duration: pwStats.duration   || 0,
  },
  results: [{
    file:  specName,
    stats: {},
    tests: todosLosTests,
  }],
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
