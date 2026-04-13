# Iteration 6: Confusion Pairs And Edge Cases

## Focus
Turn the baseline accuracy numbers into actionable failure modes by inspecting the top confusion pairs and representative misclassified samples.

## Findings
1. The worst confusion pair is `narrative_delivery -> narrative_progress` with four cases. In each example, implementation-change language such as "updated together" or "landed in three passes" outweighs sequencing cues, so Tier1 accepts progress before Tier2 can correct it. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:340] [INFERENCE: live corpus examples `ND-01` and `ND-04` from dist/lib/routing/content-router.js]
2. The second worst confusion is `handover_state -> drop`, also with four cases. The handover prototypes that mention `git diff`, verification commands, or command-style restart recipes are vulnerable because the `drop` cue table explicitly includes `git diff`, raw tool language, and recovery scaffolding. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369] [INFERENCE: live corpus examples `HS-01` and `HS-03` from dist/lib/routing/content-router.js]
3. Two `narrative_progress` prototype samples were misread as `research_finding` because they mention packet docs, sources, or one-source-of-truth work in language that overlaps the research cue set. Tier2 would have corrected both, but Tier1 accepted them early at `0.80`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:357] [INFERENCE: live corpus examples `NP-02` and `NP-04` from dist/lib/routing/content-router.js]
4. One `research_finding` sample was classified as `metadata_only` because it discussed overlap in metadata and continuity terms, showing that `_memory.continuity` vocabulary can overpower research intent when the chunk is framed as findings about metadata. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:365] [INFERENCE: live corpus example `RF-03` from dist/lib/routing/content-router.js]
5. Short handover fragments such as "Continuation attempt one" do not fail because of phase-anchor logic; they fail because the abbreviated text loses resume-state detail and becomes semantically close to sparse task or generic wrapper language. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1011] [INFERENCE: live corpus examples `HS-01-s1` and `HS-01-compact` from dist/lib/routing/content-router.js]

## Ruled Out
- Blaming delivery and handover failures on Tier2. In the key examples, Tier2 preferred the expected class but never got a chance because Tier1 accepted early or `drop` cues dominated.

## Dead Ends
- Treating phase-anchor inference as the main handover failure driver.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:340`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:357`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:369`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1011`

## Assessment
- New information ratio: 0.74
- Questions addressed: RQ-3, RQ-4
- Questions answered: RQ-3

## Reflection
- What worked and why: Concrete misclassification examples made it obvious which cues are over- or under-weighted.
- What did not work and why: Category-level averages were too coarse to explain why handover and delivery underperform.
- What I would do differently: Move into merge-mode behavior next, because some categories can classify correctly but still fail at write time.

## Recommended Next Focus
Map each routed category to the merge payload it constructs and determine which categories are inherently fragile at write time.
