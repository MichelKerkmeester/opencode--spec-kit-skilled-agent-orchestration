● skill(sk-code--opencode)

I’m reviewing the four code paths together so the proposals stay grounded in actual behavior, not guesswork. I’ll map the CLI surface, rebuild/index lifecycle, and feedback loops first, then turn that into concrete UX/automation proposals.

✗ Read plan.md
  │ ~/.copilot/session-state/513087f1-d771-458f-a217-ee7896550f0e/plan.md
  └ Path does not exist

● Search (grep)
  │ "(?:index|rebuild|migrat|stale|cache|embedding|progress|verbose|dry-run|force|batch|feedback|wei
  │ ght|importance|validate|schema|version)"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts)
  └ 104 lines found

● Search (grep)
  │ "(?:program\.|option\(|ArgumentParser|parseArgs|commander|yargs|minimist|process\.argv|--[a-zA-Z
  │ 0-9-]+)" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 10 lines found

● Search (grep)
  │ "(?:index|rebuild|migrat|stale|cache|embedding|progress|verbose|dry-run|force|batch|feedback|wei
  │ ght|importance|validate)" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 79 lines found

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L1:260 (260 lines read)

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ L1:260 (204 lines read)

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L261:520 (260 lines read)

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L521:700 (91 lines read)

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L1:260 (259 lines read)

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L261:520 (260 lines read)

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L521:760 (127 lines read)

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

I’ve mapped the top-level CLI and scan handler; next I’m drilling into the index lifecycle details that shape operator experience: weighting, deferred embeddings, rebuild hints, and what “batch” already means in practice.

✗ Read plan.md
  │ ~/.copilot/session-state/513087f1-d771-458f-a217-ee7896550f0e/plan.md
  └ Path does not exist

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L760:900 (141 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2360:2478 (119 lines read)

● Search (grep)
  │ "processBatches\(|BATCH_SIZE|progress|processed \$\{|Processed .* pending
  │ embeddings|console\.(log|error|warn)\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "memory_index_scan|memory_save|dryRun|dry-run|verbose|force|incremental|includeSpecDocs|includeC
  │ onstitutional|asyncEmbedding" in **/*.{ts,js,json} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "npm run rebuild|rebuild|pending embeddings|processPendingEmbeddings|deferred
  │ indexing|auto-migrate|migration|schema version|index version" in **/*.{ts,js,json,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "cache|embedding cache|memo|persist|sqlite|db
  │ file|MODEL_NAME|generateDocumentEmbedding|getEmbeddingProfile" in **/*.{ts,js,json}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/513087f1-d771-458f-a217-ee7896550f0e/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 8 lines...

I’ve got enough of the surface area now to avoid generic suggestions. I’m pulling in the adjacent rebuild, embedding, and retry plumbing so each proposal can tie back to what the system already does today.

● Read plan.md
  │ ~/.copilot/session-state/513087f1-d771-458f-a217-ee7896550f0e/plan.md
  └ 5 lines read

● Search (grep)
  │ "migration|schema version|PRAGMA user_version|autoRepair|rebuild FTS|index version|db version"
  │ in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "memory_validate|wasUseful|confidence|importance tier|promot|feedback|selection
  │ telemetry|queryTerms|resultRank" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "generateDocumentEmbedding|EmbeddingCache|cache|memo|persist.*embedding|embedding.*persist|SQLit
  │ e.*embedding|embedding provider" in **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "npm run rebuild|"rebuild"|processRetryQueue|retry
  │ queue|retryManager|failed_embedding|skipped_embedding_unavailable" in **/*.{ts,js,json,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Explore Analyze indexing UX
  │ Find checkpoint patterns (shell)
  │   │ grep -n "checkpoint\|status\|resume" /Users/michelkerkmeester/MEGA/Development/Opencode\
  │   │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts | head -30
  │   └ 31 lines...
  └ Find documented issues and workarounds (shell)
      │ grep -n "TODO\|FIXME\|SHORTCOMING\|limitation\|DEBT\|hack\|workaround"
      │ /Users/michelkerkmeester/MEGA/Development/Opencode\
      │ Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts | head -20
      └ 1 line...

I found the retry/rebuild seams and a likely path for adaptive weighting. I’m spot-checking the exact files behind those seams now so the final proposals can reference what already exists instead of assuming missing infrastructure.

✗ Read reindex-embeddings.ts
  │ .opencode/skill/system-spec-kit/scripts/reindex-embeddings.ts
  └ Path does not exist

✗ Read memory-validate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-validate.ts
  └ Path does not exist

✗ Read memory-health.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-health.ts
  └ Path does not exist

● Search (glob)
  │ "**/memory-health*.ts" in .opencode/skill/system-spec-kit/mcp_server
  └ No matches found

● Search (glob)
  │ "**/*memory*validate*.ts" in .opencode/skill/system-spec-kit/mcp_server
  └ No matches found

● Search (glob)
  │ "**/providers/embeddings.ts" in .opencode/skill/system-spec-kit
  └ 1 file found

● Search (glob)
  │ "**/incremental-index.ts" in .opencode/skill/system-spec-kit/mcp_server
  └ 1 file found

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts
  └ L1:260 (48 lines read)

● Read incremental-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts
  └ L1:260 (260 lines read)

● Search (glob)
  │ "**/reindex-embeddings.ts" in .opencode/skill/system-spec-kit
  └ 2 files found

There are actually two rebuild entrypoints plus a thin shared embeddings export. I’m checking the concrete rebuild script and the validation/health handlers next, because those are where automation and operator messaging improvements usually land cleanly.

● Read reindex-embeddings.ts
  │ .opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts
  └ L1:240 (18 lines read)

● Read reindex-embeddings.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts
  └ L1:240 (133 lines read)

● Search (glob)
  │ "**/*validate*.ts" in .opencode/skill/system-spec-kit/mcp_server/handlers
  └ No matches found

● Search (grep)
  │ "autoRepair|FTS rebuild|rebuild|user_version|schema|migrate|health" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 75 lines found

● Search (glob)
  │ "**/*health*.ts" in .opencode/skill/system-spec-kit/mcp_server/handlers
  └ 1 file found

● Search (grep)
  │ "wasUseful|confidence score|validation events|promot|importance tier|selection
  │ telemetry|queryTerms|resultRank|totalResultsShown|memory_validate" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I found two useful things: `memory_health` already has repair hooks, and the rebuild command is basically a force scan wrapper. I’m now checking the feedback/learning handlers, because that determines whether adaptive importance weighting can reuse existing telemetry instead of inventing a new pipeline.

● Read session-learning.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
  └ L150:340 (191 lines read)

● Read session-learning.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
  └ L340:620 (281 lines read)

● Read memory-crud-health.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
  └ L430:560 (131 lines read)

● Search (glob)
  │ "**/*validate*.ts" in .opencode/skill/system-spec-kit/mcp_server
  └ No matches found

● Search (glob)
  │ "**/*feedback*.ts" in .opencode/skill/system-spec-kit/mcp_server/handlers
  └ No matches found

● Search (grep)
  │ "wasUseful|queryTerms|resultRank|totalResultsShown|confidence|promot|importance tier|validation
  │ feedback" (.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts)
  └ No matches found

● Search (glob)
  │ "**/*learning*.ts" in .opencode/skill/system-spec-kit/mcp_server/handlers
  └ 1 file found

The learning hooks are about task-level epistemic tracking, not search-result feedback. That’s useful: it means adaptive weighting is currently missing in practice, even if the broader system already has a place for analytics. I’m validating that gap with one more search for result-selection feedback.

● Search (grep)
  │ "verbose|quiet|json output|progress|status|ETA|batch progress|processed/total|spinner|dry-run"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 2 lines found

● Search (grep)
  │ "batch.*specFolder|specFolders|multiple spec folders|paths:
  │ Array|memory_ingest_start|memory_index_scan\(|specFolder\?: string" in **/*.{ts,js,md,json}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "memory_validate|wasUseful|resultRank|totalResultsShown|queryId|queryTerms|validation
  │ feedback|confidence score|promoted to critical" in **/*.{ts,js,md,json}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "importanceWeight|importance_weight|confidence_score|validation_count|tier|critical
  │ tier|promote|reinforced" in **/*.{ts,js,md,json} (.opencode/skill/system-spec-kit)
  └ 5 lines found

I’ve confirmed the CLI itself has almost no operator controls beyond input mode selection. I’m doing one final pass through the save/ingest/tool-schema layer to pin down what already exists (`asyncEmbedding`, repair, batching primitives) and what’s still missing at the human-facing boundary.

● Read memory-ingest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
  └ L1:260 (260 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:260 (260 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1080:1180 (101 lines read)

● Search (grep)
  │ "asyncEmbedding|dryRun|skipPreflight|force\?|hints:|recovery:|Retry memory_save|memory_save\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 35 lines found

● Search (grep)
  │ "memory_index_scan|memory_save|memory_health|asyncEmbedding|dryRun|force|incremental|includeSpec
  │ Docs|includeConstitutional"
  │ (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 15 lines found

● Search (grep)
  │ "memory_ingest_start|paths: Array|jobId|batch|specFolder\?: string"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts)
  └ 28 lines found

I now have a clear distinction between what exists at the MCP layer versus the CLI layer: the server already supports `dryRun`, `asyncEmbedding`, ingest jobs, and repair hooks, but the human-facing CLI barely exposes any of that. I’m doing one last targeted search for the actual validation-feedback handler and embedding-cache implementation.

● Search (grep)
  │ "createMCPSuccessResponse\(|createMCPErrorResponse\(|recovery:|hint:|actions:"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts)
  └ 6 lines found

● Search (grep)
  │ "function handleMemoryValidate|handleMemoryValidate|memoryValidate|validation_count|confidence_s
  │ core|wasUseful" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "queue_size|processRetryQueue\(|retryStats|pending embeddings|retry queue" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 43 lines found

● Search (grep)
  │ "getEmbeddingCacheStats|clearEmbeddingCache|cache stats|cache hit|cache miss|persist.*cache|disk
  │ cache|sqlite cache" in **/*.{ts,js,md} (.opencode/skill/system-spec-kit)
  └ 66 lines found

One important correction: the system already has a persistent embedding cache for save/index paths, so the right opportunity is not “add disk persistence” but “extend and surface it better.” I’m reading that implementation directly now, plus the validation-feedback handler if present, so I can phrase that proposal accurately.

● Read embedding-pipeline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
  └ L120:240 (84 lines read)

● Read embedding-cache.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
  └ L1:260 (226 lines read)

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L200:300 (100 lines read)

● Search (grep)
  │ "queryTerms|resultRank|totalResultsShown|wasUseful|validation_count|confidence_score|promote|cri
  │ tical tier" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 32 lines found

● Search (grep)
  │ "memory_validate" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 13 lines found

That gap is narrower than it first looked: `memory_validate` does exist, and it already records usefulness, rank, and query-term feedback. I’m reading that exact handler now, because the likely proposal is to connect this existing feedback loop to `importanceWeight` recalibration rather than building a new one from scratch.

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L320:470 (150 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L470:520 (23 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L930:980 (51 lines read)

● Search (grep)
  │ "recordValidation|maybePromoteMemory|recordSelection|confidenceTracker|validation_count|confiden
  │ ce" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I spotted an important split-brain detail for caching: the MCP save path uses a SQLite-backed embedding cache, but the script-side workflow/indexer may still be going through the shared in-memory cache. I’m confirming that before I finalize the cache recommendation.

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/embeddings.ts
  └ L1:220 (9 lines read)

● Search (grep)
  │ "from '../lib/embeddings'|generateDocumentEmbedding|MODEL_NAME|EMBEDDING_DIM"
  │ (.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts)
  └ 4 lines found

● Search (grep)
  │ "embeddingCache|Map<|getCachedEmbedding|cacheEmbedding|getEmbeddingCacheStats|clearEmbeddingCach
  │ e|provider" (.opencode/skill/system-spec-kit/scripts/lib/embeddings.ts)
  └ No matches found

I’ve got the core findings. I’m doing one tiny final read on the `memory_index_scan` schema block so I can cleanly distinguish “already supported in the API” from “missing in the CLI experience” in the final write-up.

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L51:74 (23 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L316:334 (19 lines read)

● Read memory-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
  └ L590:612 (23 lines read)

Below are the highest-leverage improvements I’d propose.

**UX-001**

**Priority:** HIGH

**Current behavior:** `generate-context.ts` overloads one positional `<input>` as either a JSON file or a spec folder, then adds two more structured-input modes (`--stdin`, `--json`) plus an optional second positional spec-folder override. The help text also has several precedence rules buried in prose, and `--session-id` is manually stripped before normal parsing (`scripts/memory/generate-context.ts:51-157, 356-440`).

**Proposed improvement:** Replace the overloaded interface with explicit subcommands, e.g. `generate-context save --spec-folder ...`, `generate-context save-json --file ...`, `generate-context save-stdin --spec-folder ...`. Expose hidden env behavior as flags, especially `--capture-source`, and make target precedence obvious in command shape instead of help prose.

**Implementation complexity:** MODERATE

**Expected impact:** Much lower operator confusion, fewer wrong-target saves, and simpler documentation/onboarding.


**UX-002**

**Priority:** HIGH

**Current behavior:** The human-facing CLI exposes very few operator controls. `generate-context` only offers `--stdin`, `--json`, and `--session-id` (`scripts/memory/generate-context.ts:60-64`). Meanwhile the MCP layer already supports useful controls like `dryRun`, `skipPreflight`, `asyncEmbedding`, `force`, `includeSpecDocs`, `includeConstitutional`, and `incremental` (`mcp_server/schemas/tool-input-schemas.ts:162-168, 321-327`). The rebuild script itself hardcodes a force scan (`scripts/memory/reindex-embeddings.ts:44-79`).

**Proposed improvement:** Add operator-facing flags: `--dry-run`, `--json-output`, `--verbose`, `--quiet`, `--no-index`, `--async-embedding`, `--incremental`, `--include-spec-docs`, `--include-constitutional`, `--spec-folder`, `--failed-only`, and `--rebuild-stale-only`.

**Implementation complexity:** MODERATE

**Expected impact:** Turns hidden/internal controls into usable workflows and reduces the need for env vars or code knowledge.


**AUTO-001**

**Priority:** HIGH

**Current behavior:** The system already detects some stale index states. Incremental indexing reindexes when `file_mtime_ms` is missing or when `embedding_status` is `pending`/`failed` (`mcp_server/lib/storage/incremental-index.ts:159-166`). There is also a background retry job for pending embeddings every 5 minutes (`mcp_server/context-server.ts:951-966`). But the operator-facing recovery story is still “run rebuild” when things drift (`scripts/core/workflow.ts:2433-2443`).

**Proposed improvement:** Add a startup and pre-scan “index doctor” pass that automatically classifies stale conditions and picks the lightest repair: retry pending embeddings, incremental reindex legacy rows, rebuild FTS only when counts mismatch, and reserve full force rebuild for last resort.

**Implementation complexity:** MODERATE

**Expected impact:** Fewer manual rebuilds, faster recovery, and less operator guesswork.


**AUTO-002**

**Priority:** HIGH

**Current behavior:** The code contains compatibility fallbacks rather than explicit migration flow. For example, incremental indexing checks whether `canonical_file_path` exists and falls back if it does not (`mcp_server/lib/storage/incremental-index.ts:62-85, 116-128`). `memory_health` can repair FTS and clean orphans, but it is not a schema-version migration system (`mcp_server/handlers/memory-crud-health.ts:444-506, 521-553`).

**Proposed improvement:** Introduce explicit schema/version management using `PRAGMA user_version` plus idempotent migrations. On startup, auto-migrate known legacy schemas and emit a concise “migrated x→y” summary. Pair that with a `--check-only` mode for operators.

**Implementation complexity:** COMPLEX

**Expected impact:** Removes silent legacy compatibility debt and makes rebuild/migration behavior predictable across upgrades.


**SCORE-001**

**Priority:** HIGH

**Current behavior:** Importance is mostly static today. Workflow classification uses fixed tier multipliers (`scripts/core/workflow.ts:806-821`), and the indexer derives `importanceWeight` from content length, anchor count, and fixed recency constants (`scripts/core/memory-indexer.ts:117-124`). However, `memory_validate` already records positive/negative usefulness, rank, query terms, and promotion signals (`mcp_server/handlers/checkpoints.ts:323-464`).

**Proposed improvement:** Keep a stable base importance score at ingest time, but add an adaptive retrieval boost layer driven by validation confidence, repeated positive selection, negative feedback, and rank-based learning. Recalculate this boost on `memory_validate` writes or in a periodic calibration job.

**Implementation complexity:** MODERATE

**Expected impact:** Search ranking becomes self-improving instead of relying on static heuristics.


**SCALE-001**

**Priority:** MEDIUM

**Current behavior:** `generate-context` only accepts one primary input and at most one secondary target (`scripts/memory/generate-context.ts:410-440`). `memory_index_scan` only accepts a single `specFolder` filter (`mcp_server/schemas/tool-input-schemas.ts:321-327`). There is already a separate ingest job system that handles multiple file paths with `jobId`, progress, and cancellation (`mcp_server/handlers/memory-ingest.ts:36-39, 128-243`).

**Proposed improvement:** Add `specFolders[]`, `--spec-folder-glob`, or `--spec-folder-file` support and route multi-folder work through the existing async job queue. Support “all changed spec folders” as a first-class mode.

**Implementation complexity:** MODERATE

**Expected impact:** Makes large maintenance sweeps and CI automation much easier.


**PERF-001**

**Priority:** HIGH

**Current behavior:** The MCP save path already uses a persistent SQLite embedding cache (`mcp_server/handlers/save/embedding-pipeline.ts:126-166`; `mcp_server/lib/cache/embedding-cache.ts:36-132`). But the script-side workflow/indexer goes through the shared embeddings layer, which still keeps an in-memory LRU cache (`scripts/core/memory-indexer.ts:54-75`; `shared/embeddings.ts:224-268`; `scripts/lib/embeddings.ts:1-8`).

**Proposed improvement:** Unify both paths behind the same persistent cache service. Also expose cache stats, eviction, and prewarm controls in CLI/MCP responses so operators can see whether restarts are cold or warm.

**Implementation complexity:** MODERATE

**Expected impact:** Faster restarts and reindex runs, especially for workflow-driven indexing outside the MCP save path.


**OBS-001**

**Priority:** MEDIUM

**Current behavior:** Long operations mostly report only start/end summaries. `generate-context` prints step labels (`scripts/core/workflow.ts:2362-2455`), and `memory_index_scan` returns a final summary with optional debug-only counts via env var (`mcp_server/handlers/memory-index.ts:551-613`). By contrast, ingest jobs already support `jobId`, progress percentage, and ETA forecast (`mcp_server/handlers/memory-ingest.ts:78-121, 231-243`).

**Proposed improvement:** Give index scan and rebuild the same job/progress model as ingest: `jobId`, processed/total, current phase, last file, failure count, ETA, and resumability. Also add machine-readable `--json-output` progress events for CI.

**Implementation complexity:** MODERATE

**Expected impact:** Much better UX during long scans and easier automation/monitoring.


**DX-001**

**Priority:** HIGH

**Current behavior:** Error quality is inconsistent. `generate-context` still falls back to generic “Unexpected Error” handling (`scripts/memory/generate-context.ts:574-586`), while `memory_index_scan` only gives generic hints like “check file format” on failure (`mcp_server/handlers/memory-index.ts:553-586`). `memory_save`, on the other hand, already includes stronger remediation hints (`mcp_server/handlers/memory-save.ts:1123-1164`), and `memory_health` uses structured repair guidance (`mcp_server/handlers/memory-crud-health.ts:444-506`).

**Proposed improvement:** Standardize all indexing/CLI failures on structured errors with code, root cause, exact next command, and fix suggestions. Example: “FTS mismatch detected; run `memory_health(autoRepair:true, confirmed:true)` or `memory_index_scan(force:true)`.”

**Implementation complexity:** TRIVIAL to MODERATE

**Expected impact:** Faster self-service recovery and fewer support/debug loops.


If I had to prioritize only four: `UX-001`, `AUTO-001`, `SCORE-001`, and `PERF-001`.


Total usage est:        1 Premium request
API time spent:         6m 19s
Total session time:     6m 59s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.3m in, 16.1k out, 1.2m cached (Est. 1 Premium request)
 claude-haiku-4.5         782.5k in, 12.4k out, 713.7k cached (Est. 0 Premium requests)
