● SQL: Create audit todos
  └ 4 row(s) inserted. Last inserted row ID: 4.

● Extract source files from feature docs
  $ python3 - <<'PY'
  import re, json, pathlib
  features = [
  '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit
  /feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md',...
  └ 36 lines...

● Read .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/13-entity-norm
  alization-consolidation.md
  └ 32 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/14-quality-gat
  e-timer-persistence.md
  └ 79 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-le
  xical-only-indexing.md
  └ 30 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-pre
  flight-for-memory-save.md
  └ 32 lines read

● Extract feature source files and README coverage summary
  $ python3 - <<'PY'
  import re, pathlib, json
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  feature_paths=[...
  └ 118 lines...

● Todo started: feature-13-audit

● Read .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts
  └ 79 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts
  └ 277 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/entity-scope.ts
  └ 137 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
  └ 551 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
  └ 71 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts
  └ 121 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ 468 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ 1 line read

● Grep "dryRun|duplicate|quality|token|save|would|commit"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts)
  └ 55 lines found

● Grep "qualityGateActivatedAt|isWarnOnlyMode|setActivationTimestamp|config|14|day|warn"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts)
  └ 55 lines found

● Grep
"dryRun|preflight|skipPreflight|index_memory_deferred|embedding_status|failureReason|asyncEmbedding"
 (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 36 lines found

● Grep "dryRun|memory_save" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 2 lines found

● Grep "embedding_status|failure_reason|retry_count|CHECK|default"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
  └ 27 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/entity-scope.vitest.ts
  └ 164 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts lines 260-380
  └ 121 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts lines 600-760
  └ 129 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts lines 130-290
  └ 160 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts lines 30-60
  └ 31 lines read

● Grep "embedding_status|vec_memories|JOIN" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
  └ 13 lines found

● Read all source files from feature docs for full coverage
  $ python3 - <<'PY'
  import re, pathlib
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  features=[...
  └ 30 lines...

● Check existence and read all listed source files
  $ python3 - <<'PY'
  import re, pathlib
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  features=[...
  └ 31 lines...

● Generate per-feature audited counts and README coverage lines
  $ python3 - <<'PY'
  import re, pathlib
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  features=[...
  └ 115 lines...

● Todo completed: feature-13-audit, feature-14-audit, feature-15-audit, feature-16-audit

---
FEATURE: 13-entity-normalization-consolidation.md  
SOURCE_FILES_AUDITED: 5  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/extraction/entity-denylist.ts: LISTED in mcp_server/lib/extraction/README.md
- mcp_server/lib/extraction/entity-extractor.ts: LISTED in mcp_server/lib/extraction/README.md
- mcp_server/lib/parsing/entity-scope.ts: LISTED in mcp_server/lib/parsing/README.md
- mcp_server/tests/entity-extractor.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/entity-scope.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 14-quality-gate-timer-persistence.md  
SOURCE_FILES_AUDITED: 55  
BUGS_FOUND: 1

BUG: F14-001  
FILE: mcp_server/lib/validation/save-quality-gate.ts:166-168  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Persisted activation timestamps are parsed with `parseInt`, which accepts partial numeric strings (e.g. `"1700000000000bad"`), so corrupted config values can be silently treated as valid timestamps and skew warn-only mode duration.  
EVIDENCE:
```ts
const row = db.prepare('SELECT value FROM config WHERE key = ?')
  .get(ACTIVATION_CONFIG_KEY) as { value: string } | undefined;
return row ? parseInt(row.value, 10) : null;
```  
SUGGESTED_FIX: Parse with `Number(row.value)` and validate via `Number.isFinite(...) && Number.isInteger(...) && value > 0`; otherwise return `null` and optionally log a warning.

README_COVERAGE:
- mcp_server/configs/cognitive.ts: LISTED in mcp_server/configs/README.md
- mcp_server/core/config.ts: LISTED in mcp_server/core/README.md
- mcp_server/lib/cache/embedding-cache.ts: LISTED in mcp_server/lib/cache/README.md
- mcp_server/lib/interfaces/vector-store.ts: LISTED in mcp_server/lib/interfaces/README.md
- mcp_server/lib/parsing/content-normalizer.ts: LISTED in mcp_server/lib/parsing/README.md
- mcp_server/lib/providers/embeddings.ts: LISTED in mcp_server/lib/providers/README.md
- mcp_server/lib/scoring/interference-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/search/bm25-index.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-aliases.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-mutations.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-queries.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-schema.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-store.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-types.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/utils/canonical-path.ts: LISTED in mcp_server/lib/utils/README.md
- mcp_server/lib/utils/format-helpers.ts: LISTED in mcp_server/lib/utils/README.md
- mcp_server/lib/utils/logger.ts: LISTED in mcp_server/lib/utils/README.md
- mcp_server/lib/utils/path-security.ts: LISTED in mcp_server/lib/utils/README.md
- mcp_server/lib/validation/save-quality-gate.ts: LISTED in mcp_server/lib/validation/README.md
- shared/chunking.ts: LISTED in shared/README.md
- shared/config.ts: LISTED in shared/README.md
- shared/embeddings.ts: LISTED in shared/README.md
- shared/embeddings/factory.ts: LISTED in shared/embeddings/README.md
- shared/embeddings/profile.ts: LISTED in shared/embeddings/README.md
- shared/embeddings/providers/hf-local.ts: LISTED in shared/embeddings/providers/README.md
- shared/embeddings/providers/openai.ts: LISTED in shared/embeddings/providers/README.md
- shared/embeddings/providers/voyage.ts: LISTED in shared/embeddings/providers/README.md
- shared/normalization.ts: LISTED in shared/README.md
- shared/types.ts: LISTED in shared/README.md
- shared/utils/path-security.ts: LISTED in shared/utils/README.md
- shared/utils/retry.ts: LISTED in shared/utils/README.md
- mcp_server/tests/bm25-index.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/cognitive-gaps.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/config-cognitive.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/consumption-logger.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/content-normalizer.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/embedding-cache.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/embeddings.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/eval-logger.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/interference.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/memory-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/retry-manager.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/retry.vitest.ts: LISTED in mcp_server/tests/README.md (SOURCE FILE MISSING ON DISK)
- mcp_server/tests/save-quality-gate.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/score-normalization.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/scoring.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/trigger-config-extended.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-composite-scoring-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-folder-scoring-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-normalization-roundtrip.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-normalization.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-path-security.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-tier-classifier-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-transaction-metrics-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/vector-index-impl.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 15-deferred-lexical-only-indexing.md  
SOURCE_FILES_AUDITED: 6  
BUGS_FOUND: 1

BUG: F15-001  
FILE: mcp_server/handlers/save/embedding-pipeline.ts:37-41  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Cached embedding blob is converted using `new Uint8Array(cachedBuf).buffer`, which can include unrelated bytes when `Buffer` has a non-zero `byteOffset` or shared backing store; this can produce wrong vector length/content and downstream indexing/search corruption.  
EVIDENCE:
```ts
const cachedBuf = lookupEmbedding(database, parsed.contentHash, modelId);
if (cachedBuf) {
  embedding = new Float32Array(new Uint8Array(cachedBuf).buffer);
  embeddingStatus = 'success';
}
```  
SUGGESTED_FIX: Construct with explicit offset/length, e.g. `new Float32Array(cachedBuf.buffer, cachedBuf.byteOffset, cachedBuf.byteLength / Float32Array.BYTES_PER_ELEMENT)` and validate expected dimension before marking success.

README_COVERAGE:
- mcp_server/lib/search/vector-index-mutations.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-schema.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/handlers/save/embedding-pipeline.ts: LISTED in mcp_server/handlers/save/README.md
- mcp_server/tests/vector-index-impl.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/handler-memory-save.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/retry-manager.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 16-dry-run-preflight-for-memory-save.md  
SOURCE_FILES_AUDITED: 7  
BUGS_FOUND: 1

BUG: F16-001  
FILE: mcp_server/handlers/memory-save.ts:301-324,384  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: `dryRun` behavior is implemented only inside the `!skipPreflight` block; when `dryRun: true` and `skipPreflight: true`, execution bypasses the dry-run return path and still calls `indexMemoryFile(...)`, causing real writes despite dry-run intent.  
EVIDENCE:
```ts
if (!skipPreflight) {
  // ...
  if (dryRun) {
    return createMCPSuccessResponse({ ...status: 'dry_run'... });
  }
}
// ...
const result = await indexMemoryFile(validatedPath, { force, parsedOverride: parsedForPreflight, asyncEmbedding });
```  
SUGGESTED_FIX: Add an unconditional early `if (dryRun)` path before any persistence call (independent of `skipPreflight`), or explicitly reject `dryRun && skipPreflight` as invalid input.

README_COVERAGE:
- mcp_server/handlers/memory-save.ts: LISTED in mcp_server/handlers/README.md
- mcp_server/handlers/save/types.ts: LISTED in mcp_server/handlers/save/README.md
- mcp_server/lib/validation/preflight.ts: LISTED in mcp_server/lib/validation/README.md
- mcp_server/schemas/tool-input-schemas.ts: LISTED in mcp_server/schemas/README.md
- mcp_server/tool-schemas.ts: LISTED in mcp_server/README.md
- mcp_server/tests/preflight.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/handler-memory-save.vitest.ts: LISTED in mcp_server/tests/README.md
---


Total usage est:        1 Premium request
API time spent:         3m 8s
Total session time:     3m 25s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           683.0k in, 10.9k out, 578.8k cached (Est. 1 Premium request)
