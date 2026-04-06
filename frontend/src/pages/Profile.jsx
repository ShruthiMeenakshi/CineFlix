import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiHeart, FiBookmark, FiClock, FiSettings, 
  FiLogOut, FiStar, FiTrendingUp, FiAward, FiFilm,
  FiCalendar, FiEye, FiThumbsUp, FiMessageCircle,
  FiBell, FiMenu, FiX, FiChevronRight, FiPlay,
  FiPlus, FiCheck, FiActivity, FiBarChart2
} from 'react-icons/fi';
import { getFavorites, getWishlist } from '../lib/myList';
import { API_URL } from '../lib/config';

export default function Profile() {
  const [favs, setFavs] = useState([]);
  const [wish, setWish] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState('');
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('cineflix_profile_theme');
    return stored === 'light' ? 'light' : 'dark';
  });
  const [stats, setStats] = useState({
    moviesWatched: 0,
    hoursSpent: 0,
    reviews: 0,
    daysActive: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = 'Profile | Cineflix';
    setFavs(getFavorites());
    setWish(getWishlist());

    try {
      const storedUser = localStorage.getItem('cineflix_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      setUser(null);
    }

    const token = localStorage.getItem('cineflix_token');
    if (token) {
      setProfileLoading(true);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${API_URL}/profile`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText || '{}');
            setProfile(data);
            setProfileError('');
          } catch (e) {
            setProfileError('Profile parse failed');
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText || '{}');
            setProfileError(err.error || 'Profile fetch failed');
          } catch (e) {
            setProfileError('Profile fetch failed');
          }
        }
        setProfileLoading(false);
      };
      xhr.onerror = () => {
        setProfileError('Profile fetch failed');
        setProfileLoading(false);
      };
      xhr.send();

      setRecLoading(true);
      const recXhr = new XMLHttpRequest();
      recXhr.open('GET', `${API_URL}/recommendations`, true);
      recXhr.setRequestHeader('Authorization', `Bearer ${token}`);
      recXhr.onreadystatechange = () => {
        if (recXhr.readyState !== XMLHttpRequest.DONE) return;
        if (recXhr.status >= 200 && recXhr.status < 300) {
          try {
            const data = JSON.parse(recXhr.responseText || '[]');
            setRecommendations(Array.isArray(data) ? data : []);
            setRecError('');
          } catch (e) {
            setRecError('Recommendations parse failed');
          }
        } else {
          try {
            const err = JSON.parse(recXhr.responseText || '{}');
            setRecError(err.error || 'Recommendations fetch failed');
          } catch (e) {
            setRecError('Recommendations fetch failed');
          }
        }
        setRecLoading(false);
      };
      recXhr.onerror = () => {
        setRecError('Recommendations fetch failed');
        setRecLoading(false);
      };
      recXhr.send();
    } else {
      setProfileLoading(false);
    }
    
    const onStorage = () => { 
      setFavs(getFavorites()); 
      setWish(getWishlist()); 
    };
    
    window.addEventListener('storage', onStorage);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const watchedCount = favs.length;
    const reviewCount = recentActivity.filter((a) => a.type === 'review').length;
    const daysActive = Math.max(1, favs.length + wish.length);
    const hoursSpent = watchedCount * 2;

    setStats({
      moviesWatched: watchedCount,
      hoursSpent,
      reviews: reviewCount,
      daysActive
    });
  }, [favs, wish, recentActivity]);

  useEffect(() => {
    const favActs = favs.map((item, idx) => ({
      type: 'favorite',
      title: item.title,
      poster: item.poster,
      ts: item.addedAt || (Date.now() - idx * 60 * 1000),
    }));
    const wishActs = wish.map((item, idx) => ({
      type: 'wishlist',
      title: item.title,
      poster: item.poster,
      ts: item.addedAt || (Date.now() - idx * 60 * 1000),
    }));

    const merged = [...favActs, ...wishActs]
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 6)
      .map((item) => ({
        ...item,
        time: formatRelativeTime(item.ts),
      }));

    setRecentActivity(merged);
  }, [favs, wish]);

  useEffect(() => {
    localStorage.setItem('cineflix_profile_theme', theme);
  }, [theme]);

  const handleSignOut = () => {
    localStorage.removeItem('cineflix_user');
    localStorage.removeItem('cineflix_token');
    navigate('/');
  };

  const getInitials = (value) => {
    const cleaned = (value || '').trim();
    if (!cleaned) return 'U';
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const effectiveProfile = profile || user || {};
  const displayName = effectiveProfile.displayName || effectiveProfile.username || effectiveProfile.email || 'Member';
  const emailText = effectiveProfile.email || '';
  const initials = getInitials(displayName);

  const formatRelativeTime = (ts) => {
    if (!ts) return 'Recently';
    const diffMs = Date.now() - ts;
    if (diffMs < 60 * 1000) return 'Just now';
    const minutes = Math.floor(diffMs / (60 * 1000));
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'watch': return <FiPlay className="text-green-500" />;
      case 'favorite': return <FiHeart className="text-red-500" />;
      case 'wishlist': return <FiBookmark className="text-yellow-500" />;
      case 'review': return <FiMessageCircle className="text-blue-500" />;
      default: return <FiFilm className="text-gray-500" />;
    }
  };

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-netflix-red/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && <p className="text-xs text-green-500 mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const MovieCard = ({ movie, type }) => (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.2 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setHoveredItem(movie.id)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <Link to={`/movie/${encodeURIComponent(movie.title)}`} className="block">
        <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
          <img 
            src={movie.poster || 'https://via.placeholder.com/150x225?text=No+Poster'} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Hover Overlay */}
          {hoveredItem === movie.id && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent"
            >
              <p className="text-white text-sm font-semibold truncate">{movie.title}</p>
              <p className="text-xs text-gray-300">{type}</p>
            </motion.div>
          )}
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className={`profile-theme-${theme} bg-cineflix-dark text-white min-h-screen overflow-x-hidden`}>
      <style>{`
        .profile-theme-light { background: #f6f7fb; color: #ffffff; }
        .profile-theme-light .text-white { color: #ffffff !important; }
        .profile-theme-light .text-gray-300 { color: #ffffff !important; }
        .profile-theme-light .text-gray-400 { color: #ffffff !important; }
        .profile-theme-light .bg-cineflix-dark { background: #f6f7fb !important; }
        .profile-theme-light .bg-black { background: #ffffff !important; }
        .profile-theme-light .bg-black\/40 { background: rgba(255,255,255,0.7) !important; }
        .profile-theme-light .bg-black\/20 { background: rgba(255,255,255,0.7) !important; }
        .profile-theme-light .bg-white\/10 { background: rgba(0,0,0,0.06) !important; }
        .profile-theme-light .border-white\/10 { border-color: rgba(0,0,0,0.08) !important; }
        .profile-theme-light .from-cineflix-dark { --tw-gradient-from: rgba(246,247,251,0.6) !important; }
        .profile-theme-light .via-cineflix-dark\/95 { --tw-gradient-via: rgba(243,244,246,0.45) !important; }
        .profile-theme-light .to-black { --tw-gradient-to: rgba(229,231,235,0) !important; }
        .profile-theme-dark .text-gray-300 { color: #ffffff !important; }
        .profile-theme-dark .text-gray-400 { color: #ffffff !important; }

        .diamond-layer { pointer-events: none; position: absolute; inset: 0; overflow: hidden; }
        .diamond {
          position: absolute;
          width: 220px;
          height: 220px;
          transform: rotate(45deg);
          background: radial-gradient(circle at 30% 30%, rgba(229,9,20,0.5), rgba(229,9,20,0.08) 60%, transparent 70%);
          border: 1px solid rgba(229,9,20,0.2);
          box-shadow: 0 0 40px rgba(229,9,20,0.25);
          animation: diamondFloat 14s ease-in-out infinite;
        }
        .diamond.small { width: 120px; height: 120px; opacity: 0.7; animation-duration: 10s; }
        .diamond.large { width: 320px; height: 320px; opacity: 0.6; animation-duration: 18s; }

        @keyframes diamondFloat {
          0% { transform: translate3d(0, 0, 0) rotate(45deg) scale(1); opacity: 0.55; }
          50% { transform: translate3d(40px, -30px, 0) rotate(45deg) scale(1.06); opacity: 0.9; }
          100% { transform: translate3d(0, 0, 0) rotate(45deg) scale(1); opacity: 0.55; }
        }
      `}</style>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cineflix-dark/70 via-cineflix-dark/50 to-transparent" />
        <div className="diamond-layer">
          <div className="diamond large" style={{ top: '-6%', left: '8%' }} />
          <div className="diamond" style={{ top: '22%', right: '10%' }} />
          <div className="diamond small" style={{ bottom: '18%', left: '18%' }} />
          <div className="diamond" style={{ bottom: '-8%', right: '22%' }} />
          <div className="diamond small" style={{ top: '55%', left: '52%' }} />
        </div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-netflix-red/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10"
      >
        {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      <div className="w-full px-4 md:px-8 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 768) && (
              <motion.aside 
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-1 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md rounded-2xl p-6 sticky top-24 h-fit border border-white/10"
              >
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="w-28 h-28 rounded-full border-4 border-netflix-red shadow-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-3xl font-bold text-white">
                      {initials}
                    </div>
                  </motion.div>
                  <h2 className="text-xl font-bold mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {displayName}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {profileLoading ? 'Loading profile...' : (profileError ? profileError : (emailText || 'Member'))}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-2 py-1 bg-netflix-red/20 text-netflix-red text-xs rounded-full">Premium Member</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">Verified</span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="mt-6">
                  <ul className="space-y-2">
                    {[
                      { id: 'dashboard', label: 'Dashboard', icon: FiActivity },
                      { id: 'my-list', label: 'My List', icon: FiFilm },
                      { id: 'favorites', label: 'Favorites', icon: FiHeart },
                      { id: 'watchlist', label: 'Watchlist', icon: FiBookmark },
                      { id: 'history', label: 'History', icon: FiClock },
                      { id: 'settings', label: 'Settings', icon: FiSettings }
                    ].map((item) => (
                      <motion.li key={item.id} whileHover={{ x: 5 }}>
                        <a
                          href={`#${item.id}`}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            activeTab === item.id
                              ? 'bg-netflix-red text-white shadow-lg'
                              : 'hover:bg-white/10 text-gray-300'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                          {activeTab === item.id && (
                            <motion.div
                              layoutId="activeTab"
                              className="ml-auto w-1 h-6 bg-white rounded-full"
                            />
                          )}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Sign Out Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </motion.button>

                <button
                  onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors"
                >
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>

                {/* Plan Info */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex justify-between">
                      <span>Current Plan:</span>
                      <strong className="text-white">Premium</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Billing:</span>
                      <strong className="text-white">April 15, 2026</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <strong className="text-white">English</strong>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full mt-3 px-3 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-colors"
                  >
                    Upgrade Plan
                  </motion.button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Dashboard */}
          <main className="col-span-1 md:col-span-3 space-y-6">
            {/* Welcome Banner */}
            <motion.div
              id="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-netflix-red/20 via-purple-600/20 to-blue-600/20 p-6"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200')] bg-cover bg-center opacity-10" />
              <div className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, <span className="text-gradient">{displayName}!</span>
                </h1>
                <p className="text-gray-300">Ready for your next cinematic adventure?</p>
                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-netflix-red rounded-lg text-sm font-semibold flex items-center gap-2"
                  >
                    <FiPlay className="w-4 h-4" />
                    Continue Watching
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/"
                      className="px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold backdrop-blur-sm flex items-center gap-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      Explore New
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <StatCard icon={FiFilm} label="Movies Watched" value={stats.moviesWatched} trend="+12 this month" color="from-netflix-red to-red-600" />
              <StatCard icon={FiClock} label="Hours Spent" value={stats.hoursSpent} trend="128 total hours" color="from-purple-600 to-purple-800" />
              <StatCard icon={FiStar} label="Reviews" value={stats.reviews} trend="94% positive" color="from-yellow-500 to-orange-600" />
              <StatCard icon={FiAward} label="Days Active" value={stats.daysActive} trend="1 year streak!" color="from-green-500 to-emerald-600" />
            </motion.div>

            <span id="my-list" className="sr-only"></span>
            {/* Favorites & Wishlist Section */}
            <motion.div
              id="favorites"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Favorites */}
              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FiHeart className="text-red-500" />
                      Favorites
                    </h3>
                    <p className="text-sm text-gray-400">{favs.length} items in your collection</p>
                  </div>
                  {favs.length > 6 && (
                    <a href="#favorites" className="text-sm text-netflix-red hover:underline">
                      View All →
                    </a>
                  )}
                </div>

                {favs.length === 0 ? (
                  <div className="text-center py-8">
                    <FiHeart className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400">No favorites yet</p>
                    <Link to="/movies" className="text-netflix-red text-sm hover:underline mt-2 inline-block">
                      Browse Movies →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {favs.slice(0, 6).map((movie) => (
                      <MovieCard key={movie.id} movie={movie} type="Favorite" />
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <div id="watchlist" className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FiBookmark className="text-yellow-500" />
                      Wishlist
                    </h3>
                    <p className="text-sm text-gray-400">{wish.length} movies to watch</p>
                  </div>
                  {wish.length > 6 && (
                    <a href="#watchlist" className="text-sm text-netflix-red hover:underline">
                      View All →
                    </a>
                  )}
                </div>
                
                {wish.length === 0 ? (
                  <div className="text-center py-8">
                    <FiBookmark className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400">Your wishlist is empty</p>
                    <Link to="/movies" className="text-netflix-red text-sm hover:underline mt-2 inline-block">
                      Discover Movies →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {wish.slice(0, 6).map((movie) => (
                      <MovieCard key={movie.id} movie={movie} type="Watch Later" />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Activity & Preferences */}
            <motion.div
              id="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiTrendingUp className="text-blue-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={activity.poster} alt={activity.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {getActivityIcon(activity.type)}
                          <span>{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                      <FiChevronRight className="text-gray-500 text-sm" />
                    </motion.div>
                  ))}
                </div>
                <a href="#history" className="block text-center mt-4 text-sm text-netflix-red hover:underline">
                  View Full History →
                </a>
              </div>

              {/* Preferences & Settings */}
              <div id="settings" className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiSettings className="text-gray-400" />
                  Quick Settings
                </h3>
                <div className="space-y-3">
                  {[
                    { id: 'settings-edit-profile', icon: FiUser, label: 'Edit Profile', description: 'Update your personal information', href: '/settings/edit-profile' },
                    { id: 'settings-notifications', icon: FiBell, label: 'Notifications', description: 'Manage your alerts', href: '/settings/notifications' },
                    { id: 'settings-playback', icon: FiEye, label: 'Playback Settings', description: 'Video quality, autoplay', href: '/settings/playback' },
                    { id: 'settings-preferences', icon: FiThumbsUp, label: 'Content Preferences', description: 'Genres, languages, maturity', href: '/settings/preferences' }
                  ].map((setting, idx) => (
                    <motion.a
                      key={idx}
                      id={setting.id}
                      href={setting.href}
                      whileHover={{ x: 5 }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 text-left"
                    >
                      <div className="p-2 bg-white/5 rounded-lg">
                        <setting.icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{setting.label}</p>
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      </div>
                      <FiChevronRight className="text-gray-500" />
                    </motion.a>
                  ))}
                </div>

                {/* Account Stats */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Account Status</span>
                    <span className="text-green-500 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Active
                    </span>
                  </div>
                  <div className="mt-2 bg-white/10 rounded-full h-1 overflow-hidden">
                    <div className="bg-gradient-to-r from-netflix-red to-purple-600 h-full w-3/4 rounded-full" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">75% of premium features used</p>
                </div>
              </div>
            </motion.div>

            {/* Recommendations Section */}
            <motion.div
              id="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiStar className="text-yellow-500" />
                    Recommended For You
                  </h3>
                  <p className="text-sm text-gray-400">Based on your watch history</p>
                </div>
                <a href="#recommendations" className="text-sm text-netflix-red hover:underline">
                  View All →
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {recLoading && (
                  <p className="text-sm text-gray-300">Loading recommendations...</p>
                )}
                {!recLoading && recError && (
                  <p className="text-sm text-gray-300">{recError}</p>
                )}
                {!recLoading && !recError && recommendations.length === 0 && (
                  <p className="text-sm text-gray-300">No recommendations yet.</p>
                )}
                {!recLoading && !recError && recommendations.length > 0 && recommendations.map((item, idx) => (
                  <motion.div
                    key={`${item.imdbId || item.title || idx}`}
                    whileHover={{ scale: 1.05 }}
                    className="relative group cursor-pointer"
                  >
                    <Link to={`/movie/${encodeURIComponent(item.title || 'movie')}`} className="block">
                      <div className="rounded-lg overflow-hidden aspect-[2/3]">
                        <img 
                          src={item.poster || 'https://via.placeholder.com/150x225?text=Movie'}
                          alt={item.title || 'Recommended'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                    <div className="mt-2">
                      <p className="text-sm font-medium truncate">{item.title || 'Recommended'}</p>
                      <p className="text-xs text-gray-400">{item.year || '—'} • {item.type || 'Movie'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}