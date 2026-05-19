# Convención de ubicación de artefactos por REQ

**Fecha:** 2026-05-19
**Estado:** Aceptada

## Contexto

Al generar artefactos para un REQ específico (planes de prueba en Excel, CSV de Xray, PDFs de SDD, reportes de bugs), se guardaron por defecto en la carpeta `docs/` sin consultar al usuario. El usuario corrigió que esos archivos deben vivir junto al REQ que documentan.

## Decisión

Todo artefacto generado para un REQ específico se guarda en la carpeta del REQ correspondiente:

```
.claude/project/requirements/REQ-BUPA-XXX-nombre/
  ├── REQ-XXX-SDD.md
  ├── REQ-XXX-Test-Plan.md
  ├── REQ-XXX-bugs.md
  ├── TestPlan-REQ-XXX.xlsx
  └── TestPlan-REQ-XXX-Xray.csv
```

**Carpeta `docs/`** — reservada exclusivamente para artefactos de presentación y referencia general del proyecto:
- Dashboards HTML (`qa-playbook.html`, `qa-sprint1-status.html`)
- Archivos PPTX (`qa-playbook-bupa.pptx`)
- Documentos de referencia general

**Regla operativa:** antes de guardar cualquier archivo generado, preguntar al usuario la ubicación deseada si no está explícitamente indicada en el prompt.

## Consecuencias

- Los artefactos de cada REQ quedan centralizados y son fáciles de encontrar
- La carpeta `docs/` se mantiene limpia con solo artefactos de presentación
- Claude pregunta antes de decidir ubicaciones de archivos
