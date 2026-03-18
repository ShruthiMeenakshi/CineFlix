import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function News() {
  useEffect(() => { document.title = 'New & Popular | MoviesHere'; }, []);

  return (
    <div className="bg-movieshere-dark text-white min-h-screen">
      <nav className="fixed w-full z-50 bg-gradient-to-b from-black to-transparent px-4 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" className="text-3xl font-bold text-movieshere-red">MOVIES<span className="text-white">HERE</span></a>
          <div className="hidden md:flex ml-8 space-x-6">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <a href="/Tvshows.html" className="hover:text-gray-300">TV Shows</a>
            <Link to="/movies" className="hover:text-gray-300">Movies</Link>
            <Link to="/news" className="hover:text-gray-300">New & Popular</Link>
            <a href="/list.html" className="hover:text-gray-300">My List</a>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-12 px-4 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">New & Popular</h1>
        <div className="flex border-b border-gray-700 mb-8">
          <button className="px-4 py-2 border-b-2 border-movieshere-red text-white">What's New</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white">Top 10</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white">Coming Soon</button>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-6">Recently Added</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="group relative rounded overflow-hidden">
              <div className="absolute top-2 left-2 bg-movieshere-red text-white text-xs font-bold px-2 py-1 rounded z-10">NEW</div>
              <img src="https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" alt="Content" className="w-full h-auto transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-movieshere-red text-white px-4 py-2 rounded">
                  <i className="fas fa-play mr-2"></i> Play
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* trending items placeholder */}
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
          <p className="text-sm">© 2023 MoviesHere, Inc.</p>
        </div>
      </footer>
    </div>
  );
}
