const BASE = "https://dummyjson.com";
export async function getProductById(id) {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}




const container = document.getElementById("product-detail");
const loading   = document.getElementById("detail-loading");
const errorEl   = document.getElementById("detail-error");

// read ?id= from URL
function getIdFromUrl() {
  const params = new URLSearchParams(location.search);
  return params.get("id");
}

// simple gallery HTML (main image + 0..4 thumbnails)
function gallery(images = []) {
  const main = images[0] || "";
  const thumbs = images.slice(0, 4).map((src, i) => `
    <img data-idx="${i}" src="${src}" alt="Product image ${i + 1}"
         class="thumb">
  `).join("");
  return `
    <div>
      <img id="mainImage" class="product-detail__image" src="${main}" alt="Product image">
      <div class="thumbs">${thumbs}</div>
    </div>
  `;
}

async function init() {
  const id = getIdFromUrl();
  if (!id) {
    loading.classList.add("sr-only");
    errorEl.textContent = "No product ID provided.";
    errorEl.classList.remove("sr-only");
    errorEl.setAttribute("aria-hidden", "false");
    return;
  }

  try {
    const p = await getProductById(id);

    container.innerHTML = `
      ${gallery(p.images || [])}
      <div>
        <h1>${p.title}</h1>
        <p class="muted">${p.brand ? `${p.brand} — ` : ""}${p.category ?? ""}</p>
        <p>${p.description}</p>
        <p><strong>Price:</strong> $${p.price} ${
          p.discountPercentage
            ? `<span class="deal">(-${p.discountPercentage}% off)</span>`
            : ""
        }</p>
        ${p.rating ? `<p><strong>Rating:</strong> ${p.rating}</p>` : ""}
        ${p.stock !== undefined ? `<p><strong>In stock:</strong> ${p.stock}</p>` : ""}
        <button class="btn btn--primary" type="button">Add to cart</button>
      </div>
    `;

    // wire thumbnail switching
    const mainImg = document.getElementById("mainImage");
    container.querySelectorAll("[data-idx]").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        mainImg.src = thumb.getAttribute("src");
      });
    });




    loading.classList.add("sr-only");
  } catch (err) {
    loading.classList.add("sr-only");
    errorEl.textContent = "Failed to load product. Please try again.";
    errorEl.classList.remove("sr-only");
    errorEl.setAttribute("aria-hidden", "false");
    console.error(err);
  }
}

init();

// after container.innerHTML = `...` and wiring thumbs
if (loading) {
  loading.hidden = true;              // visually gone
  loading.classList.add("sr-only");   // a11y hidden too
}

if (errorEl) {
  errorEl.classList.add("sr-only");
  errorEl.setAttribute("aria-hidden", "true");
}

