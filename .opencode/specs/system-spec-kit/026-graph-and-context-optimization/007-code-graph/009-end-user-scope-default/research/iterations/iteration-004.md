# Iteration 4: Adjacent Systems and Performance Delta

## Focus
Q7 and Q8: adjacent systems needing the same treatment, and the quantified performance/storage delta.

## Findings
- The current live code graph database stores file paths, nodes, and edges in `code_files`, `code_nodes`, and `code_edges`, so path-class measurements can be derived directly from persisted rows. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:55`, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:68`, and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:86`.
- Current persisted database measurement: 1,571 of 1,619 tracked files are under `.opencode/skill` (97.0%). The same query found 34,274 of 34,850 nodes under `.opencode/skill` (98.3%) and 15,573 of 16,530 edges touching those nodes (94.2%). Evidence source is the SQLite tables defined at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:55` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:86`.
- A filesystem approximation using the scanner's source extensions and default path excludes found 2,827 candidate source files total, with 1,572 under `.opencode/skill` (55.6%). The live DB's 97.0% skill-file share means this workspace's persisted graph is heavily stale toward skill internals, strengthening the migration requirement. Evidence: scanner extensions and default excludes are defined at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:137` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:138`.
- CocoIndex is adjacent but separate: `ccc_reindex` shells out to `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` and sets `COCOINDEX_REFRESH_INDEX:false`; it does not reuse structural code graph candidate selection. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts:31` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-reindex.ts:49`.
- CocoIndex status reports the separate `.cocoindex_code` index and explicitly marks code-graph readiness as not applicable. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts:26` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/ccc-status.ts:37`.
- `detect_changes` is a read-only adjacent consumer. It probes readiness with both inline indexing and inline full scans disabled, then tells operators to run `code_graph_scan` if blocked. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:246` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:260`.
- `code_graph_verify` also blocks unless the graph is fresh and disables inline full scans, so it should inherit the new scope only after an explicit scan. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:154` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:160`.
- Startup/session context is adjacent because stale graph summaries are shown to the user and can recommend structural refreshes. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:122` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts:131`.
- Runtime plugin/cache skill locations outside `.opencode/skill` are not a major local source-file problem in this workspace: `.codex`, `.claude`, and `.gemini` together contain only 2 scanner-extension files after default excludes. Evidence: the relevant scanner extension list is `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:137`.

## Decisions Made
- Treat CocoIndex as a separate follow-up, not part of this packet. Rationale: it has its own binary, index directory, and readiness-not-applicable path.
- Update code graph read/status surfaces only enough to surface the new scope warning and required full scan. Rationale: `detect_changes`, verify, query, context, and startup already route through readiness or summary surfaces.
- Do not broaden the first default exclude beyond `.opencode/skill/**` and the existing `mcp-coco-index/mcp_server` rule. Rationale: the measured adjacent runtime directories outside `.opencode/skill` are negligible here; broader policy can wait for evidence from another workspace.

## Open Questions Discovered
- Should startup summaries show a one-line note when the existing graph is dominated by excluded skill paths and the opt-in is off?
- Should `code_graph_status` include counts for excluded tracked files before the full migration scan deletes them?

## What Worked
Direct SQLite measurement gave a much stronger performance signal than filesystem counts alone because it exposed what is actually polluting current query results.

## What Failed
Filesystem candidate counts did not match the live DB distribution closely enough to stand alone; they are useful as an approximation, not the primary performance evidence.

## Convergence Signal
near-converged

## Tokens / Confidence
0.92
