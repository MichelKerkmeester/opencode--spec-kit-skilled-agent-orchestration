# Iteration 026: Content hash deduplication

## Findings

### [P1] Preflight exact-duplicate checks can reject valid same-path saves before the runtime dedup logic gets a chance to classify them correctly
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts`

**Issue** `handleMemorySave()` runs preflight before the real save pipeline, but preflight's exact-duplicate check does not use the same-path exclusion, embedding-status filter, or governance-scope filter that the runtime dedup path uses. As a result, a legitimate same-path re-save can be rejected as an exact duplicate during preflight instead of reaching the runtime logic that would return `unchanged` or allow a metadata-only append-first update.

**Evidence** `memory-save.ts:845-861` calls `runPreflight()` with only `content`, `spec_folder`, `database`, and `find_similar`, and `memory-save.ts:920-940` throws immediately when preflight fails. The exact-duplicate query in `preflight.ts:399-404` is only `WHERE content_hash = ? AND spec_folder = ? LIMIT 1`, so it has no same-path exclusion, no `parent_id IS NULL`, no `embedding_status` guard, and no tenant/user/agent/session/shared-space filtering. The runtime helpers do have those protections: `dedup.ts:93-148` handles same-path `unchanged`, while `dedup.ts:165-249` applies scope-aware cross-path dedup with healthy-status filtering and same-path exclusion. The current tests also reflect that split: `tests/content-hash-dedup.vitest.ts:323-544` exercises the runtime same-path and scope-aware cases, but `tests/preflight.vitest.ts:420-445` only verifies a generic hash match.

**Fix** Stop using the standalone preflight exact-duplicate query as an authoritative blocker for `memory_save`. Either pass file path plus governance scope into preflight and make it reuse the same `checkExistingRow()` / `checkContentHashDedup()` semantics, or downgrade preflight exact matches to advisory status and let the runtime save pipeline make the final same-path vs cross-path decision.

### [P1] Large-file chunked indexing bypasses content-hash dedup after the same-path check
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts`

**Issue** Once the save path decides a file needs chunking, it jumps into `indexChunkedMemoryFile()` before running the runtime `checkContentHashDedup()` precheck. The chunking orchestrator only looks for an existing parent by file path, so cross-path identical large memories can be indexed twice even though small-memory saves would be deduped by content hash.

**Evidence** `memory-save.ts:391-407` branches to `indexChunkedMemoryFile()` immediately after `checkExistingRow()`, while the first runtime content-hash precheck is later at `memory-save.ts:478-484`. Inside the chunking path, `chunking-orchestrator.ts:155-173` only queries for an existing parent on `(canonical_file_path = ? OR file_path = ?)`, and the rest of the function never performs a `content_hash` lookup even though it persists `parsed.contentHash` onto the parent and child rows at `chunking-orchestrator.ts:221-233` and `chunking-orchestrator.ts:326-337`. This means duplicate behavior now depends on save surface and file size: `handleMemorySave(skipPreflight=true)`, `indexMemoryFile()`, and internal atomic-save flows can all reach the chunking path without any cross-path hash dedup.

**Fix** Run the same scope-aware `checkContentHashDedup()` before the chunking branch, or add an equivalent cross-path hash lookup inside `indexChunkedMemoryFile()` that mirrors the single-record path's same-path exclusion and healthy-status rules.

### [P2] PE reinforcement can backfill `content_text` without updating `content_hash`
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts`

**Issue** The reinforcement path mutates stored content by backfilling `content_text` when it is null, but it never refreshes the row's `content_hash`. On legacy or partially populated rows, that can leave the persisted text and persisted hash out of sync, weakening future exact-dedup checks and any downstream tooling that treats `content_hash` as the canonical fingerprint of the stored content.

**Evidence** `pe-gating.ts:114-149` reads only `id`, scheduling fields, and `title`, then runs `UPDATE memory_index SET ... content_text = COALESCE(content_text, ?), ... WHERE id = ?`. No `content_hash` field is selected or updated anywhere in that path, even though the incoming `parsed` object already includes `contentHash` at `pe-gating.ts:22-34`. If the existing row has `content_text IS NULL`, reinforcement will write new text while preserving whatever hash value was already present, including `NULL` or a stale legacy value.

**Fix** Keep reinforcement metadata-only, or update `content_hash` in the same statement whenever `content_text` is backfilled. If the intent is to preserve immutable content, remove the `COALESCE(content_text, ?)` write entirely and leave content hydration to a dedicated repair/backfill path that recomputes hashes atomically.

### [P2] Hash matches are trusted blindly, with no secondary verification against stored content
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts`

**Issue** Both exact-dedup helpers treat a matching `content_hash` as conclusive and never verify that the stored content actually matches the incoming content. A real SHA-256 collision is unlikely, but the same blind trust also means a corrupted backfill, manual DB edit, or stale hash can silently alias unrelated memories and force the wrong duplicate decision.

**Evidence** `dedup.ts:231-249` selects `id`, `file_path`, and `title` by `content_hash` and returns `status: 'duplicate'` immediately; it never loads `content_text` or recomputes the stored hash. `preflight.ts:399-413` does the same for the preflight path. The codebase clearly expects `content_hash` integrity to matter because it is indexed and used as a first-class dedup key, but these paths have no fallback verification when the stored hash is wrong.

**Fix** On hash match, load `content_text` when available and confirm it matches `parsed.content` before returning `duplicate`. If stored text is unavailable, treat the row as suspicious: log an integrity warning, optionally recompute from the source-of-truth content column when possible, and avoid hard-blocking on the hash alone.

## Summary

The biggest correctness gap is the split between preflight and runtime dedup semantics: preflight can block valid same-path saves that the runtime pipeline was explicitly designed to classify more precisely. The next major gap is that chunked saves skip runtime content-hash dedup entirely once they leave the small-file path, so duplicate behavior now depends on whether the file is chunked and whether preflight was bypassed. I also found two lower-severity integrity issues: PE reinforcement can mutate stored content without refreshing the hash, and hash matches are trusted without a secondary content check.

I did not find a partial-content hashing bug in the primary save path. `memory-parser.ts:186-223` hashes the full parsed content, `memory-save.ts:196-203` recomputes the hash after quality-loop mutations, and the single-record save path does re-run content-hash dedup inside `BEGIN IMMEDIATE` at `memory-save.ts:507-517`, so the basic non-chunked TOCTOU defense looks sound.
