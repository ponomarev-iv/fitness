import { addUser, getUserByEmail } from '~/server/utils/usersDb';
import { Buffer } from 'buffer'; // Explicitly import Buffer

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing name, email, or password',
    });
  }

  // Check if user already exists
  if (getUserByEmail(body.email)) {
    throw createError({
      statusCode: 409, // Conflict
      statusMessage: 'User with this email already exists',
    });
  }

  // In a real app, you would hash the password
  const newUser = {
    name: body.name,
    email: body.email,
    password: body.password, // Store as plain text for now, should be hashed
  };

  addUser(newUser);

  // Generate a base64 encoded email as the token for mock purposes
  const token = Buffer.from(newUser.email).toString('base64');

  // Return user without password
  const { password, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword,
    token,
  };
});
