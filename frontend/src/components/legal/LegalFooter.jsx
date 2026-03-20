import React from 'react';
import { Link } from 'react-router-dom';
import CookieConsent from './CookieConsent';

export default function LegalFooter() {
  return (
    <footer className="mt-12 border-t border-gray-800 pt-6">
      <div className="container mx-auto px-4 text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between">
        <div className="space-x-4 mb-3 md:mb-0">
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
        </div>
        <div>© {new Date().getFullYear()} CineFlix. All rights reserved.</div>
      </div>
      <CookieConsent />
    </footer>
  );
}
