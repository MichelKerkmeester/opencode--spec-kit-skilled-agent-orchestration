## Packet 045/004: code-graph-readiness — Deep-review angle 4 (release-readiness)

### CRITICAL: Spec folder path

The packet folder for THIS audit is: `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness/` — write ALL packet files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, review-report.md) under that path. Do NOT ask for the spec folder; use this exact path.

READ-ONLY deep-review audit. Output: `review-report.md` with severity-classified P0/P1/P2 findings.

### Target surface

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/` (entire dir)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/{query,scan,verify,status,context,detect-changes}.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/manual_testing_playbook/`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/` (post-038 stress tests)

### Audit dimensions + readiness-specific questions

For correctness: read-path/manual contract (post-032 retraction); ensureCodeGraphReady selective self-heal; query block-with-required-action behavior; status as read-only diagnostic; verify blocks unless fresh.

For security: no path injection via crafted file refs; no arbitrary code exec via tracked-file logic.

For traceability: status output reflects actual graph state; degraded readiness is observable; required-action messages are operator-actionable.

For maintainability: handler interfaces consistent; selective vs full scan logic clearly separated.

### Specific questions

- After 032's watcher retraction, is there ANY remaining code path that claims "real-time watching" of code_graph? Run regex over docs to confirm.
- Does `ensureCodeGraphReady` handle concurrent modifications correctly? (operator edits 5 files, then runs `code_graph_query` — does selective self-heal cover all 5?)
- Does `code_graph_status` ever side-effect (mutate freshness)? It should be read-only.
- Does `code_graph_verify` correctly distinguish "fresh" vs "stale" vs "blocked"?
- Does `detect_changes` always set `allowInlineIndex: false`?
- Stress test coverage: does `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` actually exercise the degraded path?

### Read also

- 032 watcher retraction (closes README claim)
- 013 P1-1 adversarial verdict (file-watcher.ts:274 only handles spec-docs)
- 035 F5/F6 cell coverage (code_graph_query, code_graph_verify)
- 039 code_graph runtime feature_catalog + manual_testing_playbook

### Output

Same 9-section review-report.md format. Severity rubric: P0=silent stale-graph reads/required-action bypass, P1=contract drift between docs and runtime, P2=cleanup.

### Packet structure (Level 2)

Same 7-file structure. Deps include 045 phase parent.

**Trigger phrases**: `["045-004-code-graph-readiness","code graph readiness audit","read-path contract review","ensure-ready behavior"]`.

**Causal summary**: `"Deep-review angle 4: code graph readiness contract — read-path selective self-heal, manual full repair, query block-with-required-action, watcher absence honesty post-032."`.

### Constraints

READ-ONLY. Strict validator must exit 0. Cite file:line. DO NOT commit. Evergreen-doc rule.

When done, last action: strict validator passing + review-report.md complete.
