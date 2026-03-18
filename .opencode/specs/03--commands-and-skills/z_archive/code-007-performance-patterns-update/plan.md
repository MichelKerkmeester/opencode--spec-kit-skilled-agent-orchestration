---
title: "Performance Patterns Update - Implementation Plan [007-performance-patterns-update/plan]"
description: "Goal: Enhance workflows-code skill with performance optimization patterns learned from anobel.com project."
trigger_phrases:
  - "performance"
  - "patterns"
  - "update"
  - "implementation"
  - "plan"
  - "026"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Performance Patterns Update - Implementation Plan

<!-- ANCHOR:summary -->
## Executive Summary

**Goal:** Enhance workflows-code skill with performance optimization patterns learned from anobel.com project.

**Approach:** Create new reference documents and update SKILL.md to include Phase 0 research stage.

**Estimated LOC:** ~800-1200 across 6 new files + 2 updates

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
## Phase 1: Core Performance References (P0)

### 1.1 CWV Remediation Guide
**File:** `references/performance/cwv-remediation.md`
**LOC:** ~200

Contents:
- LCP optimization patterns (safety timeout, preload, poster images)
- FCP optimization (preconnects, critical CSS)
- TBT reduction (script deferral, requestIdleCallback)
- CLS prevention (dimension attributes, font-display)

### 1.2 Resource Loading Patterns
**File:** `references/performance/resource-loading.md`
**LOC:** ~150

Contents:
- Preconnect patterns with crossorigin handling
- Prefetch for below-fold resources
- Preload for critical resources
- Async CSS loading pattern
- Script loading strategies (defer, async, dynamic)

### 1.3 SKILL.md Phase 0 Update
**File:** `SKILL.md` (update)
**LOC:** ~50 additions

Changes:
- Add Phase 0: Research before Phase 1: Implementation
- Document 10-agent research methodology
- Add performance audit as optional pre-phase

<!-- /ANCHOR:phases -->

---

## Phase 2: Platform & Third-Party (P1)

### 2.1 Webflow Constraints
**File:** `references/performance/webflow-constraints.md`
**LOC:** ~100

Contents:
- TypeKit limitations (sync loading, no async option)
- jQuery/webflow.js constraints (auto-injected, no defer)
- CSS generation (single file, no critical extraction)
- Custom code injection points and timing
- Workarounds for each constraint

### 2.2 Third-Party Performance
**File:** `references/performance/third-party.md`
**LOC:** ~100

Contents:
- GTM delay pattern (requestIdleCallback + fallback)
- Analytics deferral strategies
- Consent script optimization
- CDN and font optimization

### 2.3 Performance Verification
**File:** `references/verification/performance-checklist.md`
**LOC:** ~80

Contents:
- Pre-implementation baseline capture
- PageSpeed Insights workflow
- Before/after comparison protocol
- Regression prevention checklist

---

## Phase 3: Advanced Patterns (P2)

### 3.1 Multi-Agent Research
**File:** `references/research/multi-agent-patterns.md`
**LOC:** ~150

Contents:
- 10-agent specialization model
- Agent focus areas (HTML, JS, CSS, third-party, etc.)
- Coordination and synthesis patterns
- When to use multi-agent vs single-agent

### 3.2 Async Patterns Update
**File:** `references/implementation/async-patterns.md` (update)
**LOC:** ~30 additions

Changes:
- Add requestIdleCallback with timeout pattern
- Add Safari fallback for requestIdleCallback
- Document idle callback use cases

---

<!-- ANCHOR:dependencies -->
## Implementation Order

| Order | Task | Dependencies | Priority |
|-------|------|--------------|----------|
| 1 | cwv-remediation.md | None | P0 |
| 2 | resource-loading.md | None | P0 |
| 3 | SKILL.md update | 1, 2 | P0 |
| 4 | webflow-constraints.md | None | P1 |
| 5 | third-party.md | None | P1 |
| 6 | performance-checklist.md | 1-5 | P1 |
| 7 | multi-agent-patterns.md | None | P2 |
| 8 | async-patterns.md update | 1 | P2 |

<!-- /ANCHOR:dependencies -->

---

## Expected Outcomes

### Skill Capability Matrix (After)

| Capability | Before | After |
|------------|--------|-------|
| Performance audit workflow | None | Phase 0 with 10-agent option |
| CWV remediation patterns | None | 4 metrics with solutions |
| Resource loading patterns | Partial | Complete with Webflow context |
| Verification protocol | None | Before/after with PageSpeed |

### Reusability

These patterns will be applicable to:
- All Webflow projects
- General frontend performance work
- Multi-agent research tasks

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Initial plan created |
