# Iteration 001 - Correctness

## Focus

Correctness pass over the packet contract, SQLite indexer, startup integration, and current repository metadata shape.

## Prior State

Fresh run. No prior findings.

## Files Reviewed

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `description.json`
- `graph-metadata.json`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/graph-metadata.json`

## Findings

| ID | Severity | Finding |
| --- | --- | --- |
| F-001 | P0 | Recursive skill graph scan ingests a non-skill graph-metadata fixture and can leave the SQLite graph empty. |

### F-001 Evidence

`discoverGraphMetadataFiles()` recursively walks every directory under the configured skill root and collects any file named `graph-metadata.json`. `parseSkillMetadata()` then requires `skill_id`, `family`, `category`, `domains`, `intent_signals`, and `edges`. The current repo contains `.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/graph-metadata.json`, which is a spec-packet metadata fixture and has no `skill_id`.

Startup calls `indexSkillMetadata()` in the background and only logs failures, so the MCP server can continue with the skill graph unindexed.

## Convergence Check

Continue. P0 finding blocks convergence and only one dimension has been covered.
