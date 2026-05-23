# REQ-BUPA-007 — SDD
# Enlace "Olvide mi contrasena" visible y funcional — Login BUPA

| Campo | Detalle |
|-------|---------|
| **Autor** | Jaime Quinelen Villar — QA Lead |
| **Spec file** | `bupa-login(003-007).cy.js` / `bupa-recuperar-clave(007).cy.js` |
| **URL bajo prueba** | `https://portalpaciente.bupa.cl/inicio` |
| **Stack** | Angular 17 + Cypress 15 |
| **Selector** | `a` o `button` con texto `/olvide\|olvidaste\|recuperar/i` |
| **Fecha** | 2026-05-08 |
| **Estado** | Borrador — Pendiente revision |

---

## 1. Titulo

Enlace "Olvide mi contrasena" visible y funcional — Login BUPA

---

## 2. Problema que se quiere resolver

Los pacientes que no recuerdan su contrasena no tienen manera de recuperar el acceso si el enlace de recuperacion no existe, no es visible o no funciona. Esto genera frustracion y dependencia del soporte telefonico para resolver un proceso que deberia ser autoservicio.

---

## 3. Contexto de uso

- **Usuario:** paciente registrado en BUPA que no recuerda su contrasena
- **Canal:** navegador web
- **Dispositivo:** desktop y movil
- **Precondicion:** El usuario esta en la pagina de login sin sesion activa
- **URL:** `https://portalpaciente.bupa.cl/inicio`
- **Stack:** Angular 17 + Angular Material — routerLink o navegacion de Angular

---

## 4. Objetivo

Verificar que existe un enlace de recuperacion de contrasena visible en la pagina de login, que es clickeable y que redirige al paciente a un flujo diferente al de login.

---

## 5. Alcance

**Incluye:**
- Existencia y visibilidad del enlace con texto que coincida con `/olvide|olvidaste|recuperar/i`
- Clickeabilidad del enlace
- Verificacion de que la URL cambia y sale de `/inicio` tras el clic

**No incluye:**
- El flujo completo de recuperacion de contrasena
- Validacion del destino especifico mas alla de salir de `/inicio`
- Recuperacion exitosa de acceso

---

## 6. Comportamiento esperado

### Flujo principal

| # | Paso | Categoria |
|---|------|-----------|
| 1 | Navegar a `https://portalpaciente.bupa.cl/inicio` | Frontend |
| 2 | Localizar el enlace con texto "olvide", "olvidaste" o "recuperar" (insensible a mayusculas) | UX |
| 3 | Verificar que el enlace es visible en pantalla | UI |
| 4 | Hacer clic en el enlace | UX |
| 5 | La URL cambia — ya no incluye `/inicio` | Frontend |
| 6 | El usuario llega al flujo de recuperacion de contrasena | UX |

### Flujos alternativos / Edge Cases

| Escenario | Comportamiento esperado | Categoria |
|-----------|------------------------|-----------|
| Enlace con texto diferente al esperado | El test fallara — el regex debe actualizarse si BUPA cambia el texto | UI |
| Enlace abre modal en lugar de nueva URL | [Por confirmar] — la recuperacion es in-page o nueva ruta? | Frontend |
| Enlace abre nueva pestana | El assert de URL debe adaptarse para manejar multiples tabs | Frontend |

---

## 7. Criterios de aceptacion

| Criterio | Enunciado | Categoria |
|----------|-----------|-----------|
| **A** | Existe al menos un elemento visible con texto que coincida con `/olvide\|olvidaste\|recuperar/i` | UI |
| **B** | La URL cambia y deja de incluir `/inicio` tras el clic | Frontend |
| **C** | `cy.url().should("not.include", "/inicio")` pasa | Frontend |
| **D** | El enlace no esta oculto ni deshabilitado | UI |

---

**Criterio A** — Categoria: UI
```
DADO    el paciente esta en la pagina de login
CUANDO  la pagina termina de cargar
ENTONCES debe existir al menos un elemento visible con texto que coincida con /olvide|olvidaste|recuperar/i
```

**Criterio B** — Categoria: Frontend
```
DADO    el enlace de recuperacion es visible
CUANDO  el paciente hace clic en el
ENTONCES la URL del navegador debe cambiar y dejar de incluir /inicio
```

**Criterio C** — Categoria: Frontend
```
DADO    el clic fue ejecutado
CUANDO  Cypress evalua la URL
ENTONCES cy.url().should("not.include", "/inicio") debe pasar
```

**Criterio D** — Categoria: UI
```
DADO    el enlace existe
CUANDO  se inspecciona su estado
ENTONCES no debe estar oculto ni deshabilitado
```

---

## 8. Restricciones

### Tecnicas
- El test usa regex `/olvide|olvidaste|recuperar/i` — si BUPA usa frase distinta, el localizador falla
- La navegacion puede ser `routerLink` de Angular — Cypress lo maneja correctamente con `cy.url()`
- Si la recuperacion usa modal en lugar de cambio de ruta, el criterio `not.include("/inicio")` no aplica

### De negocio
- El enlace debe ser accesible desde la pagina de login sin necesidad de iniciar sesion
- BUPA debe garantizar que el flujo de recuperacion este siempre operativo

### De seguridad
- El flujo de recuperacion no debe exponer si el RUT existe o no en la base de datos (enumeracion)
- [Por confirmar] El enlace de recuperacion tiene rate limiting para evitar abuso?

---

## 9. Notas — Decisiones abiertas y dudas

### Decisiones abiertas
- [ ] [Por confirmar] La recuperacion redirige a una nueva ruta Angular o abre un modal/overlay?
- [ ] [Por confirmar] Cual es la URL exacta del flujo de recuperacion?

### Dudas
- [ ] Si el texto del enlace cambia, el regex del test rompe silenciosamente — agregar assert explicito del texto?
- [ ] Existe un test separado para el flujo completo de recuperacion (envio de email, reset de clave)?

---

## Conexion con Cypress — `bupa-login(003-007).cy.js`

| Criterio | Test | Comando Cypress |
|----------|------|-----------------|
| A/B/C | `it("REQ-007: enlace olvide contrasena existe y es clickeable")` | `cy.contains(/olvide\|olvidaste\|recuperar/i).should('be.visible').click()` |
| D | Parte del mismo test | `.should('be.visible').and('not.be.disabled')` |

```javascript
it("REQ-007: enlace olvide contrasena existe y es clickeable", () => {
  cy.contains(/olvide|olvidaste|recuperar/i).should("be.visible").click()
  cy.url().should("not.include", "/inicio")
})
```
