---
title: Performance Verification Checklist
description: Before/after verification protocol for performance optimization work using PageSpeed Insights.
---

# Performance Verification Checklist

Before/after verification protocol for performance optimization work using PageSpeed Insights.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Performance optimization requires measurable verification. This checklist ensures consistent baseline capture, incremental testing, and post-implementation comparison to validate improvements and catch regressions.

### Key Metrics

| Metric | Target (Mobile) | Target (Desktop) |
|--------|-----------------|------------------|
| LCP | <2.5s | <2.5s |
| FCP | <1.8s | <1.8s |
| TBT | <200ms | <200ms |
| CLS | <0.1 | <0.1 |
| Speed Index | <3.4s | <3.4s |
| Score | 90+ | 90+ |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:pre-implementation-baseline -->
## 2. PRE-IMPLEMENTATION BASELINE

### PageSpeed Insights Capture

- [ ] Run Mobile test
- [ ] Run Desktop test
- [ ] Screenshot results
- [ ] Record metrics in table below

### Baseline Metrics Table

| Metric | Mobile | Desktop | Target |
|--------|--------|---------|--------|
| LCP | ___s | ___s | <2.5s / <2.5s |
| FCP | ___s | ___s | <1.8s / <1.8s |
| TBT | ___ms | ___ms | <200ms |
| CLS | ___ | ___ | <0.1 |
| Speed Index | ___s | ___s | <3.4s |
| Score | ___/100 | ___/100 | 90+ |

### Additional Baseline Data

- [ ] Main thread work: ___s
- [ ] Script evaluation: ___ms
- [ ] Unused JavaScript: ___KB
- [ ] Largest Contentful Paint element identified

---

<!-- /ANCHOR:pre-implementation-baseline -->
<!-- ANCHOR:during-implementation -->
## 3. DURING IMPLEMENTATION

### Incremental Testing

- [ ] Test after each major change
- [ ] Verify no console errors
- [ ] Check functionality still works
- [ ] Note any regressions immediately

### Console Monitoring

Expected messages:
- `[LCP Safety] Force-revealed page after timeout` (if timeout triggers)
- GTM loaded (in Network tab, delayed)

---

<!-- /ANCHOR:during-implementation -->
<!-- ANCHOR:post-implementation-verification -->
## 4. POST-IMPLEMENTATION VERIFICATION

### PageSpeed Re-run

- [ ] Run Mobile test (same conditions)
- [ ] Run Desktop test (same conditions)
- [ ] Compare with baseline

### Results Table

| Metric | Before | After | Change | Target Met? |
|--------|--------|-------|--------|-------------|
| LCP | ___s | ___s | __% | [ ] |
| FCP | ___s | ___s | __% | [ ] |
| TBT | ___ms | ___ms | __% | [ ] |
| CLS | ___ | ___ | __% | [ ] |
| Score | ___/100 | ___/100 | +__ | [ ] |

---

<!-- /ANCHOR:post-implementation-verification -->
<!-- ANCHOR:functionality-regression-check -->
## 5. FUNCTIONALITY REGRESSION CHECK

- [ ] Homepage loads correctly
- [ ] Navigation works (desktop)
- [ ] Navigation works (mobile)
- [ ] Video playback works
- [ ] Carousels/sliders work
- [ ] Forms submit correctly
- [ ] Cookie consent works
- [ ] No console errors

---

<!-- /ANCHOR:functionality-regression-check -->
<!-- ANCHOR:browser-testing -->
## 6. BROWSER TESTING

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

<!-- /ANCHOR:browser-testing -->
<!-- ANCHOR:maintenance -->
## 7. MAINTENANCE

### Periodic Re-testing

- Schedule: Monthly or after major changes
- Tool: PageSpeed Insights
- Alert threshold: >10% regression on any metric

### Monitoring

Consider setting up:
- Real User Monitoring (RUM)
- Synthetic monitoring
- Core Web Vitals tracking in Google Search Console

---

<!-- /ANCHOR:maintenance -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Internal References

- [cwv_remediation.md](../performance/cwv_remediation.md) - Core Web Vitals optimization patterns
- [resource_loading.md](../performance/resource_loading.md) - Resource hints and loading strategies

### External Tools

- [PageSpeed Insights](https://pagespeed.web.dev/) - Google's performance testing tool
- [WebPageTest](https://www.webpagetest.org/) - Detailed waterfall analysis
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Local performance profiling
<!-- /ANCHOR:related-resources -->
