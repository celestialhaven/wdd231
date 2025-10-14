/* =========================================================
   ACCESSIBLE BILLING TOGGLE (Monthly ↔ Annual)
   - Dynamically updates displayed plan prices using data attributes
   - Uses a checkbox toggle (id="billToggle") to switch price display
   ========================================================= */

// Get references to the billing toggle and all price elements
const toggle = document.getElementById('billToggle');
const prices = document.querySelectorAll('#plansList .price');

/**
 * Updates the text content of each price element
 * based on the toggle state (checked = yearly, unchecked = monthly)
 */
function updatePrices() {
  prices.forEach(priceEl => {
    const monthly = priceEl.getAttribute('data-month'); // Monthly price value
    const yearly  = priceEl.getAttribute('data-year');  // Yearly price value

    // Defensive check: warn if a price element lacks required attributes
    if (!monthly || !yearly) {
      console.warn('Missing data-month or data-year attribute on:', priceEl);
      return;
    }

    // Update price display according to toggle state
    priceEl.textContent = toggle.checked ? yearly : monthly;
  });
}

// Recalculate prices whenever the toggle state changes
toggle.addEventListener('change', updatePrices);

// Initialize the displayed prices on page load
updatePrices();
