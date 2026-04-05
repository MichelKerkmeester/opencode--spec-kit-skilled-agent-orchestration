/* ─────────────────────────────────────────────────────────────
   REACT DATA FETCHING PATTERNS
   Production-ready patterns with TanStack Query (React Query)
──────────────────────────────────────────────────────────────── */

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseInfiniteQueryOptions,
  type QueryKey,
  type InfiniteData,
} from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   1. QUERY CLIENT SETUP
──────────────────────────────────────────────────────────────── */

/**
 * Query Client Configuration
 *
 * Create a single QueryClient instance for your application.
 * Configure defaults for caching, retries, and error handling.
 */

// Default options for all queries
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
};

// Create query client with sensible defaults
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...defaultQueryOptions,
      },
      mutations: {
        retry: 1,
        onError: (error) => {
          console.error('Mutation error:', error);
        },
      },
    },
  });
}

// Singleton for client-side usage
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  // Server: always create a new client
  if (typeof window === 'undefined') {
    return createQueryClient();
  }

  // Browser: reuse existing client
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}

// Provider wrapper component
export { QueryClientProvider };


/* ─────────────────────────────────────────────────────────────
   2. API CLIENT & TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Type-safe API client for making HTTP requests
 */

// Base API configuration
interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

// API error type
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

// Paginated response type
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextCursor?: string;
}

// Create type-safe fetch wrapper
export function createApiClient(config: ApiConfig) {
  const { baseUrl, headers: defaultHeaders = {} } = config;

  async function request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData.details
      );
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return undefined as T;

    return JSON.parse(text) as T;
  }

  return {
    get: <T>(endpoint: string, options?: RequestInit) =>
      request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
      request<T>(endpoint, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      }),

    put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
      request<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      }),

    patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
      request<T>(endpoint, {
        ...options,
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
      }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
      request<T>(endpoint, { ...options, method: 'DELETE' }),
  };
}

// Default API client instance
export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
});


/* ─────────────────────────────────────────────────────────────
   3. CUSTOM QUERY HOOKS
──────────────────────────────────────────────────────────────── */

/**
 * Pattern for creating type-safe, reusable query hooks
 */

// Example: User entity
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

// Query key factory pattern
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

interface UserFilters {
  search?: string;
  role?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
}

// Fetch functions
async function fetchUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`);
}

async function fetchUsers(filters: UserFilters): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.role) params.set('role', filters.role);
  if (filters.status) params.set('status', filters.status);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const query = params.toString();
  return api.get<PaginatedResponse<User>>(`/users${query ? `?${query}` : ''}`);
}

// useUser hook
export function useUser(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<User, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.detail(userId!),
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
    ...options,
  });
}

// useUsers hook with filters
export function useUsers(
  filters: UserFilters = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<User>, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
    ...options,
  });
}

// Generic entity hook factory
export function createEntityHooks<T, TFilters extends object>(config: {
  entityName: string;
  fetchOne: (id: string) => Promise<T>;
  fetchMany: (filters: TFilters) => Promise<PaginatedResponse<T>>;
}) {
  const { entityName, fetchOne, fetchMany } = config;

  const keys = {
    all: [entityName] as const,
    lists: () => [...keys.all, 'list'] as const,
    list: (filters: TFilters) => [...keys.lists(), filters] as const,
    details: () => [...keys.all, 'detail'] as const,
    detail: (id: string) => [...keys.details(), id] as const,
  };

  function useOne(
    id: string | undefined,
    options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery({
      queryKey: keys.detail(id!),
      queryFn: () => fetchOne(id!),
      enabled: !!id,
      ...options,
    });
  }

  function useMany(
    filters: TFilters,
    options?: Omit<UseQueryOptions<PaginatedResponse<T>, ApiError>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery({
      queryKey: keys.list(filters),
      queryFn: () => fetchMany(filters),
      ...options,
    });
  }

  return { keys, useOne, useMany };
}


/* ─────────────────────────────────────────────────────────────
   4. MUTATION PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Type-safe mutations with optimistic updates
 */

// Mutation input types
interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  avatar?: string;
}

// API functions
async function createUser(input: CreateUserInput): Promise<User> {
  return api.post<User>('/users', input);
}

async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  return api.patch<User>(`/users/${id}`, input);
}

async function deleteUser(id: string): Promise<void> {
  return api.delete(`/users/${id}`);
}

// useCreateUser mutation
export function useCreateUser(
  options?: UseMutationOptions<User, ApiError, CreateUserInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Optionally pre-populate the detail cache
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
    },
    ...options,
  });
}

// useUpdateUser mutation with optimistic update
export function useUpdateUser(
  options?: UseMutationOptions<User, ApiError, { id: string; data: UpdateUserInput }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData<User>(userKeys.detail(id));

      // Optimistically update to the new value
      if (previousUser) {
        queryClient.setQueryData<User>(userKeys.detail(id), {
          ...previousUser,
          ...data,
        });
      }

      // Return context with the previous value
      return { previousUser };
    },

    // If mutation fails, rollback to previous value
    onError: (_error, { id }, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.detail(id), context.previousUser);
      }
    },

    // Always refetch after error or success
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },

    ...options,
  });
}

// useDeleteUser mutation
export function useDeleteUser(
  options?: UseMutationOptions<void, ApiError, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot current lists
      const previousLists = queryClient.getQueriesData<PaginatedResponse<User>>({
        queryKey: userKeys.lists(),
      });

      // Optimistically remove from all lists
      queryClient.setQueriesData<PaginatedResponse<User>>(
        { queryKey: userKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.filter((user) => user.id !== userId),
            total: old.total - 1,
          };
        }
      );

      return { previousLists };
    },

    onError: (_error, _userId, context) => {
      // Restore previous lists on error
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },

    ...options,
  });
}


/* ─────────────────────────────────────────────────────────────
   5. INFINITE SCROLL PATTERN
──────────────────────────────────────────────────────────────── */

/**
 * Cursor-based and offset-based infinite scrolling
 */

// Cursor-based pagination
interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

async function fetchUsersCursor(cursor?: string): Promise<CursorPaginatedResponse<User>> {
  const params = new URLSearchParams();
  params.set('limit', '20');
  if (cursor) params.set('cursor', cursor);

  return api.get<CursorPaginatedResponse<User>>(`/users?${params.toString()}`);
}

// useInfiniteUsers hook (cursor-based)
export function useInfiniteUsers(
  options?: Omit<
    UseInfiniteQueryOptions<CursorPaginatedResponse<User>, ApiError, InfiniteData<CursorPaginatedResponse<User>>, CursorPaginatedResponse<User>, QueryKey, string | undefined>,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >
) {
  return useInfiniteQuery({
    queryKey: [...userKeys.all, 'infinite'] as const,
    queryFn: ({ pageParam }) => fetchUsersCursor(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
    ...options,
  });
}

// Offset-based pagination
interface OffsetPaginatedResponse<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}

async function fetchUsersOffset(
  offset: number,
  limit: number
): Promise<OffsetPaginatedResponse<User>> {
  return api.get<OffsetPaginatedResponse<User>>(
    `/users?offset=${offset}&limit=${limit}`
  );
}

// useInfiniteUsersOffset hook (offset-based)
export function useInfiniteUsersOffset(
  limit = 20,
  options?: Omit<
    UseInfiniteQueryOptions<OffsetPaginatedResponse<User>, ApiError, InfiniteData<OffsetPaginatedResponse<User>>, OffsetPaginatedResponse<User>, QueryKey, number>,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >
) {
  return useInfiniteQuery({
    queryKey: [...userKeys.all, 'infinite-offset', limit] as const,
    queryFn: ({ pageParam }) => fetchUsersOffset(pageParam, limit),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    ...options,
  });
}

// Hook for infinite scroll interaction
export function useInfiniteScroll<T>(
  query: ReturnType<typeof useInfiniteQuery<unknown, unknown, InfiniteData<{ items: T[] }>>>
) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  // Flatten pages into single array
  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  // Intersection observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    items,
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}


/* ─────────────────────────────────────────────────────────────
   6. PREFETCHING PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Prefetch data for faster page transitions
 */

// Hook for prefetching user on hover
export function usePrefetchUser() {
  const queryClient = useQueryClient();

  const prefetch = useCallback(
    (userId: string) => {
      queryClient.prefetchQuery({
        queryKey: userKeys.detail(userId),
        queryFn: () => fetchUser(userId),
        staleTime: 60 * 1000, // Consider fresh for 1 minute
      });
    },
    [queryClient]
  );

  return prefetch;
}

// Server-side prefetching for Next.js
export async function prefetchUserSSR(
  queryClient: QueryClient,
  userId: string
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
  });
}

export async function prefetchUsersSSR(
  queryClient: QueryClient,
  filters: UserFilters = {}
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
  });
}

// Prefetch on route change (for Next.js App Router)
export function usePrefetchOnHover(userId: string) {
  const prefetch = usePrefetchUser();

  const handlers = useMemo(
    () => ({
      onMouseEnter: () => prefetch(userId),
      onFocus: () => prefetch(userId),
    }),
    [userId, prefetch]
  );

  return handlers;
}


/* ─────────────────────────────────────────────────────────────
   7. DEPENDENT QUERIES
──────────────────────────────────────────────────────────────── */

/**
 * Queries that depend on other queries' results
 */

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
}

// Fetch functions
async function fetchPost(id: string): Promise<Post> {
  return api.get<Post>(`/posts/${id}`);
}

async function fetchComments(postId: string): Promise<Comment[]> {
  return api.get<Comment[]>(`/posts/${postId}/comments`);
}

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
  comments: (postId: string) => [...postKeys.all, postId, 'comments'] as const,
};

// Dependent query: Comments depend on Post
export function usePostWithComments(postId: string | undefined) {
  // First query: fetch post
  const postQuery = useQuery({
    queryKey: postKeys.detail(postId!),
    queryFn: () => fetchPost(postId!),
    enabled: !!postId,
  });

  // Second query: fetch comments (depends on post existing)
  const commentsQuery = useQuery({
    queryKey: postKeys.comments(postId!),
    queryFn: () => fetchComments(postId!),
    enabled: !!postId && !!postQuery.data,
  });

  // Dependent query: fetch author (depends on post.authorId)
  const authorQuery = useQuery({
    queryKey: userKeys.detail(postQuery.data?.authorId!),
    queryFn: () => fetchUser(postQuery.data!.authorId),
    enabled: !!postQuery.data?.authorId,
  });

  return {
    post: postQuery.data,
    comments: commentsQuery.data,
    author: authorQuery.data,
    isLoading: postQuery.isLoading,
    isCommentsLoading: commentsQuery.isLoading,
    isAuthorLoading: authorQuery.isLoading,
    error: postQuery.error || commentsQuery.error || authorQuery.error,
  };
}


/* ─────────────────────────────────────────────────────────────
   8. POLLING & REAL-TIME PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Periodic data refresh patterns
 */

// Polling hook
export function usePollingUser(
  userId: string | undefined,
  pollInterval = 30000 // 30 seconds default
) {
  return useQuery({
    queryKey: userKeys.detail(userId!),
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
    refetchInterval: pollInterval,
    refetchIntervalInBackground: false, // Don't poll when tab is hidden
  });
}

// Conditional polling (poll only when specific condition is met)
interface Job {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
}

async function fetchJob(id: string): Promise<Job> {
  return api.get<Job>(`/jobs/${id}`);
}

export function useJobProgress(jobId: string | undefined) {
  return useQuery({
    queryKey: ['jobs', jobId] as const,
    queryFn: () => fetchJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      // Poll every 2 seconds while job is running
      const status = query.state.data?.status;
      if (status === 'pending' || status === 'running') {
        return 2000;
      }
      // Stop polling when complete or failed
      return false;
    },
  });
}


/* ─────────────────────────────────────────────────────────────
   9. ERROR HANDLING UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Centralized error handling patterns
 */

// Type guard for API errors
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

// Error message extraction
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

// Error status check
export function isNotFoundError(error: unknown): boolean {
  return isApiError(error) && error.status === 404;
}

export function isUnauthorizedError(error: unknown): boolean {
  return isApiError(error) && error.status === 401;
}

export function isForbiddenError(error: unknown): boolean {
  return isApiError(error) && error.status === 403;
}

// Global error handler for mutations
export function createMutationErrorHandler(
  showToast: (message: string, type: 'error' | 'warning') => void
) {
  return (error: unknown) => {
    const message = getErrorMessage(error);

    if (isUnauthorizedError(error)) {
      // Handle auth errors
      showToast('Please sign in to continue', 'warning');
      // Redirect to login...
    } else if (isForbiddenError(error)) {
      showToast('You do not have permission to perform this action', 'warning');
    } else {
      showToast(message, 'error');
    }
  };
}


/* ─────────────────────────────────────────────────────────────
   10. CACHE UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Cache manipulation helpers
 */

// Set cached data directly
export function useSetUserCache() {
  const queryClient = useQueryClient();

  return useCallback(
    (user: User) => {
      queryClient.setQueryData(userKeys.detail(user.id), user);
    },
    [queryClient]
  );
}

// Get cached data
export function useGetCachedUser(userId: string) {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<User>(userKeys.detail(userId));
}

// Invalidate queries
export function useInvalidateUsers() {
  const queryClient = useQueryClient();

  return useCallback(
    (options?: { userId?: string; listsOnly?: boolean }) => {
      if (options?.userId) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(options.userId) });
      } else if (options?.listsOnly) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      } else {
        queryClient.invalidateQueries({ queryKey: userKeys.all });
      }
    },
    [queryClient]
  );
}

// Reset queries (clear cache)
export function useResetQueries() {
  const queryClient = useQueryClient();

  return useCallback(
    (queryKey?: QueryKey) => {
      if (queryKey) {
        queryClient.resetQueries({ queryKey });
      } else {
        queryClient.resetQueries();
      }
    },
    [queryClient]
  );
}


/* ─────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  // Setup
  createQueryClient,
  getQueryClient,
  // API client
  createApiClient,
  api,
  ApiError,
  // Query keys
  userKeys,
  postKeys,
  // Custom hooks - Users
  useUser,
  useUsers,
  useInfiniteUsers,
  useInfiniteUsersOffset,
  usePrefetchUser,
  usePollingUser,
  // Custom hooks - Mutations
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  // Custom hooks - Posts
  usePostWithComments,
  // Custom hooks - Jobs
  useJobProgress,
  // Utilities
  createEntityHooks,
  useInfiniteScroll,
  usePrefetchOnHover,
  // SSR
  prefetchUserSSR,
  prefetchUsersSSR,
  // Error handling
  isApiError,
  getErrorMessage,
  isNotFoundError,
  isUnauthorizedError,
  isForbiddenError,
  createMutationErrorHandler,
  // Cache utilities
  useSetUserCache,
  useGetCachedUser,
  useInvalidateUsers,
  useResetQueries,
};

export type {
  ApiConfig,
  ApiResponse,
  PaginatedResponse,
  CursorPaginatedResponse,
  OffsetPaginatedResponse,
  User,
  UserFilters,
  CreateUserInput,
  UpdateUserInput,
  Post,
  Comment,
  Job,
};
