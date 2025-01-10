// src/components/ProfileHeader.jsx

import React from 'react';
import OverallScoreRing from './OverallScoreRing';
import backgroundImage from '../assets/background.jpg'; // Ensure the path is correct

const ProfileHeader = ({ name, email, overallScore }) => {
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
    </div>
  );
};

export default ProfileHeader;
