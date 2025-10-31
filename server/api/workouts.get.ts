import { defineEventHandler, getQuery } from 'h3';
import { readDb } from '~/server/utils/db';
import { readExercisesDb } from '~/server/utils/exercisesDb';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const date = query.date as string;
  const month = query.month as string; // Expects format YYYY-MM
  const userId = event.context.user?.id;

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const db = await readDb();

  if (date) {
    const workoutsForDate = db.workouts[date]?.[userId] || [];
    const exercises = readExercisesDb();
    const enrichedResult = workoutsForDate.map((workout: { exerciseId: any; }) => ({
      ...workout,
      exercise: exercises.find((e: { id: any; }) => e.id === workout.exerciseId)
    }));
    return enrichedResult;
  }

  if (month) {
    const workoutsForMonth = Object.entries(db.workouts)
      .filter(([d]) => d.startsWith(month) && (db.workouts[d][userId]?.length > 0))
      .map(([d, users]) => ({
        date: d,
        hasWorkout: true
      }));
    return workoutsForMonth;
  }

  throw new Error('Either date or month parameter is required.');
});
