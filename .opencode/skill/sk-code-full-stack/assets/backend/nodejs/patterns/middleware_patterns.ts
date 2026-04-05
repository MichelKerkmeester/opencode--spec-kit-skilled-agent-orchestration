/* ─────────────────────────────────────────────────────────────
   MIDDLEWARE PATTERNS
   Express/Fastify Middleware Templates for Node.js HTTP Frameworks

   PURPOSE: Reusable middleware patterns for Node.js HTTP frameworks
   PATTERNS: Authentication, Error Handling, Validation, Rate Limiting, Logging
   COMPATIBLE WITH: Express, Fastify, Koa (with minor adaptations)
──────────────────────────────────────────────────────────────── */

import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';

/* ─────────────────────────────────────────────────────────────
   1. TYPE DEFINITIONS
──────────────────────────────────────────────────────────────── */

/**
 * Extended Express Request with common additions.
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions?: string[];
  };
  requestId?: string;
  startTime?: number;
}

/**
 * JWT payload structure.
 */
export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  permissions?: string[];
  iat: number;
  exp: number;
}

/**
 * HTTP error with status code.
 */
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'HttpError';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: Record<string, unknown>): HttpError {
    return new HttpError(400, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized'): HttpError {
    return new HttpError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden'): HttpError {
    return new HttpError(403, message, 'FORBIDDEN');
  }

  static notFound(resource = 'Resource'): HttpError {
    return new HttpError(404, `${resource} not found`, 'NOT_FOUND');
  }

  static conflict(message: string): HttpError {
    return new HttpError(409, message, 'CONFLICT');
  }

  static tooManyRequests(message = 'Too many requests'): HttpError {
    return new HttpError(429, message, 'RATE_LIMITED');
  }

  static internal(message = 'Internal server error'): HttpError {
    return new HttpError(500, message, 'INTERNAL_ERROR');
  }

  toJSON(): Record<string, unknown> {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
      },
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   2. AUTHENTICATION MIDDLEWARE
──────────────────────────────────────────────────────────────── */

import jwt from 'jsonwebtoken';

/**
 * JWT authentication configuration.
 */
export interface AuthConfig {
  secret: string;
  issuer?: string;
  audience?: string;
  algorithms?: jwt.Algorithm[];
}

/**
 * Create JWT authentication middleware.
 *
 * @example
 * ```typescript
 * const auth = createAuthMiddleware({
 *   secret: process.env.JWT_SECRET!,
 *   issuer: 'my-app',
 * });
 *
 * router.get('/protected', auth, (req: AuthenticatedRequest, res) => {
 *   res.json({ user: req.user });
 * });
 * ```
 */
export function createAuthMiddleware(config: AuthConfig): RequestHandler {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw HttpError.unauthorized('Missing authorization header');
      }

      const [scheme, token] = authHeader.split(' ');

      if (scheme !== 'Bearer' || !token) {
        throw HttpError.unauthorized('Invalid authorization format. Use: Bearer <token>');
      }

      const payload = jwt.verify(token, config.secret, {
        issuer: config.issuer,
        audience: config.audience,
        algorithms: config.algorithms ?? ['HS256'],
      }) as JWTPayload;

      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        next(HttpError.unauthorized('Token expired'));
      } else if (error instanceof jwt.JsonWebTokenError) {
        next(HttpError.unauthorized('Invalid token'));
      } else {
        next(error);
      }
    }
  };
}

/**
 * Optional authentication - attaches user if token present, continues otherwise.
 */
export function createOptionalAuthMiddleware(config: AuthConfig): RequestHandler {
  const authMiddleware = createAuthMiddleware(config);

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.headers.authorization) {
      return next();
    }

    authMiddleware(req, res, (error) => {
      // Ignore auth errors for optional auth - just continue without user
      if (error instanceof HttpError && error.statusCode === 401) {
        return next();
      }
      next(error);
    });
  };
}

/**
 * Create role-based authorization middleware.
 *
 * @example
 * ```typescript
 * const requireAdmin = requireRole('admin');
 * const requireModOrAdmin = requireRole(['admin', 'moderator']);
 *
 * router.delete('/users/:id', auth, requireAdmin, deleteUser);
 * ```
 */
export function requireRole(roles: string | string[]): RequestHandler {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(HttpError.unauthorized());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(HttpError.forbidden(`Requires role: ${allowedRoles.join(' or ')}`));
    }

    next();
  };
}

/**
 * Create permission-based authorization middleware.
 *
 * @example
 * ```typescript
 * const canDelete = requirePermission('users:delete');
 * const canManage = requirePermission(['users:create', 'users:update', 'users:delete']);
 *
 * router.delete('/users/:id', auth, canDelete, deleteUser);
 * ```
 */
export function requirePermission(permissions: string | string[]): RequestHandler {
  const required = Array.isArray(permissions) ? permissions : [permissions];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(HttpError.unauthorized());
    }

    const userPermissions = req.user.permissions ?? [];
    const hasPermission = required.every((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return next(HttpError.forbidden(`Missing required permission(s): ${required.join(', ')}`));
    }

    next();
  };
}

/* ─────────────────────────────────────────────────────────────
   3. ERROR HANDLING MIDDLEWARE
──────────────────────────────────────────────────────────────── */

/**
 * Logger interface for error handling.
 */
export interface Logger {
  error(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
}

/**
 * Error handler configuration.
 */
export interface ErrorHandlerConfig {
  logger?: Logger;
  includeStack?: boolean;
  onError?: (error: Error, req: Request) => void;
}

/**
 * Create centralized error handling middleware.
 * Must be registered LAST in the middleware chain.
 *
 * @example
 * ```typescript
 * const errorHandler = createErrorHandler({
 *   logger: console,
 *   includeStack: process.env.NODE_ENV === 'development',
 * });
 *
 * app.use(errorHandler);
 * ```
 */
export function createErrorHandler(config: ErrorHandlerConfig = {}): ErrorRequestHandler {
  const { logger = console, includeStack = false, onError } = config;

  return (
    error: Error,
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    // Call custom error handler if provided
    onError?.(error, req);

    // Determine status code and response
    let statusCode = 500;
    let response: Record<string, unknown> = {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    };

    if (error instanceof HttpError) {
      statusCode = error.statusCode;
      response = error.toJSON();
    } else if (error.name === 'ValidationError') {
      // Handle Zod/Joi validation errors
      statusCode = 400;
      response = {
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      };
    }

    // Log error
    const logMeta = {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      userId: req.user?.id,
      statusCode,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    };

    if (statusCode >= 500) {
      logger.error('Server error', logMeta);
    } else if (statusCode >= 400) {
      logger.warn('Client error', logMeta);
    }

    // Include stack trace in development
    if (includeStack && error.stack) {
      (response.error as Record<string, unknown>).stack = error.stack;
    }

    res.status(statusCode).json(response);
  };
}

/**
 * Not found handler for undefined routes.
 *
 * @example
 * ```typescript
 * // Register after all routes
 * app.use(notFoundHandler);
 * app.use(errorHandler);
 * ```
 */
export const notFoundHandler: RequestHandler = (req, res, next) => {
  next(HttpError.notFound(`Route ${req.method} ${req.path}`));
};

/**
 * Async handler wrapper to catch promise rejections.
 *
 * @example
 * ```typescript
 * router.get('/users/:id', asyncHandler(async (req, res) => {
 *   const user = await userService.findById(req.params.id);
 *   res.json(user);
 * }));
 * ```
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/* ─────────────────────────────────────────────────────────────
   4. VALIDATION MIDDLEWARE
──────────────────────────────────────────────────────────────── */

import { z, ZodSchema, ZodError } from 'zod';

/**
 * Validation target in request.
 */
export type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Create request validation middleware using Zod schema.
 *
 * @example
 * ```typescript
 * const createUserSchema = z.object({
 *   email: z.string().email(),
 *   name: z.string().min(2),
 *   role: z.enum(['admin', 'user']).optional(),
 * });
 *
 * router.post('/users',
 *   validate({ body: createUserSchema }),
 *   asyncHandler(async (req, res) => {
 *     // req.body is now typed as z.infer<typeof createUserSchema>
 *     const user = await userService.create(req.body);
 *     res.status(201).json(user);
 *   })
 * );
 * ```
 */
export function validate<
  TBody extends ZodSchema = ZodSchema,
  TQuery extends ZodSchema = ZodSchema,
  TParams extends ZodSchema = ZodSchema,
>(schemas: {
  body?: TBody;
  query?: TQuery;
  params?: TParams;
}): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));

        next(HttpError.badRequest('Validation failed', { errors: details }));
      } else {
        next(error);
      }
    }
  };
}

/**
 * Common validation schemas for reuse.
 */
export const commonSchemas = {
  /** UUID v4 parameter */
  uuidParam: z.object({
    id: z.string().uuid('Invalid ID format'),
  }),

  /** Pagination query parameters */
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),

  /** Search query parameter */
  search: z.object({
    q: z.string().min(1).max(100).optional(),
  }),

  /** Date range query parameters */
  dateRange: z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
};

/* ─────────────────────────────────────────────────────────────
   5. RATE LIMITING MIDDLEWARE
──────────────────────────────────────────────────────────────── */

/**
 * Rate limiter storage interface.
 */
export interface RateLimiterStore {
  /**
   * Increment request count for key.
   * @returns Current count after increment
   */
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: Date }>;

  /**
   * Get current count for key.
   */
  get(key: string): Promise<{ count: number; resetAt: Date } | null>;
}

/**
 * In-memory rate limiter store.
 * For production, use Redis or similar.
 */
export class MemoryRateLimiterStore implements RateLimiterStore {
  private store = new Map<string, { count: number; resetAt: number }>();

  async increment(key: string, windowMs: number): Promise<{ count: number; resetAt: Date }> {
    const now = Date.now();
    const existing = this.store.get(key);

    if (!existing || now >= existing.resetAt) {
      // New window
      const resetAt = now + windowMs;
      this.store.set(key, { count: 1, resetAt });
      return { count: 1, resetAt: new Date(resetAt) };
    }

    // Increment existing
    existing.count++;
    return { count: existing.count, resetAt: new Date(existing.resetAt) };
  }

  async get(key: string): Promise<{ count: number; resetAt: Date } | null> {
    const existing = this.store.get(key);
    if (!existing || Date.now() >= existing.resetAt) {
      return null;
    }
    return { count: existing.count, resetAt: new Date(existing.resetAt) };
  }
}

/**
 * Rate limiter configuration.
 */
export interface RateLimiterConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests per window */
  max: number;
  /** Key generator function */
  keyGenerator?: (req: Request) => string;
  /** Store implementation */
  store?: RateLimiterStore;
  /** Custom message */
  message?: string;
  /** Skip function - return true to skip rate limiting */
  skip?: (req: Request) => boolean;
  /** Headers to include in response */
  headers?: boolean;
}

/**
 * Create rate limiting middleware.
 *
 * @example
 * ```typescript
 * // Global rate limit: 100 requests per minute
 * const globalLimiter = createRateLimiter({
 *   windowMs: 60 * 1000,
 *   max: 100,
 * });
 *
 * // Strict limit for auth endpoints: 5 attempts per 15 minutes
 * const authLimiter = createRateLimiter({
 *   windowMs: 15 * 60 * 1000,
 *   max: 5,
 *   keyGenerator: (req) => `auth:${req.ip}`,
 * });
 *
 * app.use(globalLimiter);
 * app.post('/auth/login', authLimiter, loginHandler);
 * ```
 */
export function createRateLimiter(config: RateLimiterConfig): RequestHandler {
  const {
    windowMs,
    max,
    keyGenerator = (req) => req.ip || 'unknown',
    store = new MemoryRateLimiterStore(),
    message = 'Too many requests, please try again later',
    skip,
    headers = true,
  } = config;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check if should skip
      if (skip?.(req)) {
        return next();
      }

      const key = keyGenerator(req);
      const { count, resetAt } = await store.increment(key, windowMs);

      // Set rate limit headers
      if (headers) {
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count));
        res.setHeader('X-RateLimit-Reset', Math.ceil(resetAt.getTime() / 1000));
      }

      if (count > max) {
        res.setHeader('Retry-After', Math.ceil((resetAt.getTime() - Date.now()) / 1000));
        return next(HttpError.tooManyRequests(message));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/* ─────────────────────────────────────────────────────────────
   6. REQUEST LOGGING MIDDLEWARE
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'crypto';

/**
 * Request logging configuration.
 */
export interface RequestLoggerConfig {
  logger?: Logger;
  /** Generate request ID */
  generateRequestId?: () => string;
  /** Fields to redact from logs */
  redactFields?: string[];
  /** Skip logging for certain paths */
  skipPaths?: string[];
  /** Log request body */
  logBody?: boolean;
  /** Log response body */
  logResponseBody?: boolean;
}

/**
 * Create request logging middleware.
 *
 * @example
 * ```typescript
 * const requestLogger = createRequestLogger({
 *   logger: pino,
 *   redactFields: ['password', 'token', 'authorization'],
 *   skipPaths: ['/health', '/metrics'],
 * });
 *
 * app.use(requestLogger);
 * ```
 */
export function createRequestLogger(config: RequestLoggerConfig = {}): RequestHandler {
  const {
    logger = console,
    generateRequestId = randomUUID,
    redactFields = ['password', 'token', 'secret', 'authorization'],
    skipPaths = [],
    logBody = true,
    logResponseBody = false,
  } = config;

  const redact = (obj: unknown): unknown => {
    if (!obj || typeof obj !== 'object') return obj;

    const result = { ...obj } as Record<string, unknown>;
    for (const field of redactFields) {
      if (field in result) {
        result[field] = '[REDACTED]';
      }
    }
    return result;
  };

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Skip certain paths
    if (skipPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    // Assign request ID
    req.requestId = (req.headers['x-request-id'] as string) || generateRequestId();
    req.startTime = Date.now();

    // Set request ID header in response
    res.setHeader('X-Request-ID', req.requestId);

    // Log request
    const requestLog: Record<string, unknown> = {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      query: redact(req.query),
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
      },
    };

    if (logBody && req.body && Object.keys(req.body).length > 0) {
      requestLog.body = redact(req.body);
    }

    logger.info('Incoming request', requestLog);

    // Capture response
    const originalSend = res.send;
    let responseBody: unknown;

    res.send = function (body): Response {
      responseBody = body;
      return originalSend.call(this, body);
    };

    // Log response on finish
    res.on('finish', () => {
      const duration = Date.now() - (req.startTime || 0);

      const responseLog: Record<string, unknown> = {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userId: req.user?.id,
      };

      if (logResponseBody && responseBody) {
        try {
          const parsed = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
          responseLog.body = redact(parsed);
        } catch {
          // Not JSON, skip
        }
      }

      if (res.statusCode >= 500) {
        logger.error('Request completed with error', responseLog);
      } else if (res.statusCode >= 400) {
        logger.warn('Request completed with client error', responseLog);
      } else {
        logger.info('Request completed', responseLog);
      }
    });

    next();
  };
}

/* ─────────────────────────────────────────────────────────────
   7. CORS MIDDLEWARE
──────────────────────────────────────────────────────────────── */

/**
 * CORS configuration.
 */
export interface CorsConfig {
  origin: string | string[] | ((origin: string) => boolean);
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * Create CORS middleware.
 *
 * @example
 * ```typescript
 * const cors = createCorsMiddleware({
 *   origin: ['https://example.com', 'https://app.example.com'],
 *   credentials: true,
 *   maxAge: 86400,
 * });
 *
 * app.use(cors);
 * ```
 */
export function createCorsMiddleware(config: CorsConfig): RequestHandler {
  const {
    origin,
    methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders = ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    credentials = false,
    maxAge = 86400,
  } = config;

  const isOriginAllowed = (requestOrigin: string): boolean => {
    if (typeof origin === 'function') {
      return origin(requestOrigin);
    }
    if (Array.isArray(origin)) {
      return origin.includes(requestOrigin);
    }
    return origin === requestOrigin || origin === '*';
  };

  return (req: Request, res: Response, next: NextFunction): void => {
    const requestOrigin = req.headers.origin;

    if (requestOrigin && isOriginAllowed(requestOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    }

    if (credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader('Access-Control-Expose-Headers', exposedHeaders.join(', '));

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
      res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
      res.setHeader('Access-Control-Max-Age', maxAge.toString());
      res.status(204).end();
      return;
    }

    next();
  };
}

/* ─────────────────────────────────────────────────────────────
   8. SECURITY MIDDLEWARE
──────────────────────────────────────────────────────────────── */

/**
 * Security headers configuration.
 */
export interface SecurityHeadersConfig {
  contentSecurityPolicy?: string | false;
  strictTransportSecurity?: boolean;
  xContentTypeOptions?: boolean;
  xFrameOptions?: 'DENY' | 'SAMEORIGIN' | false;
  xXssProtection?: boolean;
  referrerPolicy?: string;
}

/**
 * Create security headers middleware.
 *
 * @example
 * ```typescript
 * const securityHeaders = createSecurityHeaders({
 *   contentSecurityPolicy: "default-src 'self'",
 *   strictTransportSecurity: true,
 * });
 *
 * app.use(securityHeaders);
 * ```
 */
export function createSecurityHeaders(config: SecurityHeadersConfig = {}): RequestHandler {
  const {
    contentSecurityPolicy = "default-src 'self'",
    strictTransportSecurity = true,
    xContentTypeOptions = true,
    xFrameOptions = 'DENY',
    xXssProtection = true,
    referrerPolicy = 'strict-origin-when-cross-origin',
  } = config;

  return (req: Request, res: Response, next: NextFunction): void => {
    if (contentSecurityPolicy) {
      res.setHeader('Content-Security-Policy', contentSecurityPolicy);
    }

    if (strictTransportSecurity) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    if (xContentTypeOptions) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }

    if (xFrameOptions) {
      res.setHeader('X-Frame-Options', xFrameOptions);
    }

    if (xXssProtection) {
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }

    if (referrerPolicy) {
      res.setHeader('Referrer-Policy', referrerPolicy);
    }

    next();
  };
}

/* ─────────────────────────────────────────────────────────────
   9. COMPLETE EXAMPLE - MIDDLEWARE STACK
──────────────────────────────────────────────────────────────── */

import express, { Express } from 'express';

/**
 * Example: Configure complete middleware stack for an Express application.
 */
export function configureMiddleware(app: Express, config: {
  jwtSecret: string;
  corsOrigins: string[];
  logger: Logger;
}): void {
  const { jwtSecret, corsOrigins, logger } = config;

  // 1. Security headers (first)
  app.use(createSecurityHeaders());

  // 2. CORS
  app.use(createCorsMiddleware({
    origin: corsOrigins,
    credentials: true,
  }));

  // 3. Request logging
  app.use(createRequestLogger({
    logger,
    skipPaths: ['/health', '/ready'],
  }));

  // 4. Body parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));

  // 5. Global rate limiting
  app.use(createRateLimiter({
    windowMs: 60 * 1000,
    max: 100,
    skip: (req) => req.path === '/health',
  }));

  // 6. Routes would go here...

  // 7. Not found handler (after routes)
  app.use(notFoundHandler);

  // 8. Error handler (last)
  app.use(createErrorHandler({
    logger,
    includeStack: process.env.NODE_ENV === 'development',
  }));
}

/**
 * Example: Protected route setup.
 */
export function createProtectedRoutes(jwtSecret: string): express.Router {
  const router = express.Router();
  const auth = createAuthMiddleware({ secret: jwtSecret });
  const adminOnly = requireRole('admin');

  // All routes require authentication
  router.use(auth);

  // GET /profile - any authenticated user
  router.get('/profile', asyncHandler(async (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  }));

  // DELETE /users/:id - admin only
  router.delete('/users/:id',
    adminOnly,
    validate({ params: commonSchemas.uuidParam }),
    asyncHandler(async (req, res) => {
      // Delete logic here
      res.status(204).end();
    })
  );

  return router;
}
