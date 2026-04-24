## Iteration 03

### Focus

Manual-testing playbooks for startup priming, structural query/status, semantic-vs-structural routing, and auto-trigger behavior. Goal: determine whether the operator validation layer still tests the pre-013 contract.

### Search Strategy

- Exact playbook scans:
  - `rg -n 'tests/code-graph-indexer\.vitest\.ts|hook-session-start\.vitest\.ts' .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph -g '!**/dist/**'`
  - `rg -n 'graphQualitySummary|partialOutput|requiredAction|graphAnswersOmitted|selectedCandidate' .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph -g '!**/dist/**'`
- Cross-checked against live verification files:
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-indexer.vitest.ts`
- Read numbered snippets from:
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md`

### Missed Files Found

| Path | Why It's Relevant | Category | Confidence High/Med/Low | Why It Was Missed | Needs Update Y/N/Maybe |
|------|-------------------|----------|--------------------------|-------------------|------------------------|
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md` | The startup playbook validates tool listing, CocoIndex status, and token budget, but it does not validate the new startup payload contract or `graphQualitySummary` now asserted in `hook-session-start.vitest.ts`. | Manual testing | High | Packet 013 updated the runtime hook tests, but the operator playbook stayed on the older startup-surface checklist. | Y |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md` | This playbook still runs `tests/code-graph-indexer.vitest.ts` from the old path and only expects counts from `code_graph_status`, not the richer `graphQualitySummary` now exposed by packet 013. | Manual testing | High | The packet improved runtime contracts and focused tests, but the hand-run validation scenario did not get refreshed. | Y |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md` | The routing playbook still uses the old test path and validates only mode outputs plus truncation. It does not mention the 013-era `partialOutput` metadata or the explicit blocked-read contract when structural expansion cannot safely repair the graph inline. | Manual testing | High | Packet 013 changed real context behavior, but the routing scenario kept the older “non-empty results” framing. | Y |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/260-code-graph-auto-trigger.md` | This playbook still validates `ensureCodeGraphReady()` only as action selection (`full_scan` / `selective_reindex` / `none`) using the old indexer-suite path. It does not connect those readiness states to the user-visible blocked payloads now returned by query/context handlers. | Manual testing | Medium | Packet 013 changed the read-path consumer behavior rather than the helper itself, so the auto-trigger playbook never moved with the caller contract. | Maybe |

### Already-Covered

The focused runtime tests named in packet 013 remain already covered: `hook-session-start.vitest.ts`, `code-graph-context-handler.vitest.ts`, `code-graph-query-handler.vitest.ts`, `code-graph-scan.vitest.ts`, and `codex-session-start-hook.vitest.ts`. This iteration only flags the human-run playbooks that still point at older verification expectations or paths.

### Status

The operator validation layer is definitely behind the shipped contract. Startup, status, and routing playbooks all missed at least one of the new packet-013 surfaces.
