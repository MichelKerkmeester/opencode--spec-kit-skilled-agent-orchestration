## Findings

### P0
None.

### [P1] Fallback regex misses supported single-level spec paths
- **File**: `scripts/lib/validate-memory-quality.ts`
- **Line**: `634`
- **Evidence**: The new fallback regex, `/[/\\]specs[/\\](.+?[/\\](?:\d{3}-[^/\\]+))/`, correctly extracts nested spec folders like `.opencode/specs/system-spec-kit/024-compact-code-graph/memory/foo.md` and also matches backslash-separated Windows paths. However, it does **not** match supported single-level paths such as `/specs/007-auth/memory/ctx-001.md`, because the pattern requires one more path separator before the `NNN-slug` leaf. The repository still treats `/specs/007-auth/...` as a valid spec path shape in other indexing code and tests (`mcp_server/tests/unit-normalization.vitest.ts:12-13`, `mcp_server/tests/artifact-routing.vitest.ts:18-53`). When this fallback misses, `specFolder` stays empty and V8 still evaluates against an empty allowlist (`scripts/lib/validate-memory-quality.ts:702-775`).
- **Impact**: The fix only resolves the false-positive path for nested `[project]/[NNN-feature]` layouts. Valid single-level spec paths can still be misclassified during validation/reindex, leading to `spec relevance mismatch` failures on otherwise valid files.
- **Recommendation**: Broaden the fallback extraction to accept both `/specs/NNN-name/...` and `/specs/project/NNN-name/...`, then add regression tests for both POSIX and Windows paths.

### [P1] `decision` contexts are rewritten to `planning` for all migrated files
- **File**: `scripts/lib/frontmatter-migration.ts`
- **Line**: `831-840`
- **Evidence**: `normalizeContextType()` now maps `decision -> planning` unconditionally (`scripts/lib/frontmatter-migration.ts:831-840`), and existing frontmatter values are normalized before `inferContextType()` runs (`scripts/lib/frontmatter-migration.ts:1095-1097`). Because `inferContextType()` preserves any existing non-`decision` value unchanged (`scripts/lib/frontmatter-migration.ts:1031-1046`), an explicit existing `decision` context on a memory file is silently rewritten to `planning`. That is not just a legacy-doc cleanup: downstream code still treats `decision` as a legitimate persisted value in schema and behavior (`mcp_server/lib/search/vector-index-schema.ts:2254`, `mcp_server/lib/validation/save-quality-gate.ts:340-352`, `scripts/core/memory-metadata.ts:72-78`).
- **Impact**: Migrating existing decision memories changes their semantic classification and downstream behavior. That can affect type inference, decay semantics, and quality-gate exceptions for data that intentionally used `decision`.
- **Recommendation**: Limit the `decision -> planning` override to the affected spec-doc defaults only, and preserve explicit `decision` values on memory files until the wider pipeline no longer depends on that context type.

### [P2] V12 spec-doc skip logic omits a standard spec artifact
- **File**: `scripts/lib/validate-memory-quality.ts`
- **Line**: `824-826`
- **Evidence**: The V12 skip regex only recognizes `spec`, `plan`, `checklist`, `tasks`, `decision-record`, `implementation-summary`, `research`, and `handover`. Repository documentation and extractors also treat `debug-delegation.md` as a standard spec-folder artifact (`SKILL.md:65-71`, `SKILL.md:809`, `scripts/extractors/session-extractor.ts:466-472`), but that filename is not included in the skip logic.
- **Impact**: If `debug-delegation.md` is validated through this path, it can receive a false topical-mismatch result instead of being treated like other spec-authored documents.
- **Recommendation**: Add `debug-delegation` to the skip regex, or centralize the canonical spec-artifact list so validator logic stays aligned with documented spec files.
