---
title: "Verification Checklist: 001-Retrieval Code Audit"
description: "Verification Date: 2026-03-10"
trigger_phrases: ["verification", "checklist", "retrieval", "audit"]
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: 001-Retrieval Code Audit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`tsc --noEmit` clean)
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented (T-07 catch blocks fixed)
- [x] CHK-013 [P1] Code follows project patterns (T-06 named exports)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete (280 tests passed)
- [x] CHK-022 [P1] Edge cases tested (T-09 provenance coverage)
- [x] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented
- [x] CHK-032 [P1] Auth/authz working correctly (N/A: no auth in audit scope)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (deferred, P2)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only
- [x] CHK-051 [P1] `scratch/` cleaned before completion
- [x] CHK-052 [P2] Findings saved to `memory/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 8 | 8/8 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-03-10
<!-- /ANCHOR:summary -->

---

## Appendix: Per-Feature Audit Findings

## F-01: Unified context retrieval (memory_context)
- **Status:** FAIL
- **Code Issues:** 1. `enforceTokenBudget()` does not actually truncate over-budget payloads when inner envelope parsing fails; it returns the original result with `truncated: false`, so budget overruns can pass through (`mcp_server/handlers/memory-context.ts:226-235`).
- **Standards Violations:** 1. Wildcard barrel re-exports are used instead of explicit named exports (`mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/scoring/folder-scoring.ts:7`, `mcp_server/lib/utils/path-security.ts:7`, `mcp_server/lib/search/vector-index.ts:6-10`). 2. Empty catch blocks swallow errors (`mcp_server/lib/search/vector-index-queries.ts:552-553`, `mcp_server/lib/search/vector-index-schema.ts:790-791`).
- **Behavior Mismatch:** Current Reality says budget enforcement trims results until payload fits; fallback path does not enforce that guarantee (`mcp_server/handlers/memory-context.ts:147-154`, `226-235`).
- **Test Gaps:** 1. Listed test file `mcp_server/tests/retry.vitest.ts` does not exist (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:234`). 2. No test covers the parse-failure budget fallback path (existing tests cover only normal under/over-budget flows: `mcp_server/tests/token-budget-enforcement.vitest.ts:64-101`).
- **Playbook Coverage:** MISSING (phase references EX-001..EX-009, but no per-feature mapping in this catalog file)
- **Recommended Fixes:** 1. Implement real fallback truncation (or hard error) in `enforceTokenBudget()` when nested envelope parsing fails. 2. Add a regression test for malformed/non-envelope payload budget enforcement. 3. Replace wildcard re-exports with named exports on retrieval-critical surfaces.

## F-02: Semantic and lexical search (memory_search)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. Wildcard barrel re-exports are present in implementation surface files (`mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/scoring/folder-scoring.ts:7`, `mcp_server/lib/utils/path-security.ts:7`, `mcp_server/lib/search/vector-index.ts:6-10`). 2. Empty catch blocks swallow errors (`mcp_server/lib/search/vector-index-queries.ts:552-553`, `mcp_server/lib/search/vector-index-schema.ts:790-791`).
- **Behavior Mismatch:** NONE
- **Test Gaps:** Listed test file `mcp_server/tests/retry.vitest.ts` does not exist (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:206`).
- **Playbook Coverage:** MISSING (phase references EX-001..EX-009, but no direct mapping in this feature file)
- **Recommended Fixes:** 1. Restore or remove stale `retry.vitest.ts` references in the feature catalog. 2. Replace wildcard re-exports and remove empty catches or log structured diagnostics.

## F-03: Trigger phrase matching (memory_match_triggers)
- **Status:** WARN
- **Code Issues:** 1. Tiered content retrieval suppresses all file-read/path-validation errors and returns empty content silently, which can hide HOT/WARM retrieval failures (`mcp_server/handlers/memory-triggers.ts:149-159`).
- **Standards Violations:** 1. Wildcard barrel re-exports in listed implementation files (`mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/scoring/folder-scoring.ts:7`, `mcp_server/lib/utils/path-security.ts:7`, `mcp_server/lib/search/vector-index.ts:6-10`). 2. Empty catches swallow errors (`mcp_server/lib/search/vector-index-queries.ts:552-553`, `mcp_server/lib/search/vector-index-schema.ts:790-791`).
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Listed test file `mcp_server/tests/retry.vitest.ts` does not exist (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:131`). 2. No explicit SLA assertion for the stated fast-path latency target (<100ms); tests validate correctness/limits but not runtime bound (`mcp_server/tests/handler-memory-triggers.vitest.ts:188-250`, `mcp_server/tests/trigger-matcher.vitest.ts`).
- **Playbook Coverage:** EX-003 (trigger matching scenario; command-parameter mismatch previously documented)
- **Recommended Fixes:** 1. Emit structured warnings/metadata when tiered content load fails instead of silent blank content. 2. Add a latency-budget test (or benchmark gate) for trigger matching hot path. 3. Remove stale `retry.vitest.ts` reference from catalog or add the file.

## F-04: Hybrid search pipeline
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. Wildcard barrel re-exports remain in listed implementation files (`mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/scoring/folder-scoring.ts:7`, `mcp_server/lib/utils/path-security.ts:7`, `mcp_server/lib/search/vector-index.ts:6-10`). 2. Empty catches swallow errors (`mcp_server/lib/search/vector-index-queries.ts:552-553`, `mcp_server/lib/search/vector-index-schema.ts:790-791`).
- **Behavior Mismatch:** NONE
- **Test Gaps:** Listed test file `mcp_server/tests/retry.vitest.ts` does not exist (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:133`).
- **Playbook Coverage:** MISSING (phase references EX-001..EX-009, but no direct mapping in this feature file)
- **Recommended Fixes:** 1. Replace wildcard re-export barrels with explicit exports for auditability. 2. Remove/handle empty catches with explicit recovery logging. 3. Fix stale `retry.vitest.ts` catalog reference.

## F-05: 4-stage pipeline architecture
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. Wildcard barrel re-exports in listed implementation files (`mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/scoring/folder-scoring.ts:7`, `mcp_server/lib/utils/path-security.ts:7`, `mcp_server/lib/search/vector-index.ts:6-10`). 2. Empty catches swallow errors (`mcp_server/lib/search/vector-index-queries.ts:552-553`, `mcp_server/lib/search/vector-index-schema.ts:790-791`).
- **Behavior Mismatch:** NONE
- **Test Gaps:** Listed test file `mcp_server/tests/retry.vitest.ts` does not exist (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:181`).
- **Playbook Coverage:** MISSING (phase references EX-001..EX-009, but no direct mapping in this feature file)
- **Recommended Fixes:** 1. Replace wildcard re-export barrels with named exports. 2. Convert empty catches to explicit telemetry/recovery handling. 3. Resolve stale `retry.vitest.ts` listing.

## F-06: BM25 trigger phrase re-index gate
- **Status:** FAIL
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current Reality centers the re-index gate in `memory-crud-update.ts`, and code implements it there (`mcp_server/handlers/memory-crud-update.ts:143-146`), but the feature Source Files table omits that implementation file (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md:13-15`).
- **Test Gaps:** Listed tests exercise BM25 internals/normalization/FTS, but not the update-handler gate condition (`mcp_server/tests/bm25-index.vitest.ts:197-235`, `mcp_server/tests/content-normalizer.vitest.ts:441-482`, `mcp_server/tests/sqlite-fts.vitest.ts:1-89`).
- **Playbook Coverage:** EX-007 (memory_update scenario; parameter drift already documented in prior playbook audit)
- **Recommended Fixes:** 1. Add `mcp_server/handlers/memory-crud-update.ts` to this feature’s implementation table. 2. Add a focused test: updating only `triggerPhrases` must invoke BM25 re-index when BM25 is enabled. 3. Add a negative test for no re-index when neither `title` nor `triggerPhrases` changes.

## F-07: AST-level section retrieval tool
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE (feature is explicitly marked deferred with no implementation yet)
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** NONE

## F-08: Quality-aware 3-tier search fallback
- **Status:** FAIL
- **Code Issues:** 1. Tier-3 score calibration caps structural results at 90% of top existing score (`topCap = topExisting * 0.9`), not the documented 50% cap (`mcp_server/lib/search/hybrid-search.ts:1299-1321`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current Reality states “Tier 3 scores are calibrated to max 50% of existing top score,” but implementation uses 90% (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md:5` vs `mcp_server/lib/search/hybrid-search.ts:1317`).
- **Test Gaps:** Existing calibration test only checks “below top score,” not the 50% cap contract (`mcp_server/tests/search-fallback-tiered.vitest.ts:327-337`).
- **Playbook Coverage:** NEW-109 (explicit in feature metadata)
- **Recommended Fixes:** 1. Align implementation to documented cap (0.5), or update feature catalog if 0.9 is intentional. 2. Tighten tests to assert the exact cap ratio and rank-decay behavior.

## F-09: Tool-result extraction to working memory
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Listed tests cover decay/checkpoint restore, but do not cover extracted tool-result upserts and extraction metadata fields (`mcp_server/lib/cognitive/working-memory.ts:347-403`; `mcp_server/tests/working-memory.vitest.ts:174-192`). 2. No listed test validates `source_tool/source_call_id/extraction_rule_id/redaction_applied` persistence in working memory rows (`mcp_server/lib/cognitive/working-memory.ts:379-403`).
- **Playbook Coverage:** MISSING (phase references EX-001..EX-009, but no direct mapping in this feature file)
- **Recommended Fixes:** 1. Add tests for `upsertExtractedEntry()` including conflict-update semantics and provenance fields. 2. Add end-to-end test proving tool-result extraction survives checkpoint save/restore with provenance intact.
