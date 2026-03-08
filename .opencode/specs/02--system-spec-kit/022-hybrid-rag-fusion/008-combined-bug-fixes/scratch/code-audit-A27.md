● Todo added: Collect feature source files

● Extract source file lists from feature files
  $ python - <<'PY'
  from pathlib import Path
  features = [
  '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit
  /feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md',...
  └ 30 lines...

● Create session plan artifact
  $ cat >
  '/Users/michelkerkmeester/.copilot/session-state/6a39fd0a-ce7d-4cf6-884f-11662c69a5f9/plan.md'
   <<'EOF'
  1) Extract source files from each requested feature catalog.
  2) Read and audit each referenced source file for bugs....
  └ 4 lines...

● Extract source file lists with python3
  $ python3 - <<'PY'
  from pathlib import Path
  features = [
  '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit
  /feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md',...
  └ 43 lines...

● Read .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemo
  n-mode.md
  └ 1 line read

● Read .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/16-backend-storage-a
  dapter-abstraction.md
  └ 19 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-
  hot-rebinding.md
  └ 27 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/18-atomic-write-then
  -index-api.md
  └ 30 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-o
  rchestrator.md
  └ 31 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-arch
  itecture-metadata.md
  └ 29 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/21-atomic-pending-fi
  le-recovery.md
  └ 29 lines read

● Parse source file paths from feature markdown tables
  $ python3 - <<'PY'
  from pathlib import Path
  import re
  features = [
  '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit...
  └ 447 lines...

● Todo started: collect-sources

● List line counts for target source files
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit' && wc -l mcp_server/lib/interfaces/vector-store.ts
   mcp_server/core/db-state.ts mcp_server/core/config.ts
  mcp_server/tests/db-state-graph-reinit.vitest.ts mcp_server/lib/storage/transaction-manager.ts
   mcp_server/handlers/memory-save.ts mcp_server/tool-schemas.ts ...
  └ 30 lines...

● Grep "^(export\s+)?(async\s+)?function|^\s*(public|private)?\s*(async\s+)?[a-zA-Z0-9_]+\("
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts)
  └ 13 lines found

● Grep "^(export\s+)?(async\s+)?function|^\s*(public|private)?\s*(async\s+)?[a-zA-Z0-9_]+\("
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts)
  └ 37 lines found

● Grep "^(export\s+)?(async\s+)?function|^\s*(public|private)?\s*(async\s+)?[a-zA-Z0-9_]+\("
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts)
  └ 22 lines found

● Grep "^(export\s+)?(async\s+)?function|^\s*(public|private)?\s*(async\s+)?[a-zA-Z0-9_]+\("
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 11 lines found

● Grep "^(export\s+)?(async\s+)?function|^\s*(public|private)?\s*(async\s+)?[a-zA-Z0-9_]+\("
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 51 lines found

● Grep "catch\s*\(|as any|\bany\b|TODO|FIXME|return\s+false|throw new Error"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts)
  └ 10 lines found

● Grep "catch\s*\(|as any|\bany\b|setInterval|clearInterval|return\s+null|throw new Error"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts)
  └ 13 lines found

● Grep "catch\s*\(|as any|\bany\b|throw new Error|Date.now|mutex|await"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts)
  └ 13 lines found

● Grep "catch\s*\(|as any|\bany\b|throw new Error|JSON\.parse|slice\(|substring\("
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 5 lines found

● Grep "catch\s*\(|as any|\bany\b|setTimeout\(|setInterval\(|clearInterval|process\.exit|return;"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 44 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
  └ 362 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts
  └ 573 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts
  └ 277 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts
  └ 215 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
  └ 223 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts
  └ 49 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts
  └ 9 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts
  └ 238 lines read

● Grep "executeAtomicSave|dbCommitted|pending|transaction-manager|rename|recover"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 7 lines found

● Grep "recoverAllPendingFiles|findPendingFiles|recoverPendingFile|DB_UPDATED_FILE|checkDatabaseUpda
ted|reinitializeDatabase" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 4 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts lines 360-520
  └ 161 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/context-server.ts lines 410-530
  └ 121 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/core/config.ts
  └ 97 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts lines 1-220
  └ 219 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts lines 100-240
  └ 141 lines read

● Todo started: check-readme

● Run feature-related vitest suites
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  tests/db-state-graph-reinit.vitest.ts tests/transaction-manager.vitest.ts
  tests/transaction-manager-extended.vitest.ts tests/retry-manager.vitest.ts
  tests/index-refresh.vitest.ts tests/layer-definitions.vitest.ts ...
  └ 122 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts lines 103-116
  └ 14 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts lines 412-445
  └ 34 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts lines 291-312
  └ 22 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts lines 186-219
  └ 34 lines read

● Compute README coverage for source files by feature
  $ python3 - <<'PY'
  from pathlib import Path
  import re, json
  repo = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')...
  └ 104 lines...

● List missing README coverage entries for feature 15
  $ python3 - <<'PY'
  import json
  from pathlib import Path
  j=json.loads(Path('/tmp/readme_coverage_features.json').read_text())
  feat='15-warm-server-daemon-mode.md'...
  └ 39 lines...

● Todo started: deliver-report

● Show README coverage summary for feature 15
  $ python3 - <<'PY'
  import json
  from pathlib import Path
  j=json.loads(Path('/tmp/readme_coverage_features.json').read_text())
  feat='15-warm-server-daemon-mode.md'...
  └ 43 lines...

● Todo completed: audit-code

● Todo completed: check-readme

● Todo completed: deliver-report

---
FEATURE: 15-warm-server-daemon-mode.md  
SOURCE_FILES_AUDITED: 367  
BUGS_FOUND: 4

BUG: F15-B1  
FILE: mcp_server/core/db-state.ts:111-115  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: `lastDbCheck` is updated before `reinitializeDatabase()` succeeds; if reinit fails once, future checks may skip the same marker forever.  
EVIDENCE:
```ts
if (updateTime > lastDbCheck) {
  lastDbCheck = updateTime;
  await reinitializeDatabase();
  return true;
}
```  
SUGGESTED_FIX: Move `lastDbCheck = updateTime` after successful `await reinitializeDatabase()` (or roll it back in `catch`).

BUG: F15-B2  
FILE: mcp_server/handlers/memory-save.ts:412-418, 425-445  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: “Atomic write-then-index” path performs a no-op DB callback in `executeAtomicSave`, then runs indexing later; file and DB are not coupled atomically in one transaction.  
EVIDENCE:
```ts
executeAtomicSave(file_path, content, () => { /* no-op */ });
indexResult = await indexMemoryFile(file_path, { force, asyncEmbedding: true });
```  
SUGGESTED_FIX: Execute DB insert/indexing logic inside the `dbOperation` transaction callback (or rename API/contract to explicitly “atomic file write + best-effort async index”).

BUG: F15-B3  
FILE: mcp_server/lib/storage/transaction-manager.ts:291-312  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Pending-file recovery renames `_pending` files without verifying corresponding DB commit state, which can resurrect uncommitted/rolled-back data.  
EVIDENCE:
```ts
const originalPath = getOriginalPath(pendingPath);
fs.renameSync(pendingPath, originalPath);
```  
SUGGESTED_FIX: Add DB existence/commit verification before rename (e.g., check memory row by canonical path/hash), and only recover when DB row exists.

BUG: F15-B4  
FILE: mcp_server/handlers/memory-context.ts:191-219  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Token-budget truncation subtracts estimated tokens per removed row, but does not enforce a second pass after re-serialization if still over budget.  
EVIDENCE:
```ts
while (currentResults.length > 1 && currentTokens > budgetTokens) { ... }
const newSerializedTokens = estimateTokens(JSON.stringify(truncatedResult));
return { ... actualTokens: newSerializedTokens, truncated: true };
```  
SUGGESTED_FIX: After re-serialization, loop again while `newSerializedTokens > budgetTokens` (or hard-cap by recomputing within loop).

README_COVERAGE:
- 333 files: LISTED in their directory README.md
- mcp_server/hooks/memory-surface.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md
- mcp_server/hooks/mutation-feedback.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md
- mcp_server/hooks/response-hints.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md
- mcp_server/tests/ablation-framework.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/anchor-metadata.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/chunk-thinning.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/community-detection.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/content-normalizer.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/embedding-expansion.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/encoding-intent.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/entity-extractor.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/entity-linker.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/feedback-denylist.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/file-watcher.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/folder-discovery-integration.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/ground-truth-feedback.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/handler-memory-ingest.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/hybrid-search-context-headers.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/job-queue.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/learned-feedback.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/local-reranker.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/memory-context-eval-channels.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/memory-save-ux-regressions.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/memory-search-eval-channels.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/memory-summaries.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/mpab-aggregation.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/n3lite-consolidation.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/reconsolidation.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/reporting-dashboard.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/retrieval-directives.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/save-quality-gate.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/spec-folder-hierarchy.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/stage2-fusion.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/validation-metadata.vitest.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
---

---
FEATURE: 16-backend-storage-adapter-abstraction.md  
SOURCE_FILES_AUDITED: 1  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/interfaces/vector-store.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md
---

---
FEATURE: 17-cross-process-db-hot-rebinding.md  
SOURCE_FILES_AUDITED: 3  
BUGS_FOUND: 1

BUG: F17-B1  
FILE: mcp_server/core/db-state.ts:111-115  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Marker timestamp is persisted before successful rebind; a failed rebind can permanently suppress retries for that marker value.  
EVIDENCE:
```ts
lastDbCheck = updateTime;
await reinitializeDatabase();
```  
SUGGESTED_FIX: Update `lastDbCheck` only after reinitialization succeeds.

README_COVERAGE:
- mcp_server/core/db-state.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md
- mcp_server/core/config.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/README.md
- mcp_server/tests/db-state-graph-reinit.vitest.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
---

---
FEATURE: 18-atomic-write-then-index-api.md  
SOURCE_FILES_AUDITED: 5  
BUGS_FOUND: 2

BUG: F18-B1  
FILE: mcp_server/handlers/memory-save.ts:412-418, 425-445  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Atomic-save wrapper uses no-op DB callback, then indexes later asynchronously; this breaks atomic coupling between file write and DB index state.  
EVIDENCE:
```ts
executeAtomicSave(file_path, content, () => { /* no-op */ });
indexResult = await indexMemoryFile(file_path, { force, asyncEmbedding: true });
```  
SUGGESTED_FIX: Move DB mutation/index writes into the `executeAtomicSave` transaction callback (or explicitly de-scope “atomic write-then-index” claim).

BUG: F18-B2  
FILE: mcp_server/lib/storage/transaction-manager.ts:291-312  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Recovery renames pending files without verifying committed DB row presence, allowing stale/uncommitted files to be promoted.  
EVIDENCE:
```ts
const originalPath = getOriginalPath(pendingPath);
fs.renameSync(pendingPath, originalPath);
```  
SUGGESTED_FIX: Verify DB row exists and matches expected file/hash before rename.

README_COVERAGE:
- mcp_server/lib/storage/transaction-manager.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md
- mcp_server/handlers/memory-save.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
- mcp_server/tool-schemas.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md
- mcp_server/tests/transaction-manager.vitest.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/transaction-manager-extended.vitest.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
---

---
FEATURE: 19-embedding-retry-orchestrator.md  
SOURCE_FILES_AUDITED: 6  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/providers/retry-manager.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md
- mcp_server/lib/providers/embeddings.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md
- mcp_server/lib/cache/embedding-cache.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md
- mcp_server/lib/storage/index-refresh.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md
- mcp_server/tests/retry-manager.vitest.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/index-refresh.vitest.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
---

---
FEATURE: 20-7-layer-tool-architecture-metadata.md  
SOURCE_FILES_AUDITED: 4  
BUGS_FOUND: 1

BUG: F20-B1  
FILE: mcp_server/handlers/memory-context.ts:191-219  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Budget truncation can return still-over-budget payloads because it subtracts per-item estimates but does not re-enforce if the reserialized payload remains above threshold.  
EVIDENCE:
```ts
while (currentResults.length > 1 && currentTokens > budgetTokens) { ... }
const newSerializedTokens = estimateTokens(JSON.stringify(truncatedResult));
return { ... actualTokens: newSerializedTokens, truncated: true };
```  
SUGGESTED_FIX: Add a post-serialization enforcement loop/check; continue truncating until `newSerializedTokens <= budgetTokens` or minimum result floor reached.

README_COVERAGE:
- mcp_server/lib/architecture/layer-definitions.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md
- mcp_server/handlers/memory-context.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
- mcp_server/tests/layer-definitions.vitest.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/token-budget-enforcement.vitest.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
---

---
FEATURE: 21-atomic-pending-file-recovery.md  
SOURCE_FILES_AUDITED: 4  
BUGS_FOUND: 1

BUG: F21-B1  
FILE: mcp_server/lib/storage/transaction-manager.ts:291-312  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Recovery path promotes pending file solely by filesystem state; no DB-commit validation despite feature intent (“recover only committed writes”).  
EVIDENCE:
```ts
const originalPath = getOriginalPath(pendingPath);
fs.renameSync(pendingPath, originalPath);
```  
SUGGESTED_FIX: Before rename, require DB row existence for the target memory and verify consistency (e.g., path/hash), otherwise keep/quarantine pending artifact.

README_COVERAGE:
- mcp_server/lib/storage/transaction-manager.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md
- mcp_server/context-server.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/README.md
- mcp_server/tests/transaction-manager.vitest.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
- mcp_server/tests/transaction-manager-extended.vitest.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md
---

Validation run: `npx vitest run tests/db-state-graph-reinit.vitest.ts tests/transaction-manager.vitest.ts tests/transaction-manager-extended.vitest.ts tests/retry-manager.vitest.ts tests/index-refresh.vitest.ts tests/layer-definitions.vitest.ts tests/token-budget-enforcement.vitest.ts` (148 passed).


Total usage est:        1 Premium request
API time spent:         4m 38s
Total session time:     5m 3s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           1.2m in, 15.1k out, 1.0m cached (Est. 1 Premium request)
