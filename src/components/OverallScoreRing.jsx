// src/components/OverallScoreRing.jsx

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const OverallScoreRing = ({ overallScore }) => {
  const score = parseFloat(overallScore);
  const maxScore = 10; // Adjust if your scale differs

  const data = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [score, maxScore - score],
        backgroundColor: ['#10b981', '#374151'], // emerald-500 & gray-700
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '80%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40">
      <Doughnut data={data} options={options} />
      {/* Centered Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg md:text-xl font-bold text-emerald-400">
          {overallScore}
        </span>
        <span className="text-xs md:text-sm text-gray-300">/10</span>
      </div>
    </div>
  );
};

export default OverallScoreRing;
