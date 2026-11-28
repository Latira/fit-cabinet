// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createExercisePreview } from '../src/pages/exercises/exercisePreview';
import { type Exercise } from '../src/api/exercises';

describe('createExercisePreview', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        Element.prototype.scrollIntoView = vi.fn();
    });

    test('initially creates a hidden preview section', () => {
        const { previewCard } = createExercisePreview();
        expect(previewCard.tagName).toBe('SECTION');
        expect(previewCard.hidden).toBe(true);
    });

    test('renders video, title, muscles and instructions when video is provided', () => {
        const { previewCard, openPreview } = createExercisePreview();
        document.body.append(previewCard);

        const exerciseWithVideo = {
            id: '1',
            name: 'Barbell Squat',
            category: 'strength',
            level: 'intermediate',
            primaryMuscles: ['quadriceps'],
            secondaryMuscles: ['glutes', 'hamstrings'],
            instructions: ['Stand with feet shoulder-width apart.', 'Lower hips back and down.'],
            videos: [{ url: 'https://test-cdn.local' }],
            images: ['/squat/0.jpg'],
        } as unknown as Exercise;

        openPreview(exerciseWithVideo);

        expect(previewCard.hidden).toBe(false);

        const videoEl = previewCard.querySelector<HTMLVideoElement>('video.exercise-preview__bg');
        expect(videoEl).not.toBeNull();
        expect(videoEl?.src).toContain('test-cdn.local');
        expect(videoEl?.muted).toBe(true);
        expect(videoEl?.loop).toBe(true);
        expect(previewCard.querySelector('.exercise-preview__title')?.textContent).toBe('Barbell Squat');
        expect(previewCard.querySelector('.exercise-preview__muscles')?.textContent).toBe(
            'quadriceps  •  glutes  •  hamstrings'
        );
        expect(previewCard.querySelector('.exercise-preview__description')?.textContent).toBe(
            'Stand with feet shoulder-width apart. Lower hips back and down.'
        );
        expect(previewCard.scrollIntoView).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'center',
        });
    });

    test('renders image when no video exists and falls back to No preview available on error', () => {
        const { previewCard, openPreview } = createExercisePreview();
        document.body.append(previewCard);

        const exerciseWithImage = {
            id: '2',
            name: 'Push-Up',
            category: 'strength',
            level: 'beginner',
            primaryMuscles: ['chest'],
            secondaryMuscles: [],
            instructions: ['Keep core tight.'],
            images: ['/push-up/0.jpg'],
        } as unknown as Exercise;

        openPreview(exerciseWithImage);

        const imgEl = previewCard.querySelector<HTMLImageElement>('img.exercise-preview__bg');
        expect(imgEl).not.toBeNull();
        expect(imgEl?.src).toBe('https://githubusercontent.com/push-up/0.jpg');
        expect(imgEl?.alt).toBe('Push-Up');

        imgEl?.dispatchEvent(new Event('error'));
        expect(previewCard.querySelector('img.exercise-preview__bg')).toBeNull();
        expect(previewCard.querySelector('.exercise-preview__no-media')?.textContent).toBe(
            'No preview available'
        );
    });

    test('renders No preview available and fallback texts when media and instructions are missing', () => {
        const { previewCard, openPreview } = createExercisePreview();
        document.body.append(previewCard);

        const minimalExercise = {
            id: '3',
            name: 'Plank',
            category: 'core',
            level: 'beginner',
            primaryMuscles: [],
            secondaryMuscles: [],
            instructions: [],
        } as unknown as Exercise;

        openPreview(minimalExercise);

        expect(previewCard.querySelector('.exercise-preview__no-media')?.textContent).toBe(
            'No preview available'
        );
        expect(previewCard.querySelector('.exercise-preview__muscles')?.textContent).toBe('core');
        expect(previewCard.querySelector('.exercise-preview__description')?.textContent).toBe(
            'No description available.'
        );
    });
});
