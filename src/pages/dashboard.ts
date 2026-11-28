import { el } from '../utils/tags';
import { navigateTo } from '../utils/router';
import { createProgressCircle } from './foodDiary/progressCircle';


export function createDashboard(): HTMLElement {
    const dashboard = el('main', 'dashboard');
    const userName: string | null = null;
    const greeting = userName ? `Hello, ${userName}!` : 'Welcome to Fitcabinet!';
    const subTitle = 'Small steps, big results.';
    const titleText = `${greeting}\n${subTitle}`;
    const title = el('h1', 'dashboard__title', titleText);   
    const dashboardgrid = el('div', 'dashboard__grid');
    
    const pageContainer = document.querySelector('.app-content') as HTMLElement;
    const bindNavigation = (button: HTMLElement, path: string) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const container = pageContainer || document.querySelector('.app-content') as HTMLElement;
            if (container) {
                navigateTo(path, container);
            }
        });
    };

    const foodDiary = el('div', 'dashboard__card dashboard__food-diary');
    const foodDiaryLink = el('button', 'dashboard__show-more', 'Show more');
    const foodDiaryHeading = el('h2', 'dashboard__card-heading', 'food diary');
    const foodDiaryProgress = el('div', 'food-diary__progress');
    const foodDiaryProgressCircle = createProgressCircle(); 
    foodDiaryProgress.append(foodDiaryProgressCircle);
    const foodDiaryBtn = el('button', 'dashboard__action-btn', 'Add meal');
    foodDiary.append(foodDiaryLink, foodDiaryHeading, foodDiaryProgress, foodDiaryBtn);
    bindNavigation(foodDiaryLink, '/food-diary');
    bindNavigation(foodDiaryBtn, '/food-diary');
    
    const workouts = el('div', 'dashboard__card dashboard__workouts');
    const workoutsLink = el('button', 'dashboard__show-more', 'Show more');
    const workoutsHeading = el('h2', 'dashboard__card-heading', 'workouts');
    const workoutsSubheading = el('h3', 'workouts__subheading', 'Planned for today:');
    const workoutsTable = el('table', 'workouts__table');
    const workoutsThead = el('thead');
    const workoutsTRow = el('tr');
    workoutsTRow.append(el('th', 'workouts__th-name', 'name'), el('th', '', 'sets'), el('th', '', 'reps'));
    workoutsThead.append(workoutsTRow);    
    const workoutsTbody = el('tbody');
    const workoutsTrSample = el('tr');
    workoutsTrSample.append(el('td', '', 'Dumbbell Row'), el('td', '', '3'), el('td', '', '10'));
    workoutsTbody.append(workoutsTrSample);
    workoutsTable.append(workoutsThead, workoutsTbody);    
    const workoutsBtn = el('button', 'dashboard__action-btn', 'Add workout');
    workouts.append(workoutsLink, workoutsHeading, workoutsSubheading, workoutsTable, workoutsBtn);
    bindNavigation(workoutsLink, '/workouts');
    bindNavigation(workoutsBtn, '/create-workout');
    
    const habits = el('div', 'dashboard__card dashboard__habits');
    const habitsLink = el('button', 'dashboard__show-more', 'Show more');
    const habitsHeading = el('h2', 'dashboard__card-heading', 'your habits');
    const habitsList = el('div', 'habits');
    const habitsItem1 = el('div', 'habit');
    const habitsText1 = el('p', 'habit__text', "Don't forget to drink water!");
    const habitsBtn1 = el('button', 'habit__complete-btn', 'Done');
    habitsItem1.append(habitsText1, habitsBtn1);
    habitsBtn1.addEventListener('click', () => {
        habitsBtn1.classList.toggle('is-complete');
    });
    const habitsItem2 = el('div', 'habit');
    const habitsText2 = el('p', 'habit__text', "Don't forget to move!");
    const habitsBtn2 = el('button', 'habit__complete-btn', 'Done');
    habitsItem2.append(habitsText2, habitsBtn2);
    habitsBtn2.addEventListener('click', () => {
        habitsBtn2.classList.toggle('is-complete');
    });
    habitsList.append(habitsItem1, habitsItem2);
    const habitsBtnAll = el('button', 'dashboard__action-btn', 'All habits');
    habits.append(habitsLink, habitsHeading, habitsList, habitsBtnAll);
    bindNavigation(habitsLink, '/habits');
    bindNavigation(habitsBtnAll, '/habits');
    
    const notes = el('div', 'dashboard__card dashboard__notes');
    const notesLink = el('button', 'dashboard__show-more', 'Show more');
    const notesHeading = el('h2', 'dashboard__card-heading', 'your notes');
    const notesList = el('ul', 'notes__list');
    notesList.append(
        el('li', 'notes__item', 'Get a new gym pass'),
        el('li', 'notes__item', 'Prep meals for a week')
    );
    const notesInput = el('input', 'notes__quick-input');
    notesInput.setAttribute('type', 'text');
    notesInput.setAttribute('placeholder', 'Add new note...');
    const notesBtnAll = el('button', 'dashboard__action-btn', 'All notes');
    notes.append(notesLink, notesHeading, notesList, notesInput, notesBtnAll);
    bindNavigation(notesLink, '/notes');
    bindNavigation(notesBtnAll, '/notes');

    dashboardgrid.append(foodDiary, workouts, habits, notes)
    dashboard.append(title, dashboardgrid);
    return dashboard;
}