# Iteration 26: Preserved-Subset Benchmark Replay

## Focus
Rerun the preserved portion of the iteration 5-6 synthetic corpus against the updated router, with Tier 3 deliberately out of scope so the measurement isolates the cue and prototype changes.

## Findings
1. On the exact preserved subset of the earlier corpus shape, the updated router now scores `95.65%` accuracy on `92` samples: `40` full prototypes, `40` first-sentence variants, and `12` targeted test-style samples. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48] [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]
2. The old dominant confusion seams are no longer the leaders. In the preserved replay, `narrative_delivery -> narrative_progress` and `handover_state -> drop` disappear from the top confusion list entirely. [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]
3. The remaining preserved-subset errors are narrower: `narrative_progress -> research_finding` (`NP-02`, `NP-04`), `research_finding -> metadata_only` (`RF-03`), and one short `drop` fragment that falls below the refusal floor (`DR-05-s1`). [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]
4. The variant breakdown is strong across the preserved shapes: full prototypes score `92.50%`, first-sentence variants score `97.50%`, and the `12` targeted test-style samples all pass. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48] [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]
5. The delivered fixes therefore solved the packet's original live-text hotspots. The residual errors now cluster around research/metadata overlap and very short telemetry fragments, not delivery or handover mechanics. [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]

## Ruled Out
- Treating the absence of the original compact-variant generator as a reason to skip post-implementation benchmarking.

## Dead Ends
- Looking for the old delivery and handover confusion pairs in the preserved replay after the implemented cue and prototype changes.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:503`

## Assessment
- New information ratio: 0.44
- Questions addressed: RQ-12
- Questions answered: none

## Reflection
- What worked and why: Replaying the preserved subset kept the post-implementation comparison honest without mixing in the Tier 3 save-path change.
- What did not work and why: The earlier compact-variant generator was not preserved as an artifact, so only the full, first-sentence, and test-style slices are strictly reproducible.
- What I would do differently: Separate the exact preserved replay from any best-effort compact reconstruction instead of pretending the full 132-sample rerun is exact.

## Recommended Next Focus
Measure the compact-fragment story separately and decide whether the remaining accuracy risk is true router drift or simply missing preservation of the earlier compact-variant generator.
