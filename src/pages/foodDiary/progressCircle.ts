import { el } from '../../utils/tags';
import { calculateDailySummary, type IMeal } from './nutritionCalculator'; 

export function createProgressCircle(): HTMLElement {
    const DAILY_LIMIT = 2220;
    const todayKey = new Date().toISOString().split('T')[0];
    const savedData = localStorage.getItem(`meals_${todayKey}`);
    const currentMeals = savedData ? JSON.parse(savedData) : [];
    const summary = calculateDailySummary(currentMeals);
    const totalCalories = summary.totalCalories;
    const percent = Math.min((totalCalories / DAILY_LIMIT) * 100, 100);
    const circle = el('div', 'food-diary__circle');
    circle.style.background = `conic-gradient(var(--color-accent) ${percent}%, var(--color-light-grey) 0)`;
    const progressText = el('span', 'food-diary__circle-text', `${totalCalories}/${DAILY_LIMIT}\nlogged`);
    circle.append(progressText);
    return circle;
}
