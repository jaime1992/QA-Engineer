# QA Phases — Proceso Completo de 7 Fases
# QA Lead — BUPA Chile

| Campo | Detalle |
|-------|---------|
| **Autor** | Jaime Quiñelen Villar — QA Lead |
| **Metodologia** | SDD + Pipeline CI/CD + Automatizacion n8n |
| **Version** | v1.0 — Mayo 2026 |
| **Visual** | Ver `docs/qa-playbook.html` para version interactiva |

---

## Resumen del Flujo

```
FASE 1 — Requerimiento
   ↓
FASE 2 — Diseño de Pruebas
   ↓
FASE 3 — Desarrollo + Shift-Left
   ↓
FASE 4 — Pipeline CI/CD
   ↓
FASE 5 — Test UAT
   ↓
FASE 6 — Test Produccion
   ↓
FASE 7 — Cierre y Metricas
   ↓
(nuevo sprint — regresa a Fase 1)
```

---

## FASE 1 — Requerimiento

**Responsable:** QA Lead
**Herramientas:** Jira · n8n · Gmail

### Actividades

1. Recibe requerimiento de stakeholders o PM
2. Crea **Epic** y **Story** en Jira con descripcion funcional completa
3. Documenta el **SDD completo (9 secciones)** en la descripcion del ticket:
   - Objetivo del requerimiento
   - Alcance (que incluye y que NO incluye)
   - Actores involucrados
   - Flujos del usuario (principal y alternativos)
   - Criterios de aceptacion (formato DADO/CUANDO/ENTONCES)
   - Riesgos identificados
   - Datos de prueba necesarios
   - Entornos donde aplica
   - Restricciones tecnicas o de negocio
4. Activa el **workflow de generacion automatica del PDF del SDD** → notifica al equipo por email y mensajeria

### Artefactos Producidos

- `REQ-XXX-SDD.md` — documento SDD completo
- Jira Epic + Story con descripcion SDD
- PDF del SDD enviado al equipo

### Transicion del Board

```
BACKLOG → SDD EN PROCESO
```

---

## FASE 2 — Diseño de Pruebas

**Responsable:** QA Lead
**Herramientas:** Jira · Xray · Cypress (definicion de specs)

### Casos de Prueba

| Tipo | Codigo | Descripcion |
|------|--------|-------------|
| Happy Path | `TC-XXX-FP` | Flujo principal exitoso del requerimiento |
| Edge Case | `TC-XXX-EC` | Casos limite, errores y comportamientos alternativos |

### Plan de Pruebas Manuales

Casos que requieren intervencion humana o configuracion especial de ambiente:

- **Flujos principales** que necesitan validacion visual o de experiencia de usuario
- **Edge cases** que requieren configuracion de DevOps (servidor caido, throttling de red, estados simulados)

### Plan de Pruebas Automatizadas — Cypress

Casos deterministas y repetibles, ejecutables en CI/CD:

- Identifica los TCs automatizables
- Define **criterios PASS/FAIL explicitos** por TC antes de escribir el spec
- Ejemplos de criterios:
  - `PASS si body visible y URL contiene dominio esperado`
  - `PASS si 0 violaciones WCAG 2.1 A/AA`
  - `PASS si redirect automatico a https:`

### Carga en Xray

- Crea **TestPlan** por requerimiento
- Crea **TestExecution** por ambiente (UAT / PROD)
- Carga todos los TCs con criterios definidos

### Artefactos Producidos

- `REQ-XXX-Test-Plan.md` — plan de pruebas documentado
- TCs cargados en Xray (TestPlan + TestExecution)
- Matriz de cobertura REQ vs TC

### Transicion del Board

```
SDD EN PROCESO → READY TO DEV
```

---

## FASE 3 — Desarrollo + Shift-Left

**Responsable:** Dev Team implementa — QA Lead revisa cobertura
**Herramientas:** GitHub · Jira

### Rol del QA Lead

El QA Lead **no escribe codigo** pero revisa que las pruebas unitarias del equipo de desarrollo cubran los flujos definidos en el SDD antes de permitir el Code Review.

### Revision por Categoria (Shift-Left)

| Categoria | Que verifica el QA Lead |
|-----------|------------------------|
| **UX** | ¿Tests cubren flujos de navegacion del usuario? ¿Secuencias de interaccion (Tab, focus)? |
| **UI** | ¿Tests de render de componentes visuales? ¿Atributos ARIA y contraste? |
| **Frontend** | ¿Bootstrap correcto del framework? ¿Logica de componentes y validaciones? |
| **Backend** | ¿Respuesta API y contratos? ¿Seguridad (SSL, HTTPS, redirect)? |

### Flujo de Aprobacion

1. Dev implementa funcionalidad + escribe unit tests
2. QA Lead revisa cobertura por las 4 categorias
3. Si la cobertura es insuficiente → solicita mas tests antes de avanzar
4. QA aprueba → Code Review → PR abierto → **pipeline se activa automaticamente**

### Transicion del Board

```
READY TO DEV → CODE REVIEW/PR
```

---

## FASE 4 — Pipeline CI/CD

**Responsable:** GitHub Actions (automatico)
**Herramientas:** GitHub Actions · Cypress · n8n
**Trigger:** push o PR hacia ramas principales (`main`, `develop`)

### Stages del Pipeline

| Stage | Descripcion | Herramienta |
|-------|-------------|-------------|
| Stage 1 | Instalacion de dependencias | `npm ci` |
| Stage 2 | Analisis estatico de codigo (linting) | ESLint |
| Stage 3 | E2E Smoke Tests — flujo principal por REQ | Cypress |
| Stage 4 | E2E Flujos Criticos — casos de mayor riesgo | Cypress |
| Stage 5 | E2E Mobile — viewport reducido (solo develop) | Cypress |
| Stage 6 | Notificacion del resultado al sistema de workflows | n8n webhook |
| Stage 7 | Reporte de resultados | GitHub Step Summary |

### Resultado del Pipeline

```
FALLO  → Workflow de alertas → email + mensajeria + bug en Jira (prioridad maxima)
EXITO  → Notificacion de resultado → continua a Fase 5 (Test UAT)
```

### Artefactos Generados

- Screenshots de fallos (retencion: 7 dias)
- Videos de ejecucion (retencion: 3 dias)
- GitHub Step Summary con tabla de resultados

---

## FASE 5 — Test UAT

**Responsable:** QA Lead
**Ambiente:** Staging
**Herramientas:** Cypress · Xray · n8n · Jira

### Pruebas Manuales por Categoria

| Categoria | Que valida el QA Lead |
|-----------|----------------------|
| **UX** | Exploracion de flujos, estados vacios, usabilidad general |
| **UI** | Revision visual vs diseño de referencia (Figma u otro) |
| **Frontend** | Validaciones en navegador, comportamiento del framework |
| **Backend** | Validacion de API, contratos y seguridad SSL |

Resultado manual → registra en Xray → **workflow de estado diario** notifica al equipo a las 6pm

### Pruebas Automatizadas — Cypress

| Tipo | Spec | Reporte |
|------|------|---------|
| Smoke Tests | Flujo principal por REQ | Reporte HTML → email automatico |
| Flujos Criticos | Casos de mayor riesgo | Alerta inmediata si falla → Jira + email + mensajeria |
| Mobile | Viewport reducido | Reporte HTML → email automatico |

### Resultado

```
BUG ENCONTRADO → abre defecto en Jira → proceso regresa a Fase 3
APROBADO       → avanza a Fase 6 (Test Produccion)
```

### Transicion del Board

```
CODE REVIEW/PR → TEST UAT
```

---

## FASE 6 — Test Produccion

**Responsable:** QA Lead
**Ambiente:** PROD
**Herramientas:** Cypress · n8n · Jira

### Alcance en Produccion

Solo se ejecutan:
- **E2E del flujo principal del SDD** (Happy Path por REQ)
- **E2E de flujos criticos** de mayor riesgo funcional

**No se ejecutan** edge cases que requieran configuracion especial de ambiente en PROD.

### Monitoreo Automatico

- **Workflow de health check** cada hora verifica disponibilidad de ambientes → alerta si hay caida
- **Workflow de resultado post-pipeline** notifica al QA Lead por email y mensajeria

### Resultado

```
DEFECTO EN PROD → Escaped Defect
                  - Clasificar con etiqueta "found-in: PROD" en Jira
                  - Abrir incidente urgente
                  - Impacta metrica de Escaped Defects

APROBADO        → Ticket avanza a DONE
                  - DoD verificado
                  - Se alimentan las metricas de la Fase 7
```

### Transicion del Board

```
TEST UAT → TEST PRODUCCION → DONE
```

---

## FASE 7 — Cierre y Metricas

**Responsable:** QA Lead
**Herramientas:** n8n · Jira · GitHub · Gmail

### Actividades

1. El **workflow de dashboard semanal** se ejecuta automaticamente al cierre del sprint
2. Extrae datos de Jira (bugs, resoluciones) y GitHub (resultados del pipeline)
3. Calcula los **5 KPIs gerenciales** y genera el reporte ejecutivo
4. Envia el informe a gerencia por email
5. QA Lead revisa tendencias y define acciones para el siguiente sprint
6. **El ciclo se repite desde la Fase 1** para el siguiente requerimiento o sprint

### 5 KPIs Gerenciales

| KPI | Que mide | Formula |
|-----|----------|---------|
| **Pass/Fail Rate** | % de TCs que pasan vs fallan | (TCs PASS / total TCs ejecutados) × 100 |
| **Test Coverage** | % de REQs con al menos un TC ejecutado | (REQs con TC / total REQs) × 100 |
| **Automation Coverage** | % de TCs automatizados sobre el total | (TCs automatizados / total TCs) × 100 |
| **Escaped Defects** | Defectos que llegaron a PROD sin detectarse en UAT | Bugs con `found-in: PROD` en el periodo |
| **Defect Resolution** | % de bugs resueltos dentro del SLA por severidad | (Bugs resueltos en SLA / total bugs) × 100 |

### SLA por Severidad

| Severidad | Tiempo maximo de resolucion |
|-----------|----------------------------|
| Critical / Blocker | 1 dia habil |
| High | 2 dias habiles |
| Medium | 5 dias habiles |
| Low | 10 dias habiles |

---

## Workflows n8n de Soporte (siempre activos)

| Workflow | Funcion | Frecuencia | Fase |
|----------|---------|------------|------|
| Reporte de regresion | Post-Cypress → reporte HTML → email | Post-ejecucion | 4 / 5 |
| Resumen diario de bugs | Bugs Jira → planilla → email | 9:00 AM diario | 5 / 6 |
| Monitoreo nuevos tickets | Nuevos KAN Jira → notificacion | Cada 2 minutos | 5 |
| Estado diario QA | Resumen del dia → email | 6:00 PM diario | 5 / 7 |
| Health check ambientes | Disponibilidad UAT/PROD → alerta si caido | Cada hora | 5 / 6 |
| Generacion SDD PDF | Jira → PDF SDD → email + mensajeria | Al crear/actualizar ticket | 1 |
| Alerta fallos criticos | Cypress critico → Jira Highest + email + mensajeria | Tiempo real | 4 / 5 |
| Resultado pipeline | GitHub Actions → notificacion completa | Post-pipeline | 4 |
| Dashboard semanal | KPIs → reporte ejecutivo → email gerencia | Semanal (cierre sprint) | 7 |
