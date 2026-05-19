# QA Metrics — Framework de 5 Indicadores Gerenciales

Marco de referencia permanente para el rol QA Lead. Aplica a cualquier proyecto de software.

---

## 1. Pass/Fail Rate

**Definición:** Porcentaje de casos de prueba que pasan vs. fallan en un ciclo de ejecución.

**Fórmula:**
```
Pass Rate (%) = (TCs Pasados / Total TCs Ejecutados) * 100
Fail Rate (%) = (TCs Fallados / Total TCs Ejecutados) * 100
```

**Fuentes de datos:** Herramienta de ejecución de tests (Cypress, Selenium, Postman, etc.), reporte de CI/CD.

**Componentes necesarios para implementar:**
| Componente | Descripción |
|---|---|
| Ejecución automatizada | Suite de tests corriendo en pipeline o manualmente |
| Reporte de resultados | Archivo o dashboard con conteo de passed/failed/skipped |
| Histórico | Registro acumulado por sprint o fecha para ver tendencia |

**Umbral de referencia:** Pass Rate ≥ 90% para aprobar un release. Ajustar según acuerdo con gerencia.

---

## 2. Test Coverage

**Definición:** Porcentaje de requerimientos o funcionalidades que tienen al menos un caso de prueba asociado.

**Fórmula:**
```
Test Coverage (%) = (REQs con al menos 1 TC / Total REQs del sprint) * 100
```

**Fuentes de datos:** Gestor de requerimientos (Jira, Azure DevOps), repositorio de casos de prueba (Xray, TestRail, Excel).

**Componentes necesarios para implementar:**
| Componente | Descripción |
|---|---|
| Índice de requerimientos | Lista completa de REQs del sprint o release |
| Trazabilidad REQ → TC | Mapeo de cada requerimiento a sus casos de prueba |
| Matriz de cobertura | Tabla que cruza REQs vs TCs y calcula el porcentaje |

**Umbral de referencia:** Cobertura ≥ 80% de REQs antes de cierre de sprint.

---

## 3. Automation Coverage

**Definición:** Porcentaje de casos de prueba totales que están automatizados.

**Fórmula:**
```
Automation Coverage (%) = (TCs Automatizados / Total TCs) * 100
```

**Fuentes de datos:** Framework de automatización (Cypress, Playwright, etc.), repositorio de tests manuales.

**Componentes necesarios para implementar:**
| Componente | Descripción |
|---|---|
| Conteo de TCs manuales | Total de casos de prueba documentados |
| Conteo de TCs automatizados | Total de scripts de prueba en el framework |
| Cálculo del ratio | Fórmula aplicada sobre ambos conteos |
| Reporte periódico | Dashboard o informe con evolución de la cobertura |

**Umbral de referencia:** Meta progresiva. Iniciar con 30%, escalar a 60%+ en 6 meses para regresión.

---

## 4. Escaped Defects

**Definición:** Defectos que no fueron detectados por QA y llegaron a producción, reportados por usuarios finales o monitoreo.

**Fórmula:**
```
Escaped Defects = Cantidad de bugs encontrados en PROD en un período dado
Escape Rate (%) = (Bugs en PROD / Total Bugs del período) * 100
```

**Fuentes de datos:** Gestor de incidencias (Jira), herramientas de monitoreo (Datadog, Sentry), reportes de soporte.

**Componentes necesarios para implementar:**
| Componente | Descripción |
|---|---|
| Clasificación por ambiente | Campo en Jira: `found-in: DEV / UAT / PROD` |
| Filtro de bugs en PROD | Reporte que aísle solo los defectos detectados post-release |
| Conteo periódico | Seguimiento semanal o por release |

**Umbral de referencia:** 0 escaped defects críticos o bloqueantes. Máximo 1-2 de severidad media por release.

---

## 5. Defect Resolution

**Definición:** Velocidad y tasa con que los defectos encontrados son resueltos dentro del SLA acordado.

**Fórmulas:**
```
Tiempo de resolución = Fecha cierre bug - Fecha apertura bug
Tasa de resolución (%) = (Bugs cerrados en el período / Total bugs abiertos) * 100
SLA Cumplido (%) = (Bugs resueltos dentro del SLA / Total bugs resueltos) * 100
```

**Fuentes de datos:** Gestor de incidencias (Jira), campos de fecha de creación y cierre.

**Componentes necesarios para implementar:**
| Componente | Descripción |
|---|---|
| Registro de fechas | Fecha de apertura y cierre de cada bug en Jira |
| SLA definido | Tiempo máximo de resolución por severidad (ver tabla abajo) |
| Aging report | Reporte de bugs con más de X días abiertos sin resolver |
| Tasa de cierre semanal | Métrica de productividad del equipo Dev para QA |

**SLA de referencia (negociar con gerencia):**

| Severidad | Tiempo máximo de resolución |
|---|---|
| Critical / Blocker | 1 día hábil |
| High | 2 días hábiles |
| Medium | 5 días hábiles |
| Low | 10 días hábiles |

---

## Resumen Ejecutivo — Orden de Implementación

| # | Métrica | Por qué primero |
|---|---|---|
| 1 | Test Coverage | Base de todo: sin trazabilidad REQ→TC no hay métricas confiables |
| 2 | Automation Coverage | Deriva directamente de la matriz de cobertura anterior |
| 3 | Pass/Fail Rate | Con los tests definidos, el dato de ejecución ya existe |
| 4 | Defect Resolution | Requiere disciplina en el registro de fechas en Jira |
| 5 | Escaped Defects | Requiere proceso maduro: clasificación por ambiente + monitoreo PROD |

---

## Frecuencia de Reporte Recomendada

| Métrica | Frecuencia | Canal sugerido |
|---|---|---|
| Pass/Fail Rate | Por ejecución / diario | Email automático, pipeline CI/CD |
| Test Coverage | Por sprint | Informe de cierre de sprint |
| Automation Coverage | Por sprint | Informe de cierre de sprint |
| Defect Resolution | Semanal | Dashboard Jira / reporte email |
| Escaped Defects | Por release | Retrospectiva / reunión de calidad |
