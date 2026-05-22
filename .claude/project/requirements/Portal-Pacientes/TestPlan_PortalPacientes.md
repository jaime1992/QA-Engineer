# Plan de Pruebas Manuales — Portal Paciente
# Módulo Inicio — Dashboard Post-Login

| Campo | Detalle |
|-------|---------|
| **Célula** | Portal Pacientes |
| **Módulo** | Inicio (Dashboard post-login) |
| **URL** | https://portalpaciente.bupa.cl/inicio |
| **Autor** | Jaime Quiñelen Villar — QA Lead |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-19 |
| **Ambiente objetivo** | UAT / PROD |
| **Spec Cypress asociado** | Por definir |

---

## Resumen Ejecutivo

| Metrica | Valor |
|---|---|
| **Total TCs** | 26 (21 FP + 5 EC) |
| **Modulo** | Inicio — Dashboard post-login |
| **Ambiente** | UAT / PROD |
| **Tipo de prueba** | Manual |
| **Categorias cubiertas** | UI, UX, Frontend |
| **TCs Criticos** | 4 (TC-003, TC-007, TC-008, TC-001-EC, TC-002-EC) |
| **TCs de alta prioridad** | 12 |
| **Estado general** | Por Ejecutar |

### Distribucion de TCs por area

| Area | TCs | Ejemplos |
|---|---|---|
| **Header** | 3 FP + 2 EC | Logo, nombre usuario, cerrar sesion, sesion expirada |
| **Menu lateral** | 8 FP | Inicio, Mis citas, Historial, Examenes, Familia, Planes, Perfil, Ayuda |
| **Tarjetas de atencion** | 4 FP | Telemedicina, Consulta Medica, Dental, Examenes |
| **Accesos rapidos** | 3 FP | Proximas citas, Mis examenes, Historial de citas |
| **Otros elementos** | 3 FP | Saludo, texto subtitulo, seccion cirugia |
| **Responsive** | 2 EC | Tablet 768px, movil 375px |

### Criterios de exito (go/no-go)

| Criterio | Umbral |
|---|---|
| TCs FP en PASS | 100% antes de avanzar a PROD |
| TCs EC en PASS | 80% minimo |
| Bugs criticos abiertos | 0 |
| Pass rate global | >= 90% |

---

## 1. Objetivo

Verificar que el módulo Inicio del Portal Paciente BUPA funciona correctamente una vez autenticado el usuario, cubriendo la navegación del menú lateral, las tarjetas de atención, los accesos rápidos y los elementos del header, en los ambientes UAT y PROD.

---

## 2. Alcance

### Dentro del scope (IN)
- Header: logo, nombre de usuario y botón "Cerrar sesión"
- Menú lateral: Inicio, Mis citas, Historial de atenciones, Mis exámenes, Mi familia, Planes y Beneficios, Mi perfil, Centro de ayuda
- Sección "¿Qué tipo de atención necesitas?": tarjetas Telemedicina, Consulta Médica, Consulta Dental, Exámenes
- Sección "Accesos rápidos": Próximas citas, Mis exámenes, Historial de citas
- Sección "¿Necesitas Cotizar tu Cirugía?"
- Comportamiento responsive en tablet y móvil
- Comportamiento de sesión (expiración y cierre)

### Fuera del scope (OUT)
- Contenido interno de cada sección del menú (cubierto por planes independientes por módulo)
- Flujo completo de agendamiento de citas
- Flujo de login y recuperación de contraseña (célula distinta)

---

## 3. Criterios de Entrada y Salida

### Criterios de Entrada (Definition of Ready)
Antes de iniciar las pruebas, verificar que:

- [ ] El ambiente UAT/PROD está disponible y estable
- [ ] Se cuenta con credenciales de prueba válidas para el portal
- [ ] El equipo confirma que el módulo Inicio está listo para testing
- [ ] No hay bugs críticos bloqueantes sin resolver
- [ ] Los accesos al ambiente están disponibles

### Criterios de Salida (Definition of Done)
Las pruebas están completas cuando:

- [ ] Todos los TCs del plan fueron ejecutados (PASS, FAIL o No Aplica)
- [ ] No quedan TCs en estado "Por Ejecutar"
- [ ] Todos los bugs encontrados están registrados en Jira con trazabilidad al TC
- [ ] Los TCs críticos (FP) están todos en PASS antes de avanzar a PROD
- [ ] El registro de ejecución está completado (Sección 8)
- [ ] El resumen del plan está completado (Sección 9)

---

## 4. Estrategia por Categoría

| Categoría | Qué se valida | Tipo de prueba | Responsable |
|-----------|--------------|----------------|-------------|
| **UX** | Saludo personalizado, flujos de navegación, usabilidad general | Manual | QA Lead |
| **UI** | Visibilidad de elementos, layout, responsive, íconos, textos | Manual | QA Lead |
| **Frontend** | Navegación entre módulos, comportamiento de tarjetas y cards, gestión de sesión | Manual | QA Lead |

---

## 5. Datos de Prueba

| Dato | Valor | Ambiente | Notas |
|------|-------|----------|-------|
| URL del portal | `https://portalpaciente.bupa.cl/inicio` | PROD | |
| URL UAT | `https://portalpaciente.bupa.cl/inicio` | UAT | Provisional — usar PROD mientras se confirma URL UAT real |
| Usuario de prueba | Ver gestor de credenciales | UAT | No usar en PROD |
| Contraseña | Ver gestor de credenciales | UAT | No registrar aquí |
| Resolución desktop | 1280x720 | UAT / PROD | Resolución base |
| Resolución tablet | 768px | UAT | Edge case responsive |
| Resolución móvil | 375px | UAT | Edge case responsive |

---

## 6. Tabla Resumen de Casos de Prueba

| TC-ID | Menú | Título | Resultado Esperado | Tipo | Categoría | Severidad | Prioridad | Estado | Bug |
|-------|------|--------|--------------------|------|-----------|-----------|-----------|--------|-----|
| TC-001-FP | Header | Logo Mi Portal Bupa visible | Logo visible con ícono y texto legible, sin distorsión | FP | UI | Medium | Medium | Por Ejecutar | — |
| TC-002-FP | Header | Nombre de usuario en header | Ícono de persona + nombre del usuario autenticado visible | FP | UI | Medium | High | Por Ejecutar | — |
| TC-003-FP | Header | Botón "Cerrar sesión" visible y funcional | Botón visible; al hacer clic destruye sesión y redirige al login | FP | Frontend | Critical | High | Por Ejecutar | — |
| TC-004-FP | Inicio | Menú "Inicio" activo al cargar | Ítem "Inicio" resaltado en azul; demás ítems sin resaltar | FP | UI | Low | Medium | Por Ejecutar | — |
| TC-005-FP | Inicio | Saludo personalizado visible | "¡Hola [Nombre]!" visible con el nombre del usuario autenticado | FP | UX | Medium | High | Por Ejecutar | — |
| TC-006-FP | Inicio | Texto "¿Qué tipo de atención necesitas?" visible | Texto visible y legible sobre las tarjetas de atención | FP | UI | Low | Medium | Por Ejecutar | — |
| TC-007-FP | Inicio | Tarjeta "Telemedicina" visible y clicable | Tarjeta visible con ícono y texto; navega al flujo de Telemedicina | FP | Frontend | Critical | High | Por Ejecutar | — |
| TC-008-FP | Inicio | Tarjeta "Consulta Médica" visible y clicable | Tarjeta visible con ícono y texto; navega al flujo de Consulta Médica | FP | Frontend | Critical | High | Por Ejecutar | — |
| TC-009-FP | Inicio | Tarjeta "Consulta Dental" visible y clicable | Tarjeta visible con ícono y texto; navega al flujo de Consulta Dental | FP | Frontend | High | High | Por Ejecutar | — |
| TC-010-FP | Inicio | Tarjeta "Exámenes" visible y clicable | Tarjeta visible con ícono y texto; navega al flujo de Exámenes | FP | Frontend | High | High | Por Ejecutar | — |
| TC-011-FP | Inicio | Acceso rápido "Próximas citas" | Card visible con ícono y subtexto; navega al detalle de reservas | FP | Frontend | High | High | Por Ejecutar | — |
| TC-012-FP | Inicio | Acceso rápido "Mis exámenes" | Card visible con ícono y subtexto; navega a resultados de exámenes | FP | Frontend | High | High | Por Ejecutar | — |
| TC-013-FP | Inicio | Acceso rápido "Historial de citas" | Card visible con ícono y subtexto; navega al historial con recetas y órdenes | FP | Frontend | High | High | Por Ejecutar | — |
| TC-014-FP | Inicio | Sección "¿Necesitas Cotizar tu Cirugía?" visible | Sección visible y legible al hacer scroll | FP | UI | Medium | Medium | Por Ejecutar | — |
| TC-015-FP | Mis citas | Navegación a "Mis citas" | Sistema navega a sección de citas; ítem resaltado en menú | FP | Frontend | High | High | Por Ejecutar | — |
| TC-016-FP | Historial de atenciones | Navegación a "Historial de atenciones" | Sistema navega al historial clínico; ítem resaltado en menú | FP | Frontend | High | High | Por Ejecutar | — |
| TC-017-FP | Mis exámenes | Navegación a "Mis exámenes" | Sistema navega a sección de exámenes; ítem resaltado en menú | FP | Frontend | High | High | Por Ejecutar | — |
| TC-018-FP | Mi familia | Navegación a "Mi familia" | Sistema navega al grupo familiar; ítem resaltado en menú | FP | Frontend | Medium | Medium | Por Ejecutar | — |
| TC-019-FP | Planes y Beneficios | Navegación a "Planes y Beneficios" | Sistema navega a planes y coberturas; ítem resaltado en menú | FP | Frontend | High | High | Por Ejecutar | — |
| TC-020-FP | Mi perfil | Navegación a "Mi perfil" | Sistema navega a datos personales del paciente; ítem resaltado en menú | FP | Frontend | Medium | Medium | Por Ejecutar | — |
| TC-021-FP | Centro de ayuda | Navegación a "Centro de ayuda" | Sistema navega al contenido de ayuda; ítem resaltado en menú | FP | Frontend | Low | Low | Por Ejecutar | — |
| TC-001-EC | Header | Cerrar sesión y presionar "atrás" del navegador | Sistema bloquea acceso y redirige al login — no muestra contenido protegido | EC | Frontend | Critical | High | Por Ejecutar | — |
| TC-002-EC | Header | Sesión expirada — recarga de página | Sistema detecta sesión expirada y redirige al login con mensaje informativo | EC | Frontend | Critical | High | Por Ejecutar | — |
| TC-003-EC | Inicio | Nombre de usuario muy largo en saludo | Nombre se trunca o adapta sin romper el layout del header ni del saludo | EC | UI | Medium | Low | Por Ejecutar | — |
| TC-004-EC | Inicio | Responsive en tablet (768px) | Layout adaptado sin elementos superpuestos ni cortados a 768px | EC | UI | Medium | Medium | Por Ejecutar | — |
| TC-005-EC | Inicio | Responsive en móvil (375px) | Menú hamburguesa, tarjetas en columna única, sin scroll horizontal a 375px | EC | UI | High | Medium | Por Ejecutar | — |

> Estados posibles: `Por Ejecutar` | `PASS` | `FAIL` | `Bloqueado` | `No Aplica`

---

## 7. Detalle de Casos de Prueba

---

### TC-001-FP — Logo Mi Portal Bupa visible

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | UI |
| **Severidad** | Medium |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Observar la esquina superior izquierda de la pantalla

**Resultado esperado:**
- El logo "Mi Portal Bupa" es visible con ícono y texto legible
- El logo no presenta distorsión ni se superpone con otros elementos

**Criterio PASS/FAIL:**
- `PASS` si el logo aparece completo y legible en la esquina superior izquierda
- `FAIL` si el logo no aparece, está cortado o distorsionado

---

### TC-002-FP — Nombre de usuario en header

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | UI |
| **Severidad** | Medium |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Observar el encabezado superior de la página

**Resultado esperado:**
- Se muestra el ícono de persona junto al nombre del usuario autenticado
- El nombre corresponde al usuario con el que se inició sesión

**Criterio PASS/FAIL:**
- `PASS` si el nombre del usuario autenticado es visible en el header
- `FAIL` si aparece un nombre incorrecto, vacío o no se muestra el elemento

---

### TC-003-FP — Botón "Cerrar sesión" visible y funcional

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | Critical |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Verificar que el botón "Cerrar sesión" es visible en la esquina superior derecha
3. Hacer clic en "Cerrar sesión"

**Resultado esperado:**
- El botón es visible con ícono de flecha y texto "Cerrar sesión"
- Al hacer clic, el sistema destruye la sesión y redirige al login

**Criterio PASS/FAIL:**
- `PASS` si el botón cierra la sesión y redirige al login correctamente
- `FAIL` si el botón no es visible, no responde al clic o no destruye la sesión

---

### TC-004-FP — Menú "Inicio" activo al cargar

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | UI |
| **Severidad** | Low |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Observar el menú lateral izquierdo al cargar la página

**Resultado esperado:**
- El ítem "Inicio" aparece resaltado visualmente en azul
- Los demás ítems del menú aparecen sin resaltar

**Criterio PASS/FAIL:**
- `PASS` si "Inicio" está visualmente activo/seleccionado al cargar
- `FAIL` si ningún ítem está activo o si un ítem diferente aparece seleccionado

---

### TC-005-FP — Saludo personalizado visible

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | UX |
| **Severidad** | Medium |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Observar el área principal de la página de Inicio

**Resultado esperado:**
- El saludo "¡Hola [Nombre]!" es visible en la parte superior del contenido principal
- El nombre mostrado coincide con el usuario autenticado

**Criterio PASS/FAIL:**
- `PASS` si el saludo muestra el nombre correcto del usuario autenticado
- `FAIL` si el saludo no aparece, muestra un nombre incorrecto o aparece vacío

---

### TC-006-FP — Texto "¿Qué tipo de atención necesitas?" visible

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | UI |
| **Severidad** | Low |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Observar el subtítulo debajo del saludo

**Resultado esperado:**
- El texto "¿Qué tipo de atención necesitas?" es visible y legible
- El texto aparece correctamente posicionado sobre las tarjetas de atención

**Criterio PASS/FAIL:**
- `PASS` si el texto es visible y legible sobre las tarjetas
- `FAIL` si el texto no aparece o está mal posicionado

---

### TC-007-FP — Tarjeta "Telemedicina" visible y clicable

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | Critical |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Verificar que la tarjeta "Telemedicina" es visible con ícono y texto
3. Hacer clic sobre la tarjeta

**Resultado esperado:**
- La tarjeta muestra ícono de videocámara y texto "Telemedicina"
- Al hacer clic, el sistema navega al flujo de Telemedicina

**Criterio PASS/FAIL:**
- `PASS` si la tarjeta es visible y navega correctamente al flujo de Telemedicina
- `FAIL` si la tarjeta no aparece, no responde al clic o navega a una sección incorrecta

---

### TC-008-FP — Tarjeta "Consulta Médica" visible y clicable

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | Critical |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Verificar que la tarjeta "Consulta Médica" es visible con ícono y texto
3. Hacer clic sobre la tarjeta

**Resultado esperado:**
- La tarjeta muestra ícono de estetoscopio y texto "Consulta Médica"
- Al hacer clic, el sistema navega al flujo de Consulta Médica

**Criterio PASS/FAIL:**
- `PASS` si la tarjeta es visible y navega correctamente al flujo de Consulta Médica
- `FAIL` si la tarjeta no aparece, no responde al clic o navega a una sección incorrecta

---

### TC-009-FP — Tarjeta "Consulta Dental" visible y clicable

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | High |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Verificar que la tarjeta "Consulta Dental" es visible con ícono y texto
3. Hacer clic sobre la tarjeta

**Resultado esperado:**
- La tarjeta muestra ícono de diente y texto "Consulta Dental"
- Al hacer clic, el sistema navega al flujo de Consulta Dental

**Criterio PASS/FAIL:**
- `PASS` si la tarjeta es visible y navega correctamente al flujo de Consulta Dental
- `FAIL` si la tarjeta no aparece, no responde al clic o navega a una sección incorrecta

---

### TC-010-FP — Tarjeta "Exámenes" visible y clicable

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | High |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Verificar que la tarjeta "Exámenes" es visible con ícono y texto
3. Hacer clic sobre la tarjeta

**Resultado esperado:**
- La tarjeta muestra ícono de laboratorio y texto "Exámenes"
- Al hacer clic, el sistema navega al flujo de Exámenes

**Criterio PASS/FAIL:**
- `PASS` si la tarjeta es visible y navega correctamente al flujo de Exámenes
- `FAIL` si la tarjeta no aparece, no responde al clic o navega a una sección incorrecta

---

### TC-011-FP — Acceso rápido "Próximas citas"

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | High |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Localizar la sección "Accesos rápidos"
3. Verificar que el card "Próximas citas" es visible con subtexto "Revisa el detalle de tus reservas"
4. Hacer clic sobre el card o la flecha

**Resultado esperado:**
- El card es visible con ícono, título y subtexto descriptivo
- Al hacer clic, el sistema navega al detalle de reservas del paciente

**Criterio PASS/FAIL:**
- `PASS` si el card es visible y navega correctamente a las próximas citas
- `FAIL` si el card no aparece, no responde al clic o navega a una sección incorrecta

---

### TC-012-FP — Acceso rápido "Mis exámenes"

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | High |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Localizar la sección "Accesos rápidos"
3. Verificar que el card "Mis exámenes" es visible con subtexto "Conoce el resultado de tus exámenes"
4. Hacer clic sobre el card o la flecha

**Resultado esperado:**
- El card es visible con ícono, título y subtexto descriptivo
- Al hacer clic, el sistema navega a los resultados de exámenes del paciente

**Criterio PASS/FAIL:**
- `PASS` si el card es visible y navega correctamente a los resultados de exámenes
- `FAIL` si el card no aparece, no responde al clic o navega a una sección incorrecta

---

### TC-013-FP — Acceso rápido "Historial de citas"

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | High |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Localizar la sección "Accesos rápidos"
3. Verificar que el card "Historial de citas" es visible con subtexto "Accede a tus Recetas, Ordenes Clínicas y más"
4. Hacer clic sobre el card o la flecha

**Resultado esperado:**
- El card es visible con ícono, título y subtexto descriptivo
- Al hacer clic, el sistema navega al historial de citas con recetas y órdenes clínicas

**Criterio PASS/FAIL:**
- `PASS` si el card es visible y navega correctamente al historial de citas
- `FAIL` si el card no aparece, no responde al clic o navega a una sección incorrecta

---

### TC-014-FP — Sección "¿Necesitas Cotizar tu Cirugía?" visible

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | UI |
| **Severidad** | Medium |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Desplazarse hacia abajo en la página de Inicio
3. Localizar la sección de cotización de cirugía

**Resultado esperado:**
- La sección "¿Necesitas Cotizar tu Cirugía?" es visible con texto e imagen o elemento interactivo

**Criterio PASS/FAIL:**
- `PASS` si la sección es visible y legible al hacer scroll
- `FAIL` si la sección no aparece o sus elementos están rotos

---

### TC-015-FP — Navegación a "Mis citas"

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | High |
| **Precondición** | Usuario autenticado en el portal, en la página de Inicio |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Hacer clic en "Mis citas" en el menú lateral

**Resultado esperado:**
- El sistema navega a la sección de citas del paciente
- El ítem "Mis citas" queda resaltado en el menú lateral

**Criterio PASS/FAIL:**
- `PASS` si la navegación es exitosa y se muestra el contenido de Mis citas
- `FAIL` si el ítem no responde, navega a otra sección o muestra error

---

### TC-016-FP — Navegación a "Historial de atenciones"

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | High |
| **Precondición** | Usuario autenticado en el portal, en la página de Inicio |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Hacer clic en "Historial de atenciones" en el menú lateral

**Resultado esperado:**
- El sistema navega al historial clínico del paciente
- El ítem "Historial de atenciones" queda resaltado en el menú lateral

**Criterio PASS/FAIL:**
- `PASS` si la navegación es exitosa y se muestra el historial de atenciones
- `FAIL` si el ítem no responde, navega a otra sección o muestra error

---

### TC-017-FP — Navegación a "Mis exámenes"

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | High |
| **Precondición** | Usuario autenticado en el portal, en la página de Inicio |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Hacer clic en "Mis exámenes" en el menú lateral

**Resultado esperado:**
- El sistema navega a la sección de exámenes del paciente
- El ítem "Mis exámenes" queda resaltado en el menú lateral

**Criterio PASS/FAIL:**
- `PASS` si la navegación es exitosa y se muestra el contenido de Mis exámenes
- `FAIL` si el ítem no responde, navega a otra sección o muestra error

---

### TC-018-FP — Navegación a "Mi familia"

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | Medium |
| **Precondición** | Usuario autenticado en el portal, en la página de Inicio |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Hacer clic en "Mi familia" en el menú lateral

**Resultado esperado:**
- El sistema navega a la sección del grupo familiar asociado al titular
- El ítem "Mi familia" queda resaltado en el menú lateral

**Criterio PASS/FAIL:**
- `PASS` si la navegación es exitosa y se muestra el contenido de Mi familia
- `FAIL` si el ítem no responde, navega a otra sección o muestra error

---

### TC-019-FP — Navegación a "Planes y Beneficios"

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | High |
| **Precondición** | Usuario autenticado en el portal, en la página de Inicio |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Hacer clic en "Planes y Beneficios" en el menú lateral

**Resultado esperado:**
- El sistema navega a la sección de planes y coberturas vigentes del paciente
- El ítem "Planes y Beneficios" queda resaltado en el menú lateral

**Criterio PASS/FAIL:**
- `PASS` si la navegación es exitosa y se muestra el contenido de Planes y Beneficios
- `FAIL` si el ítem no responde, navega a otra sección o muestra error

---

### TC-020-FP — Navegación a "Mi perfil"

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | Medium |
| **Precondición** | Usuario autenticado en el portal, en la página de Inicio |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Hacer clic en "Mi perfil" en el menú lateral

**Resultado esperado:**
- El sistema navega a la sección de datos personales del paciente
- El ítem "Mi perfil" queda resaltado en el menú lateral

**Criterio PASS/FAIL:**
- `PASS` si la navegación es exitosa y se muestran los datos del perfil del usuario
- `FAIL` si el ítem no responde, navega a otra sección o muestra error

---

### TC-021-FP — Navegación a "Centro de ayuda"

| Campo | Detalle |
|-------|---------|
| **Tipo** | Flujo Principal |
| **Categoría** | Frontend |
| **Severidad** | Low |
| **Precondición** | Usuario autenticado en el portal, en la página de Inicio |
| **Ambiente** | UAT / PROD |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Hacer clic en "Centro de ayuda" en el menú lateral

**Resultado esperado:**
- El sistema navega al contenido de ayuda disponible para el paciente
- El ítem "Centro de ayuda" queda resaltado en el menú lateral

**Criterio PASS/FAIL:**
- `PASS` si la navegación es exitosa y se muestra el contenido de ayuda
- `FAIL` si el ítem no responde, navega a otra sección o muestra error

---

### TC-001-EC — Cerrar sesión y presionar "atrás" del navegador

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case |
| **Categoría** | Frontend |
| **Severidad** | Critical |
| **Precondición** | Usuario autenticado en el portal |
| **Ambiente** | UAT |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Hacer clic en "Cerrar sesión"
3. Una vez en el login, presionar el botón "Atrás" del navegador

**Resultado esperado:**
- El sistema no permite acceder al contenido protegido sin autenticarse nuevamente
- Redirige al login o muestra mensaje de sesión inválida

**Criterio PASS/FAIL:**
- `PASS` si el sistema bloquea el acceso y redirige al login
- `FAIL` si el sistema permite ver contenido del portal sin autenticación activa

---

### TC-002-EC — Sesión expirada — recarga de página

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case |
| **Categoría** | Frontend |
| **Severidad** | Critical |
| **Precondición** | Usuario autenticado cuya sesión ha expirado por inactividad |
| **Ambiente** | UAT |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Dejar inactiva la sesión hasta que expire el token
3. Recargar la página (F5)

**Resultado esperado:**
- El sistema detecta la sesión expirada y redirige al login
- Se muestra un mensaje informando que la sesión ha expirado

**Criterio PASS/FAIL:**
- `PASS` si el sistema redirige al login con mensaje de sesión expirada
- `FAIL` si el sistema permite continuar navegando con sesión inválida o no muestra ningún mensaje

---

### TC-003-EC — Nombre de usuario muy largo en saludo

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case |
| **Categoría** | UI |
| **Severidad** | Medium |
| **Precondición** | Existe un usuario con nombre extenso (más de 30 caracteres) en el sistema |
| **Ambiente** | UAT |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con un usuario cuyo nombre sea muy extenso
2. Observar el saludo "¡Hola [Nombre]!" y el header

**Resultado esperado:**
- El nombre se trunca o adapta correctamente sin romper el layout del header ni del saludo
- No se superpone con otros elementos de la interfaz

**Criterio PASS/FAIL:**
- `PASS` si el layout se mantiene íntegro con nombres extensos
- `FAIL` si el nombre rompe el diseño o se superpone con otros elementos

---

### TC-004-EC — Responsive en tablet (768px)

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case |
| **Categoría** | UI |
| **Severidad** | Medium |
| **Precondición** | Usuario autenticado; navegador con viewport en 768px de ancho |
| **Ambiente** | UAT |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Redimensionar el navegador a 768px de ancho (o usar DevTools)
3. Verificar el menú lateral, tarjetas y accesos rápidos

**Resultado esperado:**
- El layout se adapta correctamente sin elementos superpuestos ni cortados
- Todos los elementos del menú y las tarjetas son accesibles

**Criterio PASS/FAIL:**
- `PASS` si todos los elementos son visibles y funcionales a 768px
- `FAIL` si hay elementos superpuestos, cortados o inaccesibles

---

### TC-005-EC — Responsive en móvil (375px)

| Campo | Detalle |
|-------|---------|
| **Tipo** | Edge Case |
| **Categoría** | UI |
| **Severidad** | High |
| **Precondición** | Usuario autenticado; navegador con viewport en 375px de ancho |
| **Ambiente** | UAT |
| **Automatizado** | No |

**Pasos:**
1. Ingresar al portal con credenciales válidas
2. Redimensionar el navegador a 375px de ancho (o usar DevTools — iPhone SE)
3. Verificar el menú, tarjetas, accesos rápidos y header

**Resultado esperado:**
- El menú lateral se transforma en menú hamburguesa o se adapta para móvil
- Las tarjetas y cards se reorganizan en columna única sin truncarse
- Todos los elementos son accesibles sin scroll horizontal

**Criterio PASS/FAIL:**
- `PASS` si el portal es completamente usable a 375px sin scroll horizontal
- `FAIL` si hay scroll horizontal, elementos superpuestos o funcionalidades inaccesibles

---

## 8. Registro de Ejecución

| TC-ID | Estado | Fecha | Ejecutado por | Ambiente | Bug Jira | Notas |
|-------|--------|-------|---------------|----------|----------|-------|
| TC-001-FP | Por Ejecutar | — | — | — | — | — |
| TC-002-FP | Por Ejecutar | — | — | — | — | — |
| TC-003-FP | Por Ejecutar | — | — | — | — | — |
| TC-004-FP | Por Ejecutar | — | — | — | — | — |
| TC-005-FP | Por Ejecutar | — | — | — | — | — |
| TC-006-FP | Por Ejecutar | — | — | — | — | — |
| TC-007-FP | Por Ejecutar | — | — | — | — | — |
| TC-008-FP | Por Ejecutar | — | — | — | — | — |
| TC-009-FP | Por Ejecutar | — | — | — | — | — |
| TC-010-FP | Por Ejecutar | — | — | — | — | — |
| TC-011-FP | Por Ejecutar | — | — | — | — | — |
| TC-012-FP | Por Ejecutar | — | — | — | — | — |
| TC-013-FP | Por Ejecutar | — | — | — | — | — |
| TC-014-FP | Por Ejecutar | — | — | — | — | — |
| TC-015-FP | Por Ejecutar | — | — | — | — | — |
| TC-016-FP | Por Ejecutar | — | — | — | — | — |
| TC-017-FP | Por Ejecutar | — | — | — | — | — |
| TC-018-FP | Por Ejecutar | — | — | — | — | — |
| TC-019-FP | Por Ejecutar | — | — | — | — | — |
| TC-020-FP | Por Ejecutar | — | — | — | — | — |
| TC-021-FP | Por Ejecutar | — | — | — | — | — |
| TC-001-EC | Por Ejecutar | — | — | — | — | — |
| TC-002-EC | Por Ejecutar | — | — | — | — | — |
| TC-003-EC | Por Ejecutar | — | — | — | — | — |
| TC-004-EC | Por Ejecutar | — | — | — | — | — |
| TC-005-EC | Por Ejecutar | — | — | — | — | — |

> Completar durante y después de la ejecución. Agregar link al bug de Jira en la columna Bug.

---

## 9. Resumen del Plan

| Métrica | Valor |
|---------|-------|
| **Total TCs planificados** | 26 |
| **TCs Flujo Principal (FP)** | 21 |
| **TCs Edge Case (EC)** | 5 |
| **TCs ejecutados** | 0 |
| **PASS** | 0 |
| **FAIL** | 0 |
| **Bloqueados** | 0 |
| **No Aplica** | 0 |
| **Pass Rate** | — |
| **Bugs encontrados** | 0 |
| **Bugs críticos/altos** | 0 |
| **Cobertura alcanzada** | — |

### Estado final del plan

- [ ] Todos los TCs FP en PASS → listo para avanzar a siguiente ambiente
- [ ] Bugs críticos/altos resueltos antes de avanzar
- [ ] Registro de ejecución completo
- [ ] Resultados cargados en Jira

### Observaciones

> [Notas del QA Lead sobre la ejecución, hallazgos importantes, riesgos identificados o decisiones tomadas durante las pruebas]
