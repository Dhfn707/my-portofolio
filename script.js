const navbar = document.getElementById("navbar");

let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // scroll bawah
  if (currentScroll > lastScroll) {
    navbar.classList.add("hide");
  }

  // scroll atas
  else {
    navbar.classList.remove("hide");
  }

  lastScroll = currentScroll;
});

// Modal Logic
const modal = document.getElementById("cvModal");
const cvBtns = document.querySelectorAll(".btn");
const closeBtn = document.querySelector(".close-btn");

cvBtns.forEach((btn) => {
  if (btn.textContent === "Lihat CV") {
    btn.addEventListener("click", () => {
      modal.classList.add("show");
      document.body.style.overflow = "hidden"; // Prevent scroll when modal is open
    });
  }
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  document.body.style.overflow = "auto";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
  }
});

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");
const navLinksItems = document.querySelectorAll(".nav-links a");

// Hamburger Logic
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Close sidebar when clicking a link
navLinksItems.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
}

themeToggle.addEventListener("click", () => {
  let theme = document.documentElement.getAttribute("data-theme");
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});

// Scroll Reveal Animation
function reveal() {
  const reveals = document.querySelectorAll(".reveal");

  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const elementTop = reveals[i].getBoundingClientRect().top;
    const elementVisible = 150; // Jarak elemen muncul dari bawah viewport

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    }
  }
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal); // Jalankan saat page load pertama kali

// Image Modal Logic
const imgModal = document.getElementById("imageModal");
const imgModalContent = document.getElementById("imgFull");
const imgModalClose = document.querySelector(".image-modal-close");

function openImageModal(src) {
  imgModal.classList.add("active");
  imgModalContent.src = src;
  document.body.style.overflow = "hidden"; // Pause main scroll
}

imgModalClose.addEventListener("click", () => {
  imgModal.classList.remove("active");
  document.body.style.overflow = "auto";
});

window.addEventListener("click", (e) => {
  if (e.target === imgModal) {
    imgModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Multi-Slider Logic
const sliders = document.querySelectorAll(".slider-container");

sliders.forEach((slider) => {
  const wrapper = slider.querySelector(".slider-wrapper");
  const items = wrapper.querySelectorAll("img, .img-content, .img-placeholder");
  const prevBtn = slider.querySelector(".slider-btn.prev");
  const nextBtn = slider.querySelector(".slider-btn.next");

  if (items.length <= 1) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";

    // Even if single item, ensure it's visible and allow modal zoom
    items.forEach((item) => {
      item.classList.add("active");
      if (item.tagName === "IMG") {
        item.addEventListener("click", () => openImageModal(item.src));
      }
    });
    return;
  }

  let currentIndex = 0;
  let autoSlideInterval;
  let isPaused = false;

  // Initialize first slide
  updateSlider();

  function updateSlider(direction) {
    items.forEach((item, index) => {
      item.classList.remove("active", "prev-slide");

      if (index === currentIndex) {
        item.classList.add("active");
      } else if (
        direction === "next" &&
        index === (currentIndex - 1 + items.length) % items.length
      ) {
        item.classList.add("prev-slide");
      } else if (
        direction === "prev" &&
        index === (currentIndex + 1) % items.length
      ) {
        item.classList.add("prev-slide");
      }
    });
  }

  function moveNext() {
    currentIndex = (currentIndex + 1) % items.length;
    updateSlider("next");
  }

  function movePrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateSlider("prev");
  }

  function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      if (!isPaused) moveNext();
    }, 2300);
  }

  // Click Area Logic
  const nextArea = slider.querySelector(".next-area");
  const prevArea = slider.querySelector(".prev-area");
  const pauseArea = slider.querySelector(".pause-area");

  if (nextArea) {
    nextArea.addEventListener("click", () => {
      isPaused = false;
      moveNext();
    });
  }

  if (prevArea) {
    prevArea.addEventListener("click", () => {
      isPaused = false;
      movePrev();
    });
  }

  if (pauseArea) {
    pauseArea.addEventListener("click", () => {
      // Instead of Pause, now it opens MODAL ZOOM
      const currentImg = items[currentIndex];
      if (currentImg.tagName === "IMG") {
        openImageModal(currentImg.src);
      } else {
        // Fallback for placeholders or div contents
        const nestedImg = currentImg.querySelector("img");
        if (nestedImg) openImageModal(nestedImg.src);
      }
    });
  }

  startAutoSlide();
});
