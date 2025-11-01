# Fitness Tracker

Это веб-приложение для отслеживания фитнес-тренировок, созданное с использованием Nuxt.js 3 (Vue.js 3). Оно позволяет пользователям записывать свои тренировки, включая упражнения, подходы, повторения и вес. Приложение имеет календарный интерфейс для выбора дат и просмотра или добавления тренировок.

## Key Features

*   **Workout Logging:** Add, edit, and delete workouts for any given day.
*   **Exercise Management:** Create and manage a list of custom exercises.
*   **Calendar View:** Easily navigate between dates to view or add workouts.
*   **User Authentication:** Secure registration and login functionality.
*   **Workout History:** View past workouts to track progress.

## Technologies

*   **Framework:** [Nuxt.js 3](https://nuxt.com/)
*   **UI Framework:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** [Pinia](https://pinia.vuejs.org/)
*   **Language:** TypeScript
*   **Backend:** Nuxt.js server routes
*   **Database:** A simple file-based JSON database is used for storing workout data (see `.tmp/workouts.json`).

## Building and Running

### Prerequisites

*   [Node.js](https://nodejs.org/) (version recommended in `.nvmrc` if available)
*   [npm](https://www.npmjs.com/) or another package manager like pnpm, yarn, or bun.

### Installation

Install the project dependencies:

```bash
npm install
```

### Development

To start the development server with hot-reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Development Conventions

*   **Components:** Reusable Vue components are located in the `components/` directory.
*   **Pages & Routing:** The application uses file-based routing. Each `.vue` file in the `pages/` directory corresponds to a route.
*   **API Routes:** Server-side API endpoints are defined in the `server/api/` directory.
*   **State Management:** Global application state is managed using Pinia. Store modules are located in the `stores/` directory.
*   **Styling:** The application uses Tailwind CSS for styling. Custom theme colors and configurations are in `tailwind.config.js`.
*   **Authentication:** A basic authentication system is implemented using a global middleware (`middleware/auth.global.ts`) and an auth store (`stores/auth.ts`).

## API Endpoints

The backend is handled by Nuxt.js server routes. Here are the main endpoints:

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Log in a user.
*   `PUT /api/auth/profile`: Update user profile.
*   `GET /api/exercises`: Get all exercises.
*   `POST /api/exercises`: Create a new exercise.
*   `DELETE /api/exercises/:id`: Delete an exercise.
*   `GET /api/workouts`: Get all workouts.
*   `POST /api/workouts`: Create a new workout.
*   `PUT /api/workouts/:id`: Update a workout.
*   `DELETE /api/workouts/:id`: Delete a workout.
*   `GET /api/workouts/last`: Get the last workout.
