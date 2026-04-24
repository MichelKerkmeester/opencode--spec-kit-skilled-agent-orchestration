# Iteration 001 - Correctness

## Scope

Audited production code only:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`

## Verification

- Scoped vitest: PASS, 22 tests.
- Git log: checked for both audited files.

## Findings

### DRI-001 - P1 Correctness - Legacy fallback bypasses key-file cleanup and resolution

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:293` assigns `key_files` from `parseDelimitedValues(...)` during legacy parsing.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:333` exposes `validateGraphMetadataContent(...)`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:350` invokes `parseLegacyGraphMetadataContent(content)` when JSON/schema validation fails.
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:225` covers legacy fallback with only benign `spec.md, plan.md` key files.

Expected: legacy graph metadata should not be able to preserve obsolete `memory/metadata.json` or nonexistent file-shaped key files after this feature's cleanup work.

Actual: legacy fallback imports raw `Key Files:` values without calling `keepKeyFile` or `resolveKeyFileCandidate`.

## Delta

New findings: 1. Registry total: P0=0, P1=1, P2=0.
