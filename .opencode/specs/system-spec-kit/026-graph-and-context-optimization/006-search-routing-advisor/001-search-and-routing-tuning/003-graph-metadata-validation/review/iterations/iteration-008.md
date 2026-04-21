# Iteration 8: Maintainability audit of derived key_files hygiene

## Focus
Maintainability review of derived `key_files` canonicalization and duplicate path hygiene.

## Files Reviewed
- `spec.md`
- `graph-metadata.json`

## Findings
### P1 - Required
- **F006**: Derived key_files still store the same parser file under mixed path formats - `graph-metadata.json:41` - The packet flags non-canonical duplicate references as a known issue, yet the root packet still lists both `mcp_server/lib/graph/graph-metadata-parser.ts` and `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`, which point at the same file but produce two distinct downstream references. [SOURCE: spec.md:37-40; graph-metadata.json:41-45]

## Ruled Out
- The duplicate is not a simple basename-only collision; it is a stronger mixed-format canonicalization drift because both strings still resolve to the same parser file.

## Dead Ends
- The current root packet only exposes one obvious mixed-format duplicate, so the maintainability defect is narrower than a full-corpus regression.

## Recommended Next Focus
Rotate into a correctness stabilization pass on the semantic quality of the packet's derived entities.

## Assessment
- Dimensions addressed: maintainability
