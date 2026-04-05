---
title: Node.js Code Standards - Backend System Coding Conventions
description: Mandatory Node.js/TypeScript coding conventions for backend projects defining project structure, configuration, logging, error handling, and code organization standards.
---

# 📘 Node.js Code Standards - Backend System Coding Conventions

Mandatory Node.js/TypeScript coding conventions for backend projects defining project structure, configuration, logging, error handling, and code organization standards.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

- **Structural consistency** - Uniform project organization across all services
- **Type safety** - TypeScript-first development with strict configuration
- **Configuration clarity** - Environment-based settings with validation
- **Observability** - Structured logging and error tracking
- **Maintainability** - Predictable patterns for long-term code health

### Progressive Disclosure

```
Level 1: This file (nodejs_standards.md)
         - Project structure, TypeScript, ESLint, logging, errors
            |
Level 2: Related knowledge files
         |- express_patterns.md - Route organization and middleware
         |- async_patterns.md - Promise and async/await patterns
         +- testing_strategy.md - Jest configuration and test patterns
```

### When to Use This File

- Setting up a new Node.js/Express project
- Configuring TypeScript, ESLint, or Prettier
- Implementing logging or error handling
- Reviewing code for standards compliance
- Onboarding to a Node.js codebase

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:project-structure -->
## 2. PROJECT STRUCTURE

### How Is the Project Organized?

The backend follows a layered architecture with clear separation between application entry points, domain logic, infrastructure, and shared utilities.

### Root Directory Structure

```
project/
|- src/                      # Source code
|   |- app/                  # Application bootstrap
|   |   |- app.ts           # Express app configuration
|   |   +- server.ts        # HTTP server entry point
|   |- config/              # Configuration management
|   |   |- index.ts         # Config aggregator
|   |   |- database.ts      # Database config
|   |   |- auth.ts          # Auth config
|   |   +- env.ts           # Environment validation
|   |- controllers/         # HTTP request handlers
|   |   |- users/           # User-related controllers
|   |   |- orders/          # Order-related controllers
|   |   +- index.ts         # Controller aggregator
|   |- services/            # Business logic layer
|   |   |- users/           # User services
|   |   |- orders/          # Order services
|   |   +- index.ts         # Service aggregator
|   |- repositories/        # Data access layer
|   |   |- users/           # User repositories
|   |   |- orders/          # Order repositories
|   |   +- index.ts         # Repository aggregator
|   |- models/              # Database models/entities
|   |   |- user.model.ts    # User entity
|   |   |- order.model.ts   # Order entity
|   |   +- index.ts         # Model exports
|   |- middleware/          # Express middleware
|   |   |- auth.ts          # Authentication middleware
|   |   |- validation.ts    # Request validation
|   |   |- error.ts         # Error handling middleware
|   |   +- index.ts         # Middleware aggregator
|   |- routes/              # Route definitions
|   |   |- users.routes.ts  # User routes
|   |   |- orders.routes.ts # Order routes
|   |   +- index.ts         # Route aggregator
|   |- types/               # TypeScript type definitions
|   |   |- express.d.ts     # Express type extensions
|   |   |- api.types.ts     # API request/response types
|   |   +- index.ts         # Type exports
|   |- utils/               # Utility functions
|   |   |- logger.ts        # Logging utility
|   |   |- crypto.ts        # Cryptographic helpers
|   |   +- index.ts         # Utility exports
|   +- index.ts             # Application entry point
|- tests/                    # Test files
|   |- unit/                # Unit tests
|   |- integration/         # Integration tests
|   |- e2e/                 # End-to-end tests
|   |- fixtures/            # Test fixtures
|   +- setup.ts             # Test setup
|- prisma/                   # Prisma ORM (if used)
|   |- schema.prisma        # Database schema
|   +- migrations/          # Database migrations
|- scripts/                  # Build/utility scripts
|- docs/                     # Documentation
|- .env.example              # Environment template
|- .eslintrc.js              # ESLint configuration
|- .prettierrc               # Prettier configuration
|- tsconfig.json             # TypeScript configuration
|- jest.config.js            # Jest configuration
+- package.json              # Dependencies and scripts
```

### How Do I Create a New Module?

Each feature module follows this layered structure:

```
src/{module}/
|- {module}.controller.ts    # HTTP handlers
|- {module}.service.ts       # Business logic
|- {module}.repository.ts    # Data access
|- {module}.model.ts         # Database model
|- {module}.types.ts         # Module-specific types
|- {module}.routes.ts        # Route definitions
|- {module}.validation.ts    # Request validation schemas
+- index.ts                  # Module exports
```

**Example**: `src/users/`

### Alternative: Domain-Driven Structure

For larger projects, organize by domain:

```
src/
|- domains/
|   |- users/
|   |   |- application/      # Use cases/services
|   |   |- domain/           # Entities, value objects
|   |   |- infrastructure/   # Repositories, adapters
|   |   +- presentation/     # Controllers, routes
|   |- orders/
|   |   |- application/
|   |   |- domain/
|   |   |- infrastructure/
|   |   +- presentation/
|   +- shared/               # Shared domain logic
|- infrastructure/           # Cross-cutting infrastructure
|   |- database/
|   |- cache/
|   +- messaging/
+- shared/                   # Shared utilities
```

### What Modules Exist in a Typical Codebase?

| Module          | Description                    | Has Service | Has Repository |
| --------------- | ------------------------------ | ----------- | -------------- |
| `users`         | User management                | Yes         | Yes            |
| `auth`          | Authentication & authorization | Yes         | No             |
| `orders`        | Order lifecycle management     | Yes         | Yes            |
| `products`      | Product catalog                | Yes         | Yes            |
| `payments`      | Payment processing             | Yes         | Yes            |
| `notifications` | Email/push notifications       | Yes         | No             |
| `uploads`       | File upload handling           | Yes         | Yes            |
| `analytics`     | Event tracking                 | Yes         | Yes            |

---

<!-- /ANCHOR:project-structure -->
<!-- ANCHOR:typescript-configuration -->
## 3. TYPESCRIPT CONFIGURATION

### What Is the Recommended tsconfig.json?

```json
{
  "compilerOptions": {
    // Target and Module
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],

    // Output
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    // Strict Type Checking
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,

    // Additional Checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,

    // Module Resolution
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    // Path Aliases
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@controllers/*": ["src/controllers/*"],
      "@services/*": ["src/services/*"],
      "@repositories/*": ["src/repositories/*"],
      "@models/*": ["src/models/*"],
      "@middleware/*": ["src/middleware/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    },

    // Emit
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Why These Settings?

| Setting                        | Purpose                                 |
| ------------------------------ | --------------------------------------- |
| `strict: true`                 | Enables all strict type-checking        |
| `noUncheckedIndexedAccess`     | Adds undefined to index signature types |
| `useUnknownInCatchVariables`   | Catches are `unknown`, not `any`        |
| `noImplicitReturns`            | All code paths must return              |
| `isolatedModules`              | Required for modern bundlers            |
| `incremental`                  | Faster rebuilds                         |

### How Do I Configure Path Aliases?

1. Add paths to `tsconfig.json` (shown above)
2. For runtime resolution, use `tsconfig-paths`:

```bash
npm install -D tsconfig-paths
```

3. Add to `package.json`:

```json
{
  "scripts": {
    "dev": "ts-node -r tsconfig-paths/register src/index.ts",
    "build": "tsc && tsc-alias"
  }
}
```

4. Or use `tsc-alias` for compilation:

```bash
npm install -D tsc-alias
```

---

<!-- /ANCHOR:typescript-configuration -->
<!-- ANCHOR:eslint-configuration -->
## 4. ESLINT CONFIGURATION

### What Is the Recommended ESLint Setup?

Install dependencies:

```bash
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-config-prettier eslint-plugin-import eslint-plugin-promise
```

### .eslintrc.js Configuration

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'promise'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'prettier',
  ],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    // TypeScript specific
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
      { selector: 'typeAlias', format: ['PascalCase'] },
      { selector: 'enum', format: ['PascalCase'] },
      { selector: 'enumMember', format: ['UPPER_CASE'] },
    ],

    // Import organization
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',

    // Promise handling
    'promise/always-return': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-nesting': 'warn',

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-return-await': 'off',
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  ignorePatterns: ['dist', 'node_modules', '*.js'],
};
```

---

<!-- /ANCHOR:eslint-configuration -->
<!-- ANCHOR:prettier-configuration -->
## 5. PRETTIER CONFIGURATION

### What Is the Recommended Prettier Setup?

```bash
npm install -D prettier
```

### .prettierrc Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### .prettierignore Configuration

```
dist
node_modules
coverage
*.md
*.json
```

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\""
  }
}
```

---

<!-- /ANCHOR:prettier-configuration -->
<!-- ANCHOR:environment-management -->
## 6. ENVIRONMENT MANAGEMENT

### How Do I Structure Environment Configuration?

Create `src/config/env.ts`:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),

  // Redis
  REDIS_URL: z.string().url().optional(),

  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1d'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  // External Services
  SENDGRID_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Environment validation failed:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return parsed.data;
}

export const env = validateEnv();

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
```

### How Do I Create Module-Specific Configs?

Create `src/config/database.ts`:

```typescript
import { env } from './env';

export const databaseConfig = {
  url: env.DATABASE_URL,
  pool: {
    min: env.DATABASE_POOL_MIN,
    max: env.DATABASE_POOL_MAX,
  },
  logging: env.NODE_ENV === 'development',
} as const;
```

Create `src/config/index.ts`:

```typescript
import { databaseConfig } from './database';
import { env, isProduction, isDevelopment, isTest } from './env';

export const config = {
  env,
  isProduction,
  isDevelopment,
  isTest,
  database: databaseConfig,
  server: {
    port: env.PORT,
    host: env.HOST,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  },
  logging: {
    level: env.LOG_LEVEL,
    format: env.LOG_FORMAT,
  },
} as const;

export type Config = typeof config;
```

### .env.example Template

```bash
# Application
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

# External Services (optional)
SENDGRID_API_KEY=
STRIPE_SECRET_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# Logging
LOG_LEVEL=info
LOG_FORMAT=pretty
```

---

<!-- /ANCHOR:environment-management -->
<!-- ANCHOR:logging-standards -->
## 7. LOGGING STANDARDS

### What Logging Library Should I Use?

Use **Pino** for high-performance structured logging:

```bash
npm install pino pino-pretty
```

### How Do I Configure the Logger?

Create `src/utils/logger.ts`:

```typescript
import pino, { Logger, LoggerOptions } from 'pino';

import { config } from '@/config';

const baseOptions: LoggerOptions = {
  level: config.logging.level,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => ({
      pid: bindings.pid,
      hostname: bindings.hostname,
      service: 'my-service',
      version: process.env.npm_package_version,
    }),
  },
  redact: {
    paths: ['password', 'secret', 'token', 'authorization', '*.password', '*.secret'],
    censor: '[REDACTED]',
  },
};

const devOptions: LoggerOptions = {
  ...baseOptions,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
};

const prodOptions: LoggerOptions = {
  ...baseOptions,
};

export const logger: Logger = pino(config.isProduction ? prodOptions : devOptions);

export function createChildLogger(module: string): Logger {
  return logger.child({ module });
}
```

### How Do I Use the Logger?

```typescript
import { createChildLogger } from '@/utils/logger';

const log = createChildLogger('UserService');

// Basic logging
log.info('User created successfully');
log.warn('Rate limit approaching');
log.error('Failed to create user');

// With context
log.info({ userId: '123', action: 'create' }, 'User created');

// With error
try {
  await createUser(data);
} catch (error) {
  log.error({ err: error, userId: data.id }, 'Failed to create user');
  throw error;
}

// Request logging (in middleware)
log.info(
  {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${duration}ms`,
  },
  'Request completed'
);
```

### Logging Levels

| Level   | When to Use                              |
| ------- | ---------------------------------------- |
| `fatal` | App is about to crash                    |
| `error` | Error occurred, operation failed         |
| `warn`  | Unexpected but recoverable               |
| `info`  | Significant events (startup, requests)   |
| `debug` | Detailed information for debugging       |
| `trace` | Very detailed tracing (rarely used)      |

### Request Logging Middleware

```typescript
import { Request, Response, NextFunction } from 'express';
import { createChildLogger } from '@/utils/logger';

const log = createChildLogger('HTTP');

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: duration,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      userId: req.user?.id,
    };

    if (res.statusCode >= 500) {
      log.error(logData, 'Request failed');
    } else if (res.statusCode >= 400) {
      log.warn(logData, 'Request error');
    } else {
      log.info(logData, 'Request completed');
    }
  });

  next();
}
```

---

<!-- /ANCHOR:logging-standards -->
<!-- ANCHOR:error-handling-conventions -->
## 8. ERROR HANDLING CONVENTIONS

### How Do I Define Custom Errors?

Create `src/utils/errors.ts`:

```typescript
export enum ErrorCode {
  // Client Errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',

  // Server Errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

export interface ErrorDetails {
  field?: string;
  message: string;
  code?: string;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: ErrorDetails[];

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    details?: ErrorDetails[],
    isOperational = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON(): Record<string, unknown> {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

// Factory functions for common errors
export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: ErrorDetails[]) {
    super(message, ErrorCode.BAD_REQUEST, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, ErrorCode.UNAUTHORIZED, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, ErrorCode.FORBIDDEN, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, ErrorCode.NOT_FOUND, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, ErrorCode.CONFLICT, 409);
  }
}

export class ValidationError extends AppError {
  constructor(details: ErrorDetails[]) {
    super('Validation failed', ErrorCode.VALIDATION_ERROR, 422, details);
  }
}

export class InternalError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, ErrorCode.INTERNAL_ERROR, 500, undefined, false);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, ErrorCode.DATABASE_ERROR, 500, undefined, false);
  }
}
```

### How Do I Wrap Errors with Context?

```typescript
import { createChildLogger } from '@/utils/logger';
import { DatabaseError, NotFoundError } from '@/utils/errors';

const log = createChildLogger('UserRepository');

export async function findById(id: string): Promise<User> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    log.error({ err: error, userId: id }, 'Database error finding user');
    throw new DatabaseError(`Failed to find user: ${(error as Error).message}`);
  }
}
```

### How Do I Handle Errors in Services?

```typescript
import { createChildLogger } from '@/utils/logger';
import { ConflictError, ValidationError } from '@/utils/errors';

const log = createChildLogger('UserService');

export async function createUser(data: CreateUserDTO): Promise<User> {
  log.debug({ email: data.email }, 'Creating user');

  // Check for existing user
  const existing = await userRepository.findByEmail(data.email);
  if (existing) {
    throw new ConflictError('User with this email already exists');
  }

  // Validate business rules
  if (!isValidEmail(data.email)) {
    throw new ValidationError([
      { field: 'email', message: 'Invalid email format' },
    ]);
  }

  try {
    const user = await userRepository.create(data);
    log.info({ userId: user.id }, 'User created successfully');
    return user;
  } catch (error) {
    log.error({ err: error, email: data.email }, 'Failed to create user');
    throw error;
  }
}
```

---

<!-- /ANCHOR:error-handling-conventions -->
<!-- ANCHOR:naming-conventions -->
## 9. NAMING CONVENTIONS

### What Are the File Naming Rules?

| Type         | Convention              | Example                                     |
| ------------ | ----------------------- | ------------------------------------------- |
| General      | `kebab-case.ts`         | `user-service.ts`, `order-repository.ts`    |
| Controllers  | `*.controller.ts`       | `user.controller.ts`                        |
| Services     | `*.service.ts`          | `user.service.ts`                           |
| Repositories | `*.repository.ts`       | `user.repository.ts`                        |
| Models       | `*.model.ts`            | `user.model.ts`                             |
| Types        | `*.types.ts`            | `user.types.ts`, `api.types.ts`             |
| Middleware   | `*.middleware.ts`       | `auth.middleware.ts`                        |
| Validation   | `*.validation.ts`       | `user.validation.ts`                        |
| Routes       | `*.routes.ts`           | `user.routes.ts`                            |
| Tests        | `*.test.ts`, `*.spec.ts`| `user.service.test.ts`                      |
| Config       | `*.config.ts`           | `database.config.ts`                        |

### What Are the Variable & Function Naming Rules?

| Type               | Rule         | Example                                 |
| ------------------ | ------------ | --------------------------------------- |
| Variables          | `camelCase`  | `userId`, `orderItems`                  |
| Constants          | `UPPER_CASE` | `MAX_RETRIES`, `DEFAULT_PAGE_SIZE`      |
| Functions          | `camelCase`  | `createUser()`, `findById()`            |
| Async functions    | `camelCase`  | `async fetchUser()`, `async saveOrder()`|
| Boolean variables  | `is/has/can` | `isActive`, `hasPermission`, `canEdit`  |
| Event handlers     | `on/handle`  | `onUserCreated`, `handleError`          |

### What Are the Type & Interface Naming Rules?

| Type          | Convention                | Example                              |
| ------------- | ------------------------- | ------------------------------------ |
| Interfaces    | `I` prefix (optional)     | `IUserService`, `IOrderRepository`   |
| Type aliases  | `PascalCase`              | `UserId`, `OrderStatus`              |
| Enums         | `PascalCase`              | `UserRole`, `OrderStatus`            |
| Enum members  | `UPPER_CASE`              | `UserRole.ADMIN`, `Status.PENDING`   |
| DTOs          | `*DTO` suffix             | `CreateUserDTO`, `UpdateOrderDTO`    |
| Request types | `*Request`                | `CreateUserRequest`                  |
| Response types| `*Response`               | `UserResponse`, `PaginatedResponse`  |
| Classes       | `PascalCase`              | `UserService`, `OrderRepository`     |

---

<!-- /ANCHOR:naming-conventions -->
<!-- ANCHOR:import-organization -->
## 10. IMPORT ORGANIZATION

### How Should I Organize Imports?

Group imports in this order with blank lines between groups:

```typescript
// 1. Node.js built-in modules
import { readFile } from 'fs/promises';
import path from 'path';

// 2. External dependencies (npm packages)
import express from 'express';
import { z } from 'zod';

// 3. Internal aliases (@/ paths)
import { config } from '@/config';
import { logger } from '@/utils/logger';

// 4. Relative imports - parent directories
import { BaseService } from '../base.service';

// 5. Relative imports - sibling/child
import { UserDTO } from './user.dto';
import { userValidation } from './user.validation';

// 6. Type-only imports (last)
import type { User } from '@/models/user.model';
import type { Request, Response } from 'express';
```

### ESLint Import Order Rule

The ESLint configuration above enforces this order automatically.

---

<!-- /ANCHOR:import-organization -->
<!-- ANCHOR:rules -->
## 11. RULES

### ✅ ALWAYS

1. **Use TypeScript strict mode** - Enable all strict checks in tsconfig.json
2. **Validate environment variables** - Use Zod schema on startup
3. **Use structured logging** - JSON format with context objects
4. **Create custom error classes** - Extend AppError with specific types
5. **Add type annotations** - Explicit return types on all functions
6. **Use path aliases** - `@/` prefix for clean imports
7. **Handle all promise rejections** - No floating promises
8. **Log errors with context** - Include relevant data for debugging
9. **Redact sensitive data** - Configure logger to hide passwords/tokens
10. **Use const assertions** - `as const` for configuration objects
11. **Separate concerns** - Controllers, services, repositories in separate files
12. **Export types separately** - Use `export type` for type-only exports

### ❌ NEVER

1. **Use `any` type** - Use `unknown` and narrow with type guards
2. **Ignore TypeScript errors** - Fix or properly suppress with comment
3. **Use `console.log`** - Use the structured logger
4. **Commit `.env` files** - Only commit `.env.example`
5. **Hardcode configuration** - Use environment variables
6. **Swallow errors silently** - Always log or rethrow
7. **Use synchronous file operations** - Use async/promises
8. **Mix business logic in controllers** - Keep controllers thin
9. **Use relative paths across modules** - Use `@/` aliases
10. **Skip error handling** - Every async operation needs try/catch or .catch()
11. **Use `require()`** - Use ES module imports
12. **Disable ESLint rules globally** - Fix the code or disable per-line

### ⚠️ ESCALATE IF

1. **New pattern needed** - Consult team before introducing new conventions
2. **Major dependency upgrade** - Run `sk-code-review` baseline before approval
3. **Security configuration** - Run `sk-code-review` baseline + security checklist before approval
4. **Performance concerns** - When logging or validation impacts latency
5. **Schema changes** - Database migrations need team approval
6. **Third-party integration** - New external service dependencies

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

| File                                         | Purpose                                     |
| -------------------------------------------- | ------------------------------------------- |
| [express_patterns.md](./express_patterns.md) | Route organization and middleware patterns  |
| [async_patterns.md](./async_patterns.md)     | Promise and async/await best practices      |
| [testing_strategy.md](./testing_strategy.md) | Jest configuration and test patterns        |
<!-- /ANCHOR:related-resources -->
