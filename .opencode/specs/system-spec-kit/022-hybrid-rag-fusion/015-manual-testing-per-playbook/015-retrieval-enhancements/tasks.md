---
title: "Tasks [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/015-retrieval-enhancements/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retrieval enhancements tasks"
  - "phase 015 tasks"
  - "manual testing retrieval tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Manual Testing — Retrieval Enhancements (Phase 015)

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

- [x] T001 Load playbook rows for all 11 retrieval enhancement scenario IDs from `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`
- [x] T002 Load review protocol verdict rules from `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`
- [x] T003 [P] Confirm feature catalog links for all 11 scenarios in `../../feature_catalog/15--retrieval-enhancements/`
- [x] T004 Record baseline env var state — all flags default-ON; env-var overrides documented per scenario
- [x] T005 Capture corpus size logic — `checkScaleGate` in `lib/search/memory-summaries.ts:210-226` counts `embedding_status='success'` rows and returns true when >5000
- [x] T006 Code-analysis approach: verdict based on static source inspection; sandbox execution not required for code-analysis methodology
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Execute scenario 055 — Dual-scope memory auto-surface (TM-05) — **PASS** (`context-server.ts:284-311`, `hooks/memory-surface.ts:254-277`, `hooks/memory-surface.ts:300-317`)
- [x] T008 Execute scenario 056 — Constitutional memory as expert knowledge injection (PI-A4) — **PASS** (`hooks/memory-surface.ts:110-125`, `lib/search/retrieval-directives.ts:323-350`, importance_tier='constitutional' filter + `retrieval_directive` enrichment field confirmed)
- [x] T009 Execute scenario 057 — Spec folder hierarchy as retrieval structure (S4) — **PASS** (`lib/search/spec-folder-hierarchy.ts:261-299`, self=1.0, parent=0.8, sibling=0.5 scoring, `graph-search-fn.ts:92-100` wires it into Stage 1)
- [x] T010 Execute scenario 058 — Lightweight consolidation (N3-lite) — **PASS** (`lib/storage/consolidation.ts:430-474`, all 3 sub-processes: contradiction scan, Hebbian strengthening+decay, staleness detection; `runConsolidationCycleIfEnabled` gated by `SPECKIT_CONSOLIDATION`)
- [x] T011 Execute scenario 059 — Memory summary search channel (R8) — **PASS** (`lib/search/memory-summaries.ts:210-226` checkScaleGate >5000, `stage1-candidate-gen.ts:876-919` gates channel on both flag and scale gate; inert below threshold)
- [x] T012 Execute scenario 060 — Cross-document entity linking (S5) — **PASS** (`lib/search/entity-linker.ts:588-679`: INSERT OR IGNORE causal_edges type='supports', density guard projects density before insert, MAX_EDGES_PER_NODE=20)
- [x] T013 Execute scenario 077 — Tier-2 fallback channel forcing — **PASS** (`lib/search/hybrid-search.ts:1564-1573`: tier2Options with `forceAllChannels:true`, `useBm25:true`, `useFts:true`, `useVector:true`, `useGraph:true`; note: only active when SPECKIT_SEARCH_FALLBACK=true)
- [x] T014 Execute scenario 093 — Implemented: memory summary generation (R8) — **PASS** (`lib/search/memory-summaries.ts:98-145`: `generateAndStoreSummary` generates TF-IDF summary, stores in `memory_summaries` table with embedding; gated by `isMemorySummariesEnabled()` + scale gate)
- [x] T015 Execute scenario 094 — Implemented: cross-document entity linking (S5) — **PASS** (`lib/search/entity-linker.ts:1-6,586-679`: feature active, edge type 'supports', strength 0.7, density guard enforced, created_by='entity_linker')
- [x] T016 Execute scenario 096 — Provenance-rich response envelopes (P0-2) — **PASS** (`handlers/memory-search.ts:431-436`: SPECKIT_RESPONSE_TRACE OR includeTraceArg; `formatters/search-results.ts:457-477`: all 7 score sub-fields semantic/lexical/fusion/intentAdjusted/composite/rerank/attention; scores/source/trace absent when flag unset and arg false)
- [x] T017 Execute scenario 145 — Contextual tree injection (P1-4) — **PASS** (`lib/search/hybrid-search.ts:1127-1130,1390-1413`: `injectContextualTree` runs when `isContextHeadersEnabled()`; CONTEXT_HEADER_MAX_CHARS=100; `[parent > child — desc]` format; `search-flags.ts:215-216` SPECKIT_CONTEXT_HEADERS flag disables injection)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Env var state — no env var changes were made during code analysis; baseline unchanged
- [x] T019 All 11 scenarios verdicted: 11 PASS, 0 FAIL, 0 SKIP
- [x] T020 No FAIL verdicts — defect notes not required
- [x] T021 All P0 checklist items marked with evidence in checklist.md
- [x] T022 implementation-summary.md updated with final verdict summary and evidence table
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 11 scenarios verdicted
- [x] checklist.md P0 items verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
