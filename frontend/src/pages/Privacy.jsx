import React, { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => { document.title = 'Privacy & Terms | CineFlix'; }, []);

  return (
    <div className="min-h-screen px-6 md:px-12 py-20" style={{background: 'radial-gradient(1200px 400px at 10% 10%, rgba(255,40,60,0.04), transparent), linear-gradient(180deg,#041018 0%, #071018 60%)'}}>
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/3 to-transparent border border-white/5 p-8 rounded-xl text-white/95">
        <h1 className="text-3xl font-bold mb-4">Privacy & Terms</h1>
        <p className="text-gray-300 mb-6">This is a demo application. We respect your privacy. No real data is collected or shared.</p>

        <div className="space-y-6">
          <section className="bg-gray-900/40 p-4 rounded">
            <h2 className="font-semibold mb-2">Terms of Use</h2>
            <p className="text-gray-300">Use CineFlix for personal, non-commercial purposes only. All content is for demonstration.</p>
          </section>

          <section className="bg-gray-900/40 p-4 rounded">
            <h2 className="font-semibold mb-2">Cookies</h2>
            <p className="text-gray-300">We may use cookies for session and preference persistence in this demo.</p>
          </section>

          <section className="bg-gray-900/40 p-4 rounded">
            <h2 className="font-semibold mb-2">Contact</h2>
            <p className="text-gray-300">For privacy concerns, contact privacy@cineflix.example.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
