---
title: ".../022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/004-indexing-and-coherence/spec]"
description: "Four domains of the generate-context.js pipeline are degraded: embedding retry stats are invisible to operators, trigger phrase extraction produces 15-30 noisy phrases per memory that pollute binary matching, 15+ AI-composed fields are silently discarded by the template renderer, and cross-session deduplication is AI-dependent with zero automated verification of referenced memory IDs or causal links."
trigger_phrases:
  - "indexing and coherence"
  - "embedding visibility"
  - "retry stats memory health"
  - "trigger phrase quality filtering"
  - "template consumption gaps"
  - "cross-session coherence"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Indexing & Coherence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Four structural gaps in the generate-context.js memory pipeline degrade indexing quality and cross-session coherence without surfacing any observable errors. Embedding retry failures are silently tracked by a background job but never exposed through MCP tooling, leaving operators blind to vector-search degradation. Trigger phrase extraction produces 15-30 noisy phrases per memory dominated by path fragments and n-gram shingles, causing binary trigger matching to return low-quality results. The Mustache template renderer silently discards 15+ AI-composed fields (toolCalls, exchanges, pipeline flags), while 8 phantom V2.2 placeholders are always empty and 9 valid data-source bindings are suppressed. Cross-session dedup is purely AI-assisted: referenced memory IDs are never validated, causal links receive no graph verification, and observation arrays are deduped only within a single render pass.

**Key Decisions**: Extend `memory_health` response schema to include RetryStats; add a multi-stage trigger phrase filter pipeline at workflow.ts merge time.

**Critical Dependencies**: 003-field-integrity-and-schema phase (template-renderer.ts changes must not conflict); retry-manager.ts must expose a stats interface without coupling to the MCP handler.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0/P1/P2 (mixed — see requirements) |
| **Status** | Complete |
| **Created** | 2026-03-21 |
| **Branch** | `016-json-mode-hybrid-enrichment` |
| **Phase** | 004 of 004 in `016-json-mode-hybrid-enrichment` |
| **Parent Spec** | `../spec.md` |
| **Siblings** | 001-initial-enrichment (done), 002-scoring-and-filter, 003-field-integrity-and-schema |
| **Research** | `../research/research.md` Round 2, Domain D + F (74 findings, 20 recommendations) |

---

<!-- ANCHOR:problem -->
<!-- /ANCHOR:metadata -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The generate-context.js pipeline has no observable signal for embedding health: the retry manager runs a background job every 5 minutes with circuit-breaker logic, but its RetryStats object (pending count, failed count, retry attempts, circuit breaker state) never reaches any MCP tool. Operators using `memory_health` cannot distinguish "all embeddings healthy" from "all embeddings stuck with circuit breaker open." Separately, the trigger phrase system's n-gram auto-extraction (depth 4) produces 15-30 phrases per memory that include raw path fragments ("system spec kit/022 hybrid rag fusion"), single-word shingles, and generic tokens under 3 characters — these dilute the manually authored phrases that survive the RC2 fix (workflow.ts:978-988) and flood binary trigger matching with score=1.0 false positives. On the template rendering side, `toolCalls` (ToolCallSummary[]) and `exchanges` (ExchangeSummary[]) from CollectedDataBase are never bound to any Mustache section; the data is AI-composed and ingested but silently falls off the render path, permanently discarded. Eight V2.2 placeholder tokens in template-renderer.ts OPTIONAL_PLACEHOLDERS have no construction sites anywhere in the codebase, guaranteeing empty output, while 9 other suppressed OPTIONAL_PLACEHOLDERs now have active data sources (buildMemoryClassificationContext, buildSessionDedupContext) that are masked by stale suppression logic. Finally, cross-session coherence has no automated layer: buildSessionDedupContext() computes a SHA1 fingerprint but never queries existing memories to detect overlaps, similar_memories references from AI input pass through with no ID validation, causal link types are accepted without graph-level verification, and observation deduplication only runs within a single render pass.

### Purpose

Establish operator visibility into embedding pipeline health, enforce signal quality in trigger phrase generation, eliminate silent data loss in template rendering, and add automated pre-save safeguards against cross-session incoherence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Surface RetryStats (pending, failed, retryAttempts, circuitBreakerOpen, lastRun) through the `memory_health` MCP response (P0)
- Add trigger phrase filter pipeline: suppress path fragments (single and multi-token), n-gram shingles below configurable length threshold, and generic tokens under 3 characters (P1)
- Add Mustache template sections for `toolCalls` and `exchanges` CollectedDataBase fields, with context builder bindings in workflow.ts (P1)
- Remove 8 phantom V2.2 OPTIONAL_PLACEHOLDER entries from template-renderer.ts (P2)
- Un-suppress 9 OPTIONAL_PLACEHOLDERs that have active data sources from buildMemoryClassificationContext() and buildSessionDedupContext() (P2)
- Add multi-token path fragment detection to post-save-review.ts (P2)
- Add pre-save MCP query to detect overlapping memories for same spec folder (P2)
- Add observation array dedup at input-normalizer.ts normalization time (P2)

### Out of Scope

- Changing the RetryStats background job schedule or retry limits — only surfacing existing data
- Replacing auto-extraction entirely — the goal is filtering, not disabling
- Redesigning the Mustache template structure — adding sections only, not restructuring existing ones
- Implementing vector similarity overlap detection — only exact/fuzzy fingerprint-based pre-save check
- Cross-session contradiction detection (V-rule) — tracked in 002-scoring-and-filter (finding #19)
- Quality score feedback from post-save review — tracked in 002-scoring-and-filter (finding #20)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/tools/memory-health.ts` | Modify | Add RetryStats query and inclusion in health response |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Trigger phrase filter pipeline (lines 940-1018); toolCalls/exchanges context binding; pre-save overlap check |
| `.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts` | Modify | Remove 8 phantom placeholders; un-suppress 9 active-source placeholders |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Modify | Add multi-token path fragment pattern detection |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | Add observation array dedup at normalization time |
| `.opencode/skill/system-spec-kit/scripts/types/session-types.ts` | Modify | Verify toolCalls and exchanges field types match Mustache section expectations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `memory_health` MCP response includes RetryStats from retry-manager.ts | Calling `memory_health` returns a `embeddingRetry` block with at minimum: `pending`, `failed`, `retryAttempts`, `circuitBreakerOpen`, `lastRun` fields |
| REQ-002 | RetryStats exposed without coupling retry-manager internals to MCP handler | Retry manager exposes a `getRetryStats(): RetryStats` method or equivalent; handler imports the type, not implementation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Trigger phrase filter suppresses path fragment patterns | Phrases matching path-separator patterns (forward slash, backslash, multi-word path segments) are excluded from merged trigger phrase output |
| REQ-004 | Trigger phrase filter suppresses tokens under 3 characters | Single-word tokens with fewer than 3 characters are excluded from auto-extracted phrases before merge |
| REQ-005 | Trigger phrase filter suppresses n-gram shingles that are subsets of other phrases | Bigram/trigram phrases that represent substrings of retained longer phrases are removed |
| REQ-006 | `toolCalls` field in CollectedDataBase is rendered to memory output via Mustache template | At least a summary section (tool name, count or description) appears in rendered output when toolCalls is non-empty |
| REQ-007 | `exchanges` field in CollectedDataBase is rendered to memory output via Mustache template | At least a summary section (exchange count, key topics) appears in rendered output when exchanges is non-empty |
| REQ-008 | Template context builder in workflow.ts passes toolCalls and exchanges data to renderer | No silent data loss: if toolCalls or exchanges exist in CollectedDataBase, they reach the Mustache context |

### P2 - Tracked (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | 8 phantom V2.2 OPTIONAL_PLACEHOLDER entries removed from template-renderer.ts | Entries with zero construction sites are deleted; no regressions in existing render output |
| REQ-010 | 9 stale OPTIONAL_PLACEHOLDER suppressions removed for fields with active data sources | Fields built by buildMemoryClassificationContext() and buildSessionDedupContext() render when data present |
| REQ-011 | post-save-review.ts detects multi-token path fragments in trigger phrases | Review output flags phrases like "system spec kit/022 hybrid rag fusion" in addition to single-token fragments |
| REQ-012 | Pre-save MCP query detects overlapping memories for same spec folder | Before saving, workflow queries existing memories for the spec folder and warns if fingerprint similarity exceeds threshold |
| REQ-013 | Observation dedup runs at normalization time in input-normalizer.ts | Duplicate observation strings from the same input object are removed before reaching the render pipeline, not just deduped within render |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_health` tool call returns embedding retry status including circuit breaker state and pending count — operators can diagnose vector-search degradation without reading log files
- **SC-002**: Auto-extracted trigger phrases for a session containing spec folder paths contain no path-fragment phrases and no tokens under 3 characters
- **SC-003**: A session with non-empty `toolCalls` and `exchanges` produces memory output that includes those fields — zero silent data loss for AI-composed rich data
- **SC-004**: All 8 phantom V2.2 OPTIONAL_PLACEHOLDER tokens removed with no regression in any existing memory render test
- **SC-005**: Observation arrays with duplicate entries at normalization time produce deduplicated output — intra-document render dedup is not the sole safeguard

### Acceptance Scenarios

**Given** a retry manager with pending or failed embedding work, **when** an operator calls `memory_health`, **then** the response includes the `embeddingRetry` block with the live retry-state fields.

**Given** a session whose auto-extracted phrases include spec-folder path fragments or short filler tokens, **when** trigger-phrase filtering runs, **then** those low-signal phrases are removed before final merge.

**Given** a save with manually authored trigger phrases, **when** the filter pipeline runs, **then** the manual phrases remain unchanged in the final output.

**Given** a collected session with non-empty `toolCalls` or `exchanges`, **when** the Mustache renderer builds the memory output, **then** the corresponding optional sections appear in the rendered memory.

**Given** a session with duplicate observations in the input payload, **when** normalization completes, **then** duplicate observation strings are removed before render time.

**Given** a save whose fingerprint overlaps with recent memories for the same spec folder, **when** the pre-save overlap check runs, **then** the workflow emits a warning without blocking the save.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 003-field-integrity-and-schema phase changes template-renderer.ts in the same sprint | Merge conflict on OPTIONAL_PLACEHOLDERS list | Coordinate ordering: 003 lands before 004 modifies same array; or use separate named entries |
| Dependency | retry-manager.ts internal structure must expose getRetryStats() | If retry manager has no exported stats method, handler cannot query it without import coupling | Add a minimal stats accessor method as part of this work |
| Risk | Trigger phrase filter over-filters valid technical phrases | Signal loss for legitimate short tokens (e.g., "BM25", "RAG") | Set length threshold to 3 chars, not 4; add an allow-list for known technical acronyms |
| Risk | Un-suppressing OPTIONAL_PLACEHOLDERs for dedup context fields causes verbosity regression | Memory output becomes significantly longer | Verify each un-suppressed field against actual data volume; use conditional sections |
| Risk | Pre-save overlap query adds latency to every save operation | Save time increases by 100-300ms per call | Cap query to last 20 memories for spec folder; add SPECKIT_PRE_SAVE_DEDUP flag to disable |
| Risk | toolCalls/exchanges Mustache sections produce poorly structured output | Degraded memory readability | Implement as optional collapsed sections, rendered only when data exceeds minimum entry count (>1) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: RetryStats query in memory_health must complete in <50ms; retry manager should cache stats in-memory, not re-scan the DB on each call
- **NFR-P02**: Pre-save overlap check (REQ-012) must complete in <300ms; must not block save on timeout — fail open with a warning

### Security
- **NFR-S01**: RetryStats exposure must not include raw error messages that could leak file paths or internal schema details — return structured fields only

### Reliability
- **NFR-R01**: Trigger phrase filter must be idempotent — applying the filter twice to the same input produces the same output
- **NFR-R02**: Template section additions for toolCalls/exchanges must be strictly additive — no changes to existing section rendering logic

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty toolCalls/exchanges arrays: Mustache sections must use `{{#hasToolCalls}}` guard — empty arrays produce no output, not empty headers
- All trigger phrases filtered: If filter removes every auto-extracted phrase, preserve manually-authored phrases unchanged; do not produce empty trigger phrase list
- RetryStats when retry manager not yet started: Return `{ pending: 0, failed: 0, retryAttempts: 0, circuitBreakerOpen: false, lastRun: null }`

### Error Scenarios
- Pre-save overlap MCP query times out: Log warning, continue save — overlap detection is advisory not blocking
- Observation dedup at normalize time encounters non-string entries: Skip dedup for non-string values, preserve as-is
- template-renderer.ts OPTIONAL_PLACEHOLDER list out of sync after phantom removal: Add a unit test that asserts every placeholder token exists in at least one template section

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: 5, LOC: ~200 net new, Systems: MCP server + scripts pipeline |
| Risk | 14/25 | No auth/breaking change; moderate merge-conflict risk with sibling phase 003 |
| Research | 14/20 | Domain D + F from 74-finding audit; source lines cited |
| Multi-Agent | 6/15 | Single workstream; no parallel agent coordination |
| Coordination | 10/15 | Sibling phase dependency; must sequence after 003 |
| **Total** | **60/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Merge conflict with 003-field-integrity-and-schema on template-renderer.ts | H | M | Land 003 first; or use dedicated OPTIONAL_PLACEHOLDERS array slices per phase |
| R-002 | Trigger phrase filter suppresses valid short technical tokens | M | M | 3-char minimum + allow-list for known acronyms (RAG, BM25, MCP, ADR) |
| R-003 | Pre-save overlap check adds visible latency to interactive saves | M | L | 300ms cap; fail-open on timeout; feature flag to disable |
| R-004 | Un-suppressed dedup context fields bloat memory output | L | M | Audit each field for data density before un-suppressing; use conditional guards |
| R-005 | RetryStats type not exported from retry-manager.ts | L | L | Type is internal but stats shape is stable; define interface in shared types |

---

## 11. USER STORIES

### US-001: Embedding Health Visibility (Priority: P0)

**As an** operator debugging degraded vector search recall, **I want** `memory_health` to show embedding retry statistics including circuit breaker state, **so that** I can diagnose whether embeddings are pending, retrying, or stuck without reading background job logs.

**Acceptance Criteria**:
1. Given the retry manager has 3 pending embeddings and circuit breaker closed, When I call `memory_health`, Then the response includes `embeddingRetry: { pending: 3, failed: 0, circuitBreakerOpen: false }`
2. Given the circuit breaker opened due to repeated failures, When I call `memory_health`, Then `circuitBreakerOpen: true` is visible in the response

---

### US-002: Clean Trigger Phrases (Priority: P1)

**As an** AI session saving a memory about spec folder 022-hybrid-rag-fusion, **I want** the auto-extracted trigger phrases to contain only meaningful semantic tokens, **so that** trigger matching returns relevant memories instead of false positives from path fragments.

**Acceptance Criteria**:
1. Given a session with spec folder path "02--system-spec-kit/022-hybrid-rag-fusion", When trigger phrases are extracted and filtered, Then phrases like "system spec kit/022 hybrid rag fusion" and tokens like "of", "the", "22" are excluded from the output
2. Given manually authored trigger phrases, When the filter runs, Then manually authored phrases are preserved unchanged

---

### US-003: Rich Field Rendering (Priority: P1)

**As an** AI that composed toolCalls and exchanges data during session capture, **I want** that data to appear in the saved memory output, **so that** future retrieval includes tool usage patterns and exchange summaries as searchable content.

**Acceptance Criteria**:
1. Given a CollectedDataBase object with 3 toolCalls entries, When memory is rendered, Then a "Tool Calls" section appears in the output with at least tool names
2. Given an empty toolCalls array, When memory is rendered, Then no "Tool Calls" section header appears

---

### US-004: Reduced Template Noise (Priority: P2)

**As a** developer reading rendered memory output, **I want** phantom placeholder tokens and stale suppression masks to be cleaned up, **so that** the template renderer faithfully reflects the available data without silent gaps.

**Acceptance Criteria**:
1. Given the 8 phantom V2.2 placeholder entries removed, When any memory is rendered, Then no regression occurs in existing render test suite
2. Given the 9 un-suppressed placeholders with active data sources, When a session with classification context is saved, Then those fields appear in rendered output

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should the toolCalls Mustache section render the full ToolCallSummary[] or a condensed count + top-N by frequency? (Prefer top-3 by call count to avoid verbosity)
- Does the pre-save overlap check (REQ-012) need to be synchronous for the first save of a spec folder, or advisory-only across all saves? (Recommend advisory-only to keep P2 scope contained)
- Are any of the 9 un-suppressed OPTIONAL_PLACEHOLDERs conditional on feature flags? If so, un-suppression must preserve the flag gate.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research**: See `../research/research.md` (Round 2, Domains D + F)
- **Sibling Phase 003**: `../003-field-integrity-and-schema/` (template-renderer.ts — coordinate changes)
