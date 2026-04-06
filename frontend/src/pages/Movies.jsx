import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJsonWithCache, prefetchImages } from '../lib/apiCache';
import { API_BASE_MOVIES as API_BASE, API_URL } from '../lib/config';
import Notifications from '../components/Notifications.jsx';

export default function Movies() {
  useEffect(() => {
    document.title = 'Movies | CineFlix';
    // initial swiper init will be handled after posters are loaded
  }, []);

  const [posters, setPosters] = useState([]);
  const [listVersion, setListVersion] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // fetch random posters from backend and initialize sliders
  useEffect(() => {
    async function loadPosters() {
      try {
        const url = `${API_BASE}/random-posters?count=12`;
        const data = await fetchJsonWithCache(url);
        if (Array.isArray(data) && data.length) {
          const normalized = data.map((u, i) => ({ Poster: u, Title: `Poster ${i + 1}`, imdbID: `poster-${i}` }));
          setPosters(normalized);
          // prefetch images to warm browser cache + Cache Storage
          prefetchImages(normalized.map(n => n.Poster));
          // allow DOM to update then init Swiper
          setTimeout(() => initSwipers(), 200);
        }
      } catch (e) {
        // fail silently
        // eslint-disable-next-line no-console
        console.warn('Failed to load posters', e);
      }
    }

    loadPosters();
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

  function initSwipers() {
    if (!window.Swiper) return;
    try {
      new window.Swiper('.popular-movies-slider', { slidesPerView: 'auto', spaceBetween: 48, navigation: { nextEl: '.swiper-button-next-popular', prevEl: '.swiper-button-prev-popular' }, breakpoints: { 640: { spaceBetween: 48 }, 1024: { spaceBetween: 48 } } });
      new window.Swiper('.new-releases-slider', { slidesPerView: 'auto', spaceBetween: 48, navigation: { nextEl: '.swiper-button-next-new', prevEl: '.swiper-button-prev-new' }, breakpoints: { 640: { spaceBetween: 48 }, 1024: { spaceBetween: 48 } } });
      new window.Swiper('.awards-slider', { slidesPerView: 'auto', spaceBetween: 48, navigation: { nextEl: '.swiper-button-next-awards', prevEl: '.swiper-button-prev-awards' }, breakpoints: { 640: { spaceBetween: 48 }, 1024: { spaceBetween: 48 } } });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Swiper init failed', e);
    }
  }

  async function fetchCategory(cat) {
    setActiveCategory(cat);
    if (cat === 'All') {
      // reload random posters
      try {
        const res = await fetch(`${API_BASE}/random-posters?count=12`);
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          const normalized = data.map((u, i) => ({ Poster: u, Title: `Poster ${i + 1}`, imdbID: `poster-${i}` }));
          setPosters(normalized);
          setTimeout(() => initSwipers(), 200);
        }
      } catch (e) {
        // ignore
      }
      return;
    }

    // search OMDB for this category as keyword, restrict to movies
    try {
      const url = `${API_BASE}/search?query=${encodeURIComponent(cat)}&page=1&type=movie`;
      const data = await fetchJsonWithCache(url);
      if (data && Array.isArray(data.Search) && data.Search.length) {
        setPosters(data.Search);
        prefetchImages(data.Search.map(s => s.Poster).filter(Boolean));
        setTimeout(() => initSwipers(), 200);
      } else {
        // fallback to random posters
        setPosters([]);
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="bg-cineflix-dark text-white">
      <style>{`
        .hero-gradient { background: linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0) 50%, rgba(20,20,20,1) 100%); }
        .swiper-button-next, .swiper-button-prev { color: #E50914 !important; background: rgba(0,0,0,0.5); width:40px !important; height:60px !important; border-radius:4px; transition: all 0.3s ease; opacity:0; }
        .swiper-button-next:hover, .swiper-button-prev:hover { background: rgba(0,0,0,0.8); transform: scale(1.1); }
        .swiper-button-next:after, .swiper-button-prev:after { font-size:24px !important; }
        .swiper-container:hover .swiper-button-next, .swiper-container:hover .swiper-button-prev { opacity:1; }
        .swiper-slide { width: auto !important; transition: transform 0.25s ease; }
        .swiper-slide:hover { transform: scale(1.03); z-index:10; }
        .movie-card { transition: all 0.25s ease; transform-origin: center bottom; border-radius:8px; overflow:hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
        .movie-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 18px 40px rgba(0,0,0,0.6); }
        .movie-card img { transition: transform 0.5s ease; height: 20rem; width: 100%; object-fit: cover; display:block; }
        .movie-card:hover img { transform: scale(1.05); }
        .play-button { transform: translateY(18px); opacity:0; transition: all 0.25s ease; padding:10px 14px; border-radius:9999px; display:inline-flex; align-items:center; justify-content:center; gap:8px; font-weight:600; box-shadow: 0 6px 18px rgba(0,0,0,0.5); }
        .movie-card:hover .play-button { transform: translateY(0); opacity:1; }
        .movie-card .play-button i { margin-right:0; }
        .badge { transition: all 0.3s ease; }
        .movie-card:hover .badge { transform: translateY(-5px); }
        .section-header { position: relative; }
        .section-header:after { content:''; position:absolute; bottom:-5px; left:0; width:0; height:2px; background:#E50914; transition: width 0.3s ease; }
        .section-header:hover:after { width:100%; }
        .featured-movie { transition: all 0.3s ease; }
        .featured-movie:hover { box-shadow: 0 15px 30px rgba(0,0,0,0.7); }
        .category-btn { transition: all 0.2s ease; }
        .category-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 10px rgba(0,0,0,0.2); }
      `}</style>

      <nav className="fixed w-full z-50 bg-gradient-to-b from-black to-transparent px-4 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-3xl font-bold text-cineflix-red hover:text-red-600 transition-colors duration-300">CineFlix</a>
          <div className="hidden md:flex ml-8 space-x-6">
            <Link to="/" className="hover:text-gray-300 transition-colors duration-300">Home</Link>
            <Link to="/tvshows" className="hover:text-gray-300 transition-colors duration-300">TV Shows</Link>
            <Link to="/movies" className="text-white font-semibold hover:text-gray-300 transition-colors duration-300">Movies</Link>
            <Link to="/news" className="hover:text-gray-300 transition-colors duration-300">New & Popular</Link>
            <Link to="/list" className="hover:text-gray-300 transition-colors duration-300">My List</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block"><i className="fas fa-search hover:text-gray-300 cursor-pointer transition-colors duration-300"></i></div>
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Movies</h1>

        <div className="flex space-x-4 mb-8 overflow-x-auto pb-4">
          {['All', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Documentary'].map(cat => (
            <button key={cat} onClick={() => fetchCategory(cat)} className={`category-btn whitespace-nowrap px-4 py-2 rounded-md ${activeCategory === cat ? 'bg-cineflix-red' : 'bg-cineflix-gray'} hover:opacity-90`}>{cat}</button>
          ))}
        </div>

        <div className="mb-12 featured-movie">
          <h2 className="section-header text-xl md:text-2xl font-bold mb-6">Featured Today</h2>
          <div className="relative group rounded-lg overflow-hidden">
            <img src="https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" alt="The Batman" className="w-full h-64 md:h-96 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-lg"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 transition-all duration-300 group-hover:text-cineflix-red">The Batman</h3>
              <p className="text-gray-300 mb-4 max-w-2xl transition-all duration-300 group-hover:text-white">When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.</p>
              <div className="flex space-x-4">
                <button onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } }} className="bg-white text-black px-6 py-2 rounded flex items-center hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"><i className="fas fa-play mr-2"></i> Play</button>
                <Link to="/movie/batman" onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="bg-cineflix-gray bg-opacity-70 px-6 py-2 rounded flex items-center hover:bg-opacity-50 transition-all duration-300 transform hover:scale-105"><i className="fas fa-info-circle mr-2"></i> More Info</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-header text-xl md:text-2xl font-bold">Popular Movies</h2>
            <div className="flex space-x-4">
              <div className="swiper-button-prev-popular hidden md:block cursor-pointer transition-all duration-300 hover:text-cineflix-red"><i className="fas fa-chevron-left text-2xl"></i></div>
              <div className="swiper-button-next-popular hidden md:block cursor-pointer transition-all duration-300 hover:text-cineflix-red"><i className="fas fa-chevron-right text-2xl"></i></div>
            </div>
          </div>
        </div>

        <div className="swiper-container popular-movies-slider">
          <div className="swiper-wrapper gap-5">
            {(posters.length ? posters.slice(0, 4) : [null, null, null, null]).map((p, i) => (
              <div className="swiper-slide" key={i} style={{ width: 150 }}>
                <div className="movie-card relative rounded overflow-hidden h-full group">
                  <img
                    src={p || 'https://via.placeholder.com/300x450?text=Movie'}
                    alt={`Movie ${i}`}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-2 right-2 z-20 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLoggedIn) { setLoginModalOpen(true); return; }
                        const obj = {
                          poster: p || '',
                          title: 'Unknown',
                          id: encodeURIComponent(p || `movie-${i}`)
                        };
                        import('../lib/myList').then(m => {
                          m.toggleWishlist(obj);
                          window.dispatchEvent(new Event('storage'));
                        });
                      }}
                      className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 text-white"
                      title="Wishlist"
                    >
                      <i className="fas fa-bookmark"></i>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLoggedIn) { setLoginModalOpen(true); return; }
                        const obj = {
                          poster: p || '',
                          title: 'Unknown',
                          id: encodeURIComponent(p || `movie-${i}`)
                        };
                        import('../lib/myList').then(m => {
                          m.toggleFavorite(obj);
                          window.dispatchEvent(new Event('storage'));
                        });
                      }}
                      className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 text-white"
                      title="Favourite"
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <button onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } }} className="play-button bg-cineflix-red text-white px-4 py-2 rounded flex items-center gap-2">
                          <i className="fas fa-play"></i>
                          <span className="hidden md:inline">Play</span>
                        </button>
                        <Link to={`/movie/${encodeURIComponent(p || `movie-${i}`)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="bg-white bg-opacity-10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-opacity-20">
                          <i className="fas fa-info-circle"></i>
                          <span className="hidden md:inline">More Info</span>
                        </Link>
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-header text-xl md:text-2xl font-bold">New Releases</h2>
            <div className="flex space-x-4">
              <div className="swiper-button-prev-new hidden md:block cursor-pointer transition-all duration-300 hover:text-cineflix-red"><i className="fas fa-chevron-left text-2xl"></i></div>
              <div className="swiper-button-next-new hidden md:block cursor-pointer transition-all duration-300 hover:text-cineflix-red"><i className="fas fa-chevron-right text-2xl"></i></div>
            </div>
          </div>

          <div className="swiper-container new-releases-slider">
            <div className="swiper-wrapper gap-5">
              {(posters.length ? posters.slice(4, 8) : [null, null, null, null]).map((p, i) => (
                <div className="swiper-slide" key={i} style={{ width: 150 }}>
                  <div className="movie-card relative rounded overflow-hidden h-full">
                    <div className="badge absolute top-2 left-2 bg-cineflix-red text-white text-xs font-bold px-2 py-1 rounded z-10 transition-transform">NEW</div>
                    <img src={p || 'https://via.placeholder.com/300x450?text=New'} alt={`New ${i}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <button onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } }} className="play-button bg-cineflix-red text-white px-4 py-2 rounded flex items-center gap-2"><i className="fas fa-play"></i><span className="hidden md:inline">Play</span></button>
                        <Link to={`/movie/${encodeURIComponent(p || `new-${i}`)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="bg-white bg-opacity-10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-opacity-20"><i className="fas fa-info-circle"></i><span className="hidden md:inline">More Info</span></Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-header text-xl md:text-2xl font-bold">Award-Winning Movies</h2>
            <div className="flex space-x-4">
              <div className="swiper-button-prev-awards hidden md:block cursor-pointer transition-all duration-300 hover:text-cineflix-red"><i className="fas fa-chevron-left text-2xl"></i></div>
              <div className="swiper-button-next-awards hidden md:block cursor-pointer transition-all duration-300 hover:text-cineflix-red"><i className="fas fa-chevron-right text-2xl"></i></div>
            </div>
          </div>

          <div className="swiper-container awards-slider">
            <div className="swiper-wrapper gap-5">
              {(posters.length ? posters.slice(0, 4) : [null, null, null, null]).map((p, i) => {
                const posterUrl = p ? (typeof p === 'string' ? p : p.Poster) : null;
                const title = p ? (p.Title || 'Unknown') : '';
                const id = p ? (p.imdbID || p.id || `slide-${i}`) : `slide-${i}`;
                return (
                  <div className="swiper-slide" key={i} style={{ width: 150 }}>
                    <div className="movie-card relative rounded overflow-hidden h-full">
                      <img src={posterUrl || 'https://via.placeholder.com/300x450?text=Movie'} alt={title || `Movie ${i}`} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 z-20 flex space-x-2">
                        <button onClick={(e) => { e.stopPropagation(); const obj = { poster: posterUrl || '', title, id }; import('../lib/myList').then(m => { m.toggleWishlist(obj); window.dispatchEvent(new Event('storage')); }); }} className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 text-white" title="Wishlist"><i className="fas fa-bookmark"></i></button>
                        <button onClick={(e) => { e.stopPropagation(); const obj = { poster: posterUrl || '', title, id }; import('../lib/myList').then(m => { m.toggleFavorite(obj); window.dispatchEvent(new Event('storage')); }); }} className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-90 text-white" title="Favourite"><i className="fas fa-heart"></i></button>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                        <div className="flex items-center gap-3">
                          <button onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } }} className="play-button bg-cineflix-red text-white px-4 py-2 rounded flex items-center gap-2"><i className="fas fa-play"></i><span className="hidden md:inline">Play</span></button>
                          <Link to={`/movie/${encodeURIComponent(posterUrl || `award-${i}`)}`} onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); setLoginModalOpen(true); } }} className="bg-white bg-opacity-10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-opacity-20"><i className="fas fa-info-circle"></i><span className="hidden md:inline">More Info</span></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-t from-black via-gray-900 to-transparent text-gray-300 px-4 md:px-12 py-10 border-t border-gray-600">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div>
            <a href="/" className="text-2xl font-bold text-cineflix-red">CineFlix</a>
            <p className="mt-3 text-sm text-gray-400">A better way to discover and save movies you love.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Browse</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/movies" className="hover:text-white">All Movies</a></li>
              <li><a href="/tvshows" className="hover:text-white">TV Shows</a></li>
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
            <h4 className="font-semibold mb-3">Newsletter</h4>
            <form onSubmit={(e)=>{e.preventDefault(); alert('Subscribed');}} className="flex gap-2">
              <input type="email" placeholder="Email" className="flex-1 px-3 py-2 rounded bg-gray-800 text-white text-sm" />
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
            <div className="text-gray-400">Built for movie lovers</div>
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
