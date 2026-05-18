# Jira + Xray — Guia de Referencia QA

Referencia practica y generica para gestionar requerimientos, bugs y casos de prueba
con Jira y Xray. Aplica a cualquier proyecto independiente del stack o empresa.

---

## 1. Tipos de Issue — cuándo usar cada uno

| Tipo | Cuando usarlo | Quien lo crea |
|------|--------------|---------------|
| **Epic** | Agrupa un conjunto de Stories bajo un REQ o modulo | QA Lead / PO |
| **Story** | Un requerimiento funcional que avanza por el board | PO / QA Lead |
| **Bug** | Defecto encontrado en UAT o PROD | QA |
| **Task** | Trabajo tecnico sin valor funcional directo (setup, configuracion) | Dev / QA |
| **Sub-task** | Division de una Story o Task en partes menores | Dev / QA |
| **Test (Xray)** | Caso de prueba manual o automatizado | QA |
| **TestPlan (Xray)** | Agrupa TestExecutions de un sprint o release | QA Lead |
| **TestExecution (Xray)** | Ejecucion concreta de un conjunto de Tests | QA |

---

## 2. Estructura del Board + Xray

```
JIRA BOARD (sprint activo)
  Epic: REQ-XXX — titulo del modulo
    └── Story: REQ-XXX — titulo del requerimiento   ← avanza por columnas del board
          └── Bug: BUG-NNN — titulo del defecto      ← hijo de la Story si es de UAT

XRAY TEST REPOSITORY (fuera del board)
  Carpeta REQ-XXX
    ├── TC-001-FP  titulo flujo principal
    ├── TC-002-FP  titulo flujo principal
    ├── TC-001-EC  titulo edge case
    └── TC-002-EC  titulo edge case

XRAY TEST PLAN
  TP-REQXXX-SprintN
    ├── TE-UAT-NNN  → todos los casos FP + EC
    └── TE-PROD-NNN → solo casos FP (smoke)
```

**Reglas de estructura:**
- Los Tests de Xray NO son hijos de la Story — se vinculan via coverage link
- El board Scrum muestra Stories y Bugs — nunca Tests como tarjetas
- FP y EC tienen numeracion independiente por REQ (cada REQ empieza desde TC-001)
- TE-UAT y TE-PROD tienen numeracion global continua entre todos los REQs
- QA valida solo en UAT y PROD — testing en DEV es responsabilidad del equipo Dev

---

## 3. Convencion de nombres

| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Epic | `REQ-XXX titulo del modulo` | `REQ-001 Carga del portal` |
| Story | `REQ-XXX titulo del requerimiento` | `REQ-001 Verificacion de carga` |
| Test FP | `TC-NNN-FP titulo` | `TC-001-FP Portal carga correctamente` |
| Test EC | `TC-NNN-EC titulo` | `TC-001-EC Servidor caido` |
| TestPlan | `TP-REQXXX-SprintN` | `TP-REQ001-Sprint1` |
| TE UAT | `TE-UAT-NNN` | `TE-UAT-001` |
| TE PROD | `TE-PROD-NNN` | `TE-PROD-001` |
| Bug UAT | titulo descriptivo + label `bug-uat` | `Login falla con RUT valido` |
| Bug PROD | titulo descriptivo + label `hotfix` | `Portal no carga en Safari` |

---

## 4. Priority vs Severity

Son dos campos distintos. No confundirlos.

| Campo | Define | Quien lo asigna | Valores |
|-------|--------|-----------------|---------|
| **Severity** | Impacto tecnico del bug en el sistema | QA | Critica, Alta, Media, Baja |
| **Priority** | Urgencia de negocio para resolverlo | PO / QA Lead | Highest, High, Medium, Low |

**Ejemplo:**
- Un bug cosmético en la pagina de inicio de PROD puede ser **Severity: Baja** pero **Priority: High** si hay una campaña de marketing activa.
- Un bug critico en un modulo que nadie usa puede ser **Severity: Critica** pero **Priority: Low**.

### Severity — criterios

| Severity | Criterio |
|----------|----------|
| **Critica** | Sistema caido o inutilizable — usuarios sin acceso a funciones core |
| **Alta** | Funcionalidad principal rota — bloquea el flujo del usuario, sin workaround |
| **Media** | Funcionalidad degradada — existe workaround disponible |
| **Baja** | Problema menor — cosmético, tipografico, de baja frecuencia |

---

## 5. Campos obligatorios al crear un Bug

```
Titulo        : [Ambiente] Descripcion corta del problema
                Ejemplo: [UAT] Login falla al ingresar RUT con puntos

Tipo          : Bug
Severity      : Critica / Alta / Media / Baja
Priority      : Highest / High / Medium / Low
Ambiente      : UAT / PROD
Label         : bug-uat  o  hotfix (si es PROD critico)
REQ vinculado : link "is caused by" → Story del REQ

Descripcion:
  Precondiciones: estado del sistema antes de reproducir
  Pasos para reproducir:
    1. Ir a /ruta
    2. Hacer X
    3. Ver Y
  Resultado actual:   que ocurre
  Resultado esperado: que deberia ocurrir
  Criterio afectado:  TC-NNN-FP / TC-NNN-EC

Adjuntos:
  - Screenshot del error
  - Video si el bug es intermitente
  - Log de consola si hay error JS
```

---

## 6. Vincular Issues

| Tipo de link | Cuando usarlo |
|-------------|---------------|
| `covers` | Test → Story (Xray lo crea automaticamente al linkear) |
| `is caused by` | Bug → Story del REQ donde se encontro |
| `blocks` | Issue A bloquea el avance de Issue B |
| `is blocked by` | Issue A no puede avanzar hasta que B se resuelva |
| `relates to` | Relacion informativa sin dependencia directa |
| `duplicates` | Bug ya fue reportado — cerrar el duplicado |
| `clones` | Copiar un issue a otro proyecto o sprint |

---

## 7. Labels comunes

| Label | Cuando aplicarlo |
|-------|-----------------|
| `bug-uat` | Bug encontrado en ambiente UAT |
| `hotfix` | Bug critico en PROD que requiere atencion inmediata |
| `regression` | Bug que era funcional y dejo de funcionar |
| `blocker` | Bug que impide ejecutar otros casos de prueba |
| `accessibility` | Violacion de WCAG / accesibilidad |
| `performance` | Problema de tiempo de carga o respuesta |
| `security` | Vulnerabilidad o problema de seguridad |
| `flaky` | Test intermitente — pasa y falla sin cambios de codigo |

---

## 8. Columnas del Board — transiciones

| Columna | Significado | Quien mueve |
|---------|-------------|-------------|
| `BACKLOG` | REQ identificado, sin iniciar | PO |
| `SDD EN PROCESO` | QA documentando el SDD | QA Lead |
| `READY TO DEV` | SDD completo, DoR cumplido | QA Lead |
| `CODE REVIEW / PR` | Dev termino, PR abierto | Dev |
| `TEST UAT` | PR aprobado, deploy en UAT listo | Dev / QA |
| `TEST PRODUCCION` | UAT completo, deploy en PROD | QA Lead |
| `DONE` | DoD cumplido, smoke PROD en PASS | QA Lead |

> Solo QA Lead mueve tickets a DONE. Nunca Dev ni PO.

---

## 9. Xray — Crear un Test

1. Jira → Crear issue → Tipo: **Test**
2. Rellenar:
   - **Titulo:** `TC-NNN-FP titulo` o `TC-NNN-EC titulo`
   - **Test Type:** Manual (al inicio) / Automated (cuando el spec CI este verde)
   - **Carpeta:** asignar a la carpeta del REQ correspondiente
3. En la descripcion agregar el caso en formato DADO/CUANDO/ENTONCES:
   ```
   DADO    contexto inicial
   CUANDO  accion del usuario
   ENTONCES resultado esperado
   ```
4. Agregar steps manuales si el tipo es Manual
5. Linkear al Story: `covers` → Story del REQ

---

## 10. Xray — Crear TestPlan y TestExecution

### TestPlan
1. Crear issue → Tipo: **Test Plan**
2. Nombre: `TP-REQXXX-SprintN`
3. Agregar los Tests del REQ al plan

### TestExecution
1. Crear issue → Tipo: **Test Execution**
2. Nombre: `TE-UAT-NNN` o `TE-PROD-NNN`
3. Asignar ambiente: `UAT` o `PROD`
4. Vincular al TestPlan
5. Agregar los Tests a ejecutar:
   - UAT: todos los casos FP + EC
   - PROD: solo casos FP (smoke test)

### Ejecutar y registrar resultados
1. Abrir TestExecution → ver lista de Tests
2. Por cada Test: marcar `PASS`, `FAIL` o `BLOCKED`
3. Si `FAIL`: adjuntar screenshot + crear Bug vinculado
4. Al terminar: el TestExecution muestra % de aprobacion automaticamente

---

## 11. JQL — Consultas utiles

```jql
-- Todos los bugs abiertos del proyecto
project = "MI-PROYECTO" AND issuetype = Bug AND statusCategory != Done

-- Bugs criticos o altos sin asignar
project = "MI-PROYECTO" AND issuetype = Bug
  AND priority in (Highest, High) AND assignee is EMPTY

-- Issues del sprint activo
project = "MI-PROYECTO" AND sprint in openSprints()

-- Bugs en PROD (hotfix)
project = "MI-PROYECTO" AND issuetype = Bug AND labels = hotfix

-- Stories sin SDD (en backlog)
project = "MI-PROYECTO" AND issuetype = Story AND status = Backlog

-- Issues creados esta semana
project = "MI-PROYECTO" AND created >= startOfWeek()

-- Bugs encontrados en UAT esta semana
project = "MI-PROYECTO" AND issuetype = Bug
  AND labels = bug-uat AND created >= startOfWeek()

-- Tests de un REQ especifico (Xray)
project = "MI-PROYECTO" AND issuetype = Test
  AND summary ~ "REQ-001"

-- Issues bloqueados
project = "MI-PROYECTO" AND issueFunction in linkedIssuesOf("", "is blocked by")
```

---

## 12. Evidencia y adjuntos en Bugs

**Que adjuntar siempre:**
- Screenshot del error con el estado de la pantalla
- URL completa donde ocurrio el error (visible en el screenshot o en el campo)
- Navegador y version si es un bug visual

**Que adjuntar segun el caso:**
- Video si el bug es intermitente o dificil de reproducir
- Log de consola del browser (F12 → Console) si hay error JS
- Request/Response de la API si es un bug de datos (F12 → Network)
- Comparacion antes/despues si es una regresion

**Nombrar los adjuntos:**
```
BUG-NNN_screenshot_descripcion.png
BUG-NNN_video_reproduccion.mp4
BUG-NNN_console_error.txt
```

---

## 13. Ciclo de vida de un Bug

```
QA encuentra defecto en UAT o PROD
  └── QA crea Bug con todos los campos → estado: OPEN
        └── QA Lead asigna al Dev responsable → estado: IN PROGRESS
              └── Dev corrige y hace PR
                    └── QA re-ejecuta el caso afectado
                          ├── PASS → Bug → estado: RESOLVED → QA cierra → DONE
                          └── FAIL → Bug sigue OPEN → Dev vuelve a corregir
```

**Flujo por ambiente:**
```
Bug UAT
  └── Dev corrige → PR → CI → re-deploy UAT → QA re-ejecuta el test

Bug PROD (hotfix)
  └── Dev corrige URGENTE → PR express → CI → deploy PROD directo
        └── QA valida smoke test en PROD inmediatamente
```

**Regla de reapertura:**
- Si un bug DONE vuelve a aparecer → NO crear uno nuevo
- Reabrir el bug original y agregar comentario con nueva evidencia
- Agregar label `regression`

---

## 14. Piramide de Testing por Columna del Board

| Columna | Capa | Quien | Como |
|---------|------|-------|------|
| CODE REVIEW / PR | 70% Unitarias + 20% Integracion | Dev + CI | GitHub Actions automatico al abrir PR |
| TEST UAT | 10% E2E + manual | QA | Cypress + Test Plan manual |
| TEST PRODUCCION | Smoke E2E | QA | Solo casos criticos (FP) |

> QA no interviene en DEV. La validacion de QA comienza en TEST UAT.

---

## 15. Epics recomendados por tipo de trabajo

| Epic | Contenido |
|------|-----------|
| `SDD y Documentacion` | Stories de cada REQ documentado con metodologia SDD |
| `Testing Manual UAT` | Ejecucion de Test Plans manuales en UAT |
| `Automatizacion E2E` | Specs Cypress automatizados por REQ |
| `Pipeline CI/CD` | Configuracion y mantenimiento del pipeline |
| `Bugs y Defectos` | Tracking de bugs encontrados en UAT y PROD |

---

## 16. Metricas por TestExecution

| Metrica | UAT | PROD |
|---------|-----|------|
| Tasa aprobacion | PASS / total × 100 | PASS / total × 100 |
| Tasa rechazo | FAIL / total × 100 | FAIL / total × 100 |
| Bugs generados | 1 por cada FAIL | 1 por cada FAIL critico |

---

## 17. Campos personalizados recomendados

| Campo | Tipo | Valores |
|-------|------|---------|
| `Ambiente` | Dropdown | DEV / UAT / PROD |
| `Spec file` | Texto | nombre del archivo .cy.js |
| `SDD` | URL | link al archivo SDD en el repositorio |
| `Severidad` | Dropdown | Critica / Alta / Media / Baja |
