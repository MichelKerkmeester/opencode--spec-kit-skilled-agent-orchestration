---
title: React/Next.js Standards
description: Next.js 14+ App Router conventions, TypeScript configuration, file naming patterns, directory organization, and environment configuration for production applications.
---

# React/Next.js Standards

Next.js 14+ App Router conventions, TypeScript configuration, file naming patterns, directory organization, and environment configuration for production applications.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on Next.js 14+ patterns including App Router architecture, TypeScript configuration, file organization, environment management, and production deployment conventions.

### When to Use

- Setting up new Next.js projects or features
- Configuring TypeScript for strict type safety
- Organizing project directory structure
- Managing environment variables across deployments
- Implementing routing and layouts

### Prerequisites

- **[Component Architecture](./component_architecture.md)**: Server Components vs Client Components patterns
- **[Data Fetching](./data_fetching.md)**: Server Actions and caching strategies
- **[API Patterns](./api_patterns.md)**: Route handlers and API design

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:project-structure -->
## 2. PROJECT STRUCTURE

### App Router Directory Organization

Next.js 14+ uses the App Router with file-based routing in the `app/` directory.

```
project-root/
├── app/                          # App Router (routes, layouts, pages)
│   ├── (auth)/                   # Route group (no URL segment)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Auth-specific layout
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── overview/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── api/                      # API Route handlers
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
├── components/                   # Shared components
│   ├── ui/                       # Base UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── index.ts              # Barrel export
│   ├── forms/                    # Form components
│   ├── layout/                   # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   └── features/                 # Feature-specific components
│       ├── auth/
│       ├── dashboard/
│       └── settings/
├── lib/                          # Utility libraries
│   ├── api/                      # API client utilities
│   │   ├── client.ts
│   │   └── endpoints.ts
│   ├── auth/                     # Auth utilities
│   │   └── session.ts
│   ├── db/                       # Database utilities
│   │   ├── prisma.ts
│   │   └── queries/
│   ├── utils/                    # General utilities
│   │   ├── cn.ts                 # Class name utility
│   │   ├── format.ts
│   │   └── validation.ts
│   └── constants/                # App constants
│       ├── routes.ts
│       └── config.ts
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── index.ts
├── stores/                       # State management
│   ├── useAuthStore.ts           # Zustand store
│   ├── useCartStore.ts
│   └── index.ts
├── types/                        # TypeScript types
│   ├── api.ts                    # API response types
│   ├── auth.ts                   # Auth types
│   ├── database.ts               # Database model types
│   └── index.ts
├── public/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── prisma/                       # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── config/                       # Configuration files
│   ├── site.ts                   # Site metadata
│   └── navigation.ts             # Navigation config
├── .env.local                    # Local environment variables
├── .env.example                  # Environment template
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

### Directory Purpose Reference

| Directory      | Purpose                              | Examples                                   |
| -------------- | ------------------------------------ | ------------------------------------------ |
| `app/`         | Routes, layouts, pages (App Router)  | `page.tsx`, `layout.tsx`, `loading.tsx`    |
| `app/api/`     | API Route handlers                   | `route.ts` for REST endpoints              |
| `components/`  | Shared React components              | UI primitives, feature components          |
| `lib/`         | Non-React utilities and helpers      | API clients, database, validation          |
| `hooks/`       | Custom React hooks                   | `useAuth`, `useDebounce`                   |
| `stores/`      | State management (Zustand/Jotai)     | Global stores                              |
| `types/`       | TypeScript type definitions          | Interfaces, type aliases                   |
| `config/`      | Application configuration            | Site metadata, feature flags               |
| `public/`      | Static assets (served at root)       | Images, fonts, robots.txt                  |

### Route Group Patterns

Route groups organize routes without affecting the URL structure:

```
app/
├── (marketing)/              # Marketing pages group
│   ├── about/
│   │   └── page.tsx          # /about
│   ├── pricing/
│   │   └── page.tsx          # /pricing
│   └── layout.tsx            # Shared marketing layout
├── (app)/                    # Application pages group
│   ├── dashboard/
│   │   └── page.tsx          # /dashboard
│   ├── settings/
│   │   └── page.tsx          # /settings
│   └── layout.tsx            # Shared app layout with auth
└── layout.tsx                # Root layout
```

---

<!-- /ANCHOR:project-structure -->
<!-- ANCHOR:file-naming-conventions -->
## 3. FILE NAMING CONVENTIONS

### App Router Special Files

| File               | Purpose                                | Scope            |
| ------------------ | -------------------------------------- | ---------------- |
| `page.tsx`         | Unique UI for a route                  | Route segment    |
| `layout.tsx`       | Shared UI for segment and children     | Route + children |
| `template.tsx`     | Re-rendered layout (new instance)      | Route + children |
| `loading.tsx`      | Loading UI (Suspense boundary)         | Route segment    |
| `error.tsx`        | Error UI (Error boundary)              | Route segment    |
| `not-found.tsx`    | 404 UI                                 | Route segment    |
| `route.ts`         | API endpoint handler                   | Route segment    |
| `default.tsx`      | Parallel route fallback                | Parallel slots   |
| `global-error.tsx` | Global error UI                        | Root only        |
| `middleware.ts`    | Request middleware                     | Project root     |

### Component File Naming

#### ✅ ALWAYS

- Use PascalCase for component files: `Button.tsx`, `UserProfile.tsx`
- Use PascalCase for component directories: `Button/`, `UserProfile/`
- Include barrel exports via `index.ts` for cleaner imports
- Co-locate component tests: `Button.test.tsx`
- Co-locate component styles if needed: `Button.module.css`

```typescript
// components/ui/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';

// components/ui/Button/Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  // ...
}
```

#### ❌ NEVER

- Mix naming conventions in the same directory
- Use default exports for components (prefer named exports)
- Create deeply nested component hierarchies (max 2-3 levels)
- Put component logic in the barrel `index.ts` file

### Utility and Hook Naming

| Type     | Convention    | Example                                    |
| -------- | ------------- | ------------------------------------------ |
| Hooks    | `use` prefix  | `useAuth.ts`, `useDebounce.ts`             |
| Contexts | `*Context`    | `AuthContext.tsx`, `ThemeContext.tsx`      |
| Utils    | camelCase     | `formatDate.ts`, `validateEmail.ts`        |
| Types    | PascalCase    | `User.ts`, `ApiResponse.ts`                |
| Stores   | `use*Store`   | `useAuthStore.ts`, `useCartStore.ts`       |
| Actions  | `*Action`     | `createUserAction.ts`                      |
| Schemas  | `*Schema`     | `userSchema.ts`, `loginSchema.ts`          |

---

<!-- /ANCHOR:file-naming-conventions -->
<!-- ANCHOR:typescript-configuration -->
## 4. TYPESCRIPT CONFIGURATION

### Recommended tsconfig.json

```json
{
  "compilerOptions": {
    // Target and Module
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,

    // Strict Type Checking
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,

    // Emit
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,

    // JavaScript Support
    "allowJs": true,
    "checkJs": false,

    // Interop
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,

    // React/JSX
    "jsx": "preserve",

    // Path Mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"],
      "@/stores/*": ["./stores/*"],
      "@/config/*": ["./config/*"]
    },

    // Plugins
    "plugins": [
      { "name": "next" }
    ],

    // Skip Library Check
    "skipLibCheck": true,
    "incremental": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### Path Alias Usage

```typescript
// Instead of relative imports
import { Button } from '../../../components/ui/Button';

// Use path aliases
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils/format';
import type { User } from '@/types/auth';
```

### Strict Type Patterns

#### Function Return Types

```typescript
// ALWAYS: Explicit return types for public functions
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ALWAYS: Explicit async return types
export async function fetchUser(id: string): Promise<User | null> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) return null;
  return response.json();
}
```

#### Component Props Types

```typescript
// ALWAYS: Interface for component props
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  className?: string;
}

// Named export with explicit props
export function UserCard({ user, onEdit, onDelete, className }: UserCardProps) {
  // ...
}
```

#### Discriminated Unions

```typescript
// API response states
type ApiState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Usage with type narrowing
function renderContent(state: ApiState<User[]>) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserList users={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
}
```

---

<!-- /ANCHOR:typescript-configuration -->
<!-- ANCHOR:next-js-configuration -->
## 5. NEXT.JS CONFIGURATION

### next.config.js (Recommended)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental Features
  experimental: {
    typedRoutes: true,           // Type-safe routing
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },

  // Rewrites (API proxying)
  async rewrites() {
    return [
      {
        source: '/api/external/:path*',
        destination: 'https://external-api.com/:path*',
      },
    ];
  },

  // Headers (Security)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Webpack Customization
  webpack: (config, { isServer }) => {
    // Custom webpack config
    return config;
  },
};

module.exports = nextConfig;
```

### Typed Routes (Experimental)

When `typedRoutes: true` is enabled, Next.js generates types for routes:

```typescript
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Type-safe Link
<Link href="/dashboard">Dashboard</Link>

// Type-safe programmatic navigation
const router = useRouter();
router.push('/settings/profile');

// TypeScript will error on invalid routes
<Link href="/invalid-route">Invalid</Link> // Type error!
```

---

<!-- /ANCHOR:next-js-configuration -->
<!-- ANCHOR:environment-configuration -->
## 6. ENVIRONMENT CONFIGURATION

### Environment Files

| File               | Purpose                | Git-tracked | Loaded in                |
| ------------------ | ---------------------- | ----------- | ------------------------ |
| `.env`             | Default all environments| Yes        | All                      |
| `.env.local`       | Local overrides        | No          | Development              |
| `.env.development` | Development defaults   | Yes         | `next dev`               |
| `.env.production`  | Production defaults    | Yes         | `next build`/`start`     |
| `.env.test`        | Test environment       | Yes         | Test runner              |

### Environment Variable Patterns

```bash
# .env.example (committed to git)
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# External Services
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
RESEND_API_KEY=""

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS="false"
NEXT_PUBLIC_MAINTENANCE_MODE="false"

# CDN/Storage
NEXT_PUBLIC_CDN_URL="https://cdn.example.com"
AWS_S3_BUCKET=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
```

### Environment Variable Typing

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Server-only variables
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),

  // Public variables (accessible in browser)
  NEXT_PUBLIC_CDN_URL: z.string().url(),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.enum(['true', 'false']).transform(v => v === 'true'),
});

// Parse and validate environment variables
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;

// Type-safe access
// import { env } from '@/lib/env';
// const dbUrl = env.DATABASE_URL; // TypeScript knows this is a string
```

### Runtime vs Build-time Variables

```typescript
// Server-only (never exposed to browser)
const serverConfig = {
  databaseUrl: process.env.DATABASE_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};

// Public (available in browser via NEXT_PUBLIC_ prefix)
const publicConfig = {
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
};
```

#### ✅ ALWAYS

- Prefix client-accessible variables with `NEXT_PUBLIC_`
- Validate environment variables at build time
- Keep `.env.example` up to date with all required variables
- Never commit secrets (use `.env.local` for local secrets)

#### ❌ NEVER

- Access server-only env vars in client components
- Hardcode secrets or API keys
- Use `NEXT_PUBLIC_` for sensitive data
- Skip environment validation in production

---

<!-- /ANCHOR:environment-configuration -->
<!-- ANCHOR:routing-patterns -->
## 7. ROUTING PATTERNS

### Basic Routing Structure

```
app/
├── page.tsx                    # /
├── about/
│   └── page.tsx                # /about
├── blog/
│   ├── page.tsx                # /blog
│   └── [slug]/
│       └── page.tsx            # /blog/:slug
├── shop/
│   ├── page.tsx                # /shop
│   ├── [category]/
│   │   ├── page.tsx            # /shop/:category
│   │   └── [productId]/
│   │       └── page.tsx        # /shop/:category/:productId
│   └── cart/
│       └── page.tsx            # /shop/cart
└── api/
    └── products/
        └── route.ts            # /api/products
```

### Dynamic Routes

```typescript
// app/blog/[slug]/page.tsx
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}

// Generate static paths for SSG
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Generate metadata dynamically
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post?.title ?? 'Blog Post',
    description: post?.excerpt,
  };
}
```

### Catch-All Routes

```typescript
// app/docs/[...slug]/page.tsx
interface DocsPageProps {
  params: {
    slug: string[];  // ['getting-started', 'installation']
  };
}

export default function DocsPage({ params }: DocsPageProps) {
  // /docs/getting-started/installation -> ['getting-started', 'installation']
  const path = params.slug.join('/');
  return <Documentation path={path} />;
}

// Optional catch-all: [[...slug]]
// app/docs/[[...slug]]/page.tsx
// Matches /docs, /docs/foo, /docs/foo/bar
```

### Parallel Routes

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,    // @analytics slot
  notifications // @notifications slot
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <main>{children}</main>
      <aside>
        {analytics}
        {notifications}
      </aside>
    </div>
  );
}

// app/dashboard/@analytics/page.tsx
// app/dashboard/@notifications/page.tsx
```

### Intercepting Routes

```typescript
// Intercept modal routes
// app/(.)photos/[id]/page.tsx - intercepts /photos/:id when navigating from current directory
// app/(..)photos/[id]/page.tsx - intercepts from parent directory
// app/(...)photos/[id]/page.tsx - intercepts from root

// Use case: Open photo in modal when clicking from gallery
// app/gallery/@modal/(..)photos/[id]/page.tsx
export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <PhotoDetail id={params.id} />
    </Modal>
  );
}
```

---

<!-- /ANCHOR:routing-patterns -->
<!-- ANCHOR:layout-patterns -->
## 8. LAYOUT PATTERNS

### Root Layout (Required)

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | My App',
    default: 'My App',
  },
  description: 'Application description',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'My App',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### Nested Layouts

```typescript
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={session.user} />
      <div className="flex-1">
        <Header user={session.user} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Templates vs Layouts

```typescript
// layout.tsx - Persists state, doesn't remount on navigation
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>; // Same instance across navigations
}

// template.tsx - Creates new instance on each navigation
export default function Template({ children }: { children: React.ReactNode }) {
  // useEffect runs on every navigation
  useEffect(() => {
    logPageView();
  }, []);

  return <div>{children}</div>; // New instance each navigation
}
```

---

<!-- /ANCHOR:layout-patterns -->
<!-- ANCHOR:loading-and-error-states -->
## 9. LOADING AND ERROR STATES

### Loading UI

```typescript
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
```

### Error Boundaries

```typescript
'use client';

// app/dashboard/error.tsx
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### Global Error Boundary

```typescript
'use client';

// app/global-error.tsx (handles root layout errors)
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="error-container">
          <h1>Something went wrong!</h1>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}
```

### Not Found Page

```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground mt-2">Page not found</p>
      <Link href="/" className="mt-4 text-primary hover:underline">
        Go back home
      </Link>
    </div>
  );
}

// Programmatically trigger 404
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const item = await getItem(params.id);

  if (!item) {
    notFound(); // Renders not-found.tsx
  }

  return <ItemDetail item={item} />;
}
```

---

<!-- /ANCHOR:loading-and-error-states -->
<!-- ANCHOR:middleware -->
## 10. MIDDLEWARE

### Middleware Configuration

```typescript
// middleware.ts (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // Protected routes check
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/settings')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add custom headers
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and api
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
```

### Middleware Patterns

```typescript
// Geolocation-based routing
export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US';

  if (country === 'EU' && !request.nextUrl.pathname.startsWith('/eu')) {
    return NextResponse.redirect(new URL('/eu' + request.nextUrl.pathname, request.url));
  }
}

// Rate limiting header
export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const response = NextResponse.next();
  response.headers.set('X-Forwarded-For', ip);
  return response;
}

// Maintenance mode
export function middleware(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    if (!request.nextUrl.pathname.startsWith('/maintenance')) {
      return NextResponse.rewrite(new URL('/maintenance', request.url));
    }
  }
  return NextResponse.next();
}
```

---

<!-- /ANCHOR:middleware -->
<!-- ANCHOR:quick-reference -->
## 11. QUICK REFERENCE

### Checklist: New Feature Setup

- [ ] Create route directory under `app/`
- [ ] Add `page.tsx` with proper TypeScript types
- [ ] Add `loading.tsx` for loading states
- [ ] Add `error.tsx` for error boundaries
- [ ] Create shared components in `components/`
- [ ] Add types to `types/` directory
- [ ] Configure environment variables if needed
- [ ] Add route to navigation config
- [ ] Update metadata for SEO

### File Type Reference

| Extension     | Purpose                              | Location           |
| ------------- | ------------------------------------ | ------------------ |
| `.tsx`        | React components with JSX            | `app/`, `components/` |
| `.ts`         | TypeScript (non-component)           | `lib/`, `hooks/`, `types/` |
| `.module.css` | CSS Modules (scoped styles)          | Co-located          |
| `.test.tsx`   | Component tests                      | Co-located          |
| `.test.ts`    | Utility/hook tests                   | Co-located          |

### Import Order Convention

```typescript
// 1. React and Next.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { z } from 'zod';
import { useForm } from 'react-hook-form';

// 3. Internal: UI components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// 4. Internal: Feature components
import { UserCard } from '@/components/features/users/UserCard';

// 5. Internal: Hooks and utilities
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils/cn';

// 6. Internal: Types
import type { User } from '@/types/auth';

// 7. Internal: Styles (if any)
import styles from './Component.module.css';
```

### Common Next.js Imports

```typescript
// Navigation
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { redirect, notFound } from 'next/navigation';

// Metadata
import type { Metadata, ResolvingMetadata } from 'next';

// Images and Fonts
import Image from 'next/image';
import { Inter, Roboto } from 'next/font/google';
import localFont from 'next/font/local';

// Headers and Cookies
import { headers, cookies } from 'next/headers';

// Server Actions
import { revalidatePath, revalidateTag } from 'next/cache';

// Dynamic Import
import dynamic from 'next/dynamic';
```

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

### Related References

- [Component Architecture](./component_architecture.md) - Server Components vs Client Components patterns
- [State Management](./state_management.md) - React Context, Zustand, and Jotai patterns
- [Data Fetching](./data_fetching.md) - Server Actions and React Query patterns
- [API Patterns](./api_patterns.md) - Route handlers and API design
- [Forms & Validation](./forms_validation.md) - React Hook Form and Zod integration
- [Testing Strategy](./testing_strategy.md) - React Testing Library and Playwright
<!-- /ANCHOR:related-resources -->
