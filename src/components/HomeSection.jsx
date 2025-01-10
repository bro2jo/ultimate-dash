// src/components/HomeSection.jsx

import React, { useEffect, useState } from 'react';
import InsightsSection from './InsightsSection';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function HomeSection({ player, averages }) {
  // Optionally, store chart data in local state
  const [radarData, setRadarData] = useState(null);

  useEffect(() => {
    // Construct the data for the radar chart
    const labels = ['Mental', 'Physical', 'Cutting', 'Throwing', 'Defense', 'Handling'];
    const values = [
      averages.mental,
      averages.physical,
      averages.cutting,
      averages.throwing,
      averages.defense,
      averages.handling,
    ];

    const newData = {
      labels,
      datasets: [
        {
          label: 'Category Averages',
          data: values,
          backgroundColor: 'rgba(16, 185, 129, 0.2)', // emerald-500 at 20% opacity
          borderColor: 'rgba(16, 185, 129, 1)',        // emerald-500
          borderWidth: 2,
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        },
      ],
    };
    setRadarData(newData);
  }, [averages]);

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          color: '#e2e8f0', // text-gray-200
          backdropColor: 'transparent',
        },
        grid: {
          color: '#4b5563', // text-gray-600
        },
        angleLines: {
          color: '#4b5563', // text-gray-600
        },
        pointLabels: {
          color: '#e2e8f0', // text-gray-200
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0', // text-gray-200
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="space-y-6">
      {/* 1) Key Insights */}
      <InsightsSection player={player} />

      {/* 2) Radar Chart */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold text-gray-100 mb-3">
          Overall Averages
        </h2>
        <div className="w-full h-64">
          {radarData && (
            <Radar data={radarData} options={radarOptions} />
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeSection;
