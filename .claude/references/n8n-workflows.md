# n8n Workflows — Guia de Referencia QA

Indice completo de workflows n8n del sistema QA.
Aplica a BUPA y cualquier proyecto donde se implemente esta arquitectura.
n8n local: `http://localhost:5678`
Backup: `https://github.com/jaime1992/n8n_backup`

---

## Indice rapido

| ID | Nombre | Trigger | Salida | Estado |
|----|--------|---------|--------|--------|
| WF-1.1 | Cypress Regression → Gmail | Webhook POST | Email HTML con resultados | ✅ Activo |
| WF-1.2 | Jira Bugs Abiertos → Gmail | Cron 9am diario | Email Excel con bugs | ✅ Activo |
| WF-1.3 | Nuevos KAN Jira → Gmail | Cron 2min | Email con tasks nuevas | ⚠️ Inactivo (arreglar) |
| WF-1.4 | Estatus Diarios QA | Cron 6pm diario | Email resumen del dia | ✅ Activo |
| WF-1.5 | Validar Ambientes QA | Cron cada hora L-V | Email estado de salud | ✅ Activo |
| WF-1.6 | Jira Task → SDD PDF + Gmail + WhatsApp | Cron 5min | PDF SDD + Email + WA | ⚠️ Inactivo (arreglar) |
| WF-1.8 | Cypress Critical + Jira Highest → WhatsApp + Gmail | Webhook + Cron | WhatsApp + Email alerta | ⚠️ Inactivo (arreglar) |
| WF-1.9 | GitHub Pipeline → Gmail + WhatsApp + Jira | Webhook GitHub | Email + WA + Task Jira | ✅ Activo |
| WF-1.10 | Dashboard Semanal QA (Jira+GitHub) | Cron Mar/Vie 4pm | Email dashboard KPIs | ⚠️ Inactivo |

---

## WF-1.1 — Cypress Regression → Gmail

**Que hace:** Al terminar una ejecucion Cypress, el hook `after:run` envia los resultados al **email-server.js** que genera y envia un email HTML con el reporte completo — verde si PASS, rojo si FAIL.

> ⚠️ Este WF NO usa n8n como intermediario. Cypress llama directamente al email-server.js.
> El JSON del WF-1.1 en n8n existe como referencia pero el flujo activo bypasea n8n.

**Trigger:** Hook `after:run` en `cypress.config.js` al finalizar cada run
**Endpoint real:** `POST http://localhost:3025/run-cypress-report` → email-server.js
**Salida:** Email HTML a `jaimeqv.2609@gmail.com`

**Flujo real activo:**
```
Cypress after:run → POST localhost:3025/run-cypress-report → email-server.js → Gmail
```

**Campos del email:**
- Asunto: `🧪 [WF-1.1] Cypress #Test Regresion# {spec} {PASS/FAIL} — {N}✅ {N}❌ | {fecha}`
- Header verde (PASS) o rojo (FAIL)
- Boxes: PASADOS / FALLADOS / PENDIENTES / DURACION
- Tabla caso a caso: titulo, estado, duracion, error

**Estado:** ✅ Activo — funciona correctamente via email-server.js

---

## WF-1.2 — Jira Bugs Abiertos → Excel → Gmail (9am)

**Que hace:** Cada mañana a las 9am consulta Jira, extrae todos los bugs abiertos, genera un Excel y lo envia por email.

**Trigger:** Cron diario 9:00am
**Salida:** Email con adjunto Excel — lista de bugs por severidad

**Nodos:**
```
Schedule 9am → Jira: Bugs abiertos (HTTP) → Procesar + Excel (Code) → Gmail (HTTP)
```

**Valor para QA:** El equipo llega cada mañana con el estado de bugs actualizado sin tener que entrar a Jira.

**Estado:** ✅ Activo

---

## WF-1.3 — Nuevos KAN Jira → Excel + Gmail (cada 2min) ⚠️

**Que hace:** Cada 2 minutos detecta si hay tasks nuevas en el board de Jira y las notifica por email con Excel.

**Trigger:** Cron cada 2 minutos
**Salida:** Email con Excel de tasks nuevas (solo si hay nuevas)

**Nodos:**
```
Schedule 2min → Jira Tasks nuevas (HTTP) → ¿Hay nuevas? (IF)
  ├── SI → Split → Filtrar nuevos → Preparar datos → Excel + Gmail
  └── NO → Sin Tasks nuevas (NoOp)
```

**Problema:** Marcado como ARREGLAR — probablemente el filtro de "nuevos" no funciona correctamente y genera duplicados o falsos positivos.

**Estado:** ⚠️ Inactivo — requiere revision del nodo `Filtrar Nuevos`

**Mejora sugerida:** Guardar IDs ya notificados en un archivo o variable estatica para evitar renotificar las mismas tasks.

---

## WF-1.4 — Estatus Diarios QA (6pm)

**Que hace:** Cada dia a las 6pm consulta Jira (tasks + bugs + stories) y envia un resumen HTML del estado del dia.

**Trigger:** Cron diario 6:00pm
**Salida:** Email HTML con resumen: tasks activas, bugs abiertos, stories en progreso

**Nodos:**
```
Schedule 6pm → Jira: Tasks + Bugs + Stories (HTTP) → Procesar + HTML (Code) → Gmail (HTTP)
```

**Valor para QA:** Cierre de dia automatico — jefe/equipo recibe estado sin que QA tenga que escribir nada.

**Estado:** ✅ Activo

---

## WF-1.5 — Validar Ambientes QA (cada hora L-V)

**Que hace:** Cada hora en dias laborales verifica que los ambientes QA esten respondiendo y reporta el estado de salud.

**Trigger:** Cron cada hora, lunes a viernes
**Salida:** Email con estado de cada ambiente (UP/DOWN + tiempo de respuesta)

**Nodos:**
```
Schedule hora L-V → Validar Ambientes + HTML (Code) → Enviar Email (HTTP)
```

**Ambientes que monitorea:** Los configurados en el Code node — tipicamente UAT y PROD.

**Estado:** ✅ Activo

**Mejora sugerida:** Agregar alerta WhatsApp solo cuando un ambiente esta DOWN — actualmente envia email siempre (aunque todo este OK).

---

## WF-1.6 — Jira Task/Story → SDD PDF + Gmail + WhatsApp ⚠️

**Que hace:** Detecta tasks o stories nuevas en Jira, genera el PDF del SDD automaticamente y lo envia por Gmail y WhatsApp.

**Trigger:** Cron cada 5 minutos
**Salida:** PDF SDD + Email + mensaje WhatsApp

**Nodos:**
```
Schedule 5min → Jira Tasks/Stories nuevas (HTTP) → Validar duplicados (Code)
  → ¿Hay nuevas? (IF)
    ├── SI → Construir SDD (Code) → Generar PDF (HTTP) → Preparar Email+WA (Code) → Gmail+PDF (HTTP)
    └── NO → Sin tareas nuevas (NoOp)
```

**Problema:** Marcado como ARREGLAR — posiblemente el generador de PDF o el endpoint externo de PDF tiene problemas.

**Estado:** ⚠️ Inactivo — alto valor cuando funcione (automatiza toda la documentacion SDD)

**Mejora sugerida:** Una vez arreglado, es el workflow mas valioso del stack — elimina trabajo manual de documentacion.

---

## WF-1.8 — Cypress Critical + Jira Highest → WhatsApp + Gmail ⚠️

**Que hace:** Combina dos fuentes de alerta critica: fallos Cypress y issues Highest en Jira. Envia WhatsApp + email al equipo.

**Trigger dual:**
- Webhook desde Cypress (cuando hay failures)
- Cron que revisa Jira por issues con prioridad Highest

**Salida:** WhatsApp + Email de alerta critica

**Nodos:**
```
Webhook Cypress ──┐
                  ├── IF Hay Issues Highest → Normalizar (Code) → Preparar Mensajes (Code)
Schedule Jira ───┘                                              → WhatsApp + Email
```

**Problema:** Marcado como ARREGLAR — logica de merge de dos triggers puede estar rota.

**Estado:** ⚠️ Inactivo

**Mejora sugerida:** Separar en dos workflows independientes (WF-1.8a Cypress, WF-1.8b Jira) para simplificar la logica y facilitar el debug.

---

## WF-1.9 — GitHub Pipeline → Gmail + WhatsApp + Jira

**Que hace:** Recibe el resultado del pipeline de GitHub Actions y segun si paso o fallo: envia email + WhatsApp, y si fallo crea una task en Jira automaticamente.

**Trigger:** Webhook desde GitHub Actions (configurado en el workflow yml)
**Endpoint:** URL del webhook en n8n (configurar en GitHub Actions secrets)

**Nodos:**
```
Webhook GitHub → IF Pipeline Falló
  ├── FALLO → Preparar Mensaje Fallo → Gmail Fallo + WhatsApp Jaime + Jira Crear Tarea
  └── OK    → Preparar Mensaje OK   → Gmail Pipeline OK
```

**Configuracion requerida en GitHub Actions:**
```yaml
- name: Notificar n8n
  if: always()
  run: |
    curl -X POST ${{ secrets.N8N_WEBHOOK_URL }} \
      -H "Content-Type: application/json" \
      -d '{"status":"${{ job.status }}","branch":"${{ github.ref_name }}","actor":"${{ github.actor }}"}'
```

**Estado:** ✅ Activo — confirmado funcionando (email recibido con PASSED)

---

## WF-1.10 — Dashboard Semanal QA (Jira + GitHub)

**Que hace:** Martes y viernes a las 4pm genera un dashboard HTML con KPIs de la semana: bugs abiertos/resueltos, pipeline runs, tasa de aprobacion.

**Trigger:** Cron martes y viernes 4:00pm (hora Chile)
**Salida:** Email HTML premium con KPIs y metricas de la semana

**Nodos:**
```
Schedule Mar/Vie 4pm → Jira: Bugs Abiertos (HTTP)
                     → Jira: Bugs Resueltos (HTTP)
                     → GitHub: Pipeline Runs (HTTP)
                     → GitHub: Jobs Ultimo Run (HTTP)
                     → Calcular KPIs + HTML Premium (Code)
                     → Gmail Dashboard (HTTP)
```

**Metricas que calcula:**
- Bugs abiertos / resueltos esta semana
- Tasa de aprobacion del pipeline
- Ultimo resultado de CI/CD

**Estado:** ⚠️ Inactivo — listo para activar, requiere validar credenciales Jira y GitHub token

---

## email-server.js

Servidor Express local que actua como intermediario entre Cypress y Gmail.
Corre con pm2 en `http://localhost:3025`.

**Archivo:** `c:\Quality_Assurance_IA\QA-Engineer\email-server.js`
**Puerto:** 3025 (configurado en `.env`)
**Gestionado por:** pm2 — `pm2 start email-server` / `pm2 restart email-server`

**Endpoints:**

| Endpoint | Metodo | Quien llama | Que hace |
|----------|--------|-------------|----------|
| `/run-cypress-report` | POST | Cypress `after:run` | Genera email HTML con reporte de tests |
| `/send-email` | POST | Cualquier cliente | Envia email generico con `to`, `subject`, `body` |
| `/health` | GET | Monitoreo | Verifica que el servidor esta UP |

**Variables de entorno (.env):**
```
GMAIL_USER=jaimeqv.2609@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_PORT=3025
```

**Comandos pm2:**
```bash
pm2 status                    # ver estado
pm2 restart email-server      # reiniciar
pm2 logs email-server         # ver logs
```

---

## Arquitectura general del sistema

```
CYPRESS (tests E2E)
  └── after:run → POST localhost:3025/run-cypress-report → email-server.js → Gmail (WF-1.1)
  └── failure   → Webhook n8n → WF-1.8 → WhatsApp + Email critico

GITHUB ACTIONS (pipeline CI/CD)
  └── on finish → Webhook n8n        → WF-1.9 → Email + WhatsApp + Jira task (si falla)

JIRA (board)
  └── bugs abiertos    → WF-1.2 (9am)   → Email Excel diario
  └── tasks nuevas     → WF-1.3 (2min)  → Email notificacion (arreglar)
  └── stories nuevas   → WF-1.6 (5min)  → PDF SDD + Email + WhatsApp (arreglar)
  └── issues Highest   → WF-1.8 (cron)  → WhatsApp + Email critico (arreglar)

AMBIENTES (UAT/PROD)
  └── health check     → WF-1.5 (hora)  → Email estado de salud

DASHBOARD
  └── KPIs semana      → WF-1.10 (Mar/Vie 4pm) → Email dashboard
```

---

## Estado de cada WF y proximas acciones

| WF | Estado | Proxima accion |
|----|--------|---------------|
| WF-1.1 | ✅ Activo | Ninguna — funciona correctamente |
| WF-1.2 | ✅ Activo | Ninguna |
| WF-1.3 | ⚠️ Arreglar | Revisar nodo `Filtrar Nuevos` — guardar IDs ya notificados |
| WF-1.4 | ✅ Activo | Ninguna |
| WF-1.5 | ✅ Activo | Agregar alerta WhatsApp solo cuando ambiente esta DOWN |
| WF-1.6 | ⚠️ Arreglar | Revisar endpoint generador de PDF — alto valor cuando funcione |
| WF-1.8 | ⚠️ Arreglar | Separar en WF-1.8a (Cypress) y WF-1.8b (Jira) |
| WF-1.9 | ✅ Activo | Configurar webhook URL en GitHub Actions secrets |
| WF-1.10 | ⚠️ Activar | Validar credenciales Jira + GitHub token y activar |

---

## Mejoras globales recomendadas

| Mejora | Impacto | Esfuerzo |
|--------|---------|---------|
| Centralizar credenciales en variables de entorno n8n | Alto — un solo lugar para rotar tokens | Bajo |
| Agregar nodo de error handler en cada WF | Alto — hoy si un WF falla silenciosamente no se sabe | Medio |
| WF-1.3: guardar IDs notificados para evitar duplicados | Medio — evita spam | Bajo |
| WF-1.5: WhatsApp solo cuando hay DOWN | Medio — reduce ruido en notificaciones | Bajo |
| WF-1.6: arreglar generador PDF | Alto — automatiza documentacion SDD completa | Alto |
| WF-1.8: separar en dos workflows | Medio — facilita debug y mantenimiento | Bajo |
| WF-1.10: activar y validar | Alto — dashboard ejecutivo automatico | Bajo |
| Agregar WF de backup automatico a GitHub | Alto — hoy el backup es manual | Medio |
