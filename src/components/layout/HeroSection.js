import React, { useEffect, useState } from "react";
import { FiMusic, FiSmile, FiBookOpen, FiStar, FiBriefcase, FiCpu, FiAperture } from "react-icons/fi";
import apiClient from '../../services/apiClient';

const categoryIconMap = {
  music: <FiMusic size={24} />, 
  sports: <FiStar size={24} />, 
  art: <FiAperture size={24} />, 
};

const categoryColorMap = {
  music: "bg-gradient-to-r from-orange-400 to-pink-500",
  sports: "bg-gradient-to-r from-blue-500 to-blue-800",
  art: "bg-gradient-to-r from-purple-400 to-pink-400",
};

const HeroSection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from backend using apiClient
    apiClient.get("/events/categories")
      .then((res) => {
        // Only keep music, sports, and art
        const allowed = ["music", "sports", "art"];
        setCategories((res.data.categories || []).filter(cat => allowed.includes(cat)));
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <section className="relative bg-white pt-8 pb-12 md:pt-16 md:pb-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
        {/* Banner Image with Ticket Icon */}
        <div className="relative w-full md:w-1/2 flex-shrink-0 flex justify-center">
          <img
            src="/assets/image.png"
            alt="Event Banner"
            className="rounded-2xl shadow-lg w-full h-64 md:h-80 object-cover object-center"
          />
          {/* Ticket Icon Overlay */}
          <div className="absolute top-4 left-4 bg-white/80 rounded-full p-2 shadow-md">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="10" width="28" height="20" rx="4" stroke="#FFA500" strokeWidth="3"/>
              <circle cx="12" cy="20" r="2" fill="#FFA500"/>
              <circle cx="28" cy="20" r="2" fill="#FFA500"/>
            </svg>
          </div>
        </div>
        {/* Text Block and Categories */}
        <div className="w-full md:w-1/2 flex flex-col items-start md:items-start gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">One Platform. Every Ticket. Your Ticket to Everything – Anytime, Anywhere.</h1>
            <p className="text-xl md:text-l text-gray-700 font-medium">Buy and manage tickets for events, travel, and entertainment with ease. 100% digital. No lines. No stress.Book, scan, and go in seconds.</p>
          </div>
          <div className="flex gap-4 mt-4 flex-wrap">
            {categories.length === 0 ? (
              <span className="text-gray-400">Loading categories...</span>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:scale-105 transition ${categoryColorMap[cat] || 'bg-gray-400'}`}
                >
                  {categoryIconMap[cat] || <FiStar size={24} />}
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 