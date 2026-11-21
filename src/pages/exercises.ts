import { el, createBtn, createImg } from '../utils/tags';
import { getExercises, getMuscles, type Exercise, type MuscleGroup } from '../api/exercises';
import { createPagination } from '../components/pagination';

export function createExercisesPage(): HTMLElement {
    const page = el('main', 'exercises');

    const heading = el('div', 'exercises__heading');
    const title = el('h1', 'exercises__title', 'LIBRARY EXERCISE');
    heading.append(title);

    const filtersBar = el('div', 'exercises-filters');

    const previewCard = el('section', 'exercise-preview');
    previewCard.hidden = true;

        const openExercisePreview = (ex: Exercise) => {
        previewCard.replaceChildren();
        previewCard.hidden = false;

        const video = ex.videos?.at(0);
        if (video?.url) {
            const videoEl = document.createElement('video');
            videoEl.className = 'exercise-preview__bg';
            videoEl.src = video.url;
            videoEl.autoplay = true;
            videoEl.muted = true;
            videoEl.loop = true;
            videoEl.playsInline = true;
            previewCard.append(videoEl);
        } else {
            const imagePath = ex.images?.at(0);
            if (imagePath) {
                const githubCdn = [
                    'https://raw.githubusercontent.com',
                    'yuhonas',
                    'free-exercise-db',
                    'main',
                    'exercises'
                ].join('/');
                const imageUrl = `${githubCdn}/${imagePath.replace(/^\/+/, '')}`;
                const bgImg = createImg('exercise-preview__bg', imageUrl, ex.name);

                bgImg.addEventListener('error', () => {
                    bgImg.remove();
                });

                previewCard.append(bgImg);
            }
        }

        const bookmarkBtn = createBtn('exercise-preview__bookmark');
        bookmarkBtn.setAttribute('aria-label', 'Save to favorites');
        bookmarkBtn.addEventListener('click', () => {
            bookmarkBtn.classList.toggle('is-saved');
        });

        const overlay = el('div', 'exercise-preview__overlay');

        const leftInfo = el('div', 'exercise-preview__info');
        const exName = el('h3', 'exercise-preview__title', ex.name);
        const musclesList = [...(ex.primaryMuscles || []), ...(ex.secondaryMuscles || [])]
            .slice(0, 3)
            .join('  •  ');
        const exMuscles = el('p', 'exercise-preview__muscles', musclesList || ex.category);
        leftInfo.append(exName, exMuscles);

        const rightMeta = el('div', 'exercise-preview__meta');
        const sets = el('div', 'exercise-preview__stat', 'Sets: 3');
        const reps = el('div', 'exercise-preview__stat', 'Reps: 10');
        rightMeta.append(sets, reps);

        overlay.append(leftInfo, rightMeta);
        previewCard.append(bookmarkBtn, overlay);

        previewCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const selectedExStr = localStorage.getItem('selected_exercise');
    if (selectedExStr) {
        const selectedEx: Exercise = JSON.parse(selectedExStr);
        localStorage.removeItem('selected_exercise'); // сразу очищаем, чтобы при обычном открытии библиотеки карточка была скрыта
        openExercisePreview(selectedEx);
    }

    const library = el('section', 'exercises-library');

    const libHeader = el('div', 'exercises-library__header');
    const libLeft = el('div', 'exercises-library__title-group');

    const libTitleRow = el('div', 'exercises-library__title-row');
    const libTitle = el('h2', 'exercises-library__title', 'Exercise Library');
    const libBadge = el('span', 'exercises-library__count', '0');
    libTitleRow.append(libTitle, libBadge);

    const libSubtitle = el('p', 'exercises-library__subtitle', 'Choose exercises and add them to your workout');
    libLeft.append(libTitleRow, libSubtitle);
    libHeader.append(libLeft);

    const tableHead = el('div', 'exercises-table__head');
    const headColumns = ['EXERCISE / DESCRIPTION', 'REPS', 'MUSCLE GROUP', 'ACTIONS'];
    headColumns.forEach((colText: string) => {
        tableHead.append(el('span', 'exercises-table__head-cell', colText));
    });

    const tableBody = el('div', 'exercises-table__body custom-scrollbar');

    const paginationContainer = el('div', 'exercises-library__pagination');
    const footerNote = el(
        'p',
        'exercises-library__note',
        'Reps are provided as a guideline — choose a weight that matches your fitness level.'
    );

    library.append(libHeader, tableHead, tableBody, paginationContainer, footerNote);
    page.append(heading, filtersBar, previewCard, library);

    let allExercises: Exercise[] = [];
    let muscleGroups: MuscleGroup[] = [];
    let activeGroup = 'ALL';
    let currentPage = 1;
    let pageSize = 10;

    const getFilteredExercises = (): Exercise[] => {
        if (activeGroup === 'ALL') return allExercises;

        const targetGroup = muscleGroups.find(
            (g: MuscleGroup) => g.displayGroup.toLowerCase() === activeGroup.toLowerCase()
        );
        if (!targetGroup) return allExercises;

        const allowedMuscles = targetGroup.muscles.map((m: string) => m.toLowerCase());
        return allExercises.filter((ex: Exercise) =>
            (ex.primaryMuscles || []).some((m: string) => allowedMuscles.includes(m.toLowerCase()))
        );
    };

    const renderFilters = () => {
        filtersBar.replaceChildren();
        const groups = ['ALL', ...muscleGroups.map((g: MuscleGroup) => g.displayGroup.toUpperCase())];

        groups.forEach((groupName: string) => {
            const isActive = activeGroup.toUpperCase() === groupName;
            const btn = createBtn(
                `exercises-filters__btn ${isActive ? 'is-active' : ''}`,
                groupName
            );

            btn.addEventListener('click', () => {
                activeGroup = groupName;
                currentPage = 1;
                tableBody.scrollTop = 0;
                renderFilters();
                renderTable();
            });

            filtersBar.append(btn);
        });
    };

    const renderTable = () => {
        const filtered = getFilteredExercises();
        libBadge.textContent = String(filtered.length);
        tableBody.replaceChildren();

        if (filtered.length === 0) {
            const emptyMsg = el('p', 'exercises-table__status', 'No exercises found for the selected muscle group.');
            tableBody.append(emptyMsg);
        } else {
            const start = (currentPage - 1) * pageSize;
            const pageItems = filtered.slice(start, start + pageSize);

            pageItems.forEach((ex: Exercise) => {
                const row = el('div', 'exercises-table__row');

                const colInfo = el('div', 'exercises-table__col-info');
                const name = el('div', 'exercises-table__name', ex.name);
                const firstInstruction = ex.instructions?.at(0) || 'Basic exercise for targeting specific muscle groups';
                const desc = el('div', 'exercises-table__desc', firstInstruction);
                colInfo.append(name, desc);

                const colReps = el('div', 'exercises-table__col-reps');
                const repsVal = el('span', 'exercises-table__reps-val', '10–12');
                const repsSub = el('span', 'exercises-table__reps-sub', 'reps');
                colReps.append(repsVal, repsSub);

                const colMuscles = el('div', 'exercises-table__col-muscles');
                (ex.primaryMuscles || []).slice(0, 2).forEach((muscle: string) => {
                    colMuscles.append(el('span', 'exercises-table__muscle-badge', muscle));
                });

                const colActions = el('div', 'exercises-table__col-actions');
                const viewBtn = createBtn('exercises-table__btn-view', 'View');
                viewBtn.addEventListener('click', () => openExercisePreview(ex));

                const addBtn = createBtn('exercises-table__btn-add', '+ Add to workout');
                colActions.append(viewBtn, addBtn);

                row.append(colInfo, colReps, colMuscles, colActions);
                tableBody.append(row);
            });
        }

        paginationContainer.replaceChildren(
            createPagination({
                totalItems: filtered.length,
                currentPage,
                pageSize,
                onPageChange: (newPage: number) => {
                    currentPage = newPage;
                    tableBody.scrollTop = 0;
                    renderTable();
                },
                onPageSizeChange: (newSize: number) => {
                    pageSize = newSize;
                    currentPage = 1;
                    renderTable();
                },
            })
        );
    };

    const loadingMsg = el('p', 'exercises-table__status', 'Loading exercises...');
    tableBody.replaceChildren(loadingMsg);

    Promise.all([getExercises({ limit: '100' }), getMuscles()])
        .then(([exercisesRes, musclesRes]) => {
            allExercises = Array.isArray(exercisesRes) ? exercisesRes : exercisesRes.data || [];
            muscleGroups = Array.isArray(musclesRes) ? musclesRes : musclesRes.data || [];
            renderFilters();
            renderTable();
        })
        .catch(() => {
            const errorMsg = el('p', 'exercises-table__status', 'Failed to load the exercise list');
            tableBody.replaceChildren(errorMsg);
        });

    return page;
}
