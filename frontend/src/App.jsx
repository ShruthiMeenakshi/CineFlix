import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Movies from './pages/Movies.jsx';
import Avengers from './pages/Avengers.jsx';
import News from './pages/News.jsx';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/avengers" element={<Avengers />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </div>
  );
}
