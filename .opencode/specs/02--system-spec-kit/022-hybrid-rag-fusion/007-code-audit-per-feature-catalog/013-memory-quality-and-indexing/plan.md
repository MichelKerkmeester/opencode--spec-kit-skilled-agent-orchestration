---
title: "Impl [02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/plan]"
description: "Technical plan for auditing 24 Memory Quality and Indexing features against source code"
trigger_phrases:
  - "audit plan"
  - "memory quality and indexing"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Code Audit — Memory Quality and Indexing

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
Audit each of the 24 Memory Quality and Indexing features by reading the feature catalog entry, locating the referenced source files, and verifying that the implementation matches the documented behavior.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Feature catalog files current and accessible
- [x] Source code accessible via file system
- [x] Audit methodology defined

### Definition of Done
- [x] All 24 features audited
- [x] Findings documented per feature
- [x] Summary report completed

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only audit: Feature Catalog → Source Code → Findings Report

### Key Components
- **Feature Catalog**: `feature_catalog/13--memory-quality-and-indexing/` — source of truth
- **Source Code**: `.opencode/skill/system-spec-kit/` — implementation files
- **Audit Output**: This spec folder — findings and documentation

### Data Flow
Read feature catalog entry → Locate source files → Compare description to implementation → Document findings

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Verify feature catalog is current for Memory Quality and Indexing
- [x] Identify source code root paths
- [x] Set up audit methodology

### Phase 2: Feature-by-Feature Audit
- [x] Audit: Verify-fix-verify memory quality loop
- [x] Audit: Signal vocabulary expansion
- [x] Audit: Pre-flight token budget validation
- [x] Audit: Spec folder description discovery
- [x] Audit: Pre-storage quality gate
- [x] Audit: Reconsolidation-on-save
- [x] Audit: Smarter memory content generation
- [x] Audit: Anchor-aware chunk thinning
- [x] Audit: Encoding-intent capture at index time
- [x] Audit: Auto entity extraction
- [x] Audit: Content-aware memory filename generation
- [x] Audit: Duplicate and empty content prevention
- [x] Audit: Entity normalization consolidation
- [x] Audit: Quality gate timer persistence
- [x] Audit: Deferred lexical-only indexing
- [x] Audit: Dry-run preflight for memory_save
- [x] Audit: Outsourced agent handback protocol
- [x] Audit: Session enrichment and alignment guards
- [x] Audit: Post-save quality review
- [x] Audit: Weekly batch feedback learning
- [x] Audit: Assistive reconsolidation
- [x] Audit: Implicit feedback log
- [x] Audit: Hybrid decay policy
- [x] Audit: Save quality gate exceptions

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
| Completeness | All 24 features covered | Checklist verification |
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
Phase 1 (Prep) ──► Phase 2 (Audit 24 features) ──► Phase 3 (Synthesis)
```

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 1 session |
| Feature Audit | High | 24 features |
| Synthesis | Medium | 1 session |

---

### Milestones

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Audit spec created | All docs in place |
| M2 | All features audited | 24/24 complete |
| M3 | Synthesis delivered | Summary report finalized |

---

### Findings Summary

**Audit completed:** 2026-03-22
**Result:** 20 MATCH, 4 PARTIAL (0 FAIL)

### PARTIAL Findings

| Feature | Issue | Remediation |
|---------|-------|-------------|
| F11 — Content-aware memory filename generation | `slugToTitle` lives in `scripts/core/title-builder.ts` but that file is missing from catalog source list | Add `title-builder.ts` to catalog source list |
| F12 — Duplicate and empty content prevention | Primary file `scripts/core/file-writer.ts` missing; source list bloated with 55+ unrelated files | Add `file-writer.ts`; trim unrelated files from catalog |
| F13 — Entity normalization consolidation | `entity-linker.ts` missing from source list | Add `entity-linker.ts` to catalog source list |
| F14 — Quality gate timer persistence | Source list massively inflated with tangentially related files | Reduce source list to primary implementation files only |
| F23 — Hybrid decay policy | CORRECTED: now MATCH — `applyHybridDecayPolicy` IS exported at line 478 of `fsrs-scheduler.ts`; original audit finding was hallucinated | No remediation needed |

### Systemic Patterns
- Source list accuracy is the dominant issue class (F11, F12, F13, F14 all involve incorrect or incomplete source attribution).
- F23 was originally flagged as PARTIAL but verification confirmed `applyHybridDecayPolicy` is a named export — the audit finding was hallucinated.
- No features were found to be unimplemented or fundamentally misrepresented in behavior.
<!-- /ANCHOR:effort -->
