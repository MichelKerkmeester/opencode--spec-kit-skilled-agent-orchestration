---
title: "Implementation Plan: Code Audit — Evaluation and Measurement"
description: "Technical plan for auditing 16 Evaluation and Measurement features against source code"
trigger_phrases:
  - "audit plan"
  - "evaluation and measurement"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Code Audit — Evaluation and Measurement

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
Audit each of the 16 Evaluation and Measurement features by reading the feature catalog entry, locating the referenced source files, and verifying that the implementation matches the documented behavior.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Feature catalog files current and accessible
- [x] Source code accessible via file system
- [x] Audit methodology defined

### Definition of Done
- [x] All 16 features audited
- [x] Findings documented per feature
- [x] Summary report completed

---

## 3. ARCHITECTURE

### Pattern
Read-only audit: Feature Catalog → Source Code → Findings Report

### Key Components
- **Feature Catalog**: `feature_catalog/09--evaluation-and-measurement/` — source of truth
- **Source Code**: `.opencode/skill/system-spec-kit/` — implementation files
- **Audit Output**: This spec folder — findings and documentation

### Data Flow
Read feature catalog entry → Locate source files → Compare description to implementation → Document findings

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Verify feature catalog is current for Evaluation and Measurement
- [x] Identify source code root paths
- [x] Set up audit methodology

### Phase 2: Feature-by-Feature Audit
- [x] Audit: Evaluation database and schema (F01 — PARTIAL)
- [x] Audit: Core metric computation (F02 — PARTIAL)
- [x] Audit: Observer effect mitigation (F03 — MATCH)
- [x] Audit: Full-context ceiling evaluation (F04 — MATCH)
- [x] Audit: Quality proxy formula (F05 — MATCH)
- [x] Audit: Synthetic ground truth corpus (F06 — MATCH)
- [x] Audit: BM25-only baseline (F07 — MATCH)
- [x] Audit: Agent consumption instrumentation (F08 — MATCH)
- [x] Audit: Scoring observability (F09 — MATCH)
- [x] Audit: Full reporting and ablation study framework (F10 — MATCH)
- [x] Audit: Shadow scoring and channel attribution (F11 — PARTIAL)
- [x] Audit: Test quality improvements (F12 — MATCH)
- [x] Audit: Evaluation and housekeeping fixes (F13 — PARTIAL)
- [x] Audit: Cross-AI validation fixes (F14 — MATCH)
- [x] Audit: Memory roadmap baseline snapshot (F15 — MATCH)
- [x] Audit: INT8 quantization evaluation (F16 — MATCH)

### Phase 3: Synthesis
- [x] Cross-reference findings across features
- [x] Identify systemic patterns
- [x] Compile summary report

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-reference | Feature-to-code traceability | Grep, Read, Glob |
| Completeness | All 16 features covered | Checklist verification |
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
Phase 1 (Prep) ──► Phase 2 (Audit 16 features) ──► Phase 3 (Synthesis)
```

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 1 session |
| Feature Audit | High | 16 features |
| Synthesis | Medium | 1 session |

---

## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Audit spec created | All docs in place |
| M2 | All features audited | 16/16 complete |
| M3 | Synthesis delivered | Summary report finalized |

---

## FINDINGS SUMMARY

**Audit Date**: 2026-03-22
**Overall Result**: 12 MATCH, 4 PARTIAL

### PARTIAL Findings

| Feature ID | Feature Name | Issue |
|------------|-------------|-------|
| F01 | eval-db-schema | `eval-logger.ts` missing from catalog source file list |
| F02 | core-metrics | Catalog counts 11 metrics; code implements 12 (MAP uncounted) |
| F11 | shadow-scoring | Catalog says channel attribution "active"; code has `@deprecated` |
| F13 | eval-housekeeping | Source list covers 2 of 6 actual fix locations; 4 files unlisted |

### Systemic Patterns

- **Source list staleness**: Three of the four PARTIAL findings (F01, F13 missing files; F02 metric count) stem from catalog source lists not being updated when implementation files were added or expanded. Recommend a lightweight update pass when source files change.
- **Deprecation tracking**: F11 reveals that `@deprecated` annotations in code are not propagated back to catalog status fields. Recommend a convention for marking catalog entries deprecated when code is annotated.

### Recommended Follow-up Actions

1. Add `eval-logger.ts` to `eval-db-schema` catalog source list (F01)
2. Increment metric count to 12, add MAP entry to `core-metrics` catalog (F02)
3. Mark channel attribution as deprecated in `shadow-scoring` catalog (F11)
4. Expand `eval-housekeeping` source file list to all 6 fix locations (F13)
