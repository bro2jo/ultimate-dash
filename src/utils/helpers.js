// src/utils/helpers.js

import { METADATA_KEYS } from './constants';

// A small utility to average numeric values for a given list of keys
export function averageOfKeys(player, keys) {
  let sum = 0, count = 0;
  for (const key of keys) {
    if (typeof player.skills[key] === 'number' && !METADATA_KEYS.includes(key)) {
      sum += player.skills[key];
      count++;
    }
  }
  return count === 0 ? 0 : parseFloat((sum / count).toFixed(1));
}

// Compute category averages for Mental, Physical, Cutting, Throwing, Defense, Handling, Offensive
export function computeCategoryAverages(player) {
  // Define keys for each category
  const categories = {
    mental: [
      'mental_game',
      'feedback_implementation',
      'defensive_strategy',
      'offensive_strategy',

    ],
    physical: [
      'speed_explosiveness',
      'endurance',
      'vertical_leap',
      'change_of_direction',
      'boxing_out',
      'laying_out',
      'recovery',
      'flexibility_mobility',
      'injury_prevention',
    ],
    cutting: [
      'angles',
      'fakes_footwork',
      'timing_field_vision',
      'decisiveness',
      'catching',
      'flow_awareness',
      'isolation_cutting',
      'continuation_cutting',
    ],
    handling: [
      'handler_movement',
      'poise_with_disc',
      'breaking_the_mark',
      'resetting_from_trap_sideline',
      'decision_making_vision',
      'offensive_pattern_recognition',
      'throw_and_go',
    ],
    throwing: [
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
    ],
    defensive: [
      'normal_marking',
      'sideline_trap_marking',
      'downfield_defending',
      'handler_defending',
      'defensive_pattern_recognition',
      'help_defense',
      'switching_on_defense',
      'zone_defense',
      'defensive_mental_fortitude',
    ],
  };

  // Compute individual averages
  const mental = averageOfKeys(player, categories.mental);
  const physical = averageOfKeys(player, categories.physical);
  const cutting = averageOfKeys(player, categories.cutting);
  const handling = averageOfKeys(player, categories.handling);
  const throwing = averageOfKeys(player, categories.throwing);
  const defensive = averageOfKeys(player, categories.defensive);

  // Offensive is the average of cutting, handling, and throwing
  const offensive = parseFloat(((cutting + handling + throwing) / 3).toFixed(1));

  return {
    mental,
    physical,
    cutting,
    handling,
    throwing,
    defensive,
    offensive,
  };
}

// Compute overall score excluding metadata
export function computeOverallScore(player) {
  let sum = 0, count = 0;
  for (const key in player.skills) {
    if (typeof player.skills[key] === 'number' && !METADATA_KEYS.includes(key)) {
      sum += player.skills[key];
      count++;
    }
  }
  return count === 0 ? 0 : parseFloat((sum / count).toFixed(1));
}
