import React, { useEffect, useState } from 'react';
import { getFavorites, getWishlist, removeFavorite, removeWishlist } from '../lib/myList';

export default function MyList() {
  const [favs, setFavs] = useState([]);
  const [wish, setWish] = useState([]);

  useEffect(() => {
    setFavs(getFavorites());
    setWish(getWishlist());
    const onStorage = () => { setFavs(getFavorites()); setWish(getWishlist()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function removeFromFav(id) { removeFavorite(id); setFavs(getFavorites()); }
  function removeFromWish(id) { removeWishlist(id); setWish(getWishlist()); }

  return (
    <div className="bg-movieshere-dark text-white min-h-screen px-4 md:px-12 pt-24">
      <h1 className="text-3xl font-bold mb-6">My List</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Favourites</h2>
        {favs.length === 0 ? (
          <p className="text-gray-400">You have no favourites yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favs.map(m => (
              <div key={m.id} className="group relative rounded overflow-hidden bg-black/20">
                <img src={m.poster || 'https://via.placeholder.com/300x450?text=No+Poster'} alt={m.title} className="w-full h-56 object-cover" />
                <button onClick={() => removeFromFav(m.id)} className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80"><i className="fas fa-times text-white"></i></button>
                <div className="p-3">
                  <div className="font-semibold text-sm line-clamp-2">{m.title}</div>
                  <div className="text-xs text-gray-300 mt-1">{m.year}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>
        {wish.length === 0 ? (
          <p className="text-gray-400">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {wish.map(m => (
              <div key={m.id} className="group relative rounded overflow-hidden bg-black/20">
                <img src={m.poster || 'https://via.placeholder.com/300x450?text=No+Poster'} alt={m.title} className="w-full h-56 object-cover" />
                <button onClick={() => removeFromWish(m.id)} className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80"><i className="fas fa-times text-white"></i></button>
                <div className="p-3">
                  <div className="font-semibold text-sm line-clamp-2">{m.title}</div>
                  <div className="text-xs text-gray-300 mt-1">{m.year}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
