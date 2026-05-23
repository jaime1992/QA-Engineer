# REQ-BUPA-004 — SDD
# Mensaje de error visible con credenciales invalidas — Login BUPA

| Campo | Detalle |
|-------|---------|
| **Autor** | Jaime Quinelen Villar — QA Lead |
| **Spec file** | `bupa-login(003-007).cy.js` |
| **URL bajo prueba** | `https://portalpaciente.bupa.cl/inicio` |
| **Stack** | Angular 17 + Angular Material UI |
| **Fecha** | 2026-05-08 |
| **Estado** | Borrador — Pendiente revision |

---

## 1. Titulo

Mensaje de error visible con credenciales invalidas — Login BUPA

---

## 2. Problema que se quiere resolver

Los pacientes pueden ingresar credenciales incorrectas al intentar acceder al portal BUPA. Sin un mensaje de error claro y visible, el usuario no sabe si fallo el RUT, la contrasena, o si el sistema tuvo un problema. Esto genera confusion y llamadas innecesarias al soporte.

---

## 3. Contexto de uso

- **Usuario:** paciente registrado en el portal BUPA Chile
- **Canal:** navegador web (Chrome, Firefox, Safari, Edge)
- **Dispositivo:** desktop y movil
- **Precondicion:** El usuario esta en la pagina de login sin sesion activa
- **URL:** `https://portalpaciente.bupa.cl/inicio`
- **Stack:** Angular 17 + Angular Material — componente `mat-error`

---

## 4. Objetivo

Verificar que el portal muestre un mensaje de error descriptivo y visible cuando el paciente ingresa credenciales invalidas, sin redirigirlo fuera de la pagina de login.

---

## 5. Alcance

**Incluye:**
- Ingreso de RUT valido en formato + contrasena incorrecta
- Visualizacion del componente `mat-error` con texto especifico
- Verificacion de que la URL permanece en `/inicio`
- Validacion del texto del mensaje de error

**No incluye:**
- RUT en formato incorrecto (cubierto por REQ-BUPA-005)
- Bloqueo de cuenta por multiples intentos fallidos
- Recuperacion de contrasena (cubierta por REQ-BUPA-007)
- Login exitoso (cubierto por REQ-BUPA-003)

---

## 6. Comportamiento esperado

### Flujo principal

| # | Paso | Categoria |
|---|------|-----------|
| 1 | Navegar a `https://portalpaciente.bupa.cl/inicio` | Frontend |
| 2 | Ingresar un RUT con formato valido pero no registrado (ej. 12345678K) | Frontend |
| 3 | Ingresar una contrasena incorrecta (ej. ClaveIncorrecta999) | Frontend |
| 4 | Hacer clic en el boton "Ingresar" | UX |
| 5 | El sistema intenta autenticar y recibe respuesta de error del backend | Backend |
| 6 | Se muestra el componente `mat-error` con el texto "Rut o contrasena incorrecta" | UI |
| 7 | La URL permanece en `/inicio` | Frontend |

### Flujos alternativos / Edge Cases

| Escenario | Comportamiento esperado | Categoria |
|-----------|------------------------|-----------|
| Contrasena vacia + RUT valido | El boton deberia estar deshabilitado (ver REQ-006) — no se llega al error de credenciales | UX |
| RUT invalido en formato | Muestra error de validacion de campo antes del submit (ver REQ-005) | Frontend |
| Error de red / timeout | [Por confirmar] — se muestra un mensaje de error generico diferente? | Backend |

---

## 7. Criterios de aceptacion

| Criterio | Enunciado | Categoria |
|----------|-----------|-----------|
| **A** | `mat-error` visible tras ingresar credenciales invalidas | UI |
| **B** | Texto del error contiene "Rut o contrasena incorrecta" | UI |
| **C** | URL permanece en `/inicio` tras el intento fallido | Frontend |
| **D** | `mat-error` presente en el DOM y no oculto con `display:none` | UI |

---

**Criterio A** — Categoria: UI
```
DADO    el paciente esta en la pagina de login
CUANDO  ingresa 12345678K como RUT y ClaveIncorrecta999 como contrasena y hace clic en "Ingresar"
ENTONCES el componente mat-error debe ser visible en pantalla
```

**Criterio B** — Categoria: UI
```
DADO    se muestra el error de credenciales
CUANDO  el paciente lee el mensaje
ENTONCES el texto debe contener "Rut o contrasena incorrecta"
```

**Criterio C** — Categoria: Frontend
```
DADO    el login fallo por credenciales invalidas
CUANDO  el sistema procesa la respuesta del backend
ENTONCES la URL debe seguir siendo /inicio (no redirige al portal)
```

**Criterio D** — Categoria: UI
```
DADO    el error esta visible
CUANDO  el paciente inspecciona la pagina
ENTONCES el mat-error debe estar en el DOM y con estado visible (no display:none)
```

---

## 8. Restricciones

### Tecnicas
- El componente de error es `mat-error` de Angular Material — cualquier cambio de framework rompe el selector
- El texto exacto "Rut o contrasena incorrecta" es sensible a mayusculas y tildes — debe coincidir exactamente
- El test usa RUT hardcodeado `12345678K` — si BUPA valida que ese RUT existe, el comportamiento puede variar

### De negocio
- El mensaje de error no debe revelar si el RUT existe o no (seguridad de enumeracion)
- El portal debe mantener al usuario en la pagina de login para que pueda reintentar

### De seguridad
- El mensaje de error no debe revelar si el RUT existe o no (seguridad de enumeracion)
- El portal debe mantener al usuario en la pagina de login para que pueda reintentar

---

## 9. Notas — Decisiones abiertas y dudas

### Decisiones abiertas
- [ ] [Por confirmar] Cuantos intentos fallidos bloquean la cuenta? Hay CAPTCHA despues de N intentos?
- [ ] [Por confirmar] El mensaje de error cambia si el RUT existe pero la contrasena es incorrecta vs RUT que no existe?

### Dudas
- [ ] Si BUPA actualiza el texto del `mat-error`, el test falla — existe contrato de UI para ese texto?
- [ ] Se debe validar tambien que no aparezcan otros `mat-error` no relacionados en pantalla?

---

## Conexion con Cypress — `bupa-login(003-007).cy.js`

| Criterio | Test | Comando Cypress |
|----------|------|-----------------|
| A | `it("REQ-004: mat-error visible con credenciales invalidas")` | `cy.get('mat-error').should('be.visible')` |
| B | `it("REQ-004: texto de error correcto")` | `cy.get('mat-error').should('contain', 'Rut o contrasena incorrecta')` |
| C | `it("REQ-004: URL permanece en /inicio")` | `cy.url().should('include', '/inicio')` |
| D | `it("REQ-004: mat-error en DOM y visible")` | `cy.get('mat-error').should('be.visible').and('not.have.css', 'display', 'none')` |
