type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const DARK_CLASS = 'Dark';

export function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle(DARK_CLASS, theme === 'dark');
  localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme(): Theme {
  const isDark = document.documentElement.classList.contains(DARK_CLASS);
  const next: Theme = isDark ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
