"""Build TomasekPlays videos with Ken Burns animation + code 148 only."""
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
MUSIC = ROOT / "music"
TMP = ROOT / "_tmp"


def run(cmd: list[str]) -> None:
    print(">", " ".join(cmd[:6]), "...")
    subprocess.run(cmd, check=True)


def animated_clip(img: Path, seconds: float, out: Path, motion: str = "in", caption: str | None = None) -> None:
    """Small zoom/pan animation (Ken Burns style)."""
    frames = max(1, int(seconds * 30))
    # motion presets: gentle zoom in/out + slight pan
    if motion == "in":
        zoom = f"zoompan=z='min(1.12,1+0.0009*on)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=1920x1080:fps=30"
    elif motion == "out":
        zoom = f"zoompan=z='if(eq(on,1),1.12,max(1.0,1.12-0.0009*on))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s=1920x1080:fps=30"
    elif motion == "left":
        zoom = f"zoompan=z='1.08':x='if(eq(on,1),0,min(iw*0.08,x+0.35))':y='ih/2-(ih/zoom/2)':d={frames}:s=1920x1080:fps=30"
    else:  # right / default
        zoom = f"zoompan=z='1.08':x='if(eq(on,1),iw*0.08,max(0,x-0.35))':y='ih/2-(ih/zoom/2)':d={frames}:s=1920x1080:fps=30"

    vf = (
        f"scale=1920:1080:force_original_aspect_ratio=increase,"
        f"crop=1920:1080,"
        f"{zoom},"
        f"format=yuv420p,"
        f"fade=t=in:st=0:d=0.35,"
        f"fade=t=out:st={max(0.2, seconds - 0.4)}:d=0.4"
    )
    if caption:
        safe = (
            caption.replace("\\", "\\\\")
            .replace(":", "\\:")
            .replace("'", "")
            .replace("%", "\\%")
        )
        vf += (
            f",drawbox=x=0:y=ih-88:w=iw:h=88:color=black@0.55:t=fill"
            f",drawtext=text='{safe}':fontcolor=0x5eead4:fontsize=28:x=40:y=h-56"
        )

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(img),
        "-t", f"{seconds:.2f}",
        "-vf", vf,
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        str(out),
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as e:
        # retry without drawtext if font missing
        print("retry without caption", e.stderr[-300:] if e.stderr else "")
        vf2 = (
            f"scale=1920:1080:force_original_aspect_ratio=increase,"
            f"crop=1920:1080,"
            f"{zoom},"
            f"format=yuv420p,"
            f"fade=t=in:st=0:d=0.35,"
            f"fade=t=out:st={max(0.2, seconds - 0.4)}:d=0.4"
        )
        run([
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(img),
            "-t", f"{seconds:.2f}",
            "-vf", vf2,
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            str(out),
        ])


def concat_clips(clips: list[Path], out: Path) -> None:
    lst = TMP / "concat.txt"
    lst.write_text("\n".join(f"file '{c.resolve().as_posix()}'" for c in clips), encoding="utf-8")
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(out)])


def mux(video: Path, audio: Path, out: Path, audio_start: float = 0.0) -> None:
    run([
        "ffmpeg", "-y",
        "-i", str(video),
        "-ss", str(audio_start),
        "-i", str(audio),
        "-filter_complex",
        "[1:a]afade=t=in:st=0:d=1.2,afade=t=out:st=24:d=2,volume=0.55[a]",
        "-map", "0:v", "-map", "[a]",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        "-movflags", "+faststart",
        str(out),
    ])


def build(name: str, slides: list[tuple[Path, float, str, str | None]], music: Path, audio_start: float = 0) -> None:
    TMP.mkdir(exist_ok=True)
    clips = []
    for i, (img, dur, motion, caption) in enumerate(slides):
        if not img.exists():
            raise SystemExit(f"Missing {img}")
        clip = TMP / f"{name}_{i:02d}.mp4"
        animated_clip(img, dur, clip, motion, caption)
        clips.append(clip)
    silent = TMP / f"{name}_silent.mp4"
    concat_clips(clips, silent)
    out = ROOT / f"TomasekPlays_{name}.mp4"
    mux(silent, music, out, audio_start)
    print("Wrote", out)


def main() -> None:
    promo_music = MUSIC / "promo.mp3"
    tutorial_music = MUSIC / "tutorial.mp3"

    build(
        "Promo_Web",
        [
            (ASSETS / "real-home.png", 5.0, "in", "TomasekPlays web arcade"),
            (ASSETS / "logo.png", 3.2, "out", "YouTube @TomasekPlays"),
            (ASSETS / "real-beta.png", 4.0, "left", "Try Beta mode to unlock"),
            (ASSETS / "real-arcade.png", 5.5, "right", "Play games in the browser"),
            (ASSETS / "real-home.png", 3.5, "in", "Subscribe · Play the web"),
        ],
        promo_music,
        audio_start=8.0,
    )

    build(
        "Beta_Tutorial",
        [
            (ASSETS / "real-home.png", 4.0, "in", "Step 1  Open TomasekPlays web"),
            (ASSETS / "real-beta.png", 4.5, "left", "Step 2  Press Try Beta mode"),
            (ASSETS / "real-codes.png", 6.0, "out", "Step 3  Beta code  148"),
            (ASSETS / "real-code.png", 4.0, "in", "Step 4  Type 148 · press Enter"),
            (ASSETS / "real-device.png", 4.0, "right", "Step 5  Choose PC or Mobile"),
            (ASSETS / "real-arcade.png", 5.0, "in", "Step 6  Pick a game and play"),
        ],
        tutorial_music,
        audio_start=5.0,
    )

    for f in TMP.glob("*"):
        f.unlink(missing_ok=True)
    if TMP.exists():
        TMP.rmdir()
    print("Done.")


if __name__ == "__main__":
    main()
