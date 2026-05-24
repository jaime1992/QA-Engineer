# Pirámide de Testing — BUPA Chile

| Campo | Detalle |
|-------|---------|
| **Autor** | Jaime Quiñelen Villar — QA Lead |
| **Organización** | BUPA Chile |
| **Modelo** | Pirámide de Testing — Mike Cohn |
| **Versión** | v1.0 |
| **Fecha** | Mayo 2026 |

---

## Descripción

Distribución de los 11 tipos de prueba en los 4 niveles de la pirámide. La base sostiene la velocidad y el costo bajo; la cima aporta la validación humana que ninguna herramienta reemplaza.

> **Regla principal:** Mientras más arriba en la pirámide, más caro, más lento y menos casos se justifican.

---

## Estructura de la Pirámide

```
                        ▲
                       /|\
                      / | \         LENTO · CARO · POCOS CASOS
                     /  |  \
                    /  CIMA  \
                   /          \
                  / Manual     \
                 / Exploratory  \    [ UAT ]
                / Usability      \
               /------------------\
              /                    \
             /       E2E / UI       \   10%
            /  Regression            \
           /  Accessibility · Smoke   \  [ UAT · PROD ]
          /  Security                  \
         /------------------------------\
        /                               \
       /     INTEGRACIÓN / SERVICE       \   20%
      /  Integration · Performance        \
     /  Security (API · auth · TLS)        \  [ DEV · UAT · PROD ]
    /------------------------------------------\
   /                                            \
  /              BASE — 70%                      \
 /  Unit Testing ·                                 \ 
/  Go test · Jest · Karma                           \  [ DEV]
/____________________________________________________\

                  RÁPIDO · BARATO · MUCHOS CASOS
```

---

## Niveles de la Pirámide

### CIMA — Criterio Humano
> Sin herramienta fija · Observación directa

| Campo | Detalle |
|-------|---------|
| **% del esfuerzo** | Mínimo |
| **Tipos de prueba** | Manual · Exploratory · Usability |
| **Automatización** | No automatizable |
| **Ambientes** | `UAT` |
| **Responsable** | QA Lead |
| **Característica** | Requiere criterio humano — no reemplazable por herramientas |

---

### E2E / UI — 10%
> Playwright · Cypress · Appium · Selenium · BrowserStack

| Campo | Detalle |
|-------|---------|
| **% del esfuerzo** | 10% |
| **Tipos de prueba** | Regression · Accessibility · Security · Smoke |
| **Automatización** | Semi-automatizado |
| **Ambientes** | `UAT` · `PROD` |
| **Responsable** | QA Lead |
| **Característica** | Flujos completos de usuario en navegador real |

---

### INTEGRACIÓN / SERVICE — 20%
> Postman · Newman · n8n · APIs REST · Contratos SDD

| Campo | Detalle |
|-------|---------|
| **% del esfuerzo** | 20% |
| **Tipos de prueba** | Integration · Performance · Security (API · auth · TLS) |
| **Automatización** | Automatizable (parcial) |
| **Ambientes** | `DEV` · `UAT` · `PROD` |
| **Responsable** | QA Lead + DevOps |
| **Característica** | Valida contratos entre servicios y APIs |

---

### BASE — 70%
> Go test · Jest · Karma · Azure DevOps CI

| Campo | Detalle |
|-------|---------|
| **% del esfuerzo** | 70% |
| **Tipos de prueba** | Unit Testing · Automated Testing |
| **Ambientes** | `DEV` · `UAT` · `PROD` |
| **Automatización** | 100% automatizado |
| **Responsable** | Dev Team (Unit) · QA Lead + Dev (Automated) |
| **Característica** | Cobertura mínima exigida: **≥ 80%** |

---

## Métricas por Nivel

| Nivel | % Esfuerzo | Herramientas | Cobertura mínima |
|-------|:----------:|--------------|:----------------:|
| Base — Unitarias | **70%** | Go test · Jest · Karma · Azure DevOps CI | ≥ 80% |
| Integración / Service | **20%** | Postman · Newman · n8n · APIs REST | — |
| E2E / UI | **10%** | Playwright · Cypress · Appium · Selenium · BrowserStack | — |
| Tipos cubiertos | **11** | — | — |

---

## Mapa Completo — 11 Tipos en la Pirámide

| Tipo de Testing | Nivel Pirámide | Herramienta BUPA | Automatización | Ambiente | Responsable |
|-----------------|---------------|-----------------|:--------------:|----------|-------------|
| **Unit Testing** | Base | `Go test · Jest · Karma` | 100% Auto | DEV | Dev Team |
| **Smoke Testing** | E2E | `Cypress · Playwright (subset crítico)` | 100% Auto | UAT · PROD | QA Lead |
| **Integration Testing** | Service | `Postman · Newman · n8n` | Parcial | DEV · UAT · PROD | QA Lead + DevOps |
| **Performance Testing** | Service | `Lighthouse · k6 · Artillery` | Parcial | UAT | QA Lead + DevOps |
| **Regression Testing** | E2E | `Cypress · TestRail` | Parcial | UAT · PROD | QA Lead |
| **Accessibility Testing** | E2E | `cypress-axe · NVDA` | Parcial | UAT | QA Lead |
| **Automated Testing** | Base | `Cypress · Playwright` | 100% Auto | UAT · PROD | QA Lead + Dev |
| **Security Testing (API · auth · TLS)** | Integration | `Supertest + Jest` | Parcial | DEV · UAT | QA Lead + Dev |
| **Security Testing (XSS · CSRF · OWASP)** | E2E | `OWASP ZAP · curl · openssl` | Parcial | UAT · PROD | QA Lead + Dev |
| **Manual Testing** | Cima | Navegador · DevTools | Manual | UAT · PROD | QA Lead |
| **Exploratory Testing** | Cima | Charter de exploración | Manual | UAT | QA Lead |
| **Usability Testing** | Cima | Usuarios | Manual | UAT | QA Lead |

---

## Distribución por Volumen de Casos

Los porcentajes de la pirámide (70 / 20 / 10) no son sobre una cantidad fija de casos de prueba: representan **esfuerzo, volumen relativo y tiempo de ejecución**.

> **Regla:** A mayor número de casos totales por requerimiento, más se nota el impacto de esta distribución en la planificación del sprint.

### Fórmula de Distribución

Dado un total **N** de casos de prueba para un requerimiento:

| Nivel | % | Fórmula | Descripción |
|-------|:-:|---------|-------------|
| **Unitarias (Base)** | 70% | `N × 0.70` | Funciones o clases aisladas — rápidas, baratas, alta cobertura |
| **Integración (Service)** | 20% | `N × 0.20` | Comunicación entre módulos, APIs y bases de datos |
| **E2E (Cima UI)** | 10% | `N × 0.10` | Flujos críticos del usuario final — lentas y costosas |

### Ejemplo de Aplicación

Para un requerimiento con **100 casos de prueba**:

| Nivel | Casos estimados | Herramienta referencial |
|-------|:--------------:|------------------------|
| Unitarias (70%) | ~70 | Jest · Go test · Karma |
| Integración (20%) | ~20 | Postman · Newman · n8n |
| E2E (10%) | ~10 | Cypress · Playwright |
| **Total** | **~100** | |

> **Nota de aplicación:** Los valores son estimaciones redondeadas. El decimal se asigna al nivel que más beneficio aporta al riesgo del requerimiento específico.

---

## Eje de la Pirámide

| Atributo | Cima | E2E | Service | Base |
|----------|:----:|:---:|:-------:|:----:|
| Velocidad | Lento | Medio | Medio | Rápido |
| Costo | Alto | Medio-Alto | Medio | Bajo |
| Cantidad de casos | Pocos | Moderado | Moderado | Muchos |
| Automatización | No | Parcial | Parcial-Total | Total |
| Feedback | Tardío | Tardío | Rápido | Inmediato |

---

## Stack Tecnológico

`Cypress` · `Playwright` · `Postman` · `Newman` · `n8n` · `Go test` · `Jest` · `Karma` · `BrowserStack` · `GitHub Actions` · `Lighthouse` · `k6` · `cypress-axe` · `OWASP ZAP`

---

## Referencias

- Documento visual: `estandarizacion/piramide-testing.html`
- Presentación: `estandarizacion/piramide-testing.pptx`
