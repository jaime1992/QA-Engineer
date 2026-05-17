# Template: Issue Jira para REQ (Story)

Usar este template cada vez que se cree un issue de Jira para un nuevo requerimiento.
Ver decision: `decisions/2026-05-16-jira-req-description-sdd.md`

---

## Datos del issue

| Campo | Valor |
|-------|-------|
| **Tipo** | Story |
| **Proyecto** | BUPA |
| **Padre** | Epic del REQ (ej: BUPA-N) |
| **Summary** | `REQ-BUPA-XXX <Titulo del requerimiento>` |
| **Sprint** | Sprint activo (agregar via API agile) |

---

## Estructura de la descripcion (ADF)

La descripcion debe incluir las siguientes secciones tomadas del archivo `REQ-XXX-SDD.md`:

```
[Header] Autor | Spec file | URL bajo prueba | Stack | Fecha
---
## 1. Titulo
## 2. Problema que se quiere resolver
## 3. Contexto de uso
   - Usuario
   - Canal
   - Dispositivo
   - Precondiciones
   - URL
   - Stack
## 4. Objetivo
## 5. Alcance
   ### Incluye
   ### No incluye
## 6. Comportamiento esperado
   ### Flujo principal
   ### Edge Cases
## 7. Criterios de aceptacion
   ### Criterio A  (DADO / CUANDO / ENTONCES)
   ### Criterio B
   ### Criterio C
## 8. Restricciones
   ### Tecnicas
   ### De negocio
   ### De seguridad
## 9. Notas - Decisiones abiertas y dudas
   ### Decisiones abiertas
   ### Dudas
```

---

## Script de referencia

El script PowerShell para construir y enviar el ADF esta en:
`scripts/update-desc-bupa53.ps1`

Adaptar cambiando:
- La clave del issue (`BUPA-53` por la nueva)
- El contenido de cada seccion segun el SDD del nuevo REQ

---

## Epic + Story + Sprint (creacion via API)

```powershell
# 1. Crear Epic
POST /rest/api/3/issue
{ "fields": { "project": { "key": "BUPA" }, "summary": "REQ-BUPA-XXX", "issuetype": { "id": "10150" } } }

# 2. Crear Story con descripcion SDD
POST /rest/api/3/issue
{ "fields": { "project": { "key": "BUPA" }, "summary": "REQ-BUPA-XXX Titulo", "issuetype": { "id": "10149" }, "parent": { "key": "BUPA-N" }, "description": { ...ADF... } } }

# 3. Agregar Story al sprint activo
POST /rest/agile/1.0/sprint/{sprintId}/issue
{ "issues": ["BUPA-N"] }
```
