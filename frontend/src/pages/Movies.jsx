import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Movies() {
  useEffect(() => {
    document.title = 'Movies | MoviesHere';
    if (window.Swiper) {
      try {
        new window.Swiper('.popular-movies-slider', { slidesPerView: 'auto', spaceBetween: 15, navigation: { nextEl: '.swiper-button-next-popular', prevEl: '.swiper-button-prev-popular' } });
        new window.Swiper('.new-releases-slider', { slidesPerView: 'auto', spaceBetween: 15, navigation: { nextEl: '.swiper-button-next-new', prevEl: '.swiper-button-prev-new' } });
        new window.Swiper('.awards-slider', { slidesPerView: 'auto', spaceBetween: 15, navigation: { nextEl: '.swiper-button-next-awards', prevEl: '.swiper-button-prev-awards' } });
      } catch (e) { console.warn('Swiper init failed', e); }
    }
  }, []);

  return (
    <div className="bg-movieshere-dark text-white">
      <nav className="fixed w-full z-50 bg-gradient-to-b from-black to-transparent px-4 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-3xl font-bold text-movieshere-red hover:text-red-600 transition-colors duration-300">MOVIES<span className="text-white">HERE</span></a>
        </div>
      </nav>

      <section className="pt-24 pb-12 px-4 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Movies</h1>
        <div className="mb-12 featured-movie">
          <h2 className="section-header text-xl md:text-2xl font-bold mb-6">Featured Today</h2>
          <div className="relative group rounded-lg overflow-hidden">
            <img src="https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" alt="The Batman" className="w-full h-64 md:h-96 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 transition-all duration-300 group-hover:text-movieshere-red">The Batman</h3>
              <p className="text-gray-300 mb-4 max-w-2xl transition-all duration-300 group-hover:text-white">When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham...</p>
              <div className="flex space-x-4">
                <button className="bg-white text-black px-6 py-2 rounded flex items-center hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"><i className="fas fa-play mr-2"></i> Play</button>
                <Link to="/avengers" className="bg-movieshere-gray bg-opacity-70 px-6 py-2 rounded flex items-center hover:bg-opacity-50 transition-all duration-300 transform hover:scale-105"><i className="fas fa-info-circle mr-2"></i> More Info</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
