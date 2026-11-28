import { el, createBtn } from '../../utils/tags';
import { type SavedWorkout } from '../createWorkout';
import { createModal } from '../../components/modal';

export function formatTimerSeconds(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function openWorkoutTimer(workout: SavedWorkout): void {
  const hasDuration = workout.duration > 0;
  const initialSeconds = hasDuration ? workout.duration * 60 : 0;
  let currentSeconds = initialSeconds;
  let isRunning = false;
  let timerId: number | null = null;

  const timerBox = el('div', 'workout-timer');
  const statusText = el(
    'p',
    'workout-timer__status',
    hasDuration ? `Target: ${workout.duration} min` : 'Stopwatch mode'
  );
  const display = el('div', 'workout-timer__display', formatTimerSeconds(currentSeconds));

  const exSummary = el('ul', 'workout-timer__list');
  workout.exercises.forEach((ex, idx) => {
    const li = el(
      'li',
      'workout-timer__item',
      `${idx + 1}. ${ex.name} — ${ex.sets ?? 3} × ${ex.reps ?? 10} (rest ${ex.rest ?? 60}s)`
    );
    exSummary.append(li);
  });

  const controls = el('div', 'workout-timer__controls');

  const startBtn = createBtn('workout-timer__btn workout-timer__btn--primary', 'Start');
  const toggleBtn = createBtn('workout-timer__btn workout-timer__btn--primary', 'Pause');
  const resetBtn = createBtn('workout-timer__btn', 'Reset');
  const finishBtn = createBtn('workout-timer__btn workout-timer__btn--finish', 'Finish');

  const showInitialControls = () => {
    controls.replaceChildren(startBtn);
  };

  const showActiveControls = () => {
    controls.replaceChildren(toggleBtn, resetBtn, finishBtn);
  };

  timerBox.append(statusText, display, controls, exSummary);

  const stopTimer = () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  const { modal, contentArea } = createModal({
    title: `Workout: ${workout.name}`,
    onClose: stopTimer,
  });
  modal.classList.add('workout-timer-modal');

  const startTimer = () => {
    stopTimer();
    isRunning = true;
    toggleBtn.textContent = 'Pause';
    toggleBtn.disabled = false;
    showActiveControls();

    timerId = window.setInterval(() => {
      if (hasDuration) {
        if (currentSeconds > 0) {
          currentSeconds--;
          display.textContent = formatTimerSeconds(currentSeconds);
        } else {
          stopTimer();
          isRunning = false;
          toggleBtn.textContent = 'Done';
          toggleBtn.disabled = true;
          statusText.textContent = 'Time is up! Great job!';
        }
      } else {
        currentSeconds++;
        display.textContent = formatTimerSeconds(currentSeconds);
      }
    }, 1000);
  };

  startBtn.addEventListener('click', () => {
    startTimer();
  });

  toggleBtn.addEventListener('click', () => {
    if (isRunning) {
      stopTimer();
      isRunning = false;
      toggleBtn.textContent = 'Resume';
    } else {
      startTimer();
    }
  });

  resetBtn.addEventListener('click', () => {
    stopTimer();
    isRunning = false;
    currentSeconds = initialSeconds;
    display.textContent = formatTimerSeconds(currentSeconds);
    statusText.textContent = hasDuration ? `Target: ${workout.duration} min` : 'Stopwatch mode';
    toggleBtn.disabled = false;
    showInitialControls();
  });

  finishBtn.addEventListener('click', () => {
    stopTimer();
    modal.remove();
    alert(`Workout "${workout.name}" completed!`);
  });

  showInitialControls();
  contentArea.append(timerBox);
  document.body.append(modal);
}
