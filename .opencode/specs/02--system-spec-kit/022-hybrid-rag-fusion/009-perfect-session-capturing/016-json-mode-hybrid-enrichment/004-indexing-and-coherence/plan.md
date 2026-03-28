---
title: "Implementation Plan: Indexing & Coherence — Embedding Visibility, Trigger Quality, Template Gaps, Cross-Session Validation"
description: "Five-file implementation across MCP handler and pipeline scripts: expose RetryStats in memory_health, add trigger phrase filter pipeline, bind toolCalls/exchanges to Mustache renderer, clean OPTIONAL_PLACEHOLDERS, add observation dedup and pre-save overlap check."
trigger_phrases:
  - "indexing coherence implementation plan"
  - "retry stats memory health plan"
  - "trigger phrase filter pipeline"
  - "toolCalls exchanges mustache template"
  - "OPTIONAL_PLACEHOLDERS cleanup"
  - "pre-save overlap check plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Indexing & Coherence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server + pipeline scripts) |
| **Framework** | Node.js, Mustache template renderer, SQLite via better-sqlite3 |
| **Storage** | SQLite (memory_index DB via retry-manager) |
| **Testing** | Vitest (existing test suite in scripts/tests/) |

### Overview

This phase modifies five files across two subsystems: the MCP server handler (memory-health.ts) and the pipeline scripts (workflow.ts, template-renderer.ts, post-save-review.ts, input-normalizer.ts). The P0 work adds a RetryStats accessor to the retry manager and wires it into the `memory_health` response. The P1 work builds a multi-stage trigger phrase filter at the workflow.ts merge point and adds Mustache template sections for two previously-discarded CollectedDataBase fields. The P2 work cleans up the OPTIONAL_PLACEHOLDERS list, adds multi-token path fragment detection to post-save review, adds a pre-save overlap fingerprint query, and moves observation dedup earlier in the normalization pipeline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in spec.md
- [x] Research findings cited with file:line references (research/research.md Round 2)
- [x] Sibling phase 003 landing plan confirmed (template-renderer.ts conflict avoidance)
- [x] retry-manager.ts reviewed — stats shape identified (retry-manager.ts:86-233)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001, REQ-002)
- [ ] All P1 acceptance criteria met (REQ-003 through REQ-008) or user-approved deferral on record
- [ ] TypeScript compiles without new errors (`tsc --noEmit`)
- [ ] Existing Vitest test suite passes (no regressions)
- [ ] memory_health manual test shows embeddingRetry block
- [ ] Trigger phrase output for a spec-folder session contains no path fragments
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pipeline Extension — each change is additive to an existing processing stage; no new abstractions or subsystems introduced.

### Key Components

- **retry-manager.ts**: Background embedding job with circuit breaker. Will gain a `getRetryStats()` accessor returning a typed RetryStats interface. No change to job logic.
- **memory-health.ts (MCP handler)**: Existing health aggregator. Will import and call `getRetryStats()` and merge result into health response JSON.
- **workflow.ts trigger merge (lines 940-1018)**: Existing phrase merge point. Will gain a filter step between auto-extraction and final merge — path fragments, short tokens, shingle subsets removed.
- **workflow.ts context builder**: Existing template context assembly. Will gain bindings for `toolCalls` and `exchanges` fields from CollectedDataBase, guarded by non-empty checks.
- **template-renderer.ts OPTIONAL_PLACEHOLDERS**: Static list of suppressed placeholder tokens. Phantom entries deleted; active-source suppressions removed.
- **post-save-review.ts**: Existing path fragment pattern list. Extended with multi-token regex patterns.
- **input-normalizer.ts**: Existing observation array assembly. Dedup step inserted after array is built, before returning normalized data.

### Data Flow

```
[RetryStats path]
retry-manager.ts (getRetryStats) → memory-health.ts handler → MCP response embeddingRetry block

[Trigger filter path]
auto-extraction (n-gram depth 4) → filter pipeline (path frag → short token → shingle) → merge with _manualTriggerPhrases → frontmatter

[Template binding path]
CollectedDataBase.toolCalls/exchanges → workflow.ts context builder → Mustache template section → rendered memory output

[OPTIONAL_PLACEHOLDERS path]
template-renderer.ts static list → remove 8 phantom entries → remove 9 stale suppressions → placeholders render when data present

[Observation dedup path]
input-normalizer.ts observation array build → dedup by string equality → normalized output (before render)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P0 — Embedding Visibility (memory-health.ts + retry-manager.ts)

- [ ] Read retry-manager.ts:86-233 to confirm RetryStats shape (pending, failed, retryAttempts, circuitBreakerOpen, lastRun)
- [ ] Add `getRetryStats(): RetryStats` export to retry-manager.ts
- [ ] Define `RetryStats` interface in shared types or inline in retry-manager.ts
- [ ] Read memory-health.ts to confirm response schema and injection point
- [ ] Import `getRetryStats` in memory-health.ts handler
- [ ] Add `embeddingRetry` block to health response, merged after existing checks
- [ ] Manual verification: call `memory_health` and confirm new block appears

### Phase 2: P1a — Trigger Phrase Filter (workflow.ts:940-1018)

- [ ] Read workflow.ts:940-1018 to map current merge flow
- [ ] Implement `filterTriggerPhrases(phrases: string[]): string[]` as a pure function
  - Stage 1: remove entries matching path fragment patterns (slash, backslash, multi-word path segments)
  - Stage 2: remove entries where every word is under 3 characters
  - Stage 3: remove n-gram phrases that are substrings of longer retained phrases
- [ ] Insert filter call after auto-extraction, before merge with `_manualTriggerPhrases`
- [ ] Ensure `_manualTriggerPhrases` bypass the filter (applied only to auto-extracted set)
- [ ] Add unit test: given phrases with path fragments + short tokens, assert filtered output is clean

### Phase 3: P1b — Template Sections for toolCalls/exchanges (workflow.ts + Mustache template)

- [ ] Read session-types.ts to confirm ToolCallSummary[] and ExchangeSummary[] field shapes
- [ ] Read existing Mustache template file to identify insertion point for new optional sections
- [ ] Add `{{#hasToolCalls}}...{{/hasToolCalls}}` section rendering top-3 tool calls by name/count
- [ ] Add `{{#hasExchanges}}...{{/hasExchanges}}` section rendering exchange count and key topics
- [ ] Read workflow.ts context builder section to identify where to bind new fields
- [ ] Add `hasToolCalls`, `toolCallsSummary`, `hasExchanges`, `exchangesSummary` to template context
- [ ] Test: session with non-empty toolCalls produces section in output; empty toolCalls produces no header

### Phase 4: P2a — OPTIONAL_PLACEHOLDERS Cleanup (template-renderer.ts)

- [ ] Read template-renderer.ts OPTIONAL_PLACEHOLDERS list in full
- [ ] Cross-reference each entry against all construction sites (workflow.ts, collect-session-data.ts) — identify the 8 with zero sources
- [ ] Delete the 8 phantom entries
- [ ] Cross-reference the 9 suppressed entries against buildMemoryClassificationContext() and buildSessionDedupContext() output keys
- [ ] Remove the 9 stale suppressions
- [ ] Run existing render tests — verify no regressions

### Phase 5: P2b — Post-Save Review + Observation Dedup + Pre-Save Overlap (post-save-review.ts, input-normalizer.ts, workflow.ts)

- [ ] Read post-save-review.ts PATH_FRAGMENT_PATTERNS — add multi-token pattern (e.g., `/\w+[\s/-]+\w+[\s/-]+\d+/`)
- [ ] Read input-normalizer.ts observation array assembly — identify insertion point for dedup
- [ ] Add dedup: `observations = [...new Set(observations)]` or equivalent for non-string-safe arrays
- [ ] Read workflow.ts save entry point — identify where pre-save check should be injected
- [ ] Implement pre-save fingerprint query: fetch last 20 memories for spec folder, compare SHA1 fingerprint, warn if match found
- [x] Guard with `SPECKIT_PRE_SAVE_DEDUP` env flag (default: enabled, opt-out via false); log warning, do not block save
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `filterTriggerPhrases()` function with path fragments, short tokens, shingle inputs | Vitest |
| Unit | Mustache template rendering with non-empty and empty toolCalls/exchanges | Vitest |
| Unit | Observation dedup at normalization time — duplicates removed, unique preserved | Vitest |
| Integration | `memory_health` response shape includes embeddingRetry block | Manual MCP call |
| Integration | Full pipeline save with spec folder path — trigger phrases in output contain no fragments | Manual + inspect |
| Regression | All existing Vitest tests pass unchanged after OPTIONAL_PLACEHOLDERS cleanup | `npx vitest run` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003-field-integrity-and-schema | Internal sibling phase | Coordinate — template-renderer.ts changes may conflict | Merge conflict on OPTIONAL_PLACEHOLDERS; resolve by landing 003 first |
| retry-manager.ts stats shape | Internal codebase | Green — identified at lines 86-233 | Cannot build RetryStats interface without confirmed shape |
| session-types.ts ToolCallSummary/ExchangeSummary | Internal codebase | Green — types exist, confirm exact field names | Cannot bind template context without confirmed field shapes |
| SPECKIT_PRE_SAVE_DEDUP env flag | Internal convention | New — must be added to env flag documentation | Pre-save overlap check cannot be safely deployed without flag |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression in memory rendering output, or memory_health response schema breaks downstream consumers
- **Procedure**: Revert template-renderer.ts OPTIONAL_PLACEHOLDERS to prior state via git revert on the specific commit; RetryStats addition is additive-only and does not require rollback
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (P0 Embedding Visibility) ──────────────────────────────────┐
                                                                     ├──► Phase 4 (P2a Placeholders) ──► Phase 5 (P2b Cleanup)
Phase 2 (P1a Trigger Filter) ───┐                                    │
                                ├──► (independent, can parallel) ───┘
Phase 3 (P1b Template Sections) ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (RetryStats) | None | None (additive) |
| Phase 2 (Trigger filter) | None | None |
| Phase 3 (Template sections) | session-types.ts confirmed | None |
| Phase 4 (Placeholder cleanup) | 003 sibling landed | Phase 5 |
| Phase 5 (P2b misc) | Phase 4 complete | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 — RetryStats | Medium | 1-2 hours |
| Phase 2 — Trigger filter | Medium | 2-3 hours |
| Phase 3 — Template sections | High | 3-4 hours |
| Phase 4 — Placeholder cleanup | Low | 1-2 hours |
| Phase 5 — P2b misc (3 items) | Medium | 2-3 hours |
| **Total** | | **9-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] TypeScript compiles clean (`tsc --noEmit` on affected packages)
- [ ] Vitest suite green
- [ ] memory_health manual test captures new response shape
- [ ] Trigger phrase filter output spot-checked on real session fixture

### Rollback Procedure
1. Revert RetryStats addition in memory-health.ts (git revert specific commit) — MCP response schema returns to previous shape
2. Revert trigger phrase filter in workflow.ts — auto-extracted phrases pass through unfiltered (regression to noisy state, not data loss)
3. Revert template section additions in Mustache template and workflow.ts context builder — toolCalls/exchanges silently discarded again (same as current state)
4. Revert OPTIONAL_PLACEHOLDERS list to pre-cleanup version — phantom entries return (no functional regression, only cosmetic)
5. Revert observation dedup in input-normalizer.ts — duplicates preserved (same as current state)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — all changes are additive or cleanup; no stored data is modified
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────────┐     ┌──────────────────────────┐
│  Phase 1                 │     │  Phase 2                 │
│  RetryStats / health.ts  │     │  Trigger phrase filter   │
│  (P0)                    │     │  workflow.ts:940-1018     │
└──────────────────────────┘     └──────────────────────────┘
         │                                  │
         │  (independent)                   │  (independent)
         └──────────────┬───────────────────┘
                        │
               ┌────────▼────────┐
               │  Phase 3        │
               │  Template       │
               │  toolCalls/     │
               │  exchanges      │
               └────────┬────────┘
                        │
               ┌────────▼────────┐     ┌─────────────────────┐
               │  Phase 4        │────►│  Phase 5            │
               │  Placeholder    │     │  Post-save review   │
               │  cleanup        │     │  Obs dedup          │
               │  (after 003)    │     │  Pre-save overlap   │
               └─────────────────┘     └─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (RetryStats) | retry-manager.ts shape confirmed | embeddingRetry in health response | None |
| Phase 2 (Trigger filter) | workflow.ts line map | Cleaner auto-extracted phrases | None |
| Phase 3 (Template sections) | session-types.ts confirmed | toolCalls/exchanges in output | None |
| Phase 4 (Placeholder cleanup) | 003 sibling landed | Cleaner render, un-masked fields | Phase 5 |
| Phase 5 (P2b) | Phase 4 | Multi-token fragment detection, obs dedup, overlap check | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Read retry-manager.ts:86-233** — confirm RetryStats shape — 30 min — CRITICAL
2. **Phase 1: Add getRetryStats() + wire to memory-health.ts** — 1-2 hours — CRITICAL
3. **Phase 2: filterTriggerPhrases() implementation + insertion** — 2-3 hours — CRITICAL
4. **Phase 3: Mustache sections + context bindings** — 3-4 hours — CRITICAL (requires session-types.ts read)
5. **Phase 4: Placeholder audit + cleanup** — 1-2 hours (after 003 sibling)
6. **Phase 5: P2b misc items** — 2-3 hours

**Total Critical Path**: ~7-11 hours (Phases 1-3 are independent and can parallelize)

**Parallel Opportunities**:
- Phase 1 (RetryStats) and Phase 2 (Trigger filter) are fully independent
- Phase 2 (Trigger filter) and Phase 3 (Template sections) are independent once file reads are done
- Phase 4 and Phase 5 must sequence after 003 sibling lands
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Embedding visibility complete | `memory_health` returns embeddingRetry block | End of Phase 1 |
| M2 | Trigger phrase quality enforced | No path fragments in auto-extracted output for spec folder sessions | End of Phase 2 |
| M3 | Template data loss eliminated | toolCalls and exchanges appear in rendered output | End of Phase 3 |
| M4 | Placeholder cleanup complete | 8 phantoms removed; 9 suppressions lifted; render tests green | End of Phase 4 |
| M5 | Cross-session safeguards added | Obs dedup active; pre-save overlap check warn-only; multi-token fragment detection in review | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: RetryStats Exposed as Accessor, Not Event Bus

**Status**: Accepted

**Context**: We needed to surface embedding retry statistics to the memory_health MCP handler. The retry manager runs a background job on a 5-minute interval and maintains state in-memory (pending queue, failure counts, circuit breaker). The question was whether to expose stats via a pull accessor, a push event, or by querying the DB directly.

**Decision**: Add a `getRetryStats()` pull accessor to retry-manager.ts. The MCP handler calls it synchronously when building the health response.

**Consequences**:
- Operator can observe current retry state on-demand via memory_health — no log tailing
- Accessor must be kept lightweight (in-memory read only, no DB query) to meet the 50ms NFR
- If retry manager is not started (e.g., in test environments), accessor returns zero-state struct — no error thrown

**Alternatives Rejected**:
- Query embedding_status table directly in handler: couples handler to DB schema, adds latency, races with background job
- Push via event emitter: adds complexity, async timing mismatch with synchronous health response
