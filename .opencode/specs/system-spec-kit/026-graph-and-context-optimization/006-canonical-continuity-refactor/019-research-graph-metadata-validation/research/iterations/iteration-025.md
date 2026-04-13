# Iteration 25: Final Sub-Phase Patch Map

## Focus
Produce the implementation-ready, line-by-line change description for each child phase and identify the one adjacent parser cleanup that still lacks a child folder.

## Findings
1. Phase `001-fix-status-derivation` should stay inside `graph-metadata-parser.ts`:
   - keep the override path at lines `498-500`
   - preserve the ranked frontmatter read at lines `503-509`
   - add a checklist-evaluation helper next to `deriveStatus()`
   - only use `implementation-summary.md` as a completion signal when `checklist.md` is absent or complete [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:204-235]
2. Phase `002-sanitize-key-files` should also stay parser-local:
   - add the exact `KEY_FILE_NOISE_RE`, `BARE_FILE_RE`, and canonical-doc allowlist near `extractReferencedFilePaths()`
   - filter `referenced` and `fallbackRefs`
   - append `docs.map((doc) => doc.relativePath)` after filtering, then `normalizeUnique(...).slice(0, 20)` as today [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:318-334] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471]
3. Phase `003-deduplicate-entities` needs a slightly richer patch than the earlier wave implied:
   - replace raw `entities.set(filePath, ...)` with a local `upsertEntityByName(...)` helper
   - call that helper before both current write sites
   - prefer canonical packet-doc paths (`spec.md`, `plan.md`, etc.) over non-canonical collision paths such as `specs/.../spec.md` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446] [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/graph-metadata.json]
4. Phase `004-normalize-legacy-files` is still stale on the active branch because the live corpus contains `0` legacy text files. The safest concrete action is to rewrite the phase as a guarded no-op helper in `backfill-graph-metadata.ts`:
   - inspect the raw file before line `158`
   - only rewrite when raw content fails JSON parsing but still loads via legacy compatibility
   - otherwise emit a no-op summary and leave the tree untouched [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:139-177] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
5. The trigger-cap fix is implementation-ready but is not currently owned by a child phase:
   - patch `deriveGraphMetadata()` at lines `532-540` to slice `triggerPhrases` to 12
   - leave schema hardening (`.max(12)`) as an optional second step after regenerated metadata proves clean [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:523-545] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:32-44]

## Ruled Out
- Opening another discovery-only wave before implementation. The remaining work is patch ownership and packet reshaping, not unanswered research questions.

## Dead Ends
- Treating phase `004` as still mandatory implementation work on the active branch.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:318-545`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:139-177`
- `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:204-235`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.10`
- Questions addressed: `CQ-5`
- Questions answered: `CQ-5`

## Reflection
- What worked and why: by this point the remaining value was in connecting live counts to edit surfaces, not in collecting more corpus examples.
- What did not work and why: the earlier “phase 003 = keep first basename” summary was a little too loose once a real canonical collision was inspected.
- What I would do differently: add an explicit “line-by-line patch map” deliverable to the first remediation-synthesis wave instead of waiting for a separate convergence pass.

## Recommended Next Focus
Hand execution to phases `001`-`003`, retire or rewrite phase `004`, and decide whether the trigger-cap fix should become its own small child phase or ride along with the parser touches already planned.
