import { el, createImg } from '../../utils/tags';
import { type Exercise } from '../../api/exercises';

const GITHUB_CDN = 'https://githubusercontent.com';

export function createExercisePreview() {
    const previewCard = el('section', 'exercise-preview');
    previewCard.hidden = true;

    const openPreview = (ex: Exercise) => {
        previewCard.replaceChildren();
        previewCard.hidden = false;

        const mediaWrapper = el('div', 'exercise-preview__media');
        const showNoPreview = () => {
            mediaWrapper.replaceChildren(
                el('div', 'exercise-preview__no-media', 'No preview available')
            );
        };

        const video = ex.videos?.at(0);
        const imagePath = ex.images?.at(0);

        if (video?.url) {
            const videoEl = document.createElement('video');
            videoEl.className = 'exercise-preview__bg';
            videoEl.src = video.url;
            videoEl.autoplay = true;
            videoEl.muted = true;
            videoEl.loop = true;
            videoEl.playsInline = true;
            videoEl.addEventListener('error', showNoPreview);
            mediaWrapper.append(videoEl);
        } else if (imagePath) {
            const cleanPath = imagePath.replace(/^\/+/, '');
            const imageUrl = cleanPath.startsWith('http')
                ? cleanPath
                : `${GITHUB_CDN}/${cleanPath}`;
            const bgImg = createImg('exercise-preview__bg', imageUrl, ex.name);
            bgImg.addEventListener('error', showNoPreview);
            mediaWrapper.append(bgImg);
        } else {
            showNoPreview();
        }

        const content = el('div', 'exercise-preview__content');
        const exName = el('h3', 'exercise-preview__title', ex.name);

        const musclesList = [...(ex.primaryMuscles || []), ...(ex.secondaryMuscles || [])]
            .join('  •  ');
        const exMuscles = el(
            'p',
            'exercise-preview__muscles',
            musclesList || ex.category || 'General'
        );

        const rawDescription = Array.isArray(ex.instructions)
            ? ex.instructions.join(' ')
            : (ex as Exercise & { description?: string }).description || '';

        const exDescription = el(
            'p',
            'exercise-preview__description',
            rawDescription || 'No description available.'
        );

        content.append(exName, exMuscles, exDescription);

        previewCard.append(mediaWrapper, content);
        previewCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return { previewCard, openPreview };
}
