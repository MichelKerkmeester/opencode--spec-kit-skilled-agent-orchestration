---
title: Mobile Testing
description: Testing recommendations, framework setup, and patterns for React Native/Expo projects.
---

# Mobile Testing

Testing strategy and patterns for React Native/Expo projects. Currently a blueprint for future implementation (no tests exist yet).

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides testing guidelines, Jest/React Native Testing Library setup, and patterns for implementing tests in React Native projects. Documents recommended testing stack and provides ready-to-use test templates.

### Usage

1. Follow Quick Start to add testing infrastructure
2. Use Testing Patterns section for component/hook test templates
3. Reference Common Mocks for navigation, storage, and Expo modules
4. Follow Priority Order when implementing tests

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-status -->
## 2. Current Status

Most React Native projects do not currently have testing infrastructure. This document serves as a blueprint for when testing is added.

---

<!-- /ANCHOR:current-status -->
<!-- ANCHOR:quick-start-adding-testing-infrastructure -->
## 3. Quick Start: Adding Testing Infrastructure

### Step 1: Install Packages

```bash
npm install --save-dev \
  jest \
  jest-expo \
  @testing-library/react-native \
  @testing-library/jest-native \
  @types/jest
```

### Step 2: Add Jest Config

Create `jest.config.js` in project root:

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated)'
  ],
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^theme/(.*)$': '<rootDir>/src/theme/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
};
```

### Step 3: Add Setup File

Create `jest.setup.js` in project root:

```javascript
import '@testing-library/jest-native/extend-expect';

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo modules
jest.mock('expo-font');
jest.mock('expo-asset');

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({ params: {} }),
}));
```

### Step 4: Add npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

<!-- /ANCHOR:quick-start-adding-testing-infrastructure -->
<!-- ANCHOR:where-to-put-tests -->
## 4. Where to Put Tests

### Option A: Co-located Tests (Recommended)

```
src/
├── components/
│   └── app-button/
│       ├── app-button.tsx
│       ├── app-button.styles.ts
│       └── __tests__/
│           └── app-button.test.tsx   ← Tests next to code
├── hooks/
│   └── __tests__/
│       └── useFeed.test.ts
└── utils/
    └── __tests__/
        └── date_formatter.test.ts
```

**Why co-located?**
- Easy to find tests for any file
- Tests move with the code
- Clear ownership

### Option B: Separate Test Directory

```
src/
├── components/
├── hooks/
└── utils/

tests/
├── components/
│   └── app-button.test.tsx
├── hooks/
│   └── useFeed.test.ts
└── utils/
    └── date_formatter.test.ts
```

---

<!-- /ANCHOR:where-to-put-tests -->
<!-- ANCHOR:what-to-test-first -->
## 5. What to Test First

### Priority Order

1. **Utility functions** (easiest, highest value)
   - Date formatters
   - Validation functions
   - Data transformers

2. **Custom hooks** (medium difficulty)
   - Business logic hooks
   - API hooks

3. **Reusable components** (medium difficulty)
   - Buttons, inputs, cards
   - Form components

4. **Screens** (most complex)
   - Happy path only initially
   - Critical user flows

---

<!-- /ANCHOR:what-to-test-first -->
<!-- ANCHOR:testing-patterns -->
## 6. Testing Patterns

### Testing a Utility Function

```typescript
// src/utils/__tests__/date_formatter.test.ts
import { formatDate, getRelativeTime } from '../date_formatter';

describe('formatDate', () => {
  it('formats a date correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z');
    expect(formatDate(date)).toBe('Jan 15, 2024');
  });

  it('handles invalid date', () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('getRelativeTime', () => {
  it('returns "just now" for recent dates', () => {
    const now = new Date();
    expect(getRelativeTime(now)).toBe('just now');
  });
});
```

### Testing a Component

```typescript
// src/components/app-button/__tests__/app-button.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AppButton } from '../app-button';

describe('AppButton', () => {
  it('renders with text', () => {
    render(<AppButton text="Submit" onPress={() => {}} />);
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    render(<AppButton text="Submit" onPress={onPressMock} />);

    fireEvent.press(screen.getByText('Submit'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    render(<AppButton text="Submit" onPress={onPressMock} disabled />);

    fireEvent.press(screen.getByText('Submit'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    render(<AppButton text="Submit" onPress={() => {}} isLoading />);

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

### Testing a Hook

```typescript
// src/hooks/__tests__/useIsLoggedIn.test.ts
import { renderHook } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useIsLoggedIn } from '../useIsLoggedIn';
import authReducer from 'services/redux/slices/auth.slice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: initialState,
  });
};

const wrapper = (store) => ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useIsLoggedIn', () => {
  it('returns false when not authenticated', () => {
    const store = createTestStore({ auth: { token: null } });
    const { result } = renderHook(() => useIsLoggedIn(), {
      wrapper: wrapper(store)
    });

    expect(result.current).toBe(false);
  });

  it('returns true when authenticated', () => {
    const store = createTestStore({ auth: { token: 'valid-token' } });
    const { result } = renderHook(() => useIsLoggedIn(), {
      wrapper: wrapper(store)
    });

    expect(result.current).toBe(true);
  });
});
```

---

<!-- /ANCHOR:testing-patterns -->
<!-- ANCHOR:common-mocks-you-ll-need -->
## 7. Common Mocks You'll Need

### Navigation Mock

```typescript
// __mocks__/@react-navigation/native.ts
export const useNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
});

export const useRoute = () => ({
  params: {},
});

export const useFocusEffect = jest.fn();
export const NavigationContainer = ({ children }) => children;
```

### AsyncStorage Mock

```typescript
// __mocks__/@react-native-async-storage/async-storage.ts
const store = new Map();

export default {
  getItem: jest.fn((key) => Promise.resolve(store.get(key) ?? null)),
  setItem: jest.fn((key, value) => {
    store.set(key, value);
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    store.delete(key);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    store.clear();
    return Promise.resolve();
  }),
};
```

### Expo Location Mock

```typescript
// __mocks__/expo-location.ts
export const requestForegroundPermissionsAsync = jest.fn(() =>
  Promise.resolve({ status: 'granted' })
);

export const getCurrentPositionAsync = jest.fn(() =>
  Promise.resolve({
    coords: {
      latitude: 52.3676,
      longitude: 4.9041,
    }
  })
);
```

---

<!-- /ANCHOR:common-mocks-you-ll-need -->
<!-- ANCHOR:tips-for-good-tests -->
## 8. Tips for Good Tests

### Use testID for Reliable Selection

```typescript
// In your component
<View testID="loading-indicator">
  <ActivityIndicator />
</View>

// In your test
expect(screen.getByTestId('loading-indicator')).toBeTruthy();
```

### Test Behavior, Not Implementation

```typescript
// ❌ BAD - tests implementation details
expect(component.state.isLoading).toBe(true);

// ✅ GOOD - tests what user sees
expect(screen.getByTestId('loading-indicator')).toBeTruthy();
```

### One Concept Per Test

```typescript
// ❌ BAD - testing multiple things
it('works correctly', () => {
  render(<Button />);
  expect(screen.getByText('Submit')).toBeTruthy();
  fireEvent.press(screen.getByText('Submit'));
  expect(onPress).toHaveBeenCalled();
});

// ✅ GOOD - focused tests
it('renders with text', () => {
  render(<Button />);
  expect(screen.getByText('Submit')).toBeTruthy();
});

it('calls onPress when clicked', () => {
  render(<Button onPress={onPress} />);
  fireEvent.press(screen.getByText('Submit'));
  expect(onPress).toHaveBeenCalled();
});
```

---

<!-- /ANCHOR:tips-for-good-tests -->
<!-- ANCHOR:coverage-guidelines -->
## 9. Coverage Guidelines

When testing is implemented, aim for:

| Code Type  | Target Coverage | Notes                        |
| ---------- | --------------- | ---------------------------- |
| Utils      | 90%+            | Pure functions, easy to test |
| Hooks      | 80%+            | Business logic               |
| Components | 70%+            | Focus on user interactions   |
| Screens    | 50%+            | Happy paths only             |

**Remember**: Coverage % isn't the goal. Having the *right* tests is the goal.

---

<!-- /ANCHOR:coverage-guidelines -->
<!-- ANCHOR:next-steps -->
## 10. Next Steps

When you're ready to add testing:

1. **Start small**: Pick one utility file and add tests
2. **Add CI check**: Make tests run on pull requests
3. **Grow incrementally**: Add tests with new features
4. **Don't retrofit everything**: Focus on new code and critical paths

---

<!-- /ANCHOR:next-steps -->
<!-- ANCHOR:resources -->
## 11. Resources

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Expo Preset](https://docs.expo.dev/develop/unit-testing/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)

---

<!-- /ANCHOR:resources -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

- [react-native-standards.md](./react-native-standards.md) - Core coding conventions
- [react-hooks-patterns.md](./react-hooks-patterns.md) - Hook testing patterns
- [navigation-patterns.md](./navigation-patterns.md) - Navigation testing
- [performance-optimization.md](./performance-optimization.md) - Performance testing
<!-- /ANCHOR:related-resources -->
