# ADR: Descripcion de issues Jira para REQs incluye SDD completo

**Fecha:** 2026-05-16
**Estado:** Aceptada

## Contexto

Al crear un issue de Jira (Story o Task) para representar un requerimiento (REQ-BUPA-XXX), el ticket quedaba con descripcion minima o vacia. Quien abria el ticket en Jira tenia que buscar el archivo SDD local para entender el contexto completo del requerimiento.

## Decision

Siempre incluir el contenido completo del SDD en la descripcion del issue de Jira al momento de crearlo, usando formato ADF (Atlassian Document Format) para Jira API v3.

Las secciones a incluir son, en orden:
1. Titulo
2. Problema que se quiere resolver
3. Contexto de uso
4. Objetivo
5. Alcance (Incluye / No incluye)
6. Comportamiento esperado (Flujo principal + Edge Cases)
7. Criterios de aceptacion (formato DADO/CUANDO/ENTONCES)
8. Restricciones (Tecnicas / De negocio / De seguridad)
9. Notas - Decisiones abiertas y dudas

## Consecuencias

- El issue de Jira es autosuficiente: cualquier miembro del equipo entiende el REQ sin acceder al repositorio local
- El script de referencia para construir el ADF esta en `scripts/update-desc-bupa53.ps1`
- La plantilla reutilizable esta en `templates/jira-req-issue-template.md`
- Aplica a todos los REQs futuros: REQ-BUPA-002, REQ-BUPA-003, etc.
