from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance, ImageFont

clear = Path(r"C:\Users\Tomas\Documents\tomasekplays\videos\TomasekPlays_Beta_Tutorial_THUMB_clear.jpg")
out = Path(r"C:\Users\Tomas\Documents\tomasekplays\videos\TomasekPlays_Beta_Tutorial_THUMB.jpg")
src = clear if clear.exists() else out

img = Image.open(src).convert("RGBA")
w, h = img.size

# Full area of the big code
left, top, right, bottom = int(w * 0.12), int(h * 0.26), int(w * 0.88), int(h * 0.82)
bw, bh = right - left, bottom - top

# Take region, blur extremely hard, then overlay solid frosted plate
region = img.crop((left, top, right, bottom)).convert("RGB")
blob = region.filter(ImageFilter.GaussianBlur(radius=80))
blob = ImageEnhance.Brightness(blob).enhance(0.75)
blob = ImageEnhance.Color(blob).enhance(1.2)
blob = blob.filter(ImageFilter.GaussianBlur(radius=40))

# Solid censor plate so digits are impossible to read
plate = Image.new("RGBA", (bw, bh), (8, 18, 18, 0))
draw = ImageDraw.Draw(plate)
# teal frosted rounded rect
draw.rounded_rectangle([8, 8, bw - 8, bh - 8], radius=36, fill=(14, 40, 40, 230))
# soft inner glow without revealing digits
draw.rounded_rectangle([28, 28, bw - 28, bh - 28], radius=28, fill=(30, 70, 70, 120))

# Fake blurred "code" streaks (not real digits)
for i in range(3):
    x0 = int(bw * (0.18 + i * 0.22))
    draw.rounded_rectangle(
        [x0, int(bh * 0.28), x0 + int(bw * 0.16), int(bh * 0.72)],
        radius=18,
        fill=(94, 234, 212, 70),
    )

plate = plate.filter(ImageFilter.GaussianBlur(radius=6))

composed = Image.alpha_composite(blob.convert("RGBA"), plate)

# Feathered mask
mask = Image.new("L", (bw, bh), 0)
md = ImageDraw.Draw(mask)
md.rounded_rectangle([0, 0, bw - 1, bh - 1], radius=40, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(radius=12))

# Small label so people know something is hidden
try:
    font = ImageFont.truetype("arial.ttf", 28)
except Exception:
    font = ImageFont.load_default()
label = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
ld = ImageDraw.Draw(label)
text = "CODE HIDDEN"
# center-ish bottom of plate
tw = ld.textlength(text, font=font) if hasattr(ld, "textlength") else 160
ld.text(((bw - tw) / 2, bh * 0.78), text, fill=(94, 234, 212, 200), font=font)
composed = Image.alpha_composite(composed, label)

base = img.copy()
base.paste(composed, (left, top), mask)
base.convert("RGB").save(out, quality=92)
print("fully hidden", out)
