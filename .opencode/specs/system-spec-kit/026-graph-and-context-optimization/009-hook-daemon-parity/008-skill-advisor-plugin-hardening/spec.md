---
title: "Feat [system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/008-skill-advisor-plugin-hardening/spec]"
description: "Address the three P2 follow-ups deferred from packet 007 Phase 5: refactor module-global plugin state to per-instance, add in-flight bridge subprocess dedup, and add prompt/brief size caps + cache LRU eviction. Single-file edit in .opencode/plugins/spec-kit-skill-advisor.js plus focused vitest coverage."
trigger_phrases:
  - "skill advisor plugin hardening"
  - "skill advisor per-instance state"
  - "skill advisor in-flight dedup"
  - "skill advisor size caps"
  - "skill advisor lru"
  - "026/009/008"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/008-skill-advisor-plugin-hardening"
    last_updated_at: "2026-04-23T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented plugin hardening and verified focused tests/build"
    next_safe_action: "Dispatch implementation"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Module-global state in spec-kit-skill-advisor.js:28-36 must move to per-instance closure or WeakMap"
      - "In-flight Map needed in getAdvisorContext to dedup concurrent identical bridge calls"
      - "Caps: MAX_PROMPT_BYTES=64KB, MAX_BRIEF_CHARS=2KB, MAX_CACHE_ENTRIES=1000 with LRU eviction"
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Skill-Advisor Plugin Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

Packet 007 Phase 5 fixed the immediate operator-visible bugs in `.opencode/plugins/spec-kit-skill-advisor.js` (runtime_ready flag, cache metric accounting, defensive output guard, sessionID normalization) and explicitly deferred three architectural P2 items per ADR-005:

1. **Module-global state** — `advisorCache`, `runtimeReady`, `cacheHits`, etc. live at module scope (`spec-kit-skill-advisor.js:28-36`), shared across any plugin instances loaded in the same process. Latent multi-instance race risk.
2. **In-flight bridge dedup** — `getAdvisorContext` checks the cache then immediately spawns the bridge on miss with no promise dedup. Concurrent identical misses spawn duplicate Node subprocesses.
3. **Unbounded sizes** — no cap on prompt bytes sent to bridge, no cap on brief chars pushed into `output.system[]`, no LRU eviction on `advisorCache`. Adversarial input or buggy bridge response can blow out the model's system prompt or grow cache memory unboundedly.

This packet addresses all three in a single focused pass. The change is single-file (one plugin file + one test file) with predictable scope.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field        | Value                                   |
| ------------ | --------------------------------------- |
| **Level**    | 2                                       |
| **Priority** | P2 (defensive hardening; no user-visible bug) |
| **Status** | Complete |
| **Created**  | 2026-04-23                              |
| **Parent**   | `026-graph-and-context-optimization/009-hook-daemon-parity/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../007-opencode-plugin-loader-remediation/spec.md` |
| **Successor** | `../009-skill-advisor-standards-alignment/spec.md` |
| **Sibling**  | `007-opencode-plugin-loader-remediation/` (deferred these items in ADR-005) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three latent risks in `spec-kit-skill-advisor.js` deferred from 007 Phase 5:

1. Multi-workspace OpenCode hosting (potential future) would cause one workspace's plugin instance to overwrite another's runtime status flags and metric counters; the `session.deleted` cache purge uses session ID prefix only and could cross workspace boundaries.
2. Concurrent identical prompts (multi-agent orchestration, MCP tool bursts) would spawn 2+ identical bridge subprocesses, double the advisor scoring work, and produce nondeterministic `lastBridgeStatus` values.
3. Adversarial or accidental large input/output: a 200KB pasted prompt sent verbatim to the bridge, or a buggy bridge returning a 50KB brief that gets injected into `output.system[]`, would consume model context budget and inflate token bills. Cache has no max-entry or byte-budget cap.

### Purpose

Convert all three into hard guarantees:

1. Plugin state lives entirely in the closure created by `SpecKitSkillAdvisorPlugin(ctx, opts)`. Two instances loaded in the same process maintain independent caches, metrics, and lifecycle flags.
2. Concurrent identical-key requests share one in-flight Promise → one bridge subprocess spawn.
3. Prompt bytes capped at 64KB before being sent to the bridge. Brief chars capped at 2KB before being pushed into `output.system[]`. Cache entries capped at 1000 with LRU eviction (insertion-order Map iteration).

### Non-goals

- Changing the bridge subprocess architecture or the advisor scoring logic.
- Re-architecting `tool` registration or the `event:` listener (Phase 5 already correct).
- Touching `.opencode/plugins/spec-kit-compact-code-graph.js` or `.opencode/plugin-helpers/`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/plugins/spec-kit-skill-advisor.js`: convert module-global `let`/`const` state to per-instance closure variables; wire all helper functions through closure-captured state; add `inFlight` Map for dedup; add `MAX_PROMPT_BYTES`, `MAX_BRIEF_CHARS`, `MAX_CACHE_ENTRIES` constants and apply at the right boundaries.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts`: extend existing 23 tests with cases for two-instance independence, in-flight dedup with `Promise.all`, prompt clamp, brief clamp, and LRU eviction.
- This packet's own docs.

### Out of Scope

- Compact plugin, plugin-helpers folder, MCP server, anything outside the skill-advisor plugin.
- The unrelated `copilot-hook-wiring.vitest.ts` blocker (still deferred from packet 007 P1-04).

### Files Expected to Change

| Path | Change Type | Description |
|------|-------------|-------------|
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modify | State refactor + in-flight dedup + size caps + LRU eviction |
| `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | Modify | New test cases for the 3 hardening items |
| Parent docs (`009-hook-daemon-parity/`) | Modify | Record phase outcome |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Per-instance state isolation | Two `SpecKitSkillAdvisorPlugin(ctx, opts)` invocations in the same test produce independent caches, metrics, and `runtime_ready` flags |
| REQ-002 | In-flight dedup | `Promise.all([getAdvisorContext(p), getAdvisorContext(p), getAdvisorContext(p)])` for the same key spawns exactly 1 bridge subprocess |
| REQ-003 | Prompt clamp | A prompt > MAX_PROMPT_BYTES is truncated before being sent to the bridge; the bridge stdin payload size stays under the cap |
| REQ-004 | Brief clamp | A brief > MAX_BRIEF_CHARS is truncated before being pushed into `output.system[]` |
| REQ-005 | LRU eviction | `advisorCache` size never exceeds MAX_CACHE_ENTRIES; oldest entry by insertion order is evicted on overflow |
| REQ-006 | No regression in Phase 5 fixes | All 23 existing skill-advisor tests still pass |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Status tool reflects per-instance state | Each plugin instance's status tool returns its own counters; two instances do not cross-contaminate |
| REQ-008 | Cache invariant preserved | `cache_misses === bridge_invocations` and `cache_hits + cache_misses === advisor_lookups` invariants from Phase 5 still hold per-instance |
| REQ-009 | Strict spec validation | `validate.sh --strict` returns 0 errors / 0 warnings on this packet |

### P2 — Recommended

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Configurable caps | `MAX_PROMPT_BYTES`, `MAX_BRIEF_CHARS`, `MAX_CACHE_ENTRIES` are overridable via plugin options (so a test or future use-case can tighten/loosen) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Two-instance vitest case asserts no state cross-contamination.
- **SC-002**: `Promise.all` of N identical-key calls spawns 1 bridge subprocess (asserted via spy on `runBridge`).
- **SC-003**: Oversized prompt vitest case asserts the bridge receives ≤ MAX_PROMPT_BYTES.
- **SC-004**: Oversized brief vitest case asserts `output.system[0]` length ≤ MAX_BRIEF_CHARS.
- **SC-005**: Cache eviction vitest case asserts `advisorCache.size === MAX_CACHE_ENTRIES` after MAX+1 distinct insertions, and the oldest key is evicted.
- **SC-006**: Strict spec validation passes 0/0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | State refactor touches every helper function in the plugin file (~500 LOC) | Subtle regression in cache key construction, status tool output, or event-listener handling | Phase 5's 23 existing tests must all still pass; add 2-instance test as the canary |
| Risk | LRU eviction on a hot session could thrash cache | Performance degradation under unusual load | MAX_CACHE_ENTRIES=1000 is generous; if eviction is observed in normal use, raise the cap |
| Risk | Brief clamp truncates a legitimate long advisor response | Lost information in the system prompt | Default 2KB cap is far above the typical 200-char brief; the cap is configurable per REQ-010 |
| Dependency | Phase 5 baseline (23 tests, all hooks wired correctly) | This packet builds on it | Already shipped and verified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
**Non-functional requirements** (folded here under SC § for Level 2 brevity):

- *Performance*: in-flight dedup reduces subprocess spawn rate by N for concurrent identical-key bursts. LRU eviction is O(1) amortized via insertion-order Map iteration. Per-instance state has zero runtime overhead.
- *Reliability*: plugin must continue to fail open (return `{}` from `appendAdvisorBrief`) on any error. Two-instance independence holds under concurrent load.
- *Compatibility*: no changes to OpenCode hook contract, plugin API, or bridge subprocess protocol.
- *Security*: brief clamp is defense-in-depth against bridge regression returning oversized content. Prompt clamp limits stdin payload size.

**Acceptance scenarios**:

- **Given** two plugin instances loaded with different `ctx` objects, **When** instance A handles a prompt, **Then** instance B's `cacheHits/cacheMisses/runtime_ready/lastBridgeStatus` are unaffected.
- **Given** N=5 concurrent calls to `getAdvisorContext` with the same key, **When** the cache is empty, **Then** exactly 1 bridge subprocess spawn happens and all 5 callers receive the same result.
- **Given** a prompt of 100KB, **When** `getAdvisorContext` is called, **Then** the bridge stdin payload contains a prompt no larger than `MAX_PROMPT_BYTES`.
- **Given** a bridge response with a 10KB brief, **When** `appendAdvisorBrief` runs, **Then** `output.system[0].length <= MAX_BRIEF_CHARS`.
- **Given** `MAX_CACHE_ENTRIES + 1` distinct cache keys are inserted in order, **When** the (MAX+1)th insertion happens, **Then** the cache size stays at MAX and the first-inserted key is gone.
- **Given** the existing 23 Phase 5 tests, **When** the refactor lands, **Then** all 23 still pass.
<!-- /ANCHOR:questions -->

---

## 10. OPEN QUESTIONS

None remaining at spec time. ADR-005 in packet 007 enumerated the three deferrals; this spec turns them into requirements REQ-001 through REQ-005.

---

**Related documents**:

- Sibling packet (source of deferrals): `../007-opencode-plugin-loader-remediation/decision-record.md` ADR-005
- Plugin file: `.opencode/plugins/spec-kit-skill-advisor.js` lines 28-36 (module-global state), 298-322 (`getAdvisorContext`), 348-405 (`appendAdvisorBrief`)
- Existing test file: `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts`
- Compact plugin reference: `.opencode/plugins/spec-kit-compact-code-graph.js` (similar plugin, can be consulted for closure-state pattern if needed)
