/// <reference types="cypress" />

// REQ-BUPA-001 — Verificacion de carga del Portal Pacientes BUPA (Mobile)
// Spec: Bupa-mobile-smoke_test.cy.js
// Criterios automatizados: TC-004-EC
// URL bajo prueba: https://portalpaciente.bupa.cl/inicio
// Viewport: 375x812 (iPhone SE / mobile estandar)

describe('REQ-BUPA-001 | Mobile (375px) — Edge Cases', () => {

  beforeEach(() => {
    cy.viewport(375, 812)
  })

  // TC-004-EC — Sin scroll horizontal en mobile
  // Categoria: UX + Frontend
  // DADO    el paciente accede al portal desde un dispositivo mobile (375px)
  // CUANDO  la pagina termina de cargar
  // ENTONCES no existe scroll horizontal (sin overflow lateral)
  it('TC-004-EC | Sin scroll horizontal en mobile (375px)', () => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
    cy.get('body').should('be.visible')
    cy.window().then((win) => {
      expect(win.document.documentElement.scrollWidth).to.be.lte(375)
    })
  })

})
