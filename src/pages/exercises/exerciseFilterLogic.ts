import { type Exercise, type MuscleGroup } from '../../api/exercises';

export function filterExercisesByGroup(
  allExercises: Exercise[],
  muscleGroups: MuscleGroup[],
  activeGroup: string
): Exercise[] {
  if (activeGroup.toUpperCase() === 'ALL') return allExercises;

  const targetGroup = muscleGroups.find(
    (g) => g.displayGroup.toLowerCase() === activeGroup.toLowerCase()
  );
  if (!targetGroup) return allExercises;

  const allowedMuscles = targetGroup.muscles.map((m) => m.toLowerCase());
  return allExercises.filter((ex) =>
    (ex.primaryMuscles || []).some((m) => allowedMuscles.includes(m.toLowerCase()))
  );
}
