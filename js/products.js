(function () {
  // Display-only catalog configuration
  var CONTACT_EMAIL = "info@femme-essentials.com";
  var CONTACT_PHONE = "+2348036114891";

  // Currency config
  var NAIRA_PER_USD = 1500; // Change if you want a different rate
  function formatNaira(usdAmount) {
    var n = Math.round(parseFloat(usdAmount || 0) * NAIRA_PER_USD);
    return '₦' + n.toLocaleString('en-NG');
  }

  // Expanded categories
  var CATEGORIES = ["Wigs", "Perfume", "Body Lotion", "Soap", "Skin Care", "Makeup", "Accessories"];

  function priceFor(category, seed) {
    var ranges = {
      "Wigs": [39, 129],
      "Perfume": [25, 85],
      "Body Lotion": [12, 28],
      "Soap": [6, 18],
      "Skin Care": [15, 45],
      "Makeup": [9, 35],
      "Accessories": [5, 25]
    };
    var r = ranges[category] || [10, 50];
    var span = r[1] - r[0];
    return (r[0] + (seed % (span + 1))).toFixed(2);
  }

  function nameAndDescription(category, idx) {
    var adjectives = ["Silky", "Premium", "Deluxe", "Essential", "Signature", "Classic", "Radiant"];
    var styleByCat = {
      "Wigs": ["Lace Front", "Deep Wave", "Curly", "Body Wave", "Kinky Curly", "Straight", "Ombre"],
      "Perfume": ["Eau de Parfum", "Floral", "Citrus", "Woody", "Amber", "Fresh", "Musk"],
      "Body Lotion": ["Shea Butter", "Cocoa Butter", "Aloe Vera", "Vitamin E", "Nourishing", "Hydrating", "Soothing"],
      "Soap": ["Charcoal", "Exfoliating", "Moisturizing", "Brightening", "Herbal", "Antibacterial", "Creamy"],
      "Skin Care": ["Vitamin C Serum", "Hydrating Cream", "Night Repair", "Hyaluronic Gel", "Brightening Toner", "SPF Moisturizer", "Clarifying Cleanser"],
      "Makeup": ["Matte Lipstick", "Glow Highlighter", "Velvet Foundation", "Brow Kit", "Eyeliner Pen", "Nude Palette", "Blush Duo"],
      "Accessories": ["Wig Cap (2-Pack)", "Edge Brush", "Detangling Comb", "Bonnet", "Spray Bottle", "Section Clips", "Travel Case"]
    };
    var adj = adjectives[idx % adjectives.length];
    var styles = styleByCat[category] || ["Standard"];
    var style = styles[idx % styles.length];

    var name = (category === "Wigs")
      ? adj + " " + style + " Wig"
      : (category === "Perfume")
        ? adj + " " + style
        : adj + " " + style;

    var descByCat = {
      "Wigs": "Soft-touch fibers with natural movement and secure comfort fit.",
      "Perfume": "Refined fragrance with balanced top, heart and base notes.",
      "Body Lotion": "Daily moisturizer that absorbs quickly and leaves skin silky.",
      "Soap": "Gentle cleansing formula suitable for everyday use.",
      "Skin Care": "Targeted treatment formulated for healthy, glowing skin.",
      "Makeup": "Beauty essential designed for smooth application and lasting wear.",
      "Accessories": "Handy accessory to complement your beauty routine."
    };

    return { name: name, description: descByCat[category] };
  }

  function buildFromCurated() {
    if (!window.PRODUCTS_CURATED || !Array.isArray(window.PRODUCTS_CURATED) || !window.PRODUCTS_CURATED.length) return null;
    return window.PRODUCTS_CURATED.map(function (c, idx) {
      // Support either an uploaded image path (c.image) or a plain filename (c.filename)
      var rawPath = '';
      if (c && c.image) rawPath = String(c.image);
      else if (c && c.filename) rawPath = String(c.filename);
      var fname = rawPath;
      if (fname.indexOf('/') !== -1) fname = fname.split('/').pop();
      return {
        id: idx,
        name: c.name,
        category: c.category,
        description: c.description,
        priceUsd: parseFloat(c.price),
        image: "shared_images_optimized/full/" + fname,
        thumb: "shared_images_optimized/thumbs/" + fname,
        // If optimized images are not present yet, fall back to original uploaded path
        fallback: (function (r) { if (!r) return ''; if (r.indexOf('/') !== -1) return r.replace(/^\/+/, ''); return 'shared_images/' + r; })(rawPath),
        filename: fname
      };
    });
  }

  function buildProducts() {
    var curated = buildFromCurated();
    if (curated) return curated;
    var products = PRODUCTS_FILENAMES.map(function (fname, idx) {
      var cat = CATEGORIES[idx % CATEGORIES.length];
      var nd = nameAndDescription(cat, idx);
      return {
        id: idx,
        name: nd.name,
        category: cat,
        description: nd.description,
        priceUsd: parseFloat(priceFor(cat, idx + 7)),
        image: "shared_images_optimized/full/" + fname,
        thumb: "shared_images_optimized/thumbs/" + fname,
        filename: fname
      };
    });
    return products;
  }

  function renderFilters(containerId, categories, onFilter) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var allBtn = document.createElement('button');
    allBtn.className = 'btn btn-outline-primary me-2 mb-3';
    allBtn.textContent = 'All';
    allBtn.dataset.category = 'All';
    el.appendChild(allBtn);
    categories.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.className = 'btn btn-outline-primary me-2 mb-3';
      btn.textContent = cat;
      btn.dataset.category = cat;
      el.appendChild(btn);
    });
    el.addEventListener('click', function (e) {
      if (e.target && e.target.dataset && e.target.dataset.category) {
        onFilter(e.target.dataset.category);
      }
    });
  }

  function productCardHtml(p) {
    var primary = p.thumb || p.image;
    var fallback = p.fallback || ('shared_images/' + p.filename);
    var priceHtml = formatNaira(p.priceUsd);
    return '\n<div class="col-sm-6 col-md-4 col-lg-3 mb-4">\n  <div class="card h-100 shadow-sm">\n    <img src="' + primary + '" onerror="this.onerror=null;this.src=\'' + fallback + '\';" class="card-img-top" alt="' + p.name + '">\n    <div class="card-body d-flex flex-column">\n      <h6 class="text-primary text-uppercase mb-1">' + p.category + '</h6>\n      <h5 class="card-title">' + p.name + '</h5>\n      <div class="h5 text-dark mb-2">' + priceHtml + '</div>\n      <p class="card-text small flex-grow-1">' + p.description + '</p>\n      <a href="product-detail.html?id=' + p.id + '" class="btn btn-primary mt-auto">View Details</a>\n    </div>\n  </div>\n</div>';
  }

  function renderGrid(containerId, products) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = products.map(productCardHtml).join('');
  }

  function injectContactBanner() {
    var banner = document.getElementById('contact-banner');
    if (!banner) return;
    banner.innerHTML = '<div class="alert alert-info mb-4">' +
      '<strong>Contact to purchase:</strong> ' +
      '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> &nbsp;|&nbsp; ' +
      '<a href="tel:+2348036114891">' + CONTACT_PHONE + '</a>' +
      '</div>';
  }

  function initCatalog() {
    if (typeof PRODUCTS_FILENAMES === 'undefined') return;
    var products = buildProducts();
    var current = products.slice();
    renderFilters('product-filters', CATEGORIES, function (cat) {
      current = (cat === 'All') ? products.slice() : products.filter(function (p) { return p.category === cat; });
      renderGrid('product-grid', current);
    });
    renderGrid('product-grid', current);
    injectContactBanner();
    window.__PRODUCTS__ = products; // expose for detail page
  }

  function initDetail() {
    if (typeof PRODUCTS_FILENAMES === 'undefined') return;
    var products = buildProducts();
    window.__PRODUCTS__ = products;
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'), 10);
    var p = products.find(function (x) { return x.id === id; });
    if (!p) {
      document.getElementById('product-detail').innerHTML = '<p>Product not found.</p>';
      return;
    }
    var container = document.getElementById('product-detail');
    var fullSrc = p.image || ('shared_images_optimized/full/' + p.filename);
    var fallback = p.thumb || p.fallback || ('shared_images/' + p.filename);
    var priceHtml = formatNaira(p.priceUsd);
    container.innerHTML = '\n<div class="row g-4">\n  <div class="col-md-6">\n    <img src="' + fullSrc + '" onerror="this.onerror=null;this.src=\'' + fallback + '\';" alt="' + p.name + '" class="img-fluid rounded shadow product-detail-img"/>\n  </div>\n  <div class="col-md-6">\n    <h6 class="text-primary text-uppercase">' + p.category + '</h6>\n    <h2 class="mb-2">' + p.name + '</h2>\n    <div class="h4 text-dark mb-3">' + priceHtml + '</div>\n    <p class="mb-4">' + p.description + '</p>\n    <div class="mb-4 p-3 bg-light border rounded">\n      <strong>Contact to purchase:</strong> ' +
      '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> &nbsp;|&nbsp; ' +
      '<a href="tel:+2348036114891">' + CONTACT_PHONE + '</a>\n    </div>\n    <a href="products.html" class="btn btn-dark me-2">Back to Products</a>\n  </div>\n</div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('product-grid')) initCatalog();
    if (document.getElementById('product-detail')) initDetail();
  });

  document.addEventListener('products-loaded', function () {
    // Rehydrate catalog and detail when curated JSON loads
    if (document.getElementById('product-grid')) {
      var products = buildProducts();
      window.__PRODUCTS__ = products;
      renderGrid('product-grid', products);
    }
    if (document.getElementById('product-detail')) {
      initDetail();
    }
  });

})();

