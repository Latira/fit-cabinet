import { el, createBtn, createImg, createSvgIcon, createInput } from '../utils/tags';
import userPlusSvg from '../img/icon--user-plus.svg?raw';
import sunSvg from '../img/icon--sun.svg?raw';
import moonSvg from '../img/icon--moon.svg?raw';
import { getInitialTheme, applyTheme, toggleTheme } from '../components/theme';
import { createTabs } from '../components/tabs';

function createFaqSlider(): HTMLElement {
    const faq = el('div', 'settings-faq');

    const header = el('div', 'settings-faq__header');
    const title = el('h2', 'settings-faq__title', 'FREQUENTLY ASKED QUESTIONS');
    const counter = el('span', 'settings-faq__counter', '1 / 4');
    header.append(title, counter);

    const track = el('div', 'settings-faq__track');

    const genderSlide = el('div', 'settings-faq__slide');
    const genderQ = el('h3', 'settings-faq__question', "WHAT'S YOUR GENDER?");
    const genderDesc = el('p', 'settings-faq__desc', 'Choose your gender. This information helps us calculate your fitness stats.');
    const genderSelect = el('select', 'settings-faq__select');
    ['Male', 'Female'].forEach((val) => {
        const opt = el('option', '', val);
        opt.value = val.toLowerCase();
        genderSelect.append(opt);
    });
    genderSlide.append(genderQ, genderDesc, genderSelect);

    const weightSlide = el('div', 'settings-faq__slide');
    const weightQ = el('h3', 'settings-faq__question', "WHAT'S YOUR WEIGHT?");
    const weightDesc = el('p', 'settings-faq__desc', 'Add your weight. This information helps us calculate your fitness stats.');
    const weightControl = el('div', 'settings-faq__control');
    const weightInput = createInput('settings-faq__input', 'number', 'Enter your weight...');
    const weightBadge = el('span', 'settings-faq__badge', 'kg');
    weightControl.append(weightInput, weightBadge);
    weightSlide.append(weightQ, weightDesc, weightControl);

    const heightSlide = el('div', 'settings-faq__slide');
    const heightQ = el('h3', 'settings-faq__question', "WHAT'S YOUR HEIGHT?");
    const heightDesc = el('p', 'settings-faq__desc', 'Add your height. This information helps us calculate your fitness stats.');
    const heightControl = el('div', 'settings-faq__control');
    const heightInput = createInput('settings-faq__input', 'number', 'Enter your height...');
    const heightBadge = el('span', 'settings-faq__badge', 'cm');
    
    heightControl.append(heightInput, heightBadge);
    heightSlide.append(heightQ, heightDesc, heightControl);

    const ageSlide = el('div', 'settings-faq__slide');
    const ageQ = el('h3', 'settings-faq__question', 'HOW OLD ARE YOU?');
    const ageDesc = el('p', 'settings-faq__desc', 'Add your age. This information helps us calculate your fitness stats.');
    const ageControl = el('div', 'settings-faq__control');
    const ageInput = createInput('settings-faq__input', 'number', 'Enter your age...');
    const ageBadge = el('span', 'settings-faq__badge', 'age');
    ageControl.append(ageInput, ageBadge);
    ageSlide.append(ageQ, ageDesc, ageControl);

    const slides = [genderSlide, weightSlide, heightSlide, ageSlide];
    track.append(...slides);

    const footer = el('div', 'settings-faq__footer');
    const barsWrap = el('div', 'settings-faq__bars');
    const bars = slides.map((_, idx) => {
        const bar = createBtn('settings-faq__bar');
        bar.setAttribute('aria-label', `Slide ${idx + 1}`);
        bar.addEventListener('click', () => {
            currentIndex = idx;
            updateSlide();
        });
        barsWrap.append(bar);
        return bar;
    });

    const navBtns = el('div', 'settings-faq__nav');
    const prevBtn = createBtn('settings-faq__btn settings-faq__btn--prev', '← Back');
    const nextBtn = createBtn('settings-faq__btn settings-faq__btn--next', 'Next →');

    navBtns.append(prevBtn, nextBtn);
    footer.append(barsWrap, navBtns);
    faq.append(header, track, footer);

    let currentIndex = 0;

    const updateSlide = () => {
        counter.textContent = `${currentIndex + 1} / ${slides.length}`;

        slides.forEach((slide, idx) => {
            slide.style.display = idx === currentIndex ? 'flex' : 'none';
        });

        bars.forEach((bar, idx) => {
            bar.classList.toggle('settings-faq__bar--active', idx === currentIndex);
        });

        prevBtn.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
        nextBtn.style.visibility = currentIndex === slides.length - 1 ? 'hidden' : 'visible';
    };

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlide();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide();
        }
    });

    updateSlide();
    return faq;
}

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

        if (!file.type.startsWith('image/')) {
            fileInput.value = '';
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
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

    nameInput.disabled = true;
    emailInput.disabled = true;
    profileBtn.disabled = true;

    formData.append(nameField, emailField);

    const faqContent = createFaqSlider();
    const goalsContent = el('div', 'settings-goals', 'Здесь будут цели: Вода и Сон');
    const securityContent = el('div', 'settings-security', 'Здесь будет Security');

    const tabsBlock = createTabs('settings-tabs', [
        { id: 'faq', label: '01 FAQ', content: faqContent },
        { id: 'goals', label: '02 Goals', content: goalsContent },
        { id: 'security', label: '03 Security', content: securityContent },
    ]);

        const saveAllBtn = createBtn('settings__save-button', 'Save', 'submit');
    settings.append(heading, profileBtn, fileInput, formData, tabsBlock, saveAllBtn);

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

    settings.append(heading, profileBtn, fileInput, formData, tabsBlock, saveAllBtn);
    return settings;
}