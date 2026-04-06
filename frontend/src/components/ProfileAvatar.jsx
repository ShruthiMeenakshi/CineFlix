import React, { useEffect, useMemo, useState } from 'react';

function getInitials(value) {
  const cleaned = (value || '').trim();
  if (!cleaned) return 'U';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ProfileAvatar({
  className = '',
  sizeClassName = 'w-8 h-8',
  title = 'Profile',
}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    function syncUser() {
      try {
        const stored = localStorage.getItem('cineflix_user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch (e) {
        setUser(null);
      }
    }

    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const displayName = useMemo(() => {
    if (!user) return '';
    return user.displayName || user.username || user.email || '';
  }, [user]);

  const initials = getInitials(displayName);

  return (
    <div
      className={`${sizeClassName} rounded flex items-center justify-center bg-gradient-to-br from-red-600 to-red-900 text-white text-xs font-bold ${className}`}
      title={title}
      aria-label={title}
    >
      {initials}
    </div>
  );
}
