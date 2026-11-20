import { el, createInput, createImg } from '../../utils/tags';
import waterGlassUrl from '../../img/icon--goal-water.svg';
import sleepMoonUrl from '../../img/icon--goal-sleep.svg';

export function createGoalsTab(): HTMLElement {
    const goals = el('div', 'settings-goals');

    const sleepCard = el('div', 'settings-goals__card');
    const sleepTitle = el('h3', 'settings-goals__title', 'Sleep goal');
    const sleepIcon = createImg('settings-goals__icon settings-goals__icon--sleep', sleepMoonUrl, 'Sleep goal');
    const sleepDesc = el('p', 'settings-goals__desc', 'Set how many hours of sleep you need per night');

    const sleepControl = el('div', 'settings-goals__sleep-control');
    const hoursInput = createInput('settings-goals__time-input', 'number', '08');
    hoursInput.value = '08';
    hoursInput.min = '0';
    hoursInput.max = '24';
    const hoursUnit = el('span', 'settings-goals__time-unit', 'h');

    const minsInput = createInput('settings-goals__time-input', 'number', '00');
    minsInput.value = '00';
    minsInput.min = '0';
    minsInput.max = '59';
    const minsUnit = el('span', 'settings-goals__time-unit', 'm');

    sleepControl.append(hoursInput, hoursUnit, minsInput, minsUnit);
    sleepCard.append(sleepTitle, sleepIcon, sleepDesc, sleepControl);

    const waterCard = el('div', 'settings-goals__card');
    const waterTitle = el('h3', 'settings-goals__title', 'Set your daily water goal');
    const waterIcon = createImg('settings-goals__icon settings-goals__icon--water', waterGlassUrl, 'Water goal');

    const waterStats = el('div', 'settings-goals__stats');

    const myGoalCol = el('div', 'settings-goals__stat');
    const myGoalLabel = el('span', 'settings-goals__stat-label', 'My goal');
    const myGoalControl = el('div', 'settings-goals__water-control');
    const waterInput = createInput('settings-goals__water-input', 'number', '2500');
    waterInput.value = '2500';
    waterInput.step = '50';
    const waterUnit = el('span', 'settings-goals__water-unit', 'ml');
    myGoalControl.append(waterInput, waterUnit);
    myGoalCol.append(myGoalLabel, myGoalControl);

    const completedCol = el('div', 'settings-goals__stat');
    const completedLabel = el('span', 'settings-goals__stat-label', 'Completed');
    const completedValue = el('span', 'settings-goals__stat-value', '44 %');
    completedCol.append(completedLabel, completedValue);

    waterStats.append(myGoalCol, completedCol);
    waterCard.append(waterTitle, waterIcon, waterStats);

    goals.append(sleepCard, waterCard);
    return goals;
}
