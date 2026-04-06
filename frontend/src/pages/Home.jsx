import React, { useEffect, useState } from 'react';
import Notifications from '../components/Notifications.jsx';
import ProfileAvatar from '../components/ProfileAvatar.jsx';
import { Link } from 'react-router-dom';
import { API_BASE_MOVIES, API_URL } from '../lib/config';
import { toggleFavorite, toggleWishlist, isFavorite, isWishlisted } from '../lib/myList';

const API_BASE_URL = API_BASE_MOVIES;

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
  // authentication state (simple client-side mock)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', email: '', confirmPassword: '' });
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [authStatus, setAuthStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'CineFlix - Home';
    // load curated OMDB movies for the featured grids
    let mounted = true;
    async function loadCurated() {
      const queries = ['Avengers', 'Batman', 'Inception', 'Matrix', 'Star Wars', 'Lord of the Rings', 'Harry Potter', 'Jurassic Park', 'Titanic', 'Interstellar'];
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

  useEffect(() => {
    // restore simple login from localStorage
    try {
      const stored = localStorage.getItem('cineflix_user');
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        setIsLoggedIn(true);
      }
    } catch (e) { /* ignore */ }
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

  function handleLoginSubmit(e) {
    e.preventDefault();
    console.log('handleLoginSubmit', authMode, loginForm);
    setAuthStatus('');
    if (authMode === 'signin') {
      const uname = (loginForm.username || '').trim();
      const pwd = loginForm.password || '';
      if (!uname) { setAuthStatus('Please enter a username to login.'); return; }
      if (!pwd) { setAuthStatus('Please enter a password to login.'); return; }

      (async () => {
        setAuthStatus('Signing in...');
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: uname, password: pwd }),
          });

          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            const userObj = { username: data.username || uname };
            localStorage.setItem('cineflix_user', JSON.stringify(userObj));
            if (data.token) {
              localStorage.setItem('cineflix_token', data.token);
            }
            setUser(userObj);
            setIsLoggedIn(true);
            setLoginModalOpen(false);
            setSearchStatus('');
            setAuthStatus('');
          } else {
            const err = await res.json().catch(() => ({}));
            setAuthStatus(err.error || err.message || 'Invalid credentials.');
          }
        } catch (err) {
          setAuthStatus('Login failed. Please try again.');
        }
      })();
    } else {
      // signup
      const uname = (loginForm.username || '').trim();
      const email = (loginForm.email || '').trim();
      const pwd = loginForm.password || '';
      const confirm = loginForm.confirmPassword || '';
      if (!uname || !email || !pwd) { setAuthStatus('Please complete all signup fields.'); return; }
      if (pwd.length < 6) { setAuthStatus('Password must be at least 6 characters.'); return; }
      if (pwd !== confirm) { setAuthStatus('Passwords do not match.'); return; }

      // attempt server signup (MongoDB-backed)
      (async () => {
          setAuthStatus('Submitting...');
          try {
            console.log('signup submit', { uname, email });
          const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: uname, email, password: pwd }),
          });
          if (res.status === 201) {
            const saved = await res.json().catch(() => null);
            const userObj = saved && saved.username ? { username: saved.username, email: saved.email } : { username: uname, email };
            localStorage.setItem('cineflix_user', JSON.stringify(userObj));
            setUser(userObj);
            setIsLoggedIn(true);
            setLoginModalOpen(false);
            setSearchStatus('Account created.');
            window.dispatchEvent(new CustomEvent('notify:add', { detail: { title: 'Account created', category: 'system' } }));
            try {
              const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: uname, password: pwd }),
              });
              if (loginRes.ok) {
                const loginData = await loginRes.json().catch(() => ({}));
                if (loginData.token) {
                  localStorage.setItem('cineflix_token', loginData.token);
                }
              }
            } catch (e) {
              // ignore auto-login failure
            }
          } else if (res.status === 409) {
            const err = await res.json().catch(() => ({}));
            setSearchStatus(err.error || err.message || 'Username or email already exists.');
          } else {
            const err = await res.json().catch(() => ({}));
            setSearchStatus(err.error || err.message || `Signup failed (status ${res.status}).`);
          }
        } catch (err) {
          setSearchStatus('Signup failed. Please try again.');
        }
      })();
    }
  }

  function handleLogout() {
    localStorage.removeItem('cineflix_user');
    localStorage.removeItem('cineflix_token');
    setUser(null);
    setIsLoggedIn(false);
    setAuthMode('signin');
    setAuthStatus('');
    setLoginForm({ username: '', password: '', email: '', confirmPassword: '' });
    setLoginModalOpen(true);
  }

  function renderMovieCard(movie) {
    const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Poster';
    const id = movie.imdbID;
    const favState = isFavorite(id);
    const wishState = isWishlisted(id);
    return (
      <div key={`${movie.imdbID}-${movie.Year}`} className="bg-black/40 rounded overflow-hidden movie-card">
        <div className="relative group">
          <img src={poster} alt={movie.Title} className="w-full h-64 object-cover" loading="lazy" />

          <div className="absolute top-2 right-2 flex space-x-2 z-20">
            <button onClick={(e) => { e.stopPropagation(); if (!isLoggedIn) { setLoginModalOpen(true); return; } toggleWishlist(movie); setTimeout(() => window.dispatchEvent(new Event('storage')), 50); }} className={`bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 ${wishState ? 'text-cineflix-red' : 'text-white'}`} title="Toggle wishlist"><i className="fas fa-bookmark"></i></button>
            <button onClick={(e) => { e.stopPropagation(); if (!isLoggedIn) { setLoginModalOpen(true); return; } toggleFavorite(movie); setTimeout(() => window.dispatchEvent(new Event('storage')), 50); }} className={`bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 ${favState ? 'text-cineflix-red' : 'text-white'}`} title="Toggle favourite"><i className="fas fa-heart"></i></button>
          </div>

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center p-3">
            <div className="overlay-actions">
              <button onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } openDetails(movie.imdbID); }} className="overlay-action bg-cineflix-red text-white px-4 py-2 rounded flex items-center gap-2"><i className="fas fa-play"></i><span className="hidden md:inline">Play</span></button>
              <Link to={`/movie/${encodeURIComponent(movie.Title)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="overlay-action bg-white bg-opacity-10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-opacity-20"><i className="fas fa-info-circle"></i><span className="hidden md:inline">More Info</span></Link>
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
          <div className="hidden md:block"><Notifications /></div>
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" aria-label="Go to profile">
                  <ProfileAvatar className="group-hover:ring-2 group-hover:ring-cineflix-red" />
                </Link>
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Hi, {user?.username}</span>
                  <button onClick={handleLogout} className="text-gray-300 hover:text-white" title="Logout"><i className="fas fa-sign-out-alt"></i></button>
                </div>
              </div>
            ) : (
              <button onClick={() => setLoginModalOpen(true)} className="flex items-center space-x-2 text-gray-300 hover:text-white" title="Login">
                <i className="fas fa-user text-xl"></i>
              </button>
            )}
          </div>
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
            {(curatedMovies.length ? curatedMovies.slice(0, 6) : Array.from({ length: 6 })).map((m, idx) => (
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
            {(curatedMovies.length ? curatedMovies.slice(6, 12) : Array.from({ length: 6 })).map((m, idx) => (
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
            {(curatedMovies.length ? curatedMovies.slice(12, 18) : Array.from({ length: 6 })).map((m, idx) => (
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
      <footer className="bg-gradient-to-t from-black via-gray-900 to-transparent text-gray-300 px-4 md:px-12 py-10 border-t border-gray-600">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div>
            <a href="#" className="text-2xl font-bold text-cineflix-red">CineFlix</a>
            <p className="mt-3 text-sm text-gray-400">Stream your favorite movies and shows. Personalized recommendations and easy list management.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/movies" className="hover:text-white">Movies</a></li>
              <li><a href="/tvshows" className="hover:text-white">TV Shows</a></li>
              <li><a href="/news" className="hover:text-white">New & Popular</a></li>
              <li><a href="/list" className="hover:text-white">My List</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy & Terms</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Stay in the loop</h4>
            <p className="text-sm text-gray-400 mb-3">Subscribe for updates and recommendations.</p>
            <form onSubmit={(e)=>{e.preventDefault(); setSearchStatus('Subscribed!');}} className="flex gap-2">
              <input type="email" placeholder="Email address" className="flex-1 px-3 py-2 rounded bg-gray-800 text-white text-sm" />
              <button className="bg-cineflix-red px-4 py-2 rounded text-white text-sm">Subscribe</button>
            </form>
            <div className="flex items-center space-x-3 mt-4">
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-facebook text-2xl"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-instagram text-2xl"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-twitter text-2xl"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-youtube text-2xl"></i></a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <div>© {new Date().getFullYear()} CineFlix, Inc.</div>
          <div className="flex items-center space-x-4 mt-3 md:mt-0">
            <button className="border border-gray-600 px-4 py-2 rounded hover:bg-gray-800">Service Code</button>
            <div className="text-gray-400">Made with ♥ for movie lovers</div>
          </div>
        </div>
      </footer>

        {/* Modal */}
        {loginModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9998]">
            <div className="bg-cineflix-dark rounded-lg max-w-md w-full p-6 relative z-50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{authMode === 'signin' ? 'Sign in to CineFlix' : 'Create a CineFlix account'}</h3>
                  <div className="text-sm text-gray-400 mt-1">
                    {authMode === 'signin' ? 'Access your saved list and personalized recommendations.' : 'Join CineFlix to save your favorites and get recommendations.'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAuthMode('signup')} className={`px-3 py-1 rounded ${authMode === 'signup' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}>Sign up</button>
                  <button onClick={() => setLoginModalOpen(false)} className="text-gray-300">Close</button>
                </div>
              </div>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <input value={loginForm.username} onChange={(e) => setLoginForm(f => ({ ...f, username: e.target.value }))} placeholder="Username" className="w-full px-3 py-2 rounded bg-gray-800 text-white" />
                {authMode === 'signup' && (
                  <input value={loginForm.email} onChange={(e) => setLoginForm(f => ({ ...f, email: e.target.value }))} placeholder="Email address" className="w-full px-3 py-2 rounded bg-gray-800 text-white" />
                )}
                <input type="password" value={loginForm.password} onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))} placeholder="Password" className="w-full px-3 py-2 rounded bg-gray-800 text-white" />
                {authMode === 'signup' && (
                  <input type="password" value={loginForm.confirmPassword} onChange={(e) => setLoginForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="Confirm password" className="w-full px-3 py-2 rounded bg-gray-800 text-white" />
                )}
                {authStatus && <div className="text-sm text-yellow-300">{authStatus}</div>}
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setLoginModalOpen(false)} className="px-4 py-2 border rounded text-gray-200">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className={`px-4 py-2 ${isSubmitting ? 'bg-gray-600' : 'bg-cineflix-red'} text-white rounded`}>
                    {isSubmitting ? (authMode === 'signin' ? 'Signing in...' : 'Creating...') : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {modalOpen && modalData && (
          <div id="movieModal" className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-cineflix-dark rounded-lg max-w-2xl w-full overflow-auto relative z-50">
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
