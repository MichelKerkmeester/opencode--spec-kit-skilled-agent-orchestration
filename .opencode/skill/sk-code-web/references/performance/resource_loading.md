---
title: Resource Loading Patterns
description: Resource hints and loading strategies for optimal performance in Webflow sites.
---

# Resource Loading Patterns

Resource hints and loading strategies for optimal performance in Webflow sites.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Resource loading optimization uses browser hints to prioritize critical resources and defer non-essential ones. This improves Core Web Vitals, particularly LCP (Largest Contentful Paint) and FID (First Input Delay).

### Key Strategies

- **Preconnect** - Establish early connections to external origins
- **DNS Prefetch** - Resolve DNS for lower-priority origins
- **Preload** - Prioritize critical resources for current page
- **Prefetch** - Download resources for future navigation
- **Async Loading** - Non-blocking resource loading patterns

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:preconnect -->
## 2. PRECONNECT

### What It Does

Establishes early connection (DNS lookup + TCP handshake + TLS negotiation) to external origins before the browser discovers them naturally.

**Performance Impact:** Saves 100-500ms per origin on first request.

### Syntax

```html
<link rel="preconnect" href="https://example.com" crossorigin>
```

### When to Use `crossorigin`

| Scenario | crossorigin Required |
|----------|---------------------|
| Fonts (any origin) | Yes |
| Fetch/XHR requests | Yes |
| CORS resources | Yes |
| Scripts (same origin) | No |
| Stylesheets (same origin) | No |
| Images (same origin) | No |

**Rule:** When in doubt, include `crossorigin`. It's safer to over-specify.

### Common Origins to Preconnect

| Origin | Purpose |
|--------|---------|
| `use.typekit.net` | Adobe Fonts |
| `p.typekit.net` | Adobe Fonts CDN |
| `fonts.googleapis.com` | Google Fonts |
| `cdn.jsdelivr.net` | CDN resources |
| `d3e54v103j8qbb.cloudfront.net` | jQuery CDN (Webflow) |
| `cdn.prod.website-files.com` | Webflow assets |
| `unpkg.com` | npm CDN |

### Implementation Example (example.com)

From `global.html`:

```html
<!-- Preconnect -->
<link rel="preconnect" href="https://example-cdn.b-cdn.net" crossorigin>
<link rel="preconnect" href="https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev" crossorigin>
<link rel="preconnect" href="https://cdn.prod.website-files.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preconnect" href="https://p.typekit.net" crossorigin>
<link rel="preconnect" href="https://d3e54v103j8qbb.cloudfront.net" crossorigin>
```

---

<!-- /ANCHOR:preconnect -->
<!-- ANCHOR:dns-prefetch -->
## 3. DNS PREFETCH

### What It Does

Performs DNS lookup only (no TCP/TLS). Lower priority than preconnect, used for resources that may be needed later.

### Syntax

```html
<link rel="dns-prefetch" href="https://example.com">
```

### When to Use

- Lower-priority external origins
- Resources that might be needed (conditional)
- Fallback for browsers without preconnect support

### Implementation Example

```html
<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://assets-global.website-files.com">
<link rel="dns-prefetch" href="https://unpkg.com">
```

---

<!-- /ANCHOR:dns-prefetch -->
<!-- ANCHOR:preload -->
## 4. PRELOAD

### What It Does

Downloads high-priority resources for the current page with elevated priority. Browser fetches immediately regardless of discovery order.

### Syntax

```html
<link rel="preload" href="critical.js" as="script">
<link rel="preload" href="hero.webp" as="image">
```

### `as=` Attribute Values

| Value | Resource Type | crossorigin |
|-------|--------------|-------------|
| `script` | JavaScript files | If CORS |
| `style` | CSS stylesheets | If CORS |
| `image` | Images | If CORS |
| `font` | Web fonts | Always |
| `fetch` | Fetch/XHR data | Always |
| `document` | HTML documents | No |
| `audio` | Audio files | If CORS |
| `video` | Video files | If CORS |

**Important:** The `as` attribute is required. Without it, the browser downloads the resource twice.

### Implementation Examples

**Fonts (always need crossorigin):**
```html
<link rel="preload"
  href="https://cdn.prod.website-files.com/.../silka-regular-webfont.woff2"
  as="font" type="font/woff2" crossorigin>
<link rel="preload"
  href="https://cdn.prod.website-files.com/.../silka-semibold-webfont.woff2"
  as="font" type="font/woff2" crossorigin>
```

**Third-party Libraries:**
```html
<link rel="preload" href="https://unpkg.com/lenis@{version}/dist/lenis.css" as="style">
<link rel="preload" href="https://cdn.jsdelivr.net/npm/motion@{version}/+esm" as="script" crossorigin>
```

**Custom Scripts:**
```html
<link rel="preload" href="https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/dropdown.js?v={version}" as="script">
<link rel="preload" href="https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/mobile_menu.js?v={version}" as="script">
```

---

<!-- /ANCHOR:preload -->
<!-- ANCHOR:prefetch -->
## 5. PREFETCH

### What It Does

Downloads resources for future navigation during idle time. Lower priority than preload.

### Syntax

```html
<link rel="prefetch" href="/next-page.html">
<link rel="prefetch" href="/images/gallery-2.webp">
```

### Use Cases

- Below-fold resources
- Likely next page navigation
- Non-critical assets for current page
- Resources for predicted user actions

### Example

```html
<!-- Prefetch likely next pages -->
<link rel="prefetch" href="/about">
<link rel="prefetch" href="/contact">

<!-- Prefetch below-fold images -->
<link rel="prefetch" href="/images/team-photo.webp">
```

---

<!-- /ANCHOR:prefetch -->
<!-- ANCHOR:async-css-loading-pattern -->
## 6. ASYNC CSS LOADING PATTERN

### The Pattern

This pattern loads CSS without blocking render, with a fallback for no-JS:

```html
<link rel="preload" href="style.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="style.css"></noscript>
```

### How It Works

1. `rel="preload"` downloads CSS without applying it
2. `as="style"` tells browser it's a stylesheet (proper priority)
3. `onload="this.rel='stylesheet'"` applies CSS when loaded
4. `<noscript>` fallback for JavaScript-disabled browsers

### Implementation Example (example.com)

From `home.html`:

```html
<!-- Swiper CSS (async - below fold) -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"></noscript>
```

### When to Use

| Use Case | Example |
|----------|---------|
| Below-fold CSS | Carousel styles, footer styles |
| Non-critical stylesheets | Animation libraries |
| Third-party CSS | Swiper, Slick, etc. |
| Page-specific CSS | Styles only needed on some pages |

### When NOT to Use

- Critical above-fold styles (causes FOUC)
- Layout-affecting CSS
- Font-face declarations

---

<!-- /ANCHOR:async-css-loading-pattern -->
<!-- ANCHOR:script-loading -->
## 7. SCRIPT LOADING

### defer vs async vs dynamic

| Attribute | Download | Execute | Execution Order |
|-----------|----------|---------|-----------------|
| (none) | Blocking | Immediate | In document order |
| `async` | Parallel | When ready | Any order |
| `defer` | Parallel | After DOM ready | In document order |
| dynamic | Parallel | When ready | Any order |

### Visual Timeline

```
Without attribute (blocking):
HTML: ----[PAUSE]----[PAUSE]----
JS:        [download][execute]

With async:
HTML: ----------------[PAUSE]---
JS:   [download]      [execute]

With defer:
HTML: -------------------------[execute]
JS:   [download]               ^DOM ready
```

### When to Use Each

| Strategy | Use For |
|----------|---------|
| No attribute | Inline scripts, critical blocking scripts |
| `async` | Independent scripts (analytics, ads) |
| `defer` | Scripts that need DOM, order-dependent scripts |
| Dynamic | Conditional loading, lazy loading |

### Implementation Example

```html
<!-- defer: needs DOM, order matters -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>
```

### Dynamic Script Loading

```javascript
function loadScript(src, options = {}) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = options.async ?? true;

    if (options.type) script.type = options.type;
    if (options.crossorigin) script.crossOrigin = 'anonymous';

    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });
}

// Usage
loadScript('https://example.com/analytics.js')
  .then(() => console.log('Analytics loaded'))
  .catch(() => console.warn('Analytics failed to load'));
```

---

<!-- /ANCHOR:script-loading -->
<!-- ANCHOR:noscript-fallbacks -->
## 8. NOSCRIPT FALLBACKS

Always provide fallbacks for JavaScript-dependent loading:

```html
<!-- Async CSS with fallback -->
<link rel="preload" href="style.css" as="style" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="style.css"></noscript>

<!-- Lazy-loaded images with fallback -->
<img data-src="image.webp" class="lazyload" alt="Description">
<noscript><img src="image.webp" alt="Description"></noscript>
```

---

<!-- /ANCHOR:noscript-fallbacks -->
<!-- ANCHOR:decision-matrix -->
## 9. DECISION MATRIX

| Resource Type | Strategy | Reason |
|---------------|----------|--------|
| Critical CSS | Inline or `<link>` in `<head>` | Blocks render (intentionally) |
| Below-fold CSS | Async pattern | Non-blocking, no FOUC |
| Critical JS | Preload + defer | High priority + non-blocking |
| DOM-dependent JS | defer | Executes after DOM ready |
| Independent JS | async | Executes when ready |
| Analytics/Ads | requestIdleCallback + async | Non-critical |
| Fonts | Preconnect + preload | Prevents FOUT |
| Hero images | Preload | LCP optimization |
| Below-fold images | Native lazy loading | Saves bandwidth |
| Third-party origins | Preconnect | Saves connection time |

---

<!-- /ANCHOR:decision-matrix -->
<!-- ANCHOR:anti-patterns -->
## 10. ANTI-PATTERNS

### Over-Preloading

**Bad:** Preloading everything defeats the purpose.

```html
<!-- DON'T: Too many preloads compete for bandwidth -->
<link rel="preload" href="script1.js" as="script">
<link rel="preload" href="script2.js" as="script">
<link rel="preload" href="script3.js" as="script">
<link rel="preload" href="style1.css" as="style">
<link rel="preload" href="style2.css" as="style">
```

**Good:** Preload only critical resources (max 3-5).

### Missing `as` Attribute

**Bad:** Browser downloads twice.
```html
<link rel="preload" href="font.woff2">
```

**Good:** Always include `as`.
```html
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

### Preconnecting to Own Domain

**Bad:** Unnecessary - already connected.
```html
<link rel="preconnect" href="https://yourdomain.com">
```

**Good:** Only preconnect to external origins.

---

<!-- /ANCHOR:anti-patterns -->
<!-- ANCHOR:testing-resource-loading -->
## 11. TESTING RESOURCE LOADING

### Chrome DevTools

1. Open DevTools > Network tab
2. Check "Disable cache"
3. Reload page
4. Look for:
   - Initiator column shows "preload" for preloaded resources
   - Priority column shows resource priority
   - Waterfall shows connection timing

### Lighthouse Audit

Run Lighthouse and check:
- "Preconnect to required origins"
- "Preload key requests"
- "Eliminate render-blocking resources"

### WebPageTest

Use waterfall view to verify:
- Preconnect happens early (before resource discovery)
- Preloaded resources load in parallel
- Async CSS doesn't block render

---

<!-- /ANCHOR:testing-resource-loading -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

### Internal References

- [cwv_remediation.md](./cwv_remediation.md) - Core Web Vitals optimization patterns
- [third_party.md](./third_party.md) - Third-party script optimization
- [webflow_constraints.md](./webflow_constraints.md) - Platform limitations

### External Documentation

- [web.dev/preconnect-and-dns-prefetch](https://web.dev/preconnect-and-dns-prefetch/) - Resource hints guide
- [web.dev/preload-critical-assets](https://web.dev/preload-critical-assets/) - Preload best practices
<!-- /ANCHOR:related-resources -->
