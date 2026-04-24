# Iteration 03 — Test Coverage Adequacy

**Dimension:** Test coverage adequacy for `resource_map` DocumentType
**Scope:** `mcp_server/tests/*.vitest.ts` only (no runtime code, no markdown)
**Executor:** Direct Read/Grep (copilot not dispatched — scope fully verifiable inline)

## Findings

### 1. `full-spec-doc-indexing.vitest.ts` — coverage complete and consistent
- T062 path-infer list (line 86): adds `resource-map.md -> resource_map`. Matches `SPEC_DOCUMENT_CONFIGS` regex.
- T063 length assertion (line 109): `SPEC_DOCUMENT_CONFIGS.length === 11`. Verified against source (`memory-types.ts` L394-406): 11 entries (8 canonical md + `resource_map` + `description_metadata` + `graph_metadata`). **Count is correct.**
- T063 types.toContain (lines 124-134): includes `resource_map`, `description_metadata`, `graph_metadata`. Consistent.
- `SPEC_DOCUMENT_FILENAMES.size === 10` (line 188): verified against `spec-doc-paths.ts` L7-18 — set has exactly 10 filenames (excludes `graph-metadata.json` which is tracked separately as `GRAPH_METADATA_FILENAME`). **Count is correct; intentional divergence from CONFIGS count.**
- `expectedFilenames` list (line 193): includes `resource-map.md`. Consistent.
- T069 `extractDocumentType` cases (line 221): includes `resource-map.md`. Consistent.

### 2. `graph-metadata-schema.vitest.ts` — allowlist update correct
- Line 137: `|| normalized === 'resource-map.md'` added to the canonical-doc path-resolution allowlist in `ensureFile`. Placed between `handover.md` and `research/` prefix — correct ordering, no regex issue.

### 3. `memory-types.vitest.ts` L114-122 — NOT a miss
- This is a `MemoryTypeName` inference test (`semantic`/`working`/etc.), not a `DocumentType` test. It asserts `plan.md`, `decision-record.md`, `implementation-summary.md` all map to `semantic`. The list is **representative, not exhaustive** — `handover.md` is also missing, which is pre-existing and not packet 012's responsibility to fix. Adding `resource-map.md -> semantic` would match spec intent but is OPTIONAL (not a blocker; P2 nice-to-have).

### 4. `thin-continuity-record.vitest.ts` — uses `resource-map/` only as a path fixture
- Lines 41, 67: the string `scratch/resource-map/04-templates.md` is used as a continuity `key_files` fixture (path normalization test), **not** as a canonical doc assertion. No change needed; no miss.

### 5. Other vitest files — no enumerative lists found
- `resume-ladder.vitest.ts`, `memory-parser-extended.vitest.ts`, `handler-memory-index.vitest.ts`, `memory-save-integration.vitest.ts`: none enumerate the canonical filename set; all use `spec.md`/`plan.md`/`handover.md` individually. No hardcoded list that would break on count change.

### 6. Negative test cases — MISSING (P2)
- No assertion that `resource-map-backup.md`, `my-resource-map.md`, or `resource-map.txt` fall through to generic handler. The regex `/(?:^|\/)resource-map\.md$/i` is strict, so runtime behavior is safe, but an explicit negative test would harden regression detection. Pre-existing gap — no sibling canonical doc has such negative coverage either.

### 7. `BASENAME_BY_DOCUMENT_TYPE` — not directly testable
- Private (non-exported) map inside `memory-types.ts`. Covered indirectly via `inferDocumentTypeFromPath` round-trips. No action needed.

### 8. Expected `npx vitest run` result
- **PASS** expected. No hardcoded counts or filename lists in non-edited test files reference `SPEC_DOCUMENT_CONFIGS.length` or `SPEC_DOCUMENT_FILENAMES.size`. The two edited files are internally consistent with the source.

## Severity Summary

| ID     | Severity | Finding                                                                 |
|--------|----------|-------------------------------------------------------------------------|
| TC-001 | P2       | Add negative case `resource-map-backup.md` -> `memory` fall-through     |
| TC-002 | P2       | Optionally add `resource-map.md -> semantic` in memory-types.vitest.ts |
| TC-003 | INFO     | `SPEC_DOCUMENT_CONFIGS.length === 11` vs `FILENAMES.size === 10` divergence is intentional (graph_metadata has its own filename constant) — documentation could clarify but no bug |

**No P0/P1 findings.** Coverage is adequate for packet 012 scope.
