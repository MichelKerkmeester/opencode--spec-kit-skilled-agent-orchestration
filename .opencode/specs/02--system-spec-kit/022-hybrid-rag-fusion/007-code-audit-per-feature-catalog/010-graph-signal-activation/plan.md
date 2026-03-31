---
title: "Implemen [02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010-graph-signal-activation/plan]"
description: "Technical plan for auditing 16 Graph Signal Activation features against source code"
trigger_phrases:
  - "audit plan"
  - "graph signal activation"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Code Audit — Graph Signal Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / JavaScript (Node.js) |
| **Framework** | MCP server (Model Context Protocol) |
| **Storage** | better-sqlite3 |
| **Testing** | Manual code review + cross-reference |

### Overview
Audit each of the 16 Graph Signal Activation features by reading the feature catalog entry, locating the referenced source files, and verifying that the implementation matches the documented behavior.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Feature catalog files current and accessible
- [x] Source code accessible via file system
- [x] Audit methodology defined

### Definition of Done
- [x] All 16 features audited
- [x] Findings documented per feature
- [x] Summary report completed

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only audit: Feature Catalog → Source Code → Findings Report

### Key Components
- **Feature Catalog**: `feature_catalog/10--graph-signal-activation/` — source of truth
- **Source Code**: `.opencode/skill/system-spec-kit/` — implementation files
- **Audit Output**: This spec folder — findings and documentation

### Data Flow
Read feature catalog entry → Locate source files → Compare description to implementation → Document findings

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Verify feature catalog is current for Graph Signal Activation
- [x] Identify source code root paths
- [x] Set up audit methodology

### Phase 2: Feature-by-Feature Audit
- [x] Audit: Typed-weighted degree channel — MATCH
- [x] Audit: Co-activation boost strength increase — MATCH (minor 0.3 imprecision)
- [x] Audit: Edge density measurement — MATCH
- [x] Audit: Weight history audit tracking — MATCH (source list over-inclusive)
- [x] Audit: Graph momentum scoring — MATCH
- [x] Audit: Causal depth signal — MATCH
- [x] Audit: Community detection — MATCH
- [x] Audit: Graph and cognitive memory fixes — MATCH (minor file attribution)
- [x] Audit: ANCHOR tags as graph nodes — MATCH (correctly DEFERRED)
- [x] Audit: Causal neighbor boost and injection — MATCH
- [x] Audit: Temporal contiguity layer — PARTIAL (CONFIRMED @deprecated: "Never wired into production pipeline. Superseded by FSRS v4 decay." Catalog incorrectly presents as active)
- [x] Audit: Unified graph retrieval and deterministic ranking — MATCH
- [x] Audit: Graph lifecycle refresh — PARTIAL (misleading inline comment)
- [x] Audit: Async LLM graph backfill — PARTIAL (self-contradictory catalog default)
- [x] Audit: Graph calibration profiles — PARTIAL (CONFIRMED @deprecated: "Fully implemented and tested but never wired into Stage 2 pipeline." Catalog incorrectly presents as active)
- [x] Audit: Typed traversal — MATCH

### Phase 3: Synthesis
- [x] Cross-reference findings across features
- [x] Identify systemic patterns
- [x] Compile summary report

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-reference | Feature-to-code traceability | Grep, Read, Glob |
| Completeness | All 16 features covered | Checklist verification |
| Accuracy | Catalog matches implementation | Manual review |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Feature catalog | Internal | Green | Cannot audit without reference |
| Source code access | Internal | Green | Cannot verify implementation |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Audit methodology proves inadequate
- **Procedure**: Revise approach and restart from Phase 1

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Prep) ──► Phase 2 (Audit 16 features) ──► Phase 3 (Synthesis)
```

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 1 session |
| Feature Audit | High | 16 features |
| Synthesis | Medium | 1 session |

---

### Milestones

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Audit spec created | All docs in place |
| M2 | All features audited | 16/16 complete — DONE |
| M3 | Synthesis delivered | Summary report finalized — DONE |

---

### Findings Summary

**Audit complete: 12 MATCH, 4 PARTIAL (16 total)**

### MATCH (12)
F01 typed-weighted-degree, F02 co-activation-boost, F03 edge-density, F04 weight-history, F05 graph-momentum, F06 causal-depth, F07 community-detection, F08 graph-cognitive-fixes, F09 anchor-tags (DEFERRED), F10 causal-neighbor-boost, F12 unified-graph, F16 typed-traversal

### PARTIAL (4) — Follow-up required

| Feature | Issue | Severity |
|---------|-------|----------|
| F11 temporal-contiguity | CONFIRMED @deprecated — "Never wired into production pipeline. Superseded by FSRS v4 decay." Catalog must be updated to reflect deprecated status | High |
| F13 graph-lifecycle | Misleading inline comment vs actual default behavior | Low |
| F14 llm-graph-backfill | Self-contradictory default messaging within catalog entry | Medium |
| F15 graph-calibration | CONFIRMED @deprecated — "Fully implemented and tested but never wired into Stage 2 pipeline." Catalog must be updated to reflect deprecated status | High |

### Systemic Pattern
Two features (F11, F15) share the same failure mode: a CONFIRMED @deprecated module left in the codebase with an active-facing catalog entry that incorrectly presents it as a graduated feature. These must be handled together in a single catalog-correction pass to update status from active to DEPRECATED. The F14 contradiction and F13 comment are independent, lower-priority fixes.
<!-- /ANCHOR:effort -->
