import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, getWishlist } from '../lib/myList';

export default function Profile() {
  const [favs, setFavs] = useState([]);
  const [wish, setWish] = useState([]);

  useEffect(() => {
    document.title = 'Profile | MoviesHere';
    setFavs(getFavorites());
    setWish(getWishlist());
    const onStorage = () => { setFavs(getFavorites()); setWish(getWishlist()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="bg-movieshere-dark text-white min-h-screen px-4 md:px-12 pt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1 bg-black/20 rounded-lg p-6 sticky top-24">
          <div className="flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-28 h-28 rounded-full mb-4" />
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-sm text-gray-300">Member since 2023</p>
          </div>

          <nav className="mt-6">
            <ul className="space-y-2">
              <li><Link to="/profile" className="block px-3 py-2 rounded hover:bg-movieshere-gray">Dashboard</Link></li>
              <li><Link to="/list" className="block px-3 py-2 rounded hover:bg-movieshere-gray">My List</Link></li>
              <li><Link to="/movies" className="block px-3 py-2 rounded hover:bg-movieshere-gray">Browse Movies</Link></li>
              <li><Link to="/tvshows" className="block px-3 py-2 rounded hover:bg-movieshere-gray">Browse TV Shows</Link></li>
              <li><button className="w-full text-left px-3 py-2 rounded hover:bg-movieshere-gray">Sign out</button></li>
            </ul>
          </nav>

          <div className="mt-6 text-sm text-gray-400">
            <div className="mb-2">Plan: <strong className="text-white">Free</strong></div>
            <div>Language: <strong className="text-white">English</strong></div>
          </div>
        </aside>

        {/* Main dashboard */}
        <main className="col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Account</h3>
              <div className="text-sm text-gray-300">john.doe@example.com</div>
              <div className="text-sm text-gray-300 mt-2">Member since <strong>2023</strong></div>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Favourites</h3>
              <div className="text-sm text-gray-300">{favs.length} items</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {favs.slice(0,6).map(f => (
                  <Link key={f.id} to={`/movie/${encodeURIComponent(f.title)}`} className="block">
                    <img src={f.poster || 'https://via.placeholder.com/150x225?text=No'} alt={f.title} className="w-full h-20 object-cover rounded" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Wishlist</h3>
              <div className="text-sm text-gray-300">{wish.length} items</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {wish.slice(0,6).map(w => (
                  <Link key={w.id} to={`/movie/${encodeURIComponent(w.title)}`} className="block">
                    <img src={w.poster || 'https://via.placeholder.com/150x225?text=No'} alt={w.title} className="w-full h-20 object-cover rounded" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Recent Activity</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>Watched: <strong>Avengers</strong> • 2 days ago</li>
                <li>Added to Wishlist: <strong>Inception</strong> • 5 days ago</li>
                <li>Added to Favourites: <strong>Batman</strong> • 2 weeks ago</li>
              </ul>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Preferences</h3>
              <div className="flex flex-col gap-2">
                <button className="bg-movieshere-gray px-3 py-2 rounded text-left">Edit Profile</button>
                <button className="bg-movieshere-gray px-3 py-2 rounded text-left">Manage Payment</button>
                <button className="bg-movieshere-gray px-3 py-2 rounded text-left">Playback Settings</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
