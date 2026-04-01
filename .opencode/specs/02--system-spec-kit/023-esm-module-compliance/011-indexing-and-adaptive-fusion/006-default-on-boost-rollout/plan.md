---
title: "Implementation Plan: Default-ON Boost Rollout — Session, Causal & Deep Expansion"
description: "Changes call-site semantics for SPECKIT_SESSION_BOOST and SPECKIT_CAUSAL_BOOST from opt-in to default-ON kill-switches, and broadens the deep expansion activation condition in stage1-candidate-gen so that deep mode reliably fires multi-query expansion."
trigger_phrases:
  - "boost rollout plan"
  - "session boost implementation"
  - "causal boost default on"
  - "deep expansion fix"
  - "stage1-candidate-gen expansion"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Default-ON Boost Rollout — Session, Causal & Deep Expansion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM modules) |
| **Framework** | MCP server (Node.js, better-sqlite3) |
| **Storage** | SQLite via better-sqlite3 |
| **Testing** | Manual MCP tool calls + log inspection |

### Overview

Three call-site changes are required. In `session-boost.ts`, the `isEnabled()` helper currently calls `isFeatureEnabled('SPECKIT_SESSION_BOOST', sessionId)`. Because `isFeatureEnabled` treats an undefined env var as ON, but session boost was historically only tested with the flag explicitly set, the default ON behavior was never surface-confirmed. The fix is to verify the call path is correct and add a comment documenting the kill-switch. The same applies to `causal-boost.ts`. For deep expansion, the issue is that `buildDeepQueryVariants` returns only the original query for short or common queries, so `queryVariants.length > 1` evaluates false and the multi-search branch never runs. The fix is to adjust variant generation or the branch guard to better handle common cases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Call-site root cause confirmed in source (`session-boost.ts:29`, `causal-boost.ts:145`, `stage1-candidate-gen.ts:668`)

### Definition of Done
- [ ] All acceptance criteria from spec.md REQ-001 through REQ-005 met
- [ ] Manual MCP test confirms `sessionBoostApplied` and `causalBoostApplied` not `"off"` in default state
- [ ] Manual MCP test confirms `deepExpansion: true` in deep mode
- [ ] Kill-switch tests confirm `=false` disables each feature
- [ ] Spec/plan/tasks updated with implementation notes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Feature flag graduation — call-site default change (no new abstractions, no schema changes).

### Key Components

- **`rollout-policy.ts` `isFeatureEnabled()`**: Treats undefined env var as ON. This is the enabler. No changes needed here.
- **`session-boost.ts` `isEnabled()`**: Calls `isFeatureEnabled('SPECKIT_SESSION_BOOST', sessionId)`. Root-cause investigation required — if env var is not set, `isFeatureEnabled` should already return `true`. Confirm this is actually working or if there is a guard layer above it suppressing the boost.
- **`causal-boost.ts` `isEnabled()`**: Calls `isFeatureEnabled('SPECKIT_CAUSAL_BOOST')`. Same investigation pattern as session boost.
- **`stage1-candidate-gen.ts` `buildDeepQueryVariants()`**: Returns variants based on synonym expansion or LLM reformulation. Returns only original query when expansion finds nothing, so `queryVariants.length > 1` gate never triggers. Fix must either lower the threshold for what counts as a viable variant or ensure at least one expanded variant is always generated for deep mode.
- **`search-flags.ts`**: Central registry for graduated default-ON flags. Session boost and causal boost flags may benefit from moving their `isEnabled()` helpers here for consistency.
- **`artifact-routing.ts`**: Deterministic keyword+regex classifier with 9 artifact classes. `getStrategyForQuery()` scores queries against `QUERY_PATTERNS` (1pt keyword, 2pt regex, confidence = `min(1, score/6)`). Falls back to `unknown/0` when no keywords match. **Quick win**: expand keyword lists and add intent→artifact mapping as a new fallback tier before the specFolder hint (line 286).
- **`memory-search.ts` handler**: Already detects intent before calling artifact routing. Currently does NOT pass intent into `getStrategyForQuery()` — wiring this through enables the fallback mapping.

### Data Flow

```
memory_search(mode: "deep", sessionId: "xyz")
    │
    ├─► stage2-fusion.ts  ──► session-boost.ts isEnabled()   ──► isFeatureEnabled('SPECKIT_SESSION_BOOST', sessionId)
    │                    ──► causal-boost.ts  isEnabled()   ──► isFeatureEnabled('SPECKIT_CAUSAL_BOOST')
    │
    └─► stage1-candidate-gen.ts  (deep + isMultiQueryEnabled())
            │
            └─► buildDeepQueryVariants(query)
                    │
                    └─► returns [original]  ←── FIX: ensure >1 variant fires
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Diagnosis

- [ ] Add temporary debug log to `session-boost.ts isEnabled()` and run a test search with no env vars to confirm whether it returns true or false
- [ ] Add temporary debug log to `causal-boost.ts isEnabled()` and confirm same
- [ ] Inspect `stage2-fusion.ts` for any additional guard layer that could suppress boosts even when `isEnabled()` returns true
- [ ] Run `mode: "deep"` search and trace `buildDeepQueryVariants` output to see variant count

### Phase 2: Core Implementation

- [ ] **session-boost.ts**: If `isEnabled()` already correctly delegates to `isFeatureEnabled` which returns true by default — add JSDoc comment documenting kill-switch semantics and confirm no suppression layer exists above it
- [ ] **session-boost.ts**: If a suppression layer exists (e.g., `stage2-fusion.ts` checks for explicit `true`), remove or invert that guard
- [ ] **causal-boost.ts**: Same diagnosis-and-fix pattern as session boost
- [ ] **stage1-candidate-gen.ts**: Fix `buildDeepQueryVariants` to return at least 2 variants for deep mode — either by generating a paraphrase of the original, or by relaxing the `queryVariants.length > 1` guard to `queryVariants.length >= 1` and running the parallel path with a single expanded query slot
- [ ] **search-flags.ts**: Add `isSessionBoostEnabled()` and `isCausalBoostEnabled()` helper functions alongside existing graduated flags (optional but recommended for consistency)
- [ ] **artifact-routing.ts — keyword expansion**: Add broader terms to `QUERY_PATTERNS` (lines 156-197):
  - `research` class: add "search", "retrieval", "pipeline", "indexing", "embedding", "vector", "semantic"
  - `implementation-summary` class: add "config", "setup", "env", "flag", "setting"
  - `memory` class: add "resume", "recover", "continuation"
- [ ] **artifact-routing.ts — intent→artifact fallback**: In `getStrategyForQuery()` (line 286), add a new fallback tier between `bestScore === 0` and the specFolder hint. When an `intent` parameter is provided and no keyword/pattern matched, map intent to artifact class with `confidence: 0.4`:
  - `understand` → `research`
  - `find_spec` → `spec`
  - `find_decision` → `decision-record`
  - `add_feature` → `implementation-summary`
  - `fix_bug` → `memory`
  - `refactor` → `implementation-summary`
  - `security_audit` → `research`
- [ ] **memory-search.ts handler**: Wire the already-detected `intent` into the `getStrategyForQuery(query, specFolder, intent)` call so the fallback mapping has data to work with
- [ ] **MCP config files (5 files)**: Add `SPECKIT_SESSION_BOOST: "true"` and `SPECKIT_CAUSAL_BOOST: "true"` env vars, update `_NOTE_7_FEATURE_FLAGS` to document all graduated default-ON flags:
  - `.mcp.json` — add to `spec_kit_memory.env`
  - `opencode.json` — add to `spec_kit_memory.environment`
  - `.claude/mcp.json` — add to `spec_kit_memory.env`
  - `.codex/config.toml` — add to `[mcp_servers.spec_kit_memory.env]`
  - `Barter/coder/opencode.json` — add to `spec_kit_memory.environment`

### Phase 3: Verification

- [ ] Run `memory_search({ query: "semantic search", sessionId: "test-session-001" })` — confirm `sessionBoostApplied` not `"off"`
- [ ] Run `memory_search({ query: "semantic search" })` — confirm `causalBoostApplied` not `"off"`
- [ ] Run `memory_search({ query: "semantic search", mode: "deep" })` — confirm `deepExpansion: true`
- [ ] Set `SPECKIT_SESSION_BOOST=false`, repeat session boost test — confirm `"off"`
- [ ] Set `SPECKIT_CAUSAL_BOOST=false`, repeat causal boost test — confirm `"off"`
- [ ] Unset both env vars and re-confirm default-ON behavior
- [ ] Test `getStrategyForQuery("semantic search", undefined, "understand")` — confirm `detectedClass: "research"` with `confidence >= 0.4`
- [ ] Test `getStrategyForQuery("vector retrieval")` — confirm keyword expansion produces a non-unknown class
- [ ] Test varied queries across intent types — confirm reduced `unknown/0` rate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | MCP `memory_search` tool calls with/without env vars | MCP client (opencode/Claude Code) |
| Manual | Kill-switch verification for both boost flags | Shell env var override + MCP call |
| Manual | Deep mode expansion confirmation | `mode: "deep"` search + response metadata inspection |
| Code review | stage2-fusion.ts suppression guard audit | Read tool + diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `rollout-policy.ts` `isFeatureEnabled()` default-ON behavior | Internal | Green — confirmed in source | Blocker: entire fix depends on this being correct |
| MCP server process restart after env var change | Operational | Green — standard Node.js behavior | Kill-switch tests require server restart or live env override |
| Phase 005 (e2e-integration-test) | Internal sibling | Green — completed | No blocking dependency; this phase is independent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reported search quality regression after boost default change
- **Procedure**: Set `SPECKIT_SESSION_BOOST=false` and/or `SPECKIT_CAUSAL_BOOST=false` in environment; restart MCP server — instant kill-switch, no code revert required
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:future -->
## L2: FUTURE ARTIFACT CLASSIFIER IMPROVEMENTS

Beyond the quick wins in this phase, longer-term classifier improvements include:

1. **Partial confidence accumulation** — "search" partially overlaps with "research" keyword; implement substring/edit-distance matching to yield `confidence: 0.3` instead of 0
2. **Embedding-based fallback** — When all deterministic channels score 0, compute cosine similarity between query embedding and pre-computed class centroid embeddings (one embedding per class from aggregated keywords)
3. **Learned classifier** — Train on actual query→class mappings from `access_log` table + CCC feedback signals. Requires evaluation dataset first
4. **Cross-classifier fusion** — Combine query complexity router (`query-router.ts`), intent classifier, and artifact classifier via weighted ensemble instead of sequential independent scoring
<!-- /ANCHOR:future -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Diagnosis) ──► Phase 2 (Core Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Diagnosis | None | Core Implementation |
| Core Implementation | Diagnosis findings | Verification |
| Verification | Core Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Diagnosis | Low | 30-60 minutes |
| Core Implementation | Low-Med | 1-2 hours |
| Verification | Low | 30-60 minutes |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No backup required (env var change, no data migration)
- [ ] Kill-switch env vars documented in feature catalog entry
- [ ] Monitoring: observe search metadata `sessionBoostApplied` / `causalBoostApplied` fields post-deploy

### Rollback Procedure
1. Set `SPECKIT_SESSION_BOOST=false` in MCP server environment
2. Set `SPECKIT_CAUSAL_BOOST=false` in MCP server environment
3. Restart MCP server process
4. Verify `sessionBoostApplied: "off"` and `causalBoostApplied: "off"` in test search

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — env var kill-switches are sufficient
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
