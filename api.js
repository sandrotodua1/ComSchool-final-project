const BASE = "https://dummyjson.com";

export async function getProducts({ limit = 24, skip = 0 } = {}) {
  const res = await fetch(`${BASE}/products?limit=${encodeURIComponent(limit)}&skip=${encodeURIComponent(skip)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json(); // { products, total, limit, skip }
}
