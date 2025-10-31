import { getUserByEmail } from '~/server/utils/usersDb';
import { Buffer } from 'buffer'; // Explicitly import Buffer

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing email or password',
    });
  }

  const user = getUserByEmail(body.email);

  if (!user || user.password !== body.password) { // In real app, compare hashed passwords
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  // Generate a base64 encoded email as the token for mock purposes
  const token = Buffer.from(user.email).toString('base64');

  // Return user without password
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
});
