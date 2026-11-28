// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createExercisesPage } from '../src/pages/exercises';
import { getExercises, getMuscles, type Exercise, type MuscleGroup } from '../src/api/exercises';
import { renderExerciseFilters } from '../src/pages/exercises/exerciseFilters';
import { renderExerciseTable } from '../src/pages/exercises/exerciseTable';

vi.mock('../src/api/exercises', () => ({
  getExercises: vi.fn(),
  getMuscles: vi.fn(),
}));

const mockOpenPreview = vi.fn();

vi.mock('../src/pages/exercises/exercisePreview', () => ({
  createExercisePreview: vi.fn(() => {
    const section = document.createElement('section');
    section.className = 'exercise-preview';
    section.hidden = true;
    return { previewCard: section, openPreview: mockOpenPreview };
  }),
}));

vi.mock('../src/pages/exercises/exerciseFilters', () => ({
  renderExerciseFilters: vi.fn(),
}));

vi.mock('../src/pages/exercises/exerciseTable', () => ({
  renderExerciseTable: vi.fn(),
}));

const mockExercises = [
  { id: '1', name: 'Bench Press', primaryMuscles: ['chest'], category: 'strength' },
  { id: '2', name: 'Squat', primaryMuscles: ['quadriceps'], category: 'strength' },
] as unknown as Exercise[];

const mockMuscles = [
  { displayGroup: 'Chest', muscles: ['chest'] },
  { displayGroup: 'Legs', muscles: ['quadriceps'] },
] as unknown as MuscleGroup[];

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('createExercisesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.replaceChildren();
    vi.clearAllMocks();
  });

  test('renders page heading, table header, and initial loading state', () => {
    vi.mocked(getExercises).mockReturnValue(new Promise(() => {}));
    vi.mocked(getMuscles).mockReturnValue(new Promise(() => {}));

    const page = createExercisesPage();
    document.body.append(page);

    expect(page.querySelector('.exercises__title')?.textContent).toBe('LIBRARY EXERCISE');
    expect(page.querySelector('.exercises-library__title')?.textContent).toBe('Exercise Library');
    expect(page.querySelector('.exercises-table__status')?.textContent).toBe(
      'Loading exercises...'
    );
  });

  test('opens preview and clears localStorage if selected_exercise exists on init', () => {
    vi.mocked(getExercises).mockReturnValue(new Promise(() => {}));
    vi.mocked(getMuscles).mockReturnValue(new Promise(() => {}));

    const preselected = mockExercises[0];
    localStorage.setItem('selected_exercise', JSON.stringify(preselected));

    createExercisesPage();

    expect(mockOpenPreview).toHaveBeenCalledTimes(1);
    expect(mockOpenPreview).toHaveBeenCalledWith(preselected);
    expect(localStorage.getItem('selected_exercise')).toBeNull();
  });

  test('loads exercises and muscle groups and renders filters and table', async () => {
    vi.mocked(getExercises).mockResolvedValue(mockExercises as never);
    vi.mocked(getMuscles).mockResolvedValue(mockMuscles as never);

    const page = createExercisesPage();
    document.body.append(page);

    await flushPromises();

    expect(getExercises).toHaveBeenCalledWith({ limit: '100' });
    expect(getMuscles).toHaveBeenCalledTimes(1);

    expect(renderExerciseFilters).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      mockMuscles,
      'ALL',
      expect.any(Function)
    );

    expect(renderExerciseTable).toHaveBeenCalledWith(
      expect.objectContaining({
        exercises: mockExercises,
        currentPage: 1,
        pageSize: 10,
        onViewExercise: mockOpenPreview,
      })
    );
  });

  test('filters exercises by selected muscle group when filter callback is triggered', async () => {
    vi.mocked(getExercises).mockResolvedValue(mockExercises as never);
    vi.mocked(getMuscles).mockResolvedValue(mockMuscles as never);

    createExercisesPage();
    await flushPromises();

    const onSelectGroup = vi.mocked(renderExerciseFilters).mock.calls[0][3];
    onSelectGroup('CHEST');

    expect(renderExerciseTable).toHaveBeenLastCalledWith(
      expect.objectContaining({
        exercises: [mockExercises[0]],
        currentPage: 1,
      })
    );
  });

  test('displays error message when API request fails', async () => {
    vi.mocked(getExercises).mockRejectedValue(new Error('Network error'));
    vi.mocked(getMuscles).mockResolvedValue(mockMuscles as never);

    const page = createExercisesPage();
    document.body.append(page);

    await flushPromises();

    expect(page.querySelector('.exercises-table__status')?.textContent).toBe(
      'Failed to load the exercise list'
    );
  });
});
