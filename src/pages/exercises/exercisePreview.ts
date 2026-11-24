import { el, createBtn, createImg } from '../../utils/tags';
import { type Exercise } from '../../api/exercises';

const GITHUB_CDN = 'https://githubusercontent.com';

export function createExercisePreview() {
    const previewCard = el('section', 'exercise-preview');
    previewCard.hidden = true;

    const openPreview = (ex: Exercise) => {
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
                const imageUrl = `${GITHUB_CDN}/${imagePath.replace(/^\/+/, '')}`;
                const bgImg = createImg('exercise-preview__bg', imageUrl, ex.name);
                bgImg.addEventListener('error', () => bgImg.remove());
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

    return { previewCard, openPreview };
}
