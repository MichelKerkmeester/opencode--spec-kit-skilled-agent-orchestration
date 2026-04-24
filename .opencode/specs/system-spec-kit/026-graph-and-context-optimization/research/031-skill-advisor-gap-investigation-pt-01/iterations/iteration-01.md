# Iteration 01

### Focus

Trace the `advisor_recommend` public contract outward from the landed 014 implementation to find missed docs, playbooks, or tests that should now reflect `workspaceRoot` and `effectiveThresholds`.

### Search Strategy

- CocoIndex attempt:
  - `HOME=/tmp COCOINDEX_CODE_ROOT_PATH=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ccc search "skill advisor hook brief rendering invariants" --limit 5 --path '.opencode/**'`
  - `HOME=/tmp COCOINDEX_CODE_ROOT_PATH=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ccc search "skill advisor hook bridge docs mcp surface telemetry workspaceRoot thresholdSemantics feature catalog manual testing playbook" --limit 8 --path '.opencode/**'`
  - Result: blocked in this sandbox (`daemon.log` permission issue, then daemon startup timeout). Continued with repo-local exact search and code-graph SQLite.
- Grep patterns:
  - `rg -l "workspaceRoot|effectiveThresholds|advisor_recommend" .opencode/skill/system-spec-kit/mcp_server/skill-advisor`
  - `rg -n "workspaceRoot|effectiveThresholds|AdvisorRecommendOutputSchema" .opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- Code-graph traversals:
  - `sqlite3 .../code-graph.sqlite "select distinct file_path from code_nodes where file_path like '%advisor-recommend%' ..."`
  - `sqlite3 .../code-graph.sqlite "select e.edge_type, src.name, src.file_path, tgt.name, tgt.file_path from code_edges ..."`
  - Outcome: useful for confirming landed code anchors, but no extra cross-file dependents surfaced for this contract.

### Missed Files Found

| Path | Why It's Relevant | Category | Confidence | Why It Was Missed | Needs Update |
| --- | --- | --- | --- | --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/01-advisor-recommend.md` | The landed handler now emits `workspaceRoot` and `effectiveThresholds` at [`handlers/advisor-recommend.ts:162-220`], and the package README now documents those fields at [`README.md:75-77`], but this feature page still describes only `recommendations[]`, `cache`, `trustState`, `warnings`, and `abstainReasons` at [`feature_catalog/.../01-advisor-recommend.md:29-31`]. | docs | High | Packet 014 updated the package README and hook reference, not the adjacent feature-catalog leaf. | Y |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md` | The manual scenario still calls `advisor_recommend` without checking the new public fields; it stops at `data.recommendations[0]` at [`manual_testing_playbook/.../001-native-recommend-happy-path.md:40-47`], even though 014 made `workspaceRoot` and `effectiveThresholds` part of the public contract. | manual-playbook | High | The packet verification focused on code-level smoke checks and did not expand the recommend playbook expectations. | Y |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts` | The handler now always returns `workspaceRoot` and `effectiveThresholds` [`handlers/advisor-recommend.ts:162-220`], but the happy-path test only asserts `freshness`, `trustState`, and recommendation payload [`tests/handlers/advisor-recommend.vitest.ts:99-118`]. `rg -n "workspaceRoot|effectiveThresholds|AdvisorRecommendOutputSchema" .../advisor-recommend.vitest.ts` returned no hits. | tests | Medium | Packet 014 added a new public output contract for `advisor_recommend`, but only `advisor-validate` and plugin-bridge tests were captured in the packet map. | Maybe |

### Already-Covered

- Already in `resource-map.md`: the recommend handler, schema, package README, hook reference, plugin/helper code, and the packet-owned plugin-bridge test.
- Not flagged: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md` because it was explicitly updated and recorded in the resource map.

### Status

Three recommend-adjacent misses surfaced. The strongest pattern is doc/test drift outside the small packet-owned verification set, not a missing runtime code dependency.
