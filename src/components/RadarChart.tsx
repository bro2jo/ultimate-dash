// src/components/RadarChart.tsx

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
  ChartOptions,
  ChartData,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  labels: string[];
  dataValues: number[];
  onDataPointClick?: (dataPoint: {
    label: string;
    value: number;
    index: number;
    datasetIndex: number;
  }) => void;
}

/**
 * RadarChart Component
 * @param {RadarChartProps} props - Component props
 */
const RadarChart: React.FC<RadarChartProps> = ({ labels, dataValues, onDataPointClick }) => {
  const data: ChartData<'radar', number[], string> = {
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
        pointHoverRadius: 7, // Adjust as needed
        pointHitRadius: 10, // Consistent touch area
      },
    ],
  };

  const options: ChartOptions<'radar'> = {
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
      const target = event.native?.target as HTMLElement;
      if (elements.length > 0 && target) {
        target.style.cursor = 'pointer';
      } else if (target) {
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
