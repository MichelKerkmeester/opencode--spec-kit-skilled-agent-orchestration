---
title: Native Modules
description: A practical guide to the native integrations in a React Native/Expo app, explaining HOW to use each integration, common setup issues, and troubleshooting.
---

# Native Modules

A practical guide to the native integrations in a React Native/Expo app, explaining HOW to use each integration, common setup issues, and troubleshooting.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on native module integrations including push notifications, location services, maps, camera/image picker, Google Sign-In, error tracking, permissions, and storage.

### When to Use

- Implementing push notifications
- Working with location services
- Integrating maps
- Using camera and image picker
- Setting up authentication providers
- Managing permissions
- Configuring persistent storage

### Core Principle

Understand each native integration + follow permission patterns + handle errors gracefully = robust native functionality.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:quick-reference-what-s-available -->
## 2. QUICK REFERENCE: WHAT'S AVAILABLE

| Feature | Package | Status |
|---------|---------|--------|
| Push Notifications | Firebase + Notifee | ✅ Configured |
| Maps | expo-maps + react-native-maps | ✅ Configured |
| Google Sign-In | @react-native-google-signin | ✅ Configured |
| Location | expo-location | ✅ Configured |
| Camera/Photos | expo-image-picker | ✅ Configured |
| Error Tracking | Sentry | ✅ Configured |
| Storage | AsyncStorage + Redux Persist | ✅ Configured |

---

<!-- /ANCHOR:quick-reference-what-s-available -->
<!-- ANCHOR:push-notifications -->
## 3. PUSH NOTIFICATIONS

### How It Works

```
Firebase Cloud Messaging (FCM)
        ↓
Receives push notification
        ↓
Notifee displays local notification
        ↓
User taps → Navigation to relevant screen
```

### Getting the FCM Token

```typescript
import messaging from '@react-native-firebase/messaging';

// Request permission first
const authStatus = await messaging().requestPermission();
const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;

if (enabled) {
  const token = await messaging().getToken();
  // Send this token to your backend
  console.log('FCM Token:', token);
}
```

### Handling Notifications

```typescript
import notifee from '@notifee/react-native';

// Display a local notification
const displayNotification = async (title: string, body: string) => {
  // Create channel first (Android requirement)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title,
    body,
    android: { channelId },
  });
};
```

### Handling Background Messages

```typescript
// This must be in your app's root (index.js or App.tsx)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);
  // Store notification or update state
});
```

### Troubleshooting Notifications

**Problem**: Not receiving notifications

1. **Check FCM token is registered** with your backend
2. **Check permission status**: `messaging().hasPermission()`
3. **Check notification channel** (Android): Must be created before display
4. **iOS Simulator**: Push notifications don't work, use real device

**Problem**: Notification received but navigation doesn't work

```typescript
// Use the notification manager pattern
import { notificationManager } from 'utils/notification';

// When notification received but nav not ready:
notificationManager.setPendingNavigation({ screen: 'chat', params: { id } });

// Check for pending navigation when nav is ready:
const pending = notificationManager.getPendingNavigation();
if (pending) {
  navigation.navigate(pending.screen, pending.params);
  notificationManager.clearPendingNavigation();
}
```

---

<!-- /ANCHOR:push-notifications -->
<!-- ANCHOR:location-services -->
## 4. LOCATION SERVICES

### Getting Current Location

```typescript
import * as Location from 'expo-location';

const getLocation = async () => {
  // Request permission
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    console.log('Permission denied');
    return null;
  }

  // Get current position
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,  // Good balance of speed/accuracy
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};
```

### Permission Hook Pattern

```typescript
import { useLocationPermissions } from 'hooks';

const MyComponent = () => {
  const { granted, blocked, checkPermission, requestPermission } = useLocationPermissions();

  const handleGetLocation = async () => {
    if (!granted) {
      const success = await requestPermission();
      if (!success) return;  // User denied
    }

    // Now safe to get location
    const location = await getLocation();
  };
};
```

### Troubleshooting Location

**Problem**: Permission always denied

1. **Check Info.plist** has correct usage descriptions:
   - `NSLocationWhenInUseUsageDescription`
   - `NSLocationAlwaysUsageDescription` (if needed)
2. **Check Android manifest** has permissions
3. **Reset permissions** in device settings if testing

**Problem**: Location inaccurate

```typescript
// Use higher accuracy (slower but more accurate)
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.BestForNavigation,  // Highest accuracy
});
```

**Problem**: Location taking too long

```typescript
// Use lower accuracy (faster)
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Low,  // Faster, less accurate
});
```

---

<!-- /ANCHOR:location-services -->
<!-- ANCHOR:maps -->
## 5. MAPS

### Basic Map Usage

```typescript
import MapView, { Marker } from 'react-native-maps';

<MapView
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 52.3676,
    longitude: 4.9041,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>
  <Marker
    coordinate={{ latitude: 52.3676, longitude: 4.9041 }}
    title="Amsterdam"
    description="Capital of Netherlands"
  />
</MapView>
```

### Using Clustering (Many Markers)

```typescript
import Supercluster from 'react-native-clusterer';

// Create a Supercluster instance
const superCluster = new Supercluster({
  radius: 40,      // Cluster radius in pixels
  maxZoom: 16,     // Maximum zoom to cluster points
  minZoom: 0,      // Minimum zoom to cluster points
  minPoints: 2,    // Minimum points to form a cluster
});

// Load your GeoJSON features
superCluster.load(geoJSONFeatures);

// Get clusters for current map region
const bBox = [west, south, east, north];  // Bounding box
const zoom = currentZoom;
const clusters = superCluster.getClusters(bBox, zoom);
```

### Troubleshooting Maps

**Problem**: Map shows gray/blank on Android

1. **Check Google Maps API key** in `android/app/src/main/AndroidManifest.xml`
2. **Enable Maps SDK** in Google Cloud Console
3. **Check API key restrictions** (bundle ID, SHA-1)

**Problem**: Map shows gray/blank on iOS

1. **Check Apple Maps is working** (it uses Apple Maps by default on iOS)
2. For Google Maps on iOS, add `PROVIDER_GOOGLE` prop

---

<!-- /ANCHOR:maps -->
<!-- ANCHOR:camera-image-picker -->
## 6. CAMERA & IMAGE PICKER

### Picking an Image from Library

```typescript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  // Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert('Permission required', 'Please grant photo library access');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],  // Square
    quality: 0.8,    // 80% quality (smaller file)
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
};
```

### Taking a Photo

```typescript
const takePhoto = async () => {
  // Request camera permission
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert('Permission required', 'Please grant camera access');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
};
```

### Uploading an Image

```typescript
import * as FileSystem from 'expo-file-system';

const uploadImage = async (imageUri: string) => {
  const response = await FileSystem.uploadAsync(
    'https://api.example.com/upload',
    imageUri,
    {
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      mimeType: 'image/jpeg',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return JSON.parse(response.body);
};
```

### Troubleshooting Camera

**Problem**: Camera not working on iOS Simulator

- **Expected**: Camera doesn't work on iOS Simulator
- **Solution**: Use a real device for camera testing

**Problem**: Permission prompt not showing

1. **Delete and reinstall app** - permissions are cached
2. **Check usage descriptions** in `app.config.ts`

---

<!-- /ANCHOR:camera-image-picker -->
<!-- ANCHOR:google-sign-in -->
## 7. GOOGLE SIGN-IN

### Basic Usage

```typescript
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Configure once on app start
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID',  // From Google Cloud Console
  iosClientId: 'YOUR_IOS_CLIENT_ID',  // Optional, for iOS
});

const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    // Send userInfo.idToken to your backend
    return userInfo;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // User cancelled
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // Sign in already in progress
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // Play services not available (Android)
    } else {
      console.error('Google Sign-In error:', error);
    }
    return null;
  }
};
```

### Troubleshooting Google Sign-In

**Problem**: Error 10 on Android (Developer Error)

1. **Check SHA-1 fingerprint** in Firebase Console matches your keystore
2. **Check package name** matches exactly
3. For debug: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`

**Problem**: Error on iOS (invalid client)

1. **Check URL scheme** in `app.config.ts` matches Google Cloud Console
2. **Check bundle ID** matches exactly

---

<!-- /ANCHOR:google-sign-in -->
<!-- ANCHOR:error-tracking-sentry -->
## 8. ERROR TRACKING (SENTRY)

### Capturing Errors Manually

```typescript
import * as Sentry from '@sentry/react-native';

// Capture an exception
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}

// Capture a message
Sentry.captureMessage('Something noteworthy happened');

// Add context before capturing
Sentry.setUser({ id: userId, email: userEmail });
Sentry.setTag('screen', 'HomeScreen');
Sentry.captureException(error);
```

### Checking if Sentry is Enabled

```typescript
// Sentry is only enabled when ENV.ENABLE_SENTRY === 'true'
// This is typically only in staging/production builds
```

---

<!-- /ANCHOR:error-tracking-sentry -->
<!-- ANCHOR:permissions-the-complete-pattern -->
## 9. PERMISSIONS: THE COMPLETE PATTERN

### Platform-Specific Permissions

```typescript
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform, Alert, Linking } from 'react-native';

const isIOS = Platform.OS === 'ios';

// Map feature to permission
const PERMISSION_MAP = {
  camera: isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  location: isIOS
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  photos: isIOS
    ? PERMISSIONS.IOS.PHOTO_LIBRARY
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};

export const usePermission = (feature: keyof typeof PERMISSION_MAP) => {
  const permission = PERMISSION_MAP[feature];
  const [status, setStatus] = useState<string>('undetermined');

  const checkPermission = async () => {
    const result = await check(permission);
    setStatus(result);
    return result;
  };

  const requestPermission = async () => {
    const result = await request(permission);
    setStatus(result);

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Required',
        `Please enable ${feature} access in Settings`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }

    return result === RESULTS.GRANTED;
  };

  return {
    status,
    isGranted: status === RESULTS.GRANTED,
    isBlocked: status === RESULTS.BLOCKED,
    checkPermission,
    requestPermission,
  };
};
```

### When to Request Permissions

| ❌ Don't | ✅ Do |
|----------|-------|
| Request on app launch | Request when feature is needed |
| Request without context | Explain why first, then request |
| Ignore blocked status | Offer to open Settings |

---

<!-- /ANCHOR:permissions-the-complete-pattern -->
<!-- ANCHOR:storage-asyncstorage-redux-persist -->
## 10. STORAGE: ASYNCSTORAGE + REDUX PERSIST

### Direct AsyncStorage Usage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
await AsyncStorage.setItem('userPrefs', JSON.stringify({ theme: 'dark' }));

// Load data
const prefsString = await AsyncStorage.getItem('userPrefs');
const prefs = prefsString ? JSON.parse(prefsString) : null;

// Remove data
await AsyncStorage.removeItem('userPrefs');
```

### Redux Persist (Automatic)

Most state is automatically persisted. Check the whitelist in the store config:

```typescript
// From store.ts
const persistConfig = {
  key: 'root',
  whitelist: ['app_environment', 'auth', 'profile', 'utils'],  // These slices persist
  storage: AsyncStorage,
};
```

---

<!-- /ANCHOR:storage-asyncstorage-redux-persist -->
<!-- ANCHOR:key-files-reference -->
## 11. KEY FILES REFERENCE

| Purpose | Path |
|---------|------|
| Notification handler | `/src/utils/notification.ts` |
| Location permissions | `/src/hooks/useLocationPermissions.hook.ts` |
| Camera permission | `/src/hooks/useCameraPermission.hook.ts` |
| WebSocket connection | `/src/hooks/app-web-socket.hook.ts` |
| Image upload | `/src/services/api/profile.api.slice.ts` |
| Redux persist config | `/src/services/redux/store.ts` |
| Sentry config | `/app.config.ts` + `metro.config.js` |

---

<!-- /ANCHOR:key-files-reference -->
<!-- ANCHOR:troubleshooting-checklist -->
## 12. TROUBLESHOOTING CHECKLIST

| Issue | Check |
|-------|-------|
| Native module not found | Did you rebuild the app? (`npx expo prebuild --clean`) |
| Permission not prompting | Delete app and reinstall |
| Feature works on one platform | Check platform-specific config |
| Firebase issue | Check google-services.json / GoogleService-Info.plist |
| Build fails after adding module | Check expo plugin is added in app.config.ts |

---

<!-- /ANCHOR:troubleshooting-checklist -->
<!-- ANCHOR:related-resources -->
## 13. RELATED RESOURCES

### Related References
- [Expo Patterns](./expo-patterns.md) - Expo-specific patterns and configuration
- [React Native Standards](./react-native-standards.md) - Core component conventions
- [React Hooks Patterns](./react-hooks-patterns.md) - Custom hooks and state management
- [Performance Optimization](./performance-optimization.md) - Performance best practices

### Related References
- [Mobile Testing](./mobile_testing.md) - Testing native modules
<!-- /ANCHOR:related-resources -->
