import { defineEventHandler } from 'h3';
import { readDb, writeDb } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const { date, exercises } = await readBody(event);
  const userId = event.context.auth?.user?.id;

  if (!id || !date || !exercises || !Array.isArray(exercises) || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Workout ID, date, exercises, and user ID are required',
    });
  }

  const db = await readDb();

  if (db.workouts[date] && db.workouts[date][userId]) {
    const workoutIndex = db.workouts[date][userId].findIndex(w => w.id === id);

    if (workoutIndex !== -1) {
      // For simplicity, this replaces the entire workout object.
      // A more robust implementation might merge properties.
      db.workouts[date][userId][workoutIndex] = {
        id,
        exerciseId: exercises[0].exerciseId, // Assuming one exercise per update for now
        sets: exercises[0].sets,
      };
      await writeDb(db);
      return { success: true };
    }
  }

  throw createError({
    statusCode: 404,
    statusMessage: 'Workout not found',
  });
});
