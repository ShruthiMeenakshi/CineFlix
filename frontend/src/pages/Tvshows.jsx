import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:8082/api/movies';

export default function Tvshows() {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    document.title = 'TV Shows | MoviesHere';
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/random-posters?count=18`);
        const data = await res.json();
        if (Array.isArray(data)) setPosters(data);
      } catch (e) {
        // ignore
      }
    }
    load();
  }, []);

  const posterOrPlaceholder = (p, label) => p || `https://via.placeholder.com/300x450?text=${encodeURIComponent(label)}`;

  return (
    <div className="bg-movieshere-dark text-white min-h-screen">
      <nav className="fixed w-full z-50 bg-gradient-to-b from-black to-transparent px-4 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-3xl font-bold text-movieshere-red">MOVIES<span className="text-white">HERE</span></a>
          <div className="hidden md:flex ml-8 space-x-6">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/tvshows" className="text-white font-semibold hover:text-gray-300">TV Shows</Link>
            <Link to="/movies" className="hover:text-gray-300">Movies</Link>
            <Link to="/news" className="hover:text-gray-300">New & Popular</Link>
            <Link to="/list" className="hover:text-gray-300">My List</Link>
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

      <section className="pt-24 pb-12 px-4 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">TV Shows</h1>

        <div className="flex space-x-4 mb-8 overflow-x-auto pb-4">
          <button className="whitespace-nowrap px-4 py-2 bg-movieshere-red rounded-md">All TV Shows</button>
          <button className="whitespace-nowrap px-4 py-2 bg-movieshere-gray hover:bg-movieshere-gray/80 rounded-md">Drama</button>
          <button className="whitespace-nowrap px-4 py-2 bg-movieshere-gray hover:bg-movieshere-gray/80 rounded-md">Comedy</button>
          <button className="whitespace-nowrap px-4 py-2 bg-movieshere-gray hover:bg-movieshere-gray/80 rounded-md">Action</button>
          <button className="whitespace-nowrap px-4 py-2 bg-movieshere-gray hover:bg-movieshere-gray/80 rounded-md">Sci-Fi</button>
          <button className="whitespace-nowrap px-4 py-2 bg-movieshere-gray hover:bg-movieshere-gray/80 rounded-md">Horror</button>
          <button className="whitespace-nowrap px-4 py-2 bg-movieshere-gray hover:bg-movieshere-gray/80 rounded-md">Reality</button>
        </div>

        <div className="mb-12">
          <h2 className="section-header text-xl md:text-2xl font-bold mb-6">Featured Today</h2>
          <div className="relative group rounded-lg overflow-hidden">
            <img src="https://image.tmdb.org/t/p/original/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg" alt="Stranger Things" className="w-full h-64 md:h-96 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 transition-all duration-300 group-hover:text-movieshere-red">Stranger Things</h3>
              <p className="text-gray-300 mb-4 max-w-2xl transition-all duration-300 group-hover:text-white">When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.</p>
              <div className="flex space-x-4">
                <button className="bg-white text-black px-6 py-2 rounded flex items-center hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"><i className="fas fa-play mr-2"></i> Play</button>
                <Link to="/movie/stranger%20things" className="bg-movieshere-gray bg-opacity-70 px-6 py-2 rounded flex items-center hover:bg-opacity-50 transition-all duration-300 transform hover:scale-105"><i className="fas fa-info-circle mr-2"></i> More Info</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-xl font-bold mb-4">Popular TV Shows</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(posters.length ? posters.slice(0,6) : Array.from({length:6})).map((p, i) => (
                <div key={i} className="group relative rounded overflow-hidden">
                  <img src={posterOrPlaceholder(p, 'Popular')} alt={`Popular ${i}`} className="w-full h-40 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-movieshere-red text-white px-4 py-2 rounded"><i className="fas fa-play mr-2"></i> Play</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">New Releases</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(posters.length ? posters.slice(6,12) : Array.from({length:6})).map((p, i) => (
                <div key={i} className="group relative rounded overflow-hidden">
                  <img src={posterOrPlaceholder(p, 'New')} alt={`New ${i}`} className="w-full h-40 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-movieshere-red text-white px-4 py-2 rounded"><i className="fas fa-play mr-2"></i> Play</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Award-Winning TV Shows</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(posters.length ? posters.slice(12,18) : Array.from({length:6})).map((p, i) => (
                <div key={i} className="group relative rounded overflow-hidden">
                  <img src={posterOrPlaceholder(p, 'Award')} alt={`Award ${i}`} className="w-full h-40 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-movieshere-red text-white px-4 py-2 rounded"><i className="fas fa-play mr-2"></i> Play</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-gray-400 px-4 md:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex mb-6 space-x-6">
            <a href="#" className="hover:text-white transition-colors duration-300 transform hover:scale-110"><i className="fab fa-facebook text-2xl"></i></a>
            <a href="#" className="hover:text-white transition-colors duration-300 transform hover:scale-110"><i className="fab fa-instagram text-2xl"></i></a>
            <a href="#" className="hover:text-white transition-colors duration-300 transform hover:scale-110"><i className="fab fa-twitter text-2xl"></i></a>
            <a href="#" className="hover:text-white transition-colors duration-300 transform hover:scale-110"><i className="fab fa-youtube text-2xl"></i></a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white">Audio Description</a></li>
                <li><a href="#" className="hover:text-white">Investor Relations</a></li>
                <li><a href="#" className="hover:text-white">Legal Notices</a></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Jobs</a></li>
                <li><a href="#" className="hover:text-white">Cookie Preferences</a></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white">Gift Cards</a></li>
                <li><a href="#" className="hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white">Corporate Information</a></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white">Media Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <button className="border border-gray-400 px-4 py-2 mb-6 hover:text-white hover:border-white transition-all duration-300">Service Code</button>
          <p className="text-sm">© 2023 MoviesHere, Inc.</p>
        </div>
      </footer>
    </div>
  );
}
