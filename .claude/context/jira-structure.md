# Jira Structure — QA-Engineer-Bupa Chile

| Campo | Detalle |
|-------|---------|
| **Proyecto** | QA-Engineer-Bupa Chile |
| **URL** | https://qaprocess1.atlassian.net/jira/software/projects/BUPA/boards/67 |
| **Tipo** | Scrum — Team-managed |
| **QA Lead** | Jaime Quiñelen Villar |

---

## Board — Columnas y Responsables

| # | Columna | Responsable | Descripcion |
|---|---------|-------------|-------------|
| 1 | BACKLOG | PO | Requerimiento identificado, sin SDD aun |
| 2 | SDD EN PROCESO | PO / DEV / QA | Documentando criterios de aceptacion con metodologia SDD |
| 3 | READY TO DEV | DEV | SDD aprobado, dev puede desarrollar |
| 4 | CODE REVIEW / PR | DEV / QA | Pull Request abierto — QA revisa criterios antes del merge |
| 5 | TEST UAT | QA | QA valida en ambiente UAT — E2E + casos manuales del Test Plan |
| 6 | TEST PRODUCCION | QA | Smoke test post-deploy — solo casos criticos |
| 7 | DONE | QA / TI | QA aprobado en PROD, ticket cerrado |

> QA no interviene en ambiente DEV. La validacion de QA comienza en TEST UAT.

---

## Piramide de Testing por Columna

| Columna | Capa | Quien | Como |
|---------|------|-------|------|
| CODE REVIEW / PR | 70% Unitarias + 20% Integracion | Dev + CI | GitHub Actions automatico al abrir PR |
| TEST UAT | 10% E2E + manual | QA | Cypress + Test Plan manual |
| TEST PRODUCCION | Smoke E2E | QA | Solo casos criticos (TC-X-A, B, C) |

---

## Issue Types

### Nativos Jira
| Tipo | Para que |
|------|---------|
| `Epic` | Agrupar por area de trabajo |
| `Story` | Cada requerimiento REQ-BUPA-XXX |
| `Bug` | Defectos encontrados en TEST UAT / TEST PRODUCCION |
| `Task` | Tareas QA sueltas que no son un REQ |
| `Subtask` | Subtareas dentro de una Story o Task |

### Xray
| Tipo | Para que |
|------|---------|
| `Test` | Cada caso de prueba TC-XXX-A, B, EC1... |
| `TestPlan` | Agrupa los Tests de un REQ por sprint |
| `TestExecution` | Ejecucion real de los Tests por ambiente (UAT / PROD) |

---

## Epics

| Epic | Contenido |
|------|-----------|
| `SDD y Documentacion` | Stories de cada REQ documentado con metodologia SDD |
| `Testing Manual UAT` | Ejecucion de Test Plans manuales en UAT |
| `Automatizacion Cypress` | Specs E2E automatizados por REQ |
| `Pipeline CI/CD` | Configuracion y mantenimiento del pipeline GitHub Actions |

---

## Estructura generica de un REQ en Jira con Xray

> Los Tests NO son hijos de la Story. Viven en el Test Repository de Xray y se
> vinculan a la Story via relacion de cobertura (coverage link). El board Scrum
> solo muestra Stories y Bugs — nunca Test cases como tarjetas.

```
[Board Scrum — unico issue type visible en el sprint]

Epic: [area correspondiente]
  └── Story: REQ-BUPA-XXX — [titulo del requerimiento]

Bug: BUG-XXX — [titulo del defecto]   ← aparece en board solo al crear desde un FAIL


[Xray Test Management — fuera del board]

Test Repository:
  TC-001-FP  ──► Story: REQ-BUPA-XXX
  TC-002-FP  ──► Story: REQ-BUPA-XXX
  TC-003-FP  ──► Story: REQ-BUPA-XXX
  TC-001-EC  ──► Story: REQ-BUPA-XXX
  TC-002-EC  ──► Story: REQ-BUPA-XXX
  TC-NNN-EC  ──► Story: REQ-BUPA-XXX

TestPlan: TP-REQXXX-SprintN
  ├── TestExecution: TE-UAT-NNN
  │     └── todos los casos FP + EC → PASS / FAIL
  └── TestExecution: TE-PROD-NNN
        └── solo casos FP → PASS / FAIL
```

## Regla de ambientes

| Ambiente | Casos a ejecutar | Responsable |
|----------|-----------------|-------------|
| UAT | Todos (principales + edge cases) | QA |
| PROD | Solo casos principales — smoke test | QA |

## Convencion de nombres

| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Story | `REQ-BUPA-XXX` | `REQ-BUPA-001` |
| Test Flujo Principal | `TC-NNN-FP` | `TC-001-FP, TC-002-FP...` |
| Test Edge Case | `TC-NNN-EC` | `TC-001-EC, TC-002-EC...` |
| TestPlan | `TP-REQXXX-SprintN` | `TP-REQ001-Sprint1` |
| TestExecution UAT | `TE-UAT-NNN` | `TE-UAT-001, TE-UAT-002...` |
| TestExecution PROD | `TE-PROD-NNN` | `TE-PROD-001, TE-PROD-002...` |
| Bug UAT | `BUG-XXX` + label `bug-uat` | `BUG-001` |
| Bug PROD | `BUG-XXX` + label `hotfix` | `BUG-002` |

> Numeracion FP y EC es independiente por REQ — cada requerimiento empieza desde TC-001-FP y TC-001-EC.
> TE-UAT y TE-PROD tienen numeracion global continua entre todos los REQs.

## Metricas por TestExecution

| Metrica | UAT | PROD |
|---------|-----|------|
| Tasa aprobacion | PASS / total × 100 | PASS / total × 100 |
| Tasa rechazo | FAIL / total × 100 | FAIL / total × 100 |
| Bugs generados | 1 por cada FAIL | 1 por cada FAIL critico |

---

## Flujo de un REQ de inicio a fin

```
1. PO crea Story en BACKLOG
2. QA Lead documenta SDD → mueve a SDD EN PROCESO
3. SDD aprobado → mueve a READY TO DEV
4. Dev desarrolla → abre PR → mueve a CODE REVIEW/PR
5. CI corre unit + integration tests automaticamente
6. PR aprobado → deploy a UAT
7. QA ejecuta Test Plan manual + Cypress → mueve a TEST UAT
8. UAT aprobado → deploy a PROD
9. QA ejecuta smoke test → mueve a TEST PRODUCCION
10. Todo verde → mueve a DONE
```

---

## Sprints

| Sprint | Contenido | Estado |
|--------|-----------|--------|
| BUPA Sprint 1 | REQs del sprint actual | Activo |
| BUPA Sprint N | Por definir al inicio de cada sprint | Pendiente |

---

## Gestion de Bugs por Ambiente

| Campo | Bug en UAT | Bug en PROD |
|-------|-----------|-------------|
| **Tipo** | `Bug` | `Bug` |
| **Ambiente** | UAT | PROD |
| **Severidad** | Alta / Media / Baja | Critica / Alta |
| **Prioridad** | Normal | Urgente |
| **Label** | `bug-uat` | `bug-prod` / `hotfix` |

> La etiqueta `hotfix` se usa solo cuando el bug aparece en PROD, afecta pacientes en ese momento y requiere fix inmediato sin esperar el sprint.

### Flujo de correccion por ambiente

```
Bug UAT
  └── DEV corrige → PR → CI → re-deploy UAT → QA re-ejecuta el test

Bug PROD (hotfix)
  └── DEV corrige URGENTE → PR express → CI → deploy PROD directo
        └── QA valida smoke test en PROD inmediatamente
```

---

## Campos Personalizados (por configurar)

| Campo | Tipo | Valores |
|-------|------|---------|
| `Ambiente` | Dropdown | DEV / UAT / PROD |
| `Spec file` | Texto | nombre del archivo .cy.ts |
| `SDD` | URL | link al archivo SDD en el repo |
