// src/components/AthleteDropdown.jsx

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AthleteDropdown = ({ athletes, selectedAthleteId, onSelectAthlete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get the selected athlete's name
  const selectedAthlete = athletes.find(a => a.id === selectedAthleteId);

  return (
    <div className="absolute top-4 right-4 md:top-6 md:right-6" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-gray-800 text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="mr-2 text-sm">{selectedAthlete ? selectedAthlete.name : "Select Athlete"}</span>
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-30"
            role="listbox"
            aria-labelledby="athlete-dropdown"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-1">
              {athletes.map(athlete => (
                <li key={athlete.id}>
                  <button
                    onClick={() => {
                      onSelectAthlete(athlete.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      athlete.id === selectedAthleteId
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    role="option"
                    aria-selected={athlete.id === selectedAthleteId}
                  >
                    {athlete.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AthleteDropdown;
