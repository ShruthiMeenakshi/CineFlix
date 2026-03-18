const JSON_TTL_DEFAULT = 1000 * 60 * 60; // 1 hour
const JSON_PREFIX = 'mh:json:';

function buildKey(url) {
  return JSON_PREFIX + url;
}

export async function fetchJsonWithCache(url, ttl = JSON_TTL_DEFAULT) {
  try {
    const key = buildKey(url);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.ts && Date.now() - parsed.ts < ttl && parsed.value) {
        return parsed.value;
      }
    }
  } catch (e) {
    // ignore and fetch
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();
  try {
    localStorage.setItem(buildKey(url), JSON.stringify({ ts: Date.now(), value: data }));
  } catch (e) {
    // ignore storage errors
  }
  return data;
}

export async function cacheImage(url) {
  if (!('caches' in window)) {
    // fallback - create Image to warm browser cache
    const img = new Image(); img.src = url; return;
  }
  try {
    const cache = await caches.open('movieshere-images');
    const match = await cache.match(url);
    if (match) return; // already cached
    const res = await fetch(url, { mode: 'cors', cache: 'reload' });
    if (!res.ok) return;
    await cache.put(url, res.clone());
  } catch (e) {
    // best-effort
  }
}

export async function prefetchImages(urls=[]) {
  if (!Array.isArray(urls) || urls.length === 0) return;
  // launch parallel prefetches with limit
  const limit = 6;
  let i = 0;
  const runners = new Array(limit).fill(0).map(async () => {
    while (i < urls.length) {
      const idx = i++; // atomic-ish
      const u = urls[idx];
      if (u && typeof u === 'string' && !u.includes('N/A')) {
        // warm browser cache and CacheStorage
        try {
          const img = new Image(); img.src = u;
        } catch (e) {}
        // also put into cache storage
        try { await cacheImage(u); } catch (e) {}
      }
    }
  });
  await Promise.all(runners);
}

export function clearJsonCache(url) {
  try { localStorage.removeItem(buildKey(url)); } catch (e) {}
}
