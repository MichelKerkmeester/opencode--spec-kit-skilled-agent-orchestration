# Agent 1 README Alignment Summary

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. README UPDATES](#2--readme-updates)
- [3. VERIFICATION](#3--verification)

## 1. OVERVIEW

Audited and updated the in-scope code-level README files under `.opencode/skill/system-spec-kit/mcp_server/` against the live directory tree, current exports, and recent refinement changes.

## 2. README UPDATES

- `mcp_server/README.md`
  - Refreshed the structure tree to match the current top-level modules and support files.
  - Replaced stale configuration tables with a smaller, accurate set of representative environment variables that matches the current reference docs.
  - Removed stale `DB_PATH` / `SESSION_CACHE_TTL` style guidance and updated troubleshooting language to `MEMORY_DB_PATH`.

- `handlers/README.md`
  - Rewrote the handler inventory to match the current public handler surface and internal helper modules.
  - Added current responsibilities for `shared-memory.ts`, `quality-loop.ts`, `pe-gating.ts`, and post-mutation cache invalidation.

- `lib/README.md`
  - Updated the recursive TypeScript module count from 167 to 169.
  - Refreshed the verification date to `2026-03-28`.

- `lib/search/README.md`
  - Corrected co-activation ownership to the cognitive module / Stage 2 fusion path.
  - Corrected interference scoring ownership to `lib/scoring/interference-scoring.ts`.
  - Added current notes for `buildBm25DocumentText()`, lexical normalization, and degree-cache invalidation.

- `lib/storage/README.md`
  - Rewrote the document to reflect the 14 current storage modules.
  - Added `document-helpers.ts` and `post-insert-metadata.ts`.
  - Updated schema notes to the live `SCHEMA_VERSION = 23`.
  - Documented content-hash-aware incremental indexing, lineage ownership, and audit-ledger responsibilities.

- `lib/eval/README.md`
  - Rewrote the module map to include `eval-logger.ts` and `eval-quality-proxy.ts`.
  - Clarified that eval logging is fail-safe, ablation remains gated, and shadow scoring is now effectively read-only analysis support.

- `lib/parsing/README.md`
  - Rewrote the parsing README around the current three-module surface.
  - Removed the stale `extractSpecLevel()` parsing export reference.
  - Clarified that spec-level detection now lives in discovery/indexing helpers.

- `lib/response/README.md`
  - Rewrote the response README to include both `envelope.ts` and `profile-formatters.ts`.
  - Documented token-count synchronization from full envelope serialization and the current MCP/profile helper exports.

- `tools/README.md`
  - Rewrote the dispatch-layer README around the current dispatcher files.
  - Added current `memory_quick_search` delegation behavior and schema-validation notes.

- `core/README.md`
  - Rewrote the core README to cover `resolveDatabasePaths()`, lazy cognitive config loading, and DB rebind listener behavior.

- `tests/README.md`
  - Rewrote the stale 688-line README into a current inventory map.
  - Updated the test-file count from 321 to 329.
  - Removed stale/nonexistent file references from the representative catalog.
  - Added current high-signal suites including `content-hash-dedup`, `interference`, `batch-processor`, shared-memory, and API/doc parity coverage.

- `shared-spaces/README.md`
  - Rewrote the doc-only shared-memory README with proper README structure.
  - Replaced outdated slash-command guidance with the actual MCP tool surface (`shared_memory_enable`, `shared_memory_status`, `shared_space_upsert`, `shared_space_membership_set`).
  - Added the current auth model note from `handlers/shared-memory.ts`.

- `api/README.md`
  - Rewrote the public API README to match the actual module exports.
  - Added the additional surfaces re-exported by `api/index.ts` (folder discovery, entity extraction, layer metadata, shared rollout metrics, roadmap capability flags).

## 3. VERIFICATION

- Markdown validation:
  - `python3 .opencode/skill/sk-doc/scripts/validate_document.py --type readme <file>`
  - Result: all 13 updated README files passed validation.

- Targeted Vitest:
  - `TMPDIR=$PWD/.tmp/vitest-tmp npx vitest run tests/feature-flag-reference-docs.vitest.ts`
  - `TMPDIR=$PWD/.tmp/vitest-tmp npx vitest run tests/api-public-surfaces.vitest.ts`
  - Result: both suites passed.
