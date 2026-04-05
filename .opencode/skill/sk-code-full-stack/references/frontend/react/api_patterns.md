---
title: API Patterns
description: Next.js Route handlers, tRPC integration, API design patterns, error responses, authentication patterns, and API middleware.
---

# API Patterns

Next.js Route handlers, tRPC integration, API design patterns, error responses, authentication patterns, and API middleware.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on building APIs in Next.js applications, covering Route handlers, tRPC for type-safe APIs, error handling, authentication middleware, and API design best practices.

### When to Use

- Creating API endpoints in Next.js
- Implementing type-safe APIs with tRPC
- Handling authentication and authorization
- Designing RESTful API responses
- Building API middleware

### Prerequisites

- **[React/Next.js Standards](./react_nextjs_standards.md)**: Project structure and configuration
- **[Data Fetching](./data_fetching.md)**: Consuming APIs in React
- **[Component Architecture](./component_architecture.md)**: Server vs Client Components

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:route-handlers -->
## 2. ROUTE HANDLERS

### Basic Route Handler

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');

    const where = category ? { category: { slug: category } } : {};

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const { name, price, description, categoryId } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create product
    const product = await db.product.create({
      data: {
        name,
        price,
        description,
        categoryId,
        createdById: session.user.id,
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

### Dynamic Route Handler

```typescript
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/products/:id
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`GET /api/products/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PATCH /api/products/:id
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check product exists and user owns it
    const existing = await db.product.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (existing.createdById !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const product = await db.product.update({
      where: { id: params.id },
      data: body,
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(`PATCH /api/products/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await db.product.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (existing.createdById !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.product.delete({ where: { id: params.id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`DELETE /api/products/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
```

### Route Handler with Zod Validation

```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db/prisma';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hash(password, 12);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
```

---

<!-- /ANCHOR:route-handlers -->
<!-- ANCHOR:api-response-patterns -->
## 3. API RESPONSE PATTERNS

### Standardized Response Format

```typescript
// lib/api/response.ts
import { NextResponse } from 'next/server';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: ApiResponse['meta']
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status }
  );
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: Record<string, string[]>
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    { status }
  );
}

export function paginatedResponse<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number }
): NextResponse<ApiResponse<T[]>> {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      pagination: {
        ...pagination,
        totalPages: Math.ceil(pagination.total / pagination.limit),
      },
    },
  });
}
```

### Using Response Helpers

```typescript
// app/api/users/route.ts
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
    });

    if (!query.success) {
      return errorResponse(
        'INVALID_QUERY',
        'Invalid query parameters',
        400,
        query.error.flatten().fieldErrors
      );
    }

    const { page, limit, search } = query.data;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      db.user.count({ where }),
    ]);

    return paginatedResponse(users, { page, limit, total });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch users', 500);
  }
}
```

### Error Codes

```typescript
// lib/api/errors.ts
export const ErrorCodes = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public status: number = 400,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toResponse() {
    return errorResponse(this.code, this.message, this.status, this.details);
  }

  static notFound(resource = 'Resource') {
    return new ApiError(ErrorCodes.NOT_FOUND, `${resource} not found`, 404);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(ErrorCodes.UNAUTHORIZED, message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(ErrorCodes.FORBIDDEN, message, 403);
  }

  static validation(details: Record<string, string[]>) {
    return new ApiError(
      ErrorCodes.VALIDATION_ERROR,
      'Validation failed',
      400,
      details
    );
  }
}
```

---

<!-- /ANCHOR:api-response-patterns -->
<!-- ANCHOR:authentication-patterns -->
## 4. AUTHENTICATION PATTERNS

### Session-Based Auth

```typescript
// lib/auth/session.ts
import { cookies } from 'next/headers';
import { db } from '@/lib/db/prisma';
import { verify, sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

interface SessionPayload {
  userId: string;
  email: string;
}

export async function getSession(): Promise<{ user: User } | null> {
  try {
    const token = cookies().get('session')?.value;
    if (!token) return null;

    const payload = verify(token, JWT_SECRET) as SessionPayload;

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) return null;

    return { user };
  } catch {
    return null;
  }
}

export async function createSession(user: User): Promise<string> {
  const token = sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return token;
}

export async function destroySession() {
  cookies().delete('session');
}
```

### Auth Middleware Helper

```typescript
// lib/api/auth-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { errorResponse } from '@/lib/api/response';

type RouteHandler = (
  request: NextRequest,
  context: { params: Record<string, string> }
) => Promise<NextResponse>;

type AuthenticatedHandler = (
  request: NextRequest,
  context: { params: Record<string, string>; session: { user: User } }
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler): RouteHandler {
  return async (request, context) => {
    const session = await getSession();

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    return handler(request, { ...context, session });
  };
}

export function withRole(role: string | string[], handler: AuthenticatedHandler): RouteHandler {
  return withAuth(async (request, context) => {
    const roles = Array.isArray(role) ? role : [role];

    if (!roles.includes(context.session.user.role)) {
      return errorResponse('FORBIDDEN', 'Insufficient permissions', 403);
    }

    return handler(request, context);
  });
}

// Usage
export const GET = withAuth(async (request, { session }) => {
  // session is guaranteed to exist
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });
  return NextResponse.json(user);
});

export const DELETE = withRole('admin', async (request, { params }) => {
  await db.user.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
});
```

### API Key Authentication

```typescript
// lib/api/api-key-auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { errorResponse } from '@/lib/api/response';

export async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');

  if (!apiKey) {
    return { valid: false, error: errorResponse('UNAUTHORIZED', 'API key required', 401) };
  }

  const key = await db.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: true },
  });

  if (!key || key.revokedAt) {
    return { valid: false, error: errorResponse('UNAUTHORIZED', 'Invalid API key', 401) };
  }

  if (key.expiresAt && key.expiresAt < new Date()) {
    return { valid: false, error: errorResponse('UNAUTHORIZED', 'API key expired', 401) };
  }

  // Update last used timestamp
  await db.apiKey.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date() },
  });

  return { valid: true, user: key.user };
}

export function withApiKey(handler: AuthenticatedHandler): RouteHandler {
  return async (request, context) => {
    const { valid, error, user } = await validateApiKey(request);

    if (!valid) {
      return error!;
    }

    return handler(request, { ...context, session: { user: user! } });
  };
}
```

---

<!-- /ANCHOR:authentication-patterns -->
<!-- ANCHOR:trpc-integration -->
## 5. TRPC INTEGRATION

### tRPC Setup

```typescript
// lib/trpc/init.ts
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { getSession } from '@/lib/auth/session';

interface Context {
  session: { user: User } | null;
}

export async function createContext(): Promise<Context> {
  const session = await getSession();
  return { session };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
```

### tRPC Router

```typescript
// lib/trpc/routers/products.ts
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure, adminProcedure } from '../init';
import { db } from '@/lib/db/prisma';
import { TRPCError } from '@trpc/server';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
});

export const productsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().max(100).default(20),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, category } = input;

      const where = category ? { category: { slug: category } } : {};

      const [products, total] = await Promise.all([
        db.product.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: { category: true },
        }),
        db.product.count({ where }),
      ]);

      return {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const product = await db.product.findUnique({
        where: { id: input.id },
        include: { category: true, reviews: { take: 10 } },
      });

      if (!product) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
      }

      return product;
    }),

  create: protectedProcedure
    .input(productSchema)
    .mutation(async ({ input, ctx }) => {
      const product = await db.product.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
        },
        include: { category: true },
      });

      return product;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: productSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      const existing = await db.product.findUnique({
        where: { id: input.id },
      });

      if (!existing) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (existing.createdById !== ctx.session.user.id && ctx.session.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const product = await db.product.update({
        where: { id: input.id },
        data: input.data,
        include: { category: true },
      });

      return product;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.product.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
```

### App Router Integration

```typescript
// lib/trpc/routers/_app.ts
import { router } from '../init';
import { productsRouter } from './products';
import { usersRouter } from './users';
import { ordersRouter } from './orders';

export const appRouter = router({
  products: productsRouter,
  users: usersRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
```

```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/routers/_app';
import { createContext } from '@/lib/trpc/init';

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
```

### Client-Side Usage

```typescript
// lib/trpc/client.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './routers/_app';

export const trpc = createTRPCReact<AppRouter>();
```

```typescript
// components/features/products/ProductList.tsx
'use client';

import { trpc } from '@/lib/trpc/client';

export function ProductList() {
  const { data, isLoading, error } = trpc.products.list.useQuery({
    page: 1,
    limit: 20,
  });

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      utils.products.list.invalidate();
    },
  });

  const utils = trpc.useContext();

  if (isLoading) return <Skeleton />;
  if (error) return <Error error={error} />;

  return (
    <div>
      {data?.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

<!-- /ANCHOR:trpc-integration -->
<!-- ANCHOR:middleware -->
## 6. MIDDLEWARE

### Global API Middleware

```typescript
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { rateLimit } from '@/lib/api/rate-limit';

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Skip health check
  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.next();
  }

  // Rate limiting
  const ip = request.ip ?? '127.0.0.1';
  const { success, remaining, reset } = await rateLimit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // Add rate limit headers to response
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### Rate Limiting

```typescript
// lib/api/rate-limit.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  identifier: string,
  limit = 100,
  window = 60 * 1000 // 1 minute
): Promise<RateLimitResult> {
  const key = `rate-limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - window;

  // Remove old entries
  await redis.zremrangebyscore(key, 0, windowStart);

  // Count requests in window
  const count = await redis.zcard(key);

  if (count >= limit) {
    const oldestInWindow = await redis.zrange(key, 0, 0, { withScores: true });
    const reset = oldestInWindow[0]?.score
      ? Math.ceil(oldestInWindow[0].score + window)
      : now + window;

    return {
      success: false,
      remaining: 0,
      reset,
    };
  }

  // Add new request
  await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` });
  await redis.expire(key, Math.ceil(window / 1000));

  return {
    success: true,
    remaining: limit - count - 1,
    reset: now + window,
  };
}
```

### CORS Configuration

```typescript
// lib/api/cors.ts
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://example.com',
  'https://app.example.com',
  process.env.NODE_ENV === 'development' && 'http://localhost:3000',
].filter(Boolean) as string[];

export function cors(request: NextRequest) {
  const origin = request.headers.get('origin');

  // Check if origin is allowed
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json(
      { error: 'Origin not allowed' },
      { status: 403 }
    );
  }

  return null;
}

export function corsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get('origin');

  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin ?? '')
      ? origin!
      : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    'Access-Control-Max-Age': '86400',
  };
}

// Handle OPTIONS requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}
```

---

<!-- /ANCHOR:middleware -->
<!-- ANCHOR:webhooks -->
## 7. WEBHOOKS

### Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  await db.order.create({
    data: {
      userId,
      stripeSessionId: session.id,
      status: 'paid',
      total: session.amount_total! / 100,
    },
  });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  await db.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: 'canceled' },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Send notification email
  console.log('Payment failed for invoice:', invoice.id);
}
```

---

<!-- /ANCHOR:webhooks -->
<!-- ANCHOR:file-uploads -->
## 8. FILE UPLOADS

### Upload Handler

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth/session';
import { errorResponse, successResponse } from '@/lib/api/response';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('MISSING_FIELD', 'No file provided', 400);
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse('VALIDATION_ERROR', 'File too large (max 10MB)', 400);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse('VALIDATION_ERROR', 'File type not allowed', 400);
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${session.user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // Upload to blob storage
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return successResponse({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    }, 201);
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('INTERNAL_ERROR', 'Upload failed', 500);
  }
}
```

### Multiple File Upload

```typescript
// app/api/upload/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll('files') as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  if (files.length > 10) {
    return NextResponse.json(
      { error: 'Maximum 10 files allowed' },
      { status: 400 }
    );
  }

  const results = await Promise.allSettled(
    files.map(async (file) => {
      const ext = file.name.split('.').pop();
      const filename = `${session.user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const blob = await put(filename, file, {
        access: 'public',
        addRandomSuffix: false,
      });

      return {
        url: blob.url,
        filename: file.name,
        size: file.size,
      };
    })
  );

  const successful = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<any>).value);

  const failed = results
    .filter((r) => r.status === 'rejected')
    .length;

  return NextResponse.json({
    uploaded: successful,
    failed,
    total: files.length,
  });
}
```

---

<!-- /ANCHOR:file-uploads -->
<!-- ANCHOR:quick-reference -->
## 9. QUICK REFERENCE

### Route Handler Methods

```typescript
// HTTP Methods
export async function GET(request: NextRequest) { }
export async function POST(request: NextRequest) { }
export async function PUT(request: NextRequest) { }
export async function PATCH(request: NextRequest) { }
export async function DELETE(request: NextRequest) { }
export async function HEAD(request: NextRequest) { }
export async function OPTIONS(request: NextRequest) { }

// Request helpers
const url = new URL(request.url);
const searchParams = url.searchParams;
const body = await request.json();
const formData = await request.formData();
const headers = request.headers;
const cookies = request.cookies;

// Response helpers
return NextResponse.json(data, { status: 200 });
return NextResponse.redirect(new URL('/path', request.url));
return new NextResponse(null, { status: 204 });
```

### HTTP Status Codes

| Status | Meaning              | When to Use                     |
| ------ | -------------------- | ------------------------------- |
| 200    | OK                   | Successful GET, PUT, PATCH      |
| 201    | Created              | Successful POST creating resource|
| 204    | No Content           | Successful DELETE               |
| 400    | Bad Request          | Validation errors               |
| 401    | Unauthorized         | Missing/invalid authentication  |
| 403    | Forbidden            | Insufficient permissions        |
| 404    | Not Found            | Resource doesn't exist          |
| 409    | Conflict             | Resource already exists         |
| 429    | Too Many Requests    | Rate limited                    |
| 500    | Internal Server Error| Unexpected server error         |

### Checklist: API Route

- [ ] Validate request body with Zod
- [ ] Check authentication if required
- [ ] Verify authorization/permissions
- [ ] Handle errors gracefully
- [ ] Return appropriate status codes
- [ ] Log errors for debugging
- [ ] Set proper headers (CORS, cache)
- [ ] Document in OpenAPI/Swagger

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Related References

- [React/Next.js Standards](./react_nextjs_standards.md) - Project structure
- [Data Fetching](./data_fetching.md) - Consuming APIs in React
- [Component Architecture](./component_architecture.md) - Server vs Client Components
- [Testing Strategy](./testing_strategy.md) - API mocking with MSW
<!-- /ANCHOR:related-resources -->
