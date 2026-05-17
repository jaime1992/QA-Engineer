# Jira + Xray — Portal Pacientes BUPA

| Campo | Detalle |
|-------|---------|
| **Instancia** | https://qaprocess1.atlassian.net |
| **Proyecto** | BUPA |
| **Board** | https://qaprocess1.atlassian.net/jira/software/projects/BUPA/boards/69 |
| **Email** | jaimeqv.2609@gmail.com |
| **Sprint activo** | Sprint 1 - Bupa (17 May - 28 May 2026) |

---

## Issues actuales en Jira

| Key | Tipo | Titulo | Estado |
|-----|------|--------|--------|
| BUPA-1 | Epic | REQ-BUPA-001 | Backlog |
| BUPA-2 | Story | REQ-BUPA-001 Verificacion de carga del Portal Pacientes | SDD EN PROCESO |
| BUPA-3 | Epic | REQ-BUPA-002 | Backlog |
| BUPA-4 | Story | REQ-BUPA-002 Visibilidad y accesibilidad del formulario de login | SDD EN PROCESO |

---

## Estado Xray

> ⚠️ Xray esta caido desde 2026-05-17 — pendiente respuesta del soporte.
> Los casos de prueba NO han sido cargados al Testing Board aun.
> Una vez que Xray vuelva, cargar segun la estructura y nomenclatura definida en `jira-structure.md`.

**Pendiente cuando Xray vuelva:**
- Crear 7 Tests en carpeta REQ-BUPA-001 (TC-001-FP al TC-003-FP + TC-001-EC al TC-004-EC)
- Crear 8 Tests en carpeta REQ-BUPA-002 (TC-001-FP al TC-005-FP + TC-001-EC al TC-003-EC)
- Crear TestPlan: TP-REQ001-Sprint1
- Crear TestExecution UAT: TE-UAT-001 (todos los casos)
- Crear TestExecution PROD: TE-PROD-001 (solo FP)

---

## Estructura correcta (vigente desde 2026-05-17)

```
JIRA BOARD (sprint activo)
  Epic: REQ-BUPA-XXX
    └── Story: REQ-BUPA-XXX — titulo    ← avanza por columnas del board

XRAY TEST REPOSITORY (fuera del board)
  Carpeta REQ-BUPA-XXX
    ├── TC-001-FP  titulo flujo principal
    ├── TC-002-FP  titulo flujo principal
    ├── TC-001-EC  titulo edge case
    └── TC-002-EC  titulo edge case

XRAY TEST PLAN
  TP-REQXXX-SprintN
    ├── TE-UAT-NNN  → todos los casos FP + EC
    └── TE-PROD-NNN → solo casos FP (smoke)
```

---

## Convencion de nombres vigente

| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Story | `REQ-BUPA-XXX titulo` | `REQ-BUPA-001 Verificacion de carga` |
| Test FP | `TC-NNN-FP titulo` | `TC-001-FP Portal carga correctamente` |
| Test EC | `TC-NNN-EC titulo` | `TC-001-EC Servidor caido` |
| TestPlan | `TP-REQXXX-SprintN` | `TP-REQ001-Sprint1` |
| TE UAT | `TE-UAT-NNN` | `TE-UAT-001` |
| TE PROD | `TE-PROD-NNN` | `TE-PROD-001` |
| Bug UAT | `BUG-XXX` + label `bug-uat` | `BUG-001` |
| Bug PROD | `BUG-XXX` + label `hotfix` | `BUG-002` |

---

## Reglas operativas

- Los Tests de Xray NO son hijos de la Story — se vinculan via coverage link
- El board Scrum solo muestra Stories y Bugs — nunca Tests como tarjetas
- FP y EC tienen numeracion independiente por REQ (cada REQ empieza desde 001)
- TE-UAT y TE-PROD tienen numeracion global continua entre todos los REQs
- QA valida solo en UAT y PROD — DEV es responsabilidad del equipo Dev
