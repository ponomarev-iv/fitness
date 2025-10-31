import { defineEventHandler, getHeader } from 'h3';
import { getUserByEmail } from '~/server/utils/usersDb';
import { Buffer } from 'buffer';

const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/exercises'];

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/') || publicRoutes.some(route => event.path.startsWith(route))) {
    return;
  }

  const authorization = getHeader(event, 'authorization');
  const token = authorization?.split(' ')[1];

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized: No token provided' });
  }

  const decodedEmail = Buffer.from(token, 'base64').toString('utf-8');
  const user = getUserByEmail(decodedEmail);

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized: Invalid token or user not found' });
  }

  event.context.user = user;
});