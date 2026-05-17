from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph,
    Spacer, HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from datetime import datetime
import os

# ── Rutas ──────────────────────────────────────────────────────────────────
SALIDA = r'C:\Users\Jaime Quiñelen\OneDrive\Escritorio\Gestión QA\Bupa_Mapeo_QA_Lead\Paso 1_Metodologia SDD'
NOMBRE = 'REQ-BUPA-001-SDD-v2.pdf'

# ── Colores BUPA ────────────────────────────────────────────────────────────
C_PRIMARIO   = colors.HexColor('#0D47A1')
C_SECUNDARIO = colors.HexColor('#1565C0')
C_MEDIO      = colors.HexColor('#1976D2')
C_ACENTO     = colors.HexColor('#64B5F6')
C_FONDO      = colors.HexColor('#E3F2FD')
C_FONDO2     = colors.HexColor('#F5F9FF')
C_TEXTO      = colors.HexColor('#212121')
C_GRIS       = colors.HexColor('#757575')
C_BLANCO     = colors.white
C_BADGE_UI   = colors.HexColor('#E8F5E9')
C_BADGE_UX   = colors.HexColor('#E3F2FD')
C_BADGE_FE   = colors.HexColor('#FFF8E1')
C_BADGE_BE   = colors.HexColor('#FCE4EC')

ANCHO, ALTO = A4
MARGEN = 1.8 * cm

# ── Estilos ─────────────────────────────────────────────────────────────────
TITULO_PORT = ParagraphStyle('titulo_port', fontName='Helvetica-Bold', fontSize=26,
    textColor=C_BLANCO, alignment=TA_CENTER, spaceAfter=6, leading=32)
SUB_PORT = ParagraphStyle('sub_port', fontName='Helvetica', fontSize=12,
    textColor=C_ACENTO, alignment=TA_CENTER, spaceAfter=4)
LABEL_PORT = ParagraphStyle('label_port', fontName='Helvetica-Bold', fontSize=10,
    textColor=C_ACENTO, alignment=TA_CENTER)
VALOR_PORT = ParagraphStyle('valor_port', fontName='Helvetica', fontSize=10,
    textColor=C_BLANCO, alignment=TA_CENTER)

SEC_TITULO = ParagraphStyle('sec_titulo', fontName='Helvetica-Bold', fontSize=11,
    textColor=C_BLANCO, spaceAfter=0, spaceBefore=0)
CUERPO = ParagraphStyle('cuerpo', fontName='Helvetica', fontSize=9.5,
    textColor=C_TEXTO, spaceAfter=3, leading=14)
CUERPO_J = ParagraphStyle('cuerpo_j', fontName='Helvetica', fontSize=9.5,
    textColor=C_TEXTO, spaceAfter=3, leading=14, alignment=TA_JUSTIFY)
ITEM = ParagraphStyle('item', fontName='Helvetica', fontSize=9.5,
    textColor=C_TEXTO, spaceAfter=2, leading=13, leftIndent=10)
PIE = ParagraphStyle('pie', fontName='Helvetica-Oblique', fontSize=7.5,
    textColor=C_GRIS, alignment=TA_CENTER)
DADO_KEY = ParagraphStyle('dado_key', fontName='Helvetica-Bold', fontSize=9.5,
    textColor=C_MEDIO)
DADO_VAL = ParagraphStyle('dado_val', fontName='Helvetica', fontSize=9.5,
    textColor=C_TEXTO, leading=13)
TABLA_HDR = ParagraphStyle('tabla_hdr', fontName='Helvetica-Bold', fontSize=9,
    textColor=C_BLANCO, alignment=TA_CENTER)
TABLA_CEL = ParagraphStyle('tabla_cel', fontName='Helvetica', fontSize=8.5,
    textColor=C_TEXTO, leading=12)
TABLA_CEL_C = ParagraphStyle('tabla_cel_c', fontName='Helvetica', fontSize=8.5,
    textColor=C_TEXTO, alignment=TA_CENTER, leading=12)

# ── Header / Footer ─────────────────────────────────────────────────────────
def header_footer(c, doc):
    c.saveState()
    # Barra superior
    c.setFillColor(C_PRIMARIO)
    c.rect(0, ALTO - 1.4*cm, ANCHO, 1.4*cm, fill=1, stroke=0)
    c.setFillColor(C_BLANCO)
    c.setFont('Helvetica-Bold', 10)
    c.drawString(MARGEN, ALTO - 0.9*cm, 'SDD REQ-BUPA-001 | Verificacion de carga del Portal Pacientes BUPA')
    c.setFont('Helvetica', 8)
    c.drawRightString(ANCHO - MARGEN, ALTO - 0.9*cm, f'Pag. {doc.page}')
    # Línea acento
    c.setFillColor(C_ACENTO)
    c.rect(0, ALTO - 1.5*cm, ANCHO, 0.12*cm, fill=1, stroke=0)
    # Footer
    c.setFillColor(C_FONDO)
    c.rect(0, 0, ANCHO, 0.9*cm, fill=1, stroke=0)
    c.setFillColor(C_GRIS)
    c.setFont('Helvetica-Oblique', 7.5)
    c.drawCentredString(ANCHO/2, 0.3*cm,
        f'SDD QA - Portal Pacientes BUPA | REQ-BUPA-001 | Documento Interno')
    c.restoreState()

def header_portada(c, doc):
    c.saveState()
    c.setFillColor(C_PRIMARIO)
    c.rect(0, ALTO - 1.4*cm, ANCHO, 1.4*cm, fill=1, stroke=0)
    c.setFillColor(C_ACENTO)
    c.rect(0, ALTO - 1.5*cm, ANCHO, 0.12*cm, fill=1, stroke=0)
    c.setFillColor(C_FONDO)
    c.rect(0, 0, ANCHO, 0.9*cm, fill=1, stroke=0)
    c.setFillColor(C_GRIS)
    c.setFont('Helvetica-Oblique', 7.5)
    c.drawCentredString(ANCHO/2, 0.3*cm,
        f'SDD - REQ-BUPA-001 | Portal Pacientes BUPA Chile')
    c.restoreState()

# ── Helpers ──────────────────────────────────────────────────────────────────
def seccion_header(elements, numero, titulo):
    t = Table([[Paragraph(f'{numero}. {titulo}', SEC_TITULO)]],
              colWidths=[ANCHO - 2*MARGEN])
    t.setStyle(TableStyle([
        ('BACKGROUND',   (0,0), (-1,-1), C_SECUNDARIO),
        ('LEFTPADDING',  (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING',   (0,0), (-1,-1), 7),
        ('BOTTOMPADDING',(0,0), (-1,-1), 7),
        ('ROUNDEDCORNERS', (0,0), (-1,-1), [3,3,3,3]),
    ]))
    elements.append(Spacer(1, 0.3*cm))
    elements.append(t)
    elements.append(Spacer(1, 0.2*cm))

def tabla_std(elements, headers, filas, anchos):
    data = [[Paragraph(h, TABLA_HDR) for h in headers]]
    for fila in filas:
        data.append([Paragraph(str(c), TABLA_CEL) for c in fila])
    t = Table(data, colWidths=anchos, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND',     (0,0), (-1,0),  C_PRIMARIO),
        ('TEXTCOLOR',      (0,0), (-1,0),  C_BLANCO),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [C_BLANCO, C_FONDO]),
        ('BOX',            (0,0), (-1,-1), 0.8, C_MEDIO),
        ('LINEABOVE',      (0,1), (-1,-1), 0.4, C_ACENTO),
        ('FONTNAME',       (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE',       (0,1), (-1,-1), 8.5),
        ('TOPPADDING',     (0,0), (-1,-1), 5),
        ('BOTTOMPADDING',  (0,0), (-1,-1), 5),
        ('LEFTPADDING',    (0,0), (-1,-1), 6),
        ('VALIGN',         (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.3*cm))

def bloque_dado(elements, dado, cuando, entonces):
    data = [
        [Paragraph('DADO', DADO_KEY),     Paragraph(dado, DADO_VAL)],
        [Paragraph('CUANDO', DADO_KEY),   Paragraph(cuando, DADO_VAL)],
        [Paragraph('ENTONCES', DADO_KEY), Paragraph(entonces, DADO_VAL)],
    ]
    t = Table(data, colWidths=[2.2*cm, ANCHO - 2*MARGEN - 2.2*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND',   (0,0), (-1,-1), C_FONDO2),
        ('BOX',          (0,0), (-1,-1), 0.8, C_ACENTO),
        ('LINEAFTER',    (0,0), (0,-1),  0.5, C_ACENTO),
        ('TOPPADDING',   (0,0), (-1,-1), 5),
        ('BOTTOMPADDING',(0,0), (-1,-1), 5),
        ('LEFTPADDING',  (0,0), (-1,-1), 8),
        ('VALIGN',       (0,0), (-1,-1), 'TOP'),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.25*cm))

def mini_tarjetas(elements, items_2col):
    row = []
    ancho_c = (ANCHO - 2*MARGEN - 0.4*cm) / 2
    for label, valor in items_2col:
        cell = Table([
            [Paragraph(f'<font color="#1565C0"><b>{label}</b></font>', TABLA_CEL)],
            [Paragraph(valor, CUERPO)],
        ], colWidths=[ancho_c])
        cell.setStyle(TableStyle([
            ('BACKGROUND',   (0,0), (-1,-1), C_FONDO),
            ('BOX',          (0,0), (-1,-1), 1, C_ACENTO),
            ('TOPPADDING',   (0,0), (-1,-1), 7),
            ('BOTTOMPADDING',(0,0), (-1,-1), 7),
            ('LEFTPADDING',  (0,0), (-1,-1), 10),
        ]))
        row.append(cell)
    t = Table([row], colWidths=[ancho_c, ancho_c], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('LEFTPADDING',  (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (0,-1),  5),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.3*cm))

def sub_header(elements, texto):
    t = Table([[Paragraph(f'<font color="#1565C0"><b>{texto}</b></font>', CUERPO)]],
              colWidths=[ANCHO - 2*MARGEN])
    t.setStyle(TableStyle([
        ('LEFTPADDING',  (0,0), (-1,-1), 0),
        ('BOTTOMPADDING',(0,0), (-1,-1), 2),
    ]))
    elements.append(t)

# ── BUILD ────────────────────────────────────────────────────────────────────
elements = []
AW = ANCHO - 2*MARGEN  # ancho disponible

# ════════════════════════════════════════════════════════════════════════════
# PORTADA
# ════════════════════════════════════════════════════════════════════════════
elements.append(Spacer(1, 2.5*cm))

# Badge REQ
badge_t = Table([[Paragraph('<b>REQ-BUPA-001</b>', ParagraphStyle('b',
    fontName='Helvetica-Bold', fontSize=11, textColor=C_BLANCO, alignment=TA_CENTER))]],
    colWidths=[5*cm])
badge_t.setStyle(TableStyle([
    ('BACKGROUND',    (0,0), (-1,-1), C_MEDIO),
    ('TOPPADDING',    (0,0), (-1,-1), 7),
    ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ('ALIGN',         (0,0), (-1,-1), 'CENTER'),
]))
elements.append(Table([[badge_t]], colWidths=[AW],
    style=[('ALIGN',(0,0),(-1,-1),'CENTER')]))
elements.append(Spacer(1, 0.4*cm))

elements.append(Paragraph('QUALITY ASSURANCE - SDD', ParagraphStyle('qs',
    fontName='Helvetica-Bold', fontSize=11, textColor=C_ACENTO, alignment=TA_CENTER,
    spaceAfter=10)))

# Título principal (fondo azul)
titulo_bloque = Table([[Paragraph(
    'Verificacion de carga del\nPortal Pacientes BUPA',
    ParagraphStyle('tp', fontName='Helvetica-Bold', fontSize=22,
        textColor=C_BLANCO, alignment=TA_CENTER, leading=30)
)]],colWidths=[AW])
titulo_bloque.setStyle(TableStyle([
    ('BACKGROUND',   (0,0),(-1,-1), C_PRIMARIO),
    ('TOPPADDING',   (0,0),(-1,-1), 20),
    ('BOTTOMPADDING',(0,0),(-1,-1), 20),
]))
elements.append(titulo_bloque)
elements.append(Spacer(1, 0.5*cm))

elements.append(Paragraph(
    'Portal Pacientes BUPA Chile  |  Angular 17  |  Cypress E2E',
    ParagraphStyle('sub2', fontName='Helvetica', fontSize=11,
        textColor=C_GRIS, alignment=TA_CENTER, spaceAfter=6)))
elements.append(HRFlowable(width=8*cm, color=C_ACENTO, thickness=1.5,
    hAlign='CENTER'))
elements.append(Spacer(1, 0.5*cm))

# Autor
autor_bloque = Table([[
    Paragraph('<b>Autor: Jaime Quinelen Villar  |  QA Lead</b>', ParagraphStyle('aut',
        fontName='Helvetica-Bold', fontSize=10, textColor=C_PRIMARIO, alignment=TA_CENTER)),
], [
    Paragraph('jaimeqv.2609@gmail.com  |  Santiago, Chile  |  2026', ParagraphStyle('aut2',
        fontName='Helvetica', fontSize=9, textColor=C_GRIS, alignment=TA_CENTER)),
]], colWidths=[AW])
autor_bloque.setStyle(TableStyle([
    ('BACKGROUND',   (0,0),(-1,-1), C_FONDO),
    ('BOX',          (0,0),(-1,-1), 1, C_ACENTO),
    ('TOPPADDING',   (0,0),(-1,-1), 10),
    ('BOTTOMPADDING',(0,0),(-1,-1), 10),
]))
elements.append(autor_bloque)
elements.append(Spacer(1, 1.5*cm))

# Descripción
elements.append(Paragraph('Descripcion del Requerimiento',
    ParagraphStyle('drq', fontName='Helvetica-Bold', fontSize=11,
        textColor=C_MEDIO, spaceAfter=6)))
elements.append(Paragraph(
    'Este documento SDD especifica los criterios de verificacion para confirmar que el Portal '
    'Pacientes BUPA carga correctamente, responde en menos de 3 segundos y utiliza protocolo '
    'HTTPS con certificado SSL valido. Corresponde al spec bupa-smoke.cy.js.',
    CUERPO_J))
elements.append(Spacer(1, 0.8*cm))

# Tarjetas info
mini_tarjetas(elements, [
    ('Spec file', 'bupa-smoke.cy.js'),
    ('URL', 'portalpaciente.bupa.cl/inicio'),
])
mini_tarjetas(elements, [
    ('Stack', 'Angular 17 + Cypress 15'),
    ('Herramienta', 'cypress-axe + axe-core'),
])

elements.append(Spacer(1, 0.3*cm))
elements.append(Paragraph(f'Pagina 1 de 5', PIE))
elements.append(PageBreak())

# ════════════════════════════════════════════════════════════════════════════
# PAG 2 — Secciones 1-5
# ════════════════════════════════════════════════════════════════════════════
seccion_header(elements, '1', 'Titulo')
elements.append(Paragraph('Verificacion de carga del Portal Pacientes BUPA', CUERPO))

seccion_header(elements, '2', 'Problema que se quiere resolver')
elements.append(Paragraph(
    'Los pacientes de BUPA dependen del portal para acceder a citas y resultados medicos. '
    'Si el portal no carga o tarda demasiado, el paciente queda sin acceso a servicios '
    'criticos de salud sin que el equipo tecnico lo sepa. No existe validacion automatizada '
    'que confirme que el portal esta respondiendo correctamente antes de cada deploy.',
    CUERPO_J))

seccion_header(elements, '3', 'Contexto de uso')
ctx = [
    ('Usuario', 'cualquier paciente o visitante - no requiere autenticacion'),
    ('Canal', 'navegador web (Chrome, Firefox, Safari, Edge)'),
    ('Dispositivo', 'desktop y movil'),
    ('Precondiciones', 'ninguna - es el primer punto de contacto con el portal'),
    ('URL', 'https://portalpaciente.bupa.cl/inicio'),
    ('Stack', 'Angular 17 - el body se renderiza una vez que Angular completa el bootstrap'),
]
for k, v in ctx:
    elements.append(Paragraph(
        f'<font color="#1565C0"><b>&gt; {k}:</b></font> {v}', ITEM))
elements.append(Spacer(1, 0.1*cm))

seccion_header(elements, '4', 'Objetivo')
elements.append(Paragraph(
    'Verificar que el Portal Pacientes BUPA carga correctamente, responde en menos de 3 '
    'segundos y utiliza protocolo HTTPS con certificado SSL valido.', CUERPO_J))

seccion_header(elements, '5', 'Alcance')
sub_header(elements, 'Incluye:')
for item in [
    'Verificacion de que el servidor responde y la pagina es visible',
    'Validacion de que la URL pertenece al dominio correcto (portalpaciente.bupa.cl)',
    'Medicion del tiempo de carga (umbral: 3000ms)',
    'Validacion de protocolo HTTPS y certificado SSL',
]:
    elements.append(Paragraph(f'<font color="#1565C0"><b>&gt;</b></font>  {item}', ITEM))
elements.append(Spacer(1, 0.15*cm))
sub_header(elements, 'No incluye:')
for item in [
    'Visibilidad del formulario de login (REQ-BUPA-002)',
    'Proceso de autenticacion (bupa-login.cy.js)',
    'Metricas avanzadas LCP, FID, CLS (bupa-performance.cy.js)',
    'Tests en ambientes staging o pre-produccion',
]:
    elements.append(Paragraph(f'<font color="#1565C0"><b>&gt;</b></font>  {item}', ITEM))

elements.append(Spacer(1, 0.3*cm))
elements.append(Paragraph('Pagina 2 de 5', PIE))
elements.append(PageBreak())

# ════════════════════════════════════════════════════════════════════════════
# PAG 3 — Sección 6 Comportamiento esperado
# ════════════════════════════════════════════════════════════════════════════
seccion_header(elements, '6', 'Comportamiento esperado')

sub_header(elements, 'Flujo principal:')
tabla_std(elements,
    ['#', 'Paso', 'Categoria'],
    [
        ['1', 'Navegar a https://portalpaciente.bupa.cl/inicio desde el navegador', 'Frontend'],
        ['2', 'El servidor responde y Angular renderiza la pagina', 'Frontend + Backend'],
        ['3', 'El cuerpo de la pagina se renderiza y es visible', 'UI'],
        ['4', 'La URL activa contiene portalpaciente.bupa.cl', 'Frontend'],
        ['5', 'El protocolo de la URL es https:', 'Backend (seguridad)'],
        ['6', 'El tiempo total de carga es menor a 3000ms', 'UX'],
    ],
    [0.6*cm, AW - 0.6*cm - 3.2*cm, 3.2*cm]
)

sub_header(elements, 'Flujos alternativos / Edge Cases:')
tabla_std(elements,
    ['Escenario', 'Comportamiento esperado', 'Categoria'],
    [
        ['Servidor caido',
         'Cypress lanza error de conexion - test falla con timeout',
         'Backend'],
        ['Carga lenta (> 3s)',
         'AssertionError de tiempo - test falla con ms reales registrados',
         'UX'],
        ['Dominio incorrecto',
         'URL no contiene portalpaciente.bupa.cl - test falla',
         'Frontend'],
        ['HTTP sin HTTPS',
         'Protocolo retorna http: - test falla por seguridad',
         'Backend (seguridad)'],
        ['Menu de navegacion no visible',
         'Elemento de menu no renderizado - test falla',
         'UI'],
        ['Scroll horizontal en mobile (375px)',
         'Overflow horizontal detectado - test falla',
         'UX + Frontend'],
        ['Violaciones criticas WCAG (axe)',
         'cypress-axe reporta violaciones criticas - test falla',
         'UX (accesibilidad)'],
        ['LCP >= 2.5s o CLS >= 0.1 (Lighthouse)',
         'Core Web Vitals fuera de umbral - test falla',
         'UX (Core Web Vitals)'],
        ['Health check /api/health no responde 200',
         'Endpoint retorna error o timeout - test falla',
         'Backend'],
    ],
    [4*cm, AW - 4*cm - 3.4*cm, 3.4*cm]
)

elements.append(Spacer(1, 0.3*cm))
elements.append(Paragraph('Pagina 3 de 5', PIE))
elements.append(PageBreak())

# ════════════════════════════════════════════════════════════════════════════
# PAG 4 — Sección 7 Criterios de aceptación
# ════════════════════════════════════════════════════════════════════════════
seccion_header(elements, '7', 'Criterios de aceptacion')
elements.append(Paragraph(
    'Cada criterio mapea directamente a un bloque it() en bupa-smoke.cy.js', CUERPO))
elements.append(Spacer(1, 0.2*cm))

# Tabla resumen
tabla_std(elements,
    ['Criterio', 'Enunciado', 'Categoria'],
    [
        ['A', 'Body visible + URL contiene portalpaciente.bupa.cl', 'UI + Frontend'],
        ['B', 'Tiempo de carga < 3000ms desde navegacion hasta body visible', 'UX'],
        ['C', 'Protocolo es https: con certificado SSL valido', 'Backend (seguridad)'],
    ],
    [1.5*cm, AW - 1.5*cm - 3.5*cm, 3.5*cm]
)
elements.append(Spacer(1, 0.1*cm))

# Bloques DADO/CUANDO/ENTONCES
elements.append(Paragraph('<b>Criterio A</b>', CUERPO))
bloque_dado(elements,
    'el paciente navega a https://portalpaciente.bupa.cl/inicio',
    'la pagina termina de cargar',
    'el body es visible y la URL contiene portalpaciente.bupa.cl')

elements.append(Paragraph('<b>Criterio B</b>', CUERPO))
bloque_dado(elements,
    'el paciente navega a https://portalpaciente.bupa.cl/inicio',
    'se mide el tiempo desde inicio de navegacion hasta que el body es visible',
    'el tiempo transcurrido es menor a 3000 milisegundos')

elements.append(Paragraph('<b>Criterio C</b>', CUERPO))
bloque_dado(elements,
    'el paciente navega a https://portalpaciente.bupa.cl/inicio',
    'se evalua el protocolo de la URL activa',
    'el protocolo es https: confirmando certificado SSL valido')

elements.append(Spacer(1, 0.3*cm))
elements.append(Paragraph('Pagina 4 de 5', PIE))
elements.append(PageBreak())

# ════════════════════════════════════════════════════════════════════════════
# PAG 5 — Secciones 8, 9 y conexión Cypress
# ════════════════════════════════════════════════════════════════════════════
seccion_header(elements, '8', 'Restricciones')

sub_header(elements, 'Tecnicas:')
for item in [
    'El tiempo se mide con Date.now() en Cypress - incluye latencia de red del runner CI',
    'En runners CI (ubuntu) puede ser necesario aumentar el umbral a 4000ms por latencia de red',
    'Angular 17 requiere que el bootstrap complete antes de que body sea interactivo',
]:
    elements.append(Paragraph(f'- {item}', ITEM))
elements.append(Spacer(1, 0.15*cm))

sub_header(elements, 'De negocio:')
for item in [
    'Tiempo de carga de 3 segundos es el estandar minimo para UX en salud (Google UX Research)',
    'SLA del portal BUPA: 99.9% de disponibilidad mensual',
    'Este test debe correr como primer gate del pipeline - si falla, los demas no corren',
]:
    elements.append(Paragraph(f'- {item}', ITEM))
elements.append(Spacer(1, 0.15*cm))

sub_header(elements, 'De seguridad:')
for item in [
    'HTTPS obligatorio - datos de pacientes protegidos bajo Ley 19.628 de Chile',
    'HTTP sin cifrado no es aceptable para este portal bajo ningun escenario',
    'El certificado SSL debe ser valido y no expirado',
]:
    elements.append(Paragraph(f'- {item}', ITEM))

seccion_header(elements, '9', 'Notas - Decisiones abiertas y dudas')

sub_header(elements, 'Decisiones abiertas:')
for item in [
    '[Por confirmar] El umbral de 3s aplica igual en CI que en produccion real?',
    '[Por confirmar] Se valida el titulo exacto de la pagina o solo que no este vacio?',
]:
    elements.append(Paragraph(
        f'<font color="#1565C0"><b>&gt;</b></font>  {item}', ITEM))
elements.append(Spacer(1, 0.15*cm))

sub_header(elements, 'Dudas:')
for item in [
    'Existe un ambiente staging donde correr este smoke test antes del deploy a produccion?',
    'El equipo de DevOps tiene un health check endpoint (/api/health) que podria complementar este test?',
    'Se debe agregar monitoreo de uptime externo (Pingdom, UptimeRobot) para alertas fuera del pipeline?',
]:
    elements.append(Paragraph(
        f'<font color="#1565C0"><b>&gt;</b></font>  {item}', ITEM))

elements.append(Spacer(1, 0.3*cm))

# Conexión con Cypress
cx_bloque = Table([
    [Paragraph('<b>Conexion con Cypress - bupa-smoke.cy.js</b>', ParagraphStyle('cx',
        fontName='Helvetica-Bold', fontSize=9.5, textColor=C_MEDIO))],
    [Paragraph('Criterio 1 -> it("REQ-001: portal carga correctamente") - cy.get("body").should("be.visible")', CUERPO)],
    [Paragraph('Criterio 2 -> it("REQ-001: portal carga en menos de 3 segundos") - Date.now() < 3000ms', CUERPO)],
    [Paragraph('Criterio 3 -> it("REQ-001: pagina tiene certificado HTTPS valido") - cy.location("protocol").should("eq","https:")', CUERPO)],
], colWidths=[AW])
cx_bloque.setStyle(TableStyle([
    ('BACKGROUND',   (0,0), (-1,-1), C_FONDO),
    ('BOX',          (0,0), (-1,-1), 1, C_ACENTO),
    ('LEFTPADDING',  (0,0), (-1,-1), 12),
    ('TOPPADDING',   (0,0), (-1,-1), 6),
    ('BOTTOMPADDING',(0,0), (-1,-1), 6),
]))
elements.append(cx_bloque)

elements.append(Spacer(1, 0.3*cm))
elements.append(Paragraph('Pagina 5 de 5', PIE))

# ── Generar PDF ───────────────────────────────────────────────────────────
os.makedirs(SALIDA, exist_ok=True)
ruta = os.path.join(SALIDA, NOMBRE)
doc = SimpleDocTemplate(ruta, pagesize=A4,
    leftMargin=MARGEN, rightMargin=MARGEN,
    topMargin=1.8*cm, bottomMargin=1.2*cm)
doc.build(elements,
    onFirstPage=header_portada,
    onLaterPages=header_footer)
print(f'PDF generado: {ruta}')
