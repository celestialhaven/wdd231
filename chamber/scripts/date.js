document.addEventListener("DOMContentLoaded", function () {
  // current year
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("currentyear");
  if (yearElement) {
    yearElement.textContent = ` ${currentYear}`;
  }

  // last modified date of the document
  const lastModified = document.lastModified;
  const modifiedElement = document.getElementById("lastModified");
  if (modifiedElement) {
    modifiedElement.textContent = `Last Modified: ${lastModified}`;
  }
});