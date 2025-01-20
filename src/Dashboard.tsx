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
import { fetchAthletes } from './services/athleteService';
import { LoadingState } from './components/LoadingState';
import { CATEGORY_DATA } from './constants/categoryData';
import type { Athlete } from './types/athlete';

type TabValue = 'home' | 'physical' | 'offensive' | 'defensive' | 'mental';

interface TabAverages {
  [key: string]: number;
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isRoadmapOpen, setRoadmapOpen] = useState<boolean>(false);

  // Athlete selection
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tab management
  const [activeTab, setActiveTab] = useState<TabValue>('home');
  const [averages, setAverages] = useState<TabAverages>({});

  // Fetch athletes from Firestore
  useEffect(() => {
    const getAthletes = async () => {
      try {
        const data: Athlete[] = await fetchAthletes();
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

  // Precompute main category averages for radial tabs
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

  const handleTabChange = (newTab: TabValue) => {
    setActiveTab(newTab);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {!isOnline && (
        <div className="bg-yellow-600 text-white px-4 py-2 text-center">
          You're offline. Some features may be limited.
        </div>
      )}

      <InstallPrompt />

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
          onSelectAthlete={setSelectedAthleteId}
        />
      )}

      <RadialTabs
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        averages={averages}
      />

      <div className="flex-1 overflow-auto px-4 pb-8 mt-4">
        {loading && <LoadingState />}

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded">
            {error}
          </div>
        )}

        {!loading && !error && selectedAthlete && (
          <>
            {activeTab === 'home' && <HomeSection player={selectedAthlete} />}
            
            {activeTab === 'physical' && (
              <CategorySection
                title="Physical Attributes"
                skills={CATEGORY_DATA.physical}
                player={selectedAthlete.skills}
              />
            )}

            {activeTab === 'offensive' && (
              <>
                <OffensiveSection
                  offensiveData={CATEGORY_DATA.offensive}
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
                skills={CATEGORY_DATA.defensive}
                player={selectedAthlete.skills}
              />
            )}

            {activeTab === 'mental' && (
              <CategorySection
                title="Mental & Recovery"
                skills={CATEGORY_DATA.mental}
                player={selectedAthlete.skills}
              />
            )}

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
};

export default Dashboard;