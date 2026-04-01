# Plan: Indexing & Adaptive Fusion Enablement

## Steps

1. **Fix CocoIndex venv** — Remove stale venv, run `install.sh` to recreate with correct paths
2. **Fix CocoIndex settings** — Update `.cocoindex_code/settings.yml` to include `.opencode/` code
3. **Fix CocoIndex LMDB** — Remove stale LMDB + SQLite databases, full re-index
4. **Fix Code Graph lazy-init** — Make `getDb()` auto-call `initDb(DATABASE_DIR)` instead of throwing
5. **Enable adaptive fusion** — Add `SPECKIT_ADAPTIVE_FUSION=true` to all MCP config files (7 files across 2 repos)
6. **Fix lexical score propagation** — Add `sourceScores` fallback in formatter
7. **Rebuild dist** — Compile TypeScript changes
8. **Re-index BM25 memory** — Full memory_index_scan
9. **Verify** — Run search with `includeTrace: true` to confirm all channels active

## Status
All steps completed.
