"""
Gera og-default.jpg para Sites Especiais (1200×630px)
Design: dark premium Luxota — dourado + mint sobre preto

Uso:
    pip install Pillow
    python scripts/create-og-image.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1200, 630
OUTPUT = Path(__file__).parent.parent / "public" / "og-default.jpg"

# Cores Luxota
BG        = (8,   8,   8)
GOLD      = (240, 208,  96)   # #f0d060
MINT      = ( 79, 209, 197)   # #4FD1C5
FG        = (245, 245, 240)   # #f5f5f0
SECONDARY = (176, 176, 168)   # #b0b0a8
MUTED     = ( 85,  85,  80)   # #555550
CARD      = ( 20,  20,  20)   # #141414

img  = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# ── Gradiente de fundo radial (simulado com círculos) ──────────────
def draw_glow(cx, cy, radius, color, steps=60):
    for i in range(steps, 0, -1):
        r = int(radius * i / steps)
        alpha = int(8 * (i / steps) ** 2)
        overlay = Image.new("RGB", (W, H), BG)
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
        img.paste(
            Image.blend(img, overlay, alpha / 255),
            (0, 0)
        )

# Blob mint (canto superior esquerdo)
draw_glow(150, 100, 350, (15, 35, 33))
# Blob dourado (canto inferior direito)
draw_glow(1050, 530, 400, (22, 18, 5))

# ── Grid perspectiva (linhas sutis) ───────────────────────────────
LINE_COLOR = (255, 255, 255, 6)
for x in range(0, W + 80, 80):
    draw.line([(x, 0), (x, H)], fill=(18, 18, 18), width=1)
for y in range(0, H + 80, 80):
    draw.line([(0, y), (W, y)], fill=(18, 18, 18), width=1)

# ── Borda sutil ───────────────────────────────────────────────────
draw.rectangle([2, 2, W - 3, H - 3], outline=(30, 30, 30), width=1)

# ── Fontes ────────────────────────────────────────────────────────
# Usar fonte padrão — substituir por TTF se disponível
try:
    font_h1    = ImageFont.truetype("arial.ttf",  64)
    font_h2    = ImageFont.truetype("arial.ttf",  36)
    font_small = ImageFont.truetype("arial.ttf",  22)
    font_tag   = ImageFont.truetype("arial.ttf",  18)
    font_mono  = ImageFont.truetype("cour.ttf",   20)
except Exception:
    font_h1    = ImageFont.load_default()
    font_h2    = font_h1
    font_small = font_h1
    font_tag   = font_h1
    font_mono  = font_h1

# ── Logotipo (hexágono simulado + texto) ──────────────────────────
# Hex pequeno
hex_cx, hex_cy = 80, 80
hex_r = 28
hex_pts = [
    (hex_cx + hex_r * math.cos(math.radians(60 * i - 30)),
     hex_cy + hex_r * math.sin(math.radians(60 * i - 30)))
    for i in range(6)
]
draw.polygon(hex_pts, outline=GOLD, width=2)
inner_r = hex_r * 0.6
inner_pts = [
    (hex_cx + inner_r * math.cos(math.radians(60 * i - 30)),
     hex_cy + inner_r * math.sin(math.radians(60 * i - 30)))
    for i in range(6)
]
draw.polygon(inner_pts, fill=(*GOLD, 25))

# Texto logo
draw.text((116, 58), "Sites", fill=SECONDARY, font=font_small)
draw.text((116, 84), "Especiais", fill=FG, font=font_small)

# ── Badge superior ────────────────────────────────────────────────
badge_x, badge_y = 80, 150
badge_w, badge_h = 380, 38
draw.rounded_rectangle(
    [badge_x, badge_y, badge_x + badge_w, badge_y + badge_h],
    radius=19,
    outline=(*MINT, 50),
    fill=(12, 20, 18),
    width=1
)
# Dot animado (simulado)
draw.ellipse([badge_x + 16, badge_y + 13, badge_x + 23, badge_y + 20], fill=MINT)
draw.text((badge_x + 32, badge_y + 9), "Feito para Gerar Autoridade", fill=MUTED, font=font_tag)

# ── Headline principal ────────────────────────────────────────────
line1 = "Seu site existe."
line2 = "Mas ele está"
line3 = "trabalhando por você?"

draw.text((80, 220), line1, fill=FG,   font=font_h1)
draw.text((80, 300), line2, fill=FG,   font=font_h1)
draw.text((80, 378), line3, fill=GOLD, font=font_h1)

# ── Subtítulo ─────────────────────────────────────────────────────
draw.text((80, 468), "Reforma em 14 dias · Garantia 7 dias · Aparece no Google e no ChatGPT", fill=SECONDARY, font=font_small)

# ── Painel de métricas (lado direito) ─────────────────────────────
panel_x, panel_y = 760, 150
panel_w, panel_h = 360, 320
draw.rounded_rectangle(
    [panel_x, panel_y, panel_x + panel_w, panel_y + panel_h],
    radius=16,
    fill=CARD,
    outline=(34, 34, 34),
    width=1
)

metrics = [
    ("+340%",  "mais visitas orgânicas"),
    ("3x",     "mais agendamentos"),
    ("14 dias","entrega garantida"),
    ("7 dias", "garantia incondicional"),
]

for i, (valor, label) in enumerate(metrics):
    y = panel_y + 30 + i * 70
    # Separador (exceto primeiro)
    if i > 0:
        draw.line(
            [(panel_x + 24, y - 10), (panel_x + panel_w - 24, y - 10)],
            fill=(34, 34, 34), width=1
        )
    draw.text((panel_x + 28, y),       valor, fill=GOLD,      font=font_h2)
    draw.text((panel_x + 28, y + 42),  label, fill=SECONDARY, font=font_tag)

# ── Rodapé do painel ─────────────────────────────────────────────
draw.text(
    (panel_x + 28, panel_y + panel_h + 18),
    "sitesespeciais.com.br",
    fill=MUTED,
    font=font_mono
)

# ── URL no rodapé ─────────────────────────────────────────────────
draw.line([(80, H - 60), (W - 80, H - 60)], fill=(30, 30, 30), width=1)
draw.text((80, H - 44), "sitesespeciais.com.br", fill=MUTED, font=font_mono)
draw.text((W - 280, H - 44), "Reforma · Site Novo · 14 dias", fill=MUTED, font=font_tag)

# ── Salvar ────────────────────────────────────────────────────────
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
img.save(str(OUTPUT), "JPEG", quality=92, optimize=True)
print(f"✅  OG image salva em: {OUTPUT}")
print(f"    Tamanho: {OUTPUT.stat().st_size // 1024} KB")
