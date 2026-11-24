import { el, createBtn } from '../../utils/tags';
import { type Exercise } from '../../api/exercises';
import { createPagination } from '../../components/pagination';

interface RenderTableOptions {
    tableBody: HTMLElement;
    paginationContainer: HTMLElement;
    libBadge: HTMLElement;
    exercises: Exercise[];
    currentPage: number;
    pageSize: number;
    onViewExercise: (ex: Exercise) => void;
    onAddExercise?: (ex: Exercise) => void;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newSize: number) => void;
}

function createExerciseRow(
    ex: Exercise,
    onView: (ex: Exercise) => void,
    onAdd?: (ex: Exercise) => void
): HTMLElement {
    const row = el('div', 'exercises-table__row');

    const colInfo = el('div', 'exercises-table__col-info');
    const name = el('div', 'exercises-table__name', ex.name);
    const firstInstruction = ex.instructions?.at(0) || 'Basic exercise for targeting specific muscle groups';
    const desc = el('div', 'exercises-table__desc', firstInstruction);
    colInfo.append(name, desc);

    const colReps = el('div', 'exercises-table__col-reps');
    colReps.append(
        el('span', 'exercises-table__reps-val', '10–12'),
        el('span', 'exercises-table__reps-sub', 'reps')
    );

    const colMuscles = el('div', 'exercises-table__col-muscles');
    (ex.primaryMuscles || []).slice(0, 2).forEach((muscle) => {
        colMuscles.append(el('span', 'exercises-table__muscle-badge', muscle));
    });

    const colActions = el('div', 'exercises-table__col-actions');
    const viewBtn = createBtn('exercises-table__btn-view', 'View');
    viewBtn.addEventListener('click', () => onView(ex));

    const addBtn = createBtn('exercises-table__btn-add', '+ Add to workout');
    if (onAdd) {
        addBtn.addEventListener('click', () => onAdd(ex));
    }

    colActions.append(viewBtn, addBtn);
    row.append(colInfo, colReps, colMuscles, colActions);

    return row;
}

export function renderExerciseTable({
    tableBody,
    paginationContainer,
    libBadge,
    exercises,
    currentPage,
    pageSize,
    onViewExercise,
    onAddExercise,
    onPageChange,
    onPageSizeChange,
}: RenderTableOptions): void {
    libBadge.textContent = String(exercises.length);
    tableBody.replaceChildren();

    if (exercises.length === 0) {
        tableBody.append(el('p', 'exercises-table__status', 'No exercises found for the selected muscle group.'));
        paginationContainer.replaceChildren();
        return;
    }

    const start = (currentPage - 1) * pageSize;
    const pageItems = exercises.slice(start, start + pageSize);

    const fragment = document.createDocumentFragment();
    pageItems.forEach((ex) => {
        fragment.append(createExerciseRow(ex, onViewExercise, onAddExercise));
    });
    tableBody.append(fragment);

    paginationContainer.replaceChildren(
        createPagination({
            totalItems: exercises.length,
            currentPage,
            pageSize,
            onPageChange: (newPage) => {
                tableBody.scrollTop = 0;
                onPageChange(newPage);
            },
            onPageSizeChange,
        })
    );
}
