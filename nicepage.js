<script>
(function(){
  // Use the header with id="header" as primary target (exists in your index.html)
  var header = document.getElementById('header') || document.querySelector('header.u-header') || document.querySelector('.u-header');

  if (!header) {
    console.warn('Shrink-header script: header element not found.');
    return;
  }

  // Convert CSS var value like "100px" to integer px
  function getCssPx(varName, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(varName);
    if (!v) return fallback;
    var m = v.match(/(-?\d+\.?\d*)/);
    return m ? parseFloat(m[0]) : fallback;
  }

  function px(n){ return Math.round(n) + 'px'; }

  // Apply correct body spacing to avoid content overlap
  function updateSpacing(){
    // header.offsetHeight is reliable (accounts for padding/border)
    var h = header.offsetHeight || getCssPx('--header-full', 100);
    document.body.style.paddingTop = px(h);
    document.documentElement.style.scrollPaddingTop = px(h);
  }

  // shrink threshold (how many pixels scrolled before shrinking)
  var threshold = 60;

  // prefer passive listeners for better scrolling performance
  function onScroll(){
    if (window.scrollY > threshold) {
      if (!header.classList.contains('small')) header.classList.add('small');
    } else {
      if (header.classList.contains('small')) header.classList.remove('small');
    }
    updateSpacing();
  }

  // Recalculate spacing when header size changes (logo load, menu change)
  function initObservers(){
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function(){ updateSpacing(); });
      ro.observe(header);
    } else {
      // fallback on window resize
      window.addEventListener('resize', updateSpacing);
    }
  }

  // Run when DOM is ready (if script is in footer this will run immediately)
  function init(){
    // Ensure initial values from CSS variables are applied to header height
    var root = getComputedStyle(document.documentElement);
    var cssFull = root.getPropertyValue('--header-full').trim();
    if (!cssFull) {
      // if CSS variable missing, set using offsetHeight as baseline
      document.documentElement.style.setProperty('--header-full', header.offsetHeight + 'px');
    }
    // initial spacing
    updateSpacing();
    // start observing scroll + size changes
    window.addEventListener('scroll', onScroll, {passive:true});
    initObservers();
    // run on load in case page loaded scrolled or assets changed layout
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
