import { el } from '../utils/tags';

export function createFoodDiary(): HTMLElement {
    const foodDiary = el('main', 'food-diary');
    const title = el('h1', 'food-diary__title', 'food diary');   

    foodDiary.append(title);
    return foodDiary;
}