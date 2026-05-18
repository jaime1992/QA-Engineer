# Sprint 1 — Estado Activo

| Campo | Detalle |
|-------|---------|
| **Periodo** | 17 May - 28 May 2026 |
| **Estado** | En curso |
| **Proyecto Jira** | QA-Engineer-Bupa Chile (key: BUPA) |

---

## Jira — Gestion

- Board configurado: BACKLOG → SDD EN PROCESO → READY TO DEV → CODE REVIEW/PR → TEST UAT → TEST PRODUCCION → DONE
- BUPA-1: Epic REQ-BUPA-001
- BUPA-2: Story REQ-BUPA-001 Verificacion de carga del Portal Pacientes → SDD EN PROCESO
- BUPA-3: Epic REQ-BUPA-002
- BUPA-4: Story REQ-BUPA-002 Visibilidad y accesibilidad del formulario de login → SDD EN PROCESO

---

## Xray — Testing Board

- Issue Types Mapping configurado: Test, TestPlan, TestExecution
- Carpetas creadas: REQ-BUPA-001, REQ-BUPA-002
- Pendiente: cargar casos de prueba con nomenclatura TC-001-FP, TC-001-EC

---

## Cypress — Automatizacion E2E

- Proyecto inicializado: npm + Cypress 15 + cypress-axe
- cypress.config.js configurado con 3 ambientes: DEV, UAT, PROD
- Specs creados:
  - `cypress/e2e/Bupa-smoke_test.cy.js` — TC-001-FP al TC-003-FP
  - `cypress/e2e/Bupa-mobile-smoke_test.cy.js` — TC-004-EC mobile 375px
- Pipeline email funcionando: Cypress → email-server:3025 → Gmail
- Pendiente: implementar casos restantes del REQ-001 y REQ-002

---

## Infraestructura

- email-server.js corriendo con pm2 en puerto 3025
- n8n corriendo en localhost:5678 (WF-1.1 exportado en workflows/)
- Reporte HTML por Gmail al terminar cada ejecucion Cypress

---

## REQs del sprint

| REQ | Titulo | Estado |
|-----|--------|--------|
| REQ-BUPA-001 | Verificacion de carga del Portal Pacientes | SDD documentado — tests pendientes |
| REQ-BUPA-002 | Visibilidad y accesibilidad del formulario de login | SDD documentado — tests pendientes |
