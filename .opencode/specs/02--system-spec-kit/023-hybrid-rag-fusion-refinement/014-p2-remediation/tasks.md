---
title: "Tasks: P1-19 Flag Catalog + P2 Remediation"
description: "14 agents across 3 waves — all tasks completed"
trigger_phrases:
  - "p2 remediation tasks"
  - "014 tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: P1-19 Flag Catalog + P2 Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create 014-p2-remediation spec sub-folder
- [x] T002 Verify all target files exist (found fallback-reranker.ts N/A)
- [x] T003 [P] Gather env var inventory for flag catalog
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1 — Code Quality + Performance (5 Opus agents)

- [x] T004 [P] Opus-A: Pipeline Stage 3 — score normalization, reference boolean, chunk ordering (stage3-rerank.ts)
- [x] T005 [P] Opus-B: Search Performance — Set dedup, SQL index (rsf-fusion.ts, learned-feedback.ts)
- [x] T006 [P] Opus-C: Graph & Causal — traversal indexes, threshold constant (causal-edges.ts, community-detection.ts)
- [x] T007 [P] Opus-D: Validation & Extraction — type safety, constants, entity regex, code block comment (save-quality-gate.ts, encoding-intent.ts, entity-extractor.ts, chunk-thinning.ts)
- [x] T008 [P] Opus-E: Hybrid Search + Eval — MPAB logging, CI percentile fix, underscore rename (hybrid-search.ts, bm25-baseline.ts, ground-truth-feedback.ts)

### Wave 2 — Documentation + Observability (5 agents)

- [x] T009 [P] Sonnet-A: Feature Flag Catalog P1-19 — 89 env vars documented (summary_of_existing_features.md)
- [x] T010 [P] Sonnet-B: Inline Docs — stale comments, AI-WHY, JSDoc, score immutability (5 files)
- [x] T011 [P] Sonnet-C: JSDoc Quality Helpers — @param/@returns on 5 functions (memory-save.ts)
- [x] T012 [P] Opus-F: Observability & Reporting — regex hardening, LIMIT clauses, latency constants (3 files)
- [x] T013 [P] Opus-G: Remaining Fixes — @deprecated exports, test timeout, N/A investigation (composite-scoring.ts, vitest.config.ts)

### Wave 3 — Testing + Architecture Docs (4 agents)

- [x] T014 [P] Opus-H: Denylist + RSF Tests — 53 new tests (2 new test files)
- [x] T015 [P] Opus-I: Quality Gate + Regression Tests — 15 regression tests (1 new test file)
- [x] T016 [P] Opus-J: Error Telemetry + CI — requestId propagation, 5 flag ceiling tests (4 handlers + 1 test file)
- [x] T017 [P] Sonnet-D: Pipeline I/O Docs — stage contracts, filter ordering (5 pipeline files)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 TypeScript compilation (`tsc --noEmit` → exit 0)
- [x] T019 Full test suite (`vitest run` → 7081/7081 passed)
- [x] T020 Fix entity-extractor regex regression (explicit case alternation)
- [x] T021 Populate implementation-summary.md
- [x] T022 Verify checklist.md with evidence
- [x] T023 Save context via generate-context.js
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — 7081 tests, tsc clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: 013-post-review-remediation
<!-- /ANCHOR:cross-refs -->
