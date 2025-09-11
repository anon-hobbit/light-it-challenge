# Testing Setup

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing.

## Testing Stack

- **Vitest** - Fast unit testing framework for Vite projects
- **@testing-library/react** - Simple and complete React DOM testing utilities
- **@testing-library/jest-dom** - Custom DOM matchers for Jest/Vitest
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM implementation for testing

## Available Scripts

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── components/
│   └── __tests__/
├── hooks/
│   └── __tests__/
├── types/
│   └── __tests__/
└── test/
    ├── setup.ts          # Global test setup
    ├── test-utils.tsx    # Custom render utilities
    └── __tests__/        # Integration tests
```

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Button } from '../Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
})

test('handles click events', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  
  render(<Button onClick={handleClick}>Click me</Button>)
  await user.click(screen.getByRole('button'))
  
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Hook Tests

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePatients } from '../usePatients'

const createWrapper = () => {
  const queryClient = new QueryClient({ /* config */ })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

test('fetches patients', async () => {
  const wrapper = createWrapper()
  const { result } = renderHook(() => usePatients(), { wrapper })
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false)
  })
  
  expect(result.current.patients).toHaveLength(0)
})
```

### Zod Schema Tests

```typescript
import { PatientSchema } from '../schemas'

test('validates patient data', () => {
  const validData = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com'
  }
  
  const result = PatientSchema.safeParse(validData)
  expect(result.success).toBe(true)
})
```

## Test Configuration

The test setup is configured in `src/test/setup.ts`:

- Imports jest-dom matchers
- Mocks ResizeObserver for UI components
- Mocks window.matchMedia for responsive tests
- Makes React available globally for JSX

## Mocking APIs

API functions are mocked using Vitest:

```typescript
import { vi } from 'vitest'
import * as patientsApi from '../../lib/api/patients'

vi.mock('../../lib/api/patients')

const mockedFetchPatients = vi.mocked(patientsApi.fetchPatients)
mockedFetchPatients.mockResolvedValue({ data: [], error: null })
```

## Best Practices

1. **Test user interactions, not implementation details**
2. **Use semantic queries** (getByRole, getByText, etc.)
3. **Mock external dependencies** but test integration where valuable
4. **Write descriptive test names** that explain the expected behavior
5. **Group related tests** using describe blocks
6. **Clean up after tests** using beforeEach/afterEach when needed

## Running Specific Tests

```bash
# Run tests for a specific file
npm run test:run src/components/ui/__tests__/Button.test.tsx

# Run tests matching a pattern
npm test Button

# Run tests in watch mode for specific files
npm test -- Button.test
```

## Coverage

Generate test coverage reports:

```bash
npm run test:coverage
```

This will generate a coverage report in the `coverage/` directory.