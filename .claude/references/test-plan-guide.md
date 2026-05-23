# Cómo Crear un Plan de Pruebas: Pasos, Ejemplos y Plantilla
**Autor:** Hannah Son  
**Traducido y adaptado al contexto QA — BUPA Chile**

---

## ¿Qué es un plan de pruebas?

Un plan de pruebas define la estrategia, los objetivos, el alcance y el enfoque de ejecución del equipo de QA, para garantizar que el software se pruebe de forma exhaustiva y consistente antes del release. Proporciona a los stakeholders una visión compartida de qué se probará, cómo se realizarán las pruebas y qué condiciones deben cumplirse antes de avanzar con un release.

Un plan de pruebas es típicamente un documento (o artefacto documentado) que explica:

- El alcance de las pruebas
- Los objetivos
- La estrategia
- El cronograma
- Los recursos
- Los criterios de salida (exit criteria)

No tiene que ser un documento largo ni formal. Puede ser:

- Un plan de pruebas de una sola página
- Un documento compartido (Confluence, Google Doc, etc.)
- Una entrada en una herramienta de gestión de pruebas (como un milestone o plan en TestRail)
- Una plantilla estructurada en un sistema de tickets

> En equipos Agile y de ritmo rápido, el plan de pruebas debe tratarse como un **documento vivo** y actualizarse conforme cambian el alcance, los cronogramas o las prioridades.

---

## Cómo crear un plan de pruebas

Crear un plan de pruebas es más sencillo cuando se divide en pasos claros y repetibles. Los seis pasos siguientes ayudan a definir el alcance, alinear cronogramas, documentar expectativas y preparar al equipo para ejecutar pruebas de forma eficiente.

**Siga estos seis pasos para crear un plan de pruebas eficiente:**

1. Definir el alcance del release
2. Establecer cronogramas
3. Definir los objetivos de prueba
4. Determinar los entregables de prueba
5. Diseñar la estrategia de pruebas
6. Planificar el entorno de prueba y los datos de prueba

---

## Paso 1 — Definir el alcance del release

Antes de realizar cualquier actividad de prueba, es fundamental definir el alcance. Esto implica:

- Definir las funcionalidades o características que deben incluirse en el release
- Considerar restricciones y dependencias que puedan afectar el release
- Determinar el tipo de release

**Preguntas clave al definir el alcance:**

- ¿Se están liberando nuevas funcionalidades en esta versión?
- ¿Cuáles son las áreas de mayor riesgo?
- ¿Existen áreas donde se han visto regresiones en el pasado?
- ¿Qué tipo de release es? ¿Mantenimiento (bug fixes)? ¿Feature menor? ¿Feature mayor?
- ¿Qué significa "terminado" para el equipo?

Trabajar con desarrolladores y product managers para entender el alcance garantiza que la información sea precisa y que exista un entendimiento común de los objetivos, expectativas y funcionalidades del producto.

---

## Paso 2 — Establecer cronogramas

Defina un cronograma claro de pruebas basado en las fechas límite del release. Un calendario realista ayuda al equipo a planificar el diseño de pruebas, la ejecución, la verificación de defectos y el reporte sin apresurar trabajo crítico.

**Recomendaciones para construir el cronograma:**

- **Confirmar el cronograma con el Project Manager:** asegúrese de entender fechas clave, dependencias y plazos no negociables.
- **Revisar releases anteriores:** analice cronogramas pasados para estimar cuánto tomó trabajo similar y dónde ocurrieron retrasos.
- **Considerar fechas externas:** si el release debe alinearse con eventos (conferencias, campañas, compromisos con clientes), inclúyalos en la planificación.
- **Alinearse con el desarrollo:** entienda cuándo se espera que el trabajo de desarrollo esté completo para planificar ejecución y validación de bugs.
- **Agregar tiempo de buffer:** los retrasos inesperados son comunes. Reserve tiempo extra para cambios de código tardíos, problemas de entorno o re-testing.
- **Revisar el cronograma regularmente:** actualícelo conforme cambien el alcance, las prioridades o las fechas de entrega.

---

## Paso 3 — Definir los objetivos de prueba

Los objetivos de prueba explican **por qué** se diseña y ejecuta una prueba. Ayudan al equipo a enfocar los esfuerzos, definir qué es el éxito y mantener el alcance alineado con las prioridades del release.

**Ejemplos de objetivos generales:**

- Identificar y reportar defectos
- Validar funcionalidades nuevas o modificadas
- Alcanzar un nivel objetivo de cobertura de pruebas

**Ejemplos de objetivos por tipo de prueba:**

| Tipo | Objetivo |
|---|---|
| Pruebas funcionales | Confirmar que el software se comporta según lo esperado: flujos de usuario, procesamiento de datos, comportamiento de entrada/salida |
| Pruebas de rendimiento | Confirmar que el software opera eficientemente bajo carga esperada y pico: tiempo de respuesta, throughput, escalabilidad |
| Pruebas de seguridad | Identificar vulnerabilidades y reducir riesgos: autenticación, autorización, controles de seguridad |
| Pruebas de usabilidad | Evaluar facilidad de uso y experiencia general: accesibilidad, flujos de usuario, puntos de fricción |

> Un buen objetivo de prueba debe ser **suficientemente específico** para guiar la ejecución y **suficientemente medible** para apoyar las decisiones de release.

### Métricas para medir las pruebas

| Métrica | Fórmula / Descripción |
|---|---|
| **Densidad de defectos** | `Cantidad de defectos / Tamaño del release (líneas de código)` |
| **Cobertura de pruebas** | `(Requisitos mapeados a casos de prueba / Total de requisitos) × 100` |
| **Eficiencia de detección de defectos (DDE)** | `% de defectos detectados en una fase / Total de defectos` |
| **Tiempo al mercado (TTM)** | Tiempo desde la idea hasta el lanzamiento del producto |

---

## Paso 4 — Determinar los entregables de prueba

Los entregables de prueba son los resultados generados antes, durante y después de las pruebas. Deben identificarse temprano, alinearse con las necesidades del proyecto y los stakeholders, e incluirse en el cronograma del plan.

### Antes de las pruebas

| Entregable | Descripción |
|---|---|
| Documento de plan de pruebas | Define alcance, objetivos, estrategia, cronograma, recursos y criterios de salida |
| Suite de pruebas (casos de prueba) | Documenta cómo se ejecutarán las pruebas: precondiciones, entradas, resultados esperados y criterios de pass/fail |
| Especificaciones de diseño y entorno | Describe hardware, software, herramientas y configuraciones requeridas |

### Durante las pruebas

| Entregable | Descripción |
|---|---|
| Log de pruebas | Registra resultados de ejecución: pass/fail, problemas encontrados y resoluciones |
| Reporte de defectos | Hace seguimiento de defectos por severidad, prioridad, estado y reproducibilidad |
| Datos de prueba | Datos creados o seleccionados para cumplir precondiciones y apoyar la ejecución |
| Reporte de resumen de pruebas | Vista general del progreso: pruebas ejecutadas, aprobadas, fallidas, bloqueadas y defectos abiertos |

### Después de las pruebas

| Entregable | Descripción |
|---|---|
| Reporte de finalización de pruebas | Resume alcance, resultados, calidad del producto y lecciones aprendidas |
| Reporte de UAT | Documenta problemas identificados durante UAT y su estado de resolución |
| Release notes | Resume qué se incluye en el release: nuevas funcionalidades, fixes y mejoras |

---

## Paso 5 — Diseñar la estrategia de pruebas

La estrategia de pruebas es el enfoque de alto nivel que usará el equipo para planificar, priorizar y ejecutar pruebas. Define:

- Qué se probará y qué no
- Qué métodos de prueba se usarán
- Cómo se gestionarán los riesgos
- Qué criterios deben cumplirse para avanzar o finalizar

### Tipos de prueba

La combinación adecuada depende de factores como: objetivos de prueba, requisitos de funcionalidad, complejidad del producto, experiencia del equipo, requisitos regulatorios, y restricciones de tiempo y presupuesto.

| Tipo de prueba | Propósito común |
|---|---|
| Pruebas manuales | Valida funcionalidad mediante ejecución humana; ideal para exploración, usabilidad o escenarios únicos |
| Pruebas automatizadas | Ejecuta pruebas repetibles a escala; útil para cobertura de regresión y flujos CI/CD |
| Smoke testing | Verifica que la funcionalidad central opere antes de pruebas más profundas |
| Pruebas exploratorias | Descubre problemas inesperados, casos borde y preocupaciones de usabilidad mediante pruebas sin guión |
| Pruebas de usabilidad | Evalúa facilidad de uso, claridad y experiencia general del usuario |
| Pruebas unitarias | Valida componentes o funciones individuales de forma aislada |
| Pruebas de regresión | Confirma que los cambios recientes no rompieron funcionalidad existente |
| Pruebas de integración | Verifica que componentes, servicios o sistemas trabajen correctamente juntos |
| Pruebas de rendimiento | Evalúa velocidad, estabilidad, escalabilidad y comportamiento bajo carga |
| Pruebas de seguridad | Identifica vulnerabilidades y valida controles de seguridad |
| Pruebas de accesibilidad | Garantiza que el producto sea usable por personas con discapacidades |

### Documentar riesgos e issues

Identifique temprano los riesgos que pueden afectar el progreso o la calidad del release:

- Plazos estrictos
- Estimaciones de presupuesto limitadas o inexactas
- Problemas de calidad del código
- Cambios en requisitos o prioridades de negocio
- Recursos de prueba limitados
- Inestabilidad del entorno
- Retrasos inesperados durante las pruebas

### Criterios de prueba

| Tipo | Descripción |
|---|---|
| **Criterios de suspensión** | Condiciones que requieren pausar las pruebas (ej.: falla crítica del entorno, defecto bloqueante) |
| **Criterios de salida (Exit criteria)** | Condiciones predefinidas que deben cumplirse para considerar las pruebas completas |

**Ejemplos de exit criteria:**

- Tasa de aprobación objetivo para casos de prueba críticos (ej.: 92%)
- Sin defectos críticos o de alta severidad abiertos
- Cobertura de regresión requerida completada
- Entregables clave de prueba enviados y revisados

---

## Paso 6 — Planificar el entorno de prueba y los datos de prueba

El entorno de prueba incluye el hardware, software, herramientas y configuraciones de red utilizadas para ejecutar pruebas. Un entorno bien preparado reduce retrasos, mejora la precisión y ayuda a detectar problemas antes.

**Pasos para planificar y configurar el entorno:**

1. **Determinar requisitos de hardware y software:** identificar dispositivos, sistemas operativos, navegadores, bases de datos y herramientas de prueba necesarias.
2. **Instalar software y herramientas requeridas:** builds de la aplicación, herramientas de prueba, servicios de soporte y sistemas de base de datos.
3. **Configurar la red:** reglas de firewall, configuraciones IP, DNS — para que el entorno de prueba refleje producción lo más posible.
4. **Preparar datos de prueba:** datos mock, datos de producción anonimizados, o datos generados con herramientas automatizadas.
5. **Garantizar acceso al build:** que los testers puedan acceder a los builds correctos (repositorio, pipeline CI/CD, control de versiones).
6. **Verificar la configuración del entorno:** confirmar que es estable, accesible y cumple los requisitos antes de comenzar la ejecución.

---

## Elementos clave de un plan de pruebas

| # | Elemento | Descripción |
|---|---|---|
| 1 | ID y título del plan | Identificador único y nombre para referencia y control de versiones |
| 2 | Introducción y objetivo | Resumen breve del esfuerzo de prueba y sus metas de alto nivel |
| 3 | Alcance de las pruebas | Define qué está dentro y fuera del alcance del ciclo de pruebas |
| 4 | Objetivos y enfoque | Describe las metas y el enfoque general (manual, automatizado, basado en riesgos) |
| 5 | Cronograma y hitos | Línea de tiempo de fases clave: planificación, ejecución, triage, cierre |
| 6 | Configuración del entorno | Hardware, software, herramientas y configuraciones requeridas |
| 7 | Recursos y responsabilidades | Quién está involucrado, sus roles y propiedad durante el ciclo |
| 8 | Entregables de prueba | Artefactos a crear o mantener: casos de prueba, logs, reportes, registros de defectos |
| 9 | Criterios de entrada y salida | Condiciones para comenzar las pruebas y condiciones para completarlas |
| 10 | Riesgos y estrategias de mitigación | Posibles bloqueantes, restricciones o puntos de falla y cómo el equipo planea abordarlos |

---

## Plantilla de plan de pruebas — Una página

| Campo | Detalle |
|---|---|
| **Título del plan de pruebas** | [ej.: Release v2.4 — Portal Web] |
| **Preparado por** | [Nombre, Rol] |
| **Fecha** | [DD/MM/AAAA] |

### 1. Introducción
**Propósito / Resumen ejecutivo:** descripción breve del objetivo del plan de pruebas.  
*Ejemplo: "Validar la funcionalidad y el rendimiento del nuevo flujo de checkout antes del release."*

### 2. Alcance de las pruebas
- **En alcance:** [Módulos/funcionalidades a probar]
- **Fuera de alcance:** [Ítems/funcionalidades no cubiertos en este ciclo]

### 3. Objetivos de prueba
Lista de objetivos específicos, ej.: *Validar autenticación de login, Garantizar compatibilidad entre navegadores.*

### 4. Enfoque de pruebas
- **Metodologías:** [ej.: Manual, Automatizado, Basado en riesgos, Testing Ágil]
- **Tipos de prueba:** [ej.: Funcional, Regresión, Usabilidad, Rendimiento]
- **Herramientas utilizadas:** [ej.: TestRail, Cypress, JMeter]

### 5. Cronograma de pruebas

| Fase | Fecha inicio | Fecha fin |
|---|---|---|
| Planificación de pruebas | [DD/MM] | [DD/MM] |
| Diseño de casos de prueba | [DD/MM] | [DD/MM] |
| Ejecución de pruebas | [DD/MM] | [DD/MM] |
| Verificación de bug fixes | [DD/MM] | [DD/MM] |
| Cierre de pruebas | [DD/MM] | [DD/MM] |

### 6. Entorno de prueba
- **Hardware/Software:** [ej.: Windows 11, Chrome 124, iOS 17]
- **URL de staging o versión de app:** [insertar aquí]
- **Fuentes de datos de prueba:** [ej.: datos mock, datos de producción anonimizados]

### 7. Recursos y responsabilidades

| Rol | Nombre | Responsabilidades |
|---|---|---|
| QA Lead | | Plan de pruebas, coordinación |
| QA Engineers | | Ejecución de pruebas, reporte de defectos |
| Soporte Dev | | Triage de bugs, soporte de configuración del entorno |

### 8. Riesgos y mitigación

| Riesgo | Estrategia de mitigación |
|---|---|
| Cronograma de release ajustado | Priorizar casos de prueba críticos |
| Cobertura limitada de dispositivos/navegadores | Usar plataformas de testing en la nube |

### 9. Entregables de prueba
Lista de artefactos clave a crear o revisar durante el esfuerzo de prueba.

### 10. Criterios de entrada y salida
- **Entrada:** Código completo, entorno estable, casos de prueba revisados
- **Salida:** 95% de tasa de aprobación, sin bugs críticos/severos abiertos

---

## Cuándo y cómo actualizar el plan de pruebas

Un buen plan de pruebas no es estático. Debe evolucionar conforme cambia el proyecto.

**Actualice el plan en estos momentos:**

| Momento | Qué actualizar |
|---|---|
| Después de cambios de alcance o requisitos | Ítems en/fuera de alcance, objetivos, prioridades de cobertura |
| Cuando defectos cambian las prioridades | Cambios en cronogramas, entornos o áreas de enfoque |
| Durante retrospectivas de sprint | Cobertura, cronogramas, herramientas y responsabilidades |
| Cuando cambia la capacidad del equipo | Sección de recursos y responsabilidades |
| Al inicio de una nueva fase o release | Lecciones aprendidas, criterios de entrada/salida, riesgos, entregables |

> **Consejo:** Use una herramienta de gestión de pruebas o un sistema de documentación compartida con historial de versiones para que el equipo pueda rastrear cambios y mantener el plan accesible entre releases.

---

## Errores comunes a evitar en la planificación de pruebas

| Error | Impacto |
|---|---|
| Omitir la colaboración con stakeholders | El plan puede perder requisitos clave, dependencias o restricciones del release |
| Ignorar la evaluación de riesgos | El esfuerzo puede mal asignarse y los problemas críticos surgir tarde |
| No alinear cronogramas con el desarrollo | El tiempo de prueba puede comprimirse o acelerarse por retrasos no contemplados |
| Planes demasiado detallados o demasiado vagos | Difíciles de usar o sin suficiente dirección para la ejecución |
| No planificar datos de prueba ni configuración del entorno | Puede retrasar significativamente la ejecución |
| No actualizar el plan cuando el alcance cambia | El equipo trabaja con información desactualizada |

---

## Diferencia: Plan de Pruebas vs. Estrategia de Pruebas

| Dimensión | Plan de Pruebas | Estrategia de Pruebas |
|---|---|---|
| Nivel | Documento específico por proyecto | Documento a nivel organizacional |
| Contenido | Qué probar, cuándo, cómo y quién | Enfoque general de pruebas y estándares |
| Estabilidad | Cambia con cada proyecto o release | Más estable en el tiempo |
| Alcance | Incluye cronograma, recursos y entregables | Define el por qué y el cómo de la metodología |

> **Regla práctica:** La estrategia de pruebas es el **por qué y el cómo** de la metodología de pruebas. El plan de pruebas es el **qué y el cuándo** para un proyecto específico.

---

## Planificación de pruebas en TestRail

Las herramientas de gestión de pruebas hacen que la planificación sea más práctica al mantener los detalles conectados con el trabajo real: casos de prueba, ejecuciones, resultados y reportes.

### Milestones
Un milestone representa un punto significativo del ciclo de pruebas (un release, la finalización de un conjunto de pruebas, o un objetivo de negocio). Una forma práctica es almacenar un resumen ligero del plan de pruebas en el campo de descripción del milestone (alcance, objetivos, cronogramas, riesgos y exit criteria).

### Prioridad y tipo de casos de prueba
Capturar la prioridad del caso de prueba y el tipo de enfoque de prueba anticipadamente permite identificar qué pruebas deben ejecutarse primero, qué áreas necesitan mayor cobertura y dónde enfocar el tiempo si los cronogramas se ajustan.

### Reportes de prueba
TestRail incluye campos integrados como Tipo y Prioridad que ayudan a clasificar, filtrar y priorizar la cobertura. Esto soporta una mejor planificación porque el equipo puede estructurar la ejecución de manera que refleje el producto.

---

*Referencia original: TestRail Blog — "How To Create A Test Plan: Steps, Examples, & Template" por Hannah Son*  
*Guardado para contexto de aprendizaje QA — BUPA Chile*
