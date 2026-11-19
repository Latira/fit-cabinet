import { createSettings } from '../pages/settings';

const routes: Record<string, () => HTMLElement> = {
  '/settings': createSettings,
};

export function renderRoute(container: HTMLElement): void {
  const path = window.location.pathname;
  const createPage = routes[path] || createSettings;

  container.replaceChildren(createPage());
}

export function navigateTo(path: string, container: HTMLElement): void {
  window.history.pushState({}, '', path);
  renderRoute(container);
}