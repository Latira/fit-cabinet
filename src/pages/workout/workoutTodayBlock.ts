import { el, createBtn, createImg, isToday } from '../../utils/tags';
import emptyWorkout from '../../img/workout-empty.png';
import { navigateTo } from '../../utils/router';
import { type SavedWorkout } from '../createWorkout';
import { openChangeTodayModal } from './workoutTodayModals';
import { openWorkoutTimer } from './workoutTimerModal';

export function createWorkoutTodayBlock(
    savedWorkouts: SavedWorkout[],
    onWorkoutsUpdated: () => void
): HTMLElement {
    const getContainer = (): HTMLElement =>
        (document.querySelector('.app-content') as HTMLElement) || document.body;

    const workoutToday = el('div', 'workout-today');
    const workoutTodayTitle = el('h2', 'workout-today__title', 'Workout today');

    const manualTodayId = localStorage.getItem('today_workout_id');
    const todayWorkout =
        savedWorkouts.find((w) => w.id === manualTodayId) ||
        [...savedWorkouts].reverse().find((w) => isToday(w.createdAt)) ||
        savedWorkouts.at(-1);

    if (todayWorkout) {
        const todayHeader = el('div', 'workout-today__header');
        const todayName = el('h3', 'workout-today__name', todayWorkout.name);
        const changeBtn = createBtn('workout-today__change-btn', 'Change');

        changeBtn.addEventListener('click', () => {
            openChangeTodayModal(savedWorkouts, onWorkoutsUpdated);
        });

        todayHeader.append(todayName, changeBtn);
        workoutToday.append(workoutTodayTitle, todayHeader);

        if (todayWorkout.exercises.length === 0) {
            workoutToday.append(el('p', 'workout-today__empty-ex', 'No exercises in this workout.'));
        } else {
            const exList = el('ul', 'workout-today__exercises');

            todayWorkout.exercises.forEach((ex, idx) => {
                const li = el('li', 'workout-today__ex-item');

                const exBtn = createBtn('workout-today__ex-name', `${idx + 1}. ${ex.name}`);
                exBtn.addEventListener('click', () => {
                    localStorage.setItem('selected_exercise', JSON.stringify(ex));
                    navigateTo('/exercises', getContainer());
                });

                const exMeta = el(
                    'span',
                    'workout-today__ex-meta',
                    `${ex.sets ?? 3} × ${ex.reps ?? 10} (rest ${ex.rest ?? 60}s)`
                );

                li.append(exBtn, exMeta);
                exList.append(li);
            });

            workoutToday.append(exList);
        }

        const startTodayBtn = createBtn('workout-today__button', 'start workout');
        startTodayBtn.addEventListener('click', () => {
            openWorkoutTimer(todayWorkout);
        });
        workoutToday.append(startTodayBtn);
        } else {
            const emptyTodayText = el(
                'p',
                'workout-today__empty-text',
                "You don't have a workout for today yet. Create one to get started and crush your goals!"
            );
            const emptyTodayImg = createImg('workout-today__empty-img', emptyWorkout, 'image for empty workout');
            const workoutTodayBtn = createBtn('workout-today__button', 'start workout');
            workoutTodayBtn.disabled = true;

            workoutToday.append(workoutTodayTitle, emptyTodayImg, emptyTodayText, workoutTodayBtn);
        }

    return workoutToday;
}
