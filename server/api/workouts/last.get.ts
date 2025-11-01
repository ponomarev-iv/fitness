import { readDb } from '~/server/utils/db';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const { user } = event.context.auth;
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const { exerciseId } = getQuery(event);

  if (!exerciseId) {
    throw createError({
      statusCode: 400,
      message: 'Exercise ID is required',
    });
  }

  const db = await readDb();
  const userWorkouts = db.workouts[user.id] || {};

  let lastWorkout = null;
  let latestDate = new Date(0); // Epoch

  for (const date in userWorkouts) {
    const workoutsOnDate = userWorkouts[date];
    for (const workout of workoutsOnDate) {
      if (workout.exercises.some((ex: any) => ex.exerciseId === exerciseId)) {
        const workoutDate = new Date(date);
        if (workoutDate > latestDate) {
          latestDate = workoutDate;
          lastWorkout = workout;
        }
      }
    }
  }

  if (lastWorkout) {
    // Filter to only include the relevant exercise in the returned workout
    const relevantExercise = lastWorkout.exercises.find((ex: any) => ex.exerciseId === exerciseId);
    return {
      date: lastWorkout.date,
      exercises: [relevantExercise],
    };
  }

  return null;
});
