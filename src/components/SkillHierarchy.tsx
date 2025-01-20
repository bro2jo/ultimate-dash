import React, { memo } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { averageOfKeys, computeCategoryAverages, computeOverallScore } from '../utils/helpers';
import type { Athlete } from '../types/athlete';

interface SkillBarProps {
  value: number;
  maxValue?: number;
}

interface SkillNodeProps {
  label: string;
  value: number;
  depth?: number;
  children?: React.ReactNode;
}

const SkillBar = memo<SkillBarProps>(({ value, maxValue = 10 }) => {
  const isLowScore = value < 5;
  
  return (
    <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-300 ${isLowScore ? 'bg-orange-500' : 'bg-emerald-500'}`}
        style={{ width: `${(value / maxValue) * 100}%` }}
      />
    </div>
  );
});

SkillBar.displayName = 'SkillBar';

const SkillNode = memo<SkillNodeProps>(({ label, value, depth = 0, children }) => {
  const hasChildren = React.Children.count(children) > 0;
  const isLowScore = value < 5;
  
  return (
    <div className="flex-1 flex flex-col">
      <div className={`
        ${depth === 0 ? 'bg-gray-800/40 rounded-lg py-2 px-3' : 'py-1.5 px-3'}
      `}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {depth > 0 && (
            <div className="flex items-center flex-shrink-0">
              <div 
                className="w-px h-full absolute left-0 top-0 bottom-0 bg-gray-700/30"
                style={{ left: `${depth * 12}px` }}
              />
              <div className="ml-6">
                <ChevronRight className="w-3 h-3 text-gray-600" />
              </div>
            </div>
          )}
          
          <div className="flex-1 flex items-center gap-4 min-w-0">
            <span className={`
              font-medium truncate
              ${depth === 0 ? 'text-base text-white' : 'text-sm text-gray-300'}
            `}>
              {label}
            </span>
            
            {isLowScore && (
              <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-24 sm:w-32">
              <SkillBar value={value} />
            </div>
            <span className={`
              text-xs sm:text-sm font-medium w-8 text-right
              ${isLowScore ? 'text-orange-500' : 'text-emerald-500'}
            `}>
              {value.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {hasChildren && (
        <div className="flex-1 flex flex-col relative ml-2 sm:ml-3">
          {children}
        </div>
      )}
    </div>
  );
});

SkillNode.displayName = 'SkillNode';

const SkillHierarchy: React.FC<{ player: Athlete }> = ({ player }) => {
  const categoryAverages = computeCategoryAverages(player);
  const overallScore = computeOverallScore(player);

  const throwingAverages = {
    backhand: averageOfKeys(player, [
      'backhand_power', 'backhand_accuracy', 'backhand_quick_release',
      'backhand_release_variations', 'backhand_against_wind',
      'backhand_against_difficult_marks', 'backhand_tempo_control'
    ]),
    forehand: averageOfKeys(player, [
      'forehand_power', 'forehand_accuracy', 'forehand_quick_release',
      'forehand_release_variations', 'forehand_against_wind',
      'forehand_against_difficult_marks', 'forehand_tempo_control'
    ]),
    specialty: averageOfKeys(player, [
      'specialty_power', 'specialty_accuracy', 'specialty_quick_release',
      'specialty_release_variations', 'specialty_against_wind',
      'specialty_against_difficult_marks', 'specialty_tempo_control'
    ]),
    hucking: averageOfKeys(player, [
      'hucking_confidence', 'hucking_shape_control',
      'hucking_tempo_control', 'hucking_placement'
    ])
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <SkillNode label="Overall" value={overallScore}>
        <SkillNode label="Physical" value={categoryAverages.physical} depth={1} />
        <SkillNode label="Mental" value={categoryAverages.mental} depth={1} />
        <SkillNode label="Defensive" value={categoryAverages.defensive} depth={1} />
        <SkillNode label="Offensive" value={categoryAverages.offensive} depth={1}>
          <SkillNode label="Cutting" value={categoryAverages.cutting} depth={2} />
          <SkillNode label="Handling" value={categoryAverages.handling} depth={2} />
          <SkillNode label="Throwing" value={categoryAverages.throwing} depth={2}>
            <SkillNode label="Backhand" value={throwingAverages.backhand} depth={3} />
            <SkillNode label="Forehand" value={throwingAverages.forehand} depth={3} />
            <SkillNode label="Specialty" value={throwingAverages.specialty} depth={3} />
            <SkillNode label="Hucking" value={throwingAverages.hucking} depth={3} />
          </SkillNode>
        </SkillNode>
      </SkillNode>
    </div>
  );
};

export default memo(SkillHierarchy);