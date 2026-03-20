import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Help() {
  useEffect(() => { document.title = 'Help Center | CineFlix'; }, []);

  return (
    <div className="min-h-screen px-6 md:px-12 py-20" style={{background: 'linear-gradient(180deg,#041018 0%, #071526 60%)'}}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-extrabold mb-3 text-white">Help Center</h1>
          <p className="text-gray-300 mb-6">Find answers to common questions about streaming, accounts, and billing.</p>

          <div className="space-y-4">
            <article className="bg-gray-900/40 p-5 rounded-lg">
              <h2 className="font-semibold mb-2">Getting Started</h2>
              <p className="text-gray-300">Create an account, sign in, and start saving titles to your list.</p>
            </article>

            <article className="bg-gray-900/40 p-5 rounded-lg">
              <h2 className="font-semibold mb-2">Billing</h2>
              <p className="text-gray-300">Questions about subscriptions, payments, and invoices.</p>
            </article>

            <article className="bg-gray-900/40 p-5 rounded-lg">
              <h2 className="font-semibold mb-2">Playback</h2>
              <p className="text-gray-300">Troubleshooting playback issues and supported devices.</p>
            </article>
          </div>
        </div>

        <aside className="hidden md:block">
          <div className="bg-gradient-to-tr from-white/3 to-transparent border border-white/5 p-5 rounded-xl text-gray-200">
            <h3 className="font-semibold mb-2">Contact Support</h3>
            <p className="text-sm mb-4">If your issue isn't covered, reach out and we'll help.</p>
            <Link to="/contact" className="inline-block bg-cineflix-red px-4 py-2 rounded">Contact</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
