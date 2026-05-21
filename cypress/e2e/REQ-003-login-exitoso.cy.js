/// <reference types="cypress" />

// REQ-BUPA-003 — Login exitoso con credenciales validas — Portal BUPA
// Spec: REQ-003-login-exitoso.cy.js
// Criterios automatizados: TC-001-AUTO (A), TC-002-AUTO (B), TC-003-AUTO (C)
// URL bajo prueba: https://portalpaciente.bupa.cl/inicio
// Precondicion: BUPA_USER y BUPA_PASS definidos en cypress.env.json

describe('REQ-BUPA-003 | Login exitoso con credenciales validas', () => {

  beforeEach(() => {
    cy.visitPortal()
  })

  // TC-001-AUTO — Criterio A
  // Categoria: Frontend
  // DADO    el paciente navega a /inicio
  // CUANDO  ingresa RUT valido en input[name="rut"] y hace click en continuar
  // ENTONCES el campo input[name="current-password"] aparece visible en pantalla
  it('TC-001-AUTO | REQ-003 | Campo password aparece visible tras paso 1', () => {
    cy.get('input[name="rut"]').type(Cypress.env('BUPA_USER'))
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).should('be.visible')
  })

  // TC-002-AUTO — Criterio B
  // Categoria: Frontend
  // DADO    el campo contrasena es visible en el paso 2
  // CUANDO  el paciente ingresa su contrasena valida y hace click en ingresar
  // ENTONCES la URL activa ya no contiene /inicio
  it('TC-002-AUTO | REQ-003 | URL no contiene /inicio tras login exitoso', () => {
    cy.loginBupa()
    cy.url().should('not.include', '/inicio')
  })

  // TC-003-AUTO — Criterio C
  // Categoria: Frontend + Backend
  // DADO    el paciente completo ambos pasos con credenciales validas
  // CUANDO  Angular finaliza el proceso de autenticacion
  // ENTONCES la URL cambia a una ruta del area autenticada del portal
  it('TC-003-AUTO | REQ-003 | URL cambia a ruta del area autenticada', () => {
    cy.loginBupa()
    cy.url().should('not.include', '/inicio')
    cy.url().should('not.equal', 'https://portalpaciente.bupa.cl/inicio')
  })

})
