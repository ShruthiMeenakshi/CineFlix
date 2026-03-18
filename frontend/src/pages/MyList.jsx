import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  getFavorites,
  getWishlist,
  removeFavorite,
  removeWishlist,
  addWishlist,
  addFavorite,
  clearFavorites,
  clearWishlist,
} from '../lib/myList';

export default function MyList() {
  const [favs, setFavs] = useState([]);
  const [wish, setWish] = useState([]);
  const [favFilter, setFavFilter] = useState('');
  const [wishFilter, setWishFilter] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFavs(getFavorites());
    setWish(getWishlist());
    const onStorage = () => { setFavs(getFavorites()); setWish(getWishlist()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function removeFromFav(id) { removeFavorite(id); setFavs(getFavorites()); }
  function removeFromWish(id) { removeWishlist(id); setWish(getWishlist()); }

  function moveToWishlist(item) {
    addWishlist(item);
    removeFavorite(item.id);
    setFavs(getFavorites());
    setWish(getWishlist());
    window.dispatchEvent(new Event('storage'));
  }

  function moveToFavorites(item) {
    addFavorite(item);
    removeWishlist(item.id);
    setFavs(getFavorites());
    setWish(getWishlist());
    window.dispatchEvent(new Event('storage'));
  }

  function handleClearFavorites() {
    if (!confirm('Clear all favourites?')) return;
    clearFavorites();
    setFavs(getFavorites());
    window.dispatchEvent(new Event('storage'));
  }

  function handleClearWishlist() {
    if (!confirm('Clear wishlist?')) return;
    clearWishlist();
    setWish(getWishlist());
    window.dispatchEvent(new Event('storage'));
  }

  function handleExport() {
    const payload = { favorites: getFavorites(), wishlist: getWishlist() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cineflix-mylist.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data.favorites)) {
          data.favorites.forEach(addFavorite);
        }
        if (Array.isArray(data.wishlist)) {
          data.wishlist.forEach(addWishlist);
        }
        setFavs(getFavorites());
        setWish(getWishlist());
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        alert('Failed to import file');
      }
    };
    reader.readAsText(f);
    e.target.value = '';
  }

  return (
    <>
      <nav className="fixed w-full z-50 bg-gradient-to-b from-black/60 to-transparent px-4 md:px-12 h-24 md:h-16 flex justify-between items-center">
        <div className="flex items-center">
          <a className="text-3xl font-bold text-movieshere-red" href="/">MOVIES<span className="text-white">HERE</span></a>
          <div className="hidden md:flex ml-8 space-x-6">
            <a className="hover:text-gray-300" href="/">Home</a>
            <a className="hover:text-gray-300" href="/tvshows">TV Shows</a>
            <a className="hover:text-gray-300" href="/movies">Movies</a>
            <a className="hover:text-gray-300" href="/news">New &amp; Popular</a>
            <a className="text-white font-semibold hover:text-gray-300" href="/list">My List</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block"><i className="fas fa-search hover:text-gray-300 cursor-pointer"></i></div>
          <div className="hidden md:block"><i className="fas fa-bell hover:text-gray-300 cursor-pointer"></i></div>
          <div className="flex items-center space-x-2 cursor-pointer group">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-8 h-8 rounded transition-transform duration-300 group-hover:ring-2 group-hover:ring-movieshere-red" />
            <i className="fas fa-caret-down hover:text-gray-300"></i>
          </div>
        </div>
      </nav>

      <div className="relative bg-movieshere-dark text-white min-h-screen px-4 md:px-12 pt-24 overflow-hidden">
        {/* Decorative blurred gradients */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-800 via-indigo-700 to-transparent opacity-40 rounded-full blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-40 right-[-10rem] w-[28rem] h-[28rem] bg-gradient-to-tr from-pink-700 via-red-600 to-transparent opacity-30 rounded-full blur-2xl"></div>

        <h1 className="text-3xl font-bold mb-6">My List</h1>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Favourites</h2>
          <div className="flex items-center space-x-2">
            <input value={favFilter} onChange={e=>setFavFilter(e.target.value)} placeholder="Filter favourites" className="px-3 py-1 rounded bg-black/20 text-sm" />
            <button onClick={handleClearFavorites} className="px-3 py-1 bg-red-600 rounded text-white text-sm">Clear</button>
            <button onClick={handleExport} className="px-3 py-1 bg-gray-700 rounded text-sm">Export</button>
            <button onClick={() => fileInputRef.current.click()} className="px-3 py-1 bg-gray-700 rounded text-sm">Import</button>
          </div>
        </div>
        {favs.length === 0 ? (
          <p className="text-gray-400">You have no favourites yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favs.filter(m => m.title.toLowerCase().includes(favFilter.toLowerCase())).map(m => (
              <div key={m.id} className="group relative rounded overflow-hidden bg-black/20">
                <img src={m.poster || 'https://via.placeholder.com/300x450?text=No+Poster'} alt={m.title} className="w-full h-56 object-cover" />
                <div className="absolute top-2 right-2 z-20 flex space-x-2">
                  <button onClick={() => { removeFromFav(m.id); }} className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 text-white" title="Remove"><i className="fas fa-times"></i></button>
                  <button onClick={() => moveToWishlist(m)} className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 text-white" title="Move to Wishlist"><i className="fas fa-bookmark"></i></button>
                </div>
                <div className="p-3">
                  <div className="font-semibold text-sm line-clamp-2">{m.title}</div>
                  <div className="text-xs text-gray-300 mt-1">{m.year}</div>
                  <div className="mt-3 flex space-x-2">
                    <Link to={`/movie/${encodeURIComponent(m.title)}`} className="px-3 py-1 bg-movieshere-red rounded text-sm">View</Link>
                    <button onClick={() => moveToWishlist(m)} className="px-3 py-1 bg-gray-700 rounded text-sm">Move to Wishlist</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Wishlist</h2>
          <div className="flex items-center space-x-2">
            <input value={wishFilter} onChange={e=>setWishFilter(e.target.value)} placeholder="Filter wishlist" className="px-3 py-1 rounded bg-black/20 text-sm" />
            <button onClick={handleClearWishlist} className="px-3 py-1 bg-red-600 rounded text-white text-sm">Clear</button>
            <button onClick={handleExport} className="px-3 py-1 bg-gray-700 rounded text-sm">Export</button>
            <button onClick={() => fileInputRef.current.click()} className="px-3 py-1 bg-gray-700 rounded text-sm">Import</button>
          </div>
        </div>
        {wish.length === 0 ? (
          <p className="text-gray-400">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {wish.filter(m => m.title.toLowerCase().includes(wishFilter.toLowerCase())).map(m => (
              <div key={m.id} className="group relative rounded overflow-hidden bg-black/20">
                <img src={m.poster || 'https://via.placeholder.com/300x450?text=No+Poster'} alt={m.title} className="w-full h-56 object-cover" />
                <div className="absolute top-2 right-2 z-20 flex space-x-2">
                  <button onClick={() => { removeFromWish(m.id); }} className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 text-white" title="Remove"><i className="fas fa-times"></i></button>
                  <button onClick={() => moveToFavorites(m)} className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 text-white" title="Move to Favourites"><i className="fas fa-heart"></i></button>
                </div>
                <div className="p-3">
                  <div className="font-semibold text-sm line-clamp-2">{m.title}</div>
                  <div className="text-xs text-gray-300 mt-1">{m.year}</div>
                  <div className="mt-3 flex space-x-2">
                    <Link to={`/movie/${encodeURIComponent(m.title)}`} className="px-3 py-1 bg-movieshere-red rounded text-sm">View</Link>
                    <button onClick={() => moveToFavorites(m)} className="px-3 py-1 bg-gray-700 rounded text-sm">Move to Favourites</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
      </div>
    </>
  );
}
