// src/App.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import mockData from './data/mockData';
import ProfileHeader from './components/ProfileHeader';
import SwipeableInsights from './components/SwipeableInsights';
import CategorySection from './components/CategorySection';
import RadarChart from './components/RadarChart';
import OffensiveSection from './components/OffensiveSection';
import RadialTabs from './components/RadialTabs';
import { computeCategoryAverages, computeOverallScore } from './utils/helpers';
import HomeSection from './components/HomeSection';  // Add this import if not already there

import './index.css';

/* -------------------------------------
   3) MAIN APP
-------------------------------------- */

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // 3.1) Manage Selected Athlete
  const [selectedAthleteId, setSelectedAthleteId] = useState(mockData[0].id);

  // 3.2) Automatically select athlete based on URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const athleteIdFromUrl = searchParams.get('id');      // ?id=3
    const athleteNameFromUrl = searchParams.get('name');  // ?name=Jonathan

    if (athleteIdFromUrl) {
      const athleteId = parseInt(athleteIdFromUrl, 10);
      const athleteExists = mockData.some(a => a.id === athleteId);
      if (athleteExists) {
        setSelectedAthleteId(athleteId);
      } else {
        // If athlete ID doesn't exist, navigate to default or show an error
        navigate('/', { replace: true });
      }
    }
  }, [location.search, navigate]);

  // Find the selected athlete from mockData
  const selectedAthlete = mockData.find(athlete => athlete.id === selectedAthleteId);
  // 3.4) Group data into categories
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

  // 3.4) We'll keep track of the active tab, default to "home"
  const [activeTab, setActiveTab] = useState('home');

  // 3.5) Precompute the main category averages for radial tab display
  const [averages, setAverages] = useState({});
  useEffect(() => {
    if (selectedAthlete) {
      const newAvg = computeCategoryAverages(selectedAthlete);
      setAverages(newAvg);
    }
  }, [selectedAthlete]);

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
    selectedAthlete.skills.backhand_power,
    selectedAthlete.skills.forehand_power,
    selectedAthlete.skills.specialty_power,
    selectedAthlete.skills.backhand_accuracy,
    selectedAthlete.skills.forehand_accuracy,
    selectedAthlete.skills.specialty_accuracy,
  ];

  /* -------------------------------------
     RENDER
  -------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/** 1) Profile Header at the top */}
      <ProfileHeader
        name={selectedAthlete.metadata.name}
        email={selectedAthlete.metadata.email}
        overallScore={
          activeTab === 'home'
            ? computeOverallScore(selectedAthlete)
            : averages[activeTab] || 0
        }
        athletes={mockData}
        selectedAthleteId={selectedAthleteId}
        onSelectAthlete={(id) => setSelectedAthleteId(id)} // Pass a handler
      />

      {/** 3) The radial nav row (icons + radial) for Home, Physical, Offensive, Defensive, Mental */}
      <RadialTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        averages={averages}
      />

      {/** 4) Scrollable content below the radial nav */}
      <div className="flex-1 overflow-auto px-4 pb-8 mt-4">
        {/** HOME (Dashboard) */}
        {activeTab === 'home' && (
          <HomeSection player={selectedAthlete} />
        )}

        {/** PHYSICAL */}
        {activeTab === 'physical' && (
          <CategorySection
            title="Physical Attributes"
            skills={getCategoryData(selectedAthlete).physical}
            player={selectedAthlete.skills}
          />
        )}

        {/** OFFENSIVE */}
        {activeTab === 'offensive' && (
          <>
            <OffensiveSection
              offensiveData={getCategoryData(selectedAthlete).offensive}
              player={selectedAthlete.skills}
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
            skills={getCategoryData(selectedAthlete).defensive}
            player={selectedAthlete.skills}
          />
        )}

        {/** MENTAL */}
        {activeTab === 'mental' && (
          <CategorySection
            title="Mental & Recovery"
            skills={getCategoryData(selectedAthlete).mental}
            player={selectedAthlete.skills}
          />
        )}
      </div>
    </div>
  );
}

export default App;
