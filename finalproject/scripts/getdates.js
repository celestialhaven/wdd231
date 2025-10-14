/* =========================================================
   FOOTER DATE HANDLER
   - Automatically updates the current year and last modified date
   - Ensures elements exist before attempting to modify content
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Get the current year (e.g., 2025)
  const currentYear = new Date().getFullYear();

  // Locate the element that displays the current year
  const yearElement = document.getElementById("currentyear");
  if (yearElement) {
    // Insert the current year with a leading space (for formatting)
    yearElement.textContent = ` ${currentYear}`;
  }

  // Retrieve the document's last modified date/time string
  const lastModified = document.lastModified;

  // Locate the element that displays the last modified info
  const modifiedElement = document.getElementById("lastModified");
  if (modifiedElement) {
    // Insert formatted last modified date
    modifiedElement.textContent = `Last Modified: ${lastModified}`;
  }
});
