// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('visitPortal', () => {
  cy.visit('https://portalpaciente.bupa.cl/inicio')
})

// Flujo de login de dos pasos con credenciales validas desde fixture
// Uso: cy.loginBupa()
// Credenciales en cypress/fixtures/auth/credenciales-validas.json (gitignored)
Cypress.Commands.add('loginBupa', () => {
  cy.fixture('auth/credenciales-validas').then((creds) => {
    cy.get('input[name="rut"]').type(creds.rut)
    cy.get('button[type="submit"]').first().click()
    cy.get('input[name="current-password"]', { timeout: 10000 }).should('be.visible')
    cy.get('input[name="current-password"]').type(creds.password, { log: false })
    cy.get('button[type="submit"]').last().click()
  })
})