# Iteration 003 - Robustness

## Focus

Dimension: robustness.

Files read:
- Prior iteration 002 and findings registry.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- Current graph metadata layout under `.opencode/skill/**/graph-metadata.json`

Verification:
- Scoped vitest command passed: 4 files, 30 tests.
- Git history checked for the implementation lineage.
- Reproduction command against a temp DB: importing `dist/lib/skill-graph/skill-graph-db.js`, calling `initDb(/tmp/...)`, then `indexSkillMetadata(resolve('.opencode/skill'))` exits with `.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/graph-metadata.json: skill_id must be a non-empty string`.

## Findings

| ID | Sev | Finding | Evidence | Impact |
|----|-----|---------|----------|--------|
| IMPL-ROB-001 | P1 | The context-server startup reindex can fail on non-skill packet metadata under `.opencode/skill` because the DB indexer recursively treats every `graph-metadata.json` as skill metadata. The repository currently contains a spec-packet fixture named `graph-metadata.json` under `.opencode/skill/system-spec-kit/scripts/test-fixtures/...`; the indexer parses it as a skill and throws before indexing completes. | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1472`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1480`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1488`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:320`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:338`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:455`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:460`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:462` | Startup logs the failure as non-fatal, but the skill graph is not refreshed. Any existing SQLite artifact can remain stale while the system appears to continue, which undermines the auto-setup promise and freshness semantics. |
| IMPL-ROB-002 | P1 | The context-server watcher watches only one-level skill metadata, but the shipped skill-advisor graph metadata is nested. Startup scans can discover nested metadata, yet watcher updates for `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/graph-metadata.json` will not fire because the watch glob is `.opencode/skill/*/graph-metadata.json`. | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1528`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1529`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1543`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1544`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1545`, supporting nested discovery special case in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:82`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:89` | Skill-advisor metadata changes require restart/manual reindex to reach the context-server graph. That is a freshness hole in exactly the lifecycle code this packet shipped. |

## Ruled Out

- The separate daemon watcher tests cover a different watcher implementation under `skill-advisor/lib/daemon/watcher.ts`; they do not exercise the context-server watcher created by `startSkillGraphWatcher()`.
- The recursive DB indexer does handle nested skill-advisor metadata when the nested file is valid. The robustness issue is that it has no boundary filter for unrelated spec-packet metadata with the same filename.

## Churn

New findings this iteration: P0=0, P1=2, P2=0. Severity-weighted newFindingsRatio=0.48.
