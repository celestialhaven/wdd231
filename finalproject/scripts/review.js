/* =========================================================
   REVIEW SUBMISSION COUNTER
   - Tracks and displays how many reviews a user has submitted
   - Uses sessionStorage to detect a new submission event
   - Uses localStorage to persist the total review count across sessions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Check if the user just submitted a review (set by a previous page or script)
  const justSubmitted = sessionStorage.getItem("justSubmitted");

  // Define a consistent key for localStorage
  const key = "reviewCount";

  // Case 1: User has just submitted a new review
  if (justSubmitted === "true") {
    // Retrieve the current count and increment by 1
    let count = localStorage.getItem(key);
    count = count ? parseInt(count, 10) + 1 : 1;

    // Save the updated count
    localStorage.setItem(key, count);

    // Remove the session flag so refreshing doesn’t double-count
    sessionStorage.removeItem("justSubmitted");

    // Update the review count display text on the page
    const countDisplay = document.getElementById("reviewCount");
    if (countDisplay) {
      countDisplay.textContent = `You have submitted ${count} review${count === 1 ? "" : "s"}.`;
    }

  // Case 2: User simply visits the page (no new submission)
  } else {
    // Get existing count (default to 0 if none found)
    const count = parseInt(localStorage.getItem(key), 10) || 0;

    // Update display without incrementing
    const countDisplay = document.getElementById("reviewCount");
    if (countDisplay) {
      countDisplay.textContent = `You have submitted ${count} review${count === 1 ? "" : "s"}.`;
    }
  }
});
