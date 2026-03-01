---
title: "Implementation Summary - Performance Patterns Update [007-performance-patterns-update/implementation-summary]"
description: "This spec updates the workflows-code skill with performance optimization patterns learned from the anobel.com performance optimization project (024-performance-optimization). Th..."
trigger_phrases:
  - "implementation"
  - "summary"
  - "performance"
  - "patterns"
  - "update"
  - "implementation summary"
  - "026"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Implementation Summary - Performance Patterns Update

## Overview

This spec updates the `workflows-code` skill with performance optimization patterns learned from the anobel.com performance optimization project (024-performance-optimization). The update adds Phase 0: Research stage, Core Web Vitals remediation patterns, resource loading documentation, and multi-agent research methodology.

---

<!-- ANCHOR:what-built -->
## Files Touched

### New Files to Create (6)

| #   | File Path                                                                         | Task | Priority | Est. LOC |
| --- | --------------------------------------------------------------------------------- | ---- | -------- | -------- |
| 1   | `.opencode/skill/workflows-code/references/performance/cwv-remediation.md`        | T1   | P0       | ~200     |
| 2   | `.opencode/skill/workflows-code/references/performance/resource-loading.md`       | T2   | P0       | ~150     |
| 3   | `.opencode/skill/workflows-code/references/performance/webflow-constraints.md`    | T4   | P1       | ~100     |
| 4   | `.opencode/skill/workflows-code/references/performance/third-party.md`            | T5   | P1       | ~100     |
| 5   | `.opencode/skill/workflows-code/references/verification/performance-checklist.md` | T6   | P1       | ~80      |
| 6   | `.opencode/skill/workflows-code/references/research/multi-agent-patterns.md`      | T7   | P2       | ~150     |

### Files to Update (2)

| #   | File Path                                                                    | Task | Priority | Est. LOC |
| --- | ---------------------------------------------------------------------------- | ---- | -------- | -------- |
| 7   | `.opencode/skill/workflows-code/SKILL.md`                                    | T3   | P0       | ~50      |
| 8   | `.opencode/skill/workflows-code/references/implementation/async-patterns.md` | T8   | P2       | ~30      |

### New Directories to Create

| Directory                                                | Purpose                            |
| -------------------------------------------------------- | ---------------------------------- |
| `.opencode/skill/workflows-code/references/performance/` | Performance optimization patterns  |
| `.opencode/skill/workflows-code/references/research/`    | Research methodology documentation |

---

## Implementation Details by File

### 1. cwv-remediation.md (T1 - P0)

**Path:** `.opencode/skill/workflows-code/references/performance/cwv-remediation.md`

**Content:**
- LCP optimization patterns
  - Safety timeout pattern (3s fallback)
  - Image preload for LCP elements
  - Video poster pattern (optional)
  - Font preload for text LCP
- FCP optimization patterns
  - Preconnect for critical origins
  - Critical CSS inlining concepts
  - Render-blocking resource elimination
- TBT reduction patterns
  - requestIdleCallback for non-critical
  - Script deferral strategies
  - Main thread work reduction
- CLS prevention patterns
  - Explicit dimensions on media
  - font-display: swap usage
  - Skeleton/placeholder patterns

**Source:** 024-performance-optimization research findings

---

### 2. resource-loading.md (T2 - P0)

**Path:** `.opencode/skill/workflows-code/references/performance/resource-loading.md`

**Content:**
- Preconnect patterns with crossorigin handling
- Prefetch for below-fold resources
- Preload for critical resources
- Async CSS loading pattern (`onload="this.rel='stylesheet'"`)
- Script loading strategies (defer, async, dynamic)
- Noscript fallbacks

**Source:** 024-performance-optimization implementation (global.html, home.html)

---

### 3. SKILL.md Update (T3 - P0)

**Path:** `.opencode/skill/workflows-code/SKILL.md`

**Changes:**
- Add Phase 0: Research section before Phase 1: Implementation
- Document performance audit workflow
- Reference 10-agent research methodology
- Update phase lifecycle diagram
- Add performance references to Resources section

---

### 4. webflow-constraints.md (T4 - P1)

**Path:** `.opencode/skill/workflows-code/references/performance/webflow-constraints.md`

**Content:**
- TypeKit limitations (sync loading, no async option)
- jQuery/webflow.js constraints (auto-injected, no defer)
- CSS generation constraints (single file, no critical extraction)
- Custom code injection points and timing
- Workarounds summary table

**Source:** 024-performance-optimization decision-record.md

---

### 5. third-party.md (T5 - P1)

**Path:** `.opencode/skill/workflows-code/references/performance/third-party.md`

**Content:**
- GTM delay pattern (requestIdleCallback + Safari fallback)
- Analytics deferral strategies
- Consent script optimization
- CDN and font optimization

**Source:** 024-performance-optimization GTM implementation

**Code Example:**
```javascript
(function () {
  function loadGTM() {
    // GTM code here
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadGTM, { timeout: 3000 });
  } else {
    setTimeout(loadGTM, 2000); // Safari fallback
  }
})();
```

---

### 6. performance-checklist.md (T6 - P1)

**Path:** `.opencode/skill/workflows-code/references/verification/performance-checklist.md`

**Content:**
- Pre-implementation baseline capture (PageSpeed Insights)
- Metrics to record (LCP, FCP, TBT, CLS, SI)
- During implementation: incremental testing
- Post-implementation: before/after comparison
- Regression prevention checklist
- Browser testing protocol

**Source:** 024-performance-optimization verification process

---

### 7. multi-agent-patterns.md (T7 - P2)

**Path:** `.opencode/skill/workflows-code/references/research/multi-agent-patterns.md`

**Content:**
- 10-agent specialization model:
  1. HTML loading strategy
  2. JS bundle inventory
  3. Third-party scriptsac
  4. CSS performance
  5. LCP/Images analysis
  6. Above-fold resources
  7. Animation performance
  8. Initialization patterns
  9. External libraries
  10. Network waterfall
- Coordination patterns (parallel execution, synthesis)
- When to use multi-agent vs single-agent

**Source:** 024-performance-optimization 10-agent research

---

### 8. async-patterns.md Update (T8 - P2)

**Path:** `.opencode/skill/workflows-code/references/implementation/async-patterns.md`

**Additions:**
- requestIdleCallback section
  - Basic usage pattern
  - Timeout option
  - Safari fallback pattern
- Use cases: analytics loading, non-critical init, background tasks

---

## Implementation Order

| Order | Task | File                     | Dependencies |
| ----- | ---- | ------------------------ | ------------ |
| 1     | T1   | cwv-remediation.md       | None         |
| 2     | T2   | resource-loading.md      | None         |
| 3     | T4   | webflow-constraints.md   | None         |
| 4     | T5   | third-party.md           | None         |
| 5     | T3   | SKILL.md                 | T1, T2       |
| 6     | T6   | performance-checklist.md | T1-T5        |
| 7     | T7   | multi-agent-patterns.md  | None         |
| 8     | T8   | async-patterns.md        | T1           |

---

## Total Estimated LOC

| Priority    | Tasks       | LOC      |
| ----------- | ----------- | -------- |
| P0 (Must)   | T1, T2, T3  | ~400     |
| P1 (Should) | T4, T5, T6  | ~280     |
| P2 (Nice)   | T7, T8      | ~180     |
| **Total**   | **8 tasks** | **~860** |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:decisions -->
## Source Material

All patterns sourced from:
- `.opencode/specs/01--anobel.com/z_archive/022-performance-optimization/research.md`
- `.opencode/specs/01--anobel.com/z_archive/022-performance-optimization/decision-record.md`
- `src/0_html/global.html` (GTM delay, preconnects, safety timeout)
- `src/0_html/home.html` (async CSS pattern)

<!-- /ANCHOR:decisions -->

---

## Revision History

| Date       | Author          | Changes                        |
| ---------- | --------------- | ------------------------------ |
| 2026-01-26 | Claude Opus 4.5 | Initial implementation summary |
