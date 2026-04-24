# Iteration 02: MCP runtime code correctness

## Dimension & scope
Reviewed only MCP runtime TypeScript surfaces for `resource-map.md` registration and inference: `lib/config/spec-doc-paths.ts`, `lib/config/memory-types.ts`, `lib/parsing/memory-parser.ts`, `lib/graph/graph-metadata-parser.ts`, `lib/resume/resume-ladder.ts`, `lib/validation/spec-doc-structure.ts`, `handlers/memory-save.ts`, `tool-schemas.ts`, plus the six explicitly requested follow-up files for missed hardcoded filename lists. I also checked whether an `mcp_server/dist/` JS mirror exists.

## Findings
### P0 — Blocker
- None.

### P1 — Required
- None.

### P2 — Suggestion
- `tests/memory-types.vitest.ts:104-120` enumerates canonical spec-document path inference cases for `spec.md`, `plan.md`, `decision-record.md`, `implementation-summary.md`, and `research.md`, but it does not add a direct `resource-map.md` case. Runtime behavior is wired correctly, so this is not a production defect, but a focused regression test would harden the new `resource_map` path.

## Strengths
- `lib/config/spec-doc-paths.ts:7-18`, `lib/config/memory-types.ts:367-425`, and `lib/parsing/memory-parser.ts:394-405` register `resource-map.md` / `resource_map` consistently across filename gating, document typing, config lookup, and basename mapping.
- `lib/graph/graph-metadata-parser.ts:36-52`, `lib/resume/resume-ladder.ts:76-86`, and `lib/validation/spec-doc-structure.ts:185-190` propagate the filename into packet-doc collection, resume ordering, and optional-doc discovery without casing or placement mismatches.
- `lib/config/memory-types.ts:403` uses `/(?:^|\/)resource-map\.md$/i`, and `inferDocumentTypeFromPath()` at `lib/config/memory-types.ts:413-437` combines that regex with `matchesSpecDocumentPath()` in `lib/config/spec-doc-paths.ts:104-133`, so valid spec-folder paths resolve to `resource_map` while `some-resource-map.md` and `resource-map.md.backup` do not match.
- No `dist/` JS mirror exists under `.opencode/skill/system-spec-kit/mcp_server/`, so there is no generated runtime copy to rebuild or drift-check.

## Recommendation
PASS — runtime registration is consistent; add a direct `resource-map.md` inference test for defense-in-depth.
