import { el, createBtn, createImg, createSvgIcon } from '../utils/tags';


export function createDashboard(): HTMLElement {
    const dashboard = el('main', 'dashboard');
    const userName: string | null = null;
    const greeting = userName ? `Hello, ${userName}!` : 'Welcome to Fitcabinet!';
    const subTitle = 'Small steps, big results.';
    const titleText = `${greeting}\n${subTitle}`;
    const title = el('h1', 'dashboard__title', titleText);
    
    const dashboardgrid = el('div', 'dashboard__grid');
    const foodDiary = el('div', 'dashboard__food-diary');
    const foodDiaryHeading = el('h2', 'food-diary__heading', 'food diary');
    foodDiary.append(foodDiaryHeading);
    const workouts = el('div', 'dashboard__workouts');
    const workoutsHeading = el('h2', 'workouts__heading', 'workouts');
    workouts.append(workoutsHeading);
    const habits = el('div', 'dashboard__habits');
    const habitsHeading = el('h2', 'habits__heading', 'your habits');
    habits.append(habitsHeading);
    const notes = el('div', 'dashboard__notes');
    const notesHeading = el('h2', 'notes__heading', 'your notes');
    notes.append(notesHeading);

    dashboardgrid.append(foodDiary, workouts, habits, notes)
    dashboard.append(title, dashboardgrid);
    return dashboard;
}