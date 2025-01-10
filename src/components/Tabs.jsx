// src/components/Tabs.jsx

import React from 'react';

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex justify-between bg-gray-800 p-1 rounded-lg gap-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={
            "flex-1 py-2 text-sm font-medium rounded-md transition-colors " +
            (activeTab === tab.value
              ? "bg-emerald-500 text-gray-900 shadow"
              : "text-gray-300 hover:bg-gray-700")
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
