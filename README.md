# Light-IT Frontend Challenge "Patient Data Management"

## By Anonymous Hobbit

This is a simple patient data management application. It allows you to add, edit, and delete patients. The data comes from [MockAPI](https://mockapi.io/).

It includes custom UI components like:

- Button
- Input (Text, Date, Textarea)
- Select
- Modal
- Drawer

Except for some minor exceptions, the UI is built using vanilla TailwindCSS classes.

## Things to improve (self-review)

- More test coverage
- Error boundaries for sensitive componets
- Better arch (maybe DDD?) for scaling
- Patient manager is an overkill, should be handlded with React Query directly?

<img width="1276" height="1039" alt="image" src="https://github.com/user-attachments/assets/5bfb26e8-61a3-4f84-a379-551da9ea61da" />


### Stack

- React
- TypeScript
- Vite
- TailwindCSS
- React Query (TanStack)
- Zod
- Lucide React (Lucide Icons)
- Class Variance Authority (CVA)

### Test stack

- Vitest
- @testing-library/jest-dom
- @testing-library/react
- @testing-library/user-event
- @vitest/coverage-v8

### Linting and formatting

- ESLint
- Prettier
- TypeScript ESLint
- React Hooks ESLint
- React Refresh ESLint
- React DOM ESLint

## How to run the project

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

To build the project for production, run:

```bash
npm run build
```

To run the tests, run:

```bash
npm run test
```
