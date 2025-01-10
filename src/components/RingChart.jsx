// src/components/RingChart.jsx

import React from 'react';

const RingChart = ({ label, value }) => {
  const percentage = (value / 10) * 100;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <circle
          className="text-gray-700"
          strokeWidth="3.8"
          stroke="currentColor"
          fill="transparent"
          r="16"
          cx="18"
          cy="18"
        />
        <circle
          className="text-emerald-400"
          strokeWidth="3.8"
          strokeDasharray={`${percentage}, 100`}
          stroke="currentColor"
          fill="transparent"
          r="16"
          cx="18"
          cy="18"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-gray-100">{value}/10</span>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
    </div>
  );
};

export default RingChart;
