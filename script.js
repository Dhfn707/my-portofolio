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
    return;
  }

  let currentIndex = 0;
  let autoSlideInterval;

  function updateSlider(direction) {
    items.forEach((item, index) => {
      item.classList.remove("active", "prev-slide");
      
      if (index === currentIndex) {
        item.classList.add("active");
      } else if (direction === "next" && index === (currentIndex - 1 + items.length) % items.length) {
        item.classList.add("prev-slide");
      } else if (direction === "prev" && index === (currentIndex + 1) % items.length) {
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

  // Auto slide - 1.3 detik
  autoSlideInterval = setInterval(moveNext, 1300);

  // Manual Controls
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      clearInterval(autoSlideInterval);
      moveNext();
      autoSlideInterval = setInterval(moveNext, 1300);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      clearInterval(autoSlideInterval);
      movePrev();
      autoSlideInterval = setInterval(moveNext, 1300);
    });
  }
});
