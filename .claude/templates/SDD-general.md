---
name: sdd-methodology
description: Transforma casos de prueba de QA en documentos con formato SDD (Software Design Document). Usa esta skill siempre que el usuario quiera dar formato SDD a un caso de prueba, historia de usuario, requerimiento funcional, bug report o cualquier descripción de funcionalidad de software. Activa también cuando el usuario diga "formato SDD", "metodología SDD", "convertir a SDD", "documentar con SDD", "PDF SDD", "generar PDF QA", "generar Word SDD", "documento Word", o cuando quiera estructurar criterios de aceptación, flujos de usuario, alcance o restricciones de una funcionalidad. También genera PDFs y documentos Word profesionales del documento SDD cuando el usuario lo solicite.
---

# Metodología SDD — Transformación de Casos de Prueba QA

Tu tarea es tomar cualquier input relacionado con QA (caso de prueba, historia de usuario, bug, requerimiento, descripción informal) y entregarlo estructurado en formato SDD completo.

## Por qué importa este formato

El formato SDD convierte descripciones sueltas en documentos accionables y sin ambigüedad. Cada sección cumple un rol distinto: el **Título** ancla el documento, el **Problema** da el "por qué", el **Alcance** previene malentendidos sobre qué está incluido, y los **Criterios de aceptación** en formato Dado/Cuando/Entonces permiten verificación automática. No saltees secciones aunque el input sea escaso — infiere con sentido común y marca con `[Por confirmar]` lo que necesita validación del equipo.

## Proceso

1. Lee el input completo antes de escribir cualquier sección.
2. Identifica: ¿qué funcionalidad está bajo prueba? ¿qué falla o comportamiento se describe?
3. Infiere contexto si falta (por ejemplo, si dice "login", asume flujo web a menos que se indique móvil).
4. Completa todas las secciones del template. Si algo no está en el input, razónalo o márcalo `[Por confirmar]`.
5. Los Criterios de aceptación deben ser verificables — cada "Entonces" tiene que poder comprobarse objetivamente.

## Template de salida

Produce exactamente este formato, en español, con estas secciones en este orden:

---

## Título
[Nombre conciso que identifica la funcionalidad o caso — máx. 10 palabras]

---

## Problema que se quiere resolver
[1-3 oraciones explicando qué necesidad de negocio o usuario se está atendiendo. No describas la solución, describe el problema.]

---

## Contexto de uso
[¿Quién usa esto, cuándo, en qué sistema/plataforma? Incluye rol de usuario, dispositivo/canal si aplica, y precondiciones relevantes.]

---

## Objetivo
[Una oración clara: qué debe lograr esta funcionalidad cuando esté correctamente implementada.]

---

## Alcance

**Incluye:**
- [Lista de lo que SÍ cubre este caso/funcionalidad]

**No incluye:**
- [Lista explícita de lo que queda FUERA — esto previene scope creep y malentendidos]

---

## Comportamiento esperado

**Flujo principal:**
1. [Paso 1]
2. [Paso 2]
3. [...]

**Flujos alternativos / edge cases:**
- [Caso alternativo o borde 1]: [comportamiento esperado]
- [Caso alternativo o borde 2]: [comportamiento esperado]

---

## Criterios de aceptación

> Formato: **Dado** [estado inicial] **Cuando** [acción] **Entonces** [resultado verificable]

- **Dado** [...] **Cuando** [...] **Entonces** [...]
- **Dado** [...] **Cuando** [...] **Entonces** [...]
- [Agrega tantos como sean necesarios para cubrir el flujo principal y los edge cases]

---

## Restricciones

**Técnicas:**
- [Limitaciones de plataforma, performance, compatibilidad, dependencias]

**De negocio:**
- [Reglas de negocio, políticas, SLAs, límites funcionales]

**De seguridad:**
- [Requisitos de autenticación, autorización, privacidad de datos, validaciones]

---

## Notas

**Decisiones abiertas:**
- [Puntos que aún no están definidos y requieren decisión del equipo o stakeholder]

**Dudas:**
- [Preguntas que el equipo de QA o desarrollo debería resolver antes de implementar]

---

## Prompts optimizados por herramienta

Cuando el usuario pida generar un SDD usando una herramienta específica, usa el prompt correspondiente.

### Claude (claude.ai / Claude API)

```
<context>
Stack: Angular 17 + Angular Material + Cypress E2E. Portal Pacientes BUPA Chile.
Login: 2 pasos — input[name="rut"] → button[type="submit"] → input[name="current-password"] → button[type="submit"].
Ambientes: Dev / UAT-Staging / Producción (https://portalpaciente.bupa.cl).
</context>

<task>
Eres un QA Lead senior. Convierte el input que te doy en un documento SDD completo con exactamente estas 9 secciones en orden:
Título · Problema · Contexto de uso · Objetivo · Alcance · Comportamiento esperado · Criterios de aceptación · Restricciones · Notas

REGLAS DE INFERENCIA — aplica siempre sin preguntar:
- Si el input menciona login → asume flujo RUT + contraseña de 2 pasos en web
- Si menciona UI → incluye selectores Angular Material reales (mat-toolbar, mat-sidenav, input[name="..."], button[type="submit"])
- Si menciona navegación → asume post-login en portal Angular SPA
- Si no especifica ambiente → asume Producción
- Usa [Por confirmar] SOLO si el dato es crítico Y genuinamente imposible de inferir
</task>

<output_format>
Criterios de aceptación: formato estricto Cypress-compatible:
"Dado [precondición con estado del DOM] Cuando [acción cy.get/cy.click/cy.type] Entonces [aserción cy.should/cy.url]"
Cada criterio debe poder implementarse directamente como un it() de Cypress.
Completa TODAS las secciones. Sin secciones vacías. Sin introducciones. Solo el documento.
</output_format>

INPUT: [pega aquí tu caso de prueba, historia de usuario o requerimiento]
```

---

### ChatGPT / GPT-5.x

```
Eres QA Lead senior. Stack: Angular 17 + Angular Material, Portal Pacientes BUPA Chile. Login: 2 pasos (RUT → contraseña). Cypress E2E.

Convierte el input en SDD con estas 9 secciones exactas: Título · Problema · Contexto de uso · Objetivo · Alcance · Comportamiento esperado · Criterios de aceptación · Restricciones · Notas.

Infiere siempre: login = flujo RUT+password web, UI = selectores Angular Material reales, sin ambiente especificado = Producción. Usa [Por confirmar] solo si es dato crítico imposible de inferir.

Criterios de aceptación: formato "Dado [estado DOM] Cuando [acción Cypress] Entonces [aserción Cypress]". Cada criterio = 1 it() implementable directamente.

Sin introducciones. Sin secciones vacías. Solo el documento SDD.

INPUT: [pega aquí tu requerimiento]
```

---

### Cursor / Windsurf

```
// File: docs/sdd-template.md
// Stack: Angular 17 + Angular Material | Cypress E2E | BUPA Portal Pacientes
// Login selectors: input[name="rut"], input[name="current-password"], button[type="submit"]

Generate a complete SDD document in Spanish for the QA case below.

Sections (all required, no empty sections):
1. Título (max 10 words)
2. Problema
3. Contexto de uso
4. Objetivo
5. Alcance — Incluye / No incluye
6. Comportamiento esperado — Flujo principal + Edge cases
7. Criterios de aceptación — "Dado / Cuando / Entonces" — each must map to a Cypress it()
8. Restricciones — Técnicas / Negocio / Seguridad
9. Notas — Solo si hay decisiones abiertas reales

Inference rules (apply without asking):
- login mentioned → 2-step RUT+password flow
- UI mentioned → use real Angular Material selectors
- no environment → assume Producción
- Use [Por confirmar] ONLY for genuinely unknown critical data

Done when: all 9 sections present, every acceptance criterion has a Cypress selector.

INPUT: [paste requirement here]
```

---

## Reglas de escritura

- Escribe en español claro y directo.
- Usa verbos en infinitivo para los pasos del flujo ("Ingresar", "Hacer clic", "Validar").
- Los criterios de aceptación deben ser atómicos — un solo comportamiento por criterio.
- Si el input está en inglés, produce el documento en español igualmente (traduce los conceptos).
- No inventes datos específicos (IDs, URLs, nombres de campos) si no están en el input — usa `[nombre_campo]` como placeholder.
- Si el input ya tiene parte de la estructura SDD, respétala y completa lo que falta.

---

## Generación de PDF SDD

Cuando el usuario pida generar un PDF del documento SDD, usa el script en `C:\Users\Jaime Quiñelen\OneDrive\Escritorio\generate_sdd_pdf.py` como base.

### Configuración del PDF
- **Colores:** Azul oscuro `(13,71,161)`, Azul medio `(25,118,210)`, Celeste `(100,181,246)`, Celeste claro `(225,245,254)`
- **Guardado:** Siempre en `C:\Users\Jaime Quiñelen\OneDrive\Escritorio\`
- **Nombre:** `SDD-{NombreCaso}-{fecha}.pdf`

### Estructura del PDF (5 páginas)
1. **Portada** — Logo QA, título SDD, autor, descripción general
2. **Índice** — Tabla de contenidos con números de página
3. **Conceptos (pág 3)** — Secciones 1-5: Título, Problema, Contexto, Objetivo, Alcance
4. **Detalle (pág 4)** — Secciones 6-9: Comportamiento, Criterios, Restricciones, Notas
5. **Template en blanco (pág 5)** — Plantilla lista para completar con el caso específico

### Template SDD completo (página 5)

```
Problema que se quiere resolver
[espacio para completar]

Contexto de uso
[espacio para completar]

Objetivo
[espacio para completar]

Alcance
- Incluye:
- No incluye:

Comportamiento esperado
- Flujo principal: 1. / 2. / 3.
- Flujos alternativos / edge cases:

Criterios de aceptación
- Dado [estado] Cuando [acción] Entonces [resultado]

Restricciones
- Técnicas / Negocio / Seguridad

Notas
- Decisiones abiertas / Dudas
```

---

## Generación de Word SDD

Cuando el usuario pida generar un Word (.docx) del documento SDD, crear un nuevo script Python siguiendo el patrón establecido en los scripts existentes.

### Scripts de referencia (ya funcionando)

| Script | REQs que genera |
|---|---|
| `generate_req004_007_word.py` | REQ-BUPA-004, 005, 006, 007 |
| `generate_req008_009_word.py` | REQ-BUPA-008, 009 |

Ubicación: `C:\Users\Jaime Quiñelen\OneDrive\Escritorio\weas python\`

### Configuración del Word

- **Librería:** `python-docx` v1.2.0
- **Colores:** idénticos al PDF — `AZUL_OSCURO (13,71,161)`, `AZUL_MEDIO (25,118,210)`, `CELESTE (100,181,246)`, `CELESTE_CLAR (225,245,254)`, `VERDE (46,125,50)`
- **Guardado:** `os.path.join(os.environ['USERPROFILE'], 'OneDrive', 'Escritorio', 'Gestión QA', 'Bupa', 'Requerimientos SDD QA')`
- **Nombre archivo:** `{REQ_ID_con_guiones_bajos} - {titulo[:50]_sanitizado}.docx`
- **Márgenes:** top/bottom 2cm, left 2.5cm, right 2cm

### Estructura del Word (5 páginas)

1. **Portada** — `portada()` — Header QA, ID req, título grande, autor, descripción itálica, tabla de cards (Spec file / URL / Stack / Selector)
2. **Índice** — `indice()` — Lista numerada de las 9 secciones SDD
3. **Contexto del proyecto** — `contexto_proyecto()` — Descripción BUPA, metodología SDD, stack tecnológico
4. **Información del documento** — `info_documento()` — Tabla con ID, título, versión, autor, fecha, estado
5. **Contenido SDD** — Las 9 secciones desde `section_header()` con fondo azul medio

### Estructura del dict de datos por REQ

```python
REQS = {
    'REQ-BUPA-XXX': {
        'titulo':      'Título del requerimiento',
        'spec_file':   'nombre-del-spec.cy.js',
        'selector':    'selector CSS o descripción del localizador',
        'descripcion': 'Descripción breve para la portada (itálica)',
        'problema':    'Párrafo explicando el problema de negocio',
        'contexto':    ['Quien: ...', 'Cuando: ...', 'Sistema: ...', 'Precondicion: ...'],
        'objetivo':    'Una oración: qué debe lograr esta funcionalidad',
        'incluye':     ['Item 1', 'Item 2', ...],
        'no_incluye':  ['Item 1', 'Item 2', ...],
        'flujo':       ['Paso 1', 'Paso 2', ...],
        'edge_cases':  [('Caso', 'comportamiento esperado'), ...],
        'criterios':   [('dado', 'cuando', 'entonces'), ...],
        'tecnicas':    ['Restricción técnica 1', ...],
        'negocio':     ['Regla de negocio 1', ...],
        'seguridad':   ['Requisito de seguridad 1', ...],
        'decisiones':  ['[Por confirmar] Decisión 1', ...],
        'dudas':       ['Pregunta 1', ...],
        'cypress_ref': 'it("REQ-XXX: descripción")\n  cy.get(...).should(...)',
    },
}
```

### Helpers disponibles (copiar de scripts existentes)

| Función | Uso |
|---|---|
| `set_cell_bg(cell, rgb_tuple)` | Fondo de celda con color RGB |
| `section_header(doc, number, title)` | Cabecera de sección con fondo azul medio |
| `body_text(doc, text)` | Párrafo de texto gris con indentación |
| `bullet(doc, text, bold_prefix)` | Bullet con prefijo en negrita opcional |
| `criterio_box(doc, dado, cuando, entonces)` | Tabla DADO/CUANDO/ENTONCES con fondo celeste |
| `restriccion_bloque(doc, tipo, items)` | Bloque de restricciones con título y bullets |

### Reglas críticas al crear un nuevo script

1. **Ruta con ñ:** usar siempre `os.path.join(os.environ['USERPROFILE'], ...)` — nunca string hardcodeado con `Quiñelen`
2. **Sanitizar filename:** `titulo[:50].replace('"','').replace('/','−').replace('\\','−').replace(':','−')` — los caracteres `"`, `/`, `\`, `:` rompen el nombre de archivo en Windows
3. **Bloque main:** iterar solo sobre los REQs que se deben generar en esa ejecución
4. **SDD empieza en página 5:** siempre 4 `add_page_break()` antes del contenido SDD (portada → índice → contexto → info doc → contenido)
5. **Criterios:** cada criterio es una tupla `(dado, cuando, entonces)` — `criterio_box()` los formatea automáticamente
