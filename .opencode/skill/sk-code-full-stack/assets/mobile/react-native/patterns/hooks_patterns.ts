/* ─────────────────────────────────────────────────────────────
   React Native Custom Hooks Patterns
   Production-ready hooks for common mobile functionality

   CONTENTS:
   1. useAppState - Track app foreground/background state
   2. useKeyboard - Keyboard visibility and dimensions
   3. useOrientation - Device orientation detection
   4. useNetworkStatus - Network connectivity monitoring
   5. useAsyncStorage - Persistent storage with type safety
   6. useDeepLink - Deep link handling and parsing
   7. useDimensions - Window/screen dimensions with updates
   8. useBackHandler - Android back button handling
   9. usePermission - Generic permission handling
   10. useBiometrics - Biometric authentication
   11. useDebounce - Debounced values
   12. useThrottle - Throttled callbacks
   13. usePrevious - Track previous value
   14. useInterval - Safe interval management
   15. useMounted - Track component mount state
──────────────────────────────────────────────────────────────── */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Dimensions,
  Keyboard,
  KeyboardEvent,
  Linking,
  Platform,
  ScaledSize,
  BackHandler,
  NativeEventSubscription,
} from 'react-native';


/* ─────────────────────────────────────────────────────────────
   TYPE DEFINITIONS
──────────────────────────────────────────────────────────────── */

export interface KeyboardState {
  isVisible: boolean;
  height: number;
  duration: number;
  coordinates: {
    start: { screenX: number; screenY: number; width: number; height: number };
    end: { screenX: number; screenY: number; width: number; height: number };
  } | null;
}

export type Orientation = 'portrait' | 'landscape';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

export interface DeepLinkState<T = Record<string, string>> {
  url: string | null;
  path: string | null;
  params: T;
}

export interface DimensionsState {
  window: ScaledSize;
  screen: ScaledSize;
}

export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable' | 'undetermined';

export interface BiometricState {
  isAvailable: boolean;
  biometryType: 'Face ID' | 'Touch ID' | 'Biometrics' | null;
  isEnrolled: boolean;
}


/* ─────────────────────────────────────────────────────────────
   1. useAppState - Track App Foreground/Background State

   Monitors app state transitions (active, background, inactive).
   Useful for:
   - Pausing/resuming activities when app backgrounds
   - Refreshing data when app returns to foreground
   - Analytics tracking for session time
──────────────────────────────────────────────────────────────── */

interface UseAppStateOptions {
  /** Called when app becomes active (foreground) */
  onForeground?: () => void;
  /** Called when app goes to background */
  onBackground?: () => void;
  /** Called on any state change */
  onChange?: (state: AppStateStatus) => void;
}

interface UseAppStateReturn {
  /** Current app state */
  appState: AppStateStatus;
  /** Whether app is in foreground (active) */
  isActive: boolean;
  /** Whether app is in background */
  isBackground: boolean;
  /** Previous app state (for transition detection) */
  previousState: AppStateStatus | null;
}

export function useAppState(options: UseAppStateOptions = {}): UseAppStateReturn {
  const { onForeground, onBackground, onChange } = options;

  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const previousStateRef = useRef<AppStateStatus | null>(null);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Detect foreground transition
      if (
        previousStateRef.current &&
        previousStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onForeground?.();
      }

      // Detect background transition
      if (
        previousStateRef.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        onBackground?.();
      }

      previousStateRef.current = appState;
      setAppState(nextAppState);
      onChange?.(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, onForeground, onBackground, onChange]);

  return {
    appState,
    isActive: appState === 'active',
    isBackground: appState === 'background',
    previousState: previousStateRef.current,
  };
}

// Usage example:
// const { appState, isActive } = useAppState({
//   onForeground: () => console.log('App came to foreground'),
//   onBackground: () => console.log('App went to background'),
// });


/* ─────────────────────────────────────────────────────────────
   2. useKeyboard - Keyboard Visibility and Dimensions

   Tracks keyboard show/hide events and provides keyboard dimensions.
   Useful for:
   - Adjusting layout when keyboard appears
   - Scrolling to focused input
   - Custom keyboard-aware views
──────────────────────────────────────────────────────────────── */

interface UseKeyboardOptions {
  /** Called when keyboard shows */
  onShow?: (event: KeyboardEvent) => void;
  /** Called when keyboard hides */
  onHide?: () => void;
}

export function useKeyboard(options: UseKeyboardOptions = {}): KeyboardState {
  const { onShow, onHide } = options;

  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isVisible: false,
    height: 0,
    duration: 0,
    coordinates: null,
  });

  useEffect(() => {
    // Platform-specific event names
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardState({
        isVisible: true,
        height: event.endCoordinates.height,
        duration: event.duration || 250,
        coordinates: {
          start: event.startCoordinates || {
            screenX: 0,
            screenY: 0,
            width: 0,
            height: 0,
          },
          end: event.endCoordinates,
        },
      });
      onShow?.(event);
    };

    const handleKeyboardHide = () => {
      setKeyboardState((prev) => ({
        ...prev,
        isVisible: false,
        height: 0,
      }));
      onHide?.();
    };

    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [onShow, onHide]);

  return keyboardState;
}

// Simplified version - just visibility
export function useKeyboardVisible(): boolean {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return isKeyboardVisible;
}

// Helper to dismiss keyboard
export function useDismissKeyboard(): () => void {
  return useCallback(() => {
    Keyboard.dismiss();
  }, []);
}


/* ─────────────────────────────────────────────────────────────
   3. useOrientation - Device Orientation Detection

   Tracks device orientation changes.
   Useful for:
   - Responsive layouts
   - Video players (auto-fullscreen in landscape)
   - Image galleries
──────────────────────────────────────────────────────────────── */

interface UseOrientationReturn {
  orientation: Orientation;
  isPortrait: boolean;
  isLandscape: boolean;
}

export function useOrientation(): UseOrientationReturn {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    const { width, height } = Dimensions.get('window');
    return height >= width ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.height >= window.width ? 'portrait' : 'landscape');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  };
}

// With callback support
interface UseOrientationWithCallbackOptions {
  onOrientationChange?: (orientation: Orientation) => void;
}

export function useOrientationWithCallback(
  options: UseOrientationWithCallbackOptions = {}
): UseOrientationReturn {
  const { onOrientationChange } = options;
  const result = useOrientation();
  const previousOrientation = useRef(result.orientation);

  useEffect(() => {
    if (previousOrientation.current !== result.orientation) {
      previousOrientation.current = result.orientation;
      onOrientationChange?.(result.orientation);
    }
  }, [result.orientation, onOrientationChange]);

  return result;
}


/* ─────────────────────────────────────────────────────────────
   4. useNetworkStatus - Network Connectivity Monitoring

   Monitors network connectivity status.
   NOTE: Requires @react-native-community/netinfo package.
   This is a pattern showing the hook structure - implement with actual NetInfo.
──────────────────────────────────────────────────────────────── */

// Simulated NetInfo types (replace with actual @react-native-community/netinfo)
interface NetInfoState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string;
}

interface UseNetworkStatusOptions {
  /** Called when network becomes available */
  onOnline?: () => void;
  /** Called when network becomes unavailable */
  onOffline?: () => void;
}

export function useNetworkStatus(options: UseNetworkStatusOptions = {}): NetworkState {
  const { onOnline, onOffline } = options;

  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true, // Assume connected initially
    isInternetReachable: null,
    type: 'unknown',
  });

  const previousIsConnected = useRef<boolean | null>(null);

  useEffect(() => {
    // In production, use:
    // import NetInfo from '@react-native-community/netinfo';
    // const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    // Simulated for pattern demonstration
    const handleNetworkChange = (state: NetInfoState) => {
      const isConnected = state.isConnected ?? false;

      // Detect online transition
      if (previousIsConnected.current === false && isConnected) {
        onOnline?.();
      }

      // Detect offline transition
      if (previousIsConnected.current === true && !isConnected) {
        onOffline?.();
      }

      previousIsConnected.current = isConnected;

      setNetworkState({
        isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    };

    // Simulated subscription - replace with actual NetInfo
    // const unsubscribe = NetInfo.addEventListener(handleNetworkChange);
    // NetInfo.fetch().then(handleNetworkChange);

    return () => {
      // unsubscribe();
    };
  }, [onOnline, onOffline]);

  return networkState;
}

// Simplified hook - just connectivity boolean
export function useIsOnline(): boolean {
  const { isConnected } = useNetworkStatus();
  return isConnected;
}

// Hook with offline queue support
interface UseOfflineQueueReturn<T> {
  isOnline: boolean;
  queue: T[];
  addToQueue: (item: T) => void;
  clearQueue: () => void;
  processQueue: (processor: (item: T) => Promise<void>) => Promise<void>;
}

export function useOfflineQueue<T>(): UseOfflineQueueReturn<T> {
  const [queue, setQueue] = useState<T[]>([]);
  const isOnline = useIsOnline();
  const isProcessing = useRef(false);

  const addToQueue = useCallback((item: T) => {
    setQueue((prev) => [...prev, item]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const processQueue = useCallback(
    async (processor: (item: T) => Promise<void>) => {
      if (!isOnline || isProcessing.current || queue.length === 0) return;

      isProcessing.current = true;

      try {
        for (const item of queue) {
          await processor(item);
        }
        clearQueue();
      } catch (error) {
        console.error('Error processing offline queue:', error);
      } finally {
        isProcessing.current = false;
      }
    },
    [isOnline, queue, clearQueue]
  );

  return { isOnline, queue, addToQueue, clearQueue, processQueue };
}


/* ─────────────────────────────────────────────────────────────
   5. useAsyncStorage - Persistent Storage with Type Safety

   Type-safe wrapper around AsyncStorage.
   NOTE: Requires @react-native-async-storage/async-storage package.
──────────────────────────────────────────────────────────────── */

// AsyncStorage mock interface (replace with actual import)
interface AsyncStorageStatic {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  multiGet(keys: string[]): Promise<readonly [string, string | null][]>;
  multiSet(keyValuePairs: [string, string][]): Promise<void>;
  multiRemove(keys: string[]): Promise<void>;
  clear(): Promise<void>;
}

// In production, import: import AsyncStorage from '@react-native-async-storage/async-storage';
declare const AsyncStorage: AsyncStorageStatic;

interface UseAsyncStorageReturn<T> {
  /** Current stored value (null if loading or not set) */
  value: T | null;
  /** Whether the value is being loaded */
  isLoading: boolean;
  /** Set a new value */
  setValue: (newValue: T) => Promise<void>;
  /** Remove the stored value */
  removeValue: () => Promise<void>;
  /** Refresh the value from storage */
  refresh: () => Promise<void>;
  /** Error if any occurred */
  error: Error | null;
}

export function useAsyncStorage<T>(
  key: string,
  defaultValue?: T
): UseAsyncStorageReturn<T> {
  const [value, setValue] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial value
  const loadValue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const stored = await AsyncStorage.getItem(key);

      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      } else if (defaultValue !== undefined) {
        setValue(defaultValue);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load value'));
      console.error(`Error loading ${key} from AsyncStorage:`, e);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  useEffect(() => {
    loadValue();
  }, [loadValue]);

  // Set new value
  const setStoredValue = useCallback(
    async (newValue: T) => {
      try {
        setError(null);
        await AsyncStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to save value'));
        console.error(`Error saving ${key} to AsyncStorage:`, e);
        throw e;
      }
    },
    [key]
  );

  // Remove value
  const removeStoredValue = useCallback(async () => {
    try {
      setError(null);
      await AsyncStorage.removeItem(key);
      setValue(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to remove value'));
      console.error(`Error removing ${key} from AsyncStorage:`, e);
      throw e;
    }
  }, [key]);

  return {
    value,
    isLoading,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    refresh: loadValue,
    error,
  };
}

// Hook for managing multiple storage keys
export function useMultiAsyncStorage<T extends Record<string, unknown>>(
  keys: (keyof T)[]
): {
  values: Partial<T>;
  isLoading: boolean;
  setValue: <K extends keyof T>(key: K, value: T[K]) => Promise<void>;
  removeValue: (key: keyof T) => Promise<void>;
  refresh: () => Promise<void>;
} {
  const [values, setValues] = useState<Partial<T>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadValues = useCallback(async () => {
    try {
      setIsLoading(true);
      const pairs = await AsyncStorage.multiGet(keys as string[]);
      const result: Partial<T> = {};

      for (const [key, value] of pairs) {
        if (value !== null) {
          result[key as keyof T] = JSON.parse(value);
        }
      }

      setValues(result);
    } catch (e) {
      console.error('Error loading multiple values from AsyncStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, [keys]);

  useEffect(() => {
    loadValues();
  }, [loadValues]);

  const setValue = useCallback(async <K extends keyof T>(key: K, value: T[K]) => {
    await AsyncStorage.setItem(key as string, JSON.stringify(value));
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const removeValue = useCallback(async (key: keyof T) => {
    await AsyncStorage.removeItem(key as string);
    setValues((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  return { values, isLoading, setValue, removeValue, refresh: loadValues };
}


/* ─────────────────────────────────────────────────────────────
   6. useDeepLink - Deep Link Handling and Parsing

   Handles incoming deep links and parses URL parameters.
   Useful for:
   - Navigation from push notifications
   - Universal links
   - App-to-app communication
──────────────────────────────────────────────────────────────── */

interface UseDeepLinkOptions<T> {
  /** URL scheme(s) to handle (e.g., 'myapp://') */
  schemes?: string[];
  /** Universal link domains */
  domains?: string[];
  /** Custom URL parser */
  parseUrl?: (url: string) => T;
  /** Called when a valid deep link is received */
  onDeepLink?: (state: DeepLinkState<T>) => void;
}

export function useDeepLink<T = Record<string, string>>(
  options: UseDeepLinkOptions<T> = {}
): DeepLinkState<T> {
  const { schemes = [], domains = [], parseUrl, onDeepLink } = options;

  const [linkState, setLinkState] = useState<DeepLinkState<T>>({
    url: null,
    path: null,
    params: {} as T,
  });

  // Default URL parser
  const defaultParseUrl = useCallback((url: string): T => {
    try {
      const parsedUrl = new URL(url);
      const params: Record<string, string> = {};

      parsedUrl.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      return params as unknown as T;
    } catch {
      return {} as T;
    }
  }, []);

  const handleUrl = useCallback(
    (url: string | null) => {
      if (!url) return;

      // Validate URL matches our schemes or domains
      const isValidScheme = schemes.length === 0 || schemes.some((s) => url.startsWith(s));
      const isValidDomain =
        domains.length === 0 ||
        domains.some((d) => {
          try {
            const parsedUrl = new URL(url);
            return parsedUrl.hostname === d || parsedUrl.hostname.endsWith(`.${d}`);
          } catch {
            return false;
          }
        });

      if (!isValidScheme && !isValidDomain) return;

      // Parse the URL
      const parser = parseUrl || defaultParseUrl;
      const params = parser(url);

      let path: string | null = null;
      try {
        const parsedUrl = new URL(url);
        path = parsedUrl.pathname;
      } catch {
        // For custom schemes like myapp://path
        const schemeMatch = url.match(/:\/\/(.+?)(\?|$)/);
        path = schemeMatch ? `/${schemeMatch[1]}` : null;
      }

      const newState: DeepLinkState<T> = { url, path, params };
      setLinkState(newState);
      onDeepLink?.(newState);
    },
    [schemes, domains, parseUrl, defaultParseUrl, onDeepLink]
  );

  useEffect(() => {
    // Handle initial URL (app opened via deep link)
    Linking.getInitialURL().then(handleUrl);

    // Handle URLs while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleUrl]);

  return linkState;
}

// Utility to create deep links
export function createDeepLink(
  scheme: string,
  path: string,
  params?: Record<string, string | number | boolean>
): string {
  let url = `${scheme}://${path}`;

  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    url += `?${queryString}`;
  }

  return url;
}


/* ─────────────────────────────────────────────────────────────
   7. useDimensions - Window/Screen Dimensions with Updates

   Tracks window and screen dimensions.
   Automatically updates on orientation change or window resize.
──────────────────────────────────────────────────────────────── */

export function useDimensions(): DimensionsState {
  const [dimensions, setDimensions] = useState<DimensionsState>(() => ({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  }));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return dimensions;
}

// Just window dimensions
export function useWindowDimensions(): ScaledSize {
  const { window } = useDimensions();
  return window;
}

// Just screen dimensions
export function useScreenDimensions(): ScaledSize {
  const { screen } = useDimensions();
  return screen;
}


/* ─────────────────────────────────────────────────────────────
   8. useBackHandler - Android Back Button Handling

   Handles Android hardware back button presses.
   NOTE: No effect on iOS.
──────────────────────────────────────────────────────────────── */

type BackHandlerCallback = () => boolean; // Return true to prevent default behavior

export function useBackHandler(handler: BackHandlerCallback, enabled = true): void {
  useEffect(() => {
    if (!enabled || Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', handler);

    return () => {
      subscription.remove();
    };
  }, [handler, enabled]);
}

// Hook for "press back twice to exit" pattern
export function useDoubleBackToExit(
  exitDelay = 2000,
  onFirstPress?: () => void
): void {
  const lastBackPress = useRef<number>(0);

  const handleBackPress = useCallback(() => {
    const now = Date.now();

    if (now - lastBackPress.current < exitDelay) {
      // Second press within delay - exit app
      BackHandler.exitApp();
      return true;
    }

    lastBackPress.current = now;
    onFirstPress?.();
    return true;
  }, [exitDelay, onFirstPress]);

  useBackHandler(handleBackPress);
}


/* ─────────────────────────────────────────────────────────────
   9. usePermission - Generic Permission Handling

   Generic pattern for handling permissions.
   NOTE: Requires react-native-permissions package for full implementation.
──────────────────────────────────────────────────────────────── */

interface UsePermissionReturn {
  status: PermissionStatus;
  isGranted: boolean;
  isBlocked: boolean;
  check: () => Promise<PermissionStatus>;
  request: () => Promise<PermissionStatus>;
  openSettings: () => Promise<void>;
}

type PermissionType = 'camera' | 'photo_library' | 'location' | 'notifications' | 'microphone';

export function usePermission(permissionType: PermissionType): UsePermissionReturn {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');

  // In production, use react-native-permissions:
  // import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

  const checkPermission = useCallback(async (): Promise<PermissionStatus> => {
    // const permission = getPermissionKey(permissionType);
    // const result = await check(permission);
    // const status = mapResultToStatus(result);
    // setStatus(status);
    // return status;

    // Simulated for pattern demonstration
    setStatus('granted');
    return 'granted';
  }, [permissionType]);

  const requestPermission = useCallback(async (): Promise<PermissionStatus> => {
    // const permission = getPermissionKey(permissionType);
    // const result = await request(permission);
    // const status = mapResultToStatus(result);
    // setStatus(status);
    // return status;

    // Simulated for pattern demonstration
    setStatus('granted');
    return 'granted';
  }, [permissionType]);

  const openSettingsHandler = useCallback(async () => {
    // In production: await openSettings();
    await Linking.openSettings();
  }, []);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    status,
    isGranted: status === 'granted',
    isBlocked: status === 'blocked',
    check: checkPermission,
    request: requestPermission,
    openSettings: openSettingsHandler,
  };
}


/* ─────────────────────────────────────────────────────────────
   10. useBiometrics - Biometric Authentication

   Handles biometric (Face ID/Touch ID) authentication.
   NOTE: Requires expo-local-authentication or react-native-biometrics package.
──────────────────────────────────────────────────────────────── */

interface UseBiometricsReturn {
  state: BiometricState;
  authenticate: (options?: { promptMessage?: string }) => Promise<boolean>;
  isLoading: boolean;
}

export function useBiometrics(): UseBiometricsReturn {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    biometryType: null,
    isEnrolled: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        // In production, use expo-local-authentication:
        // import * as LocalAuthentication from 'expo-local-authentication';
        //
        // const hasHardware = await LocalAuthentication.hasHardwareAsync();
        // const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        // const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        //
        // let biometryType: BiometricState['biometryType'] = null;
        // if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        //   biometryType = Platform.OS === 'ios' ? 'Face ID' : 'Biometrics';
        // } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        //   biometryType = Platform.OS === 'ios' ? 'Touch ID' : 'Biometrics';
        // }

        // Simulated for pattern demonstration
        setState({
          isAvailable: true,
          biometryType: Platform.OS === 'ios' ? 'Face ID' : 'Biometrics',
          isEnrolled: true,
        });
      } catch (error) {
        console.error('Error checking biometrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBiometrics();
  }, []);

  const authenticate = useCallback(
    async (options?: { promptMessage?: string }): Promise<boolean> => {
      if (!state.isAvailable || !state.isEnrolled) {
        return false;
      }

      try {
        // In production:
        // const result = await LocalAuthentication.authenticateAsync({
        //   promptMessage: options?.promptMessage || 'Authenticate',
        //   cancelLabel: 'Cancel',
        //   fallbackLabel: 'Use Passcode',
        // });
        // return result.success;

        // Simulated for pattern demonstration
        return true;
      } catch (error) {
        console.error('Biometric authentication error:', error);
        return false;
      }
    },
    [state.isAvailable, state.isEnrolled]
  );

  return { state, authenticate, isLoading };
}


/* ─────────────────────────────────────────────────────────────
   11. useDebounce - Debounced Values

   Debounces a value, updating only after a delay.
   Useful for search inputs, avoiding excessive API calls.
──────────────────────────────────────────────────────────────── */

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Debounced callback version
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}


/* ─────────────────────────────────────────────────────────────
   12. useThrottle - Throttled Callbacks

   Throttles a callback, ensuring it's called at most once per interval.
   Useful for scroll handlers, resize handlers.
──────────────────────────────────────────────────────────────── */

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now - lastUpdated.current >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastUpdated.current));

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}

export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number
): (...args: Parameters<T>) => void {
  const lastCall = useRef<number>(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastCall.current >= interval) {
        lastCall.current = now;
        callbackRef.current(...args);
      }
    },
    [interval]
  );
}


/* ─────────────────────────────────────────────────────────────
   13. usePrevious - Track Previous Value

   Returns the previous value of a state/prop.
   Useful for comparing current and previous values.
──────────────────────────────────────────────────────────────── */

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// With comparison callback
export function usePreviousWithCallback<T>(
  value: T,
  onChanged?: (previous: T | undefined, current: T) => void
): T | undefined {
  const previous = usePrevious(value);

  useEffect(() => {
    if (previous !== value) {
      onChanged?.(previous, value);
    }
  }, [value, previous, onChanged]);

  return previous;
}


/* ─────────────────────────────────────────────────────────────
   14. useInterval - Safe Interval Management

   Declarative interval hook with proper cleanup.
   Handles callback updates without restarting the interval.
──────────────────────────────────────────────────────────────── */

export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}

// With control functions
interface UseControllableIntervalReturn {
  start: () => void;
  stop: () => void;
  isRunning: boolean;
}

export function useControllableInterval(
  callback: () => void,
  delay: number
): UseControllableIntervalReturn {
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (intervalRef.current) return;

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, delay);
  }, [delay]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    setIsRunning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { start, stop, isRunning };
}


/* ─────────────────────────────────────────────────────────────
   15. useMounted - Track Component Mount State

   Returns a ref that tracks if the component is mounted.
   Useful for preventing state updates after unmount.
──────────────────────────────────────────────────────────────── */

export function useMounted(): React.RefObject<boolean> {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}

// Hook for safe state updates
export function useSafeState<T>(
  initialState: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(initialState);
  const mounted = useMounted();

  const setSafeState = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (mounted.current) {
        setState(value);
      }
    },
    [mounted]
  );

  return [state, setSafeState];
}

// Safe async callback
export function useSafeAsync<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T
): T {
  const mounted = useMounted();

  return useCallback(
    (async (...args: Parameters<T>) => {
      const result = await asyncFn(...args);
      if (!mounted.current) {
        throw new Error('Component unmounted');
      }
      return result;
    }) as T,
    [asyncFn, mounted]
  );
}


/* ─────────────────────────────────────────────────────────────
   UTILITY HOOKS
──────────────────────────────────────────────────────────────── */

// Force re-render
export function useForceUpdate(): () => void {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
}

// Toggle boolean state
export function useToggle(
  initialValue = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}

// Counter hook
export function useCounter(
  initialValue = 0
): {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
} {
  const [count, setCount] = useState(initialValue);

  return {
    count,
    increment: useCallback(() => setCount((c) => c + 1), []),
    decrement: useCallback(() => setCount((c) => c - 1), []),
    reset: useCallback(() => setCount(initialValue), [initialValue]),
    set: setCount,
  };
}

// First render detection
export function useIsFirstRender(): boolean {
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return isFirstRender.current;
}


/* ─────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export type {
  UseAppStateOptions,
  UseAppStateReturn,
  UseKeyboardOptions,
  UseOrientationReturn,
  UseOrientationWithCallbackOptions,
  UseNetworkStatusOptions,
  UseDeepLinkOptions,
  UsePermissionReturn,
  UseBiometricsReturn,
  UseControllableIntervalReturn,
};
