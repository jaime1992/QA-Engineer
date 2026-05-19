# Plan de Pruebas Automatizadas — [REQ-XXX]
# [Titulo del Requerimiento] — Flujos Criticos

| Campo | Detalle |
|-------|---------|
| **REQ** | REQ-XXX |
| **Jira Story** | BUPA-XX |
| **Autor** | Jaime Quiñelen Villar — QA Lead |
| **Version** | v1.0 |
| **Fecha** | YYYY-MM-DD |
| **Spec Cypress** | `cypress/e2e/[nombre-spec].cy.js` |
| **Stage del pipeline** | Stage 4 — E2E Flujos Criticos |
| **Ambiente** | UAT / PROD |

---

## 1. Objetivo

Automatizar con Cypress los flujos criticos del requerimiento para garantizar su ejecucion continua en el pipeline CI/CD. Estos tests bloquean el avance del pipeline si fallan y generan alerta inmediata al equipo.

> Solo se automatizan flujos **criticos y deterministas**. Los flujos que requieren intervencion humana o configuracion especial de ambiente permanecen como pruebas manuales.

---

## 2. Criterio de Seleccion — Que se Automatiza

Un flujo es candidato a automatizacion si cumple **todos** los siguientes criterios:

| Criterio | Descripcion |
|----------|-------------|
| **Criticidad** | Es un flujo principal del SDD o un caso borde de alto riesgo para el negocio |
| **Repetibilidad** | Debe ejecutarse en cada push/PR sin variacion de resultado |
| **Determinismo** | El resultado es siempre el mismo dado el mismo estado inicial |
| **Verificable en codigo** | El PASS/FAIL puede determinarse con assertions — no requiere criterio subjetivo humano |
| **Sin dependencia externa** | No requiere DevOps, configuracion manual de ambiente o datos variables |

> Si un TC no cumple alguno de estos criterios → queda en el plan de pruebas **manuales**.

---

## 3. Flujos Criticos a Automatizar

| TC-ID | Titulo del flujo | Categoria | Assertion principal | Criterio PASS |
|-------|-----------------|-----------|---------------------|---------------|
| TC-001-FP | [Flujo principal 1] | [UX/UI/FE/BE] | [elemento o condicion verificada] | [condicion exacta de PASS] |
| TC-002-FP | [Flujo principal 2] | [UX/UI/FE/BE] | [elemento o condicion verificada] | [condicion exacta de PASS] |
| TC-003-FP | [Flujo principal 3] | [UX/UI/FE/BE] | [elemento o condicion verificada] | [condicion exacta de PASS] |

> Solo se incluyen aqui los TCs que cumplen el criterio de la Seccion 2. El resto va al plan manual.

---

## 4. Detalle de Casos Automatizados

---

### TC-001-FP — [Titulo del flujo]

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio [A/B/C...] |
| **Tipo** | Flujo Principal |
| **Categoria** | UX / UI / Frontend / Backend |
| **Selector principal** | `[data-testid="[nombre-selector]"]` |
| **Precondicion** | [Estado inicial requerido antes de ejecutar] |
| **Ambiente** | UAT / PROD |

**Flujo automatizado (pseudocodigo):**
```
visitar [URL del ambiente]
esperar a que [elemento clave] sea visible
verificar que [condicion 1]
verificar que [condicion 2]
```

**Assertion de PASS:**
```
[condicion exacta y verificable — ej: elemento visible, URL correcta, texto esperado]
```

**Assertion de FAIL:**
```
[condicion que hace fallar el test — ej: elemento no encontrado, URL incorrecta]
```

---

### TC-002-FP — [Titulo del flujo]

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio [A/B/C...] |
| **Tipo** | Flujo Principal |
| **Categoria** | UX / UI / Frontend / Backend |
| **Selector principal** | `[data-testid="[nombre-selector]"]` |
| **Precondicion** | [Estado inicial requerido] |
| **Ambiente** | UAT / PROD |

**Flujo automatizado (pseudocodigo):**
```
visitar [URL del ambiente]
esperar a que [elemento clave] sea visible
verificar que [condicion 1]
verificar que [condicion 2]
```

**Assertion de PASS:**
```
[condicion exacta y verificable]
```

**Assertion de FAIL:**
```
[condicion que hace fallar el test]
```

---

### TC-003-FP — [Titulo del flujo]

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio [A/B/C...] |
| **Tipo** | Flujo Principal |
| **Categoria** | UX / UI / Frontend / Backend |
| **Selector principal** | `[data-testid="[nombre-selector]"]` |
| **Precondicion** | [Estado inicial requerido] |
| **Ambiente** | UAT / PROD |

**Flujo automatizado (pseudocodigo):**
```
visitar [URL del ambiente]
esperar a que [elemento clave] sea visible
verificar que [condicion 1]
```

**Assertion de PASS:**
```
[condicion exacta y verificable]
```

**Assertion de FAIL:**
```
[condicion que hace fallar el test]
```

---

**Convenciones del spec:**
- Selectores: usar siempre `data-testid` — nunca clases CSS ni texto visible
- Patron de comando: `cy.accionNombre()` definido en `cypress/support/commands.ts`
- Timeouts: definidos en `cypress.config.js` — no hardcodear en el spec
- Fixtures: datos de prueba en `cypress/fixtures/[req-nombre].json`

---

## 6. Configuracion de Ambiente

| Variable | Descripcion | Local | CI/CD |
|----------|-------------|-------|-------|
| `CYPRESS_ENV` | Ambiente objetivo | `local` / `uat` | `uat` / `prod` (via secret) |
| `baseUrl` | URL base del portal | Definida en `cypress.config.js` | Inyectada desde GitHub Secrets |
| `pageLoadTimeout` | Timeout de carga de pagina | 60000ms | 60000ms |
| `defaultCommandTimeout` | Timeout de comandos | 15000ms | 15000ms |
| `viewportWidth` | Ancho del viewport | 1280px | 1280px |
| `viewportWidth` (mobile) | Viewport mobile si aplica | 375px | 375px |

**Ejecutar localmente:**
```
npx cypress run --spec "cypress/e2e/[nombre-spec].cy.js" --env environment=uat
```

**Ejecutar en CI/CD:**
El pipeline ejecuta automaticamente este spec en el Stage 4 ante cada push o PR.

---

## 7. Integracion en el Pipeline CI/CD

| Campo | Detalle |
|-------|---------|
| **Stage** | Stage 4 — E2E Flujos Criticos |
| **Trigger** | Push o PR hacia `main` o `develop` |
| **Depende de** | Stage 3 (Smoke Tests) debe pasar primero |
| **Bloquea** | Si falla, el pipeline no avanza a Stage 5 ni a notificacion de exito |

### Resultado del Stage

```
FALLO  → Stage marcado como failed
         → Workflow de alertas criticas se activa:
              - Abre bug en Jira con prioridad Highest
              - Notifica por email al QA Lead
              - Notifica por mensajeria al equipo
              - Sube screenshots y videos como artefactos

EXITO  → Pipeline continua a Stage 5 (Mobile)
         → Workflow de resultado notifica el exito
```

### Artefactos del Stage

| Artefacto | Condicion | Retencion |
|-----------|-----------|-----------|
| Screenshots de fallos | Solo si hay FAIL | 7 dias |
| Videos de ejecucion | Siempre | 3 dias |
| Reporte HTML | Siempre | Enviado por email via WF |

---

## 8. Reportes Generados

| Reporte | Generado por | Destinatario | Cuando |
|---------|-------------|--------------|--------|
| Reporte HTML de regresion | Workflow post-Cypress | QA Lead | Al finalizar cada ejecucion |
| Alerta de fallo critico | Workflow de alertas | QA Lead + Dev Team | Si Stage 4 falla |
| GitHub Step Summary | GitHub Actions | Equipo | Al finalizar el pipeline |
| Bug en Jira | Workflow de alertas | Dev Team | Si Stage 4 falla |

---

## 9. Quality Gate

| Metrica | Umbral minimo | Accion si no se cumple |
|---------|--------------|------------------------|
| **Pass Rate Stage 4** | 100% — flujos criticos no admiten fallos parciales | Pipeline bloqueado + alerta inmediata |
| **TCs ejecutados** | 100% de los TCs del plan | Investigar si algun TC fue omitido |
| **Tiempo de ejecucion** | < [N] minutos (definir segun spec) | Revisar timeouts y performance del ambiente |

> **Regla:** un fallo en cualquier TC critico (FP o EC) bloquea el pipeline completo. No existe "fallo aceptable" en flujos criticos. Si un TC no puede mantenerse verde de forma estable, debe revisarse si realmente cumple el criterio de automatizacion de la Seccion 2.

---

## 10. Registro de Estado

| TC-ID | Estado en Pipeline | Ultimo Run | Resultado | Artefacto |
|-------|-------------------|------------|-----------|-----------|
| TC-001-FP | Por ejecutar | — | — | — |
| TC-002-FP | Por ejecutar | — | — | — |
| TC-003-FP | Por ejecutar | — | — | — |

> Actualizar con cada ejecucion del pipeline. El historial completo queda en GitHub Actions.
