import { defineEventHandler, getQuery } from 'h3';
import { readDb, writeDb } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const query = getQuery(event);
  const date = query.date as string;
  const userId = event.context.auth?.user?.id;

  if (!id || !date || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Workout ID, date, and user ID are required',
    });
  }

  const db = await readDb();

  if (db.workouts[date] && db.workouts[date][userId]) {
    const workoutIndex = db.workouts[date][userId].findIndex(w => w.id === id);

    if (workoutIndex !== -1) {
      db.workouts[date][userId].splice(workoutIndex, 1);
      await writeDb(db);
      return { success: true };
    }
  }

  throw createError({
    statusCode: 404,
    statusMessage: 'Workout not found',
  });
});
