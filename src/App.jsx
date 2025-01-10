// src/App.jsx

import React, { useState, useEffect } from 'react';
import mockData from './data/mockData';

// 1) Import your existing components
import ProfileHeader from './components/ProfileHeader';
import InsightsSection from './components/InsightsSection';
import CategorySection from './components/CategorySection';
import RadarChart from './components/RadarChart';
import OffensiveSection from './components/OffensiveSection';

// 2) Import the updated RadialTabs component
import RadialTabs from './components/RadialTabs';

import './index.css';

/* -------------------------------------
   1) HELPER FUNCTIONS
-------------------------------------- */

// A small utility to average numeric values for a given list of keys
function averageOfKeys(player, keys) {
  let sum = 0, count = 0;
  for (const key of keys) {
    if (typeof player[key] === 'number') {
      sum += player[key];
      count++;
    }
  }
  return count === 0 ? 0 : parseFloat((sum / count).toFixed(1));
}

// Compute category averages for Mental, Physical, Cutting, Throwing, Defense, Handling, Offensive
function computeCategoryAverages(player) {
  // 1) MENTAL
  const mentalKeys = [
    'mental_game',
    'feedback_implementation',
    'injury_prevention',
    'recovery',
    'flexibility_mobility',
  ];

  // 2) PHYSICAL
  const physicalKeys = [
    'speed_explosiveness',
    'endurance',
    'vertical_leap',
    'change_of_direction',
    'boxing_out',
    'laying_out',
    'recovery',
    'flexibility_mobility',
    'injury_prevention',
  ];

  // 3) CUTTING
  const cuttingKeys = [
    'angles',
    'fakes_footwork',
    'timing_field_vision',
    'decisiveness',
    'catching',
    'flow_awareness',
    'isolation_cutting',
    'continuation_cutting',
  ];

  // 4) HANDLING
  const handlingKeys = [
    'handler_movement',
    'poise_with_disc',
    'breaking_the_mark',
    'resetting_from_trap_sideline',
    'decision_making_vision',
    'offensive_pattern_recognition',
    'throw_and_go',
  ];

  // 5) THROWING (Backhand, Forehand, Specialty, Hucking)
  const throwingKeys = [
    // Backhand
    'backhand_power',
    'backhand_accuracy',
    'backhand_quick_release',
    'backhand_release_variations',
    'backhand_against_wind',
    'backhand_against_difficult_marks',
    'backhand_tempo_control',
    // Forehand
    'forehand_power',
    'forehand_accuracy',
    'forehand_quick_release',
    'forehand_release_variations',
    'forehand_against_wind',
    'forehand_against_difficult_marks',
    'forehand_tempo_control',
    // Specialty
    'specialty_power',
    'specialty_accuracy',
    'specialty_quick_release',
    'specialty_release_variations',
    'specialty_against_wind',
    'specialty_against_difficult_marks',
    'specialty_tempo_control',
    // Hucking
    'hucking_confidence',
    'hucking_shape_control',
    'hucking_tempo_control',
    'hucking_placement',
  ];

  // 6) DEFENSE
  const defenseKeys = [
    'defensive_strategy',
    'normal_marking',
    'sideline_trap_marking',
    'downfield_defending',
    'handler_defending',
    'defensive_pattern_recognition',
    'help_defense',
    'switching_on_defense',
    'zone_defense',
    'defensive_mental_fortitude',
  ];

  // Compute individual averages
  const mental = averageOfKeys(player, mentalKeys);
  const physical = averageOfKeys(player, physicalKeys);
  const cutting = averageOfKeys(player, cuttingKeys);
  const handling = averageOfKeys(player, handlingKeys);
  const throwing = averageOfKeys(player, throwingKeys);
  const defensive = averageOfKeys(player, defenseKeys);

  // 7) OFFENSIVE
  // Offensive is computed as the average of cutting, handling, throwing
  const offensive = parseFloat(((cutting + handling + throwing) / 3).toFixed(1));

  return {
    mental,
    physical,
    cutting,
    handling,
    throwing,
    defensive,
    offensive, // Ensure this key matches RadialTabs expectation
  };
}

/* -------------------------------------
   2) HOME SECTION (DASHBOARD)
-------------------------------------- */

function HomeSection({ player }) {
  const [averages, setAverages] = useState({
    mental: 0,
    physical: 0,
    cutting: 0,
    handling: 0,
    throwing: 0,
    defensive: 0,
    offensive: 0, // Added offensive to maintain consistency
  });

  useEffect(() => {
    const avg = computeCategoryAverages(player);
    setAverages(avg);
  }, [player]);

  // Radar chart data for 6 categories
  const radarLabels = ['Mental', 'Physical', 'Cutting', 'Handling', 'Throwing', 'Defense'];
  const radarDataValues = [
    averages.mental,
    averages.physical,
    averages.cutting,
    averages.handling,
    averages.throwing,
    averages.defensive,
  ];

  return (
    <div className="space-y-6">
      {/* Key Insights (Top 3 strengths, etc.) */}
      <InsightsSection player={player} />

      {/* Radar Chart for 6 main categories */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-100 mb-3">
          Category Averages
        </h2>
        <div className="w-full h-64">
          <RadarChart labels={radarLabels} dataValues={radarDataValues} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------
   3) MAIN APP
-------------------------------------- */

function App() {
  // Grab first player from mock data
  const player = mockData[0];

  // 3.1) Compute overall score (0-10) for user
  const computeOverallScore = (p) => {
    let sum = 0, count = 0;
    for (const key in p) {
      if (typeof p[key] === 'number') {
        sum += p[key];
        count++;
      }
    }
    return count === 0 ? 0 : parseFloat((sum / count).toFixed(1));
  };

  // 3.2) Group data into categories (unchanged from your code)
  const getCategoryData = (p) => ({
    physical: [
      { key: 'speed_explosiveness', label: 'Speed & Explosiveness' },
      { key: 'endurance', label: 'Endurance' },
      { key: 'vertical_leap', label: 'Vertical Leap' },
      { key: 'change_of_direction', label: 'Change of Direction' },
      { key: 'boxing_out', label: 'Boxing Out' },
      { key: 'laying_out', label: 'Laying Out' },
      { key: 'recovery', label: 'Recovery' },
      { key: 'flexibility_mobility', label: 'Flexibility & Mobility' },
      { key: 'injury_prevention', label: 'Injury Prevention' },
    ],
    offensive: {
      cutting: [
        { key: 'angles', label: 'Angles' },
        { key: 'fakes_footwork', label: 'Fakes & Footwork' },
        { key: 'timing_field_vision', label: 'Timing & Field Vision' },
        { key: 'decisiveness', label: 'Decisiveness' },
        { key: 'catching', label: 'Catching' },
        { key: 'flow_awareness', label: 'Flow Awareness' },
        { key: 'isolation_cutting', label: 'Isolation Cutting' },
        { key: 'continuation_cutting', label: 'Continuation Cutting' },
      ],
      handling: [
        { key: 'handler_movement', label: 'Handler Movement' },
        { key: 'poise_with_disc', label: 'Poise w/ Disc' },
        { key: 'breaking_the_mark', label: 'Breaking the Mark' },
        { key: 'resetting_from_trap_sideline', label: 'Reset from Trap' },
        { key: 'decision_making_vision', label: 'Decision Making & Vision' },
        { key: 'offensive_pattern_recognition', label: 'Pattern Recognition' },
        { key: 'throw_and_go', label: 'Throw & Go' },
      ],
      throwing: {
        backhand: [
          { key: 'backhand_power', label: 'Backhand Power' },
          { key: 'backhand_accuracy', label: 'Backhand Accuracy' },
          { key: 'backhand_quick_release', label: 'Backhand Quick Release' },
          { key: 'backhand_release_variations', label: 'Backhand Variations' },
          { key: 'backhand_against_wind', label: 'Backhand vs Wind' },
          { key: 'backhand_against_difficult_marks', label: 'Backhand vs Difficult Marks' },
          { key: 'backhand_tempo_control', label: 'Backhand Tempo Control' },
        ],
        forehand: [
          { key: 'forehand_power', label: 'Forehand Power' },
          { key: 'forehand_accuracy', label: 'Forehand Accuracy' },
          { key: 'forehand_quick_release', label: 'Forehand Quick Release' },
          { key: 'forehand_release_variations', label: 'Forehand Variations' },
          { key: 'forehand_against_wind', label: 'Forehand vs Wind' },
          { key: 'forehand_against_difficult_marks', label: 'Forehand vs Difficult Marks' },
          { key: 'forehand_tempo_control', label: 'Forehand Tempo Control' },
        ],
        specialty: [
          { key: 'specialty_power', label: 'Specialty Power' },
          { key: 'specialty_accuracy', label: 'Specialty Accuracy' },
          { key: 'specialty_quick_release', label: 'Specialty Quick Release' },
          { key: 'specialty_release_variations', label: 'Specialty Variations' },
          { key: 'specialty_against_wind', label: 'Specialty vs Wind' },
          { key: 'specialty_against_difficult_marks', label: 'Specialty vs Difficult Marks' },
          { key: 'specialty_tempo_control', label: 'Specialty Tempo Control' },
        ],
        hucking: [
          { key: 'hucking_confidence', label: 'Hucking Confidence' },
          { key: 'hucking_shape_control', label: 'Hucking Shape Control' },
          { key: 'hucking_tempo_control', label: 'Hucking Tempo Control' },
          { key: 'hucking_placement', label: 'Hucking Placement' },
        ],
      },
    },
    defensive: [
      { key: 'defensive_strategy', label: 'Defensive Strategy' },
      { key: 'normal_marking', label: 'Normal Marking' },
      { key: 'sideline_trap_marking', label: 'Sideline Trap Marking' },
      { key: 'downfield_defending', label: 'Downfield Defending' },
      { key: 'handler_defending', label: 'Handler Defending' },
      { key: 'defensive_pattern_recognition', label: 'Pattern Recognition' },
      { key: 'help_defense', label: 'Help Defense' },
      { key: 'switching_on_defense', label: 'Switching on Defense' },
      { key: 'zone_defense', label: 'Zone Defense' },
      { key: 'defensive_mental_fortitude', label: 'Defensive Mental Fortitude' },
    ],
    mental: [
      { key: 'mental_game', label: 'Mental Game' },
      { key: 'feedback_implementation', label: 'Feedback Implementation' },
      { key: 'injury_prevention', label: 'Injury Prevention' },
      { key: 'recovery', label: 'Recovery' },
      { key: 'flexibility_mobility', label: 'Flexibility & Mobility' },
    ],
  });

  // 3.3) We fetch the categories
  const categories = getCategoryData(player);

  // 3.4) We'll keep track of the active tab, default to "home"
  const [activeTab, setActiveTab] = useState('home');

  // 3.5) Precompute the main category averages for radial tab display
  const [averages, setAverages] = useState({});
  useEffect(() => {
    const newAvg = computeCategoryAverages(player);
    setAverages(newAvg);
  }, [player]);

  // 3.6) Radar example for “Throw Comparison” inside Offensive
  const radarLabels = [
    'Backhand Power',
    'Forehand Power',
    'Specialty Power',
    'Backhand Accuracy',
    'Forehand Accuracy',
    'Specialty Accuracy',
  ];
  const radarDataValues = [
    player.backhand_power,
    player.forehand_power,
    player.specialty_power,
    player.backhand_accuracy,
    player.forehand_accuracy,
    player.specialty_accuracy,
  ];

  /* -------------------------------------
     RENDER
  -------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/** 1) Profile Header at the top */}
      <ProfileHeader
        name={player.name}
        email={player.email}
        overallScore={
          activeTab === 'home'
            ? computeOverallScore(player)
            : averages[activeTab] || 0
        }
      />

      {/** 2) The radial nav row (icons + radial) for Home, Physical, Offensive, Defensive, Mental */}
      <RadialTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        averages={averages}
      />

      {/** 3) Scrollable content below the radial nav */}
      <div className="flex-1 overflow-auto px-4 pb-8 mt-4">
        {/** HOME (Dashboard) */}
        {activeTab === 'home' && (
          <HomeSection player={player} />
        )}

        {/** PHYSICAL */}
        {activeTab === 'physical' && (
          <CategorySection
            title="Physical Attributes"
            skills={categories.physical}
            player={player}
          />
        )}

        {/** OFFENSIVE */}
        {activeTab === 'offensive' && (
          <>
            <OffensiveSection
              offensiveData={categories.offensive}
              player={player}
            />
            {/* Example: A Throw Comparison Radar Chart */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-100">
                Throw Comparison
              </h2>
              <RadarChart labels={radarLabels} dataValues={radarDataValues} />
            </div>
          </>
        )}

        {/** DEFENSIVE */}
        {activeTab === 'defensive' && (
          <CategorySection
            title="Defensive Skills"
            skills={categories.defensive}
            player={player}
          />
        )}

        {/** MENTAL */}
        {activeTab === 'mental' && (
          <CategorySection
            title="Mental & Recovery"
            skills={categories.mental}
            player={player}
          />
        )}
      </div>
    </div>
  );
}

export default App;
