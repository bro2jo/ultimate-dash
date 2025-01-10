// src/components/HomeSection.jsx

import React, { useState, useEffect } from 'react';
import RadarChart from './RadarChart';
import SwipeableInsights from './SwipeableInsights';
import { computeCategoryAverages } from '../utils/helpers';

function HomeSection({ player }) { // player is the full athlete object
  const [averages, setAverages] = useState({
    mental: 0,
    physical: 0,
    cutting: 0,
    handling: 0,
    throwing: 0,
    defensive: 0,
    offensive: 0,
  });

  useEffect(() => {
    const avg = computeCategoryAverages(player); // Now accesses player.skills
    setAverages(avg);
  }, [player]);

  // Radar chart data for 6 categories
  const radarLabels = ['Mental', 'Physical', 'Cutting', 'Handling', 'Throwing', 'Defense'];
  const radarDataValues = [
    averages.mental,
    averages.physical,
    averages.cutting,
    averages.handling,
    averages.throwing,
    averages.defensive,
  ];

  return (
    <div className="mx-auto space-y-4">
      {/* Key Insights (Top 3 strengths, etc.) */}
      <SwipeableInsights player={player.skills} />

      {/* Radar Chart for 6 main categories */}
      <div className="bg-gray-800 p-5 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-100 mb-4 mt-0">
          Category Averages
        </h2>
        {/* Center the RadarChart */}
        <div className="w-full flex justify-center">
          <div className="w-80 h-80">
            <RadarChart labels={radarLabels} dataValues={radarDataValues} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSection;
