---
title: "Implementatio [system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/012-query-intelligence/plan]"
description: "Technical plan for auditing 11 Query Intelligence features against source code"
trigger_phrases:
  - "audit plan"
  - "query intelligence"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Code Audit — Query Intelligence

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
Audit each of the 11 Query Intelligence features by reading the feature catalog entry, locating the referenced source files, and verifying that the implementation matches the documented behavior.

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
- **Feature Catalog**: `feature_catalog/12--query-intelligence/` — source of truth
- **Source Code**: `.opencode/skill/system-spec-kit/` — implementation files
- **Audit Output**: This spec folder — findings and documentation

### Data Flow
Read feature catalog entry → Locate source files → Compare description to implementation → Document findings

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Verify feature catalog is current for Query Intelligence
- [x] Identify source code root paths
- [x] Set up audit methodology

### Phase 2: Feature-by-Feature Audit
- [x] Audit: Query complexity router — MATCH (F01)
- [x] Audit: Relative score fusion in shadow mode — MATCH (F02)
- [x] Audit: Channel min-representation — MATCH (F03)
- [x] Audit: Confidence-based result truncation — MATCH (F04)
- [x] Audit: Dynamic token budget allocation — MATCH (F05)
- [x] Audit: Query expansion — MATCH (F06)
- [x] Audit: LLM query reformulation — PARTIAL (F07: flag contradiction)
- [x] Audit: HyDE (Hypothetical Document Embeddings) — PARTIAL (F08: flag contradiction)
- [x] Audit: Index-time query surrogates — PARTIAL (F09: missing file + dead code)
- [x] Audit: Query decomposition — MATCH (F10)
- [x] Audit: Graph concept routing — MATCH (F11)

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

**Audit Date**: 2026-03-22
**Result**: 8 MATCH, 3 PARTIAL

| Finding | Features Affected | Severity |
|---------|-------------------|----------|
| `useQueryReformulation` flag default contradiction: header=FALSE, runtime defaults=ON | F07, F08 | Medium — catalog accuracy gap |
| `surrogate-storage.ts` unlisted in catalog; `matchSurrogates()` dead code at query time | F09 | Low — missing source ref + dead code |

All 3 PARTIAL items are catalog documentation gaps or dead code — no behavioral regressions confirmed.
<!-- /ANCHOR:effort -->
