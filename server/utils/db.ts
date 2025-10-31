import fs from 'fs/promises';
import path from 'path';

// Define the path to the database file
const DB_PATH = path.join(process.cwd(), '.tmp', 'workouts.json');

// Initial database structure
const initialData = {
  workouts: {},
};

// Ensure the .tmp directory exists
const ensureDbDirectory = async () => {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  } catch (error) {
    console.error('Error creating database directory:', error);
  }
};

// Function to read the database
export const readDb = async () => {
  await ensureDbDirectory();
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, create it with initial data
    if (error.code === 'ENOENT') {
      await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    throw error;
  }
};

// Function to write to the database
export const writeDb = async (data) => {
  await ensureDbDirectory();
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error);
  }
};
