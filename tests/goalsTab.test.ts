// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createGoalsTab } from '../src/pages/settings/goals-tab';

vi.mock('../src/img/icon--goal-water.svg', () => ({
    default: '/mocked-water.svg',
}));

vi.mock('../src/img/icon--goal-sleep.svg', () => ({
    default: '/mocked-sleep.svg',
}));

describe('createGoalsTab', () => {
    beforeEach(() => {
        document.body.replaceChildren();
    });

    test('renders sleep and water goal cards with titles and icons', () => {
        const goalsTab = createGoalsTab();
        document.body.append(goalsTab);

        expect(goalsTab.classList.contains('settings-goals')).toBe(true);

        const cards = goalsTab.querySelectorAll('.settings-goals__card');
        expect(cards).toHaveLength(2);

        const titles = Array.from(goalsTab.querySelectorAll('.settings-goals__title')).map(
            (el) => el.textContent
        );
        expect(titles).toEqual(['Sleep goal', 'Set your daily water goal']);

        const sleepIcon = goalsTab.querySelector<HTMLImageElement>('.settings-goals__icon--sleep');
        const waterIcon = goalsTab.querySelector<HTMLImageElement>('.settings-goals__icon--water');

        expect(sleepIcon?.getAttribute('src')).toBe('/mocked-sleep.svg');
        expect(waterIcon?.getAttribute('src')).toBe('/mocked-water.svg');
    });

    test('renders sleep inputs with default values and min/max constraints', () => {
        const goalsTab = createGoalsTab();
        document.body.append(goalsTab);

        const timeInputs = goalsTab.querySelectorAll<HTMLInputElement>('.settings-goals__time-input');
        expect(timeInputs).toHaveLength(2);

        const hoursInput = timeInputs.item(0);
        const minsInput = timeInputs.item(1);

        expect(hoursInput.value).toBe('08');
        expect(hoursInput.min).toBe('0');
        expect(hoursInput.max).toBe('24');

        expect(minsInput.value).toBe('00');
        expect(minsInput.min).toBe('0');
        expect(minsInput.max).toBe('59');
    });

    test('renders water goal input with default 2500 ml and completed percentage', () => {
        const goalsTab = createGoalsTab();
        document.body.append(goalsTab);

        const waterInput = goalsTab.querySelector<HTMLInputElement>('.settings-goals__water-input');
        expect(waterInput?.value).toBe('2500');
        expect(waterInput?.step).toBe('50');

        const completedValue = goalsTab.querySelector('.settings-goals__stat-value');
        expect(completedValue?.textContent).toBe('44 %');
    });

    test('allows updating sleep and water input values', () => {
        const goalsTab = createGoalsTab();
        document.body.append(goalsTab);

        const timeInputs = goalsTab.querySelectorAll<HTMLInputElement>('.settings-goals__time-input');
        const hoursInput = timeInputs.item(0);
        const minsInput = timeInputs.item(1);
        const waterInput = goalsTab.querySelector<HTMLInputElement>('.settings-goals__water-input')!;

        hoursInput.value = '07';
        minsInput.value = '30';
        waterInput.value = '3000';

        expect(hoursInput.value).toBe('07');
        expect(minsInput.value).toBe('30');
        expect(waterInput.value).toBe('3000');
    });
});
