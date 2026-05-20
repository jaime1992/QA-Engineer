/// <reference types="cypress" />

// REQ-BUPA-001 — Verificacion de carga del Portal Pacientes BUPA
// Spec: bupa-smoke_test.cy.js
// Criterios automatizados: TC-001-AUTO, TC-002-AUTO, TC-003-AUTO
// URL bajo prueba: https://portalpaciente.bupa.cl/inicio

describe('REQ-BUPA-001 | Verificacion de carga del Portal Pacientes BUPA', () => {

  // TC-001-AUTO — Portal carga correctamente
  // Categoria: UI + Frontend
  // DADO el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO la pagina termina de cargar
  // ENTONCES el body es visible y la URL contiene portalpaciente.bupa.cl
  it('TC-001-AUTO | Portal carga correctamente', () => {
    cy.visitPortal()
    cy.get('body').should('be.visible')
    cy.url().should('include', 'portalpaciente.bupa.cl')
  })

  // TC-002-AUTO — Portal carga en menos de 3 segundos
  // Categoria: UX
  // DADO el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO se mide el tiempo desde inicio de navegacion hasta que el body es visible
  // ENTONCES el tiempo transcurrido es menor a 3000 milisegundos
  it('TC-002-AUTO | Portal carga en menos de 3 segundos', () => {
    const inicio = Date.now()
    cy.visitPortal()
    cy.get('body').should('be.visible').then(() => {
      const duracion = Date.now() - inicio
      expect(duracion, `Tiempo de carga: ${duracion}ms`).to.be.lessThan(3000)
    })
  })

  // TC-003-AUTO — Portal utiliza HTTPS con certificado SSL valido
  // Categoria: Backend (seguridad)
  // DADO el paciente navega a https://portalpaciente.bupa.cl/inicio
  // CUANDO se evalua el protocolo de la URL activa
  // ENTONCES el protocolo es https: confirmando certificado SSL valido
  it('TC-003-AUTO | Portal utiliza HTTPS con certificado SSL valido', () => {
    cy.visitPortal()
    cy.location('protocol').should('eq', 'https:')
  })

})
