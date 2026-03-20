import React, { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem('cineflix_cookie_consent');
      if (!accepted) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, []);

  function accept() {
    try { localStorage.setItem('cineflix_cookie_consent', '1'); } catch (e) {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50">
      <div className="bg-gray-900 bg-opacity-90 text-gray-100 p-4 rounded shadow-lg flex items-center justify-between gap-4">
        <div className="flex-1">
          <strong>We use cookies</strong>
          <div className="text-sm text-gray-300">We use cookies to improve your experience. By continuing, you accept our cookie policy.</div>
        </div>
        <div>
          <button onClick={accept} className="bg-cineflix-red text-white px-4 py-2 rounded">Accept</button>
        </div>
      </div>
    </div>
  );
}
