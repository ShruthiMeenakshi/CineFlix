import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiNavigation, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const ContactMap = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const locations = [
    { id: 1, name: 'Los Angeles (HQ)', lat: 34.0522, lng: -118.2437, address: '123 Cinema Blvd, LA, CA 90210' },
    { id: 2, name: 'New York Office', lat: 40.7128, lng: -74.0060, address: '456 Broadway, NY, NY 10001' },
    { id: 3, name: 'London Office', lat: 51.5074, lng: -0.1278, address: '789 Film St, London, UK' }
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><FiMapPin className="text-netflix-red" /><h2 className="text-xl font-bold">Our Locations</h2></div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">{isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}</motion.button>
      </div>

      <div className={`relative rounded-lg overflow-hidden transition-all duration-500 ${isExpanded ? 'h-96' : 'h-64'}`}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />

        {locations.map((location, index) => (
          <motion.div key={location.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.2 }} className="absolute" style={{ left: `${20 + index * 30}%`, top: `${30 + index * 20}%` }} onMouseEnter={() => setHoveredLocation(location.id)} onMouseLeave={() => setHoveredLocation(null)}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }} className="relative cursor-pointer">
              <div className="w-6 h-6 bg-netflix-red rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-netflix-red/50" />
              <div className="absolute inset-0 animate-ping"><div className="w-6 h-6 bg-netflix-red rounded-full opacity-20" /></div>

              <AnimatePresence>{hoveredLocation === location.id && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass-card p-3 whitespace-nowrap z-10">
                  <p className="font-bold text-sm">{location.name}</p>
                  <p className="text-xs text-gray-400">{location.address}</p>
                </motion.div>
              )}</AnimatePresence>
            </motion.div>
          </motion.div>
        ))}

        <div className="absolute bottom-4 right-4 flex gap-2">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 glass-card rounded-lg"><FiNavigation className="w-4 h-4" /></motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {locations.map((location, index) => (
          <motion.div key={location.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <h3 className="font-bold mb-1">{location.name}</h3>
            <p className="text-xs text-gray-400 mb-2">{location.address}</p>
            <button className="text-xs text-netflix-red hover:underline">Get Directions →</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContactMap;
