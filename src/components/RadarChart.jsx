// src/components/RadarChart.jsx

import React from 'react';
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

const RadarChart = ({ labels, dataValues }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Throw Ratings',
        data: dataValues,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',  // emerald-500 @ 20%
        borderColor: 'rgba(16, 185, 129, 1)',         // emerald-500
        borderWidth: 2,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          color: '#e2e8f0',   // text-gray-200
          backdropColor: 'transparent',
        },
        grid: {
          color: '#4b5563',   // text-gray-600
        },
        angleLines: {
          color: '#4b5563',   // text-gray-600
        },
        pointLabels: {
          color: '#e2e8f0',   // text-gray-200
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',  // text-gray-200
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full max-w-md mx-auto h-64">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
