import fs from 'fs';
import path from 'path';

const USERS_DB_PATH = path.join(process.cwd(), '.tmp/users.json');

// Initial data for users (can be empty or have a default user)
const initialUsersData = {
  users: []
};

// Ensure the .tmp directory exists
const tmpDir = path.dirname(USERS_DB_PATH);
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

export const readUsersDb = () => {
  if (!fs.existsSync(USERS_DB_PATH)) {
    writeUsersDb(initialUsersData);
    return initialUsersData;
  }
  try {
    const fileContent = fs.readFileSync(USERS_DB_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading users DB:', error);
    writeUsersDb(initialUsersData);
    return initialUsersData;
  }
};

export const writeUsersDb = (data: any) => {
  try {
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to users DB:', error);
  }
};

export const getAllUsers = () => {
  const db = readUsersDb();
  return db.users;
};



export const getUserByEmail = (email: string) => {

  console.log('Searching for user with email:', email);

  const db = readUsersDb();

  const user = db.users.find((user: any) => user.email === email);

  console.log('Found user:', user);

  return user;

};



export const getUserById = (id: number) => {

  const db = readUsersDb();

  return db.users.find((user: any) => user.id === id);

}



export const addUser = (user: any) => {

  const db = readUsersDb();

  const maxId = db.users.reduce((max: number, u: any) => u.id > max ? u.id : max, 0);

  user.id = maxId + 1;

  db.users.push(user);

  writeUsersDb(db);

  return user;

};



export const updateUser = (id: number, updates: any) => {

  const db = readUsersDb();

  const userIndex = db.users.findIndex((user: any) => user.id === id);

  if (userIndex > -1) {

    db.users[userIndex] = { ...db.users[userIndex], ...updates };

    writeUsersDb(db);

    return db.users[userIndex];

  }

  return null;

};