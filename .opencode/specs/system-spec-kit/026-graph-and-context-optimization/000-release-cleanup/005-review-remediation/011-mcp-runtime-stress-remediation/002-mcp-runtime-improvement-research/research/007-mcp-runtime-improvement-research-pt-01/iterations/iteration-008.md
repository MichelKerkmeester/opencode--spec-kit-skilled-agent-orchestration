# Iteration 008 - Q7 lopsided causal-graph edge growth

## Focus

Q7: explain the 005 REQ-010 symptom where causal-graph growth added 344 new edges in about 15 minutes, all `supersedes`, while `caused` and `supports` stayed unchanged. This pass focused only on causal-edge ingestion, relation producers, caps, and stats surfaces.

## Actions Taken

1. Re-read the 005 evidence for REQ-010 and the deferred Cluster 7 task notes.
2. Inspected canonical causal-edge storage and stats in `mcp_server/lib/storage/causal-edges.ts`.
3. Inspected manual/API ingestion via `memory_causal_link` and automatic causal-link extraction from parsed memory metadata.
4. Inspected save/reconsolidation paths that emit `supersedes` edges during prediction-error replacement decisions.
5. Queried local SQLite stores to compare current relation distribution with the historical 005 telemetry.

## Findings

### 1. The original symptom is real and specific

005 recorded two snapshots about 15 minutes apart: T1 had `total_edges=791` with `{supersedes:442, caused:236, supports:113}`, and T2 had `total_edges=1135` with `{supersedes:786, caused:236, supports:113}`. That is +344 edges, all `supersedes`, with `caused` and `supports` flat; coverage also moved down from 56.77% to 56.21% despite the added edges (`005-memory-search-runtime-bugs/spec.md:265-270`).

Current local DB state did not reproduce that exact burst. `context-index.sqlite` currently has 0 causal edges, while `context-index__voyage__voyage-4__1024.sqlite` has 2515 lifetime edges distributed as `caused=1186`, `supersedes=815`, and `supports=514`. So this iteration treats the burst as historical telemetry from 005 and explains the likely source-backed mechanism rather than claiming a live reproduction today.

### 2. The high-volume automatic producer is prediction-error supersession

The six canonical relation types exist in code (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`) (`mcp_server/lib/storage/causal-edges.ts:18-25`) and the schema allows all six (`mcp_server/lib/search/vector-index-schema.ts:607-622`, `:1275-1290`). The skew is therefore not an enum/schema omission.

The save path has a direct automatic `supersedes` producer. `resolveCreateRecordLineage()` turns prediction-error `SUPERSEDE` decisions into a `causalSupersedesMemoryId` when the selected existing memory differs from the same-path predecessor (`mcp_server/handlers/save/create-record.ts:129-140`). `recordCrossPathSupersedesEdge()` then inserts a `SUPERSEDES` edge with `createdBy: "auto"` (`mcp_server/handlers/save/create-record.ts:174-196`), and the created record calls it after lineage transition (`mcp_server/handlers/save/create-record.ts:386-396`). The older memory-save path has the same behavior in `recordCrossPathPeSupersedes()` (`mcp_server/handlers/memory-save.ts:589-612`).

Reconsolidation also creates `supersedes` edges as a first-class lifecycle action. Merge creates `new -> existing` supersedes before recording lineage (`mcp_server/lib/storage/reconsolidation.ts:355-365`), conflict handling does the same for distinct new IDs (`mcp_server/lib/storage/reconsolidation.ts:491-539`), and the helper uses `INSERT OR IGNORE` for relation `supersedes` (`mcp_server/lib/storage/reconsolidation.ts:1120-1152`).

My read: REQ-010 is most likely a save/reconsolidation lifecycle burst, not a balanced causal-backfill job that accidentally chose only one class.

### 3. Caused/supports producers are conditional and lower volume

Explicit causal metadata can produce multiple relation classes, but only when parsed documents declare links. The processor maps `caused_by -> caused`, `supersedes -> supersedes`, `derived_from -> derived_from`, `blocks -> enabled`, and `related_to -> supports` (`mcp_server/handlers/causal-links-processor.ts:67-73`). That step runs only when `parsed.hasCausalLinks` is true (`mcp_server/handlers/save/post-insert.ts:300-315`).

The spec-document-chain helper can create `caused` and `supports` edges for known docs such as spec, plan, tasks, checklist, decision-record, and research (`mcp_server/lib/storage/causal-edges.ts:816-853`). But that is bounded by document presence and helper invocation. It is not a general counterweight to a high-volume stream of prediction-error supersede decisions.

### 4. Existing caps do not prevent corpus-wide relation skew

`insertEdge()` caps automatic edge strength at 0.5 and rejects auto edges after a source node reaches `MAX_EDGES_PER_NODE` (`mcp_server/lib/storage/causal-edges.ts:234-253`). That guards per-node fanout. It does not cap a relation class across a save batch, time window, scan cycle, or corpus. Hundreds of distinct new/source nodes can still add hundreds of `supersedes` edges.

`insertEdgesBatch()` loops through edges and delegates to `insertEdge()` (`mcp_server/lib/storage/causal-edges.ts:366-414`), so it inherits the same per-node behavior. `bulkInsertEdges()` is weaker: it inserts rows directly with `INSERT OR IGNORE` after checking only basic source, target, relation, and self-loop conditions (`mcp_server/lib/storage/causal-edges.ts:416-468`). That path bypasses `createdBy === "auto"` strength and per-node cap logic entirely.

### 5. Stats expose counts, not balance health

`getGraphStats()` groups rows by relation and returns only relations present in the table (`mcp_server/lib/storage/causal-edges.ts:738-761`). `memory_causal_stats` passes that map through, computes coverage, and sets `health` from orphan presence only (`mcp_server/handlers/causal-graph.ts:688-749`). It can therefore report raw skew without identifying relation imbalance as a health condition. This overlaps with 005 REQ-005/006, but Q7 adds a stronger requirement: stats need per-window relation deltas and skew diagnostics, not only zero-filled lifetime totals.

## Questions Answered

Q7 is answered with medium-high confidence. The lopsided growth is best explained by automatic `supersedes` emission from prediction-error and reconsolidation replacement paths. `caused` and `supports` are implemented, but their producers are conditional and do not naturally grow during replacement-heavy save bursts.

Recommended remediation:

1. Add `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `windowStartedAt`, and `balanceStatus` to `memory_causal_stats`.
2. Mark `balanceStatus: "relation_skewed"` when one relation accounts for more than a configured share of new edges in a window, for example `supersedes > 80%` and `newEdges >= 50`.
3. Add per-relation auto caps at the ingestion boundary for `created_by:"auto"` edges, scoped by time window or save/reindex cycle. Manual `memory_causal_link` should remain exempt.
4. Route all automatic batch insertion through a shared guard. `bulkInsertEdges()` should not bypass relation validation, strength clamping, or auto-edge cap logic.
5. Keep schema-level constraints limited to validity and uniqueness. SQLite schema constraints can enforce allowed relation values and duplicate prevention, but they are the wrong layer for burst-rate and relation-share policy.
6. Add remediation hints that name the skew cause: "review prediction-error supersede burst" versus "run canonical caused/supports backfill", instead of the generic "add more causal links".

## Questions Remaining

Q8 remains: intent classifier improvements beyond the Cluster 2 fix, including dual-classifier dissonance, paraphrase stability across cli-opencode/cli-codex/cli-copilot, and cross-CLI consistency.

## Next Focus

Q8 intent-classifier consistency and cross-CLI paraphrase stability.
