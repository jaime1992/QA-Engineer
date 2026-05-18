# QA Process — Manual de Operaciones
# QA Lead — BUPA Chile

| Campo | Detalle |
|-------|---------|
| **Autor** | Jaime Quiñelen Villar — QA Lead |
| **Proyecto** | QA-Engineer-Bupa Chile |
| **Metodologia** | SDD + Agil (Scrum) + Pipeline CI/CD |

---

## 1. Definition of Ready (DoR)

> **Cuándo usarlo:** antes de que un REQ entre al sprint. Si no cumple estos criterios, NO entra al sprint.

Un REQ está listo para el sprint cuando:

- [ ] El SDD está documentado y aprobado por QA Lead
- [ ] Los criterios de aceptacion están escritos en formato DADO/CUANDO/ENTONCES
- [ ] El alcance está claro (qué incluye y qué NO incluye)
- [ ] El ambiente de desarrollo está disponible
- [ ] No tiene dependencias bloqueantes sin resolver
- [ ] El equipo de DEV entendió los criterios (refinamiento hecho)

> Si algún punto no se cumple → el REQ vuelve a BACKLOG hasta estar listo.

---

## 2. Definition of Done (DoD)

> **Cuándo usarlo:** antes de mover un ticket a DONE. Todos los puntos deben estar verdes.

Un REQ está terminado cuando:

- [ ] Todos los Tests en TestExecution UAT están en PASS
- [ ] Todos los Tests criticos en TestExecution PROD están en PASS
- [ ] No hay bugs abiertos con severidad Critica o Alta asociados al REQ
- [ ] El spec de Cypress (si aplica) corre verde en el pipeline CI
- [ ] El reporte de ejecucion fue generado en Xray
- [ ] El ticket fue revisado y aprobado por QA Lead
- [ ] El SDD refleja el comportamiento final implementado

> Si hay bugs de severidad Media o Baja abiertos → se puede cerrar con ticket de seguimiento creado.

---

## 3. Severidad de Bugs y SLA

> **Cuándo usarlo:** cada vez que encuentres un bug en UAT o PROD. Define la urgencia y el tiempo de respuesta.

| Severidad | Descripcion | Tiempo de resolucion | Ambiente tipico |
|-----------|-------------|---------------------|-----------------|
| **Critica** | El sistema no funciona — pacientes sin acceso | 4 horas | PROD |
| **Alta** | Funcionalidad principal rota — bloquea el flujo del usuario | 24 horas | UAT / PROD |
| **Media** | Funcionalidad degradada — existe workaround | 3 dias habiles | UAT |
| **Baja** | Problema menor — cosmético o de baja frecuencia | Próximo sprint | UAT |

> **Regla PROD:** cualquier bug en PROD con severidad Critica o Alta se etiqueta como `hotfix` y se atiende de inmediato sin esperar el sprint.

---

## 4. Transiciones del Board

> **Cuándo usarlo:** para saber quién puede mover un ticket entre columnas y bajo qué condición. Evita que tickets avancen sin validacion.

| Transicion | Quien mueve | Condicion |
|------------|-------------|-----------|
| BACKLOG → SDD EN PROCESO | QA Lead | REQ identificado y asignado al sprint |
| SDD EN PROCESO → READY TO DEV | QA Lead | SDD completo y DoR cumplido |
| READY TO DEV → CODE REVIEW/PR | DEV | Desarrollo terminado, PR abierto |
| CODE REVIEW/PR → TEST UAT | DEV / QA | PR aprobado, CI verde, deploy en UAT listo |
| TEST UAT → TEST PRODUCCION | QA Lead | Todos los tests UAT en PASS, cero bugs Criticos/Altos |
| TEST PRODUCCION → DONE | QA Lead | Smoke test PROD en PASS, DoD cumplido |
| Cualquier columna → BACKLOG | QA Lead | Bug critico encontrado, REQ bloqueado |

> **Regla clave:** solo QA Lead mueve tickets a DONE. Nunca DEV ni PO.

---

## 5. Tipos de Test en Xray

> **Cuándo usarlo:** al crear un Test en Xray, debes elegir su tipo. Esto define cómo se ejecuta y se reporta.

| Tipo | Cuándo usarlo | Quien ejecuta | Estado actual |
|------|--------------|---------------|---------------|
| **Manual** | Casos que requieren validacion humana — UX, flujos complejos, UAT | QA | Activo desde el inicio |
| **Automated** | Casos cubiertos por Cypress en el pipeline CI | CI / GitHub Actions | Activo cuando el pipeline esté configurado |
| **Generic** | Validaciones que no son ni manuales ni automatizadas — checks de configuracion, infra | QA / DevOps | Usar segun necesidad |

> **Regla:** comenzar siempre con `Manual`. Migrar a `Automated` cuando el spec de Cypress este verde en CI.

---

## 6. Test Environments en Xray

> **Cuándo usarlo:** al crear un TestExecution, debes asignarle un ambiente. Esto permite filtrar reportes por entorno.

| Ambiente | Nombre en Xray | Casos que corre |
|----------|---------------|-----------------|
| UAT | `UAT` | Todos los casos del REQ (principales + edge cases) |
| Produccion | `PROD` | Solo casos principales (A, B, C — smoke test) |

**Cómo configurar en Xray:**
1. Xray → Configure Project → Test Environments
2. Crear: `UAT` y `PROD`
3. Al crear cada TestExecution → asignar el ambiente correspondiente

---

## 7. Reportes y Cadencia

> **Cuándo usarlo:** al final de cada semana y al cierre de cada sprint para comunicar el estado de calidad al equipo y stakeholders.

| Reporte | Frecuencia | Contenido | Audiencia |
|---------|-----------|-----------|-----------|
| **Reporte semanal QA** | Cada viernes | Casos ejecutados, PASS/FAIL, bugs abiertos, bloqueos | Equipo + Jefe |
| **Reporte de sprint** | Cierre de sprint | Cobertura total, tasa de aprobacion, bugs resueltos vs pendientes | PO + TI |
| **Dashboard de metricas** | Tiempo real en Jira | Estado del board, TestExecutions activos, bugs por severidad | QA Lead |
| **Reporte de regresion** | Antes de cada deploy PROD | Resultado de todos los smoke tests | Dev + PO |

**Metricas clave a reportar:**

| Metrica | Formula |
|---------|---------|
| Tasa de aprobacion | PASS / total tests × 100 |
| Tasa de rechazo | FAIL / total tests × 100 |
| Densidad de bugs | Bugs encontrados / REQs ejecutados |
| Cobertura de pruebas | Tests ejecutados / Tests planificados × 100 |
| Tiempo promedio de resolucion | Suma de dias de resolucion / total bugs |

---

## 8. Participacion de QA en Ceremonias Agiles

> **Cuándo usarlo:** como guia de qué hacer y qué decir en cada ceremonia del sprint.

### Sprint Planning
- Revisar que cada REQ del sprint tenga SDD antes de aceptarlo
- Estimar el esfuerzo de testing por REQ
- Confirmar que los ambientes UAT y PROD estaran disponibles
- Identificar dependencias que puedan bloquear el testing

### Sprint Review
- Presentar resultados de TestExecutions: tasa PASS/FAIL por REQ
- Mostrar bugs encontrados y su estado actual
- Evidenciar con capturas o videos los casos ejecutados
- Confirmar qué REQs cumplen el DoD y pueden cerrarse

### Sprint Retrospectiva
- Reportar si el DoR fue respetado (REQs entraron sin SDD?)
- Identificar casos de prueba que fallaron repetidamente
- Proponer mejoras al proceso de testing
- Revisar si los SLAs de bugs se cumplieron

### Refinamiento (Backlog Grooming)
- Revisar los REQs candidatos al proximo sprint
- Identificar criterios de aceptacion ambiguos o faltantes
- Solicitar aclaraciones al PO antes de que entren al sprint
- Estimar complejidad de testing

---

## 9. Flujo Completo de un REQ — Referencia Rapida

```
PO crea Story (BACKLOG)
  └── QA documenta SDD → verifica DoR → (SDD EN PROCESO)
        └── DoR cumplido → (READY TO DEV)
              └── DEV desarrolla → abre PR → (CODE REVIEW/PR)
                    └── CI corre unit + integration tests
                          └── PR aprobado → deploy UAT → (TEST UAT)
                                └── QA ejecuta TestExecution UAT
                                      ├── Todo PASS → (TEST PRODUCCION)
                                      │     └── QA ejecuta smoke test PROD
                                      │           ├── Todo PASS + DoD cumplido → (DONE)
                                      │           └── FAIL → Bug PROD (hotfix) → DEV corrige
                                      └── FAIL → Bug UAT → DEV corrige → re-ejecutar
```
