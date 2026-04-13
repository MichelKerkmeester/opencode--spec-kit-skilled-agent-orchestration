# Iteration 36: Preserved Replay After Metadata-Only Fix

## Focus
Rerun the exact preserved-subset replay after the `metadata_only` target fix to confirm whether routing accuracy changed or whether the fix stayed below the classifier layer.

## Findings
1. The exact preserved replay is unchanged at `95.65%` on `92` samples when refusal-floor failures are counted as misses for `drop`: `37/40` full prototypes, `39/40` first-sentence variants, and `12/12` targeted test-style samples. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48] [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]
2. The failure set is also unchanged from the prior reconverged wave: `NP-02`, `NP-04`, `RF-03`, and refusal on `DR-05-s1`. No new confusion pair appeared in the benchmark rerun. [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]
3. That means the `metadata_only` fix did not change classifier outputs on the preserved benchmark. The benchmark still points to the same optional short-fragment refinement areas rather than a fresh regression. [INFERENCE: comparison against iterations 26 and 35]

## Ruled Out
- Treating the `metadata_only` target fix as a silent routing-accuracy change.

## Dead Ends
- Counting `DR-05-s1` as a clean pass because the category stays `drop` even though it still refuses below the floor.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48`
- `packet-local preserved-subset replay over dist/lib/routing/content-router.js`

## Assessment
- New information ratio: 0.06
- Questions addressed: RQ-17
- Questions answered: none

## Reflection
- What worked and why: Replaying the exact preserved subset gave a direct apples-to-apples answer for the user’s post-fix verification ask.
- What did not work and why: Looking only at raw category equality would have hidden the fact that `DR-05-s1` still fails as a refusal-floor miss.
- What I would do differently: Preserve the replay harness itself as a packet artifact so future spot checks do not need to reconstruct the scoring rule.

## Recommended Next Focus
Verify that the `metadata_only` change is confined to routed save-target identity and continuity anchoring rather than classifier behavior.
