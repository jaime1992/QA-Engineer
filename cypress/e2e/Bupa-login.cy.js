/// <reference types="cypress" />

// REQ-BUPA-002 — Verificacion de visibilidad y accesibilidad del formulario de login
// Spec: Bupa-login.cy.js
// Criterios automatizados: TC-001-AUTO, TC-002-AUTO, TC-003-AUTO, TC-004-AUTO
// TC-005-AUTO (Tab navigation) — pendiente implementacion
// URL bajo prueba: https://portalpaciente.bupa.cl/inicio

describe('REQ-BUPA-002 | Verificacion de visibilidad y accesibilidad del formulario de login', () => {

  beforeEach(() => {
    cy.visitPortal()
  })

  // TC-001-AUTO — Campo RUT es visible
  // Categoria: UI + Frontend
  // DADO el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO Angular termina de renderizar el componente de login
  // ENTONCES el elemento input[name="rut"] es visible en pantalla
  it('TC-001-AUTO | Campo RUT es visible', () => {
    cy.get('input[name="rut"]').should('be.visible')
  })

  // TC-002-AUTO — Campo password es visible y de tipo password
  // Categoria: UI + Backend (seguridad)
  // DADO el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO Angular termina de renderizar el componente de login
  // ENTONCES el elemento input[name="current-password"] es visible y su tipo es password
  it('TC-002-AUTO | Campo password es visible y de tipo password', () => {
    cy.get('input[name="current-password"]')
      .should('be.visible')
      .and('have.attr', 'type', 'password')
  })

  // TC-003-AUTO — Boton Iniciar sesion es visible
  // Categoria: UI
  // DADO el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO Angular termina de renderizar el componente de login
  // ENTONCES el elemento button[type="submit"] es visible en pantalla
  it('TC-003-AUTO | Boton Iniciar sesion es visible', () => {
    cy.get('button[type="submit"]').should('be.visible')
  })

  // TC-004-AUTO — Pagina cumple WCAG 2.1 AA
  // Categoria: Accesibilidad
  // DADO el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO cypress-axe evalua la pagina con reglas wcag2a y wcag2aa
  // ENTONCES no se detectan violaciones de accesibilidad de nivel A ni AA
  it('TC-004-AUTO | Pagina cumple WCAG 2.1 AA sin violaciones', () => {
    cy.injectAxe()
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    })
  })

  // TC-005-AUTO — Tab navega en orden logico RUT > password > boton
  // Categoria: UX (accesibilidad teclado)
  // PENDIENTE — requiere inspeccion del DOM real para confirmar orden de foco
  it.skip('TC-005-AUTO | Tab navega en orden logico RUT > password > boton', () => {
    cy.get('input[name="rut"]').focus()
    cy.realPress('Tab')
    cy.focused().should('have.attr', 'name', 'current-password')
    cy.realPress('Tab')
    cy.focused().should('have.attr', 'type', 'submit')
  })

})
