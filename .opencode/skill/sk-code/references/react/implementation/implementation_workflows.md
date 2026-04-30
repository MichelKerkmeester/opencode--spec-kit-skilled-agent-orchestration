---
title: React / Next.js — Phase 1 Implementation Workflows
description: Phase-1 entry doc for the React live branch. Kerkmeester-style App Router patterns, vanilla-extract styling, motion v12 animation, react-hook-form + zod forms, Untitled UI components, react-aria accessibility, API integration with Go backend.
keywords: [react, nextjs, app-router, server-component, client-component, vanilla-extract, motion, react-hook-form, zod, untitled-ui, react-aria, kerkmeester]
---

# React / Next.js — Phase 1 Implementation Workflows

Phase 1 entry point. Walk this doc when starting new work or modifying existing React/Next.js code under sk-code. Patterns follow `kerkmeester.com` (Next.js 14 App Router, vanilla-extract styling, motion v12 animation, react-hook-form + zod forms, Untitled UI vendored components, react-aria for accessibility).

> **If you're not on this exact stack** (e.g. Tailwind instead of vanilla-extract, framer-motion instead of motion v12), the App Router / Server Component / forms / a11y / API patterns still apply at the architectural level. Adapt the styling and animation specifics to your tooling.

---

## 1. Project bootstrap (existing repo)

Verify before implementing:

```bash
node -v       # 18.17+ or 20 LTS
npm -v        # 9 or 10
ls next.config.{js,mjs,ts}  # confirms Next.js
cat tsconfig.json | grep '"strict"'  # expect "strict": true
```

Install + dev:

```bash
npm ci         # respect package-lock; do NOT use `npm install` for established repos
npm run dev    # localhost:3000
```

Production smoke before claiming any "ready" status:

```bash
npm run type-check    # tsc --noEmit
npm run lint
npm run build         # production build
npm start             # run prod server locally
```

---

## 2. Layout: `src/app/` App Router conventions

Kerkmeester's layout (`src/app/`):

```
app/
├── layout.tsx          # imports global vanilla-extract CSS + <Providers>
├── providers.tsx       # next-themes ThemeProvider + Sonner Toaster (CLIENT component)
├── page.tsx            # home page (Server Component by default)
└── admin/[[...tina]]/  # optional TinaCMS catch-all (dev only)
```

**Server vs Client Components:**

| Component | Default | Mark as `'use client'` when |
|---|---|---|
| `layout.tsx` | Server | Almost never — keep server-rendered for metadata |
| `providers.tsx` | **Client** (`'use client'`) | Always — wraps stateful providers (ThemeProvider, Toaster) |
| `page.tsx` (route) | Server | Add `'use client'` only when the entire page is interactive |
| `components/<X>.tsx` | Either | Default to Server; mark Client when it needs `useState`, `useEffect`, browser APIs, or interaction handlers |

**Rule of thumb:** Server Components are the default. `'use client'` is opt-in and creates a boundary — anything imported into a client component becomes part of the client bundle. Push interactivity to leaf components, not to layouts.

---

## 3. Styling — vanilla-extract (zero-runtime CSS-in-TS)

Setup is in `next.config.mjs`:

```js
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin();
export default withVanillaExtract({ /* next config */ });
```

Theme tokens live in `src/styles/vanilla/theme.css.ts`:

```typescript
import { createTheme, createThemeContract } from '@vanilla-extract/css';

export const vars = createThemeContract({
  colors: { primary: null, surface: null, text: null, /* ... */ },
  space: { sm: null, md: null, lg: null, /* ... */ },
  fontSize: { sm: null, base: null, lg: null, /* ... */ },
});

export const lightTheme = createTheme(vars, { /* light values */ });
export const darkTheme  = createTheme(vars, { /* dark values */ });
```

Component-level styling co-locates `.css.ts` next to `.tsx`:

```typescript
// button.css.ts
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/styles/vanilla/theme.css';

export const button = recipe({
  base: { display: 'inline-flex', padding: vars.space.md, color: vars.colors.text },
  variants: {
    intent: { primary: { background: vars.colors.primary }, secondary: { /* ... */ } },
    size: { sm: { fontSize: vars.fontSize.sm }, lg: { fontSize: vars.fontSize.lg } },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
});

// button.tsx
import { button } from './button.css';
export function Button({ intent, size, ...props }: ButtonProps) {
  return <button className={button({ intent, size })} {...props} />;
}
```

Utilities live in `src/styles/vanilla/utils.ts`:
- `cx(...args)` — class composition (analogous to `clsx`)
- `responsive(prop, breakpoints)` — responsive value helper
- `hover(styles)`, `focus(styles)` — pseudo-class helpers

For deeper patterns: `references/react/implementation/vanilla_extract_styling.md`.

---

## 4. Animation — motion v12 (the new motion library, NOT framer-motion)

Kerkmeester uses `motion` v12 (the rebranded continuation of framer-motion). Imports from `'motion'` not `'framer-motion'`:

```typescript
'use client';
import { motion } from 'motion/react';

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

For deeper patterns (page transitions, layout animations, scroll-driven, reduced-motion respect): `references/react/implementation/motion_animation.md`.

---

## 5. Forms — react-hook-form + zod + Server Actions

Kerkmeester's forms pattern: zod schema validates client-side AND on the server (Server Action or Go API). One schema, two validation points.

```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const ContactSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Min 10 chars'),
});
type ContactInput = z.infer<typeof ContactSchema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
  });

  async function onSubmit(data: ContactInput) {
    try {
      // Either: Server Action (same Next.js app)
      // Or: fetch('/api/contact', ...) → calls Go backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message ?? 'Failed');
      toast.success('Message sent');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      {/* ... email, message ... */}
      <button type="submit" disabled={isSubmitting}>Send</button>
    </form>
  );
}
```

For deeper patterns (Server Actions, multi-step forms, optimistic updates): `references/react/implementation/forms_validation.md`.

---

## 6. Components — Untitled UI (vendored)

Kerkmeester vendors Untitled UI components under `src/components/`. They're MIT-licensed; you own the source.

Import pattern:

```typescript
import { Button } from '@/components/button/button';
import { Input } from '@/components/input/input';
```

Untitled UI components are accessible by default (built on react-aria-components). For accessibility patterns and react-aria usage: `references/react/implementation/accessibility_aria.md`.

---

## 7. Theming — next-themes (dark mode)

`providers.tsx`:

```typescript
'use client';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
```

Toggling dark mode adds the `dark-mode` class on `<html>`. vanilla-extract `darkTheme` listens via the class selector. Use:

```typescript
'use client';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle</button>;
}
```

---

## 8. API integration — calling the Go backend

The kerkmeester-style frontend pairs with a Go backend (live branch at `references/go/`). The canonical contract is documented in `references/router/cross_stack_pairing.md`. Quick pattern:

```typescript
// src/lib/api.ts (server-safe; use in Server Components or Server Actions)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function apiCall<T>(
  path: string,
  init: RequestInit & { jwt?: string } = {}
): Promise<T> {
  const { jwt, ...rest } = init;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
      ...rest.headers,
    },
  });
  const body = await res.json();
  if (!res.ok) {
    // Error envelope: { error: { code, message, details? } }
    throw new APIError(body.error?.message ?? 'Request failed', body.error?.code, res.status);
  }
  return body as T;
}

export class APIError extends Error {
  constructor(message: string, public code?: string, public status?: number) { super(message); }
}
```

For deeper patterns (CORS, JWT refresh, SWR/React Query integration, optimistic updates): `references/react/implementation/api_integration.md`.

---

## 9. Server Actions — alternative to API calls

For tight form-to-DB coupling within the same Next.js app (no separate Go service), Server Actions are the modern path:

```typescript
// src/app/contact/actions.ts
'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ContactSchema = z.object({ /* same as client */ });

export async function submitContact(prev: unknown, formData: FormData) {
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: { code: 'VALIDATION', message: parsed.error.message } };
  }
  // ... persist to DB, send email, etc.
  revalidatePath('/contact');
  return { ok: true };
}
```

Use `useActionState` / `useFormState` to bind the action to the form. See `references/react/implementation/forms_validation.md` for the full pattern.

---

## 10. Phase 1 → 1.5 → 2 → 3 transition

When you've finished implementing:
1. Run `npm run type-check` — must be clean
2. Run `npm run lint` — must be clean
3. Run `npm run build` — must succeed
4. Open `assets/react/checklists/code_quality_checklist.md` (Phase 1.5 Code Quality Gate) and mark P0/P1 items
5. If anything fails → Phase 2 (debugging) — see `references/react/debugging/`
6. Once green → Phase 3 (verification) — `references/react/verification/verification_workflows.md`

Universal severity model: `references/universal/code_quality_standards.md`.

---

## See also

- `references/react/README.md` — branch overview
- `references/router/cross_stack_pairing.md` — React↔Go contract
- `references/universal/multi_agent_research.md` — Phase 0 research methodology (when starting a new project)
- Frontend reference source: `/Users/michelkerkmeester/MEGA/Development/Websites/kerkmeester.com/`
