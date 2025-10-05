(function () {
  // Load Decap-managed JSON if available; otherwise leave existing globals as-is
  function applyData(data) {
    var arr = Array.isArray(data) ? data : (data && Array.isArray(data.products) ? data.products : null);
    if (arr && arr.length) {
      window.PRODUCTS_CURATED = arr;
      document.dispatchEvent(new Event('products-loaded'));
    }
  }
  try {
    fetch('data/products.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(applyData)
      .catch(function () { /* keep fallback js/products-curated.js */ });
  } catch (e) {
    // Older browsers: ignore
  }
})();

