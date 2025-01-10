// src/components/InsightsSection.jsx

import React from 'react';
import { METADATA_KEYS } from '../utils/constants';

const InsightsSection = ({ player }) => {
  // Example logic: find top 3 skills (by numeric value)
  const skillEntries = Object.entries(player).filter(([key, val]) => {
    return typeof val === 'number' && !METADATA_KEYS.includes(key);
  });

  // Sort descending by value
  skillEntries.sort((a, b) => b[1] - a[1]);
  const topThree = skillEntries.slice(0, 3);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold uppercase mb-2 text-gray-100">
        Key Insights
      </h2>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-2">
          <span className="font-semibold text-emerald-400">
            Top 3 Strengths:
          </span>
        </div>
        {topThree.map(([skillKey, skillValue]) => (
          <div key={skillKey} className="flex justify-between mb-1">
            <span className="capitalize text-gray-200">
              {skillKey.replace(/_/g, ' ')}
            </span>
            <span className="text-emerald-400 font-semibold">
              {skillValue}/10
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsSection;
