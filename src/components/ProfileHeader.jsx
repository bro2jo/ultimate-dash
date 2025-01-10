// src/components/ProfileHeader.jsx

import React, { useState, useRef, useEffect } from 'react';
import OverallScoreRing from './OverallScoreRing';
import backgroundImage from '../assets/background.jpg'; // Ensure this path is correct
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProfileHeader = ({ name, email, overallScore, athletes, selectedAthleteId, onSelectAthlete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate(); // Hook to navigate

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the selected athlete
  const selectedAthlete = athletes.find(a => a.id === selectedAthleteId);

  if (!selectedAthlete) {
    return (
      <div className="text-center text-gray-300 py-10">
        Loading athlete data...
      </div>
    );
  }

  return (
    <div className="relative w-full h-56 md:h-64 lg:h-72 bg-gray-800 rounded-lg overflow-hidden">
      {/* Background Image */}
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* User Info */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">{name}</h1>
          <p className="text-sm md:text-base text-gray-300 mt-1">{email}</p>
        </div>

        {/* Overall Score Ring */}
        <div className="mt-4">
          <OverallScoreRing overallScore={overallScore} />
        </div>
      </div>

      {/* Dropdown (Top-right corner) */}
      <div ref={dropdownRef} className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer p-2 rounded-full hover:bg-gray-700 transition"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mt-2 w-48 bg-gray-800 rounded-md shadow-xl z-50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="py-1">
                {athletes.map((athlete) => (
                  <li key={athlete.id}>
                    <button
                      onClick={() => {
                        onSelectAthlete(athlete.id);
                        // Update the URL with both id and name
                        navigate(`/?id=${athlete.id}&name=${encodeURIComponent(athlete.metadata.name)}`);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        athlete.id === selectedAthleteId
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {athlete.metadata.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileHeader;
