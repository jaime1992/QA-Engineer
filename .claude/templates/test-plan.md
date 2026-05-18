# Test Plan — REQ-XXX | [Titulo del Requerimiento]

| Campo | Detalle |
|-------|---------|
| **REQ** | REQ-XXX |
| **Autor** | [Nombre] — QA Lead |
| **Ambiente** | UAT / PROD |
| **Sprint** | Sprint N |
| **Fecha** | YYYY-MM-DD |
| **Spec file** | `nombre-spec.cy.js` |

---

## 1. Objetivo del Test Plan

Validar que [titulo del requerimiento] cumple los criterios de aceptacion definidos
en el SDD antes de su deploy a produccion.

---

## 2. Alcance

**Incluye:**
- Ejecucion de todos los casos FP en UAT y PROD
- Ejecucion de todos los casos EC en UAT
- Registro de resultados en Xray

**No incluye:**
- Testing en ambiente DEV (responsabilidad del equipo Dev)
- [Otros REQs o modulos fuera de este plan]

---

## 3. Casos de prueba

### Flujo Principal (FP) — ejecutar en UAT y PROD

| ID | Titulo | Tipo | Criterio SDD | Automatizado |
|----|--------|------|-------------|-------------|
| TC-001-FP | [titulo] | Manual / Automated | Criterio A | Si / No |
| TC-002-FP | [titulo] | Manual / Automated | Criterio B | Si / No |
| TC-003-FP | [titulo] | Manual / Automated | Criterio C | Si / No |

### Edge Cases (EC) — ejecutar solo en UAT

| ID | Titulo | Tipo | Escenario |
|----|--------|------|-----------|
| TC-001-EC | [titulo] | Manual | [escenario] |
| TC-002-EC | [titulo] | Manual | [escenario] |

---

## 4. Criterios de entrada (antes de ejecutar)

- [ ] SDD aprobado por QA Lead
- [ ] Deploy en UAT completado
- [ ] Datos de prueba disponibles en UAT
- [ ] Acceso al ambiente UAT confirmado
- [ ] Xray configurado con los Tests del REQ

---

## 5. Criterios de salida (para aprobar el REQ)

- [ ] 100% de casos FP en PASS
- [ ] 100% de casos EC en PASS (o con bug registrado si hay FAIL justificado)
- [ ] Cero bugs de severidad Critica o Alta abiertos
- [ ] TestExecution UAT registrado en Xray
- [ ] TestExecution PROD registrado en Xray (smoke)

---

## 6. Datos de prueba

| Dato | Valor | Ambiente |
|------|-------|----------|
| Usuario | [usuario de prueba] | UAT |
| [Campo] | [valor] | UAT / PROD |

---

## 7. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigacion |
|--------|-------------|---------|------------|
| [Riesgo 1] | Alta / Media / Baja | Alto / Medio / Bajo | [accion] |

---

## 8. Resultado de ejecucion

### TestExecution UAT — TE-UAT-NNN

| ID | Titulo | Resultado | Bug | Notas |
|----|--------|-----------|-----|-------|
| TC-001-FP | | PASS / FAIL / BLOCKED | | |
| TC-002-FP | | PASS / FAIL / BLOCKED | | |
| TC-001-EC | | PASS / FAIL / BLOCKED | | |

**Resumen UAT:**
- Total: N
- PASS: N
- FAIL: N
- Tasa aprobacion: N%

### TestExecution PROD — TE-PROD-NNN

| ID | Titulo | Resultado | Notas |
|----|--------|-----------|-------|
| TC-001-FP | | PASS / FAIL | |
| TC-002-FP | | PASS / FAIL | |

**Resumen PROD:**
- Total: N
- PASS: N
- FAIL: N
- Tasa aprobacion: N%

---

## 9. Decision final

- [ ] **APROBADO** — REQ cumple todos los criterios de salida → mover a DONE
- [ ] **RECHAZADO** — Hay fallos bloqueantes → permanece en TEST UAT
- [ ] **APROBADO CON OBSERVACIONES** — Fallos menores con ticket de seguimiento creado
