---
title: "Imp [02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/008-bug-fixes-and-data-integrity/plan]"
description: "Technical plan for auditing 11 Bug Fixes and Data Integrity features against source code"
trigger_phrases:
  - "audit plan"
  - "bug fixes and data integrity"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Code Audit — Bug Fixes and Data Integrity

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
Audit each of the 11 Bug Fixes and Data Integrity features by reading the feature catalog entry, locating the referenced source files, and verifying that the implementation matches the documented behavior.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Feature catalog files current and accessible
- [x] Source code accessible via file system
- [x] Audit methodology defined

### Definition of Done
- [x] All 11 features audited
- [x] Findings documented per feature
- [x] Summary report completed

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only audit: Feature Catalog → Source Code → Findings Report

### Key Components
- **Feature Catalog**: `feature_catalog/08--bug-fixes-and-data-integrity/` — source of truth
- **Source Code**: `.opencode/skill/system-spec-kit/` — implementation files
- **Audit Output**: This spec folder — findings and documentation

### Data Flow
Read feature catalog entry → Locate source files → Compare description to implementation → Document findings

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Verify feature catalog is current for Bug Fixes and Data Integrity
- [x] Identify source code root paths
- [x] Set up audit methodology

### Phase 2: Feature-by-Feature Audit
- [x] Audit: Graph channel ID fix (PARTIAL)
- [x] Audit: Chunk collapse deduplication (MATCH)
- [x] Audit: Co-activation fan-effect divisor (MATCH)
- [x] Audit: SHA-256 content-hash deduplication (MATCH)
- [x] Audit: Database and schema safety (MATCH)
- [x] Audit: Guards and edge cases (MATCH)
- [x] Audit: Canonical ID dedup hardening (MATCH)
- [x] Audit: Math.max/min stack overflow elimination (PARTIAL)
- [x] Audit: Session-manager transaction gap fixes (MATCH)
- [x] Audit: Chunking Orchestrator Safe Swap (MATCH)
- [x] Audit: Working Memory Timestamp Fix (MATCH)

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
| Completeness | All 11 features covered | Checklist verification |
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
Phase 1 (Prep) ──► Phase 2 (Audit 11 features) ──► Phase 3 (Synthesis)
```

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 1 session |
| Feature Audit | Medium | 11 features |
| Synthesis | Medium | 1 session |

---

### Milestones

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Audit spec created | All docs in place |
| M2 | All features audited | 11/11 complete |
| M3 | Synthesis delivered | Summary report finalized |

---

### Findings Summary

Audit completed 2026-03-22. Result: **9 MATCH, 2 PARTIAL** across 11 features.

| Verdict | Count | Features |
|---------|-------|---------|
| MATCH | 9 | F02, F03, F04, F05, F06, F07, F09, F10, F11 |
| PARTIAL | 2 | F01 (graph-channel-id-fix), F08 (math-max-min-overflow) |

### PARTIAL Details

**F01 — Graph channel ID fix**: Pre-fix `mem:` prefix removal and the primary fix are confirmed. Two call-sites in `graph-lifecycle.ts` remain unfixed and are not documented in the catalog source list.

**F08 — Math.max/min stack overflow elimination**: Fix applied in `retrieval-pipeline.ts` and `score-calibration.ts`. Two files (`k-value-analysis.ts`, `graph-lifecycle.ts`) still use spread-based calls and are absent from the catalog's source list. Needs follow-on work item.

### Cross-Cutting Patterns

- **Inflated source lists**: F07 and F09 reference more source files than the fix strictly involves. Catalog source lists should be trimmed on next revision.
- **Transaction count (F09)**: Documented as 2 transactions; source code shows 3. Catalog correction recommended.
- **`graph-lifecycle.ts` as a hotspot**: Appears in both F01 and F08 PARTIAL verdicts — two separate unfixed patterns in the same file.
<!-- /ANCHOR:effort -->
