# REQ-BUPA-006 — SDD
# Boton Ingresar deshabilitado con campos vacios — Login BUPA

| Campo | Detalle |
|-------|---------|
| **Autor** | Jaime Quinelen Villar — QA Lead |
| **Spec file** | `bupa-login(003-007).cy.js` |
| **URL bajo prueba** | `https://portalpaciente.bupa.cl/inicio` |
| **Stack** | Angular 17 + Cypress 15 |
| **Selector** | `button[type="submit"]` |
| **Fecha** | 2026-05-08 |
| **Estado** | Borrador — Pendiente revision |

---

## 1. Titulo

Boton Ingresar deshabilitado con campos vacios — Login BUPA

---

## 2. Problema que se quiere resolver

Si el boton de login esta habilitado con campos vacios, el paciente puede hacer clic sin haber ingresado datos, generando una llamada innecesaria al backend o un error confuso. Un boton deshabilitado previene interacciones prematuras y guia al usuario a completar el formulario antes de continuar.

---

## 3. Contexto de uso

- **Usuario:** paciente en el portal BUPA Chile al llegar a la pagina de login
- **Canal:** navegador web
- **Dispositivo:** desktop y movil
- **Precondicion:** El usuario llega a la pagina con ambos campos RUT y contrasena vacios (estado inicial)
- **URL:** `https://portalpaciente.bupa.cl/inicio`
- **Stack:** Angular 17 + Angular Material — formulario reactivo con validaciones requeridas

---

## 4. Objetivo

Verificar que el boton de tipo submit este deshabilitado mientras los campos obligatorios del formulario de login esten vacios.

---

## 5. Alcance

**Incluye:**
- Estado del boton submit cuando ambos campos estan vacios (estado inicial de la pagina)
- Verificacion del atributo `disabled` en el boton

**No incluye:**
- Estado del boton al completar solo uno de los dos campos
- Habilitacion del boton al completar ambos campos
- Cualquier flujo post-click

---

## 6. Comportamiento esperado

### Flujo principal

| # | Paso | Categoria |
|---|------|-----------|
| 1 | Navegar a `https://portalpaciente.bupa.cl/inicio` | Frontend |
| 2 | No interactuar con ningun campo del formulario | UX |
| 3 | Observar el estado del boton `button[type="submit"]` | UI |
| 4 | El boton debe tener el atributo `disabled` activo | UI |

### Flujos alternativos / Edge Cases

| Escenario | Comportamiento esperado | Categoria |
|-----------|------------------------|-----------|
| Usuario escribe en RUT y borra el contenido | El boton debe volver a estado deshabilitado [Por confirmar] | UX |
| Usuario llega desde recuperar contrasena | La pagina de login debe mostrar el boton deshabilitado igual | UX |

---

## 7. Criterios de aceptacion

| Criterio | Enunciado | Categoria |
|----------|-----------|-----------|
| **A** | Boton `button[type="submit"]` tiene atributo `disabled` al cargar la pagina | UI |
| **B** | `cy.get("button[type=submit]").should("be.disabled")` pasa sin errores | UI |
| **C** | El clic no dispara ninguna accion ni llamada al backend con campos vacios | Backend |

---

**Criterio A** — Categoria: UI
```
DADO    el paciente navega a la pagina de login
CUANDO  la pagina carga con los campos RUT y contrasena vacios
ENTONCES el boton button[type="submit"] debe tener el atributo disabled
```

**Criterio B** — Categoria: UI
```
DADO    el boton esta deshabilitado
CUANDO  se inspecciona con Cypress
ENTONCES cy.get("button[type=submit]").should("be.disabled") debe pasar sin errores
```

**Criterio C** — Categoria: Backend
```
DADO    ningun campo tiene valor
CUANDO  el paciente intenta hacer clic en el boton
ENTONCES el clic no debe disparar ninguna accion ni llamada al backend
```

---

## 8. Restricciones

### Tecnicas
- La deshabilitacion del boton la controla Angular reactive forms via `[disabled]` binding
- Depende de que el formulario este correctamente configurado como requerido
- Si el formulario usa validacion manual en lugar de Angular forms, el comportamiento puede variar

### De negocio
- El boton debe estar deshabilitado en el estado inicial — buenas practicas UX de formularios
- No aplica bloqueo temporal ni logica de intentos fallidos en este punto

### De seguridad
- Sin impacto directo — es una validacion de estado de UI que previene requests vacios

---

## 9. Notas — Decisiones abiertas y dudas

### Decisiones abiertas
- [ ] [Por confirmar] El boton se habilita solo cuando ambos campos tienen valor, o basta con uno?
- [ ] [Por confirmar] Existe validacion de longitud minima antes de habilitar el boton?

### Dudas
- [ ] El boton tiene algun estado visual diferenciado (color, opacidad) ademas del atributo `disabled`?

---

## Conexion con Cypress — `bupa-login(003-007).cy.js`

| Criterio | Test | Comando Cypress |
|----------|------|-----------------|
| A/B | `it("REQ-006: boton ingresar deshabilitado con campos vacios")` | `cy.get('button[type="submit"]').should('be.disabled')` |

```javascript
it("REQ-006: boton ingresar deshabilitado con campos vacios", () => {
  cy.get('button[type="submit"]').should("be.disabled")
})
```
