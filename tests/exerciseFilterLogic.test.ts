// @vitest-environment jsdom
import { describe, test, expect } from 'vitest';
import { filterExercisesByGroup } from '../src/pages/exercises/exerciseFilterLogic';
import { type Exercise, type MuscleGroup } from '../src/api/exercises';

const mockMuscleGroups: MuscleGroup[] = [
  {
    displayGroup: 'Chest',
    muscles: ['pectoralis major', 'chest'],
  } as MuscleGroup,
  {
    displayGroup: 'Legs',
    muscles: ['quadriceps', 'hamstrings', 'glutes'],
  } as MuscleGroup,
  {
    displayGroup: 'Back',
    muscles: ['latissimus dorsi', 'trapezius'],
  } as MuscleGroup,
];

const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Bench Press',
    category: 'strength',
    level: 'beginner',
    primaryMuscles: ['Chest'],
  } as Exercise,
  {
    id: '2',
    name: 'Back Squat',
    category: 'strength',
    level: 'beginner',
    primaryMuscles: ['Quadriceps', 'Glutes'],
  } as Exercise,
  {
    id: '3',
    name: 'Romanian Deadlift',
    category: 'strength',
    level: 'intermediate',
    primaryMuscles: ['hamstrings'],
  } as Exercise,
  {
    id: '4',
    name: 'Mystery Move',
    category: 'strength',
    level: 'beginner',
    primaryMuscles: [],
  } as Exercise,
];

describe('filterExercisesByGroup', () => {
  test('returns all exercises when activeGroup is ALL (case-insensitive)', () => {
    expect(filterExercisesByGroup(mockExercises, mockMuscleGroups, 'ALL')).toEqual(mockExercises);
    expect(filterExercisesByGroup(mockExercises, mockMuscleGroups, 'all')).toEqual(mockExercises);
  });

  test('returns all exercises if activeGroup is not found in muscleGroups', () => {
    const result = filterExercisesByGroup(mockExercises, mockMuscleGroups, 'UnknownGroup');
    expect(result).toEqual(mockExercises);
  });

  test('filters exercises matching primaryMuscles of the target group (case-insensitive)', () => {
    const legsExercises = filterExercisesByGroup(mockExercises, mockMuscleGroups, 'legs');

    expect(legsExercises).toHaveLength(2);
    expect(legsExercises.map((e) => e.name)).toEqual(['Back Squat', 'Romanian Deadlift']);
  });

  test('returns empty array when no exercises match the selected muscle group', () => {
    const backExercises = filterExercisesByGroup(mockExercises, mockMuscleGroups, 'Back');
    expect(backExercises).toEqual([]);
  });

  test('safely handles exercises with undefined primaryMuscles', () => {
    const exercisesWithUndefined = [
      ...mockExercises,
      { id: '5', name: 'No Muscles Field' } as Exercise,
    ];

    const chestExercises = filterExercisesByGroup(
      exercisesWithUndefined,
      mockMuscleGroups,
      'Chest'
    );
    expect(chestExercises).toHaveLength(1);
    expect(chestExercises[0].name).toBe('Bench Press');
  });
});
