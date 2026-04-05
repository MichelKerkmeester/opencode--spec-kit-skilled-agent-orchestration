/* ─────────────────────────────────────────────────────────────
   REACT NATIVE COMPONENT PATTERNS
   Production-ready templates for screens, reusable components, and UI patterns
──────────────────────────────────────────────────────────────── */
//
// CONTENTS:
// 1. Screen Component Template
// 2. Reusable Component Template
// 3. List Item with Memoization
// 4. Modal Component
// 5. Bottom Sheet Pattern
// 6. Error Boundary for React Native
// 7. Loading States and Skeletons
// 8. Form Component Pattern
// 9. Card Component with Variants
// 10. Empty State Component
//

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  Component,
  ErrorInfo,
  ReactNode,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';


/* ─────────────────────────────────────────────────────────────
   TYPE DEFINITIONS
──────────────────────────────────────────────────────────────── */

// Example navigation types - replace with your actual types
export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
  Profile: { userId: string } | undefined;
  Settings: undefined;
  Modal: { title: string; content: string };
};

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}


/* ─────────────────────────────────────────────────────────────
   1. SCREEN COMPONENT TEMPLATE
──────────────────────────────────────────────────────────────── */
//
// A complete screen component with:
// - Type-safe navigation props
// - Loading/error/empty states
// - Pull-to-refresh
// - Focus effect for data refresh
// - Proper cleanup on unmount
//

type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

interface UseProductDetailHookReturn {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  handleRefresh: () => void;
  handleAddToCart: () => void;
  handleGoBack: () => void;
}

// Screen-specific hook - separates logic from UI
const useProductDetailHook = (productId: string): UseProductDetailHookReturn => {
  const navigation = useNavigation();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Track mount state to prevent state updates after unmount
  const isMounted = useRef(true);

  const fetchProduct = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      setError(null);

      // Replace with your actual API call
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product');

      const data = await response.json();

      if (isMounted.current) {
        setProduct(data);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [productId]);

  // Initial fetch
  useEffect(() => {
    fetchProduct();
    return () => {
      isMounted.current = false;
    };
  }, [fetchProduct]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Only refetch if we already have data (skip initial load)
      if (product) {
        fetchProduct(false);
      }
    }, [fetchProduct, product])
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchProduct(false);
  }, [fetchProduct]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    // Add to cart logic
    console.log('Adding to cart:', product.id);
  }, [product]);

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return {
    product,
    isLoading,
    error,
    isRefreshing,
    handleRefresh,
    handleAddToCart,
    handleGoBack,
  };
};

// The screen component - focused on UI only
export function ProductDetailScreen({ route }: ProductDetailScreenProps) {
  const { productId } = route.params;
  const {
    product,
    isLoading,
    error,
    isRefreshing,
    handleRefresh,
    handleAddToCart,
    handleGoBack,
  } = useProductDetailHook(productId);

  if (isLoading) {
    return <LoadingSpinner message="Loading product..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        onRetry={handleRefresh}
        onGoBack={handleGoBack}
      />
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        message="The product you're looking for doesn't exist."
        actionLabel="Go Back"
        onAction={handleGoBack}
      />
    );
  }

  return (
    <SafeAreaView style={screenStyles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={screenStyles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <ProductHeader product={product} />
        <ProductDetails product={product} />
        <View style={screenStyles.spacer} />
      </ScrollView>
      <View style={screenStyles.footer}>
        <AddToCartButton
          onPress={handleAddToCart}
          disabled={!product.inStock}
          price={product.price}
        />
      </View>
    </SafeAreaView>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  spacer: {
    height: 100, // Space for footer
  },
});


/* ─────────────────────────────────────────────────────────────
   2. REUSABLE COMPONENT TEMPLATE
──────────────────────────────────────────────────────────────── */
//
// A well-structured reusable component with:
// - TypeScript props interface with defaults
// - Composable children pattern
// - Style customization via props
// - Accessibility support
//

interface ButtonProps {
  /** Button label text */
  label: string;
  /** Called when button is pressed */
  onPress: () => void;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Disable the button */
  disabled?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon to show before label */
  leftIcon?: ReactNode;
  /** Icon to show after label */
  rightIcon?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom container style */
  style?: object;
  /** Test ID for testing */
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyles = useMemo(
    () => [
      buttonBaseStyles.container,
      buttonVariantStyles[variant],
      buttonSizeStyles[size],
      fullWidth && buttonBaseStyles.fullWidth,
      isDisabled && buttonBaseStyles.disabled,
      style,
    ],
    [variant, size, fullWidth, isDisabled, style]
  );

  const textStyles = useMemo(
    () => [
      buttonBaseStyles.text,
      buttonTextVariantStyles[variant],
      buttonTextSizeStyles[size],
      isDisabled && buttonBaseStyles.disabledText,
    ],
    [variant, size, isDisabled]
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        buttonStyles,
        pressed && !isDisabled && buttonBaseStyles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#007AFF'}
        />
      ) : (
        <>
          {leftIcon && <View style={buttonBaseStyles.iconLeft}>{leftIcon}</View>}
          <Text style={textStyles}>{label}</Text>
          {rightIcon && <View style={buttonBaseStyles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
}

const buttonBaseStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledText: {
    opacity: 0.7,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

const buttonVariantStyles = StyleSheet.create({
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#E5E5EA',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

const buttonTextVariantStyles = StyleSheet.create({
  primary: {
    color: '#FFFFFF',
  },
  secondary: {
    color: '#000000',
  },
  outline: {
    color: '#007AFF',
  },
  ghost: {
    color: '#007AFF',
  },
});

const buttonSizeStyles = StyleSheet.create({
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 32,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
});

const buttonTextSizeStyles = StyleSheet.create({
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 18,
  },
});


/* ─────────────────────────────────────────────────────────────
   3. LIST ITEM WITH MEMOIZATION
──────────────────────────────────────────────────────────────── */
//
// Optimized list item component with:
// - React.memo to prevent unnecessary re-renders
// - Stable callback references
// - Proper key extraction
// - Accessibility support
//

interface ProductListItemProps {
  product: Product;
  onPress: (product: Product) => void;
  onFavoriteToggle?: (productId: string) => void;
  isFavorite?: boolean;
  index?: number;
}

// Memoized list item - only re-renders when props change
export const ProductListItem = memo(function ProductListItem({
  product,
  onPress,
  onFavoriteToggle,
  isFavorite = false,
}: ProductListItemProps) {
  // Memoize handlers to prevent re-renders of child components
  const handlePress = useCallback(() => {
    onPress(product);
  }, [onPress, product]);

  const handleFavoritePress = useCallback(() => {
    onFavoriteToggle?.(product.id);
  }, [onFavoriteToggle, product.id]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        listItemStyles.container,
        pressed && listItemStyles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.price} dollars`}
    >
      <View style={listItemStyles.imageContainer}>
        {/* Replace with your Image component */}
        <View style={listItemStyles.imagePlaceholder} />
      </View>
      <View style={listItemStyles.content}>
        <Text style={listItemStyles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={listItemStyles.price}>${product.price.toFixed(2)}</Text>
        {!product.inStock && (
          <Text style={listItemStyles.outOfStock}>Out of Stock</Text>
        )}
      </View>
      {onFavoriteToggle && (
        <TouchableOpacity
          onPress={handleFavoritePress}
          style={listItemStyles.favoriteButton}
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Text>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
});

// Custom comparison function for deeper optimization
export const areProductListItemPropsEqual = (
  prevProps: ProductListItemProps,
  nextProps: ProductListItemProps
): boolean => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.name === nextProps.product.name &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.inStock === nextProps.product.inStock &&
    prevProps.isFavorite === nextProps.isFavorite
  );
};

// Alternative: memo with custom comparison
export const OptimizedProductListItem = memo(
  ProductListItem,
  areProductListItemPropsEqual
);

const listItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  pressed: {
    backgroundColor: '#F5F5F5',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5E5',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  outOfStock: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  favoriteButton: {
    padding: 8,
    justifyContent: 'center',
  },
});


/* ─────────────────────────────────────────────────────────────
   4. MODAL COMPONENT
──────────────────────────────────────────────────────────────── */
//
// A flexible modal component with:
// - Animated entrance/exit
// - Backdrop press to dismiss
// - Multiple size variants
// - Accessible dismiss button
//

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  animationType?: 'fade' | 'slide' | 'none';
}

export function CustomModal({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationType = 'fade',
}: CustomModalProps) {
  const handleBackdropPress = useCallback(() => {
    if (closeOnBackdropPress) {
      onClose();
    }
  }, [closeOnBackdropPress, onClose]);

  const contentStyle = useMemo(
    () => [modalStyles.content, modalSizeStyles[size]],
    [size]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={modalStyles.backdrop} onPress={handleBackdropPress}>
        <Pressable style={contentStyle} onPress={(e) => e.stopPropagation()}>
          {(title || showCloseButton) && (
            <View style={modalStyles.header}>
              {title && <Text style={modalStyles.title}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  style={modalStyles.closeButton}
                  accessibilityLabel="Close modal"
                  accessibilityRole="button"
                >
                  <Text style={modalStyles.closeIcon}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={modalStyles.body}>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  closeIcon: {
    fontSize: 24,
    color: '#666666',
    lineHeight: 24,
  },
  body: {
    padding: 16,
  },
});

const modalSizeStyles = StyleSheet.create({
  small: {
    width: SCREEN_WIDTH * 0.75,
    maxWidth: 300,
  },
  medium: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
  },
  large: {
    width: SCREEN_WIDTH * 0.95,
    maxWidth: 600,
  },
  fullscreen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderRadius: 0,
  },
});


/* ─────────────────────────────────────────────────────────────
   5. BOTTOM SHEET PATTERN
──────────────────────────────────────────────────────────────── */
//
// A draggable bottom sheet with:
// - Gesture-based dragging (simplified - use react-native-gesture-handler for production)
// - Snap points
// - Animated transitions
// - Handle indicator
//

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[]; // Heights as percentages (e.g., [0.25, 0.5, 0.9])
  initialSnapIndex?: number;
  showHandle?: boolean;
  enableBackdropDismiss?: boolean;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  snapPoints = [0.5],
  initialSnapIndex = 0,
  showHandle = true,
  enableBackdropDismiss = true,
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnapIndex);

  const snapHeight = SCREEN_HEIGHT * snapPoints[currentSnapIndex];
  const translateTarget = SCREEN_HEIGHT - snapHeight;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: translateTarget,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY, translateTarget]);

  const handleBackdropPress = useCallback(() => {
    if (enableBackdropDismiss) {
      onClose();
    }
  }, [enableBackdropDismiss, onClose]);

  if (!visible) return null;

  return (
    <View style={bottomSheetStyles.overlay}>
      <Pressable style={bottomSheetStyles.backdrop} onPress={handleBackdropPress} />
      <Animated.View
        style={[
          bottomSheetStyles.container,
          { height: snapHeight },
          { transform: [{ translateY }] },
        ]}
      >
        {showHandle && (
          <View style={bottomSheetStyles.handleContainer}>
            <View style={bottomSheetStyles.handle} />
          </View>
        )}
        <View style={bottomSheetStyles.content}>{children}</View>
      </Animated.View>
    </View>
  );
}

const bottomSheetStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: '#D1D1D6',
    borderRadius: 2.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});


/* ─────────────────────────────────────────────────────────────
   6. ERROR BOUNDARY FOR REACT NATIVE
──────────────────────────────────────────────────────────────── */
//
// Catches JavaScript errors in child components and displays a fallback UI.
// Must be a class component as hooks don't support error boundaries.
//

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={errorBoundaryStyles.container}>
          <Text style={errorBoundaryStyles.emoji}>😕</Text>
          <Text style={errorBoundaryStyles.title}>Oops! Something went wrong</Text>
          <Text style={errorBoundaryStyles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button
            label="Try Again"
            onPress={this.handleReset}
            variant="primary"
            style={errorBoundaryStyles.button}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

const errorBoundaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 150,
  },
});


/* ─────────────────────────────────────────────────────────────
   7. LOADING STATES AND SKELETONS
──────────────────────────────────────────────────────────────── */
//
// Loading indicators and skeleton screens for better perceived performance.
//

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
}

export function LoadingSpinner({
  size = 'large',
  color = '#007AFF',
  message,
}: LoadingSpinnerProps) {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={loadingStyles.message}>{message}</Text>}
    </View>
  );
}

// Animated skeleton loader
interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({ width, height, borderRadius = 4, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E5E5',
          opacity,
        },
        style,
      ]}
    />
  );
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <View style={skeletonStyles.productCard}>
      <Skeleton width="100%" height={150} borderRadius={8} />
      <View style={skeletonStyles.productInfo}>
        <Skeleton width="80%" height={16} style={skeletonStyles.marginBottom} />
        <Skeleton width="40%" height={20} />
      </View>
    </View>
  );
}

// List skeleton
interface ListSkeletonProps {
  count?: number;
}

export function ListSkeleton({ count = 5 }: ListSkeletonProps) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={skeletonStyles.listItem}>
          <Skeleton width={60} height={60} borderRadius={8} />
          <View style={skeletonStyles.listItemContent}>
            <Skeleton width="70%" height={16} style={skeletonStyles.marginBottom} />
            <Skeleton width="50%" height={14} />
          </View>
        </View>
      ))}
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    color: '#666666',
  },
});

const skeletonStyles = StyleSheet.create({
  productCard: {
    width: 180,
    marginRight: 16,
  },
  productInfo: {
    marginTop: 12,
  },
  marginBottom: {
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
});


/* ─────────────────────────────────────────────────────────────
   8. FORM COMPONENT PATTERN
──────────────────────────────────────────────────────────────── */
//
// Form components with validation, error states, and keyboard handling.
//

interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  required?: boolean;
}

export function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  required = false,
}: TextInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyles = useMemo(
    () => [
      formStyles.input,
      isFocused && formStyles.inputFocused,
      error && formStyles.inputError,
      disabled && formStyles.inputDisabled,
      multiline && { height: numberOfLines * 24 + 24, textAlignVertical: 'top' as const },
    ],
    [isFocused, error, disabled, multiline, numberOfLines]
  );

  return (
    <View style={formStyles.fieldContainer}>
      <View style={formStyles.labelRow}>
        <Text style={formStyles.label}>{label}</Text>
        {required && <Text style={formStyles.required}>*</Text>}
      </View>
      <TextInput
        style={inputStyles}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={label}
        accessibilityHint={placeholder}
      />
      {error && <Text style={formStyles.errorText}>{error}</Text>}
    </View>
  );
}

// Form wrapper with keyboard avoiding
interface FormContainerProps {
  children: ReactNode;
  onSubmit?: () => void;
}

export function FormContainer({ children }: FormContainerProps) {
  return (
    <KeyboardAvoidingView
      style={formStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={formStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const formStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  required: {
    color: '#FF3B30',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  inputFocused: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#999999',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});


/* ─────────────────────────────────────────────────────────────
   9. CARD COMPONENT WITH VARIANTS
──────────────────────────────────────────────────────────────── */

interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  onPress?: () => void;
  style?: object;
  testID?: string;
}

export function Card({
  children,
  variant = 'elevated',
  onPress,
  style,
  testID,
}: CardProps) {
  const cardStyles = useMemo(
    () => [baseCardStyles.container, cardVariantStyles[variant], style],
    [variant, style]
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyles, pressed && baseCardStyles.pressed]}
        testID={testID}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyles} testID={testID}>
      {children}
    </View>
  );
}

const baseCardStyles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  pressed: {
    opacity: 0.9,
  },
});

const cardVariantStyles = StyleSheet.create({
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filled: {
    backgroundColor: '#F5F5F5',
  },
});


/* ─────────────────────────────────────────────────────────────
   10. EMPTY STATE COMPONENT
──────────────────────────────────────────────────────────────── */

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={emptyStateStyles.container}>
      {icon && <View style={emptyStateStyles.iconContainer}>{icon}</View>}
      <Text style={emptyStateStyles.title}>{title}</Text>
      {message && <Text style={emptyStateStyles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="primary"
          style={emptyStateStyles.actionButton}
        />
      )}
    </View>
  );
}

const emptyStateStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    minWidth: 150,
  },
});


/* ─────────────────────────────────────────────────────────────
   HELPER COMPONENTS (Used in examples above)
──────────────────────────────────────────────────────────────── */

function ProductHeader({ product }: { product: Product }) {
  return (
    <View style={helperStyles.header}>
      <View style={helperStyles.imagePlaceholder} />
      <Text style={helperStyles.productName}>{product.name}</Text>
      <Text style={helperStyles.productPrice}>${product.price.toFixed(2)}</Text>
    </View>
  );
}

function ProductDetails({ product }: { product: Product }) {
  return (
    <View style={helperStyles.details}>
      <Text style={helperStyles.sectionTitle}>Description</Text>
      <Text style={helperStyles.description}>{product.description}</Text>
      <Text style={helperStyles.category}>Category: {product.category}</Text>
    </View>
  );
}

function AddToCartButton({
  onPress,
  disabled,
  price,
}: {
  onPress: () => void;
  disabled: boolean;
  price: number;
}) {
  return (
    <Button
      label={disabled ? 'Out of Stock' : `Add to Cart - $${price.toFixed(2)}`}
      onPress={onPress}
      disabled={disabled}
      fullWidth
      size="large"
    />
  );
}

function ErrorDisplay({
  message,
  onRetry,
  onGoBack,
}: {
  message: string;
  onRetry: () => void;
  onGoBack: () => void;
}) {
  return (
    <View style={helperStyles.errorContainer}>
      <Text style={helperStyles.errorText}>{message}</Text>
      <Button label="Retry" onPress={onRetry} variant="primary" />
      <Button label="Go Back" onPress={onGoBack} variant="ghost" style={{ marginTop: 12 }} />
    </View>
  );
}

const helperStyles = StyleSheet.create({
  header: {
    paddingVertical: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#007AFF',
  },
  details: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    color: '#999999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 24,
  },
});


/* ─────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  // Screen
  useProductDetailHook,
  // Types
  type ProductDetailScreenProps,
  type UseProductDetailHookReturn,
  type ButtonProps,
  type ProductListItemProps,
  type CustomModalProps,
  type BottomSheetProps,
  type ErrorBoundaryProps,
  type LoadingSpinnerProps,
  type SkeletonProps,
  type TextInputFieldProps,
  type FormContainerProps,
  type CardProps,
  type EmptyStateProps,
};
