// src/components/HomeSection.jsx

import React, { useState, useEffect } from 'react';
import RadarChart from './RadarChart';
import SwipeableInsights from './SwipeableInsights';
import SkillHierarchy from './SkillHierarchy';
import { computeCategoryAverages } from '../utils/helpers';

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
    <div className="mx-auto space-y-6">
      {/* Key Insights (Top 3 strengths, etc.) */}
      <SwipeableInsights 
        player={player} 
        growthTargets={player.growth_targets || []}
      />

      {/* Main Stats Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Radar Chart */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-100 mb-4 mt-0">
            Category Averages
          </h2>
          <div className="w-full flex justify-center">
            <div className="w-full aspect-square max-w-[400px]">
              <RadarChart labels={radarLabels} dataValues={radarDataValues} />
            </div>
          </div>
        </div>

        {/* Skill Hierarchy */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-100 mb-4 mt-0">
            Detailed Breakdown
          </h2>
          <div className="overflow-auto max-h-[400px] custom-scrollbar">
            <SkillHierarchy player={player} />
          </div>
        </div>
      </div>

      {/* Additional Info or Future Sections */}
      <div className="bg-gray-800 p-5 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Recent Progress
        </h2>
        <p className="text-gray-400 text-sm">
          Progress tracking section coming soon...
        </p>
      </div>
    </div>
  );
}

export default HomeSection;