import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../lib/config';

export default function SettingsPlayback() {
  const [form, setForm] = useState({ autoplay: true, quality: 'Auto' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    document.title = 'Playback Settings | Cineflix';
    const token = localStorage.getItem('cineflix_token');
    if (!token) {
      setLoading(false);
      setError('Please sign in to manage playback settings.');
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
          setForm({
            autoplay: !!data.playback?.autoplay,
            quality: data.playback?.quality || 'Auto',
          });
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
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `${API_URL}/settings`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus('Playback settings saved.');
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
      playback: {
        autoplay: form.autoplay,
        quality: form.quality,
      },
    }));
  }

  return (
    <div className="min-h-screen bg-cineflix-dark text-white px-4 md:px-12 pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Playback Settings</h1>
          <Link to="/profile" className="text-sm text-netflix-red hover:underline">Back to Profile</Link>
        </div>
        <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          {loading ? (
            <p className="text-gray-300">Loading settings...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.autoplay}
                  onChange={() => setForm((p) => ({ ...p, autoplay: !p.autoplay }))}
                />
                <span>Autoplay next episode</span>
              </label>
              <div>
                <label className="text-sm text-gray-300" htmlFor="quality">Playback quality</label>
                <select
                  id="quality"
                  value={form.quality}
                  onChange={(e) => setForm((p) => ({ ...p, quality: e.target.value }))}
                  className="mt-1 w-full rounded bg-black/40 border border-white/10 px-3 py-2 text-white"
                >
                  <option>Auto</option>
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </div>
              {error && <div className="text-sm text-red-300">{error}</div>}
              {status && <div className="text-sm text-green-300">{status}</div>}
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-netflix-red rounded text-sm font-semibold disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save settings'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
