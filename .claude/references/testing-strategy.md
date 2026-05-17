# Estrategia de Pruebas — QA-Engineer BUPA Chile

## Regla base

```
Manual      = TODOS los casos (FP + EC) ejecutados en UAT
Automatizado = SOLO flujos principales (FP) ejecutados en UAT y PROD
```

---

## Tipos de prueba por caso

| Tipo de caso | Prueba manual | Prueba automatizada |
|--------------|--------------|---------------------|
| Flujo Principal (FP) | Si — en UAT | Si — Cypress en UAT y PROD |
| Edge Case (EC) | Si — en UAT | No — dificil de simular en CI/CD |

---

## Cuando ejecutar cada tipo

### Pruebas manuales
- Se ejecutan en **UAT** antes de cada deploy a PROD
- Cubren todos los casos del Test Plan (FP + EC)
- Se registran en Xray con PASS / FAIL
- Si hay FAIL → se crea un Bug en Jira

### Pruebas automatizadas
- Se ejecutan en **UAT y PROD** via Cypress
- Cubren solo los criterios de aceptacion (FP)
- Corren automaticamente al terminar la ejecucion
- Resultado llega por correo Gmail (reporte HTML)

---

## Por que los EC no se automatizan

| Edge Case | Por que no se automatiza |
|-----------|--------------------------|
| Servidor caido | Requiere apagar el servidor real — no reproducible en CI/CD |
| Carga lenta | Requiere throttling de red — variable segun entorno |
| Dominio incorrecto | Requiere configurar redirects en infraestructura |
| Sin certificado HTTPS | El servidor redirige automaticamente — no hay escenario real que falle |

---

## Flujo completo por REQ

```
1. SDD documentado → criterios de aceptacion definidos
2. Dev desarrolla la funcionalidad
3. QA ejecuta pruebas MANUALES en UAT
      → todos los FP + todos los EC
      → registra en Xray PASS / FAIL
      → crea Bug si hay FAIL
4. UAT aprobado → deploy a PROD
5. QA ejecuta pruebas AUTOMATIZADAS en PROD (smoke)
      → solo FP via Cypress
      → resultado por correo
6. Todo verde → ticket a DONE
```

---

## Conexion entre artefactos

```
SDD (criterios 1..N)
  └── Criterio A → TC-001-FP → it() en Cypress    ← automatizado
  └── Criterio B → TC-002-FP → it() en Cypress    ← automatizado
  └── Criterio C → TC-003-FP → it() en Cypress    ← automatizado
  └── Edge Case  → TC-001-EC → paso a paso manual  ← solo manual
  └── Edge Case  → TC-002-EC → paso a paso manual  ← solo manual
```

---

## Ambientes por tipo de prueba

| Ambiente | Manual | Automatizado |
|----------|--------|-------------|
| DEV | No — responsabilidad del equipo Dev | No |
| UAT | Si — todos los casos FP + EC | Si — solo FP |
| PROD | No — solo smoke automatizado | Si — solo FP |
