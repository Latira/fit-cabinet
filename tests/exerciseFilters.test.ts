// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderExerciseFilters } from '../src/pages/exercises/exerciseFilters';
import { type MuscleGroup } from '../src/api/exercises';

const mockGroups: MuscleGroup[] = [
  { displayGroup: 'Chest', muscles: ['chest'] } as MuscleGroup,
  { displayGroup: 'Legs', muscles: ['quadriceps', 'hamstrings'] } as MuscleGroup,
  { displayGroup: 'Back', muscles: ['lats'] } as MuscleGroup,
];

describe('renderExerciseFilters', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.replaceChildren(container);
  });

  test('renders ALL button first followed by uppercased muscle group names', () => {
    renderExerciseFilters(container, mockGroups, 'ALL', vi.fn());

    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons).toHaveLength(4);
    expect(buttons.map((b) => b.textContent)).toEqual(['ALL', 'CHEST', 'LEGS', 'BACK']);
  });

  test('marks only the active group button with is-active class (case-insensitive)', () => {
    renderExerciseFilters(container, mockGroups, 'legs', vi.fn());

    const buttons = Array.from(container.querySelectorAll('button'));
    const activeButtons = buttons.filter((b) => b.classList.contains('is-active'));

    expect(activeButtons).toHaveLength(1);
    expect(activeButtons[0].textContent).toBe('LEGS');
  });

  test('calls onSelectGroup callback with uppercased group name on button click', () => {
    const onSelect = vi.fn();
    renderExerciseFilters(container, mockGroups, 'ALL', onSelect);

    const chestBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'CHEST'
    )!;
    chestBtn.click();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('CHEST');
  });

  test('replaces previous filter buttons on re-render instead of duplicating them', () => {
    renderExerciseFilters(container, mockGroups, 'ALL', vi.fn());
    renderExerciseFilters(container, mockGroups, 'BACK', vi.fn());

    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(4);
  });
});
