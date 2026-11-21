import { el, createBtn, createImg, createInput } from '../utils/tags';
import emptyWorkout from '../img/workout-empty.png';

export function createWorkouts(): HTMLElement {
    const workouts = el('main', 'workouts');
    const title = el('h1', 'workouts__title', 'Workouts');

    const content = el('div', 'workouts__content');

    const routine = el('div', 'routine');
    const routineTitle = el('h2', 'routine__title', 'Your routine activity');

    const hasRoutine = false;

    if (hasRoutine) {
        const routineBtn = createBtn('routine__button', 'create workout');
        routine.append(routineTitle, routineBtn);
    } else {
        const emptyText = el('p', 'routine__empty-text', "You don't have any workouts yet. Time to get started!");
        const emptyImg = createImg('routine__empty-img', emptyWorkout, 'image for empty workout');
        const routineBtn = createBtn('routine__button', 'create workout');
        routine.append(routineTitle, emptyImg, emptyText, routineBtn);
    }

    const workoutToday = el('div', 'workout-today');
    const workoutTodayTitle = el('h2', 'workout-today__title', 'Workout today');

    const hasTodayWorkout = false;

    if (hasTodayWorkout) {
        const workoutTodayBtn = createBtn('workout-today__button', 'start workout');
        workoutToday.append(workoutTodayTitle, workoutTodayBtn);
    } else {

        const emptyTodayText = el('p', 'workout-today__empty-text', "You don't have a workout for today yet. Create one to get started and crush your goals!");
        const emptyTodayImg = createImg('workout-today__empty-img', emptyWorkout, 'image for empty workout');
        const workoutTodayBtn = createBtn('workout-today__button', 'start workout');
        
        workoutToday.append(workoutTodayTitle, emptyTodayImg, emptyTodayText, workoutTodayBtn);
    }

    content.append(routine, workoutToday);
    workouts.append(title, content);
    return workouts;
}