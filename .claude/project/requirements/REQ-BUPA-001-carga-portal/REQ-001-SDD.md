# REQ-BUPA-001 — SDD
# Verificacion de carga del Portal Pacientes BUPA

| Campo | Detalle |
|-------|---------|
| **Autor** | Jaime Quiñelen Villar — QA Lead |
| **Spec file** | `bupa-smoke.cy.js` |
| **URL bajo prueba** | `https://portalpaciente.bupa.cl/inicio` |
| **Stack** | Angular 17 + Cypress 15 |
| **Herramienta** | cypress-axe + axe-core |
| **Fecha** | 2026-05-16 |

---

## 1. Titulo

Verificacion de carga del Portal Pacientes BUPA

---

## 2. Problema que se quiere resolver

Los pacientes de BUPA dependen del portal para acceder a citas y resultados medicos. Si el portal no carga o tarda demasiado, el paciente queda sin acceso a servicios criticos de salud sin que el equipo tecnico lo sepa. No existe validacion automatizada que confirme que el portal esta respondiendo correctamente antes de cada deploy.

---

## 3. Contexto de uso

- **Usuario:** cualquier paciente o visitante — no requiere autenticacion
- **Canal:** navegador web (Chrome, Firefox, Safari, Edge)
- **Dispositivo:** desktop y movil
- **Precondiciones:** ninguna — es el primer punto de contacto con el portal
- **URL:** `https://portalpaciente.bupa.cl/inicio`
- **Stack:** Angular 17 — el body se renderiza una vez que Angular completa el bootstrap

---

## 4. Objetivo

Verificar que el Portal Pacientes BUPA carga correctamente, responde en menos de 3 segundos y utiliza protocolo HTTPS con certificado SSL valido.

---

## 5. Alcance

**Incluye:**
- Verificacion de que el servidor responde y la pagina es visible
- Validacion de que la URL pertenece al dominio correcto (`portalpaciente.bupa.cl`)
- Medicion del tiempo de carga (umbral: 3000ms)
- Validacion de protocolo HTTPS y certificado SSL

**No incluye:**
- Visibilidad del formulario de login (REQ-BUPA-002)
- Proceso de autenticacion (`bupa-login.cy.js`)
- Metricas avanzadas LCP, FID, CLS (`bupa-performance.cy.js`)
- Tests en ambientes staging o pre-produccion

---

## 6. Comportamiento esperado

### Flujo principal

1. Navegar a `https://portalpaciente.bupa.cl/inicio` desde el navegador
2. El servidor responde y Angular renderiza la pagina
3. El cuerpo de la pagina se renderiza y es visible
4. La URL activa contiene `portalpaciente.bupa.cl`
5. El protocolo de la URL es `https:`
6. El tiempo total de carga es menor a 3000ms

### Flujos alternativos / Edge Cases

| Escenario | Comportamiento esperado |
|-----------|------------------------|
| Servidor caido | Cypress lanza error de conexion — test falla con timeout |
| Carga lenta (> 3s) | AssertionError de tiempo — test falla con ms reales registrados |
| Dominio incorrecto | URL no contiene `portalpaciente.bupa.cl` — test falla |
| HTTP sin HTTPS | Protocolo retorna `http:` — test falla por seguridad |

---

## 7. Criterios de aceptacion

> Cada criterio mapea directamente a un bloque `it()` en `bupa-smoke.cy.js`

**Criterio A**
```
DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
CUANDO  la pagina termina de cargar
ENTONCES el body es visible y la URL contiene portalpaciente.bupa.cl
```

**Criterio B**
```
DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
CUANDO  se mide el tiempo desde inicio de navegacion hasta que el body es visible
ENTONCES el tiempo transcurrido es menor a 3000 milisegundos
```

**Criterio C**
```
DADO    el paciente navega a https://portalpaciente.bupa.cl/inicio
CUANDO  se evalua el protocolo de la URL activa
ENTONCES el protocolo es https: confirmando certificado SSL valido
```

---

## 8. Restricciones

### Tecnicas
- El tiempo se mide con `Date.now()` en Cypress — incluye latencia de red del runner CI
- En runners CI (ubuntu) puede ser necesario aumentar el umbral a 4000ms por latencia de red
- Angular 17 requiere que el bootstrap complete antes de que `body` sea interactivo

### De negocio
- Tiempo de carga de 3 segundos es el estandar minimo para UX en salud (Google UX Research)
- SLA del portal BUPA: 99.9% de disponibilidad mensual
- Este test debe correr como **primer gate del pipeline** — si falla, los demas no corren

### De seguridad
- HTTPS obligatorio — datos de pacientes protegidos bajo Ley 19.628 de Chile
- HTTP sin cifrado no es aceptable para este portal bajo ningun escenario
- El certificado SSL debe ser valido y no expirado

---

## 9. Notas — Decisiones abiertas y dudas

### Decisiones abiertas
- [ ] [Por confirmar] El umbral de 3s aplica igual en CI que en produccion real?
- [ ] [Por confirmar] Se valida el titulo exacto de la pagina o solo que no este vacio?

### Dudas
- [ ] Existe un ambiente staging donde correr este smoke test antes del deploy a produccion?
- [ ] El equipo de DevOps tiene un health check endpoint (`/api/health`) que podria complementar este test?
- [ ] Se debe agregar monitoreo de uptime externo (Pingdom, UptimeRobot) para alertas fuera del pipeline?

---

## Conexion con Cypress — `bupa-smoke.cy.js`

| Criterio | Test | Comando Cypress |
|----------|------|-----------------|
| A | `it("REQ-001: portal carga correctamente")` | `cy.get("body").should("be.visible")` |
| B | `it("REQ-001: portal carga en menos de 3 segundos")` | `Date.now() < 3000ms` |
| C | `it("REQ-001: pagina tiene certificado HTTPS valido")` | `cy.location("protocol").should("eq","https:")` |
