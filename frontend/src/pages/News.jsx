import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJsonWithCache, prefetchImages } from '../lib/apiCache';
import Notifications from '../components/Notifications.jsx';
import { API_BASE_MOVIES as API_BASE, API_URL } from '../lib/config';

export default function News() {
  const [recent, setRecent] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  useEffect(() => { document.title = 'New & Popular | CineFlix'; }, []);

  useEffect(() => {
    try {
      const s = localStorage.getItem('cineflix_user');
      if (s) { setUser(JSON.parse(s)); setIsLoggedIn(true); } else { setUser(null); setIsLoggedIn(false); }
    } catch (e) { setUser(null); setIsLoggedIn(false); }
  }, []);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const uname = (loginForm.username || '').trim();
    const pwd = loginForm.password || '';
    if (!uname || !pwd) return;
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname, password: pwd }),
      });
      if (!res.ok) return;
      const data = await res.json().catch(() => ({}));
      const u = { username: data.username || uname };
      localStorage.setItem('cineflix_user', JSON.stringify(u));
      if (data.token) {
        localStorage.setItem('cineflix_token', data.token);
      }
      setUser(u);
      setIsLoggedIn(true);
      setLoginModalOpen(false);
    } catch (e) {
      // ignore
    }
  }

  function handleLogout() {
    localStorage.removeItem('cineflix_user');
    localStorage.removeItem('cineflix_token');
    setUser(null);
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('storage'));
  }

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
          <div className="hidden md:block"><Notifications /></div>
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" aria-label="Go to profile">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-8 h-8 rounded" />
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
                      <div className="flex items-center gap-3">
                        <Link to={`/movie/${encodeURIComponent(item.Title)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-cineflix-red text-white px-4 py-2 rounded flex items-center gap-2"><i className="fas fa-play"></i><span className="hidden md:inline">Play</span></Link>
                        <Link to={`/movie/${encodeURIComponent(item.Title)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white bg-opacity-10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-opacity-20"><i className="fas fa-info-circle"></i><span className="hidden md:inline">More Info</span></Link>
                      </div>
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
                      <div className="flex items-center gap-3">
                        <Link to={`/movie/${encodeURIComponent(item.Title)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-cineflix-red text-white px-4 py-2 rounded flex items-center gap-2"><i className="fas fa-play"></i><span className="hidden md:inline">Play</span></Link>
                        <Link to={`/movie/${encodeURIComponent(item.Title)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white bg-opacity-10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-opacity-20"><i className="fas fa-info-circle"></i><span className="hidden md:inline">More Info</span></Link>
                      </div>
                    </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-t from-black via-gray-900 to-transparent text-gray-300 px-4 md:px-12 py-10 border-t border-gray-600">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div>
            <a href="#" className="text-2xl font-bold text-cineflix-red">CineFlix</a>
            <p className="mt-3 text-sm text-gray-400">Curated picks, trending titles, and personalised updates — all in one place.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Discover</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/news" className="hover:text-white">New & Popular</a></li>
              <li><a href="/movies" className="hover:text-white">Movies</a></li>
              <li><a href="/tvshows" className="hover:text-white">TV Shows</a></li>
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
            <p className="text-sm text-gray-400 mb-3">Subscribe for trending picks and news.</p>
            <form onSubmit={(e)=>{e.preventDefault(); alert('Subscribed!');}} className="flex gap-2">
              <input type="email" placeholder="Email address" className="flex-1 px-3 py-2 rounded bg-gray-800 text-white text-sm" />
              <button className="bg-cineflix-red px-4 py-2 rounded text-white text-sm">Subscribe</button>
            </form>
            <div className="flex items-center space-x-3 mt-4">
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-facebook text-2xl"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-instagram text-2xl"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-twitter text-2xl"></i></a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <div>© {new Date().getFullYear()} CineFlix, Inc.</div>
          <div className="flex items-center space-x-4 mt-3 md:mt-0">
            <button className="border border-gray-600 px-4 py-2 rounded hover:bg-gray-800">Service Code</button>
            <div className="text-gray-400">Stay informed with CineFlix</div>
          </div>
        </div>
      </footer>
      {loginModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9998]">
          <div className="bg-cineflix-dark rounded-lg max-w-md w-full p-6 relative z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Sign in to CineFlix</h3>
              <button onClick={() => setLoginModalOpen(false)} className="text-gray-300">Close</button>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input value={loginForm.username} onChange={(e) => setLoginForm(f => ({ ...f, username: e.target.value }))} placeholder="Username" className="w-full px-3 py-2 rounded bg-gray-800 text-white" />
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))} placeholder="Password" className="w-full px-3 py-2 rounded bg-gray-800 text-white" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setLoginModalOpen(false)} className="px-4 py-2 border rounded text-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cineflix-red text-white rounded">Sign In</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
