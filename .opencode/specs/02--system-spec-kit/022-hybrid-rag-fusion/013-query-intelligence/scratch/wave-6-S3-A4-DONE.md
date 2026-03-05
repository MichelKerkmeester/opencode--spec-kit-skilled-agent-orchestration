# Wave 6 — Sprint 3 / T009 (PI-B3): Description-Based Spec Folder Discovery — DONE

**Task:** T009 PI-B3 — Description-Based Spec Folder Discovery
**Date:** 2026-02-27
**Status:** COMPLETE — all 43 tests passing

---

## What Was Implemented

### New Module: `lib/search/folder-discovery.ts`

A lightweight folder routing pre-filter that generates and caches 1-sentence descriptions from spec.md files per spec folder. Provides keyword-overlap scoring to route queries to the most relevant spec folder BEFORE vector queries execute.

**Interfaces:**
- `FolderDescription` — `{ specFolder, description, keywords, lastUpdated }`
- `DescriptionCache` — `{ version: 1, generated, folders }`

**Exported Functions:**
- `extractDescription(specContent)` — Extracts first meaningful sentence from spec.md via 3-pass strategy: (1) first `#` heading, (2) Problem Statement/Purpose section body, (3) first non-heading line. Strips trailing periods, truncates to 150 chars.
- `extractKeywords(description)` — Splits on word boundaries, filters ~75 stop words and sub-3-char tokens, deduplicates, lowercases.
- `findRelevantFolders(query, cache, limit=3)` — Keyword overlap scoring: counts query terms matching folder keywords/description, normalizes by query term count, returns sorted results limited to `limit`.
- `generateFolderDescriptions(specsBasePaths)` — Synchronous recursive scan (2 levels deep) for spec.md files, builds full DescriptionCache.
- `loadDescriptionCache(cachePath)` — Reads and parses JSON; returns null on missing file or parse error.
- `saveDescriptionCache(cache, cachePath)` — Writes JSON with pretty-print; creates parent directories if missing.

**Key Design Decisions:**
- Cache version is always `1` (as specified).
- Synchronous I/O used for generation (build-time tool, not hot path).
- Stop word list is a fixed `Set<string>` of ~75 common English words (O(1) lookup).
- Keyword overlap is case-insensitive substring match against description as fallback to set lookup.
- Sentence splitting uses `'. '` (period+space) to split mid-text; trailing period stripped via `.replace(/\.$/, '')`.

### New Test File: `tests/t025-folder-discovery.vitest.ts`

43 tests across 6 describe blocks:

| Block | Tests | Coverage |
|-------|-------|----------|
| `extractDescription` | 11 | title extraction, problem statement, fallback, empty/null, truncation, bold stripping, sentence splitting |
| `extractKeywords` | 8 | significant words, stop word filtering, short word filtering, dedup, lowercase, empty/null, all-stop-words |
| `findRelevantFolders` | 10 | ranking, highest-first order, no-match empty, limit param, default limit 3, score range, edge cases, perfect score 1.0 |
| `generateFolderDescriptions` | 8 | multi-folder scan, description extraction, missing spec.md skipped, non-existent path, empty paths, version=1, ISO timestamp, keywords array |
| `loadDescriptionCache` | 4 | null for missing, null for malformed JSON, roundtrip, creates parent dirs |
| Cache version | 2 | version=1 from generate, roundtrip preserves version |

---

## Test Run Result

```
 RUN  v4.0.18

 ✓ tests/t025-folder-discovery.vitest.ts (43 tests) 12ms

 Test Files  1 passed (1)
       Tests  43 passed (43)
    Start at  18:40:10
    Duration  120ms
```

**All 43 tests pass. Zero failures.**

---

## Files Created

1. `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` — implementation module (~260 LOC)
2. `.opencode/skill/system-spec-kit/mcp_server/tests/t025-folder-discovery.vitest.ts` — test file (43 tests, ~290 LOC)

No existing files were modified.

---

## Notes

- The worktree lacks its own `node_modules` — tests were run using the base project's vitest binary at `.opencode/skill/system-spec-kit/mcp_server/node_modules/.bin/vitest` with `--config` pointing to the base `vitest.config.ts`.
- The sentence extraction trailing-period fix (`replace(/\.$/, '')`) was applied after initial test run revealed 3 failures where sentences ending with a period had it included in output.
