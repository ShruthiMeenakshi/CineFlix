import React, { useEffect, useState } from 'react';

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onChange(e) {
      const d = e.detail || {};
      let text = '';
      if (d.type === 'favorite') {
        text = d.action === 'add' ? 'Added to favourites' : 'Removed from favourites';
      } else if (d.type === 'wishlist') {
        text = d.action === 'add' ? 'Added to wishlist' : 'Removed from wishlist';
      } else {
        text = 'List updated';
      }
      const id = Date.now() + Math.random();
      setToasts(t => [...t, { id, text }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
    }

    window.addEventListener('mylist:change', onChange);
    return () => window.removeEventListener('mylist:change', onChange);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-20 z-60 flex flex-col space-y-2">
      {toasts.map(t => (
        <div key={t.id} className="bg-black bg-opacity-80 text-white px-4 py-2 rounded shadow-lg">{t.text}</div>
      ))}
    </div>
  );
}
