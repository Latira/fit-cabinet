import { el } from '../utils/tags';
import { type SavedWorkout } from './createWorkout';
import { createRoutineBlock } from './workout/routineBlock';
import { createWorkoutTodayBlock } from './workout/workoutTodayBlock';

export function createWorkouts(): HTMLElement {
  const workouts = el('main', 'workouts');
  const title = el('h1', 'workouts__title', 'Workouts');
  const content = el('div', 'workouts__content');

  const getContainer = (): HTMLElement =>
    (document.querySelector('.app-content') as HTMLElement) || document.body;

  const refreshPage = () => {
    getContainer().replaceChildren(createWorkouts());
  };

  const savedWorkoutsStr = localStorage.getItem('workouts');
  const savedWorkouts: SavedWorkout[] = savedWorkoutsStr ? JSON.parse(savedWorkoutsStr) : [];

  const routineBlock = createRoutineBlock(savedWorkouts, refreshPage);
  const todayBlock = createWorkoutTodayBlock(savedWorkouts, refreshPage);

  content.append(routineBlock, todayBlock);
  workouts.append(title, content);
  return workouts;
}
