1. `CODEX4-001`  
Severity: High. Category: Concurrency / TOCTOU. File: [cleanup-orphaned-vectors.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts#L84)  
Description: orphan discovery is done before the transaction, then deletion reuses that stale snapshot. A concurrent indexer can recreate `memory_index` rows between discovery and delete, and this script will still remove now-valid history/vector rows.  
Evidence: `orphanedHistory` and `orphanedVectors` are selected at lines 84-111, but deletion happens later inside `database.transaction()` at lines 130-149 without re-checking orphan status.  
Fix: move the orphan predicate into the `DELETE` statements inside a single `BEGIN IMMEDIATE` transaction, e.g. `DELETE ... WHERE NOT EXISTS (...)`, or re-query inside the transaction before deleting.

2. `CODEX4-002`  
Severity: Medium. Category: Data Loss / TOCTOU. File: [historical-memory-remediation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/historical-memory-remediation.ts#L706)  
Description: quarantine moves can overwrite prior quarantined evidence. On reruns, or when two files map to the same quarantine basename, the older artifact is deleted first.  
Evidence: `quarantinePath` is built from `path.basename(filePath)` at lines 802-804, then `moveToQuarantine()` does `existsSync` + `rmSync(quarantinePath)` + `renameSync(filePath, quarantinePath)` at lines 706-711.  
Fix: preserve existing quarantine files by generating unique names or refusing to overwrite unless an explicit `--replace` flag is set.

3. `CODEX4-003`  
Severity: Medium. Category: JSON Validation. File: [rank-memories.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/rank-memories.ts#L386)  
Description: the CLI accepts any parsed JSON object without `results` as a valid empty dataset, which masks upstream contract drift and returns a false-success empty ranking.  
Evidence: `memories = Array.isArray(parsed) ? parsed : ((parsed as { results?: RawMemory[] }).results || []);` at lines 386-387. `{ "error": "bad response" }` becomes `[]` and exits 0.  
Fix: require either an array or an object with `results` as an array; otherwise throw a schema error.

4. `CODEX4-004`  
Severity: Medium. Category: Silent Error Swallowing / Validation Gap. File: [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L617)  
Description: V12 silently disables topical-coherence checking when `spec.md` is unreadable or the `spec_folder` target is broken, so off-target memories can still pass and be indexed.  
Evidence: lines 617-623 swallow all read failures with `catch {}` and then continue as if no spec metadata existed; the rule only fires if the file is successfully read.  
Fix: distinguish `ENOENT` from other read failures, and treat unresolved or unreadable `spec_folder` as at least an index-blocking validation result.

5. `CODEX4-005`  
Severity: Medium. Category: Silent Failure / Result Validation. File: [reindex-embeddings.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts#L76)  
Description: reindex can exit successfully without proving it parsed any scan result. If the MCP call returns empty `content`, the script returns 0 with no `STATUS=OK` and no error.  
Evidence: only the `if (result.content && result.content[0])` branch at lines 81-117 parses and reports results; there is no `else` that throws.  
Fix: assert `result.content?.[0]?.text` exists and validates against `ScanData`; otherwise throw.

6. `CODEX4-006`  
Severity: Medium. Category: Silent Coverage Loss. File: [backfill-frontmatter.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts#L240)  
Description: discovery silently skips unreadable directories, so the migration report can claim success over only a partial tree.  
Evidence: `discoverSpecsRoots()`, `collectTemplateFiles()`, and `collectSpecFiles()` all catch `readdirSync` errors and just `continue` at lines 240-248, 304-312, and 344-352; those skips are never recorded in `failedFiles`.  
Fix: record skipped directories in the report and fail non-zero unless the user explicitly opts into partial discovery.

7. `CODEX4-007`  
Severity: Low. Category: JSON Mode UX / Hanging Input Path. File: [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L322)  
Description: `--stdin` can hang indefinitely when invoked without piped input, which is a bad failure mode for the preferred JSON path.  
Evidence: `parseStructuredModeArguments()` awaits `stdinReader()` for `--stdin` at lines 359-367, while `readAllStdin()` at lines 322-331 never short-circuits on TTY.  
Fix: reject `--stdin` when `stdin.isTTY` and emit a clear usage error, matching the safer behavior already used in `rank-memories.ts`.

I did not find a direct recovery-mode bypass in `generate-context.ts`: `--recovery` is rejected for structured JSON input, and downstream folder detection keeps explicit CLI targets authoritative. No material issues stood out in [ast-parser.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts) or [rebuild-auto-entities.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/rebuild-auto-entities.ts) during this pass.