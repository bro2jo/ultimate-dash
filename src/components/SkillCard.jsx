// src/components/SkillCard.jsx

import React from 'react';
import RatingBar from './RatingBar';

const SkillCard = ({ label, value }) => {
  return (
    <div className="flex items-center bg-gray-800 rounded-lg p-3 shadow-sm">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-100 mb-1">
          {label}
        </div>
        <RatingBar value={value} />
      </div>
      <div className="ml-4 text-emerald-400 font-bold text-lg">
        {value}
      </div>
    </div>
  );
};

export default SkillCard;
