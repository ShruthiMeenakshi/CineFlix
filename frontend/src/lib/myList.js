const FAV_KEY = 'movieshere:favorites';
const WISH_KEY = 'movieshere:wishlist';

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function write(key, arr) {
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) {
    // ignore
  }
}

function normalize(movie) {
  if (!movie) return null;
  const id = movie.imdbID || movie.imdbId || movie.id || movie.imdb || (movie.poster ? encodeURIComponent(movie.poster) : null);
  return {
    id,
    title: movie.Title || movie.title || 'Untitled',
    poster: movie.Poster || movie.poster || movie.image || '',
    year: movie.Year || movie.year || '',
    type: movie.Type || movie.type || '',
  };
}

export function getFavorites() { return read(FAV_KEY); }
export function getWishlist() { return read(WISH_KEY); }

export function isFavorite(id) { if (!id) return false; return read(FAV_KEY).some(i => i.id === id); }
export function isWishlisted(id) { if (!id) return false; return read(WISH_KEY).some(i => i.id === id); }

export function addFavorite(movie) {
  const m = normalize(movie); if (!m || !m.id) return;
  const cur = read(FAV_KEY).filter(x => x.id !== m.id);
  cur.unshift(m);
  write(FAV_KEY, cur);
}

export function removeFavorite(id) {
  if (!id) return;
  const cur = read(FAV_KEY).filter(x => x.id !== id);
  write(FAV_KEY, cur);
}

export function toggleFavorite(movie) {
  const m = normalize(movie); if (!m || !m.id) return;
  if (isFavorite(m.id)) removeFavorite(m.id); else addFavorite(m);
}

export function addWishlist(movie) {
  const m = normalize(movie); if (!m || !m.id) return;
  const cur = read(WISH_KEY).filter(x => x.id !== m.id);
  cur.unshift(m);
  write(WISH_KEY, cur);
}

export function removeWishlist(id) {
  if (!id) return;
  const cur = read(WISH_KEY).filter(x => x.id !== id);
  write(WISH_KEY, cur);
}

export function toggleWishlist(movie) {
  const m = normalize(movie); if (!m || !m.id) return;
  if (isWishlisted(m.id)) removeWishlist(m.id); else addWishlist(m);
}
