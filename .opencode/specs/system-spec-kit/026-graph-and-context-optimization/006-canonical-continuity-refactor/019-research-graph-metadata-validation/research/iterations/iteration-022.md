# Iteration 22: `deriveEntities()` Insertion Path and Canonical Collision Preference

## Focus
Pin the exact basename de-duplication write sites and verify which side should win when a canonical packet doc collides with a non-canonical path.

## Findings
1. The first collision point is still the key-files seeding loop: `deriveEntities()` writes `entities.set(filePath, { name: path.basename(filePath), ... })` before any normalized-name checks exist. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-428]
2. The second collision point is the extracted-entity loop: `entities.set(normalizedName, ...)` already dedupes by normalized text there, but only after key-file-derived rows have been created. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:430-442]
3. A representative live collision proves that “keep first basename” is not enough by itself: `system-spec-kit/023-hybrid-rag-fusion-refinement/graph-metadata.json` currently stores `{ "name": "spec.md", "path": "specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md" }` even though plain `spec.md` is also present in `derived.key_files`. [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/graph-metadata.json]
4. The exact safe insertion shape is a shared local helper in `deriveEntities()`:
   - build `canonicalDocPaths = new Set(docs.map((doc) => doc.relativePath))`
   - normalize a name key once (`name.trim().toLowerCase()`)
   - call `upsertEntityByName(candidate)` before both current `entities.set(...)` sites
   - if a collision occurs, replace the existing row only when the incoming `path` is canonical and the existing `path` is not
5. This keeps the patch local to `deriveEntities()` while avoiding a schema rewrite or cross-function ordering change inside `deriveKeyFiles()`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446]

## Ruled Out
- A naive “first basename wins” rule with no replacement path. It can preserve `specs/.../spec.md` and suppress plain `spec.md`.

## Dead Ends
- Trying to solve canonical preference in the schema. The conflict happens before serialization, at the in-memory `Map` write sites.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446`
- `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/graph-metadata.json`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.20`
- Questions addressed: `CQ-2`
- Questions answered: `CQ-2`

## Reflection
- What worked and why: checking a real stored collision exposed the canonical-preference wrinkle that the earlier “insert the guard before both `set(...)` calls” answer did not fully settle.
- What did not work and why: assuming `deriveKeyFiles()` append order automatically makes canonical docs win.
- What I would do differently: inspect a concrete stored duplicate as soon as a de-duplication packet mentions canonical-path preference.

## Recommended Next Focus
Convert the checklist-aware status conclusion into exact pseudo-code so phase `001-fix-status-derivation` has a line-for-line safe fallback instead of a prose summary.
