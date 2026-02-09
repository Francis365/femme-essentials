const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/Users/francis/Documents/augment-projects/femme-essentials/data/products.json', 'utf8'));

// Filter for invalid products (missing price_ngn or having low 'price' which is typical for placeholders)
const invalidProducts = data.products.filter(p => !p.price_ngn && parseFloat(p.price) < 130);

let content = '# Product Audit Report\n\n';
content += 'Found ' + invalidProducts.length + ' products with placeholder names/prices (likely generated).\n\n';
content += '| Image Filename | Current Name | Current Price | Description |\n';
content += '|---|---|---|---|\n';

invalidProducts.forEach(p => {
    content += '| `' + p.filename + '` | ' + p.name + ' | ' + (p.price || 'N/A') + ' | ' + (p.description || '') + ' |\n';
});

console.log(content);
