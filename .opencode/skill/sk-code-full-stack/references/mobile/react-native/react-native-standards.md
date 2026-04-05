---
title: React Native Standards
description: A practical guide to building components in a React Native/Expo codebase, explaining HOW to create components, WHY we use certain patterns, and what mistakes to avoid.
---

# React Native Standards

A practical guide to building components in a React Native/Expo codebase, explaining HOW to create components, WHY we use certain patterns, and what mistakes to avoid.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on React Native component patterns including file naming, TypeScript props, styling with scale system, design tokens, component patterns, form handling, and performance optimization.

### When to Use

- Creating new components
- Styling with the scale system
- Using design tokens for colors and typography
- Implementing forms with validation
- Optimizing component performance

### Core Principle

Consistent patterns + type safety + scale system = maintainable, responsive React Native code.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:quick-start-creating-your-first-component -->
## 2. QUICK START: CREATING YOUR FIRST COMPONENT

### The Checklist

Before you start, answer:
1. **Is this reusable?** → Put in `src/components/`
2. **Is this screen-specific?** → Put in `src/screens/[screen-name]/components/`
3. **Does it have business logic?** → Create a `.hook.ts` file

### Step-by-Step: Create a New Component

**Step 1: Create the folder structure**

```
src/components/my-component/
├── my-component.tsx           # Main component
├── my-component.props.ts      # TypeScript interfaces
├── my-component.styles.ts     # Styles
├── my-component.hook.ts       # Logic (if needed)
└── index.ts                   # Barrel export
```

**Step 2: Define props first** (`my-component.props.ts`)

```typescript
import { ViewProps } from 'react-native';

export interface MyComponentProps extends ViewProps {
  title: string;
  subtitle?: string;  // Optional props have ?
  onPress: () => void;
  variant?: 'primary' | 'secondary';  // Use union types for variants
}
```

**Step 3: Create styles** (`my-component.styles.ts`)

```typescript
import { StyleSheet } from 'react-native';
import { scale } from 'utils/scale';
import { colors } from 'theme/colors';

export const styles = StyleSheet.create({
  container: {
    padding: scale(16),  // Always use scale()
    backgroundColor: colors.background.neutral.white,  // Use design tokens
    borderRadius: scale(8),
  },
  title: {
    marginBottom: scale(4),
  },
});
```

**Step 4: Build the component** (`my-component.tsx`)

```typescript
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StyledText } from 'components/styled-text/styled-text';
import { MyComponentProps } from './my-component.props';
import { styles } from './my-component.styles';

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  subtitle,
  onPress,
  variant = 'primary',  // Default value
  style,  // Allow style override from props
  ...rest  // Pass through other ViewProps
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}  // Merge styles
      {...rest}
    >
      <StyledText variant="bodyBaseSemiBold" style={styles.title}>
        {title}
      </StyledText>
      {subtitle && (
        <StyledText variant="captionRegular">{subtitle}</StyledText>
      )}
    </TouchableOpacity>
  );
};
```

**Step 5: Export it** (`index.ts`)

```typescript
export { MyComponent } from './my-component';
export type { MyComponentProps } from './my-component.props';
```

---

<!-- /ANCHOR:quick-start-creating-your-first-component -->
<!-- ANCHOR:file-naming-conventions -->
## 3. FILE NAMING CONVENTIONS

### Why Kebab-Case?

We use `kebab-case` (lowercase with hyphens) for files because:
- Consistent across all files
- Works on case-sensitive file systems (Linux/CI servers)
- Easy to read

### Naming Patterns

| File Type | Naming | Example |
|-----------|--------|---------|
| Component | `component-name.tsx` | `app-button.tsx` |
| Props | `component-name.props.ts` | `app-button.props.ts` |
| Styles | `component-name.styles.ts` | `app-button.styles.ts` |
| Hook | `component-name.hook.ts` | `app-button.hook.ts` |
| Types | `component-name.types.ts` | `app-button.types.ts` |

### Component Prefixes

| Prefix | Meaning | Example |
|--------|---------|---------|
| `App` | Branded/styled components | `AppButton`, `AppInput` |
| `Styled` | Typography/text components | `StyledText` |
| (none) | Utility/layout components | `ScreenView`, `Modal` |

---

<!-- /ANCHOR:file-naming-conventions -->
<!-- ANCHOR:typescript-props-interface-patterns -->
## 4. TYPESCRIPT: PROPS INTERFACE PATTERNS

### Extending React Native Types

**Why?** You get all the native props (like `style`, `onLayout`, `testID`) automatically.

```typescript
// ❌ WRONG - missing standard props
interface ButtonProps {
  onPress: () => void;
  title: string;
}

// ✅ CORRECT - extends TouchableOpacityProps
import { TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}
```

### Common Base Types to Extend

| Component Type | Extend From |
|----------------|-------------|
| Pressable/Button | `TouchableOpacityProps` or `PressableProps` |
| Container/Wrapper | `ViewProps` |
| Text | `TextProps` |
| Input | `TextInputProps` |
| ScrollView | `ScrollViewProps` |
| Image | `ImageProps` from `expo-image` |

### Union Types for Variants

```typescript
// Define all possible values
export type ButtonKind = 'primary' | 'secondary' | 'cta' | 'positive' | 'negative';
export type ButtonStyle = 'full' | 'ghost' | 'transparent';
export type ButtonSize = 'base' | 'small';

export interface AppButtonProps extends TouchableOpacityProps {
  kind?: ButtonKind;      // Optional with default in component
  buttonStyle?: ButtonStyle;
  size?: ButtonSize;
}
```

**Why union types instead of strings?**
- TypeScript autocomplete shows all options
- Catches typos at compile time
- Documents valid values

---

<!-- /ANCHOR:typescript-props-interface-patterns -->
<!-- ANCHOR:styling-the-scale-system -->
## 5. STYLING: THE SCALE SYSTEM

### Why `scale()`?

Different phones have different screen sizes. `scale()` adjusts dimensions proportionally.

```typescript
// On iPhone SE (320pt width): scale(16) ≈ 14
// On iPhone 14 Pro (393pt width): scale(16) = 16
// On iPhone 14 Pro Max (430pt width): scale(16) ≈ 18
```

### How to Use Scale

```typescript
import { scale } from 'utils/scale';

// ✅ CORRECT - all numeric values scaled
const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    marginTop: scale(24),
    borderRadius: scale(8),
    height: scale(48),
  },
  text: {
    fontSize: scale(14),  // Font sizes too
    lineHeight: scale(20),
  },
});

// ❌ WRONG - hardcoded values
const badStyles = StyleSheet.create({
  container: {
    padding: 16,  // Won't scale!
  },
});
```

### When NOT to Use Scale

```typescript
// Border widths - usually 1px is fine
borderWidth: 1,  // Not scaled

// Flex values
flex: 1,  // Not a dimension

// Percentage values
width: '100%',  // Already relative
```

---

<!-- /ANCHOR:styling-the-scale-system -->
<!-- ANCHOR:design-tokens-colors-typography -->
## 6. DESIGN TOKENS: COLORS & TYPOGRAPHY

### Using Colors

**Never use hex codes directly.** Use the design token system:

```typescript
import { colors } from 'theme/colors';

// ❌ WRONG
backgroundColor: '#FFFFFF',
color: '#1A1A1A',

// ✅ CORRECT
backgroundColor: colors.background.neutral.white,
color: colors.content.neutral.primary,
```

### Token Categories

| Category | Purpose | Example |
|----------|---------|---------|
| `colors.background.*` | Background colors | `colors.background.neutral.white` |
| `colors.content.*` | Text/icon colors | `colors.content.brand.primary` |
| `colors.border.*` | Border colors | `colors.border.neutral.light` |
| `colors.semantic.*` | Status colors | `colors.semantic.positive` |
| `colors.shades.*` | Raw color values | `colors.shades.primary.base` |

### Theme Sizing

The sizing system provides consistent radius tokens. See `src/theme/sizing.ts`:

```typescript
import { radius } from 'theme/sizing';

// Available radius tokens
radius.small       // scale(4)  - subtle rounding
radius.base        // scale(8)  - standard rounding
radius.large       // scale(12) - prominent rounding
radius.extraLarge  // scale(16) - very rounded
radius.circle      // scale(9999) - fully circular
```

> **Note:** Legacy color definitions may exist in `src/theme/palette.ts`. Prefer `colors` for new code.

### Using Typography

```typescript
import { StyledText } from 'components/styled-text/styled-text';

// Use the variant prop for consistent typography
<StyledText variant="headingH1Bold">Big Title</StyledText>
<StyledText variant="bodyBaseRegular">Body text</StyledText>
<StyledText variant="captionSemiBold">Small label</StyledText>
```

### Typography Variants

| Category | Variants |
|----------|----------|
| Heading (Bold) | `headingDisplayBold`, `headingH1Bold`, `headingH2Bold`, `headingH3Bold`, `headingH6Bold` |
| Heading (SemiBold) | `headingH4SemiBold`, `headingH5SemiBold`, `headingH6SemiBold` |
| Body Display | `bodyDisplayRegular`, `bodyDisplaySemiBold` |
| Body Extra Large | `bodyExtraLargeRegular`, `bodyExtraLargeSemiBold` |
| Body Large | `bodyLargeRegular`, `bodyLargeSemiBold` |
| Body Base | `bodyBaseRegular`, `bodyBaseSemiBold` |
| Body Small | `bodySmallRegular`, `bodySmallSemiBold` |
| Body Extra Small | `bodyExtraSmallRegular`, `bodyExtraSmallSemiBold` |
| Caption | `captionRegular`, `captionSemiBold` |

> **Reference:** See `src/theme/typography.ts` for full definitions including font sizes and line heights.

---

<!-- /ANCHOR:design-tokens-colors-typography -->
<!-- ANCHOR:component-patterns -->
## 7. COMPONENT PATTERNS

### The ScreenView Wrapper

**Always wrap screens** with ScreenView for consistent safe area handling:

```typescript
import { ScreenView } from 'components/screen-view/screen-view';

const MyScreen = () => {
  return (
    <ScreenView scheme="dark" outerStyle={styles.screen}>
      {/* Screen content */}
    </ScreenView>
  );
};
```

**Why?**
- Handles safe area insets (notch, home indicator)
- Consistent background color handling
- Dark/light mode support

### Hook Extraction Pattern

**When your component has more than ~10 lines of logic, extract to a hook:**

```typescript
// my-component.hook.ts
export const useMyComponent = (props: MyComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handlePress = useCallback(() => {
    setIsOpen(true);
    dispatch(trackEvent('opened'));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, handlePress, handleClose };
};

// my-component.tsx - clean and focused on UI
export const MyComponent: React.FC<MyComponentProps> = (props) => {
  const { isOpen, handlePress, handleClose } = useMyComponent(props);

  return (
    <View>
      <Button onPress={handlePress} />
      <Modal visible={isOpen} onClose={handleClose} />
    </View>
  );
};
```

### Conditional Rendering

```typescript
// ✅ GOOD - short-circuit for simple conditions
{isLoading && <Loader />}
{error && <ErrorMessage />}
{data && <DataView data={data} />}

// ✅ GOOD - ternary for either/or
{isLoading ? <Loader /> : <Content />}

// ❌ AVOID - nested ternaries (hard to read)
{isLoading ? <Loader /> : error ? <Error /> : <Content />}

// ✅ BETTER - early returns for complex conditions
if (isLoading) return <Loader />;
if (error) return <ErrorMessage error={error} />;
return <Content data={data} />;
```

---

<!-- /ANCHOR:component-patterns -->
<!-- ANCHOR:common-mistakes-and-how-to-avoid-them -->
## 8. COMMON MISTAKES AND HOW TO AVOID THEM

### Mistake 1: Inline Styles

```typescript
// ❌ WRONG - creates new object every render
<View style={{ padding: 16, backgroundColor: 'white' }}>

// ✅ CORRECT - use StyleSheet
<View style={styles.container}>
```

**Why?** Inline objects are recreated every render, causing unnecessary work.

### Mistake 2: Hardcoded Colors

```typescript
// ❌ WRONG - hardcoded hex
<View style={{ backgroundColor: '#FF5733' }}>

// ✅ CORRECT - use design tokens
<View style={{ backgroundColor: colors.background.brand.primary }}>
```

**Why?** Hardcoded colors:
- Can't be easily changed (design updates)
- Don't support dark mode
- Inconsistent across the app

### Mistake 3: Forgetting Scale

```typescript
// ❌ WRONG - won't look right on different devices
marginTop: 24,
fontSize: 16,

// ✅ CORRECT
marginTop: scale(24),
fontSize: scale(16),
```

### Mistake 4: Not Forwarding Props

```typescript
// ❌ WRONG - lost testID, accessibilityLabel, etc.
const MyButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

// ✅ CORRECT - forward rest props
const MyButton = ({ title, onPress, style, ...rest }) => (
  <TouchableOpacity onPress={onPress} style={style} {...rest}>
    <Text>{title}</Text>
  </TouchableOpacity>
);
```

### Mistake 5: Missing Default Props

```typescript
// ❌ WRONG - variant could be undefined
const Button = ({ variant }) => {
  // If variant is undefined, styling breaks
};

// ✅ CORRECT - provide defaults
const Button = ({ variant = 'primary' }) => {
  // variant is always defined
};
```

---

<!-- /ANCHOR:common-mistakes-and-how-to-avoid-them -->
<!-- ANCHOR:form-components -->
## 9. FORM COMPONENTS

### Using AppForm (Formik Wrapper)

```typescript
import { AppForm, AppFormField, AppFormSubmitButton } from 'components/form';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Too short').required('Required'),
});

const LoginForm = () => {
  const handleSubmit = (values) => {
    console.log(values);  // { email: '...', password: '...' }
  };

  return (
    <AppForm
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <AppFormField
        name="email"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AppFormField
        name="password"
        placeholder="Password"
        secureTextEntry
      />
      <AppFormSubmitButton title="Login" />
    </AppForm>
  );
};
```

### Validation with FieldFormValidator

```typescript
import { FieldFormValidator } from 'components/form/app-form-field/app-form-field.props';

const schema = Yup.object().shape({
  email: FieldFormValidator({ value: 'email', label: 'Email' }),
  password: FieldFormValidator({ value: '', label: 'Password', min: 8 }),
});
```

---

<!-- /ANCHOR:form-components -->
<!-- ANCHOR:performance-patterns -->
## 10. PERFORMANCE PATTERNS

### When to Use React.memo

```typescript
// ✅ USE memo for list items (rendered many times)
export const EventCard = React.memo(
  (props: EventCardProps) => { /* ... */ }
);

// ✅ USE memo for expensive renders
export const ComplexChart = React.memo(
  (props: ChartProps) => { /* ... */ }
);

// ❌ DON'T USE memo for simple components (overhead > benefit)
// Most components don't need memo
```

### When to Use useCallback

```typescript
// ✅ USE useCallback when passing to memoized children
const handlePress = useCallback(() => {
  doSomething();
}, []);

return <MemoizedChild onPress={handlePress} />;

// ❌ DON'T USE for inline handlers that don't affect children
<Button onPress={() => setOpen(true)} />  // Fine without useCallback
```

### When to Use useMemo

```typescript
// ✅ USE useMemo for expensive computations
const sortedItems = useMemo(() =>
  items.sort((a, b) => a.date - b.date),
  [items]
);

// ❌ DON'T USE for simple operations
const fullName = useMemo(() =>
  `${firstName} ${lastName}`,  // Too simple, useMemo is overhead
  [firstName, lastName]
);

// ✅ JUST DO this instead
const fullName = `${firstName} ${lastName}`;
```

---

<!-- /ANCHOR:performance-patterns -->
<!-- ANCHOR:safe-area-handling -->
## 11. SAFE AREA HANDLING

### Using Safe Area Insets

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MyScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Content won't be hidden behind notch */}
    </View>
  );
};
```

### Parameterized Styles with Insets

```typescript
// styles file
export const createStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
  });

// component
const MyScreen = () => {
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);

  return <View style={styles.container}>...</View>;
};
```

---

<!-- /ANCHOR:safe-area-handling -->
<!-- ANCHOR:import-organization -->
## 12. IMPORT ORGANIZATION

### Import Order

```typescript
// 1. React/React Native
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. External libraries
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

// 3. Internal absolute imports (path aliases)
import { StyledText } from 'components/styled-text/styled-text';
import { colors } from 'theme/colors';
import { scale } from 'utils/scale';

// 4. Relative imports (same folder)
import { MyComponentProps } from './my-component.props';
import { styles } from './my-component.styles';
```

### Path Aliases

| Alias | Maps To |
|-------|---------|
| `assets/*` | `src/assets/*` |
| `components/*` | `src/components/*` |
| `config/*` | `src/config/*` |
| `features/*` | `src/features/*` |
| `global/*` | `src/global/*` |
| `handlers/*` | `src/handlers/*` |
| `hooks/*` | `src/hooks/*` |
| `navigations/*` | `src/navigations/*` |
| `screens/*` | `src/screens/*` |
| `services/*` | `src/services/*` |
| `theme/*` | `src/theme/*` |
| `types/*` | `src/types/*` |
| `utils/*` | `src/utils/*` |

> **Note:** `src/components/index.ts` may have all exports commented out. Always use direct imports:
> ```typescript
> // ❌ WRONG - barrel export may be disabled
> import { StyledText } from 'components';
>
> // ✅ CORRECT - direct import
> import { StyledText } from 'components/styled-text/styled-text';
> ```

---

<!-- /ANCHOR:import-organization -->
<!-- ANCHOR:quick-reference-component-checklist -->
## 13. QUICK REFERENCE: COMPONENT CHECKLIST

Before submitting your component, verify:

- [ ] **Folder structure**: Follows `component-name/` pattern
- [ ] **File naming**: Uses kebab-case (`.tsx`, `.props.ts`, `.styles.ts`)
- [ ] **Props interface**: Extends appropriate RN type
- [ ] **Scale usage**: All numeric dimensions use `scale()`
- [ ] **Design tokens**: Colors from `colors`, typography from `StyledText`
- [ ] **No inline styles**: All styles in StyleSheet
- [ ] **Props forwarded**: `style` and `...rest` passed through
- [ ] **Default values**: Optional props have defaults
- [ ] **Exported**: Added to `index.ts`

---

<!-- /ANCHOR:quick-reference-component-checklist -->
<!-- ANCHOR:key-files-reference -->
## 14. KEY FILES REFERENCE

| Purpose | Path |
|---------|------|
| Button component | `/src/components/app-button/` |
| Text component | `/src/components/styled-text/` |
| Input component | `/src/components/app-input/` |
| Screen wrapper | `/src/components/screen-view/` |
| Color tokens | `/src/theme/colors.ts` |
| Typography | `/src/theme/typography.ts` |
| Scale utility | `/src/utils/scale.ts` |
| Form components | `/src/components/form/` |

---

<!-- /ANCHOR:key-files-reference -->
<!-- ANCHOR:do-this-not-that -->
## 15. DO THIS, NOT THAT

| ❌ Don't | ✅ Do | Why |
|----------|-------|-----|
| Use inline styles | Use StyleSheet | Performance |
| Hardcode hex colors | Use `colors.*` | Consistency, theming |
| Skip scale() | Use scale() everywhere | Responsive design |
| Put all logic in component | Extract to `.hook.ts` | Separation of concerns |
| Use string for variants | Use union types | Type safety |
| Forget to extend RN types | Always extend base props | Get standard props free |
| Create component in root | Create folder with files | Organization |

---

<!-- /ANCHOR:do-this-not-that -->
<!-- ANCHOR:related-resources -->
## 16. RELATED RESOURCES

### Related References
- [Expo Patterns](./expo-patterns.md) - Expo-specific patterns and configuration
- [Navigation Patterns](./navigation-patterns.md) - React Navigation patterns
- [React Hooks Patterns](./react-hooks-patterns.md) - Custom hooks and state management
- [Performance Optimization](./performance-optimization.md) - Performance best practices
- [Native Modules](./native-modules.md) - Native integrations
<!-- /ANCHOR:related-resources -->
