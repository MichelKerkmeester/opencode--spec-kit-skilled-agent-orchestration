/* ─────────────────────────────────────────────────────────────
   REACT NAVIGATION PATTERNS
   Production-ready navigation templates for React Native/Expo apps
   React Navigation v6+ compatible with type-safe navigation
──────────────────────────────────────────────────────────────── */
//
// CONTENTS:
// 1. Type Definitions and Navigation Types
// 2. Stack Navigator Setup
// 3. Tab Navigator Setup
// 4. Drawer Navigator Setup
// 5. Deep Linking Configuration
// 6. Type-Safe Navigation Hooks
// 7. Screen Options Patterns
// 8. Nested Navigation Patterns
// 9. Auth Flow Pattern
// 10. Modal Navigation Pattern
//

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
  useNavigation,
  useRoute,
  useFocusEffect,
  useNavigationState,
  CommonActions,
  StackActions,
  DrawerActions,
  LinkingOptions,
  DefaultTheme,
  DarkTheme,
  Theme,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
  DrawerScreenProps,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';


/* ─────────────────────────────────────────────────────────────
   1. TYPE DEFINITIONS AND NAVIGATION TYPES
──────────────────────────────────────────────────────────────── */
//
// Define your navigation structure with TypeScript for type-safe navigation.
// This ensures:
// - Correct screen names when navigating
// - Type-safe route params
// - Autocomplete in your IDE
//

// Root stack containing all top-level navigators
export type RootStackParamList = {
  // Auth screens (shown when not logged in)
  Auth: undefined;
  // Main app screens (shown when logged in)
  Main: undefined;
  // Modal screens (can be shown over any other screen)
  Modal: { title: string; message: string };
  NotFound: undefined;
};

// Auth stack screens
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string };
  VerifyCode: { email: string; type: 'register' | 'forgot_password' };
};

// Main tab navigator screens
export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  ProfileTab: undefined;
  SettingsTab: undefined;
};

// Home stack (nested in HomeTab)
export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string; source?: 'feed' | 'search' | 'notification' };
  Category: { categoryId: string; title: string };
  Cart: undefined;
};

// Search stack (nested in SearchTab)
export type SearchStackParamList = {
  Search: undefined;
  SearchResults: { query: string; filters?: Record<string, string> };
  ProductDetail: { productId: string; source?: 'feed' | 'search' | 'notification' };
};

// Profile stack (nested in ProfileTab)
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Orders: undefined;
  OrderDetail: { orderId: string };
  Addresses: undefined;
  AddAddress: { addressId?: string }; // Optional for edit mode
};

// Settings stack (nested in SettingsTab)
export type SettingsStackParamList = {
  Settings: undefined;
  Notifications: undefined;
  Privacy: undefined;
  Language: undefined;
  Help: undefined;
  About: undefined;
};

// Drawer navigator screens
export type DrawerParamList = {
  MainTabs: undefined;
  Favorites: undefined;
  Promotions: undefined;
  Support: undefined;
  Logout: undefined;
};


/* ─────────────────────────────────────────────────────────────
   COMPOSITE NAVIGATION TYPES
   Use these for screens in nested navigators
──────────────────────────────────────────────────────────────── */

import type { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';

// For screens in HomeStack that need to access RootStack navigation
export type HomeStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

// For screens in AuthStack
export type AuthStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

// Screen props types for commonly used patterns
export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;
export type ProductDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;


/* ─────────────────────────────────────────────────────────────
   CREATE NAVIGATORS
──────────────────────────────────────────────────────────────── */

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const AppDrawer = createDrawerNavigator<DrawerParamList>();


/* ─────────────────────────────────────────────────────────────
   2. STACK NAVIGATOR SETUP
──────────────────────────────────────────────────────────────── */
//
// Stack navigators show screens in a stack, allowing push/pop navigation.
// Use for:
// - Detail screens
// - Forms/wizards
// - Any linear navigation flow
//

// Home Stack Navigator
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        // iOS-specific
        ...(Platform.OS === 'ios' && {
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
        }),
        // Android-specific
        animation: Platform.select({
          ios: 'default',
          android: 'slide_from_right',
        }),
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerLargeTitle: true,
        }}
      />
      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: 'Product Details',
          headerLargeTitle: false,
          // Dynamic header based on params
          headerRight: () => <ShareButton productId={route.params.productId} />,
        })}
      />
      <HomeStack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({
          title: route.params.title,
        })}
      />
      <HomeStack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Shopping Cart',
          presentation: 'modal', // Present as modal
        }}
      />
    </HomeStack.Navigator>
  );
}

// Auth Stack Navigator with custom transitions
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'fade',
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <AuthStack.Screen name="VerifyCode" component={VerifyCodeScreen} />
    </AuthStack.Navigator>
  );
}


/* ─────────────────────────────────────────────────────────────
   3. TAB NAVIGATOR SETUP
──────────────────────────────────────────────────────────────── */
//
// Tab navigators show a tab bar for switching between screens.
// Each tab can contain its own stack navigator for nested navigation.
//

function MainTabNavigator() {
  return (
    <MainTab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false, // We handle headers in nested stacks
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          paddingTop: 8,
          paddingBottom: Platform.select({ ios: 24, android: 8 }),
          height: Platform.select({ ios: 84, android: 60 }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        // Custom tab bar icon based on route
        tabBarIcon: ({ focused, color, size }) => {
          return <TabBarIcon routeName={route.name} focused={focused} color={color} size={size} />;
        },
      })}
    >
      <MainTab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarBadge: undefined, // Can set dynamically for notifications
        }}
        listeners={({ navigation }) => ({
          // Reset stack when tab is pressed
          tabPress: (e) => {
            const state = navigation.getState();
            const homeTabRoute = state.routes.find((r) => r.name === 'HomeTab');

            if (homeTabRoute?.state?.routes?.length && homeTabRoute.state.routes.length > 1) {
              navigation.dispatch(StackActions.popToTop());
            }
          },
        })}
      />
      <MainTab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <MainTab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <MainTab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </MainTab.Navigator>
  );
}

// Tab bar icon component
interface TabBarIconProps {
  routeName: keyof MainTabParamList;
  focused: boolean;
  color: string;
  size: number;
}

function TabBarIcon({ routeName, focused, color, size }: TabBarIconProps) {
  // Replace with your actual icon library (e.g., @expo/vector-icons)
  const iconMap: Record<keyof MainTabParamList, string> = {
    HomeTab: focused ? '🏠' : '🏡',
    SearchTab: focused ? '🔍' : '🔎',
    ProfileTab: focused ? '👤' : '👥',
    SettingsTab: focused ? '⚙️' : '⚙',
  };

  return (
    <Text style={{ fontSize: size, color }}>{iconMap[routeName]}</Text>
  );
}


/* ─────────────────────────────────────────────────────────────
   4. DRAWER NAVIGATOR SETUP
──────────────────────────────────────────────────────────────── */
//
// Drawer navigators show a side menu that slides in from the edge.
// Often used for app-wide navigation options.
//

function DrawerNavigator() {
  return (
    <AppDrawer.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#333333',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <AppDrawer.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => <Text style={{ fontSize: size }}>🏠</Text>,
        }}
      />
      <AppDrawer.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          drawerLabel: 'Favorites',
          drawerIcon: ({ color, size }) => <Text style={{ fontSize: size }}>❤️</Text>,
        }}
      />
      <AppDrawer.Screen
        name="Promotions"
        component={PromotionsScreen}
        options={{
          drawerLabel: 'Promotions',
          drawerIcon: ({ color, size }) => <Text style={{ fontSize: size }}>🏷️</Text>,
        }}
      />
      <AppDrawer.Screen
        name="Support"
        component={SupportScreen}
        options={{
          drawerLabel: 'Support',
          drawerIcon: ({ color, size }) => <Text style={{ fontSize: size }}>💬</Text>,
        }}
      />
    </AppDrawer.Navigator>
  );
}

// Custom drawer content component
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const handleLogout = useCallback(() => {
    // Handle logout logic
    console.log('Logout pressed');
  }, []);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={drawerStyles.container}>
      {/* User profile header */}
      <View style={drawerStyles.header}>
        <View style={drawerStyles.avatar}>
          <Text style={drawerStyles.avatarText}>JD</Text>
        </View>
        <Text style={drawerStyles.userName}>John Doe</Text>
        <Text style={drawerStyles.userEmail}>john.doe@example.com</Text>
      </View>

      {/* Default drawer items */}
      <View style={drawerStyles.menuSection}>
        <DrawerItemList {...props} />
      </View>

      {/* Divider */}
      <View style={drawerStyles.divider} />

      {/* Custom logout item */}
      <View style={drawerStyles.logoutSection}>
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => <Text style={{ fontSize: size }}>🚪</Text>}
          onPress={handleLogout}
          labelStyle={{ color: '#FF3B30' }}
        />
      </View>

      {/* App version */}
      <View style={drawerStyles.footer}>
        <Text style={drawerStyles.version}>Version 1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const drawerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: 10,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  menuSection: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  logoutSection: {
    marginTop: 'auto',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: '#999999',
  },
});


/* ─────────────────────────────────────────────────────────────
   5. DEEP LINKING CONFIGURATION
──────────────────────────────────────────────────────────────── */
//
// Configure deep links to open specific screens from URLs.
// Works with:
// - Custom URL schemes (e.g., myapp://)
// - Universal links (e.g., https://myapp.com)
//

const linking: LinkingOptions<RootStackParamList> = {
  // App URL schemes
  prefixes: [
    'myapp://',
    'https://myapp.com',
    'https://*.myapp.com', // Wildcards for subdomains
  ],

  // Screen configuration for deep links
  config: {
    // Default initial route
    initialRouteName: 'Main',

    screens: {
      // Auth screens
      Auth: {
        screens: {
          Welcome: 'welcome',
          Login: 'login',
          Register: 'register',
          ForgotPassword: {
            path: 'forgot-password/:email?',
            parse: {
              email: (email: string) => decodeURIComponent(email),
            },
          },
          VerifyCode: {
            path: 'verify/:email/:type',
            parse: {
              email: (email: string) => decodeURIComponent(email),
              type: (type: string) => type as 'register' | 'forgot_password',
            },
          },
        },
      },

      // Main app screens
      Main: {
        screens: {
          MainTabs: {
            screens: {
              HomeTab: {
                screens: {
                  Home: 'home',
                  ProductDetail: {
                    path: 'product/:productId',
                    parse: {
                      productId: (id: string) => id,
                    },
                  },
                  Category: {
                    path: 'category/:categoryId',
                    parse: {
                      categoryId: (id: string) => id,
                      title: (title: string) => decodeURIComponent(title),
                    },
                  },
                  Cart: 'cart',
                },
              },
              SearchTab: {
                screens: {
                  Search: 'search',
                  SearchResults: {
                    path: 'search/:query',
                    parse: {
                      query: (query: string) => decodeURIComponent(query),
                    },
                  },
                },
              },
              ProfileTab: {
                screens: {
                  Profile: 'profile',
                  Orders: 'orders',
                  OrderDetail: 'order/:orderId',
                },
              },
              SettingsTab: {
                screens: {
                  Settings: 'settings',
                  Notifications: 'settings/notifications',
                  Privacy: 'settings/privacy',
                },
              },
            },
          },
          Favorites: 'favorites',
          Promotions: 'promotions',
        },
      },

      // Modal screen
      Modal: {
        path: 'modal',
        parse: {
          title: (title: string) => decodeURIComponent(title),
          message: (message: string) => decodeURIComponent(message),
        },
      },

      // 404 screen
      NotFound: '*',
    },
  },

  // Custom URL parsing (for complex URLs)
  getStateFromPath: (path, options) => {
    // Custom logic for special URLs
    if (path.startsWith('promo/')) {
      const promoCode = path.replace('promo/', '');
      return {
        routes: [
          {
            name: 'Main',
            state: {
              routes: [{ name: 'Promotions', params: { code: promoCode } }],
            },
          },
        ],
      };
    }

    // Fall back to default parsing
    return undefined; // Let the default parser handle it
  },
};


/* ─────────────────────────────────────────────────────────────
   6. TYPE-SAFE NAVIGATION HOOKS
──────────────────────────────────────────────────────────────── */
//
// Custom hooks for type-safe navigation throughout the app.
//

// Global navigation ref for navigating outside of React components
export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

// Type-safe navigation hook for any stack
export function useTypedNavigation<T extends ParamListBase>() {
  return useNavigation<NativeStackNavigationProp<T>>();
}

// Type-safe route hook
export function useTypedRoute<
  T extends ParamListBase,
  RouteName extends keyof T = keyof T
>() {
  return useRoute<RouteProp<T, RouteName>>();
}

// Hook for Home stack navigation
export function useHomeNavigation() {
  return useNavigation<HomeStackNavigationProp>();
}

// Hook for Auth stack navigation
export function useAuthNavigation() {
  return useNavigation<AuthStackNavigationProp>();
}

// Hook to navigate from anywhere (use with caution)
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.navigate(name as any, params as any);
  } else {
    console.warn('Navigation not ready');
  }
}

// Hook for drawer controls
export function useDrawer() {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  return {
    openDrawer: () => navigation.dispatch(DrawerActions.openDrawer()),
    closeDrawer: () => navigation.dispatch(DrawerActions.closeDrawer()),
    toggleDrawer: () => navigation.dispatch(DrawerActions.toggleDrawer()),
  };
}

// Hook for resetting navigation
export function useResetNavigation() {
  const navigation = useNavigation();

  return useCallback(
    (routeName: keyof RootStackParamList, params?: any) => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName as string, params }],
        })
      );
    },
    [navigation]
  );
}

// Hook to get current route name
export function useCurrentRouteName(): string | undefined {
  return useNavigationState((state) => {
    if (!state || !state.routes || state.routes.length === 0) {
      return undefined;
    }

    const getActiveRouteName = (state: any): string => {
      const route = state.routes[state.index];
      if (route.state) {
        return getActiveRouteName(route.state);
      }
      return route.name;
    };

    return getActiveRouteName(state);
  });
}


/* ─────────────────────────────────────────────────────────────
   7. SCREEN OPTIONS PATTERNS
──────────────────────────────────────────────────────────────── */
//
// Common screen option patterns for consistent styling.
//

// Common screen options
export const commonScreenOptions = {
  headerBackTitleVisible: false,
  headerTintColor: '#007AFF',
  headerTitleStyle: {
    fontWeight: '600' as const,
    fontSize: 17,
  },
  headerStyle: {
    backgroundColor: '#FFFFFF',
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: '#F5F5F5',
  },
};

// Modal presentation options
export const modalScreenOptions = {
  presentation: 'modal' as const,
  headerShown: true,
  gestureEnabled: true,
  ...(Platform.OS === 'ios' && {
    headerLargeTitle: false,
    presentation: 'formSheet' as const,
  }),
};

// Transparent header options
export const transparentHeaderOptions = {
  headerTransparent: true,
  headerTitle: '',
  headerTintColor: '#FFFFFF',
  headerStyle: {
    backgroundColor: 'transparent',
  },
  headerShadowVisible: false,
};

// Full screen modal options
export const fullScreenModalOptions = {
  presentation: 'fullScreenModal' as const,
  headerShown: false,
  animation: 'slide_from_bottom' as const,
};

// Options generator for dynamic titles
export function createDynamicTitleOptions<T extends { title?: string }>(
  defaultTitle: string
) {
  return ({ route }: { route: RouteProp<{ Screen: T }, 'Screen'> }) => ({
    title: route.params?.title || defaultTitle,
  });
}


/* ─────────────────────────────────────────────────────────────
   8. NESTED NAVIGATION PATTERNS

   Patterns for navigating in nested navigators.
──────────────────────────────────────────────────────────────── */

// Navigate to a nested screen
export function navigateToNestedScreen(
  navigation: any,
  parentRoute: string,
  childRoute: string,
  params?: any
) {
  navigation.navigate(parentRoute, {
    screen: childRoute,
    params,
  });
}

// Navigate to a deeply nested screen
export function navigateToDeeplyNestedScreen(
  navigation: any,
  routes: Array<{ screen: string; params?: any }>
) {
  const buildNestedParams = (
    routes: Array<{ screen: string; params?: any }>,
    index: number = 0
  ): any => {
    if (index >= routes.length) return undefined;

    return {
      screen: routes[index].screen,
      params:
        index === routes.length - 1
          ? routes[index].params
          : buildNestedParams(routes, index + 1),
    };
  };

  if (routes.length > 0) {
    navigation.navigate(routes[0].screen, buildNestedParams(routes, 1));
  }
}

// Example: Navigate to Order Detail from anywhere
export function navigateToOrderDetail(orderId: string) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.navigate('Main' as any, {
      screen: 'MainTabs',
      params: {
        screen: 'ProfileTab',
        params: {
          screen: 'OrderDetail',
          params: { orderId },
        },
      },
    });
  }
}


/* ─────────────────────────────────────────────────────────────
   9. AUTH FLOW PATTERN

   Pattern for handling authentication state in navigation.
──────────────────────────────────────────────────────────────── */

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Root navigator with auth state
function RootNavigator({ authState }: { authState: AuthState }) {
  if (authState.isLoading) {
    return <SplashScreen />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {authState.isAuthenticated ? (
        // User is logged in
        <>
          <RootStack.Screen name="Main" component={DrawerNavigator} />
          <RootStack.Screen
            name="Modal"
            component={ModalScreen}
            options={modalScreenOptions}
          />
        </>
      ) : (
        // User is not logged in
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
      )}
      <RootStack.Screen name="NotFound" component={NotFoundScreen} />
    </RootStack.Navigator>
  );
}


/* ─────────────────────────────────────────────────────────────
   10. MODAL NAVIGATION PATTERN

   Patterns for showing modals over any screen.
──────────────────────────────────────────────────────────────── */

// Hook for showing modals
export function useModal() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const showModal = useCallback(
    (title: string, message: string) => {
      navigation.navigate('Modal', { title, message });
    },
    [navigation]
  );

  const hideModal = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return { showModal, hideModal };
}


/* ─────────────────────────────────────────────────────────────
   MAIN APP NAVIGATION CONTAINER
──────────────────────────────────────────────────────────────── */

interface AppNavigationProps {
  authState: AuthState;
  theme?: 'light' | 'dark';
  onReady?: () => void;
  onStateChange?: (state: any) => void;
}

export function AppNavigation({
  authState,
  theme = 'light',
  onReady,
  onStateChange,
}: AppNavigationProps) {
  const navigationTheme: Theme = useMemo(
    () => (theme === 'dark' ? DarkTheme : DefaultTheme),
    [theme]
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={navigationTheme}
      onReady={onReady}
      onStateChange={onStateChange}
      fallback={<SplashScreen />}
    >
      <RootNavigator authState={authState} />
    </NavigationContainer>
  );
}


/* ─────────────────────────────────────────────────────────────
   PLACEHOLDER SCREENS (Replace with your actual screens)
──────────────────────────────────────────────────────────────── */

function HomeScreen() {
  const navigation = useHomeNavigation();
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.title}>Home Screen</Text>
      <Pressable
        style={placeholderStyles.button}
        onPress={() => navigation.navigate('ProductDetail', { productId: '123' })}
      >
        <Text style={placeholderStyles.buttonText}>Go to Product</Text>
      </Pressable>
    </View>
  );
}

function ProductDetailScreen() {
  const route = useTypedRoute<HomeStackParamList, 'ProductDetail'>();
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.title}>Product: {route.params.productId}</Text>
    </View>
  );
}

function CategoryScreen() {
  return <View style={placeholderStyles.container}><Text>Category</Text></View>;
}

function CartScreen() {
  return <View style={placeholderStyles.container}><Text>Cart</Text></View>;
}

function SearchStackNavigator() {
  return <View style={placeholderStyles.container}><Text>Search</Text></View>;
}

function ProfileStackNavigator() {
  return <View style={placeholderStyles.container}><Text>Profile</Text></View>;
}

function SettingsStackNavigator() {
  return <View style={placeholderStyles.container}><Text>Settings</Text></View>;
}

function WelcomeScreen() {
  return <View style={placeholderStyles.container}><Text>Welcome</Text></View>;
}

function LoginScreen() {
  return <View style={placeholderStyles.container}><Text>Login</Text></View>;
}

function RegisterScreen() {
  return <View style={placeholderStyles.container}><Text>Register</Text></View>;
}

function ForgotPasswordScreen() {
  return <View style={placeholderStyles.container}><Text>Forgot Password</Text></View>;
}

function VerifyCodeScreen() {
  return <View style={placeholderStyles.container}><Text>Verify Code</Text></View>;
}

function FavoritesScreen() {
  return <View style={placeholderStyles.container}><Text>Favorites</Text></View>;
}

function PromotionsScreen() {
  return <View style={placeholderStyles.container}><Text>Promotions</Text></View>;
}

function SupportScreen() {
  return <View style={placeholderStyles.container}><Text>Support</Text></View>;
}

function ModalScreen() {
  const route = useTypedRoute<RootStackParamList, 'Modal'>();
  const { hideModal } = useModal();
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.title}>{route.params.title}</Text>
      <Text>{route.params.message}</Text>
      <Pressable style={placeholderStyles.button} onPress={hideModal}>
        <Text style={placeholderStyles.buttonText}>Close</Text>
      </Pressable>
    </View>
  );
}

function NotFoundScreen() {
  return <View style={placeholderStyles.container}><Text>404 - Not Found</Text></View>;
}

function SplashScreen() {
  return <View style={placeholderStyles.container}><Text>Loading...</Text></View>;
}

function ShareButton({ productId }: { productId: string }) {
  return (
    <Pressable onPress={() => console.log('Share', productId)}>
      <Text>📤</Text>
    </Pressable>
  );
}

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


/* ─────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  // Navigators
  RootNavigator,
  AuthStackNavigator,
  HomeStackNavigator,
  MainTabNavigator,
  DrawerNavigator,
  // Hooks
  useTypedNavigation,
  useTypedRoute,
  useHomeNavigation,
  useAuthNavigation,
  useDrawer,
  useResetNavigation,
  useCurrentRouteName,
  useModal,
  // Navigation helpers
  navigate,
  navigateToNestedScreen,
  navigateToDeeplyNestedScreen,
  navigateToOrderDetail,
  // Configuration
  linking,
  commonScreenOptions,
  modalScreenOptions,
  transparentHeaderOptions,
  fullScreenModalOptions,
  createDynamicTitleOptions,
};
