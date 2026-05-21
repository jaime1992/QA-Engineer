/// <reference types="cypress" />

// REQ-BUPA-004 — Mensaje de error visible con credenciales invalidas — Login BUPA
// Spec: REQ-004-error-credenciales-invalidas.cy.js
// Criterios automatizados: TC-001-AUTO (A), TC-002-AUTO (B), TC-003-AUTO (C), TC-004-AUTO (D)
// URL bajo prueba: https://portalpaciente.bupa.cl/inicio
// RUT de prueba: 12345678K (formato valido, no registrado)
// Password de prueba: ClaveIncorrecta999

describe('REQ-BUPA-004 | Mensaje de error con credenciales invalidas', () => {

  beforeEach(() => {
    cy.visitPortal()
    // Flujo de dos pasos con credenciales invalidas
    cy.get('input[name="rut"]').type('12345678K')
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).should('be.visible')
    cy.get('input[name="current-password"]').type('ClaveIncorrecta999', { log: false })
    cy.get('button[type="submit"]').last().click()
  })

  // TC-001-AUTO — Criterio A
  // Categoria: UI
  // DADO    el paciente esta en la pagina de login
  // CUANDO  ingresa 12345678K como RUT y ClaveIncorrecta999 como contrasena y hace clic en Ingresar
  // ENTONCES el componente mat-error debe ser visible en pantalla
  it('TC-001-AUTO | REQ-004 | mat-error visible tras credenciales invalidas', () => {
    cy.get('mat-error').should('be.visible')
  })

  // TC-002-AUTO — Criterio B
  // Categoria: UI
  // DADO    se muestra el error de credenciales
  // CUANDO  el paciente lee el mensaje
  // ENTONCES el texto debe contener "Rut o contrasena incorrecta"
  it('TC-002-AUTO | REQ-004 | Texto de error contiene "Rut o contrasena incorrecta"', () => {
    cy.get('mat-error').should('contain', 'Rut o contrasena incorrecta')
  })

  // TC-003-AUTO — Criterio C
  // Categoria: Frontend
  // DADO    el login fallo por credenciales invalidas
  // CUANDO  el sistema procesa la respuesta del backend
  // ENTONCES la URL debe seguir siendo /inicio (no redirige al portal)
  it('TC-003-AUTO | REQ-004 | URL permanece en /inicio tras credenciales invalidas', () => {
    cy.url().should('include', '/inicio')
  })

  // TC-004-AUTO — Criterio D
  // Categoria: UI
  // DADO    el error esta visible
  // CUANDO  el paciente inspecciona la pagina
  // ENTONCES el mat-error debe estar en el DOM y con estado visible (no display:none)
  it('TC-004-AUTO | REQ-004 | mat-error en DOM y no oculto con display:none', () => {
    cy.get('mat-error')
      .should('be.visible')
      .and('not.have.css', 'display', 'none')
  })

})
