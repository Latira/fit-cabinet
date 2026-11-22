import { createSettings } from '../pages/settings';
import { createDashboard } from '../pages/dashboard'
import { createExercisesPage } from '../pages/exercises';
<<<<<<< HEAD
import { createAbout } from '../pages/about-us';
=======
import { createWorkouts } from '../pages/workouts';
import { createWorkoutPage } from '../pages/createWorkout';
>>>>>>> a0d6e669659a8f9c457c7970fd17753f0187fdac

const routes: Record<string, () => HTMLElement> = {
  '/': createDashboard,
  '/settings': createSettings,
  '/exercises': createExercisesPage,
  '/about': createAbout,
  // '/food-diary': createFoodDiary,
  '/workouts': createWorkouts,
  '/create-workout': createWorkoutPage,
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