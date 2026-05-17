# Test Cases — REQ-BUPA-001
# Verificacion de carga del Portal Pacientes BUPA

| Campo | Detalle |
|-------|---------|
| **Spec** | `bupa-smoke.cy.js` |
| **Ambiente** | DEV/UAT/PROD (flujo principal) / DEV-UAT (edge cases) |
| **Ejecutado por** | Jaime Quiñelen Villar |

---

## Resultados de Ejecucion

| TC-ID | Titulo | Tipo | Ambiente | Estado | Fecha | Bug |
|-------|--------|------|----------|--------|-------|-----|
| TC-001-FP | Portal carga correctamente | Flujo Principal | UAT/PROD | Por Ejecutar | — | — |
| TC-002-FP | Portal carga en menos de 3 segundos | Flujo Principal | UAT/PROD | Por Ejecutar | — | — |
| TC-003-FP | Portal utiliza HTTPS con certificado SSL valido | Flujo Principal | UAT/PROD | Por Ejecutar | — | — |
| TC-001-EC | Servidor caido genera error de conexion | Edge Case | UAT | Por Ejecutar | — | — |
| TC-002-EC | Carga lenta superior a 3 segundos | Edge Case | UAT | Por Ejecutar | — | — |
| TC-003-EC | Dominio incorrecto es detectado | Edge Case | UAT | Por Ejecutar | — | — |
| TC-004-EC | Protocolo HTTP sin cifrado es detectado | Edge Case | UAT | Por Ejecutar | — | — |

> Estados posibles: `Por Ejecutar` | `PASS` | `FAIL` | `Bloqueado` | `No Aplica`

---

## TC-001-A — Portal carga correctamente

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio A |
| **Precondicion** | Ninguna — no requiere autenticacion |
| **Ambiente** | DEV / UAT / PROD |

**Pasos:**
1. Abrir el navegador (Chrome, Firefox, Safari o Edge)
2. Navegar a `https://portalpaciente.bupa.cl/inicio`
3. Esperar a que la pagina termine de cargar

**Resultado esperado:**
- El cuerpo de la pagina es visible
- La URL activa contiene `portalpaciente.bupa.cl`

---

## TC-001-B — Portal carga en menos de 3 segundos

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio B |
| **Precondicion** | Ninguna |
| **Ambiente** | DEV / UAT / PROD |

**Pasos:**
1. Abrir el navegador y abrir DevTools (F12) → pestaña Network
2. Limpiar el cache del navegador
3. Navegar a `https://portalpaciente.bupa.cl/inicio`
4. Observar el tiempo de carga total en Network (columna Time o el indicador inferior)

**Resultado esperado:**
- El tiempo de carga total es **menor a 3000ms**

**Resultado obtenido:** _(completar al ejecutar)_

---

## TC-001-C — Portal utiliza HTTPS con certificado SSL valido

| Campo | Detalle |
|-------|---------|
| **Criterio SDD** | Criterio C |
| **Precondicion** | Ninguna |
| **Ambiente** | DEV / UAT / PROD |

**Pasos:**
1. Navegar a `https://portalpaciente.bupa.cl/inicio`
2. Verificar el icono de candado en la barra de direcciones del navegador
3. Hacer clic en el candado → verificar que el certificado es valido y no expirado

**Resultado esperado:**
- La URL comienza con `https:`
- El certificado SSL es valido, no expirado y pertenece al dominio `portalpaciente.bupa.cl`

---

## TC-001-EC1 — Servidor caido genera error de conexion

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case — simulado en DEV/UAT |
| **Precondicion** | Ambiente DEV o UAT con servidor apagado o inaccesible |
| **Ambiente** | DEV / UAT |

**Pasos:**
1. Solicitar al equipo de DevOps que deje el servidor inaccesible en DEV
2. Intentar navegar a la URL del portal en DEV
3. Observar el mensaje de error en el navegador

**Resultado esperado:**
- El navegador muestra error de conexion (timeout o "No se puede acceder al sitio")
- El equipo recibe alerta del fallo

---

## TC-001-EC2 — Carga lenta superior a 3 segundos

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case — simulado en DEV/UAT |
| **Precondicion** | Ambiente DEV con throttling de red configurado |
| **Ambiente** | DEV / UAT |

**Pasos:**
1. Abrir DevTools → Network → seleccionar throttling "Slow 3G"
2. Navegar a la URL del portal en DEV
3. Observar el tiempo de carga en Network

**Resultado esperado:**
- El tiempo supera 3000ms
- El test falla registrando los ms reales — se crea bug si ocurre en produccion

---

## TC-001-EC3 — Dominio incorrecto es detectado

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case |
| **Precondicion** | Ambiente DEV con redirect configurado a dominio externo |
| **Ambiente** | DEV / UAT |

**Pasos:**
1. Navegar a la URL del portal en DEV
2. Verificar la URL activa despues de cualquier redirect

**Resultado esperado:**
- La URL activa contiene `portalpaciente.bupa.cl`
- Si hay redirect a otro dominio, el test lo detecta y falla

---

## TC-001-EC4 — Protocolo HTTP sin cifrado es detectado

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case — seguridad |
| **Precondicion** | Ninguna |
| **Ambiente** | DEV / UAT |

**Pasos:**
1. Navegar intencionalmente a `http://portalpaciente.bupa.cl/inicio` (sin S)
2. Observar si el servidor redirige a HTTPS o responde por HTTP

**Resultado esperado:**
- El servidor redirige automaticamente a `https:`
- Si no hay redirect, es un fallo de seguridad — crear bug de severidad **Critica**
