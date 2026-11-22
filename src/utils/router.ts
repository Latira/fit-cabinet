import { createSettings } from '../pages/settings';
import { createDashboard } from '../pages/dashboard'
import { createExercisesPage } from '../pages/exercises';
import { createAbout } from '../pages/about-us';

const routes: Record<string, () => HTMLElement> = {
  '/': createDashboard,
  '/settings': createSettings,
  '/exercises': createExercisesPage,
  '/about': createAbout,
  // '/food-diary': createFoodDiary,
  // '/workouts': createWorkouts,
  // '/notes': createNotes,
  // '/wishlist': createWishlist,
};

export function renderRoute(container: HTMLElement): void {
  const path = window.location.pathname;
  // const createPage = routes[path] || createSettings;
  const createPage = routes[path] || createDashboard;

  container.replaceChildren(createPage());
}

export function navigateTo(path: string, container: HTMLElement): void {
  window.history.pushState({}, '', path);
  renderRoute(container);
}