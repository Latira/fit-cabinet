import { el, createBtn } from '../../utils/tags';
import { type SavedWorkout } from '../createWorkout';
import { createModal } from '../../components/modal';

export function openChangeTodayModal(
    allWorkouts: SavedWorkout[],
    onSelected: () => void
): void {
    const { modal, contentArea } = createModal({
        title: 'Select workout for today',
    });

    const list = el('div', 'workout-select-list');

    allWorkouts.forEach((w) => {
        const optionBtn = createBtn('workout-select-list__item');
        const nameEl = el('span', 'workout-select-list__name', w.name);
        const metaEl = el(
            'span',
            'workout-select-list__meta',
            `${w.duration} min • ${w.exercises.length} exercises`
        );
        optionBtn.append(nameEl, metaEl);

        optionBtn.addEventListener('click', () => {
            localStorage.setItem('today_workout_id', w.id);
            modal.remove();
            onSelected();
        });

        list.append(optionBtn);
    });

    contentArea.append(list);
    document.body.append(modal);
}
