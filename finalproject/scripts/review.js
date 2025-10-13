document.addEventListener("DOMContentLoaded", () => {
  const justSubmitted = sessionStorage.getItem("justSubmitted");

  if (justSubmitted === "true") {
    const key = 'reviewCount';
    let count = localStorage.getItem(key);
    count = count ? parseInt(count, 10) + 1 : 1;
    localStorage.setItem(key, count);
    sessionStorage.removeItem("justSubmitted"); // reset so refresh won't count

    const countDisplay = document.getElementById('reviewCount');
    if (countDisplay) {
      countDisplay.textContent = `You have submitted ${count} review${count === 1 ? '' : 's'}.`;
    }
  } else {
    // Just display the existing count without incrementing
    const count = localStorage.getItem("reviewCount") || 0;
    const countDisplay = document.getElementById('reviewCount');
    if (countDisplay) {
      countDisplay.textContent = `You have submitted ${count} review${count === "1" ? '' : 's'}.`;
    }
  }
});
