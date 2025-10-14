/* =========================================================
   BILLING TOGGLE SCRIPT (Monthly ↔ Annual)
   ---------------------------------------------------------
   • Dynamically updates pricing text based on toggle state.
   • Uses data attributes (data-month / data-year) for flexibility.
   • Includes safety checks to avoid errors on pages without pricing UI.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // 🔍 Get references to the billing toggle switch and all price elements
  const toggle  = document.getElementById('billToggle');
  const prices  = document.querySelectorAll('#plansList .price');

  // 🛑 If this page doesn’t have the toggle or price elements, stop the script
  if (!toggle || prices.length === 0) return;

  /**
   * Updates the displayed prices for all pricing plan cards.
   * - If the toggle is ON (checked), shows yearly prices.
   * - If the toggle is OFF, shows monthly prices.
   */
  function updatePrices() {
    prices.forEach(p => {
      // Retrieve the stored monthly and yearly values from data attributes
      const monthly = p.getAttribute('data-month');
      const yearly  = p.getAttribute('data-year');

      // ⚠️ Defensive check: warn if attributes are missing to help debugging
      if (!monthly || !yearly) {
        console.warn('Missing data-month or data-year attribute on:', p);
        return;
      }

      // ✅ Set the text based on toggle state (checked = yearly)
      p.textContent = toggle.checked ? yearly : monthly;
    });
  }

  // 🎧 When user changes the toggle, update all visible prices
  toggle.addEventListener('change', updatePrices);

  // 🟢 Initialize displayed prices on page load
  updatePrices();
});
