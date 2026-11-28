import { createBtn } from '../../utils/tags';
import { type MuscleGroup } from '../../api/exercises';

export function renderExerciseFilters(
  container: HTMLElement,
  muscleGroups: MuscleGroup[],
  activeGroup: string,
  onSelectGroup: (group: string) => void
): void {
  container.replaceChildren();
  const groups = ['ALL', ...muscleGroups.map((g) => g.displayGroup.toUpperCase())];

  groups.forEach((groupName) => {
    const isActive = activeGroup.toUpperCase() === groupName;
    const btn = createBtn(`exercises-filters__btn ${isActive ? 'is-active' : ''}`, groupName);

    btn.addEventListener('click', () => {
      onSelectGroup(groupName);
    });

    container.append(btn);
  });
}
