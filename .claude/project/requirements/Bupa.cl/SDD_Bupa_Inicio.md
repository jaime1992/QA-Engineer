# SDD — Página de Inicio Bupa Chile

| Campo | Detalle |
|-------|---------|
| **Célula** | Bupa Chile — Sitio Corporativo |
| **URL** | https://www.bupa.cl/ |
| **Autor** | Jaime Quiñelen Villar — QA Lead |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-23 |
| **Ambiente** | PROD |
| **Estado** | Activo |

---

## 1. Título

Página de Inicio Bupa Chile — Validación Completa de Componentes y Navegación

---

## 2. Problema que se quiere resolver

El sitio corporativo `bupa.cl` es el punto de entrada principal para usuarios que buscan información sobre los servicios de salud del grupo Bupa Chile. Sin una validación sistemática de sus componentes, existe riesgo de que elementos críticos como el menú de navegación, los CTAs, las tarjetas de unidades de negocio o el footer presenten fallas visuales, enlaces rotos o comportamientos inconsistentes que afecten la experiencia del usuario y la imagen corporativa.

---

## 3. Contexto de uso

- **Quién:** Usuario anónimo (ciudadano, paciente, proveedor, periodista) que accede al sitio corporativo de Bupa Chile
- **Cuándo:** Cualquier visita al sitio sin autenticación previa
- **Sistema / Plataforma:** Sitio web público, accesible desde desktop y dispositivos móviles
- **Navegadores objetivo:** Chrome, Firefox, Edge (últimas versiones)
- **Precondición:** No se requiere login. El sitio es de acceso público
- **Ambiente:** Producción — `https://www.bupa.cl/`

---

## 4. Objetivo

Verificar que todos los componentes de la página de inicio de `bupa.cl` se renderizan correctamente, los elementos interactivos responden según lo esperado, los enlaces y CTAs navegan a las rutas correctas, y el comportamiento de la página es consistente en desktop.

---

## 5. Alcance

**Incluye:**
- Header: logo, menú principal, menú desplegable (Nosotros, Sostenibilidad), buscador, selector de tema claro/oscuro
- Top bar: Segmento Prestador, Segmento Asegurador, Blua Salud Digital
- Banner de cookies: visibilidad y cierre
- Sección 1 — Hero: Documental Historias del Futuro (título, descripción, botón "Ver más", imagen)
- Sección 2 — Somos Bupa Chile: propósito corporativo (texto, botón "Ver más", imagen)
- Sección 3 — Salud del Futuro (Blua): texto promocional, botón "Ver más", imagen
- Sección 4 — Mindplace: título, descripción, botón "Conoce más aquí", imagen
- Sección 5 — Sostenibilidad: texto, botón "Ingresa aquí", imagen
- Sección 6 — Lo que Hacemos: 7 tarjetas interactivas (IntegraMédica, Clínica Bupa Santiago, Clínica Bupa Reñaca, Clínica Bupa Antofagasta, Bupa Seguros, Isapre CruzBlanca, Bupa Lab)
- Sección 7 — Somos Bupa: descripción corporativa global, botón "Conoce más"
- Sección 8 — Estrategia #OneHealth: texto, botón "Conoce más"
- Sección 9 — Sala de Prensa: 3 artículos destacados, botón "Ver todas las noticias"
- Sección 10 — Certificaciones: logos y sellos visibles
- Sección 11 — Alianzas: logos de organizaciones aliadas
- Sección 12 — Footer: menú (Sobre Nosotros, Lo que hacemos, Responsabilidad, Sostenibilidad), redes sociales (LinkedIn, Instagram), Políticas de Privacidad, botón volver arriba

**No incluye:**
- Contenido interno de páginas a las que navegan los CTAs (ej: página de IntegraMédica, Clínica Bupa)
- Flujos de autenticación o formularios de contacto internos
- Comportamiento responsive en tablet y móvil (se documenta en SDD separado)
- Validación del buscador interno (funcionalidad — SDD independiente)
- Contenido dinámico de Sala de Prensa (artículos publicados — fuera del scope de QA frontend)

---

## 6. Comportamiento esperado

> Categorías posibles: `Frontend` | `UX` | `UI` | `Backend`

### Flujo principal

| # | Paso | Categoría |
|---|------|-----------|
| 1 | Ingresar a `https://www.bupa.cl/` | Frontend |
| 2 | Verificar que el banner de cookies es visible y el botón de cierre funciona | UI |
| 3 | Verificar que el logo Bupa Chile es visible en el header | UI |
| 4 | Verificar que el menú principal muestra: Segmento Prestador, Segmento Asegurador, Nosotros, Sostenibilidad, Blua Salud Digital | UI |
| 5 | Hacer clic en "Nosotros" y verificar que el desplegable muestra: Nuestra Estrategia, Cultura y Valores, Nuestra historia, Directorio, Comité de Dirección | Frontend |
| 6 | Hacer clic en "Sostenibilidad" y verificar que el desplegable muestra: Medioambiente, Comunidad, Gobernanza | Frontend |
| 7 | Verificar que el buscador es visible y clicable | UI |
| 8 | Verificar que el selector de tema claro/oscuro es visible y funciona | UX |
| 9 | Verificar que la sección Hero carga con título, descripción e imagen; el botón "Ver más" es clicable | UI |
| 10 | Verificar que la sección "Somos Bupa Chile" muestra texto, imagen y botón "Ver más" funcional | UI |
| 11 | Verificar que la sección Blua/Salud del Futuro muestra texto, imagen y botón "Ver más" funcional | UI |
| 12 | Verificar que la sección Mindplace muestra título, descripción, imagen y botón "Conoce más aquí" funcional | UI |
| 13 | Verificar que la sección Sostenibilidad muestra texto, imagen y botón "Ingresa aquí" funcional | UI |
| 14 | Verificar que la sección "Lo que Hacemos" muestra las 7 tarjetas con nombre y descripción correctos | UI |
| 15 | Hacer clic en cada tarjeta de "Lo que Hacemos" y verificar que navega a la URL correspondiente | Frontend |
| 16 | Verificar que la sección "Somos Bupa" muestra texto e imagen y el botón "Conoce más" es funcional | UI |
| 17 | Verificar que la sección #OneHealth muestra texto, imagen y botón "Conoce más" funcional | UI |
| 18 | Verificar que la Sala de Prensa muestra 3 artículos con imagen y título; el botón "Ver todas las noticias" es funcional | UI |
| 19 | Verificar que la sección Certificaciones muestra los logos correctamente sin distorsión | UI |
| 20 | Verificar que la sección Alianzas muestra los logos correctamente | UI |
| 21 | Verificar que el Footer muestra los 4 bloques de menú, enlaces de redes sociales y Políticas de Privacidad | UI |
| 22 | Verificar que el botón "volver arriba" aparece al hacer scroll y funciona correctamente | UX |

### Flujos alternativos / Edge cases

| Escenario | Comportamiento esperado | Categoría |
|-----------|------------------------|-----------|
| El usuario cierra el banner de cookies | El banner desaparece y no vuelve a aparecer en la misma sesión | Frontend |
| El usuario activa el modo oscuro | La página cambia su paleta de colores a tema oscuro sin romper el layout | UX |
| El usuario hace clic en LinkedIn (footer) | Abre en pestaña nueva el perfil oficial de Bupa Chile en LinkedIn | Frontend |
| El usuario hace clic en "Políticas de Privacidad" | Navega a la página de políticas sin error 404 | Frontend |
| El usuario hace scroll al final y usa "volver arriba" | La página hace scroll suave al inicio | UX |
| El desplegable "Nosotros" queda abierto y el usuario hace clic fuera | El desplegable se cierra | Frontend |
| La Sala de Prensa no tiene artículos disponibles | Se muestra estado vacío o mensaje informativo sin error visible | Frontend |

---

## 7. Criterios de aceptación

> Formato: **Dado** [estado inicial] **Cuando** [acción] **Entonces** [resultado verificable]

- **Categoría:** UI
  **Dado** que el usuario accede a `https://www.bupa.cl/`
  **Cuando** la página termina de cargar
  **Entonces** el logo Bupa Chile es visible en la esquina superior izquierda sin distorsión

- **Categoría:** UI
  **Dado** que el usuario accede a `https://www.bupa.cl/`
  **Cuando** la página termina de cargar
  **Entonces** el menú principal muestra los ítems: Segmento Prestador, Segmento Asegurador, Nosotros, Sostenibilidad, Blua Salud Digital

- **Categoría:** Frontend
  **Dado** que el usuario está en la página de inicio
  **Cuando** hace clic en "Nosotros" del menú
  **Entonces** se despliega un submenú con: Nuestra Estrategia, Cultura y Valores, Nuestra historia, Directorio, Comité de Dirección

- **Categoría:** Frontend
  **Dado** que el usuario está en la página de inicio
  **Cuando** hace clic en "Sostenibilidad" del menú
  **Entonces** se despliega un submenú con: Medioambiente, Comunidad, Gobernanza

- **Categoría:** UI
  **Dado** que el usuario accede a la página por primera vez
  **Cuando** la página carga
  **Entonces** el banner de cookies es visible con un botón para cerrarlo

- **Categoría:** Frontend
  **Dado** que el banner de cookies está visible
  **Cuando** el usuario hace clic en el botón de cierre
  **Entonces** el banner desaparece y no se vuelve a mostrar en la misma sesión

- **Categoría:** UX
  **Dado** que el usuario está en la página de inicio
  **Cuando** hace clic en el selector de tema oscuro
  **Entonces** la página cambia a paleta de colores oscura sin romper el layout ni ocultar contenido

- **Categoría:** UI
  **Dado** que el usuario accede a la página de inicio
  **Cuando** la página carga
  **Entonces** la sección Hero muestra título "Documental Historias del Futuro", descripción, imagen y botón "Ver más" visible y clicable

- **Categoría:** Frontend
  **Dado** que la sección "Lo que Hacemos" es visible
  **Cuando** el usuario la visualiza
  **Entonces** se muestran exactamente 7 tarjetas: IntegraMédica, Clínica Bupa Santiago, Clínica Bupa Reñaca, Clínica Bupa Antofagasta, Bupa Seguros, Isapre CruzBlanca, Bupa Lab

- **Categoría:** Frontend
  **Dado** que las 7 tarjetas de "Lo que Hacemos" están visibles
  **Cuando** el usuario hace clic en cualquier tarjeta
  **Entonces** el sistema navega a la URL correspondiente a esa unidad de negocio sin error 404

- **Categoría:** UI
  **Dado** que el usuario hace scroll hasta la Sala de Prensa
  **Cuando** la sección es visible
  **Entonces** se muestran al menos 1 artículo con imagen y título, y el botón "Ver todas las noticias" es clicable

- **Categoría:** UI
  **Dado** que el usuario hace scroll hasta el footer
  **Cuando** el footer es visible
  **Entonces** se muestran los 4 bloques de menú (Sobre Nosotros, Lo que hacemos, Responsabilidad, Sostenibilidad), íconos de LinkedIn e Instagram y enlace a Políticas de Privacidad

- **Categoría:** Frontend
  **Dado** que el usuario hace clic en el ícono de LinkedIn en el footer
  **Cuando** se ejecuta la acción
  **Entonces** se abre en una pestaña nueva el perfil oficial de Bupa Chile en LinkedIn

- **Categoría:** UX
  **Dado** que el usuario ha hecho scroll hacia abajo en la página
  **Cuando** hace clic en el botón "volver arriba"
  **Entonces** la página hace scroll hacia el inicio de forma suave

---

## 8. Restricciones

**Técnicas:**
- El sitio usa JavaScript para menús desplegables y selector de tema — las pruebas deben ejecutarse con JS habilitado
- El banner de cookies depende del estado de la sesión/localStorage — limpiar cookies entre ejecuciones para garantizar reproducibilidad
- Las imágenes de hero y secciones se cargan desde CDN — validar que no presenten error 404 ni se muestren rotas
- El selector de tema oscuro/claro puede depender de `prefers-color-scheme` del sistema operativo

**De negocio:**
- El contenido de Sala de Prensa es dinámico — la cantidad de artículos puede variar; validar que siempre se muestre al menos 1
- Las tarjetas de "Lo que Hacemos" representan unidades de negocio reales — un enlace roto afecta directamente la imagen corporativa
- El sitio es de acceso público — no requiere autenticación para ninguna sección del alcance

**De seguridad:**
- El sitio debe servir contenido exclusivamente sobre HTTPS — verificar que no existan recursos mixtos (HTTP)
- Los enlaces externos (LinkedIn, Instagram) deben abrirse en pestaña nueva con atributo `rel="noopener noreferrer"`
- El banner de cookies debe cumplir con la normativa de privacidad vigente en Chile

---

## 9. Notas

**Decisiones abiertas:**
- [Por confirmar] ¿Existe ambiente de staging o UAT para `bupa.cl`? Si existe, replicar este SDD para ese ambiente
- [Por confirmar] ¿Las pruebas responsive (tablet/móvil) se documentan en este SDD o en uno independiente?
- [Por confirmar] ¿Se incluye validación de performance (tiempo de carga) como criterio de aceptación?

**Dudas:**
- ¿El selector de tema oscuro/claro persiste entre sesiones o solo aplica a la sesión actual?
- ¿La sección "Documental Historias del Futuro" en el Hero es contenido fijo o rotativo?
- ¿Existen criterios de aceptación de accesibilidad (WCAG) definidos para este sitio?
- ¿El buscador del header busca solo dentro de `bupa.cl` o redirige a un motor externo?
