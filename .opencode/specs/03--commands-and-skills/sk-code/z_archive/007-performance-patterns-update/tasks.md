---
title: "Tasks - Performance Patterns Update [007-performance-patterns-update/tasks]"
description: "Status: Pending | Priority: P0 | LOC: ~200"
trigger_phrases:
  - "tasks"
  - "performance"
  - "patterns"
  - "update"
  - "026"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Tasks - Performance Patterns Update

<!-- ANCHOR:notation -->
## Task Overview

| ID | Task | Status | Priority | Est. LOC |
|----|------|--------|----------|----------|
| T1 | Create CWV remediation guide | `[x]` Complete | P0 | ~220 |
| T2 | Create resource loading patterns | `[x]` Complete | P0 | ~185 |
| T3 | Update SKILL.md with Phase 0 | `[x]` Complete | P0 | ~50 |
| T4 | Create Webflow constraints doc | `[x]` Complete | P1 | ~100 |
| T5 | Create third-party performance doc | `[x]` Complete | P1 | ~100 |
| T6 | Create performance verification checklist | `[x]` Complete | P1 | ~80 |
| T7 | Create multi-agent research patterns | `[x]` Complete | P2 | ~170 |
| T8 | Update async-patterns.md | `[x]` Complete | P2 | ~78 |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## P0 Tasks (Must Complete)

### T1: CWV Remediation Guide
**Status:** Pending | **Priority:** P0 | **LOC:** ~200

**File:** `.opencode/skill/workflows-code/references/performance/cwv-remediation.md`

**Content Requirements:**
- [ ] LCP optimization patterns
  - [ ] Safety timeout pattern (3s fallback)
  - [ ] Image preload for LCP elements
  - [ ] Video poster pattern (when applicable)
  - [ ] Font preload for text LCP
- [ ] FCP optimization patterns
  - [ ] Preconnect for critical origins
  - [ ] Critical CSS inlining (concepts)
  - [ ] Render-blocking resource elimination
- [ ] TBT reduction patterns
  - [ ] requestIdleCallback for non-critical
  - [ ] Script deferral strategies
  - [ ] Main thread work reduction
- [ ] CLS prevention patterns
  - [ ] Explicit dimensions on media
  - [ ] Font-display: swap usage
  - [ ] Skeleton/placeholder patterns

**Source:** 024-performance-optimization research findings

---

### T2: Resource Loading Patterns
**Status:** Pending | **Priority:** P0 | **LOC:** ~150

**File:** `.opencode/skill/workflows-code/references/performance/resource-loading.md`

**Content Requirements:**
- [ ] Preconnect patterns
  - [ ] Syntax with crossorigin attribute
  - [ ] When to use vs prefetch
  - [ ] Common origins (CDNs, fonts, analytics)
- [ ] Prefetch patterns
  - [ ] Below-fold resource prefetching
  - [ ] Navigation prefetch
- [ ] Preload patterns
  - [ ] Critical resource preloading
  - [ ] as= attribute usage
  - [ ] Async CSS pattern (`onload="this.rel='stylesheet'"`)
- [ ] Script loading patterns
  - [ ] defer vs async vs dynamic
  - [ ] Module scripts behavior
  - [ ] Noscript fallbacks

**Source:** 024-performance-optimization implementation

---

### T3: Update SKILL.md with Phase 0
**Status:** Pending | **Priority:** P0 | **LOC:** ~50

**File:** `.opencode/skill/workflows-code/SKILL.md`

**Changes Required:**
- [ ] Add Phase 0: Research section
  - [ ] Performance audit workflow
  - [ ] 10-agent research methodology reference
  - [ ] When to use Phase 0
- [ ] Update phase lifecycle diagram
- [ ] Add performance references to Resources section

**Validation:**
- [ ] Phase 0 documented before Phase 1
- [ ] Multi-agent option mentioned
- [ ] Links to new reference documents

---

## P1 Tasks (Should Complete)

### T4: Webflow Constraints Documentation
**Status:** Pending | **Priority:** P1 | **LOC:** ~100

**File:** `.opencode/skill/workflows-code/references/performance/webflow-constraints.md`

**Content Requirements:**
- [ ] TypeKit limitations
  - [ ] Sync loading (no async option)
  - [ ] Workaround: preconnects only
- [ ] jQuery/webflow.js constraints
  - [ ] Auto-injected without defer
  - [ ] Cannot modify loading behavior
- [ ] CSS generation constraints
  - [ ] Single CSS file generated
  - [ ] No critical CSS extraction
- [ ] Custom code injection points
  - [ ] Head code timing
  - [ ] Body code timing
  - [ ] Page-specific vs global
- [ ] Workarounds summary table

**Source:** 024-performance-optimization Webflow constraints

---

### T5: Third-Party Performance Patterns
**Status:** Pending | **Priority:** P1 | **LOC:** ~100

**File:** `.opencode/skill/workflows-code/references/performance/third-party.md`

**Content Requirements:**
- [ ] GTM delay pattern
  - [ ] requestIdleCallback wrapper
  - [ ] Safari fallback (setTimeout)
  - [ ] Timeout configuration
- [ ] Analytics deferral
  - [ ] When to defer vs inline
  - [ ] Data layer considerations
- [ ] Consent scripts
  - [ ] Performance impact awareness
  - [ ] Optimization strategies
- [ ] Font loading (external)
  - [ ] Preconnect for font origins
  - [ ] font-display strategies

**Source:** 024-performance-optimization GTM implementation

---

### T6: Performance Verification Checklist
**Status:** Pending | **Priority:** P1 | **LOC:** ~80

**File:** `.opencode/skill/workflows-code/references/verification/performance-checklist.md`

**Content Requirements:**
- [ ] Pre-implementation baseline
  - [ ] PageSpeed Insights capture
  - [ ] Metrics to record (LCP, FCP, TBT, CLS, SI)
  - [ ] Mobile + Desktop runs
- [ ] During implementation
  - [ ] Incremental testing approach
  - [ ] Console error monitoring
- [ ] Post-implementation verification
  - [ ] Before/after comparison
  - [ ] Regression detection
  - [ ] Browser testing protocol
- [ ] Maintenance
  - [ ] Periodic re-testing schedule
  - [ ] Metric monitoring approach

**Source:** 024-performance-optimization verification process

---

## P2 Tasks (Nice to Have)

### T7: Multi-Agent Research Patterns
**Status:** Pending | **Priority:** P2 | **LOC:** ~150

**File:** `.opencode/skill/workflows-code/references/research/multi-agent-patterns.md`

**Content Requirements:**
- [ ] 10-agent specialization model
  - [ ] Agent 1: HTML loading strategy
  - [ ] Agent 2: JS bundle inventory
  - [ ] Agent 3: Third-party scripts
  - [ ] Agent 4: CSS performance
  - [ ] Agent 5: LCP/Images analysis
  - [ ] Agent 6: Above-fold resources
  - [ ] Agent 7: Animation performance
  - [ ] Agent 8: Initialization patterns
  - [ ] Agent 9: External libraries
  - [ ] Agent 10: Network waterfall
- [ ] Coordination patterns
  - [ ] Parallel execution
  - [ ] Result synthesis
- [ ] When to use
  - [ ] Complex codebase analysis
  - [ ] Performance audits
  - [ ] Architecture reviews

**Source:** 024-performance-optimization 10-agent research

---

### T8: Update Async Patterns Reference
**Status:** Pending | **Priority:** P2 | **LOC:** ~30

**File:** `.opencode/skill/workflows-code/references/implementation/async-patterns.md`

**Changes Required:**
- [ ] Add requestIdleCallback section
  - [ ] Basic usage pattern
  - [ ] Timeout option
  - [ ] Safari fallback pattern
- [ ] Add use cases
  - [ ] Analytics loading
  - [ ] Non-critical initialization
  - [ ] Background tasks

**Source:** 024-performance-optimization GTM implementation

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:completion -->
## Progress Summary

**Total Tasks:** 8
**P0 (Must):** 3 tasks (~455 LOC) - COMPLETE
**P1 (Should):** 3 tasks (~280 LOC) - COMPLETE
**P2 (Nice):** 2 tasks (~248 LOC) - COMPLETE

**Completed:** 8/8 (100%)
**Pending:** 0/8 (0%)

<!-- /ANCHOR:completion -->

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Initial tasks created from research |
