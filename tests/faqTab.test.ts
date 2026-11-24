// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from 'vitest';
import {
    createFaqSlider,
    getSavedFaqStats,
    FAQ_STORAGE_KEY,
    type FaqStats,
} from '../src/pages/settings/faq-tab';

describe('faq-tab module', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.replaceChildren();
    });

    describe('getSavedFaqStats', () => {
        test('returns default stats when localStorage is empty or contains invalid JSON', () => {
            expect(getSavedFaqStats()).toEqual({
                gender: 'male',
                weight: '',
                height: '',
                age: '',
            });

            localStorage.setItem(FAQ_STORAGE_KEY, 'invalid-json');
            expect(getSavedFaqStats()).toEqual({
                gender: 'male',
                weight: '',
                height: '',
                age: '',
            });
        });

        test('returns parsed stats from localStorage when valid data exists', () => {
            const saved: FaqStats = {
                gender: 'female',
                weight: '58',
                height: '168',
                age: '27',
            };
            localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(saved));

            expect(getSavedFaqStats()).toEqual(saved);
        });
    });

    describe('createFaqSlider', () => {
        test('renders initial slide (1 / 4), hides Back button, and populates saved values', () => {
            const saved: FaqStats = {
                gender: 'female',
                weight: '62',
                height: '170',
                age: '25',
            };
            localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(saved));

            const slider = createFaqSlider();
            document.body.append(slider);

            expect(slider.querySelector('.settings-faq__counter')?.textContent).toBe('1 / 4');

            const slides = slider.querySelectorAll<HTMLElement>('.settings-faq__slide');
            expect(slides).toHaveLength(4);
            expect(slides[0].style.display).toBe('flex');
            expect(slides[1].style.display).toBe('none');

            const prevBtn = slider.querySelector<HTMLButtonElement>('.settings-faq__btn--prev');
            const nextBtn = slider.querySelector<HTMLButtonElement>('.settings-faq__btn--next');
            expect(prevBtn?.style.visibility).toBe('hidden');
            expect(nextBtn?.style.visibility).toBe('visible');

            const genderSelect = slider.querySelector<HTMLSelectElement>('select[name="gender"]');
            const weightInput = slider.querySelector<HTMLInputElement>('input[name="weight"]');
            const heightInput = slider.querySelector<HTMLInputElement>('input[name="height"]');
            const ageInput = slider.querySelector<HTMLInputElement>('input[name="age"]');

            expect(genderSelect?.value).toBe('female');
            expect(weightInput?.value).toBe('62');
            expect(heightInput?.value).toBe('170');
            expect(ageInput?.value).toBe('25');
        });

        test('navigates through slides using Next, Back, and progress bars', () => {
            const slider = createFaqSlider();
            document.body.append(slider);

            const counter = slider.querySelector('.settings-faq__counter');
            const slides = slider.querySelectorAll<HTMLElement>('.settings-faq__slide');
            const bars = slider.querySelectorAll<HTMLButtonElement>('.settings-faq__bar');
            const prevBtn = slider.querySelector<HTMLButtonElement>('.settings-faq__btn--prev');
            const nextBtn = slider.querySelector<HTMLButtonElement>('.settings-faq__btn--next');

            // Переход на 2-й слайд по кнопке Next
            nextBtn?.click();
            expect(counter?.textContent).toBe('2 / 4');
            expect(slides[1].style.display).toBe('flex');
            expect(prevBtn?.style.visibility).toBe('visible');
            expect(bars[1].classList.contains('settings-faq__bar--active')).toBe(true);

            // Переход сразу на 4-й слайд по клику на 4-ю полоску
            bars[3]?.click();
            expect(counter?.textContent).toBe('4 / 4');
            expect(slides[3].style.display).toBe('flex');
            expect(nextBtn?.style.visibility).toBe('hidden');

            // Возврат на 3-й слайд по кнопке Back
            prevBtn?.click();
            expect(counter?.textContent).toBe('3 / 4');
            expect(slides[2].style.display).toBe('flex');
            expect(nextBtn?.style.visibility).toBe('visible');
        });

        test('automatically saves changes to localStorage on input and select events', () => {
            const slider = createFaqSlider();
            document.body.append(slider);

            const genderSelect = slider.querySelector<HTMLSelectElement>('select[name="gender"]')!;
            const weightInput = slider.querySelector<HTMLInputElement>('input[name="weight"]')!;
            const heightInput = slider.querySelector<HTMLInputElement>('input[name="height"]')!;
            const ageInput = slider.querySelector<HTMLInputElement>('input[name="age"]')!;

            genderSelect.value = 'female';
            genderSelect.dispatchEvent(new Event('change'));

            weightInput.value = '55';
            weightInput.dispatchEvent(new Event('input'));

            heightInput.value = '165';
            heightInput.dispatchEvent(new Event('input'));

            ageInput.value = '24';
            ageInput.dispatchEvent(new Event('input'));

            expect(getSavedFaqStats()).toEqual({
                gender: 'female',
                weight: '55',
                height: '165',
                age: '24',
            });
        });
    });
});
