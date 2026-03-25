● Create review tracking table (sql)
  │ CREATE TABLE IF NOT EXISTS review_files (path TEXT PRIMARY KEY, status TEXT DEFA…
  └ Schema operation completed successfully.

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/{05--lifecycle,06--analysis}/*.md"
  └ 14 files found

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/98623283-4da8-4dc6-8159-3aa0a6b9da30/plan.md'
  │ <<'EOF'
  │ 1. Inventory the 14 catalog files and the relevant scripts/tool definitions.
  │ 2. Read each catalog file and extract claimed tool names plus parameters.…
  └ 4 lines...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Review ALL .md files in
  │ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/ and 06--analysis/, compare
  │ described tool names and parameters against implementations in
  │ .opencode/skill/system-spec-kit/scripts/, and flag mismatches per file with a summary."
  │ --threshold 0.8
  └ 35 lines...

I’ve got the file inventory and skill routing. Next I’m loading the repo-specific review guidance plus the catalog docs and their matching script definitions so I can compare them file by file.

● skill(sk-code--review)

● Read 01-checkpoint-creation-checkpointcreate.md
  │ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointc
  │ reate.md
  └ 149 lines read

● Read 02-checkpoint-listing-checkpointlist.md
  │ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointli
  │ st.md
  └ 144 lines read

● Read 03-checkpoint-restore-checkpointrestore.md
  │ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointre
  │ store.md
  └ 150 lines read

● Read 04-checkpoint-deletion-checkpointdelete.md
  │ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointd
  │ elete.md
  └ 144 lines read

● Read 05-async-ingestion-job-lifecycle.md
  │ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.m
  │ d
  └ 133 lines read

● Read 06-startup-pending-file-recovery.md
  │ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.m
  │ d
  └ 48 lines read

● Read 07-automatic-archival-subsystem.md
  │ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md
  └ 48 lines read

● Read 01-causal-edge-creation-memorycausallink.md
  │ .opencode/skill/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausa
  │ llink.md
  └ 149 lines read

● Read 02-causal-graph-statistics-memorycausalstats.md
  │ .opencode/skill/system-spec-kit/feature_catalog/06--analysis/02-causal-graph-statistics-memoryca
  │ usalstats.md
  └ 148 lines read

● Read 03-causal-edge-deletion-memorycausalunlink.md
  │ .opencode/skill/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausa
  │ lunlink.md
  └ 144 lines read

● Read 04-causal-chain-tracing-memorydriftwhy.md
  │ .opencode/skill/system-spec-kit/feature_catalog/06--analysis/04-causal-chain-tracing-memorydrift
  │ why.md
  └ 152 lines read

● Read 05-epistemic-baseline-capture-taskpreflight.md
  │ .opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskp
  │ reflight.md
  └ 143 lines read

● Read 06-post-task-learning-measurement-taskpostflight.md
  │ .opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-t
  │ askpostflight.md
  └ 145 lines read

● Read 07-learning-history-memorygetlearninghistory.md
  │ .opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearni
  │ nghistory.md
  └ 145 lines read

The docs are loaded. Now I’m cross-checking the claimed tool names and parameter behavior against the actual repository sources, starting with the `scripts/` tree you called out and then the runtime schema/handler files where those tool contracts are actually defined.

● skill(sk-code--opencode)

● Search (grep)
  │ "checkpoint_create|checkpoint_list|checkpoint_restore|checkpoint_delete|memory_ingest_start|memo
  │ ry_ingest_status|memory_ingest_cancel|memory_causal_link|memory_causal_stats|memory_causal_unlin
  │ k|memory_drift_why|task_preflight|task_postflight|memory_get_learning_history"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "checkpoint_create|checkpoint_list|checkpoint_restore|checkpoint_delete|memory_ingest_start|memo
  │ ry_ingest_status|memory_ingest_cancel|memory_causal_link|memory_causal_stats|memory_causal_unlin
  │ k|memory_drift_why|task_preflight|task_postflight|memory_get_learning_history"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L1:260 (257 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:260 (259 lines read)

● Read review_core.md
  │ .agents/skills/sk-code--review/references/review_core.md
  └ L1:220 (98 lines read)

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ L1:220 (162 lines read)

I’ve confirmed the `scripts/` tree has zero hits for all of these runtime tool names, so the real contract source is the MCP server. I’m pulling the exact schema and handler lines now to separate “doc is wrong” from “doc is in the wrong source area.”

● Search (grep)
  │ "checkpoint_create|checkpoint_list|checkpoint_restore|checkpoint_delete|confirmName|clearExistin
  │ g|CHECKPOINT_MANIFEST|MAX_CHECKPOINTS|gzip|branch" in {tool-schemas.ts,schemas/tool-input-schema
  │ s.ts,handlers/checkpoints.ts,lib/storage/checkpoints.ts,tests/handler-checkpoints-edge.vitest.ts
  │ ,tests/checkpoints-storage.vitest.ts,tests/integration-checkpoint-lifecycle.vitest.ts}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Search (grep)
  │ "memory_ingest_start|memory_ingest_status|memory_ingest_cancel|forecast|etaSeconds|etaConfidence
  │ |failureRisk|riskSignals|caveat|queued|parsing|embedding|indexing|complete|failed|cancelled" in
  │ {tool-schemas.ts,schemas/tool-input-schemas.ts,handlers/memory-ingest.ts,lib/ops/job-queue.ts,li
  │ b/telemetry/retrieval-telemetry.ts,tests/handler-memory-ingest-edge.vitest.ts,tests/job-queue-st
  │ ate-edge.vitest.ts} (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Search (grep)
  │ "_pending|findPendingFiles|totalRecoveries|recover|allowed memory
  │ base|constitutional|specs/|manual review|stale" in {context-server.ts,lib/storage/transaction-ma
  │ nager.ts,tests/transaction-manager-recovery.vitest.ts,tests/transaction-manager.vitest.ts}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Search (grep)
  │ "archiv|is_archived|vec_memories|BM25|classifier|pinned|constitutional|critical|unarchive|re-emb
  │ |dormant|access_count|last_accessed" in
  │ {lib/cognitive/archival-manager.ts,lib/storage/access-tracker.ts,lib/search/vector-index-queries
  │ .ts,lib/search/sqlite-fts.ts,tests/archival-manager.vitest.ts,tests/search-archival.vitest.ts}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Search (grep)
  │ "memory_causal_link|memory_causal_stats|memory_causal_unlink|memory_drift_why|MAX_EDGES_PER_NODE
  │ |MAX_AUTO_STRENGTH|weight_history|created_by|last_accessed|causedBy|enabledBy|maxDepthReached|av
  │ erage edge strength|has_orphans|orphan|strength|relations" in
  │ {tool-schemas.ts,schemas/tool-input-schemas.ts,handlers/causal-graph.ts,handlers/causal-links-pr
  │ ocessor.ts,lib/storage/causal-edges.ts,tools/causal-tools.ts,tests/handler-causal-graph.vitest.t
  │ s,tests/causal-edges-unit.vitest.ts,tests/integration-causal-graph.vitest.ts}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Search (grep)
  │ "task_preflight|task_postflight|memory_get_learning_history|session_learning|Learning
  │ Index|learningIndex|knowledgeScore|uncertaintyScore|contextScore|gapsClosed|newGapsDiscovered|on
  │ lyComplete|includeSummary|WeakSet|NaN|Number.isFinite|phase" in
  │ {tool-schemas.ts,schemas/tool-input-schemas.ts,handlers/session-learning.ts,lib/learning/correct
  │ ions.ts,tests/handler-session-learning.vitest.ts,tests/integration-learning-history.vitest.ts,te
  │ sts/learning-stats-filters.vitest.ts} (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

The first targeted search was too restrictive, so I’m narrowing it to the specific schema and handler files directly. That should give me clean line-level evidence for the per-file calls.

● Search (grep)
  │ "checkpoint_create|checkpoint_list|checkpoint_restore|checkpoint_delete"
  │ (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 4 lines found

● Search (grep)
  │ "memory_ingest_start|memory_ingest_status|memory_ingest_cancel"
  │ (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 3 lines found

● Search (grep)
  │ "memory_causal_link|memory_causal_stats|memory_causal_unlink|memory_drift_why"
  │ (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 5 lines found

● Search (grep)
  │ "task_preflight|task_postflight|memory_get_learning_history"
  │ (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 3 lines found

● Search (grep)
  │ "checkpointCreateSchema|checkpointListSchema|checkpointRestoreSchema|checkpointDeleteSchema|memo
  │ ryIngestStartSchema|memoryIngestStatusSchema|memoryIngestCancelSchema|memoryCausalLinkSchema|mem
  │ oryCausalStatsSchema|memoryCausalUnlinkSchema|memoryDriftWhySchema|taskPreflightSchema|taskPostf
  │ lightSchema|memoryGetLearningHistorySchema"
  │ (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 28 lines found

● Search (grep)
  │ "function handleCheckpoint|handleCheckpointCreate|handleCheckpointList|handleCheckpointRestore|h
  │ andleCheckpointDelete|createCheckpoint|listCheckpoints|restoreCheckpoint|deleteCheckpoint"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
  └ 21 lines found

● Search (grep)
  │ "handleMemoryIngestStart|handleMemoryIngestStatus|handleMemoryIngestCancel|forecast|etaSeconds|e
  │ taConfidence|failureRisk|riskSignals|caveat"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts)
  └ 20 lines found

● Search (grep)
  │ "handleMemoryCausalLink|handleMemoryCausalStats|handleMemoryCausalUnlink|handleMemoryDriftWhy|ma
  │ xDepthReached|causedBy|enabledBy|has_orphans|averageStrength|orphaned|weight|relations"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts)
  └ 41 lines found

● Search (grep)
  │ "handleTaskPreflight|handleTaskPostflight|handleGetLearningHistory|Learning
  │ Index|learningIndex|WeakSet|Number.isFinite|onlyComplete|includeSummary"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts)
  └ 28 lines found

I’ve got the anchor lines. Next I’m reading the exact schema chunks and the few handler branches that decide behavior, so the final statuses are based on concrete contracts rather than broad text search.

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L320:390 (71 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L460:610 (151 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L270:405 (136 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L241:520 (280 lines read)

● Read memory-ingest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
  └ L60:320 (260 lines read)

● Read causal-graph.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
  └ L240:680 (441 lines read)

● Read session-learning.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
  └ L160:660 (500 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L1:260 (260 lines read)

● Read causal-edges.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
  └ L1:360 (360 lines read)

● Read job-queue.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts
  └ L1:320 (320 lines read)

● Read archival-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts
  └ L1:320 (320 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L1:220 (220 lines read)

● Read transaction-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
  └ L1:280 (280 lines read)

I’ve got the main contracts. I’m doing one last pass on the storage-layer details that the docs mention explicitly — retention, merge semantics, recovery, and archival side effects — because those are where subtle documentation drift usually hides.

● Search (grep)
  │ "MAX_CHECKPOINTS|gzip|manifest|rebuild|includeEmbeddings|snapshotSize|listCheckpoints|restoreChe
  │ ckpoint|createCheckpoint|deleteCheckpoint|spec_folder \+ file_path \+
  │ anchor_id|duplicate|dedupe|clearExisting"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts)
  └ 62 lines found

● Search (grep)
  │ "getIngestForecast|etaSeconds|etaConfidence|failureRisk|riskSignals|caveat|terminal|complete|fai
  │ led|cancelled" (.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts)
  └ 78 lines found

● Search (grep)
  │ "findPendingFiles|recoverPendingFiles|totalRecoveries|manual review|stale|committed|allowed
  │ memory base|specs/|constitutional"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts)
  └ 21 lines found

● Search (grep)
  │ "recoverPendingFiles|totalRecoveries|pending file|transactionManager"
  │ (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 10 lines found

● Search (grep)
  │ "is_archived|vec_memories|removeDocument|re-embed|unarchive|access_count|last_accessed|protected
  │ Tiers|is_pinned|shouldArchive|backgroundJobIntervalMs|setInterval"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts)
  └ 60 lines found

● Search (grep)
  │ "weight_history|changed_by|last_accessed|touchEdgeAccess|findOrphanedEdges|getGraphStats|avgStre
  │ ngth|deleteEdgesForMemory|createSpecDocumentChain|supports"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
  └ 42 lines found

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L260:620 (361 lines read)

● Read job-queue.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts
  └ L320:620 (301 lines read)

● Read transaction-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
  └ L280:520 (191 lines read)

● Read archival-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts
  └ L320:620 (301 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L1288:1458 (171 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L1478:1762 (285 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L456:490 (35 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L520:700 (176 lines read)

● Read causal-graph.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
  └ L680:760 (66 lines read)

● Read session-learning.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
  └ L660:740 (81 lines read)

● Read causal-edges.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
  └ L560:860 (301 lines read)

I’ve found a couple of likely drift points in behavior wording, not just file paths. I’m quickly verifying the remaining one-touch claims (like automatic edge cleanup on `memory_delete`) before I finalize the file-by-file verdicts.

● Search (grep)
  │ "deleteEdgesForMemory\(|memory_causal_unlink|memory_delete|phase = 'complete'|interpretation =
  │ 'Strong learning trend|metadata" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

✗ Read memory-mutate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-mutate.ts
  └ Path does not exist

✗ Read memory-mutate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-mutate.ts
  └ Path does not exist

● Search (grep)
  │ "deleteEdgesForMemory\(" (.opencode/skill/system-spec-kit/mcp_server)
  └ 13 lines found

● Search (grep)
  │ "handleMemoryDelete|memory_delete" (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 7 files found

● Search (glob)
  │ "**/*memory*delete*.ts" in .opencode/skill/system-spec-kit/mcp_server/handlers
  └ 2 files found

● Read memory-crud-delete.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
  └ L90:140 (50 lines read)

● Read memory-crud-delete.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
  └ L190:220 (31 lines read)

I’m down to the analysis docs now. One subtle area is whether `memory_drift_why` really returns relation-weighted strengths as described, so I’m checking the traversal flattening logic before I call that one aligned.

● Search (grep)
  │ "RELATION_WEIGHTS|edgeId|strength
  │ \*|weightedStrength|flattenCausalTree|propagatedStrength|max_depth_reached"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read causal-graph.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
  └ L1:240 (240 lines read)

Good catch: the tracing docs claim weighted strengths, but the flattening code currently just forwards `child.strength`. I’m verifying whether weighting happens upstream in `getCausalChain()` or if that’s genuine drift.

● Search (grep)
  │ "RELATION_WEIGHTS|getCausalChain\(|strength \*
  │ RELATION_WEIGHTS|weighted|propagated|nextStrength|childStrength|edge.strength"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
  └ 13 lines found

● Read causal-edges.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
  └ L360:560 (201 lines read)

✗ Memory stored tool schemas
  └ System-spec-kit MCP tool contracts live in mcp_server/tool-schemas.ts and schema…

Note: none of these runtime tool names are defined under `.opencode/skill/system-spec-kit/scripts/`; the authoritative contracts are in `mcp_server/tool-schemas.ts`, `schemas/tool-input-schemas.ts`, and handlers.

```text
05--lifecycle/01-checkpoint-creation-checkpointcreate.md | ALIGNED | Gzip snapshot, scoped checkpoint, 10-checkpoint retention, git-branch metadata all match.
05--lifecycle/02-checkpoint-listing-checkpointlist.md | PARTIAL | Describes “paginated” listing, but runtime only exposes `limit` (no offset/page/cursor). P2.
05--lifecycle/03-checkpoint-restore-checkpointrestore.md | PARTIAL | Overview overstates atomicity; full rollback is guaranteed for `clearExisting=true`, while merge mode can partially restore with warnings. P1.
05--lifecycle/04-checkpoint-deletion-checkpointdelete.md | ALIGNED | `confirmName` exact-match safety gate and success/not-found behavior match.
05--lifecycle/05-async-ingestion-job-lifecycle.md | ALIGNED | Start/status/cancel tools, sequential states, forecast fields, and telemetry behavior match.
05--lifecycle/06-startup-pending-file-recovery.md | ALIGNED | `_pending` discovery, startup recovery, `totalRecoveries`, and stale-file manual-review behavior match.
05--lifecycle/07-automatic-archival-subsystem.md | ALIGNED | SQL prefilter + classifier gate, BM25/vector cleanup, protected tiers, deferred re-embed all match.

06--analysis/01-causal-edge-creation-memorycausallink.md | ALIGNED | Relations, clamped strength, upsert semantics, auto-edge limits, weight history, spec-doc chaining all match.
06--analysis/02-causal-graph-statistics-memorycausalstats.md | ALIGNED | Edge totals, relation breakdown, avg strength, coverage target, orphan detection, health status all match.
06--analysis/03-causal-edge-deletion-memorycausalunlink.md | ALIGNED | `edgeId` delete flow and automatic cleanup during `memory_delete` match.
06--analysis/04-causal-chain-tracing-memorydriftwhy.md | ALIGNED | Direction/maxDepth/relations filters, weighted strengths, grouped outputs, and `maxDepthReached` match.
06--analysis/05-epistemic-baseline-capture-taskpreflight.md | ALIGNED | 0-100 scores, optional gaps, unique `(spec_folder, task_id)`, re-record/update semantics all match.
06--analysis/06-post-task-learning-measurement-taskpostflight.md | ALIGNED | LI formula, interpretation bands, gap tracking, complete-phase update, and re-correction support match.
06--analysis/07-learning-history-memorygetlearninghistory.md | ALIGNED | `onlyComplete`, `includeSummary`, summary metrics, ordering, WeakSet schema init, and NaN guard notes match.
```

SUMMARY: total 14 | aligned 12 | misaligned 0 | partial 2 | P0 0 | P1 1 | P2 1

