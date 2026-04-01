# Implementation Summary: Indexing & Adaptive Fusion Enablement

## Changes Made

### CocoIndex Code (venv + settings + re-index)
- **`.opencode/skill/mcp-coco-index/mcp_server/.venv/`** — Deleted and recreated; old venv had hardcoded path to `Opencode Env/Public` which no longer exists
- **`.cocoindex_code/settings.yml`** — Replaced blanket `**/.* ` exclude with targeted exclusions; added `.opencode/specs/**` and `.opencode/changelog/**` to skip spec folders
- **`.cocoindex_code/cocoindex.db/`** — Deleted stale LMDB (MDB_READERS_FULL); fresh re-index produced 51,820 files / 663,336 chunks

### Code Graph lazy-init
- **`mcp_server/lib/code-graph/code-graph-db.ts`** — Added `import { DATABASE_DIR } from '../../core/config.js'`; changed `getDb()` from `throw new Error(...)` to `initDb(DATABASE_DIR)` for automatic initialization on first access

### Adaptive Fusion config
- **7 MCP config files** — Added `"SPECKIT_ADAPTIVE_FUSION": "true"` to env blocks:
  - Public: `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `opencode.json`
  - Barter: `.claude/mcp.json`, `.vscode/mcp.json`, `opencode.json`
- Fixed `_NOTE_7` in `.vscode/mcp.json` (both repos): was "Default OFF", now correctly "all default ON"

### Lexical score propagation
- **`mcp_server/formatters/search-results.ts:461`** — Added fallback chain: `rawResult.sourceScores?.keyword ?? rawResult.sourceScores?.fts ?? rawResult.sourceScores?.bm25` so BM25/FTS5 per-channel scores survive RRF fusion and appear in trace output

## Verification
- `memory_health()` — 2,961 memories, healthy
- `memory_index_scan(force: true)` — 1,228 memories re-indexed
- `ccc doctor` — binary verified, daemon running
- `ccc index` — 51,820 files indexed successfully
- TypeScript build emits all changes to dist (3 pre-existing errors unrelated to this work)
