# README Audit Report A02

**Date:** 2026-03-08
**Auditor:** Claude Opus 4.6
**Scope:** Component-level README creation for two pipeline directories

---

## Audit Results

| # | Folder | Action | File Count | Notes |
|---|--------|--------|------------|-------|
| 1 | `mcp_server/lib/ops/` | Created | 2 source files (`file-watcher.ts`, `job-queue.ts`) | New README covers file watcher (chokidar, debounce, content-hash dedup, bounded concurrency, AbortController cancellation) and job queue (SQLite-backed state machine, sequential worker, crash recovery, continue-on-error). All exports documented. |
| 2 | `mcp_server/lib/search/pipeline/` | Created | 7 source files (`index.ts`, `orchestrator.ts`, `stage1-candidate-gen.ts`, `stage2-fusion.ts`, `stage3-rerank.ts`, `stage4-filter.ts`, `types.ts`) | New README covers 4-stage retrieval pipeline architecture with stage-by-stage breakdown, ASCII flow diagram, key invariants (G2 guard, score immutability, single scoring point, shared score resolution) and complete file listing with accurate descriptions. |

---

## Compliance Notes

- Both READMEs include YAML frontmatter with `title`, `description` and `trigger_phrases`.
- Section headers follow numbered ALL CAPS format (e.g., `## 1. OVERVIEW`).
- File listing tables include per-file descriptions derived from source code analysis.
- No HVR-banned words used.
- No em dashes, no semicolons, no Oxford commas.
- Active voice and direct address throughout.
