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
