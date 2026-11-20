from pathlib import Path
p = Path(__file__).with_name("_shot_code.html")
t = p.read_text(encoding="utf-8")
t = t.replace('value="4949"', 'value="312"')
p.write_text(t, encoding="utf-8")
print("updated", "312" in t)
