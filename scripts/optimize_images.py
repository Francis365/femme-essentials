#!/usr/bin/env python3
"""
Optimize images in shared_images/ into shared_images_optimized/{full,thumbs}
- Full: max width 1200px, quality 80
- Thumbs: max width 600px, quality 80
Re-encodes as progressive JPEGs.
Requires: Pillow
"""
import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'shared_images'
DST = ROOT / 'shared_images_optimized'
FULL = DST / 'full'
THUMBS = DST / 'thumbs'

MAX_FULL = 1200
MAX_THUMB = 600
QUALITY = 80

def ensure_dirs():
    FULL.mkdir(parents=True, exist_ok=True)
    THUMBS.mkdir(parents=True, exist_ok=True)


def process_one(src_path: Path):
    rel = src_path.name
    out_full = FULL / rel
    out_thumb = THUMBS / rel

    try:
        with Image.open(src_path) as im:
            im = im.convert('RGB')  # unify

            # full
            f = im.copy()
            if f.width > MAX_FULL:
                h = int(f.height * (MAX_FULL / float(f.width)))
                f = f.resize((MAX_FULL, h), Image.LANCZOS)
            f.save(out_full, format='JPEG', quality=QUALITY, optimize=True, progressive=True)

            # thumb
            t = im.copy()
            if t.width > MAX_THUMB:
                h = int(t.height * (MAX_THUMB / float(t.width)))
                t = t.resize((MAX_THUMB, h), Image.LANCZOS)
            t.save(out_thumb, format='JPEG', quality=QUALITY, optimize=True, progressive=True)

            return True
    except Exception as e:
        print(f"Failed {rel}: {e}")
        return False


def main():
    ensure_dirs()
    files = [p for p in SRC.iterdir() if p.suffix.lower() in {'.jpg', '.jpeg', '.png'}]
    print(f"Found {len(files)} images in {SRC}")
    ok = 0
    for p in files:
        if process_one(p):
            ok += 1
    print(f"Optimized {ok}/{len(files)} images -> {DST}")

if __name__ == '__main__':
    main()

