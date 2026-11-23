import { el, createBtn, createImg, createSvgIcon, createInput } from '../utils/tags';
import userPlusSvg from '../img/icon--user-plus.svg?raw';
import sunSvg from '../img/icon--sun.svg?raw';
import moonSvg from '../img/icon--moon.svg?raw';
import { getInitialTheme, applyTheme, toggleTheme } from '../components/theme';
import { createTabs } from '../components/tabs';
import { createFaqSlider } from '../pages/settings/faq-tab';
import { createSecurityTab } from '../pages/settings/security-tab';
import { createGoalsTab } from '../pages/settings/goals-tab';
import { navigateTo } from '../utils/router';
import { getCurrentUser, logoutUser } from '../components/authModal';

const AVATAR_STORAGE_KEY = 'fit_cabinet_avatar';
const AUTH_STORAGE_KEY = 'fit_cabinet_user';

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

    const applyAvatarView = (src: string | null) => {
        if (src) {
            profilePreview.src = src;
            profilePreview.hidden = false;
            profilePreview.style.display = 'block';
            profileIcon.style.display = 'none';
        } else {
            profilePreview.src = '';
            profilePreview.hidden = true;
            profilePreview.style.display = 'none';
            profileIcon.style.display = 'block';
        }
    };

    applyAvatarView(localStorage.getItem(AVATAR_STORAGE_KEY));

    profileBg.append(profileIcon, profilePreview);
    profileBtn.append(profileBg);

    let pendingAvatarBase64: string | null = null;

    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
            fileInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = String(reader.result || '');
            pendingAvatarBase64 = base64;
            applyAvatarView(base64);
        };
        reader.readAsDataURL(file);
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

    const currentUser = getCurrentUser();
    if (currentUser) {
        nameInput.value = currentUser.name;
        emailInput.value = currentUser.email;
    }

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
        logoutUser();
        const container = (document.querySelector('.app-content') as HTMLElement) || document.body;
        navigateTo('/', container);
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
        if (isEditing) {
            pendingAvatarBase64 = null;
            fileInput.value = '';
            applyAvatarView(localStorage.getItem(AVATAR_STORAGE_KEY));

            const savedUser = getCurrentUser();
            if (savedUser) {
                nameInput.value = savedUser.name;
                emailInput.value = savedUser.email;
            }
        }
        setEditMode(!isEditing);
    });

    saveAllBtn.addEventListener('click', () => {
        if (pendingAvatarBase64) {
            localStorage.setItem(AVATAR_STORAGE_KEY, pendingAvatarBase64);
            pendingAvatarBase64 = null;
        }

        const user = getCurrentUser();
        if (user) {
            localStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify({
                    ...user,
                    name: nameInput.value.trim() || user.name,
                    email: emailInput.value.trim() || user.email,
                })
            );
        }

        setEditMode(false);
    });

    return settings;
}
