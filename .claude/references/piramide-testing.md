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
           /  Accessibility           \  [ UAT · PROD ]
          /  Security                  \
         /------------------------------\
        /                               \
       /     INTEGRACIÓN / SERVICE       \   20%
      /  Integration · Performance        \
     /  Smoke                              \  [ DEV · UAT · PROD ]
    /------------------------------------------\
   /                                            \
  /              BASE — 70%                      \
 /  Unit Testing ·                                 \ 
/  Go test · Jest · Karma                           \  [ DEV · UAT · PROD ]
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
| **Tipos de prueba** | Regression · Accessibility · Security |
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
| **Tipos de prueba** | Integration · Performance · Smoke |
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
| **Automated Testing** | Base | `Cypress · Playwright` | 100% Auto | UAT · PROD | QA Lead + Dev |
| **Smoke Testing** | Service | `Cypress (subset crítico)` | 100% Auto | UAT · PROD | QA Lead |
| **Integration Testing** | Service | `Postman · Newman · n8n` | Parcial | DEV · UAT · PROD | QA Lead + DevOps |
| **Performance Testing** | Service | `Lighthouse · k6 · Artillery` | Parcial | UAT | QA Lead + DevOps |
| **Regression Testing** | E2E | `Cypress · TestRail` | Parcial | UAT · PROD | QA Lead |
| **Accessibility Testing** | E2E | `cypress-axe · NVDA` | Parcial | UAT | QA Lead |
| **Security Testing** | E2E | `curl · openssl · OWASP ZAP` | Parcial | UAT · PROD | QA Lead + Dev |
| **Manual Testing** | Cima | Navegador · DevTools | Manual | UAT · PROD | QA Lead |
| **Exploratory Testing** | Cima | Charter de exploración | Manual | UAT | QA Lead |
| **Usability Testing** | Cima | Usuarios | Manual | UAT | QA Lead |

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
