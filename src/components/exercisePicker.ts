import { el, createBtn, createInput } from '../utils/tags';
import { getExercises, type Exercise } from '../api/exercises';
import { createModal } from './modal';

export function createExercisePicker(
    onSelect: (selectedExercises: Exercise[]) => void,
    currentSelection: Exercise[] = [],
    customExercises: Exercise[] = [] // <-- Массив для сохранения кастомных упражнений
): HTMLElement {
    const doneBtn = createBtn('exercise-picker__done-btn', 'Done');

    const { modal, contentArea } = createModal({
        title: 'Select Exercises',
        footerContent: doneBtn,
    });

    // --- Блок создания своего упражнения ---
    const createSection = el('div', 'exercise-picker__create-section');
    const createInput = el('input', 'exercise-picker__create-input');
    createInput.type = 'text';
    createInput.placeholder = 'Type your own exercise...';
    
    const addCustomBtn = createBtn('exercise-picker__create-btn', '+ Create');
    
    createSection.append(createInput, addCustomBtn);

    // --- Блок поиска ---
    const searchInput = el('input', 'exercise-picker__search');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search exercises...';

    const listContainer = el('div', 'exercise-picker__list custom-scrollbar');
    
    contentArea.append(createSection, searchInput, listContainer);

    let allExercises: Exercise[] = [];
    let selected: Set<string> = new Set(currentSelection.map(ex => ex.name));

    // Загрузка данных с сервера
    listContainer.append(el('p', 'exercise-picker__status', 'Loading...'));
    getExercises({ limit: '100' }).then((res) => {
        const serverExercises = Array.isArray(res) ? res : res.data || [];
        // Объединяем кастомные упражнения с теми, что пришли с сервера
        allExercises = [...customExercises, ...serverExercises];
        renderList();
    }).catch(() => {
        listContainer.replaceChildren(el('p', 'exercise-picker__status', 'Failed to load'));
    });

    const renderList = (query: string = '') => {
        listContainer.replaceChildren();
        const filtered = allExercises.filter(ex => 
            ex.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            listContainer.append(el('p', 'exercise-picker__status', 'No exercises found'));
            return;
        }

        filtered.forEach((ex) => {
            const item = el('div', 'exercise-picker__item');
            const checkbox = el('input', 'exercise-picker__checkbox');
            checkbox.type = 'checkbox';
            checkbox.checked = selected.has(ex.name);
            
            const name = el('span', 'exercise-picker__name', ex.name);
            const muscle = el('span', 'exercise-picker__muscle', ex.primaryMuscles?.[0] || ex.category || 'Custom');

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) selected.add(ex.name);
                else selected.delete(ex.name);
            });

            item.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });

            item.append(checkbox, name, muscle);
            listContainer.append(item);
        });
    };

    // Логика создания нового упражнения
    addCustomBtn.addEventListener('click', () => {
        const newExName = createInput.value.trim();
        if (!newExName) return;

        // Проверяем, нет ли уже такого упражнения
        const exists = allExercises.some(ex => ex.name.toLowerCase() === newExName.toLowerCase());
        
        if (!exists) {
            // Создаем объект нового упражнения
            const newExercise: Exercise = {
                id: `custom-${Date.now()}`,
                name: newExName,
                category: 'Custom',
                primaryMuscles: [],
                secondaryMuscles: [],
                instructions: [],
                images: [],
                videos: [],
                level: 'beginner'
            };
            
            // Сохраняем в переданный массив, чтобы оно не исчезло при повторном открытии модалки
            customExercises.push(newExercise);
            // Добавляем в текущий список для отображения
            allExercises.unshift(newExercise);
        }

        // Автоматически выделяем его галочкой
        selected.add(newExName);
        
        // Очищаем поле ввода и обновляем список
        createInput.value = '';
        searchInput.value = ''; 
        renderList();
    });

    searchInput.addEventListener('input', (e) => {
        renderList((e.target as HTMLInputElement).value);
    });

    doneBtn.addEventListener('click', () => {
        const result = allExercises.filter(ex => selected.has(ex.name));
        onSelect(result);
        modal.remove();
    });

    return modal;
}