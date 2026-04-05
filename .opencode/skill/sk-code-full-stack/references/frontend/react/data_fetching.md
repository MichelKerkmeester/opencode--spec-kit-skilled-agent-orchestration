---
title: Data Fetching
description: React Query / TanStack Query patterns, SWR patterns, Next.js Server Actions, error handling, loading states, optimistic updates, and cache invalidation strategies.
---

# Data Fetching

React Query / TanStack Query patterns, SWR patterns, Next.js Server Actions, error handling, loading states, optimistic updates, and cache invalidation strategies.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on data fetching strategies for React and Next.js applications, covering client-side fetching with React Query/SWR, server-side fetching with Server Components, and Server Actions for mutations.

### When to Use

- Fetching and caching server data
- Implementing optimistic updates
- Managing loading and error states
- Choosing between client and server fetching
- Invalidating and refetching data

### Prerequisites

- **[Component Architecture](./component_architecture.md)**: Server vs Client Components
- **[State Management](./state_management.md)**: Server state vs client state separation
- **[API Patterns](./api_patterns.md)**: API design and route handlers

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:data-fetching-strategies -->
## 2. DATA FETCHING STRATEGIES

### Strategy Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA FETCHING STRATEGIES                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SERVER COMPONENTS (Default in Next.js 14+)                     │
│  ───────────────────────────────────────────                    │
│  • Fetch data on the server                                     │
│  • No client-side JavaScript                                    │
│  • Automatic request deduplication                              │
│  • Built-in caching with revalidation                           │
│                                                                 │
│  Best for: Initial page data, SEO content, static data          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENT COMPONENTS + REACT QUERY / SWR                          │
│  ─────────────────────────────────────────                      │
│  • Fetch data in browser                                        │
│  • Real-time updates, polling                                   │
│  • Optimistic updates                                           │
│  • Offline support                                              │
│                                                                 │
│  Best for: Interactive data, user-specific, real-time           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SERVER ACTIONS                                                 │
│  ──────────────                                                 │
│  • Mutations (create, update, delete)                           │
│  • Form submissions                                             │
│  • Progressive enhancement                                      │
│  • Works without JavaScript                                     │
│                                                                 │
│  Best for: Form submissions, mutations, data changes            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Decision Matrix

| Scenario                       | Strategy                        | Why                                    |
| ------------------------------ | ------------------------------- | -------------------------------------- |
| Initial page load              | Server Component                | Fast, SEO-friendly, no waterfall       |
| User dashboard                 | Server Component + React Query  | Initial SSR + client updates           |
| Real-time chat                 | React Query + WebSocket         | Needs live updates                     |
| Form submission                | Server Action                   | Progressive enhancement                |
| Infinite scroll                | React Query                     | Client-side pagination                 |
| Static content                 | Server Component (cached)       | Best performance                       |
| User preferences               | React Query (persisted)         | User-specific, needs caching           |

---

<!-- /ANCHOR:data-fetching-strategies -->
<!-- ANCHOR:server-component-data-fetching -->
## 3. SERVER COMPONENT DATA FETCHING

### Basic Server Fetch

```typescript
// app/products/page.tsx (Server Component)
import { db } from '@/lib/db/prisma';
import { ProductCard } from '@/components/features/products/ProductCard';

// This runs on the server only
export default async function ProductsPage() {
  // Direct database access
  const products = await db.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Parallel Data Fetching

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { getUser, getStats, getRecentActivity } from '@/lib/api/dashboard';

export default async function DashboardPage() {
  // Parallel fetches - don't await individually
  const userPromise = getUser();
  const statsPromise = getStats();
  const activityPromise = getRecentActivity();

  // Await all at once
  const [user, stats, activity] = await Promise.all([
    userPromise,
    statsPromise,
    activityPromise,
  ]);

  return (
    <div>
      <UserHeader user={user} />
      <StatsGrid stats={stats} />
      <ActivityFeed activity={activity} />
    </div>
  );
}

// Alternative: Streaming with Suspense
export default async function DashboardPage() {
  // User data needed for layout - fetch immediately
  const user = await getUser();

  return (
    <div>
      <UserHeader user={user} />

      {/* Stats can stream in */}
      <Suspense fallback={<StatsSkeleton />}>
        <AsyncStats />
      </Suspense>

      {/* Activity can stream in */}
      <Suspense fallback={<ActivitySkeleton />}>
        <AsyncActivity />
      </Suspense>
    </div>
  );
}

async function AsyncStats() {
  const stats = await getStats();
  return <StatsGrid stats={stats} />;
}

async function AsyncActivity() {
  const activity = await getRecentActivity();
  return <ActivityFeed activity={activity} />;
}
```

### Caching and Revalidation

```typescript
// lib/api/products.ts
import { unstable_cache } from 'next/cache';

// Cached fetch with tags
export const getProducts = unstable_cache(
  async (category?: string) => {
    const products = await db.product.findMany({
      where: category ? { category: { slug: category } } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return products;
  },
  ['products'], // Cache key
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['products'], // Tag for manual revalidation
  }
);

// Fetch with fetch() caching
async function fetchProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: {
      revalidate: 3600, // Cache for 1 hour
      tags: ['products'],
    },
  });

  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// No caching (dynamic data)
async function fetchUserCart(userId: string) {
  const res = await fetch(`https://api.example.com/cart/${userId}`, {
    cache: 'no-store', // Always fresh
  });

  return res.json();
}
```

### Revalidation Patterns

```typescript
// app/actions/product.ts
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateProduct(id: string, data: ProductUpdate) {
  await db.product.update({
    where: { id },
    data,
  });

  // Revalidate by tag (preferred - more granular)
  revalidateTag('products');
  revalidateTag(`product-${id}`);

  // Or revalidate by path
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
}

export async function deleteProduct(id: string) {
  await db.product.delete({ where: { id } });

  // Revalidate entire products section
  revalidateTag('products');
  revalidatePath('/products', 'layout');
}
```

---

<!-- /ANCHOR:server-component-data-fetching -->
<!-- ANCHOR:react-query-tanstack-query -->
## 4. REACT QUERY (TANSTACK QUERY)

### Setup and Configuration

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error instanceof Error && error.message.includes('4')) {
            return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// app/providers.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { makeQueryClient } from '@/lib/query-client';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Basic Queries

```typescript
'use client';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

// Standard query
function ProductList() {
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json() as Promise<Product[]>;
    },
  });

  if (isLoading) return <ProductsSkeleton />;
  if (isError) return <ErrorMessage error={error} retry={refetch} />;

  return (
    <div className="grid grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Suspense query (use with <Suspense> boundary)
function ProductListSuspense() {
  const { data: products } = useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // No loading check needed - Suspense handles it
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Query with Parameters

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

interface UseProductsOptions {
  category?: string;
  sortBy?: 'price' | 'name' | 'date';
  page?: number;
  limit?: number;
}

function useProducts(options: UseProductsOptions = {}) {
  const { category, sortBy = 'date', page = 1, limit = 20 } = options;

  return useQuery({
    // Query key includes all dependencies
    queryKey: ['products', { category, sortBy, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(category && { category }),
        sortBy,
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json() as Promise<{
        products: Product[];
        total: number;
        hasMore: boolean;
      }>;
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

// Usage
function ProductsPage() {
  const [category, setCategory] = useState<string>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useProducts({
    category,
    page,
    limit: 20,
  });

  return (
    <>
      <CategoryFilter value={category} onChange={setCategory} />
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <ProductGrid products={data?.products ?? []} />
          {isFetching && <LoadingIndicator />}
          <Pagination
            page={page}
            hasMore={data?.hasMore ?? false}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );
}
```

### Dependent Queries

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  // First query
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Dependent query - only runs when user exists
  const { data: orders } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => fetchOrders(user!.id),
    enabled: !!user, // Only run when user is available
  });

  // Another dependent query
  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', user?.preferences],
    queryFn: () => fetchRecommendations(user!.preferences),
    enabled: !!user?.preferences,
  });

  // ...
}
```

### Infinite Queries

```typescript
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

function InfiniteProductList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/products?cursor=${pageParam}&limit=20`);
      return res.json() as Promise<{
        products: Product[];
        nextCursor: string | null;
      }>;
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Intersection observer for infinite scroll
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <ProductsSkeleton />;
  if (isError) return <ErrorMessage />;

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Sentinel element for intersection observer */}
      <div ref={ref} className="h-10">
        {isFetchingNextPage && <LoadingSpinner />}
      </div>
    </>
  );
}
```

---

<!-- /ANCHOR:react-query-tanstack-query -->
<!-- ANCHOR:mutations-and-optimistic-updates -->
## 5. MUTATIONS AND OPTIMISTIC UPDATES

### Basic Mutation

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

function AddProductForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newProduct: CreateProductInput) => {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error('Failed to create product');
      return res.json() as Promise<Product>;
    },
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });

      // Or update cache directly
      queryClient.setQueryData(['products'], (old: Product[] | undefined) =>
        old ? [...old, newProduct] : [newProduct]
      );

      // Also update the individual product cache
      queryClient.setQueryData(['product', newProduct.id], newProduct);
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
    },
  });

  const handleSubmit = (data: CreateProductInput) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Product'}
      </button>
      {mutation.isError && <ErrorMessage error={mutation.error} />}
    </form>
  );
}
```

### Optimistic Updates

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

function ToggleFavorite({ productId }: { productId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (isFavorite: boolean) => {
      const res = await fetch(`/api/products/${productId}/favorite`, {
        method: isFavorite ? 'POST' : 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to update favorite');
      return res.json();
    },
    onMutate: async (isFavorite) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['product', productId] });

      // Snapshot previous value
      const previousProduct = queryClient.getQueryData<Product>(['product', productId]);

      // Optimistically update
      queryClient.setQueryData<Product>(['product', productId], (old) =>
        old ? { ...old, isFavorite } : old
      );

      // Return context for rollback
      return { previousProduct };
    },
    onError: (err, isFavorite, context) => {
      // Rollback on error
      if (context?.previousProduct) {
        queryClient.setQueryData(['product', productId], context.previousProduct);
      }
    },
    onSettled: () => {
      // Refetch to ensure server state
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });

  const product = queryClient.getQueryData<Product>(['product', productId]);

  return (
    <button
      onClick={() => mutation.mutate(!product?.isFavorite)}
      disabled={mutation.isPending}
    >
      {product?.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
  );
}
```

### Optimistic Update for Lists

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

function DeleteProduct({ productId }: { productId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previousProducts = queryClient.getQueryData<Product[]>(['products']);

      // Optimistically remove from list
      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.filter((p) => p.id !== productId)
      );

      return { previousProducts };
    },
    onError: (err, variables, context) => {
      // Rollback
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

<!-- /ANCHOR:mutations-and-optimistic-updates -->
<!-- ANCHOR:server-actions -->
## 6. SERVER ACTIONS

### Basic Server Action

```typescript
// app/actions/product.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
});

export async function createProduct(formData: FormData) {
  // Auth check
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  // Validate input
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: Number(formData.get('price')),
    categoryId: formData.get('categoryId'),
  };

  const validatedData = createProductSchema.parse(rawData);

  // Create product
  const product = await db.product.create({
    data: {
      ...validatedData,
      createdById: session.user.id,
    },
  });

  // Revalidate and redirect
  revalidatePath('/products');
  redirect(`/products/${product.id}`);
}
```

### Server Action with Return Value

```typescript
// app/actions/auth.ts
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { createSession, verifyCredentials } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function login(
  prevState: ActionResult<{ user: User }> | null,
  formData: FormData
): Promise<ActionResult<{ user: User }>> {
  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const { email, password } = loginSchema.parse(rawData);

    const user = await verifyCredentials(email, password);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const session = await createSession(user.id);

    cookies().set('session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, data: { user } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Something went wrong' };
  }
}
```

### Using Server Actions with useFormState

```typescript
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/app/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Signing in...' : 'Sign In'}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(login, null);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>

      {state?.success === false && (
        <p className="text-red-500">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
```

### Server Action with Optimistic Updates

```typescript
'use client';

import { useOptimistic, useTransition } from 'react';
import { addComment } from '@/app/actions/comments';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  isPending?: boolean;
}

export function Comments({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state: Comment[], newComment: Comment) => [...state, newComment]
  );

  const handleSubmit = async (formData: FormData) => {
    const content = formData.get('content') as string;

    // Add optimistic comment
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      isPending: true,
    };

    startTransition(async () => {
      addOptimisticComment(optimisticComment);
      await addComment(postId, formData);
    });
  };

  return (
    <div>
      <ul>
        {optimisticComments.map((comment) => (
          <li
            key={comment.id}
            className={comment.isPending ? 'opacity-50' : ''}
          >
            {comment.content}
            {comment.isPending && <span> (sending...)</span>}
          </li>
        ))}
      </ul>

      <form action={handleSubmit}>
        <textarea name="content" required />
        <button type="submit" disabled={isPending}>
          Add Comment
        </button>
      </form>
    </div>
  );
}
```

---

<!-- /ANCHOR:server-actions -->
<!-- ANCHOR:swr-patterns -->
## 7. SWR PATTERNS

### Basic SWR Setup

```typescript
'use client';

import useSWR from 'swr';

// Global fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

function ProductList() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    '/api/products',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  if (isLoading) return <Skeleton />;
  if (error) return <Error error={error} />;

  return (
    <>
      <button onClick={() => mutate()}>Refresh</button>
      <ProductGrid products={data ?? []} />
    </>
  );
}
```

### SWR with TypeScript

```typescript
'use client';

import useSWR, { type SWRConfiguration } from 'swr';

interface UseProductsOptions extends SWRConfiguration<Product[]> {
  category?: string;
}

function useProducts(options: UseProductsOptions = {}) {
  const { category, ...swrOptions } = options;

  const key = category ? `/api/products?category=${category}` : '/api/products';

  return useSWR<Product[]>(key, fetcher, {
    revalidateOnFocus: false,
    ...swrOptions,
  });
}

// Usage
function Products() {
  const { data: products, error } = useProducts({
    category: 'electronics',
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  // ...
}
```

### SWR Mutations

```typescript
'use client';

import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

// Mutation function
async function updateProduct(
  url: string,
  { arg }: { arg: { id: string; data: Partial<Product> } }
) {
  const res = await fetch(`${url}/${arg.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg.data),
  });
  return res.json();
}

function ProductEditor({ productId }: { productId: string }) {
  const { data: product } = useSWR<Product>(`/api/products/${productId}`);
  const { mutate } = useSWRConfig();

  const { trigger, isMutating } = useSWRMutation(
    '/api/products',
    updateProduct,
    {
      onSuccess: () => {
        // Revalidate product list
        mutate('/api/products');
      },
    }
  );

  const handleUpdate = async (data: Partial<Product>) => {
    await trigger({ id: productId, data });
  };

  // ...
}
```

### SWR Optimistic Updates

```typescript
'use client';

import useSWR, { useSWRConfig } from 'swr';

function ToggleFavorite({ productId }: { productId: string }) {
  const { data: product, mutate } = useSWR<Product>(`/api/products/${productId}`);
  const { mutate: globalMutate } = useSWRConfig();

  const toggle = async () => {
    const newIsFavorite = !product?.isFavorite;

    // Optimistic update
    mutate(
      { ...product!, isFavorite: newIsFavorite },
      false // Don't revalidate yet
    );

    try {
      await fetch(`/api/products/${productId}/favorite`, {
        method: newIsFavorite ? 'POST' : 'DELETE',
      });

      // Revalidate after success
      mutate();
      globalMutate('/api/products'); // Update list too
    } catch (error) {
      // Revert on error
      mutate();
    }
  };

  return (
    <button onClick={toggle}>
      {product?.isFavorite ? 'Unfavorite' : 'Favorite'}
    </button>
  );
}
```

---

<!-- /ANCHOR:swr-patterns -->
<!-- ANCHOR:error-handling -->
## 8. ERROR HANDLING

### Error Boundary Pattern

```typescript
'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export function QueryBoundary({ children }: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={reset}
    >
      {children}
    </ErrorBoundary>
  );
}

// Usage
function Page() {
  return (
    <QueryBoundary>
      <ProductList />
    </QueryBoundary>
  );
}
```

### Typed Error Handling

```typescript
// lib/api/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: Response, message?: string): ApiError {
    return new ApiError(
      message ?? response.statusText,
      response.status
    );
  }
}

// lib/api/fetcher.ts
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new ApiError(
      error.message ?? 'Request failed',
      res.status,
      error.code
    );
  }

  return res.json();
}

// Usage in component
function ProductList() {
  const { data, error, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiFetch<Product[]>('/api/products'),
  });

  if (isError && error instanceof ApiError) {
    if (error.status === 401) {
      return <LoginPrompt />;
    }
    if (error.status === 403) {
      return <PermissionDenied />;
    }
    if (error.status === 404) {
      return <NotFound />;
    }
    return <GenericError message={error.message} />;
  }

  // ...
}
```

### Retry Logic

```typescript
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      return false;
    }
    // Retry up to 3 times for other errors
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

---

<!-- /ANCHOR:error-handling -->
<!-- ANCHOR:loading-states -->
## 9. LOADING STATES

### Skeleton Loading

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/Skeleton';

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="product-card">
      <Skeleton className="w-full h-48" />
      <Skeleton className="h-6 w-3/4 mt-2" />
      <Skeleton className="h-4 w-1/4 mt-1" />
    </div>
  );
}

function ProductGrid() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Progressive Loading

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

function Dashboard() {
  // Critical data - show skeleton
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  // Secondary data - use placeholder
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    placeholderData: { views: 0, sales: 0, revenue: 0 },
  });

  // Non-critical - only show when ready
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: !!user, // Only fetch after user loads
  });

  if (isUserLoading) return <DashboardSkeleton />;

  return (
    <div>
      <Header user={user} notifications={notifications} />
      <StatsGrid stats={stats} isLoading={isStatsLoading} />
    </div>
  );
}
```

---

<!-- /ANCHOR:loading-states -->
<!-- ANCHOR:cache-invalidation -->
## 10. CACHE INVALIDATION

### Manual Invalidation

```typescript
'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';

function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetch(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: (_, deletedId) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['products'] });

      // Remove from cache
      queryClient.removeQueries({ queryKey: ['product', deletedId] });

      // Or update cache directly
      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.filter((p) => p.id !== deletedId)
      );
    },
  });
}
```

### Prefetching

```typescript
'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

function ProductLink({ product }: { product: Product }) {
  const queryClient = useQueryClient();

  const prefetchProduct = () => {
    queryClient.prefetchQuery({
      queryKey: ['product', product.id],
      queryFn: () => fetchProduct(product.id),
      staleTime: 60000, // Consider fresh for 1 minute
    });
  };

  return (
    <Link
      href={`/products/${product.id}`}
      onMouseEnter={prefetchProduct}
      onFocus={prefetchProduct}
    >
      {product.name}
    </Link>
  );
}
```

### Background Refetching

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

function LiveStats() {
  const { data } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: true, // Even when tab is not focused
  });

  return <StatsDisplay stats={data} />;
}

function Notifications() {
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    staleTime: 0, // Always considered stale
  });

  return <NotificationList notifications={data} />;
}
```

---

<!-- /ANCHOR:cache-invalidation -->
<!-- ANCHOR:quick-reference -->
## 11. QUICK REFERENCE

### React Query Cheatsheet

```typescript
// Queries
useQuery({ queryKey, queryFn, ...options })
useSuspenseQuery({ queryKey, queryFn }) // For Suspense
useQueries({ queries: [...] }) // Multiple queries
useInfiniteQuery({ queryKey, queryFn, getNextPageParam })

// Mutations
useMutation({ mutationFn, onSuccess, onError, onMutate, onSettled })

// Query Client
const queryClient = useQueryClient()
queryClient.invalidateQueries({ queryKey })
queryClient.setQueryData(queryKey, updater)
queryClient.getQueryData(queryKey)
queryClient.prefetchQuery({ queryKey, queryFn })
queryClient.removeQueries({ queryKey })

// Key Options
staleTime: number          // How long data is fresh
gcTime: number             // How long to keep in cache
refetchOnWindowFocus       // Refetch when tab focused
refetchInterval: number    // Polling interval
enabled: boolean           // Conditional fetching
placeholderData            // Placeholder while loading
retry: number | function   // Retry logic
```

### Server Actions Cheatsheet

```typescript
// Define action
'use server'
export async function action(formData: FormData) { }

// With return type
export async function action(prevState, formData): Promise<Result> { }

// Usage in components
<form action={action}>
useFormState(action, initialState)
useFormStatus() // { pending, data, method, action }

// Revalidation
revalidatePath(path, type?)
revalidateTag(tag)
```

### Checklist: Data Fetching

- [ ] Determine if data is server or client state
- [ ] Choose appropriate fetching strategy
- [ ] Implement loading states (skeleton/placeholder)
- [ ] Handle errors gracefully
- [ ] Set appropriate cache/stale times
- [ ] Add optimistic updates for mutations
- [ ] Configure retry logic for failures
- [ ] Prefetch on hover/focus for navigation

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

### Related References

- [Component Architecture](./component_architecture.md) - Server vs Client Components
- [State Management](./state_management.md) - Separating server and client state
- [API Patterns](./api_patterns.md) - Route handlers and API design
- [Forms & Validation](./forms_validation.md) - Form submission with Server Actions
<!-- /ANCHOR:related-resources -->
