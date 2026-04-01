# Tasks: Indexing & Adaptive Fusion Enablement

- [x] Fix CocoIndex venv (stale Python path from repo move)
- [x] Update CocoIndex settings to include `.opencode/` code files
- [x] Reset LMDB + SQLite databases and full re-index (51,820 files / 663,336 chunks)
- [x] Fix Code Graph `getDb()` lazy-init via `DATABASE_DIR` import
- [x] Add `SPECKIT_ADAPTIVE_FUSION=true` to 7 MCP config files (Public + Barter)
- [x] Fix `.vscode/mcp.json` notes (was incorrectly "Default OFF")
- [x] Fix lexical score propagation through RRF fusion (`sourceScores` fallback)
- [x] Rebuild TypeScript dist
- [x] Re-index BM25 memory (1,228 memories)
- [x] Create retroactive spec folder (011-indexing-and-adaptive-fusion)
