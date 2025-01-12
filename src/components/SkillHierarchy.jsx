// src/components/SkillHierarchy.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { averageOfKeys, computeCategoryAverages, computeOverallScore } from '../utils/helpers';

const SkillBar = ({ value, maxValue = 10 }) => (
  <div className="w-24 bg-gray-700 rounded-full h-1.5 overflow-hidden">
    <div
      className="h-1.5 bg-emerald-500 transition-all duration-300"
      style={{ width: `${(value / maxValue) * 100}%` }}
    />
  </div>
);

const SkillNode = ({ label, value, depth = 0, children }) => {
  const hasChildren = React.Children.count(children) > 0;
  
  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-3 ${hasChildren ? 'mb-2' : ''}`}>
        {depth > 0 && (
          <div className="flex items-center">
            <div 
              className="w-4 h-px bg-gray-700"
              style={{ marginLeft: `${(depth - 1) * 16}px` }}
            />
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </div>
        )}
        
        <div className="flex-1 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          <div className="flex items-center gap-3">
            <SkillBar value={value} />
            <span className="text-sm font-semibold text-emerald-400 w-8">
              {value.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      
      {hasChildren && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

const SkillHierarchy = ({ player }) => {
  // Get all category averages using helper function
  const categoryAverages = computeCategoryAverages(player);
  const overallScore = computeOverallScore(player);

  // Compute throwing subcategory averages (not included in helpers)
  const throwingSubcategories = {
    backhand: [
      'backhand_power', 'backhand_accuracy', 'backhand_quick_release',
      'backhand_release_variations', 'backhand_against_wind',
      'backhand_against_difficult_marks', 'backhand_tempo_control'
    ],
    forehand: [
      'forehand_power', 'forehand_accuracy', 'forehand_quick_release',
      'forehand_release_variations', 'forehand_against_wind',
      'forehand_against_difficult_marks', 'forehand_tempo_control'
    ],
    specialty: [
      'specialty_power', 'specialty_accuracy', 'specialty_quick_release',
      'specialty_release_variations', 'specialty_against_wind',
      'specialty_against_difficult_marks', 'specialty_tempo_control'
    ],
    hucking: [
      'hucking_confidence', 'hucking_shape_control',
      'hucking_tempo_control', 'hucking_placement'
    ]
  };

  const throwingAverages = {
    backhand: averageOfKeys(player, throwingSubcategories.backhand),
    forehand: averageOfKeys(player, throwingSubcategories.forehand),
    specialty: averageOfKeys(player, throwingSubcategories.specialty),
    hucking: averageOfKeys(player, throwingSubcategories.hucking)
  };

  return (
    <div className="space-y-4">
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

export default SkillHierarchy;