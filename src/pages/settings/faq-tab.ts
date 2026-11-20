import { el, createBtn, createInput } from '../../utils/tags';

export function createFaqSlider(): HTMLElement {
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