● Read .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-
  gate.md
  └ 29 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-t
  ool.md
  └ 17 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-f
  allback.md
  └ 29 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-wor
  king-memory.md
  └ 30 lines read

● List line counts and readme existence
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit' && python - <<'PY'
  from pathlib import Path
  files = [
  'mcp_server/lib/parsing/content-normalizer.ts',...
  └ 25 lines...

● List line counts and readme existence
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit' && python3 - <<'PY'
  from pathlib import Path
  files = [
  'mcp_server/lib/parsing/content-normalizer.ts',...
  └ 40 lines...

● Pattern scan audit files
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit' && rg -n "\bcatch\b|as any|as
  unknown|!\)|\bTODO\b|throw new
  Error|Object\.defineProperty\(|non-enumerable|Math\.max\(|Math\.min\(|NaN|undefined"
  mcp_server/lib/parsing/content-normalizer.ts mcp_server/lib/search/bm25-index.ts ...
  └ 10 lines...

● Check readme mentions for each source file
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit' && python3 - <<'PY'
  from pathlib import Path
  files = [
  'mcp_server/lib/parsing/content-normalizer.ts',...
  └ 40 lines...

● Grep "trigger|update|reindex|index|remove|add|document|content"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts)
  └ 54 lines found

● Grep "searchWithFallbackTiered|checkDegradation|_degradation|minSimilarity|Tier
3|structural|fallback" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 53 lines found

● Grep "tool|extract|attention|decay|evict|0\.85|0\.05|0\.01|working_memory|session"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
  └ 5 lines found

● Grep "working memory|working_memory|checkpoint|restore|save|attention|decay|session"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts)
  └ 5 lines found

● Grep "normalize|trigger|phrase|undefined|null|NaN|length|trim"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts)
  └ 30 lines found

● Grep "search|insert|update|delete|transaction|close|error|undefined|null"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)
  └ 10 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts
  └ 265 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts
  └ 367 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts
  └ 156 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ 358 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts lines 1320-1515
  └ 196 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts lines 1080-1175
  └ 96 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts lines 1-320
  └ 320 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts lines 321-674
  └ 354 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts lines 1-320
  └ 320 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts lines 321-640
  └ 320 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts lines 641-980
  └ 340 lines read

● Grep "it\(|expect\(|TODO|skip|only|as any|@ts-ignore|catch"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts)
  └ 5 lines found

● Grep "it\(|expect\(|TODO|skip|only|as any|@ts-ignore|catch"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts)
  └ 5 lines found

● Grep "it\(|expect\(|TODO|skip|only|as any|@ts-ignore|catch"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts)
  └ 31 lines found

● Grep "it\(|expect\(|TODO|skip|only|as any|@ts-ignore|catch"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts)
  └ 5 lines found

● Grep "it\(|expect\(|TODO|skip|only|as any|@ts-ignore|catch"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts)
  └ 6 lines found

● Grep "it\(|expect\(|TODO|skip|only|as any|@ts-ignore|catch"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts)
  └ 39 lines found

● Grep "it\(|expect\(|TODO|skip|only|as any|@ts-ignore|catch"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts)
  └ 76 lines found

● Grep "it\(|expect\(|TODO|skip|only|as any|@ts-ignore|catch"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts)
  └ 28 lines found

● Grep "it\(|expect\(|TODO|skip|only|as any|@ts-ignore|catch"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts)
  └ 42 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts lines 1260-1335
  └ 76 lines read

● Grep "DEGRADATION_QUALITY_THRESHOLD|DEGRADATION_MIN_RELATIVE_GAP|DEGRADATION_MIN_RESULTS|calibrate
Tier3Scores|applyResultLimit" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 16 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts lines 1-220
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts
  └ 222 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts lines
  1-170
  └ 169 lines read

---
FEATURE: 06-bm25-trigger-phrase-re-index-gate.md  
SOURCE_FILES_AUDITED: 6  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/parsing/content-normalizer.ts: LISTED in mcp_server/lib/parsing/README.md
- mcp_server/lib/search/bm25-index.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/sqlite-fts.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/tests/bm25-index.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/content-normalizer.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/sqlite-fts.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 07-ast-level-section-retrieval-tool.md  
SOURCE_FILES_AUDITED: 0  
BUGS_FOUND: 0

README_COVERAGE:
- (no source files declared in feature file)
---

---
FEATURE: 08-quality-aware-3-tier-search-fallback.md  
SOURCE_FILES_AUDITED: 5  
BUGS_FOUND: 1

BUG: F08-B01  
FILE: mcp_server/lib/search/hybrid-search.ts:1317-1324  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Tier-3 score calibration contradicts the feature contract (“max 50% of existing top score”) by capping at 90%, allowing structural fallback results to rank too close to semantic results.  
EVIDENCE:
```ts
const topCap = topExisting * 0.9;
...
score: Math.min(row.score, calibrated),
```
SUGGESTED_FIX: Change cap/decay to enforce a hard upper bound of 50% (e.g., `topCap = topExisting * 0.5`) and adjust decay slope accordingly; add a unit test asserting `max(tier3.score) <= 0.5 * topExisting`.

README_COVERAGE:
- mcp_server/lib/search/hybrid-search.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/pipeline/stage4-filter.ts: LISTED in mcp_server/lib/search/pipeline/README.md
- mcp_server/tests/hybrid-search.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/hybrid-search-flags.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/memory-search-quality-filter.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 09-tool-result-extraction-to-working-memory.md  
SOURCE_FILES_AUDITED: 5  
BUGS_FOUND: 2

BUG: F09-B01  
FILE: mcp_server/lib/cognitive/working-memory.ts:554-563  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Session event counter lookup uses `ORDER BY last_focused DESC, id DESC` instead of max counter; with second-level timestamp granularity, concurrent updates can pick a stale row and regress counter progression, corrupting decay distance math.  
EVIDENCE:
```ts
SELECT event_counter
FROM working_memory
WHERE session_id = ?
ORDER BY last_focused DESC, id DESC
LIMIT 1
```
SUGGESTED_FIX: Read `MAX(event_counter)` (or maintain a per-session monotonic counter table) rather than relying on `last_focused` ordering.

BUG: F09-B02  
FILE: mcp_server/lib/cognitive/working-memory.ts:361-363  
SEVERITY: