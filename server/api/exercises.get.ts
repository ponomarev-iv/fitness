import { readExercisesDb } from '~/server/utils/exercisesDb';

export default defineEventHandler(() => {
  return readExercisesDb();
});
