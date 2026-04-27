---
title: "Deep Review — 005-memory-causal-trust-display"
description: "7-iteration scoped review with P0/P1/P2 findings."
generated_by: cli-codex gpt-5.5 high fast
generated_at: 2026-04-25T13:19:55Z
iteration_count: 7
---

# Deep Review — 005-memory-causal-trust-display

## Findings by Iteration

### Iteration 1 — Correctness

- P1 — Partial or malformed explicit `trustBadges` suppress correct DB-derived badges. `normalizeTrustBadges()` accepts any object and fills missing fields with `null`, `"never"`, or `false`; `formatSearchResults()` then prefers that object over the derived snapshot with `explicitTrustBadges ?? derivedTrustBadges`. A caller that sends `{ trustBadges: {} }` or only one field will erase the computed `strength`, `extracted_at`, `last_accessed`, orphan, and weight-history values required by the spec. Evidence: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:235`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:239`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:246`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:609`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:613`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/spec.md:80`. Fix: reject incomplete explicit badge objects, or merge valid explicit fields over the derived snapshot instead of replacing it wholesale.

### Iteration 2 — Security & Privacy

- P2 — Explicit badge age labels are emitted verbatim, creating a small prompt-stuffing surface in a trust UI field. The formatter clamps numeric confidence, but it accepts `extractionAge` and `lastAccessAge` strings as-is before preserving caller-supplied badges over derived values. The pt-02 risk model is strict about owner boundaries and prompt-stuffing surfaces; this field should stay a compact display label, not arbitrary caller text. Evidence: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:239`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:240`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:243`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:609`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:613`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/research.md:267`. Fix: derive age strings from timestamps where possible, and cap/sanitize explicit display strings to a small allowlisted age-label grammar.

### Iteration 3 — Integration

- P1 — Cached `memory_search` responses can serve stale trust badges after causal-edge changes. The cache key is built from search arguments, not causal-edge state; formatted responses, including `trustBadges`, are cached for the default 60 seconds. Causal-edge mutations invalidate degree and graph-signal caches, but they do not bump or clear the `memory_search` tool cache, so recent `strength`, `last_accessed`, or `weight_history` updates can be hidden behind a cache hit. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:880`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1188`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1190`, `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:56`, `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:58`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:150`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:160`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:660`. Fix: include a causal-edge generation/version in the cache key or invalidate `memory_search` cache entries when causal edges or weight history mutate.

### Iteration 4 — Performance

- P2 — Trust-badge SQL runs for every result before profile shaping can discard most of the payload. `formatSearchResults()` always calls `fetchTrustBadgeSnapshots(results)`, then the handler applies response profiles later; `quick` profile may keep only `topResult`. This is bounded by result limits, so it is not a hot-path blocker, but it does extra DB work for reduced profiles. Evidence: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:262`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:298`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:582`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1471`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1477`. Fix: either pass effective profile into formatting and limit badge derivation for `quick`, or accept this deliberately and document the bounded cost.

### Iteration 5 — Maintainability

- P2 — The `trustBadges` shape is duplicated with different optionality across formatter and profile layers. `MemoryTrustBadges` requires all fields, while `SearchResultEntry.trustBadges` redeclares the same fields as optional. That makes future field additions easy to drop silently in response profiles. Evidence: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:152`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:158`, `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:54`, `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:60`. Fix: export and reuse the canonical badge type, or define a shared structural type for profile entries.

### Iteration 6 — Observability

- P2 — Badge derivation failures are silent and are not surfaced in trace or telemetry. `fetchTrustBadgeSnapshots()` returns an empty map when `requireDb()` fails or when the SQL query fails; later telemetry records graph-walk diagnostics, but not badge derivation status. The result is indistinguishable from "no causal trust data exists," which makes missing badges hard to debug. Evidence: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:271`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:275`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:348`, `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:350`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1322`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1327`. Fix: add a non-user-facing trace flag or telemetry field such as `trustBadges: { attempted, derivedCount, failureReason }`, keeping the response fail-open.

### Iteration 7 — Evolution

- P1 — The core SQL-dependent acceptance tests are skipped, so the packet cannot safely evolve yet. The spec asks for badge population, age calculation, orphan detection, and integration coverage; the test file contains those cases but wraps the suite in `describe.skip`, and the implementation summary says targeted Vitest and TypeScript execution were blocked. This leaves the highest-risk behavior unexecuted in CI/local verification. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/spec.md:92`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/spec.md:97`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory/trust-badges.test.ts:77`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory/trust-badges.test.ts:84`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory/trust-badges.test.ts:96`, `.opencode/skill/system-spec-kit/mcp_server/tests/memory/trust-badges.test.ts:130`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/implementation-summary.md:112`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/implementation-summary.md:113`. Fix: rewrite the test rig to inject the DB dependency or run these as integration tests against a real fixture, then remove `.skip` before relying on this surface in follow-on packets.

## Severity Roll-Up

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 3 |
| P2 | 4 |

## Top 3 Recommendations

1. Unskip or replace the SQL-backed trust-badge tests with a real DB fixture, then run targeted Vitest and typecheck in a dependency-ready environment.
2. Fix explicit `trustBadges` handling so partial caller payloads cannot override complete DB-derived trust data.
3. Tie `memory_search` cache validity to causal-edge/weight-history mutations, or avoid caching dynamic trust badge fields.

## Convergence

- Iterations completed: 7/7
- New-info ratio per iteration: [it1: 0.82, it2: 0.41, it3: 0.64, it4: 0.32, it5: 0.28, it6: 0.35, it7: 0.46]
- Final state: ALL_FINDINGS_DOCUMENTED
