# Iteration 30: Random Key-File Sample

## Focus
Manually inspect 50 `key_files` entries across 10 random folders after the sanitization patch and backfill run.

## Findings
1. The 50-entry sample resolved `47` entries and missed `3`, so the random sample landed at `94%` resolution. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. The sample no longer showed the old version-token, MIME-type, or free-form title noise that dominated Wave 1 misses. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. One sampled miss was a stale memory-era path: `memory/metadata.json` in `026/.../001-research-graph-context-systems/002-codesight`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/graph-metadata.json]
4. Two sampled misses were old cross-track `.opencode/specs/00--ai-systems-non-dev/...` doc paths inside `00--ai-systems/001-global-shared/002-brand-knowledge`. [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/002-brand-knowledge/graph-metadata.json]

## Ruled Out
- Assuming the improved global resolve rate meant the random sample would come back 50 of 50 clean.

## Dead Ends
- None. The sample was small enough that each miss could be interpreted immediately.

## Sources Consulted
- Random 50-entry `key_files` sample over `/tmp/phase019-research2/keyfile-sample.tsv`
- Live packet files referenced by sampled rows on 2026-04-13

## Assessment
- New information ratio: `0.18`
- Questions addressed: `PVQ-3`
- Questions answered: none

## Reflection
- What worked and why: sampling after the full-corpus scan verified that the aggregate resolve-rate improvement is visible in ordinary folders, not just in the headline totals.
- What did not work and why: the sample did not catch the remaining shell-command snippets because those are now a smaller residual class than the stale path leftovers.
- What I would do differently: bias one follow-up sample toward folders with the highest missing-key count so the rare residual families appear faster.

## Recommended Next Focus
Move from the random sample to the global residual-miss table and identify the exact remaining miss families that a follow-on hygiene phase should target.
