import { readExercisesDb, writeExercisesDb } from '~/server/utils/exercisesDb';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const db = readExercisesDb();
  const newId = db.length > 0 ? Math.max(...db.map(e => e.id)) + 1 : 1;
  const newExercise = { id: newId, ...body };
  db.push(newExercise);
  writeExercisesDb(db);
  return newExercise;
});
