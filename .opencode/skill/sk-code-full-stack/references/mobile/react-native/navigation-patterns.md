---
title: Navigation Patterns
description: A practical guide to navigation in a React Native/Expo app, explaining HOW to add screens, navigate between them, and avoid common pitfalls.
---

# Navigation Patterns

A practical guide to navigation in a React Native/Expo app, explaining HOW to add screens, navigate between them, and avoid common pitfalls.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on React Navigation patterns including adding screens, navigation types, common patterns, TypeScript typing, deep linking, and debugging.

### When to Use

- Adding new screens
- Implementing navigation logic
- Setting up deep links
- Debugging navigation issues

### Core Principle

Auth-based routing + typed navigation + proper cleanup = reliable app navigation.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:quick-start-understanding-our-navigation -->
## 2. QUICK START: UNDERSTANDING OUR NAVIGATION

Before diving in, understand the **big picture**:

```
User opens app
    ↓
Are they logged in? (Redux auth state)
    ↓
┌─────────────────────────────────────────────────────┐
│ No → AuthStack (login, signup, forgot password)     │
│ Partially → PendingStack (onboarding screens)       │
│ Yes → AppStack (main app with tabs)                 │
└─────────────────────────────────────────────────────┘
```

**Why this architecture?**
- Users can't access app screens without being logged in
- The app automatically redirects based on auth state
- You don't need to add auth checks to every screen

---

<!-- /ANCHOR:quick-start-understanding-our-navigation -->
<!-- ANCHOR:how-to-add-a-new-screen-step-by-step -->
## 3. HOW TO ADD A NEW SCREEN (STEP-BY-STEP)

### Step 1: Create the Screen Files

Create a folder in `src/screens/`:

```
src/screens/my-new-screen/
├── MyNewScreen.tsx        # Main component
├── MyNewScreen.hook.ts    # Navigation & business logic (or .tsx if returning JSX)
├── MyNewScreen.styles.ts  # Styles
└── index.ts               # Barrel export
```

> **Note:** Screen hooks can use either `.ts` or `.tsx` extension. Use `.tsx` when the hook returns JSX helper components or elements.

**MyNewScreen.tsx:**
```typescript
import { View, Text } from 'react-native';
import { styles } from './MyNewScreen.styles';
import { useMyNewScreenHook } from './MyNewScreen.hook';

export const MyNewScreen = () => {
  const { handleBack, data } = useMyNewScreenHook();

  return (
    <View style={styles.container}>
      <Text>My New Screen</Text>
    </View>
  );
};
```

**MyNewScreen.hook.ts:**
```typescript
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from 'navigations/navigation.types';

export const useMyNewScreenHook = () => {
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  const handleBack = () => {
    navigation.goBack();
  };

  return { handleBack };
};
```

> **Codebase Pattern:** Many existing screens pass `navigation` and `route` as props to hooks instead of using `useNavigation()`. See [Navigation Prop Passthrough](#pattern-6-navigation-prop-passthrough) for details on both approaches.

**index.ts:**
```typescript
export { MyNewScreen } from './MyNewScreen';
```

### Step 2: Add Navigation Types

Open `src/navigations/navigation.types.ts` and add your screen:

```typescript
export type AppStackParamList = {
  // ... existing screens
  my_new_screen: { userId: string } | undefined;  // with optional params
};
```

**Understanding the type syntax:**
- `undefined` = no params required
- `{ param: Type }` = required params
- `{ param: Type } | undefined` = optional params

### Step 3: Register the Screen

Open the appropriate stack file (usually `src/navigations/app-stack.tsx`):

```typescript
import { MyNewScreen } from 'screens/my-new-screen';

// In the safeScreens object (AppStack only):
const safeScreens = {
  // ... existing screens
  my_new_screen: MyNewScreen,
};
```

> **Note:** The `safeScreens` object pattern is specific to **AppStack**. Other stacks like `AuthStack` and `PendingStack` use inline `<Screen>` definitions:
> ```typescript
> // AuthStack pattern (inline Screen definitions)
> <Navigator>
>   <Screen name={'login'} component={LoginScreen} />
>   <Screen name={'sign_up'} component={SignUpScreen} />
> </Navigator>
> ```

### Step 4: Navigate to Your Screen

```typescript
// From any component with useNavigation
const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

// Without params
navigation.navigate('my_new_screen');

// With params
navigation.navigate('my_new_screen', { userId: '123' });
```

---

<!-- /ANCHOR:how-to-add-a-new-screen-step-by-step -->
<!-- ANCHOR:understanding-the-stack-structure -->
## 4. UNDERSTANDING THE STACK STRUCTURE

### Why Multiple Stacks?

| Stack | Purpose | When Active |
|-------|---------|-------------|
| AuthStack | Login, signup flows | User is logged out |
| PendingStack | Onboarding, verification | Account created but incomplete |
| AppStack | Main app screens | Fully authenticated |

**The switcher** (`offboard-stack.tsx`) automatically shows the right stack:

```typescript
switch (loginState) {
  case AuthStatus.Login:    return <AppStack />;
  case AuthStatus.Pending:  return <PendingStack />;
  case AuthStatus.Logout:   return <AuthStack />;
}
```

**Why this matters to you:**
- Don't manually check auth state in screens
- If a user logs out, they're automatically on AuthStack
- The switch happens automatically via Redux

### The Tab Navigator

Inside AppStack, we have tabs:

```
AppStack
└── tab_main (TabStack)
    ├── tab_home → HomeStackNavigator (nested screens)
    ├── tab_activity → ActivityStackNavigator (nested screens)
    ├── tab_message → Chat screen
    └── tab_user → Profile screen
```

**Why nested stacks in tabs?**
- Each tab can have its own navigation history
- Example: Home tab → Order detail → Back to Home (doesn't affect other tabs)

---

<!-- /ANCHOR:understanding-the-stack-structure -->
<!-- ANCHOR:common-navigation-patterns -->
## 5. COMMON NAVIGATION PATTERNS

### Pattern 1: Simple Navigation

```typescript
const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

// Go to a screen
navigation.navigate('order_detail');

// Go back
navigation.goBack();
```

### Pattern 2: Navigation with Parameters

```typescript
// Define params in navigation.types.ts
export type AppStackParamList = {
  order_detail: { orderId: string; source: 'feed' | 'notification' };
};

// Navigate with params
navigation.navigate('order_detail', {
  orderId: '123',
  source: 'feed'
});

// Read params in the destination screen
import { useRoute } from '@react-navigation/native';

const route = useRoute();
const { orderId, source } = route.params;
```

### Pattern 3: Navigate to a Tab

```typescript
// Navigate to a specific tab
navigation.navigate('tab_main', {
  screen: 'tab_home'
});

// Navigate to a screen INSIDE a tab
navigation.navigate('tab_main', {
  screen: 'tab_home',
  params: {
    screen: 'home_feed',
    params: { refresh: true }
  }
});
```

### Pattern 4: Reset Navigation (Clear History)

```typescript
import { CommonActions } from '@react-navigation/native';

// Use when: After login, after logout, after completing a flow
navigation.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'tab_main' }],
  })
);
```

### Pattern 5: Global Navigation (Outside React Components)

```typescript
import { navigationRef } from 'navigations/navigationRef';

// ALWAYS check if ready first
if (navigationRef.current?.isReady?.()) {
  navigationRef.current.navigate('chat');
}
```

**When to use:**
- From notification handlers
- From WebSocket message handlers
- From Redux middleware

### Pattern 6: Navigation Prop Passthrough

The codebase predominantly passes `navigation` and `route` as props to screen hooks rather than using `useNavigation()`:

```typescript
// Screen component passes navigation/route to hook
export const OrderDetailScreen = ({ navigation, route }: Props) => {
  const { showHeader, onBackPressed, ... } = useOrderDetailScreen(navigation, route);
  // ...
};

// Hook receives navigation/route as parameters
export const useOrderDetailScreen = (navigation: any, route: any) => {
  const { selectedTab = '' } = route?.params ?? {};

  const onBackPressed = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  }, [navigation]);

  return { onBackPressed, ... };
};
```

**When to use each approach:**

| Approach | When to Use |
|----------|-------------|
| **Prop passthrough** | When hook needs route params, when following existing codebase patterns |
| **useNavigation()** | For simple navigation actions, new isolated components |

> **Codebase Reality:** Most existing screens use prop passthrough. When modifying existing code, follow the established pattern. For new screens, either approach works.

### Pattern 7: NotificationManager for Robust Navigation

The app uses a `NotificationManager` singleton (`src/utils/notification.ts`) for handling navigation from push notifications with built-in reliability:

```typescript
import { notificationManager, navigateToChat } from 'utils/notification';

// The NotificationManager handles:
// 1. Pending navigation queue (stores navigation intent until ready)
// 2. WebSocket connection checks before chat navigation
// 3. Retry logic with MAX_NAVIGATION_ATTEMPTS (10 attempts)

// Navigate to chat with automatic retry
navigateToChat(roomId, chatRoomData);

// Or use the manager directly for custom flows
notificationManager.setPendingNavigation({
  action: 'chat',
  roomId: 'room-123',
  timestamp: Date.now(),
});
```

**Key features:**
- **Pending Queue**: Stores navigation intent when app is backgrounded or navigation isn't ready
- **Retry Logic**: Attempts navigation up to 10 times with 500ms delays
- **WebSocket Awareness**: Ensures WebSocket is connected before chat navigation
- **State Management**: Coordinates with Redux for chat room selection

**When to use:**
- Notification tap handlers (push notifications)
- Deep link handlers that navigate to chat
- Any background → foreground navigation flow

---

<!-- /ANCHOR:common-navigation-patterns -->
<!-- ANCHOR:typescript-typing-deep-dive -->
## 6. TYPESCRIPT TYPING DEEP DIVE

### Why Types Matter

Without types:
```typescript
// ❌ No error, but will crash at runtime
navigation.navigate('ordr_detail'); // typo!
navigation.navigate('order_detail', { id: 123 }); // wrong param name
```

With types:
```typescript
// ✅ TypeScript catches errors at compile time
navigation.navigate('ordr_detail'); // Error: not in AppStackParamList
navigation.navigate('order_detail', { id: 123 }); // Error: expected 'orderId'
```

### Typing Your Navigation Hook

```typescript
// In your .hook.ts file
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from 'navigations/navigation.types';

export const useMyScreenHook = () => {
  // Type the navigation
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  // Type the route (for reading params)
  const route = useRoute<RouteProp<AppStackParamList, 'my_screen'>>();

  // Now these are type-safe:
  const { myParam } = route.params ?? {};
  navigation.navigate('other_screen', { requiredParam: 'value' });
};
```

### Understanding CompositeScreenProps

> **Note:** This pattern is documented for reference but is **not currently implemented** in the codebase. Consider it a recommended pattern for complex nested navigation typing.

For screens inside nested navigators (like tab screens), you would need composite types:

```typescript
// This screen is in TabStack, which is inside AppStack
export type TabHomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'tab_home'>,  // Where it is
  StackScreenProps<AppStackParamList>                     // Parent navigator
>;
```

**Why?** So you can navigate to screens in the parent stack from a tab screen.

---

<!-- /ANCHOR:typescript-typing-deep-dive -->
<!-- ANCHOR:common-mistakes-and-how-to-avoid-them -->
## 7. COMMON MISTAKES AND HOW TO AVOID THEM

### Mistake 1: Navigating Before Ready

```typescript
// ❌ WRONG - might crash on app start
navigationRef.current.navigate('home');

// ✅ CORRECT - always check readiness
if (navigationRef.current?.isReady?.()) {
  navigationRef.current.navigate('home');
}
```

### Mistake 2: Forgetting to Add Types

```typescript
// ❌ WRONG - navigation works but no autocomplete, no error checking
navigation.navigate('my_screen', { data: something });

// ✅ CORRECT - add to navigation.types.ts first
export type AppStackParamList = {
  my_screen: { data: MyDataType };
};
```

### Mistake 3: Using navigate() When You Mean replace()

```typescript
// ❌ WRONG - user can go "back" to loading screen
navigation.navigate('home');  // from loading screen

// ✅ CORRECT - replaces loading screen in history
navigation.replace('home');
```

### Mistake 4: Memory Leaks from Navigation Listeners

```typescript
// ❌ WRONG - listener never cleaned up
useEffect(() => {
  navigation.addListener('focus', () => {
    fetchData();
  });
}, []);

// ✅ CORRECT - return unsubscribe function
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    fetchData();
  });
  return unsubscribe;
}, [navigation]);
```

### Mistake 5: Inconsistent Param Types

```typescript
// ❌ WRONG - mixing optional and required incorrectly
export type MyParamList = {
  screen_a: { id: string };  // Required
};
navigation.navigate('screen_a');  // Missing id! But might not error clearly

// ✅ CORRECT - be explicit about optionality
export type MyParamList = {
  screen_a: { id: string } | undefined;  // Optional params
  screen_b: { id: string };              // Required params (no undefined)
};
```

---

<!-- /ANCHOR:common-mistakes-and-how-to-avoid-them -->
<!-- ANCHOR:deep-linking -->
## 8. DEEP LINKING

### How Deep Links Work

```
myapp://order/123
    ↓
+native-intent.tsx parses the URL
    ↓
Routes to: order_detail with orderId: '123'
```

### Adding a New Deep Link

**Step 1**: Add URL path constant in `useUniLink.hook.ts`:
```typescript
enum URL_PATHS {
  // ... existing paths
  MY_NEW_PATH = '/app/my-feature',
}
```

**Step 2**: Add handler:
```typescript
const handleUniversalLinking = useCallback((url?: string) => {
  // ... existing handlers

  if (urlStr.includes(URL_PATHS.MY_NEW_PATH)) {
    const id = extractIdFromUrl(urlStr);
    navigationRef.current?.navigate('my_screen', { id });
  }
}, []);
```

### Testing Deep Links

```bash
# iOS Simulator
xcrun simctl openurl booted "myapp://order/123"

# Android Emulator
adb shell am start -a android.intent.action.VIEW -d "myapp://order/123"
```

---

<!-- /ANCHOR:deep-linking -->
<!-- ANCHOR:debugging-navigation-issues -->
## 9. DEBUGGING NAVIGATION ISSUES

### "Navigation hasn't been initialized"

**Cause**: Trying to navigate before NavigationContainer is mounted.

**Solution**: Use the readiness check:
```typescript
if (navigationRef.current?.isReady?.()) {
  // safe to navigate
}
```

### "The action 'NAVIGATE' was not handled"

**Cause**: Screen name not registered in navigator.

**Checklist**:
1. Screen added to `safeScreens` in stack file? (AppStack only uses this pattern)
2. Screen added via inline `<Screen>` component? (AuthStack, PendingStack)
3. Screen name matches exactly (case-sensitive)?
4. Screen in the correct stack (Auth vs App vs Pending)?

### "Cannot read property 'params' of undefined"

**Cause**: Accessing params when none were passed.

**Solution**: Use optional chaining:
```typescript
// ❌ Crashes if no params
const { id } = route.params;

// ✅ Safe access
const { id } = route.params ?? {};
```

### Tab Not Resetting When Re-tapped

**Solution**: Implemented in tab-stack.tsx - check the `resetTabNavigation` function is being called in the tab press listener.

---

<!-- /ANCHOR:debugging-navigation-issues -->
<!-- ANCHOR:architecture-decision-why-not-just-expo-router -->
## 10. ARCHITECTURE DECISION: WHY NOT JUST EXPO-ROUTER?

We use **both** expo-router (for entry) and React Navigation (for the main app):

| Feature | expo-router | React Navigation |
|---------|-------------|------------------|
| File-based routing | ✅ | ❌ |
| Complex nested navs | Limited | ✅ |
| Auth state routing | Manual | ✅ Built-in pattern |
| Bottom tabs + stacks | Limited | ✅ Full control |
| Shared element transitions | ❌ | ✅ |

**Our approach**: expo-router for entry point, React Navigation for everything else.

---

<!-- /ANCHOR:architecture-decision-why-not-just-expo-router -->
<!-- ANCHOR:glossary-navigation-terminology -->
## 11. GLOSSARY: NAVIGATION TERMINOLOGY

| Term | What It Means | When You'll See It |
|------|---------------|-------------------|
| **Stack Navigator** | A pile of screens where you push new screens on top and pop them off. Like a deck of cards. | `createStackNavigator()`, AppStack, AuthStack |
| **Tab Navigator** | Bottom tabs that switch between screens. Each tab can have its own stack. | `createBottomTabNavigator()`, TabStack |
| **Param List** | TypeScript type defining what parameters each screen accepts. | `AppStackParamList`, `AuthStackParamList` |
| **Route** | The current screen's information including name and params. | `useRoute()`, `route.params` |
| **Navigation Prop** | Object with methods to navigate between screens. | `useNavigation()`, `navigation.navigate()` |
| **Deep Link** | URL that opens a specific screen in the app. | `myapp://order/123` |
| **Navigator** | Container that manages a group of screens and their transitions. | Stack.Navigator, Tab.Navigator |

### Advanced Terms

| Term | What It Means | Example |
|------|---------------|---------|
| **CompositeScreenProps** | TypeScript type for screens in nested navigators. Combines props from parent and child navigator. | Tab screen that needs to navigate to AppStack screens |
| **NavigatorScreenParams** | TypeScript helper for typing params when navigating to a nested screen. | `navigate('tab_main', { screen: 'tab_home' })` |
| **NavigationIndependentTree** | Wrapper that isolates a React Navigation tree from expo-router. Required when mixing both. | Wraps our entire React Navigation setup |
| **navigationRef** | A ref that holds the navigation object, usable outside React components. | Push notifications, WebSocket handlers |
| **isReady()** | Method to check if navigation is mounted and ready. Always check before navigating from outside React. | `navigationRef.current?.isReady?.()` |

### Navigation Methods Explained

| Method | What It Does | When to Use |
|--------|--------------|-------------|
| `navigate(screen)` | Go to screen, reuse if already in stack | Most navigation |
| `push(screen)` | Always add new screen to stack | Allow multiple instances of same screen |
| `goBack()` | Go to previous screen | Back buttons |
| `replace(screen)` | Replace current screen in stack | After login (user can't go "back" to login) |
| `reset()` | Clear entire stack and start fresh | After logout |
| `popToTop()` | Go back to first screen in stack | "Home" button |

---

<!-- /ANCHOR:glossary-navigation-terminology -->
<!-- ANCHOR:quick-reference-common-tasks -->
## 12. QUICK REFERENCE: COMMON TASKS

| Task | How To |
|------|--------|
| Add a new screen | See Section 1 |
| Navigate to screen | `navigation.navigate('screen_name')` |
| Navigate with params | `navigation.navigate('screen', { param: value })` |
| Go back | `navigation.goBack()` |
| Replace current screen | `navigation.replace('screen')` |
| Reset navigation stack | Use `CommonActions.reset()` |
| Navigate from outside React | Check `navigationRef.current?.isReady?.()` first |
| Add deep link | Add to `useUniLink.hook.ts` |

---

<!-- /ANCHOR:quick-reference-common-tasks -->
<!-- ANCHOR:key-files-reference -->
## 13. KEY FILES REFERENCE

| Purpose | Path |
|---------|------|
| All navigation types | `/src/navigations/navigation.types.ts` |
| Global navigation ref | `/src/navigations/navigationRef.tsx` |
| Auth state switcher | `/src/navigations/offboard-stack.tsx` |
| Main app stack | `/src/navigations/app-stack.tsx` |
| Auth stack | `/src/navigations/auth-stack.tsx` |
| Pending stack | `/src/navigations/pending-stack.tsx` |
| Tab navigator | `/src/navigations/tab-stack/tab-stack.tsx` |
| Notification navigation | `/src/utils/notification.ts` |
| Deep link handler | `/src/hooks/useUniLink.hook.ts` |
| Expo deep links | `/src/app/+native-intent.tsx` |

---

<!-- /ANCHOR:key-files-reference -->
<!-- ANCHOR:related-resources -->
## 14. RELATED RESOURCES

### Related References
- [React Native Standards](./react-native-standards.md) - Core component conventions
- [Expo Patterns](./expo-patterns.md) - Expo-specific patterns and configuration
- [React Hooks Patterns](./react-hooks-patterns.md) - Custom hooks and state management
- [Performance Optimization](./performance-optimization.md) - Performance best practices
<!-- /ANCHOR:related-resources -->
