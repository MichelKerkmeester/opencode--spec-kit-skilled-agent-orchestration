# Iteration 003

## Focus

Q3: code-graph readiness vocabulary completeness. Inspect whether all `SharedPayloadTrustState` values are actually reachable from the 7 code-graph handlers, and separate live readiness vocabulary from dead or documentation-only enum states.

## Actions Taken

1. Read the shared readiness contract at `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/readiness-contract.ts` to confirm the intended mapping from `GraphFreshness` to `SharedPayloadTrustState`.
2. Read the canonical trust-state enum and helper mappers in `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` to distinguish the full 8-state vocabulary from the subsets emitted by individual producers.
3. Inspected the 7 code-graph handlers `query.ts`, `status.ts`, `scan.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, and `ccc-feedback.ts` to enumerate their actual `trustState` emission paths.
4. Compared those handler-level paths with other shared-payload producers (`trustStateFromCache`, `trustStateFromGraphState`, `compact-merger.ts`) to identify which enum values are live elsewhere but unreachable on this surface.

## Findings

### P1. The Phase 017 "shared readiness vocabulary" is type-level convergence, not value-level convergence across the 7 handlers

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/readiness-contract.ts:12-26,77-106,137-157`.
- The module explicitly documents a 3-value projection from `GraphFreshness ('fresh'|'stale'|'empty')` onto `SharedPayloadTrustState`, with only `live`, `stale`, and `absent` reachable through `queryTrustStateFromFreshness()`.
- `buildReadinessBlock()` is the normal success-path helper reused by the handler family.

Impact:
- The handlers share one type and one helper module, but they do not share the full canonical 8-state runtime vocabulary.
- Any Phase 019 scoping that assumes "all handlers now speak the full shared-payload trust-state axis" would be overstated. The runtime reality is narrower: the standard code-graph readiness path only knows about graph freshness, not cache/migration provenance.

### P1. Handler-by-handler reachability is asymmetric: `query`, `status`, and `scan` only emit `live|stale|absent`; `context` adds an exceptional `unavailable`; the 3 `ccc-*` handlers only emit `unavailable`

Reproduction path:
- `query.ts` builds readiness through `buildReadinessBlock(readiness)` and returns an error payload if `ensureCodeGraphReady()` throws, so its successful payload can only contain `live`, `stale`, or `absent`.
- `status.ts` and `scan.ts` also use `buildReadinessBlock(...)` without any `unavailable` override.
- `context.ts` uses `buildReadinessBlock(...)`, but overrides `trustState` to `unavailable` when the readiness probe crashes (`reason: 'readiness_check_crashed'`).
- `ccc-status.ts`, `ccc-reindex.ts`, and `ccc-feedback.ts` bypass `buildReadinessBlock()` entirely and always return `trustState: 'unavailable'` inside `buildUnavailableReadiness('readiness_not_applicable')`.

Reachability matrix:
- `query`: `live`, `stale`, `absent`
- `status`: `live`, `stale`, `absent`
- `scan`: `live`, `absent`
- `context`: `live`, `stale`, `absent`, `unavailable`
- `ccc-status`: `unavailable`
- `ccc-reindex`: `unavailable`
- `ccc-feedback`: `unavailable`

Impact:
- The 7 handlers do not expose a uniform per-handler vocabulary even though the Phase 017 packet described them as one converged readiness family.
- `scan` currently cannot surface `stale` on success because it derives readiness from `lastPersistedAt ? 'fresh' : 'empty'`, not from `ensureCodeGraphReady()`; that makes it materially different from `query`/`status`/`context`.

### P2. Four enum values are dead for the code-graph handler family, and three of them look dead across the current `mcp_server` runtime

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:20-35` for the full canonical enum.
- Search the code-graph handlers plus readiness-contract module for literal emissions.
- `cached` is only produced by `trustStateFromCache(...)`, which is a cache-age helper outside the 7-handler family.
- `imported`, `rebuilt`, and `rehomed` appear in the enum/commentary but do not appear as emitted literals in the inspected `mcp_server` producers surfaced during this pass.

Impact:
- For Q3 specifically, `cached`, `imported`, `rebuilt`, and `rehomed` are documentation-only or future-facing states, not live readiness vocabulary for code-graph handlers.
- `cached` is still live elsewhere in the broader shared-payload system, so it is not globally dead. `imported`, `rebuilt`, and `rehomed` look like stronger candidates for repo-wide dead-vocabulary follow-up, but that would need a dedicated full-runtime sweep before calling them globally unreachable.

### P2. `unavailable` is not part of the normal readiness-contract projection; it only leaks in through out-of-band escape hatches and "not applicable" wrappers

Reproduction path:
- `queryTrustStateFromFreshness()` never returns `unavailable`.
- `context.ts` manufactures `unavailable` only when the readiness check throws.
- `ccc-status.ts`, `ccc-reindex.ts`, and `ccc-feedback.ts` manufacture `unavailable` because their readiness block is declared "not applicable", not because the code graph was probed and found inaccessible.
- The canonical `trustStateFromGraphState()` helper in `shared-payload.ts` maps `'error' -> 'unavailable'`, but the 7-handler readiness contract never consumes a `GraphFreshness` value of `error`.

Impact:
- There are really two different semantic sources behind `unavailable` on this surface:
  1. a genuine readiness probe failure (`context.ts`)
  2. a synthetic "this handler is not a code-graph readiness probe" placeholder (`ccc-*`)
- That semantic overload makes `unavailable` a weak signal for Phase 019 consumers unless the response `reason` is inspected alongside it.

## Questions Answered

- Q3. Are all 8 `SharedPayloadTrustState` enum values actually reachable from each of the 7 code-graph sibling handlers?
  Partially answered: no. The handler family only exercises a 4-state runtime subset (`live`, `stale`, `absent`, `unavailable`), and no single handler reaches all four. The normal readiness-contract projection is only `live|stale|absent`; `unavailable` comes from handler-specific escape hatches or "not applicable" wrappers. `cached`, `imported`, `rebuilt`, and `rehomed` are unreachable on this surface.

## Questions Remaining

- Is `scan.ts` intentionally excluded from stale-readiness reporting, or is its `fresh|empty` shortcut an accidental divergence from the claimed family contract?
- Should the `ccc-*` handlers keep using `trustState: 'unavailable'` for "not applicable", or would a separate field avoid overloading the same trust-state literal used for genuine readiness probe failures?
- Are `imported`, `rebuilt`, and `rehomed` still needed in `SharedPayloadTrustState`, or are they now dead-weight vocabulary after the compact-cache and migration work stabilized?
- Do any downstream consumers branch on the full 8-state union for code-graph handler responses, or have they already implicitly learned the narrower 3-4 state subset?

## Next Focus

Q9: evidence-marker bracket-depth lint false-positive surface. Inspect whether nested fences, mismatched fenced content, or parenthesis-heavy evidence blocks can trigger invalid bracket-depth diagnostics despite syntactically acceptable markdown.
