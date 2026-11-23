import { el, createBtn, createInput } from '../../utils/tags';

export interface FaqStats {
    gender: string;
    weight: string;
    height: string;
    age: string;
}

export const FAQ_STORAGE_KEY = 'fit_cabinet_faq';

export function getSavedFaqStats(): FaqStats {
    const raw = localStorage.getItem(FAQ_STORAGE_KEY);
    if (!raw) {
        return { gender: 'male', weight: '', height: '', age: '' };
    }
    try {
        return JSON.parse(raw) as FaqStats;
    } catch {
        return { gender: 'male', weight: '', height: '', age: '' };
    }
}

export function createFaqSlider(): HTMLElement {
    const faq = el('div', 'settings-faq');
    const savedStats = getSavedFaqStats();

    const header = el('div', 'settings-faq__header');
    const title = el('h2', 'settings-faq__title', 'FREQUENTLY ASKED QUESTIONS');
    const counter = el('span', 'settings-faq__counter', '1 / 4');
    header.append(title, counter);

    const track = el('div', 'settings-faq__track');

    const genderSlide = el('div', 'settings-faq__slide');
    const genderQ = el('h3', 'settings-faq__question', "WHAT'S YOUR GENDER?");
    const genderDesc = el('p', 'settings-faq__desc', 'Choose your gender. This information helps us calculate your fitness stats.');
    const genderSelect = el('select', 'settings-faq__select');
    genderSelect.name = 'gender';
    ['Male', 'Female'].forEach((val) => {
        const opt = el('option', '', val);
        opt.value = val.toLowerCase();
        genderSelect.append(opt);
    });
    genderSelect.value = savedStats.gender || 'male';
    genderSlide.append(genderQ, genderDesc, genderSelect);

    const weightSlide = el('div', 'settings-faq__slide');
    const weightQ = el('h3', 'settings-faq__question', "WHAT'S YOUR WEIGHT?");
    const weightDesc = el('p', 'settings-faq__desc', 'Add your weight. This information helps us calculate your fitness stats.');
    const weightControl = el('div', 'settings-faq__control');
    const weightInput = createInput('settings-faq__input', 'number', 'Enter your weight...', 'weight');
    weightInput.min = '20';
    weightInput.max = '400';
    weightInput.value = savedStats.weight;
    const weightBadge = el('span', 'settings-faq__badge', 'kg');
    weightControl.append(weightInput, weightBadge);
    weightSlide.append(weightQ, weightDesc, weightControl);

    const heightSlide = el('div', 'settings-faq__slide');
    const heightQ = el('h3', 'settings-faq__question', "WHAT'S YOUR HEIGHT?");
    const heightDesc = el('p', 'settings-faq__desc', 'Add your height. This information helps us calculate your fitness stats.');
    const heightControl = el('div', 'settings-faq__control');
    const heightInput = createInput('settings-faq__input', 'number', 'Enter your height...', 'height');
    heightInput.min = '50';
    heightInput.max = '260';
    heightInput.value = savedStats.height;
    const heightBadge = el('span', 'settings-faq__badge', 'cm');
    heightControl.append(heightInput, heightBadge);
    heightSlide.append(heightQ, heightDesc, heightControl);

    const ageSlide = el('div', 'settings-faq__slide');
    const ageQ = el('h3', 'settings-faq__question', 'HOW OLD ARE YOU?');
    const ageDesc = el('p', 'settings-faq__desc', 'Add your age. This information helps us calculate your fitness stats.');
    const ageControl = el('div', 'settings-faq__control');
    const ageInput = createInput('settings-faq__input', 'number', 'Enter your age...', 'age');
    ageInput.min = '10';
    ageInput.max = '120';
    ageInput.value = savedStats.age;
    const ageBadge = el('span', 'settings-faq__badge', 'age');
    ageControl.append(ageInput, ageBadge);
    ageSlide.append(ageQ, ageDesc, ageControl);

    const saveFaqData = () => {
        const data: FaqStats = {
            gender: genderSelect.value,
            weight: weightInput.value.trim(),
            height: heightInput.value.trim(),
            age: ageInput.value.trim(),
        };
        localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(data));
    };

    genderSelect.addEventListener('change', saveFaqData);
    weightInput.addEventListener('input', saveFaqData);
    heightInput.addEventListener('input', saveFaqData);
    ageInput.addEventListener('input', saveFaqData);

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
