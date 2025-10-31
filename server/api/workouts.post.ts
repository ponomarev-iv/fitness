import { defineEventHandler } from 'h3';
import { readDb, writeDb } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const { date, exercises } = await readBody(event);
  const userId = event.context.user?.id;

  if (!date || !exercises || !Array.isArray(exercises) || !userId) {
    return new Response(JSON.stringify({ message: 'Invalid request body' }), { status: 400 });
  }

  const db = await readDb();

  // Initialize the date and user if they don't exist
  if (!db.workouts[date]) {
    db.workouts[date] = {};
  }
  if (!db.workouts[date][userId]) {
    db.workouts[date][userId] = [];
  }

  // Add the new exercises
  for (const exercise of exercises) {
    const newWorkoutEntry = {
      id: `${Date.now()}`,
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
    };
    db.workouts[date][userId].push(newWorkoutEntry);
  }

  await writeDb(db);

  return { success: true, message: 'Workout added successfully' };
});
