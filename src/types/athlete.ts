// src/types/athlete.ts

// Base type for skills
export interface Skill {
  key: string;
  label: string;
}

// Category data structure
export interface CategoryData {
  physical: Skill[];
  offensive: {
    cutting: Skill[];
    handling: Skill[];
    throwing: {
      backhand: Skill[];
      forehand: Skill[];
      specialty: Skill[];
      hucking: Skill[];
    };
  };
  defensive: Skill[];
  mental: Skill[];
}

// Average calculations
export interface CategoryAverages {
  mental: number;
  physical: number;
  cutting: number;
  handling: number;
  throwing: number;
  defensive: number;
  offensive: number;
}

// Athlete metadata
export interface AthleteMetadata {
  name: string;
  email: string;
}

// Athlete skills as key-value pairs
export interface AthleteSkills {
  [key: string]: number;
}

// Complete athlete type
export interface Athlete {
  id: string;
  metadata: AthleteMetadata;
  skills: AthleteSkills;
  growth_targets: string[];
}

// Props types for components
export interface AthleteProps {
  player: Athlete;
}

export interface AthleteSelectorProps {
  athletes: Athlete[];
  selectedAthleteId: string;
  onSelectAthlete: (id: string) => void;
}

// State types
export interface AthleteState {
  athletes: Athlete[];
  selectedAthleteId: string | null;
  loading: boolean;
  error: string | null;
}

// Response types for API calls
export interface AthleteResponse {
  success: boolean;
  data: Athlete[];
  error?: string;
}

// Utility type for skill categories
export type SkillCategory = keyof CategoryData;

// Type for tab values
export type TabValue = 'home' | 'physical' | 'offensive' | 'defensive' | 'mental';

// Config for radar chart
export interface RadarConfig {
  labels: string[];
  dataValues: number[];
  maxValue?: number;
}
