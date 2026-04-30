---
title: Third-Party Performance Optimization
description: Deferral patterns for analytics, tag managers, and consent scripts to reduce main thread blocking.
---

# Third-Party Performance Optimization

Deferral patterns for analytics, tag managers, and consent scripts to reduce main thread blocking.

---

## 1. OVERVIEW

Third-party scripts (analytics, tag managers, consent) often block the main thread and degrade Core Web Vitals. This guide covers deferral patterns to minimize their performance impact while maintaining functionality.

### Key Strategies

- **requestIdleCallback** - Schedule non-critical work during browser idle time
- **Lazy loading** - Load scripts only when needed
- **LCP-aware loading** - Wait for largest contentful paint before loading

---

## 2. GOOGLE TAG MANAGER (GTM) DELAY

### Problem

GTM loads inline in head, blocking FCP by 200-400ms.

### Solution: requestIdleCallback with Fallback

```javascript
(function () {
  function loadGTM() {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-XXXXXXX');
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadGTM, { timeout: 3000 });
  } else {
    setTimeout(loadGTM, 2000); // Safari fallback
  }
})();
```

### Configuration Options

| Setting | Value | Reason |
|---------|-------|--------|
| requestIdleCallback timeout | 3000ms | Ensures GTM loads even under heavy load |
| setTimeout fallback | 2000ms | Safari doesn't support requestIdleCallback |

### Impact

- FCP improvement: 200-400ms
- Analytics still captures page views (slightly delayed)

---

## 3. ANALYTICS DEFERRAL

### When to Defer

- Page view tracking (can be delayed)
- Event tracking setup
- Marketing pixels

### When NOT to Defer

- E-commerce transaction tracking (must fire immediately)
- Critical conversion events
- Real-time personalization

### Pattern: Load After LCP

```javascript
// Wait for LCP, then load analytics
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  if (entries.length > 0) {
    loadAnalytics();
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

---

## 4. CONSENT SCRIPTS

### Performance Impact

Consent management platforms (OneTrust, Cookiebot, etc.) can add:
- 100-400KB JavaScript
- 200-500ms blocking time
- Additional network requests

### Optimization Strategies

1. **Lazy load consent UI** - Only load modal when needed
2. **Cache consent state** - Avoid re-checking on every page
3. **Minimize consent script** - Use lighter alternatives if possible

### Warning

Always verify GDPR/CCPA compliance before modifying consent scripts.

---

## 5. FONT LOADING (EXTERNAL)

### Preconnect for Font Origins

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### font-display Strategy

```css
@font-face {
  font-family: 'Custom Font';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
}
```

| Value | Behavior |
|-------|----------|
| swap | Show fallback immediately, swap when ready |
| fallback | Brief block, then fallback, swap if quick |
| optional | Brief block, may not swap at all |

---

## 6. PRIORITY MATRIX

| Script Type | Priority | Strategy |
|-------------|----------|----------|
| GTM | Low | requestIdleCallback |
| Analytics | Low | After LCP |
| Consent | Medium | Lazy load UI |
| Fonts | High | Preconnect + preload |
| Chat widgets | Low | Load on interaction |

---

## 7. RELATED RESOURCES

### Internal References

- [cwv_remediation.md](./cwv_remediation.md) - Core Web Vitals optimization patterns
- [resource_loading.md](./resource_loading.md) - Resource hints and loading strategies
- [../implementation/async_patterns.md](../implementation/async_patterns.md) - requestIdleCallback patterns

### External Documentation

- [web.dev/third-party-javascript](https://web.dev/third-party-javascript/) - Third-party script best practices
