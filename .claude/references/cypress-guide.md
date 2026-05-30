# Guia Cypress E2E — Referencia Completa

Referencia practica y generica para escribir specs E2E con Cypress.
Aplica a cualquier proyecto web independiente del stack o empresa.

---

## 1. Estructura base de un spec

```javascript
/// <reference types="cypress" />

// REQ-XXX — Titulo del requerimiento
// Spec: nombre-del-spec.cy.js
// Criterios automatizados: TC-001-FP, TC-002-FP...
// URL bajo prueba: https://tu-app.com/ruta

describe('REQ-XXX | Titulo del modulo o funcionalidad', () => {

  beforeEach(() => {
    cy.visit('/ruta')
  })

  // TC-001-FP — Titulo del caso
  // DADO  contexto inicial
  // CUANDO accion del usuario
  // ENTONCES resultado esperado
  it('TC-001-FP | Titulo del caso', () => {
    // comandos aqui
  })

})
```

**Reglas:**
- Siempre `/// <reference types="cypress" />` al inicio
- Un `it()` por criterio de aceptacion
- Comentario DADO/CUANDO/ENTONCES en cada test
- Nombrar el `it()` con el ID del caso: `TC-001-FP | titulo`

---

## 2. Navegacion

```javascript
// Navegar a una ruta (usa baseUrl del config)
cy.visit('/login')

// URL absoluta
cy.visit('https://mi-app.com/inicio')

// Con opciones
cy.visit('/dashboard', { timeout: 10000 })

// Navegar atras / adelante
cy.go('back')
cy.go('forward')

// Recargar pagina
cy.reload()
```

---

## 3. Selectores

```javascript
// Por atributo data-testid (preferido siempre)
cy.get('[data-testid="login-button"]')

// Por atributo name (inputs de formularios)
cy.get('input[name="email"]')
cy.get('input[name="password"]')

// Por type
cy.get('button[type="submit"]')
cy.get('input[type="checkbox"]')

// Por texto visible
cy.contains('Iniciar sesion')
cy.contains('button', 'Enviar')

// Por id
cy.get('#main-content')

// Encadenado (hijo dentro de padre)
cy.get('[data-testid="form-login"]').find('input[name="email"]')

// Nth elemento
cy.get('li').eq(0)   // primero
cy.get('li').eq(-1)  // ultimo
cy.get('li').first()
cy.get('li').last()
```

**Nunca usar:**
- Clases CSS generadas por frameworks (`_ngcontent-*`, `mat-*`, `css-xyz`)
- Selectores frágiles que cambian con el layout

---

## 4. Assertions (verificaciones)

```javascript
// Visibilidad
cy.get('[data-testid="header"]').should('be.visible')
cy.get('[data-testid="modal"]').should('not.be.visible')
cy.get('[data-testid="item"]').should('exist')
cy.get('[data-testid="error"]').should('not.exist')

// Texto
cy.get('[data-testid="title"]').should('have.text', 'Bienvenido')
cy.get('[data-testid="message"]').should('contain', 'exitoso')

// Valor de input
cy.get('input[name="email"]').should('have.value', 'test@mail.com')

// Estado
cy.get('input[type="checkbox"]').should('be.checked')
cy.get('button[type="submit"]').should('be.disabled')
cy.get('input[name="email"]').should('be.enabled')

// Clases CSS
cy.get('[data-testid="alert"]').should('have.class', 'alert-error')

// Assertions multiples encadenadas
cy.get('[data-testid="email-input"]')
  .should('be.visible')
  .and('be.enabled')
  .and('have.value', '')

// Assertions con .then()
cy.get('[data-testid="counter"]').then(($el) => {
  const valor = parseInt($el.text())
  expect(valor).to.be.greaterThan(0)
})
```

---

## 5. Interacciones

```javascript
// Click
cy.get('[data-testid="submit-btn"]').click()
cy.get('[data-testid="item"]').dblclick()
cy.get('[data-testid="menu"]').rightclick()

// Escribir en campos
cy.get('input[name="email"]').type('usuario@mail.com')
cy.get('input[name="password"]').type('miPassword', { log: false })

// Limpiar y reescribir
cy.get('input[name="email"]').clear().type('nuevo@mail.com')

// Seleccionar en dropdown
cy.get('select[name="pais"]').select('Chile')
cy.get('select[name="pais"]').select(2)  // por indice

// Checkbox y radio
cy.get('input[type="checkbox"]').check()
cy.get('input[type="checkbox"]').uncheck()
cy.get('input[type="radio"][value="opcion1"]').check()

// Subir archivo
cy.get('input[type="file"]').selectFile('cypress/fixtures/archivo.pdf')

// Drag and drop
cy.get('[data-testid="origen"]').drag('[data-testid="destino"]')

// Teclado especial
cy.get('input[name="buscar"]').type('texto{enter}')
cy.get('input[name="buscar"]').type('{selectAll}{del}')
cy.get('body').type('{esc}')
```

---

## 6. URL y Navegacion

```javascript
// URL contiene string
cy.url().should('include', '/dashboard')

// URL exacta
cy.url().should('eq', 'https://mi-app.com/inicio')

// Protocolo
cy.location('protocol').should('eq', 'https:')

// Path
cy.location('pathname').should('eq', '/perfil')

// Query params
cy.location('search').should('include', 'page=1')

// Hash
cy.location('hash').should('eq', '#seccion')
```

---

## 7. Fixtures — datos de prueba

```javascript
// Cargar fixture en el test
it('TC-001-FP | Login con datos validos', () => {
  cy.fixture('login-valido.json').then((data) => {
    cy.get('input[name="email"]').type(data.email)
    cy.get('input[name="password"]').type(data.password, { log: false })
  })
})

// Cargar fixture en beforeEach con alias
beforeEach(() => {
  cy.fixture('usuario.json').as('usuario')
})

it('TC-002-FP | Muestra nombre del usuario', function () {
  // usar function() con this para acceder al alias
  cy.get('[data-testid="nombre"]').should('contain', this.usuario.nombre)
})
```

**Archivo `cypress/fixtures/login-valido.json`:**
```json
{
  "email": "usuario@test.com",
  "password": "Password123"
}
```

---

## 8. Custom Commands

Definidos en `cypress/support/commands.js`. Patron: `cy.accionNombre()`

**Regla:** Si un bloque de codigo se repite en 2 o mas specs, va a `commands.js` como comando reutilizable. Nunca copiar y pegar entre specs.

```javascript
// Ejemplo BUPA — visita siempre la misma URL base
Cypress.Commands.add('visitPortal', () => {
  cy.visit('https://portalpaciente.bupa.cl/inicio')
})

// Uso en cualquier spec — si la URL cambia, solo se toca commands.js
beforeEach(() => {
  cy.visitPortal()
})
```

```javascript
// Ejemplo generico — login reutilizable
Cypress.Commands.add('login', (email, password) => {
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password, { log: false })
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/login')
})

Cypress.Commands.add('loginPorApi', (email, password) => {
  cy.request('POST', '/api/auth/login', { email, password })
    .then(({ body }) => {
      window.localStorage.setItem('token', body.token)
    })
})

// Uso en el spec
it('TC-001-AUTO | Usuario accede al dashboard', () => {
  cy.login('usuario@test.com', 'Password123')
  cy.url().should('include', '/dashboard')
})
```

---

## 9. Intercept — mockear llamadas API

```javascript
// Interceptar y esperar una llamada real
cy.intercept('GET', '/api/usuarios').as('getUsuarios')
cy.visit('/lista')
cy.wait('@getUsuarios')
cy.get('[data-testid="tabla"]').should('be.visible')

// Mockear respuesta (sin llamar al servidor real)
cy.intercept('GET', '/api/usuarios', {
  statusCode: 200,
  body: [{ id: 1, nombre: 'Juan' }]
}).as('getUsuariosMock')

// Mockear desde fixture
cy.intercept('GET', '/api/usuarios', { fixture: 'usuarios.json' }).as('getUsuarios')

// Interceptar POST y verificar payload
cy.intercept('POST', '/api/login').as('postLogin')
cy.get('button[type="submit"]').click()
cy.wait('@postLogin').its('request.body').should('have.property', 'email')

// Simular error de red
cy.intercept('GET', '/api/datos', { forceNetworkError: true })

// Simular respuesta lenta
cy.intercept('GET', '/api/datos', (req) => {
  req.reply({ delay: 3000, body: {} })
})
```

---

## 10. Aliases

```javascript
// Alias de elemento DOM
cy.get('[data-testid="tabla"]').as('tabla')
cy.get('@tabla').should('be.visible')
cy.get('@tabla').find('tr').should('have.length', 5)

// Alias de request
cy.intercept('GET', '/api/items').as('getItems')
cy.wait('@getItems').then(({ response }) => {
  expect(response.statusCode).to.eq(200)
  expect(response.body).to.have.length.greaterThan(0)
})

// Alias de fixture
cy.fixture('usuario.json').as('usuario')
// Acceder con this (requiere function(), no arrow function)
it('test', function () {
  cy.log(this.usuario.nombre)
})
```

---

## 11. Hooks

```javascript
describe('Suite de pruebas', () => {

  before(() => {
    // Corre UNA VEZ antes de todos los it()
    // Usar para setup costoso: seed de BD, login por API
    cy.loginPorApi('admin@test.com', 'Admin123')
  })

  after(() => {
    // Corre UNA VEZ despues de todos los it()
    // Usar para limpiar estado global
  })

  beforeEach(() => {
    // Corre antes de CADA it()
    // Usar para navegar a la pagina inicial del suite
    cy.visit('/inicio')
  })

  afterEach(() => {
    // Corre despues de CADA it()
    // Usar para limpiar cookies, localStorage
    cy.clearCookies()
  })

})
```

---

## 12. Skip, Only y Pending

```javascript
// Saltar un test (no corre, aparece como pending)
it.skip('TC-003-FP | Funcionalidad en desarrollo', () => { })

// Correr SOLO este test (util para debug — no commitear)
it.only('TC-001-FP | Debug de este caso', () => { })

// Saltar todo un suite
describe.skip('Suite deshabilitado', () => { })

// Correr solo este suite
describe.only('Solo este suite', () => { })

// Test pendiente sin implementar
it('TC-005-FP | Caso a implementar')
```

---

## 13. Viewport — testing responsive

```javascript
// En el test
cy.viewport(375, 812)   // iPhone SE
cy.viewport(768, 1024)  // iPad
cy.viewport(1280, 720)  // Desktop HD

// Presets disponibles
cy.viewport('iphone-se2')
cy.viewport('ipad-2')
cy.viewport('macbook-13')

// Verificar sin scroll horizontal (mobile)
cy.window().then((win) => {
  expect(win.document.documentElement.scrollWidth).to.be.lte(375)
})

// En cypress.config.js para todo el suite
// viewportWidth: 375,
// viewportHeight: 812
```

---

## 14. Screenshots y Videos

```javascript
// Captura manual en un punto del test
cy.screenshot('nombre-de-la-captura')

// Captura de un elemento especifico
cy.get('[data-testid="modal"]').screenshot('modal-abierto')

// Cypress captura automaticamente en fallos si esta habilitado en config:
// screenshotOnRunFailure: true  (default: true)
// video: true                  (default: true en cypress run)
```

---

## 15. Cookies y Storage

```javascript
// Cookies
cy.getCookie('session_token').should('exist')
cy.setCookie('session_token', 'abc123')
cy.clearCookie('session_token')
cy.clearCookies()

// LocalStorage
cy.window().then((win) => {
  win.localStorage.setItem('token', 'abc123')
})
cy.window().its('localStorage').invoke('getItem', 'token').should('eq', 'abc123')
cy.clearLocalStorage()

// SessionStorage
cy.window().then((win) => {
  expect(win.sessionStorage.getItem('key')).to.eq('valor')
})
```

---

## 16. Medicion de tiempo de carga

```javascript
it('TC-002-FP | Pagina carga en menos de 3 segundos', () => {
  const inicio = Date.now()
  cy.visit('/inicio')
  cy.get('body').should('be.visible').then(() => {
    const duracion = Date.now() - inicio
    expect(duracion, `Tiempo de carga: ${duracion}ms`).to.be.lessThan(3000)
  })
})
```

---

## 17. Accesibilidad con cypress-axe

```javascript
// cypress/support/e2e.js debe tener:
// import 'cypress-axe'

it('TC-004-FP | Pagina cumple WCAG 2.1 AA', () => {
  cy.visit('/inicio')
  cy.injectAxe()
  cy.checkA11y(null, {
    runOnly: ['wcag2a', 'wcag2aa']
  })
})

// Ver detalle de violaciones
cy.checkA11y(null, { runOnly: ['wcag2a', 'wcag2aa'] }, (violations) => {
  violations.forEach(v => {
    cy.log(`[${v.impact}] ${v.id}: ${v.description}`)
  })
})

// Excluir regla especifica (falso positivo conocido)
cy.checkA11y(null, {
  runOnly: ['wcag2a', 'wcag2aa'],
  rules: { 'landmark-one-main': { enabled: false } }
})

// Solo un elemento
cy.checkA11y('[data-testid="formulario"]')
```

---

## 18. Variables de entorno

```javascript
// Leer variable definida en cypress.config.js o cypress.env.json
const baseUrl = Cypress.env('baseUrl')
const apiKey  = Cypress.env('API_KEY')

// En el test
cy.request({
  url: `${Cypress.env('apiUrl')}/usuarios`,
  headers: { Authorization: `Bearer ${Cypress.env('token')}` }
})

// cypress.env.json (NO commitear — agregar a .gitignore)
{
  "API_KEY": "abc123",
  "token": "xyz789"
}
```

---

## 19. Requests HTTP directos

```javascript
// GET
cy.request('GET', '/api/usuarios').then(({ status, body }) => {
  expect(status).to.eq(200)
  expect(body).to.have.length.greaterThan(0)
})

// POST con body
cy.request('POST', '/api/login', {
  email: 'usuario@test.com',
  password: 'Password123'
}).its('status').should('eq', 200)

// Con headers
cy.request({
  method: 'GET',
  url: '/api/perfil',
  headers: { Authorization: 'Bearer token123' },
  failOnStatusCode: false  // no falla si responde 4xx/5xx
}).then(({ status }) => {
  expect(status).to.eq(401)
})
```

---

## 20. Buenas practicas

| Regla | Correcto | Incorrecto |
|-------|----------|------------|
| Selectores | `[data-testid="btn"]` | `.btn-primary`, `#app > div > button` |
| Nombrar it() | `TC-001-FP \| Usuario hace login` | `should work` |
| Contrasenas | `type('pass', { log: false })` | `type('pass')` |
| Un criterio por it() | 1 assertion principal | multiples criterios mezclados |
| Esperar elementos | `.should('be.visible')` | `cy.wait(3000)` |
| Comentarios | DADO/CUANDO/ENTONCES | comentarios obvios |
| Datos de prueba | `cy.fixture('datos.json')` | datos hardcodeados en el spec |
| Login repetido | `cy.loginPorApi()` en beforeEach | `cy.visit + type + click` en cada it() |
| Codigo repetido entre specs | `cy.visitPortal()` en `commands.js` | copiar `cy.visit(url)` en cada spec |

**Nunca:**
- `cy.wait(numero)` con tiempo fijo — usar `cy.wait('@alias')` o `.should()`
- Credenciales hardcodeadas — usar `cypress.env.json` o variables CI
- `it.only` o `describe.only` en commits — solo para debug local
- Depender del orden de ejecucion entre specs

---

## 21. Reportes con Allure

Allure genera un dashboard HTML visual con historial, gráficos y detalle de cada TC.

### Flujo

```
Cypress corre tests
      ↓
allure-results/   ← JSONs crudos generados automáticamente (uno por test)
      ↓
allure generate
      ↓
allure-report/    ← HTML visual que abres en el browser
```

### Configuración (ya aplicada en este proyecto)

**`cypress/support/e2e.js`:**
```javascript
import '@shelex/cypress-allure-plugin'
```

**`cypress.config.js` — dentro de `setupNodeEvents`:**
```javascript
require("@shelex/cypress-allure-plugin/writer")(on, config);
```

### Comandos npm (definidos en package.json)

```bash
# Todo en un paso: corre todos los specs → genera reporte → abre en browser
npm run allure:run

# Paso a paso
npm run test:allure     # corre todos los specs con allure=true
npm run allure:report   # genera HTML en allure-report/
npm run allure:open     # abre en el browser
```

### Comandos directos

```bash
# Correr specs y generar resultados
npx cypress run --env allure=true

# Correr solo un spec con Allure
npx cypress run --spec "cypress/e2e/REQ-001-carga-portal.cy.js" --env allure=true

# Generar reporte HTML
npx allure generate allure-results --clean -o allure-report

# Abrir reporte
npx allure open allure-report

# Generar y abrir en un solo comando
npx allure serve allure-results
```

### .gitignore

Ambas carpetas son artefactos generados — no se commitean:
```
allure-results/
allure-report/
```

---

## 22. Page Object Model Avanzado

Cypress no usa clases con constructor de la misma forma que Playwright, pero el patrón POM se implementa con clases ES6 que encapsulan selectores y acciones por página.

### Estructura de carpetas

```
cypress/
├── pages/
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   └── components/
│       └── NavBar.js
└── e2e/
    └── login.cy.js
```

### BasePage — clase base

```javascript
// cypress/pages/BasePage.js
export class BasePage {
  navigate(path) {
    cy.visit(path)
  }

  esperarCarga() {
    cy.document().its('readyState').should('eq', 'complete')
  }

  tomarCaptura(nombre) {
    cy.screenshot(nombre)
  }
}
```

### LoginPage — hereda de BasePage

```javascript
// cypress/pages/LoginPage.js
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  get campoRut()       { return cy.get('[data-testid="rut-input"]') }
  get campoPassword()  { return cy.get('[data-testid="password-input"]') }
  get botonContinuar() { return cy.get('[data-testid="btn-continuar"]') }
  get botonLogin()     { return cy.get('[data-testid="btn-login"]') }
  get mensajeError()   { return cy.get('[data-testid="error-message"]') }

  navegarALogin() {
    this.navigate('/login')
    this.esperarCarga()
  }

  ingresarRut(rut) {
    this.campoRut.type(rut)
    this.botonContinuar.click()
  }

  ingresarPassword(password) {
    this.campoPassword.type(password, { log: false })
    this.botonLogin.click()
  }

  loginCompleto(rut, password) {
    this.ingresarRut(rut)
    this.ingresarPassword(password)
  }

  verificarErrorVisible() {
    this.mensajeError.should('be.visible')
  }
}
```

> **Por qué getters y no propiedades en el constructor:** En Cypress cada `cy.get()` debe ejecutarse dentro del test — los getters los llaman en el momento correcto, no al instanciar la clase.

### Componente reutilizable — NavBar

```javascript
// cypress/pages/components/NavBar.js
export class NavBar {
  get linkCitas()         { return cy.get('[data-testid="nav-citas"]') }
  get botonCerrarSesion() { return cy.get('[data-testid="nav-logout"]') }

  irACitas()      { this.linkCitas.click() }
  cerrarSesion()  { this.botonCerrarSesion.click() }
}
```

### DashboardPage — combina componentes

```javascript
// cypress/pages/DashboardPage.js
import { BasePage } from './BasePage'
import { NavBar }   from './components/NavBar'

export class DashboardPage extends BasePage {
  constructor() {
    super()
    this.navBar = new NavBar()
  }

  get tarjetaBienvenida() { return cy.get('[data-testid="welcome-card"]') }

  verificarAccesoCompleto() {
    this.tarjetaBienvenida.should('be.visible')
  }
}
```

### Uso en el spec

```javascript
// cypress/e2e/login.cy.js
import { LoginPage }     from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'

const login     = new LoginPage()
const dashboard = new DashboardPage()

describe('REQ-002 — Login Portal', () => {

  it('TC-001 | Login exitoso redirige al dashboard', () => {
    login.navegarALogin()
    login.loginCompleto('12345678-9', 'password123')
    dashboard.verificarAccesoCompleto()
  })

  it('TC-002 | RUT invalido muestra error', () => {
    login.navegarALogin()
    login.ingresarRut('00000000-0')
    login.verificarErrorVisible()
  })

})
```

### Diferencia clave: Cypress vs Playwright en POM

| Aspecto | Cypress | Playwright |
|---------|---------|------------|
| Selectores | Getters `get campo()` | Propiedades `readonly campo: Locator` en constructor |
| Herencia | `class LoginPage extends BasePage` | `class LoginPage extends BasePage` |
| Inyección en tests | Instancia en el spec `new LoginPage()` | Fixture `test.extend<Pages>({...})` |
| TypeScript | Opcional | Recomendado (tipado fuerte) |

### Reglas

| Regla | Detalle |
|-------|---------|
| Getters, no propiedades | `cy.get()` debe correr en tiempo de test, no en el constructor |
| Sin assertions en pages | `should()` solo en el spec o en métodos de verificación explícitos |
| Componentes separados | NavBar, Modal, Footer → clase propia |
| Instancia fuera de `it()` | `const login = new LoginPage()` a nivel de `describe` |

---

## 23. Comandos de terminal

```bash
# Correr un spec especifico
npx cypress run --spec "cypress/e2e/nombre-spec.cy.js"

# Correr todos los specs
npx cypress run

# Modo interactivo (ver el navegador)
npx cypress open

# Correr en ambiente especifico
npx cypress run --env environment=uat
npx cypress run --env environment=prod

# Correr con viewport mobile
npx cypress run --config viewportWidth=375,viewportHeight=812

# Correr en browser especifico
npx cypress run --browser chrome
npx cypress run --browser firefox

# Sin video (mas rapido en CI)
npx cypress run --config video=false

# Spec con pattern
npx cypress run --spec "cypress/e2e/auth/**/*.cy.js"
```
