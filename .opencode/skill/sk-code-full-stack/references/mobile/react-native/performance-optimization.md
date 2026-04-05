---
title: Performance Optimization
description: A practical guide to keeping a React Native/Expo app fast and responsive, explaining WHEN to optimize, HOW to profile issues, and what patterns actually matter.
---

# Performance Optimization

A practical guide to keeping a React Native/Expo app fast and responsive, explaining WHEN to optimize, HOW to profile issues, and what patterns actually matter.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on React Native performance including quick wins, FlashList usage, FlatList optimization, memoization, profiling, API layer optimizations, Redux state management, memory leaks, and animations.

### When to Use

- Optimizing slow list scrolling
- Reducing unnecessary re-renders
- Debugging memory leaks
- Improving animation performance
- Profiling performance issues

### Core Principle

Measure first, then optimize. Most performance issues come from a small number of problems.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:the-golden-rule-measure-first -->
## 2. THE GOLDEN RULE: MEASURE FIRST

**Don't optimize prematurely.** Most performance issues come from a small number of problems:
1. Too many re-renders
2. Slow list scrolling
3. Unoptimized images
4. Memory leaks

**Before optimizing:**
1. Notice a problem (slow, janky, laggy)
2. Measure to confirm it's real
3. Identify the cause
4. Fix specifically that issue
5. Measure again to confirm improvement

---

<!-- /ANCHOR:the-golden-rule-measure-first -->
<!-- ANCHOR:quick-wins-things-that-almost-always-help -->
## 3. QUICK WINS: THINGS THAT ALMOST ALWAYS HELP

### Use expo-image Instead of Image

```typescript
// ❌ SLOW - react-native Image
import { Image } from 'react-native';
<Image source={{ uri: url }} />

// ✅ FAST - expo-image with caching
import { Image } from 'expo-image';
<Image
  source={url}
  contentFit="cover"
  cachePolicy="memory-disk"  // Caches in memory AND on disk
/>
```

**Why?** `expo-image` has built-in caching, progressive loading, and better memory management.

### Use StyleSheet.create

```typescript
// ❌ SLOW - creates new object every render
<View style={{ padding: 16, backgroundColor: 'white' }}>

// ✅ FAST - created once, reused
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: 'white' }
});
<View style={styles.container}>
```

**Why?** Inline style objects are recreated every render, causing unnecessary work.

### Use FlatList for Long Lists

```typescript
// ❌ SLOW - renders all items immediately
{items.map(item => <ItemComponent key={item.id} item={item} />)}

// ✅ FAST - only renders visible items
<FlatList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  keyExtractor={item => item.id}
/>
```

**Why?** FlatList virtualizes the list, only rendering what's on screen.

---

<!-- /ANCHOR:quick-wins-things-that-almost-always-help -->
<!-- ANCHOR:flashlist-high-performance-lists -->
## 4. FLASHLIST: HIGH-PERFORMANCE LISTS

For high-performance lists (chat, feed), use `@shopify/flash-list` instead of FlatList.

### When to Use FlashList vs FlatList

| Scenario | Recommendation |
|----------|----------------|
| Large lists (100+ items) | ✅ FlashList |
| Chat/messaging screens | ✅ FlashList |
| Feed/timeline screens | ✅ FlashList |
| Simple lists (<50 items) | FlatList is fine |
| Need sticky headers | FlatList (better support) |

### Basic FlashList Usage

```typescript
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  keyExtractor={(item) => item.id}
  estimatedItemSize={80}  // REQUIRED - estimate average item height
/>
```

**CRITICAL:** `estimatedItemSize` is REQUIRED. FlashList needs this to calculate scroll position efficiently. Estimate the average height of your list items.

### Real Example: Chat Screen

```typescript
import { FlashList } from "@shopify/flash-list";

<FlashList
  ref={listRef}
  data={chatRoomEventsData}
  keyExtractor={(item) => item.socketWrapper.id}
  numColumns={1}
  contentContainerStyle={{ paddingHorizontal: scale(4) }}
  showsVerticalScrollIndicator={false}
  onScroll={onScroll}
  onEndReached={onEndReached}
  getItemType={(item) => {
    return typeof item !== "string" ? "sectionHeader" : "row";
  }}
  renderItem={({ item }) => <ChatMessageItem item={item} />}
/>
```

### FlashList Performance Tips

1. **Always provide `estimatedItemSize`** - Required for optimal performance
2. **Use `getItemType`** - For lists with different item types (headers, messages, etc.)
3. **Memoize renderItem** - Same as FlatList, use useCallback
4. **Use `keyExtractor`** - Stable, unique keys for each item

---

<!-- /ANCHOR:flashlist-high-performance-lists -->
<!-- ANCHOR:flatlist-optimization-deep-dive -->
## 5. FLATLIST OPTIMIZATION DEEP DIVE

### The Problem

Lists are often the #1 performance bottleneck. A 100-item list with complex items can easily cause jank.

### The Solution: Optimized FlatList

```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}

  // === PERFORMANCE PROPS (explained below) ===

  // Remove items that scroll off-screen from memory
  removeClippedSubviews={true}

  // Render 10 items per batch (lower = more responsive, higher = less blank space)
  maxToRenderPerBatch={10}

  // Wait 50ms between batches (gives JS thread breathing room)
  updateCellsBatchingPeriod={50}

  // Keep 21 screens worth of items in memory (10 above, current, 10 below)
  windowSize={21}

  // Render 10 items immediately on mount
  initialNumToRender={10}

  // CRITICAL: Tell FlatList the item height so it doesn't have to measure
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### When to Use getItemLayout

| Scenario | Use getItemLayout? |
|----------|-------------------|
| All items same height | ✅ Yes - huge performance win |
| Variable heights, known ahead of time | ✅ Yes - calculate offset |
| Variable heights, unknown | ❌ No - let FlatList measure |

### Memoize renderItem

```typescript
// ❌ BAD - creates new function every render
<FlatList
  renderItem={({ item }) => <Card data={item} onPress={() => handlePress(item.id)} />}
/>

// ✅ GOOD - stable function reference
const renderItem = useCallback(({ item }) => (
  <MemoizedCard data={item} onPress={handlePress} />
), [handlePress]);

<FlatList renderItem={renderItem} />
```

---

<!-- /ANCHOR:flatlist-optimization-deep-dive -->
<!-- ANCHOR:when-to-use-react-memo-usecallback-usememo -->
## 6. WHEN TO USE REACT.MEMO, USECALLBACK, USEMEMO

### Decision Tree

```
Should I memoize this?
│
├─ Is this a list item rendered many times?
│   └─ YES → React.memo on the item component
│
├─ Is this callback passed to a memoized child?
│   └─ YES → useCallback
│
├─ Is this an expensive computation (sorting, filtering)?
│   └─ YES → useMemo
│
└─ None of the above?
    └─ NO → Don't memoize (adds overhead)
```

### React.memo Examples

```typescript
// ✅ GOOD - list items benefit from memo
export const EventCard = React.memo((props: EventCardProps) => {
  return <View>...</View>;
});

// ✅ GOOD - custom comparison for complex props
export const EventCard = React.memo(
  (props: EventCardProps) => <View>...</View>,
  (prev, next) => prev.id === next.id && prev.status === next.status
);

// ❌ UNNECESSARY - simple component rendered once
const Header = React.memo(() => <Text>Header</Text>);  // Overhead > benefit
```

### useCallback Examples

```typescript
// ✅ GOOD - passed to memoized FlatList item
const handleItemPress = useCallback((id: string) => {
  navigation.navigate('Detail', { id });
}, [navigation]);

// ❌ UNNECESSARY - inline handler, no memoized children
<Button onPress={() => setOpen(true)}>  // Fine without useCallback
```

### useMemo Examples

```typescript
// ✅ GOOD - expensive filter/sort operation
const sortedItems = useMemo(() =>
  items.sort((a, b) => new Date(b.date) - new Date(a.date)),
  [items]
);

// ❌ UNNECESSARY - simple operation
const fullName = useMemo(() => `${first} ${last}`, [first, last]);  // Just do it inline
```

---

<!-- /ANCHOR:when-to-use-react-memo-usecallback-usememo -->
<!-- ANCHOR:profiling-how-to-find-performance-issues -->
## 7. PROFILING: HOW TO FIND PERFORMANCE ISSUES

### React DevTools Profiler

1. **Install**: React DevTools browser extension
2. **Connect**: Open the Profiler tab while app is running
3. **Record**: Click record, do the slow action, stop
4. **Analyze**: Look for:
   - Components rendering too often
   - Long render times
   - Unnecessary re-renders

### Flipper (React Native Debugger)

1. **Install**: Download Flipper desktop app
2. **Enable**: Should auto-connect to dev builds
3. **Use Performance plugin**: See JS thread activity
4. **Use React DevTools plugin**: Same as browser extension

### Console Timing

```typescript
// Quick way to measure something
const startTime = performance.now();
// ... do the thing
const duration = performance.now() - startTime;
console.log(`Operation took ${duration.toFixed(2)}ms`);
```

### What to Look For

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Jank while scrolling | Unoptimized FlatList | Add performance props, memo items |
| Slow initial render | Too much work on mount | Lazy load, defer non-critical |
| Memory keeps growing | Memory leak | Check useEffect cleanup |
| Slow navigation | Heavy screen component | Profile, optimize, or lazy load |

---

<!-- /ANCHOR:profiling-how-to-find-performance-issues -->
<!-- ANCHOR:api-layer-optimizations -->
## 8. API LAYER OPTIMIZATIONS

### What's Already Built In

The codebase has several optimizations in `src/services/api/base/`:

**Caching** (`cache.api.slice.ts`):
```typescript
// GET requests are cached for 30 seconds
// Prevents duplicate fetches for: /feed, /orders, /vendors
```

**Debouncing** (`debounce.api.slice.ts`):
```typescript
// Rapid-fire requests are debounced (300ms)
// Prevents API spam from fast user interactions
```

**Deduplication** (`deduplication.api.slice.ts`):
```typescript
// Identical concurrent requests return same promise
// Two components requesting same data = one API call
```

### Using RTK Query Effectively

```typescript
// ✅ GOOD - let RTK Query handle caching
const { data, isLoading } = useGetFeedQuery();

// ❌ BAD - fetching manually and storing in state
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/api/feed').then(setData);
}, []);
```

---

<!-- /ANCHOR:api-layer-optimizations -->
<!-- ANCHOR:redux-state-avoiding-unnecessary-re-renders -->
## 9. REDUX STATE: AVOIDING UNNECESSARY RE-RENDERS

### Problem: Over-selecting

```typescript
// ❌ BAD - re-renders on ANY change to feed slice
const feedState = useSelector(state => state.feed);

// ✅ GOOD - only re-renders when orders change
const orders = useSelector(state => state.feed.orders);
```

### Solution: Granular Selectors

```typescript
// Create specific selectors
export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedIsLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;

// Use in components
const orders = useSelector(selectFeedOrders);
const isLoading = useSelector(selectFeedIsLoading);
```

### Memoized Selectors for Derived Data

```typescript
import { createSelector } from '@reduxjs/toolkit';

// This only recomputes when orders or filters change
const selectFilteredOrders = createSelector(
  [selectFeedOrders, selectActiveFilters],
  (orders, filters) => orders.filter(order => matchesFilters(order, filters))
);
```

---

<!-- /ANCHOR:redux-state-avoiding-unnecessary-re-renders -->
<!-- ANCHOR:memory-leaks-prevention-and-detection -->
## 10. MEMORY LEAKS: PREVENTION AND DETECTION

### Common Causes

1. **Event listeners not cleaned up**
2. **Async operations completing after unmount**
3. **Timers/intervals not cleared**

### The Mounted Ref Pattern

```typescript
const MyComponent = () => {
  const mounted = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getData();

      // Check if component is still mounted
      if (mounted.current) {
        setData(data);
      }
    };

    fetchData();

    // Cleanup: mark as unmounted
    return () => {
      mounted.current = false;
    };
  }, []);
};
```

### AbortController Pattern

```typescript
const MyComponent = () => {
  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(handleResponse)
      .catch(error => {
        if (error.name === 'AbortError') return;  // Expected, ignore
        handleError(error);
      });

    // Cleanup: abort the request
    return () => controller.abort();
  }, [url]);
};
```

### Event Listener Cleanup

```typescript
useEffect(() => {
  const subscription = AppState.addEventListener('change', handleAppStateChange);

  // Cleanup: remove the listener
  return () => subscription.remove();
}, []);
```

---

<!-- /ANCHOR:memory-leaks-prevention-and-detection -->
<!-- ANCHOR:images-the-big-performance-win -->
## 11. IMAGES: THE BIG PERFORMANCE WIN

### expo-image Best Practices

```typescript
import { Image } from 'expo-image';

<Image
  source={imageUrl}
  style={{ width: scale(200), height: scale(200) }}

  // Content fitting
  contentFit="cover"  // or "contain", "fill", "scale-down"

  // Caching strategy
  cachePolicy="memory-disk"  // Most aggressive caching

  // Smooth loading
  transition={200}  // 200ms fade-in

  // For list recycling (FlatList)
  recyclingKey={item.id}  // Helps with item reuse
/>
```

### Preload Critical Images

```typescript
import { Image } from 'expo-image';

// Preload images you'll need soon
useEffect(() => {
  const imagesToPreload = [heroImage, logoImage, avatarImage];
  imagesToPreload.forEach(img => Image.prefetch(img));
}, []);
```

---

<!-- /ANCHOR:images-the-big-performance-win -->
<!-- ANCHOR:animations-keep-them-smooth -->
## 12. ANIMATIONS: KEEP THEM SMOOTH

### Rule: Use Native Driver

```typescript
// ✅ GOOD - runs on native thread (60fps)
Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,  // Key!
}).start();

// ❌ BAD - runs on JS thread (can drop frames)
Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  useNativeDriver: false,  // Avoid when possible
}).start();
```

### When You Can't Use Native Driver

Native driver supports: `opacity`, `transform` (translate, scale, rotate)

Native driver does NOT support: `width`, `height`, `backgroundColor`, `borderRadius`

For unsupported properties, use `react-native-reanimated`:

```typescript
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  width: withSpring(expanded.value ? 200 : 100),  // Works smoothly!
}));
```

---

<!-- /ANCHOR:animations-keep-them-smooth -->
<!-- ANCHOR:debugging-production-performance -->
## 13. DEBUGGING PRODUCTION PERFORMANCE

### Disable Console Logs in Production

The codebase already does this:
```typescript
// Only log API requests in non-production
if (ENV.ENV_NAME !== 'production') {
  logApiRequest(args, result, startTime);
}
```

---

<!-- /ANCHOR:debugging-production-performance -->
<!-- ANCHOR:image-processing-before-upload -->
## 14. IMAGE PROCESSING BEFORE UPLOAD

Use `expo-image-manipulator` to resize images before uploading to reduce upload time and server storage.

### Real Example: Profile Image Processing

```typescript
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

async function processImage(image: ImagePicker.ImagePickerAsset) {
  return ImageManipulator.manipulate(image.uri)
    .resize({ width: 64, height: 64 })  // Resize to target dimensions
    .renderAsync();
}

// Usage
const processedImage = await processImage(image);
const cachedImage = await processedImage.saveAsync({
  compress: 1,
  format: SaveFormat.PNG,
});
```

### When to Process Images

| Scenario | Resize To | Why |
|----------|-----------|-----|
| Profile avatars | 64x64 to 256x256 | Thumbnails don't need high res |
| Gallery thumbnails | 200x200 | List performance |
| Full-size upload | 1080px max dimension | Balance quality vs file size |

---

<!-- /ANCHOR:image-processing-before-upload -->
<!-- ANCHOR:deferring-non-critical-work -->
## 15. DEFERRING NON-CRITICAL WORK

Use `InteractionManager` to defer heavy operations until animations and interactions are complete.

### InteractionManager Pattern

```typescript
import { InteractionManager } from 'react-native';

// Defer non-critical work until animations complete
InteractionManager.runAfterInteractions(() => {
  // Heavy operations here won't block UI
  loadAnalytics();
  prefetchImages();
  syncBackgroundData();
});
```

### Real Example: Chat Screen Keyboard Handling

```typescript
const _keyboardDidShow = () => {
  if (isAtBottom && list && (chatRoomEventsData?.length ?? 0) > 0) {
    InteractionManager.runAfterInteractions(() => {
      if (!isMountedRef.current) return;
      listRef.current?.scrollToEnd({ animated: true });
    });
  }
};
```

### When to Use InteractionManager

| Task | Use InteractionManager? |
|------|------------------------|
| Scrolling after keyboard shows | ✅ Yes |
| Loading secondary data | ✅ Yes |
| Analytics/tracking calls | ✅ Yes |
| Initial data fetch | ❌ No - user is waiting |
| User-triggered actions | ❌ No - needs immediate response |

---

<!-- /ANCHOR:deferring-non-critical-work -->
<!-- ANCHOR:throttle-vs-debounce -->
## 16. THROTTLE VS DEBOUNCE

### When to Use Which

| Pattern | Use For | Example |
|---------|---------|---------|
| **Throttle** | Continuous events where you want regular updates | Typing indicators, scroll position, resize |
| **Debounce** | Discrete events where you want the final value | Search input, form validation, button clicks |

### Throttle: Real Example from Chat

Typing indicators:

```typescript
import { throttle } from "lodash";

// Throttle typing indicator to max once per 5 seconds
const throttleTyping = useRef(
  throttle(
    (value) => {
      const e = new ClientServerTypingEvent();
      if (selectedChatRoom?.id) {
        dispatch(
          addEventToWebSocketQueue({ roomId: selectedChatRoom?.id, event: e })
        );
      }
    },
    5000,  // 5 second throttle
    {
      leading: true,   // Fire immediately on first call
      trailing: false, // Don't fire again after delay
    }
  )
).current;

// Trigger on each keystroke - but only sends every 5 seconds
useEffect(() => {
  if (inputMessage?.value?.length > 0) {
    throttleTyping(inputMessage.value);
  }
}, [inputMessage.value]);
```

### Debounce: Search Input Example

```typescript
import { debounce } from "lodash";

// Debounce search to wait for user to stop typing
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    performSearch(query);
  }, 300),  // 300ms delay
  []
);

// Fires 300ms after user stops typing
const handleSearchChange = (text: string) => {
  setSearchQuery(text);
  debouncedSearch(text);
};

// Clean up on unmount
useEffect(() => {
  return () => debouncedSearch.cancel();
}, []);
```

### Key Differences

```
Throttle (5000ms): User types continuously
  [Type]──[Type]──[Type]──[Type]──[Type]──[Type]──[Type]
     ↓                                ↓
  [Send]                           [Send]

Debounce (300ms): User types, pauses, types again
  [Type]──[Type]──[Type]──────────[Type]──[Type]────────
                           ↓                        ↓
                        [Search]                 [Search]
```

---

<!-- /ANCHOR:throttle-vs-debounce -->
<!-- ANCHOR:common-performance-mistakes -->
## 17. COMMON PERFORMANCE MISTAKES

| ❌ Don't | ✅ Do | Why |
|----------|-------|-----|
| Use inline styles | Use StyleSheet | New object every render |
| Use inline callbacks in lists | Use useCallback + memo | New function every render |
| Select entire Redux slice | Select specific values | Re-renders on any change |
| Use ScrollView for long lists | Use FlatList | Doesn't virtualize |
| Forget cleanup in useEffect | Always return cleanup | Memory leaks |
| Use Image from react-native | Use Image from expo-image | No caching |
| Optimize before measuring | Profile first, then fix | Wasted effort |

---

<!-- /ANCHOR:common-performance-mistakes -->
<!-- ANCHOR:key-files-reference -->
## 18. KEY FILES REFERENCE

| Purpose | Path |
|---------|------|
| API Cache Config | `/src/services/api/base/cache.api.slice.ts` |
| API Debounce | `/src/services/api/base/debounce.api.slice.ts` |
| API Deduplication | `/src/services/api/base/deduplication.api.slice.ts` |
| Feature Flags | `/src/config/feature-flags.ts` |
| Scale Utility | `/src/utils/scale.ts` |
| FlashList Example (Chat) | `/src/screens/chat-screen/chat-screen.tsx` |
| Image Processing | `/src/screens/profile-screen/components/image-profile/image-profile.hook.ts` |

---

<!-- /ANCHOR:key-files-reference -->
<!-- ANCHOR:related-resources -->
## 19. RELATED RESOURCES

### Related References
- [React Native Standards](./react-native-standards.md) - Core component conventions
- [React Hooks Patterns](./react-hooks-patterns.md) - Custom hooks and state management
- [Expo Patterns](./expo-patterns.md) - Expo-specific patterns and configuration
- [Navigation Patterns](./navigation-patterns.md) - React Navigation patterns
<!-- /ANCHOR:related-resources -->
