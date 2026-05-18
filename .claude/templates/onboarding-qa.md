# Onboarding QA Lead — Checklist de Entrada a Proyecto

| Campo | Detalle |
|-------|---------|
| **QA Lead** | [Nombre] |
| **Empresa** | [Empresa] |
| **Proyecto** | [Nombre del proyecto] |
| **Fecha de inicio** | YYYY-MM-DD |

---

## Semana 1 — Escuchar y mapear

### Accesos y herramientas
- [ ] Acceso a Jira confirmado
- [ ] Acceso al repositorio de codigo (GitHub / GitLab)
- [ ] Acceso al ambiente UAT
- [ ] Acceso al ambiente PROD (modo lectura)
- [ ] Acceso a la herramienta de testing (Xray, TestRail, etc.)
- [ ] Acceso a la herramienta de CI/CD (GitHub Actions, Jenkins, etc.)
- [ ] Acceso a comunicacion del equipo (Slack, Teams)
- [ ] Acceso a documentacion del producto (Confluence, Notion, Drive)

### Entender el stack
- [ ] Stack frontend identificado: [Angular / React / Vue / otro]
- [ ] Stack backend identificado: [Node / Java / Python / otro]
- [ ] Base de datos identificada: [Postgres / MySQL / MongoDB / otro]
- [ ] Ambientes disponibles mapeados: [DEV / UAT / STAGING / PROD]
- [ ] Pipeline CI/CD existente revisado (si existe)
- [ ] Herramientas de testing actuales identificadas

### Entender el equipo
- [ ] Conocer al PO / Product Manager
- [ ] Conocer a los desarrolladores del equipo
- [ ] Conocer al Tech Lead o Arquitecto
- [ ] Conocer al Scrum Master (si existe)
- [ ] Entender la cadencia de sprints (duracion, ceremonias)
- [ ] Identificar quien despliega a cada ambiente

### Entender los procesos actuales
- [ ] Existe proceso de QA hoy? Si / No — documentar cual
- [ ] Como se reportan bugs actualmente?
- [ ] Hay casos de prueba documentados? Si / No
- [ ] Hay tests automatizados? Si / No — identificar cuales
- [ ] Cual es el Definition of Done actual?
- [ ] Como se manejan los deploys a produccion?

---

## Semana 2 — Documentar y proponer

### Mapeo de requerimientos
- [ ] Requerimientos funcionales principales identificados
- [ ] Flujos criticos del negocio mapeados
- [ ] Primer SDD documentado para el REQ mas critico
- [ ] Casos de prueba manuales escritos para flujos criticos

### Propuesta QA
- [ ] Estrategia QA inicial documentada
- [ ] Definition of Ready propuesto al equipo
- [ ] Definition of Done propuesto al equipo
- [ ] SLAs de bugs propuestos
- [ ] Herramientas de testing propuestas (si hay cambios)

### Setup del proyecto QA
- [ ] Proyecto Jira configurado con columnas del board
- [ ] Issue types mapeados (Epic, Story, Bug, Test, TestPlan, TestExecution)
- [ ] Primer Epic creado por area de trabajo
- [ ] Estructura de carpetas Xray creada (si aplica)

---

## Semana 3 — Ejecutar y evidenciar

### Primera ronda de pruebas
- [ ] Primera ejecucion manual documentada en Xray
- [ ] Primer bug registrado en Jira con trazabilidad completa
- [ ] Primer reporte semanal QA entregado al equipo

### Setup de automatizacion
- [ ] Proyecto Cypress inicializado (si no existe)
- [ ] cypress.config.js configurado con los ambientes del proyecto
- [ ] Primer spec de smoke test creado
- [ ] Spec corriendo localmente sin errores

---

## Semana 4 — Automatizar y consolidar

### Pipeline CI/CD
- [ ] Primer workflow GitHub Actions creado para Cypress
- [ ] Pipeline corriendo en PR contra branch principal
- [ ] Quality gate configurado (bloquea merge si E2E falla)
- [ ] Reporte de resultados configurado (email, Slack o artifact)

### Consolidacion
- [ ] Retrospectiva del primer mes realizada
- [ ] Proceso QA acordado con el equipo documentado
- [ ] Roadmap QA para el siguiente mes definido
- [ ] Metricas base establecidas (cobertura actual, tasa de bugs)

---

## Preguntas clave a responder en la primera semana

### Producto
- [ ] Cual es el flujo mas critico para el negocio?
- [ ] Que pasa si ese flujo falla en produccion?
- [ ] Cuantos usuarios activos tiene el sistema?
- [ ] Hay SLA de disponibilidad definido? Cual?

### Tecnicas
- [ ] Existe un ambiente de staging antes de PROD?
- [ ] Hay un endpoint de health check (/api/health o similar)?
- [ ] Como se manejan los datos de prueba en UAT?
- [ ] Los datos de UAT son anonimizados o son datos reales?
- [ ] Hay feature flags o configuraciones por ambiente?

### Proceso
- [ ] El equipo hace code review? Quien aprueba los PRs?
- [ ] Hay regresiones frecuentes en produccion? De que tipo?
- [ ] Existe documentacion de los requerimientos o todo esta en la cabeza del PO?
- [ ] Se han perdido bugs en produccion por falta de QA? Cuales?

### Legal y seguridad
- [ ] Hay datos sensibles o personales en el sistema?
- [ ] Existe alguna regulacion aplicable? (ley de datos, HIPAA, PCI, etc.)
- [ ] Los ambientes de prueba cumplen con las mismas restricciones que PROD?

---

## Red flags a detectar temprano

| Señal | Riesgo | Accion |
|-------|--------|--------|
| No hay ambientes separados (solo PROD) | Probar directamente en produccion | Proponer ambiente UAT urgente |
| Deploys manuales sin pipeline | Errores humanos en cada deploy | Proponer GitHub Actions basico |
| Bugs sin trazabilidad a requerimientos | No se puede medir impacto | Implementar Jira desde el dia 1 |
| Sin DoD definido | Tickets que nunca terminan | Proponer DoD en semana 2 |
| Dev hace QA de su propio codigo | Sesgo — no detectan sus propios errores | Separar roles claramente |
| Datos de produccion en UAT | Riesgo legal y de privacidad | Anonimizar o generar datos sinteticos |
