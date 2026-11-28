import { el, createBtn, createImg } from '../../utils/tags';
import emptyWorkout from '../../img/workout-empty.png';
import { navigateTo } from '../../utils/router';
import { type SavedWorkout } from '../createWorkout';
import { openWorkoutDetailsModal } from './routineModals';

export function createRoutineBlock(
  savedWorkouts: SavedWorkout[],
  onWorkoutsUpdated: () => void
): HTMLElement {
  const getContainer = (): HTMLElement =>
    (document.querySelector('.app-content') as HTMLElement) || document.body;

  const routine = el('div', 'routine');
  const routineTitle = el('h2', 'routine__title', 'Your routine activity');

  const routineBtn = createBtn('routine__button', 'create workout');
  routineBtn.addEventListener('click', () => {
    localStorage.removeItem('editing_workout');
    navigateTo('/create-workout', getContainer());
  });

  if (savedWorkouts.length > 0) {
    const list = el('div', 'routine__list');

    savedWorkouts.forEach((w: SavedWorkout) => {
      const item = el('div', 'routine__item');

      const info = el('div', 'routine__item-info');
      const name = el('span', 'routine__item-name', w.name);
      const meta = el(
        'span',
        'routine__item-meta',
        `${w.duration} min • ${w.exercises.length} exercises`
      );
      info.append(name, meta);

      const viewBtn = createBtn('routine__item-view', 'View');
      viewBtn.addEventListener('click', () => openWorkoutDetailsModal(w, onWorkoutsUpdated));

      item.append(info, viewBtn);
      list.append(item);
    });

    routine.append(routineTitle, list, routineBtn);
  } else {
    const emptyText = el(
      'p',
      'routine__empty-text',
      "You don't have any workouts yet. Time to get started!"
    );
    const emptyImg = createImg('routine__empty-img', emptyWorkout, 'image for empty workout');
    routine.append(routineTitle, emptyImg, emptyText, routineBtn);
  }

  return routine;
}
