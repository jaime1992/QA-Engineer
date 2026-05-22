# Plan de Pruebas Automatizadas — Portal Paciente
# Módulo Inicio — Dashboard Post-Login

| Campo | Detalle |
|-------|---------|
| **Célula** | Portal Pacientes |
| **Módulo** | Inicio (Dashboard post-login) |
| **URL** | https://portalpaciente.bupa.cl/inicio |
| **Autor** | Jaime Quiñelen Villar — QA Lead |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-22 |
| **Plan manual asociado** | `TestPlan_PortalPacientes.md` |
| **Herramientas** | Cypress, Playwright, Newman |
| **Pipeline** | GitHub Actions |

---

## Resumen Ejecutivo

| Métrica | Valor |
|---|---|
| **TCs manuales del módulo** | 26 (21 FP + 5 EC) |
| **TCs automatizables** | 15 |
| **TCs no automatizables** | 11 |
| **TCs automatizados actualmente** | 6 |
| **Cobertura de automatización actual** | 23% (6/26) |
| **Cobertura objetivo** | 58% (15/26) |
| **Herramienta principal E2E** | Cypress + Playwright |
| **Trigger del pipeline** | PR hacia main + merge a main |

---

## 1. Objetivo

Automatizar los casos de prueba del módulo Inicio del Portal Paciente que aporten mayor valor en la detección temprana de regresiones, ejecutándose en el pipeline CI/CD de GitHub Actions en cada PR y merge a main.

---

## 2. Criterio de Automatizacion

### Automatizar cuando

- El TC es parte del flujo crítico (severidad Critical o High)
- El TC se ejecuta en cada release (repetible)
- El comportamiento es determinístico — mismo input, mismo output
- El elemento tiene selector estable (`data-testid`, `name`, `type`)

### No automatizar cuando

- Requiere validación visual subjetiva (diseño, íconos, colores)
- Depende de datos dinámicos sin fixture controlable (nombre del usuario real)
- Requiere interacción humana (sesión expirada por inactividad real)
- El selector es inestable (clases generadas por Angular Material)

---

## 3. Herramientas y Responsabilidades

| Herramienta | Capa | Qué automatiza | Trigger |
|---|---|---|---|
| **Cypress** | E2E / UI | Flujos completos post-login, navegacion de menu, tarjetas | PR + merge |
| **Playwright** | E2E / UI | Mismos flujos en paralelo — aprendizaje y cobertura cruzada | PR + merge |
| **Newman** | API | Health check, endpoints del backend antes de correr E2E | Previo a E2E |

---

## 4. Tabla de Cobertura de Automatizacion

| TC-ID Manual | Título | Automatizable | Herramienta | Spec File | Estado AUTO | Motivo no automatizable |
|---|---|---|---|---|---|---|
| TC-001-FP | Logo Mi Portal Bupa visible | No | — | — | — | Validación visual subjetiva — diseño y colores |
| TC-002-FP | Nombre de usuario en header | Parcial | Cypress | `REQ-dashboard.cy.js` | Pendiente | Requiere fixture con nombre controlado |
| TC-003-FP | Botón "Cerrar sesión" visible y funcional | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-004-FP | Menú "Inicio" activo al cargar | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-005-FP | Saludo personalizado visible | Parcial | Cypress | `REQ-dashboard.cy.js` | Pendiente | Nombre dinamico — validar que no este vacio |
| TC-006-FP | Texto "¿Qué tipo de atención necesitas?" visible | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-007-FP | Tarjeta "Telemedicina" visible y clicable | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-008-FP | Tarjeta "Consulta Médica" visible y clicable | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-009-FP | Tarjeta "Consulta Dental" visible y clicable | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-010-FP | Tarjeta "Exámenes" visible y clicable | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-011-FP | Acceso rápido "Próximas citas" | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-012-FP | Acceso rápido "Mis exámenes" | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-013-FP | Acceso rápido "Historial de citas" | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-014-FP | Sección "¿Necesitas Cotizar tu Cirugía?" visible | **Sí** | Cypress | `REQ-dashboard.cy.js` | Pendiente | |
| TC-015-FP | Navegación a "Mis citas" | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-016-FP | Navegación a "Historial de atenciones" | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-017-FP | Navegación a "Mis exámenes" | **Sí** | Cypress + Playwright | `REQ-dashboard.cy.js` | Pendiente | |
| TC-018-FP | Navegación a "Mi familia" | **Sí** | Cypress | `REQ-dashboard.cy.js` | Pendiente | |
| TC-019-FP | Navegación a "Planes y Beneficios" | **Sí** | Cypress | `REQ-dashboard.cy.js` | Pendiente | |
| TC-020-FP | Navegación a "Mi perfil" | **Sí** | Cypress | `REQ-dashboard.cy.js` | Pendiente | |
| TC-021-FP | Navegación a "Centro de ayuda" | **Sí** | Cypress | `REQ-dashboard.cy.js` | Pendiente | |
| TC-001-EC | Cerrar sesión y presionar "atrás" | **Sí** | Cypress | `REQ-dashboard.cy.js` | Pendiente | |
| TC-002-EC | Sesión expirada — recarga de página | No | — | — | — | Requiere inactividad real — no simulable sin manipular el token |
| TC-003-EC | Nombre de usuario muy largo | No | — | — | — | Requiere usuario especifico en el sistema — no hay fixture |
| TC-004-EC | Responsive tablet (768px) | **Sí** | Cypress | `REQ-dashboard.cy.js` | Pendiente | |
| TC-005-EC | Responsive móvil (375px) | **Sí** | Cypress | `REQ-dashboard.cy.js` | Pendiente | |

---

## 5. TCs Automatizados Actualmente (fuera del modulo Inicio)

Specs existentes que cubren el flujo previo al dashboard:

| Spec File | Herramienta | TCs cubiertos | REQ asociado |
|---|---|---|---|
| `cypress/e2e/REQ-001-carga-portal.cy.js` | Cypress | TC-001, TC-002, TC-003 (carga, tiempo, HTTPS) | REQ-001 |
| `cypress/e2e/REQ-002-login-visibilidad.cy.js` | Cypress | TC-001 al TC-004 (RUT, password, boton, WCAG) | REQ-002 |
| `cypress/e2e/REQ-003-login-exitoso.cy.js` | Cypress | Login completo con credenciales validas | REQ-003 |
| `cypress/e2e/REQ-004-error-credenciales-invalidas.cy.js` | Cypress | Login con credenciales invalidas — error | REQ-004 |
| `playwright/e2e/REQ-001-carga-portal.spec.ts` | Playwright | TC-001, TC-002, TC-003 (carga, tiempo, HTTPS) | REQ-001 |
| `playwright/e2e/REQ-002-login-visibilidad.spec.ts` | Playwright | TC-001, TC-003, TC-004 (RUT, boton, WCAG) | REQ-002 |

**Cobertura actual sobre el modulo Inicio:** 0% — todos los specs existentes son pre-login.

---

## 6. Roadmap de Automatizacion

| Fase | Periodo | Meta | Spec a crear |
|---|---|---|---|
| **Fase 1** | Semana 1 (post 8-jun) | Automatizar flujo critico del dashboard | `REQ-dashboard-smoke.cy.js` con TC-003, TC-004, TC-006, TC-007, TC-008 |
| **Fase 2** | Semana 2 | Completar tarjetas y accesos rapidos | `REQ-dashboard.cy.js` con TC-009 al TC-013 |
| **Fase 3** | Semana 3 | Navegacion del menu y responsive | TC-014 al TC-021, TC-004-EC, TC-005-EC |
| **Fase 4** | Semana 4 | Incorporar Playwright para cobertura cruzada | `REQ-dashboard.spec.ts` equivalente |

---

## 7. Integracion con Pipeline CI/CD

```yaml
# GitHub Actions — flujo propuesto
jobs:
  smoke-pre-login:
    # REQ-001, REQ-002 — verifica que el portal carga y el login es visible
    run: npm run test:smoke

  e2e-login:
    # REQ-003, REQ-004 — verifica login exitoso y errores
    needs: smoke-pre-login
    run: npx cypress run --spec "cypress/e2e/REQ-003*,cypress/e2e/REQ-004*"

  e2e-dashboard:
    # Dashboard post-login — modulo Inicio
    needs: e2e-login
    run: npx cypress run --spec "cypress/e2e/REQ-dashboard*"
```

**Quality gate:** si cualquier stage falla, los stages siguientes no corren.

---

## 8. Criterios de Exito

| Criterio | Umbral |
|---|---|
| Pass rate pipeline en PR | >= 95% |
| Pass rate en merge a main | 100% TCs criticos |
| Tiempo maximo de ejecucion E2E | < 5 minutos |
| Cobertura de automatizacion objetivo | >= 58% (15/26 TCs) |
| Falsos positivos aceptados | 0 en TCs criticos |

---

## 9. Registro de Automatizacion

| TC-ID | Spec File | Herramienta | Fecha automatizacion | Resultado ultimo run | Observaciones |
|---|---|---|---|---|---|
| TC-001-FP (carga) | `REQ-001-carga-portal.cy.js` | Cypress | 2026-05-16 | PASS | Pre-login — fuera del modulo Inicio |
| TC-002-FP (carga) | `REQ-001-carga-portal.cy.js` | Cypress | 2026-05-16 | PASS | Pre-login |
| TC-003-FP (carga) | `REQ-001-carga-portal.cy.js` | Cypress | 2026-05-16 | PASS | Pre-login |
| TC-001-FP (carga) | `REQ-001-carga-portal.spec.ts` | Playwright | 2026-05-22 | PASS | Pre-login |
| TC-002-FP (carga) | `REQ-001-carga-portal.spec.ts` | Playwright | 2026-05-22 | PASS | Pre-login |
| TC-003-FP (carga) | `REQ-001-carga-portal.spec.ts` | Playwright | 2026-05-22 | PASS | Pre-login |

> Actualizar tras cada ejecucion manual del pipeline o sesion de automatizacion.
