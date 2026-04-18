# Iteration 001

## Focus

H-56-1 cascade consistency across the Phase 017 T-CNS-03 sibling sweep. Inspect `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` across the `026-graph-and-context-optimization/` sibling tree, then separate historical sweep provenance from current freshness state.

## Actions Taken

1. Read the Phase 018 loop contract and strategy to confirm the iteration target and output requirements.
2. Read Phase 017 review artifacts that already cited T-CNS-03 ordering evidence, especially the iteration-009 and consolidated review findings for the sibling sweep.
3. Enumerated current sibling-folder `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` values across `001` through `019`, then computed per-folder deltas.
4. Ran JSON parse validation on sibling `graph-metadata.json` files to keep the original sweep set distinct from newer malformed metadata.

## Findings

### P1. T-CNS-03 provenance is internally inconsistent on both ordering and scope

Phase 017 review iteration 009 already disproved the "single coherent 16-folder sweep" narrative. It recorded:

- Batch A at `2026-04-17T14:42:34.216Z..302Z`: `011`, `012`, `014`, `015`, `016`, `017`
- Batch B at `2026-04-17T15:45:19.000Z`: `001`, `002`, `003`, `004`, `005`, `006`, `007`, `008`, `009`, `010`, `013`

That is 17 enumerated targets while the packet repeatedly calls the rollout a "16-folder sweep." The 1h03m split means the sweep was at least two passes, not one uniform cascade. Batch B also carries the exact `.000Z` suffix on every folder, which matches the prior review suspicion that this path may have been manually backfilled or normalized through a different writer than Batch A.

### P1. Current lower-bound freshness failures have reopened on 7 historical sweep folders

Current disk state shows `graph-metadata.json.derived.last_save_at` moved forward on `2026-04-18` for these folders while `description.json.lastUpdated` remained on `2026-04-17`:

- `001` through `006`: `deltaMin = -1049`
- `011`: `deltaMin = -1112`

These folders now violate the 10-minute freshness guard by roughly 17.5 to 18.5 hours if the contract is interpreted as "description must not be older than graph save time by more than 10 minutes." This indicates the H-56-1 aftermath is not stable under later metadata regeneration, because graph freshness advanced without a matching `description.json.lastUpdated` refresh.

### P2. The threshold contract is ambiguous, and current results diverge depending on which wording is authoritative

The Phase 017 packet uses both:

- A one-sided rule: `description.json.lastUpdated >= graph-metadata.json.derived.last_save_at - 10m`
- A symmetric rule: timestamps must remain `<= 10m divergent`

Under the one-sided rule, 7 folders currently fail (`001`-`006`, `011`). Under the symmetric rule, almost the entire historical sibling set fails:

- `007`-`010`: `deltaMin = +5922`
- `012`: `+2713`
- `013`: `+3171`
- `014`: `+2998`
- `016`: `+203`
- `017`: `+264`
- `015`: no `last_save_at`

This means the packet currently lacks a single stable pass/fail definition for continuity freshness.

### P2. A third `lastUpdated` cluster now exists, so timestamp-only provenance can no longer reconstruct the original sweep

Current `description.json.lastUpdated` values are no longer just the two Phase 017 batches. A later cluster at `2026-04-17T18:43:49.606Z` now exists on:

- `007`, `008`, `009`, `010`, `014`, `015`, `017`

That later touch collapses the original batch membership on disk, so any later audit that only reads current timestamps cannot reliably infer which folders were touched by the original T-CNS-03 run versus later follow-up edits.

### P2. Adjacent metadata integrity issue outside the original sweep set

Two newer sibling folders are not parseable JSON at all:

- `018-deep-loop-cli-executor/graph-metadata.json`
- `019-cli-runtime-matrix/graph-metadata.json`

Both files end with literal `</content>` / `</invoke>` markers after the closing JSON object. These are not part of the original Phase 017 sweep cohort, but they are relevant because malformed graph metadata will distort any future tree-wide freshness or readiness sweep that assumes parseable JSON.

## Questions Answered

- Q1. H-56-1 cascade ordering consistency: partially answered.
  Evidence now confirms the original sweep was not a single uniform pass, the documented target count is internally inconsistent (16 vs 17 enumerated folders), and the current tree has reopened freshness failures on 7 historical sweep folders.

## Questions Remaining

- Was Batch B (`15:45:19.000Z`) produced by a manual backfill, a different save path, or a secondary canonical-save invocation?
- Which exact set was intended by "16-folder sweep": `001`-`016`, `001`-`017`, or a set that excluded one sibling later included in review evidence?
- Are the `2026-04-18T09:14:24Z` graph updates on `001`-`006` and `011` coming from canonical save, graph-only regeneration, or another maintenance path that bypasses `description.json.lastUpdated`?
- Should the continuity threshold be enforced as a one-sided freshness guard or a symmetric absolute-delta contract?

## Next Focus

Q2: `description.json` auto-regeneration preserve-field gaps. Inspect why later regeneration advances graph freshness without preserving or refreshing richer `description.json` content, especially in the stubby/small sibling folders (`014`, `015`, `017`, plus the very small `007`-`010` set).
