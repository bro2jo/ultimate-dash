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
        data: dataValues,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
        pointRadius: 2.5,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
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
          label: (item) => `${item.formattedValue}/10`
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2, // This controls the aspect ratio of the chart
  };

  return (
    <div className="w-full aspect-[1.2]"> {/* Match the aspectRatio from options */}
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;