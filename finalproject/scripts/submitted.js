/* =========================================================
   ACCESSIBLE BILLING TOGGLE (Monthly ↔ Annual)
   - Updates all price elements dynamically based on toggle state
   - Uses data attributes (data-month / data-year) for flexibility
   ========================================================= */

// Get references to the toggle switch and all price elements
const toggle = document.getElementById('billToggle');
const prices = document.querySelectorAll('#plansList .price');

/**
 * Updates the displayed price for each plan.
 * If the toggle is ON (checked), show yearly prices.
 * If OFF, show monthly prices.
 */
function updatePrices() {
  prices.forEach(p => {
    const monthly = p.getAttribute('data-month');
    const yearly  = p.getAttribute('data-year');

    // Defensive check: ensure both data attributes exist
    if (!monthly || !yearly) {
      console.warn('Missing data attributes on price element:', p);
      return;
    }

    // Toggle determines which value to display
    p.textContent = toggle.checked ? yearly : monthly;
  });
}

// Listen for toggle changes (user interaction)
toggle.addEventListener('change', updatePrices);

// Initialize prices on page load
updatePrices();
