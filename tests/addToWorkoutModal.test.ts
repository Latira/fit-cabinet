// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { openAddExerciseToWorkoutModal } from '../src/pages/exercises/addToWorkoutModal';
import { navigateTo } from '../src/utils/router';
import { type Exercise } from '../src/api/exercises';
import { type SavedWorkout } from '../src/pages/createWorkout';

vi.mock('../src/utils/router', () => ({
  navigateTo: vi.fn(),
}));

const sampleExercise = {
  id: 'ex-1',
  name: 'Push-Up',
  category: 'strength',
  primaryMuscles: ['chest'],
  secondaryMuscles: ['triceps'],
  instructions: ['Keep body straight'],
} as Exercise;

describe('openAddExerciseToWorkoutModal', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.replaceChildren();
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  test('renders empty state and redirects to create workout with configured parameters', () => {
    openAddExerciseToWorkoutModal(sampleExercise);

    expect(document.querySelector('.add-to-workout__empty')?.textContent).toBe(
      'You have no saved workouts yet. Create a new workout with this exercise?'
    );

    const setsInput = document.querySelector<HTMLInputElement>('#modal-ex-sets')!;
    const repsInput = document.querySelector<HTMLInputElement>('#modal-ex-reps')!;
    const restInput = document.querySelector<HTMLInputElement>('#modal-ex-rest')!;

    setsInput.value = '4';
    repsInput.value = '12';
    restInput.value = '60';

    localStorage.setItem('editing_workout', JSON.stringify({ id: 'old' }));

    const createBtn = document.querySelector<HTMLButtonElement>('.add-to-workout__create-btn')!;
    createBtn.click();

    expect(localStorage.getItem('editing_workout')).toBeNull();

    const preselected = JSON.parse(localStorage.getItem('preselected_exercise')!);
    expect(preselected).toMatchObject({
      id: 'ex-1',
      name: 'Push-Up',
      sets: 4,
      reps: 12,
      rest: 60,
    });

    expect(document.querySelector('.add-to-workout')).toBeNull();
    expect(navigateTo).toHaveBeenCalledWith('/create-workout', document.body);
  });

  test('prevents negative values in Sets, Reps and Rest inputs', () => {
    openAddExerciseToWorkoutModal(sampleExercise);

    const setsInput = document.querySelector<HTMLInputElement>('#modal-ex-sets')!;
    const minusEvent = new KeyboardEvent('keydown', { key: '-', cancelable: true });
    setsInput.dispatchEvent(minusEvent);
    expect(minusEvent.defaultPrevented).toBe(true);

    setsInput.value = '-5';
    setsInput.dispatchEvent(new Event('input'));
    expect(setsInput.value).toBe('0');

    const restInput = document.querySelector<HTMLInputElement>('#modal-ex-rest')!;
    restInput.value = '-30';
    restInput.dispatchEvent(new Event('blur'));
    expect(restInput.value).toBe('0');
  });

  test('adds exercise with configured sets, reps and rest to an existing workout', () => {
    const existingWorkouts: SavedWorkout[] = [
      {
        id: 'w-1',
        name: 'Upper Body',
        duration: 45,
        exercises: [],
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('workouts', JSON.stringify(existingWorkouts));

    openAddExerciseToWorkoutModal(sampleExercise);

    document.querySelector<HTMLInputElement>('#modal-ex-sets')!.value = '3';
    document.querySelector<HTMLInputElement>('#modal-ex-reps')!.value = '15';
    document.querySelector<HTMLInputElement>('#modal-ex-rest')!.value = '45';

    const workoutOption = document.querySelector<HTMLButtonElement>('.workout-select-list__item')!;
    workoutOption.click();

    const updatedWorkouts: SavedWorkout[] = JSON.parse(localStorage.getItem('workouts')!);
    expect(updatedWorkouts[0].exercises).toHaveLength(1);
    expect(updatedWorkouts[0].exercises[0]).toMatchObject({
      id: 'ex-1',
      name: 'Push-Up',
      sets: 3,
      reps: 15,
      rest: 45,
    });

    expect(window.alert).toHaveBeenCalledWith('"Push-Up" added to "Upper Body"!');
    expect(document.querySelector('.add-to-workout')).toBeNull();
  });

  test('updates existing exercise parameters if it is already in the workout', () => {
    const existingWorkouts: SavedWorkout[] = [
      {
        id: 'w-1',
        name: 'Upper Body',
        duration: 45,
        exercises: [{ ...sampleExercise, sets: 2, reps: 8, rest: 30 }],
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('workouts', JSON.stringify(existingWorkouts));

    openAddExerciseToWorkoutModal(sampleExercise);

    expect(document.querySelector('.workout-select-list__meta')?.textContent).toBe(
      'Already in workout (click to update)'
    );

    document.querySelector<HTMLInputElement>('#modal-ex-sets')!.value = '5';
    document.querySelector<HTMLInputElement>('#modal-ex-reps')!.value = '10';
    document.querySelector<HTMLInputElement>('#modal-ex-rest')!.value = '90';

    document.querySelector<HTMLButtonElement>('.workout-select-list__item')!.click();

    const updatedWorkouts: SavedWorkout[] = JSON.parse(localStorage.getItem('workouts')!);
    expect(updatedWorkouts[0].exercises).toHaveLength(1);
    expect(updatedWorkouts[0].exercises[0]).toMatchObject({
      sets: 5,
      reps: 10,
      rest: 90,
    });
    expect(window.alert).toHaveBeenCalledWith('Updated "Push-Up" in "Upper Body"!');
  });
});
