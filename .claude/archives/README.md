# Archives — QA-Engineer BUPA Chile

Documentos historicos y sprints cerrados. No se editan, solo se consultan.

## Convencion de nombres
`YYYY-MM-sprint-N-nombre.md`

---

## Sprint 1 — BUPA Portal Pacientes
**Periodo:** 17 May - 28 May 2026
**Estado:** En curso

### Que se esta trabajando

**Jira — Gestion**
- Proyecto creado: QA-Engineer-Bupa Chile (key: BUPA)
- Board configurado con columnas: BACKLOG → SDD EN PROCESO → READY TO DEV → CODE REVIEW/PR → TEST UAT → TEST PRODUCCION → DONE
- BUPA-1: Epic REQ-BUPA-001
- BUPA-2: Story REQ-BUPA-001 Verificacion de carga del Portal Pacientes → SDD EN PROCESO
- BUPA-3: Epic REQ-BUPA-002
- BUPA-4: Story REQ-BUPA-002 Visibilidad y accesibilidad del formulario de login → SDD EN PROCESO

**Xray — Testing Board**
- Issue Types Mapping configurado: Test, TestPlan, TestExecution
- Carpetas creadas: REQ-BUPA-001, REQ-BUPA-002
- Pendiente: cargar casos de prueba con nueva nomenclatura (TC-001-FP, TC-001-EC)

**Cypress — Automatizacion E2E**
- Proyecto inicializado: npm + Cypress 15 + cypress-axe
- cypress.config.js configurado con 3 ambientes: DEV, UAT, PROD
- Spec creado: `cypress/e2e/Bupa-smoke_test.cy.js`
- Pipeline email funcionando: Cypress → email-server:3025 → Gmail
- Pendiente: implementar los 7 casos del REQ-001 con nomenclatura TC-FP/TC-EC

**Infraestructura**
- email-server.js corriendo con pm2 en puerto 3025
- n8n corriendo en localhost:5678 (WF-1.1 exportado en workflows/)
- Reporte HTML por Gmail al terminar cada ejecucion Cypress

### REQs del sprint

| REQ | Titulo | Estado |
|-----|--------|--------|
| REQ-BUPA-001 | Verificacion de carga del Portal Pacientes | SDD documentado — tests pendientes |
| REQ-BUPA-002 | Visibilidad y accesibilidad del formulario de login | SDD documentado — tests pendientes |
