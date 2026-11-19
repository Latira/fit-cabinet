import { el, createBtn, createImg, createInput} from '../utils/tags';
import userPlusIcon from '../img/icon--user-plus.svg';
import themeIconSun from '../img/icon--sun.svg';
import themeIconMoon from '../img/icon--moon.svg';

export function createSettings(): HTMLElement {
    const settings = el('main', 'settings');
    const heading = el('div', 'settings__heading');
    const title = el('h1', 'settings__title', 'Settings');

    const actions = el('div', 'settings__actions');
    const themeBtn = createBtn('settings__theme-button');
    const editBtn = createBtn('settings__edit-button', 'Edit');
    const iconSun = createImg('theme_icon theme_icon--sun', themeIconSun, 'icon theme of sun');
    const iconMoon = createImg('theme_icon theme_icon--moon', themeIconMoon, 'icon theme of moon');

    themeBtn.append(iconSun, iconMoon);
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