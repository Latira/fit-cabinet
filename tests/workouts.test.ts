// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createWorkouts } from '../src/pages/workouts';
import { createRoutineBlock } from '../src/pages/workout/routineBlock';
import { createWorkoutTodayBlock } from '../src/pages/workout/workoutTodayBlock';
import { type SavedWorkout } from '../src/pages/createWorkout';

vi.mock('../src/pages/workout/routineBlock', () => ({
  createRoutineBlock: vi.fn(() => {
    const div = document.createElement('div');
    div.className = 'mock-routine-block';
    return div;
  }),
}));

vi.mock('../src/pages/workout/workoutTodayBlock', () => ({
  createWorkoutTodayBlock: vi.fn(() => {
    const div = document.createElement('div');
    div.className = 'mock-today-block';
    return div;
  }),
}));

describe('createWorkouts page', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.replaceChildren();
    vi.clearAllMocks();
  });

  test('renders main container, title, and child blocks with empty array when localStorage is empty', () => {
    const page = createWorkouts();
    document.body.append(page);

    expect(page.tagName).toBe('MAIN');
    expect(page.classList.contains('workouts')).toBe(true);
    expect(page.querySelector('.workouts__title')?.textContent).toBe('Workouts');

    expect(createRoutineBlock).toHaveBeenCalledTimes(1);
    expect(createRoutineBlock).toHaveBeenCalledWith([], expect.any(Function));

    expect(createWorkoutTodayBlock).toHaveBeenCalledTimes(1);
    expect(createWorkoutTodayBlock).toHaveBeenCalledWith([], expect.any(Function));

    const content = page.querySelector('.workouts__content');
    expect(content?.querySelector('.mock-routine-block')).not.toBeNull();
    expect(content?.querySelector('.mock-today-block')).not.toBeNull();
  });

  test('passes parsed workouts from localStorage to child blocks', () => {
    const mockWorkouts = [
      { id: '1', name: 'Leg Day', exercises: [] },
      { id: '2', name: 'Upper Body', exercises: [] },
    ] as unknown as SavedWorkout[];

    localStorage.setItem('workouts', JSON.stringify(mockWorkouts));

    createWorkouts();

    expect(createRoutineBlock).toHaveBeenCalledWith(mockWorkouts, expect.any(Function));
    expect(createWorkoutTodayBlock).toHaveBeenCalledWith(mockWorkouts, expect.any(Function));
  });

  test('re-renders page inside .app-content when refreshPage callback is triggered', () => {
    const appContent = document.createElement('div');
    appContent.className = 'app-content';
    document.body.append(appContent);

    appContent.append(createWorkouts());

    const refreshCallback = vi.mocked(createRoutineBlock).mock.calls[0][1];

    const updatedWorkouts = [{ id: '99', name: 'Cardio' }] as unknown as SavedWorkout[];
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));

    refreshCallback();

    expect(createRoutineBlock).toHaveBeenCalledTimes(2);
    expect(createRoutineBlock).toHaveBeenLastCalledWith(updatedWorkouts, expect.any(Function));
    expect(appContent.querySelectorAll('.workouts')).toHaveLength(1);
  });

  test('falls back to document.body if .app-content is not found during refreshPage', () => {
    document.body.append(createWorkouts());

    const refreshCallback = vi.mocked(createWorkoutTodayBlock).mock.calls[0][1];
    refreshCallback();

    expect(createWorkoutTodayBlock).toHaveBeenCalledTimes(2);
    expect(document.body.querySelectorAll('.workouts')).toHaveLength(1);
  });
});
