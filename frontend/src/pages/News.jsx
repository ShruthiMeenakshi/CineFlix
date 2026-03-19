import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJsonWithCache, prefetchImages } from '../lib/apiCache';

const API_BASE = 'http://localhost:8082/api/movies';

export default function News() {
  const [recent, setRecent] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => { document.title = 'New & Popular | CineFlix'; }, []);

  useEffect(() => {
    async function loadRecent() {
      try {
        // Use a year query to approximate "recent" additions
        const url = `${API_BASE}/search?query=2024&type=movie&page=1`;
        const data = await fetchJsonWithCache(url);
        const list = (data && Array.isArray(data.Search)) ? data.Search : [];
        setRecent(list.slice(0, 12));
        prefetchImages(list.map(i => i.Poster).filter(Boolean));
      } catch (e) {
        // ignore
      }
    }

    async function loadTrending() {
      try {
        const queries = ['Avengers','Batman','Spider-Man','Star Wars','Matrix'];
        const results = [];
        for (const q of queries) {
          try {
            const url = `${API_BASE}/search?query=${encodeURIComponent(q)}&type=movie&page=1`;
            const data = await fetchJsonWithCache(url);
            if (data && Array.isArray(data.Search)) {
              for (const it of data.Search) {
                if (!results.find(r => r.imdbID === it.imdbID)) results.push(it);
              }
            }
          } catch (e) {}
        }
        setTrending(results.slice(0, 18));
        prefetchImages(results.map(r => r.Poster).filter(Boolean));
      } catch (e) {}
    }

    loadRecent();
    loadTrending();
  }, []);

  const posterOrPlaceholder = (p, label) => p && p !== 'N/A' ? p : `https://via.placeholder.com/300x450?text=${encodeURIComponent(label)}`;

  return (
    <div className="bg-cineflix-dark text-white min-h-screen">
      <nav className="fixed w-full z-50 bg-gradient-to-b from-black to-transparent px-4 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="text-3xl font-bold text-cineflix-red">CineFlix</a>
          <div className="hidden md:flex ml-8 space-x-6">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/tvshows" className="hover:text-gray-300">TV Shows</Link>
            <Link to="/movies" className="hover:text-gray-300">Movies</Link>
            <Link to="/news" className="hover:text-gray-300">New & Popular</Link>
            <Link to="/list" className="hover:text-gray-300">My List</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block"><i className="fas fa-search hover:text-gray-300 cursor-pointer"></i></div>
          <div className="hidden md:block"><i className="fas fa-bell hover:text-gray-300 cursor-pointer"></i></div>
          <div className="flex items-center space-x-2 cursor-pointer group">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-8 h-8 rounded transition-transform duration-300 group-hover:ring-2 group-hover:ring-cineflix-red" />
            <i className="fas fa-caret-down hover:text-gray-300"></i>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-12 px-4 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">New & Popular</h1>
        <div className="flex border-b border-gray-700 mb-8">
          <button className="px-4 py-2 border-b-2 border-cineflix-red text-white">What's New</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white">Top 10</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white">Coming Soon</button>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6">Recently Added</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recent.length === 0 ? (
              Array.from({length:6}).map((_,i) => (
                <div key={i} className="h-56 bg-gray-800 animate-pulse rounded" />
              ))
            ) : (
              recent.map((item) => (
                <div key={item.imdbID} className="group relative rounded overflow-hidden">
                  <div className="absolute top-2 left-2 bg-cineflix-red text-white text-xs font-bold px-2 py-1 rounded z-10">NEW</div>
                  <img src={posterOrPlaceholder(item.Poster, item.Title)} alt={item.Title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <Link to={`/movie/${encodeURIComponent(item.Title)}`} className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-cineflix-red text-white px-4 py-2 rounded"><i className="fas fa-info-circle mr-2"></i> More Info</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trending.length === 0 ? (
              Array.from({length:6}).map((_,i) => (
                <div key={i} className="h-56 bg-gray-800 animate-pulse rounded" />
              ))
            ) : (
              trending.map(item => (
                <div key={item.imdbID} className="group relative rounded overflow-hidden">
                  <img src={posterOrPlaceholder(item.Poster, item.Title)} alt={item.Title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <Link to={`/movie/${encodeURIComponent(item.Title)}`} className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-cineflix-red text-white px-4 py-2 rounded"><i className="fas fa-info-circle mr-2"></i> More Info</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <footer className="bg-black text-gray-400 px-4 md:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex mb-6">
            <a href="#" className="mr-4"><i className="fab fa-facebook text-2xl hover:text-white"></i></a>
            <a href="#" className="mr-4"><i className="fab fa-instagram text-2xl hover:text-white"></i></a>
            <a href="#" className="mr-4"><i className="fab fa-twitter text-2xl hover:text-white"></i></a>
            <a href="#" className="mr-4"><i className="fab fa-youtube text-2xl hover:text-white"></i></a>
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
          <button className="border border-gray-400 px-4 py-2 mb-6 hover:text-white">Service Code</button>
          <p className="text-sm">© 2023 CineFlix, Inc.</p>
        </div>
      </footer>
    </div>
  );
}
