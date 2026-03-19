import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_MOVIES as API_BASE } from '../lib/config';

export default function MovieDetails() {
  const { title } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    document.title = `${title} — Details`;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const sRes = await fetch(`${API_BASE}/search?query=${encodeURIComponent(title)}&page=1`);
        const sJson = await sRes.json();

        let imdb = null;
        if (sJson && sJson.Search && sJson.Search.length > 0) {
          imdb = sJson.Search[0].imdbID;
        }

        if (!imdb) {
          throw new Error('No movie found for: ' + title);
        }

        const dRes = await fetch(`${API_BASE}/${imdb}`);
        const dJson = await dRes.json();
        setDetails(dJson);
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [title]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-400">Error: {error}</div>;

  const poster = details?.Poster && details.Poster !== 'N/A' ? details.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
  const imdbRating = details?.imdbRating || 'N/A';
  const metascore = details?.Metascore && details.Metascore !== 'N/A' ? details.Metascore : null;

  return (
    <div className="bg-cineflix-dark text-white min-h-screen py-8 px-4 md:px-12">
      <Link to="/movies" className="inline-block mb-6 text-cineflix-red hover:underline">← Back to Movies</Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Poster column */}
        <div className="relative">
          <div className="rounded-lg overflow-hidden shadow-xl bg-black">
            <img src={poster} alt={details.Title} className="w-full h-80 object-cover md:h-[28rem]" />
            <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded flex items-center gap-3">
              <div className="text-sm">IMDB</div>
              <div className="text-xl font-bold text-cineflix-red">{imdbRating}</div>
            </div>
            {metascore && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">Metascore: {metascore}</div>
            )}
            <div className="absolute bottom-4 left-4 flex space-x-3">
              <button className="bg-white text-black px-4 py-2 rounded flex items-center gap-2 hover:scale-105"> <i className="fas fa-play"></i> Play</button>
              <a href={details?.Website && details.Website !== 'N/A' ? details.Website : '#'} target="_blank" rel="noreferrer" className="bg-gray-800 bg-opacity-60 px-4 py-2 rounded flex items-center gap-2">Website</a>
            </div>
          </div>
        </div>

        {/* Details column */}
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{details.Title} <span className="text-gray-300 text-lg">({details.Year})</span></h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
            <span className="px-2 py-1 bg-movieshere-gray rounded">{details.Runtime}</span>
            <span className="px-2 py-1 bg-movieshere-gray rounded">{details.Genre}</span>
            <span className="px-2 py-1 bg-movieshere-gray rounded">{details.Rated}</span>
            <span className="px-2 py-1 bg-movieshere-gray rounded">Released: {details.Released}</span>
          </div>

          <p className="text-gray-300 mb-6">{details.Plot}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-200">
            <div>
              <div className="text-sm text-gray-400">Director</div>
              <div className="font-medium">{details.Director}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Writers</div>
              <div className="font-medium">{details.Writer}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Actors</div>
              <div className="font-medium">{details.Actors}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Awards</div>
              <div className="font-medium">{details.Awards}</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <div className="text-sm text-gray-400">IMDB Rating</div>
              <div className="text-2xl font-bold text-cineflix-red">{imdbRating}</div>
            </div>
            {details.Ratings && details.Ratings.length > 0 && (
              <div>
                <div className="text-sm text-gray-400">Other Ratings</div>
                <ul className="text-gray-300">
                  {details.Ratings.map((r, idx) => (
                    <li key={idx} className="text-sm">{r.Source}: {r.Value}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
