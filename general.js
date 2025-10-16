import { getProducts } from "./api.js";



/* Slider logic */
const slider = document.querySelector(".slider");
const slides = [...slider.querySelectorAll(".slide")];
const prevBtn = slider.querySelector(".slider__control--prev");
const nextBtn = slider.querySelector(".slider__control--next");
let index = 0, timer;

function showSlide(i) {
  slides.forEach((s, k) => {
    s.classList.toggle("slide--active", k === i);
    s.setAttribute("aria-hidden", k === i ? "false" : "true");
  });
  index = i;
}
const nextSlide = () => showSlide((index + 1) % slides.length);
const prevSlide = () => showSlide((index - 1 + slides.length) % slides.length);
const autoplay = () => { timer = setInterval(nextSlide, 4000); };
const restart = () => { clearInterval(timer); autoplay(); };

prevBtn.addEventListener("click", () => { prevSlide(); restart(); });
nextBtn.addEventListener("click", () => { nextSlide(); restart(); });
autoplay();

/* Frequently Sold section */
const grid = document.getElementById("popular-grid");
const loading = document.getElementById("popular-loading");
const errorEl = document.getElementById("popular-error");

async function loadPopular() {
  try {
    const data = await getProducts({ limit: 0 });
    const items = (data.products || [])
      .slice()
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 12);

    grid.innerHTML = items.map(p => `
      <article class="card product-card">
        <a class="product-card__link" href="product-details.html?id=${p.id}">
          <img class="product-card__image" src="${p.thumbnail || (p.images?.[0] ?? '')}" alt="${p.title}" loading="lazy">
          <div class="product-card__body">
            <h3 class="product-card__title">${p.title}</h3>
            <p class="product-card__price">$${p.price}</p>
          </div>
        </a>
      </article>
    `).join("");

    loading.classList.add("sr-only");
  } catch (err) {
    loading.classList.add("sr-only");
    errorEl.textContent = "Failed to load products. Please try again later.";
    errorEl.classList.remove("sr-only");
    console.error(err);
  }
}
loadPopular();

if (loading) {
  loading.hidden = true;              // visually gone
  loading.classList.add("sr-only");   // a11y hidden too
}

if (errorEl) {
  errorEl.classList.add("sr-only");
  errorEl.setAttribute("aria-hidden", "true");
}

