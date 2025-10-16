import { getProducts } from "./api.js";



// DOM refs
const listEl   = document.getElementById("product-list");
const loading  = document.getElementById("list-loading");
const errorEl  = document.getElementById("list-error");
const sortSel  = document.getElementById("sort");
const catSel   = document.getElementById("category-filter");

let productsCache = [];

// Render product cards
function render(items) {
  listEl.innerHTML = items.map(p => `
    <article class="card product-card">
      <a class="product-card__link" href="product.html?id=${p.id}">
        <img class="product-card__image" src="${p.thumbnail || (p.images?.[0] ?? '')}" alt="${p.title}" loading="lazy">
        <div class="product-card__body">
          <h3 class="product-card__title">${p.title}</h3>
          <p class="product-card__price">$${p.price}</p>
        </div>
      </a>
    </article>
  `).join("");
}

// Fetch categories as STRINGS and populate <select>
async function loadCategories() {
  try {
    const res = await fetch("https://dummyjson.com/products/category-list");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const cats = await res.json(); // ["smartphones","laptops",...]

    // Build options and append (skip "all" which is already there)
    const opts = cats.map(c => {
      const label = c.charAt(0).toUpperCase() + c.slice(1);
      return `<option value="${c}">${label}</option>`;
    }).join("");
    catSel.insertAdjacentHTML("beforeend", opts);
  } catch (err) {
    console.error("Failed to load categories:", err);
    // Non-blocking: leave the filter with only "All Categories"
  }
}

// Apply current filters/sort to the cache and re-render
function applyView() {
  const selected = catSel.value;
  const sortBy   = sortSel.value;

  // Filter
  let view = selected === "all"
    ? [...productsCache]
    : productsCache.filter(p => p.category === selected);

  // Sort
  if (sortBy === "price-asc")   view.sort((a,b) => a.price - b.price);
  if (sortBy === "price-desc")  view.sort((a,b) => b.price - a.price);
  if (sortBy === "rating-desc") view.sort((a,b) => (b.rating ?? 0) - (a.rating ?? 0));

  render(view);
}

// Init page
async function init() {
  try {
    // Load products
    const data = await getProducts({ limit: 100 });
    productsCache = data.products || [];
    // Populate categories
    await loadCategories();
    // Initial render
    applyView();
    loading.classList.add("sr-only");
  } catch (err) {
    loading.classList.add("sr-only");
    errorEl.textContent = "Failed to load products. Please refresh.";
    errorEl.classList.remove("sr-only");
    errorEl.setAttribute("aria-hidden", "false");
    console.error(err);
  }
}

// Listeners
sortSel.addEventListener("change", applyView);
catSel.addEventListener("change", applyView);

// Go
init();


