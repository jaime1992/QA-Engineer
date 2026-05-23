#!/usr/bin/env python3
"""
CV Premium - Jaime Quiñelen Villar
QA Lead / Computer Engineer
"""

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageDraw
import io, os

# ─── RUTAS ────────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FOTO_PATH  = os.path.join(SCRIPT_DIR, 'foto_mia.png')
SALIDA     = os.path.join(SCRIPT_DIR, 'CV_Jaime_Quinelen_v2.pdf')

# ─── COLORES ──────────────────────────────────────────────────────────────────
SIDEBAR_COLOR  = colors.HexColor('#1E2D3D')
SIDEBAR_DARK   = colors.HexColor('#141E28')
ACCENT         = colors.HexColor('#3A9BD5')
ACCENT_GOLD    = colors.HexColor('#E8A838')
WHITE          = colors.white
LIGHT_GRAY     = colors.HexColor('#F9FAFB')
MED_GRAY       = colors.HexColor('#6B7C93')
DARK_TEXT      = colors.HexColor('#1E2D3D')
LINE_COLOR     = colors.HexColor('#D1DCE8')
SIDEBAR_MUTED  = colors.HexColor('#8DA5B8')
SIDEBAR_LINE   = colors.HexColor('#2A3D52')

# ─── DIMENSIONES ──────────────────────────────────────────────────────────────
W, H      = A4            # 595.27 x 841.89
SIDE_W    = 185.0
COL_X     = SIDE_W + 16   # inicio columna derecha
COL_W     = W - SIDE_W - 24  # ancho útil derecha
PAD       = 14            # padding sidebar horizontal


# ══════════════════════════════════════════════════════════════════════════════
# UTILIDADES
# ══════════════════════════════════════════════════════════════════════════════

def circular_photo(path, px=300):
    img  = Image.open(path).convert('RGBA')
    w, h = img.size
    lado = min(w, h)
    img  = img.crop(((w-lado)//2, (h-lado)//2, (w+lado)//2, (h+lado)//2))
    img  = img.resize((px, px), Image.LANCZOS)
    mask = Image.new('L', (px, px), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, px, px), fill=255)
    img.putalpha(mask)
    buf = io.BytesIO()
    img.save(buf, 'PNG')
    buf.seek(0)
    return ImageReader(buf)


def text_lines(c, text, max_w, font='Helvetica', size=8):
    """Divide texto en líneas que caben en max_w."""
    words, line, lines = text.split(), '', []
    for w in words:
        test = (line + ' ' + w).strip()
        if c.stringWidth(test, font, size) <= max_w:
            line = test
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def draw_text_block(c, text, x, y, max_w, font='Helvetica', size=8,
                    color=None, leading=12):
    """Dibuja bloque de texto wrapeado. Retorna y final."""
    if color:
        c.setFillColor(color)
    c.setFont(font, size)
    lines = text_lines(c, text, max_w, font, size)
    for i, ln in enumerate(lines):
        c.drawString(x, y - i * leading, ln)
    return y - len(lines) * leading


def block_height(c, text, max_w, font='Helvetica', size=8, leading=12):
    """Calcula la altura que ocupará un bloque de texto."""
    return len(text_lines(c, text, max_w, font, size)) * leading


def sidebar_title(c, y, title):
    """Encabezado de sección en sidebar."""
    c.setFillColor(ACCENT)
    c.rect(PAD, y - 1, 20, 2.5, fill=1, stroke=0)
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(WHITE)
    c.drawString(PAD, y + 4, title.upper())
    c.setStrokeColor(SIDEBAR_LINE)
    c.setLineWidth(0.4)
    c.line(PAD, y - 5, SIDE_W - PAD, y - 5)
    return y - 14


def right_title(c, y, title):
    """Encabezado de sección en columna derecha."""
    c.setFillColor(ACCENT)
    c.rect(COL_X - 2, y, 3, 13, fill=1, stroke=0)
    c.setFont('Helvetica-Bold', 9)
    c.setFillColor(DARK_TEXT)
    c.drawString(COL_X + 6, y + 2, title.upper())
    end_x = COL_X + 6 + c.stringWidth(title.upper(), 'Helvetica-Bold', 9) + 8
    c.setStrokeColor(LINE_COLOR)
    c.setLineWidth(0.5)
    c.line(end_x, y + 7, COL_X + COL_W, y + 7)
    return y - 12


def skill_bar(c, x, y, label, pct, bw=130):
    c.setFont('Helvetica', 7.2)
    c.setFillColor(WHITE)
    c.drawString(x, y + 2, label)
    c.setFillColor(colors.HexColor('#2E4560'))
    c.roundRect(x, y - 6, bw, 4, 2, fill=1, stroke=0)
    c.setFillColor(ACCENT)
    c.roundRect(x, y - 6, bw * pct / 100, 4, 2, fill=1, stroke=0)


def chip(c, x, y, text, bg, fg, fs=7):
    tw = c.stringWidth(text, 'Helvetica-Bold', fs) + 10
    c.setFillColor(bg)
    c.roundRect(x, y, tw, 13, 3, fill=1, stroke=0)
    c.setFillColor(fg)
    c.setFont('Helvetica-Bold', fs)
    c.drawString(x + 5, y + 3.5, text)
    return x + tw + 5


# ══════════════════════════════════════════════════════════════════════════════
# GENERADOR PRINCIPAL
# ══════════════════════════════════════════════════════════════════════════════

def generar_cv():
    c = canvas.Canvas(SALIDA, pagesize=A4)
    c.setTitle('CV — Jaime Quiñelen Villar | QA Lead')

    # ── FONDOS PRINCIPALES ────────────────────────────────────────────────────
    # Sidebar oscuro
    c.setFillColor(SIDEBAR_COLOR)
    c.rect(0, 0, SIDE_W, H, fill=1, stroke=0)
    # Columna derecha: BLANCO PURO
    c.setFillColor(WHITE)
    c.rect(SIDE_W, 0, W - SIDE_W, H, fill=1, stroke=0)

    # ── HEADER SIDEBAR (zona foto) ────────────────────────────────────────────
    c.setFillColor(SIDEBAR_DARK)
    c.rect(0, H - 205, SIDE_W, 205, fill=1, stroke=0)
    # Línea acento top
    c.setFillColor(ACCENT)
    c.rect(0, H - 3, SIDE_W, 3, fill=1, stroke=0)

    # ── FOTO ──────────────────────────────────────────────────────────────────
    FD   = 96          # diámetro foto en pts
    fx   = (SIDE_W - FD) / 2
    fy   = H - 150

    if os.path.exists(FOTO_PATH):
        foto = circular_photo(FOTO_PATH, 300)
        c.drawImage(foto, fx, fy, width=FD, height=FD, mask='auto')
        # Borde acento
        c.setStrokeColor(ACCENT)
        c.setLineWidth(2)
        c.circle(SIDE_W / 2, fy + FD / 2, FD / 2 + 2, fill=0, stroke=1)
    else:
        # Placeholder — guardar foto_jaime.png en la misma carpeta
        c.setFillColor(colors.HexColor('#2A3D52'))
        c.circle(SIDE_W / 2, fy + FD / 2, FD / 2, fill=1, stroke=0)
        c.setFont('Helvetica', 6.5)
        c.setFillColor(SIDEBAR_MUTED)
        c.drawCentredString(SIDE_W / 2, fy + FD / 2 - 3, 'foto_jaime.png')

    # Nombre y cargo
    c.setFont('Helvetica-Bold', 10)
    c.setFillColor(WHITE)
    c.drawCentredString(SIDE_W / 2, H - 170, 'JAIME QUIÑELEN V.')
    c.setFont('Helvetica', 7.5)
    c.setFillColor(ACCENT)
    c.drawCentredString(SIDE_W / 2, H - 182, 'Computer Engineer')
    c.drawCentredString(SIDE_W / 2, H - 193, 'QA Strategy Leader')

    # ── CONTACTO ──────────────────────────────────────────────────────────────
    sy = H - 216
    sy = sidebar_title(c, sy, 'Contacto')
    for line in ['Pasaje Papudo 885, Lampa', 'Santiago, Chile',
                 'jaimeqv.2609@gmail.com', '+56 9 7347 3222']:
        c.setFont('Helvetica', 7.3)
        c.setFillColor(SIDEBAR_MUTED)
        c.drawString(PAD, sy, line)
        sy -= 11

    # ── EDUCACIÓN ─────────────────────────────────────────────────────────────
    sy -= 4
    sy = sidebar_title(c, sy, 'Educación')
    c.setFont('Helvetica-Bold', 7.8)
    c.setFillColor(WHITE)
    c.drawString(PAD, sy, 'Ingeniería en Computación')
    sy -= 10
    c.setFont('Helvetica', 7.3)
    c.setFillColor(SIDEBAR_MUTED)
    c.drawString(PAD, sy, 'U. Tecnológica Metropolitana')
    sy -= 10
    c.setFont('Helvetica-Bold', 7.3)
    c.setFillColor(ACCENT)
    c.drawString(PAD, sy, '2016')

    # ── HERRAMIENTAS ──────────────────────────────────────────────────────────
    sy -= 14
    sy = sidebar_title(c, sy, 'Herramientas & Skills')

    skills_list = [
        ('Jira / Xray / Confluence',   92),
        ('Metodología SDD',             90),
        ('Claude Code (QA)',            90),
        ('n8n Workflows',               87),
        ('Cypress E2E',                 85),
        ('Postman / Newman',            85),
        ('GitHub Actions CI/CD',        82),
        ('TestRail / Azure TP',         80),
        ('BrowserStack',                78),
        ('JMeter',                      78),
        ('Appium / Mobile',             75),
        ('SQL Server',                  75),
        ('Docker / Kubernetes',         73),
        ('Datadog',                     72),
        ('MongoDB',                     70),
        ('Jest / Go Test',              72),
    ]
    for lbl, pct in skills_list:
        if sy < 138:
            break
        skill_bar(c, PAD, sy, lbl, pct, bw=130)
        sy -= 17

    # ── DOMINIO FINANCIERO ────────────────────────────────────────────────────
    if sy > 120:
        sy -= 2
        sy = sidebar_title(c, sy, 'Dominio Financiero')
        for line in ['Derivados: Spot, Forward, Swap,',
                     'FxO, FxSwap, ZCC, Seagull',
                     'Renta Fija: Bonos, DAP, Repo,',
                     'IAM, Garantías, Loan & Deposit',
                     'Flujo FO/BO: Liquidación,',
                     'Reportería, Interfaces, Cierres']:
            if sy < 62:
                break
            c.setFont('Helvetica', 6.8)
            c.setFillColor(colors.HexColor('#6D8EA5'))
            c.drawString(PAD, sy, line)
            sy -= 9

    # ── FOOTER SIDEBAR ────────────────────────────────────────────────────────
    c.setFillColor(SIDEBAR_DARK)
    c.rect(0, 0, SIDE_W, 50, fill=1, stroke=0)
    c.setFont('Helvetica-Bold', 7)
    c.setFillColor(ACCENT)
    c.drawCentredString(SIDE_W / 2, 37, 'METODOLOGÍAS')
    tx = 8
    for tag in ['Scrum', 'Kanban', 'SDLC', 'SDD']:
        tx = chip(c, tx, 21, tag, colors.HexColor('#2E4560'), WHITE, 7)
    c.setFont('Helvetica', 6.5)
    c.setFillColor(SIDEBAR_MUTED)
    c.drawCentredString(SIDE_W / 2, 8, 'Confluence · Workload · Aldon · Linux')

    # ════════════════════════════════════════════════════════════════════════
    # COLUMNA DERECHA — FONDO BLANCO, LAYOUT LIMPIO
    # ════════════════════════════════════════════════════════════════════════

    # Header superior (franja oscura con nombre)
    c.setFillColor(SIDEBAR_DARK)
    c.rect(SIDE_W, H - 78, W - SIDE_W, 78, fill=1, stroke=0)
    c.setFillColor(ACCENT)
    c.rect(SIDE_W, H - 3, W - SIDE_W, 3, fill=1, stroke=0)

    c.setFont('Helvetica-Bold', 18)
    c.setFillColor(WHITE)
    c.drawString(COL_X, H - 34, 'JAIME QUIÑELEN VILLAR')

    c.setFont('Helvetica', 9)
    c.setFillColor(ACCENT)
    c.drawString(COL_X, H - 49, 'Computer Engineer  /  QA Strategy Leader')

    cx = COL_X
    for ch in ['11 años exp.', 'Team Lead 7 años', 'QA Senior', 'Banca Internacional']:
        cx = chip(c, cx, H - 73, ch, colors.HexColor('#2A3D52'), WHITE, 6.5)

    # Punto de inicio del contenido derecho
    ry = H - 94

    # ── PERFIL PROFESIONAL ────────────────────────────────────────────────────
    ry = right_title(c, ry, 'Perfil Profesional')
    ry -= 4

    perfil = ('Ingeniero en Computación con 11 años de experiencia en QA (7 años como '
              'Team Lead). Especialista en certificación de sistemas financieros de alcance '
              'internacional. Capacidad comprobada para liderar equipos, gestionar proyectos '
              'bajo el modelo SDLC y garantizar calidad en entornos de alta complejidad.')

    ry = draw_text_block(c, perfil, COL_X, ry, COL_W,
                         size=8.2, color=DARK_TEXT, leading=12) - 8

    # ── COMPETENCIAS CLAVE ────────────────────────────────────────────────────
    ry = right_title(c, ry, 'Competencias Clave')
    ry -= 4

    for comp in [
        'Liderazgo de equipos QA y gestión de proyectos bajo el ciclo SDLC completo.',
        'Comunicación con stakeholders: usuarios, jefaturas, gerencias y proveedores.',
        'Estimación de esfuerzo, cronogramas de prueba y asignación óptima de recursos.',
        'Alto rendimiento bajo presión con enfoque en resolución efectiva de problemas.',
    ]:
        # Bullet
        c.setFillColor(ACCENT)
        c.circle(COL_X + 4, ry + 3, 2.2, fill=1, stroke=0)
        ry = draw_text_block(c, comp, COL_X + 11, ry, COL_W - 13,
                             size=8, color=DARK_TEXT, leading=11)
        ry -= 4

    ry -= 5

    # ── EXPERIENCIA LABORAL ───────────────────────────────────────────────────
    ry = right_title(c, ry, 'Experiencia Laboral')
    ry -= 6

    experiencias = [
        {
            'empresa': 'SIIGROUP — Cliente Banco Scotiabank',
            'paises':  'Chile · Perú · Colombia · México · Canadá',
            'cargo':   'TEAM LEAD / QA SENIOR',
            'periodo': 'NOV 2017 — Actualidad',
            'logros': [
                'Certificación internacional "Sistema Kondor" — Mesa de Dinero, Banco Scotiabank.',
                'Estimación de esfuerzo, cronograma de pruebas y asignación de tareas al equipo QA.',
                'Revisión de casos de prueba, gestión de incidencias y reporte diario/semanal.',
                'Soporte en Producción y seguimiento de defectos hasta su resolución verificada.',
                'Reporte de estado a usuarios, jefaturas, desarrollo, proveedores y gerencias.',
            ],
        },
        {
            'empresa': 'KIBERNUM',
            'paises':  '',
            'cargo':   'QA ANALYST / QA AUTOMATOR',
            'periodo': 'ENE 2016 — NOV 2017',
            'logros': [
                'Generación de planes de prueba y ejecución de casos para múltiples clientes.',
                'Automatización con Sahi y Selenium; gestión de proyectos de automatización.',
                'Pruebas de stress, rendimiento y carga con JMeter.',
                'Proyectos: Duoc LVC, MINJU, BancoEstado, LVA Índices, DNC, Banco Bice, Tanner.',
                'Testing de APIs con Postman: solicitudes HTTP/S, análisis de respuestas y automatización.',
            ],
        },
        {
            'empresa': 'RHISCOM',
            'paises':  '',
            'cargo':   'JUNIOR QA ANALYST',
            'periodo': 'AGO 2015 — ENE 2016',
            'logros': [
                'Mantenimiento del ambiente de Pre-producción y plataformas de Testing (TestLink).',
                'Sistema BOPOS — generación de planes, diseño y ejecución de casos de prueba.',
                'Apoyo en gestión del paso al ambiente de Producción y funciones básicas DBA.',
            ],
        },
    ]

    for exp in experiencias:
        if ry < 55:
            break

        # --- CABECERA EMPRESA (sin rect de fondo para evitar superposición) ---

        # Franja izquierda acento
        c.setFillColor(ACCENT)
        c.rect(COL_X - 2, ry - 4, 3, 13, fill=1, stroke=0)

        # Nombre empresa
        c.setFont('Helvetica-Bold', 9)
        c.setFillColor(DARK_TEXT)
        c.drawString(COL_X + 6, ry + 3, exp['empresa'])

        # Periodo (derecha, misma línea)
        c.setFont('Helvetica-Bold', 7.5)
        c.setFillColor(ACCENT_GOLD)
        c.drawRightString(COL_X + COL_W, ry + 3, exp['periodo'])

        ry -= 13

        # País/extra (si existe)
        if exp['paises']:
            c.setFont('Helvetica', 7)
            c.setFillColor(MED_GRAY)
            c.drawString(COL_X + 6, ry, exp['paises'])
            ry -= 10

        # Cargo
        c.setFont('Helvetica-Bold', 7.8)
        c.setFillColor(ACCENT)
        c.drawString(COL_X + 6, ry, exp['cargo'])
        ry -= 11

        # Línea divisoria fina
        c.setStrokeColor(LINE_COLOR)
        c.setLineWidth(0.4)
        c.line(COL_X + 6, ry + 5, COL_X + COL_W, ry + 5)
        ry -= 4

        # Logros
        for logro in exp['logros']:
            if ry < 55:
                break
            c.setFillColor(MED_GRAY)
            c.circle(COL_X + 5, ry + 3, 1.8, fill=1, stroke=0)
            ry = draw_text_block(c, logro, COL_X + 13, ry, COL_W - 16,
                                 size=7.6, color=DARK_TEXT, leading=10)
            ry -= 3

        ry -= 12   # espacio entre empresas

    # ── FOOTER DERECHO ────────────────────────────────────────────────────────
    c.setFillColor(SIDEBAR_DARK)
    c.rect(SIDE_W, 0, W - SIDE_W, 18, fill=1, stroke=0)
    c.setFont('Helvetica', 6.5)
    c.setFillColor(SIDEBAR_MUTED)
    c.drawCentredString(SIDE_W + (W - SIDE_W) / 2, 5,
        'jaimeqv.2609@gmail.com  ·  +56 9 7347 3222  ·  Santiago, Chile  ·  2025')

    c.save()
    print(f'PDF generado: {SALIDA}')


if __name__ == '__main__':
    generar_cv()
