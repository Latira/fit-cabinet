import { createSettings } from '../pages/settings';
import { createDashboard } from '../pages/dashboard'

const routes: Record<string, () => HTMLElement> = {
  '/': createDashboard,
  '/settings': createSettings,
  // '/about': createAbout,
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