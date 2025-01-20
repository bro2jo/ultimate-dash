import React, { useState, useEffect, memo } from 'react';
import type { Athlete, CategoryAverages } from '../types/athlete';
import { RADAR_LABELS } from '../constants/categoryData';
import RadarChart from './RadarChart';
import SwipeableInsights from './SwipeableInsights';
import SkillHierarchy from './SkillHierarchy';
import { computeCategoryAverages } from '../utils/helpers';

interface HomeSectionProps {
  player: Athlete;
}

interface StatCardProps {
  title: string;
  content: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const initialAverages: CategoryAverages = {
  mental: 0,
  physical: 0,
  cutting: 0,
  handling: 0,
  throwing: 0,
  defensive: 0,
  offensive: 0,
};

const StatCard = memo<StatCardProps>(({ 
  title, 
  content, 
  className = '',
  contentClassName = ''
}) => (
  <div className={`
    bg-gray-800 
    p-4 sm:p-5 
    rounded-lg 
    shadow-md 
    flex 
    flex-col 
    h-full
    ${className}
  `}>
    <h2 className="text-base sm:text-lg font-semibold text-gray-100 mb-2">
      {title}
    </h2>
    <div className={`
      flex-1 
      w-full 
      flex 
      min-h-0
      ${contentClassName}
    `}>
      {content}
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

const RadarChartSection = memo<{ 
  labels: string[];
  dataValues: number[];
}>(({ labels, dataValues }) => (
  <div className="w-full h-full min-h-[300px] sm:min-h-[350px] max-h-[400px]">
    <RadarChart 
      labels={labels} 
      dataValues={dataValues} 
    />
  </div>
));

RadarChartSection.displayName = 'RadarChartSection';

export const HomeSection: React.FC<HomeSectionProps> = ({ player }) => {
  const [averages, setAverages] = useState<CategoryAverages>(initialAverages);

  useEffect(() => {
    setAverages(computeCategoryAverages(player));
  }, [player]);

  const labels = [...RADAR_LABELS];
  
  const radarDataValues = React.useMemo(() => 
    labels.map(label => 
      averages[label.toLowerCase() as keyof CategoryAverages]
    ), [averages, labels]
  );

  return (
    <div className="w-full mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 py-4">
      <SwipeableInsights 
        player={player} 
        growthTargets={player.growth_targets}
      />

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 h-[500px]">
        <StatCard
          title="Category Averages"
          contentClassName="items-center justify-center"
          content={
            <RadarChartSection 
              labels={labels}
              dataValues={radarDataValues} 
            />
          }
        />

        <StatCard
          title="Detailed Breakdown"
          contentClassName="overflow-hidden"
          content={
            <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="w-full h-full flex flex-col justify-between">
                <SkillHierarchy player={player} />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default memo(HomeSection);