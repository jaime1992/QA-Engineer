# REQ-BUPA-002 — SDD
# Verificacion de visibilidad y accesibilidad del formulario de login

| Campo | Detalle |
|-------|---------|
| **Autor** | Jaime Quiñelen Villar — QA Lead |
| **Spec file** | `bupa-smoke.cy.js` |
| **URL bajo prueba** | `https://portalpaciente.bupa.cl/inicio` |
| **Stack** | Angular 17 + Angular Material + cypress-axe |
| **Selector RUT** | `input[name="rut"]` |
| **Selector Password** | `input[name="current-password"]` |
| **Accesibilidad** | cypress-axe + WCAG 2.1 AA |
| **Fecha** | 2026-05-16 |

---

## 1. Titulo

Verificacion de visibilidad y accesibilidad del formulario de login BUPA

---

## 2. Problema que se quiere resolver

El formulario de login es la unica puerta de entrada al portal para los pacientes. Si los campos de RUT, contrasena o el boton de acceso no se renderizan correctamente, el paciente no puede iniciar sesion. Adicionalmente, pacientes adultos mayores o con discapacidad visual necesitan que el formulario cumpla estandares de accesibilidad WCAG 2.1 AA para poder usarlo con lectores de pantalla o navegacion por teclado.

---

## 3. Contexto de uso

- **Usuario:** paciente registrado o visitante — no requiere autenticacion previa
- **Canal:** navegador web (Chrome, Firefox, Safari, Edge)
- **Dispositivo:** desktop y movil
- **Precondicion:** el portal cargo correctamente (REQ-BUPA-001 pasa)
- **URL:** `https://portalpaciente.bupa.cl/inicio`
- **Stack:** Angular 17 con Angular Material — selectores inspeccionados el 2026-05-06
- **Selector RUT:** `input[name="rut"]` | **Selector pass:** `input[name="current-password"]`

---

## 4. Objetivo

Verificar que el formulario de login del Portal BUPA renderiza completamente con sus tres elementos visibles y que la pagina cumple los criterios de accesibilidad WCAG 2.1 nivel AA.

---

## 5. Alcance

**Incluye:**
- Visibilidad del campo RUT (`input[name="rut"]`)
- Visibilidad del campo contrasena (`input[name="current-password"]`)
- Visibilidad del boton Iniciar sesion (`button[type="submit"]`)
- Validacion de accesibilidad WCAG 2.1 A y AA con cypress-axe
- Deteccion de violaciones: bajo contraste, campos sin label, imagenes sin alt

**No incluye:**
- Funcionalidad del login — credenciales validas/invalidas (REQ-BUPA-003)
- Enlace "Olvide mi contrasena" (REQ-BUPA-007)
- Accesibilidad WCAG nivel AAA
- Accesibilidad en pantallas post-login

---

## 6. Comportamiento esperado

### Flujo principal

1. Navegar a `https://portalpaciente.bupa.cl/inicio`
2. Angular completa el bootstrap y renderiza el componente de login
3. El campo RUT aparece visible con placeholder `Ej: 20345678K`
4. El campo contrasena aparece visible de tipo `password`
5. El boton Iniciar sesion aparece visible (estado `disabled` hasta completar campos)
6. cypress-axe evalua la pagina y no detecta violaciones WCAG 2.1 A ni AA

### Flujos alternativos / Edge Cases

| Escenario | Comportamiento esperado |
|-----------|------------------------|
| Angular no completa bootstrap | Campo RUT no encontrado — test falla con `element not found` |
| Violacion de contraste | cypress-axe falla indicando el elemento y nivel WCAG |
| Campo sin label accesible | axe detecta label faltante — falla con impacto `SERIOUS` |

---

## 7. Criterios de aceptacion

> Cada criterio mapea directamente a un bloque `it()` en `bupa-smoke.cy.js`

**Criterio A**
```
DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
CUANDO  Angular termina de renderizar el componente de login
ENTONCES el elemento input[name="rut"] es visible en pantalla
```

**Criterio B**
```
DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
CUANDO  Angular termina de renderizar el componente de login
ENTONCES el elemento input[name="current-password"] es visible en pantalla
```

**Criterio C**
```
DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
CUANDO  Angular termina de renderizar el componente de login
ENTONCES el elemento button[type="submit"] con texto "Iniciar sesion" es visible en pantalla
```

**Criterio D**
```
DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
CUANDO  cypress-axe evalua la pagina con reglas wcag2a y wcag2aa
ENTONCES no se detectan violaciones de accesibilidad de nivel A ni AA
```

**Criterio E**
```
DADO    el formulario de login esta visible
CUANDO  el paciente navega con la tecla Tab
ENTONCES el foco se desplaza en orden logico: RUT -> contrasena -> boton submit
```

---

## 8. Restricciones

### Tecnicas
- Angular Material genera atributos `_ngcontent-*` dinamicos — usar selectores `name` o `type`, no clases generadas
- `cy.injectAxe()` debe llamarse despues de `cy.visit()` para que axe-core se inyecte correctamente
- cypress-axe debe estar importado en `cypress/support/e2e.js`
- Falso positivo conocido en Angular SPA: `landmark-one-main` puede requerir ser excluido

### De negocio
- BUPA como prestador de salud debe cumplir estandares de accesibilidad para todos los pacientes
- El formulario debe ser usable por adultos mayores (grupo etario principal de usuarios BUPA)
- Ley 20.422 de Chile establece igualdad de oportunidades para personas con discapacidad

### De seguridad
- El campo `input[name="current-password"]` debe ser de tipo `password` — nunca mostrar en texto plano
- La contrasena no debe aparecer en logs de Cypress — usar `{ log: false }` al tipear
- El atributo `autocomplete="current-password"` es correcto — facilita gestores de contrasenas

---

## 9. Notas — Decisiones abiertas y dudas

### Decisiones abiertas
- [ ] [Por confirmar] Las violaciones WCAG deben bloquear el pipeline (error) o solo generar warning?
- [ ] [Por confirmar] Se requiere validar accesibilidad en viewport movil (390px) ademas de desktop?
- [ ] [Por confirmar] El boton disabled al inicio es comportamiento esperado o debe estar habilitado?

### Dudas
- [ ] El test de accesibilidad esta dentro del test de visibilidad — deberia separarse en `it()` propio?
- [ ] Angular Material cumple WCAG 2.1 AA por defecto o requiere configuracion adicional de frontend?
- [ ] Existe documentacion del sistema de diseno BUPA con colores oficiales para validar contraste?

---

## Conexion con Cypress — `bupa-smoke.cy.js`

| Criterio | Test | Comando Cypress |
|----------|------|-----------------|
| A | `it("REQ-002: formulario de login es visible al cargar")` | `cy.get('input[name="rut"]').should("be.visible")` |
| B | `it("REQ-002: formulario de login es visible al cargar")` | `cy.get('input[name="current-password"]').should("be.visible")` |
| C | `it("REQ-002: formulario de login es visible al cargar")` | `cy.get('button[type="submit"]').should("be.visible")` |
| D | `it("REQ-002: formulario de login es visible al cargar")` | `cy.injectAxe()` + `cy.checkA11y(null, { runOnly: ["wcag2a","wcag2aa"] })` |
| E | _(pendiente implementacion)_ | Tab navigation focus order |
