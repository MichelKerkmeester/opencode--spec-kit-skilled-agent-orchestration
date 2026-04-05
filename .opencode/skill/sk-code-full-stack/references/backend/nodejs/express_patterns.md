---
title: Express Patterns - Route Organization and Middleware Design
description: Mandatory Express.js patterns for backend projects defining route organization, middleware design, request validation, response formatting, error handling, and authentication patterns.
---

# Express Patterns - Route Organization and Middleware Design

Mandatory Express.js patterns for backend projects defining route organization, middleware design, request validation, response formatting, error handling, and authentication patterns.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

- **Route consistency** - Uniform API endpoint organization across all modules
- **Middleware clarity** - Predictable request/response processing pipeline
- **Validation rigor** - Type-safe request validation with clear error messages
- **Response standardization** - Consistent API response formats
- **Security patterns** - Standardized authentication and authorization

### Progressive Disclosure

```
Level 1: This file (express_patterns.md)
         - Routes, middleware, validation, responses, auth
            |
Level 2: Related knowledge files
         |- nodejs_standards.md - Project structure and configuration
         |- async_patterns.md - Promise and async/await patterns
         +- testing_strategy.md - Integration testing with Supertest
```

### When to Use This File

- Creating new API endpoints
- Implementing middleware
- Setting up request validation
- Standardizing response formats
- Implementing authentication/authorization
- Reviewing Express code for patterns compliance

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:application-structure -->
## 2. APPLICATION STRUCTURE

### How Do I Bootstrap the Express App?

Create `src/app/app.ts`:

```typescript
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import { config } from '@/config';
import { requestLogger } from '@/middleware/request-logger';
import { errorHandler, notFoundHandler } from '@/middleware/error';
import { rateLimiter } from '@/middleware/rate-limiter';
import { routes } from '@/routes';

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: config.cors.origins,
    credentials: true,
  }));

  // Performance middleware
  app.use(compression());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use(requestLogger);

  // Rate limiting
  app.use(rateLimiter);

  // Health check (before auth)
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/v1', routes);

  // Error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
```

### How Do I Start the Server?

Create `src/app/server.ts`:

```typescript
import http from 'http';

import { config } from '@/config';
import { logger } from '@/utils/logger';
import { createApp } from './app';
import { gracefulShutdown } from './shutdown';

export async function startServer(): Promise<http.Server> {
  const app = createApp();
  const server = http.createServer(app);

  // Graceful shutdown handling
  gracefulShutdown(server);

  return new Promise((resolve) => {
    server.listen(config.server.port, config.server.host, () => {
      logger.info(
        { port: config.server.port, env: config.env.NODE_ENV },
        'Server started'
      );
      resolve(server);
    });
  });
}
```

### How Do I Implement Graceful Shutdown?

Create `src/app/shutdown.ts`:

```typescript
import http from 'http';

import { logger } from '@/utils/logger';
import { prisma } from '@/lib/prisma';

export function gracefulShutdown(server: http.Server): void {
  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutdown signal received');

    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await prisma.$disconnect();
        logger.info('Database connection closed');
        process.exit(0);
      } catch (error) {
        logger.error({ err: error }, 'Error during shutdown');
        process.exit(1);
      }
    });

    // Force shutdown after timeout
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
```

---

<!-- /ANCHOR:application-structure -->
<!-- ANCHOR:route-organization -->
## 3. ROUTE ORGANIZATION

### How Do I Structure Routes?

Create `src/routes/index.ts`:

```typescript
import { Router } from 'express';

import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { orderRoutes } from './order.routes';
import { productRoutes } from './product.routes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);

export { router as routes };
```

### How Do I Create Module Routes?

Create `src/routes/user.routes.ts`:

```typescript
import { Router } from 'express';

import { UserController } from '@/controllers/user.controller';
import { authenticate, authorize } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import {
  createUserSchema,
  updateUserSchema,
  getUserParamsSchema,
  listUsersQuerySchema,
} from '@/validation/user.validation';

const router = Router();
const controller = new UserController();

// Public routes
router.post(
  '/',
  validate({ body: createUserSchema }),
  controller.create
);

// Protected routes
router.use(authenticate);

router.get(
  '/',
  validate({ query: listUsersQuerySchema }),
  controller.list
);

router.get(
  '/:id',
  validate({ params: getUserParamsSchema }),
  controller.getById
);

router.patch(
  '/:id',
  validate({ params: getUserParamsSchema, body: updateUserSchema }),
  controller.update
);

router.delete(
  '/:id',
  authorize(['admin']),
  validate({ params: getUserParamsSchema }),
  controller.delete
);

export { router as userRoutes };
```

### Route Naming Conventions

| HTTP Method | Route Pattern            | Action     | Controller Method |
| ----------- | ------------------------ | ---------- | ----------------- |
| GET         | `/resources`             | List all   | `list`            |
| GET         | `/resources/:id`         | Get one    | `getById`         |
| POST        | `/resources`             | Create     | `create`          |
| PUT         | `/resources/:id`         | Replace    | `replace`         |
| PATCH       | `/resources/:id`         | Update     | `update`          |
| DELETE      | `/resources/:id`         | Delete     | `delete`          |
| GET         | `/resources/:id/children`| Nested list| `listChildren`    |
| POST        | `/resources/:id/actions` | Custom     | `performAction`   |

### Route Parameter Standards

```typescript
// Good - consistent parameter naming
router.get('/users/:userId', ...);
router.get('/users/:userId/orders/:orderId', ...);
router.get('/organizations/:orgId/members/:memberId', ...);

// Bad - inconsistent naming
router.get('/users/:id', ...);
router.get('/users/:user_id/orders/:order', ...);
```

---

<!-- /ANCHOR:route-organization -->
<!-- ANCHOR:controller-patterns -->
## 4. CONTROLLER PATTERNS

### How Do I Structure Controllers?

Create `src/controllers/user.controller.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

import { UserService } from '@/services/user.service';
import { createChildLogger } from '@/utils/logger';
import { sendSuccess, sendCreated, sendNoContent } from '@/utils/response';
import type {
  CreateUserBody,
  UpdateUserBody,
  GetUserParams,
  ListUsersQuery,
} from '@/validation/user.validation';

const log = createChildLogger('UserController');

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = async (
    req: Request<unknown, unknown, CreateUserBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.userService.create(req.body);
      sendCreated(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: Request<unknown, unknown, unknown, ListUsersQuery>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.userService.list(req.query);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request<GetUserParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.userService.getById(req.params.id);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request<GetUserParams, unknown, UpdateUserBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.userService.update(req.params.id, req.body);
      sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request<GetUserParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.userService.delete(req.params.id);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  };
}
```

### Controller Patterns

**Key Principles:**

1. **Arrow functions as methods** - Preserves `this` context when used as route handlers
2. **Delegate to services** - Controllers only handle HTTP concerns
3. **Forward errors to middleware** - Use `next(error)` for error handling
4. **Type request parameters** - Use generics for type-safe requests

---

<!-- /ANCHOR:controller-patterns -->
<!-- ANCHOR:middleware-patterns -->
## 5. MIDDLEWARE PATTERNS

### What Is the Middleware Execution Order?

```
Request → Security → Body Parsing → Logging → Rate Limiting
    → Authentication → Authorization → Validation → Controller
        → Response Formatting → Error Handling → Response
```

### How Do I Create Middleware?

Standard middleware signature:

```typescript
import { Request, Response, NextFunction } from 'express';

export function myMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Middleware logic
  next();
}

// Async middleware
export async function asyncMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await someAsyncOperation();
    next();
  } catch (error) {
    next(error);
  }
}

// Configurable middleware (factory pattern)
export function configurableMiddleware(options: MiddlewareOptions) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Use options
    next();
  };
}
```

### Request Context Extension

Create `src/types/express.d.ts`:

```typescript
import { User } from '@/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      requestId?: string;
      startTime?: number;
    }
  }
}

export {};
```

### Common Middleware Implementations

**Request ID Middleware:**

```typescript
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = req.headers['x-request-id'] as string || randomUUID();
  req.requestId = id;
  res.setHeader('x-request-id', id);
  next();
}
```

**Timing Middleware:**

```typescript
import { Request, Response, NextFunction } from 'express';

export function timing(req: Request, res: Response, next: NextFunction): void {
  req.startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - (req.startTime ?? 0);
    res.setHeader('x-response-time', `${duration}ms`);
  });

  next();
}
```

**Async Handler Wrapper:**

```typescript
import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export function asyncHandler(fn: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
router.get('/users', asyncHandler(async (req, res) => {
  const users = await userService.list();
  res.json(users);
}));
```

---

<!-- /ANCHOR:middleware-patterns -->
<!-- ANCHOR:request-validation -->
## 6. REQUEST VALIDATION

### What Validation Library Should I Use?

Use **Zod** for schema validation:

```bash
npm install zod
```

### How Do I Create Validation Schemas?

Create `src/validation/user.validation.ts`:

```typescript
import { z } from 'zod';

// Reusable schemas
const emailSchema = z.string().email('Invalid email format').toLowerCase().trim();
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number');

const uuidSchema = z.string().uuid('Invalid ID format');

// Request schemas
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2).max(100).trim(),
  role: z.enum(['user', 'admin']).default('user'),
});

export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  name: z.string().min(2).max(100).trim().optional(),
  role: z.enum(['user', 'admin']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const getUserParamsSchema = z.object({
  id: uuidSchema,
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
  sortBy: z.enum(['createdAt', 'name', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Infer types from schemas
export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UpdateUserBody = z.infer<typeof updateUserSchema>;
export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
```

### How Do I Create Validation Middleware?

Create `src/middleware/validation.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

import { ValidationError, ErrorDetails } from '@/utils/errors';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

function formatZodErrors(error: ZodError): ErrorDetails[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));
}

export function validate(schemas: ValidationSchemas) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError(formatZodErrors(error)));
      } else {
        next(error);
      }
    }
  };
}
```

### Complex Validation Patterns

**Conditional validation:**

```typescript
const createOrderSchema = z.object({
  type: z.enum(['delivery', 'pickup']),
  address: z.string().optional(),
  pickupTime: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (data.type === 'delivery') return !!data.address;
    if (data.type === 'pickup') return !!data.pickupTime;
    return true;
  },
  {
    message: 'Delivery requires address, pickup requires pickupTime',
  }
);
```

**Array validation:**

```typescript
const bulkCreateSchema = z.object({
  items: z
    .array(createUserSchema)
    .min(1, 'At least one item required')
    .max(100, 'Maximum 100 items allowed'),
});
```

**File upload validation:**

```typescript
const uploadSchema = z.object({
  file: z.object({
    mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp']),
    size: z.number().max(5 * 1024 * 1024, 'File too large (max 5MB)'),
  }),
});
```

---

<!-- /ANCHOR:request-validation -->
<!-- ANCHOR:response-formatting -->
## 7. RESPONSE FORMATTING

### What Is the Standard Response Format?

**Success Response:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "meta": {
    "pagination": { ... }
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### How Do I Create Response Helpers?

Create `src/utils/response.ts`:

```typescript
import { Response } from 'express';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message?: string): void {
  sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  }
): void {
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const response: ApiResponse<T[]> = {
    success: true,
    data,
    meta: {
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    },
  };

  res.status(200).json(response);
}
```

### Controller Usage

```typescript
export class UserController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit } = req.query as ListUsersQuery;
      const { users, total } = await this.userService.list(req.query);

      sendPaginated(res, users, { page, limit, total });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.create(req.body);
      sendCreated(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  };
}
```

---

<!-- /ANCHOR:response-formatting -->
<!-- ANCHOR:error-handling-middleware -->
## 8. ERROR HANDLING MIDDLEWARE

### How Do I Create Error Handling Middleware?

Create `src/middleware/error.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

import { AppError, ErrorCode, NotFoundError } from '@/utils/errors';
import { createChildLogger } from '@/utils/logger';
import { config } from '@/config';

const log = createChildLogger('ErrorHandler');

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
    stack?: string;
  };
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.path}`));
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  log.error(
    {
      err: error,
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      userId: req.user?.id,
      requestId: req.requestId,
    },
    'Request error'
  );

  // Determine if this is an operational error
  const isOperational = error instanceof AppError && error.isOperational;

  // Build response
  const response: ErrorResponse = {
    success: false,
    error: {
      code: error instanceof AppError ? error.code : ErrorCode.INTERNAL_ERROR,
      message: isOperational ? error.message : 'An unexpected error occurred',
    },
  };

  // Add details for validation errors
  if (error instanceof AppError && error.details) {
    response.error.details = error.details;
  }

  // Add stack trace in development
  if (config.isDevelopment && error.stack) {
    response.error.stack = error.stack;
  }

  // Set status code
  const statusCode = error instanceof AppError ? error.statusCode : 500;

  res.status(statusCode).json(response);
}
```

### Specialized Error Handlers

**Prisma Error Handler:**

```typescript
import { Prisma } from '@prisma/client';
import { ConflictError, NotFoundError, DatabaseError } from '@/utils/errors';

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictError('Resource already exists');
      case 'P2025':
        throw new NotFoundError('Resource');
      case 'P2003':
        throw new ConflictError('Foreign key constraint failed');
      default:
        throw new DatabaseError(`Database error: ${error.code}`);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new DatabaseError('Invalid database query');
  }

  throw error;
}
```

**JWT Error Handler:**

```typescript
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UnauthorizedError } from '@/utils/errors';

export function handleJwtError(error: unknown): never {
  if (error instanceof TokenExpiredError) {
    throw new UnauthorizedError('Token has expired');
  }

  if (error instanceof JsonWebTokenError) {
    throw new UnauthorizedError('Invalid token');
  }

  throw error;
}
```

---

<!-- /ANCHOR:error-handling-middleware -->
<!-- ANCHOR:authentication-patterns -->
## 9. AUTHENTICATION PATTERNS

### How Do I Implement JWT Authentication?

Create `src/middleware/auth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '@/config';
import { UnauthorizedError, ForbiddenError } from '@/utils/errors';
import { UserService } from '@/services/user.service';
import type { User } from '@/models/user.model';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const userService = new UserService();

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;

    const user = await userService.getById(payload.sub);
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
}

export function authorize(allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  authenticate(req, _res, next);
}
```

### How Do I Generate Tokens?

Create `src/services/auth.service.ts`:

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { config } from '@/config';
import { UnauthorizedError } from '@/utils/errors';
import { UserRepository } from '@/repositories/user.repository';
import type { User } from '@/models/user.model';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = jwt.verify(refreshToken, config.jwt.secret) as {
        sub: string;
        type: string;
      };

      if (payload.type !== 'refresh') {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  private generateTokens(user: User): TokenPair {
    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      {
        sub: user.id,
        type: 'refresh',
      },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400, // 24 hours in seconds
    };
  }
}
```

### Resource-Based Authorization

```typescript
export function authorizeResource(
  getResourceOwnerId: (req: Request) => Promise<string>
) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      // Admins can access any resource
      if (req.user.role === 'admin') {
        return next();
      }

      const ownerId = await getResourceOwnerId(req);

      if (ownerId !== req.user.id) {
        throw new ForbiddenError('Not authorized to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

// Usage
router.patch(
  '/orders/:id',
  authenticate,
  authorizeResource(async (req) => {
    const order = await orderService.getById(req.params.id);
    return order.userId;
  }),
  controller.update
);
```

---

<!-- /ANCHOR:authentication-patterns -->
<!-- ANCHOR:rate-limiting -->
## 10. RATE LIMITING

### How Do I Implement Rate Limiting?

```bash
npm install express-rate-limit
```

Create `src/middleware/rate-limiter.ts`:

```typescript
import rateLimit from 'express-rate-limit';

import { config } from '@/config';
import { AppError, ErrorCode } from '@/utils/errors';

// General API rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(
      new AppError('Too many requests', ErrorCode.RATE_LIMITED, 429)
    );
  },
  skip: () => config.isTest, // Skip in tests
});

// Strict rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(
      new AppError('Too many login attempts', ErrorCode.RATE_LIMITED, 429)
    );
  },
  keyGenerator: (req) => req.body?.email || req.ip,
});

// Upload rate limiter
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

<!-- /ANCHOR:rate-limiting -->
<!-- ANCHOR:cors-configuration -->
## 11. CORS CONFIGURATION

### How Do I Configure CORS?

```typescript
import cors from 'cors';
import { config } from '@/config';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (config.cors.origins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID', 'X-Response-Time'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
```

---

<!-- /ANCHOR:cors-configuration -->
<!-- ANCHOR:rules -->
## 12. RULES

### ✅ ALWAYS

1. **Use arrow functions for controller methods** - Preserves `this` binding
2. **Validate all request inputs** - Use Zod schemas for body, query, params
3. **Forward errors with next()** - Let error middleware handle responses
4. **Use typed request generics** - `Request<Params, ResBody, ReqBody, Query>`
5. **Apply authentication before authorization** - Logical middleware order
6. **Return consistent response format** - Use response helper functions
7. **Log requests with context** - Include requestId, userId, timing
8. **Implement graceful shutdown** - Close connections properly
9. **Use rate limiting** - Protect endpoints from abuse
10. **Separate routes by domain** - One route file per resource
11. **Keep controllers thin** - Delegate logic to services
12. **Type infer from Zod schemas** - Use `z.infer<typeof schema>` for types

### ❌ NEVER

1. **Send raw errors to client** - Always sanitize error responses
2. **Use `async` without try/catch** - Or use asyncHandler wrapper
3. **Put business logic in middleware** - Middleware handles cross-cutting concerns
4. **Skip validation on internal routes** - All endpoints need validation
5. **Return different response formats** - Consistency is critical
6. **Use `res.send()` for JSON** - Use `res.json()` with response helpers
7. **Expose stack traces in production** - Only show in development
8. **Hardcode CORS origins** - Use environment configuration
9. **Skip rate limiting on auth routes** - These are most vulnerable
10. **Use synchronous operations in handlers** - Everything should be async
11. **Throw errors in middleware without next()** - Always forward to error handler
12. **Mix authentication methods** - One consistent auth strategy

### ⚠️ ESCALATE IF

1. **New middleware pattern needed** - Consult team before introducing
2. **Authentication strategy change** - Run `sk-code-review` baseline before approval
3. **Rate limiting adjustment** - Balance UX and protection
4. **CORS policy modification** - Run `sk-code-review` baseline and get security-team approval
5. **Response format changes** - API versioning considerations
6. **Error code additions** - Document in API specification

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 13. RELATED RESOURCES

| File                                         | Purpose                                     |
| -------------------------------------------- | ------------------------------------------- |
| [nodejs_standards.md](./nodejs_standards.md) | Project structure and configuration         |
| [async_patterns.md](./async_patterns.md)     | Promise and async/await best practices      |
| [testing_strategy.md](./testing_strategy.md) | Integration testing with Supertest          |
<!-- /ANCHOR:related-resources -->
