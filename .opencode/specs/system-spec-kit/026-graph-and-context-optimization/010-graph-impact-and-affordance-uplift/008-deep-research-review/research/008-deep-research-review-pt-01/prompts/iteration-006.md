# Deep-Research Iteration 006 — 010/005 trust-badge merge + age allowlist + dbGetter DI + cache invalidation

You are a fresh-context deep-research executor (cli-codex gpt-5.5 high fast). No memory of prior iterations. Defensive code review of internal memory + trust-display system. Read-only.

## Iters 1-5 — closure-integrity flags so far (do not duplicate)

⚠️ **2 confirmed gaps against 010/007 closure claims** (extend if relevant, do not redescribe):
- **F12 (P2)**: 010/007/T-F R-007-P2-4 limit+1 overflow detection NOT implemented as documented (re-confirmed iter 4).
- **F14-iter5 (P2)**: 010/007/T-D R-007-8 conflicts_with reject only landed in Python compiler; TS normalizer still accepts it (TS/PY parity gap).

Plus 1 P1 (mixed-header path bypass) + 13 other P2s. Iters 3+4+5 thoroughly covered 010/003-004.

## This iteration shifts focus to 010/005 (memory causal trust display) + 010/007/T-E (DI seam) + 010/007/T-F R-007-12 (cache invalidation)

## Audit checklist

### Section A — Trust-badge merge-per-field semantics (010/007/T-D R-007-11)

A1. Cite `mcp_server/formatters/search-results.ts` `mergeTrustBadges` function (or equivalent). Walk through the per-field overlay logic.
A2. When caller supplies `{ confidence: null, extractionAge: 'never', orphan: null, ... }` — what does the merge return?
A3. When caller supplies `{ confidence: 0.9 }` (only one field, all others undefined) — does the merge: (a) accept partial and use derived for the rest, (b) reject as incomplete, (c) coerce to undefined and fall through?
A4. When derived is `undefined` (no DB rows) AND caller-supplied is also incomplete — confirm the badge is omitted (not shipped half-formed).
A5. Cite the test that exercises a partial caller-supplied badge with derived fallback.

### Section B — Age-label allowlist (010/007/T-D R-007-P2-10)

B1. Cite the regex pattern. Quote it exactly.
B2. Confirm the regex matches: `never`, `today`, `yesterday`, `1 day ago`, `1 days ago`, `1 week ago`, `999999 months ago`. Reject: `xx`, `1day ago`, `tomorrow`, `1 yr ago`, `\x07 days ago`.
B3. Length cap: 32 chars. Cite where this is enforced.
B4. What's the fallthrough behavior when allowlist rejects? Does it call `formatAgeString` to derive from a timestamp?

### Section C — `dbGetter` DI seam (010/007/T-E R-007-13)

C1. Cite the `fetchTrustBadgeSnapshots` function signature. Confirm the optional `dbGetter` parameter exists.
C2. Default `dbGetter = requireDb` — confirm.
C3. Production callers — does anyone outside tests pass a custom `dbGetter`? If yes, cite. If no, is the seam genuinely test-only?
C4. The 010/007/T-E commit message claims a latent SQL bind-type bug was fixed (`resultIds.map(String)`). Cite that fix.
C5. Trust-badges test: does it exercise the SQL pipeline (3 cases) or only the formatter pass-through? Cite.

### Section D — Cache invalidation generation counter (010/007/T-F R-007-12)

D1. Cite `causalEdgesGeneration` declaration in `mcp_server/lib/storage/causal-edges.ts`.
D2. Cite `bumpCausalEdgesGeneration` and the call sites — every mutator should bump.
D3. Cite `getCausalEdgesGeneration` export.
D4. Cite `mcp_server/lib/search/search-utils.ts` where `causalEdgesGeneration` is accepted on `CacheArgsInput` and gated by `enableCausalBoost === true`.
D5. Cite `mcp_server/handlers/memory-search.ts` where the generation is read and threaded through.
D6. **Boundary**: when `enableCausalBoost === false`, is the generation OMITTED from the cache key (so non-causal callers don't suffer needless invalidation)? Cite the conditional.
D7. Race condition risk: if two requests race during a mutation, can one read a stale generation? Trace through.

### Section E — Trust-badge fetch result shape (010/007/T-D R-007-P2-11)

E1. Cite `TrustBadgeFetchResult` type definition. Quote the shape `{snapshots, attempted, derivedCount, failureReason}`.
E2. Cite where `failureReason: 'no_db' | 'no_results' | 'query_error' | null` is set per branch.
E3. Cite the trace flag `MemoryResultTrace.trustBadgeDerivation`.
E4. **Integration check**: 011 work changed test calls from `snapshots.get(...)` to `fetchResult.snapshots.get(...)` because the return shape was harmonized to T-D's. Confirm this is consistent across all callers.

## Read first

1. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/strategy.md`
2. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`
3. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`
4. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts`
5. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
6. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory/trust-badges.test.ts`
7. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts`
8. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts`

## Output contract

Write to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-006.md`:

```markdown
---
_memory:
  continuity:
    next_safe_action: "[1 sentence on iter 007 focus]"
---
# Iteration 006 — 010/005 trust-badge + cache invalidation audit

**Focus:** Audit trust-badge merge, age-label allowlist, dbGetter DI, R-007-12 cache invalidation generation counter.
**Iteration:** 6 of 10
**Convergence score:** [0.00–1.00]

## Section A verdicts (merge-per-field)
- A1..A5

## Section B verdicts (age-label allowlist)
- B1..B4

## Section C verdicts (dbGetter DI seam)
- C1..C5

## Section D verdicts (cache invalidation generation counter)
- D1..D7

## Section E verdicts (TrustBadgeFetchResult shape)
- E1..E4

## New findings
[Each: severity, remediation, RQ, file:line evidence — use UNIQUE IDs F<NNN> not previously used in iters 1-5]

## Negative findings
- [HANDLED items]

## RQ coverage cumulative through iter 6
- RQ1..RQ5

## Next iteration recommendation
[Iter 007 should drill 010/006 umbrella docs vs code reality per strategy.md]
```

JSONL delta to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/deltas/iteration-006.jsonl`:

```jsonl
{"iter":6,"convergence_score":<0.0-1.0>,"findings":[...],"checklist_handled":<int>,"checklist_gap":<int>,"rq_coverage":{...},"new_p0":<int>,"new_p1":<int>,"new_p2":<int>}
```

Last line:
`EXIT_STATUS=DONE | findings=N | convergence=X.XX | checklist=H/G | next=iter-007`

## Hard rules

- Defensive code-review. HANDLED-vs-GAP verdicts with file:line citations.
- Use UNIQUE finding IDs F16, F17, F18, ... (do not reuse F1..F15 — those are taken across iters 1-5).
- Tool budget: target 8 tool calls, max 12.
