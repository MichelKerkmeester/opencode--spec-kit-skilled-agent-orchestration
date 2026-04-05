---
title: State Management
description: React Context patterns, Zustand setup, Jotai atomic state, Redux Toolkit integration, server vs client state separation, and form state management patterns.
---

# State Management

React Context patterns, Zustand setup, Jotai atomic state, Redux Toolkit integration, server vs client state separation, and form state management patterns.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on state management strategies for React applications, covering local component state, global state solutions, server state management, and when to use each approach.

### When to Use

- Choosing between state management solutions
- Setting up global state with Zustand or Jotai
- Managing complex form state
- Separating server state from client state
- Implementing React Context patterns

### Prerequisites

- **[Component Architecture](./component_architecture.md)**: Server vs Client Components
- **[Data Fetching](./data_fetching.md)**: React Query for server state
- **[Forms & Validation](./forms_validation.md)**: Form state with React Hook Form

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:state-categories -->
## 2. STATE CATEGORIES

### Understanding State Types

```
┌─────────────────────────────────────────────────────────────────┐
│                        STATE TYPES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SERVER STATE                    CLIENT STATE                   │
│  ─────────────                   ────────────                   │
│  • Data from API/database        • UI state (modals, tabs)      │
│  • Needs caching                 • Form inputs                  │
│  • Can become stale              • User preferences             │
│  • Shared across users           • Temporary/ephemeral          │
│                                                                 │
│  → React Query / SWR             → Zustand / Jotai / Context    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LOCAL STATE                     GLOBAL STATE                   │
│  ───────────                     ────────────                   │
│  • Single component              • Shared across components     │
│  • Not shared                    • App-wide concerns            │
│  • Toggle, input value           • Auth, theme, cart            │
│                                                                 │
│  → useState / useReducer         → Context / Zustand / Jotai    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Decision Matrix

| State Type            | Scope              | Solution                    | Example                        |
| --------------------- | ------------------ | --------------------------- | ------------------------------ |
| Local UI              | Single component   | useState                    | Modal open/closed              |
| Complex local         | Single component   | useReducer                  | Form with many fields          |
| Shared UI             | Component tree     | Context                     | Theme, sidebar state           |
| Global client         | App-wide           | Zustand / Jotai             | Auth, cart, notifications      |
| Server data           | App-wide           | React Query / SWR           | User data, products            |
| URL state             | Route-based        | nuqs / searchParams         | Filters, pagination            |
| Form state            | Form scope         | React Hook Form             | Input values, validation       |

---

<!-- /ANCHOR:state-categories -->
<!-- ANCHOR:react-context -->
## 3. REACT CONTEXT

### Basic Context Pattern

```typescript
'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Define the context value type
interface ThemeContextValue {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

// 2. Create context with null default
const ThemeContext = createContext<ThemeContextValue | null>(null);

// 3. Custom hook with type safety
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 4. Provider component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Context with Reducer

```typescript
'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';

// State type
interface NotificationState {
  notifications: Notification[];
  maxVisible: number;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Action types
type NotificationAction =
  | { type: 'ADD'; payload: Omit<Notification, 'id'> }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR_ALL' };

// Reducer
function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { ...action.payload, id: crypto.randomUUID() },
        ].slice(-state.maxVisible),
      };
    case 'REMOVE':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'CLEAR_ALL':
      return { ...state, notifications: [] };
    default:
      return state;
  }
}

// Context
interface NotificationContextValue {
  state: NotificationState;
  dispatch: Dispatch<NotificationAction>;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// Provider
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    maxVisible: 5,
  });

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    dispatch({ type: 'ADD', payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE', payload: id });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  return (
    <NotificationContext.Provider
      value={{ state, dispatch, addNotification, removeNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
```

### Context Performance Optimization

```typescript
'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';

// Split context for value and actions (prevents unnecessary rerenders)
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthStateContext = createContext<AuthState | null>(null);
const AuthActionsContext = createContext<AuthActions | null>(null);

export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (!context) throw new Error('useAuthState must be used within AuthProvider');
  return context;
}

export function useAuthActions() {
  const context = useContext(AuthActionsContext);
  if (!context) throw new Error('useAuthActions must be used within AuthProvider');
  return context;
}

// Combined hook for convenience
export function useAuth() {
  return { ...useAuthState(), ...useAuthActions() };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Memoize state value
  const state = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: !!user,
    }),
    [user]
  );

  // Memoize actions (stable references)
  const login = useCallback(async (credentials: Credentials) => {
    const user = await authApi.login(credentials);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const actions = useMemo<AuthActions>(
    () => ({ login, logout, updateUser }),
    [login, logout, updateUser]
  );

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
}
```

### When to Use Context

#### ✅ ALWAYS

- Theme, locale, auth state (truly global, low update frequency)
- When prop drilling becomes excessive (3+ levels)
- Dependency injection (providing services/configs)

#### ❌ NEVER

- High-frequency updates (use Zustand/Jotai instead)
- Complex state logic (consider dedicated state library)
- Server state (use React Query/SWR)

---

<!-- /ANCHOR:react-context -->
<!-- ANCHOR:zustand -->
## 4. ZUSTAND

### Why Zustand

- Minimal API, no boilerplate
- No providers needed (can access store anywhere)
- Built-in devtools support
- TypeScript-first
- Supports middleware (persist, immer, devtools)

### Basic Store Setup

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,

        // Actions
        setUser: (user) =>
          set({ user, isAuthenticated: !!user }, false, 'setUser'),

        login: async (credentials) => {
          set({ isLoading: true }, false, 'login/start');
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              body: JSON.stringify(credentials),
            });
            const user = await response.json();
            set({ user, isAuthenticated: true, isLoading: false }, false, 'login/success');
          } catch (error) {
            set({ isLoading: false }, false, 'login/error');
            throw error;
          }
        },

        logout: async () => {
          await fetch('/api/auth/logout', { method: 'POST' });
          set({ user: null, isAuthenticated: false }, false, 'logout');
        },

        updateProfile: (updates) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...updates } : null,
            }),
            false,
            'updateProfile'
          ),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user }), // Only persist user
      }
    ),
    { name: 'AuthStore' }
  )
);
```

### Store with Slices Pattern

```typescript
// stores/useAppStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Define slice types
interface CartSlice {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

interface UISlice {
  isSidebarOpen: boolean;
  isCartOpen: boolean;
  toggleSidebar: () => void;
  toggleCart: () => void;
  closeSidebar: () => void;
  closeCart: () => void;
}

type AppState = CartSlice & UISlice;

// Create slices
const createCartSlice = (set: any, get: any): CartSlice => ({
  items: [],

  addItem: (item) =>
    set((state: AppState) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    }),

  removeItem: (id) =>
    set((state: AppState) => {
      state.items = state.items.filter((i) => i.id !== id);
    }),

  updateQuantity: (id, quantity) =>
    set((state: AppState) => {
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
    }),

  clearCart: () =>
    set((state: AppState) => {
      state.items = [];
    }),

  getTotalItems: () => get().items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0),
});

const createUISlice = (set: any): UISlice => ({
  isSidebarOpen: false,
  isCartOpen: false,

  toggleSidebar: () =>
    set((state: AppState) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    }),

  toggleCart: () =>
    set((state: AppState) => {
      state.isCartOpen = !state.isCartOpen;
    }),

  closeSidebar: () =>
    set((state: AppState) => {
      state.isSidebarOpen = false;
    }),

  closeCart: () =>
    set((state: AppState) => {
      state.isCartOpen = false;
    }),
});

// Combined store
export const useAppStore = create<AppState>()(
  devtools(
    immer((set, get) => ({
      ...createCartSlice(set, get),
      ...createUISlice(set),
    })),
    { name: 'AppStore' }
  )
);

// Selectors (for granular subscriptions)
export const useCartItems = () => useAppStore((state) => state.items);
export const useCartTotal = () => useAppStore((state) => state.getTotalPrice());
export const useIsSidebarOpen = () => useAppStore((state) => state.isSidebarOpen);
```

### Zustand with TypeScript Selectors

```typescript
// stores/useProductStore.ts
import { create } from 'zustand';
import { createSelectors } from '@/lib/store-utils';

interface ProductState {
  products: Product[];
  filters: {
    category: string | null;
    priceRange: [number, number];
    sortBy: 'price' | 'name' | 'date';
  };
  setProducts: (products: Product[]) => void;
  setFilter: <K extends keyof ProductState['filters']>(
    key: K,
    value: ProductState['filters'][K]
  ) => void;
  resetFilters: () => void;
}

const initialFilters = {
  category: null,
  priceRange: [0, 1000] as [number, number],
  sortBy: 'date' as const,
};

const useProductStoreBase = create<ProductState>((set) => ({
  products: [],
  filters: initialFilters,

  setProducts: (products) => set({ products }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: initialFilters }),
}));

// Auto-generated selectors
export const useProductStore = createSelectors(useProductStoreBase);

// Usage:
// const products = useProductStore.use.products();
// const category = useProductStore.use.filters().category;

// lib/store-utils.ts
type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export function createSelectors<S extends { getState: () => object }>(
  store: S
): WithSelectors<S> {
  const storeIn = store as any;
  storeIn.use = {};
  for (const key of Object.keys(store.getState())) {
    storeIn.use[key] = () => storeIn((s: any) => s[key]);
  }
  return storeIn;
}
```

### Zustand Async Actions

```typescript
// stores/useDataStore.ts
import { create } from 'zustand';

interface DataState {
  data: Item[];
  isLoading: boolean;
  error: Error | null;
  fetchData: () => Promise<void>;
  createItem: (item: Omit<Item, 'id'>) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  data: [],
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/items');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      set({ data, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  createItem: async (newItem) => {
    const response = await fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify(newItem),
    });
    const item = await response.json();

    // Optimistic update
    set((state) => ({ data: [...state.data, item] }));

    return item;
  },

  deleteItem: async (id) => {
    // Optimistic update
    const previousData = get().data;
    set((state) => ({
      data: state.data.filter((item) => item.id !== id),
    }));

    try {
      await fetch(`/api/items/${id}`, { method: 'DELETE' });
    } catch (error) {
      // Rollback on error
      set({ data: previousData });
      throw error;
    }
  },
}));
```

---

<!-- /ANCHOR:zustand -->
<!-- ANCHOR:jotai-atomic-state -->
## 5. JOTAI (ATOMIC STATE)

### Why Jotai

- Atomic state (each piece of state is independent)
- Derived state is automatic and efficient
- Works great with React Suspense
- Minimal re-renders (components only update when their atoms change)
- Perfect for fine-grained state

### Basic Atoms

```typescript
// atoms/cartAtoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Primitive atom
export const cartOpenAtom = atom(false);

// Atom with localStorage persistence
export const cartItemsAtom = atomWithStorage<CartItem[]>('cart-items', []);

// Read-only derived atom
export const cartTotalAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

export const cartItemCountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((sum, item) => sum + item.quantity, 0);
});

// Write-only atom (action)
export const addToCartAtom = atom(null, (get, set, newItem: CartItem) => {
  const items = get(cartItemsAtom);
  const existingIndex = items.findIndex((i) => i.id === newItem.id);

  if (existingIndex >= 0) {
    const updated = [...items];
    updated[existingIndex].quantity += newItem.quantity;
    set(cartItemsAtom, updated);
  } else {
    set(cartItemsAtom, [...items, newItem]);
  }
});

// Read-write atom
export const cartWithActionsAtom = atom(
  (get) => get(cartItemsAtom),
  (get, set, action: CartAction) => {
    const items = get(cartItemsAtom);

    switch (action.type) {
      case 'add':
        set(addToCartAtom, action.item);
        break;
      case 'remove':
        set(cartItemsAtom, items.filter((i) => i.id !== action.id));
        break;
      case 'updateQuantity':
        set(
          cartItemsAtom,
          items.map((i) =>
            i.id === action.id ? { ...i, quantity: action.quantity } : i
          )
        );
        break;
      case 'clear':
        set(cartItemsAtom, []);
        break;
    }
  }
);

type CartAction =
  | { type: 'add'; item: CartItem }
  | { type: 'remove'; id: string }
  | { type: 'updateQuantity'; id: string; quantity: number }
  | { type: 'clear' };
```

### Async Atoms

```typescript
// atoms/userAtoms.ts
import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';

// Async atom with fetch
export const userAtom = atom(async () => {
  const response = await fetch('/api/user');
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json() as Promise<User>;
});

// Atom that depends on async atom
export const userNameAtom = atom(async (get) => {
  const user = await get(userAtom);
  return user.name;
});

// Using with TanStack Query
export const userQueryAtom = atomWithQuery(() => ({
  queryKey: ['user'],
  queryFn: async () => {
    const res = await fetch('/api/user');
    return res.json();
  },
}));

// Derived from query atom
export const userRoleAtom = atom((get) => {
  const { data } = get(userQueryAtom);
  return data?.role ?? 'guest';
});
```

### Atom Families

```typescript
// atoms/todoAtoms.ts
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// List of todo IDs
export const todoIdsAtom = atom<string[]>([]);

// Atom family for individual todos
export const todoAtomFamily = atomFamily((id: string) =>
  atom<Todo>({
    id,
    text: '',
    completed: false,
  })
);

// Derived atom for all todos
export const allTodosAtom = atom((get) => {
  const ids = get(todoIdsAtom);
  return ids.map((id) => get(todoAtomFamily(id)));
});

// Derived atom for completed count
export const completedCountAtom = atom((get) => {
  const todos = get(allTodosAtom);
  return todos.filter((t) => t.completed).length;
});

// Actions
export const addTodoAtom = atom(null, (get, set, text: string) => {
  const id = crypto.randomUUID();
  set(todoIdsAtom, [...get(todoIdsAtom), id]);
  set(todoAtomFamily(id), { id, text, completed: false });
});

export const toggleTodoAtom = atom(null, (get, set, id: string) => {
  const todo = get(todoAtomFamily(id));
  set(todoAtomFamily(id), { ...todo, completed: !todo.completed });
});

export const deleteTodoAtom = atom(null, (get, set, id: string) => {
  set(todoIdsAtom, get(todoIdsAtom).filter((i) => i !== id));
  // Note: atomFamily doesn't automatically clean up
});
```

### Jotai Usage in Components

```typescript
'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  cartItemsAtom,
  cartTotalAtom,
  addToCartAtom,
  cartOpenAtom,
} from '@/atoms/cartAtoms';

// Read-only (no re-render when writing)
function CartTotal() {
  const total = useAtomValue(cartTotalAtom);
  return <span>${total.toFixed(2)}</span>;
}

// Write-only (no re-render when value changes)
function AddToCartButton({ product }: { product: Product }) {
  const addToCart = useSetAtom(addToCartAtom);

  return (
    <button onClick={() => addToCart({ ...product, quantity: 1 })}>
      Add to Cart
    </button>
  );
}

// Read and write
function CartToggle() {
  const [isOpen, setIsOpen] = useAtom(cartOpenAtom);

  return (
    <button onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? 'Close' : 'Open'} Cart
    </button>
  );
}

// Component with multiple atoms
function CartSummary() {
  const items = useAtomValue(cartItemsAtom);
  const total = useAtomValue(cartTotalAtom);
  const setOpen = useSetAtom(cartOpenAtom);

  return (
    <div>
      <p>{items.length} items</p>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={() => setOpen(true)}>View Cart</button>
    </div>
  );
}
```

---

<!-- /ANCHOR:jotai-atomic-state -->
<!-- ANCHOR:redux-toolkit-when-needed -->
## 6. REDUX TOOLKIT (WHEN NEEDED)

### When to Use Redux

- Very large applications with complex state logic
- Need for time-travel debugging
- Team already familiar with Redux patterns
- Complex middleware requirements

### Basic Slice

```typescript
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

// Async thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
```

### Store Configuration

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'], // Only persist token
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks

```typescript
// store/hooks.ts
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Usage
function UserProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (status === 'loading') return <Spinner />;
  if (!user) return null;

  return (
    <div>
      <p>{user.name}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

---

<!-- /ANCHOR:redux-toolkit-when-needed -->
<!-- ANCHOR:server-state-vs-client-state -->
## 7. SERVER STATE VS CLIENT STATE

### The Separation Principle

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  SERVER STATE (React Query / SWR)                               │
│  ─────────────────────────────────                              │
│  • Data owned by the server                                     │
│  • Cached, can become stale                                     │
│  • Requires fetching/refetching                                 │
│  • Often shared/synchronized across tabs                        │
│                                                                 │
│  Examples: User profile, product list, comments                 │
│                                                                 │
│  ✓ DO: Treat as cache, use Query/SWR                            │
│  ✗ DON'T: Copy into Zustand/Redux                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENT STATE (Zustand / Jotai / Context)                       │
│  ────────────────────────────────────────                       │
│  • Ephemeral UI state                                           │
│  • Not persisted to server                                      │
│  • Fully controlled by client                                   │
│                                                                 │
│  Examples: Modal open, selected tab, form inputs                │
│                                                                 │
│  ✓ DO: Keep minimal, close to usage                             │
│  ✗ DON'T: Duplicate server data                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Anti-Pattern: Duplicating Server State

```typescript
// BAD: Copying server data into global state
function ProductsPage() {
  const { data: products } = useQuery(['products'], fetchProducts);

  useEffect(() => {
    if (products) {
      // DON'T DO THIS - duplicating server state
      useAppStore.getState().setProducts(products);
    }
  }, [products]);
}

// GOOD: Use React Query as the source of truth
function ProductsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // UI state in Zustand
  const { selectedCategory, setSortBy } = useAppStore();

  // Derived client-side
  const filteredProducts = useMemo(
    () => products?.filter((p) => p.category === selectedCategory),
    [products, selectedCategory]
  );

  return <ProductGrid products={filteredProducts} />;
}
```

### Correct Pattern: Composing Server + Client State

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/stores/useAppStore';

function ProductsPage() {
  // Server state via React Query
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Client state via Zustand
  const filters = useAppStore((state) => state.filters);
  const sortBy = useAppStore((state) => state.sortBy);
  const setFilters = useAppStore((state) => state.setFilters);

  // Derived state (computed on each render, not stored)
  const displayedProducts = useMemo(() => {
    if (!products) return [];

    let result = products;

    // Apply filters
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.minPrice) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }

    // Apply sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [products, filters, sortBy]);

  if (isLoading) return <ProductsSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      <FiltersPanel filters={filters} onChange={setFilters} />
      <ProductGrid products={displayedProducts} />
    </>
  );
}
```

---

<!-- /ANCHOR:server-state-vs-client-state -->
<!-- ANCHOR:form-state-management -->
## 8. FORM STATE MANAGEMENT

### React Hook Form with Zustand

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStore } from '@/stores/useFormStore';

const checkoutSchema = z.object({
  email: z.string().email(),
  address: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    zipCode: z.string().regex(/^\d{5}$/),
  }),
  paymentMethod: z.enum(['card', 'paypal', 'bank']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Store for persisting form progress
interface FormStore {
  checkoutDraft: Partial<CheckoutFormData> | null;
  saveCheckoutDraft: (data: Partial<CheckoutFormData>) => void;
  clearCheckoutDraft: () => void;
}

export function CheckoutForm() {
  const { checkoutDraft, saveCheckoutDraft, clearCheckoutDraft } = useFormStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDraft ?? {
      email: '',
      address: { street: '', city: '', zipCode: '' },
      paymentMethod: 'card',
    },
  });

  // Auto-save draft on changes
  const formValues = watch();
  useEffect(() => {
    if (isDirty) {
      saveCheckoutDraft(formValues);
    }
  }, [formValues, isDirty, saveCheckoutDraft]);

  const onSubmit = async (data: CheckoutFormData) => {
    await submitCheckout(data);
    clearCheckoutDraft();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

### Multi-Step Form State

```typescript
// stores/useWizardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WizardState {
  currentStep: number;
  steps: {
    personal: PersonalInfo | null;
    address: AddressInfo | null;
    payment: PaymentInfo | null;
  };
  setStep: (step: number) => void;
  updateStepData: <K extends keyof WizardState['steps']>(
    step: K,
    data: WizardState['steps'][K]
  ) => void;
  canProceed: (step: number) => boolean;
  reset: () => void;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      steps: {
        personal: null,
        address: null,
        payment: null,
      },

      setStep: (step) => {
        const state = get();
        if (state.canProceed(step)) {
          set({ currentStep: step });
        }
      },

      updateStepData: (step, data) => {
        set((state) => ({
          steps: { ...state.steps, [step]: data },
        }));
      },

      canProceed: (step) => {
        const { steps } = get();
        // Step 2 requires step 1 complete
        if (step >= 2 && !steps.personal) return false;
        // Step 3 requires step 2 complete
        if (step >= 3 && !steps.address) return false;
        return true;
      },

      reset: () => {
        set({
          currentStep: 1,
          steps: { personal: null, address: null, payment: null },
        });
      },
    }),
    { name: 'wizard-progress' }
  )
);
```

---

<!-- /ANCHOR:form-state-management -->
<!-- ANCHOR:url-state-management -->
## 9. URL STATE MANAGEMENT

### Using nuqs for URL State

```typescript
// Using nuqs (type-safe URL state)
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';

function ProductFilters() {
  // Synced with URL: /products?category=electronics&page=1
  const [category, setCategory] = useQueryState('category');
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsString.withDefault('newest')
  );

  return (
    <div>
      <select value={category ?? ''} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <button onClick={() => setPage((p) => p + 1)}>Next Page</button>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
```

### Next.js useSearchParams

```typescript
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

function Filters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  const category = searchParams.get('category');
  const sort = searchParams.get('sort') ?? 'newest';

  return (
    <div>
      <select
        value={category ?? ''}
        onChange={(e) => setFilter('category', e.target.value)}
      >
        <option value="">All</option>
        <option value="electronics">Electronics</option>
      </select>
    </div>
  );
}
```

---

<!-- /ANCHOR:url-state-management -->
<!-- ANCHOR:quick-reference -->
## 10. QUICK REFERENCE

### State Solution Decision Tree

```
What type of state?
├── Server data (API, database)
│   └── React Query or SWR
├── URL state (filters, pagination, tabs)
│   └── nuqs or useSearchParams
├── Form state
│   └── React Hook Form
├── Local component state
│   └── useState or useReducer
└── Global client state
    ├── Simple, few stores → Zustand
    ├── Many independent atoms → Jotai
    ├── Large team, complex logic → Redux Toolkit
    └── Simple sharing → React Context
```

### Comparison Table

| Solution      | Bundle Size | Learning Curve | Best For                        |
| ------------- | ----------- | -------------- | ------------------------------- |
| Context       | 0kb         | Low            | Theme, auth, simple global      |
| Zustand       | ~1kb        | Low            | Most global state needs         |
| Jotai         | ~2kb        | Medium         | Fine-grained, derived state     |
| Redux Toolkit | ~10kb       | High           | Large apps, complex middleware  |
| React Query   | ~13kb       | Medium         | All server state                |
| nuqs          | ~3kb        | Low            | URL state management            |

### Checklist: Choosing State Solution

- [ ] Is it server data? → React Query/SWR
- [ ] Is it URL state? → nuqs/searchParams
- [ ] Is it form data? → React Hook Form
- [ ] Is it component-local? → useState/useReducer
- [ ] Is it shared across 2-3 components? → Lift state up
- [ ] Is it truly global? → Zustand/Jotai
- [ ] Does team know Redux? → Redux Toolkit

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

### Related References

- [Component Architecture](./component_architecture.md) - Server vs Client Components
- [Data Fetching](./data_fetching.md) - React Query and server state patterns
- [Forms & Validation](./forms_validation.md) - Form state with React Hook Form
- [React/Next.js Standards](./react_nextjs_standards.md) - Project structure
<!-- /ANCHOR:related-resources -->
