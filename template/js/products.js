(function () {
  // Categories for Femme Essentials catalog
  var CATEGORIES = ["Wigs", "Perfumes", "Skin Care", "Makeup", "Accessories"];

  function buildProducts() {
    var products = PRODUCTS_FILENAMES.map(function (fname, idx) {
      var cat = CATEGORIES[idx % CATEGORIES.length];
      var name = cat + " " + (idx + 1);
      var desc = "Curated " + cat.toLowerCase() + " from Femme Essentials.";
      return {
        id: idx,
        name: name,
        category: cat,
        description: desc,
        image: "../shared_images_optimized/thumbs/" + fname,
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
      if (e.target && e.target.dataset.category) {
        onFilter(e.target.dataset.category);
      }
    });
  }

  function productCardHtml(p) {
    return '\n<div class="col-sm-6 col-md-4 col-lg-3 mb-4">\n  <div class="card h-100 shadow-sm">\n    <img src="' + p.image + '" class="card-img-top" alt="' + p.name + '">\n    <div class="card-body d-flex flex-column">\n      <h6 class="text-primary text-uppercase mb-1">' + p.category + '</h6>\n      <h5 class="card-title">' + p.name + '</h5>\n      <p class="card-text small flex-grow-1">' + p.description + '</p>\n      <a href="product-detail.html?id=' + p.id + '" class="btn btn-primary mt-2">View Details</a>\n    </div>\n  </div>\n</div>';
  }

  function renderGrid(containerId, products) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = products.map(productCardHtml).join('');
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
    container.innerHTML = '\n<div class="row g-4">\n  <div class="col-md-6">\n    <img src="' + p.image + '" alt="' + p.name + '" class="img-fluid rounded shadow"/>\n  </div>\n  <div class="col-md-6">\n    <h6 class="text-primary text-uppercase">' + p.category + '</h6>\n    <h2 class="mb-3">' + p.name + '</h2>\n    <p class="mb-4">' + p.description + ' High-quality product imagery shown. For pricing and availability, contact Femme Essentials.</p>\n    <a href="products.html" class="btn btn-dark me-2">Back to Products</a>\n  </div>\n</div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('product-grid')) initCatalog();
    if (document.getElementById('product-detail')) initDetail();
  });
})();

