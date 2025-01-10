// src/components/HomeSection.jsx

import React, { useEffect, useState } from 'react';
import InsightsSection from './InsightsSection';
import RadarChart from './RadarChart';

function HomeSection({ player }) {
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
    const avg = computeCategoryAverages(player);
    setAverages(avg);
  }, [player]);

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
    <div className="space-y-4">
      {/* Key Insights */}
      <InsightsSection player={player} />

      {/* Category Averages Card */}
      <div className="bg-gray-800 rounded-lg shadow-md">
        <div className="p-3 pb-2"> {/* Reduced bottom padding */}
          <h2 className="text-lg font-semibold text-gray-100 mb-2">
            Category Averages
          </h2>
          <div className="w-full">
            <RadarChart labels={radarLabels} dataValues={radarDataValues} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSection;