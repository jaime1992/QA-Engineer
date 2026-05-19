# REQ-BUPA-005 — SDD
# Error visible al ingresar RUT con formato incorrecto — Login BUPA

| Campo | Detalle |
|-------|---------|
| **Autor** | Jaime Quinelen Villar — QA Lead |
| **Spec file** | `bupa-login(003-007).cy.js` |
| **URL bajo prueba** | `https://portalpaciente.bupa.cl/inicio` |
| **Stack** | Angular 17 + Cypress 15 |
| **Selectores** | `input[name="rut"]`, `mat-error` |
| **Fecha** | 2026-05-08 |
| **Estado** | Borrador — Pendiente revision |

---

## 1. Titulo

Error visible al ingresar RUT con formato incorrecto — Login BUPA

---

## 2. Problema que se quiere resolver

Un paciente puede equivocarse al escribir su RUT ingresando texto libre sin el formato correcto. Sin validacion de formato en el campo, el usuario llegaria al backend con datos mal formados, generando errores tecnicos en lugar de orientacion clara sobre como corregir la entrada.

---

## 3. Contexto de uso

- **Usuario:** paciente en el portal BUPA Chile, sin sesion activa
- **Canal:** navegador web
- **Dispositivo:** desktop y movil
- **Precondicion:** El usuario esta en la pagina de login con los campos vacios
- **URL:** `https://portalpaciente.bupa.cl/inicio`
- **Stack:** Angular 17 + Angular Material — validacion de formulario reactivo

---

## 4. Objetivo

Verificar que el portal muestre un `mat-error` visible cuando el paciente escribe un valor que no tiene formato de RUT chileno valido, sin necesidad de llegar al submit.

---

## 5. Alcance

**Incluye:**
- Ingreso de texto libre sin formato RUT (ej. `noesunrut`)
- Aparicion del `mat-error` de validacion de formato
- Verificacion de que la URL permanece en `/inicio`

**No incluye:**
- RUT con formato valido pero no registrado (cubierto por REQ-BUPA-004)
- Comportamiento del boton submit con RUT invalido (cubierto por REQ-BUPA-006)
- Recuperacion de contrasena ni login exitoso

---

## 6. Comportamiento esperado

### Flujo principal

| # | Paso | Categoria |
|---|------|-----------|
| 1 | Navegar a `https://portalpaciente.bupa.cl/inicio` | Frontend |
| 2 | Ingresar texto sin formato RUT en el campo RUT (ej. `noesunrut`) | Frontend |
| 3 | Ingresar cualquier valor en el campo contrasena (ej. `MiClave123`) | Frontend |
| 4 | El campo RUT dispara validacion de formato en tiempo real o al perder foco | Frontend |
| 5 | Se muestra `mat-error` indicando formato incorrecto | UI |
| 6 | La URL permanece en `/inicio` | Frontend |

### Flujos alternativos / Edge Cases

| Escenario | Comportamiento esperado | Categoria |
|-----------|------------------------|-----------|
| RUT con puntos pero sin digito verificador | [Por confirmar] — se considera formato invalido? | Frontend |
| Campo RUT vacio | El boton submit debe estar deshabilitado (REQ-006), no aplica este flujo | UX |
| RUT con solo numeros sin guion | [Por confirmar] — el validador lo acepta o rechaza? | Frontend |

---

## 7. Criterios de aceptacion

| Criterio | Enunciado | Categoria |
|----------|-----------|-----------|
| **A** | `mat-error` visible al ingresar RUT con formato invalido | UI |
| **B** | Texto del error indica que el formato del RUT es incorrecto | UI |
| **C** | URL permanece en `/inicio` | Frontend |
| **D** | `mat-error` presente en el DOM y no oculto | UI |

---

**Criterio A** — Categoria: UI
```
DADO    el paciente esta en la pagina de login
CUANDO  escribe "noesunrut" en el campo RUT y "MiClave123" en la contrasena
ENTONCES el componente mat-error debe ser visible en pantalla
```

**Criterio B** — Categoria: UI
```
DADO    se muestra el error de formato
CUANDO  el paciente lee el mensaje
ENTONCES el texto debe indicar que el formato del RUT es incorrecto [Por confirmar texto exacto]
```

**Criterio C** — Categoria: Frontend
```
DADO    el error de formato esta activo
CUANDO  el sistema evalua la URL
ENTONCES debe permanecer en /inicio
```

**Criterio D** — Categoria: UI
```
DADO    el mat-error esta visible
CUANDO  se inspecciona el DOM
ENTONCES el componente debe estar presente y no oculto con display:none
```

---

## 8. Restricciones

### Tecnicas
- La validacion de formato se ejecuta en el frontend (Angular reactive forms)
- Si se desactiva JavaScript, esta validacion no aplica
- El selector `mat-error` es especifico de Angular Material — un cambio de libreria rompe la prueba

### De negocio
- El portal debe orientar al paciente para ingresar el RUT en el formato correcto (ej. `12345678-9`)
- No debe llegar al backend con un RUT mal formado

### De seguridad
- Sin impacto de seguridad directo — es una validacion de formato en frontend

---

## 9. Notas — Decisiones abiertas y dudas

### Decisiones abiertas
- [ ] [Por confirmar] Cual es el texto exacto del `mat-error` para formato invalido?
- [ ] [Por confirmar] La validacion ocurre al escribir, al perder foco, o al hacer submit?

### Dudas
- [ ] El validador acepta RUT sin puntos (`12345678-9`) o exige puntos (`12.345.678-9`)?
- [ ] El campo formatea automaticamente el RUT mientras se escribe?

---

## Conexion con Cypress — `bupa-login(003-007).cy.js`

| Criterio | Test | Comando Cypress |
|----------|------|-----------------|
| A | `it("REQ-005: error visible con RUT en formato incorrecto")` | `cy.get('mat-error').should('be.visible')` |
| B | `it("REQ-005: texto de error de formato")` | `cy.get('mat-error').should('contain.text', '[texto por confirmar]')` |
| C | `it("REQ-005: URL permanece en /inicio")` | `cy.url().should('include', '/inicio')` |

```javascript
it("REQ-005: error visible con RUT en formato incorrecto", () => {
  cy.get('input[name="rut"]').type("noesunrut")
  cy.get('input[name="current-password"]').type("MiClave123")
  cy.get("mat-error").should("be.visible")
  cy.url().should("include", "/inicio")
})
```
