import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Notifications from '../components/Notifications.jsx';

export default function Avengers() {
  useEffect(() => {
    document.title = 'Avengers — Details';
  }, []);

  return (
    <div className="min-h-screen text-white bg-black">
      <nav className="fixed w-full z-50 bg-gradient-to-b from-black to-transparent px-4 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/movies" className="text-2xl font-bold text-cineflix-red hover:text-red-600 transition-colors duration-300">Cineflix</a>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/movies" className="px-3 py-2 bg-cineflix-gray rounded hover:bg-opacity-80">Back</a>
          <div className="hidden md:block"><i className="fas fa-search hover:text-gray-300 cursor-pointer"></i></div>
          <div className="hidden md:block"><Notifications /></div>
          <div className="flex items-center space-x-2 cursor-pointer group">
            <Link to="/profile" aria-label="Go to profile">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-8 h-8 rounded transition-transform duration-300 group-hover:ring-2 group-hover:ring-cineflix-red" />
            </Link>
            <i className="fas fa-caret-down hover:text-gray-300"></i>
          </div>
        </div>
      </nav>

      <header className="hero-bg min-h-screen flex items-center" style={{paddingTop:64}}>
        <div className="w-full">
          <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="glass p-8 rounded-lg shadow-2xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Avengers: Endgame</h1>
                <p className="text-gray-200 mb-6 max-w-3xl">After the devastating events of Avengers: Infinity War (2018), the universe is in ruins...</p>
                <div className="flex space-x-4 mb-6">
                  <a href="#play" className="inline-flex items-center bg-white text-black px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform duration-200"><i className="fas fa-play mr-3"></i> Play</a>
                  <a href="#trailer" className="inline-flex items-center border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition-colors duration-200"><i className="fas fa-film mr-3"></i> Trailer</a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-100 mb-1">Director</h3>
                    <p>Anthony Russo, Joe Russo</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-100 mb-1">Runtime</h3>
                    <p>181 min</p>
                  </div>
                </div>
              </div>
            </div>
            <aside className="hidden md:block">
              <div className="p-4 glass rounded-lg">
                <img src="https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg" alt="Avengers poster" className="rounded-md w-full mb-4 shadow-lg" />
                <h4 className="text-lg font-semibold mb-2">Cast</h4>
                <ul className="text-gray-200 text-sm space-y-1">
                  <li>Robert Downey Jr. as Tony Stark / Iron Man</li>
                  <li>Chris Evans as Steve Rogers / Captain America</li>
                  <li>Mark Ruffalo as Bruce Banner / Hulk</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </header>
    </div>
  );
}
