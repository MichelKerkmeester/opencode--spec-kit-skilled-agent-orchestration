/* ─────────────────────────────────────────────────────────────
   TESTING PATTERNS
   Jest & Supertest Templates for Node.js/TypeScript

   PURPOSE: Reusable testing patterns for Node.js backend applications
   PATTERNS: Unit tests, integration tests, mocks, fixtures, database utilities
   COMPATIBLE WITH: Jest, Supertest, Prisma, TypeORM
──────────────────────────────────────────────────────────────── */

import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import request from 'supertest';

/* ─────────────────────────────────────────────────────────────
   1. TEST UTILITIES & TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Test context providing common utilities.
 */
export interface TestContext {
  prisma: PrismaClient;
  app?: Express;
  cleanup: () => Promise<void>;
}

/**
 * Test user for authentication testing.
 */
export interface TestUser {
  id: string;
  email: string;
  role: string;
  token: string;
}

/**
 * HTTP test response type.
 */
export interface TestResponse<T = unknown> {
  status: number;
  body: T;
  headers: Record<string, string>;
}

/**
 * Generate a random string for unique test data.
 */
export function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Generate a unique email for testing.
 */
export function uniqueEmail(): string {
  return `test-${randomString()}@example.com`;
}

/**
 * Generate a unique ID (UUID-like).
 */
export function uniqueId(): string {
  return `${randomString(8)}-${randomString(4)}-${randomString(4)}-${randomString(4)}-${randomString(12)}`;
}

/**
 * Wait for a specified time (use sparingly).
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async function until it succeeds or times out.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delay?: number; timeout?: number } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 100, timeout = 5000 } = options;
  const startTime = Date.now();
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Retry timeout after ${timeout}ms: ${lastError?.message}`);
    }

    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await wait(delay * attempt);
      }
    }
  }

  throw lastError;
}

/* ─────────────────────────────────────────────────────────────
   2. DATABASE TEST UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Create a test Prisma client with connection management.
 *
 * @example
 * ```typescript
 * describe('UserService', () => {
 *   let prisma: PrismaClient;
 *
 *   beforeAll(async () => {
 *     prisma = await createTestPrismaClient();
 *   });
 *
 *   afterAll(async () => {
 *     await prisma.$disconnect();
 *   });
 * });
 * ```
 */
export async function createTestPrismaClient(): Promise<PrismaClient> {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
      },
    },
    log: process.env.DEBUG_TESTS ? ['query', 'error'] : ['error'],
  });

  await prisma.$connect();
  return prisma;
}

/**
 * Transaction wrapper for isolated tests.
 * Each test runs in a transaction that's rolled back.
 *
 * @example
 * ```typescript
 * describe('UserRepository', () => {
 *   let prisma: PrismaClient;
 *   let tx: TransactionWrapper;
 *
 *   beforeAll(async () => {
 *     prisma = await createTestPrismaClient();
 *   });
 *
 *   beforeEach(async () => {
 *     tx = await createTransactionWrapper(prisma);
 *   });
 *
 *   afterEach(async () => {
 *     await tx.rollback();
 *   });
 *
 *   it('creates user', async () => {
 *     const user = await tx.prisma.user.create({ data: userData });
 *     expect(user).toBeDefined();
 *   });
 * });
 * ```
 */
export interface TransactionWrapper {
  prisma: PrismaClient;
  rollback: () => Promise<void>;
}

export async function createTransactionWrapper(
  prisma: PrismaClient
): Promise<TransactionWrapper> {
  // Note: This is a simplified version. For actual transaction isolation,
  // use prisma.$transaction with the interactive API or a test database reset strategy.
  return {
    prisma,
    rollback: async () => {
      // In practice, you'd implement actual rollback logic
      // This is a placeholder for the pattern
    },
  };
}

/**
 * Clean specific tables in the test database.
 *
 * @example
 * ```typescript
 * afterEach(async () => {
 *   await cleanTables(prisma, ['user', 'post', 'comment']);
 * });
 * ```
 */
export async function cleanTables(
  prisma: PrismaClient,
  tables: string[]
): Promise<void> {
  // Disable foreign key checks temporarily
  await prisma.$executeRawUnsafe('SET session_replication_role = replica;');

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }

  await prisma.$executeRawUnsafe('SET session_replication_role = DEFAULT;');
}

/**
 * Reset entire database to clean state.
 * Use with caution - only in test environment.
 */
export async function resetDatabase(prisma: PrismaClient): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Database reset is only allowed in test environment');
  }

  // Get all table names
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename != '_prisma_migrations';
  `;

  await cleanTables(
    prisma,
    tables.map((t) => t.tablename)
  );
}

/* ─────────────────────────────────────────────────────────────
   3. MOCK FACTORY PATTERN
──────────────────────────────────────────────────────────────── */

/**
 * Base factory interface for creating test data.
 */
export interface Factory<T, CreateInput> {
  build(overrides?: Partial<CreateInput>): CreateInput;
  create(overrides?: Partial<CreateInput>): Promise<T>;
  createMany(count: number, overrides?: Partial<CreateInput>): Promise<T[]>;
}

/**
 * Create a factory for generating test data.
 *
 * @example
 * ```typescript
 * const userFactory = createFactory<User, CreateUserDTO>(
 *   () => ({
 *     email: uniqueEmail(),
 *     name: `Test User ${randomString()}`,
 *     password: 'Password123!',
 *     role: 'user',
 *   }),
 *   async (data) => prisma.user.create({ data })
 * );
 *
 * // Build data without persisting
 * const userData = userFactory.build({ role: 'admin' });
 *
 * // Create and persist
 * const user = await userFactory.create({ name: 'John Doe' });
 *
 * // Create multiple
 * const users = await userFactory.createMany(5);
 * ```
 */
export function createFactory<T, CreateInput>(
  defaults: () => CreateInput,
  persist: (data: CreateInput) => Promise<T>
): Factory<T, CreateInput> {
  return {
    build(overrides?: Partial<CreateInput>): CreateInput {
      return { ...defaults(), ...overrides };
    },

    async create(overrides?: Partial<CreateInput>): Promise<T> {
      const data = this.build(overrides);
      return persist(data);
    },

    async createMany(count: number, overrides?: Partial<CreateInput>): Promise<T[]> {
      return Promise.all(
        Array.from({ length: count }, () => this.create(overrides))
      );
    },
  };
}

/**
 * Create a factory with relationships.
 *
 * @example
 * ```typescript
 * const postFactory = createRelatedFactory<Post, CreatePostDTO>(
 *   async (relations) => ({
 *     title: `Test Post ${randomString()}`,
 *     content: 'Test content',
 *     authorId: relations.author?.id ?? (await userFactory.create()).id,
 *   }),
 *   async (data) => prisma.post.create({ data })
 * );
 *
 * // Create with explicit author
 * const author = await userFactory.create();
 * const post = await postFactory.create({}, { author });
 *
 * // Create with auto-generated author
 * const postWithNewAuthor = await postFactory.create();
 * ```
 */
export function createRelatedFactory<T, CreateInput, Relations = Record<string, unknown>>(
  defaults: (relations: Relations) => Promise<CreateInput> | CreateInput,
  persist: (data: CreateInput) => Promise<T>
): {
  build(overrides?: Partial<CreateInput>, relations?: Partial<Relations>): Promise<CreateInput>;
  create(overrides?: Partial<CreateInput>, relations?: Partial<Relations>): Promise<T>;
  createMany(count: number, overrides?: Partial<CreateInput>, relations?: Partial<Relations>): Promise<T[]>;
} {
  return {
    async build(overrides?: Partial<CreateInput>, relations?: Partial<Relations>): Promise<CreateInput> {
      const defaultData = await defaults((relations || {}) as Relations);
      return { ...defaultData, ...overrides };
    },

    async create(overrides?: Partial<CreateInput>, relations?: Partial<Relations>): Promise<T> {
      const data = await this.build(overrides, relations);
      return persist(data);
    },

    async createMany(
      count: number,
      overrides?: Partial<CreateInput>,
      relations?: Partial<Relations>
    ): Promise<T[]> {
      return Promise.all(
        Array.from({ length: count }, () => this.create(overrides, relations))
      );
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   4. SERVICE MOCKING PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Create a mock implementation with type safety.
 *
 * @example
 * ```typescript
 * interface EmailService {
 *   sendEmail(to: string, subject: string, body: string): Promise<void>;
 *   sendBulk(emails: { to: string; subject: string; body: string }[]): Promise<void>;
 * }
 *
 * const mockEmailService = createMock<EmailService>({
 *   sendEmail: jest.fn().mockResolvedValue(undefined),
 *   sendBulk: jest.fn().mockResolvedValue(undefined),
 * });
 *
 * // Use in tests
 * expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
 *   'test@example.com',
 *   expect.any(String),
 *   expect.any(String)
 * );
 * ```
 */
export function createMock<T extends object>(implementation: Partial<T>): jest.Mocked<T> {
  return implementation as jest.Mocked<T>;
}

/**
 * Create a spy on a method while keeping original implementation.
 */
export function spyOn<T extends object, K extends keyof T>(
  obj: T,
  method: K
): jest.SpyInstance {
  return jest.spyOn(obj, method as any);
}

/**
 * Mock repository pattern for unit testing services.
 *
 * @example
 * ```typescript
 * describe('UserService', () => {
 *   let service: UserService;
 *   let mockRepo: MockRepository<User>;
 *
 *   beforeEach(() => {
 *     mockRepo = createMockRepository<User>();
 *     service = new UserService(mockRepo);
 *   });
 *
 *   it('finds user by ID', async () => {
 *     const mockUser = { id: '1', name: 'John', email: 'john@example.com' };
 *     mockRepo.findById.mockResolvedValue(mockUser);
 *
 *     const result = await service.findById('1');
 *
 *     expect(result.success).toBe(true);
 *     expect(mockRepo.findById).toHaveBeenCalledWith('1');
 *   });
 * });
 * ```
 */
export interface MockRepository<T> {
  create: jest.Mock<Promise<T>, [Partial<T>]>;
  findById: jest.Mock<Promise<T | null>, [string]>;
  findAll: jest.Mock<Promise<T[]>, [unknown?]>;
  findPaginated: jest.Mock<Promise<{ data: T[]; meta: unknown }>, [unknown, unknown?]>;
  update: jest.Mock<Promise<T>, [string, Partial<T>]>;
  delete: jest.Mock<Promise<void>, [string]>;
  exists: jest.Mock<Promise<boolean>, [string]>;
  count: jest.Mock<Promise<number>, [unknown?]>;
}

export function createMockRepository<T>(): MockRepository<T> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn().mockResolvedValue([]),
    findPaginated: jest.fn().mockResolvedValue({ data: [], meta: {} }),
    update: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn().mockResolvedValue(false),
    count: jest.fn().mockResolvedValue(0),
  };
}

/* ─────────────────────────────────────────────────────────────
   5. HTTP TESTING WITH SUPERTEST
──────────────────────────────────────────────────────────────── */

/**
 * Create an HTTP test client with authentication helpers.
 *
 * @example
 * ```typescript
 * describe('User API', () => {
 *   let client: TestClient;
 *
 *   beforeAll(async () => {
 *     const app = await createApp();
 *     client = createTestClient(app);
 *   });
 *
 *   it('gets current user', async () => {
 *     const token = await createAuthToken(adminUser);
 *
 *     const response = await client
 *       .get('/api/users/me')
 *       .auth(token)
 *       .expect(200);
 *
 *     expect(response.body.data.email).toBe(adminUser.email);
 *   });
 * });
 * ```
 */
export interface TestClient {
  get(path: string): TestRequest;
  post(path: string): TestRequest;
  put(path: string): TestRequest;
  patch(path: string): TestRequest;
  delete(path: string): TestRequest;
}

export interface TestRequest {
  auth(token: string): this;
  send(body: unknown): this;
  query(params: Record<string, unknown>): this;
  set(header: string, value: string): this;
  expect(status: number): Promise<TestResponse>;
  expectJson(): Promise<TestResponse>;
}

export function createTestClient(app: Express): TestClient {
  const createRequest = (method: 'get' | 'post' | 'put' | 'patch' | 'delete', path: string): TestRequest => {
    let req = request(app)[method](path);
    let authToken: string | null = null;
    let expectedStatus: number | null = null;

    const testRequest: TestRequest = {
      auth(token: string) {
        authToken = token;
        return this;
      },

      send(body: unknown) {
        req = req.send(body);
        return this;
      },

      query(params: Record<string, unknown>) {
        req = req.query(params);
        return this;
      },

      set(header: string, value: string) {
        req = req.set(header, value);
        return this;
      },

      async expect(status: number): Promise<TestResponse> {
        if (authToken) {
          req = req.set('Authorization', `Bearer ${authToken}`);
        }

        const response = await req.expect(status);

        return {
          status: response.status,
          body: response.body,
          headers: response.headers as Record<string, string>,
        };
      },

      async expectJson(): Promise<TestResponse> {
        req = req.set('Accept', 'application/json');
        if (authToken) {
          req = req.set('Authorization', `Bearer ${authToken}`);
        }

        const response = await req;

        return {
          status: response.status,
          body: response.body,
          headers: response.headers as Record<string, string>,
        };
      },
    };

    return testRequest;
  };

  return {
    get: (path) => createRequest('get', path),
    post: (path) => createRequest('post', path),
    put: (path) => createRequest('put', path),
    patch: (path) => createRequest('patch', path),
    delete: (path) => createRequest('delete', path),
  };
}

/**
 * Assert API response structure.
 */
export function expectApiResponse<T>(response: TestResponse<{ success: boolean; data?: T; error?: unknown }>) {
  return {
    toBeSuccess(): void {
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    },

    toBeError(code?: string): void {
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      if (code) {
        expect((response.body.error as { code: string }).code).toBe(code);
      }
    },

    toHaveData<D>(matcher: (data: D) => void): void {
      expect(response.body.success).toBe(true);
      matcher(response.body.data as D);
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   6. FIXTURE PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Fixture loader for JSON test data.
 *
 * @example
 * ```typescript
 * // __fixtures__/users.json
 * // { "admin": { "email": "admin@test.com", ... } }
 *
 * const fixtures = createFixtureLoader<{
 *   users: { admin: User; regular: User };
 *   posts: { published: Post; draft: Post };
 * }>('./__fixtures__');
 *
 * const adminUser = fixtures.get('users', 'admin');
 * ```
 */
export function createFixtureLoader<T extends Record<string, Record<string, unknown>>>(
  basePath: string
): {
  get<K extends keyof T, N extends keyof T[K]>(category: K, name: N): T[K][N];
  getAll<K extends keyof T>(category: K): T[K];
} {
  const cache = new Map<string, unknown>();

  const loadFixture = <K extends keyof T>(category: K): T[K] => {
    const cacheKey = String(category);
    if (!cache.has(cacheKey)) {
      // In real implementation, read from file system
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const data = require(`${basePath}/${String(category)}.json`);
      cache.set(cacheKey, data);
    }
    return cache.get(cacheKey) as T[K];
  };

  return {
    get<K extends keyof T, N extends keyof T[K]>(category: K, name: N): T[K][N] {
      const fixtures = loadFixture(category);
      return fixtures[name];
    },

    getAll<K extends keyof T>(category: K): T[K] {
      return loadFixture(category);
    },
  };
}

/**
 * Seeder for populating test database with fixtures.
 *
 * @example
 * ```typescript
 * const seeder = createSeeder(prisma);
 *
 * seeder.register('users', async (prisma) => {
 *   return prisma.user.createMany({
 *     data: [
 *       { email: 'admin@test.com', name: 'Admin', role: 'admin' },
 *       { email: 'user@test.com', name: 'User', role: 'user' },
 *     ],
 *   });
 * });
 *
 * beforeAll(async () => {
 *   await seeder.seed(['users']);
 * });
 * ```
 */
export interface Seeder {
  register(name: string, seedFn: (prisma: PrismaClient) => Promise<void>): void;
  seed(names: string[]): Promise<void>;
  seedAll(): Promise<void>;
  reset(names: string[]): Promise<void>;
}

export function createSeeder(prisma: PrismaClient): Seeder {
  const seeders = new Map<string, (prisma: PrismaClient) => Promise<void>>();

  return {
    register(name: string, seedFn: (prisma: PrismaClient) => Promise<void>): void {
      seeders.set(name, seedFn);
    },

    async seed(names: string[]): Promise<void> {
      for (const name of names) {
        const seedFn = seeders.get(name);
        if (!seedFn) {
          throw new Error(`Seeder '${name}' not found`);
        }
        await seedFn(prisma);
      }
    },

    async seedAll(): Promise<void> {
      for (const seedFn of seeders.values()) {
        await seedFn(prisma);
      }
    },

    async reset(names: string[]): Promise<void> {
      // Truncate tables in reverse order to handle foreign keys
      await cleanTables(prisma, names.reverse());
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   7. TEST SETUP UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Create a test context with common setup/teardown.
 *
 * @example
 * ```typescript
 * describe('Integration Tests', () => {
 *   const ctx = useTestContext();
 *
 *   it('creates user', async () => {
 *     const user = await ctx.prisma.user.create({ data: userData });
 *     expect(user).toBeDefined();
 *   });
 * });
 * ```
 */
export function useTestContext(): TestContext {
  let prisma: PrismaClient;
  let cleanup = async (): Promise<void> => {};

  beforeAll(async () => {
    prisma = await createTestPrismaClient();
  });

  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  return {
    get prisma() {
      return prisma;
    },
    cleanup: async () => cleanup(),
  };
}

/**
 * Setup for each test - clean state.
 */
export function useCleanState(
  prisma: PrismaClient,
  tables: string[]
): void {
  beforeEach(async () => {
    await cleanTables(prisma, tables);
  });
}

/**
 * Authentication helper for tests.
 */
export interface AuthHelper {
  createToken(user: { id: string; email: string; role: string }): string;
  createAdminToken(): string;
  createUserToken(): string;
}

export function createAuthHelper(jwtSecret: string): AuthHelper {
  const jwt = require('jsonwebtoken');

  return {
    createToken(user: { id: string; email: string; role: string }): string {
      return jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        jwtSecret,
        { expiresIn: '1h' }
      );
    },

    createAdminToken(): string {
      return this.createToken({
        id: 'admin-test-id',
        email: 'admin@test.com',
        role: 'admin',
      });
    },

    createUserToken(): string {
      return this.createToken({
        id: 'user-test-id',
        email: 'user@test.com',
        role: 'user',
      });
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   8. ASSERTION HELPERS
──────────────────────────────────────────────────────────────── */

/**
 * Custom Jest matchers for common assertions.
 *
 * @example
 * ```typescript
 * // In jest.setup.ts
 * expect.extend(customMatchers);
 *
 * // In tests
 * expect(user).toMatchEntity({ id: expect.any(String), email: 'test@example.com' });
 * expect(response.body).toBeValidationError('email');
 * ```
 */
export const customMatchers = {
  /**
   * Check if object matches entity structure with partial matching.
   */
  toMatchEntity(received: unknown, expected: Record<string, unknown>) {
    const pass = Object.entries(expected).every(([key, value]) => {
      const receivedValue = (received as Record<string, unknown>)[key];

      if (typeof value === 'function') {
        return value(receivedValue);
      }

      if (value && typeof value === 'object' && 'asymmetricMatch' in (value as object)) {
        return (value as jest.AsymmetricMatcher).asymmetricMatch(receivedValue);
      }

      return receivedValue === value;
    });

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${JSON.stringify(received)} not to match entity ${JSON.stringify(expected)}`
          : `Expected ${JSON.stringify(received)} to match entity ${JSON.stringify(expected)}`,
    };
  },

  /**
   * Check if response is a validation error for a specific field.
   */
  toBeValidationError(
    received: { error?: { code?: string; details?: Array<{ field: string }> } },
    field: string
  ) {
    const isValidationError = received?.error?.code === 'VALIDATION_ERROR';
    const hasFieldError = received?.error?.details?.some((d) => d.field === field);

    const pass = isValidationError && hasFieldError;

    return {
      pass,
      message: () =>
        pass
          ? `Expected not to be validation error for field '${field}'`
          : `Expected validation error for field '${field}', got ${JSON.stringify(received)}`,
    };
  },

  /**
   * Check if date is within a time range of now.
   */
  toBeRecentDate(received: Date | string, withinMs = 5000) {
    const date = new Date(received);
    const now = Date.now();
    const diff = Math.abs(now - date.getTime());
    const pass = diff <= withinMs;

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be within ${withinMs}ms of now`
          : `Expected ${received} to be within ${withinMs}ms of now (diff: ${diff}ms)`,
    };
  },
};

/* ─────────────────────────────────────────────────────────────
   9. COMPLETE EXAMPLE - USER SERVICE TESTS
──────────────────────────────────────────────────────────────── */

/**
 * Example: Complete test suite for a User Service.
 */

/*
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';

describe('UserService', () => {
  // Setup
  let prisma: PrismaClient;
  let service: UserService;
  let userFactory: Factory<User, CreateUserDTO>;
  let authHelper: AuthHelper;

  beforeAll(async () => {
    prisma = await createTestPrismaClient();
    const repository = new UserRepository(prisma);
    service = new UserService(repository);
    authHelper = createAuthHelper(process.env.JWT_SECRET!);

    userFactory = createFactory<User, CreateUserDTO>(
      () => ({
        email: uniqueEmail(),
        name: `Test User ${randomString()}`,
        password: 'Password123!',
        role: 'user',
      }),
      async (data) => prisma.user.create({ data })
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await cleanTables(prisma, ['user']);
  });

  // Unit Tests
  describe('Unit Tests', () => {
    let mockRepo: MockRepository<User>;
    let unitService: UserService;

    beforeEach(() => {
      mockRepo = createMockRepository<User>();
      unitService = new UserService(mockRepo as any);
    });

    describe('findById', () => {
      it('returns user when found', async () => {
        const mockUser = { id: '1', email: 'test@example.com', name: 'Test' };
        mockRepo.findById.mockResolvedValue(mockUser as User);

        const result = await unitService.findById('1');

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockUser);
        expect(mockRepo.findById).toHaveBeenCalledWith('1');
      });

      it('returns error when not found', async () => {
        mockRepo.findById.mockResolvedValue(null);

        const result = await unitService.findById('nonexistent');

        expect(result.success).toBe(false);
        expect(result.error?.type).toBe('NOT_FOUND');
      });
    });

    describe('create', () => {
      it('creates user with valid data', async () => {
        const userData = userFactory.build();
        const createdUser = { id: '1', ...userData };
        mockRepo.create.mockResolvedValue(createdUser as User);
        mockRepo.findAll.mockResolvedValue([]); // No existing user

        const result = await unitService.create(userData);

        expect(result.success).toBe(true);
        expect(mockRepo.create).toHaveBeenCalledWith(userData);
      });
    });
  });

  // Integration Tests
  describe('Integration Tests', () => {
    describe('create', () => {
      it('creates user in database', async () => {
        const userData = userFactory.build();

        const result = await service.create(userData);

        expect(result.success).toBe(true);
        expect(result.data?.id).toBeDefined();

        // Verify in database
        const dbUser = await prisma.user.findUnique({
          where: { id: result.data?.id },
        });
        expect(dbUser).not.toBeNull();
        expect(dbUser?.email).toBe(userData.email);
      });

      it('prevents duplicate emails', async () => {
        const user = await userFactory.create();

        const result = await service.create({
          ...userFactory.build(),
          email: user.email,
        });

        expect(result.success).toBe(false);
        expect(result.error?.type).toBe('CONFLICT');
      });
    });

    describe('findPaginated', () => {
      it('returns paginated results', async () => {
        await userFactory.createMany(25);

        const result = await service.findPaginated({ page: 1, limit: 10 });

        expect(result.success).toBe(true);
        expect(result.data?.data).toHaveLength(10);
        expect(result.data?.meta.total).toBe(25);
        expect(result.data?.meta.totalPages).toBe(3);
      });
    });
  });

  // API Tests
  describe('API Tests', () => {
    let client: TestClient;
    let app: Express;

    beforeAll(async () => {
      app = await createApp(); // Your app factory
      client = createTestClient(app);
    });

    describe('GET /api/users/:id', () => {
      it('returns user for authenticated request', async () => {
        const user = await userFactory.create();
        const token = authHelper.createUserToken();

        const response = await client
          .get(`/api/users/${user.id}`)
          .auth(token)
          .expect(200);

        expectApiResponse(response).toBeSuccess();
        expectApiResponse(response).toHaveData<User>((data) => {
          expect(data.id).toBe(user.id);
          expect(data.email).toBe(user.email);
        });
      });

      it('returns 401 without authentication', async () => {
        const user = await userFactory.create();

        const response = await client
          .get(`/api/users/${user.id}`)
          .expect(401);

        expectApiResponse(response).toBeError('UNAUTHORIZED');
      });

      it('returns 404 for non-existent user', async () => {
        const token = authHelper.createUserToken();

        const response = await client
          .get('/api/users/nonexistent-id')
          .auth(token)
          .expect(404);

        expectApiResponse(response).toBeError('NOT_FOUND');
      });
    });

    describe('POST /api/users', () => {
      it('creates user with valid data', async () => {
        const token = authHelper.createAdminToken();
        const userData = userFactory.build();

        const response = await client
          .post('/api/users')
          .auth(token)
          .send(userData)
          .expect(201);

        expectApiResponse(response).toBeSuccess();
        expectApiResponse(response).toHaveData<User>((data) => {
          expect(data.email).toBe(userData.email);
        });
      });

      it('returns validation error for invalid email', async () => {
        const token = authHelper.createAdminToken();

        const response = await client
          .post('/api/users')
          .auth(token)
          .send({ ...userFactory.build(), email: 'invalid' })
          .expect(400);

        expect(response.body).toBeValidationError('email');
      });
    });
  });
});
*/
