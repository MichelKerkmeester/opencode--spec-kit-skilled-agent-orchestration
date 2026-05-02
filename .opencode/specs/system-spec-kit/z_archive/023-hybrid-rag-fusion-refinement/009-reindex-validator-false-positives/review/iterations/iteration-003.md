# Iteration 003 - Security Review

Scope: security review of the 14 source-file bug-fix set, with emphasis on `filePath` handling, `context_type` SQL usage, migration integrity, and regex safety.

## P0

None.

## P1

### P1-1 - `context_type` constraint hardening is missing on upgraded databases

- File: `mcp_server/lib/search/vector-index-schema.ts`
- Line: `1656-1659`, `2226-2255`
- Evidence:
  - The upgrade path adds the column with `ALTER TABLE memory_index ADD COLUMN context_type TEXT DEFAULT 'general'` and does not attach a `CHECK` constraint. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1656-1659`]
  - Fresh schema creation does enforce `CHECK(context_type IN ('research', 'implementation', 'planning', 'general', 'decision', 'discovery'))`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2226-2255`]
  - The rebuild/downgrade path also recreates `memory_index` with the same `CHECK`, which confirms the mismatch between fresh/rebuilt schemas and in-place upgraded schemas. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:112-162`]
- Impact:
  - Fresh installs and rebuilt tables reject out-of-policy `context_type` values, but long-lived upgraded databases do not. That means the invariant is only partially enforced.
  - Current save-time parsing does normalize many user-controlled values to known types, but the database no longer provides defense-in-depth on upgraded deployments. Any alternate write path, future regression, maintenance script, or direct SQL write can persist arbitrary `context_type` values and change behavior in code paths that key policy off that field.
- Recommendation:
  - Add a migration that rebuilds `memory_index` (or otherwise re-materializes the table) inside a transaction so upgraded databases receive the same `CHECK` constraint as fresh schemas.
  - Normalize existing rows before the rebuild and add a regression test that compares migrated-schema DDL against fresh-schema DDL for `context_type`.

## P2

None.

## Assessment Summary

### 1. Path injection via `filePath`

- No finding in the reviewed user-facing path.
- `memory_save` validates and canonicalizes the incoming `filePath` before parsing or validation (`validateFilePathLocal(file_path)`), which blocks traversal outside the allowed base paths. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1118-1129`; `.opencode/skill/system-spec-kit/shared/utils/path-security.ts:17-97`]
- `v-rule-bridge` itself is only a passthrough, but in the reviewed flow it receives the already-validated `parsed.filePath`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:209-210`; `.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:88-103`]
- The fallback regex only extracts a spec-folder-shaped substring from the canonical path and does not itself grant filesystem escape. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:633-637`; `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:482-515`]

### 2. SQL injection via `context_type`

- No finding.
- Reviewed `context_type` reads/writes are parameterized, e.g. `m.context_type = ?` in search queries and `context_type = ?` in update paths. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:247-249`; `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:503-514`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:215-229`]
- I did not find any reviewed query that interpolates attacker-controlled `context_type` values directly into SQL text.

### 3. Database constraint bypass

- One P1 finding: upgraded databases miss the `CHECK` constraint described above.
- I did not find evidence in the reviewed files of a direct `UPDATE ... context_type = 'planning'` migration that needed separate transaction coverage.
- The schema-rebuild downgrade path does run inside a transaction. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:268-303`]

### 4. Regex DoS

- No finding.
- The reviewed extraction regex is `/[/\\]specs[/\\](.+?[/\\](?:\d{3}-[^/\\]+))/`. It performs a single lazy scan to the next `NNN-slug` segment and does not contain nested ambiguous quantified groups that would suggest catastrophic backtracking. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:633-637`]
