#!/usr/bin/env python3
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'js', 'products-curated.js')
DST = os.path.join(ROOT, 'data', 'products.json')

with open(SRC, 'r', encoding='utf-8') as f:
    txt = f.read()

# Extract the array from window.PRODUCTS_CURATED = [ ... ];
match = re.search(r"PRODUCTS_CURATED\s*=\s*(\[.*\])\s*;?\s*$", txt, re.S | re.M)
if not match:
    raise SystemExit('Could not find PRODUCTS_CURATED array in %s' % SRC)

arr_src = match.group(1)
# Convert JS object keys to JSON by quoting identifiers
arr_src_jsonish = re.sub(r'(\{|,)\s*([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1 "\2":', arr_src)
# Remove trailing commas that are valid in JS but not JSON
arr_src_jsonish = re.sub(r',\s*\]', ']', arr_src_jsonish)
arr_src_jsonish = re.sub(r',\s*\}', '}', arr_src_jsonish)
arr = json.loads(arr_src_jsonish)

out = {"products": arr}
os.makedirs(os.path.dirname(DST), exist_ok=True)
with open(DST, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print('Wrote %d products to %s' % (len(arr), DST))

