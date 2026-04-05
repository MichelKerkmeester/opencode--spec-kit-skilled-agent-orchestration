/* ─────────────────────────────────────────────────────────────
   REACT COMPONENT PATTERNS
   Production-ready templates for Next.js 14+ App Router
──────────────────────────────────────────────────────────────── */

import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type PropsWithChildren,
} from 'react';

/* ─────────────────────────────────────────────────────────────
   1. SERVER COMPONENT PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Server Component - Default in App Router
 * - Runs only on the server
 * - Can directly access backend resources (databases, file system)
 * - Cannot use hooks, event handlers, or browser APIs
 * - Reduces client-side JavaScript bundle
 */

// Basic Server Component with data fetching
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

async function getProducts(categoryId: string): Promise<Product[]> {
  const res = await fetch(`${process.env.API_URL}/products?category=${categoryId}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export async function ProductList({ categoryId }: { categoryId: string }) {
  const products = await getProducts(categoryId);

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

// Server Component with Suspense boundary
import { Suspense } from 'react';

export async function ProductPage({ categoryId }: { categoryId: string }) {
  return (
    <main>
      <h1>Products</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList categoryId={categoryId} />
      </Suspense>
    </main>
  );
}

function ProductListSkeleton() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg" />
          <div className="mt-2 h-4 bg-gray-200 rounded w-3/4" />
          <div className="mt-1 h-4 bg-gray-200 rounded w-1/2" />
        </li>
      ))}
    </ul>
  );
}

// Server Component with streaming
export async function StreamingProductList({ categoryId }: { categoryId: string }) {
  const products = await getProducts(categoryId);

  return (
    <>
      {products.map((product) => (
        <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
          <ProductCardWithDetails productId={product.id} />
        </Suspense>
      ))}
    </>
  );
}

async function ProductCardWithDetails({ productId }: { productId: string }) {
  const details = await fetch(`${process.env.API_URL}/products/${productId}/details`);
  const data = await details.json();

  return <ProductCard product={data} />;
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse border rounded-lg p-4">
      <div className="bg-gray-200 h-32 rounded" />
      <div className="mt-2 h-4 bg-gray-200 rounded" />
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────
   2. CLIENT COMPONENT PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Client Component
 * - Add 'use client' directive at the top
 * - Can use hooks, event handlers, browser APIs
 * - Required for interactivity
 * - Keep as small as possible (leaf components)
 */

'use client';

// Basic Client Component with state
interface CounterProps {
  initialCount?: number;
  step?: number;
  min?: number;
  max?: number;
  onChange?: (count: number) => void;
}

export function Counter({
  initialCount = 0,
  step = 1,
  min = -Infinity,
  max = Infinity,
  onChange,
}: CounterProps) {
  const [count, setCount] = useState(initialCount);

  const increment = useCallback(() => {
    setCount((c) => {
      const newCount = Math.min(c + step, max);
      onChange?.(newCount);
      return newCount;
    });
  }, [step, max, onChange]);

  const decrement = useCallback(() => {
    setCount((c) => {
      const newCount = Math.max(c - step, min);
      onChange?.(newCount);
      return newCount;
    });
  }, [step, min, onChange]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={decrement}
        disabled={count <= min}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        aria-label="Decrease count"
      >
        -
      </button>
      <span className="min-w-[3ch] text-center" aria-live="polite">
        {count}
      </span>
      <button
        onClick={increment}
        disabled={count >= max}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        aria-label="Increase count"
      >
        +
      </button>
    </div>
  );
}

// Client Component with controlled/uncontrolled pattern
interface ToggleProps {
  defaultPressed?: boolean;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children: ReactNode;
}

export function Toggle({
  defaultPressed = false,
  pressed: controlledPressed,
  onPressedChange,
  children,
}: ToggleProps) {
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);

  const isControlled = controlledPressed !== undefined;
  const isPressed = isControlled ? controlledPressed : uncontrolledPressed;

  const handleClick = () => {
    const newPressed = !isPressed;

    if (!isControlled) {
      setUncontrolledPressed(newPressed);
    }

    onPressedChange?.(newPressed);
  };

  return (
    <button
      type="button"
      aria-pressed={isPressed}
      onClick={handleClick}
      className={`px-4 py-2 rounded transition-colors ${
        isPressed ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}


/* ─────────────────────────────────────────────────────────────
   3. COMPOUND COMPONENT PATTERN
──────────────────────────────────────────────────────────────── */

/**
 * Compound Components
 * - Share implicit state between related components
 * - Provide flexible, composable API
 * - Context-based communication
 */

// Accordion compound component
interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
}

interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
  children: ReactNode;
}

export function Accordion({
  type = 'single',
  defaultOpen = [],
  children,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        if (type === 'single') {
          next.clear();
        }
        next.add(id);
      }

      return next;
    });
  }, [type]);

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className="divide-y border rounded-lg">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  children: ReactNode;
}

const AccordionItemContext = createContext<string | null>(null);

export function AccordionItem({ id, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={id}>
      <div className="accordion-item">{children}</div>
    </AccordionItemContext.Provider>
  );
}

function useAccordionItem() {
  const id = useContext(AccordionItemContext);
  if (!id) {
    throw new Error('AccordionTrigger/Content must be used within AccordionItem');
  }
  return id;
}

export function AccordionTrigger({ children }: { children: ReactNode }) {
  const { openItems, toggleItem } = useAccordion();
  const id = useAccordionItem();
  const isOpen = openItems.has(id);

  return (
    <button
      type="button"
      onClick={() => toggleItem(id)}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${id}`}
      className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-gray-50"
    >
      {children}
      <ChevronIcon className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
}

export function AccordionContent({ children }: { children: ReactNode }) {
  const { openItems } = useAccordion();
  const id = useAccordionItem();
  const isOpen = openItems.has(id);

  if (!isOpen) return null;

  return (
    <div
      id={`accordion-content-${id}`}
      role="region"
      className="p-4 pt-0"
    >
      {children}
    </div>
  );
}

// Usage example:
// <Accordion type="single">
//   <AccordionItem id="item-1">
//     <AccordionTrigger>Section 1</AccordionTrigger>
//     <AccordionContent>Content 1</AccordionContent>
//   </AccordionItem>
// </Accordion>


/* ─────────────────────────────────────────────────────────────
   4. RENDER PROPS PATTERN
──────────────────────────────────────────────────────────────── */

/**
 * Render Props
 * - Share behavior without dictating UI
 * - Maximum flexibility for consumers
 * - Alternative to hooks for class components
 */

// Mouse tracker with render props
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  children: (position: MousePosition) => ReactNode;
}

export function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div onMouseMove={handleMouseMove} className="relative">
      {children(position)}
    </div>
  );
}

// Usage:
// <MouseTracker>
//   {({ x, y }) => <span>Mouse: {x}, {y}</span>}
// </MouseTracker>

// Disclosure with render props (flexible open/close UI)
interface DisclosureRenderProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

interface DisclosureProps {
  defaultOpen?: boolean;
  children: (props: DisclosureRenderProps) => ReactNode;
}

export function Disclosure({ defaultOpen = false, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return <>{children({ isOpen, open, close, toggle })}</>;
}

// Usage:
// <Disclosure>
//   {({ isOpen, toggle }) => (
//     <>
//       <button onClick={toggle}>{isOpen ? 'Hide' : 'Show'}</button>
//       {isOpen && <div>Content</div>}
//     </>
//   )}
// </Disclosure>


/* ─────────────────────────────────────────────────────────────
   5. FORWARDREF PATTERN
──────────────────────────────────────────────────────────────── */

/**
 * forwardRef
 * - Pass refs through components to DOM elements
 * - Essential for design system components
 * - Enables parent access to child DOM nodes
 */

// Basic forwardRef button
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<ElementRef<'button'>, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props },
    ref
  ) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
          (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        } ${className ?? ''}`}
        {...props}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);

// forwardRef input with label
interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<ElementRef<'input'>, InputProps>(
  function Input({ label, error, hint, className, id, ...props }, ref) {
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s/g, '-')}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } ${className ?? ''}`}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-sm text-gray-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

// Polymorphic forwardRef (as prop pattern)
type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = object
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicRef<C extends React.ElementType> = ComponentPropsWithoutRef<C>['ref'];

type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = object
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

// Text component that can render as any element
type TextProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  { variant?: 'body' | 'heading' | 'label' }
>;

type TextComponent = <C extends React.ElementType = 'span'>(
  props: TextProps<C>
) => React.ReactElement | null;

export const Text: TextComponent = forwardRef(function Text<
  C extends React.ElementType = 'span'
>({ as, variant = 'body', className, children, ...props }: TextProps<C>, ref: PolymorphicRef<C>) {
  const Component = as ?? 'span';

  const variants = {
    body: 'text-base text-gray-700',
    heading: 'text-2xl font-bold text-gray-900',
    label: 'text-sm font-medium text-gray-600',
  };

  return (
    <Component ref={ref} className={`${variants[variant]} ${className ?? ''}`} {...props}>
      {children}
    </Component>
  );
});

// Usage:
// <Text as="h1" variant="heading">Hello</Text>
// <Text as="p" variant="body">Paragraph</Text>


/* ─────────────────────────────────────────────────────────────
   6. ERROR BOUNDARY PATTERN
──────────────────────────────────────────────────────────────── */

/**
 * Error Boundary
 * - Catch JavaScript errors in component tree
 * - Display fallback UI
 * - Log errors for monitoring
 * - Must be a class component (no hooks equivalent)
 */

import { Component, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.reset);
      }

      return this.props.fallback ?? (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          <p className="mt-1 text-sm text-red-600">{this.state.error.message}</p>
          <button
            onClick={this.reset}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
// <ErrorBoundary
//   fallback={(error, reset) => (
//     <div>
//       <p>Error: {error.message}</p>
//       <button onClick={reset}>Retry</button>
//     </div>
//   )}
//   onError={(error) => logToService(error)}
// >
//   <MyComponent />
// </ErrorBoundary>

// Async Error Boundary for Next.js (using error.tsx convention)
// This is typically placed in app/error.tsx or any route segment

'use client';

interface AsyncErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function AsyncErrorBoundary({ error, reset }: AsyncErrorBoundaryProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="text-6xl">:(</div>
        <h1 className="text-2xl font-bold">Something went wrong!</h1>
        <p className="text-gray-600">
          {error.message || 'An unexpected error occurred'}
        </p>
        {error.digest && (
          <p className="text-sm text-gray-400">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────
   7. UTILITY COMPONENTS
──────────────────────────────────────────────────────────────── */

// Simple ProductCard for examples
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
    </div>
  );
}

// Loading spinner
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ''}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// Chevron icon
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`h-5 w-5 ${className ?? ''}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}


/* ─────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  // Server Components
  ProductList,
  ProductPage,
  StreamingProductList,
  // Client Components
  Counter,
  Toggle,
  // Compound Components
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  // Render Props
  MouseTracker,
  Disclosure,
  // forwardRef Components
  Button,
  Input,
  Text,
  // Error Boundaries
  ErrorBoundary,
  AsyncErrorBoundary,
  // Utilities
  ProductCard,
  Spinner,
  ChevronIcon,
};
