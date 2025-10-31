import { defineEventHandler, readRawBody } from 'h3';
import { updateUser } from '~/server/utils/usersDb';

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event);
  let parsedBody;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch (e) {
    console.error('Profile PUT API - Failed to parse JSON body:', e);
    throw createError({
      statusCode: 400,
      message: 'Invalid JSON body',
    });
  }

  const { name } = parsedBody;
  const user = event.context.user; // User should be available from auth middleware

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw createError({
      statusCode: 400,
      message: 'Name is required and must be a non-empty string',
    });
  }

  try {
    const updatedUser = updateUser(user.id, { name });
    if (!updatedUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      });
    }
    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    return { message: 'Profile updated successfully', user: userWithoutPassword };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update profile',
    });
  }
});