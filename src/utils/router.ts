import { createSettings } from '../pages/settings';
import { createDashboard } from '../pages/dashboard';
import { createExercisesPage } from '../pages/exercises';
import { createAbout } from '../pages/about-us';
import { createWorkouts } from '../pages/workouts';
import { createWorkoutPage } from '../pages/createWorkout';
import { createFoodDiary } from '../pages/foodDiary';
import { createNotes } from '../pages/notes';
import { createHabits } from '../pages/habits';
import { createWishlist } from '../pages/gearWishList';
import { isAuthenticated, openAuthModal } from '../components/authModal';

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

const routes: Record<string, () => HTMLElement> = {
  '/': createAbout,
  '/dashboard': createDashboard,
  '/settings': createSettings,
  '/exercises': createExercisesPage,
  '/food-diary': createFoodDiary,
  '/workouts': createWorkouts,
  '/create-workout': createWorkoutPage,
  '/notes': createNotes,
  '/habits': createHabits,
  '/wishlist': createWishlist,
};

const PUBLIC_ROUTES = new Set(['/']);

function getAppPath(): string {
  const rawPath = window.location.pathname;
  if (BASE_PATH && rawPath.startsWith(BASE_PATH)) {
    const trimmed = rawPath.slice(BASE_PATH.length);
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }
  return rawPath || '/';
}

function toFullUrl(appPath: string): string {
  const normalized = appPath.startsWith('/') ? appPath : `/${appPath}`;
  return `${BASE_PATH}${normalized}`;
}

export function renderRoute(container: HTMLElement): void {
  const path = getAppPath();
  const createPage = routes[path] || createDashboard;

  if (!PUBLIC_ROUTES.has(path) && !isAuthenticated()) {
    container.replaceChildren(routes['/']());

    openAuthModal(
      () => {
        container.replaceChildren(createPage());
      },
      () => {
        window.history.replaceState({}, '', toFullUrl('/'));
      }
    );
    return;
  }

  container.replaceChildren(createPage());
}

export function navigateTo(path: string, container: HTMLElement): void {
  window.history.pushState({}, '', toFullUrl(path));
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
