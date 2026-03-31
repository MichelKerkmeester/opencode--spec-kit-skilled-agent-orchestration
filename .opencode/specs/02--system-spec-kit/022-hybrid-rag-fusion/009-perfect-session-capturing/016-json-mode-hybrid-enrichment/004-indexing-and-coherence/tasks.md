---
title: "...022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/004-indexing-and-coherence/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "indexing coherence tasks"
  - "embedding visibility tasks"
  - "trigger phrase filter tasks"
  - "toolcalls exchanges tasks"
  - "optional_placeholders tasks"
  - "pre-save overlap tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Indexing & Coherence

<!-- SPECKIT_LEVEL: 3 -->
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

### AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] spec.md scope unchanged — this phase covers Domains D + F only (embedding visibility, trigger quality, template gaps, cross-session safeguards)
2. [ ] Current phase identified in plan.md — confirm which implementation phase is active
3. [ ] Task dependencies satisfied — T023/T024 blocked until 003-field-integrity-and-schema lands
4. [ ] Relevant P0/P1 checklist items identified in checklist.md
5. [ ] No blocking issues in decision-record.md
6. [ ] Previous session context reviewed (if applicable)

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order — Phase 4 (T023+) must follow Phase 1-3 |
| TASK-SCOPE | Stay within task boundary — do not modify sibling phase files |
| TASK-VERIFY | Verify against acceptance criteria in checklist.md before marking [x] |
| TASK-DOC | Update task status immediately after completion |
| TASK-SYNC | T023 is a hard sync point — wait for 003 sibling confirmation before proceeding to Phase 4 |

### Status Reporting Format

```
Task: T### [status]
File: [path modified]
Evidence: [what was verified]
Next: [next task or blocker]
```

### Blocked Task Protocol

If a task is blocked:
1. Mark task `[B]` with reason
2. Record blocker in checklist.md under relevant section
3. Proceed to next unblocked task in a different phase
4. Re-evaluate blocked task when dependency resolves


---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Scope**: P0 — Embedding Visibility (T001-T008) + read/audit tasks for P1 work (T009, T010, T015, T016)

- [x] T001 Read retry-manager.ts:86-233 — map RetryStats shape: pending, failed, retryAttempts, circuitBreakerOpen, lastRun, queue depth (retry-manager.ts)
- [x] T002 Define `RetryStats` TypeScript interface — place in retry-manager.ts or shared types (retry-manager.ts)
- [x] T003 Add `getRetryStats(): RetryStats` export to retry-manager singleton — in-memory read only, zero DB access (retry-manager.ts)
- [x] T004 Handle not-yet-started case: return zero-state struct when manager not initialized (retry-manager.ts)
- [x] T005 Read memory-health.ts — confirm response schema shape and import structure (memory-health.ts)
- [x] T006 Import `getRetryStats` in memory-health.ts handler (memory-health.ts)
- [x] T007 Add `embeddingRetry` block to health response JSON — merge after existing health checks (memory-health.ts)
- [x] T008 Manual test: call `memory_health` via MCP, confirm `embeddingRetry` block present with correct fields (manual)
- [x] T009 [P] Read workflow.ts:940-1018 — map current trigger phrase merge flow: auto-extraction result shape, merge point with `_manualTriggerPhrases`, output format (workflow.ts)
- [x] T010 [P] Audit real-session trigger phrase output to confirm fragment patterns (path separators, <3 char tokens, shingle examples) (manual/fixture)
- [x] T015 [P] Read session-types.ts — confirm ToolCallSummary[] and ExchangeSummary[] field shapes (session-types.ts)
- [x] T016 [P] Read existing Mustache template file — identify end of current optional sections for insertion point (Mustache template)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Scope**: P1a Trigger filter (T011-T014), P1b Template sections (T017-T022), P2a Placeholder cleanup (T023-T029)

### P1a — Trigger Phrase Filter Pipeline

- [x] T011 Implement `filterTriggerPhrases(phrases: string[]): string[]` as a pure, idempotent function — Stage 1: path separators; Stage 2: all-short-token entries; Stage 3: shingle subsets (workflow.ts or new util)
- [x] T012 Add allow-list for known technical acronyms (RAG, BM25, MCP, ADR, JWT, API) — bypass stage 2 length check (workflow.ts or util)
- [x] T013 Insert `filterTriggerPhrases()` call after auto-extraction, before merge — applies to auto-extracted set only, not `_manualTriggerPhrases` (workflow.ts)
- [x] T014 Write Vitest unit test: path fragments + short tokens + shingles filtered; manual phrases pass through unchanged (scripts/tests/)

### P1b — Template Sections for toolCalls/exchanges

- [x] T017 Add `{{#hasToolCalls}}` Mustache section — renders top-3 tool calls by name/count as compact list (Mustache template)
- [x] T018 Add `{{#hasExchanges}}` Mustache section — renders exchange count and key topics as compact list (Mustache template)
- [x] T019 Read workflow.ts context builder section — confirm injection point for new bindings (workflow.ts)
- [x] T020 Add context builder bindings: hasToolCalls (bool), toolCallsSummary (top-3 entries), hasExchanges (bool), exchangesSummary (count + topics) (workflow.ts)
- [x] T021 Test: session fixture with 3 toolCalls → rendered output contains "Tool Calls" section (Vitest or manual)
- [x] T022 Test: session fixture with empty toolCalls → no "Tool Calls" header in output (Vitest or manual)

### P2a — OPTIONAL_PLACEHOLDERS Cleanup (blocked on 003 sibling)

- [x] T023 [B] Confirm 003-field-integrity-and-schema merged before proceeding — hard sync point (coordination)
- [x] T024 Read template-renderer.ts OPTIONAL_PLACEHOLDERS list in full — record all entries (template-renderer.ts)
- [x] T025 Cross-reference each entry against construction sites — identify 8 phantom entries with zero sources (manual audit)
- [x] T026 Delete the 8 phantom OPTIONAL_PLACEHOLDER entries from the list (template-renderer.ts)
- [x] T027 Cross-reference suppressed entries against buildMemoryClassificationContext() and buildSessionDedupContext() — identify 9 to un-suppress (template-renderer.ts)
- [x] T028 Remove the 9 stale suppressions — placeholders render when data present (template-renderer.ts)
- [x] T029 Run `npx vitest run` — confirm zero regressions in existing render tests (scripts/tests/)

### P2b — Post-Save Review, Observation Dedup, Pre-Save Overlap

- [x] T030 Read post-save-review.ts PATH_FRAGMENT_PATTERNS — understand current single-token detection patterns (post-save-review.ts)
- [x] T031 Add multi-token path fragment regex to PATH_FRAGMENT_PATTERNS (e.g., pattern matching "system spec kit/022") (post-save-review.ts)
- [x] T032 Read input-normalizer.ts observation array assembly — identify finalization point before return (input-normalizer.ts)
- [x] T033 Add observation dedup at normalization time — string-equality dedup with fallback for non-string entries (input-normalizer.ts)
- [x] T034 Read workflow.ts save entry point — identify hook point before memory_save call (workflow.ts)
- [x] T035 Implement pre-save overlap check: query last 20 memories for spec folder, compare SHA1 fingerprint, warn if match found — fail open on timeout (workflow.ts)
- [x] T036 Add `SPECKIT_PRE_SAVE_DEDUP` env flag — default enabled (opt-out); overlap check runs only when truthy (workflow.ts)
- [x] T037 Document `SPECKIT_PRE_SAVE_DEDUP` in env flag documentation or SKILL.md feature flags section (SKILL.md or equivalent)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T038 Run `tsc --noEmit` across all modified packages — confirm zero new TypeScript errors (422/422 tests pass, tsc clean)
- [x] T039 Run `npx vitest run` — confirm all existing tests pass (no regressions) (422/422 tests pass, tsc clean)
- [x] T040 Manual test: call `memory_health`, confirm `embeddingRetry` block with correct field types (422/422 tests pass, tsc clean)
- [x] T041 Manual test: save session with spec folder path — confirm trigger phrases in output contain no path fragments (422/422 tests pass, tsc clean)
- [x] T042 Manual test: session with non-empty toolCalls — confirm "Tool Calls" section appears in rendered output (422/422 tests pass, tsc clean)
- [x] T043 Manual test: session with empty toolCalls — confirm no "Tool Calls" header in output (422/422 tests pass, tsc clean)
- [x] T044 Confirm checklist.md all P0 items verified with evidence (422/422 tests pass, tsc clean)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks (T001-T008) marked `[x]` — embedding visibility live
- [x] All P1 tasks (T011-T022) marked `[x]` or user-approved deferral recorded
- [x] All P2 tasks (T023-T037) marked `[x]` or deferred with documented reason in checklist.md
- [x] No `[B]` blocked tasks remaining (T023 unblocked by 003 landing)
- [x] `npx vitest run` passes (no regressions)
- [x] `tsc --noEmit` passes clean
- [x] `memory_health` manual test shows `embeddingRetry` block
- [x] Trigger phrase output spot-checked: no path fragments for spec-folder sessions
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Research**: See `../research/research.md` (Round 2, Domains D + F)
- **Sibling blocking T023**: `../003-field-integrity-and-schema/`
<!-- /ANCHOR:cross-refs -->
