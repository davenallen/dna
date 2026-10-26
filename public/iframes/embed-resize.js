(function () {
  function contentHeight() {
    var el = document.querySelector(".pricing-container, .container");
    if (!el) {
      return document.body ? document.body.offsetHeight : 0;
    }
    var pad = 0;
    if (document.body) {
      pad = parseFloat(window.getComputedStyle(document.body).paddingBottom) || 0;
    }
    return el.offsetTop + el.offsetHeight + pad + 12;
  }

  function report() {
    var height = contentHeight();
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { source: "dna-embed", height: Math.ceil(height) },
        "*"
      );
    }
  }

  function schedule() {
    window.requestAnimationFrame(report);
  }

  window.addEventListener("load", schedule);
  window.addEventListener("resize", schedule);

  if (window.ResizeObserver && document.body) {
    new ResizeObserver(schedule).observe(document.body);
  }

  window.setTimeout(schedule, 50);
  window.setTimeout(schedule, 400);
})();
