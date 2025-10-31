import { readExercisesDb, writeExercisesDb } from '~/server/utils/exercisesDb';

export default defineEventHandler((event) => {
  const id = parseInt(event.context.params.id);
  const db = readExercisesDb();
  const initialLength = db.length;
  const updatedDb = db.filter(e => e.id !== id);

  if (updatedDb.length === initialLength) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Exercise not found',
    });
  }

  writeExercisesDb(updatedDb);
  return { message: 'Exercise deleted' };
});
