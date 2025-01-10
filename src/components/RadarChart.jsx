/* src/components/RadarChart.jsx */

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

/**
 * RadarChart Component
 * @param {Object} props - Component props
 * @param {Array} props.labels - Labels for the radar chart axes
 * @param {Array} props.dataValues - Data values for each axis
 * @param {Function} props.onDataPointClick - Callback when a data point is clicked
 */
const RadarChart = ({ labels, dataValues, onDataPointClick }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Category Scores',
        data: dataValues,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
        pointRadius: 3, // Reduced from 5 to 3
        pointHoverRadius: 7, // Kept or adjusted as needed
        pointHitRadius: 10, // Maintained for consistent touch area
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill the container
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          display: false,
          backdropColor: 'transparent',
        },
        grid: {
          color: '#4b5563',
          lineWidth: 1,
        },
        angleLines: {
          color: '#4b5563',
          lineWidth: 1,
        },
        pointLabels: {
          color: '#e2e8f0',
          font: {
            size: 11,
            family: 'Inter',
          },
          padding: 8,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        padding: 8,
        titleFont: {
          size: 12,
          family: 'Inter',
        },
        bodyFont: {
          size: 11,
          family: 'Inter',
        },
        displayColors: false,
        callbacks: {
          title: (items) => labels[items[0].dataIndex],
          label: (item) => `${item.formattedValue}/10`,
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0 && onDataPointClick) {
        const { index, datasetIndex } = elements[0];
        const label = labels[index];
        const value = dataValues[index];
        onDataPointClick({ label, value, index, datasetIndex });
      }
    },
    // Optional: Change cursor to pointer on hover
    onHover: (event, elements) => {
      const target = event.native.target;
      if (elements.length > 0) {
        target.style.cursor = 'pointer';
      } else {
        target.style.cursor = 'default';
      }
    },
  };

  return (
    <div className="w-full h-full">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
