import { el, createBtn } from '../../utils/tags';
import { createModal as createBaseModal } from '../../components/modal';
import type { IMeal } from './nutritionCalculator';

interface AddMealModalOptions {
  onAdd: (meal: IMeal) => void;
}

export function openAddMealModal({ onAdd }: AddMealModalOptions): void {
  const form = el('form', 'modal-form');

  const typeSelect = el('select', 'modal-select') as HTMLSelectElement;
  ['Breakfast', 'Lunch', 'Dinner', 'Snack'].forEach(type => {
    const option = el('option', '', type) as HTMLOptionElement;
    option.value = type.toUpperCase();
    typeSelect.appendChild(option);
  });

  const foodInput = el('input', 'modal-input') as HTMLInputElement;
  foodInput.placeholder = 'Meal name (e.g., Apple, Oatmeal)';
  foodInput.required = true;

  const weightInput = el('input', 'modal-input modal-input--weight') as HTMLInputElement;
  weightInput.type = 'number';
  weightInput.placeholder = 'Weight eaten (g)';
  weightInput.min = '1';
  weightInput.required = true;

  const bjuHint = el('span', 'modal-hint', 'Specify BJU per 100g of product:');

  const bjuInputsRow = el('div', 'modal-bju-inputs');
  const createNumInput = (placeholder: string) => {
    const input = el('input', 'modal-input modal-input--number') as HTMLInputElement;
    input.type = 'number';
    input.placeholder = placeholder;
    input.min = '0';
    input.step = '0.1';
    input.required = true;
    return input;
  };
  const pInput = createNumInput('Prot / 100g');
  const fInput = createNumInput('Fat / 100g');
  const cInput = createNumInput('Carb / 100g');
  bjuInputsRow.append(pInput, fInput, cInput);

  form.append(typeSelect, foodInput, weightInput, bjuHint, bjuInputsRow);

  const actionsRow = el('div', 'modal-actions');
  const cancelBtn = createBtn('modal-btn modal-btn--cancel', 'CANCEL');
  const submitBtn = createBtn('modal-btn modal-btn--submit', 'ADD', 'submit');
  actionsRow.append(cancelBtn, submitBtn);

  const { modal, contentArea } = createBaseModal({
    title: 'ADD NEW MEAL',
    footerContent: actionsRow
  });

  contentArea.append(form);
  document.body.appendChild(modal);

  cancelBtn.addEventListener('click', () => modal.remove());
  form.addEventListener('submit', (e) => e.preventDefault());

  submitBtn.addEventListener('click', () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const weightEaten = parseFloat(weightInput.value) || 0;
    const pPer100g = parseFloat(pInput.value) || 0;
    const fPer100g = parseFloat(fInput.value) || 0;
    const cPer100g = parseFloat(cInput.value) || 0;

    const actualProtein = (pPer100g * weightEaten) / 100;
    const actualFat = (fPer100g * weightEaten) / 100;
    const actualCarbs = (cPer100g * weightEaten) / 100;

    const calculatedCalories = Math.round((actualProtein * 4) + (actualFat * 9) + (actualCarbs * 4));

    const newMeal: IMeal = {
      id: crypto.randomUUID(),
      type: typeSelect.value,
      description: `${foodInput.value} (${weightEaten}g)`,
      calories: calculatedCalories,
      protein: Math.round(actualProtein),
      fat: Math.round(actualFat),
      carbs: Math.round(actualCarbs)
    };

    onAdd(newMeal);
    modal.remove();
  });
}