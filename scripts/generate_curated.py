#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'js' / 'products-data.js'
OUT = ROOT / 'js' / 'products-curated.js'

CATS = ["Wigs","Perfume","Body Lotion","Soap","Skin Care","Makeup","Accessories"]
ADJ = ["Silky","Premium","Deluxe","Essential","Signature","Classic","Radiant","Velvet","Luxe","Elegant"]
STYLES = {
  "Wigs": ["Lace Front","Deep Wave","Curly","Body Wave","Kinky Curly","Straight","Ombre","Bob","U-Part","HD Lace"],
  "Perfume": ["Eau de Parfum","Floral","Citrus","Woody","Amber","Fresh","Musk","Oriental","Gourmand","Marine"],
  "Body Lotion": ["Shea Butter","Cocoa Butter","Aloe Vera","Vitamin E","Nourishing","Hydrating","Soothing","Firming","Brightening","Repair"],
  "Soap": ["Charcoal","Exfoliating","Moisturizing","Brightening","Herbal","Antibacterial","Creamy","Shea","Oatmeal","Tea Tree"],
  "Skin Care": ["Vitamin C Serum","Hydrating Cream","Night Repair","Hyaluronic Gel","Brightening Toner","SPF Moisturizer","Clarifying Cleanser","Retinol Cream","Eye Serum","Essence"],
  "Makeup": ["Matte Lipstick","Glow Highlighter","Velvet Foundation","Brow Kit","Eyeliner Pen","Nude Palette","Blush Duo","Setting Spray","Tinted Balm","Mascara"],
  "Accessories": ["Wig Cap (2-Pack)","Edge Brush","Detangling Comb","Bonnet","Spray Bottle","Section Clips","Travel Case","Silk Scarf","Wide Tooth Comb","Edge Control"],
}
PRICE = {
  "Wigs": (39,129),
  "Perfume": (25,85),
  "Body Lotion": (12,28),
  "Soap": (6,18),
  "Skin Care": (15,45),
  "Makeup": (9,35),
  "Accessories": (5,25),
}

js = DATA.read_text(encoding='utf-8')
filenames = re.findall(r'"([A-Za-z0-9_\-]+\.(?:jpg|jpeg|png))"', js)

def price_for(cat, seed):
    lo, hi = PRICE.get(cat, (10, 50))
    span = hi - lo
    # deterministic but varied
    return f"{lo + (seed % (span+1)):.2f}"

items = []
for idx, fname in enumerate(filenames):
    cat = CATS[idx % len(CATS)]
    adj = ADJ[idx % len(ADJ)]
    style_list = STYLES.get(cat, ["Standard"])
    style = style_list[idx % len(style_list)]
    if cat == 'Wigs':
        name = f"{adj} {style} Wig"
    elif cat == 'Perfume':
        name = f"{adj} {style}"
    else:
        name = f"{adj} {style}"
    desc_by = {
        "Wigs": "Soft-touch fibers with natural movement and a breathable cap for all-day comfort.",
        "Perfume": "Refined fragrance with balanced top, heart and base notes for an elegant finish.",
        "Body Lotion": "Daily moisturizer that absorbs quickly and leaves skin silky and nourished.",
        "Soap": "Gentle cleansing formula suitable for everyday use leaving skin fresh and clean.",
        "Skin Care": "Targeted treatment formulated to support a healthy, glowing complexion.",
        "Makeup": "Beauty essential designed for smooth application and comfortable, lasting wear.",
        "Accessories": "Practical accessory to complement and elevate your beauty routine.",
    }
    desc = desc_by.get(cat, "Quality beauty essential.")
    price = price_for(cat, idx + 7)
    items.append({
        'filename': fname,
        'name': name,
        'category': cat,
        'description': desc,
        'price': price,
    })

# write compact one-line-per-item array to stay under 300 lines
lines = ["window.PRODUCTS_CURATED = [\n"]
for it in items:
    line = (
        '{filename: "' + it['filename'] + '", ' +
        'name: "' + it['name'].replace('"','\"') + '", ' +
        'category: "' + it['category'] + '", ' +
        'description: "' + it['description'].replace('"','\"') + '", ' +
        'price: "' + it['price'] + '"},\n'
    )
    lines.append(line)
lines.append("];}\n")
OUT.write_text(''.join(lines), encoding='utf-8')
print(f"Wrote {len(items)} curated items to {OUT}")

