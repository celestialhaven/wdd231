const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeBtn = document.querySelector(".close");

let scale = 1;

document.querySelectorAll(".preview").forEach(img => {
img.addEventListener("click", () => {
    lightbox.style.display = "block";
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.getAttribute("data-description") || img.alt;
    scale = 1;
    lightboxImg.style.transform = `scale(${scale})`;
});
});

closeBtn.addEventListener("click", () => {
lightbox.style.display = "none";
});

lightbox.addEventListener("click", (e) => {
if (e.target === lightbox) {
    lightbox.style.display = "none";
}
});

// Zoom on scroll
lightboxImg.addEventListener("wheel", (e) => {
e.preventDefault();
if (e.deltaY < 0) {
    scale += 0.1;
} else {
    scale = Math.max(1, scale - 0.1);
}
lightboxImg.style.transform = `scale(${scale})`;
});