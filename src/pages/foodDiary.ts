import { el, createBtn, createSvgIcon } from '../utils/tags';
import { calculateDailySummary, type IMeal } from './foodDiary/nutritionCalculator';
import { openAddMealModal } from './foodDiary/addFoodModal';
import { createCalendar } from '../components/calendar';

export function createFoodDiary(): HTMLElement {
  // const currentMeals: IMeal[] = [
  //     {
  //         id: '1',
  //         type: 'BREAKFAST',
  //         description: 'Oatmeal',
  //         calories: 420,
  //         protein: 15,
  //         fat: 12,
  //         carbs: 63
  //     }
  // ];
  const DAILY_LIMIT = 2220;
  let activeDate = new Date();
  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  function getMealsForDate(date: Date): IMeal[] {
    const key = formatDateKey(date);
    const data = localStorage.getItem(`meals_${key}`);

    if (!data) {
      return [];
    }
    return JSON.parse(data);
  }

  function saveMealsForDate(date: Date, meals: IMeal[]) {
    const key = formatDateKey(date);
    localStorage.setItem(`meals_${key}`, JSON.stringify(meals));
  }

  const foodDiary = el('main', 'food-diary');

  function renderContent() {
    const currentMeals = getMealsForDate(activeDate);
    const summary = calculateDailySummary(currentMeals);

    const oldWidget = foodDiary.querySelector('.nutrition-widget');
    if (oldWidget) oldWidget.remove();

    const nutritionWidget = el('div', 'nutrition-widget');
    const widgetTitle = el('h3', 'nutrition-widget__title', "TODAY'S NUTRITION");
    const widgetContent = el('div', 'nutrition-widget__content');

    const progressCircle = el('div', 'nutrition-widget__circle');
    const progressPercent = Math.min((summary.totalCalories / DAILY_LIMIT) * 100, 100);
    progressCircle.style.background = `conic-gradient(var(--color-accent) ${progressPercent}%, var(--color-light-grey) 0)`;

    const progressText = el(
      'span',
      'nutrition-widget__circle-text',
      `${summary.totalCalories}/${DAILY_LIMIT}\nlogged`
    );
    progressCircle.append(progressText);

    const kCalInfo = el('div', 'nutrition-widget__main-info');
    const kCalValue = el('span', 'nutrition-widget__kcal-val', `${summary.totalCalories} kcal`);
    const divider = el('div', 'kCal__divider');

    const bjuGrid = el('div', 'nutrition-widget__bju-grid');

    const proteinContent = el('div', 'bju-content');
    proteinContent.append(
      el('p', 'bju-item', `${summary.totalProtein} g`),
      el('p', 'bju-name', 'Protein')
    );

    const fatContent = el('div', 'bju-content');
    fatContent.append(el('div', 'bju-item', `${summary.totalFat} g`), el('p', 'bju-name', 'Fat'));

    const carbsContent = el('div', 'bju-content');
    carbsContent.append(
      el('div', 'bju-item', `${summary.totalCarbs} g`),
      el('p', 'bju-name', 'Carbs')
    );

    bjuGrid.append(proteinContent, fatContent, carbsContent);
    kCalInfo.append(kCalValue, divider, bjuGrid);
    widgetContent.append(progressCircle, kCalInfo);
    nutritionWidget.append(widgetTitle, widgetContent);

    const oldList = foodDiary.querySelector('.meals-list');
    if (oldList) oldList.remove();

    const mealsList = el('div', 'meals-list');
    const mealsCupSvg = `
            <svg width="42" height="52" viewBox="0 0 42 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.2 50.2667C31.2 51.2373 30.4373 52 29.4667 52H1.73333C0.762667 52 0 51.2373 0 50.2667C0 49.296 0.762667 48.5333 1.73333 48.5333H29.4667C30.4373 48.5333 31.2 49.296 31.2 50.2667ZM31.2 20.8V24.7867C32.3093 24.44 33.488 24.2667 34.6667 24.2667C38.48 24.2667 41.6 27.3867 41.6 31.2C41.6 35.048 38.896 38.376 35.152 39.1733L25.9307 41.1493C23.1573 43.576 19.552 45.0667 15.6 45.0667C6.968 45.0667 0 38.0987 0 29.4667V20.8H31.2ZM34.6667 27.7333C33.4533 27.7333 32.2747 28.0107 31.2 28.5307V29.4667C31.2 32.1707 30.5067 34.6667 29.328 36.8853L34.424 35.8107C36.5733 35.3253 38.1333 33.4187 38.1333 31.2C38.1333 29.2933 36.5733 27.7333 34.6667 27.7333ZM18.2 19.0667L18.9973 18.928C21.2853 18.4773 27.7333 16.848 27.7333 12.1333C27.7333 8.59733 23.7467 7.592 20.3493 6.76C17.784 6.136 16.4667 4.92267 16.4667 3.46667C16.4667 2.32267 17.056 1.144 18.2 0C14.2827 1.352 12.3067 3.25867 12.3067 5.72C12.3067 8.424 14.9413 9.39467 17.4373 10.296C19.7947 11.1627 21.6667 12.584 21.6667 14.7333C21.6667 17.3333 18.2 19.0667 18.2 19.0667ZM9.11733 14.2133L7.83467 13.5893C6.448 12.896 5.2 12.0293 5.2 10.6773C5.2 8.56267 6.656 6.72533 9.53333 5.2C8.944 6.344 8.66667 7.52267 8.66667 8.66667C8.66667 10.1573 10.192 10.7467 11.9947 11.3707C13.832 11.9947 15.7733 12.6533 15.7733 14.4213C15.7733 16.952 13.416 18.512 8.66667 19.0667C10.4 17.9227 11.2667 17.056 11.2667 16.4667C11.2667 15.5307 10.3653 14.8373 9.11733 14.2133Z" fill="currentColor"/>
            </svg>`;

    if (currentMeals.length === 0) {
      mealsList.append(el('p', 'meals-list__empty', 'No meals logged for this day.'));
    } else {
      currentMeals.forEach((meal) => {
        const mealCard = el('div', 'meal-card');
        const mealIcon = el('div', 'meal-card__icon');
        const mealsCup = createSvgIcon(mealsCupSvg, 'meal-card__svg');
        mealIcon.append(mealsCup);

        const mealInfo = el('div', 'meal-card__info');
        const mealType = el('h4', 'meal-card__type', meal.type);
        const mealDesc = el('p', 'meal-card__description', meal.description);
        mealInfo.append(mealType, mealDesc);

        const mealCalories = el('div', 'meal-card__calories', `${meal.calories} KCAL`);
        mealCard.append(mealIcon, mealInfo, mealCalories);
        mealsList.appendChild(mealCard);
      });
    }
    foodDiary.append(nutritionWidget, mealsList);
  }

  const title = el('h1', 'food-diary__title', 'food diary');
  const controlsRow = el('div', 'food-diary__controls');
  const addMeal = el('div', 'food-diary__add-meal');
  const addMealBtn = createBtn('food-diary__add-meal__btn', 'ADD MEAL');
  addMeal.append(el('h3', 'food-diary__add-meal__text', 'WHAT HAVE YOU EAT TODAY?'), addMealBtn);
  const calendarBlock = createCalendar({
    onChangeDate: (selectedDate) => {
      activeDate = selectedDate;
      renderContent();
    },
  });
  controlsRow.append(addMeal, calendarBlock);

  foodDiary.append(title, controlsRow);

  addMealBtn.addEventListener('click', () => {
    openAddMealModal({
      onAdd: (newMeal) => {
        const meals = getMealsForDate(activeDate);
        meals.push(newMeal);
        saveMealsForDate(activeDate, meals);
        renderContent();
      },
    });
  });

  renderContent();

  return foodDiary;
}
