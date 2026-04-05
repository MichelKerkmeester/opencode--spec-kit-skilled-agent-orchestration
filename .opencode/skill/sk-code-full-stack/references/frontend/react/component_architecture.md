---
title: Component Architecture
description: Server Components vs Client Components, composition patterns, props handling, compound components, render props, and component organization patterns for React 19 and Next.js 14+.
---

# Component Architecture

Server Components vs Client Components, composition patterns, props handling, compound components, render props, and component organization patterns for React 19 and Next.js 14+.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on React component patterns including Server Components, Client Components, composition strategies, state management within components, and advanced patterns like compound components and render props.

### When to Use

- Creating new React components
- Deciding between Server and Client Components
- Implementing component composition patterns
- Managing component state and props
- Building reusable component libraries

### Prerequisites

- **[React/Next.js Standards](./react_nextjs_standards.md)**: Project structure and file naming
- **[State Management](./state_management.md)**: Global state patterns (Zustand, Context)
- **[Data Fetching](./data_fetching.md)**: Server Actions and React Query integration

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:server-components-vs-client-components -->
## 2. SERVER COMPONENTS VS CLIENT COMPONENTS

### The Mental Model

In Next.js 14+ with App Router, all components are **Server Components by default**. They run on the server during the request/build and send HTML to the client.

```
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER COMPONENTS                        │
│  - Default in App Router                                        │
│  - Run on server only (never shipped to browser)                │
│  - Can access backend resources directly                        │
│  - Cannot use hooks (useState, useEffect, etc.)                 │
│  - Cannot use browser APIs                                      │
│  - Cannot add event handlers (onClick, onChange, etc.)          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 'use client' boundary
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT COMPONENTS                        │
│  - Marked with 'use client' directive                           │
│  - Hydrated in browser (shipped as JavaScript)                  │
│  - Can use all React hooks                                      │
│  - Can use browser APIs                                         │
│  - Can handle events                                            │
│  - Can still render Server Components as children               │
└─────────────────────────────────────────────────────────────────┘
```

### When to Use Each

| Use Server Components When                     | Use Client Components When                    |
| ---------------------------------------------- | --------------------------------------------- |
| Fetching data                                  | Adding interactivity (onClick, onChange)      |
| Accessing backend resources directly           | Using React hooks (useState, useEffect)       |
| Keeping sensitive info on server (tokens, API) | Using browser APIs (localStorage, navigator)  |
| Keeping large dependencies on server           | Using custom hooks that depend on state       |
| Reducing client-side JavaScript                | Third-party components requiring hooks        |

### Server Component Example

```typescript
// app/products/page.tsx (Server Component by default)
import { db } from '@/lib/db/prisma';
import { ProductCard } from '@/components/features/products/ProductCard';

export default async function ProductsPage() {
  // Direct database access - only possible in Server Components
  const products = await db.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Client Component Example

```typescript
'use client';

// components/features/products/AddToCartButton.tsx
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { addToCart } from '@/lib/actions/cart';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
}

export function AddToCartButton({ productId, productName }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    startTransition(async () => {
      await addToCart(productId);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isPending}
      variant={added ? 'success' : 'primary'}
    >
      {isPending ? 'Adding...' : added ? 'Added!' : 'Add to Cart'}
    </Button>
  );
}
```

### Mixing Server and Client Components

The key pattern: Server Components can import and render Client Components, but Client Components cannot import Server Components. However, Client Components CAN render Server Components passed as children.

```typescript
// Server Component layout
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { UserMenu } from '@/components/features/auth/UserMenu';
import { getSession } from '@/lib/auth/session';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <TopNav>
          {/* UserMenu is Client Component, receiving server data */}
          <UserMenu user={session.user} />
        </TopNav>
        <main>{children}</main>
      </div>
    </div>
  );
}
```

```typescript
'use client';

// components/layout/TopNav.tsx (Client Component)
import { useState } from 'react';

interface TopNavProps {
  children: React.ReactNode;  // Can receive Server Components as children
}

export function TopNav({ children }: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4">
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {children}  {/* Server Component rendered here */}
    </nav>
  );
}
```

### Composition Pattern: Server/Client Boundary

```typescript
// Pattern: Wrap interactive elements, keep data fetching in Server Components

// app/blog/[slug]/page.tsx (Server Component)
import { getPost, getComments } from '@/lib/api/blog';
import { CommentSection } from '@/components/features/blog/CommentSection';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const [post, comments] = await Promise.all([
    getPost(params.slug),
    getComments(params.slug),
  ]);

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Client Component receives server-fetched data */}
      <CommentSection
        postId={post.id}
        initialComments={comments}
      />
    </article>
  );
}
```

```typescript
'use client';

// components/features/blog/CommentSection.tsx
import { useState, useOptimistic } from 'react';
import { Comment } from '@/types/blog';
import { addComment } from '@/lib/actions/comments';

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: Comment) => [...state, newComment]
  );

  const handleSubmit = async (formData: FormData) => {
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      content: formData.get('content') as string,
      createdAt: new Date().toISOString(),
    };

    addOptimisticComment(optimisticComment);

    const newComment = await addComment(postId, formData);
    setComments([...comments, newComment]);
  };

  return (
    <section>
      <h2>Comments ({optimisticComments.length})</h2>
      <form action={handleSubmit}>
        <textarea name="content" required />
        <button type="submit">Add Comment</button>
      </form>
      <ul>
        {optimisticComments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </section>
  );
}
```

---

<!-- /ANCHOR:server-components-vs-client-components -->
<!-- ANCHOR:component-folder-structure -->
## 3. COMPONENT FOLDER STRUCTURE

### Standard Component Structure

```
components/
├── ui/                          # Base UI primitives
│   ├── Button/
│   │   ├── Button.tsx           # Component implementation
│   │   ├── Button.test.tsx      # Component tests
│   │   ├── Button.stories.tsx   # Storybook stories (optional)
│   │   └── index.ts             # Barrel export
│   ├── Input/
│   ├── Modal/
│   ├── Card/
│   └── index.ts                 # UI barrel export
├── forms/                       # Form-specific components
│   ├── FormField/
│   ├── FormError/
│   └── index.ts
├── layout/                      # Layout components
│   ├── Header/
│   ├── Sidebar/
│   ├── Footer/
│   └── index.ts
└── features/                    # Feature-specific components
    ├── auth/
    │   ├── LoginForm/
    │   ├── UserMenu/
    │   └── index.ts
    ├── products/
    │   ├── ProductCard/
    │   ├── ProductGrid/
    │   └── index.ts
    └── checkout/
        ├── CartItem/
        ├── CheckoutForm/
        └── index.ts
```

### Component File Template

```typescript
// components/ui/Button/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Barrel Export Pattern

```typescript
// components/ui/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';

// components/ui/index.ts
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Modal, type ModalProps } from './Modal';
export { Card, type CardProps } from './Card';

// Usage
import { Button, Input, Modal } from '@/components/ui';
```

---

<!-- /ANCHOR:component-folder-structure -->
<!-- ANCHOR:props-and-children-patterns -->
## 4. PROPS AND CHILDREN PATTERNS

### TypeScript Props Interface

```typescript
// Explicit interface with documentation
interface UserCardProps {
  /** The user object to display */
  user: User;
  /** Optional click handler when card is clicked */
  onClick?: (user: User) => void;
  /** Whether to show the user's avatar */
  showAvatar?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Content to render in the card footer */
  footer?: React.ReactNode;
}

export function UserCard({
  user,
  onClick,
  showAvatar = true,
  className,
  footer,
}: UserCardProps) {
  return (
    <div
      className={cn('user-card', className)}
      onClick={onClick ? () => onClick(user) : undefined}
    >
      {showAvatar && <Avatar src={user.avatarUrl} alt={user.name} />}
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
```

### Extending Native Element Props

```typescript
import { forwardRef } from 'react';

// Extend native button props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button ref={ref} {...props}>
        {isLoading ? <Spinner /> : children}
      </button>
    );
  }
);

// Extend native input props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && <label>{label}</label>}
        <input ref={ref} className={cn('input', className)} {...props} />
        {error && <span className="error">{error}</span>}
      </div>
    );
  }
);
```

### Children Patterns

```typescript
// 1. Standard children
interface CardProps {
  children: React.ReactNode;
  title?: string;
}

function Card({ children, title }: CardProps) {
  return (
    <div className="card">
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

// 2. Function as children (render prop via children)
interface DataListProps<T> {
  data: T[];
  children: (item: T, index: number) => React.ReactNode;
}

function DataList<T>({ data, children }: DataListProps<T>) {
  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>{children(item, index)}</li>
      ))}
    </ul>
  );
}

// Usage
<DataList data={users}>
  {(user, index) => (
    <span>{index + 1}. {user.name}</span>
  )}
</DataList>

// 3. Named children via props
interface PageLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function PageLayout({ header, sidebar, children, footer }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}
```

### Required vs Optional Children

```typescript
// Required children
interface RequiredChildrenProps {
  children: React.ReactNode;  // Must be provided
}

// Optional children
interface OptionalChildrenProps {
  children?: React.ReactNode;  // Can be omitted
}

// Specific child type
interface ListProps {
  children: React.ReactElement<ListItemProps> | React.ReactElement<ListItemProps>[];
}

// No children allowed
interface IconProps {
  name: string;
  size?: number;
  children?: never;  // TypeScript error if children passed
}
```

---

<!-- /ANCHOR:props-and-children-patterns -->
<!-- ANCHOR:compound-components -->
## 5. COMPOUND COMPONENTS

### Pattern Overview

Compound components share implicit state and work together as a cohesive unit. Think of HTML `<select>` and `<option>`.

### Basic Compound Component

```typescript
'use client';

import { createContext, useContext, useState, useId } from 'react';

// 1. Define shared context
interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within <Accordion>');
  }
  return context;
}

// 2. Root component (provider)
interface AccordionProps {
  children: React.ReactNode;
  defaultOpen?: string[];
  allowMultiple?: boolean;
}

function AccordionRoot({ children, defaultOpen = [], allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

// 3. Item component
interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
}

function AccordionItem({ children, value }: AccordionItemProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.has(value);

  return (
    <div className="accordion-item" data-state={isOpen ? 'open' : 'closed'}>
      {children}
    </div>
  );
}

// 4. Trigger component
interface AccordionTriggerProps {
  children: React.ReactNode;
  value: string;
}

function AccordionTrigger({ children, value }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordionContext();
  const isOpen = openItems.has(value);
  const id = useId();

  return (
    <button
      id={`trigger-${id}`}
      aria-expanded={isOpen}
      aria-controls={`content-${id}`}
      onClick={() => toggleItem(value)}
      className="accordion-trigger"
    >
      {children}
      <ChevronIcon className={isOpen ? 'rotate-180' : ''} />
    </button>
  );
}

// 5. Content component
interface AccordionContentProps {
  children: React.ReactNode;
  value: string;
}

function AccordionContent({ children, value }: AccordionContentProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.has(value);
  const id = useId();

  if (!isOpen) return null;

  return (
    <div
      id={`content-${id}`}
      role="region"
      aria-labelledby={`trigger-${id}`}
      className="accordion-content"
    >
      {children}
    </div>
  );
}

// 6. Export as namespace
export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};

// Usage
<Accordion.Root allowMultiple>
  <Accordion.Item value="item-1">
    <Accordion.Trigger value="item-1">Section 1</Accordion.Trigger>
    <Accordion.Content value="item-1">Content for section 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger value="item-2">Section 2</Accordion.Trigger>
    <Accordion.Content value="item-2">Content for section 2</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Advanced: Tabs Compound Component

```typescript
'use client';

import { createContext, useContext, useState, useCallback, useId } from 'react';

// Context
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  registerTab: (id: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>');
  }
  return context;
}

// Root
interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  onValueChange?: (value: string) => void;
}

function TabsRoot({ children, defaultValue, onValueChange }: TabsProps) {
  const [activeTab, setActiveTabState] = useState(defaultValue);
  const baseId = useId();

  const setActiveTab = useCallback((id: string) => {
    setActiveTabState(id);
    onValueChange?.(id);
  }, [onValueChange]);

  const registerTab = useCallback((id: string) => {
    // Could track registered tabs for keyboard navigation
  }, []);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, registerTab, baseId }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// TabList
interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

function TabList({ children, className }: TabListProps) {
  return (
    <div role="tablist" className={cn('tab-list', className)}>
      {children}
    </div>
  );
}

// Tab Trigger
interface TabTriggerProps {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
}

function TabTrigger({ children, value, disabled }: TabTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn('tab-trigger', isActive && 'active')}
    >
      {children}
    </button>
  );
}

// Tab Content
interface TabContentProps {
  children: React.ReactNode;
  value: string;
}

function TabContent({ children, value }: TabContentProps) {
  const { activeTab, baseId } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className="tab-content"
    >
      {children}
    </div>
  );
}

// Export
export const Tabs = {
  Root: TabsRoot,
  List: TabList,
  Trigger: TabTrigger,
  Content: TabContent,
};

// Usage
<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">Overview content</Tabs.Content>
  <Tabs.Content value="analytics">Analytics content</Tabs.Content>
  <Tabs.Content value="settings">Settings content</Tabs.Content>
</Tabs.Root>
```

---

<!-- /ANCHOR:compound-components -->
<!-- ANCHOR:render-props-pattern -->
## 6. RENDER PROPS PATTERN

### When to Use

Render props are useful when you want to share logic without dictating UI. While hooks have replaced many render prop use cases, they're still valuable for:

- Headless components (logic without UI)
- Components that need to render children with data
- Slot patterns

### Basic Render Props

```typescript
'use client';

import { useState, useEffect } from 'react';

// Mouse position tracker with render prop
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  children: (position: MousePosition) => React.ReactNode;
}

export function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <>{children(position)}</>;
}

// Usage
<MouseTracker>
  {({ x, y }) => (
    <div>
      Mouse position: {x}, {y}
    </div>
  )}
</MouseTracker>
```

### Headless Dropdown

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';

interface DropdownState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

interface DropdownRenderProps extends DropdownState {
  triggerProps: {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-haspopup': true;
  };
  menuProps: {
    role: 'menu';
    'aria-hidden': boolean;
  };
  getItemProps: (index: number) => {
    role: 'menuitem';
    tabIndex: number;
  };
}

interface HeadlessDropdownProps {
  children: (props: DropdownRenderProps) => React.ReactNode;
}

export function HeadlessDropdown({ children }: HeadlessDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const triggerProps = {
    onClick: toggle,
    'aria-expanded': isOpen,
    'aria-haspopup': true as const,
  };

  const menuProps = {
    role: 'menu' as const,
    'aria-hidden': !isOpen,
  };

  const getItemProps = (index: number) => ({
    role: 'menuitem' as const,
    tabIndex: isOpen ? 0 : -1,
  });

  return (
    <div ref={containerRef}>
      {children({
        isOpen,
        open,
        close,
        toggle,
        triggerProps,
        menuProps,
        getItemProps,
      })}
    </div>
  );
}

// Usage - full control over styling
<HeadlessDropdown>
  {({ isOpen, triggerProps, menuProps, getItemProps }) => (
    <>
      <button {...triggerProps} className="dropdown-trigger">
        Options
      </button>
      {isOpen && (
        <ul {...menuProps} className="dropdown-menu">
          <li {...getItemProps(0)}>Edit</li>
          <li {...getItemProps(1)}>Delete</li>
          <li {...getItemProps(2)}>Share</li>
        </ul>
      )}
    </>
  )}
</HeadlessDropdown>
```

### Controlled/Uncontrolled Pattern

```typescript
'use client';

import { useState, useCallback } from 'react';

interface ToggleRenderProps {
  isOn: boolean;
  toggle: () => void;
  setOn: () => void;
  setOff: () => void;
}

interface ToggleProps {
  defaultOn?: boolean;
  on?: boolean;
  onChange?: (isOn: boolean) => void;
  children: (props: ToggleRenderProps) => React.ReactNode;
}

export function Toggle({
  defaultOn = false,
  on: controlledOn,
  onChange,
  children,
}: ToggleProps) {
  const [uncontrolledOn, setUncontrolledOn] = useState(defaultOn);

  // Determine if controlled or uncontrolled
  const isControlled = controlledOn !== undefined;
  const isOn = isControlled ? controlledOn : uncontrolledOn;

  const handleChange = useCallback((newValue: boolean) => {
    if (!isControlled) {
      setUncontrolledOn(newValue);
    }
    onChange?.(newValue);
  }, [isControlled, onChange]);

  const toggle = () => handleChange(!isOn);
  const setOn = () => handleChange(true);
  const setOff = () => handleChange(false);

  return <>{children({ isOn, toggle, setOn, setOff })}</>;
}

// Uncontrolled usage
<Toggle defaultOn={false}>
  {({ isOn, toggle }) => (
    <button onClick={toggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  )}
</Toggle>

// Controlled usage
const [isEnabled, setIsEnabled] = useState(false);

<Toggle on={isEnabled} onChange={setIsEnabled}>
  {({ isOn, toggle }) => (
    <Switch checked={isOn} onChange={toggle} />
  )}
</Toggle>
```

---

<!-- /ANCHOR:render-props-pattern -->
<!-- ANCHOR:higher-order-components-hocs -->
## 7. HIGHER-ORDER COMPONENTS (HOCs)

### When to Use (Modern Approach)

HOCs are less common in modern React (hooks are preferred), but still useful for:

- Wrapping components with providers
- Adding analytics/logging
- Authentication wrappers
- Cross-cutting concerns

### WithAuth HOC

```typescript
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

// For Server Components
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P & { user: User }>
) {
  return async function AuthenticatedComponent(props: P) {
    const session = await getSession();

    if (!session) {
      redirect('/login');
    }

    return <WrappedComponent {...props} user={session.user} />;
  };
}

// Usage
async function DashboardPage({ params }: { params: { id: string } }) {
  // user is injected by HOC
  return <div>Dashboard</div>;
}

export default withAuth(DashboardPage);
```

### WithErrorBoundary HOC

```typescript
'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props;
      return typeof fallback === 'function'
        ? fallback(this.state.error)
        : fallback;
    }

    return this.props.children;
  }
}

// HOC wrapper
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback: ReactNode | ((error: Error) => ReactNode)
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Usage
const SafeChart = withErrorBoundary(
  ComplexChart,
  <div>Chart failed to load</div>
);
```

---

<!-- /ANCHOR:higher-order-components-hocs -->
<!-- ANCHOR:component-composition-patterns -->
## 8. COMPONENT COMPOSITION PATTERNS

### Slot Pattern

```typescript
interface CardProps {
  children: React.ReactNode;
}

interface CardHeaderProps {
  children: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
}

interface CardFooterProps {
  children: React.ReactNode;
}

function CardRoot({ children }: CardProps) {
  return <div className="card">{children}</div>;
}

function CardHeader({ children }: CardHeaderProps) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }: CardBodyProps) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }: CardFooterProps) {
  return <div className="card-footer">{children}</div>;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

// Usage
<Card>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here...</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Container/Presenter Pattern

```typescript
// Container: handles logic and data
// components/features/users/UserListContainer.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api/users';
import { UserListPresenter } from './UserListPresenter';

export function UserListContainer() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <UserListSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!users?.length) return <EmptyState message="No users found" />;

  return <UserListPresenter users={users} />;
}

// Presenter: pure UI, easily testable
// components/features/users/UserListPresenter.tsx
interface UserListPresenterProps {
  users: User[];
  onUserClick?: (user: User) => void;
}

export function UserListPresenter({ users, onUserClick }: UserListPresenterProps) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li
          key={user.id}
          onClick={() => onUserClick?.(user)}
          className="user-item"
        >
          <Avatar src={user.avatar} />
          <span>{user.name}</span>
        </li>
      ))}
    </ul>
  );
}
```

### Provider Pattern

```typescript
'use client';

import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';

// Define state and actions
interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
}

// Context
interface CartContextValue {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ state, dispatch, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

---

<!-- /ANCHOR:component-composition-patterns -->
<!-- ANCHOR:forwardref-and-imperative-handle -->
## 9. FORWARDREF AND IMPERATIVE HANDLE

### ForwardRef Pattern

```typescript
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Forward ref to underlying input
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && <label>{label}</label>}
        <input
          ref={ref}
          className={cn('input', error && 'input-error', className)}
          {...props}
        />
        {error && <span className="error-text">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Usage - access input methods
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <Input ref={inputRef} label="Email" />
      <button onClick={handleFocus}>Focus Input</button>
    </>
  );
}
```

### useImperativeHandle for Custom Methods

```typescript
'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

// Define the imperative handle interface
export interface ModalHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ title, children, onOpen, onClose }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
        dialogRef.current?.showModal();
        onOpen?.();
      },
      close: () => {
        setIsOpen(false);
        dialogRef.current?.close();
        onClose?.();
      },
      toggle: () => {
        if (isOpen) {
          setIsOpen(false);
          dialogRef.current?.close();
          onClose?.();
        } else {
          setIsOpen(true);
          dialogRef.current?.showModal();
          onOpen?.();
        }
      },
    }));

    return (
      <dialog ref={dialogRef} className="modal">
        <header className="modal-header">
          <h2>{title}</h2>
          <button onClick={() => ref && 'current' in ref && ref.current?.close()}>
            &times;
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </dialog>
    );
  }
);

Modal.displayName = 'Modal';

// Usage
function Page() {
  const modalRef = useRef<ModalHandle>(null);

  return (
    <>
      <button onClick={() => modalRef.current?.open()}>Open Modal</button>
      <Modal ref={modalRef} title="Confirm Action">
        <p>Are you sure you want to proceed?</p>
        <button onClick={() => modalRef.current?.close()}>Cancel</button>
        <button onClick={() => {
          // Handle confirm
          modalRef.current?.close();
        }}>
          Confirm
        </button>
      </Modal>
    </>
  );
}
```

---

<!-- /ANCHOR:forwardref-and-imperative-handle -->
<!-- ANCHOR:accessibility-patterns -->
## 10. ACCESSIBILITY PATTERNS

### ARIA Attributes in Components

```typescript
'use client';

import { useState, useId } from 'react';

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ title, children, defaultOpen = false }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="disclosure">
      <button
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        onClick={() => setIsOpen(!isOpen)}
        className="disclosure-trigger"
      >
        {title}
        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        id={`${id}-content`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        hidden={!isOpen}
        className="disclosure-content"
      >
        {children}
      </div>
    </div>
  );
}
```

### Focus Management

```typescript
'use client';

import { useRef, useEffect } from 'react';

interface TrapFocusProps {
  children: React.ReactNode;
  active: boolean;
}

export function TrapFocus({ children, active }: TrapFocusProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Save currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus first focusable element
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements?.length) {
      (focusableElements[0] as HTMLElement).focus();
    }

    // Handle tab key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusables = Array.from(
        containerRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ) as HTMLElement[];

      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus
      previousActiveElement.current?.focus();
    };
  }, [active]);

  return <div ref={containerRef}>{children}</div>;
}
```

---

<!-- /ANCHOR:accessibility-patterns -->
<!-- ANCHOR:quick-reference -->
## 11. QUICK REFERENCE

### Component Decision Tree

```
Need interactivity (events, state, hooks)?
├── Yes → Client Component ('use client')
└── No → Server Component (default)

Need to share state between components?
├── Sibling components → Lift state up / Context
├── Deeply nested → Context / Zustand
└── Server data → React Query / Server Components

Building reusable UI?
├── Simple → Props + children
├── Complex with shared state → Compound Components
└── Logic sharing → Custom hooks / Render props

Need to access DOM?
├── Single element → useRef
└── Expose methods to parent → forwardRef + useImperativeHandle
```

### Checklist: New Component

- [ ] Determine Server vs Client Component
- [ ] Define TypeScript props interface
- [ ] Use named export (not default)
- [ ] Add forwardRef if DOM access needed
- [ ] Include displayName for forwardRef components
- [ ] Add accessibility attributes (aria-*, role)
- [ ] Use semantic HTML elements
- [ ] Handle loading/error/empty states
- [ ] Add tests for component
- [ ] Create barrel export in index.ts

### Common Patterns Summary

| Pattern              | When to Use                          | Example Use Case             |
| -------------------- | ------------------------------------ | ---------------------------- |
| Compound Components  | Components that work together        | Tabs, Accordion, Menu        |
| Render Props         | Share logic, consumer controls UI    | Headless components          |
| Container/Presenter  | Separate logic from presentation     | Data lists, complex forms    |
| Provider Pattern     | Share state across component tree    | Auth, Theme, Cart            |
| Slot Pattern         | Flexible layout composition          | Card, Layout, Page           |
| HOC                  | Cross-cutting concerns               | Auth wrapper, Analytics      |

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

### Related References

- [React/Next.js Standards](./react_nextjs_standards.md) - Project structure and file naming
- [State Management](./state_management.md) - Context, Zustand, and Jotai patterns
- [Data Fetching](./data_fetching.md) - Server Actions and React Query integration
- [Forms & Validation](./forms_validation.md) - React Hook Form and Zod integration
- [Testing Strategy](./testing_strategy.md) - Component testing patterns
<!-- /ANCHOR:related-resources -->
