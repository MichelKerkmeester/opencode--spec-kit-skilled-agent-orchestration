# Iteration 027

## Focus

Q1 follow-up: inspect the 16-folder canonical-save sweep ordering invariants directly and separate original H-56-1 aftermath behavior from later metadata-only rewrites. The goal for this pass was to decide whether the stale / negative / date-only patterns came from the Phase 017 batches, later manual edits, or a broader save-coupling gap.

## Actions Taken

1. Re-read the prior Q1 baseline in [iteration-001.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/iterations/iteration-001.md) and the latest threshold follow-up in [iteration-026.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/iterations/iteration-026.md) to anchor this pass on already-proved Q1/Q10 evidence.
2. Enumerated current sibling-folder `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` values across the `026-graph-and-context-optimization` phase tree to identify which folders still show the strongest skew.
3. Pulled the exact file lists for the Phase 017 aftermath commits `8859da9cd` and `176bad2b2`, plus later metadata-touch commits `938da57c3`, `20bc0f1a3`, and `181f89fbc`, to reconstruct which surfaces were actually rewritten.
4. Checked live git status and last-touch history for the currently skewed graph files under `001`-`006` and `011` to determine whether the visible `2026-04-18` graph timestamps came from committed sweep aftermath or newer working-tree-only regeneration.

## Findings

### P1. The original H-56-1 aftermath never established a same-pass 16-folder invariant; both rollout batches were already one-sided

Reproduction path:
- Read [iteration-001.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/iterations/iteration-001.md) for the previously localized Batch A / Batch B split.
- Run `git show --name-only 8859da9cd` and `git show --name-only 176bad2b2` scoped to `026/*/description.json` and `026/*/graph-metadata.json`.

Evidence:
- `8859da9cd` (`chore(017): H-56-1 cascade — description.json lastUpdated refresh across 26-tree`) touched `description.json` for `011`, `012`, `014`, `015`, `016`, and `017`, but only touched `graph-metadata.json` for `016` and `017`.
- `176bad2b2` (`chore(017): T-CNS-03 — 16-folder canonical-save sweep`) touched `description.json` for `001`-`010` and `013`, and touched no sibling `graph-metadata.json` files at all.
- That means the documented aftermath was not a synchronized `description.json` + `graph-metadata.json` refresh. It was 17 enumerated folders across two commits, with 15 of those folders receiving description-only writes.

Why this matters:
- The current skew cannot be explained as a later breakage of a once-strong invariant. The invariant never existed in the original rollout.
- Phase 019+ should describe Q1 as a provenance / coupling defect, not as a clock-skew bug inside an otherwise atomic metadata sweep.

### P1. The strongest current negative deltas on `001`-`006` and `011` come from newer graph-only regeneration, not from the original Phase 017 batches

Reproduction path:
- Read the current `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` pairs for `001`-`006` and `011`.
- Run `git status --short` and `git log -1` on each affected `graph-metadata.json`.

Evidence:
- The live corpus currently shows `description.json.lastUpdated = 2026-04-17T15:45:19.000Z` on `001`-`006` and `2026-04-17T14:42:34.216Z` on `011`, while `graph-metadata.json.derived.last_save_at` has moved to about `2026-04-18T10:18:14Z`.
- All seven affected `graph-metadata.json` files are currently modified in the working tree (`git status --short` reports `M`), and their most recent committed touch is `5beb15031` (`chore: workspace sync — agent instruction restructure + parallel-track updates`) on `2026-04-18 11:21:35 +0200`.
- No Phase 017 aftermath commit touched those graph files in the matching folders, so the current negative-delta cluster is a newer graph-only regeneration layer stacked on top of the earlier description-only sweep state.

Why this matters:
- The visible "description older than graph" failures on these folders are not reliable evidence against the original 2026-04-17 sweep by themselves.
- The live Q1 story is now two-stage: Phase 017 created a one-sided baseline, and later graph-only refreshes reopened / amplified the negative side of the skew.

### P2. A later description-only refresh created the opposite polarity on `007`-`010`, `014`, `015`, and `017`

Reproduction path:
- Run `git show --name-only 938da57c3` scoped to `026/*/description.json`.
- Compare the touched set with current `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` values.

Evidence:
- `938da57c3` (`chore(018): T-DESC-01 — refresh packet descriptions`) touched only `description.json` for `007`, `008`, `009`, `010`, `014`, `015`, and `017`.
- Those folders now carry the later `2026-04-17T18:43:49.606Z` description stamp while their `derived.last_save_at` values remain older (`2026-04-13`, `2026-04-15`, or `2026-04-17T14:20:00Z`).
- This is the mirror image of the `001`-`006` / `011` cluster: another one-surface rewrite that shifts the pair without any shared save marker.

Why this matters:
- Mixed timestamp polarity across the 026 sibling tree is not evidence of concurrency races. It is evidence that both metadata surfaces are being refreshed independently over time.
- Phase 019+ should treat "later description refresh" and "later graph refresh" as separate drift sources that both stem from the same missing same-pass provenance contract.

### P2. The "date-only" pattern does not belong to the `description.json` / `graph-metadata.json` pair at all; it is continuity noise from a different surface

Reproduction path:
- Compare the current Q1 sibling scan (`description.json.lastUpdated` versus `graph-metadata.json.derived.last_save_at`) with the Q10 continuity scan recorded in [iteration-026.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/iterations/iteration-026.md).

Evidence:
- The current `description.json.lastUpdated` values in the inspected 026 sibling set are full ISO timestamps; this pass did not surface any date-only `description.json` values.
- The date-only examples previously localized in iteration 026 were `_memory.continuity.last_updated_at` fields inside `implementation-summary.md`, not `description.json`.
- That means the "date-only" branch of the freshness confusion is coming from later continuity/frontmatter editing, not from the H-56-1 aftermath sweep or the `description.json` writer itself.

Why this matters:
- Q1 can now be scoped more tightly. The `description.json` / `graph-metadata.json` problem is an independent one-sided refresh contract issue.
- The continuity date-only problem still matters for Phase 019+, but it should not be treated as direct evidence about the T-CNS-03 sibling sweep.

## Questions Answered

- Q1 is now materially tighter: the stale / negative patterns are not all from one source.
- The original H-56-1 aftermath batches already lacked a same-pass metadata invariant and were mostly description-only.
- The current negative cluster on `001`-`006` and `011` comes from newer graph-only regeneration layered on top of that baseline.
- The opposite-polarity cluster on `007`-`010`, `014`, `015`, and `017` comes from a later description-only refresh.
- The date-only issue belongs to continuity/frontmatter state, not to the `description.json` / `graph-metadata.json` pair.

## Questions Remaining

- Which runtime or operator path produced the current uncommitted graph-only regeneration on `001`-`006` and `011`, and is that path expected to leave `description.json.lastUpdated` untouched?
- Should Phase 019+ treat the fix as a shared save-lineage marker problem, or is there a smaller acceptable contract such as explicit "graph-only refresh" and "description-only refresh" provenance fields?
- Q2 remains open: even if provenance is clarified, `generate-description.js` can still overwrite or flatten hand-authored rich descriptions unless the preserve-field contract is tightened.

## Next Focus

Move to Q2 with the Q1 source split now established. Inspect `generate-description.js` and the surrounding canonical-save path to determine exactly which hand-authored fields are preserved, which are recomputed, and where a richer description can still be silently replaced during auto-regeneration.
