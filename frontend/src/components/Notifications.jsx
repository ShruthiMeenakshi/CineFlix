import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFavorites, getWishlist } from '../lib/myList';

const STORAGE_KEY = 'cineflix:notifications';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function save(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}d`;
}

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(load());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { save(items); }, [items]);

  useEffect(() => {
    function handleMyList(e) {
      try {
        const d = e.detail || {};
        if (d.action !== 'add') return;
        const type = d.type; // 'favorite' or 'wishlist'
        const id = d.id;
        let record = null;
        if (type === 'favorite') record = getFavorites().find(x => x.id === id);
        if (type === 'wishlist') record = getWishlist().find(x => x.id === id);
        const title = (record && record.title) || id || 'Unknown';
        const poster = (record && record.poster) || '';
        const note = { id: `${type}:${id}:${Date.now()}`, movieId: id, title, poster, category: type, ts: Date.now(), read: false };
        setItems(prev => [note, ...prev].slice(0, 50));
      } catch (err) { }
    }

    function handleProfile(e) {
      const d = (e && e.detail) || {};
      const note = { id: `profile:${Date.now()}`, title: d.title || 'Profile updated', poster: '', category: 'profile', ts: Date.now(), data: d, read: false };
      setItems(prev => [note, ...prev].slice(0, 50));
    }

    window.addEventListener('mylist:change', handleMyList);
    window.addEventListener('profile:update', handleProfile);
    return () => { window.removeEventListener('mylist:change', handleMyList); window.removeEventListener('profile:update', handleProfile); };
  }, []);

  useEffect(() => {
    function handleSystemNotice(e) {
      const d = (e && e.detail) || {};
      const note = { id: `system:${Date.now()}`, title: d.title || 'Notification', poster: '', category: 'system', ts: Date.now(), data: d, read: false };
      setItems(prev => [note, ...prev].slice(0, 50));
    }

    window.addEventListener('notify:add', handleSystemNotice);
    return () => window.removeEventListener('notify:add', handleSystemNotice);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    }
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  const unread = items.filter(i => !i.read).length;

  function openAndMark() {
    setOpen(v => !v);
    if (!open) setItems(prev => prev.map(i => ({ ...i, read: true })));
  }

  function handleClear() { setItems([]); }

  function goToMovie(n) {
    if (n && n.title) {
      navigate(`/movie/${encodeURIComponent(n.title)}`);
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={openAndMark} title="Notifications" className="relative p-2 rounded hover:bg-black/20">
        <i className="fas fa-bell"></i>
        {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{unread}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-cineflix-dark border border-gray-700 rounded shadow-lg overflow-hidden z-50">
          <div className="p-2 border-b border-gray-700 flex items-center justify-between">
            <div className="text-sm font-semibold">Notifications</div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setItems(prev => prev.map(i => ({ ...i, read: true })))} className="text-xs px-2 py-1 bg-gray-700 rounded">Mark all read</button>
              <button onClick={handleClear} className="text-xs px-2 py-1 bg-gray-700 rounded">Clear</button>
            </div>
          </div>
          <div className="max-h-64 overflow-auto">
            {items.length === 0 && <div className="p-3 text-sm text-gray-300">No notifications</div>}
            {items.map(n => (
              <div key={n.id} className={`p-3 flex items-start gap-3 hover:bg-black/20 cursor-pointer ${n.read ? 'opacity-70' : ''}`} onClick={() => goToMovie(n)}>
                {n.poster ? <img src={n.poster} alt={n.title} className="w-10 h-14 object-cover rounded" /> : <div className="w-10 h-14 bg-gray-800 rounded" />}
                <div className="flex-1">
                  <div className="text-sm font-semibold">
                    {n.category === 'profile' || n.category === 'system'
                      ? n.title
                      : `${n.title} added to ${n.category === 'favorite' ? 'Favourites' : 'Wishlist'}`}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{timeAgo(n.ts)} ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
