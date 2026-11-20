from pathlib import Path

base = Path(r"C:\Users\Tomas\Documents\tomasekplays")
videos = base / "videos"
src = (base / "index.html").read_text(encoding="utf-8")

html = src.replace('href="logo.png"', 'href="../logo.png"').replace('src="logo.png"', 'src="../logo.png"')
html = html.replace('window.location.href = "games.html"', 'window.location.href = "../games.html"')

kill_anim = """
<style id="shotFix">
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .hero-copy, .hero-stage, .nav, .brand-hero, .lede, .btn-play, .cta-row { opacity: 1 !important; transform: none !important; }
  html, body { overflow: hidden !important; height: 100% !important; }
</style>
"""
html = html.replace("</head>", kill_anim + "</head>")

(videos / "_shot_home.html").write_text(html, encoding="utf-8")

beta = html.replace('class="beta-overlay" id="betaGate"', 'class="beta-overlay open" id="betaGate"')
(videos / "_shot_beta.html").write_text(beta, encoding="utf-8")

code = beta.replace(
    'placeholder="Enter code" required />',
    'placeholder="Enter code" required value="4949" />',
)
(videos / "_shot_code.html").write_text(code, encoding="utf-8")

# Unlock success state look
unlock = beta.replace(
    'placeholder="Enter code" required />',
    'placeholder="Enter code" required value="4949" class="ok" />',
).replace(
    'id="betaError" aria-live="polite"></p>',
    'id="betaError" class="ok-msg" aria-live="polite">Code accepted — unlocking…</p>',
).replace(
    'class="beta-modal" id="betaModal"',
    'class="beta-modal unlock" id="betaModal"',
)
(videos / "_shot_unlock.html").write_text(unlock, encoding="utf-8")

reveal = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
:root { --bg:#09090b; --ink:#f4f4f0; --muted:rgba(244,244,240,.55); --accent:#5eead4; --line:rgba(244,244,240,.12); --elev:#111114; }
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:Space Grotesk,system-ui,sans-serif; background:var(--bg); color:var(--ink); min-height:100vh;
  background-image: radial-gradient(ellipse 80% 55% at 70% 15%, rgba(94,234,212,.09), transparent 55%), linear-gradient(180deg,#0c0c10,var(--bg)); }
.wrap { width:min(1100px,calc(100% - 3rem)); margin:0 auto; padding:1.5rem 0; }
.nav { display:flex; justify-content:space-between; align-items:center; margin-bottom:2.5rem; }
.brand { display:flex; gap:.85rem; align-items:center; font-weight:600; font-size:1.25rem; }
.brand img { width:44px; height:44px; border-radius:50%; border:1px solid var(--line); object-fit:cover; }
.chip { font-family:IBM Plex Mono,monospace; font-size:.72rem; letter-spacing:.08em; text-transform:uppercase; color:var(--accent); }
h1 { font-size:clamp(2rem,4vw,3rem); letter-spacing:-.04em; margin:.4rem 0 1.2rem; }
p { color:var(--muted); max-width:40rem; line-height:1.5; margin-bottom:1.5rem; }
.codes { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
.card { border:1px solid var(--line); background:linear-gradient(160deg,rgba(94,234,212,.08),transparent 45%), var(--elev);
  border-radius:16px; padding:1.6rem 1.2rem; text-align:center; }
.card .n { font-family:IBM Plex Mono,monospace; font-size:2.6rem; letter-spacing:.14em; color:var(--accent); font-weight:500; }
.card .l { margin-top:.55rem; color:var(--muted); font-size:.85rem; }
.note { margin-top:1.5rem; font-family:IBM Plex Mono,monospace; font-size:.8rem; color:var(--muted); }
</style></head><body>
<div class="wrap">
  <div class="nav"><div class="brand"><img src="../logo.png" alt="" /> TomasekPlays</div><span class="chip">Beta codes · official</span></div>
  <div class="chip">Tutorial · Step 2</div>
  <h1>Any of these 3 codes works</h1>
  <p>On the website popup, type one code, then press Enter or Try Beta mode. All three unlock the arcade.</p>
  <div class="codes">
    <div class="card"><div class="n">4949</div><div class="l">Code 1</div></div>
    <div class="card"><div class="n">148</div><div class="l">Code 2</div></div>
    <div class="card"><div class="n">312</div><div class="l">Code 3</div></div>
  </div>
  <p class="note">Works on TomasekPlays web · youtube.com/@TomasekPlays</p>
</div>
</body></html>
"""
(videos / "_shot_codes.html").write_text(reveal, encoding="utf-8")

# Games unlocked hub — inject boot script into a copy
games = (base / "games.html").read_text(encoding="utf-8")
games = games.replace('href="logo.png"', 'href="../logo.png"').replace('src="logo.png"', 'src="../logo.png"')
game = games.replace('href="index.html"', 'href="../index.html"')
# force hub on load
boot = """
<script>
sessionStorage.setItem("tomasekBetaUnlocked","1");
localStorage.setItem("tomasekDevice","pc");
</script>
"""
# Insert before existing boot logic by forcing hub after parse — patch the end boot
game = game.replace(
    'if (sessionStorage.getItem(K.beta) === "1") {',
    'sessionStorage.setItem(K.beta, "1"); localStorage.setItem(K.device, "pc"); device = "pc"; if (sessionStorage.getItem(K.beta) === "1") {',
)
# disable anim
game = game.replace("</head>", """
<style>*,*::before,*::after{animation:none!important;transition:none!important}</style>
</head>""")
(videos / "_shot_arcade.html").write_text(game, encoding="utf-8")

device = """<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
:root{--bg:#09090b;--elev:#111114;--ink:#f4f4f0;--muted:rgba(244,244,240,.55);--line:rgba(244,244,240,.12);--accent:#5eead4;--font:Space Grotesk,system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:var(--font);background:var(--bg);color:var(--ink);min-height:100vh;display:grid;place-items:center;
background-image:radial-gradient(ellipse 80% 50% at 70% 10%,rgba(94,234,212,.1),transparent 55%),#09090b}
.card{width:min(420px,92vw);padding:1.6rem;border-radius:16px;border:1px solid var(--line);background:linear-gradient(160deg,rgba(94,234,212,.08),transparent 45%),var(--elev)}
h1{font-size:1.4rem;letter-spacing:-.03em;margin:.2rem 0 .4rem}p{color:var(--muted);font-size:.92rem;line-height:1.5;margin-bottom:1rem}
.devs{display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin-bottom:1rem}
.dev{padding:1rem .7rem;border-radius:14px;border:1px solid var(--line);background:rgba(255,255,255,.02);text-align:center}
.dev.on{border-color:rgba(94,234,212,.55);background:rgba(94,234,212,.14)}
.dev strong{display:block;margin-bottom:.2rem}.dev span{color:var(--muted);font-size:.75rem}
.btn{display:flex;justify-content:center;border:none;border-radius:999px;padding:.8rem 1.1rem;font-weight:700;background:var(--accent);color:#04120f;width:100%}
.brand{display:flex;gap:.75rem;align-items:center;margin-bottom:.75rem}
.brand img{width:42px;height:42px;border-radius:50%;border:1px solid var(--line);object-fit:cover}
</style></head><body>
<div class="card">
  <div class="brand"><img src="../logo.png" alt="" /><div><strong>Tomasek Plays</strong><div style="color:var(--muted);font-size:.8rem">Arcade beta</div></div></div>
  <h1>Choose your setup</h1>
  <p>Mobile turns zoom off. PC can keep zoom on.</p>
  <div class="devs">
    <div class="dev on"><strong>PC</strong><span>Keyboard · zoom ok</span></div>
    <div class="dev"><strong>Mobile</strong><span>Touch · zoom off</span></div>
  </div>
  <div class="btn">Enter arcade</div>
</div>
</body></html>
"""
(videos / "_shot_device.html").write_text(device, encoding="utf-8")

print("prepared")
