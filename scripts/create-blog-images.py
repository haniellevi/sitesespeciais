"""
Gera 3 imagens de cover para posts do blog Sites Especiais
Design: dark premium, 1280x720, on-brand
"""
from PIL import Image, ImageDraw, ImageFilter
import math, os

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'blog-images')
os.makedirs(OUT_DIR, exist_ok=True)

W, H = 1280, 720

# ── Design tokens (Luxota UI) ─────────────────────────────────
BG       = (11, 14, 20)       # #0B0E14 luxota-bg
CARD     = (22, 27, 39)       # #161B27 luxota-card
GOLD     = (232, 197, 71)     # #e8c547 primary
CYAN     = (79, 209, 197)     # #4FD1C5 luxota-accent
FG       = (245, 245, 240)    # #f5f5f0 foreground
MUTED    = (100, 110, 130)    # text-muted
BORDER   = (79, 209, 197, 30) # luxota-border rgba

FONT_BOLD   = "C:/Windows/Fonts/arialbd.ttf"
FONT_NORMAL = "C:/Windows/Fonts/arial.ttf"

def load_font(path, size):
    from PIL import ImageFont
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def hex_alpha(color_rgb, alpha):
    return (*color_rgb, alpha)

def draw_grid(draw, color=(255,255,255,8)):
    """Perspective grid sutil no fundo"""
    for x in range(0, W+1, 80):
        draw.line([(x, 0), (x, H)], fill=color, width=1)
    for y in range(0, H+1, 60):
        draw.line([(0, y), (W, y)], fill=color, width=1)

def draw_blob(img, cx, cy, radius, color_rgba):
    """Glow circular sutil"""
    blob = Image.new('RGBA', (W, H), (0,0,0,0))
    bd = ImageDraw.Draw(blob)
    for r in range(radius, 0, -radius//8):
        a = int(color_rgba[3] * (1 - r/radius) * 0.6)
        col = (*color_rgba[:3], a)
        bd.ellipse([cx-r, cy-r, cx+r, cy+r], fill=col)
    img.alpha_composite(blob)

def draw_text_wrapped(draw, text, x, y, max_w, font, fill, line_height=1.3):
    """Quebra texto e retorna y final"""
    words = text.split()
    lines = []
    current = ""
    for w in words:
        test = (current + " " + w).strip()
        bbox = draw.textbbox((0,0), test, font=font)
        if bbox[2] - bbox[0] <= max_w:
            current = test
        else:
            if current:
                lines.append(current)
            current = w
    if current:
        lines.append(current)

    for i, line in enumerate(lines):
        size = draw.textbbox((0,0), line, font=font)
        lh = (size[3] - size[1]) * line_height
        draw.text((x, y + i * lh), line, font=font, fill=fill)

    if lines:
        size = draw.textbbox((0,0), lines[0], font=font)
        return y + len(lines) * (size[3] - size[1]) * line_height
    return y

# ── Imagem 1: "Site invisível para IAs" ─────────────────────────────────────
def create_image_ia():
    img = Image.new('RGBA', (W, H), BG)

    # Blobs de glow
    draw_blob(img, W//2 + 200, H//2 - 80, 420, (*CYAN, 35))
    draw_blob(img, 100, H - 100, 300, (*GOLD, 20))

    d = ImageDraw.Draw(img)
    draw_grid(d, (255,255,255,6))

    # Painel central "chat" estilizado
    panel_x, panel_y, panel_w, panel_h = 120, 110, 540, 420
    # Card sombra
    d.rounded_rectangle([panel_x+4, panel_y+4, panel_x+panel_w+4, panel_y+panel_h+4],
                         radius=16, fill=(0,0,0,80))
    d.rounded_rectangle([panel_x, panel_y, panel_x+panel_w, panel_y+panel_h],
                         radius=16, fill=CARD)
    # Borda sutil
    d.rounded_rectangle([panel_x, panel_y, panel_x+panel_w, panel_y+panel_h],
                         radius=16, outline=(*CYAN, 40), width=1)

    # Barra de título do card
    d.rounded_rectangle([panel_x, panel_y, panel_x+panel_w, panel_y+44],
                         radius=16, fill=(255,255,255,10))
    # Três dots
    for i, c in enumerate([(255,90,90), (255,190,60), (80,200,120)]):
        d.ellipse([panel_x+18+i*22, panel_y+15, panel_x+30+i*22, panel_y+27], fill=c)

    # Linhas de "texto" simulando resultado de busca
    font_label = load_font(FONT_BOLD, 11)
    font_small = load_font(FONT_NORMAL, 13)

    d.text((panel_x+18, panel_y+56), "ChatGPT · Gemini · Perplexity", font=font_label,
           fill=(*CYAN, 160))

    # Prompt de busca estilizado
    bar_y = panel_y + 82
    d.rounded_rectangle([panel_x+18, bar_y, panel_x+panel_w-18, bar_y+36],
                         radius=8, fill=(255,255,255,8), outline=(*CYAN,50), width=1)
    font_prompt = load_font(FONT_NORMAL, 14)
    d.text((panel_x+32, bar_y+10), "melhor clínica em Corrente PI...", font=font_prompt,
           fill=(*FG, 120))

    # Resultados — outros aparecem, seu negócio some
    results = [
        ("✓", "Clínica Central — Corrente, PI", CYAN),
        ("✓", "Centro Médico Regional — Corrente", CYAN),
        ("✗", "Seu negócio — não encontrado", (200, 70, 70)),
        ("✓", "Consultório Dr. Silva — Corrente", CYAN),
    ]
    ry = bar_y + 52
    for icon, text, color in results:
        d.rounded_rectangle([panel_x+18, ry, panel_x+panel_w-18, ry+32],
                             radius=6, fill=(255,255,255,5))
        d.text((panel_x+28, ry+8), icon, font=font_small, fill=(*color, 220))
        d.text((panel_x+48, ry+8), text, font=font_small, fill=(*FG, 180 if color!=( 200,70,70) else 230))
        ry += 40

    # Painel direito — textos grandes
    tx = panel_x + panel_w + 70

    # Eyebrow
    font_eye = load_font(FONT_BOLD, 12)
    d.text((tx, 130), "SEO & VISIBILIDADE", font=font_eye, fill=(*CYAN, 200))
    d.line([(tx, 152), (tx+180, 152)], fill=(*CYAN, 60), width=1)

    # Headline principal
    font_h1 = load_font(FONT_BOLD, 52)
    font_h2 = load_font(FONT_BOLD, 48)

    draw_text_wrapped(d, "Seu site", tx, 168, W - tx - 60, font_h1, FG)
    draw_text_wrapped(d, "invisível", tx, 228, W - tx - 60, font_h1, GOLD)
    draw_text_wrapped(d, "para as IAs", tx, 288, W - tx - 60, font_h2, FG)

    # Subtexto
    font_sub = load_font(FONT_NORMAL, 17)
    draw_text_wrapped(d, "Em 2026, metade dos clientes", tx, 375, W - tx - 60, font_sub,
                      (*FG, 160), line_height=1.6)
    draw_text_wrapped(d, "pesquisa no ChatGPT ou Gemini.", tx, 406, W - tx - 60, font_sub,
                      (*FG, 160), line_height=1.6)
    draw_text_wrapped(d, "Seu site está lá?", tx, 437, W - tx - 60, font_sub,
                      (*GOLD, 220), line_height=1.6)

    # Linha de rodapé
    d.line([(tx, H - 90), (tx + 300, H - 90)], fill=(*GOLD, 60), width=1)
    font_brand = load_font(FONT_BOLD, 13)
    d.text((tx, H - 78), "Sites Especiais · Blog", font=font_brand, fill=(*MUTED, 180))

    out = os.path.join(OUT_DIR, 'blog-cover-ias.jpg')
    img.convert('RGB').save(out, 'JPEG', quality=92)
    print(f"✓ {out}")
    return out


# ── Imagem 2: "Cliente some do site" ────────────────────────────────────────
def create_image_cliente():
    img = Image.new('RGBA', (W, H), BG)

    draw_blob(img, W//4, H//3, 380, (*GOLD, 25))
    draw_blob(img, W - 150, H - 100, 320, (*CYAN, 22))

    d = ImageDraw.Draw(img)
    draw_grid(d, (255,255,255,5))

    # Wireframe de site mockup (lado esquerdo)
    mx, my, mw, mh = 90, 100, 480, 510
    d.rounded_rectangle([mx, my, mx+mw, my+mh], radius=14, fill=CARD,
                         outline=(*CYAN, 35), width=1)
    # Barra navegação
    d.rounded_rectangle([mx, my, mx+mw, my+40], radius=14, fill=(255,255,255,8))
    for i in range(4):
        d.rounded_rectangle([mx+18+i*90, my+14, mx+80+i*90, my+26], radius=3,
                             fill=(255,255,255,30))

    # Seções do mockup - site confuso/lotado
    def section(sy, sh, alpha=15):
        d.rounded_rectangle([mx+16, sy, mx+mw-16, sy+sh], radius=6,
                             fill=(255,255,255,alpha))

    section(my+52, 80, 18)   # hero
    # "hero" confuso - muitos elementos
    for i in range(6):
        d.rounded_rectangle([mx+24+i*70, my+62, mx+80+i*70, my+72], radius=2,
                             fill=(*MUTED, 60))

    section(my+144, 120, 12)  # seção 1
    section(my+276, 90, 10)   # seção 2
    section(my+378, 100, 8)   # seção 3 — sumindo/desbotando

    # Usuário "saindo" — seta de exit
    exit_x, exit_y = mx + mw - 40, my + 30
    # Seta de saída animada (múltiplas posições)
    for i, alpha in enumerate([40, 70, 120, 200]):
        ax = exit_x + i * 30
        d.line([(ax, exit_y), (ax + 20, exit_y)], fill=(*GOLD, alpha), width=2)
        d.polygon([(ax+16, exit_y-6), (ax+26, exit_y), (ax+16, exit_y+6)],
                  fill=(*GOLD, alpha))

    # Texto "3 segundos" destacado no mockup
    font_stat = load_font(FONT_BOLD, 40)
    d.text((mx+mw//2 - 90, my+mh//2 - 10), "3s", font=font_stat, fill=(*GOLD, 80))
    font_stat_label = load_font(FONT_NORMAL, 14)
    d.text((mx+mw//2 - 50, my+mh//2 + 38), "e ele foi embora", font=font_stat_label,
           fill=(*GOLD, 60))

    # Painel direito
    tx = mx + mw + 70

    font_eye = load_font(FONT_BOLD, 12)
    d.text((tx, 130), "SITES & CONVERSÃO", font=font_eye, fill=(*CYAN, 200))
    d.line([(tx, 152), (tx+200, 152)], fill=(*CYAN, 60), width=1)

    font_h1 = load_font(FONT_BOLD, 50)
    font_h2 = load_font(FONT_BOLD, 46)

    draw_text_wrapped(d, "Seu cliente", tx, 168, W - tx - 60, font_h1, FG)
    draw_text_wrapped(d, "entrou", tx, 228, W - tx - 60, font_h1, GOLD)
    draw_text_wrapped(d, "e foi embora.", tx, 288, W - tx - 60, font_h2, FG)

    font_sub = load_font(FONT_NORMAL, 17)
    draw_text_wrapped(d, "95% das visitas saem sem", tx, 375, W - tx - 60, font_sub,
                      (*FG, 155), line_height=1.6)
    draw_text_wrapped(d, "fazer nada. Não é azar.", tx, 406, W - tx - 60, font_sub,
                      (*FG, 155), line_height=1.6)
    draw_text_wrapped(d, "É problema de design.", tx, 437, W - tx - 60, font_sub,
                      (*CYAN, 220), line_height=1.6)

    d.line([(tx, H - 90), (tx + 300, H - 90)], fill=(*GOLD, 60), width=1)
    font_brand = load_font(FONT_BOLD, 13)
    d.text((tx, H - 78), "Sites Especiais · Blog", font=font_brand, fill=(*MUTED, 180))

    out = os.path.join(OUT_DIR, 'blog-cover-cliente.jpg')
    img.convert('RGB').save(out, 'JPEG', quality=92)
    print(f"✓ {out}")
    return out


# ── Imagem 3: "Reforma vs Site Novo" ────────────────────────────────────────
def create_image_reforma():
    img = Image.new('RGBA', (W, H), BG)

    draw_blob(img, W//4, H//2, 360, (*MUTED, 30))
    draw_blob(img, 3*W//4, H//2, 360, (*GOLD, 28))

    d = ImageDraw.Draw(img)
    draw_grid(d, (255,255,255,5))

    # Linha divisória central com ícone
    div_x = W // 2
    d.line([(div_x, 60), (div_x, H - 60)], fill=(255,255,255,30), width=1)

    # Losango no centro
    cx, cy, cr = div_x, H // 2, 24
    d.polygon([(cx, cy-cr), (cx+cr, cy), (cx, cy+cr), (cx-cr, cy)],
              fill=CARD, outline=(*CYAN, 150), width=2)
    font_vs = load_font(FONT_BOLD, 12)
    bbox = d.textbbox((0,0), "VS", font=font_vs)
    d.text((cx - (bbox[2]-bbox[0])//2, cy - (bbox[3]-bbox[1])//2 - 1),
           "VS", font=font_vs, fill=CYAN)

    # ── Lado esquerdo: REFORMA ────────────────────────────────
    lx = 60

    # Tag
    font_tag = load_font(FONT_BOLD, 11)
    d.rounded_rectangle([lx, 80, lx+130, 102], radius=4, fill=(255,255,255,12),
                         outline=(*MUTED, 80), width=1)
    d.text((lx+12, 85), "REFORMA DE SITE", font=font_tag, fill=(*MUTED, 220))

    # Mockup antigo
    mx, my, mw, mh = lx + 20, 120, 300, 240
    d.rounded_rectangle([mx, my, mx+mw, my+mh], radius=10, fill=(255,255,255,6),
                         outline=(*MUTED, 40), width=1)
    # Elementos antigos/quebrados
    for i in range(5):
        w = [220, 160, 190, 130, 170][i]
        c = [25,20,18,15,12][i]
        d.rounded_rectangle([mx+16, my+18+i*42, mx+16+w, my+34+i*42], radius=3,
                             fill=(255,255,255,c))
    # X de "quebrado"
    d.line([(mx+10, my+10), (mx+30, my+30)], fill=(200,70,70,120), width=2)
    d.line([(mx+30, my+10), (mx+10, my+30)], fill=(200,70,70,120), width=2)

    font_price = load_font(FONT_BOLD, 32)
    d.text((lx + 20, 378), "R$ 1.997", font=font_price, fill=GOLD)
    font_price_sub = load_font(FONT_NORMAL, 14)
    d.text((lx + 20, 420), "estrutura preservada", font=font_price_sub, fill=(*FG, 120))
    d.text((lx + 20, 442), "visual reformado", font=font_price_sub, fill=(*FG, 120))
    d.text((lx + 20, 464), "mobile + Google", font=font_price_sub, fill=(*FG, 120))

    # ── Lado direito: SITE NOVO ───────────────────────────────
    rx = div_x + 50

    d.rounded_rectangle([rx, 80, rx+140, 102], radius=4, fill=(*GOLD, 25),
                         outline=(*GOLD, 80), width=1)
    d.text((rx+12, 85), "SITE NOVO PREMIUM", font=font_tag, fill=(*GOLD, 240))

    # Mockup novo/premium
    nmx, nmy, nmw, nmh = rx + 20, 120, 300, 240
    d.rounded_rectangle([nmx, nmy, nmx+nmw, nmy+nmh], radius=10, fill=(*GOLD, 8),
                         outline=(*GOLD, 60), width=1)
    # Elementos modernos
    d.rounded_rectangle([nmx+16, nmy+16, nmx+nmw-16, nmy+60], radius=6,
                         fill=(*GOLD, 20))
    for i in range(3):
        d.rounded_rectangle([nmx+16, nmy+76+i*54, nmx+16+240, nmy+100+i*54], radius=5,
                             fill=(255,255,255,15))
    # Check de "OK"
    d.ellipse([nmx+8, nmy+8, nmx+28, nmy+28], fill=(*CYAN, 40))
    font_check = load_font(FONT_BOLD, 14)
    d.text((nmx+12, nmy+9), "✓", font=font_check, fill=CYAN)

    d.text((rx + 20, 378), "R$ 2.997", font=font_price, fill=GOLD)
    d.text((rx + 20, 420), "do zero, identidade própria", font=font_price_sub, fill=(*FG, 120))
    d.text((rx + 20, 442), "estrutura pensada pra converter", font=font_price_sub, fill=(*FG, 120))
    d.text((rx + 20, 464), "14 dias no ar", font=font_price_sub, fill=(*FG, 120))

    # Headline no topo central
    font_h1 = load_font(FONT_BOLD, 40)
    headline = "Quando reformar? Quando fazer do zero?"
    bbox = d.textbbox((0,0), headline, font=load_font(FONT_BOLD, 22))
    d.text((W//2 - (bbox[2]-bbox[0])//2, 520), headline,
           font=load_font(FONT_BOLD, 22), fill=(*FG, 200))

    font_brand = load_font(FONT_BOLD, 13)
    d.text((W//2 - 90, H - 54), "Sites Especiais · Blog", font=font_brand, fill=(*MUTED, 180))
    d.text((W//2 - 60, H - 34), "Veja os critérios →", font=font_brand, fill=(*CYAN, 200))

    out = os.path.join(OUT_DIR, 'blog-cover-reforma.jpg')
    img.convert('RGB').save(out, 'JPEG', quality=92)
    print(f"✓ {out}")
    return out


if __name__ == '__main__':
    print("Gerando imagens de blog...")
    img1 = create_image_ia()
    img2 = create_image_cliente()
    img3 = create_image_reforma()
    print(f"\nImagens geradas em: {OUT_DIR}")
