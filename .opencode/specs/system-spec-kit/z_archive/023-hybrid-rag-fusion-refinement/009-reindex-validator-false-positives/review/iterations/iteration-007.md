# Iteration 007 — Reliability: Edge Cases

## P0
None.

## P1

### 1. Missing `spec_folder` + missing/empty `filePath` can hard-block valid files as foreign-spec contamination
- **File:** `scripts/lib/validate-memory-quality.ts`
- **Lines:** `624-638`, `477-479`, `702-775`, `101-108`
- **Evidence:** The validator initializes `specFolder` from frontmatter and only falls back to `options?.filePath` when that value is truthy (`if (!specFolder && options?.filePath)`). When `filePath` is `undefined`, `null`, or `''`, `specFolder` stays empty. V8 then computes `currentSpecId` from the empty string (`null`), builds an empty allowlist, and treats any spec IDs found in body/frontmatter as foreign contamination. V8 is configured as a high-severity hard blocker (`blockOnWrite: true`, `blockOnIndex: true`).
- **Impact:** Reindex or validation callers that omit `filePath` for spec docs / legacy files without `spec_folder` can reject otherwise valid content with `spec relevance mismatch`, even though the problem is missing routing context rather than actual contamination.
- **Recommendation:** If `specFolder` is still unknown after both extraction paths, downgrade V8/V12 to a diagnostic "unknown current spec" outcome instead of evaluating foreign-spec contamination against an empty allowlist.

## P2

### 1. `memory_save` API does not accept caller-supplied `contextType`, so legacy external inputs are ignored rather than normalized through the save pipeline
- **File:** `mcp_server/tool-schemas.ts`, `mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/lib/parsing/memory-parser.ts`, `mcp_server/handlers/memory-save.ts`
- **Lines:** `tool-schemas.ts:215-220`, `tool-input-schemas.ts:458`, `memory-parser.ts:108-124`, `604-620`, `memory-save.ts:209-217`
- **Evidence:** `memory_save` only accepts `filePath`-based ingestion; `contextType` is not part of the allowed `memory_save` parameters. The parser does normalize legacy frontmatter/content values (`decision -> planning`) when reading the file content, and `memory-save` persists `parsed.contextType`, but an external tool sending `contextType: "decision"` in the API payload has that field rejected/ignored before it reaches the parser.
- **Impact:** The end-to-end normalization path works for file content, but not for hypothetical direct API metadata injection. Integrators may assume `contextType` request fields are honored when they are not.
- **Recommendation:** Document that `memory_save` derives `contextType` from file content only, or explicitly add/reject a `contextType` argument with a clear validation error so callers do not assume it participates in normalization.

## Checked Items / Non-findings

### Empty `filePath`
- No crash path found. `undefined`/`null`/`''` simply skip the fallback extraction and the memory/spec-doc path heuristics.
- Reliability issue is the downstream false-positive route described in P1, not an exception or regex failure.

### Null `spec_folder`
- `extractYamlValueFromContent()` returns `null` cleanly, and the regex fallback is conditional on a truthy `filePath`.
- If both fail, `specFolder` becomes `''`; the main consequence is the P1 V8 false positive, not a runtime error.

### Concurrent reindex
- **No finding.** `acquireIndexScanLease()` wraps the read/check/write sequence in a single SQLite transaction and writes `scan_started_at` before returning success; `completeIndexScanLease()` also updates `last_index_scan` and clears the lease in one transaction (`mcp_server/core/db-state.ts:364-493`). This closes the obvious TOCTOU window.

### WAL mode + schema change
- **No finding.** The active startup migration path wraps migrations in a single transaction before updating `schema_version` (`mcp_server/lib/search/vector-index-schema.ts:1152-1203`). The rename/copy downgrade path is also transaction-wrapped (`mcp_server/lib/storage/schema-downgrade.ts:268-304`). Under SQLite WAL semantics, readers should continue seeing the pre-transaction snapshot until commit rather than a half-migrated table layout.

### File path with spaces
- **No finding.** The validator regex only keys off path separators and `specs/.../<NNN-name>` segments (`scripts/lib/validate-memory-quality.ts:633-637`); spaces elsewhere in the absolute path (for example `Opencode Env`) do not affect the match.
