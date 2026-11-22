import { el } from '../utils/tags';

export function createHabits(): HTMLElement {
    const habits = el('main', 'habits');
    const title = el('h1', 'habits__title', 'habits');   

    habits.append(title);
    return habits;
}