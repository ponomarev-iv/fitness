import { defineEventHandler } from 'h3';
import { readDb } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const exerciseId = event.context.params?.id;
  const db = await readDb();
  const allWorkouts = [];

  for (const date in db.workouts) {
    for (const userId in db.workouts[date]) {
      allWorkouts.push(...db.workouts[date][userId].map(w => ({...w, date, userId})));
    }
  }

  if (!exerciseId) {
    return {
      status: 400,
      body: 'Exercise ID is required',
    };
  }

  const exerciseHistory = allWorkouts
    .filter(workout => workout.userId === String(event.context.auth.user.id))
    .filter(workout => String(workout.exerciseId) === exerciseId)
    .slice(0, 5);

  return exerciseHistory;
});
