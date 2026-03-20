import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/tvshows', label: 'TV Shows' },
    { to: '/avengers', label: 'Avengers' },
    { to: '/news', label: 'News' },
    { to: '/list', label: 'My List' },
    { to: '/profile', label: 'Profile' },
    { to: '/help', label: 'Help' },
    { to: '/contact', label: 'Contact' },
    { to: '/privacy', label: 'Privacy' },
    { to: '/terms', label: 'Terms' }
  ];

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 text-white">
        <FiMenu className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-gray-900 text-white p-6 shadow-lg z-[10000]">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-bold">Menu</div>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-3">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-white/5">
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 text-sm text-gray-400">© {new Date().getFullYear()} CineFlix</div>
          </div>
        </div>
      )}
    </div>
  );
}
