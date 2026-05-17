# Test Cases — REQ-BUPA-002
# Verificacion de visibilidad y accesibilidad del formulario de login

| Campo | Detalle |
|-------|---------|
| **Spec** | `bupa-smoke.cy.js` |
| **Ambiente** | DEV/UAT/PROD (flujo principal) / DEV-UAT (edge cases) |
| **Ejecutado por** | Jaime Quiñelen Villar |

---

## Resultados de Ejecucion

| TC-ID | Titulo | Tipo | Ambiente | Estado | Fecha | Bug |
|-------|--------|------|----------|--------|-------|-----|
| TC-001-FP | Campo RUT es visible en el formulario | Flujo Principal | UAT/PROD | Por Ejecutar | — | — |
| TC-002-FP | Campo contrasena es visible en el formulario | Flujo Principal | UAT/PROD | Por Ejecutar | — | — |
| TC-003-FP | Boton Iniciar sesion es visible en el formulario | Flujo Principal | UAT/PROD | Por Ejecutar | — | — |
| TC-004-FP | Pagina no tiene violaciones WCAG 2.1 A ni AA | Flujo Principal | UAT/PROD | Por Ejecutar | — | — |
| TC-005-FP | Orden de foco Tab es logico en el formulario | Flujo Principal | UAT/PROD | Por Ejecutar | — | — |
| TC-001-EC | Angular no completa bootstrap — campos no aparecen | Edge Case | UAT | Por Ejecutar | — | — |
| TC-002-EC | Violacion de contraste detectada por axe | Edge Case | UAT | Por Ejecutar | — | — |
| TC-003-EC | Campo sin label accesible detectado por axe | Edge Case | UAT | Por Ejecutar | — | — |

> Estados posibles: `Por Ejecutar` | `PASS` | `FAIL` | `Bloqueado` | `No Aplica`

---

## TC-002-A — Campo RUT es visible en el formulario

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio A |
| **Precondicion** | REQ-BUPA-001 pasa — el portal cargo correctamente |
| **Ambiente** | DEV / UAT / PROD |

**Pasos:**
1. Navegar a `https://portalpaciente.bupa.cl/inicio`
2. Esperar a que Angular complete el bootstrap del componente de login
3. Verificar que el campo `input[name="rut"]` es visible en pantalla

**Resultado esperado:**
- El campo RUT esta visible con placeholder `Ej: 20345678K`
- El elemento `input[name="rut"]` existe en el DOM y tiene `display` visible

---

## TC-002-B — Campo contrasena es visible en el formulario

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio B |
| **Precondicion** | REQ-BUPA-001 pasa |
| **Ambiente** | DEV / UAT / PROD |

**Pasos:**
1. Navegar a `https://portalpaciente.bupa.cl/inicio`
2. Esperar a que Angular complete el bootstrap del componente de login
3. Verificar que el campo `input[name="current-password"]` es visible en pantalla

**Resultado esperado:**
- El campo contrasena esta visible y es de tipo `password` (texto enmascarado)
- El elemento no muestra la contrasena en texto plano

---

## TC-002-C — Boton Iniciar sesion es visible en el formulario

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio C |
| **Precondicion** | REQ-BUPA-001 pasa |
| **Ambiente** | DEV / UAT / PROD |

**Pasos:**
1. Navegar a `https://portalpaciente.bupa.cl/inicio`
2. Esperar a que Angular complete el bootstrap
3. Verificar que el elemento `button[type="submit"]` con texto "Iniciar sesion" es visible

**Resultado esperado:**
- El boton "Iniciar sesion" es visible en pantalla
- Puede estar en estado `disabled` hasta que el paciente complete los campos

---

## TC-002-D — Pagina no tiene violaciones WCAG 2.1 A ni AA

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio D |
| **Precondicion** | REQ-BUPA-001 pasa, cypress-axe instalado en `cypress/support/e2e.js` |
| **Ambiente** | DEV / UAT / PROD |

**Pasos:**
1. Navegar a `https://portalpaciente.bupa.cl/inicio`
2. Esperar a que el formulario de login sea visible
3. Ejecutar `cy.injectAxe()`
4. Ejecutar `cy.checkA11y(null, { runOnly: ["wcag2a", "wcag2aa"] })`
5. Observar si se reportan violaciones

**Resultado esperado:**
- No se detectan violaciones WCAG 2.1 nivel A ni AA
- Si `landmark-one-main` se detecta como falso positivo en Angular SPA, excluirlo con `exclude`

**Resultado obtenido:** _(completar al ejecutar)_

---

## TC-002-E — Orden de foco Tab es logico en el formulario

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio E |
| **Precondicion** | REQ-BUPA-001 pasa, formulario visible |
| **Ambiente** | DEV / UAT / PROD |

**Pasos:**
1. Navegar a `https://portalpaciente.bupa.cl/inicio`
2. Hacer clic en el campo RUT para enfocar el inicio del formulario
3. Presionar Tab una vez — verificar que el foco pasa al campo contrasena
4. Presionar Tab otra vez — verificar que el foco pasa al boton submit

**Resultado esperado:**
- Orden de foco: `input[name="rut"]` → `input[name="current-password"]` → `button[type="submit"]`
- Cada elemento recibe foco visible (indicador de foco no suprimido con `outline: none`)

---

## TC-002-EC1 — Angular no completa bootstrap

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case — simulado en DEV/UAT |
| **Precondicion** | Ambiente DEV con error de bootstrap Angular simulado |
| **Ambiente** | DEV / UAT |

**Pasos:**
1. Solicitar al equipo Dev un ambiente con bootstrap Angular fallando
2. Navegar a la URL del portal
3. Verificar que Cypress detecta el elemento faltante

**Resultado esperado:**
- Cypress lanza `element not found` para `input[name="rut"]`
- El test falla con mensaje claro identificando el elemento no encontrado

---

## TC-002-EC2 — Violacion de contraste detectada por axe

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case — accesibilidad |
| **Precondicion** | Ambiente DEV con color de texto modificado para bajo contraste |
| **Ambiente** | DEV / UAT |

**Pasos:**
1. Modificar en DEV el color del label del campo RUT a gris claro (#aaaaaa)
2. Ejecutar `cy.checkA11y()` con reglas `wcag2aa`
3. Observar la violacion reportada

**Resultado esperado:**
- axe reporta violacion `color-contrast` indicando el elemento y los valores de color
- El test falla con el impacto y el elemento afectado

---

## TC-002-EC3 — Campo sin label accesible detectado por axe

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case — accesibilidad |
| **Precondicion** | Ambiente DEV con `aria-label` o `<label>` removido del campo RUT |
| **Ambiente** | DEV / UAT |

**Pasos:**
1. Modificar en DEV el campo RUT removiendo su `aria-label` o `<label>` asociado
2. Ejecutar `cy.checkA11y()` con reglas `wcag2a`
3. Observar la violacion reportada

**Resultado esperado:**
- axe reporta violacion `label` con impacto `SERIOUS`
- El test falla identificando el elemento sin label accesible
