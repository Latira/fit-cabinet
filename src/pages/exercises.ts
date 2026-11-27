import { el } from '../utils/tags';
import { getExercises, getMuscles, type Exercise, type MuscleGroup } from '../api/exercises';
import { filterExercisesByGroup } from './exercises/exerciseFilterLogic';
import { renderExerciseFilters } from './exercises/exerciseFilters';
import { createExercisePreview } from './exercises/exercisePreview';
import { renderExerciseTable } from './exercises/exerciseTable';
import { openAddExerciseToWorkoutModal } from './exercises/addToWorkoutModal';

export function createExercisesPage(): HTMLElement {
    const page = el('main', 'exercises');

    const heading = el('div', 'exercises__heading');
    heading.append(el('h1', 'exercises__title', 'LIBRARY EXERCISE'));

    const filtersBar = el('div', 'exercises-filters');
    const { previewCard, openPreview } = createExercisePreview();

    const selectedExStr = localStorage.getItem('selected_exercise');
    if (selectedExStr) {
        const selectedEx: Exercise = JSON.parse(selectedExStr);
        localStorage.removeItem('selected_exercise');
        openPreview(selectedEx);
    }

    const library = el('section', 'exercises-library');
    const libHeader = el('div', 'exercises-library__header');
    const libLeft = el('div', 'exercises-library__title-group');

    const libTitleRow = el('div', 'exercises-library__title-row');
    const libBadge = el('span', 'exercises-library__count', '0');
    libTitleRow.append(el('h2', 'exercises-library__title', 'Exercise Library'), libBadge);

    libLeft.append(
        libTitleRow,
        el('p', 'exercises-library__subtitle', 'Choose exercises and add them to your workout')
    );
    libHeader.append(libLeft);

    const tableHead = el('div', 'exercises-table__head');
    ['EXERCISE / DESCRIPTION', 'MUSCLE GROUP', 'ACTIONS'].forEach((colText) => {
        tableHead.append(el('span', 'exercises-table__head-cell', colText));
    });

    const tableBody = el('div', 'exercises-table__body custom-scrollbar');
    const paginationContainer = el('div', 'exercises-library__pagination');
    const footerNote = el(
        'p',
        'exercises-library__note',
        'Select any exercise to view detailed instructions or add it directly to your workout.'
    );

    library.append(libHeader, tableHead, tableBody, paginationContainer, footerNote);
    page.append(heading, filtersBar, previewCard, library);

    let allExercises: Exercise[] = [];
    let muscleGroups: MuscleGroup[] = [];
    let activeGroup = 'ALL';
    let currentPage = 1;
    let pageSize = 10;

    const updateFilters = () => {
        renderExerciseFilters(filtersBar, muscleGroups, activeGroup, (groupName) => {
            activeGroup = groupName;
            currentPage = 1;
            tableBody.scrollTop = 0;
            updateFilters();
            updateTable();
        });
    };

    const updateTable = () => {
        const filtered = filterExercisesByGroup(allExercises, muscleGroups, activeGroup);

        renderExerciseTable({
            tableBody,
            paginationContainer,
            libBadge,
            exercises: filtered,
            currentPage,
            pageSize,
            onViewExercise: openPreview,
            onAddExercise: openAddExerciseToWorkoutModal,
            onPageChange: (newPage) => {
                currentPage = newPage;
                updateTable();
            },
            onPageSizeChange: (newSize) => {
                pageSize = newSize;
                currentPage = 1;
                updateTable();
            },
        });
    };

    tableBody.replaceChildren(el('p', 'exercises-table__status', 'Loading exercises...'));

    Promise.all([getExercises({ limit: '100' }), getMuscles()])
        .then(([exercisesRes, musclesRes]) => {
            allExercises = Array.isArray(exercisesRes) ? exercisesRes : exercisesRes.data || [];
            muscleGroups = Array.isArray(musclesRes) ? musclesRes : musclesRes.data || [];
            updateFilters();
            updateTable();
        })
        .catch(() => {
            tableBody.replaceChildren(el('p', 'exercises-table__status', 'Failed to load the exercise list'));
        });

    return page;
}
