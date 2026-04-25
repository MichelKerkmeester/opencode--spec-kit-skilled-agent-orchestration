---
title: "203 -- Memory causal trust display"
description: "This scenario validates display-only trust badges for `203`. It focuses on additive envelope badges, orphan detection, age rendering, weight-history surfacing, and response-profile preservation."
audited_post_018: true
---

# 203 -- Memory causal trust display

## 1. OVERVIEW

This scenario validates memory causal trust display for `203`. It focuses on additive envelope badges, orphan detection, age rendering, weight-history surfacing, and response-profile preservation.

---

## 2. CURRENT REALITY

Operators validate the display layer, not storage. The scenario confirms `memory_search` results surface `trustBadges` derived from existing causal-edge metadata, and that response profiles preserve the same per-result badge payload instead of dropping it during shaping.

- Objective: Verify additive per-result trust badges for confidence, extraction age, last access age, orphan status, and weight-history change state
- Prompt: `As a memory-quality validation operator, validate Memory causal trust display against the search-result formatter and response-profile layer. Verify trustBadges are additive, derived from existing causal-edge metadata only, preserved through response profiles, and do not require schema or relation-vocabulary changes. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: `trustBadges` appear on search results; confidence is sourced from edge strength; ages render from causal-edge timestamps; orphan becomes true when inbound causal edges are absent; weight-history change becomes true when `weight_history` contains a connected edge; quick and research profiles preserve the badge payload
- Pass/fail: PASS if formatter output contains the five badge fields with stable values and response profiles preserve them. FAIL if badges are missing, top-level only, dependent on new schema, or stripped by profile formatting.

---

## 3. TEST EXECUTION

### Prompt

```text
As a memory-quality validation operator, validate Memory causal trust display against the search-result formatter and response-profile layer. Verify trustBadges are additive, derived from existing causal-edge metadata only, preserved through response profiles, and do not require schema or relation-vocabulary changes. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

**Block A — Badge derivation + profile preservation (010/005):**

1. `rg -n "trustBadges|MemoryTrustBadges|weightHistoryChanged|extractionAge|lastAccessAge|orphan" .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts .opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts`
2. `git diff -- .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
3. `cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run tests/memory/trust-badges.test.ts tests/response-profile-formatters.vitest.ts`

**Block B — Cache invalidation on causal-edge mutation (R-007-12, 010/007/T-F):**

4. **Setup**: pick a memory ID `<M>` that already exists. Run `memory_search({ query: "<predictable-query>", limit: 5, enableCausalBoost: true })`. Capture the response and the cache-key fingerprint (or response hash) — call this `H1`.
5. **Re-run identical query** without any mutation: `memory_search({ query: "<predictable-query>", limit: 5, enableCausalBoost: true })`. Capture fingerprint `H1'`. Assert `H1 === H1'` (cache hit on the same generation; the underlying response is stable).
6. **Mutate causal edges**: call `memory_causal_link({ sourceId: "<M>", targetId: "<other-id>", relation: "supports", strength: 0.7 })` to bump the causal-edges generation counter (R-007-12 fix bumps the counter inside `invalidateDegreeCache()`, the universal mutation call site).
7. **Re-run identical query**: `memory_search({ query: "<predictable-query>", limit: 5, enableCausalBoost: true })`. Capture fingerprint `H2`. Assert `H2 !== H1` — the generation counter was folded into the cache key, forcing a fresh computation. The new boosted ranking may surface `<M>` higher in results.
8. **Negative control — non-causal-boost caller**: `memory_search({ query: "<predictable-query>", limit: 5, enableCausalBoost: false })` before and after a causal mutation. Assert fingerprints unchanged across the mutation (R-007-12 only folds the generation when `enableCausalBoost === true` — non-causal callers don't suffer needless cache misses).
9. **Teardown**: `memory_causal_unlink({ sourceId: "<M>", targetId: "<other-id>", relation: "supports" })` to restore baseline causal state.

### Expected

- Block A: source grep finds the additive badge interface + formatter wiring; static diff shows no schema changes in `causal-edges.ts` (decay logic still at `causal-boost.ts:327-338`); targeted Vitest covers badge derivation + profile preservation; trust-badges suite exits 3/3 PASS (post 010/007/T-E unskip).
- Block B: H1 === H1' (cache stable without mutation), H2 !== H1 (mutation invalidates), enableCausalBoost=false unchanged across mutation (targeted invalidation, not wholesale).

### Evidence

Saved `rg` output, static diff output for the protected files, the final Vitest summary for trust-badge + response-profile-formatter suites, the four cache fingerprints (H1, H1', H2, plus the two non-causal-boost fingerprints), and the `memory_causal_link` / `memory_causal_unlink` response payloads.

### Pass / Fail

- **Pass**: Block A — formatter/profile layer contain expected badge wiring, protected-file diffs show no forbidden changes, targeted Vitest exits 0. Block B — H2 !== H1 after causal mutation (cache invalidated), AND non-causal-boost fingerprints stable across the same mutation (targeted not wholesale).
- **Fail**: Block A — any badge field missing, protected files changed in forbidden ways, or Vitest fails. Block B — H2 === H1 (R-007-12 regression: stale cache after causal mutation), OR non-causal-boost fingerprint changed across mutation (over-aggressive invalidation, contradicting the gated-by-`enableCausalBoost` design).

### Failure Triage

- **Block A**: Inspect `mcp_server/formatters/search-results.ts` for badge derivation + DB lookup, `mcp_server/lib/response/profile-formatters.ts` for profile preservation, `mcp_server/tests/memory/trust-badges.test.ts` for runtime contract. Note: 010/007/T-E DI fix exposes `fetchTrustBadgeSnapshots` with optional `dbGetter` parameter; trust-badges suite was previously `describe.skip` and is now 3/3 PASS.
- **Block B**: Inspect `mcp_server/lib/storage/causal-edges.ts` for `causalEdgesGeneration` counter + `invalidateDegreeCache()` mutator; `mcp_server/lib/search/search-utils.ts` for `causalEdgesGeneration?: number` on `CacheArgsInput` gated by `enableCausalBoost === true`; `mcp_server/handlers/memory-search.ts` for the import + thread-through (010/007/T-F R-007-12).

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/28-memory-causal-trust-display.md](../../feature_catalog/13--memory-quality-and-indexing/28-memory-causal-trust-display.md)
- Source files: `mcp_server/formatters/search-results.ts`, `mcp_server/lib/response/profile-formatters.ts`
- Regression tests: `mcp_server/tests/memory/trust-badges.test.ts`, `mcp_server/tests/response-profile-formatters.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 203
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/28-memory-causal-trust-display.md`
- Phase / sub-phase: `026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/005-memory-causal-trust-display` (baseline) + `026/010/007-review-remediation` T-E (DI rig + bind-type fix R-007-13) + T-F (cache invalidation R-007-12)
- Coverage extension: 010/011-manual-testing-playbook-coverage-and-run (Block B added)
