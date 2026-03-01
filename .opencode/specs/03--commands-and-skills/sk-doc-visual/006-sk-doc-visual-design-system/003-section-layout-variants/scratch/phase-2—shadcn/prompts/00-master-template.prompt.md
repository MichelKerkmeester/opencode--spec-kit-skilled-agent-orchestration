# Shadcn Zinc Master Template — CSS Variable Vocabulary & Component Recipes

> **Purpose:** This file is NOT a standalone prompt. It is injected as CONTEXT before each section prompt.
> It provides the complete Shadcn Zinc (light theme) design system vocabulary translated to plain CSS custom properties,
> CSS-only component recipes, base styles, and the HTML boilerplate skeleton.
>
> **Design System Source:** Shadcn UI — Zinc theme (light mode)
> **Fonts:** Geist Sans (body/display) + Geist Mono (code) — system-ui fallback, no CDN link
> **Theme:** Light-only (`color-scheme: light`), white backgrounds, near-black text, minimal ring-based elevation
> **Aesthetic:** Restrained, typographic, whitespace-driven — NO skeumorphic details, NO decorative SVG patterns

---

## A) Full CSS `:root` Variable Vocabulary

```css
:root {
  /* ================================================================
     SHADCN UI — ZINC LIGHT THEME TOKEN VOCABULARY
     Extracted from shadcn/apps/v4/public/r/themes.css (.theme-zinc block).
     Values are bare HSL triplets — apply via hsl(var(--token)) wrapper.
     All section variants MUST use hsl(var(--token)) references — never raw hex/rgb.
     For opacity tints: hsl(var(--token) / 0.1) — NOT rgba().
     ================================================================ */

  /* ------------------------------------------------------------------
     SEMANTIC COLORS — bare HSL triplets
     Usage: color: hsl(var(--foreground));
     With opacity: background: hsl(var(--foreground) / 0.1);
     ------------------------------------------------------------------ */
  --background: 0 0% 100%;              /* White */
  --foreground: 240 10% 3.9%;           /* Near black */

  --card: 0 0% 100%;                    /* White */
  --card-foreground: 240 10% 3.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;

  --primary: 240 5.9% 10%;              /* Dark primary (near-black) */
  --primary-foreground: 0 0% 98%;       /* Off-white */

  --secondary: 240 4.8% 95.9%;          /* Light gray */
  --secondary-foreground: 240 5.9% 10%;

  --muted: 240 4.8% 95.9%;             /* Light gray (same as secondary) */
  --muted-foreground: 240 3.8% 46.1%;   /* Medium gray */

  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;

  --destructive: 0 84.2% 60.2%;         /* Red */
  --destructive-foreground: 0 0% 98%;

  --border: 240 5.9% 90%;               /* Light gray border */
  --input: 240 5.9% 90%;                /* Same as border */
  --ring: 240 5.9% 10%;                 /* Dark ring (matches --primary) */

  /* ------------------------------------------------------------------
     STATUS COLORS (semantic additions — not in base Shadcn)
     Used for badges, alerts, and status indicators.
     ------------------------------------------------------------------ */
  --success: 142 76% 36%;
  --success-foreground: 0 0% 98%;
  --success-muted: 142 76% 96%;

  --warning: 38 92% 50%;
  --warning-foreground: 0 0% 9%;
  --warning-muted: 48 96% 95%;

  --info: 221 83% 53%;
  --info-foreground: 0 0% 98%;
  --info-muted: 214 95% 96%;

  /* ------------------------------------------------------------------
     CHART COLORS (for data visualization)
     ------------------------------------------------------------------ */
  --chart-1: 220 70% 50%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;

  /* ------------------------------------------------------------------
     BORDER RADIUS — calc-based from --radius base
     CRITICAL: All radii derive from --radius (0.5rem = 8px).
     Use var(--radius-*) — never hardcoded px values.
     ------------------------------------------------------------------ */
  --radius: 0.5rem;                         /* 8px base */
  --radius-sm: calc(var(--radius) - 4px);   /* 4px */
  --radius-md: calc(var(--radius) - 2px);   /* 6px */
  --radius-lg: var(--radius);               /* 8px */
  --radius-xl: calc(var(--radius) + 4px);   /* 12px */
  --radius-2xl: calc(var(--radius) + 8px);  /* 16px */
  --radius-3xl: calc(var(--radius) + 12px); /* 20px */
  --radius-4xl: calc(var(--radius) + 16px); /* 24px */
  --radius-full: 9999px;

  /* ------------------------------------------------------------------
     TYPOGRAPHY
     Geist Sans for body/display, Geist Mono for code.
     NO Google Fonts CDN link — use system-ui fallback chain.
     ------------------------------------------------------------------ */
  --font-sans: 'Geist Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;

  /* Font sizes (9 stops: 12px → 48px) */
  --text-xs: 0.75rem;        /* 12px */
  --text-sm: 0.875rem;       /* 14px */
  --text-base: 1rem;         /* 16px */
  --text-lg: 1.125rem;       /* 18px */
  --text-xl: 1.25rem;        /* 20px */
  --text-2xl: 1.5rem;        /* 24px */
  --text-3xl: 1.875rem;      /* 30px */
  --text-4xl: 2.25rem;       /* 36px */
  --text-5xl: 3rem;          /* 48px */

  /* Line heights (5 stops) */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Font weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Letter spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;

  /* ------------------------------------------------------------------
     SPACING (0.25rem / 4px increments)
     ------------------------------------------------------------------ */
  --space-0: 0;
  --space-0-5: 0.125rem;    /* 2px */
  --space-1: 0.25rem;       /* 4px */
  --space-1-5: 0.375rem;    /* 6px */
  --space-2: 0.5rem;        /* 8px */
  --space-2-5: 0.625rem;    /* 10px */
  --space-3: 0.75rem;       /* 12px */
  --space-3-5: 0.875rem;    /* 14px */
  --space-4: 1rem;          /* 16px */
  --space-5: 1.25rem;       /* 20px */
  --space-6: 1.5rem;        /* 24px */
  --space-8: 2rem;          /* 32px */
  --space-10: 2.5rem;       /* 40px */
  --space-12: 3rem;         /* 48px */
  --space-16: 4rem;         /* 64px */
  --space-20: 5rem;         /* 80px */
  --space-24: 6rem;         /* 96px */
  --space-32: 8rem;         /* 128px */
  --space-40: 10rem;        /* 160px */

  /* ------------------------------------------------------------------
     SHADOWS (minimal — ring-based elevation is preferred)
     Use ring-1 pattern as PRIMARY elevation. Shadows are secondary.
     ------------------------------------------------------------------ */
  --shadow-xs: 0 1px 2px 0 hsl(var(--foreground) / 0.05);
  --shadow-sm: 0 1px 3px 0 hsl(var(--foreground) / 0.1), 0 1px 2px -1px hsl(var(--foreground) / 0.1);
  --shadow-md: 0 4px 6px -1px hsl(var(--foreground) / 0.1), 0 2px 4px -2px hsl(var(--foreground) / 0.06);
  --shadow-lg: 0 10px 15px -3px hsl(var(--foreground) / 0.1), 0 4px 6px -4px hsl(var(--foreground) / 0.1);
  --shadow-xl: 0 20px 25px -5px hsl(var(--foreground) / 0.1), 0 8px 10px -6px hsl(var(--foreground) / 0.1);
  --shadow-2xl: 0 25px 50px -12px hsl(var(--foreground) / 0.25);

  /* ------------------------------------------------------------------
     FOCUS — multi-layer ring pattern
     border-ring + ring-3 + ring/50 (NOT box-shadow focus rings)
     ------------------------------------------------------------------ */
  --focus-ring: 0 0 0 3px hsl(var(--ring) / 0.5);

  /* ------------------------------------------------------------------
     TRANSITIONS
     ------------------------------------------------------------------ */
  --transition-fast: 100ms linear;
  --transition-normal: 150ms ease;
  --transition-slow: 200ms ease-out;

  /* ------------------------------------------------------------------
     CONTAINER
     ------------------------------------------------------------------ */
  --container-max: 1280px;
  --container-padding: var(--space-8);
}
```

---

## B) CSS-Only Component Recipes

### 1. Button (6 variants — NO `::before` pseudo-elements)

```css
/* Button — clean, borderless by default. NO skeumorphic inner borders.
   Uses border-transparent + bg color. Ring-based focus. */
/* Usage: <button class="btn btn--default btn--md">Label</button> */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1-5);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  text-decoration: none;
  background-clip: padding-box;
  transition: background var(--transition-fast), color var(--transition-fast);
}

/* NO ::before pseudo-element — this is NOT UntitledUI */

/* Focus — ring-based (border-ring + ring-3 + ring/50) */
.btn:focus-visible {
  border-color: hsl(var(--ring));
  box-shadow: var(--focus-ring);
  outline: none;
}

/* Size variants */
.btn--sm {
  height: 2rem;       /* 32px / h-8 */
  padding: 0 var(--space-2-5);
  font-size: var(--text-sm);
  border-radius: calc(min(var(--radius-md), 10px));
}
.btn--md {
  height: 2.25rem;    /* 36px / h-9 */
  padding: 0 var(--space-2-5);
  font-size: var(--text-sm);
}
.btn--lg {
  height: 2.5rem;     /* 40px / h-10 */
  padding: 0 var(--space-2-5);
  font-size: var(--text-sm);
}

/* Variant: default (dark primary bg, white text) */
.btn--default {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
.btn--default:hover {
  background: hsl(var(--primary) / 0.8);
}

/* Variant: outline (border + white bg) */
.btn--outline {
  border-color: hsl(var(--border));
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  box-shadow: var(--shadow-xs);
}
.btn--outline:hover {
  background: hsl(var(--muted));
}

/* Variant: secondary (muted bg) */
.btn--secondary {
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}
.btn--secondary:hover {
  background: hsl(var(--secondary) / 0.8);
}

/* Variant: ghost (transparent bg) */
.btn--ghost {
  background: transparent;
  color: hsl(var(--foreground));
}
.btn--ghost:hover {
  background: hsl(var(--muted));
}

/* Variant: destructive (red tint bg) */
.btn--destructive {
  background: hsl(var(--destructive) / 0.1);
  color: hsl(var(--destructive));
}
.btn--destructive:hover {
  background: hsl(var(--destructive) / 0.2);
}

/* Variant: link (text-only, underline on hover) */
.btn--link {
  background: transparent;
  color: hsl(var(--primary));
  text-decoration-line: none;
  text-underline-offset: 4px;
}
.btn--link:hover {
  text-decoration-line: underline;
}
```

### 2. Card (ring-1 elevation — NOT box-shadow primary)

```css
/* Card — elevated container using ring-1 as PRIMARY elevation.
   box-shadow is secondary/minimal. ring-1 with foreground/10 opacity. */
/* Usage: <div class="card"><div class="card__header">...</div><div class="card__content">...</div></div> */

.card {
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border-radius: var(--radius-xl);
  box-shadow: 0 0 0 1px hsl(var(--foreground) / 0.1), var(--shadow-xs);
  padding: var(--space-6);
  overflow: hidden;
  font-size: var(--text-sm);
}

.card__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-6);
}

.card__title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
}

.card__description {
  font-size: var(--text-sm);
  color: hsl(var(--muted-foreground));
}

.card__content {
  /* Content area — no extra padding when inside .card */
}

.card__footer {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid hsl(var(--border));
}

/* Card size: small */
.card--sm {
  padding: var(--space-4);
  gap: var(--space-4);
}
.card--sm .card__header { margin-bottom: var(--space-4); }
.card--sm .card__footer { margin-top: var(--space-4); padding-top: var(--space-4); }
```

### 3. Badge (border-transparent, opacity-based variants)

```css
/* Badge — small status/category indicator. border-transparent by default.
   Opacity-based color variants using hsl(var(--token) / opacity). */
/* Usage: <span class="badge badge--default">Label</span> */

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  height: 1.25rem;           /* 20px / h-5 */
  padding: 0.125rem var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  white-space: nowrap;
  transition: all var(--transition-normal);
}

/* Variant: default (dark bg, white text) */
.badge--default {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* Variant: secondary (muted bg) */
.badge--secondary {
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

/* Variant: outline (border visible) */
.badge--outline {
  border-color: hsl(var(--border));
  color: hsl(var(--foreground));
  background: transparent;
}

/* Variant: destructive (red tint) */
.badge--destructive {
  background: hsl(var(--destructive) / 0.1);
  color: hsl(var(--destructive));
}

/* Status badges — using semantic status tokens */
.badge--success {
  background: hsl(var(--success-muted));
  color: hsl(var(--success));
}
.badge--warning {
  background: hsl(var(--warning-muted));
  color: hsl(var(--warning-foreground));
}
.badge--info {
  background: hsl(var(--info-muted));
  color: hsl(var(--info));
}

/* Badge dot indicator */
.badge__dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: currentColor;
  flex-shrink: 0;
}
```

### 4. Input (border-input, h-8, ring-3 focus)

```css
/* Input — text input field with ring-3 focus pattern. */
/* Usage: <input class="input" type="text" placeholder="Search..."> */

.input {
  display: flex;
  height: 2rem;               /* 32px / h-8 */
  width: 100%;
  padding: var(--space-1-5) var(--space-3);
  border: 1px solid hsl(var(--input));
  border-radius: var(--radius-md);
  background: transparent;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: hsl(var(--foreground));
  box-shadow: var(--shadow-xs);
  transition: color var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.input::placeholder {
  color: hsl(var(--muted-foreground));
}

.input:focus-visible {
  border-color: hsl(var(--ring));
  box-shadow: var(--focus-ring);
  outline: none;
}

/* Input with icon addon */
.input-group {
  position: relative;
  display: flex;
  align-items: center;
}
.input-group .input {
  padding-left: var(--space-8);
}
.input-group__icon {
  position: absolute;
  left: var(--space-2-5);
  color: hsl(var(--muted-foreground));
  pointer-events: none;
}
.input-group__icon svg {
  width: 16px;
  height: 16px;
}
```

### 5. Table (border-b rows, hover:bg-muted/50, sticky headers)

```css
/* Table — clean rows with bottom borders, muted hover, sticky header. */
/* Usage: <div class="table-wrapper"><table class="table">...</table></div> */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
  text-align: left;
}

.table thead tr {
  border-bottom: 1px solid hsl(var(--border));
}

.table th {
  height: 2.5rem;
  padding: 0 var(--space-2);
  color: hsl(var(--muted-foreground));
  font-weight: var(--font-medium);
  white-space: nowrap;
  position: sticky;
  top: 0;
  background: hsl(var(--background));
  z-index: 1;
}

.table td {
  padding: var(--space-2);
  vertical-align: middle;
}

.table tbody tr {
  border-bottom: 1px solid hsl(var(--border));
  transition: background var(--transition-fast);
}

.table tbody tr:hover {
  background: hsl(var(--muted) / 0.5);
}

.table tbody tr:last-child {
  border-bottom: none;
}
```

### 6. Accordion (details/summary, border-b between items, chevron rotation)

```css
/* Accordion — CSS-only using <details>/<summary>. Border-b between items.
   Chevron icon rotates 0.2s ease-out when open. */
/* Usage: <div class="accordion"><details class="accordion__item"><summary class="accordion__trigger">...</summary><div class="accordion__content">...</div></details></div> */

.accordion__item {
  border-bottom: 1px solid hsl(var(--border));
}
.accordion__item:last-child {
  border-bottom: none;
}

.accordion__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-4) 0;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  text-align: left;
  cursor: pointer;
  list-style: none;
  color: hsl(var(--foreground));
}
.accordion__trigger::-webkit-details-marker { display: none; }

.accordion__trigger:hover {
  text-decoration: underline;
}

/* Chevron icon */
.accordion__trigger .chevron {
  width: 16px;
  height: 16px;
  color: hsl(var(--muted-foreground));
  transition: transform 0.2s ease-out;
  flex-shrink: 0;
}

details[open] > .accordion__trigger .chevron {
  transform: rotate(180deg);
}

.accordion__content {
  padding-bottom: var(--space-4);
  font-size: var(--text-sm);
  color: hsl(var(--muted-foreground));
}
```

### 7. Alert (rounded-lg border, bg-card, destructive variant)

```css
/* Alert — notification banner with icon, title, description.
   Rounded-lg border, bg-card background. */
/* Usage: <div class="alert alert--default"><svg>...</svg><div><div class="alert__title">...</div><div class="alert__description">...</div></div></div> */

.alert {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-0-5) var(--space-2-5);
  padding: var(--space-3) var(--space-4);
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-lg);
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  font-size: var(--text-sm);
  text-align: left;
}

.alert svg {
  width: 16px;
  height: 16px;
  color: currentColor;
  grid-row: span 2;
  margin-top: 2px;
}

.alert__title {
  font-weight: var(--font-medium);
  grid-column: 2;
}

.alert__description {
  font-size: var(--text-sm);
  color: hsl(var(--muted-foreground));
  grid-column: 2;
}

/* Destructive variant */
.alert--destructive {
  color: hsl(var(--destructive));
}
.alert--destructive .alert__description {
  color: hsl(var(--destructive) / 0.9);
}
```

### 8. Separator (1px border line)

```css
/* Separator — thin horizontal or vertical divider. */
/* Usage: <hr class="separator"> or <div class="separator"></div> */

.separator {
  border: none;
  background: hsl(var(--border));
  flex-shrink: 0;
}
.separator--horizontal {
  height: 1px;
  width: 100%;
  margin: var(--space-4) 0;
}
.separator--vertical {
  width: 1px;
  height: 100%;
  margin: 0 var(--space-4);
}
```

### 9. Code Block (dark fg-color bg, monospace, radius-xl)

```css
/* Code Block — dark background using foreground color, monospace font, radius-xl. */
/* Usage: <pre class="code-block"><code>...</code></pre> */

.code-block {
  background: hsl(var(--foreground));
  color: hsl(var(--background));
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  overflow-x: auto;
}

/* Inline code */
.code-inline {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: hsl(var(--muted));
  color: hsl(var(--foreground));
  padding: 2px var(--space-1-5);
  border-radius: var(--radius-sm);
}
```

### 10. Kbd (keyboard shortcut indicator)

```css
/* Kbd — keyboard shortcut indicator with border + muted bg. */
/* Usage: <kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">K</kbd> */

.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.25rem;
  padding: 0 var(--space-1);
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-sm);
  background: hsl(var(--muted));
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: hsl(var(--muted-foreground));
  box-shadow: 0 1px 0 hsl(var(--foreground) / 0.07);
}
```

---

## C) Base Styles

```css
/* Box-sizing reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Smooth rendering */
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: hsl(var(--foreground));
  background: hsl(var(--background));
}

/* Container */
.page-container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* Accessibility: reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* SVG icon defaults */
svg {
  display: block;
  flex-shrink: 0;
}

/* Focus visible — ring-based */
:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* Link reset */
a {
  color: hsl(var(--primary));
  text-decoration: underline;
  text-underline-offset: 4px;
}
a:hover {
  color: hsl(var(--foreground));
}

/* Details/Summary (CSS-only interactivity) */
details summary {
  cursor: pointer;
  list-style: none;
}
details summary::-webkit-details-marker {
  display: none;
}
```

---

## D) HTML Boilerplate Skeleton

Every variant MUST use this exact skeleton structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>{{Section}} — Shadcn Zinc Variant {{N}}</title>
  <!-- No Google Fonts link — Geist Sans via system-ui fallback -->
  <style>
    :root {
      /* PASTE: Full token vocabulary from Section A */
    }

    /* PASTE: Base styles from Section C */

    /* PASTE: Relevant component recipes from Section B */

    /* Section-specific layout styles */
  </style>
</head>
<body>
  <div class="page-container">
    <section>
      <!-- Section content here -->
    </section>
  </div>
</body>
</html>
```

---

## E) Self-Validation Checklist (Shadcn Zinc Light)

Before outputting any variant, verify EVERY item passes:

### REQUIRED (must be present):

- [ ] Colors use `hsl(var(--token))` pattern — NEVER raw hex/rgb outside `:root`
- [ ] Opacity tints use `hsl(var(--token) / 0.1)` — NEVER rgba()
- [ ] Elevation uses `0 0 0 1px hsl(var(--foreground) / 0.1)` ring pattern as primary
- [ ] Border radius uses `var(--radius-*)` with calc pattern from `--radius` base
- [ ] Spacing uses `var(--space-*)` tokens
- [ ] Typography uses `var(--font-sans)` containing `Geist Sans`
- [ ] Code blocks use `var(--font-mono)` containing `Geist Mono`
- [ ] `<meta name="color-scheme" content="light">` present (NOT "light dark")
- [ ] `@media (prefers-reduced-motion: reduce)` query present
- [ ] Semantic HTML elements used (`<section>`, `<article>`, `<nav>`, `<header>`, `<details>`)
- [ ] `<!DOCTYPE html>` declaration present
- [ ] Title follows pattern: `{{Section}} — Shadcn Zinc Variant {{N}}`
- [ ] Body/section background resolves to white (`hsl(var(--background))`)
- [ ] Primary text color is near-black (`hsl(var(--foreground))`)
- [ ] 600–900 lines per variant
- [ ] Inline SVG icons use: `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.5"` or `"2"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"`

### FORBIDDEN (must NOT be present):

- [ ] No Tailwind utility classes (`class="bg-white p-4 rounded-lg"`)
- [ ] No React/JSX syntax (`className=`, `onClick=`, `{variable}`)
- [ ] No JavaScript (`<script>`, `addEventListener`, `setInterval`, `requestAnimationFrame`)
- [ ] No external icon CDN libraries (FontAwesome, Material Icons, Heroicons CDN)
- [ ] No raw hex/rgb values outside the `:root` block
- [ ] No skeumorphic `::before` inner borders on buttons (UntitledUI pattern — NOT Shadcn)
- [ ] No `--bg-brand-*`, `--text-brand-*`, `--fg-brand-*` tokens (UntitledUI naming)
- [ ] No `--shadow-skeumorphic` or `--shadow-skeumorphic-inner` tokens
- [ ] No Background Grid Pattern SVG (UntitledUI decoration — NOT Shadcn)
- [ ] No `content="light dark"` — must be `content="light"` only
- [ ] No Google Fonts `<link>` tag — Geist uses system-ui fallback
- [ ] No dark primary background on body/section
- [ ] No neon glows, particle effects, parallax, 3D transforms
- [ ] No box-shadow as the ONLY elevation method — ring-1 must be present
