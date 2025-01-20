// src/constants/categoryData.ts
import { CategoryData } from '../types/athlete';

export const CATEGORY_DATA: CategoryData = {
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
};

export const RADAR_LABELS = [
  'Mental',
  'Physical',
  'Cutting',
  'Handling',
  'Throwing',
  'Defensive',
] as const;

export type RadarLabel = typeof RADAR_LABELS[number];

// Additional exports for commonly used data
export const THROW_COMPARISON_LABELS = [
  'Backhand Power',
  'Forehand Power',
  'Specialty Power',
  'Backhand Accuracy',
  'Forehand Accuracy',
  'Specialty Accuracy',
] as const;
