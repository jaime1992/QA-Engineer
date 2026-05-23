# REQ-BUPA-003 — SDD
# Login exitoso con credenciales validas — Portal BUPA

| Campo | Detalle |
|-------|---------|
| **Autor** | Jaime Quinelen Villar — QA Lead |
| **Spec file** | `bupa-login(003-007).cy.js` |
| **URL bajo prueba** | `https://portalpaciente.bupa.cl/inicio` |
| **Stack** | Angular 17 + Cypress 15 — login de dos pasos |
| **Fecha** | 2026-05-08 |
| **Estado** | Borrador — Pendiente revision |

---

## 1. Titulo

Login exitoso con credenciales validas — Portal BUPA

---

## 2. Problema que se quiere resolver

El portal de pacientes BUPA requiere autenticacion para proteger informacion medica sensible. Si el flujo de login no funciona correctamente para credenciales validas, ningun paciente puede acceder a sus citas, examenes ni datos personales. No existe validacion automatizada que confirme que el proceso de autenticacion completo funciona antes de cada deploy.

---

## 3. Contexto de uso

- **Usuario:** paciente registrado con RUT y contrasena activos en el sistema BUPA
- **Canal:** navegador web (Chrome, Firefox, Safari, Edge)
- **Dispositivo:** desktop y movil
- **Precondiciones:**
  - El portal cargo correctamente (REQ-BUPA-001 pasa)
  - El formulario de login es visible (REQ-BUPA-002 pasa)
  - El paciente tiene cuenta activa con credenciales validas
- **URL:** `https://portalpaciente.bupa.cl/inicio`
- **Stack:** Angular 17 con Angular Material — login de dos pasos
- **Selectores:**
  - Paso 1 RUT: `input[name="rut"]`
  - Boton continuar: `button[type="submit"].first()`
  - Paso 2 contrasena: `input[name="current-password"]`
  - Boton ingresar: `button[type="submit"]`

---

## 4. Objetivo

Verificar que un paciente con credenciales validas puede completar el flujo de login de dos pasos y acceder al portal, confirmado por el cambio de URL desde `/inicio`.

---

## 5. Alcance

**Incluye:**
- Ingreso de RUT valido en el paso 1
- Click en boton continuar para avanzar al paso 2
- Aparicion del campo contrasena en el paso 2
- Ingreso de contrasena valida
- Click en boton ingresar
- Verificacion de que la URL cambia y ya no contiene `/inicio`

**No incluye:**
- Login con credenciales invalidas — cubierto en REQ-BUPA-004
- Login con RUT en formato incorrecto — cubierto en REQ-BUPA-005
- Login con campos vacios — cubierto en REQ-BUPA-006
- Contenido del dashboard post-login — cubierto en REQ-BUPA-008
- Recuperacion de contrasena — cubierto en REQ-BUPA-007
- Login desde app movil Capacitor

---

## 6. Comportamiento esperado

### Flujo principal

| # | Paso | Categoria |
|---|------|-----------|
| 1 | Navegar a `https://portalpaciente.bupa.cl/inicio` | Frontend |
| 2 | Ingresar el RUT valido en `input[name="rut"]` | Frontend |
| 3 | Hacer click en `button[type="submit"].first()` — boton continuar del paso 1 | Frontend |
| 4 | Esperar que Angular renderice el campo contrasena del paso 2 | Frontend |
| 5 | Ingresar la contrasena en `input[name="current-password"]` | Frontend |
| 6 | Hacer click en el boton Ingresar del paso 2 | Frontend |
| 7 | Angular procesa la autenticacion contra la API de BUPA | Backend |
| 8 | La URL cambia — ya no contiene `/inicio` | Frontend |
| 9 | El paciente accede al area autenticada del portal | UX |

### Flujos alternativos / Edge Cases

| Escenario | Comportamiento esperado | Categoria |
|-----------|------------------------|-----------|
| Cuenta bloqueada | El sistema muestra mensaje de bloqueo — no avanza al dashboard | Backend |
| Sesion expirada | Si el token vence durante el proceso — redirige a `/inicio` | Backend |
| Error de red | La API no responde — mensaje de error visible sin cambio de URL | Backend |
| RUT con formato correcto pero inexistente | El sistema muestra error en el paso 1 sin avanzar al paso 2 | Backend |

---

## 7. Criterios de aceptacion

| Criterio | Enunciado | Categoria |
|----------|-----------|-----------|
| **A** | Campo `input[name="current-password"]` aparece visible tras el paso 1 | Frontend |
| **B** | URL ya no contiene `/inicio` tras completar el paso 2 | Frontend |
| **C** | URL cambia a ruta del area autenticada tras autenticacion exitosa | Frontend + Backend |

---

**Criterio A** — Categoria: Frontend
```
DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
CUANDO  ingresa un RUT valido en input[name="rut"] y hace click en el boton continuar
ENTONCES el campo input[name="current-password"] aparece visible en pantalla
```

**Criterio B** — Categoria: Frontend
```
DADO    el campo contrasena es visible en el paso 2
CUANDO  el paciente ingresa su contrasena valida y hace click en el boton ingresar
ENTONCES la URL activa ya no contiene /inicio
```

**Criterio C** — Categoria: Frontend + Backend
```
DADO    el paciente completo ambos pasos del login con credenciales validas
CUANDO  Angular finaliza el proceso de autenticacion
ENTONCES la URL cambia a una ruta del area autenticada del portal
```

---

## 8. Restricciones

### Tecnicas
- El campo `input[name="current-password"]` solo aparece despues del paso 1 — el test debe esperar su renderizado con `timeout: 10000`
- Hay dos botones `button[type="submit"]` en el DOM — usar `.first()` para el paso 1
- Las credenciales se leen desde `cypress.env.json` usando `Cypress.env('BUPA_USER')` y `Cypress.env('BUPA_PASS')`
- `cypress.env.json` esta en `.gitignore` — nunca sube al repositorio

### De negocio
- El sistema BUPA bloquea la cuenta despues de varios intentos fallidos — los tests no deben usar credenciales invalidas repetidamente
- Las credenciales de prueba deben ser de una cuenta de testing dedicada — nunca de un paciente real
- El tiempo de respuesta del login no debe superar 5 segundos

### De seguridad
- La contrasena debe ingresarse con `{ log: false }` en Cypress para que no aparezca en los logs ni en videos del pipeline
- Las credenciales reales nunca deben hardcodearse en el codigo del spec
- En GitHub Actions las credenciales van como Secrets: `BUPA_USER` y `BUPA_PASS`

---

## 9. Notas — Decisiones abiertas y dudas

### Decisiones abiertas
- [ ] [Por confirmar] La URL post-login tiene un path fijo (ej. `/dashboard`) o varia segun el perfil del paciente?
- [ ] [Por confirmar] La cuenta de prueba usada en CI tiene riesgo de bloquearse por multiples ejecuciones del pipeline?
- [ ] [Por confirmar] El sistema diferencia el error entre RUT inexistente y contrasena incorrecta en el paso 2?

### Dudas
- [ ] Existe un endpoint de API para login directo sin UI que permita hacer `cy.loginApi()` en los tests que requieren sesion activa como precondicion?
- [ ] Cuantos intentos fallidos bloquean la cuenta? — critico para definir cuantos tests de credenciales invalidas son seguros correr en CI

---

## Conexion con Cypress — `bupa-login(003-007).cy.js`

| Criterio | Test | Comando Cypress |
|----------|------|-----------------|
| A | `it("REQ-003: campo contrasena aparece tras paso 1")` | `cy.get('input[name="current-password"]').should('be.visible')` |
| B | `it("REQ-003: URL cambia tras login exitoso")` | `cy.url().should('not.include', '/inicio')` |
| C | `it("REQ-003: paciente accede al area autenticada")` | `cy.url().should('not.include', '/inicio')` |
