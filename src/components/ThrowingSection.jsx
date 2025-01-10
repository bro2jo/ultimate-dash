// src/components/ThrowingSection.jsx

import React, { useState } from 'react';
import Tabs from './Tabs';
import CategorySection from './CategorySection';

function ThrowingSection({ throwingData, player }) {
  // Sub-sub tab state
  const [activeThrowTab, setActiveThrowTab] = useState('backhand');

  const throwTabs = [
    { value: 'backhand', label: 'Backhand' },
    { value: 'forehand', label: 'Forehand' },
    { value: 'specialty', label: 'Specialty' },
    { value: 'hucking', label: 'Hucking' },
  ];

  return (
    <div className="mb-4">
      {/* Throwing sub-sub tabs */}
      <Tabs
        tabs={throwTabs}
        activeTab={activeThrowTab}
        onChange={setActiveThrowTab}
      />

      {/* Conditionally render the relevant CategorySection */}
      {activeThrowTab === 'backhand' && (
        <CategorySection
          title="Backhand Skills"
          skills={throwingData.backhand}
          player={player}
        />
      )}
      {activeThrowTab === 'forehand' && (
        <CategorySection
          title="Forehand Skills"
          skills={throwingData.forehand}
          player={player}
        />
      )}
      {activeThrowTab === 'specialty' && (
        <CategorySection
          title="Specialty Skills"
          skills={throwingData.specialty}
          player={player}
        />
      )}
        {activeThrowTab === 'hucking' && (
        <CategorySection
          title="Hucking Skills"
          skills={throwingData.hucking}
          player={player}
        />
        )}
    </div>
  );
}

export default ThrowingSection;
