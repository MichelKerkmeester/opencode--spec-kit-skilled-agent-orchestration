# Iteration 24: Trigger-Cap Enforcement Ownership

## Focus
Determine whether the 12-item `trigger_phrases` ceiling is enforced anywhere today and pin the exact layer that should own it.

## Findings
1. The parser still builds `triggerPhrases` with `normalizeUnique(...)` and writes the unsliced array directly into `derived.trigger_phrases`. `key_topics` is sliced to 12, but `trigger_phrases` is not. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:523-545]
2. The schema applies no max-length guard: `trigger_phrases` is only `z.array(z.string().min(1))`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:32-44]
3. The backfill layer also does not enforce the cap. It either calls `deriveGraphMetadata(specFolderPath, existing)` in dry-run mode or `refreshGraphMetadataForSpecFolder(specFolderPath)` in write mode, so it inherits whatever the parser generated. [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:139-177]
4. The live overflow remains exactly where the earlier wave left it: `185` folders exceed the intended 12-item ceiling, with `949` excess trigger phrases and a maximum stored count of `33`. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
5. The enforcement owner should be `deriveGraphMetadata()` itself:

```ts
const triggerPhrases = normalizeUnique(docs.flatMap((doc) => doc.triggerPhrases)).slice(0, 12);
```

An optional schema `.max(12)` can be added later as a validation backstop, but it should follow parser/backfill remediation rather than lead it.

## Ruled Out
- Treating backfill as the primary enforcement layer. It only regenerates; it does not transform arrays independently of the parser.

## Dead Ends
- Looking for a hidden cap in the schema or backfill review flags. There is none.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:523-545`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:32-44`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:139-177`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.14`
- Questions addressed: `CQ-4`
- Questions answered: `CQ-4`

## Reflection
- What worked and why: tracing schema and backfill after the parser confirmed that the omission is singular, not distributed.
- What did not work and why: assuming backfill might be silently normalizing fields after derivation.
- What I would do differently: search the whole derivation pipeline earlier whenever a cap exists for one sibling field (`key_topics`) but not another (`trigger_phrases`).

## Recommended Next Focus
Collapse the full 21-24 convergence work into one implementation-ready patch map for phases `001`-`004`, with the trigger-cap fix called out as an adjacent parser cleanup outside the current child folders.
