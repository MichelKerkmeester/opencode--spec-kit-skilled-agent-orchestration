# Iteration 3: Migration and Consumer Impact

## Focus
Q5 and Q6: migration path for existing code graph databases, and consumer impact across advisor, skill graph, hooks, query, context, and blast-radius reads.

## Findings
- Explicit full scans already prune tracked files that are no longer returned by candidate discovery: when `effectiveIncremental` is false, the scan handler builds `indexedPaths` from current results and removes every tracked file not in that set. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:241` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:247`.
- `removeFile()` deletes code edges touching the file's nodes and then deletes the file row, so pruning stale skill paths is already a delete operation, not an archive operation. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:565` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:574`.
- Incremental scans only clean tracked files that no longer exist on disk; they do not remove paths that still exist but became out-of-scope under a new exclude rule. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:241` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:242`.
- Readiness detection is based on `graphDb.getTrackedFiles()`, file existence, mtime/hash drift, Git HEAD drift, and a bounded recorded candidate digest. It does not recompute the new candidate set under changed excludes before declaring existing tracked files fresh. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:301` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:322`.
- Query and context read paths allow selective inline repair but explicitly disallow inline full scans, so broad scope migration is expected to route operators to `code_graph_scan` rather than silently rebuilding. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:166`.
- The context handler already returns a blocked payload with `requiredAction: "code_graph_scan"` when a full scan is needed, giving migration messaging an existing response shape. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:184` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:196`.
- The status handler is read-only and surfaces degraded readiness before stats, so it can report the need for a full scan without mutating state. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:167`.
- Advisor and skill graph have a separate storage path: the context server points at `skill-graph.sqlite`, and skill graph storage declares a dedicated `skill-graph.sqlite` database. Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:222` and `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:4`.
- Skill graph indexing scans `.opencode/skill` metadata directly through `indexSkillMetadata(skillGraphSourceDir)` and publishes a generation event; it does not depend on structural code graph nodes. Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1471` and `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1479`.
- Advisor status also scans `.opencode/skill` for `graph-metadata.json` and checks `skill-graph.sqlite`, again separate from structural code graph indexing. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:27` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:105`.
- Graph context injection excludes code graph tools themselves, reducing recursion risk when code graph tools are called. Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:223` and `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:227`.

## Decisions Made
- Migration should require an explicit full scan after the default changes. Rationale: only the explicit full scan path currently prunes existing tracked files that still exist but are now excluded.
- Add a scope-version or scope-fingerprint metadata value to force a loud full-scan recommendation after the exclude policy changes. Rationale: existing freshness checks cannot infer that the indexable universe changed when old paths still exist and remain hash-fresh.
- Advisor and skill graph should not block this change. Rationale: their runtime inventory uses dedicated metadata scanning and a separate SQLite database.

## Open Questions Discovered
- Where should the scope-version metadata live: `code_graph_metadata.scope_version`, `code_graph_metadata.scope_fingerprint`, or folded into the existing candidate digest?
- Should query/status/context include a dedicated warning when tracked paths match `.opencode/skill` while the opt-in is off?

## What Worked
Reading the prune path and the readiness path side by side exposed the migration gap: scan can delete out-of-scope tracked paths, but freshness checks cannot detect the scope policy changed.

## What Failed
Looking only at advisor and skill graph names suggested consumer risk, but the implementation showed they are largely separate from structural code graph storage.

## Convergence Signal
narrowing

## Tokens / Confidence
0.9
