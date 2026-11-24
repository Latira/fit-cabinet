import { el, createBtn, createInput } from '../utils/tags';
import { navigateTo } from '../utils/router';
import { type Exercise } from '../api/exercises';
import { createExercisePicker } from '../components/exercisePicker';

export interface WorkoutExercise extends Exercise {
    sets?: number;
    reps?: number;
    rest?: number;
}

export interface SavedWorkout {
    id: string;
    name: string;
    duration: number;
    exercises: WorkoutExercise[];
    createdAt: string;
}

export function createWorkoutPage(): HTMLElement {
    const editingStr = localStorage.getItem('editing_workout');
    const editingWorkout: SavedWorkout | null = editingStr ? JSON.parse(editingStr) : null;

    const page = el('main', 'create-workout-page');
    const title = el(
        'h1',
        'create-workout-page__title',
        editingWorkout ? 'Edit workout' : 'Create new workout'
    );
    const form = el('form', 'create-workout-page__form');

    const nameLabel = el('label', 'create-workout-page__label', 'Workout name');
    nameLabel.htmlFor = 'workout-name';
    const nameInput = createInput('create-workout-page__input', 'text', 'e.g., Morning Run', 'workout-name');
    nameInput.id = 'workout-name';
    if (editingWorkout) {
        nameInput.value = editingWorkout.name;
    }

    const durationLabel = el('label', 'create-workout-page__label', 'Duration (minutes)');
    durationLabel.htmlFor = 'workout-duration';
    const durationInput = createInput('create-workout-page__input', 'number', '30', 'workout-duration');
    durationInput.id = 'workout-duration';
    if (editingWorkout) {
        durationInput.value = String(editingWorkout.duration);
    }

    const exercisesSection = el('div', 'create-workout-page__exercises');
    const exercisesTitle = el('h3', 'create-workout-page__exercises-title', 'Exercises');
    const exercisesList = el('div', 'create-workout-page__exercises-list');

    const addExerciseBtn = createBtn('create-workout-page__add-exercise-btn', '+ Add Exercise');

    let selectedExercises: WorkoutExercise[] = editingWorkout
        ? editingWorkout.exercises.map((ex) => ({ ...ex }))
        : [];
    const customExercises: Exercise[] = [];

    const renderSelectedExercises = () => {
        exercisesList.replaceChildren();

        if (selectedExercises.length === 0) {
            exercisesList.append(el('p', 'create-workout-page__empty-ex', 'No exercises added yet.'));
            return;
        }

        selectedExercises.forEach((ex, index) => {
            const item = el('div', 'create-workout-page__ex-item');

            const itemHeader = el('div', 'create-workout-page__ex-header');
            const exName = el('span', 'create-workout-page__ex-name', ex.name);
            const removeBtn = createBtn('create-workout-page__ex-remove', '×');

            removeBtn.addEventListener('click', () => {
                selectedExercises.splice(index, 1);
                renderSelectedExercises();
            });
            itemHeader.append(exName, removeBtn);

            const itemSettings = el('div', 'create-workout-page__ex-settings');

            const setsGroup = el('div', 'create-workout-page__ex-field');
            const setsLabel = el('label', 'create-workout-page__ex-label', 'Sets');
            const setsInput = createInput('create-workout-page__ex-input', 'number', '3', `sets-${index}`);
            setsInput.value = String(ex.sets ?? 3);
            setsInput.addEventListener('change', () => {
                ex.sets = Number(setsInput.value);
            });
            setsGroup.append(setsLabel, setsInput);

            const repsGroup = el('div', 'create-workout-page__ex-field');
            const repsLabel = el('label', 'create-workout-page__ex-label', 'Reps');
            const repsInput = createInput('create-workout-page__ex-input', 'number', '10', `reps-${index}`);
            repsInput.value = String(ex.reps ?? 10);
            repsInput.addEventListener('change', () => {
                ex.reps = Number(repsInput.value);
            });
            repsGroup.append(repsLabel, repsInput);

            const restGroup = el('div', 'create-workout-page__ex-field');
            const restLabel = el('label', 'create-workout-page__ex-label', 'Rest (sec)');
            const restInput = createInput('create-workout-page__ex-input', 'number', '60', `rest-${index}`);
            restInput.value = String(ex.rest ?? 60);
            restInput.addEventListener('change', () => {
                ex.rest = Number(restInput.value);
            });
            restGroup.append(restLabel, restInput);

            itemSettings.append(setsGroup, repsGroup, restGroup);
            item.append(itemHeader, itemSettings);
            exercisesList.append(item);
        });
    };

    addExerciseBtn.addEventListener('click', () => {
        const modal = createExercisePicker((newSelection) => {
            selectedExercises = newSelection.map((ex: Exercise) => {
                const existing = selectedExercises.find((se) => se.id === ex.id);
                return {
                    ...ex,
                    sets: existing?.sets ?? 3,
                    reps: existing?.reps ?? 10,
                    rest: existing?.rest ?? 60,
                };
            });
            renderSelectedExercises();
        }, selectedExercises, customExercises);

        document.body.append(modal);
    });

    exercisesSection.append(exercisesTitle, exercisesList, addExerciseBtn);

    const submitBtn = createBtn(
        'create-workout-page__submit',
        editingWorkout ? 'update workout' : 'save workout',
        'submit'
    );
    const backBtn = createBtn('create-workout-page__back', 'back to workouts');

    const getContainer = (): HTMLElement =>
        (document.querySelector('.app-content') as HTMLElement) || document.body;

    backBtn.addEventListener('click', () => {
        localStorage.removeItem('editing_workout');
        navigateTo('/workouts', getContainer());
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!nameInput.value.trim()) {
            alert('Please enter a workout name.');
            nameInput.focus();
            return;
        }

        const existingWorkoutsStr = localStorage.getItem('workouts');
        const existingWorkouts: SavedWorkout[] = existingWorkoutsStr ? JSON.parse(existingWorkoutsStr) : [];

        if (editingWorkout) {
            const updatedWorkouts = existingWorkouts.map((w) =>
                w.id === editingWorkout.id
                    ? {
                        ...w,
                        name: nameInput.value.trim(),
                        duration: Number(durationInput.value) || 0,
                        exercises: selectedExercises,
                    }
                    : w
            );
            localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
            localStorage.removeItem('editing_workout');
        } else {
            const newWorkout: SavedWorkout = {
                id: `workout-${Date.now()}`,
                name: nameInput.value.trim(),
                duration: Number(durationInput.value) || 0,
                exercises: selectedExercises,
                createdAt: new Date().toISOString(),
            };
            existingWorkouts.push(newWorkout);
            localStorage.setItem('workouts', JSON.stringify(existingWorkouts));
        }

        navigateTo('/workouts', getContainer());
    });

    form.append(
        nameLabel,
        nameInput,
        durationLabel,
        durationInput,
        exercisesSection,
        submitBtn
    );

    page.append(title, form, backBtn);
    renderSelectedExercises();

    return page;
}
