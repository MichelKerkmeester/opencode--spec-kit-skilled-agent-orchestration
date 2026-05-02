---
title: "Tasks: query-in [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/012-query-intelligence/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 012 tasks"
  - "query intelligence tasks"
  - "query intelligence task tracker"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/012-query-intelligence"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: query-intelligence manual testing

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

- [x] T001 Load manual testing playbook and identify all 10 Phase 012 scenario rows with exact prompts and command sequences (`plan.md`)
- [x] T002 Confirm MCP runtime tool available: `memory_search` with `includeTrace: true` (`plan.md`)
- [x] T003 Confirm feature flag support for 161, 162, 163, 173 in the active runtime (`plan.md`) — flags confirmed in `search-flags.ts` and module-level flag guards
- [x] T004 Record baseline feature flag state for 033 and 037 fallback tests (`scratch/`) — `SPECKIT_COMPLEXITY_ROUTER` and `SPECKIT_DYNAMIC_TOKEN_BUDGET` default ON via `isFeatureEnabled`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Execute 033 — Query complexity router (R15): **PASS** — `query-router.ts` + `query-classifier.ts` implement tier-to-channel mapping (simple=2, moderate=3, complex=5 channels); `isComplexityRouterEnabled()` fallback returns all 5 channels when flag disabled (`scratch/`)
- [x] T006 [P] Execute 034 — RSF shadow mode (R14/N1): **PASS** — RSF confirmed dormant; module (`rsf-fusion.ts`), dedicated tests, and `rsfShadow` metadata field subsequently deleted in v3 remediation. `hybrid-search.ts` uses `fuseResultsMulti` (RRF) as sole live ranking method
- [x] T007 [P] Execute 035 — Channel min-representation (R2): **PASS** — `channel-representation.ts` implements `analyzeChannelRepresentation()` with `QUALITY_FLOOR=0.005`; `channel-enforcement.ts` wires it into `hybrid-search.ts` line 890; `isChannelMinRepEnabled()` default ON (`scratch/`)
- [x] T008 [P] Execute 036 — Confidence-based result truncation (R15-ext): **PASS** — `confidence-truncation.ts` implements `truncateByConfidence()` with median-gap heuristic and `DEFAULT_MIN_RESULTS=3`; `TruncationResult` contains `medianGap`/`cutoffGap`/`cutoffIndex`; `Sprint3PipelineMeta.truncation` metadata block defined in `hybrid-search.ts:155-165`; truncation metadata now wired into per-result `traceMetadata.confidenceTruncation` at `hybrid-search.ts:1121-1130` for `includeTrace` consumers (`scratch/`)
- [x] T009 [P] Execute 037 — Dynamic token budget allocation (FUT-7): **PASS** — `dynamic-token-budget.ts` implements `getDynamicTokenBudget()` with tiers simple=1500/moderate=2500/complex=4000; `applied=false` when flag disabled returns `DEFAULT_BUDGET=4000`; `Sprint3PipelineMeta.tokenBudget` metadata block defined in `hybrid-search.ts:166-175` (`scratch/`)
- [x] T010 [P] Execute 038 — Query expansion (R12): **PASS** — `query-expander.ts` implements `expandQuery()` with `DOMAIN_VOCABULARY_MAP` (rule-based, no LLM); returns max `MAX_VARIANTS=3` including original; dedup via `Set`; `stage1-candidate-gen.ts:444-506` runs parallel variants in deep mode. `buildDeepQueryVariants()` now checks `isExpansionActive(query)` at `stage1-candidate-gen.ts:189` to skip rule-based expansion for simple queries, consistent with R12 embedding-expansion path (`scratch/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Execute 161 — LLM Reformulation: **PASS** — `llm-reformulation.ts` implements full pipeline: `cheapSeedRetrieve()` (FTS5/BM25, no embedding), `llm.rewrite()` (step-back + corpus variants, max `MAX_VARIANTS=2`, `MIN_OUTPUT_LENGTH=5`), `REFORMULATION_TIMEOUT_MS=8000`, shared `LlmCache`, `normalizeQuery()` cache key; wired into `stage1-candidate-gen.ts:782-835` with `mode === 'deep' && isLlmReformulationEnabled()`; cache hit bypasses LLM call; non-deep queries bypass entirely (`scratch/`)
- [x] T012 Execute 162 — HyDE Shadow: **PASS** — `hyde.ts` implements `generateHyDE()` (pseudo-document + Float32Array embedding), `LOW_CONFIDENCE_THRESHOLD=0.45`, `HYDE_TIMEOUT_MS=8000`, shared `LlmCache`; `runHyDE()` checks `isHyDEEnabled()` and `lowConfidence(baseline)`; shadow mode: `isHyDEActive()` returns empty array when false; active mode merges candidates; wired in `stage1-candidate-gen.ts:849-869` with `mode === 'deep' && isHyDEEnabled()` (`scratch/`)
- [x] T013 Execute 163 — Query Surrogates: **PASS** — `query-surrogates.ts` implements full index-time pipeline: `extractAliases()`, `extractHeadings()`, `generateSummary()` (max `MAX_SUMMARY_LENGTH=200`), `generateSurrogateQuestions()` (2-5 entries), `generateSurrogates()` gated by `isQuerySurrogatesEnabled()`; `storeSurrogates()` wraps `surrogate-storage.ts`. `matchSurrogates()` implemented with 4-channel weighted scoring and `MIN_MATCH_THRESHOLD=0.15`. Now wired into Stage 1 at `stage1-candidate-gen.ts:963-1023` as post-candidate boost via `loadSurrogatesBatch()` + `matchSurrogates()`; boost capped at 0.15; trace entry emitted when matches found (`scratch/`)
- [x] T014 Execute 173 — Query Decomposition: **PASS** — `query-decomposer.ts` implements `isMultiFacet()` + `decompose()` with conjunction splitting and sentence-boundary detection, `MAX_FACETS=3`, no LLM calls; `stage1-candidate-gen.ts:393-441` wires decomposition with deep-mode gate (`mode === 'deep' && isQueryDecompositionEnabled() && isMultiFacet(query)`); graceful fallback on error; `buildQueryDecompositionPool()` at line 232 enforces `mode !== 'deep'` gate; original query not mutated (`scratch/`)

### Verdict and Verification

- [x] T015 Assign PASS/PARTIAL/FAIL verdict to all 10 scenarios using review protocol (`scratch/`) — see implementation-summary.md verdict table
- [x] T016 Complete all checklist items in `checklist.md` with evidence references (`checklist.md`)
- [x] T017 Write `implementation-summary.md` with verdict table and known limitations (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (or blocked status explicitly documented)
- [x] All 10 scenarios have a verdict with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence**: See `scratch/`
<!-- /ANCHOR:cross-refs -->

---
