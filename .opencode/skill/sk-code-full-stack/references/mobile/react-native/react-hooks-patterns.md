---
title: React Hooks Patterns
description: A practical guide to creating and using custom hooks in a React Native/Expo codebase, explaining WHEN to use each pattern, common mistakes to avoid, and how to create your first hook.
---

# React Hooks Patterns

A practical guide to creating and using custom hooks in a React Native/Expo codebase, explaining WHEN to use each pattern, common mistakes to avoid, and how to create your first hook.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on React hooks patterns including custom hook creation, naming conventions, data fetching, permissions, event listeners, RTK Query, Redux slices, and WebSocket integration.

### When to Use

- Creating custom hooks
- Managing data fetching
- Handling permissions
- Working with event listeners
- Implementing RTK Query APIs
- Managing Redux state
- WebSocket/chat event handling

### Core Principle

Extract logic to hooks + proper cleanup + type safety = maintainable, testable React code.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:quick-start-when-do-i-need-a-custom-hook -->
## 2. QUICK START: WHEN DO I NEED A CUSTOM HOOK?

Ask yourself these questions:

| Question | If YES → | If NO → |
|----------|----------|---------|
| Does this logic need to be shared between components? | Create a hook | Keep it in the component |
| Does it involve state + side effects (API calls, subscriptions)? | Create a hook | Maybe just a utility function |
| Is the component becoming hard to read (>100 lines of logic)? | Extract to a hook | Keep it simple |
| Does it handle something like auth, permissions, or navigation? | Use existing hook | Create new if doesn't exist |

---

<!-- /ANCHOR:quick-start-when-do-i-need-a-custom-hook -->
<!-- ANCHOR:how-to-create-your-first-hook-step-by-step -->
## 3. HOW TO CREATE YOUR FIRST HOOK (STEP-BY-STEP)

### The Problem

Your component has business logic mixed with UI:

```typescript
// ❌ MESSY - logic mixed with UI
const MyScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // 30 lines of business logic...

  return <View>...</View>; // UI buried at the bottom
};
```

### The Solution

**Step 1: Create the hook file**

```
src/screens/my-screen/
├── MyScreen.tsx           # UI only
├── MyScreen.hook.ts       # Logic extracted here
└── MyScreen.styles.ts
```

**Step 2: Move logic to the hook**

```typescript
// MyScreen.hook.ts
import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

export const useMyScreenHook = () => {
  // State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Navigation
  const navigation = useNavigation();

  // Actions
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    // ... business logic
    setLoading(false);
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Return what the component needs
  return {
    data,
    loading,
    handleSubmit,
    handleBack,
  };
};
```

**Step 3: Use it in your component**

```typescript
// MyScreen.tsx - now clean and focused on UI
import { useMyScreenHook } from './MyScreen.hook';

const MyScreen = () => {
  const { data, loading, handleSubmit, handleBack } = useMyScreenHook();

  return (
    <View>
      {loading ? <Loader /> : <DataDisplay data={data} />}
      <Button onPress={handleSubmit} />
    </View>
  );
};
```

---

<!-- /ANCHOR:how-to-create-your-first-hook-step-by-step -->
<!-- ANCHOR:hook-naming-what-pattern-should-i-use -->
## 4. HOOK NAMING: WHAT PATTERN SHOULD I USE?

### Decision Tree

```
What does your hook do?
│
├─ Fetches/manages feature data?
│   └─ use<Feature>Hook  →  useFeedHook, useProfileHook
│
├─ Handles a specific action?
│   └─ use<Action><Subject>  →  useGoBackOrForceLogout, useIsLoggedIn
│
├─ Manages permissions?
│   └─ use<Subject>Permission  →  useCameraPermission, useLocationPermissions
│
├─ Handles OAuth/authentication?
│   └─ useAuthen<Service>  →  useAuthenGoogle, useAuthenApple
│
├─ Validates data?
│   └─ use<Subject>Validation  →  useSocialMediaValidation
│
└─ Handles WebSocket events?
    └─ use<Handler>Handler  →  useWhoAmIHandler, useChatMessageHandler
```

### File Naming

| Hook Type | File Name |
|-----------|-----------|
| Screen-specific | `MyScreen.hook.ts` (in screen folder) |
| Feature-specific | `useFeed.hook.ts` (in `/src/hooks/`) |
| Shared utility | `useKeyboardVisible.ts` (in `/src/hooks/`) |

---

<!-- /ANCHOR:hook-naming-what-pattern-should-i-use -->
<!-- ANCHOR:common-patterns-with-examples -->
## 5. COMMON PATTERNS WITH EXAMPLES

### Pattern 1: Data Fetching Hook

**When to use**: Any time you need to fetch data from an API.

```typescript
export const useProductList = () => {
  const dispatch = useDispatch();

  // Track if component is still mounted (prevents memory leaks)
  const mounted = useRef(true);

  // RTK Query mutation
  const [fetchProducts, { isLoading, isError }] = useFetchProductsMutation();

  // The fetch function
  const fetchData = useCallback(async () => {
    try {
      const data = await fetchProducts({}).unwrap();

      // ⚠️ IMPORTANT: Check if still mounted before updating state
      if (!mounted.current) return;

      dispatch(setProducts(data));
    } catch (error) {
      if (mounted.current) {
        onError(dispatch, error);
      }
    }
  }, [dispatch, fetchProducts]);

  // Cleanup on unmount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return { isLoading, isError, refresh: fetchData };
};
```

**Why the mounted ref?**

Without it, if the user navigates away while data is loading:
1. API returns
2. You try to `dispatch()`
3. Component is unmounted
4. React warning: "Can't perform state update on unmounted component"

### Pattern 2: Permission Hook

**When to use**: Any feature requiring device permissions (camera, location, notifications).

```typescript
export const useCameraPermission = () => {
  const [granted, setGranted] = useState(false);
  const [blocked, setBlocked] = useState(false);

  // Platform-specific permission
  const permission = isIOS
    ? PERMISSIONS.IOS.CAMERA
    : PERMISSIONS.ANDROID.CAMERA;

  const checkPermission = useCallback(async () => {
    const status = await check(permission);
    return handleStatus(status);
  }, [permission]);

  const requestPermission = useCallback(async () => {
    const status = await request(permission);
    return handleStatus(status);
  }, [permission]);

  const handleStatus = useCallback(async (status: string) => {
    switch (status) {
      case RESULTS.GRANTED:
        setGranted(true);
        return true;

      case RESULTS.DENIED:
        // First denial - can still request
        return await requestPermission();

      case RESULTS.BLOCKED:
        // User said "never ask again"
        setBlocked(true);
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in Settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return false;

      default:
        return false;
    }
  }, [requestPermission]);

  return { granted, blocked, checkPermission, requestPermission };
};
```

**Why separate check and request?**

- `checkPermission()` → Use when screen loads to show correct UI
- `requestPermission()` → Use when user taps "Use Camera" button

### Pattern 3: Event Listener Hook

**When to use**: Keyboard events, orientation changes, app state changes.

```typescript
export const useKeyboardVisible = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Add listeners
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // ⚠️ CRITICAL: Always clean up listeners
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return isKeyboardVisible;
};
```

---

<!-- /ANCHOR:common-patterns-with-examples -->
<!-- ANCHOR:common-mistakes-and-how-to-avoid-them -->
## 6. COMMON MISTAKES AND HOW TO AVOID THEM

### Mistake 1: Missing Dependency Array

```typescript
// ❌ WRONG - runs on every render
useEffect(() => {
  fetchData();
});

// ❌ WRONG - stale closure, uses old values
useEffect(() => {
  fetchData(userId);
}, []); // userId changes but effect doesn't re-run

// ✅ CORRECT - re-runs when userId changes
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### Mistake 2: Infinite Loop

```typescript
// ❌ WRONG - infinite loop!
const [data, setData] = useState([]);

useEffect(() => {
  setData([...data, newItem]); // setData triggers re-render
}, [data]); // data changed, effect runs again → infinite loop

// ✅ CORRECT - use functional update
useEffect(() => {
  setData(prev => [...prev, newItem]);
}, [newItem]); // Only depends on newItem
```

### Mistake 3: Not Cleaning Up

```typescript
// ❌ WRONG - memory leak
useEffect(() => {
  const subscription = EventEmitter.addListener('event', handler);
  // Missing cleanup!
}, []);

// ✅ CORRECT - cleanup on unmount
useEffect(() => {
  const subscription = EventEmitter.addListener('event', handler);
  return () => subscription.remove();
}, []);
```

### Mistake 4: Unnecessary useCallback

```typescript
// ❌ OVER-OPTIMIZATION - simple handler doesn't need it
const handlePress = useCallback(() => {
  console.log('pressed');
}, []);

// ✅ FINE - no useCallback needed for simple handlers
const handlePress = () => {
  console.log('pressed');
};

// ✅ USE useCallback WHEN:
// 1. Passing to memoized child: <MemoizedChild onPress={handlePress} />
// 2. Used in dependency arrays: useEffect(() => {...}, [handlePress])
// 3. Expensive to recreate
```

### Mistake 5: Fetching Without Guard

```typescript
// ❌ WRONG - fetches every time component mounts/updates
useEffect(() => {
  fetchData();
}, []);

// ✅ CORRECT - only fetch if data doesn't exist
useEffect(() => {
  if (!data) {
    fetchData();
  }
}, [data]);

// ✅ ALSO CORRECT - use module-level guard for singleton fetch
let hasFetched = false;

export const useFeedHook = () => {
  useEffect(() => {
    if (!hasFetched) {
      hasFetched = true;
      fetchFeedData();
    }
  }, []);
};
```

---

<!-- /ANCHOR:common-mistakes-and-how-to-avoid-them -->
<!-- ANCHOR:understanding-the-module-level-guard-pattern -->
## 7. UNDERSTANDING THE MODULE-LEVEL GUARD PATTERN

You'll see this pattern in the codebase:

```typescript
let hasFetched = false;  // ⚠️ Outside the hook!

export const useFeedHook = () => {
  useEffect(() => {
    if (!hasFetched && !feed) {
      hasFetched = true;
      fetchFeedData();
    }
  }, [feed]);
};
```

**Why is `hasFetched` outside the hook?**

| Inside Hook | Outside Hook (Module-Level) |
|-------------|----------------------------|
| Resets every render | Persists across ALL renders of ALL components |
| Each instance has own flag | Single flag shared by all instances |
| Fetch happens once per component | Fetch happens once per app session |

**When to use module-level:**
- Data that's truly global (user profile, app config)
- Expensive fetches that shouldn't repeat

**When to use instance-level:**
- Screen-specific data
- Data that can be stale after navigation

---

<!-- /ANCHOR:understanding-the-module-level-guard-pattern -->
<!-- ANCHOR:hook-composition -->
## 8. HOOK COMPOSITION

**Problem**: Your hook needs functionality from other hooks.

```typescript
export const useProfile = () => {
  // Compose from other hooks
  const { profile, getDetailProfile } = useProfileDetailHook();
  const { location, getLocation } = useLocationHook();
  const isLoggedIn = useIsLoggedIn();
  const { categories } = useCategories();

  // Add new functionality
  const refreshAll = useCallback(async () => {
    await Promise.all([
      getDetailProfile(),
      getLocation(),
    ]);
  }, [getDetailProfile, getLocation]);

  // Return combined interface
  return {
    profile,
    location,
    isLoggedIn,
    categories,
    refreshAll,
  };
};
```

**Rule**: Never duplicate logic. If another hook does what you need, use it.

---

<!-- /ANCHOR:hook-composition -->
<!-- ANCHOR:typescript-typing-your-hooks -->
## 9. TYPESCRIPT: TYPING YOUR HOOKS

### Return Type

```typescript
// Explicit return type (recommended for complex hooks)
interface UseMyHookReturn {
  data: MyDataType | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useMyHook = (): UseMyHookReturn => {
  // ...
  return { data, isLoading, error, refresh };
};
```

### Generic Hooks

```typescript
// Hook that works with any data type
export const usePagination = <T>(fetchFn: (page: number) => Promise<T[]>) => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);

  // ...

  return { data, loadMore, hasMore };
};

// Usage
const { data } = usePagination<Product>(fetchProducts);
```

---

<!-- /ANCHOR:typescript-typing-your-hooks -->
<!-- ANCHOR:debugging-hooks -->
## 10. DEBUGGING HOOKS

### "Too many re-renders"

**Cause**: State update causing immediate re-render that updates state again.

**Debug**:
```typescript
useEffect(() => {
  console.log('Effect running, dependencies:', { dep1, dep2 });
  // Check which dependency is changing unexpectedly
}, [dep1, dep2]);
```

### "Can't perform state update on unmounted component"

**Cause**: Async operation completing after unmount.

**Fix**: Use mounted ref pattern (see Pattern 1).

### Stale Closure

**Symptom**: Callback uses old value instead of current.

**Debug**:
```typescript
const handleClick = useCallback(() => {
  console.log('Value at creation:', value); // Logs old value
}, []); // ← Missing dependency!

// Fix: Add to dependency array
const handleClick = useCallback(() => {
  console.log('Current value:', value);
}, [value]);
```

---

<!-- /ANCHOR:debugging-hooks -->
<!-- ANCHOR:quick-reference-which-hook-pattern -->
## 11. QUICK REFERENCE: WHICH HOOK PATTERN?

| Scenario | Pattern | Example |
|----------|---------|---------|
| Fetch data once on mount | Data Fetching + mounted ref | `useFeedHook` |
| React to external events | Event Listener + cleanup | `useKeyboardVisible` |
| Check device capabilities | Permission Hook | `useCameraPermission` |
| Third-party auth | OAuth Pattern | `useAuthenGoogle` |
| Real-time updates | WebSocket Pattern | `useAppWebSocket` |
| Combine multiple features | Hook Composition | `useProfile` |
| Prevent duplicate fetches | Module-level guard | `hasFetched` flag |

---

<!-- /ANCHOR:quick-reference-which-hook-pattern -->
<!-- ANCHOR:key-files-reference -->
## 12. KEY FILES REFERENCE

| Purpose | Path |
|---------|------|
| Main feed logic | `/src/hooks/useFeed.hook.ts` |
| WebSocket connection | `/src/hooks/app-web-socket.hook.ts` |
| Profile management | `/src/hooks/useProfile.hook.ts` |
| Camera permission | `/src/hooks/useCameraPermission.hook.ts` |
| Auth state check | `/src/hooks/useIsLoggedIn.ts` |
| OAuth hooks | `/src/hooks/authen-*.hook.ts` |
| Chat event handlers | `/src/hooks/chat/handlers/` |

---

<!-- /ANCHOR:key-files-reference -->
<!-- ANCHOR:rtk-query-api-architecture -->
## 13. RTK QUERY API ARCHITECTURE

RTK Query is our data fetching layer. This section explains how the API is configured, the middleware chain, and how to create new API endpoints.

### Base API Configuration

**File:** `src/services/api/base/config.api.slice.ts`

The base API slice sets up RTK Query with a custom middleware chain:

```typescript
// src/services/api/base/config.api.slice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { retry } from '@reduxjs/toolkit/query';

export const configApiSlice = createApi({
  baseQuery: baseQueryWithRetry,  // Custom base query with middleware
  endpoints: () => ({}),           // Empty - endpoints injected later
});
```

### Middleware Chain (Request Flow)

Every API request passes through this chain in order:

```
Request → Cache Check → Debounce → Deduplication → Auth Headers → Fetch → Error Handling → Cache Store → Response
```

| Middleware | Purpose | Config |
|------------|---------|--------|
| **Cache** | Returns cached GET responses | 30s TTL for `/feed`, `/orders?id=`, `/vendors/details/.../lite` |
| **Debounce** | Prevents rapid duplicate requests | 300ms delay |
| **Deduplication** | Shares in-flight requests | Same request key shares promise |
| **Auth Headers** | Injects authorization token | From `prepareHeaders()` |
| **Retry** | Retries failed requests | 1 retry, exponential backoff (500ms → 5s max) |
| **Error Handling** | Logs and transforms errors | `handleApiError()` |

### Creating a New API Slice

**Step 1: Create the slice file**

```typescript
// src/services/api/my-feature.api.slice.ts
import { configApiSlice } from './base/config.api.slice';
import { ApiResponseModel } from 'models/generic/api-response.model';
import { ApiErrorProps } from 'features/utils/utils.props';

export const myFeatureApiSlice = configApiSlice.injectEndpoints({
  endpoints: builder => ({
    // Mutation for fetching (preferred for most cases)
    fetchMyData: builder.mutation({
      query: () => ({
        url: '/my-endpoint',
        method: 'GET',
      }),
      transformResponse: (res: ApiResponseModel<MyDataType>) => res.data,
      transformErrorResponse: (err: ApiErrorProps) => err,
    }),

    // Mutation with parameters
    updateMyData: builder.mutation<ResponseType, { id: string; data: UpdateData }>({
      query: ({ id, data }) => ({
        url: `/my-endpoint/${id}`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: ApiResponseModel<ResponseType>) => res.data,
      transformErrorResponse: (err: ApiErrorProps) => err,
    }),

    // Query for auto-fetching data (less common in this codebase)
    getDetails: builder.query({
      query: (id: string) => ({
        url: `/details/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponseModel<DetailsType>) => res.data,
    }),
  }),
  overrideExisting: true,  // Important when multiple slices inject endpoints
});

// Export generated hooks
export const {
  useFetchMyDataMutation,
  useUpdateMyDataMutation,
  useGetDetailsQuery,
} = myFeatureApiSlice;
```

### Using API Mutations in Hooks

**Pattern:** Combine RTK Query mutations with Redux dispatch for state management.

```typescript
// src/hooks/useMyFeature.hook.ts
import { useDispatch, useSelector } from 'react-redux';
import { useFetchMyDataMutation } from 'services/api/my-feature.api.slice';
import { setMyData, selectMyData } from 'features/my-feature/my-feature.slice';

export const useMyFeatureHook = () => {
  const dispatch = useDispatch();
  const myData = useSelector(selectMyData);

  // Get the mutation hook
  const [fetchMyData, { isLoading, isError }] = useFetchMyDataMutation();

  const loadData = useCallback(async () => {
    try {
      // .unwrap() throws on error, returns data on success
      const data = await fetchMyData({}).unwrap();
      dispatch(setMyData(data));
    } catch (error) {
      // Error already handled by middleware
      console.error('Failed to fetch:', error);
    }
  }, [dispatch, fetchMyData]);

  return { myData, isLoading, isError, loadData };
};
```

### Do This / Not That: RTK Query

| ❌ Don't | ✅ Do | Why |
|----------|-------|-----|
| Use `fetch()` directly | Use RTK Query mutations | Gets middleware chain (cache, retry, auth) |
| Create new `createApi()` | Use `injectEndpoints()` on `configApiSlice` | Single API instance, shared middleware |
| Ignore `transformResponse` | Always extract `.data` from response | Consistent data shape |
| Skip `transformErrorResponse` | Always include for type safety | Proper error typing |
| Use queries for user-triggered fetches | Use mutations for explicit fetches | Better control over when data loads |

### Key Files

| Purpose | Path |
|---------|------|
| Base API config | `src/services/api/base/config.api.slice.ts` |
| Cache middleware | `src/services/api/base/cache.api.slice.ts` |
| Debounce middleware | `src/services/api/base/debounce.api.slice.ts` |
| Deduplication | `src/services/api/base/deduplication.api.slice.ts` |
| Auth headers | `src/services/api/base/auth.api.slice.ts` |
| Error handling | `src/services/api/base/error-handling.api.slice.ts` |
| Feed API example | `src/services/api/feed.api.slice.ts` |

---

<!-- /ANCHOR:rtk-query-api-architecture -->
<!-- ANCHOR:redux-toolkit-slices -->
## 14. REDUX TOOLKIT SLICES

Redux Toolkit slices manage application state. Each feature has its own slice with reducers and selectors.

### File Structure

```
src/features/
├── feed/
│   ├── feed.slice.ts      # createSlice + reducers + selectors
│   ├── feed.props.ts      # TypeScript interfaces for state
│   ├── feed.model.ts      # Data models
│   └── feed.enum.ts       # Enums and constants
├── auth/
│   ├── auth.slice.ts
│   └── auth.props.ts
└── profile/
    ├── profile.slice.ts
    └── profile.props.ts
```

### Creating a Slice

**Step 1: Define the state interface**

```typescript
// src/features/my-feature/my-feature.props.ts
export interface MyFeatureState {
  items: Item[];
  selectedItem?: Item;
  isLoading: boolean;
  filters: {
    search: string;
    category: string;
  };
}
```

**Step 2: Create the slice**

```typescript
// src/features/my-feature/my-feature.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { rootStateType } from 'services/redux/store';
import { MyFeatureState } from './my-feature.props';

const initialState: MyFeatureState = {
  items: [],
  selectedItem: undefined,
  isLoading: false,
  filters: {
    search: '',
    category: 'all',
  },
};

const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    // Simple setter
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },

    // Setter with undefined handling
    setSelectedItem: (state, action: PayloadAction<Item | undefined>) => {
      state.selectedItem = action.payload;
    },

    // Partial update (merge)
    setFilters: (state, action: PayloadAction<Partial<MyFeatureState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear/reset action
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Complex update
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

// Export actions
export const {
  setItems,
  setSelectedItem,
  setFilters,
  clearFilters,
  addItem,
  removeItem,
} = myFeatureSlice.actions;

// Export reducer
export const myFeatureReducer = myFeatureSlice.reducer;

// Export selectors (inline pattern)
export const selectItems = (state: rootStateType) => state.myFeature.items;
export const selectSelectedItem = (state: rootStateType) => state.myFeature.selectedItem;
export const selectFilters = (state: rootStateType) => state.myFeature.filters;
export const selectSearch = (state: rootStateType) => state.myFeature.filters.search;
```

### Selector Patterns

**Pattern 1: Inline selectors** (simple, most common)

```typescript
// Direct property access
export const selectFeedData = (state: rootStateType) => state.feed.feed;
export const selectFilters = (state: rootStateType) => state.feed.filters;

// Nested property access
export const selectDateFilter = (state: rootStateType) => state.feed.filters.dateFilter;
```

**Pattern 2: Parameterized selectors** (for dynamic lookups)

```typescript
// Factory function pattern - returns a selector for a specific ID
export const selectFeedBlockState = (blockId: string) => (state: rootStateType) =>
  state.feed.feedBlocks?.[blockId];

// Usage in component:
const blockState = useSelector(selectFeedBlockState('my-block-id'));
```

**Pattern 3: Memoized selectors with createSelector** (for derived data)

```typescript
import { createSelector } from '@reduxjs/toolkit';

// Memoized: only recomputes when inputs change
export const selectActiveItems = createSelector(
  [selectItems, selectFilters],
  (items, filters) => items.filter(item =>
    item.category === filters.category &&
    item.name.includes(filters.search)
  )
);

// When to use:
// - Filtering/sorting arrays
// - Computing derived values
// - Expensive calculations
```

### Do This / Not That: Redux Slices

| ❌ Don't | ✅ Do | Why |
|----------|-------|-----|
| Mutate state directly in components | Use slice actions | Immer handles immutability in reducers |
| Put async logic in reducers | Put async in hooks, dispatch results | Reducers must be synchronous |
| Create selectors in components | Export selectors from slice file | Reusability, testability |
| Store API response metadata in slice | Store only the data you need | Keep state minimal |
| Nest state too deeply | Keep state flat when possible | Easier updates, better performance |

### Registering a New Slice

After creating a slice, add it to the store:

```typescript
// src/services/redux/store.ts
import { myFeatureReducer } from 'features/my-feature/my-feature.slice';

export const rootReducer = combineReducers({
  // ... existing reducers
  myFeature: myFeatureReducer,  // Add new reducer
});
```

---

<!-- /ANCHOR:redux-toolkit-slices -->
<!-- ANCHOR:redux-store-configuration -->
## 15. REDUX STORE CONFIGURATION

The Redux store is configured with persistence, middleware, and dev tools.

**File:** `src/services/redux/store.ts`

### Store Setup

```typescript
// src/services/redux/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { configApiSlice } from 'services/api/base/config.api.slice';

// Combine all feature reducers
export const rootReducer = combineReducers({
  appEnvironment: appEnvironmentReducer,
  auth: authReducer,
  profile: profileReducer,
  feed: feedReducer,
  chat: chatReducer,
  events: eventReducer,
  notification: notificationReducer,
  utils: utilsReducer,
  link: linkReducer,
  [configApiSlice.reducerPath]: configApiSlice.reducer,  // RTK Query cache
});

// Configure persistence
const persistConfig = {
  key: 'root',
  whitelist: ['app_environment', 'auth', 'profile', 'utils'],  // Only these persist
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  transforms: [authBlacklistFilter, profileBlacklistFilter, utilsWhitelistFilter],
};

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,  // Required for redux-persist
    }).concat(configApiSlice.middleware),  // RTK Query middleware
  devTools: false,
  enhancers: getDefaultEnhancers =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
});

export const persistor = persistStore(store);
export type rootStateType = ReturnType<typeof rootReducer>;
```

### Persistence Configuration

**What persists vs what doesn't:**

| State Slice | Persisted? | Notes |
|-------------|------------|-------|
| `app_environment` | ✅ Yes | App settings |
| `auth` | ✅ Partial | Excludes `state` field |
| `profile` | ✅ Partial | Excludes `socialUpdating`, `details`, `location` |
| `utils` | ✅ Partial | Only `locationSharingEnabled` |
| `feed` | ❌ No | Refreshed on app launch |
| `chat` | ❌ No | Real-time data |
| `events` | ❌ No | Refreshed on app launch |
| `notification` | ❌ No | Refreshed on app launch |
| RTK Query cache | ❌ No | Has its own caching |

### Persistence Filters

Use filters to control exactly what persists within a slice:

```typescript
import { createBlacklistFilter, createWhitelistFilter } from 'redux-persist-transform-filter';

// Blacklist: Persist everything EXCEPT these fields
const authBlacklistFilter = createBlacklistFilter('auth', ['state']);

// Whitelist: ONLY persist these fields
const utilsWhitelistFilter = createWhitelistFilter('utils', ['locationSharingEnabled']);

// Apply in persistConfig
const persistConfig = {
  // ...
  transforms: [authBlacklistFilter, profileBlacklistFilter, utilsWhitelistFilter],
};
```

### State Reconciler

`autoMergeLevel2` controls how persisted state merges with initial state on app launch:

```typescript
// Level 2 merge: Shallow merge at top level, replace at second level
// Example:
// Initial: { filters: { a: 1, b: 2 }, items: [] }
// Persisted: { filters: { a: 5 } }
// Result: { filters: { a: 5 }, items: [] }  // filters replaced, items from initial
```

**Why Level 2?** Prevents stale nested data from persisting when you add new fields.

### Do This / Not That: Store Configuration

| ❌ Don't | ✅ Do | Why |
|----------|-------|-----|
| Persist sensitive data (tokens in `auth.state`) | Blacklist sensitive fields | Security |
| Persist large/stale data (feed, events) | Refresh on app launch | Freshness |
| Store non-serializable values | Keep state serializable | Redux/persist requirements |
| Add many slices to whitelist | Be selective about persistence | App launch speed |
| Forget to register RTK Query middleware | Always include `configApiSlice.middleware` | API caching won't work |

### Adding Persistence for a New Slice

**To persist a new slice:**

1. Add to `whitelist` in `persistConfig`:
```typescript
whitelist: ['app_environment', 'auth', 'profile', 'utils', 'myNewSlice'],
```

2. Optionally add filters for partial persistence:
```typescript
const myNewSliceBlacklistFilter = createBlacklistFilter('myNewSlice', ['tempData']);
// Add to transforms array
```

**To NOT persist a slice:** Simply don't add it to the whitelist (default behavior).

### Key Files

| Purpose | Path |
|---------|------|
| Store configuration | `src/services/redux/store.ts` |
| Feature slices | `src/features/*/` |
| API slice (RTK Query) | `src/services/api/base/config.api.slice.ts` |

---

<!-- /ANCHOR:redux-store-configuration -->
<!-- ANCHOR:websocket-chat-event-system-architecture -->
## 16. WEBSOCKET/CHAT EVENT SYSTEM ARCHITECTURE

The chat system uses a WebSocket-based architecture with typed events, centralized dispatching, and Redux-based state management.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        WebSocket Event Flow                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Server] ──WebSocket──> [useAppWebSocket] ──> [useWebsocketEvents]     │
│                               │                        │                │
│                               │                        ▼                │
│                               │              ┌─────────────────┐        │
│                               │              │ switch(type) {  │        │
│                               │              │   case WhoAmI   │────────┤
│                               │              │   case GetChats │────────┤
│                               │              │   case Message  │────────┤
│                               │              │   ...           │        │
│                               │              └─────────────────┘        │
│                               │                        │                │
│                               ▼                        ▼                │
│                          [Redux Store]  <──── [Event Handlers]          │
│                               │                                         │
│                               ▼                                         │
│                      [Event Queue] ──> sendMessage() ──> [Server]       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 16.1 Event Type System

All WebSocket events are typed via an enum for type safety and consistency.

**File:** `src/hooks/chat/enums/eventTypes.enum.ts`

```typescript
export enum EventTypesEnum {
  // Connection & Handshake
  Ping = 'Ping',
  Pong = 'Pong',
  WhoAmI = 'WhoAmI',
  ServerSideWhoAmI = 'WhoAmIResponse',

  // Chat Operations
  AddMessage = 'ChatMessage',
  ChatRoom = 'ChatRoom',
  GetChats = 'GetChats',
  Typing = 'Typing',

  // Message Status
  ServerSideAcknowledge = 'ServerSideAcknowledge',
  MessageReceivedAck = 'MessageReceivedAck',
  ChatEventRead = 'ChatEventRead',
  ChatRoomUnread = 'ChatRoomUnread',

  // History & Sync
  GetChatEventsFromDate = 'GetChatEventsFromDate',
  GetLastPositionChatEvents = 'GetLastPositionChatEvents',
  GetChatEventsSinceCreation = 'GetChatEventsSinceCreation',

  // Party Status
  ChatPartyStatus = 'ChatPartyStatus',

  // UI-only (never sent to server)
  DateDivision = 'DateDivision',
}
```

**Usage:**
- Server responses: Match `message.payload_type` against enum values
- Client requests: Set `event.type` when creating outbound events
- UI-only events: `DateDivision` is for client-side display only

### 16.2 Socket Wrapper Model

All WebSocket messages follow a consistent wrapper structure.

**File:** `src/hooks/chat/models/socket-wrapper.model.ts`

```typescript
export interface SocketWrapperModel<T> {
  id: string;                              // Unique message ID
  headers?: { [name: string]: string };    // Default: 'room_id' for scoping
  from_sender_id?: string;                 // Client message sender ID
  payload_type: EventTypesEnum;            // Event type
  payload?: T;                             // Type-specific payload
  error?: ErrorModel | null;               // Error details (if any)
  timestamp: string;                       // ISO timestamp
}
```

**Why this structure:**
- `id`: Track message acknowledgments and delivery status
- `headers.room_id`: Scope events to specific chat rooms
- `from_sender_id`: Identify the sender (used for typing indicators, etc.)
- Generic `<T>` payload: Type-safe payloads per event type

### 16.3 Handler Registration Pattern

Event handlers are registered and dispatched via a central switch statement.

**File:** `src/hooks/chat/handlers/event.handlers.ts`

```typescript
export const useWebsocketEvents = () => {
  // Register all handlers
  const handleWhoAmI = useWhoAmIHandler();
  const handleServerSideAcknowledge = useServerSideAcknowledgeHandler();
  const handleServerSideGetChats = useServerSideGetChatsHandler();
  const handleServerSideChatMessage = useServerSideChatMessageHandler();
  const handleServerSideTyping = useServerSideTypingHandler();
  // ... more handlers

  return useCallback((message: any) => {
    console.debug(`Received ${message.payload_type}: `, message);

    switch (message.payload_type) {
      case EventTypesEnum.ServerSideWhoAmI:
        handleWhoAmI(message);
        break;
      case EventTypesEnum.ServerSideAcknowledge:
        handleServerSideAcknowledge(message);
        break;
      case EventTypesEnum.AddMessage:
        handleServerSideChatMessage(message);
        break;
      case EventTypesEnum.Typing:
        handleServerSideTyping(message);
        break;
      case EventTypesEnum.Pong:
        // No-op, just connection keepalive
        break;
      default:
        console.debug('==== SOCKET RECEIVED UNHANDLED ==== ', message);
        break;
    }
  }, [handleWhoAmI]); // Note: Only handleWhoAmI in deps (optimization)
};
```

**How to add a new event handler:**

1. Create handler file in `src/hooks/chat/handlers/`:
```typescript
// src/hooks/chat/handlers/server-side-my-event.handler.ts
import { SocketWrapperModel } from 'hooks/chat/models/socket-wrapper.model';
import { useDispatch } from 'react-redux';

export const useServerSideMyEventHandler = () => {
  const dispatch = useDispatch();

  return (message: SocketWrapperModel<MyPayloadType>) => {
    // Handle the event
    dispatch(someAction(message.payload));
  };
};
```

2. Add enum value in `eventTypes.enum.ts` if needed
3. Register in `event.handlers.ts`:
```typescript
const handleMyEvent = useServerSideMyEventHandler();

// In switch statement:
case EventTypesEnum.MyEvent:
  handleMyEvent(message);
  break;
```

### 16.4 Event Queue Management (Redux)

Outbound events are queued in Redux and processed by the WebSocket hook.

**File:** `src/features/chat/chat.slice.ts`

```typescript
// State structure
interface ChatState {
  eventQueue: Array<{
    id: string;
    processed: boolean;
    event: any;
    roomId: string | null;
    prepared?: boolean;
  }>;
  // ... other state
}

// Actions for queue management
addEventToWebSocketQueue     // Add event to queue
setProcessedEventToWebSocketQueue  // Mark as processed
cleanEventToWebSocketQueue   // Remove processed events

// Selectors
export const selectEventQueueToWebSocket = createSelector(
  [(state) => state.chat.eventQueue],
  (eventQueue) => eventQueue.filter(x => !x.processed)
);

export const selectEventQueueToClean = createSelector(
  [(state) => state.chat.eventQueue],
  (eventQueue) => eventQueue.filter(x => x.processed)
);
```

**Why a queue instead of direct sending:**
- Guarantees order of messages
- Handles offline scenarios (queue persists)
- Enables retry logic for failed messages
- Centralizes outbound message tracking

**Usage pattern:**
```typescript
// Queue a message for sending
dispatch(addEventToWebSocketQueue({
  roomId: 'room-123',
  event: new ClientServerChatMessageEvent()
}));

// The useAppWebSocket hook automatically:
// 1. Picks up unprocessed events
// 2. Sends them via WebSocket
// 3. Marks them as processed
// 4. Cleans up the queue
```

### 16.5 Main WebSocket Hook

**File:** `src/hooks/app-web-socket.hook.ts`

The central hub for WebSocket connection management.

#### Connection Management

```typescript
export const useAppWebSocket = () => {
  const { sendMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,

      onOpen: () => {
        dispatch(setWebSocketConnected(true));
        // 1. Send WhoAmI to identify ourselves
        publishToSocket(new ClientServerWhoAmIEvent());
        // 2. Fetch chat list
        handleSendGetChats(e => dispatch(addEventToWebSocketQueue({...})));
        // 3. Start ping interval
        setStartPing(true);
      },

      onClose: (event) => {
        // Handle reconnection vs full disconnect
        if (event.code === 1013) {
          dispatch(setWebSocketConnected('reconnecting'));
        } else {
          dispatch(setWebSocketConnected(false));
        }
      },

      onMessage: (event) => {
        const data = JSON.parse(event.data);
        handleWebsocketEvents(data); // Dispatch to handlers
      },
    },
    connectToWebsocket // Conditional connection
  );
};
```

#### Ref Sync Pattern for Stable Callbacks

**IMPORTANT PATTERN:** Avoid re-creating callbacks when Redux state changes.

```typescript
// Problem: Callbacks that depend on Redux state get re-created on every state change,
// causing unnecessary re-renders and potentially stale closures.

// Solution: Use refs to sync state values
const isConnected = useSelector(selectIsWebsocketConnected);
const isConnectedRef = useRef(isConnected);

const selectedChatRoomId = useSelector(selectSelectedChatRoomId);
const selectedChatRoomIdRef = useRef(selectedChatRoomId);

const roomDataLoading = useSelector(selectRoomDataLoading);
const roomDataLoadingRef = useRef(roomDataLoading);

// Sync refs when state changes
useEffect(() => { isConnectedRef.current = isConnected; }, [isConnected]);
useEffect(() => { selectedChatRoomIdRef.current = selectedChatRoomId; }, [selectedChatRoomId]);
useEffect(() => { roomDataLoadingRef.current = roomDataLoading; }, [roomDataLoading]);

// Use refs in callbacks that shouldn't re-create
const sendToSocket = useCallback((message) => {
  if (isConnectedRef.current) {  // Use ref, not state
    sendMessage(JSON.stringify(message));
  }
}, [sendMessage]); // Stable dependency array
```

**Why this pattern:**
- `sendToSocket` won't re-create when `isConnected` changes
- Interval callbacks always see current state values
- Prevents stale closure bugs in long-running timers

#### Reconnection Logic

```typescript
// App state handling - reconnect when app comes to foreground
const handleAppStateChange = useCallback((nextAppState) => {
  if (appState.match(/inactive|background/) && nextAppState === 'active') {
    if (!isConnected && authToken) {
      safeSetTimeout(() => connectWS(authToken), 100);
    }
  }
  setAppState(nextAppState);
}, [appState, isConnected, authToken, connectWS]);

useEffect(() => {
  const subscription = AppState.addEventListener('change', handleAppStateChange);
  return () => subscription?.remove();
}, [handleAppStateChange]);

// Hard refresh support (force reconnect)
useEffect(() => {
  if (hardRefresh) {
    disconnectWS();
    dispatch(clearHardRefresh());
    safeSetTimeout(() => connectWS(authToken), 500);
  }
}, [hardRefresh, authToken, disconnectWS, connectWS]);
```

#### Ping/Keepalive

```typescript
useEffect(() => {
  let pingInterval = null;

  if (startPing) {
    pingInterval = setInterval(() => {
      publishToSocket(new ClientServerPingEvent());
    }, 60 * 1000); // Every 60 seconds
  }

  return () => {
    if (pingInterval) clearInterval(pingInterval);
  };
}, [publishToSocket, startPing]);
```

### 16.6 Chat State Management (Redux)

**File:** `src/features/chat/chat.slice.ts`

#### Room-Based State Organization

```typescript
interface ChatState {
  // Room data
  rooms: ChatRoomModel[];
  roomEvents: Array<{ roomId: string; data: any[] }>;
  selectedChatRoomId: string | null;

  // Per-room UI state
  roomDrafts: Array<{ roomId: string; data: string | null }>;
  roomTypings: Array<{ roomId: string; data: string[] }>;  // sender IDs
  roomHasFirstFetch: string[];
  roomHasMoreData: Array<{ roomId: string; data: boolean | null }>;
  roomDataLoading: Array<{ roomId: string; data: { state: boolean; date: Date } }>;

  // Connection state
  webSocketConnected: boolean | 'reconnecting';
  webSocketShouldConnect: boolean;
  eventQueue: EventQueueItem[];

  // Party status (online indicators)
  partiesOnlineStatus: Array<{ partyId: string; data: any }>;
}
```

#### Key Reducers

```typescript
// Typing indicators
appendTyping: (state, action) => {
  const { senderId, roomId } = action.payload;
  let roomTypings = state.roomTypings.find(x => x.roomId === roomId);
  if (!roomTypings) {
    state.roomTypings.push({ roomId, data: [] });
    roomTypings = state.roomTypings.find(x => x.roomId === roomId);
  }
  roomTypings.data.push(senderId);
},

removeTyping: (state, action) => {
  const { senderId, roomId } = action.payload;
  const roomTypings = state.roomTypings.find(x => x.roomId === roomId);
  if (roomTypings) {
    roomTypings.data = roomTypings.data.filter(x => x !== senderId);
  }
},

// Message drafts (per-room)
setRoomDraft: (state, action) => {
  const { draft, roomId } = action.payload;
  let roomDrafts = state.roomDrafts.find(x => x.roomId === roomId);
  if (!roomDrafts) {
    state.roomDrafts.push({ roomId, data: null });
    roomDrafts = state.roomDrafts.find(x => x.roomId === roomId);
  }
  roomDrafts.data = draft;
},

// Party status tracking
setPartyStatus: (state, action) => {
  const { status, partyId } = action.payload;
  let partiesOnlineStatus = state.partiesOnlineStatus.find(x => x.partyId === partyId);
  if (!partiesOnlineStatus) {
    state.partiesOnlineStatus.push({ partyId, data: null });
    partiesOnlineStatus = state.partiesOnlineStatus.find(x => x.partyId === partyId);
  }
  partiesOnlineStatus.data = status;
},
```

#### Key Selectors

```typescript
// Memoized selectors for performance
export const selectEventQueueToWebSocket = createSelector(
  [(state) => state.chat.eventQueue],
  (eventQueue) => eventQueue.filter(x => !x.processed)
);

export const selectRoomTypings = createSelector(
  [(state) => state.chat.roomTypings],
  (roomTypings) => roomTypings
);

export const selectChatRoomEvents = (state) =>
  state.chat.roomEvents
    ?.find(x => x.roomId === state.chat.selectedChatRoomId)
    ?.data?.filter(x => eventTypesThatShouldBeDisplayed.includes(x?.socketWrapper?.payload_type))
    ?? [];
```

### 16.7 Handler Example: Message Handler

A complete example showing state sync with refs and complex logic.

**File:** `src/hooks/chat/handlers/server-side-chat-message.handler.ts`

```typescript
export const useServerSideChatMessageHandler = () => {
  const dispatch = useDispatch();

  // Get Redux state
  const rooms = useSelector(selectRooms) ?? [];
  const selectedChatRoomId = useSelector(selectSelectedChatRoomId) ?? '';
  const roomsWithHasFirstFetch = useSelector(selectRoomHasFirstFetch);
  const roomHasMoreData = useSelector(selectRoomHasMoreData);

  // Sync to refs (for use in returned callback)
  const roomsWithHasFirstFetchRef = useRef(roomsWithHasFirstFetch);
  const roomHasMoreDataRef = useRef(roomHasMoreData);
  const selectedChatRoomIdRef = useRef(selectedChatRoomId);
  const roomsRef = useRef(rooms);

  useEffect(() => { roomsWithHasFirstFetchRef.current = roomsWithHasFirstFetch; }, [roomsWithHasFirstFetch]);
  useEffect(() => { roomHasMoreDataRef.current = roomHasMoreData; }, [roomHasMoreData]);
  useEffect(() => { selectedChatRoomIdRef.current = selectedChatRoomId; }, [selectedChatRoomId]);
  useEffect(() => { roomsRef.current = rooms; }, [rooms]);

  return (message: SocketWrapperModel<MessageModel>) => {
    const event = buildEventFromServerSide(message);
    const roomId = event?.socketWrapper?.headers?.room_id;

    // Check room state using refs
    const isInitialized = roomsWithHasFirstFetchRef.current?.includes(roomId);
    const hasMoreData = roomHasMoreDataRef.current?.find(x => x.roomId === roomId)?.data;

    // Only append if room is ready to receive messages
    if (!(isInitialized && hasMoreData === true)) {
      dispatch(appendEvent({ wrappedMessage: event, roomId }));
    }

    // Update room's last event
    dispatch(updateRoom({
      roomId,
      changeObj: {
        last_event_received: event.socketWrapper.id,
        last_event_received_at: new Date(event.createdAt),
      },
    }));

    // Update unread count...
    // Request older messages if room not initialized...
    // Mark as read if currently viewing this room...
  };
};
```

### Quick Reference: Chat System Files

| Purpose | Path |
|---------|------|
| Event type definitions | `src/hooks/chat/enums/eventTypes.enum.ts` |
| Message wrapper model | `src/hooks/chat/models/socket-wrapper.model.ts` |
| Event handler dispatcher | `src/hooks/chat/handlers/event.handlers.ts` |
| Main WebSocket hook | `src/hooks/app-web-socket.hook.ts` |
| Chat Redux slice | `src/features/chat/chat.slice.ts` |
| All event handlers | `src/hooks/chat/handlers/*.handler.ts` |
| Client-to-server events | `src/hooks/chat/events/clientToServer/` |

---

<!-- /ANCHOR:websocket-chat-event-system-architecture -->
<!-- ANCHOR:do-this-not-that -->
## 17. DO THIS, NOT THAT

| ❌ Don't | ✅ Do | Why |
|----------|-------|-----|
| Put all logic in component | Extract to `.hook.ts` | Separation of concerns |
| Forget dependency array | Always specify dependencies | Avoid stale closures |
| Forget cleanup in useEffect | Return cleanup function | Prevent memory leaks |
| Update state after unmount | Check `mounted.current` | Prevent React warnings |
| Wrap everything in useCallback | Only when actually needed | Avoid premature optimization |
| Duplicate logic across hooks | Compose from existing hooks | DRY principle |
| Fetch on every mount | Guard with flag or check existing data | Avoid unnecessary API calls |

---

<!-- /ANCHOR:do-this-not-that -->
<!-- ANCHOR:related-resources -->
## 18. RELATED RESOURCES

### Related References
- [React Native Standards](./react-native-standards.md) - Core component conventions
- [Expo Patterns](./expo-patterns.md) - Expo-specific patterns and configuration
- [Navigation Patterns](./navigation-patterns.md) - React Navigation patterns
- [Performance Optimization](./performance-optimization.md) - Performance best practices
<!-- /ANCHOR:related-resources -->
