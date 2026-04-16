# Iteration 20 - security - handlers

## Dispatcher
- iteration: 20 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:01:00.921Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/validate.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts
- .opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
#### 1. `skill_graph_scan` lets callers escape the documented skill root and turn `skill_graph_status` into a persistent filesystem-hash DoS
- **Evidence:** `tool-schemas.ts:626-632` documents this tool as indexing `.opencode/skill/*/graph-metadata.json`, but `handleSkillGraphScan()` accepts arbitrary `skillsRoot`, resolves it against `process.cwd()`, and passes it straight into `indexSkillMetadata()` (`handlers/skill-graph/scan.ts:28-29`). `discoverGraphMetadataFiles()` then recursively walks every descendant directory under that root with no workspace/root allowlist (`lib/skill-graph/skill-graph-db.ts:320-345`). The indexed absolute `source_path` values are persisted (`lib/skill-graph/skill-graph-db.ts:494-550`), and every later `skill_graph_status` call synchronously `readFileSync()`s and hashes each stored path (`handlers/skill-graph/status.ts:140-156`).
- **Impact:** A caller can point `skillsRoot` at `../..`, `/`, or any large/shared tree that happens to contain `graph-metadata.json` files, expanding the tool from "scan OpenCode skills" into "crawl arbitrary filesystem subtrees." Once those rows are indexed, `skill_graph_status` repeatedly re-hashes all of them, so one bad scan can poison subsequent status calls with expensive off-scope I/O and availability loss.

```json
{
  "claim": "The scan/status handler pair exposes an off-scope filesystem traversal and persistent I/O denial-of-service path because skill_graph_scan accepts arbitrary roots while skill_graph_status re-hashes every indexed source_path on each call.",
  "evidenceRefs": [
    "mcp_server/tool-schemas.ts:626-632",
    "mcp_server/handlers/skill-graph/scan.ts:28-29",
    "mcp_server/lib/skill-graph/skill-graph-db.ts:320-345",
    "mcp_server/lib/skill-graph/skill-graph-db.ts:494-550",
    "mcp_server/handlers/skill-graph/status.ts:140-156"
  ],
  "counterevidenceSought": "I looked for an upstream path allowlist, workspace-root guard, max-depth limiter, or a status-side filter that rejects indexed paths outside .opencode/skill and found none in the reviewed dispatch, handler, schema, or DB/indexer code.",
  "alternativeExplanation": "The optional skillsRoot may have been intended for developer-only custom sandboxes, but the current implementation still overreaches the documented contract and leaves the live status endpoint vulnerable to accidental or malicious oversized scans.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if another reviewed entrypoint enforces that skillsRoot must stay under the repository's .opencode/skill subtree before handleSkillGraphScan() executes."
}
```

### P2 Findings
- `skill_graph_query` returns raw `SkillNode` objects, and those objects include `sourcePath` and `contentHash` (`lib/skill-graph/skill-graph-db.ts:27-37`, `lib/skill-graph/skill-graph-db.ts:656-667`). Because the handler serializes query results directly (`handlers/skill-graph/query.ts:55-135`), every node-returning query leaks absolute filesystem paths and file fingerprints even though the tool contract only advertises structural relationship queries (`tool-schemas.ts:638-650`).
- Test coverage for this surface is effectively schema-registration-only. The only matching test references in `tests/context-server.vitest.ts` are list-membership assertions for tool names (`tests/context-server.vitest.ts:157-260` plus hits at `:192-195` and `:301`); there are no behavioral tests for scan-root restrictions, query redaction, status staleness hashing, or validate output. These handlers can regress badly while the current suite still passes.

## Traceability Checks
- `skill_graph_scan` does **not** match its own documented scope. The schema text says it indexes `.opencode/skill/*/graph-metadata.json` (`tool-schemas.ts:626-627`), but the handler accepts any caller-provided root and the indexer recursively walks that entire subtree (`handlers/skill-graph/scan.ts:28-29`, `lib/skill-graph/skill-graph-db.ts:320-345`).
- `skill_graph_validate` advertises "dependency-cycle errors" (`tool-schemas.ts:663-665`), but `findDependencyCycleErrors()` only detects 2-node reciprocal pairs (`A -> B -> A`) and will miss longer cycles (`A -> B -> C -> A`) (`handlers/skill-graph/validate.ts:167-190`). I am not scoring that separately in this security pass, but it is a real contract gap.

## Confirmed-Clean Surfaces
- `handlers/skill-graph/query.ts` validates `queryType` via a closed switch, clamps numeric knobs, and never interpolates request fields into SQL; the underlying queries use prepared statements in `lib/skill-graph/skill-graph-queries.ts`.
- `handlers/skill-graph/validate.ts` has no direct external-input sink beyond reading the already-open SQLite graph; it does not execute shell commands, open caller-controlled paths, or build dynamic SQL.
- `handlers/skill-graph/status.ts` is not vulnerable to JSON-level path injection from `graph-metadata.json` contents: `parseSkillMetadata()` derives `sourcePath` from the discovered file location, not a JSON field (`lib/skill-graph/skill-graph-db.ts:347-429`). The risk here is scope/availability, not arbitrary path text embedded in metadata.

## Next Focus
- Iteration 21 should verify the server/core call path around these tools and decide whether path-boundary enforcement belongs in the dispatcher (`tools/skill-graph-tools.ts` / `context-server.ts`) or in the handlers themselves.
