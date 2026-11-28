import { el, createBtn } from '../../utils/tags';
import { navigateTo } from '../../utils/router';
import { type SavedWorkout } from '../createWorkout';
import { createModal } from '../../components/modal';

export function openWorkoutDetailsModal(
  workout: SavedWorkout,
  onWorkoutsUpdated: () => void
): void {
  const getContainer = (): HTMLElement =>
    (document.querySelector('.app-content') as HTMLElement) || document.body;

  const footerActions = el('div', 'workout-details__footer');
  const editBtn = createBtn('workout-details__btn workout-details__btn--edit', 'Edit');
  const deleteBtn = createBtn('workout-details__btn workout-details__btn--delete', 'Delete');
  footerActions.append(editBtn, deleteBtn);

  const { modal, contentArea } = createModal({
    title: workout.name,
    footerContent: footerActions,
  });
  modal.classList.add('workout-details-modal');

  const details = el('div', 'workout-details');
  const duration = el('p', 'workout-details__duration', `Duration: ${workout.duration} min`);
  details.append(duration);

  if (workout.exercises.length === 0) {
    details.append(el('p', 'workout-details__empty', 'No exercises in this workout.'));
  } else {
    const exList = el('ul', 'workout-details__list');

    workout.exercises.forEach((ex, idx) => {
      const li = el('li', 'workout-details__item');

      const exTitle = createBtn('workout-details__ex-name', `${idx + 1}. ${ex.name}`);
      exTitle.addEventListener('click', () => {
        localStorage.setItem('selected_exercise', JSON.stringify(ex));
        modal.remove();
        navigateTo('/exercises', getContainer());
      });

      const exStats = el(
        'span',
        'workout-details__ex-stats',
        ` — ${ex.sets ?? 3} sets × ${ex.reps ?? 10} reps (Rest: ${ex.rest ?? 60} sec)`
      );

      li.append(exTitle, exStats);
      exList.append(li);
    });

    details.append(exList);
  }

  editBtn.addEventListener('click', () => {
    localStorage.setItem('editing_workout', JSON.stringify(workout));
    modal.remove();
    navigateTo('/create-workout', getContainer());
  });

  deleteBtn.addEventListener('click', () => {
    const listStr = localStorage.getItem('workouts');
    const list: SavedWorkout[] = listStr ? JSON.parse(listStr) : [];
    const updatedList = list.filter((item) => item.id !== workout.id);

    localStorage.setItem('workouts', JSON.stringify(updatedList));

    const currentTodayId = localStorage.getItem('today_workout_id');
    if (!currentTodayId || currentTodayId === workout.id) {
      const lastWorkout = updatedList.at(-1);
      if (lastWorkout) {
        localStorage.setItem('today_workout_id', lastWorkout.id);
      } else {
        localStorage.removeItem('today_workout_id');
      }
    }

    modal.remove();
    onWorkoutsUpdated();
  });

  contentArea.append(details);
  document.body.append(modal);
}
