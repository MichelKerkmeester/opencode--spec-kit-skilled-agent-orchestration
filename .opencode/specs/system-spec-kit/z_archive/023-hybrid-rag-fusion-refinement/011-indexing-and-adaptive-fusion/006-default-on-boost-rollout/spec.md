---
title: "Fe [system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/006-default-on-boost-rollout/spec]"
description: "Key retrieval quality features (session boost, causal boost, deep expansion) are gated behind opt-in env vars, meaning most users receive degraded search quality. This spec defines the rollout to make these features ON by default."
trigger_phrases:
  - "default on boost rollout"
  - "session boost default"
  - "causal boost default"
  - "deep expansion threshold"
  - "boost rollout"
  - "speckit_session_boost"
  - "speckit_causal_boost"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/006-default-on-boost-rollout"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["spec.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Default-ON Boost Rollout — Session, Causal & Deep Expansion

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-01 |
| **Branch** | `system-speckit/024-compact-code-graph` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 005-e2e-integration-test |
| **Successor** | 007-external-graph-memory-research |
| **Parent Epic** | `011-indexing-and-adaptive-fusion` |
| **Phase** | 006 of 011 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three retrieval quality features — session boost, causal boost, and deep query expansion — are each gated behind explicit opt-in environment variables (`SPECKIT_SESSION_BOOST`, `SPECKIT_CAUSAL_BOOST`). Because `isFeatureEnabled()` in `rollout-policy.ts` treats an *undefined* env var as ON, but `session-boost.ts` and `causal-boost.ts` call `isFeatureEnabled` with their specific flag names that users typically do not set, the net effect is that the features are effectively OFF for all default installations. A test search for "semantic search" confirmed: `sessionBoostApplied: "off"`, `causalBoostApplied: "off"`, and `deepExpansion: false` even in `deep` mode.

### Purpose

Graduate session boost, causal boost, and deep expansion to default-ON status so that every user receives full retrieval quality without manual configuration. Env vars remain available as kill-switches to disable individual features when needed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Change session boost default: remove env var opt-in requirement, make ON unless `SPECKIT_SESSION_BOOST=false`
- Change causal boost default: remove env var opt-in requirement, make ON unless `SPECKIT_CAUSAL_BOOST=false`
- Lower deep expansion activation threshold so it fires more frequently in `deep` mode
- Add/update comments noting kill-switch semantics for all three flags
- Update `search-flags.ts` if session boost and causal boost flags belong there for consistency
- **Artifact classifier quick wins**: Expand keyword lists in `QUERY_PATTERNS` and add intent→artifact fallback so `unknown/0` is less frequent
- **MCP config propagation**: Add boost env vars to all 5 consumer config files

### Out of Scope

- Intent weights (hybrid guard `intentWeightsApplied: "off"` is correct by design — G2 prevention)
- Any changes to the rollout-policy.ts `isFeatureEnabled` core logic

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/session-boost.ts` | Modify | Remove env var opt-in; make default-ON with kill-switch semantics |
| `mcp_server/lib/search/causal-boost.ts` | Modify | Remove env var opt-in; make default-ON with kill-switch semantics |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Lower deep expansion activation threshold / broaden trigger conditions |
| `mcp_server/lib/search/search-flags.ts` | Modify (possible) | Add `isSessionBoostEnabled` / `isCausalBoostEnabled` alongside existing graduated flags |
| `mcp_server/lib/search/artifact-routing.ts` | Modify | Expand keyword lists + add intent→artifact fallback mapping |
| `mcp_server/handlers/memory-search.ts` | Modify | Wire intent classifier result as artifact routing fallback |
| `.mcp.json` | Modify | Add `SPECKIT_SESSION_BOOST` and `SPECKIT_CAUSAL_BOOST` env vars to spec_kit_memory |
| `opencode.json` | Modify | Add boost env vars + update `_NOTE_7` to document new defaults |
| `.claude/mcp.json` | Modify | Add boost env vars + update `_NOTE_7` to document new defaults |
| `.codex/config.toml` | Modify | Add boost env vars + update `_NOTE_7` to document new defaults |
| `../Barter/coder/opencode.json` | Modify | Add boost env vars + update `_NOTE_7` to document new defaults |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Session boost is ON by default for all users | `sessionBoostApplied` is not `"off"` in a fresh installation with no env vars set |
| REQ-002 | Causal boost is ON by default for all users | `causalBoostApplied` is not `"off"` in a fresh installation with no env vars set |
| REQ-003 | Setting `SPECKIT_SESSION_BOOST=false` disables session boost | `sessionBoostApplied: "off"` when env var explicitly set to `false` |
| REQ-004 | Setting `SPECKIT_CAUSAL_BOOST=false` disables causal boost | `causalBoostApplied: "off"` when env var explicitly set to `false` |
| REQ-005 | Deep expansion fires more frequently in `deep` mode | A `mode: "deep"` search on a populated DB shows `deepExpansion: true` without extra flags |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Code comments clearly document kill-switch semantics | Each changed `isEnabled()` call has a JSDoc comment stating the default and how to disable |
| REQ-007 | No regression in `mode: "auto"` searches | Existing auto-mode search behavior unchanged; session/causal boosts apply where session IDs are present |
| REQ-008 | Feature flag change documented in feature catalog | `feature_catalog/` entry updated to reflect graduated status |
| REQ-009 | Artifact classifier uses intent as fallback | When query-based classification returns `unknown/0`, the already-detected intent (e.g., `understand`) maps to an artifact class with `confidence: 0.4` |
| REQ-010 | Artifact classifier keyword lists expanded | `QUERY_PATTERNS` in `artifact-routing.ts` includes broader terms: "search", "retrieval", "pipeline", "indexing", "embedding" → `research`; "config", "setup", "env" → `implementation-summary` |
| REQ-011 | All 5 MCP config files updated with boost env vars | `.mcp.json`, `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `Barter/coder/opencode.json` all contain `SPECKIT_SESSION_BOOST` and `SPECKIT_CAUSAL_BOOST` with updated `_NOTE_7` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A test `memory_search` call with no env vars set returns `sessionBoostApplied` not equal to `"off"` (when a sessionId is provided)
- **SC-002**: A test `memory_search` call with no env vars set returns `causalBoostApplied` not equal to `"off"`
- **SC-003**: A `mode: "deep"` search on a populated database returns `deepExpansion: true` in its metadata
- **SC-004**: Setting `SPECKIT_SESSION_BOOST=false` reverts session boost to disabled state
- **SC-005**: Setting `SPECKIT_CAUSAL_BOOST=false` reverts causal boost to disabled state

### Acceptance Scenarios

**Given** a fresh MCP server with no `SPECKIT_SESSION_BOOST` env var set, **when** `memory_search` is called with a `sessionId`, **then** the response metadata shows `sessionBoostApplied` is not `"off"`.

**Given** a fresh MCP server with no `SPECKIT_CAUSAL_BOOST` env var set, **when** `memory_search` is called, **then** the response metadata shows `causalBoostApplied` is not `"off"`.

**Given** a populated memory database and `mode: "deep"` passed to `memory_search`, **when** the search executes, **then** the response metadata shows `deepExpansion: true`.

**Given** `SPECKIT_SESSION_BOOST=false` is set in the environment, **when** `memory_search` is called with a `sessionId`, **then** the response metadata shows `sessionBoostApplied: "off"`.

**Given** `SPECKIT_CAUSAL_BOOST=false` is set in the environment, **when** `memory_search` is called, **then** the response metadata shows `causalBoostApplied: "off"`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Enabling session boost by default increases per-query DB reads | Med — minor latency increase for queries with sessionId | Acceptable; feature is already implemented and tested |
| Risk | Causal boost traversal on sparse graphs may produce empty results silently | Low — existing sparse-first policy already guards this | No change needed; `isSparseMode()` gate remains intact |
| Risk | Deep expansion threshold change causes over-expansion on short queries | Med — irrelevant variants could dilute results | Test with diverse short/long query set; keep MAX_DEEP_QUERY_VARIANTS=3 unchanged |
| Dependency | `rollout-policy.ts` `isFeatureEnabled()` treats undefined as ON | Enabler — no logic change needed, only flag call-site changes | Confirmed: `rawFlag === undefined` → returns `true` |
| Dependency | `causal-boost.ts` `isTypedTraversalEnabled()` is already default-ON | Positive dependency — typed traversal already graduated | No change needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Session boost enabled by default must not increase p95 search latency by more than 10ms for queries without an active sessionId (no-op fast path)
- **NFR-P02**: Deep expansion must complete within existing `DEEP_EXPANSION_TIMEOUT_MS` (5000ms) budget

### Security
- **NFR-S01**: No new environment variable names introduced — only default-value semantics change for existing flags
- **NFR-S02**: Kill-switch `=false` must be respected without restarting the MCP server if the process re-reads env vars (document if not applicable)

### Reliability
- **NFR-R01**: Any individual boost failure must remain non-fatal; search returns results without the boost applied and logs a warning
- **NFR-R02**: Deep expansion timeout fallback to base query must remain intact after threshold changes
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No sessionId provided: session boost must skip gracefully, not error
- Empty causal edge table: causal boost must return 0 boosts applied without error
- Single-word query in deep mode: expansion should generate synonyms or skip cleanly if none found

### Error Scenarios
- `isFeatureEnabled` throws unexpectedly: treat as feature disabled (already handled by try/catch patterns in callers)
- DB unavailable during session boost lookup: fall back to unboosted results, log warning
- `buildDeepQueryVariants` returns only original query: `queryVariants.length === 1`, so the parallel multi-search branch is skipped — this is the current behavior causing `deepExpansion: false`; threshold fix must address this

### State Transitions
- Rolling deployment (env var set on some replicas, not others): safe because kill-switch only disables, default is ON everywhere
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 3-4 files, ~20-40 LOC changed; no new abstractions |
| Risk | 12/25 | Default-on change affects all users; latency and quality regression risk |
| Research | 8/20 | Call-site confirmed in source; expansion logic understood |
| **Total** | **30/70** | **Level 2 — QA validation warranted** |
<!-- /ANCHOR:complexity -->

---

**Future Considerations: Artifact Classifier**

These are longer-term improvements beyond the quick wins in this phase:

| Approach | Effort | Impact | Description |
|----------|--------|--------|-------------|
| **Partial confidence accumulation** | Medium | Medium | Instead of binary 0/1, partial keyword overlap (e.g., "search" ≈ "research") yields `confidence: 0.3-0.5` |
| **Embedding-based fallback** | High | High | When keyword matching yields 0, compute cosine similarity between query embedding and class centroid embeddings |
| **Learned classifier** | High | Highest | Train on actual query→class mappings from usage logs (access_log table + feedback signals) |
| **Cross-classifier fusion** | Medium | High | Combine query complexity router, intent classifier, and artifact classifier scores via weighted ensemble |

**Current classifier limitations** (`artifact-routing.ts`):
- 9 classes, all deterministic keyword+regex
- Scoring: 1pt per keyword, 2pt per regex, confidence = `min(1, score/6)`
- `unknown` class gets `boostFactor: 1.0` (neutral) — not harmful, but misses optimization opportunity
- No partial matching: "search" doesn't partially match "research" keyword list

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the deep expansion `buildDeepQueryVariants` rarely return >1 variant because the query variant builder itself is limited, or because the `isMultiQueryEnabled()` guard is not the issue? (Needs runtime log inspection to confirm root cause before fixing threshold.)
- Should `SPECKIT_SESSION_BOOST` and `SPECKIT_CAUSAL_BOOST` be moved to `search-flags.ts` as exported functions `isSessionBoostEnabled()` / `isCausalBoostEnabled()` for consistency with other graduated flags?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
