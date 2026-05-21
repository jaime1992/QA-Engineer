# Métricas de Calidad — QA Engineer

Reporte semanal cada viernes. Datos cargados manualmente en CSV, procesados por n8n y publicados en Google Sheets.

## KPIs Definidos

| # | KPI | Meta | Fórmula | Fuente |
|---|-----|------|---------|--------|
| 1 | Test Coverage | ≥ 90% | REQs con al menos 1 TC definido y ejecutado / total REQs | Xray (Jira) |
| 2 | Pass / Fail Rate | ≥ 95% | TCs que pasan / total TCs ejecutados en la corrida | Cypress run |
| 3 | Automation Coverage | ≥ 70% | TCs automatizados / total TCs definidos | Repo + Xray |
| 4 | Escaped Defects | = 0 | Bugs en PROD no detectados en UAT | Jira (filtro ambiente=PROD) |
| 5 | Defect Resolution | ≥ 95% | Bugs cerrados dentro del SLA / total bugs del período | Jira |

## SLA por Severidad (Defect Resolution)

| Severidad | SLA |
|-----------|-----|
| Crítico | 24 horas |
| Alto | 48 horas |
| Medio | 5 días hábiles |
| Bajo | 10 días hábiles |

## Flujo Semanal (cada viernes)

1. Ejecutar `npx cypress run` y anotar passed/total
2. Revisar Xray: REQs con TC ejecutado vs total REQs del sprint
3. Contar specs `.cy.ts` vs total TCs definidos
4. Filtrar Jira por bugs en PROD sin detección previa en UAT
5. Filtrar Jira por bugs cerrados fuera del SLA
6. Llenar `recoleccion/semana-YYYY-WXX.csv` usando el template
7. n8n lee el CSV y actualiza el dashboard en Google Sheets

## Estructura de Archivos

```
metricas/
├── README.md                  ← este archivo
├── recoleccion/
│   ├── kpi-template.csv       ← plantilla base (copiar cada viernes)
│   └── semana-YYYY-WXX.csv   ← un archivo por semana (ej: semana-2026-W22.csv)
└── dashboard/
    └── README.md              ← link al Google Sheets del dashboard
```
