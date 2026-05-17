# Guia Cypress E2E — Portal Pacientes BUPA

Referencia practica para escribir specs E2E en este proyecto.
Todos los ejemplos usan el portal BUPA real.

---

## 1. Estructura base de un spec

```javascript
/// <reference types="cypress" />

// REQ-BUPA-XXX — Titulo del requerimiento
// Spec: nombre-del-spec.cy.js
// Criterios automatizados: TC-001-FP, TC-002-FP...
// URL bajo prueba: https://portalpaciente.bupa.cl/...

describe('REQ-BUPA-XXX | Titulo del requerimiento', () => {

  // Corre antes de cada it() — util para navegar a la URL
  beforeEach(() => {
    cy.visit('https://portalpaciente.bupa.cl/inicio')
  })

  // TC-001-FP — Titulo del caso
  // DADO  contexto inicial
  // CUANDO accion del usuario
  // ENTONCES resultado esperado
  it('TC-001-FP | Titulo del caso', () => {
    // comandos aqui
  })

})
```

**Reglas:**
- Siempre `/// <reference types="cypress" />` al inicio
- Un `it()` por criterio de aceptacion
- Comentario DADO/CUANDO/ENTONCES en cada test
- Nombrar el `it()` con el ID del caso: `TC-001-FP | titulo`

---

## 2. Comandos esenciales

### Navegar
```javascript
cy.visit('https://portalpaciente.bupa.cl/inicio')
```

### Buscar elementos
```javascript
// Por selector CSS (name, type — nunca clases generadas por Angular)
cy.get('input[name="rut"]')
cy.get('input[name="current-password"]')
cy.get('button[type="submit"]')

// Por texto visible
cy.contains('Iniciar sesion')

// Por data-testid (preferido cuando este disponible)
cy.get('[data-testid="login-button"]')
```

### Verificar visibilidad
```javascript
cy.get('body').should('be.visible')
cy.get('input[name="rut"]').should('be.visible')
cy.get('button[type="submit"]').should('exist')
```

### Verificar URL
```javascript
// URL contiene un dominio
cy.url().should('include', 'portalpaciente.bupa.cl')

// Protocolo HTTPS
cy.location('protocol').should('eq', 'https:')

// Path exacto
cy.location('pathname').should('eq', '/inicio')
```

### Medir tiempo de carga
```javascript
it('TC-002-FP | Portal carga en menos de 3 segundos', () => {
  const inicio = Date.now()
  cy.visit('https://portalpaciente.bupa.cl/inicio')
  cy.get('body').should('be.visible').then(() => {
    const duracion = Date.now() - inicio
    expect(duracion, `Tiempo de carga: ${duracion}ms`).to.be.lessThan(3000)
  })
})
```

### Escribir en un campo
```javascript
// Sin loguear en Cypress (contrasenas)
cy.get('input[name="current-password"]').type('miContrasena', { log: false })

// Con log visible
cy.get('input[name="rut"]').type('12345678-9')
```

### Limpiar y reescribir
```javascript
cy.get('input[name="rut"]').clear().type('12345678-9')
```

### Hacer clic
```javascript
cy.get('button[type="submit"]').click()
```

---

## 3. Accesibilidad con cypress-axe (REQ con WCAG)

```javascript
// cypress/support/e2e.js debe tener:
// import 'cypress-axe'

it('TC-004-FP | Pagina cumple WCAG 2.1 AA', () => {
  cy.visit('https://portalpaciente.bupa.cl/inicio')
  cy.injectAxe()  // inyectar despues de cy.visit()
  cy.checkA11y(null, {
    runOnly: ['wcag2a', 'wcag2aa']
  })
})
```

### Excluir falso positivo conocido de Angular SPA
```javascript
cy.checkA11y(null, {
  runOnly: ['wcag2a', 'wcag2aa'],
  rules: {
    'landmark-one-main': { enabled: false }
  }
})
```

### Ver que viola
```javascript
cy.checkA11y(null, { runOnly: ['wcag2a', 'wcag2aa'] }, (violations) => {
  violations.forEach(v => {
    cy.log(`[${v.impact}] ${v.id}: ${v.description}`)
  })
})
```

---

## 4. Buenas practicas del proyecto

| Regla | Correcto | Incorrecto |
|-------|----------|------------|
| Selectores | `input[name="rut"]` | `.mat-input-element` |
| Nombrar it() | `TC-001-FP \| Portal carga` | `should load correctly` |
| Contrasenas | `{ log: false }` | tipear directo |
| Un criterio por it() | 1 asercion principal | multiples criterios mezclados |
| Comentarios | DADO/CUANDO/ENTONCES | comentarios obvios |

**Nunca usar:**
- Clases CSS generadas por Angular (`_ngcontent-*`, `mat-*`)
- `cy.wait(3000)` — usar `cy.get().should()` con timeout
- Credenciales hardcodeadas — usar `cypress.env.json` o variables CI

**Siempre usar:**
- `data-testid` cuando el equipo Dev lo implemente
- `name` o `type` para inputs de Angular Material
- `{ log: false }` al tipear contrasenas

---

## 5. Leer el reporte Gmail

Al terminar cada ejecucion llega un correo con este formato:

```
Asunto: 🧪 [WF-1.1] Cypress #Test Regresion# nombre-spec PASS — 3✅ 0❌ | fecha
```

| Campo del correo | Que significa |
|-----------------|---------------|
| Header verde | Todos los casos pasaron |
| Header rojo | Hay al menos 1 fallo |
| PASADOS | Cantidad de it() en PASS |
| FALLADOS | Cantidad de it() en FAIL |
| PENDIENTES | it() con .skip() o pendientes |
| DURACION | Tiempo total de ejecucion |
| Tabla inferior | Detalle caso a caso con estado y duracion |

**Si el correo muestra FAIL:**
1. Ver la columna Error en la tabla
2. Reproducir el fallo localmente con `npx cypress open`
3. Crear Bug en Jira con label `bug-uat` o `hotfix` segun ambiente

---

## 6. Comandos de terminal

```bash
# Correr un spec especifico
npx cypress run --spec "cypress/e2e/nombre-spec.cy.js"

# Correr todos los specs
npx cypress run

# Modo interactivo (ver el navegador)
npx cypress open

# Correr en ambiente UAT
npx cypress run --env environment=uat

# Correr en PROD
npx cypress run --env environment=prod
```
