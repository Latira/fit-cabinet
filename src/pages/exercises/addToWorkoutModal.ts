import { el, createBtn, createInput } from '../../utils/tags';
import { navigateTo } from '../../utils/router';
import { type Exercise } from '../../api/exercises';
import { type SavedWorkout, type WorkoutExercise } from '../createWorkout';
import { createModal } from '../../components/modal';

function createNonNegativeNumberField(labelText: string, id: string): {
    wrapper: HTMLElement;
    input: HTMLInputElement;
    getValue: () => number;
} {
    const wrapper = el('div', 'add-to-workout__field');
    const label = el('label', 'add-to-workout__label', labelText);
    label.htmlFor = id;

    const input = createInput('add-to-workout__input', 'number', '0', id);
    input.id = id;
    input.min = '0';
    input.step = '1';
    input.value = '0';

    input.addEventListener('keydown', (e) => {
        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
            e.preventDefault();
        }
    });

    const clampValue = () => {
        const parsed = Number(input.value);
        const safe = Number.isNaN(parsed) || parsed < 0 ? 0 : Math.floor(parsed);
        input.value = String(safe);
    };

    input.addEventListener('input', () => {
        if (Number(input.value) < 0) {
            clampValue();
        }
    });
    input.addEventListener('change', clampValue);
    input.addEventListener('blur', clampValue);

    wrapper.append(label, input);

    return {
        wrapper,
        input,
        getValue: () => {
            const parsed = Number(input.value);
            return Number.isNaN(parsed) || parsed < 0 ? 0 : Math.floor(parsed);
        },
    };
}

export function openAddExerciseToWorkoutModal(exercise: Exercise): void {
    const getContainer = (): HTMLElement =>
        (document.querySelector('.app-content') as HTMLElement) || document.body;

    const workoutsStr = localStorage.getItem('workouts');
    const workouts: SavedWorkout[] = workoutsStr ? JSON.parse(workoutsStr) : [];

    const { modal, contentArea } = createModal({
        title: `Add "${exercise.name}" to workout`,
    });

    const container = el('div', 'add-to-workout');

    const settingsRow = el('div', 'add-to-workout__settings');
    const setsField = createNonNegativeNumberField('Sets', 'modal-ex-sets');
    const repsField = createNonNegativeNumberField('Reps', 'modal-ex-reps');
    const restField = createNonNegativeNumberField('Rest (sec)', 'modal-ex-rest');
    settingsRow.append(setsField.wrapper, repsField.wrapper, restField.wrapper);

    const buildExerciseWithParams = (): WorkoutExercise => ({
        ...exercise,
        sets: setsField.getValue(),
        reps: repsField.getValue(),
        rest: restField.getValue(),
    });

    const redirectToCreateWithExercise = () => {
        localStorage.removeItem('editing_workout');
        localStorage.setItem('preselected_exercise', JSON.stringify(buildExerciseWithParams()));
        modal.remove();
        navigateTo('/create-workout', getContainer());
    };

    container.append(settingsRow);

    if (workouts.length === 0) {
        const emptyText = el(
            'p',
            'add-to-workout__empty',
            'You have no saved workouts yet. Create a new workout with this exercise?'
        );
        const createBtnEl = createBtn('add-to-workout__create-btn', 'Create new workout');
        createBtnEl.addEventListener('click', redirectToCreateWithExercise);

        container.append(emptyText, createBtnEl);
    } else {
        const hint = el('p', 'add-to-workout__hint', 'Select a workout:');
        const list = el('div', 'workout-select-list');

        workouts.forEach((workout) => {
            const existingIndex = workout.exercises.findIndex((item) => item.id === exercise.id);
            const alreadyAdded = existingIndex !== -1;
            const optionBtn = createBtn('workout-select-list__item');

            const nameEl = el('span', 'workout-select-list__name', workout.name);
            const metaEl = el(
                'span',
                'workout-select-list__meta',
                alreadyAdded
                    ? 'Already in workout (click to update)'
                    : `${workout.duration} min • ${workout.exercises.length} exercises`
            );

            optionBtn.append(nameEl, metaEl);

            optionBtn.addEventListener('click', () => {
                const configuredExercise = buildExerciseWithParams();
                if (alreadyAdded) {
                    workout.exercises[existingIndex] = configuredExercise;
                } else {
                    workout.exercises.push(configuredExercise);
                }
                localStorage.setItem('workouts', JSON.stringify(workouts));
                modal.remove();
                alert(
                    alreadyAdded
                        ? `Updated "${exercise.name}" in "${workout.name}"!`
                        : `"${exercise.name}" added to "${workout.name}"!`
                );
            });

            list.append(optionBtn);
        });

        const createNewBtn = createBtn(
            'add-to-workout__create-btn',
            '+ Create new workout with this exercise'
        );
        createNewBtn.addEventListener('click', redirectToCreateWithExercise);

        container.append(hint, list, createNewBtn);
    }

    contentArea.append(container);
    document.body.append(modal);
}
