import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toggleFavorite, toggleWishlist, isFavorite, isWishlisted } from '../lib/myList';

const API_BASE_URL = 'http://localhost:8082/api/movies';

export default function Home() {
  const [listVersion, setListVersion] = useState(0);
  const [query, setQuery] = useState('');
  const [navbarQuery, setNavbarQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [curatedMovies, setCuratedMovies] = useState([]);

  useEffect(() => {
    document.title = 'CineFlix - Home';
    // load curated OMDB movies for the featured grids
    let mounted = true;
    async function loadCurated() {
      const queries = ['Avengers','Batman','Inception','Matrix','Star Wars','Lord of the Rings','Harry Potter','Jurassic Park','Titanic','Interstellar'];
      const collected = [];
      const seen = new Set();
      try {
        for (const q of queries) {
          if (!mounted) break;
          const res = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(q)}&page=1`);
          const data = await res.json();
          if (data && Array.isArray(data.Search)) {
            for (const m of data.Search) {
              if (collected.length >= 18) break;
              if (!m.imdbID || seen.has(m.imdbID)) continue;
              seen.add(m.imdbID);
              collected.push(m);
            }
          }
          if (collected.length >= 18) break;
        }
      } catch (e) {
        // ignore network errors, leave curated empty
      }
      if (mounted) setCuratedMovies(collected);
    }
    loadCurated();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    function onUpdate() { setListVersion(v => v + 1); }
    window.addEventListener('storage', onUpdate);
    window.addEventListener('mylist:change', onUpdate);
    return () => { window.removeEventListener('storage', onUpdate); window.removeEventListener('mylist:change', onUpdate); };
  }, []);

  async function searchMovies(q, p = 1) {
    const trimmed = q.trim();
    if (!trimmed) {
      setSearchStatus('Please enter a movie name.');
      setResults([]);
      return;
    }

    if (p === 1) {
      setResults([]);
      setPage(1);
      setTotalResults(0);
    }

    setIsLoading(true);
    setSearchStatus('Searching...');
    try {
      const res = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(trimmed)}&page=${p}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch results.');

      if (data.Response === 'False' || !data.Search?.length) {
        if (p === 1) {
          setSearchStatus(data.Error || `No movies found for "${trimmed}".`);
          setResults([]);
        } else {
          setSearchStatus('No more results.');
        }
        setIsLoading(false);
        return;
      }

      setResults(prev => {
        const merged = p === 1 ? data.Search : [...prev, ...data.Search];
        const uniqueMovies = merged.filter(
          (movie, index, self) =>
            index === self.findIndex(m => m.imdbID === movie.imdbID)
        );
        return uniqueMovies;
      });

      setSearchStatus(`Showing page ${p} results for "${trimmed}".`);
      setTotalResults(parseInt(data.totalResults || '0', 10));
      setPage(p);
    } catch (err) {
      setSearchStatus(`Search failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function openDetails(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}?plot=full`);
      const data = await res.json();
      if (!res.ok || data.Response === 'False') {
        setSearchStatus(data.Error || 'Failed to load details.');
        return;
      }
      setModalData(data);
      setModalOpen(true);
    } catch (err) {
      setSearchStatus(`Details fetch failed: ${err.message}`);
    }
  }

  function renderMovieCard(movie) {
    const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Poster';
    const id = movie.imdbID;
    const [favState, setFavState] = [isFavorite(id), isWishlisted(id)];
    return (
      <div key={`${movie.imdbID}-${movie.Year}`} className="bg-black/40 rounded overflow-hidden movie-card">
        <div className="relative group">
          <img src={poster} alt={movie.Title} className="w-full h-64 object-cover" loading="lazy" />

          <div className="absolute top-2 right-2 flex space-x-2 z-20">
            <button onClick={(e) => { e.stopPropagation(); toggleWishlist(movie); setTimeout(() => window.dispatchEvent(new Event('storage')), 50); }} className={`bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 ${isWishlisted(id) ? 'text-movieshere-red' : 'text-white'}`} title="Toggle wishlist"><i className="fas fa-bookmark"></i></button>
            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); setTimeout(() => window.dispatchEvent(new Event('storage')), 50); }} className={`bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 ${isFavorite(id) ? 'text-movieshere-red' : 'text-white'}`} title="Toggle favourite"><i className="fas fa-heart"></i></button>
          </div>

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-end p-3">
            <div className="w-full flex justify-between items-end">
              <button onClick={() => openDetails(movie.imdbID)} className="bg-movieshere-red text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-200"><i className="fas fa-play mr-2"></i>Play</button>
              <Link to={`/movie/${encodeURIComponent(movie.Title)}`} className="bg-white text-black px-3 py-1 rounded opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-200">More Info</Link>
            </div>
          </div>
        </div>
        <div className="p-3">
          <p className="font-semibold text-sm line-clamp-2">{movie.Title}</p>
          <p className="text-xs text-gray-300 mt-1">{movie.Year} • {movie.Type}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
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
          <div className="hidden md:flex items-center bg-cineflix-gray/70 rounded px-3 py-1.5">
            <i className="fas fa-search text-gray-300 mr-2"></i>
            <input value={navbarQuery} onChange={(e) => setNavbarQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { setQuery(navbarQuery); searchMovies(navbarQuery, 1); } }} id="navbarSearchInput" type="text" placeholder="Search movies..." className="bg-transparent text-sm focus:outline-none w-48" />
          </div>
          <Link to="/profile" className="flex items-center space-x-2 cursor-pointer">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-8 h-8 rounded" />
            <i className="fas fa-caret-down hover:text-gray-300"></i>
          </Link>
        </div>
      </nav>

      <section className="relative h-screen">
        <div className="absolute inset-0 hero-gradient z-10"></div>
        <img src="https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg" alt="Featured Movie" className="w-full h-full object-cover" />

        <div className="absolute bottom-1/4 left-0 right-0 z-20 px-4 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Avengers</h1>
          <p className="text-lg md:text-xl max-w-2xl mb-6">When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.</p>
          <div className="flex space-x-4">
            <button className="bg-white text-black px-6 py-2 rounded flex items-center hover:bg-opacity-80">
              <i className="fas fa-play mr-2"></i> Play
            </button>
            <Link to="/avengers" className="bg-cineflix-gray bg-opacity-70 px-6 py-2 rounded flex items-center hover:bg-opacity-50">
              <i className="fas fa-info-circle mr-2"></i> More Info
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-12 py-8">
        <div className="mb-10 bg-black/30 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">Search Movies</h2>
          <form onSubmit={(e) => { e.preventDefault(); searchMovies(query, 1); }} id="movieSearchForm" className="flex flex-col md:flex-row gap-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} id="movieSearchInput" type="text" placeholder="Type a movie name (e.g. Batman)" className="flex-1 bg-cineflix-gray px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cineflix-red" />
            <button type="submit" className="bg-cineflix-red px-5 py-2 rounded hover:bg-red-700" disabled={isLoading}>Search</button>
          </form>
          <p id="searchStatus" className="text-gray-300 text-sm mt-3">{searchStatus}</p>
          <div id="searchResults" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-5">
            {results.map(renderMovieCard)}
          </div>
        </div>

        {/* Popular, Trending, Continue Watching rows copied from original HTML */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Popular on CineFlix</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {(curatedMovies.length ? curatedMovies.slice(0,6) : Array.from({length:6})).map((m, idx) => (
              m && m.imdbID ? renderMovieCard(m) : (
                <div key={`pop-${idx}`} className="group relative rounded overflow-hidden">
                  <div className="w-full h-40 bg-gray-800 animate-pulse"></div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {(curatedMovies.length ? curatedMovies.slice(6,12) : Array.from({length:6})).map((m, idx) => (
              m && m.imdbID ? renderMovieCard(m) : (
                <div key={`trend-${idx}`} className="group relative rounded overflow-hidden">
                  <div className="w-full h-40 bg-gray-800 animate-pulse"></div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Continue Watching</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {(curatedMovies.length ? curatedMovies.slice(12,18) : Array.from({length:6})).map((m, idx) => (
              m && m.imdbID ? (
                <div key={m.imdbID}>{renderMovieCard(m)}</div>
              ) : (
                <div key={`cont-${idx}`} className="group relative rounded overflow-hidden">
                  <div className="w-full h-40 bg-gray-800 animate-pulse"></div>
                </div>
              )
            ))}
          </div>
        </div>

      </section>

      {/* Footer */}
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

      {/* Modal */}
      {modalOpen && modalData && (
        <div id="movieModal" className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-cineflix-dark rounded-lg max-w-2xl w-full overflow-auto">
            <div className="p-4 flex justify-end"><button onClick={() => setModalOpen(false)} className="text-gray-300">Close</button></div>
            <div id="modalContent" className="p-4 text-gray-200">
              <div className="md:flex gap-4">
                <img src={modalData.Poster && modalData.Poster !== 'N/A' ? modalData.Poster : 'https://via.placeholder.com/300x445?text=No+Poster'} className="w-40 h-auto rounded mb-4 md:mb-0" alt="poster" />
                <div>
                  <h3 className="text-xl font-bold">{modalData.Title} ({modalData.Year})</h3>
                  <p className="text-sm text-gray-300 mt-2">{modalData.Genre} • {modalData.Runtime}</p>
                  <p className="mt-3 text-gray-200">{modalData.Plot}</p>
                  <p className="text-xs text-gray-400 mt-3">IMDB: {modalData.imdbRating} • Votes: {modalData.imdbVotes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
