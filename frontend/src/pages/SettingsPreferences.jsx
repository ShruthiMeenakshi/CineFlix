import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../lib/config';

export default function SettingsPreferences() {
  const [form, setForm] = useState({ genres: '', languages: '', maturity: 'PG-13' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    document.title = 'Content Preferences | Cineflix';
    const token = localStorage.getItem('cineflix_token');
    if (!token) {
      setLoading(false);
      setError('Please sign in to manage preferences.');
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${API_URL}/settings`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText || '{}');
          const genres = Array.isArray(data.preferences?.genres) ? data.preferences.genres.join(', ') : '';
          const languages = Array.isArray(data.preferences?.languages) ? data.preferences.languages.join(', ') : '';
          const maturity = data.preferences?.maturity || 'PG-13';
          setForm({ genres, languages, maturity });
          setError('');
        } catch (e) {
          setError('Settings parse failed');
        }
      } else {
        setError('Settings fetch failed');
      }
      setLoading(false);
    };
    xhr.onerror = () => {
      setError('Settings fetch failed');
      setLoading(false);
    };
    xhr.send();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    setError('');
    const token = localStorage.getItem('cineflix_token');
    if (!token) {
      setSaving(false);
      setError('Please sign in to save changes.');
      return;
    }
    const genres = form.genres.split(',').map((g) => g.trim()).filter(Boolean);
    const languages = form.languages.split(',').map((l) => l.trim()).filter(Boolean);
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `${API_URL}/settings`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus('Preferences saved.');
      } else {
        setError('Save failed');
      }
      setSaving(false);
    };
    xhr.onerror = () => {
      setError('Save failed');
      setSaving(false);
    };
    xhr.send(JSON.stringify({
      preferences: {
        genres,
        languages,
        maturity: form.maturity,
      },
    }));
  }

  return (
    <div className="min-h-screen bg-cineflix-dark text-white px-4 md:px-12 pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Content Preferences</h1>
          <Link to="/profile" className="text-sm text-netflix-red hover:underline">Back to Profile</Link>
        </div>
        <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          {loading ? (
            <p className="text-gray-300">Loading settings...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-300" htmlFor="genres">Preferred genres</label>
                <input
                  id="genres"
                  value={form.genres}
                  onChange={(e) => setForm((p) => ({ ...p, genres: e.target.value }))}
                  placeholder="Action, Drama, Sci-Fi"
                  className="mt-1 w-full rounded bg-black/40 border border-white/10 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300" htmlFor="languages">Preferred languages</label>
                <input
                  id="languages"
                  value={form.languages}
                  onChange={(e) => setForm((p) => ({ ...p, languages: e.target.value }))}
                  placeholder="English, Hindi"
                  className="mt-1 w-full rounded bg-black/40 border border-white/10 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300" htmlFor="maturity">Maturity rating</label>
                <select
                  id="maturity"
                  value={form.maturity}
                  onChange={(e) => setForm((p) => ({ ...p, maturity: e.target.value }))}
                  className="mt-1 w-full rounded bg-black/40 border border-white/10 px-3 py-2 text-white"
                >
                  <option>G</option>
                  <option>PG</option>
                  <option>PG-13</option>
                  <option>R</option>
                </select>
              </div>
              {error && <div className="text-sm text-red-300">{error}</div>}
              {status && <div className="text-sm text-green-300">{status}</div>}
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-netflix-red rounded text-sm font-semibold disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save preferences'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
