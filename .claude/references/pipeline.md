# Pipeline CI/CD — Guia de Referencia QA

Referencia practica y generica para entender, configurar y operar pipelines CI/CD
desde el rol de QA Lead. Aplica a cualquier proyecto con GitHub Actions.

---

## 1. Que es un pipeline y por que le importa a QA

Un pipeline CI/CD es una secuencia automatizada de pasos que se ejecuta cada vez que
hay un cambio en el codigo. Para QA, el pipeline es el mecanismo que convierte los
tests automatizados en quality gates reales.

```
Desarrollador hace push / abre PR
  └── Pipeline se activa automaticamente
        ├── Instala dependencias
        ├── Corre linters
        ├── Corre unit tests (Dev)
        ├── Corre integration tests (Dev)
        ├── Corre E2E tests (QA) ← aqui entra Cypress
        └── Genera reporte y notifica resultado
```

**Regla QA:** si el pipeline falla en los tests E2E, el merge al branch principal queda bloqueado.

---

## 2. Stages del pipeline — de inicio a fin

| Stage | Que hace | Quien lo configura | Bloquea merge si falla |
|-------|----------|-------------------|----------------------|
| `install` | Instala dependencias (npm install) | Dev / QA | Si |
| `lint` | Verifica estilo y calidad de codigo | Dev | Si |
| `unit-test` | Tests unitarios del codigo fuente | Dev | Si |
| `integration-test` | Tests de integracion entre modulos | Dev | Si |
| `e2e-test` | Tests E2E con Cypress | QA | Si |
| `report` | Genera reporte de resultados | QA | No |
| `deploy` | Deploy al ambiente correspondiente | DevOps | Depende del ambiente |

---

## 3. Estructura de un workflow GitHub Actions

```yaml
# .github/workflows/qa-pipeline.yml

name: QA Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  install:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci

  lint:
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint

  e2e:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cypress-io/github-action@v6
        with:
          browser: chrome
          config: baseUrl=https://mi-app.com
        env:
          CYPRESS_ENV: staging

  report:
    needs: e2e
    if: always()   # corre aunque e2e falle
    runs-on: ubuntu-latest
    steps:
      - name: Publicar resultados
        uses: actions/upload-artifact@v4
        with:
          name: cypress-results
          path: cypress/results/
```

---

## 4. Triggers — cuando se activa el pipeline

| Trigger | Cuando ocurre | Pipeline recomendado |
|---------|--------------|---------------------|
| `push` a feature branch | Dev sube cambios | Lint + Unit tests |
| `pull_request` a develop | PR abierto para revision | Lint + Unit + E2E smoke |
| `push` a develop | Merge aprobado | Suite completa E2E |
| `push` a main | Release a produccion | Smoke tests en PROD |
| `schedule` (cron) | Ejecucion periodica | Regression completa nocturna |

```yaml
# Ejemplo cron — regression todos los dias a las 02:00
on:
  schedule:
    - cron: '0 2 * * *'
```

---

## 5. Ambientes en el pipeline

| Ambiente | Cuando se usa | Tests que corren |
|----------|--------------|-----------------|
| `local` | Desarrollo en la maquina del dev | Todos — controlado por el dev |
| `staging / UAT` | PR aprobado, antes de PROD | E2E completo — FP + EC criticos |
| `production` | Post-deploy a PROD | Solo smoke — casos FP criticos |

**Pasar el ambiente a Cypress:**
```yaml
- uses: cypress-io/github-action@v6
  env:
    CYPRESS_ENV: staging   # o production
```

```javascript
// cypress.config.js
baseUrl: environments[process.env.CYPRESS_ENV || 'staging'].baseUrl
```

---

## 6. Variables de entorno y secretos

**Nunca hardcodear credenciales en el codigo.** Usar GitHub Secrets.

```yaml
# Definir en GitHub → Settings → Secrets and variables → Actions
# Usar en el workflow:
env:
  CYPRESS_USERNAME: ${{ secrets.QA_USERNAME }}
  CYPRESS_PASSWORD: ${{ secrets.QA_PASSWORD }}
  CYPRESS_BASE_URL: ${{ secrets.STAGING_URL }}
```

```javascript
// Usar en el spec
cy.get('input[name="email"]').type(Cypress.env('USERNAME'))
cy.get('input[name="password"]').type(Cypress.env('PASSWORD'), { log: false })
```

**Secretos comunes en proyectos QA:**

| Secret | Contenido |
|--------|-----------|
| `QA_USERNAME` | Usuario de prueba en UAT |
| `QA_PASSWORD` | Contrasena del usuario de prueba |
| `STAGING_URL` | URL del ambiente UAT |
| `SLACK_WEBHOOK` | URL para notificaciones Slack |
| `JIRA_TOKEN` | Token para crear bugs automaticamente |

---

## 7. Quality Gates — cuando el pipeline bloquea

Un quality gate es una condicion que debe cumplirse para que el pipeline avance.
Si falla, el merge queda bloqueado hasta corregir.

| Gate | Condicion de bloqueo |
|------|---------------------|
| Lint | Cualquier error de estilo |
| Unit tests | Cualquier test en FAIL |
| E2E smoke | Cualquier caso FP en FAIL |
| Cobertura | Cobertura < umbral definido (ej: 80%) |
| Performance | Tiempo de carga > umbral (ej: 3s) |

**Configurar branch protection en GitHub:**
1. Settings → Branches → Add rule
2. Branch name: `main`
3. Activar: "Require status checks to pass before merging"
4. Agregar los jobs del pipeline como checks requeridos

---

## 8. Artifacts — guardar evidencia del pipeline

```yaml
# Guardar screenshots y videos de Cypress
- uses: actions/upload-artifact@v4
  if: failure()   # solo si hay fallos
  with:
    name: cypress-screenshots
    path: cypress/screenshots/
    retention-days: 7

- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: cypress-videos
    path: cypress/videos/
    retention-days: 3
```

---

## 9. Notificaciones de resultado

### Por email (via script o servicio)
```yaml
- name: Enviar reporte por email
  if: always()
  run: node scripts/email-report.js
  env:
    RESULTS_PATH: cypress/results/output.json
```

### Por Slack
```yaml
- name: Notificar Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {"text": "Pipeline FAIL en ${{ github.repository }} — ${{ github.ref }}"}
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 10. Estrategia de branches y pipeline por rama

```
main
  └── Pipeline: smoke tests PROD — solo FP criticos
  └── Trigger: push (post-merge)

develop
  └── Pipeline: E2E completo en UAT — FP + EC
  └── Trigger: push y PR

feature/*
  └── Pipeline: lint + unit tests — rapido, sin E2E
  └── Trigger: push

hotfix/*
  └── Pipeline: smoke tests express — casos criticos
  └── Trigger: push y PR a main
```

---

## 11. Optimizar el pipeline — buenas practicas

| Practica | Como implementarla |
|----------|--------------------|
| Cache de dependencias | `cache: 'npm'` en actions/setup-node |
| Paralelizar specs | `parallel: true` en cypress-io/github-action |
| Correr solo tests afectados | Filtrar por `--spec` segun archivos cambiados |
| Timeout por job | `timeout-minutes: 15` en cada job |
| Reintentar tests flaky | `retry: 2` en cypress.config.js |
| Separar smoke de regression | Jobs distintos con triggers distintos |

```yaml
# Parallelizacion con Cypress Cloud
- uses: cypress-io/github-action@v6
  with:
    record: true
    parallel: true
    group: 'E2E Suite'
  env:
    CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

---

## 12. Diagnosticar un pipeline fallido

```
1. Ver el job que fallo en GitHub Actions → Actions → workflow run
2. Expandir el step fallido — leer el error completo
3. Descargar artifacts: screenshots y videos
4. Reproducir localmente:
     npx cypress run --spec "cypress/e2e/spec-fallido.cy.js"
5. Si es flaky (pasa local, falla en CI):
     - Revisar timeouts — CI es mas lento que local
     - Revisar data de prueba — puede que CI no tenga el estado esperado
     - Agregar cy.wait('@alias') en lugar de cy.wait(ms)
6. Crear Bug en Jira si el fallo es real (no flaky)
```

---

## 13. Rol de QA en el pipeline

| Responsabilidad | QA hace |
|----------------|---------|
| Escribir los specs E2E | Cypress specs en `cypress/e2e/` |
| Configurar el job E2E | `.github/workflows/qa-pipeline.yml` |
| Definir quality gates | Branch protection + status checks |
| Revisar fallos del pipeline | Ver artifacts, reproducir, crear bug |
| Mantener tests estables | Corregir tests flaky, actualizar selectores |
| Reportar cobertura | % de REQs cubiertos por specs automatizados |

**QA NO es responsable de:**
- Unit tests — son del equipo Dev
- Deploy a ambientes — es de DevOps
- Configuracion de infraestructura CI — es compartida con DevOps
