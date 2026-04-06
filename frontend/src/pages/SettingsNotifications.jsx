import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../lib/config';

export default function SettingsNotifications() {
  const [form, setForm] = useState({ email: false, push: false, marketing: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    document.title = 'Notifications | Cineflix';
    const token = localStorage.getItem('cineflix_token');
    if (!token) {
      setLoading(false);
      setError('Please sign in to manage notifications.');
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
            email: !!data.notifications?.email,
            push: !!data.notifications?.push,
            marketing: !!data.notifications?.marketing,
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

  function toggle(name) {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  }

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
        setStatus('Notification preferences saved.');
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
      notifications: {
        email: form.email,
        push: form.push,
        marketing: form.marketing,
      },
    }));
  }

  return (
    <div className="min-h-screen bg-cineflix-dark text-white px-4 md:px-12 pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
          <Link to="/profile" className="text-sm text-netflix-red hover:underline">Back to Profile</Link>
        </div>
        <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          {loading ? (
            <p className="text-gray-300">Loading settings...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.email} onChange={() => toggle('email')} />
                <span>Email notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.push} onChange={() => toggle('push')} />
                <span>Push notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.marketing} onChange={() => toggle('marketing')} />
                <span>Marketing updates</span>
              </label>
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
