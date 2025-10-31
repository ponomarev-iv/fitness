import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '.tmp/exercises.json');

const generateSvg = (text: string) => {
  const bgColor = '#161B22'; // card color
  const textColor = '#E6EDF3'; // text-primary color
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="14" fill="${textColor}" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const initialData = [
  { id: 1, name: 'Жим лежа', image: generateSvg('Жим лежа'), hasWeight: true, defaultWeight: 80 },
  { id: 2, name: 'Приседания', image: generateSvg('Приседания'), hasWeight: true, defaultWeight: 80 },
  { id: 3, name: 'Становая тяга', image: generateSvg('Становая тяга'), hasWeight: true, defaultWeight: 100 },
  { id: 4, name: 'Жим стоя', image: generateSvg('Жим стоя'), hasWeight: true, defaultWeight: 20 },
  { id: 5, name: 'Подтягивания', image: generateSvg('Подтягивания'), hasWeight: false },
  { id: 6, name: 'Тяга штанги в наклоне', image: generateSvg('Тяга в наклоне'), hasWeight: true, defaultWeight: 40 },
  { id: 7, name: 'Сгибание на бицепс', image: generateSvg('Бицепс'), hasWeight: true, defaultWeight: 10 },
  { id: 8, name: 'Разгибание на трицепс', image: generateSvg('Трицепс'), hasWeight: true, defaultWeight: 15 },
  { id: 9, name: 'Скручивания', image: generateSvg('Пресс'), hasWeight: false },
];

export const readExercisesDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    writeExercisesDb(initialData);
    return initialData;
  }
  try {
    const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading exercises DB:', error);
    writeExercisesDb(initialData);
    return initialData;
  }
};

export const writeExercisesDb = (data: ({ id: number; name: string; image: string; hasWeight: boolean; defaultWeight: number; } | { id: number; name: string; image: string; hasWeight: boolean; defaultWeight?: undefined; })[]) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to exercises DB:', error);
  }
};
