from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import os

# ── Colores LATAM ──────────────────────────────────────────────
AZUL    = colors.HexColor('#1B1464')
ROJO    = colors.HexColor('#E31837')
BLANCO  = colors.white
GRIS    = colors.HexColor('#5A5A5A')
GRIS_L  = colors.HexColor('#E8E8E8')
AZUL_S  = colors.HexColor('#2D2B8A')   # sidebar highlight suave

ANCHO, ALTO = A4                        # 595.27 x 841.89 pt
SIDEBAR_W   = 5.8 * cm
MAIN_X      = SIDEBAR_W + 0.5 * cm
MAIN_W      = ANCHO - MAIN_X - 1.2 * cm

SALIDA = r'c:\Quality_Assurance_IA\QA-Engineer\CV_Javiera_Gajardo_LATAM_v2.pdf'

# ── Estilos de párrafo ─────────────────────────────────────────
def estilo(nombre, fuente, tam, color, alin=TA_LEFT, lh=None, esp=0):
    return ParagraphStyle(
        nombre, fontName=fuente, fontSize=tam,
        textColor=color, alignment=alin,
        leading=lh or tam * 1.35, spaceAfter=esp
    )

S_NOMBRE     = estilo('s_nom',  'Helvetica-Bold', 20, BLANCO, TA_CENTER, 24)
S_SUBTIT_SB  = estilo('s_sub',  'Helvetica',       7, ROJO,   TA_CENTER,  9)
S_SEC_SB     = estilo('s_sec',  'Helvetica-Bold',  7, ROJO,   TA_LEFT,    9)
S_SB_TEXTO   = estilo('s_txt',  'Helvetica',       7, BLANCO, TA_LEFT,   10)
S_TITULO_MN  = estilo('t_mn',   'Helvetica-Bold', 22, AZUL,   TA_LEFT,   26)
S_SUB_MN     = estilo('s_mn',   'Helvetica',       8, ROJO,   TA_LEFT,   10)
S_SEC_MN     = estilo('sec_mn', 'Helvetica-Bold',  9, AZUL,   TA_LEFT,   11)
S_CUERPO     = estilo('cpo',    'Helvetica',       8, GRIS,   TA_LEFT,   11)
S_CUERPO_B   = estilo('cpob',   'Helvetica-Bold',  8, AZUL,   TA_LEFT,   11)
S_EMPRESA    = estilo('emp',    'Helvetica-Bold',  8.5, AZUL, TA_LEFT,   11)
S_PERIODO    = estilo('per',    'Helvetica',       7,  GRIS,  TA_LEFT,    9)
S_EDU        = estilo('edu',    'Helvetica-Bold',  8, AZUL,   TA_LEFT,   10)
S_EDU_SUB    = estilo('edus',   'Helvetica',       7, GRIS,   TA_LEFT,    9)
S_AÑO_EDU   = estilo('añoe',   'Helvetica-Bold',  7, ROJO,   TA_LEFT,    9)


def draw_cv(c):
    # ── SIDEBAR ────────────────────────────────────────────────
    c.setFillColor(AZUL)
    c.rect(0, 0, SIDEBAR_W, ALTO, fill=1, stroke=0)

    # franja decorativa roja en sidebar
    c.setFillColor(ROJO)
    c.rect(0, ALTO - 3.2*cm, SIDEBAR_W, 0.25*cm, fill=1, stroke=0)

    # placeholder foto: círculo con iniciales
    cx, cy = SIDEBAR_W / 2, ALTO - 2.4 * cm
    r = 1.05 * cm
    c.setFillColor(AZUL_S)
    c.circle(cx, cy, r + 0.08*cm, fill=1, stroke=0)
    c.setFillColor(ROJO)
    c.circle(cx, cy, r, fill=1, stroke=0)
    c.setFillColor(BLANCO)
    c.setFont('Helvetica-Bold', 16)
    c.drawCentredString(cx, cy - 0.25*cm, 'JG')

    # nombre en sidebar
    y = ALTO - 4.3 * cm
    _p(c, 'Javiera Isidora<br/>Gajardo Ortiz', S_NOMBRE,
       0.25*cm, y, SIDEBAR_W - 0.5*cm, 1.5*cm)

    y -= 1.65 * cm
    _p(c, 'SERVICIO AL CLIENTE',
       S_SUBTIT_SB, 0.3*cm, y, SIDEBAR_W - 0.6*cm, 0.8*cm)

    # ── secciones sidebar ──────────────────────────────────────
    y -= 1.0 * cm
    y = _seccion_sidebar(c, 'CONTACTO', y)
    items_contacto = [
        ('loc', 'Papudo #885, Lampa, Santiago'),
        ('tel', '+56 9 34228272'),
        ('mail','Javi.gajardo26@gmail.com'),
    ]
    for icono, txt in items_contacto:
        c.setFillColor(ROJO)
        c.circle(0.55*cm, y - 0.05*cm, 0.1*cm, fill=1, stroke=0)
        _p(c, txt, S_SB_TEXTO, 0.78*cm, y - 0.2*cm,
           SIDEBAR_W - 0.95*cm, 0.7*cm)
        y -= 0.55 * cm

    y -= 0.4 * cm
    y = _seccion_sidebar(c, 'DATOS PERSONALES', y)
    datos = [
        '26 de mayo de 1998 · 28 años',
        'RUT 19.903.813-3',
        'Nacionalidad Chilena',
        'Estado Civil: Soltera',
    ]
    for d in datos:
        c.setFillColor(ROJO)
        c.circle(0.55*cm, y - 0.05*cm, 0.1*cm, fill=1, stroke=0)
        _p(c, d, S_SB_TEXTO, 0.78*cm, y - 0.2*cm,
           SIDEBAR_W - 0.95*cm, 0.5*cm)
        y -= 0.5 * cm

    y -= 0.4 * cm
    y = _seccion_sidebar(c, 'HABILIDADES DIGITALES', y)
    skills_dig = [('Microsoft Word', 0.75), ('Microsoft Excel', 0.60)]
    for skill, pct in skills_dig:
        _p(c, skill, S_SB_TEXTO, 0.35*cm, y - 0.15*cm,
           SIDEBAR_W - 0.55*cm, 0.4*cm)
        y -= 0.42 * cm
        bx, bw, bh = 0.35*cm, SIDEBAR_W - 0.7*cm, 0.18*cm
        c.setFillColor(AZUL_S)
        c.roundRect(bx, y, bw, bh, 2, fill=1, stroke=0)
        c.setFillColor(ROJO)
        c.roundRect(bx, y, bw * pct, bh, 2, fill=1, stroke=0)
        y -= 0.4 * cm

    y -= 0.45 * cm
    y = _seccion_sidebar(c, 'COMPETENCIAS', y)
    competencias = [
        'Atención al pasajero', 'Trabajo en equipo',
        'Proactividad', 'Adaptabilidad',
        'Organización', 'Comunicación efectiva',
        'Puntualidad', 'Alta demanda',
        'Resolución de problemas',
    ]
    tag_y = y - 0.1*cm
    tag_x = 0.3*cm
    for comp in competencias:
        tw = len(comp) * 4.0 + 8
        tag_w = tw / 28.35   # puntos a cm aproximado
        if tag_x + tag_w * 28.35 > (SIDEBAR_W - 0.3*cm):
            tag_x = 0.3*cm
            tag_y -= 0.55*cm
        c.setFillColor(ROJO)
        c.roundRect(tag_x, tag_y - 0.3*cm,
                    tag_w * 28.35, 0.38*cm, 3, fill=1, stroke=0)
        c.setFillColor(BLANCO)
        c.setFont('Helvetica-Bold', 6)
        c.drawString(tag_x + 3, tag_y - 0.14*cm, comp)
        tag_x += tag_w * 28.35 + 4

    # ── CONTENIDO PRINCIPAL ────────────────────────────────────
    my = ALTO - 1.5 * cm

    # nombre grande
    _p(c, 'Javiera Isidora', S_TITULO_MN, MAIN_X, my, MAIN_W, 1.8*cm)
    my -= 1.55 * cm
    _p(c, 'Gajardo Ortiz', S_TITULO_MN, MAIN_X, my, MAIN_W, 1.3*cm)
    my -= 1.0 * cm
    _p(c, 'SERVICIO AL CLIENTE',
       S_SUB_MN, MAIN_X, my, MAIN_W, 0.5*cm)
    my -= 0.35 * cm

    # línea decorativa roja
    c.setStrokeColor(ROJO)
    c.setLineWidth(2)
    c.line(MAIN_X, my, MAIN_X + 2.5*cm, my)
    c.setLineWidth(0.5)
    c.setStrokeColor(GRIS_L)
    c.line(MAIN_X + 2.6*cm, my, MAIN_X + MAIN_W, my)
    my -= 0.55 * cm

    # OBJETIVO
    my = _seccion_principal(c, 'OBJETIVO PROFESIONAL', my)
    objetivo = (
        'Incorporarme a un equipo de alto rendimiento como el de LATAM Airlines, '
        'aportando mis habilidades en atención directa al cliente, comunicación '
        'asertiva y resolución eficiente de requerimientos. Me motiva brindar una '
        'experiencia de excelencia en cada punto de contacto con el pasajero, con '
        'actitud de servicio, proactividad y compromiso con los estándares de calidad.'
    )
    # caja con fondo suave
    box_h = 1.55 * cm
    c.setFillColor(colors.HexColor('#F2F4FC'))
    c.setStrokeColor(colors.HexColor('#CCCCEE'))
    c.roundRect(MAIN_X, my - box_h, MAIN_W, box_h, 4, fill=1, stroke=1)
    _p(c, objetivo, S_CUERPO, MAIN_X + 0.25*cm,
       my - 0.2*cm, MAIN_W - 0.5*cm, box_h - 0.1*cm)
    my -= box_h + 0.45 * cm

    # SITUACIÓN LABORAL ACTUAL
    my = _seccion_principal(c, 'SITUACIÓN LABORAL ACTUAL', my)
    situacion = (
        'Actualmente me desempeño como <b>Garzona</b> en <b>Bar Restaurant Mystic Valley</b>, '
        'brindando atención directa y personalizada a clientes en eventos sociales y ambiente '
        'de alto flujo. Gestión de requerimientos en tiempo real, servicio de alimentos y bebidas, '
        'y resolución ágil de situaciones bajo presión.'
    )
    box_h = 1.3 * cm
    c.setFillColor(colors.HexColor('#F2F4FC'))
    c.setStrokeColor(colors.HexColor('#CCCCEE'))
    c.roundRect(MAIN_X, my - box_h, MAIN_W, box_h, 4, fill=1, stroke=1)
    _p(c, situacion, S_CUERPO, MAIN_X + 0.25*cm,
       my - 0.2*cm, MAIN_W - 0.5*cm, box_h - 0.1*cm)
    my -= box_h + 0.45 * cm

    # EXPERIENCIA LABORAL
    my = _seccion_principal(c, 'EXPERIENCIA LABORAL', my)
    experiencias = [
        {
            'año':     '2022 – 2026',
            'cargo':   'Garzona — Bar Restaurant Mystic Valley / Eventos Particulares y Pub',
            'desc':    (
                'Atención de mesas en eventos sociales y pub de alta demanda. Servicio de alimentos '
                'y bebidas, manejo de bandeja, trato directo con clientes, gestión de múltiples '
                'requerimientos simultáneos con orientación al detalle y actitud de servicio.'
            ),
        },
        {
            'año':     '2018',
            'cargo':   'Ejecutiva de Servicio al Cliente — Celmedia',
            'desc':    (
                'Atención multicanal de clientes, identificación de necesidades, resolución de '
                'consultas y oferta de soluciones personalizadas con foco en satisfacción y fidelización.'
            ),
        },
        {
            'año':     '2016',
            'cargo':   'Garzona — Eventos Sociales y Empresariales',
            'desc':    (
                'Atención de mesas y servicio al cliente en eventos de diversa índole. '
                'Capacidad de adaptación a diferentes públicos y ambientes exigentes.'
            ),
        },
        {
            'año':     '2016',
            'cargo':   'Manicurista — Salón de Belleza Quickly',
            'desc':    'Atención personalizada a clientas con estándares de higiene y calidad.',
        },
        {
            'año':     '2016',
            'cargo':   'Manicurista — Salón de Belleza IO',
            'desc':    'Atención directa y cuidado personalizado a clientas con foco en calidad del servicio.',
        },
    ]

    for exp in experiencias:
        # badge año
        badge_w, badge_h = 1.5*cm, 0.42*cm
        c.setFillColor(AZUL)
        c.roundRect(MAIN_X, my - badge_h, badge_w, badge_h, 3, fill=1, stroke=0)
        c.setFillColor(BLANCO)
        c.setFont('Helvetica-Bold', 7)
        c.drawCentredString(MAIN_X + badge_w / 2, my - 0.30*cm, exp['año'])

        # línea vertical timeline
        c.setStrokeColor(ROJO)
        c.setLineWidth(1.2)
        c.line(MAIN_X + badge_w + 0.2*cm, my - badge_h,
               MAIN_X + badge_w + 0.2*cm, my - badge_h - 1.0*cm)
        c.setLineWidth(0.5)
        c.setStrokeColor(GRIS_L)

        tx = MAIN_X + badge_w + 0.45*cm
        tw = MAIN_W - badge_w - 0.45*cm

        _p(c, exp['cargo'], S_EMPRESA, tx, my - 0.05*cm, tw, 0.5*cm)
        my -= 0.48 * cm
        _p(c, exp['desc'], S_CUERPO, tx, my, tw, 1.0*cm)
        my -= _text_height(exp['desc'], S_CUERPO, tw) + 0.35*cm

    # FORMACIÓN ACADÉMICA
    my -= 0.1 * cm
    my = _seccion_principal(c, 'FORMACIÓN ACADÉMICA', my)
    educacion = [
        ('2012 – 2015', 'Liceo Luis Correa Prieto',
         'Enseñanza Media · Liceo Técnico, Mención Administración Logística'),
        ('2010 – 2011', 'Colegio Mary and George School', 'Enseñanza Básica'),
        ('2004 – 2009', 'Colegio República del Paraguay', 'Enseñanza Básica'),
    ]
    for periodo, inst, detalle in educacion:
        _p(c, periodo, S_AÑO_EDU, MAIN_X, my, MAIN_W, 0.35*cm)
        my -= 0.32 * cm
        _p(c, inst, S_EDU, MAIN_X, my, MAIN_W, 0.4*cm)
        my -= 0.38 * cm
        _p(c, detalle, S_EDU_SUB, MAIN_X, my, MAIN_W, 0.35*cm)
        my -= 0.55 * cm


# ── helpers ────────────────────────────────────────────────────
def _p(c, text, style, x, y, w, h):
    from reportlab.platypus import Frame, Paragraph as P
    story = [P(text, style)]
    f = Frame(x, y - h, w, h, leftPadding=0, rightPadding=0,
              topPadding=0, bottomPadding=0, showBoundary=0)
    f.addFromList(story, c)


def _text_height(text, style, width):
    from reportlab.platypus import Paragraph as P
    p = P(text, style)
    w, h = p.wrap(width, 9999)
    return h / 28.35 * 28.35 / 28.35 * cm   # ya en puntos / cm


def _seccion_sidebar(c, titulo, y):
    c.setStrokeColor(ROJO)
    c.setLineWidth(1)
    c.line(0.3*cm, y, SIDEBAR_W - 0.3*cm, y)
    y -= 0.28 * cm
    _p(c, titulo, S_SEC_SB, 0.3*cm, y, SIDEBAR_W - 0.6*cm, 0.4*cm)
    y -= 0.42 * cm
    return y


def _seccion_principal(c, titulo, y):
    _p(c, titulo, S_SEC_MN, MAIN_X, y, MAIN_W, 0.45*cm)
    y -= 0.32 * cm
    c.setStrokeColor(ROJO)
    c.setLineWidth(1.5)
    c.line(MAIN_X, y, MAIN_X + 1.8*cm, y)
    c.setStrokeColor(GRIS_L)
    c.setLineWidth(0.5)
    c.line(MAIN_X + 1.9*cm, y, MAIN_X + MAIN_W, y)
    y -= 0.4 * cm
    return y


# ── main ───────────────────────────────────────────────────────
def main():
    os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
    cv = canvas.Canvas(SALIDA, pagesize=A4)
    cv.setTitle('CV Javiera Gajardo — LATAM Airlines')
    draw_cv(cv)
    cv.save()
    print(f'PDF generado: {SALIDA}')


if __name__ == '__main__':
    main()
