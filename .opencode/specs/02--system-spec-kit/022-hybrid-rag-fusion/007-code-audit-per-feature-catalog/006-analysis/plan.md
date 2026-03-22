---
title: "Implementation Plan: Code Audit — Analysis"
description: "Technical plan for auditing 7 Analysis features against source code"
trigger_phrases:
  - "audit plan"
  - "analysis"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Code Audit — Analysis

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / JavaScript (Node.js) |
| **Framework** | MCP server (Model Context Protocol) |
| **Storage** | better-sqlite3 |
| **Testing** | Manual code review + cross-reference |

### Overview
Audit each of the 7 Analysis features by reading the feature catalog entry, locating the referenced source files, and verifying that the implementation matches the documented behavior.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Feature catalog files current and accessible
- [x] Source code accessible via file system
- [x] Audit methodology defined

### Definition of Done
- [x] All 7 features audited
- [x] Findings documented per feature
- [x] Summary report completed

---

## 3. ARCHITECTURE

### Pattern
Read-only audit: Feature Catalog → Source Code → Findings Report

### Key Components
- **Feature Catalog**: `feature_catalog/06--analysis/` — source of truth
- **Source Code**: `.opencode/skill/system-spec-kit/` — implementation files
- **Audit Output**: This spec folder — findings and documentation

### Data Flow
Read feature catalog entry → Locate source files → Compare description to implementation → Document findings

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Verify feature catalog is current for Analysis
- [x] Identify source code root paths
- [x] Set up audit methodology

### Phase 2: Feature-by-Feature Audit
- [x] Audit: Causal edge creation (memory_causal_link)
- [x] Audit: Causal graph statistics (memory_causal_stats)
- [x] Audit: Causal edge deletion (memory_causal_unlink)
- [x] Audit: Causal chain tracing (memory_drift_why)
- [x] Audit: Epistemic baseline capture (task_preflight)
- [x] Audit: Post-task learning measurement (task_postflight)
- [x] Audit: Learning history (memory_get_learning_history)

### Phase 3: Synthesis
- [x] Cross-reference findings across features
- [x] Identify systemic patterns
- [x] Compile summary report

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-reference | Feature-to-code traceability | Grep, Read, Glob |
| Completeness | All 7 features covered | Checklist verification |
| Accuracy | Catalog matches implementation | Manual review |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Feature catalog | Internal | Green | Cannot audit without reference |
| Source code access | Internal | Green | Cannot verify implementation |

---

## 7. ROLLBACK PLAN

- **Trigger**: Audit methodology proves inadequate
- **Procedure**: Revise approach and restart from Phase 1

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Prep) ──► Phase 2 (Audit 7 features) ──► Phase 3 (Synthesis)
```

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 1 session |
| Feature Audit | Low | 7 features |
| Synthesis | Medium | 1 session |

---

## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Audit spec created | All docs in place |
| M2 | All features audited | 7/7 complete |
| M3 | Synthesis delivered | Summary report finalized |

---

## FINDINGS SUMMARY

Audit completed 2026-03-22. 7/7 features audited. Overall result: **5 MATCH, 2 PARTIAL**.

### Per-Feature Results

| Feature | Result | Key Finding |
|---------|--------|-------------|
| F01 `memory_causal_link` | MATCH | Core behavior verified; `graph-signals.ts`, `causal-boost.ts`, 2 test files absent from source list |
| F02 `memory_causal_stats` | MATCH | Coverage target, orphan detection, health status all confirmed; same missing files |
| F03 `memory_causal_unlink` | MATCH | Delete by ID, cascade, cache invalidation confirmed; same missing files |
| F04 `memory_drift_why` | MATCH | Direction mapping, cycle detection, weights, depth limits confirmed; same missing files |
| F05 `task_preflight` | PARTIAL | Behavior verified; source file list bloated (~43 files, ~8 relevant); identical list shared with F06–F07 |
| F06 `task_postflight` | MATCH | LI formula, bands, gap tracking verified; re-correction capability undocumented |
| F07 `memory_get_learning_history` | PARTIAL | Filtering/stats/trends confirmed; layer classification L7 vs L6 mismatch; `includeSummary` param missing from catalog |

### Cross-Cutting Issues

| ID | Scope | Issue |
|----|-------|-------|
| CF-01 | F01–F04 | `graph-signals.ts`, `causal-boost.ts`, and 2 test files missing from causal-feature source lists |
| CF-02 | F05–F07 | All three features share an identical ~43-file source list; should be trimmed to ~8 relevant files each |
| CF-03 | F07 | Layer classification mismatch: catalog says L7, implementation uses L6 |
| CF-04 | F07 | `includeSummary` parameter present in implementation but absent from catalog |
| CF-05 | F06 | Re-correction capability functional but undocumented in catalog |
