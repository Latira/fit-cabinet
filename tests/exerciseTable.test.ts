// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderExerciseTable } from '../src/pages/exercises/exerciseTable';
import { createPagination } from '../src/components/pagination';
import { type Exercise } from '../src/api/exercises';

vi.mock('../src/components/pagination', () => ({
  createPagination: vi.fn(() => {
    const nav = document.createElement('nav');
    nav.className = 'mock-pagination';
    return nav;
  }),
}));

const makeExercise = (
  id: string,
  name: string,
  muscles: string[] = ['chest'],
  instructions: string[] = ['Step 1']
): Exercise =>
  ({
    id,
    name,
    category: 'strength',
    level: 'beginner',
    primaryMuscles: muscles,
    secondaryMuscles: [],
    instructions,
  }) as Exercise;

describe('renderExerciseTable', () => {
  let tableBody: HTMLElement;
  let paginationContainer: HTMLElement;
  let libBadge: HTMLElement;

  beforeEach(() => {
    tableBody = document.createElement('div');
    paginationContainer = document.createElement('div');
    libBadge = document.createElement('span');
    document.body.replaceChildren(tableBody, paginationContainer, libBadge);
    vi.clearAllMocks();
  });

  test('renders empty status and clears pagination when exercises list is empty', () => {
    paginationContainer.append(document.createElement('div'));

    renderExerciseTable({
      tableBody,
      paginationContainer,
      libBadge,
      exercises: [],
      currentPage: 1,
      pageSize: 10,
      onViewExercise: vi.fn(),
      onPageChange: vi.fn(),
      onPageSizeChange: vi.fn(),
    });

    expect(libBadge.textContent).toBe('0');
    expect(tableBody.querySelector('.exercises-table__status')?.textContent).toBe(
      'No exercises found for the selected muscle group.'
    );
    expect(paginationContainer.children).toHaveLength(0);
    expect(createPagination).not.toHaveBeenCalled();
  });

  test('renders sliced rows for the current page, max 2 muscle badges and fallback description', () => {
    const exercises = [
      makeExercise('1', 'Exercise 1', ['chest', 'triceps', 'shoulders'], ['First instruction']),
      makeExercise('2', 'Exercise 2', ['back'], []),
      makeExercise('3', 'Exercise 3', ['legs'], ['Squat down']),
    ];

    renderExerciseTable({
      tableBody,
      paginationContainer,
      libBadge,
      exercises,
      currentPage: 1,
      pageSize: 2,
      onViewExercise: vi.fn(),
      onPageChange: vi.fn(),
      onPageSizeChange: vi.fn(),
    });

    expect(libBadge.textContent).toBe('3');

    const rows = tableBody.querySelectorAll('.exercises-table__row');
    expect(rows).toHaveLength(2);

    expect(rows[0].querySelector('.exercises-table__name')?.textContent).toBe('Exercise 1');
    expect(rows[0].querySelector('.exercises-table__desc')?.textContent).toBe('First instruction');
    const badges = Array.from(rows[0].querySelectorAll('.exercises-table__muscle-badge'));
    expect(badges.map((b) => b.textContent)).toEqual(['chest', 'triceps']);

    expect(rows[1].querySelector('.exercises-table__desc')?.textContent).toBe(
      'Basic exercise for targeting specific muscle groups'
    );
  });

  test('triggers onViewExercise and onAddExercise callbacks when row buttons are clicked', () => {
    const ex = makeExercise('10', 'Pull-Up', ['lats']);
    const onView = vi.fn();
    const onAdd = vi.fn();

    renderExerciseTable({
      tableBody,
      paginationContainer,
      libBadge,
      exercises: [ex],
      currentPage: 1,
      pageSize: 10,
      onViewExercise: onView,
      onAddExercise: onAdd,
      onPageChange: vi.fn(),
      onPageSizeChange: vi.fn(),
    });

    tableBody.querySelector<HTMLButtonElement>('.exercises-table__btn-view')?.click();
    expect(onView).toHaveBeenCalledTimes(1);
    expect(onView).toHaveBeenCalledWith(ex);

    tableBody.querySelector<HTMLButtonElement>('.exercises-table__btn-add')?.click();
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(ex);
  });

  test('renders pagination and resets table scrollTop on page change', () => {
    const exercises = [makeExercise('1', 'Ex 1'), makeExercise('2', 'Ex 2')];
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();
    tableBody.scrollTop = 250;

    renderExerciseTable({
      tableBody,
      paginationContainer,
      libBadge,
      exercises,
      currentPage: 1,
      pageSize: 1,
      onViewExercise: vi.fn(),
      onPageChange,
      onPageSizeChange,
    });

    expect(paginationContainer.querySelector('.mock-pagination')).not.toBeNull();
    expect(createPagination).toHaveBeenCalledTimes(1);

    const passedOptions = vi.mocked(createPagination).mock.calls[0][0];
    passedOptions.onPageChange(2);

    expect(tableBody.scrollTop).toBe(0);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
