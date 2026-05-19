# QA Metrics — Framework de 5 Indicadores Gerenciales

Métricas solicitadas por gerencia para el rol QA Lead. Documento de referencia permanente.

---

## 1. Pass/Fail Rate
**Estado actual: 80% implementado**

| Componente | Existe | Detalle |
|---|---|---|
| Generación del dato | SI | `email-server.js` calcula PASADOS / FALLADOS por ejecución |
| Envío del reporte | SI | `WF-1.1` envía email HTML después de cada corrida Cypress |
| Pipeline que lo dispara | SI | `qa-pipeline.yml` ejecuta Cypress en cada push |
| Dashboard histórico | NO | `WF-1.10` existe pero está sin activar |

**Pendiente:** Activar `WF-1.10` y agregar acumulación histórica de resultados.

---

## 2. Test Coverage
**Estado actual: 40% implementado**

| Componente | Existe | Detalle |
|---|---|---|
| Test Plans documentados | SI | `REQ-001-Test-Plan.md`, `REQ-002-Test-Plan.md` |
| Índice de requerimientos | SI | `_index.md` con REQ-001 y REQ-002 |
| Matriz cobertura REQ vs TC | NO | No existe archivo que cruce reqs con TCs |
| Porcentaje de cobertura calculado | NO | No hay fórmula ni dashboard con este número |

**Pendiente:** Crear matriz de cobertura (tabla) que liste cada REQ, sus TCs asociados y calcule el porcentaje cubierto.

---

## 3. Automation Coverage
**Estado actual: 30% implementado**

| Componente | Existe | Detalle |
|---|---|---|
| Tests automatizados | SI | 3 TCs en `Bupa-smoke_test.cy.js` (REQ-001 happy path) |
| Conteo de tests manuales | PARCIAL | Están en Test Plans pero no consolidados |
| Ratio automatizado/total | NO | No existe cálculo de este indicador |
| Reporte de automation coverage | NO | `WF-1.10` no incluye este dato aún |

**Pendiente:** Consolidar total de TCs y aplicar fórmula `(TCs automatizados / total TCs) * 100`. Agregar a `WF-1.10`.

---

## 4. Escaped Defects
**Estado actual: 20% implementado**

| Componente | Existe | Detalle |
|---|---|---|
| Tracking de bugs por REQ | SI | `REQ-001-bugs.md`, `REQ-002-bugs.md` |
| Integración con Jira | SI | `WF-1.2` (bugs abiertos diario), `WF-1.8` (bugs críticos) |
| Distinción UAT vs PROD | NO | Bugs no clasificados por ambiente donde se detectaron |
| Dashboard de escaped defects | NO | No existe reporte específico de defectos llegados a PROD |

**Pendiente:** Definir en Jira campo o etiqueta `found-in: UAT | PROD` y filtrar bugs encontrados en PROD.

---

## 5. Defect Resolution
**Estado actual: 25% implementado**

| Componente | Existe | Detalle |
|---|---|---|
| Lista de bugs en Jira | SI | `WF-1.2` extrae bugs abiertos cada mañana |
| Estado diario QA | SI | `WF-1.4` envía resumen a las 6pm |
| Tiempo de resolución calculado | NO | No hay comparación fecha apertura vs cierre |
| Aging de defectos (SLA) | NO | No existe alerta por defectos con más de X días abiertos |
| Tasa de cierre semanal | NO | `WF-1.10` sin activar y sin este KPI |

**Pendiente:** Agregar a `WF-1.2` el cálculo de días abiertos (fecha hoy - fecha creación) y definir SLA por severidad.

---

## Resumen Ejecutivo

| Métrica | Estado | Prioridad |
|---|---|---|
| Pass/Fail Rate | 80% | Baja — solo activar WF-1.10 |
| Test Coverage | 40% | Alta — base para las demás métricas |
| Automation Coverage | 30% | Alta — deriva directamente de Test Coverage |
| Defect Resolution | 25% | Media — requiere dato de Jira |
| Escaped Defects | 20% | Media — requiere proceso previo en Jira |

**Orden de implementación recomendado:** Test Coverage → Automation Coverage → Pass/Fail Rate (WF-1.10) → Defect Resolution → Escaped Defects.

---

## SLA de Referencia (por definir con gerencia)

| Severidad | Tiempo máximo resolución |
|---|---|
| Critical / Blocker | 1 día hábil |
| High | 2 días hábiles |
| Medium | 5 días hábiles |
| Low | 10 días hábiles |
