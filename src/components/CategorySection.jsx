// src/components/CategorySection.jsx

import React from 'react';
import SkillCard from './SkillCard';

const CategorySection = ({ title, skills, player }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-100">{title}</h2>
      <div className="space-y-2">
        {skills.map((skill) => (
          <SkillCard
            key={skill.key}
            label={skill.label}
            value={player[skill.key]}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
