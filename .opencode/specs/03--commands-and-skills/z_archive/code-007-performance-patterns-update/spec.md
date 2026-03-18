---
title: "Performance Patterns Update - workflows-code Skill [007-performance-patterns-update/spec]"
description: "Based on learnings from the anobel.com performance optimization project (024-performance-optimization), this spec documents required updates to the workflows-code skill to incor..."
trigger_phrases:
  - "performance"
  - "patterns"
  - "update"
  - "workflows"
  - "code"
  - "spec"
  - "026"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Performance Patterns Update - workflows-code Skill

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec ID** | 007 |
| **Title** | Performance Patterns Update |
| **Status** | Implementation Complete |
| **Level** | 3+ (Complex skill enhancement with architectural patterns) |
| **Created** | 2026-01-26 |
| **Author** | Claude Opus 4.5 |
| **LOC Estimate** | ~800-1200 (new references + skill updates) |
| **Parent Spec** | 005-anobel.com/024-performance-optimization |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## Overview

Based on learnings from the anobel.com performance optimization project (024-performance-optimization), this spec documents required updates to the `workflows-code` skill to incorporate performance patterns, Core Web Vitals remediation workflows, and multi-agent research methodologies.

### Problem Statement

The `workflows-code` skill currently lacks:
1. **Performance Audit Workflow** - No structured phase for CWV analysis before implementation
2. **CWV Remediation Patterns** - Missing LCP, FCP, TBT optimization techniques
3. **Resource Loading Patterns** - No documentation for preconnects, async CSS, script deferral
4. **Webflow Constraints** - Platform limitations not documented in skill references
5. **Multi-Agent Research** - 10-agent specialization model not codified

### Root Cause

The skill was designed for implementation workflows but lacks a "Phase 0: Research" stage that was proven effective in the performance optimization project.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## Scope

### In Scope (P0 - Must Have)

| Item | Description | Impact |
|------|-------------|--------|
| Performance Audit Workflow | Add Phase 0 research stage with CWV analysis | Prevents 20s+ LCP issues |
| CWV Remediation Guide | Document LCP safety timeout, preconnects, async patterns | Reusable optimization patterns |
| Resource Loading Reference | Preconnect, prefetch, preload patterns for Webflow | Faster page loads |

### In Scope (P1 - Should Have)

| Item | Description | Impact |
|------|-------------|--------|
| Third-Party Performance | GTM delay, analytics deferral patterns | Reduced main thread blocking |
| Verification Patterns | Before/after PageSpeed protocol | Measurable improvements |
| Webflow Constraints Doc | Platform limitations and workarounds | Prevents impossible tasks |

### In Scope (P2 - Nice to Have)

| Item | Description | Impact |
|------|-------------|--------|
| Multi-Agent Research | 10-agent specialization model | Comprehensive codebase analysis |
| Performance Checklist | Pre-flight checks for performance work | Consistent quality |

### Out of Scope

| Item | Reason |
|------|--------|
| Script bundling patterns | User preference against bundling |
| Video poster optimization | Removed from anobel.com scope |
| TypeKit removal | Requires font audit outside skill scope |

<!-- /ANCHOR:scope -->

---

## Research Summary

**10 parallel Opus/Sonnet agents** analyzed the workflows-code skill and performance patterns:

| Agent | Focus | Key Finding |
|-------|-------|-------------|
| 1 | Skill Structure | Missing Phase 0 research stage, no CWV remediation guide |
| 2 | Performance Patterns | 9 patterns identified: preconnect, GTM delay, async CSS, etc. |
| 3 | Multi-Agent Research | 10-agent specialization model effective for comprehensive analysis |
| 4 | Webflow Constraints | Platform limitations need explicit documentation |
| 5 | Verification Patterns | Before/after protocol with PageSpeed integration needed |
| 6-10 | Supporting Analysis | Folder structure, template requirements, reference gaps |

See `research.md` for complete findings.

---

## Files Affected

### New Files to Create

| Path | Purpose | LOC Est. |
|------|---------|----------|
| `references/performance/cwv-remediation.md` | Core Web Vitals optimization patterns | ~200 |
| `references/performance/resource-loading.md` | Preconnect, prefetch, async patterns | ~150 |
| `references/performance/webflow-constraints.md` | Platform limitations and workarounds | ~100 |
| `references/performance/third-party.md` | GTM, analytics, consent optimization | ~100 |
| `references/verification/performance-checklist.md` | Pre/post PageSpeed verification | ~80 |
| `references/research/multi-agent-patterns.md` | 10-agent research methodology | ~150 |

### Files to Update

| Path | Change | LOC Est. |
|------|--------|----------|
| `SKILL.md` | Add Phase 0: Research stage | ~50 |
| `references/implementation/async-patterns.md` | Add requestIdleCallback patterns | ~30 |

---

<!-- ANCHOR:success-criteria -->
## Success Criteria

| Criterion | Measurement | Target |
|-----------|-------------|--------|
| CWV patterns documented | All 9 patterns from research | 100% |
| Phase 0 integrated | SKILL.md updated with research stage | Complete |
| Webflow constraints documented | All known limitations listed | 100% |
| Verification protocol added | Before/after PageSpeed workflow | Complete |

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| 024-performance-optimization | Reference (patterns source) | Complete |
| workflows-code skill | Target (skill to update) | Active |
| SKILL.md template | Template | Available |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Pattern obsolescence | Low | Medium | Document version/date, review quarterly |
| Webflow platform changes | Medium | Low | Note Webflow version, monitor updates |
| Over-documentation | Medium | Low | Focus on actionable patterns only |

<!-- /ANCHOR:risks -->

---

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-26 | Claude Opus 4.5 | Initial spec created from 10-agent research |
| 2026-01-26 | Claude Opus 4.5 | Implementation complete - all 8 tasks done |
| 2026-01-26 | Claude Opus 4.5 | Template compliance verified (write.md protocol) |
