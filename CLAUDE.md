# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QA Engineer automation project for end-to-end testing, workflow automation, and quality assurance reporting. Stack: **Cypress** (E2E tests), **n8n** (workflow automation), **GitHub Actions** (CI/CD pipeline).

## Common Commands

### Cypress
```bash
# Run all tests headless
npx cypress run

# Run a single spec file
npx cypress run --spec "cypress/e2e/path/to/spec.cy.ts"

# Open Cypress interactive mode
npx cypress open

# Run tests against a specific environment
npx cypress run --env environment=staging

# Run with a specific browser
npx cypress run --browser chrome
```

### Install & Setup
```bash
npm install
npx cypress verify
```

### Linting
```bash
npm run lint
```

## Architecture

### Cypress Structure
- `cypress/e2e/` — test specs organized by feature/module
- `cypress/fixtures/` — static test data (JSON)
- `cypress/support/commands.ts` — custom Cypress commands
- `cypress/support/e2e.ts` — global hooks and imports
- `cypress.config.ts` — environment configs, base URLs, timeouts

### n8n Workflows
- Workflows are exported as JSON and versioned in `workflows/`
- Each workflow file is named by function: `WF-1.1-<description>.json`
- Credentials are managed in n8n directly — never committed to repo

### CI/CD (GitHub Actions)
- Pipeline stages: install → lint → cypress run → report
- Quality gates block merges if E2E pass rate drops below threshold
- Smoke tests run on every PR; full regression runs on merge to main

## Environment Configuration

Environments are controlled via `cypress.config.ts` or `--env` flag:
- `local` — `http://localhost:PORT`
- `staging` — staging URL defined in CI secrets
- `production` — smoke tests only

Sensitive values (URLs, credentials) are stored as GitHub Actions secrets and injected at runtime — never hardcoded in test files.

## Project Knowledge Structure (`.claude/`)

| Carpeta | Contenido |
|---|---|
| `context/` | Estado activo del sprint, ambientes y stack — leer al iniciar sesion |
| `decisions/` | ADRs — consultar antes de proponer cambios arquitecturales |
| `project/` | Roadmap, definition of done, roles del equipo |
| `references/` | APIs bajo prueba, links a Jira, documentacion de herramientas |
| `templates/` | Plantillas de casos de prueba, bug reports, specs Cypress |
| `archives/` | Sprints cerrados — solo lectura |
| `commands/` | Slash commands personalizados del proyecto |

## Key Conventions

- Test IDs use `data-testid` attributes for selectors — never use CSS classes or text
- Custom commands live in `cypress/support/commands.ts` and follow the pattern `cy.actionNoun()`
- Fixtures follow the naming `feature-scenario.json`
- n8n workflow IDs follow `WF-X.Y` convention where X = module, Y = sub-workflow
