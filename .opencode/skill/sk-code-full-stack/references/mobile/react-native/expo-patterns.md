---
title: Expo Patterns
description: A practical guide to working with Expo in a React Native codebase, explaining WHAT patterns exist, WHY they exist, and HOW to use them day-to-day.
---

# Expo Patterns

A practical guide to working with Expo in a React Native codebase, explaining WHAT patterns exist, WHY they exist, and HOW to use them day-to-day.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on Expo configuration, build profiles, environment management, feature flags, routing, and troubleshooting.

### When to Use

- Setting up new Expo projects or features
- Configuring environment variables
- Working with build profiles (EAS)
- Adding feature flags
- Handling deep links

### Core Principle

Type-safe configuration + environment-aware builds + feature flags = maintainable Expo application.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:quick-start-your-first-day -->
## 2. QUICK START: YOUR FIRST DAY

If you're new to this project, here's what you need to know:

1. **We use Expo SDK 52** with the New Architecture enabled
2. **Environment matters** - we have `development`, `staging`, and `production` builds
3. **expo-router handles navigation** - but we also use React Navigation for complex flows
4. **All env vars start with `EXPO_PUBLIC_`** - this is required by Expo

---

<!-- /ANCHOR:quick-start-your-first-day -->
<!-- ANCHOR:understanding-the-configuration -->
## 3. UNDERSTANDING THE CONFIGURATION

### Why Dynamic Config (`app.config.ts`)?

We use TypeScript configuration instead of `app.json` because:
- **Type safety**: Catch typos and invalid values at build time
- **Dynamic values**: Change app name, bundle ID, and icons per environment
- **Logic**: Conditionally include plugins based on environment

```typescript
// app.config.ts - simplified explanation
const isProduction = process.env.EXPO_PUBLIC_ENV_NAME === 'production';

// This is WHY we have different app names in App Store vs TestFlight
const appName = isProduction ? 'MyApp' : isStaging ? 'MyApp STG' : 'MyApp DEV';
```

### Key Config Features Explained

| Feature | What It Does | Why We Use It |
|---------|--------------|---------------|
| `newArchEnabled: true` | Enables Fabric renderer & TurboModules | Better performance, required for some new libraries |
| `experiments.typedRoutes: true` | Type-safe expo-router navigation | Catch navigation errors at compile time |
| `experiments.reactCompiler: true` | Auto-memoization by React 19 compiler | Reduces manual `useMemo`/`useCallback` needs |

### Common Task: Adding a New Environment Variable

**Step 1**: Add to your `.env` files (`.env.development`, `.env.staging`, `.env.production`):
```bash
EXPO_PUBLIC_MY_NEW_VAR=some_value
```

**Step 2**: Add type-safe access in `src/config/env.ts`:
```typescript
export const ENV = {
  // ... existing vars
  MY_NEW_VAR: `${process.env.EXPO_PUBLIC_MY_NEW_VAR}`,
};
```

**Step 3**: Use it in your code:
```typescript
import { ENV } from 'config';
console.log(ENV.MY_NEW_VAR);
```

**Common Mistake**: Forgetting `EXPO_PUBLIC_` prefix. Without it, the variable won't be available in the JS bundle.

```typescript
// ❌ WRONG - won't work
process.env.MY_SECRET_KEY  // undefined in app

// ✅ CORRECT
process.env.EXPO_PUBLIC_MY_KEY  // works
```

### Common Task: Adding a New Expo Plugin

**Step 1**: Install the package:
```bash
npm install expo-new-feature
```

**Step 2**: Add to `app.config.ts` plugins array:
```typescript
plugins: [
  // ... existing plugins

  // Simple plugin (no config needed)
  "expo-new-feature",

  // Plugin with configuration
  [
    "expo-new-feature",
    {
      option1: "value",
      option2: true,
    },
  ],
],
```

**Step 3**: Rebuild native code:
```bash
# For development
npx expo prebuild --clean

# For EAS builds - the prebuild happens automatically
eas build --profile development --platform ios
```

**Common Mistakes with Plugins**:

```typescript
// ❌ WRONG - plugin not in array format when it needs config
plugins: [
  "expo-new-feature", { option: "value" }  // This is TWO separate entries!
]

// ✅ CORRECT - plugin with config as nested array
plugins: [
  ["expo-new-feature", { option: "value" }]  // Single entry with config
]
```

**When to Rebuild**: You MUST rebuild native code when:
- Adding a new plugin
- Changing plugin configuration
- Updating a package that has native code

**You DON'T need to rebuild when**:
- Changing only JavaScript/TypeScript code
- Updating environment variables (just restart Metro)

### Common Task: Adding a New Font

**Step 1**: Add the font file to `assets/fonts/`:
```
assets/fonts/
├── MyNewFont-Regular.ttf
├── MyNewFont-Bold.ttf
└── ... existing fonts
```

**Step 2**: Register in `app.config.ts` under expo-font plugin:
```typescript
[
  "expo-font",
  {
    fonts: [
      // ... existing fonts
      "./assets/fonts/MyNewFont-Regular.ttf",
      "./assets/fonts/MyNewFont-Bold.ttf",
    ],
  },
],
```

**Step 3**: Use in your styles or Typography config:
```typescript
// In src/theme/typography.ts or your component styles
fontFamily: 'MyNewFont-Regular',

// Or add to typography variants
const fontConfig = {
  myNewFont: {
    regular: 'MyNewFont-Regular',
    bold: 'MyNewFont-Bold',
  },
};
```

**Step 4**: Rebuild native code (fonts require native rebuild):
```bash
npx expo prebuild --clean
```

**Font Naming Tips**:
- Use the **exact PostScript name** of the font (check in Font Book on Mac)
- The filename should match the font name for clarity
- Weight-based naming helps organization: `FontName-Regular.ttf`, `FontName-Bold.ttf`

**Troubleshooting Fonts**:

| Problem | Solution |
|---------|----------|
| Font not loading | Check exact PostScript name in Font Book |
| Font looks wrong | Verify you're using correct weight name |
| Font works on iOS but not Android | Check font file isn't corrupted |
| "fontFamily not found" | Rebuild native code after adding |

---

<!-- /ANCHOR:understanding-the-configuration -->
<!-- ANCHOR:build-profiles-eas -->
## 4. BUILD PROFILES (EAS)

### When to Use Each Profile

| Profile | When to Use | Who Gets It |
|---------|-------------|-------------|
| `development` | Local testing, debugging | You, on your device |
| `staging` | QA testing, stakeholder demos | TestFlight/Internal testing |
| `production` | App Store releases | End users |

### Common Task: Creating a Build

```bash
# Development build (for your device)
eas build --profile development --platform ios

# Staging build (for TestFlight)
eas build --profile staging --platform ios

# Production build (for App Store)
eas build --profile production --platform ios
```

### Troubleshooting Build Failures

**Problem**: "Out of memory" during Android build
**Solution**: Configure Gradle with extra memory in `eas.json`:
```json
"gradleCommand": ":app:bundleRelease -Xmx8192m -XX:MaxMetaspaceSize=4096m"
```

**Problem**: "Credentials not found"
**Solution**: We use local credentials. Make sure you have:
- iOS: Valid provisioning profile and certificate in Keychain
- Android: `keystore.jks` file and `credentials.json`

**Problem**: Build works locally but fails on EAS
**Solution**:
1. Check Node version matches (specified in config)
2. Clear EAS cache: `eas build --clear-cache`

---

<!-- /ANCHOR:build-profiles-eas -->
<!-- ANCHOR:working-with-assets -->
## 5. WORKING WITH ASSETS

### Directory Structure Explained

```
assets/                    # Build-time assets (bundled by Expo)
  fonts/                   # Fonts registered in app.config.ts
  images/                  # App icons, splash screens

src/assets/                # Runtime assets (used in components)
  images/                  # Requires via barrel export
  lotties/                 # Animation files
  svg/                     # SVG as XML strings (not files!)
```

**Why two folders?**
- `assets/` = Referenced in `app.config.ts` for native configuration
- `src/assets/` = Referenced in React components via imports

### Common Task: Adding a New Image

**Step 1**: Add the image file to `src/assets/images/`

**Step 2**: Export it in `src/assets/images/index.ts`:
```typescript
export const images = {
  // ... existing images
  my_new_image: require('./my_new_image.png'),
};

// Add to the type union
export type ImageType = /* ... */ | 'my_new_image';

// Add to the switch statement
export const generateImage = (image: ImageType) => {
  switch (image) {
    // ... existing cases
    case 'my_new_image': return images.my_new_image;
  }
};
```

**Step 3**: Use it in your component:
```typescript
import { Image } from 'expo-image';
import { generateImage } from 'assets';

<Image
  source={generateImage('my_new_image')}
  style={{ width: scale(100), height: scale(100) }}
  contentFit="contain"
/>
```

### Common Mistakes with Images

```typescript
// ❌ WRONG - using react-native Image prop
<Image resizeMode="contain" />

// ✅ CORRECT - expo-image uses contentFit
<Image contentFit="contain" />

// ❌ WRONG - hardcoded dimensions
<Image style={{ width: 100, height: 100 }} />

// ✅ CORRECT - scaled for different screen sizes
<Image style={{ width: scale(100), height: scale(100) }} />
```

---

<!-- /ANCHOR:working-with-assets -->
<!-- ANCHOR:environment-switching -->
## 6. ENVIRONMENT SWITCHING

### How Environments Work

```
Build Time: EXPO_PUBLIC_ENV_NAME determines initial environment
     ↓
Runtime: Redux state can override (for environment switcher feature)
     ↓
API Calls: getApiBaseUrl() returns correct URL
```

### The FORCE_ENVIRONMENT Pattern

**What it does**: Allows hardcoding environment during development without rebuilding.

**When to use**:
- Testing production API with a development build
- Debugging environment-specific issues

```typescript
// src/utils/environment.constants.ts
export let FORCE_ENVIRONMENT: ForceEnvironment = ForceEnvironment.DYNAMIC;

// To force staging API:
// 1. Change DYNAMIC to STAGING
// 2. Reload the app (no rebuild needed)
```

**Warning**: Never commit with `FORCE_ENVIRONMENT` set to anything other than `DYNAMIC`.

### Common Task: Checking Current Environment

```typescript
import { getCurrentEnvironment, getApiBaseUrl } from 'utils/environment.utils';

// Get environment name
const env = getCurrentEnvironment(); // 'production' | 'staging'

// Get the right API URL automatically
const apiUrl = getApiBaseUrl(); // Returns correct URL for current env
```

---

<!-- /ANCHOR:environment-switching -->
<!-- ANCHOR:feature-flags -->
## 7. FEATURE FLAGS

### Why Feature Flags?

Feature flags let us:
- Ship incomplete features (hidden by default)
- A/B test features
- Quick-disable broken features without a new release
- Mock data for offline development
- Simulate different app states (timezones, maintenance mode)

### Flag Structure Patterns

Flags can be structured in three ways:

**1. Simple Booleans** - Basic on/off toggles:
```typescript
SHOW_MAP_VIEW_BUTTON: false,
USE_MOCK_FEED_DATA: false,
```

**2. Nested Objects** - Toggles with configuration:
```typescript
MOCK_TIMEZONE: {
  ENABLED: false,
  TIMEZONE: "Europe/Lisbon",  // IANA timezone identifier
},
```

**3. Multi-Property Objects** - Granular control over related features:
```typescript
ORDER_APPLICATION_STATUS: {
  WAITING_APPROVAL: true,
  ACCEPTED: true,
  REJECTED: true,
  // ... more status toggles
},
```

### Example Flags (`src/config/feature-flags.ts`)

| Flag | Type | Purpose |
|------|------|---------|
| `SHOW_MAP_VIEW_BUTTON` | boolean | Show/hide map view feature |
| `USE_MOCK_FEED_DATA` | boolean | Use mock data for feed (offline dev) |
| `USE_MOCK_ORDERS_DATA` | boolean | Use mock data for "My Orders" section |
| `MOCK_TIMEZONE` | object | Simulate different timezones |
| `MOCK_TIMEZONE.ENABLED` | boolean | Enable timezone simulation |
| `MOCK_TIMEZONE.TIMEZONE` | string | IANA timezone (e.g., "Europe/Lisbon", "Asia/Tokyo") |
| `ORDER_APPLICATION_STATUS` | object | Control which application statuses are enabled |
| `FORCE_SHOW_UPDATE_APP_MODAL` | boolean | Force show app update modal in dev |
| `SHOW_MAINTENANCE_MODE_MODAL` | boolean | Simulate maintenance mode |
| `ENABLE_CANCEL_PENDING_APPLICATIONS` | boolean | Toggle cancel button for pending applications |

### Common Task: Adding a Feature Flag

**Step 1**: Add the flag (choose appropriate structure):
```typescript
export const FEATURE_FLAGS = {
  // ... existing flags

  // Simple boolean
  ENABLE_NEW_CHAT_UI: false,

  // Object with config
  NEW_FEATURE: {
    ENABLED: false,
    VARIANT: 'A',
  },
};
```

**Step 2**: Use it in your code:
```typescript
import { FEATURE_FLAGS } from 'config/feature-flags';

// Simple boolean
if (FEATURE_FLAGS.ENABLE_NEW_CHAT_UI) {
  return <NewChatUI />;
}

// Object with config
if (FEATURE_FLAGS.NEW_FEATURE.ENABLED) {
  const variant = FEATURE_FLAGS.NEW_FEATURE.VARIANT;
  // ...
}
```

**Step 3**: When ready to release, change to `true` (or remove the flag entirely).

### Usage Examples

**Checking timezone simulation:**
```typescript
import { FEATURE_FLAGS } from 'config/feature-flags';

const getTimezone = () => {
  if (FEATURE_FLAGS.MOCK_TIMEZONE.ENABLED) {
    return FEATURE_FLAGS.MOCK_TIMEZONE.TIMEZONE;
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
```

**Checking order application status:**
```typescript
import { FEATURE_FLAGS } from 'config/feature-flags';

const isStatusEnabled = (status: string) => {
  return FEATURE_FLAGS.ORDER_APPLICATION_STATUS[status] ?? false;
};
```

---

<!-- /ANCHOR:feature-flags -->
<!-- ANCHOR:expo-router-basics -->
## 8. EXPO-ROUTER BASICS

### File Structure = Routes

```
src/app/
  _layout.tsx       → Root layout wrapper
  index.tsx         → Entry point (/)
  +native-intent.tsx → Deep link handler
```

### Why We Also Use React Navigation

expo-router is great for simple routing, but we use React Navigation for:
- Complex nested navigators (tabs + stacks + modals)
- Auth-based route protection
- Bottom sheet navigation
- Shared element transitions

The `AppProvider` in `index.tsx` sets up React Navigation.

### Deep Linking

**URL Scheme**: `myapp://`

**Example**: `myapp://order/123` opens order detail screen

The handler in `+native-intent.tsx` parses these URLs and routes appropriately.

---

<!-- /ANCHOR:expo-router-basics -->
<!-- ANCHOR:splash-screen -->
## 9. SPLASH SCREEN

### How It Works

```typescript
// 1. Keep splash visible during initial load
SplashScreen.preventAutoHideAsync();

// 2. Configure animation
SplashScreen.setOptions({ duration: 500, fade: true });

// 3. Hide when app is ready
const handleNavigationReady = async () => {
  await SplashScreen.hideAsync();
};
```

### Common Issue: Splash Screen Stuck

**Cause**: `hideAsync()` never called (usually due to error during init)

**Debug**: Check that:
1. All required data has loaded
2. Navigation container is ready
3. No unhandled errors in `AppProvider`

---

<!-- /ANCHOR:splash-screen -->
<!-- ANCHOR:troubleshooting-guide -->
## 10. TROUBLESHOOTING GUIDE

### Metro Bundler Issues

**Problem**: Changes not reflecting / stale cache
```bash
# Clear Metro cache and restart
npx expo start --clear
```

**Problem**: "Unable to resolve module"
```bash
# Reset all caches
rm -rf node_modules
npm install
npx expo start --clear
```

### Build Issues

**Problem**: "Config plugin not found"
```bash
# Rebuild native code
npx expo prebuild --clean
```

**Problem**: iOS build fails with signing errors
1. Check Xcode has valid Apple Developer account
2. Ensure provisioning profile matches bundle ID
3. Try: `eas credentials` to reset

### Environment Variable Issues

**Problem**: Env var is `undefined`
1. Check it has `EXPO_PUBLIC_` prefix
2. Restart Metro bundler after adding new vars
3. For EAS builds, check `eas.json` env section

**Problem**: Wrong environment API being called
1. Check `getCurrentEnvironment()` return value
2. Check Redux `appEnvironment` state
3. Check `FORCE_ENVIRONMENT` isn't hardcoded

---

<!-- /ANCHOR:troubleshooting-guide -->
<!-- ANCHOR:key-files-quick-reference -->
## 11. KEY FILES QUICK REFERENCE

| What You Need | File Path |
|---------------|-----------|
| Add environment variable | `src/config/env.ts` |
| Add feature flag | `src/config/feature-flags.ts` |
| Configure Expo | `app.config.ts` |
| Configure builds | `eas.json` |
| Add image asset | `src/assets/images/index.ts` |
| Handle deep links | `src/app/+native-intent.tsx` |
| Environment utilities | `src/utils/environment.utils.ts` |

---

<!-- /ANCHOR:key-files-quick-reference -->
<!-- ANCHOR:do-this-not-that -->
## 12. DO THIS, NOT THAT

| ❌ Don't | ✅ Do | Why |
|----------|-------|-----|
| Use `app.json` | Use `app.config.ts` | Type safety, dynamic values |
| Hardcode API URLs | Use `getApiBaseUrl()` | Environment-aware |
| Use `react-native` Image | Use `expo-image` | Better performance, caching |
| Commit with FORCE_ENVIRONMENT set | Keep it DYNAMIC | Prevents accidental prod issues |
| Access env vars directly | Use `ENV` object from config | Centralized, type-safe |
| Add fonts to package.json | Add to assets/fonts + app.config.ts | Proper Expo font loading |

---

<!-- /ANCHOR:do-this-not-that -->
<!-- ANCHOR:related-resources -->
## 13. RELATED RESOURCES

### Related References
- [React Native Standards](./react-native-standards.md) - Core component conventions
- [Navigation Patterns](./navigation-patterns.md) - React Navigation patterns
- [React Hooks Patterns](./react-hooks-patterns.md) - Custom hooks and state management
- [Performance Optimization](./performance-optimization.md) - Performance best practices
- [Native Modules](./native-modules.md) - Native integrations
<!-- /ANCHOR:related-resources -->
