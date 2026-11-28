// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createSettings } from '../src/pages/settings';
import { toggleTheme } from '../src/components/theme';
import { navigateTo } from '../src/utils/router';
import { getCurrentUser, logoutUser } from '../src/components/authModal';

vi.mock('../src/utils/tags', async () => {
  const actual = await vi.importActual<typeof import('../src/utils/tags')>('../src/utils/tags');
  return {
    ...actual,
    createSvgIcon: vi.fn((_raw: string, className = '') => {
      const icon = document.createElement('span');
      if (className) icon.className = className;
      return icon;
    }),
  };
});

vi.mock('../src/components/theme', () => ({
  getInitialTheme: vi.fn(() => 'dark'),
  applyTheme: vi.fn(),
  toggleTheme: vi.fn(),
}));

vi.mock('../src/pages/settings/faq-tab', () => ({
  createFaqSlider: vi.fn(() => {
    const div = document.createElement('div');
    div.className = 'mock-faq-tab';
    return div;
  }),
}));

vi.mock('../src/pages/settings/goals-tab', () => ({
  createGoalsTab: vi.fn(() => {
    const div = document.createElement('div');
    div.className = 'mock-goals-tab';
    return div;
  }),
}));

vi.mock('../src/pages/settings/security-tab', () => ({
  createSecurityTab: vi.fn(() => {
    const div = document.createElement('div');
    div.className = 'mock-security-tab';
    return div;
  }),
}));

vi.mock('../src/utils/router', () => ({
  navigateTo: vi.fn(),
}));

vi.mock('../src/components/authModal', () => ({
  getCurrentUser: vi.fn(() => ({
    name: 'Alex Mercer',
    email: 'alex@example.com',
    provider: 'email',
  })),
  logoutUser: vi.fn(),
}));

const AVATAR_STORAGE_KEY = 'fit_cabinet_avatar';
const AUTH_STORAGE_KEY = 'fit_cabinet_user';

describe('createSettings page', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.replaceChildren();
    vi.clearAllMocks();
  });

  test('renders heading, user data from getCurrentUser, and disables inputs initially', () => {
    const page = createSettings();
    document.body.append(page);

    expect(page.querySelector('.settings__title')?.textContent).toBe('Settings');

    const nameInput = page.querySelector<HTMLInputElement>('#settings-name');
    const emailInput = page.querySelector<HTMLInputElement>('#settings-email');
    const saveBtn = page.querySelector<HTMLButtonElement>('.settings__save-button');
    const profileBtn = page.querySelector<HTMLButtonElement>('.settings__profile-btn');

    expect(nameInput?.value).toBe('Alex Mercer');
    expect(emailInput?.value).toBe('alex@example.com');
    expect(nameInput?.disabled).toBe(true);
    expect(emailInput?.disabled).toBe(true);
    expect(profileBtn?.disabled).toBe(true);
    expect(saveBtn?.style.display).toBe('none');
  });

  test('loads saved avatar from localStorage on init', () => {
    const fakeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==';
    localStorage.setItem(AVATAR_STORAGE_KEY, fakeBase64);

    const page = createSettings();
    const preview = page.querySelector<HTMLImageElement>('.settings__user--preview');

    expect(preview?.src).toBe(fakeBase64);
    expect(preview?.hidden).toBe(false);
    expect(preview?.style.display).toBe('block');
  });

  test('enables editing on Edit click and saves updated user info to localStorage on Save', () => {
    const page = createSettings();
    document.body.append(page);

    const editBtn = page.querySelector<HTMLButtonElement>('.settings__edit-button');
    const saveBtn = page.querySelector<HTMLButtonElement>('.settings__save-button');
    const nameInput = page.querySelector<HTMLInputElement>('#settings-name');
    const emailInput = page.querySelector<HTMLInputElement>('#settings-email');

    editBtn?.click();

    expect(editBtn?.textContent).toBe('Cancel');
    expect(saveBtn?.style.display).toBe('inline-flex');
    expect(nameInput?.disabled).toBe(false);
    expect(emailInput?.disabled).toBe(false);

    nameInput!.value = 'Darya';
    emailInput!.value = 'darya@test.com';
    saveBtn?.click();

    expect(editBtn?.textContent).toBe('Edit');
    expect(saveBtn?.style.display).toBe('none');
    expect(nameInput?.disabled).toBe(true);

    const savedUser = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '{}');
    expect(savedUser.name).toBe('Darya');
    expect(savedUser.email).toBe('darya@test.com');
  });

  test('reverts unsaved changes when Cancel is clicked during edit mode', () => {
    const page = createSettings();
    document.body.append(page);

    const editBtn = page.querySelector<HTMLButtonElement>('.settings__edit-button');
    const nameInput = page.querySelector<HTMLInputElement>('#settings-name');

    editBtn?.click();
    nameInput!.value = 'Temporary Name';

    editBtn?.click();

    expect(getCurrentUser).toHaveBeenCalled();
    expect(nameInput?.value).toBe('Alex Mercer');
    expect(nameInput?.disabled).toBe(true);
  });

  test('toggles theme when theme button is clicked', () => {
    const page = createSettings();
    const themeBtn = page.querySelector<HTMLButtonElement>('.settings__theme-button');

    themeBtn?.click();

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  test('logs out user and navigates to home when Sign Out button is clicked', () => {
    const appContent = document.createElement('div');
    appContent.className = 'app-content';
    document.body.append(appContent);

    const page = createSettings();
    appContent.append(page);

    const signOutBtn = page.querySelector<HTMLButtonElement>('.settings__signout-button');
    signOutBtn?.click();

    expect(logoutUser).toHaveBeenCalledTimes(1);
    expect(navigateTo).toHaveBeenCalledWith('/', appContent);
  });
});
