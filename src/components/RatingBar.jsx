// src/components/RatingBar.jsx

import React from 'react';

const RatingBar = ({ value, max = 10 }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
      <div
        className="h-2.5 bg-emerald-500 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default RatingBar;
