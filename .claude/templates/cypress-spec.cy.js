/// <reference types="cypress" />

// REQ-XXX — Titulo del requerimiento
// Spec: nombre-spec.cy.js
// Criterios automatizados: TC-001-FP, TC-002-FP, TC-003-FP
// URL bajo prueba: https://mi-app.com/ruta

describe('REQ-XXX | Titulo del modulo o funcionalidad', () => {

  before(() => {
    // Corre UNA VEZ antes de todos los it()
    // Usar para setup costoso: seed de datos, login por API
    // cy.loginPorApi('usuario@test.com', 'Password123')
  })

  beforeEach(() => {
    // Corre antes de CADA it()
    cy.visit('/ruta')
  })

  afterEach(() => {
    // Limpieza opcional entre tests
    // cy.clearCookies()
  })

  // ─── Flujo Principal ────────────────────────────────────────────────────

  // TC-001-FP — Titulo del caso
  // Categoria: UI + Frontend
  // DADO    contexto inicial
  // CUANDO  accion del usuario
  // ENTONCES resultado esperado
  it('TC-001-FP | Titulo del caso', () => {
    // Arrange
    cy.get('[data-testid="elemento"]').should('be.visible')

    // Act
    cy.get('[data-testid="boton"]').click()

    // Assert
    cy.url().should('include', '/destino')
    cy.get('[data-testid="confirmacion"]').should('be.visible')
  })

  // TC-002-FP — Tiempo de carga
  // Categoria: UX
  // DADO    el usuario navega a la pagina
  // CUANDO  la pagina termina de cargar
  // ENTONCES el tiempo transcurrido es menor a 3000ms
  it('TC-002-FP | Pagina carga en menos de 3 segundos', () => {
    const inicio = Date.now()
    cy.visit('/ruta')
    cy.get('body').should('be.visible').then(() => {
      const duracion = Date.now() - inicio
      expect(duracion, `Tiempo de carga: ${duracion}ms`).to.be.lessThan(3000)
    })
  })

  // TC-003-FP — Seguridad HTTPS
  // Categoria: Backend (seguridad)
  // DADO    el usuario navega a la pagina
  // CUANDO  se evalua el protocolo de la URL
  // ENTONCES el protocolo es https:
  it('TC-003-FP | Pagina utiliza HTTPS', () => {
    cy.location('protocol').should('eq', 'https:')
  })

  // ─── Edge Cases ─────────────────────────────────────────────────────────

  // TC-001-EC — Titulo del edge case
  // Categoria: [UI / UX / Frontend / Backend]
  // DADO    condicion de borde
  // CUANDO  accion especifica
  // ENTONCES comportamiento esperado ante el caso borde
  it.skip('TC-001-EC | Titulo del edge case', () => {
    // implementar cuando aplique
  })

  // ─── Con fixture (datos externos) ───────────────────────────────────────

  // TC-004-FP — Login con datos desde fixture
  // Categoria: Frontend + Backend
  // DADO    el usuario tiene credenciales validas
  // CUANDO  ingresa sus datos y hace submit
  // ENTONCES accede al sistema
  it('TC-004-FP | Login con datos validos', () => {
    cy.fixture('login-valido.json').then((data) => {
      cy.get('input[name="email"]').type(data.email)
      cy.get('input[name="password"]').type(data.password, { log: false })
      cy.get('button[type="submit"]').click()
      cy.url().should('not.include', '/login')
    })
  })

  // ─── Con intercept (llamada API) ─────────────────────────────────────────

  // TC-005-FP — Carga de datos desde API
  // Categoria: Backend
  // DADO    la pagina solicita datos al servidor
  // CUANDO  la API responde
  // ENTONCES los datos se muestran en pantalla
  it('TC-005-FP | Datos cargan correctamente desde la API', () => {
    cy.intercept('GET', '/api/datos').as('getDatos')
    cy.visit('/ruta')
    cy.wait('@getDatos').its('response.statusCode').should('eq', 200)
    cy.get('[data-testid="lista"]').should('be.visible')
  })

  // ─── Mobile responsive ───────────────────────────────────────────────────

  // TC-002-EC — Sin scroll horizontal en mobile
  // Categoria: UX + Frontend
  // DADO    el usuario accede desde mobile (375px)
  // CUANDO  la pagina carga
  // ENTONCES no hay scroll horizontal
  it('TC-002-EC | Sin scroll horizontal en mobile (375px)', () => {
    cy.viewport(375, 812)
    cy.visit('/ruta')
    cy.get('body').should('be.visible')
    cy.window().then((win) => {
      expect(win.document.documentElement.scrollWidth).to.be.lte(375)
    })
  })

  // ─── Accesibilidad (cypress-axe) ─────────────────────────────────────────

  // TC-003-EC — Sin violaciones WCAG criticas
  // Categoria: UX (accesibilidad)
  // DADO    la pagina ha cargado
  // CUANDO  se evalua con axe
  // ENTONCES no hay violaciones criticas WCAG 2.1 AA
  it('TC-003-EC | Sin violaciones criticas WCAG 2.1 AA', () => {
    cy.injectAxe()
    cy.checkA11y(null, {
      runOnly: ['wcag2a', 'wcag2aa']
    }, (violations) => {
      violations.forEach(v => {
        cy.log(`[${v.impact}] ${v.id}: ${v.description}`)
      })
    })
  })

})
