import { el, createBtn, createImg, createSvgIcon, createInput } from '../utils/tags';
import userPlusSvg from '../img/icon--user-plus.svg?raw';
import sunSvg from '../img/icon--sun.svg?raw';
import moonSvg from '../img/icon--moon.svg?raw';
import { getInitialTheme, applyTheme, toggleTheme } from '../components/theme';
import { createTabs } from '../components/tabs';
import { createFaqSlider } from '../pages/settings/faq-tab';
import { createSecurityTab } from '../pages/settings/security-tab';
import { createGoalsTab } from '../pages/settings/goals-tab';

export function createSettings(): HTMLElement {
    const settings = el('main', 'settings');
    const heading = el('div', 'settings__heading');
    const title = el('h1', 'settings__title', 'Settings');

    const actions = el('div', 'settings__actions');
    const themeBtn = createBtn('settings__theme-button');

    const editGroup = el('div', 'settings__edit-group');
    const editBtn = createBtn('settings__edit-button', 'Edit');
    const saveAllBtn = createBtn('settings__save-button', 'Save', 'submit');
    editGroup.append(editBtn, saveAllBtn);

    const iconSun = createSvgIcon(sunSvg, 'theme_icon theme_icon--sun');
    const iconMoon = createSvgIcon(moonSvg, 'theme_icon theme_icon--moon');
    themeBtn.append(iconSun, iconMoon);

    applyTheme(getInitialTheme());
    themeBtn.addEventListener('click', () => {
        toggleTheme();
    });

    actions.append(themeBtn, editGroup);
    heading.append(title, actions);

    const fileInput = createInput('settings__file-input', 'file');
    fileInput.accept = 'image/*';
    fileInput.id = 'avatar-upload';
    fileInput.hidden = true;
    fileInput.style.display = 'none';

    const profileBtn = createBtn('settings__profile-btn');
    profileBtn.setAttribute('aria-label', 'Upload avatar');
    profileBtn.addEventListener('click', () => fileInput.click());

    const profileBg = el('div', 'settings__user--bg');
    const profileIcon = createSvgIcon(userPlusSvg, 'settings__user--icon');
    const profilePreview = createImg('settings__user--preview', '', 'Avatar preview');
    profilePreview.hidden = true;
    profilePreview.style.display = 'none';

    profileBg.append(profileIcon, profilePreview);
    profileBtn.append(profileBg);

    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
            fileInput.value = '';
            return;
        }

        const url = URL.createObjectURL(file);
        profilePreview.src = url;
        profilePreview.hidden = false;
        profilePreview.style.display = 'block';
        profileIcon.style.display = 'none';
    });

    const formData = el('div', 'settings__form');

    const nameField = el('div', 'settings__field');
    const nameLabel = el('label', 'settings__label', 'Name:');
    nameLabel.htmlFor = 'settings-name';
    const nameInput = createInput('settings__input settings__input--name', 'text', 'Enter your name');
    nameInput.id = 'settings-name';
    nameField.append(nameLabel, nameInput);

    const emailField = el('div', 'settings__field');
    const emailLabel = el('label', 'settings__label', 'Email:');
    emailLabel.htmlFor = 'settings-email';
    const emailInput = createInput('settings__input settings__input--email', 'email', 'Enter your email');
    emailInput.id = 'settings-email';
    emailField.append(emailLabel, emailInput);

    formData.append(nameField, emailField);

    const faqContent = createFaqSlider();
    const goalsContent = createGoalsTab();
    const securityContent = createSecurityTab();

    const tabsBlock = createTabs('settings-tabs', [
        { id: 'faq', label: '01 FAQ', content: faqContent },
        { id: 'goals', label: '02 Goals', content: goalsContent },
        { id: 'security', label: '03 Security', content: securityContent },
    ]);

    const signOutBtn = createBtn('settings__signout-button', 'SIGN OUT OF ACCOUNT');
    signOutBtn.addEventListener('click', () => {
    });

    settings.append(heading, profileBtn, fileInput, formData, tabsBlock, signOutBtn);

    let isEditing = false;

    const setEditMode = (editing: boolean) => {
        isEditing = editing;
        saveAllBtn.style.display = editing ? 'inline-flex' : 'none';
        profileBtn.disabled = !editing;

        const fields = settings.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
            'input, select, textarea'
        );
        fields.forEach((field) => {
            field.disabled = !editing;
        });

        editBtn.textContent = editing ? 'Cancel' : 'Edit';

        if (editing) {
            nameInput.focus();
        }
    };

    setEditMode(false);

    editBtn.addEventListener('click', () => {
        setEditMode(!isEditing);
    });

    saveAllBtn.addEventListener('click', () => {
        setEditMode(false);
    });
    
    return settings;
}
