import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileHeader from './components/ProfileHeader';
import CategorySection from './components/CategorySection';
import RadarChart from './components/RadarChart';
import OffensiveSection from './components/OffensiveSection';
import RadialTabs from './components/RadialTabs';
import { computeCategoryAverages, computeOverallScore } from './utils/helpers';
import HomeSection from './components/HomeSection';
import { SyncManager } from './utils/sync';
import { InstallPrompt } from './components/InstallPrompt';
import RoadmapModal from './components/RoadmapModal';
import FloatingActionButton from './components/FloatingActionButton';
import './index.css';
import { fetchAthletes } from './services/athleteService';
import { LoadingState } from './components/LoadingState';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncPending, setSyncPending] = useState(false);
  const [isRoadmapOpen, setRoadmapOpen] = useState(false);

  // Athlete selection
  const [selectedAthleteId, setSelectedAthleteId] = useState(null);

  // Data fetching states
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch athletes from Firestore
  useEffect(() => {
    const getAthletes = async () => {
      try {
        const data = await fetchAthletes();
        setAthletes(data);
        setLoading(false);

        // URL parameter check for athlete ID
        const searchParams = new URLSearchParams(location.search);
        const athleteIdFromUrl = searchParams.get('id');

        if (athleteIdFromUrl) {
          const athleteExists = data.some(a => a.id === athleteIdFromUrl);
          if (athleteExists) {
            setSelectedAthleteId(athleteIdFromUrl);
          } else {
            console.warn(`[Dashboard] Athlete ID ${athleteIdFromUrl} not found, redirecting.`);
            navigate('/', { replace: true });
          }
        } else if (data.length > 0) {
          // Default to the first athlete
          setSelectedAthleteId(data[0].id);
        }
      } catch (err) {
        console.error('[Dashboard] Error fetching athletes:', err);
        setError('Failed to load athletes.');
        setLoading(false);
      }
    };
    getAthletes();
  }, [location.search, navigate]);

  // Current selected athlete
  const selectedAthlete = athletes.find(a => a.id === selectedAthleteId);

  // Data grouping for categories
  const getCategoryData = (athlete) => ({
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
      { key: 'defensive_strategy', label: 'Defensive Team Strategy' },
      { key: 'offensive_strategy', label: 'Offensive Team Strategy' },
    ],
  });

  // Tab management
  const [activeTab, setActiveTab] = useState('home');

  // Precompute main category averages for radial tabs
  const [averages, setAverages] = useState({});
  useEffect(() => {
    if (selectedAthlete) {
      const newAverages = computeCategoryAverages(selectedAthlete);
      setAverages(newAverages);
    }
  }, [selectedAthlete]);

  // Example Throw Comparison Radar
  const radarLabels = [
    'Backhand Power',
    'Forehand Power',
    'Specialty Power',
    'Backhand Accuracy',
    'Forehand Accuracy',
    'Specialty Accuracy',
  ];
  const radarDataValues = selectedAthlete
    ? [
        selectedAthlete.skills.backhand_power,
        selectedAthlete.skills.forehand_power,
        selectedAthlete.skills.specialty_power,
        selectedAthlete.skills.backhand_accuracy,
        selectedAthlete.skills.forehand_accuracy,
        selectedAthlete.skills.specialty_accuracy,
      ]
    : [];

  // Online/Offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Attempt to sync pending data if any
      SyncManager.processSyncQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {!isOnline && (
        <div className="bg-yellow-600 text-white px-4 py-2 text-center">
          You're offline. Some features may be limited.
        </div>
      )}

      {/* Show custom InstallPrompt for PWA */}
      <InstallPrompt />

      {/** Profile Header (only if selectedAthlete is available) */}
      {selectedAthlete && (
        <ProfileHeader
          name={selectedAthlete.metadata.name}
          email={selectedAthlete.metadata.email}
          overallScore={
            activeTab === 'home'
              ? computeOverallScore(selectedAthlete)
              : averages[activeTab] || 0
          }
          athletes={athletes}
          selectedAthleteId={selectedAthleteId}
          onSelectAthlete={(id) => setSelectedAthleteId(id)}
        />
      )}

      {/** Radial navigation row for main tabs */}
      <RadialTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        averages={averages}
      />

      {/** Main content container */}
      <div className="flex-1 overflow-auto px-4 pb-8 mt-4">
        {/** Loading indicator */}
        {loading && <LoadingState />}

        {/** Error message */}
        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/** Main content if data is loaded */}
        {!loading && !error && selectedAthlete && (
          <>
            {activeTab === 'home' && <HomeSection player={selectedAthlete} />}
            
            {activeTab === 'physical' && (
              <CategorySection
                title="Physical Attributes"
                skills={getCategoryData(selectedAthlete).physical}
                player={selectedAthlete.skills}
              />
            )}

            {activeTab === 'offensive' && (
              <>
                <OffensiveSection
                  offensiveData={getCategoryData(selectedAthlete).offensive}
                  player={selectedAthlete.skills}
                />
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-100">
                    Throw Comparison
                  </h2>
                  <RadarChart labels={radarLabels} dataValues={radarDataValues} />
                </div>
              </>
            )}

            {activeTab === 'defensive' && (
              <CategorySection
                title="Defensive Skills"
                skills={getCategoryData(selectedAthlete).defensive}
                player={selectedAthlete.skills}
              />
            )}

            {activeTab === 'mental' && (
              <CategorySection
                title="Mental & Recovery"
                skills={getCategoryData(selectedAthlete).mental}
                player={selectedAthlete.skills}
              />
            )}

            {/* Roadmap Modal */}
            <RoadmapModal
              isOpen={isRoadmapOpen}
              onClose={() => setRoadmapOpen(false)}
              player={selectedAthlete}
            />
            <FloatingActionButton onClick={() => setRoadmapOpen(true)} />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
