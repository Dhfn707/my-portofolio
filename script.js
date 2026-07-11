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

// Close sidebar and smooth scroll when clicking a link
navLinksItems.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (targetId.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offset = navbar.offsetHeight;
        const targetPosition = targetElement.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// For logo as well
const logoLink = document.querySelector(".logo a");
if (logoLink) {
  logoLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Clear hash on refresh to prevent jumping to specific sections
if (window.location.hash) {
  window.history.replaceState(
    null,
    null,
    window.location.pathname + window.location.search,
  );
}

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

const projectContainer = document.querySelector(".project-container");
const certificateGrid = document.querySelector(".sertifikat-grid");

function renderProjectImages(images) {
  return images
    .map(
      (image, index) => `
                  <img
                    src="${image.src}"
                    alt="${image.alt}"
                    ${index === 0 ? 'class="active"' : ""}
                    loading="lazy"
                  />`,
    )
    .join("");
}

function renderProjectItem(project, index) {
  const isReverse = project.reverse ?? index % 2 === 1;

  return `
          <div class="project-item${isReverse ? " reverse" : ""}">
            ${isReverse ? "" : `
            <div class="project-image reveal reveal-left">
              <div class="slider-container custom-frame" data-slider-id="p${index + 1}">
                <div class="slider-wrapper">
${renderProjectImages(project.images)}
                </div>
                <div class="slider-click-area prev-area"></div>
                <div class="slider-click-area pause-area"></div>
                <div class="slider-click-area next-area"></div>
              </div>
            </div>`}
            <div class="project-timeline">
              <div class="line"></div>
              <div class="dot"></div>
              <div class="dot-bottom"></div>
            </div>
            <div class="project-text reveal ${isReverse ? "reveal-left" : "reveal-right"}">
              <h3>${project.title}</h3>
              <p class="year">${project.duration}</p>
              <p class="description">${project.description}</p>
              <h4>Teknologi</h4>
              <ul>
${project.technologies
  .map((technology) => `                <li>${technology}</li>`)
  .join("\n")}
              </ul>
            </div>
            ${isReverse ? `
            <div class="project-image reveal reveal-right">
              <div class="slider-container custom-frame" data-slider-id="p${index + 1}">
                <div class="slider-wrapper">
${renderProjectImages(project.images)}
                </div>
                <div class="slider-click-area prev-area"></div>
                <div class="slider-click-area pause-area"></div>
                <div class="slider-click-area next-area"></div>
              </div>
            </div>` : ""}
          </div>`;
}

function renderCertificateCard(certificate) {
  return `
        <div class="sertifikat-card open-sertif-modal" data-src="${certificate.source}" role="button" tabindex="0" aria-label="${certificate.ariaLabel}" onclick="window.openCertificateModal('${certificate.source}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); window.openCertificateModal('${certificate.source}');}">
          <div class="sertifikat-img-wrapper">
            <img
              src="${certificate.image}"
              oncontextmenu="return false;"
              alt="${certificate.title}"
              loading="lazy"
            />
          </div>
          <div class="sertifikat-content">
            <div class="sertifikat-meta">
              <span class="year">${certificate.year}</span>
              <span class="expiry">${certificate.expiry}</span>
            </div>
            <h3>${certificate.title}</h3>
            <p>${certificate.description}</p>
            <button class="btn-sertif" type="button">${certificate.buttonLabel}</button>
          </div>
        </div>`;
}

async function loadPortfolioData() {
  try {
    const [projectsResponse, certificatesResponse] = await Promise.all([
      fetch("./data/projects.json"),
      fetch("./data/certificates.json"),
    ]);

    if (projectsResponse.ok && certificatesResponse.ok) {
      const [projectsData, certificatesData] = await Promise.all([
        projectsResponse.json(),
        certificatesResponse.json(),
      ]);

      if (projectContainer) {
        projectContainer.innerHTML = projectsData.map(renderProjectItem).join("");
      }

      if (certificateGrid) {
        certificateGrid.innerHTML = certificatesData.map(renderCertificateCard).join("");
      }

      initializeSliders();
      window.dispatchEvent(new Event("load"));
      return;
    }
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
  }

  throw new Error("Portfolio data could not be loaded from JSON files.");
}

loadPortfolioData().catch((error) => {
  console.error("Failed to load portfolio data:", error);
});

// Sertifikat Modal Logic
const sertifModal = document.getElementById("sertifModal");
const sertifIframe = document.getElementById("sertifIframe");
const closeSertif = document.querySelector(".close-sertif");

function openCertificateModal(source) {
  if (!source) {
    return;
  }

  sertifIframe.src = source;
  sertifModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

window.openCertificateModal = openCertificateModal;

document.addEventListener("click", (event) => {
  const certificateTrigger = event.target.closest(".open-sertif-modal");
  if (!certificateTrigger) {
    return;
  }

  openCertificateModal(certificateTrigger.getAttribute("data-src"));
});

document.addEventListener("keydown", (event) => {
  const certificateTrigger = event.target.closest(".open-sertif-modal");
  if (!certificateTrigger) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openCertificateModal(certificateTrigger.getAttribute("data-src"));
  }
});

if (closeSertif) {
  closeSertif.addEventListener("click", () => {
    sertifModal.classList.remove("show");
    sertifIframe.src = "";
    document.body.style.overflow = "auto";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === sertifModal) {
    sertifModal.classList.remove("show");
    sertifIframe.src = "";
    document.body.style.overflow = "auto";
  }
});

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
function initializeSliders() {
  const sliders = document.querySelectorAll(".slider-container");

  sliders.forEach((slider) => {
    const wrapper = slider.querySelector(".slider-wrapper");
    if (!wrapper) {
      return;
    }

    const items = wrapper.querySelectorAll("img, .img-content, .img-placeholder");
    const prevBtn = slider.querySelector(".slider-btn.prev");
    const nextBtn = slider.querySelector(".slider-btn.next");

    slider.addEventListener("click", (event) => {
      const clickedImage = event.target.closest("img");
      if (clickedImage && wrapper.contains(clickedImage)) {
        openImageModal(clickedImage.src);
      }
    });

    if (items.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";

      items.forEach((item) => {
        item.classList.add("active");
      });
      return;
    }

    let currentIndex = 0;
    let autoSlideInterval;
    let isPaused = false;

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
      }, 5000);
    }

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
        const currentImg = items[currentIndex];
        if (currentImg.tagName === "IMG") {
          openImageModal(currentImg.src);
        } else {
          const nestedImg = currentImg.querySelector("img");
          if (nestedImg) openImageModal(nestedImg.src);
        }
      });
    }

    startAutoSlide();
  });
}
