---
title: Testing Strategy
description: React Testing Library patterns, Jest configuration, Playwright E2E tests, MSW for API mocking, component testing patterns, and integration test strategies.
---

# Testing Strategy

React Testing Library patterns, Jest configuration, Playwright E2E tests, MSW for API mocking, component testing patterns, and integration test strategies.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on testing React and Next.js applications, covering unit tests with React Testing Library, integration tests, E2E tests with Playwright, and API mocking strategies.

### When to Use

- Setting up testing infrastructure
- Writing component unit tests
- Creating integration tests
- Building E2E test suites
- Mocking API responses

### Prerequisites

- **[Component Architecture](./component_architecture.md)**: Understanding Server vs Client Components
- **[Data Fetching](./data_fetching.md)**: How data flows through the application
- **[API Patterns](./api_patterns.md)**: API structure for mocking

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:testing-pyramid -->
## 2. TESTING PYRAMID

### Test Distribution

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                           E2E Tests                             │
│                        (Playwright)                             │
│                    Critical user journeys                       │
│                          ~10%                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     Integration Tests                           │
│                  (RTL + MSW + Jest)                             │
│             Component interactions, data flow                   │
│                          ~30%                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        Unit Tests                               │
│                     (RTL + Jest)                                │
│            Components, hooks, utilities                         │
│                          ~60%                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### What to Test at Each Level

| Level          | What to Test                                         | Tools                   |
| -------------- | ---------------------------------------------------- | ----------------------- |
| Unit           | Components in isolation, hooks, utilities            | Jest, RTL               |
| Integration    | Component combinations, data fetching, forms         | Jest, RTL, MSW          |
| E2E            | Critical paths, multi-page flows, auth               | Playwright              |

---

<!-- /ANCHOR:testing-pyramid -->
<!-- ANCHOR:jest-configuration -->
## 3. JEST CONFIGURATION

### Next.js Jest Setup

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/e2e/',
  ],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(config);
```

### Jest Setup File

```typescript
// jest.setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useParams: () => ({}),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// MSW setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
```

---

<!-- /ANCHOR:jest-configuration -->
<!-- ANCHOR:react-testing-library -->
## 4. REACT TESTING LIBRARY

### Basic Component Test

```typescript
// components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
// components/features/auth/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  const user = userEvent.setup();

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email', async () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('clears errors when user types', async () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    // Trigger validation
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    // Start typing
    await user.type(screen.getByLabelText(/email/i), 't');

    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    });
  });
});
```

### Testing Async Components

```typescript
// components/features/products/ProductList.test.tsx
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductList } from './ProductList';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('ProductList', () => {
  it('shows loading state initially', () => {
    render(<ProductList />, { wrapper: createWrapper() });
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders products after loading', async () => {
    render(<ProductList />, { wrapper: createWrapper() });

    // Wait for loading to finish
    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-skeleton'));

    // Check products are rendered
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    // Override handler for this test
    server.use(
      http.get('/api/products', () => {
        return HttpResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 }
        );
      })
    );

    render(<ProductList />, { wrapper: createWrapper() });

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-skeleton'));

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('shows empty state when no products', async () => {
    server.use(
      http.get('/api/products', () => {
        return HttpResponse.json([]);
      })
    );

    render(<ProductList />, { wrapper: createWrapper() });

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-skeleton'));

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });
});
```

### Testing Custom Hooks

```typescript
// hooks/useDebounce.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  it('cancels pending updates on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    unmount();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should still be initial since we unmounted
    expect(result.current).toBe('initial');
  });
});
```

```typescript
// hooks/useAuth.test.tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('useAuth', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('returns user after authentication check', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual({
      id: '1',
      email: 'test@example.com',
    });
  });

  it('login updates user state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login({
        email: 'new@example.com',
        password: 'password',
      });
    });

    expect(result.current.user?.email).toBe('new@example.com');
  });

  it('logout clears user state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });
});
```

---

<!-- /ANCHOR:react-testing-library -->
<!-- ANCHOR:msw-mock-service-worker -->
## 5. MSW (MOCK SERVICE WORKER)

### MSW Setup

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // GET request
  http.get('/api/products', () => {
    return HttpResponse.json([
      { id: '1', name: 'Product 1', price: 99.99 },
      { id: '2', name: 'Product 2', price: 149.99 },
    ]);
  }),

  // GET with params
  http.get('/api/products/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      name: `Product ${id}`,
      price: 99.99,
    });
  }),

  // POST request
  http.post('/api/products', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: '3', ...body },
      { status: 201 }
    );
  }),

  // Auth endpoints
  http.get('/api/auth/session', () => {
    return HttpResponse.json({
      user: { id: '1', email: 'test@example.com' },
    });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();

    if (password === 'wrong') {
      return HttpResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      user: { id: '1', email },
      token: 'mock-token',
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),
];
```

```typescript
// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// mocks/browser.ts (for Storybook/browser tests)
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

### Dynamic Handler Overrides

```typescript
// In tests, override specific handlers
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

describe('Error handling', () => {
  it('handles network errors', async () => {
    server.use(
      http.get('/api/products', () => {
        return HttpResponse.error();
      })
    );

    // Test component behavior on network error
  });

  it('handles 404 errors', async () => {
    server.use(
      http.get('/api/products/:id', () => {
        return HttpResponse.json(
          { error: 'Not found' },
          { status: 404 }
        );
      })
    );

    // Test component behavior on 404
  });

  it('handles slow responses', async () => {
    server.use(
      http.get('/api/products', async () => {
        await delay(2000);
        return HttpResponse.json([]);
      })
    );

    // Test loading states, timeouts, etc.
  });
});
```

### Request Assertions

```typescript
import { http, HttpResponse } from 'msw';

describe('Form submission', () => {
  it('sends correct data to API', async () => {
    const submittedData: any[] = [];

    server.use(
      http.post('/api/contact', async ({ request }) => {
        const body = await request.json();
        submittedData.push(body);
        return HttpResponse.json({ success: true });
      })
    );

    render(<ContactForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Hello world');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(submittedData).toHaveLength(1);
      expect(submittedData[0]).toEqual({
        email: 'test@example.com',
        message: 'Hello world',
      });
    });
  });
});
```

---

<!-- /ANCHOR:msw-mock-service-worker -->
<!-- ANCHOR:integration-tests -->
## 6. INTEGRATION TESTS

### Testing Page Components

```typescript
// app/(dashboard)/products/page.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductsPage from './page';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ProductsPage />
    </QueryClientProvider>
  );
}

describe('ProductsPage', () => {
  it('displays products and allows filtering', async () => {
    const user = userEvent.setup();
    renderPage();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    // Filter by category
    await user.click(screen.getByRole('combobox', { name: /category/i }));
    await user.click(screen.getByText('Electronics'));

    // Check filtered results
    await waitFor(() => {
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
      expect(screen.getByText('Electronics Product')).toBeInTheDocument();
    });
  });

  it('allows adding product to cart', async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0]);

    await waitFor(() => {
      expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText('Product 11')).toBeInTheDocument();
    });
  });
});
```

### Testing Forms with Server Actions

```typescript
// app/contact/page.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from './page';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({ push: mockPush }),
}));

describe('ContactPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockPush.mockClear();
  });

  it('submits form successfully', async () => {
    render(<ContactPage />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is my message');

    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    });
  });

  it('shows server validation errors', async () => {
    server.use(
      http.post('/api/contact', () => {
        return HttpResponse.json(
          {
            success: false,
            errors: { email: ['Email already exists'] },
          },
          { status: 400 }
        );
      })
    );

    render(<ContactPage />);

    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello');

    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });
});
```

---

<!-- /ANCHOR:integration-tests -->
<!-- ANCHOR:playwright-e2e-tests -->
## 7. PLAYWRIGHT E2E TESTS

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Page Object Model

```typescript
// e2e/pages/LoginPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.getByRole('alert');
    this.rememberMeCheckbox = page.getByLabel('Remember me');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL('/dashboard');
  }
}
```

```typescript
// e2e/pages/ProductsPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly sortDropdown: Locator;
  readonly loadMoreButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.getByTestId('product-card');
    this.searchInput = page.getByPlaceholder('Search products...');
    this.categoryFilter = page.getByRole('combobox', { name: 'Category' });
    this.sortDropdown = page.getByRole('combobox', { name: 'Sort by' });
    this.loadMoreButton = page.getByRole('button', { name: 'Load More' });
  }

  async goto() {
    await this.page.goto('/products');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle');
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.click();
    await this.page.getByRole('option', { name: category }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async addToCart(productName: string) {
    const product = this.page.getByTestId('product-card').filter({
      hasText: productName,
    });
    await product.getByRole('button', { name: 'Add to Cart' }).click();
  }

  async expectProductCount(count: number) {
    await expect(this.productCards).toHaveCount(count);
  }
}
```

### E2E Test Examples

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Authentication', () => {
  test('user can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');

    await loginPage.expectLoggedIn();
    await expect(page.getByText('Welcome, User')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('user@example.com', 'wrongpassword');

    await loginPage.expectError('Invalid email or password');
  });

  test('persists session with remember me', async ({ page, context }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.rememberMeCheckbox.check();
    await loginPage.login('user@example.com', 'password123');

    await loginPage.expectLoggedIn();

    // Check cookie is set with long expiry
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'session');
    expect(sessionCookie?.expires).toBeGreaterThan(Date.now() / 1000 + 86400);
  });
});
```

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { ProductsPage } from './pages/ProductsPage';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('complete checkout flow', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    // Add products to cart
    await productsPage.goto();
    await productsPage.addToCart('Product 1');
    await productsPage.addToCart('Product 2');

    // Go to cart
    await page.getByRole('link', { name: 'Cart (2)' }).click();
    await expect(page).toHaveURL('/cart');

    // Verify cart contents
    await expect(page.getByText('Product 1')).toBeVisible();
    await expect(page.getByText('Product 2')).toBeVisible();

    // Proceed to checkout
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page).toHaveURL('/checkout');

    // Fill shipping info
    await page.getByLabel('Address').fill('123 Main St');
    await page.getByLabel('City').fill('Anytown');
    await page.getByLabel('ZIP Code').fill('12345');

    // Fill payment info
    await page.getByLabel('Card Number').fill('4111111111111111');
    await page.getByLabel('Expiry Date').fill('12/25');
    await page.getByLabel('CVV').fill('123');

    // Complete order
    await page.getByRole('button', { name: 'Place Order' }).click();

    // Verify success
    await expect(page.getByText('Order Confirmed!')).toBeVisible();
    await expect(page.getByText(/Order #/)).toBeVisible();
  });
});
```

### Visual Regression Tests

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('product card matches snapshot', async ({ page }) => {
    await page.goto('/products');
    const productCard = page.getByTestId('product-card').first();
    await expect(productCard).toHaveScreenshot('product-card.png');
  });

  test('responsive design - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    });
  });
});
```

---

<!-- /ANCHOR:playwright-e2e-tests -->
<!-- ANCHOR:test-utilities -->
## 8. TEST UTILITIES

### Custom Render Function

```typescript
// test-utils/render.tsx
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  initialTheme?: 'light' | 'dark';
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });
}

export function customRender(
  ui: React.ReactElement,
  {
    queryClient = createTestQueryClient(),
    initialTheme = 'light',
    ...options
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme={initialTheme}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
  };
}

export * from '@testing-library/react';
export { customRender as render };
```

### Test Factories

```typescript
// test-utils/factories.ts
import { faker } from '@faker-js/faker';

export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    image: faker.image.url(),
    category: faker.commerce.department(),
    inStock: faker.datatype.boolean(),
    ...overrides,
  };
}

export function createOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    items: [
      { productId: faker.string.uuid(), quantity: faker.number.int({ min: 1, max: 5 }) },
    ],
    total: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
    status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}
```

### Custom Matchers

```typescript
// test-utils/matchers.ts
import { expect } from '@playwright/test';

expect.extend({
  async toHaveValidationError(locator, message) {
    const errorElement = locator.locator('[data-error]');
    const errorText = await errorElement.textContent();
    const pass = errorText?.includes(message);

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${locator} not to have validation error "${message}"`
          : `Expected ${locator} to have validation error "${message}", but got "${errorText}"`,
    };
  },
});

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveValidationError(message: string): Promise<R>;
    }
  }
}
```

---

<!-- /ANCHOR:test-utilities -->
<!-- ANCHOR:quick-reference -->
## 9. QUICK REFERENCE

### Testing Cheatsheet

```typescript
// Queries (by priority)
screen.getByRole('button', { name: /submit/i })  // Best for accessibility
screen.getByLabelText('Email')                     // For form inputs
screen.getByPlaceholderText('Search...')          // For placeholders
screen.getByText('Hello World')                    // For text content
screen.getByTestId('custom-element')              // Last resort

// Query variants
getBy*     // Throws if not found (synchronous)
queryBy*   // Returns null if not found (synchronous)
findBy*    // Returns promise, waits for element (async)
getAllBy*  // Returns array, throws if empty

// User Events
const user = userEvent.setup()
await user.click(element)
await user.type(input, 'text')
await user.clear(input)
await user.selectOptions(select, 'value')
await user.keyboard('[Enter]')

// Assertions
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toBeDisabled()
expect(element).toHaveClass('active')
expect(element).toHaveTextContent('Hello')
expect(element).toHaveValue('test')
expect(element).toHaveAttribute('href', '/link')

// Async utilities
await waitFor(() => expect(element).toBeVisible())
await waitForElementToBeRemoved(element)
```

### Checklist: Writing Tests

- [ ] Test user behavior, not implementation
- [ ] Use accessible queries (getByRole, getByLabelText)
- [ ] Set up MSW handlers for API calls
- [ ] Test loading, error, and empty states
- [ ] Cover happy path and edge cases
- [ ] Keep tests independent and isolated
- [ ] Use factories for test data
- [ ] Add E2E tests for critical user journeys

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Related References

- [Component Architecture](./component_architecture.md) - Component patterns to test
- [Data Fetching](./data_fetching.md) - Testing async data patterns
- [Forms & Validation](./forms_validation.md) - Form testing strategies
- [API Patterns](./api_patterns.md) - API structure for mocking
<!-- /ANCHOR:related-resources -->
