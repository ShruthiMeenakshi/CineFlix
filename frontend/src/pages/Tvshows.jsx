import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJsonWithCache, prefetchImages } from '../lib/apiCache';
import Notifications from '../components/Notifications.jsx';
import ProfileAvatar from '../components/ProfileAvatar.jsx';
import { API_BASE_MOVIES as API_BASE, API_URL } from '../lib/config';

export default function Tvshows() {
  const [posters, setPosters] = useState([]);
  const [listVersion, setListVersion] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  useEffect(() => {
    document.title = 'TV Shows | CineFlix';
    async function load() {
      try {
        const url = `${API_BASE}/random-posters?count=18`;
        const data = await fetchJsonWithCache(url);
        if (Array.isArray(data)) {
          const normalized = data.map((u, i) => ({ Poster: u, Title: `Poster ${i+1}`, imdbID: `poster-tv-${i}` }));
          setPosters(normalized);
          prefetchImages(normalized.map(n => n.Poster));
        }
      } catch (e) {
        // ignore
      }
    }
    load();
    function onUpdate() { setListVersion(v => v + 1); }
    window.addEventListener('storage', onUpdate);
    window.addEventListener('mylist:change', onUpdate);
    return () => { window.removeEventListener('storage', onUpdate); window.removeEventListener('mylist:change', onUpdate); };
  }, []);

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

  const [activeCategory, setActiveCategory] = useState('All');

  async function fetchCategorySeries(cat) {
    setActiveCategory(cat);
    if (cat === 'All') {
      try {
        const url = `${API_BASE}/random-posters?count=18`;
        const data = await fetchJsonWithCache(url);
        if (Array.isArray(data)) {
          const normalized = data.map((u, i) => ({ Poster: u, Title: `Poster ${i+1}`, imdbID: `poster-tv-${i}` }));
          setPosters(normalized);
          prefetchImages(normalized.map(n => n.Poster));
        }
      } catch (e) {}
      return;
    }
    try {
      const url = `${API_BASE}/search?query=${encodeURIComponent(cat)}&page=1&type=series`;
      const data = await fetchJsonWithCache(url);
      if (data && Array.isArray(data.Search)) {
        setPosters(data.Search);
        prefetchImages(data.Search.map(s => s.Poster).filter(Boolean));
      }
    } catch (e) {}
  }

  const posterOrPlaceholder = (p, label) => p || `https://via.placeholder.com/300x450?text=${encodeURIComponent(label)}`;

  return (
    <div className="bg-cineflix-dark text-white min-h-screen">
      <nav className="fixed w-full z-50 bg-gradient-to-b from-black to-transparent px-4 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-3xl font-bold text-cineflix-red">CineFlix</a>
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
          <div className="hidden md:block"><Notifications /></div>
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" aria-label="Go to profile">
                  <ProfileAvatar />
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">TV Shows</h1>

        <div className="flex space-x-4 mb-8 overflow-x-auto pb-4">
            {['All','Drama','Comedy','Action','Sci-Fi','Horror','Reality'].map(cat => (
            <button key={cat} onClick={() => fetchCategorySeries(cat)} className={`whitespace-nowrap px-4 py-2 rounded-md ${activeCategory===cat ? 'bg-cineflix-red' : 'bg-cineflix-gray'} hover:opacity-90`}>{cat}</button>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="section-header text-xl md:text-2xl font-bold mb-6">Featured Today</h2>
          <div className="relative group rounded-lg overflow-hidden">
            <img src="https://image.tmdb.org/t/p/original/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg" alt="Stranger Things" className="w-full h-64 md:h-96 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 transition-all duration-300 group-hover:text-cineflix-red">Stranger Things</h3>
              <p className="text-gray-300 mb-4 max-w-2xl transition-all duration-300 group-hover:text-white">When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.</p>
              <div className="flex space-x-4">
                <button className="bg-white text-black px-6 py-2 rounded flex items-center hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"><i className="fas fa-play mr-2"></i> Play</button>
                <Link to="/movie/stranger%20things" className="bg-cineflix-gray bg-opacity-70 px-6 py-2 rounded flex items-center hover:bg-opacity-50 transition-all duration-300 transform hover:scale-105"><i className="fas fa-info-circle mr-2"></i> More Info</Link>
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
                    <div className="absolute top-2 right-2 z-20 flex space-x-2">
                      <button onClick={(e) => { e.stopPropagation(); if (!isLoggedIn) { setLoginModalOpen(true); return; } const obj = { poster: p || '', title: 'Unknown', id: encodeURIComponent(p || `popular-${i}`) }; import('../lib/myList').then(m => { m.toggleWishlist(obj); window.dispatchEvent(new Event('storage')); }); }} className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 text-white" title="Wishlist"><i className="fas fa-bookmark"></i></button>
                      <button onClick={(e) => { e.stopPropagation(); if (!isLoggedIn) { setLoginModalOpen(true); return; } const obj = { poster: p || '', title: 'Unknown', id: encodeURIComponent(p || `popular-${i}`) }; import('../lib/myList').then(m => { m.toggleFavorite(obj); window.dispatchEvent(new Event('storage')); }); }} className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 text-white" title="Favourite"><i className="fas fa-heart"></i></button>
                    </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                        <div className="flex items-center gap-3">
                          <button onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } }} className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-cineflix-red text-white px-4 py-2 rounded flex items-center gap-2"><i className="fas fa-play"></i><span className="hidden md:inline">Play</span></button>
                          <Link to={`/show/${encodeURIComponent(p || `popular-${i}`)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="bg-white bg-opacity-10 text-white px-4 py-2 rounded hidden md:flex items-center gap-2 hover:bg-opacity-20"><i className="fas fa-info-circle"></i><span>More Info</span></Link>
                        </div>
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
                      <div className="flex items-center gap-3">
                        <button onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } }} className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-cineflix-red text-white px-4 py-2 rounded flex items-center gap-2"><i className="fas fa-play"></i><span className="hidden md:inline">Play</span></button>
                        <Link to={`/show/${encodeURIComponent(p || `new-${i}`)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="bg-white bg-opacity-10 text-white px-4 py-2 rounded hidden md:flex items-center gap-2 hover:bg-opacity-20"><i className="fas fa-info-circle"></i><span>More Info</span></Link>
                      </div>
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
                      <div className="flex items-center gap-3">
                        <button onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } }} className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-cineflix-red text-white px-4 py-2 rounded flex items-center gap-2"><i className="fas fa-play"></i><span className="hidden md:inline">Play</span></button>
                        <Link to={`/show/${encodeURIComponent(p || `award-${i}`)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="bg-white bg-opacity-10 text-white px-4 py-2 rounded hidden md:flex items-center gap-2 hover:bg-opacity-20"><i className="fas fa-info-circle"></i><span>More Info</span></Link>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-t from-black via-gray-900 to-transparent text-gray-300 px-4 md:px-12 py-10 border-t border-gray-600">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div>
            <a href="/" className="text-2xl font-bold text-cineflix-red">CineFlix</a>
            <p className="mt-3 text-sm text-gray-400">Stream curated TV shows and keep track of what to watch next.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/tvshows" className="hover:text-white">All TV Shows</a></li>
              <li><a href="/movies" className="hover:text-white">Movies</a></li>
              <li><a href="/news" className="hover:text-white">New & Popular</a></li>
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
            <h4 className="font-semibold mb-3">Subscribe</h4>
            <form onSubmit={(e)=>{e.preventDefault(); alert('Subscribed');}} className="flex gap-2">
              <input type="email" placeholder="Email" className="flex-1 px-3 py-2 rounded bg-gray-800 text-white text-sm" />
              <button className="bg-cineflix-red px-4 py-2 rounded text-white text-sm">Join</button>
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
            <div className="text-gray-400">Enjoy your shows</div>
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
