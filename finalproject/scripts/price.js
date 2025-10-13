// Accessible Monthly/Annual toggle – updates prices using data attributes
  const toggle = document.getElementById('billToggle');
  const prices = document.querySelectorAll('#plansList .price');

  function updatePrices(){
    prices.forEach(p => {
      const monthly = p.getAttribute('data-month');
      const yearly  = p.getAttribute('data-year');
      p.textContent = toggle.checked ? yearly : monthly;
    });
  }
  toggle.addEventListener('change', updatePrices);
  // initialize
  updatePrices();