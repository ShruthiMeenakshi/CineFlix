import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SettingsEditProfile() {
  useEffect(() => {
    document.title = 'Edit Profile | Cineflix';
  }, []);

  return (
    <div className="min-h-screen bg-cineflix-dark text-white px-4 md:px-12 pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Edit Profile</h1>
          <Link to="/profile" className="text-sm text-netflix-red hover:underline">Back to Profile</Link>
        </div>
        <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <p className="text-gray-300">Update your personal information here.</p>
          <div className="mt-4 text-sm text-gray-400">Form fields can be added when the backend supports profile updates.</div>
        </div>
      </div>
    </div>
  );
}
