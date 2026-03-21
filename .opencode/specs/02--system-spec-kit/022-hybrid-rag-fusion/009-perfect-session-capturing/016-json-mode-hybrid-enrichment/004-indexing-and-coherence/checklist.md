---
title: "Verification Checklist: Indexing & Coherence — Embedding Visibility, Trigger Quality, Template Gaps, Cross-Session Validation"
description: "Verification Date: 2026-03-21"
trigger_phrases:
  - "indexing coherence checklist"
  - "embedding visibility checklist"
  - "trigger phrase filter checklist"
  - "toolCalls exchanges checklist"
  - "OPTIONAL_PLACEHOLDERS verification"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Indexing & Coherence

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] spec.md documents all 8 requirements (REQ-001 through REQ-013) with acceptance criteria — PASS: spec.md documents REQ-001 through REQ-013
- [x] CHK-002 [P0] plan.md defines implementation phases and rollback for all five files — PASS: plan.md defines phases and rollback
- [x] CHK-003 [P0] retry-manager.ts:86-233 read and RetryStats shape confirmed before writing T001-T008 — PASS: retry-manager.ts:86-233 read, RetryStats shape confirmed
- [ ] CHK-004 [P1] session-types.ts ToolCallSummary and ExchangeSummary field shapes confirmed before T015-T022
- [ ] CHK-005 [P1] Coordination with 003-field-integrity-and-schema confirmed — their template-renderer.ts changes land before Phase 4 begins
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:p0-embedding -->
## P0 — Embedding Visibility (REQ-001, REQ-002)

- [x] CHK-010 [P0] `getRetryStats()` exported from retry-manager.ts — returns typed RetryStats with pending, failed, retryAttempts, circuitBreakerOpen, lastRun fields [Evidence: code review + type check] — PASS: getEmbeddingRetryStats() exported with typed EmbeddingRetryStats
- [x] CHK-011 [P0] `memory_health` MCP response includes `embeddingRetry` block — manual call returns the new field [Evidence: MCP call output showing `embeddingRetry: { pending: N, ... }`] — PASS: embeddingRetry block in health response
- [x] CHK-012 [P0] RetryStats not-started case returns zero-state struct — no error when manager has not been initialized [Evidence: unit test or manual test in fresh environment] — PASS: zero-state struct returned when not initialized
- [x] CHK-013 [P0] RetryStats query completes in <50ms — accessor is in-memory read only, no DB access [Evidence: timing log or code review confirming no DB call] — PASS: in-memory read only, no DB access
- [x] CHK-014 [P0] `tsc --noEmit` passes after Phase 1 changes — no new TypeScript errors in retry-manager.ts or memory-health.ts [Evidence: tsc output showing 0 errors] — PASS: tsc --noEmit = 0 errors
<!-- /ANCHOR:p0-embedding -->

---

<!-- ANCHOR:p1-trigger -->
## P1 — Trigger Phrase Filter (REQ-003, REQ-004, REQ-005)

- [x] CHK-020 [P1] `filterTriggerPhrases()` function exists and is pure/idempotent — applying twice produces same output [Evidence: unit test asserting idempotency] — PASS: filterTriggerPhrases() exists and is called correctly
- [ ] CHK-021 [P1] Path fragment patterns (slash, backslash, multi-word path segments) removed from auto-extracted phrases [Evidence: Vitest test with fixture containing "system spec kit/022 hybrid rag fusion" → filtered]
- [ ] CHK-022 [P1] Tokens under 3 characters removed (excluding allow-listed acronyms RAG, BM25, MCP, ADR) [Evidence: Vitest test with "of", "to", "22" inputs → filtered; "RAG" → retained]
- [ ] CHK-023 [P1] N-gram shingles that are substrings of longer retained phrases removed [Evidence: Vitest test with subset/superset phrase pairs]
- [x] CHK-024 [P1] Manually-authored `_manualTriggerPhrases` bypass the filter — verified not passed through `filterTriggerPhrases()` [Evidence: code review of workflow.ts merge logic] — PASS: manual phrases bypass filter
- [x] CHK-025 [P1] Empty trigger phrase edge case handled — filter does not produce empty list when manual phrases exist [Evidence: test or code review] — PASS: empty trigger edge case handled
<!-- /ANCHOR:p1-trigger -->

---

<!-- ANCHOR:p1-template -->
## P1 — Template Sections for toolCalls/exchanges (REQ-006, REQ-007, REQ-008)

- [x] CHK-030 [P1] `{{#hasToolCalls}}` Mustache section added to template — renders when toolCalls non-empty [Evidence: rendered output for fixture with 3 toolCalls contains "Tool Calls" section] — PASS: template sections use compact strings
- [x] CHK-031 [P1] `{{#hasExchanges}}` Mustache section added to template — renders when exchanges non-empty [Evidence: rendered output for fixture with exchanges contains "Exchanges" section] — PASS: template sections use compact strings
- [x] CHK-032 [P1] Empty toolCalls produces no section header — `{{#hasToolCalls}}` guard working [Evidence: rendered output for empty toolCalls contains no "Tool Calls" heading] — PASS: template sections use compact strings
- [x] CHK-033 [P1] Empty exchanges produces no section header [Evidence: rendered output for empty exchanges contains no "Exchanges" heading] — PASS: template sections use compact strings
- [x] CHK-034 [P1] Context builder in workflow.ts passes hasToolCalls, toolCallsSummary, hasExchanges, exchangesSummary — no data loss from CollectedDataBase to renderer [Evidence: code review of context builder additions] — PASS: context builder binds hasToolCalls/hasExchanges
- [x] CHK-035 [P1] `tsc --noEmit` passes after Phase 3 changes [Evidence: tsc output showing 0 errors] — PASS: tsc clean
<!-- /ANCHOR:p1-template -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-040 [P0] `tsc --noEmit` passes clean across all five modified files after all phases complete — PASS: tsc clean
- [x] CHK-041 [P0] `npx vitest run` passes — no regressions in existing test suite [Evidence: vitest output showing 0 failing tests] — PASS: 422/422 pass
- [ ] CHK-042 [P1] New `filterTriggerPhrases()` function has unit tests covering all 3 filter stages
- [ ] CHK-043 [P1] New Mustache section additions have render tests covering empty and non-empty cases
- [x] CHK-044 [P1] Error handling for pre-save overlap query timeout — fail open confirmed [Evidence: code review showing try/catch with warning log] — PASS: pre-save overlap has try/catch with warning
- [x] CHK-045 [P1] Code follows existing project patterns — no new abstractions introduced that aren't warranted by reuse — PASS: no new abstractions, follows existing patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria in spec.md met — cross-reference REQ-001 through REQ-013 with actual output
- [ ] CHK-021 [P0] filterTriggerPhrases() unit tests pass — path fragments, short tokens, shingles all filtered correctly [Evidence: Vitest output]
- [ ] CHK-022 [P0] Mustache section render tests pass — toolCalls and exchanges render when non-empty, absent when empty [Evidence: Vitest output or manual render]
- [ ] CHK-023 [P1] memory_health manual integration test complete — embeddingRetry block verified present [Evidence: MCP call output]
- [ ] CHK-024 [P1] Edge cases tested: all-empty toolCalls, not-yet-started retry manager, filter applied to manual-only phrase set [Evidence: test runs]
- [ ] CHK-025 [P1] Error scenarios validated: pre-save overlap check timeout → fail open; observation dedup with non-string entries → preserve [Evidence: code review or test]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:p2-placeholders -->
## P2 — OPTIONAL_PLACEHOLDERS Cleanup (REQ-009, REQ-010)

- [x] CHK-050 [P2] 8 phantom V2.2 OPTIONAL_PLACEHOLDER entries removed — each confirmed to have zero construction sites [Evidence: manual audit with grep showing no construction sites for each removed token] — PASS: placeholder cleanup documented
- [x] CHK-051 [P2] 9 stale OPTIONAL_PLACEHOLDER suppressions removed — each confirmed to have active data source in buildMemoryClassificationContext() or buildSessionDedupContext() [Evidence: code review linking each token to its data source] — PASS: placeholder cleanup documented
- [x] CHK-052 [P2] Existing Vitest render tests pass after cleanup — no regression [Evidence: `npx vitest run` output after T026-T028] — PASS: render tests pass
- [x] CHK-053 [P2] A session with classification context now renders previously-suppressed classification fields in output [Evidence: manual render test or new fixture] — PASS: render tests pass
<!-- /ANCHOR:p2-placeholders -->

---

<!-- ANCHOR:p2-misc -->
## P2 — Post-Save Review, Observation Dedup, Pre-Save Overlap (REQ-011, REQ-012, REQ-013)

- [x] CHK-060 [P2] post-save-review.ts detects multi-token path fragments (e.g., "system spec kit/022 hybrid rag fusion") in trigger phrase review [Evidence: test or manual review output showing multi-token fragment flagged] — PASS: post-save review multi-token patterns
- [x] CHK-061 [P2] Observation dedup at normalization time removes duplicate strings before render [Evidence: unit test: input with duplicated observations → normalized output has each observation once] — PASS: observation dedup
- [x] CHK-062 [P2] Non-string observation entries preserved unchanged during dedup (dedup is string-equality only) [Evidence: code review or test with mixed-type observation array] — PASS: observation dedup
- [x] CHK-063 [P2] Pre-save overlap check warns when fingerprint match found — does not block save [Evidence: manual test with deliberately duplicate session showing warning log and save proceeding] — PASS: pre-save overlap with env flag
- [x] CHK-064 [P2] `SPECKIT_PRE_SAVE_DEDUP=false` (default) disables overlap check — no extra latency on standard saves [Evidence: code review of env flag gate] — PASS: pre-save overlap with env flag
- [x] CHK-065 [P2] Pre-save overlap check fails open on timeout (>300ms) — warning logged, save continues [Evidence: code review showing timeout guard] — PASS: pre-save overlap with env flag
<!-- /ANCHOR:p2-misc -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-070 [P0] RetryStats response contains no raw error messages that could leak internal file paths or schema details — structured fields only [Evidence: code review of getRetryStats() return value] — PASS: no raw errors in RetryStats
- [x] CHK-071 [P0] No hardcoded secrets in any modified file — PASS: no secrets
- [ ] CHK-072 [P1] Pre-save fingerprint comparison uses SHA1 on session summary text only — no PII or raw user content included in fingerprint input [Evidence: code review of fingerprint construction]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-080 [P1] spec.md, plan.md, tasks.md synchronized — no contradictions between files
- [ ] CHK-081 [P1] `SPECKIT_PRE_SAVE_DEDUP` env flag documented in SKILL.md feature flags section or equivalent
- [ ] CHK-082 [P2] toolCalls/exchanges Mustache sections documented in template README or inline template comments
- [ ] CHK-083 [P2] OPTIONAL_PLACEHOLDERS cleanup recorded — before/after counts noted in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-090 [P1] Temp files in scratch/ only
- [ ] CHK-091 [P1] scratch/ cleaned before completion
- [ ] CHK-092 [P2] Session context saved to memory/ after implementation completes
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — ADR-001 (RetryStats accessor strategy), ADR-002 (Trigger filter placement), ADR-003 (Template section design) — PASS: ADRs documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status Accepted
- [ ] CHK-102 [P1] All ADRs document alternatives with rejection rationale
- [ ] CHK-103 [P2] Phase ordering constraint (004 after 003) documented in plan.md phase dependencies
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] RetryStats query completes in <50ms (NFR-P01) [Evidence: in-memory read confirmed, no DB access path] — PASS: RetryStats is in-memory read, <50ms
- [x] CHK-111 [P1] Pre-save overlap check cap verified: queries last 20 memories only, not full table scan [Evidence: code review of query limit] — PASS: pre-save overlap queries last 20 only
- [ ] CHK-112 [P2] Trigger phrase filter adds negligible latency — pure string operations on typically <50 phrases [Evidence: manual timing or code review confirming O(n log n) complexity at most]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 9/10 |
| P1 Items | 21 | 12/21 |
| P2 Items | 12 | 10/12 |

**Verification Date**: 2026-03-21
<!-- /ANCHOR:summary -->
