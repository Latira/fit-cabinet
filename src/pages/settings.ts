import { el, createBtn, createImg, createSvgIcon } from '../utils/tags';
import userPlusIcon from '../img/icon--user-plus.svg';
import sunSvg from '../img/icon--sun.svg?raw';
import moonSvg from '../img/icon--moon.svg?raw';
import { getInitialTheme, applyTheme, toggleTheme } from '../components/theme';

export function createSettings(): HTMLElement {
    const settings = el('main', 'settings');
    const heading = el('div', 'settings__heading');
    const title = el('h1', 'settings__title', 'Settings');

    const actions = el('div', 'settings__actions');
    const themeBtn = createBtn('settings__theme-button');
    const editBtn = createBtn('settings__edit-button', 'Edit');

    const iconSun = createSvgIcon(sunSvg, 'theme_icon theme_icon--sun');
    const iconMoon = createSvgIcon(moonSvg, 'theme_icon theme_icon--moon');

    themeBtn.append(iconSun, iconMoon);

    applyTheme(getInitialTheme());

    themeBtn.addEventListener('click', () => {
        toggleTheme();
    });

    actions.append(themeBtn, editBtn);
    heading.append(title, actions);

    const profile = el('div', 'settings__profile');
    const profileBg = el('div', 'settings__user--bg');
    const profileIcon = createImg('settings__user--icon', userPlusIcon, 'icon profile user');

    profileBg.append(profileIcon);
    profile.append(profileBg);
    settings.append(heading, profile);
    return settings;
}