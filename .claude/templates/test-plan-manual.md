# Plan de Pruebas Manuales — [REQ-XXX]
# [Titulo del Requerimiento]

| Campo | Detalle |
|-------|---------|
| **REQ** | REQ-XXX |
| **Jira Story** | BUPA-XX |
| **Autor** | Jaime Quiñelen Villar — QA Lead |
| **Version** | v1.0 |
| **Fecha** | YYYY-MM-DD |
| **Ambiente objetivo** | UAT / PROD |
| **Spec Cypress asociado** | `cypress/e2e/[nombre-spec].cy.js` |

---

## 1. Objetivo

Describir el objetivo de las pruebas manuales para este requerimiento. Que se va a validar y por que es importante.

Ejemplo: _Verificar que [flujo principal del REQ] funciona correctamente en los ambientes UAT y PROD, cubriendo el flujo principal y los casos borde criticos._

---

## 2. Alcance

### Dentro del scope (IN)
- [Flujo o funcionalidad que SI se prueba]
- [Flujo o funcionalidad que SI se prueba]

### Fuera del scope (OUT)
- [Flujo o funcionalidad que NO se prueba en este plan]
- [Funcionalidad cubierta por otro REQ o plan]

---

## 3. Criterios de Entrada y Salida

### Criterios de Entrada (Definition of Ready)
Antes de iniciar las pruebas, verificar que:

- [ ] El SDD del REQ esta documentado y aprobado
- [ ] El ambiente UAT esta disponible y estable
- [ ] Los datos de prueba estan cargados en el ambiente
- [ ] El equipo de DEV confirmo que la funcionalidad esta lista para testing
- [ ] No hay bugs criticos bloqueantes sin resolver
- [ ] Los accesos necesarios al ambiente estan disponibles

### Criterios de Salida (Definition of Done)
Las pruebas estan completas cuando:

- [ ] Todos los TCs del plan fueron ejecutados (PASS, FAIL o No Aplica)
- [ ] No quedan TCs en estado "Por Ejecutar"
- [ ] Todos los bugs encontrados estan registrados en Jira con trazabilidad al TC
- [ ] Los TCs criticos (FP) estan todos en PASS antes de avanzar a PROD
- [ ] El registro de ejecucion esta completado (Seccion 8)
- [ ] El resumen del plan esta completado (Seccion 9)

---

## 4. Estrategia por Categoria

| Categoria | Que se valida | Tipo de prueba | Responsable |
|-----------|--------------|----------------|-------------|
| **UX** | Flujos de navegacion, usabilidad, estados vacios, feedback al usuario | Manual | QA Lead |
| **UI** | Visibilidad de elementos, layout, responsive, revision vs diseño Figma | Manual | QA Lead |
| **Frontend** | Comportamiento del framework, validaciones en cliente, formularios | Manual + Cypress | QA Lead |
| **Backend** | Respuesta del servidor, contratos API, seguridad SSL, tiempos de carga | Manual + Cypress | QA Lead |

---

## 5. Datos de Prueba

| Dato | Valor | Ambiente | Notas |
|------|-------|----------|-------|
| URL del portal | `https://[url-ambiente]` | UAT / PROD | |
| Usuario de prueba | `[usuario]` | UAT | No usar en PROD |
| Contrasena | Ver gestor de credenciales | UAT | No registrar aqui |
| [Dato especifico del REQ] | [valor] | [ambiente] | [nota] |

---

## 6. Tabla Resumen de Casos de Prueba

| TC-ID | Titulo | Tipo | Categoria | Ambiente | Estado | Bug |
|-------|--------|------|-----------|----------|--------|-----|
| TC-001-FP | [Titulo flujo principal 1] | Flujo Principal | [UX/UI/FE/BE] | UAT/PROD | Por Ejecutar | — |
| TC-002-FP | [Titulo flujo principal 2] | Flujo Principal | [UX/UI/FE/BE] | UAT/PROD | Por Ejecutar | — |
| TC-003-FP | [Titulo flujo principal 3] | Flujo Principal | [UX/UI/FE/BE] | UAT/PROD | Por Ejecutar | — |
| TC-001-EC | [Titulo edge case 1] | Edge Case | [UX/UI/FE/BE] | UAT | Por Ejecutar | — |
| TC-002-EC | [Titulo edge case 2] | Edge Case | [UX/UI/FE/BE] | UAT | Por Ejecutar | — |
| TC-003-EC | [Titulo edge case 3] | Edge Case | [UX/UI/FE/BE] | UAT | Por Ejecutar | — |

> Estados posibles: `Por Ejecutar` | `PASS` | `FAIL` | `Bloqueado` | `No Aplica`

---

## 7. Detalle de Casos de Prueba

---

### TC-001-FP — [Titulo del caso]

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio [A/B/C...] del SDD |
| **Tipo** | Flujo Principal |
| **Categoria** | UX / UI / Frontend / Backend |
| **Precondicion** | [Que debe estar listo antes de ejecutar este TC] |
| **Ambiente** | UAT / PROD |
| **Automatizado** | Si — `cypress/e2e/[spec].cy.js` / No |

**Pasos:**
1. [Accion del usuario — ser especifico]
2. [Accion del usuario]
3. [Accion del usuario]

**Resultado esperado:**
- [Comportamiento visible que indica que el TC paso]
- [Segundo criterio de exito si aplica]

**Criterio PASS/FAIL:**
- `PASS` si [condicion exacta y verificable]
- `FAIL` si [condicion que indica fallo]

---

### TC-002-FP — [Titulo del caso]

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio [A/B/C...] del SDD |
| **Tipo** | Flujo Principal |
| **Categoria** | UX / UI / Frontend / Backend |
| **Precondicion** | [Que debe estar listo antes de ejecutar este TC] |
| **Ambiente** | UAT / PROD |
| **Automatizado** | Si — `cypress/e2e/[spec].cy.js` / No |

**Pasos:**
1. [Accion del usuario]
2. [Accion del usuario]
3. [Accion del usuario]

**Resultado esperado:**
- [Comportamiento visible que indica que el TC paso]

**Criterio PASS/FAIL:**
- `PASS` si [condicion exacta y verificable]
- `FAIL` si [condicion que indica fallo]

---

### TC-003-FP — [Titulo del caso]

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio [A/B/C...] del SDD |
| **Tipo** | Flujo Principal |
| **Categoria** | UX / UI / Frontend / Backend |
| **Precondicion** | [Que debe estar listo antes de ejecutar este TC] |
| **Ambiente** | UAT / PROD |
| **Automatizado** | Si — `cypress/e2e/[spec].cy.js` / No |

**Pasos:**
1. [Accion del usuario]
2. [Accion del usuario]
3. [Accion del usuario]

**Resultado esperado:**
- [Comportamiento visible que indica que el TC paso]

**Criterio PASS/FAIL:**
- `PASS` si [condicion exacta y verificable]
- `FAIL` si [condicion que indica fallo]

---

### TC-001-EC — [Titulo del edge case]

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio [A/B/C...] del SDD |
| **Tipo** | Edge Case |
| **Categoria** | UX / UI / Frontend / Backend |
| **Precondicion** | [Configuracion especial necesaria — ambiente, datos, DevOps] |
| **Ambiente** | UAT (edge cases no se ejecutan en PROD salvo excepciones) |
| **Automatizado** | Si — `cypress/e2e/[spec].cy.js` / No |

**Pasos:**
1. [Accion o configuracion previa para simular el caso borde]
2. [Accion del usuario]
3. [Observacion del resultado]

**Resultado esperado:**
- [Comportamiento esperado ante el caso borde]
- [Mensaje de error o estado de la UI si corresponde]

**Criterio PASS/FAIL:**
- `PASS` si [condicion exacta y verificable]
- `FAIL` si [condicion que indica fallo — incluyendo si no se muestra el error esperado]

---

### TC-002-EC — [Titulo del edge case]

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio [A/B/C...] del SDD |
| **Tipo** | Edge Case |
| **Categoria** | UX / UI / Frontend / Backend |
| **Precondicion** | [Configuracion especial necesaria] |
| **Ambiente** | UAT |
| **Automatizado** | Si — `cypress/e2e/[spec].cy.js` / No |

**Pasos:**
1. [Accion o configuracion previa]
2. [Accion del usuario]
3. [Observacion del resultado]

**Resultado esperado:**
- [Comportamiento esperado ante el caso borde]

**Criterio PASS/FAIL:**
- `PASS` si [condicion exacta y verificable]
- `FAIL` si [condicion que indica fallo]

---

### TC-003-EC — [Titulo del edge case]

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio [A/B/C...] del SDD |
| **Tipo** | Edge Case |
| **Categoria** | UX / UI / Frontend / Backend |
| **Precondicion** | [Configuracion especial necesaria] |
| **Ambiente** | UAT |
| **Automatizado** | Si — `cypress/e2e/[spec].cy.js` / No |

**Pasos:**
1. [Accion o configuracion previa]
2. [Accion del usuario]
3. [Observacion del resultado]

**Resultado esperado:**
- [Comportamiento esperado ante el caso borde]

**Criterio PASS/FAIL:**
- `PASS` si [condicion exacta y verificable]
- `FAIL` si [condicion que indica fallo]

---

## 8. Registro de Ejecucion

| TC-ID | Estado | Fecha | Ejecutado por | Ambiente | Bug Jira | Notas |
|-------|--------|-------|---------------|----------|----------|-------|
| TC-001-FP | Por Ejecutar | — | — | UAT | — | — |
| TC-002-FP | Por Ejecutar | — | — | UAT | — | — |
| TC-003-FP | Por Ejecutar | — | — | UAT | — | — |
| TC-001-EC | Por Ejecutar | — | — | UAT | — | — |
| TC-002-EC | Por Ejecutar | — | — | UAT | — | — |
| TC-003-EC | Por Ejecutar | — | — | UAT | — | — |

> Completar durante y despues de la ejecucion. Agregar link al bug de Jira en la columna Bug.

---

## 9. Resumen del Plan

| Metrica | Valor |
|---------|-------|
| **Total TCs planificados** | [N] |
| **TCs Flujo Principal (FP)** | [N] |
| **TCs Edge Case (EC)** | [N] |
| **TCs ejecutados** | [N] |
| **PASS** | [N] |
| **FAIL** | [N] |
| **Bloqueados** | [N] |
| **No Aplica** | [N] |
| **Pass Rate** | [N]% |
| **Bugs encontrados** | [N] |
| **Bugs criticos/altos** | [N] |
| **Cobertura alcanzada** | [N]% |

### Estado final del plan

- [ ] Todos los TCs FP en PASS → listo para avanzar a siguiente ambiente
- [ ] Bugs criticos/altos resueltos antes de avanzar
- [ ] Registro de ejecucion completo
- [ ] Resultados cargados en Xray (TestExecution actualizado)

### Observaciones

> [Notas del QA Lead sobre la ejecucion, hallazgos importantes, riesgos identificados o decisiones tomadas durante las pruebas]
