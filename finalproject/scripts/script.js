/* =========================================================
   IMAGE LIGHTBOX WITH ZOOM
   - Displays a larger version of clicked thumbnails (.preview)
   - Includes caption, close button, and zoom functionality via mouse wheel
   - Closes when user clicks outside the image or on the close button
   ========================================================= */

// Cache key DOM elements
const lightbox        = document.getElementById("lightbox");
const lightboxImg     = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeBtn        = document.querySelector(".close");

// Initialize zoom scale
let scale = 1;

/* ---------------------------------------------------------
   OPEN LIGHTBOX
   - When a thumbnail (class="preview") is clicked:
     → Shows the lightbox
     → Loads the image and caption
     → Resets zoom level
--------------------------------------------------------- */
document.querySelectorAll(".preview").forEach(img => {
  img.addEventListener("click", () => {
    lightbox.style.display = "block"; // Show lightbox
    lightboxImg.src = img.src;        // Set large image source
    lightboxImg.alt = img.alt;        // Copy alt text for accessibility

    // Prefer data-description attribute; fallback to alt text
    lightboxCaption.textContent = img.getAttribute("data-description") || img.alt;

    // Reset zoom level each time a new image is opened
    scale = 1;
    lightboxImg.style.transform = `scale(${scale})`;
  });
});

/* ---------------------------------------------------------
   CLOSE LIGHTBOX
   - Closes when user clicks the "X" button
--------------------------------------------------------- */
closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

/* ---------------------------------------------------------
   CLOSE ON BACKDROP CLICK
   - Closes lightbox when clicking outside the image area
--------------------------------------------------------- */
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
});

/* ---------------------------------------------------------
   ZOOM FUNCTIONALITY (scroll up/down)
   - Scroll up (wheel up) → zoom in
   - Scroll down (wheel down) → zoom out
   - Zoom cannot go below 1x
--------------------------------------------------------- */
lightboxImg.addEventListener("wheel", (e) => {
  e.preventDefault(); // Prevent page scroll during zoom

  if (e.deltaY < 0) {
    scale += 0.1; // Zoom in
  } else {
    scale = Math.max(1, scale - 0.1); // Zoom out, minimum scale = 1
  }

  lightboxImg.style.transform = `scale(${scale})`;
});
