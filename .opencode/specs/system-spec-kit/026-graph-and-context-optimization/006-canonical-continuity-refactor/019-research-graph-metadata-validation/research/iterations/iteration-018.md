# Iteration 18: Trigger-Phrase Cap Root Cause and Minimal Enforcement

## Focus
Verify whether the trigger overflow comes from an explicit higher cap somewhere else or from a missing enforcement call in graph-metadata generation.

## Findings
1. The graph parser builds `triggerPhrases` with `normalizeUnique(...)` and writes the full array into `derived.trigger_phrases` without any `.slice(0, 12)`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:529-545]
2. The graph-metadata schema only requires `trigger_phrases` to be a non-empty string array; it does not impose a max-length bound. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:29-39]
3. The live corpus now has 185 folders over the intended 12-trigger ceiling, with a maximum of 33 and 949 excess trigger phrases beyond the cap. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. This is a direct omission rather than a disputed contract. `key_topics` already slices to 12, so the minimal patch is simply to slice `triggerPhrases` the same way before storing them. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:474-480]

## Ruled Out
- Looking for a hidden schema-level or backfill-only cap.

## Dead Ends
- Treating trigger overflow as a documentation mismatch only.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:474-545`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:29-39`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/spec.md`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.46`
- Questions addressed: `FQ-5`
- Questions answered: `FQ-5`

## Reflection
- What worked and why: comparing `trigger_phrases` and `key_topics` inside the same function exposed the missing slice immediately.
- What did not work and why: broad repo searches for “12 trigger” produced too much documentation noise before I narrowed back to the parser.
- What I would do differently: always compare sibling derived fields before assuming the cap is hidden somewhere else.

## Recommended Next Focus
Map the patch answers back onto the four child phases so the reopened loop ends with implementation-ready ordering.
