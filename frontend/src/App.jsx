import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Movies from './pages/Movies.jsx';
import Avengers from './pages/Avengers.jsx';
import News from './pages/News.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Tvshows from './pages/Tvshows.jsx';
import MyList from './pages/MyList.jsx';
import Profile from './pages/Profile.jsx';
import Help from './pages/Help.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Toast from './components/Toast.jsx';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <div>
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tvshows" element={<Tvshows />} />
        <Route path="/avengers" element={<Avengers />} />
        <Route path="/news" element={<News />} />
        <Route path="/movie/:title" element={<MovieDetails />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/list" element={<MyList />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Analytics />
    </div>
  );
}
