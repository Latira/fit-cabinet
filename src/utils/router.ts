import { createSettings } from '../pages/settings';
import { createDashboard } from '../pages/dashboard'
import { createExercisesPage } from '../pages/exercises';
import { createAbout } from '../pages/about-us';
import { createWorkouts } from '../pages/workouts';
import { createWorkoutPage } from '../pages/createWorkout';
import { createFoodDiary } from '../pages/foodDiary';
import { createNotes } from '../pages/notes';
import { createHabits } from '../pages/habits';
import { createWishlist } from '../pages/gearWishList';
import { isAuthenticated, openAuthModal } from '../components/authModal';

const routes: Record<string, () => HTMLElement> = {
  '/': createDashboard,
  '/settings': createSettings,
  '/exercises': createExercisesPage,
  '/about': createAbout,
  '/food-diary': createFoodDiary,
  '/workouts': createWorkouts,
  '/create-workout': createWorkoutPage,
  '/notes': createNotes,
  '/habits': createHabits,
  '/wishlist': createWishlist,
};

const PUBLIC_ROUTES = new Set(['/']);

export function renderRoute(container: HTMLElement): void {
  const path = window.location.pathname;
  const createPage = routes[path] || createDashboard;

  if (!PUBLIC_ROUTES.has(path) && !isAuthenticated()) {
    container.replaceChildren(routes['/']());

    openAuthModal(
      () => {
        container.replaceChildren(createPage());
      },
      () => {
        window.history.replaceState({}, '', '/');
      }
    );
    return;
  }

  container.replaceChildren(createPage());
}

export function navigateTo(path: string, container: HTMLElement): void {
  window.history.pushState({}, '', path);
  renderRoute(container);
}

export function initRouter(container: HTMLElement): void {
  window.addEventListener('popstate', () => {
    renderRoute(container);
  });

  document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.getAttribute('href')?.startsWith('/')) {
      e.preventDefault();
      navigateTo(link.getAttribute('href')!, container);
    }
  });

  renderRoute(container);
}