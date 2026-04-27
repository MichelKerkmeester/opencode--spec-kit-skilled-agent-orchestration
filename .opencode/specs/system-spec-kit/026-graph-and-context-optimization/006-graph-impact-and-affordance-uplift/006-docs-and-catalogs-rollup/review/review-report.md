---
title: "Deep Review — 006-docs-and-catalogs-rollup"
description: "7-iteration scoped review with P0/P1/P2 findings."
generated_by: cli-codex gpt-5.5 high fast
generated_at: 2026-04-25T13:19:38Z
iteration_count: 7
---

# Deep Review — 006-docs-and-catalogs-rollup

## Findings by Iteration

### Iteration 1 — Correctness

- P1 — `detect_changes` is documented as reachable, but it is not dispatched as an MCP tool. The docs say external clients can reach the handler through the shared MCP router while tool-schema registration is deferred (`.opencode/skill/system-spec-kit/mcp_server/README.md:1173`), and the install guide asks operators to "Call detect_changes" as a smoke test (`.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:486`). The actual MCP server lists tools from `TOOL_DEFINITIONS` (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:911`) and dispatches only names present in dispatcher `TOOL_NAMES` (`.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:102`); the Code Graph dispatcher does not include `detect_changes` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:19`). Fix: either register and dispatch `detect_changes`, or rewrite all docs/smoke tests to say it is an internal handler only.

- P1 — Verification is marked complete even though required checks are explicitly operator-pending. The spec requires DQI scoring and strict validation (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/spec.md:100`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/spec.md:105`), but the checklist marks those as checked while saying script-backed scoring and strict validation are operator-pending (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/checklist.md:12`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/checklist.md:30`). Fix: leave these unchecked until the commands actually run, or record a separate "estimated/pre-flight" item that is not treated as sign-off.

- P1 — One smoke-test command is not runnable from the directory the guide tells the operator to use. The guide changes into `.opencode/skill/system-spec-kit/mcp_server` (`.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:515`) and then invokes `python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python/test_skill_advisor.py` (`.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:521`), which resolves to a nested non-existent path from that cwd. Fix: after `cd .../mcp_server`, run `python3 skill_advisor/tests/python/test_skill_advisor.py`, or remove the `cd` and keep the root-relative path.

### Iteration 2 — Security & Privacy

No P0/P1 findings. The reviewed docs preserve the required privacy boundaries: affordance evidence is allowlisted and strips URLs, emails, token-shaped fragments, control characters, and instruction-shaped strings (`README.md:662`); recommendation payloads use stable `affordance:<skillId>:<index>` labels instead of raw matched phrases (`.opencode/skill/system-spec-kit/README.md:133`); Memory trust badges are documented as display-only with no new schema, relation types, or storage of code/process/tool facts (`README.md:420`).

### Iteration 3 — Integration

- P1 — Public-facing tool counts conflict across umbrella docs, so consumers cannot tell what the current MCP contract is. The root README advertises 59 MCP tools near the top (`README.md:7`, `README.md:56`), its FAQ says 56 total / 47 `spec_kit_memory` tools (`README.md:1261`), and its footer says 60 total / 51 `spec_kit_memory` tools (`README.md:1301`). The system-spec-kit README likewise has both 47 MCP tools and a 51-tool MCP server on the same page (`.opencode/skill/system-spec-kit/README.md:62`, `.opencode/skill/system-spec-kit/README.md:92`). Fix: choose a canonical count source, clarify whether deferred handlers are counted, and update all rollup surfaces together.

- P1 — The `detect_changes` integration contract drifts between docs and runtime. The handler is exported from the Code Graph handler index (`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:11`), but the server exposes only `TOOL_DEFINITIONS` to MCP clients (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:911`) and the Code Graph dispatcher handles only seven tool names, excluding `detect_changes` (`.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:19`). This makes the documented "shared MCP router" path in the feature catalog inaccurate (`.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:57`). Fix: align handler export, schema listing, and dispatcher routing before claiming external reachability.

### Iteration 4 — Performance

No findings. This sub-phase is documentation-only, and the reviewed rollup text does not introduce runtime hot paths, N+1 reads, cache behavior changes, or memory-growth mechanics.

### Iteration 5 — Maintainability

- P2 — Phase naming is inconsistent enough to make future navigation error-prone. The user-facing scope is under `010-graph-impact-and-affordance-uplift`, and the merged map lists that active wrapper at `010-graph-impact-and-affordance-uplift/` (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/merged-phase-map.md:191`). The sub-phase spec/checklist/summary still present the packet as `012/006` (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/spec.md:3`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/checklist.md:2`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/implementation-summary.md:2`). Fix: add an explicit alias note such as "phase 012 was renumbered to wrapper 010" or normalize the labels.

- P2 — Root README still links to a missing simple-terms catalog. The related-docs section points at `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md` (`README.md:1288`), but that file is absent in the worktree. This violates the spec's valid-reference requirement (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/spec.md:90`). Fix: restore the file, correct the path, or remove the link.

### Iteration 6 — Observability

- P1 — The rollup claims PASS for checks whose evidence says they were not executed, which obscures release attribution. Implementation summary marks sk-doc DQI as PASS by estimated structural pre-flight while stating script-backed scoring is operator-pending (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/implementation-summary.md:125`), and it marks `validate.sh --strict` operator-pending while also calling the status complete (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/implementation-summary.md:39`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/implementation-summary.md:126`). Fix: separate "not run", "estimated", and "passed" states so downstream reviewers can attribute failures to missing validation instead of code/docs behavior.

### Iteration 7 — Evolution

- P2 — The deferred `detect_changes` contract is not queued cleanly for a follow-up packet. Multiple docs say tool-schema registration is deferred (`README.md:540`, `.opencode/skill/system-spec-kit/mcp_server/README.md:1173`), but the install guide already treats `detect_changes` as an executable smoke-test capability (`.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:486`). Fix: add a follow-up task/ADR entry for the schema+dispatcher work and move executable smoke-test wording behind that follow-up.

## Severity Roll-Up

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 6 |
| P2 | 3 |

## Top 3 Recommendations

1. Align `detect_changes` across handler export, MCP schema/dispatcher, and docs; it is currently described as externally callable without a callable MCP tool path.
2. Reopen verification sign-off: run or uncheck DQI scoring, strict validation, and smoke tests, and record actual command outputs instead of estimated PASS states.
3. Normalize public contract metadata: MCP tool counts, phase `010`/`012` naming, and broken related-doc links should have one canonical source.

## Convergence

- Iterations completed: 7/7
- New-info ratio per iteration: [it1: 0.43, it2: 0.00, it3: 0.29, it4: 0.00, it5: 0.20, it6: 0.10, it7: 0.08]
- Final state: ALL_FINDINGS_DOCUMENTED
