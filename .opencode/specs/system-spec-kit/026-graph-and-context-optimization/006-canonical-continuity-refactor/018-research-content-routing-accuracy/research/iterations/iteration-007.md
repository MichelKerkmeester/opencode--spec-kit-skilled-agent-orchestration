# Iteration 7: Merge Modes By Category

## Focus
Trace how each routing category becomes a concrete write payload so classification quality can be compared with merge robustness.

## Findings
1. Category-to-merge mapping is fixed: `narrative_progress` and `narrative_delivery` use `append-as-paragraph`, `handover_state` and `research_finding` use `append-section`, `decision` uses `insert-new-adr` on `L3/L3+` and `update-in-place` on lower packet levels, `task_update` uses `update-in-place`, and `metadata_only` updates frontmatter continuity rather than anchor-merging. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:918] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:925]
2. The canonical writer derives merge payloads from routed content, not the original memory artifact type. That means the same text classification directly controls whether the writer looks for paragraphs, structured checklist IDs, or ADR fields. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:925] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1144]
3. `metadata_only` is the least fragile category at write time because it bypasses `anchorMergeOperation()` and writes `_memory.continuity` through thin-continuity helpers. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1107] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:167]
4. `task_update` is the most brittle category because `buildCanonicalMergePayload()` must discover a concrete `T###` or `CHK-###` ID, and the later merge requires exactly one matching checklist line. Classification accuracy alone is not enough to make task routing safe. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:952] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:440]

## Ruled Out
- Treating all categories as equally safe once the router selects a target doc.

## Dead Ends
- Assuming metadata-only and task updates share the same failure profile because both report `update-in-place`.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:918`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:925`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1107`
- `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:440`

## Assessment
- New information ratio: 0.70
- Questions addressed: RQ-5, RQ-6
- Questions answered: none yet

## Reflection
- What worked and why: Reading `buildCanonicalMergePayload()` alongside `buildTarget()` exposed which routing categories are logically easy versus operationally fragile.
- What did not work and why: Looking only at the router API hid the fact that one category name can fan out into very different payload requirements by packet level.
- What I would do differently: Validate the merge legality rules next so the write-time failure surface is explicit, not inferred.

## Recommended Next Focus
Inspect `anchorMergeOperation()` and the spec-doc legality validator to identify exactly where each merge mode can fail.
