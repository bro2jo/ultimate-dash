// src/components/OffensiveSection.jsx

import React, { useState } from 'react';
import Tabs from './Tabs';
import CategorySection from './CategorySection';
import ThrowingSection from './ThrowingSection'; // NEW import

function OffensiveSection({ offensiveData, player }) {
  const [activeSubTab, setActiveSubTab] = useState('cutting');

  const subTabs = [
    { value: 'cutting', label: 'Cutting' },
    { value: 'handling', label: 'Handling' },
    { value: 'throwing', label: 'Throwing' },
  ];

  return (
    <div className="mb-6">
      {/* Offensive Sub-Tabs */}
      <Tabs
        tabs={subTabs}
        activeTab={activeSubTab}
        onChange={setActiveSubTab}
      />

      {activeSubTab === 'cutting' && (
        <CategorySection
          title="Cutting Skills"
          skills={offensiveData.cutting}
          player={player}
        />
      )}

      {activeSubTab === 'handling' && (
        <CategorySection
          title="Handling Skills"
          skills={offensiveData.handling}
          player={player}
        />
      )}

      {/* NEW: If sub-tab is throwing, render ThrowingSection */}
      {activeSubTab === 'throwing' && (
        <ThrowingSection
          throwingData={offensiveData.throwing}
          player={player}
        />
      )}
    </div>
  );
}

export default OffensiveSection;
