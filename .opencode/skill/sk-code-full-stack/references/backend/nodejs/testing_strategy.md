---
title: Testing Strategy - Jest Configuration and Test Patterns
description: Mandatory testing patterns for Node.js backend projects defining Jest configuration, unit testing, integration testing with Supertest, mocking strategies, database testing, and CI/CD integration.
---

# Testing Strategy - Jest Configuration and Test Patterns

Mandatory testing patterns for Node.js backend projects defining Jest configuration, unit testing, integration testing with Supertest, mocking strategies, database testing, and CI/CD integration.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

- **Test consistency** - Uniform testing patterns across all modules
- **Confidence in changes** - Comprehensive coverage for refactoring safety
- **Documentation** - Tests serve as executable specifications
- **Quality gates** - Automated verification before deployment
- **Regression prevention** - Catch bugs before they reach production

### Progressive Disclosure

```
Level 1: This file (testing_strategy.md)
         - Jest setup, unit tests, integration tests, mocking, CI/CD
            |
Level 2: Related knowledge files
         |- nodejs_standards.md - Project structure
         |- express_patterns.md - Controller patterns to test
         +- async_patterns.md - Testing async code
```

### When to Use This File

- Setting up test infrastructure
- Writing unit or integration tests
- Creating mocks and fixtures
- Configuring database testing
- Setting up CI/CD pipelines
- Reviewing test code for patterns compliance

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:test-organization -->
## 2. TEST ORGANIZATION

### Directory Structure

```
tests/
|- unit/                      # Unit tests
|   |- services/             # Service unit tests
|   |   +- user.service.test.ts
|   |- repositories/         # Repository unit tests
|   |   +- user.repository.test.ts
|   |- utils/                # Utility unit tests
|   |   +- validation.test.ts
|   +- middleware/           # Middleware unit tests
|       +- auth.test.ts
|- integration/               # Integration tests
|   |- api/                  # API endpoint tests
|   |   |- users.test.ts
|   |   +- orders.test.ts
|   +- services/             # Service integration tests
|       +- user-order.test.ts
|- e2e/                       # End-to-end tests
|   +- user-journey.test.ts
|- fixtures/                  # Test data
|   |- users.fixture.ts
|   |- orders.fixture.ts
|   +- index.ts
|- mocks/                     # Mock implementations
|   |- services/
|   |- repositories/
|   +- external/
|- helpers/                   # Test utilities
|   |- database.ts           # DB setup/teardown
|   |- auth.ts               # Auth helpers
|   +- api.ts                # API test helpers
+- setup.ts                   # Global test setup
```

### Test File Naming

| Type        | Pattern                      | Example                      |
| ----------- | ---------------------------- | ---------------------------- |
| Unit        | `*.test.ts`                  | `user.service.test.ts`       |
| Integration | `*.test.ts` or `*.int.test.ts` | `users.test.ts`            |
| E2E         | `*.e2e.test.ts`              | `checkout.e2e.test.ts`       |

---

<!-- /ANCHOR:test-organization -->
<!-- ANCHOR:jest-configuration -->
## 3. JEST CONFIGURATION

### Install Dependencies

```bash
npm install -D jest ts-jest @types/jest
npm install -D supertest @types/supertest
npm install -D @faker-js/faker
```

### jest.config.js

```javascript
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/app/server.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000,
  maxWorkers: '50%',
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
};
```

### jest.config.integration.js

```javascript
const baseConfig = require('./jest.config');

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  testMatch: ['**/integration/**/*.test.ts'],
  testTimeout: 60000,
  maxWorkers: 1, // Run sequentially for database tests
  globalSetup: '<rootDir>/tests/integration/global-setup.ts',
  globalTeardown: '<rootDir>/tests/integration/global-teardown.ts',
};
```

### tests/setup.ts

```typescript
import { config } from 'dotenv';

// Load test environment
config({ path: '.env.test' });

// Global test timeout
jest.setTimeout(30000);

// Mock logger to reduce noise
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
  createChildLogger: () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }),
}));

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --config jest.config.integration.js",
    "test:e2e": "jest --config jest.config.e2e.js",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

---

<!-- /ANCHOR:jest-configuration -->
<!-- ANCHOR:unit-testing-patterns -->
## 4. UNIT TESTING PATTERNS

### Service Unit Test Structure

```typescript
import { UserService } from '@/services/user.service';
import { UserRepository } from '@/repositories/user.repository';
import { NotFoundError, ConflictError } from '@/utils/errors';
import { createUserFixture } from '@tests/fixtures/users.fixture';

// Mock dependencies
jest.mock('@/repositories/user.repository');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock instance
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(mockUserRepository);
  });

  describe('getById', () => {
    it('should return user when found', async () => {
      // Arrange
      const expectedUser = createUserFixture();
      mockUserRepository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.getById(expectedUser.id);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(expectedUser.id);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError when user not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getById('nonexistent-id'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'SecurePass123!',
      };
      const expectedUser = createUserFixture(userData);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.create(userData);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          name: userData.name,
        })
      );
    });

    it('should throw ConflictError when email exists', async () => {
      // Arrange
      const existingUser = createUserFixture();
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(
        userService.create({ email: existingUser.email, name: 'New', password: 'Pass123!' })
      ).rejects.toThrow(ConflictError);

      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});
```

### Test Patterns

**Arrange-Act-Assert (AAA):**

```typescript
it('should calculate total with discount', async () => {
  // Arrange
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 },
  ];
  const discount = 0.1;

  // Act
  const total = calculateTotal(items, discount);

  // Assert
  expect(total).toBe(225); // (200 + 50) * 0.9
});
```

**Table-Driven Tests:**

```typescript
describe('validateEmail', () => {
  const testCases = [
    { email: 'valid@example.com', expected: true },
    { email: 'also.valid@example.co.uk', expected: true },
    { email: 'invalid-email', expected: false },
    { email: '@nodomain.com', expected: false },
    { email: 'no@tld', expected: false },
  ];

  test.each(testCases)(
    'should return $expected for email "$email"',
    ({ email, expected }) => {
      expect(validateEmail(email)).toBe(expected);
    }
  );
});
```

**Error Testing:**

```typescript
describe('error handling', () => {
  it('should throw specific error type', async () => {
    await expect(operation()).rejects.toThrow(NotFoundError);
  });

  it('should throw with specific message', async () => {
    await expect(operation()).rejects.toThrow('User not found');
  });

  it('should throw with specific error code', async () => {
    await expect(operation()).rejects.toMatchObject({
      code: 'NOT_FOUND',
      statusCode: 404,
    });
  });
});
```

---

<!-- /ANCHOR:unit-testing-patterns -->
<!-- ANCHOR:integration-testing-with-supertest -->
## 5. INTEGRATION TESTING WITH SUPERTEST

### API Test Setup

Create `tests/helpers/api.ts`:

```typescript
import request from 'supertest';
import { Application } from 'express';

import { createApp } from '@/app/app';
import { prisma } from '@/lib/prisma';

let app: Application;

export async function setupTestApp(): Promise<Application> {
  if (!app) {
    app = createApp();
  }
  return app;
}

export async function cleanDatabase(): Promise<void> {
  // Delete in correct order for foreign keys
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
}

export function createTestClient(app: Application): request.SuperTest<request.Test> {
  return request(app);
}

export async function getAuthToken(
  client: request.SuperTest<request.Test>,
  email: string,
  password: string
): Promise<string> {
  const response = await client
    .post('/api/v1/auth/login')
    .send({ email, password });

  return response.body.data.accessToken;
}
```

### Integration Test Example

Create `tests/integration/api/users.test.ts`:

```typescript
import request from 'supertest';
import { Application } from 'express';

import { setupTestApp, cleanDatabase, createTestClient, getAuthToken } from '@tests/helpers/api';
import { createUserInDb, createAdminInDb } from '@tests/helpers/database';
import { createUserFixture } from '@tests/fixtures/users.fixture';

describe('Users API', () => {
  let app: Application;
  let client: request.SuperTest<request.Test>;

  beforeAll(async () => {
    app = await setupTestApp();
    client = createTestClient(app);
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'SecurePass123!',
      };

      const response = await client
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          email: userData.email,
          name: userData.name,
        },
        message: 'User created successfully',
      });

      // Password should not be in response
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 422 for invalid email', async () => {
      const response = await client
        .post('/api/v1/users')
        .send({
          email: 'invalid-email',
          name: 'Test',
          password: 'SecurePass123!',
        })
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          details: expect.arrayContaining([
            expect.objectContaining({ field: 'email' }),
          ]),
        },
      });
    });

    it('should return 409 for duplicate email', async () => {
      const existingUser = await createUserInDb();

      await client
        .post('/api/v1/users')
        .send({
          email: existingUser.email,
          name: 'Another User',
          password: 'SecurePass123!',
        })
        .expect(409);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should require authentication', async () => {
      await client
        .get('/api/v1/users')
        .expect(401);
    });

    it('should return paginated users', async () => {
      // Create test users
      await Promise.all([
        createUserInDb({ email: 'user1@test.com' }),
        createUserInDb({ email: 'user2@test.com' }),
        createUserInDb({ email: 'user3@test.com' }),
      ]);

      // Get auth token
      const admin = await createAdminInDb();
      const token = await getAuthToken(client, admin.email, 'AdminPass123!');

      const response = await client
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({ email: expect.any(String) }),
        ]),
        meta: {
          pagination: {
            page: 1,
            limit: 2,
            total: 4, // 3 users + admin
            totalPages: 2,
            hasNext: true,
            hasPrev: false,
          },
        },
      });

      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return user by id', async () => {
      const user = await createUserInDb();
      const token = await getAuthToken(client, user.email, 'TestPass123!');

      const response = await client
        .get(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toMatchObject({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    });

    it('should return 404 for non-existent user', async () => {
      const user = await createUserInDb();
      const token = await getAuthToken(client, user.email, 'TestPass123!');

      await client
        .get('/api/v1/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('should update user', async () => {
      const user = await createUserInDb();
      const token = await getAuthToken(client, user.email, 'TestPass123!');

      const response = await client
        .patch(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      expect(response.body.data.name).toBe('Updated Name');
    });

    it('should not allow updating other users', async () => {
      const user1 = await createUserInDb({ email: 'user1@test.com' });
      const user2 = await createUserInDb({ email: 'user2@test.com' });
      const token = await getAuthToken(client, user1.email, 'TestPass123!');

      await client
        .patch(`/api/v1/users/${user2.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Hacked' })
        .expect(403);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should require admin role', async () => {
      const user = await createUserInDb();
      const token = await getAuthToken(client, user.email, 'TestPass123!');

      await client
        .delete(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should allow admin to delete users', async () => {
      const admin = await createAdminInDb();
      const user = await createUserInDb();
      const token = await getAuthToken(client, admin.email, 'AdminPass123!');

      await client
        .delete(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });
  });
});
```

---

<!-- /ANCHOR:integration-testing-with-supertest -->
<!-- ANCHOR:mocking-strategies -->
## 6. MOCKING STRATEGIES

### Module Mocking

```typescript
// Mock entire module
jest.mock('@/services/email.service');

// Mock with implementation
jest.mock('@/services/email.service', () => ({
  EmailService: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
    sendBulk: jest.fn().mockResolvedValue([]),
  })),
}));

// Mock single function
jest.mock('@/utils/crypto', () => ({
  ...jest.requireActual('@/utils/crypto'),
  hashPassword: jest.fn().mockResolvedValue('hashed-password'),
}));
```

### Spy Pattern

```typescript
import * as emailService from '@/services/email.service';

describe('notification service', () => {
  it('should send welcome email', async () => {
    const sendSpy = jest
      .spyOn(emailService, 'send')
      .mockResolvedValue({ messageId: '123' });

    await notificationService.welcomeUser(user);

    expect(sendSpy).toHaveBeenCalledWith({
      to: user.email,
      template: 'welcome',
      data: expect.objectContaining({ name: user.name }),
    });

    sendSpy.mockRestore();
  });
});
```

### Mock Factory

Create `tests/mocks/services/email.service.mock.ts`:

```typescript
import { EmailService } from '@/services/email.service';

export function createMockEmailService(): jest.Mocked<EmailService> {
  return {
    send: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
    sendBulk: jest.fn().mockResolvedValue([]),
    sendTemplate: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
    verifyConnection: jest.fn().mockResolvedValue(true),
  } as unknown as jest.Mocked<EmailService>;
}
```

### External Service Mocking

```typescript
import nock from 'nock';

describe('payment service', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('should process payment successfully', async () => {
    // Mock external API
    nock('https://api.stripe.com')
      .post('/v1/charges')
      .reply(200, {
        id: 'ch_mock123',
        status: 'succeeded',
        amount: 1000,
      });

    const result = await paymentService.charge({
      amount: 1000,
      currency: 'usd',
      source: 'tok_visa',
    });

    expect(result.status).toBe('succeeded');
  });

  it('should handle payment failure', async () => {
    nock('https://api.stripe.com')
      .post('/v1/charges')
      .reply(402, {
        error: {
          type: 'card_error',
          message: 'Card declined',
        },
      });

    await expect(paymentService.charge({
      amount: 1000,
      currency: 'usd',
      source: 'tok_chargeDeclined',
    })).rejects.toThrow('Card declined');
  });
});
```

---

<!-- /ANCHOR:mocking-strategies -->
<!-- ANCHOR:test-fixtures -->
## 7. TEST FIXTURES

### Fixture Factory

Create `tests/fixtures/users.fixture.ts`:

```typescript
import { faker } from '@faker-js/faker';
import { User } from '@/models/user.model';

export interface UserFixtureOverrides {
  id?: string;
  email?: string;
  name?: string;
  role?: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export function createUserFixture(overrides: UserFixtureOverrides = {}): User {
  const now = new Date();

  return {
    id: overrides.id ?? faker.string.uuid(),
    email: overrides.email ?? faker.internet.email().toLowerCase(),
    name: overrides.name ?? faker.person.fullName(),
    role: overrides.role ?? 'user',
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  };
}

export function createUserFixtures(count: number): User[] {
  return Array.from({ length: count }, () => createUserFixture());
}
```

Create `tests/fixtures/orders.fixture.ts`:

```typescript
import { faker } from '@faker-js/faker';
import { Order, OrderStatus, OrderItem } from '@/models/order.model';

export function createOrderItemFixture(overrides: Partial<OrderItem> = {}): OrderItem {
  return {
    id: overrides.id ?? faker.string.uuid(),
    productId: overrides.productId ?? faker.string.uuid(),
    name: overrides.name ?? faker.commerce.productName(),
    price: overrides.price ?? parseFloat(faker.commerce.price()),
    quantity: overrides.quantity ?? faker.number.int({ min: 1, max: 5 }),
  };
}

export function createOrderFixture(overrides: Partial<Order> = {}): Order {
  const items = overrides.items ?? [createOrderItemFixture(), createOrderItemFixture()];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: overrides.id ?? faker.string.uuid(),
    userId: overrides.userId ?? faker.string.uuid(),
    status: overrides.status ?? OrderStatus.PENDING,
    items,
    subtotal,
    tax: overrides.tax ?? subtotal * 0.1,
    total: overrides.total ?? subtotal * 1.1,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
  };
}
```

### Database Fixtures

Create `tests/helpers/database.ts`:

```typescript
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import { createUserFixture, UserFixtureOverrides } from '@tests/fixtures/users.fixture';

export async function createUserInDb(
  overrides: UserFixtureOverrides & { password?: string } = {}
): Promise<User> {
  const fixture = createUserFixture(overrides);
  const password = overrides.password ?? 'TestPass123!';

  return prisma.user.create({
    data: {
      ...fixture,
      password: await bcrypt.hash(password, 10),
    },
  });
}

export async function createAdminInDb(): Promise<User> {
  return createUserInDb({
    email: 'admin@test.com',
    role: 'admin',
    password: 'AdminPass123!',
  });
}

export async function createUsersInDb(count: number): Promise<User[]> {
  return Promise.all(
    Array.from({ length: count }, () => createUserInDb())
  );
}
```

---

<!-- /ANCHOR:test-fixtures -->
<!-- ANCHOR:database-testing -->
## 8. DATABASE TESTING

### Test Database Setup

Create `tests/integration/global-setup.ts`:

```typescript
import { execSync } from 'child_process';

export default async function globalSetup(): Promise<void> {
  // Set test database URL
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

  // Reset database
  execSync('npx prisma migrate reset --force --skip-seed', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  });

  console.log('Test database reset complete');
}
```

Create `tests/integration/global-teardown.ts`:

```typescript
import { prisma } from '@/lib/prisma';

export default async function globalTeardown(): Promise<void> {
  await prisma.$disconnect();
  console.log('Test database connection closed');
}
```

### Transaction Rollback Pattern

```typescript
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

describe('OrderService', () => {
  let tx: PrismaClient;

  beforeEach(async () => {
    // Start transaction
    tx = await prisma.$transaction(async (prisma) => {
      // Return prisma instance for use in tests
      return prisma;
    });
  });

  afterEach(async () => {
    // Rollback transaction
    await tx.$executeRaw`ROLLBACK`;
  });

  it('should create order within transaction', async () => {
    const order = await orderService.create(orderData, tx);
    expect(order).toBeDefined();
    // Changes will be rolled back after test
  });
});
```

### In-Memory Database

For faster unit tests, use SQLite:

```typescript
// jest.config.unit.js
module.exports = {
  ...require('./jest.config'),
  testMatch: ['**/unit/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.ts'],
};

// tests/unit/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file::memory:?cache=shared',
    },
  },
});

beforeAll(async () => {
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS ...`;
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

---

<!-- /ANCHOR:database-testing -->
<!-- ANCHOR:testing-async-code -->
## 9. TESTING ASYNC CODE

### Promise Resolution

```typescript
describe('async operations', () => {
  it('should resolve with data', async () => {
    const result = await fetchData();
    expect(result).toEqual(expectedData);
  });

  it('should resolve with data (alternative)', () => {
    return expect(fetchData()).resolves.toEqual(expectedData);
  });

  it('should reject with error', async () => {
    await expect(failingOperation()).rejects.toThrow('Expected error');
  });

  it('should reject with error (alternative)', () => {
    return expect(failingOperation()).rejects.toThrow('Expected error');
  });
});
```

### Testing Timeouts

```typescript
describe('timeout handling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should timeout after 5 seconds', async () => {
    const promise = operationWithTimeout(5000);

    // Fast-forward time
    jest.advanceTimersByTime(5000);

    await expect(promise).rejects.toThrow('Timeout');
  });

  it('should complete before timeout', async () => {
    const promise = operationWithTimeout(5000);

    // Advance less than timeout
    jest.advanceTimersByTime(1000);

    // Resolve the operation
    await promise;

    expect(true).toBe(true);
  });
});
```

### Testing Event Emitters

```typescript
describe('event emitter', () => {
  it('should emit event', (done) => {
    const emitter = new OrderEventEmitter();

    emitter.on('created', (order) => {
      expect(order.id).toBeDefined();
      done();
    });

    emitter.createOrder({ items: [] });
  });

  it('should emit event (async/await)', async () => {
    const emitter = new OrderEventEmitter();

    const orderPromise = new Promise((resolve) => {
      emitter.on('created', resolve);
    });

    emitter.createOrder({ items: [] });

    const order = await orderPromise;
    expect(order).toBeDefined();
  });
});
```

---

<!-- /ANCHOR:testing-async-code -->
<!-- ANCHOR:coverage-and-reporting -->
## 10. COVERAGE AND REPORTING

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/index.ts',
    '!src/types/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/services/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

### Coverage Targets by Component

| Component    | Lines | Branches | Functions |
| ------------ | ----- | -------- | --------- |
| Services     | 90%   | 85%      | 90%       |
| Controllers  | 80%   | 75%      | 85%       |
| Repositories | 85%   | 80%      | 85%       |
| Utils        | 95%   | 90%      | 95%       |
| Middleware   | 80%   | 75%      | 80%       |

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

---

<!-- /ANCHOR:coverage-and-reporting -->
<!-- ANCHOR:ci-cd-integration -->
## 11. CI/CD INTEGRATION

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          JWT_SECRET: test-secret-key-for-ci-testing-only

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
```

### Pre-commit Hooks

Install husky:

```bash
npm install -D husky lint-staged
npx husky init
```

Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Create `.lintstagedrc.js`:

```javascript
module.exports = {
  '*.ts': ['eslint --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
};
```

### Pre-push Hooks

Create `.husky/pre-push`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run test:unit
```

---

<!-- /ANCHOR:ci-cd-integration -->
<!-- ANCHOR:rules -->
## 12. RULES

### ✅ ALWAYS

1. **Follow AAA pattern** - Arrange, Act, Assert structure
2. **Use descriptive test names** - Describe behavior, not implementation
3. **One assertion focus per test** - Test one behavior at a time
4. **Mock external dependencies** - Isolate unit tests
5. **Clean up after tests** - Reset mocks, clear database
6. **Use fixtures for test data** - Consistent, maintainable test data
7. **Test error cases** - Both happy and unhappy paths
8. **Run tests in CI** - Automated verification
9. **Maintain coverage thresholds** - Enforce minimum coverage
10. **Test async code properly** - Use async/await, handle promises
11. **Use realistic test data** - Faker for random but valid data
12. **Document complex test setups** - Comments for non-obvious logic

### ❌ NEVER

1. **Test implementation details** - Test behavior, not internals
2. **Share state between tests** - Each test must be independent
3. **Use real external services** - Mock APIs, databases
4. **Skip error handling tests** - Errors are part of behavior
5. **Write flaky tests** - Fix or remove unreliable tests
6. **Commit failing tests** - Tests must pass in CI
7. **Ignore test warnings** - Warnings often indicate problems
8. **Hardcode test data** - Use fixtures and factories
9. **Test private methods directly** - Test through public API
10. **Use `test.only` in commits** - Accidentally skips tests
11. **Mock everything** - Integration tests need real interactions
12. **Couple tests to order** - Tests must run in any order

### ⚠️ ESCALATE IF

1. **Coverage dropping** - Investigate missing tests
2. **Tests taking too long** - Optimize or parallelize
3. **Flaky tests appearing** - Root cause analysis needed
4. **External service mocking complex** - May need test doubles
5. **Database test isolation issues** - Review transaction strategy
6. **CI environment differences** - Debug environment parity

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 13. RELATED RESOURCES

| File                                         | Purpose                                  |
| -------------------------------------------- | ---------------------------------------- |
| [nodejs_standards.md](./nodejs_standards.md) | Project structure and configuration      |
| [express_patterns.md](./express_patterns.md) | Controller patterns and middleware       |
| [async_patterns.md](./async_patterns.md)     | Testing async code patterns              |
<!-- /ANCHOR:related-resources -->
