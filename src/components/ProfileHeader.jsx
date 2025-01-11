import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import OverallScoreRing from './OverallScoreRing';
import backgroundImage from '../assets/background.jpg';

const ProfileHeader = ({ 
  name, 
  email, 
  overallScore, 
  athletes, 
  selectedAthleteId, 
  onSelectAthlete 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedAthlete = athletes?.find(a => a.id === selectedAthleteId);

  if (!selectedAthlete) {
    return (
      <div className="flex items-center justify-center h-56 bg-gray-800 rounded-lg">
        <p className="text-gray-300">Loading athlete data...</p>
      </div>
    );
  }

  const menuVariants = {
    closed: {
      opacity: 0,
      scaleY: 0,
      transition: { duration: 0.2 }
    },
    open: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: 0.2 }
    }
  };

  const handleAthleteSelect = (athlete) => {
    onSelectAthlete(athlete.id);
    navigate(`/?id=${athlete.id}&name=${encodeURIComponent(athlete.metadata.name)}`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full h-56 md:h-64 lg:h-72 bg-gray-800 rounded-lg">
      {/* Background Image */}
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">{name}</h1>
          <p className="text-sm md:text-base text-gray-300 mt-1">{email}</p>
        </div>

        <div className="mt-4">
          <OverallScoreRing overallScore={overallScore} />
        </div>
      </div>

      {/* Dropdown Container - Portal the dropdown menu */}
      <div 
        ref={dropdownRef} 
        className="absolute top-4 right-4 md:top-6 md:right-6"
        style={{ zIndex: 9999 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full 
                   bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700 
                   transition-colors duration-200 focus:outline-none 
                   focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="athlete-listbox"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg 
                       ring-1 ring-black ring-opacity-5 max-h-[calc(100vh-120px)]"
              style={{ 
                zIndex: 9999,
                transformOrigin: "top",
                top: "calc(100% + 0.5rem)" // Position directly below button
              }}
            >
              <ul
                id="athlete-listbox"
                role="listbox"
                aria-label="Select athlete"
                className="divide-y divide-gray-700 overflow-y-auto"
              >
                {athletes.map((athlete) => (
                  <li key={athlete.id} role="option" aria-selected={athlete.id === selectedAthleteId}>
                    <button
                      onClick={() => handleAthleteSelect(athlete)}
                      className={`w-full text-left px-4 py-3 text-sm ${
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