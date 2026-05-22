# Guia Playwright E2E — Referencia Completa

Referencia practica y generica para escribir specs E2E con Playwright y TypeScript.
Aplica a cualquier proyecto web independiente del stack o empresa.

---

## 1. Estructura base de un spec

```typescript
import { test, expect } from '@playwright/test'

// REQ-XXX — Titulo del requerimiento
// Criterios: TC-001-AUTO, TC-002-AUTO...
// URL bajo prueba: https://tu-app.com/ruta

const URL = '/ruta'

test.describe('REQ-XXX | Titulo del modulo o funcionalidad', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URL)
  })

  // TC-001-AUTO — Titulo del caso
  // DADO  contexto inicial
  // CUANDO accion del usuario
  // ENTONCES resultado esperado
  test('TC-001-AUTO | Titulo del caso', async ({ page }) => {
    // comandos aqui
  })

})
```

**Reglas:**
- Siempre `import { test, expect } from '@playwright/test'` al inicio
- Un `test()` por criterio de aceptacion
- Comentario DADO/CUANDO/ENTONCES en cada test
- Nombrar el `test()` con el ID del caso: `TC-001-AUTO | titulo`
- Todas las funciones son `async/await` — Playwright es completamente asíncrono

---

## 2. Navegacion

```typescript
// Navegar a una ruta (usa baseURL del config)
await page.goto('/login')

// URL absoluta
await page.goto('https://mi-app.com/inicio')

// Con opciones — esperar hasta que la red este idle
await page.goto('/dashboard', { waitUntil: 'networkidle' })

// Navegar atras / adelante
await page.goBack()
await page.goForward()

// Recargar pagina
await page.reload()

// Esperar a que la URL cambie
await page.waitForURL('**/dashboard')
await page.waitForURL(/login/)
```

---

## 3. Locators (Selectores)

```typescript
// Por atributo data-testid (preferido siempre)
page.locator('[data-testid="login-button"]')

// Por rol accesible (preferido en Playwright — mas robusto que CSS)
page.getByRole('button', { name: 'Iniciar sesion' })
page.getByRole('textbox', { name: 'Correo electronico' })
page.getByRole('checkbox', { name: 'Recordarme' })

// Por texto visible
page.getByText('Bienvenido')
page.getByText('Bienvenido', { exact: true })

// Por label de formulario
page.getByLabel('Correo electronico')
page.getByLabel('Contrasena')

// Por placeholder
page.getByPlaceholder('Ej: 20345678K')

// Por atributo name (inputs de formularios)
page.locator('input[name="email"]')
page.locator('input[name="current-password"]')

// Por type
page.locator('button[type="submit"]')
page.locator('input[type="checkbox"]')

// Por id
page.locator('#main-content')

// Nth elemento — cuando hay varios con el mismo selector
page.locator('button[type="submit"]').first()
page.locator('button[type="submit"]').last()
page.locator('li').nth(2)  // tercero (indice 0)

// Encadenado (hijo dentro de padre)
page.locator('[data-testid="form-login"]').locator('input[name="email"]')

// Filtrar por texto dentro del locator
page.locator('button').filter({ hasText: 'Continuar' })
```

**Nunca usar:**
- Clases CSS generadas por frameworks (`_ngcontent-*`, `mat-*`, `css-xyz`)
- Selectores fragiles que cambian con el layout

**Strict mode:** Si un selector resuelve a mas de un elemento, Playwright falla. Usar `.first()`, `.last()` o `.nth()` para ser explicito.

---

## 4. Assertions (verificaciones)

```typescript
// Visibilidad
await expect(page.locator('[data-testid="header"]')).toBeVisible()
await expect(page.locator('[data-testid="modal"]')).toBeHidden()
await expect(page.locator('[data-testid="error"]')).not.toBeVisible()

// Existencia en DOM
await expect(page.locator('[data-testid="item"]')).toBeAttached()

// Texto
await expect(page.locator('[data-testid="title"]')).toHaveText('Bienvenido')
await expect(page.locator('[data-testid="message"]')).toContainText('exitoso')

// Valor de input
await expect(page.locator('input[name="email"]')).toHaveValue('test@mail.com')

// Estado
await expect(page.locator('input[type="checkbox"]')).toBeChecked()
await expect(page.locator('button[type="submit"]')).toBeDisabled()
await expect(page.locator('input[name="email"]')).toBeEnabled()
await expect(page.locator('[data-testid="input"]')).toBeFocused()

// Atributo
await expect(page.locator('input[name="pass"]')).toHaveAttribute('type', 'password')
await expect(page.locator('a')).toHaveAttribute('href', /bupa\.cl/)

// Clase CSS
await expect(page.locator('[data-testid="alert"]')).toHaveClass(/alert-error/)

// URL
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveURL(/login/)

// Titulo de la pagina
await expect(page).toHaveTitle('Portal Pacientes BUPA')

// Assertions con mensaje personalizado (aparece en el reporte si falla)
await expect(page.locator('body'), 'El body debe ser visible al cargar').toBeVisible()

// Assertions con .then() (para logica custom)
const texto = await page.locator('[data-testid="contador"]').textContent()
expect(parseInt(texto!)).toBeGreaterThan(0)
```

---

## 5. Interacciones

```typescript
// Click
await page.locator('[data-testid="submit-btn"]').click()
await page.locator('[data-testid="item"]').dblclick()
await page.locator('[data-testid="menu"]').click({ button: 'right' })

// Click forzado (cuando el elemento esta disabled o cubierto)
await page.locator('button[type="submit"]').click({ force: true })

// Escribir en campos
await page.locator('input[name="email"]').fill('usuario@mail.com')

// Simular escritura caracter a caracter (para inputs con validacion en tiempo real)
await page.locator('input[name="buscar"]').pressSequentially('texto')

// Limpiar un campo
await page.locator('input[name="email"]').clear()

// Seleccionar en dropdown
await page.locator('select[name="pais"]').selectOption('Chile')
await page.locator('select[name="pais"]').selectOption({ index: 2 })
await page.locator('select[name="pais"]').selectOption({ label: 'Chile' })

// Checkbox y radio
await page.locator('input[type="checkbox"]').check()
await page.locator('input[type="checkbox"]').uncheck()
await page.locator('input[type="radio"][value="opcion1"]').check()

// Subir archivo
await page.locator('input[type="file"]').setInputFiles('cypress/fixtures/archivo.pdf')

// Teclado
await page.keyboard.press('Enter')
await page.keyboard.press('Tab')
await page.keyboard.press('Escape')
await page.keyboard.press('Control+A')
await page.locator('input[name="buscar"]').press('Enter')

// Hover
await page.locator('[data-testid="menu"]').hover()

// Scroll
await page.locator('[data-testid="elemento"]').scrollIntoViewIfNeeded()
```

---

## 6. URL y Navegacion

```typescript
// URL contiene string
expect(page.url()).toContain('/dashboard')

// URL exacta
expect(page.url()).toBe('https://mi-app.com/inicio')

// Protocolo
const protocolo = new URL(page.url()).protocol
expect(protocolo).toBe('https:')

// Path
const path = new URL(page.url()).pathname
expect(path).toBe('/perfil')

// Con expect de Playwright (reintenta hasta que se cumple)
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveURL(/login/)

// Esperar cambio de URL tras una accion
await page.locator('button[type="submit"]').click()
await page.waitForURL('**/dashboard')
```

---

## 7. Fixtures — datos de prueba

En Playwright, los fixtures de datos se importan directamente como JSON (TypeScript lo soporta nativamente con `resolveJsonModule: true`).

```typescript
// Importar fixture al inicio del spec
import credenciales from '../../cypress/fixtures/auth/credenciales-validas.json'
import datosUsuario from '../fixtures/usuario.json'

test('TC-001-AUTO | Login con datos validos', async ({ page }) => {
  await page.locator('input[name="rut"]').fill(credenciales.rut)
  await page.locator('input[name="current-password"]').fill(credenciales.password)
  await page.locator('button[type="submit"]').click()
})
```

**Archivo `cypress/fixtures/auth/credenciales-validas.json`:**
```json
{
  "rut": "18116826-9",
  "password": "MiPassword123"
}
```

**Nota BUPA:** Los fixtures de credenciales reales estan en `cypress/fixtures/auth/` y son compartidos entre Cypress y Playwright. Estan en `.gitignore` — nunca commitear.

---

## 8. Page Object Model (POM)

Patron de diseno donde los selectores y acciones de una pagina se centralizan en una clase separada. Si un selector cambia, se toca en un solo lugar.

**`playwright/pages/PortalPage.ts`:**
```typescript
import { Page, Locator, expect } from '@playwright/test'

export class PortalPage {
  readonly page: Page
  readonly campoRut: Locator
  readonly campoPasword: Locator
  readonly botonContinuar: Locator

  constructor(page: Page) {
    this.page = page
    this.campoRut = page.locator('input[name="rut"]')
    this.campoPasword = page.locator('input[name="current-password"]')
    this.botonContinuar = page.locator('button[type="submit"]').first()
  }

  async goto() {
    await this.page.goto('/inicio')
  }

  async ingresarRut(rut: string) {
    await this.campoRut.fill(rut)
    await this.botonContinuar.click()
  }
}
```

**Uso en el spec:**
```typescript
import { PortalPage } from '../pages/PortalPage'

test('TC-001-AUTO | Campo RUT es visible', async ({ page }) => {
  const portal = new PortalPage(page)
  await portal.goto()
  await expect(portal.campoRut).toBeVisible()
})
```

**Regla:** Implementar POM a partir del tercer REQ o cuando un selector se repite en 2 o mas specs.

---

## 9. Route — interceptar y mockear llamadas API

```typescript
// Interceptar y esperar una llamada real
await page.route('**/api/usuarios', route => route.continue())
await page.goto('/lista')
// Usar waitForResponse para esperar la respuesta
const respuesta = await page.waitForResponse('**/api/usuarios')
expect(respuesta.status()).toBe(200)

// Mockear respuesta (sin llamar al servidor real)
await page.route('**/api/usuarios', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, nombre: 'Juan' }])
  })
})

// Mockear desde fixture JSON
await page.route('**/api/usuarios', async route => {
  const datos = JSON.parse(await require('fs').promises.readFile('cypress/fixtures/usuarios.json', 'utf-8'))
  route.fulfill({ status: 200, body: JSON.stringify(datos) })
})

// Simular error de red
await page.route('**/api/datos', route => route.abort())

// Simular respuesta lenta
await page.route('**/api/datos', async route => {
  await new Promise(r => setTimeout(r, 3000))
  await route.continue()
})

// Verificar que se hizo una llamada con ciertos datos
const [request] = await Promise.all([
  page.waitForRequest('**/api/login'),
  page.locator('button[type="submit"]').click()
])
expect(request.postDataJSON()).toHaveProperty('rut')
```

---

## 10. Hooks

```typescript
test.describe('Suite de pruebas', () => {

  test.beforeAll(async ({ browser }) => {
    // Corre UNA VEZ antes de todos los tests
    // Usar para setup costoso: autenticacion por API, seed de BD
  })

  test.afterAll(async () => {
    // Corre UNA VEZ despues de todos los tests
    // Usar para limpiar estado global
  })

  test.beforeEach(async ({ page }) => {
    // Corre antes de CADA test
    // Usar para navegar a la pagina inicial del suite
    await page.goto('/inicio')
  })

  test.afterEach(async ({ page }) => {
    // Corre despues de CADA test
    // Playwright limpia el contexto automaticamente entre tests
  })

})
```

---

## 11. Skip, Only y Pending

```typescript
// Saltar un test (no corre, aparece como skipped)
test.skip('TC-003-AUTO | Funcionalidad en desarrollo', async ({ page }) => { })

// Correr SOLO este test (util para debug — no commitear)
test.only('TC-001-AUTO | Debug de este caso', async ({ page }) => { })

// Saltar todo un suite
test.describe.skip('Suite deshabilitado', () => { })

// Correr solo este suite
test.describe.only('Solo este suite', () => { })

// Skip condicional
test('TC-004-AUTO | Solo en CI', async ({ page }) => {
  test.skip(!process.env.CI, 'Solo corre en entorno CI')
  // resto del test
})
```

---

## 12. Viewport — testing responsive

```typescript
// En el test individual
await page.setViewportSize({ width: 375, height: 812 })   // iPhone SE
await page.setViewportSize({ width: 768, height: 1024 })  // iPad
await page.setViewportSize({ width: 1280, height: 720 })  // Desktop HD

// En playwright.config.ts para todo un proyecto
// use: { viewport: { width: 375, height: 812 } }

// En projects — multiples viewports
// projects: [
//   { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
//   { name: 'desktop', use: { viewport: { width: 1280, height: 720 } } },
// ]

// Verificar sin scroll horizontal (mobile)
const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
expect(scrollWidth).toBeLessThanOrEqual(375)
```

---

## 13. Screenshots y Videos

```typescript
// Captura manual en un punto del test
await page.screenshot({ path: 'screenshots/nombre.png' })

// Captura de un elemento especifico
await page.locator('[data-testid="modal"]').screenshot({ path: 'screenshots/modal.png' })

// Captura de pantalla completa (full page)
await page.screenshot({ path: 'screenshots/full.png', fullPage: true })
```

**En `playwright.config.ts`:**
```typescript
use: {
  screenshot: 'only-on-failure',  // solo captura si el test falla
  video: 'off',                   // 'on', 'off', 'retain-on-failure'
}
```

**Carpeta de resultados:** `test-results/` — generada automaticamente. Agregar a `.gitignore`.

---

## 14. Cookies y Storage

```typescript
// Cookies
const cookies = await page.context().cookies()
const sessionCookie = cookies.find(c => c.name === 'session_token')
expect(sessionCookie).toBeDefined()

await page.context().addCookies([{ name: 'session_token', value: 'abc123', domain: 'mi-app.com', path: '/' }])
await page.context().clearCookies()

// LocalStorage
await page.evaluate(() => localStorage.setItem('token', 'abc123'))
const token = await page.evaluate(() => localStorage.getItem('token'))
expect(token).toBe('abc123')
await page.evaluate(() => localStorage.clear())

// SessionStorage
const valor = await page.evaluate(() => sessionStorage.getItem('key'))
expect(valor).toBe('valor esperado')

// Guardar estado de autenticacion para reutilizar entre tests (storageState)
// Util para evitar hacer login en cada test
await page.context().storageState({ path: 'playwright/.auth/user.json' })
```

---

## 15. Medicion de tiempo de carga

```typescript
test('TC-002-AUTO | Portal carga en menos de 7 segundos', async ({ page }) => {
  const UMBRAL_MS = 7000
  const inicio = Date.now()
  await page.goto('/inicio')
  await expect(page.locator('body')).toBeVisible()
  const duracion = Date.now() - inicio
  expect(duracion, `Tiempo de carga: ${duracion}ms — umbral: ${UMBRAL_MS}ms`).toBeLessThan(UMBRAL_MS)
})

// Con timing nativo de Playwright (mas preciso)
const response = await page.goto('/inicio')
const timing = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  return nav.loadEventEnd - nav.startTime
})
expect(timing).toBeLessThan(7000)
```

---

## 16. Accesibilidad con @axe-core/playwright

```typescript
import AxeBuilder from '@axe-core/playwright'

test('TC-004-AUTO | Pagina cumple WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/inicio')

  const resultados = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  expect(resultados.violations).toEqual([])
})

// Ver detalle de violaciones en el reporte
test('TC-004-AUTO | WCAG con detalle', async ({ page }) => {
  const resultados = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  if (resultados.violations.length > 0) {
    resultados.violations.forEach(v => {
      console.log(`[${v.impact}] ${v.id}: ${v.description}`)
    })
  }
  expect(resultados.violations).toEqual([])
})

// Excluir regla especifica (falso positivo conocido)
// En BUPA: nested-interactive es una violacion de Angular Material, no del formulario
const resultados = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa'])
  .disableRules(['nested-interactive'])
  .analyze()

// Solo un elemento del DOM
const resultados = await new AxeBuilder({ page })
  .include('[data-testid="formulario"]')
  .withTags(['wcag2a', 'wcag2aa'])
  .analyze()
```

---

## 17. Variables de entorno

```typescript
// Leer variable de entorno del sistema / CI
const baseUrl = process.env.BASE_URL
const apiKey  = process.env.API_KEY

// En playwright.config.ts definir variables accesibles en tests
// use: { baseURL: process.env.BASE_URL || 'https://portalpaciente.bupa.cl' }

// En el test leer desde la config
test('TC-001-AUTO | Usa baseURL del config', async ({ page }) => {
  await page.goto('/inicio')  // se concatena con baseURL del config automaticamente
})

// Leer env directo en el test
test('TC-002-AUTO | Con token de API', async ({ page, request }) => {
  const token = process.env.API_TOKEN
  const resp = await request.get('/api/perfil', {
    headers: { Authorization: `Bearer ${token}` }
  })
  expect(resp.ok()).toBeTruthy()
})
```

**`.env` (NO commitear):**
```
BASE_URL=https://portalpaciente.bupa.cl
API_TOKEN=abc123
```

---

## 18. Requests HTTP directos (APIRequestContext)

```typescript
// GET
test('TC-001-AUTO | API responde 200', async ({ request }) => {
  const resp = await request.get('https://mi-api.com/usuarios')
  expect(resp.status()).toBe(200)
  const body = await resp.json()
  expect(body.length).toBeGreaterThan(0)
})

// POST con body
test('TC-002-AUTO | Login por API', async ({ request }) => {
  const resp = await request.post('https://mi-api.com/login', {
    data: { email: 'usuario@test.com', password: 'Password123' }
  })
  expect(resp.status()).toBe(200)
  const body = await resp.json()
  expect(body).toHaveProperty('token')
})

// Con headers
const resp = await request.get('https://mi-api.com/perfil', {
  headers: { Authorization: 'Bearer token123' },
  failOnStatusCode: false
})
expect(resp.status()).toBe(401)

// Health check de un endpoint
test('TC-API | Health check responde 200', async ({ request }) => {
  const resp = await request.get('https://portalpaciente.bupa.cl/api/health')
  expect(resp.ok()).toBeTruthy()
})
```

---

## 19. Buenas practicas

| Regla | Correcto | Incorrecto |
|-------|----------|------------|
| Selectores | `getByRole('button', { name: 'Enviar' })` | `.btn-primary`, `_ngcontent-*` |
| Nombrar test() | `TC-001-AUTO \| Usuario hace login` | `should work` |
| Contrasenas | `fill(credenciales.password)` desde fixture | password hardcodeado en el spec |
| Un criterio por test() | 1 assertion principal | multiples criterios mezclados |
| Esperar elementos | `await expect(locator).toBeVisible()` | `await page.waitForTimeout(3000)` |
| Comentarios | DADO/CUANDO/ENTONCES | comentarios obvios |
| Datos de prueba | `import datos from '../fixtures/datos.json'` | datos hardcodeados en el spec |
| Multiples elementos | `.first()`, `.last()`, `.nth(n)` | selector ambiguo (strict mode falla) |
| Login repetido | `storageState` o helper en beforeAll | login completo en cada test |
| Codigo repetido entre specs | Page Object Model (POM) | copiar locators entre specs |

**Nunca:**
- `await page.waitForTimeout(numero)` con tiempo fijo — usar `await expect(locator).toBeVisible()`
- Credenciales hardcodeadas — usar fixtures o variables de entorno
- `test.only` o `describe.only` en commits — solo para debug local
- Depender del orden de ejecucion entre tests — cada test debe ser independiente
- Ignorar el strict mode — si hay 2 elementos, ser explicito con `.first()` o `.nth()`

---

## 20. Reportes con Playwright HTML Reporter

Playwright genera un reporte HTML visual integrado sin instalar nada extra.

### Configuracion en `playwright.config.ts`

```typescript
reporter: [
  ['list'],          // output en terminal mientras corre
  ['html'],          // genera reporte HTML en playwright-report/
]
```

### Comandos

```bash
# Correr tests y generar reporte automaticamente
npx playwright test

# Ver el ultimo reporte generado (abre en browser)
npx playwright show-report

# Correr y abrir reporte al finalizar
npx playwright test --reporter=html && npx playwright show-report
```

### Carpetas generadas (agregar a .gitignore)

```
playwright-report/   # reporte HTML visual
test-results/        # screenshots y videos de fallos
```

---

## 21. Comandos de terminal

```bash
# Correr todos los specs
npm run pw:run
npx playwright test

# Correr un spec especifico
npm run pw:smoke
npx playwright test playwright/e2e/REQ-001-carga-portal.spec.ts

# Con browser visible (modo headed)
npx playwright test playwright/e2e/REQ-001-carga-portal.spec.ts --headed

# UI interactiva (equivalente a cypress open)
npm run pw:open
npx playwright test --ui

# Correr en browser especifico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Correr por patron de nombre
npx playwright test --grep "TC-001"
npx playwright test --grep-invert "skip"

# Correr en viewport mobile
npx playwright test --project=mobile

# Debug interactivo (abre Playwright Inspector)
npx playwright test --debug

# Ver reporte del ultimo run
npx playwright show-report

# Modo verbose
npx playwright test --reporter=list

# Sin reintentos (util en local para ver fallos rapido)
npx playwright test --retries=0
```

---

## 22. Conocimiento especifico — Portal Pacientes BUPA

| Dato | Detalle |
|---|---|
| **URL base** | `https://portalpaciente.bupa.cl` |
| **Stack** | Angular 17 + Angular Material |
| **Login** | 2 pasos: paso 1 = RUT, paso 2 = password |
| **Campo RUT** | `input[name="rut"]` — visible en paso 1 |
| **Campo password** | `input[name="current-password"]` — visible solo en paso 2 |
| **Boton paso 1** | `button[type="submit"]`.first() — texto "Continuar" |
| **Boton paso 2** | `button[type="submit"]`.last() — texto "Iniciar sesion" |
| **Tiempo de carga** | ~6-7 segundos desde maquina local — umbral definido en 7000ms |
| **Violacion WCAG conocida** | `nested-interactive` en `mat-expansion-panel` — excluir con `.disableRules(['nested-interactive'])` |
| **Fixtures compartidos** | `cypress/fixtures/auth/credenciales-validas.json` — compartido con Cypress |
| **Credenciales** | Gitignored — nunca commitear |
